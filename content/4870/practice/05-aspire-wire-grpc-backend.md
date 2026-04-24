---
n: 5
id: aspire-wire-grpc-backend
title: "Wire a gRPC backend into an Aspire AppHost"
kind: code
lang: cs
tags: [aspire, grpc, apphost]
source: "Labs/W09 gRPC/ Q4 (variant — single-backend + single-frontend orchestration with WithReference + WaitFor, simpler than the lab's full multi-service CRUD)"
---

## Prompt

You have two projects in your solution: `StudentsGrpcApi` (a gRPC backend) and `StudentsBlazor` (a Blazor Server frontend). The AppHost project already has `<ProjectReference>` to both. Fill in `AppHost/Program.cs` so Aspire starts the backend first, waits for it to report healthy, then starts the frontend with the backend's URL injected as an environment variable.

## Starter

```cs
var builder = DistributedApplication.CreateBuilder(args);

// TODO: register the gRPC backend under the logical name "backend".
// Then register the Blazor frontend under "frontend" so it waits for
// the backend and receives its URL via service discovery.

builder.Build().Run();
```

## Solution

```cs
var builder = DistributedApplication.CreateBuilder(args);

var backend = builder.AddProject<Projects.StudentsGrpcApi>("backend");

builder.AddProject<Projects.StudentsBlazor>("frontend")
    .WithReference(backend)
    .WaitFor(backend);

builder.Build().Run();
```

## Why

`AddProject<Projects.StudentsGrpcApi>("backend")` both launches the backend and assigns it the logical name `backend`. The frontend's `WithReference(backend)` injects an environment variable (something like `services__backend__http__0`) that the frontend's service-discovery handler reads whenever the app resolves `http://backend/`. `WaitFor(backend)` prevents the frontend from starting until the backend passes its `/health` check — without this, the first gRPC calls fire against a server that hasn't finished booting.

Common wrong approaches:

- **Hardcoding `opts.Address = new Uri("http://localhost:5099")` in the frontend's `Program.cs` and skipping `WithReference` in the AppHost.** It works in local dev but loses every benefit of Aspire — no dynamic port allocation, no environment-specific overrides, no dashboard telemetry. The right move is `opts.Address = new Uri("http://backend")` on the client plus `WithReference` in the AppHost.
- **Omitting `WaitFor(backend)`.** The frontend can boot, be reachable, and issue its first gRPC call before the backend has finished migrations or health checks. The failure reads as a network error; the real cause is ordering.
- **Calling `AddServiceDefaults()` in the AppHost.** `AddServiceDefaults` belongs in each individual service's `Program.cs`. Putting it in the AppHost is a boot-break — the orchestrator tries to register OpenTelemetry and health checks on itself and fails.
