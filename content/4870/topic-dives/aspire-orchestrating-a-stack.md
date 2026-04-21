---
id: 4870-topic-aspire-orchestrating-a-stack
title: Aspire — orchestrating a stack
pillar: tech
priority: medium
chapter: W09
tags:
  - aspire
---

### AppHost Program.cs

```cs
var builder = DistributedApplication.CreateBuilder(args);

// Resources
var cache = builder.AddRedis("cache");
var sql   = builder.AddSqlServer("sql");
var db    = sql.AddDatabase("appdb");

// Projects
var api = builder.AddProject<Projects.Api>("api")
    .WithReference(cache)
    .WithReference(db);

builder.AddProject<Projects.Web>("web")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
```

### Each service calls:

```cs
// In every downstream project's Program.cs
builder.AddServiceDefaults();          // telemetry, health, discovery
builder.AddRedisClient("cache");        // named resource
builder.AddSqlServerDbContext<AppDb>("appdb");
```

### Service discovery URL

```cs
// HttpClient registration — logical name, not URL
builder.Services.AddHttpClient<ApiClient>(c => c.BaseAddress = new Uri("https+http://api"));
```

### Aspire Dashboard

Automatic telemetry UI launched on AppHost run. Shows logs, traces, metrics per resource.

### Exam traps

-   AppHost ≠ ServiceDefaults. AppHost orchestrates. ServiceDefaults is a library each service imports.
-   `AddProject<Projects.Foo>` — `Projects.Foo` is a generated type from the project reference
-   `https+http://api` → the scheme tells the resolver to try HTTPS first, fall back to HTTP
