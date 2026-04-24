---
n: 8
id: aspire
title: ".NET Aspire — AppHost, ServiceDefaults, resources"
hook: "AppHost orchestrates. Each service calls AddServiceDefaults + MapDefaultEndpoints. AddSqlServer + WithReference wires resources."
tags: [aspire, orchestration, observability]
module: "Distributed Services & Orchestration"
source: "code-examples/SoccerFIFA_Aspire/SoccerFIFA/SoccerFIFA.AppHost/AppHost.cs + SoccerFIFA.ServiceDefaults/Extensions.cs + WebApiFIFA/Program.cs"
bloom_levels: [understand, apply]
related: [grpc, cache-redis]
---

## AppHost — the orchestration entry point

From SoccerFIFA `AppHost.cs`:

```cs
var builder = DistributedApplication.CreateBuilder(args);

var sqlServerDb = builder.AddSqlServer("theserver")
                         .AddDatabase("sqldata");

var api = builder.AddProject<Projects.WebApiFIFA>("backend")
    .WithReference(sqlServerDb)
    .WaitFor(sqlServerDb)
    .WithEnvironment("ParentCompany", builder.Configuration["Company"]);

builder.AddProject<Projects.BlazorFIFA>("frontend")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
```

Four calls:

| Call | Purpose |
|---|---|
| `DistributedApplication.CreateBuilder(args)` | Orchestrator builder |
| `AddProject<Projects.X>("logical-name")` | Register service — consumers reach as `http://logical-name/` |
| `.WithReference(other)` | Inject connection info as env-var |
| `.WaitFor(other)` | Delay startup until dependency healthy |

## Logical names replace hardcoded URLs

The string in `AddProject<>("backend")` is the service's **logical name**. Consumers use `http://backend/`. Aspire intercepts and resolves to the actual port at runtime.

## Resources — declare once, consume by name

### SQL Server

```cs
var sqlServerDb = builder.AddSqlServer("theserver")
                         .AddDatabase("sqldata");

builder.AddProject<Projects.WebApiFIFA>("backend")
    .WithReference(sqlServerDb)
    .WaitFor(sqlServerDb);
```

Service consumes via typed helper:

```cs
// WebApiFIFA/Program.cs
builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");
```

No connection string in `appsettings.json`. Aspire writes `ConnectionStrings__sqldata` into env. Typed helper reads it.

### Arbitrary env-vars

```cs
.WithEnvironment("ParentCompany", builder.Configuration["Company"])
```

Value read from AppHost's config, injected into service's env. Service reads via `IConfiguration["ParentCompany"]`.

## Service — ServiceDefaults boilerplate

Every service project in an Aspire solution calls exactly two methods:

```cs
var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();          // 1. at configure time

builder.Services.AddControllers();
var app = builder.Build();

app.MapDefaultEndpoints();             // 2. at map time
app.MapControllers();
app.Run();
```

## What `AddServiceDefaults` registers

From `SoccerFIFA.ServiceDefaults/Extensions.cs`:

```cs
public static TBuilder AddServiceDefaults<TBuilder>(this TBuilder builder)
    where TBuilder : IHostApplicationBuilder
{
    builder.ConfigureOpenTelemetry();
    builder.AddDefaultHealthChecks();
    builder.Services.AddServiceDiscovery();

    builder.Services.ConfigureHttpClientDefaults(http =>
    {
        http.AddStandardResilienceHandler();
        http.AddServiceDiscovery();
    });

    return builder;
}
```

Four capabilities:

| Capability | Effect |
|---|---|
| Service discovery | `http://backend/` resolves at runtime |
| OpenTelemetry | Traces, metrics, logs to dashboard |
| Health checks | `/health` readiness + `/alive` liveness |
| Resilience | Default retry + timeout on outbound `HttpClient` |

## `/health` vs `/alive`

- **`/health`** — readiness. Returns 200 only when every check passes. Decides whether to route traffic.
- **`/alive`** — liveness. Returns 200 for checks tagged `"live"` (process-is-running probe). Decides whether to restart container.

Kubernetes maps these to `readinessProbe` and `livenessProbe`.

## `MapDefaultEndpoints` — only in Development

From lab's Extensions.cs:

```cs
public static WebApplication MapDefaultEndpoints(this WebApplication app)
{
    if (app.Environment.IsDevelopment())
    {
        app.MapHealthChecks("/health");
        app.MapHealthChecks("/alive", new HealthCheckOptions
        {
            Predicate = r => r.Tags.Contains("live")
        });
    }
    return app;
}
```

Endpoints only mapped in dev — production exposure requires explicit opt-in (security implications).

> **Q:** Your API has `builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata")`. At runtime EF fails "connection string not found." AppHost has `AddSqlServer("theserver").AddDatabase("sqldata")`. What did you forget?
> **A:** `.WithReference(sqlServerDb)` on the API's `AddProject<>`. Without it, Aspire never writes `ConnectionStrings__sqldata` into env.

> **Q:** You added a new service. Dashboard shows it always red. Other services green. What's missing?
> **A:** `builder.AddServiceDefaults()` in the new service's `Program.cs`. Without it, no default health checks, no `/health` endpoint, dashboard gets 404.

> **Pitfall**
> `AddServiceDefaults()` goes in EACH service's `Program.cs`, NEVER in AppHost. Putting it in AppHost breaks boot — orchestrator tries to register OTel + health checks on itself.

> **Pitfall**
> `AppHost` cannot find sibling service projects automatically. Run `dotnet add reference` from AppHost's `.csproj` to each service project. Without that, `AddProject<Projects.X>` fails — `Projects` namespace generated from references.

> **Pitfall**
> Calling `.AddDatabase("sqldata")` on builder directly. `AddDatabase` only chains off `AddSqlServer(...)`. Not a top-level method.

> **Takeaway**
> AppHost: `AddProject<Projects.X>("name")` + `.WithReference(resource)` + `.WaitFor(resource)`. Resources: `AddSqlServer("name").AddDatabase("name")`. Service: `AddServiceDefaults()` + `MapDefaultEndpoints()` + typed consumers (`AddSqlServerDbContext<T>("name")`). `WithEnvironment(key, value)` for arbitrary env-vars. `AddServiceDefaults` lives in each service — never in AppHost.
