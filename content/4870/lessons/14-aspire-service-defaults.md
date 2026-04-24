---
n: 14
id: aspire-service-defaults
title: ".NET Aspire ServiceDefaults — health endpoints, OpenTelemetry, discovery"
hook: "One extension method per service wires up everything Aspire expects."
tags: [aspire, observability, health-checks]
module: "Distributed Services & Orchestration"
source: "notes/aspire_SCRIPT.docx; research-aspire.md"
bloom_levels: [remember, understand, apply]
related: [aspire-apphost, aspire-orchestrated-resources]
---

## Every service calls exactly two methods

Given any service project in an Aspire solution — a Web API, a Razor Pages site, a Blazor Server app — your `Program.cs` contains these two lines:

```cs
var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();           // 1. register discovery, OTel, health checks, resilience

builder.Services.AddControllers();      // your usual registrations
var app = builder.Build();

app.MapDefaultEndpoints();              // 2. expose /health and /alive
app.MapControllers();
app.Run();
```

`AddServiceDefaults()` comes from the `ServiceDefaults` class library — a sibling project every service references. `MapDefaultEndpoints()` lives in the same library. Together they install four capabilities without you writing any more code:

| Capability | What you get for free |
|---|---|
| Service discovery | `http://backend/` resolves to the actual host:port at runtime. |
| OpenTelemetry | Traces, metrics, and logs exported to the Aspire Dashboard. |
| Health checks | Readiness on `/health`; liveness on `/alive`. |
| Resilience | Default retry + timeout on outbound `HttpClient` calls. |

## What `AddServiceDefaults` actually registers

The typical `ServiceDefaults/Extensions.cs` body:

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

Four registrations. `ConfigureOpenTelemetry` sets up OTel exporters aimed at the dashboard. `AddDefaultHealthChecks` wires up the default ping + dependency probes. `AddServiceDiscovery` on `IServiceCollection` makes the `http+https://` protocol handler available. The `ConfigureHttpClientDefaults` block says every `HttpClient` created through `IHttpClientFactory` picks up standard resilience + service discovery automatically.

## `/health` vs `/alive`

Aspire distinguishes two health scenarios:

- **`/health`** — **readiness.** Returns 200 only when every registered health check passes. Use this to decide whether traffic should be routed to the service.
- **`/alive`** — **liveness.** Returns 200 for the subset of checks tagged `"live"` — typically just the process-is-running probe. Use this to decide whether the container should be restarted.

Kubernetes maps these directly to `readinessProbe` and `livenessProbe`. The Aspire Dashboard shows both.

> **Q:** You added a new Web API project to your Aspire solution. You see it in the dashboard but it's always red — failing health checks. The rest of your services are green. Where is the missing call?
> **A:** The new project probably isn't calling `builder.AddServiceDefaults()` in its `Program.cs`. Without it, there are no default health checks and no `/health` endpoint. The dashboard polls `/health`, gets 404, and flags the service red.

> **Example**
> A minimal Web API `Program.cs` Aspire-ready from the first commit:
>
> ```cs
> var builder = WebApplication.CreateBuilder(args);
>
> builder.AddServiceDefaults();                 // Aspire requirement
> builder.Services.AddControllers();
>
> var app = builder.Build();
>
> app.MapDefaultEndpoints();                    // Aspire requirement
> app.MapControllers();
> app.Run();
> ```
>
> Two lines of ceremony and the service is discoverable, observable, and health-checked.

> **Pitfall**
> `AddServiceDefaults()` lives in the service's `Program.cs`, NEVER in the AppHost's. The AppHost is the orchestrator — adding service-side defaults there breaks boot because the orchestrator tries to register OpenTelemetry and health checks on itself, not on the managed services.

> **Pitfall**
> Forgetting `MapDefaultEndpoints()` — `AddServiceDefaults` alone registers the health-check services but does not expose the HTTP endpoints. The dashboard sees no `/health` response and paints the service red. Both calls are required: one at builder time, one at app time.

> **Takeaway**
> Every Aspire-managed service calls `builder.AddServiceDefaults()` at configure time and `app.MapDefaultEndpoints()` at map time. Together they wire service discovery, OpenTelemetry, `/health` + `/alive` endpoints, and HttpClient resilience — four Aspire capabilities with two lines. These calls belong in each service, never in the AppHost.
