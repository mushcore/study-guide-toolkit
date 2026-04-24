---
n: 15
id: aspire-orchestrated-resources
title: ".NET Aspire orchestrated resources — AddSqlServer, AddRedis, env-var injection"
hook: "Declare a database in AppHost; consume it with a typed helper in the service."
tags: [aspire, sql-server, redis, orchestration]
module: "Distributed Services & Orchestration"
source: "notes/aspire_SCRIPT.docx; research-aspire.md"
bloom_levels: [remember, understand, apply]
related: [aspire-apphost, aspire-service-defaults, cache-abstractions]
---

## Declare once in AppHost, consume by name in the service

AppHost registers a SQL Server resource:

```cs
var builder = DistributedApplication.CreateBuilder(args);

var db = builder.AddSqlServer("sql")
                .AddDatabase("cms");

builder.AddProject<Projects.Cms_Api>("api")
    .WithReference(db)
    .WaitFor(db);

builder.Build().Run();
```

The API's `Program.cs` consumes it by name:

```cs
var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddSqlServerDbContext<CmsDbContext>("cms");  // ← the database's logical name

builder.Services.AddControllers();
var app = builder.Build();
// …
app.Run();
```

Nothing else. No connection string in `appsettings.json`, no environment-variable lookup, no `ConfigureOptions`. Aspire writes `ConnectionStrings__cms` into the API's process env when it launches it; the `AddSqlServerDbContext<T>("cms")` helper reads that env-var and configures EF Core.

## The resource family

`AddSqlServer`, `AddRedis`, `AddPostgres`, `AddRabbitMQ`, `AddMongoDB`, and others follow the same pattern:

```cs
var cache = builder.AddRedis("cache");
var api   = builder.AddProject<Projects.Api>("api").WithReference(cache);
```

Inside the API, `builder.AddRedisDistributedCache("cache")` reads the connection string automatically.

`AddDatabase("name")` is chained specifically onto `AddSqlServer` / `AddPostgres` — the server resource hosts zero or more named databases. You don't need a separate `AddDatabase` for Redis; Redis is just a key-value store, no schema object to declare.

## Environment variables from AppHost to service

Beyond connection strings, you can inject arbitrary env-vars:

```cs
builder.AddProject<Projects.Api>("api")
    .WithEnvironment("ParentCompany", builder.Configuration["Company"])
    .WithEnvironment("FeatureFlags__NewCheckout", "true");
```

`WithEnvironment` takes a key and a value. The service reads them normally through `IConfiguration` or `Environment.GetEnvironmentVariable`. Scope env-vars to one project rather than leaking them to every service — a secret meant for the API should not appear in the frontend.

## Container image overrides

When you need a specific SQL Server version or image:

```cs
builder.AddSqlServer("sql")
    .WithImage("mssql/server")
    .WithImageRegistry("mcr.microsoft.com")
    .WithImageTag("2022-latest")
    .AddDatabase("cms");
```

Default images come from Microsoft Container Registry. `WithImage` / `WithImageRegistry` / `WithImageTag` override any of the three parts. Useful when your dev environment needs the same image tag as your CI or production.

> **Q:** Your API has `builder.AddSqlServerDbContext<CmsDbContext>("cms")` and AppHost has `builder.AddSqlServer("sql").AddDatabase("cms")`. But at runtime EF Core fails with "connection string not found." What broke?
> **A:** The API is missing `.WithReference(db)` in AppHost. Without it, Aspire never injects `ConnectionStrings__cms` into the API's environment, so `AddSqlServerDbContext<T>("cms")` looks for the connection string, finds nothing, and throws. `WithReference` is what bridges the resource declaration to the consuming service.

> **Example**
> Full AppHost + service pair with SQL Server and Redis:
>
> ```cs
> // AppHost
> var db    = builder.AddSqlServer("sql").AddDatabase("cms");
> var cache = builder.AddRedis("cache");
> builder.AddProject<Projects.Api>("api")
>     .WithReference(db)
>     .WithReference(cache)
>     .WaitFor(db)
>     .WaitFor(cache);
>
> // Api/Program.cs
> builder.AddServiceDefaults();
> builder.AddSqlServerDbContext<CmsDbContext>("cms");
> builder.AddRedisDistributedCache("cache");
> ```
>
> The API gets both a typed DbContext and an `IDistributedCache`, each wired from its declared resource.

> **Pitfall**
> Hardcoding `"Server=localhost;Database=cms;Trusted_Connection=true;"` in `appsettings.json` while also using Aspire to manage the database. Both are set; Aspire's env-var wins at runtime, but your unit tests read `appsettings.json`'s value, so tests hit a different database than dev runs. Either delete the `appsettings.json` connection string when Aspire is in charge, or make the test environment use the Aspire-managed port.

> **Pitfall**
> Calling `.AddDatabase("cms")` at the builder level instead of chained off `AddSqlServer(...)`. The builder has no top-level `AddDatabase` method — it exists only on the server-resource builder. The compile error is obvious; the mistake is still common because autocomplete is generous.

> **Takeaway**
> AppHost declares resources (`AddSqlServer`, `AddRedis`, `AddPostgres`) with logical names. `.WithReference(resource)` wires them to consuming services. Each service picks the injected connection string up through Aspire's typed helpers (`AddSqlServerDbContext<T>(name)`, `AddRedisDistributedCache(name)`). Use `WithEnvironment` for arbitrary non-connection config scoped to a single project.
