---
n: 13
id: aspire-apphost
title: ".NET Aspire AppHost — the orchestration entry point"
hook: "One project to declare every service, database, and connection in your stack."
tags: [aspire, orchestration, apphost]
module: "Distributed Services & Orchestration"
source: "notes/aspire_SCRIPT.docx; Labs/W09 gRPC/; materials/assignments/4870-assignment-2_v0.docx; research-aspire.md"
bloom_levels: [understand, apply, analyze]
related: [aspire-service-defaults, aspire-orchestrated-resources, grpc-client-consumption]
---

## The smallest AppHost that does anything

Given a solution with a gRPC backend and a Blazor frontend, the Aspire AppHost is a separate project whose entire `Program.cs` looks like this:

```cs
var builder = DistributedApplication.CreateBuilder(args);

var backend  = builder.AddProject<Projects.StudentsGrpcApi>("backend");
var frontend = builder.AddProject<Projects.StudentsBlazor>("frontend")
    .WithReference(backend)
    .WaitFor(backend);

builder.Build().Run();
```

Four API calls do the work:

| Call | What it does |
|---|---|
| `DistributedApplication.CreateBuilder(args)` | Creates the orchestrator builder. |
| `AddProject<Projects.X>("logical-name")` | Registers a .NET project as a named service. |
| `.WithReference(other)` | Injects the other service's connection info as environment variables. |
| `.WaitFor(other)` | Delays startup until the referenced resource reports healthy. |

Run `dotnet run --project StudentsAppHost` (or `dotnet watch` in the AppHost directory) and Aspire launches every declared project, points each at its dependencies, and surfaces everything in the Aspire Dashboard on `http://localhost:15888`.

## Logical names replace hardcoded URLs

The string you pass to `AddProject<>("backend")` is the service's **logical name**. Consumers reach it as `http://backend/` — not `http://localhost:5099`. Aspire intercepts that URL at runtime and resolves it to whichever port the backend actually bound to (which may be picked dynamically on each run).

This is the whole point of Aspire's service discovery: your Blazor page says `http://backend/api/students` and it works identically in the Docker-containerized production environment and in a dev-box where the backend is running as a plain `dotnet run`.

## Adding a database resource

A database is just another resource you register on the builder:

```cs
var builder = DistributedApplication.CreateBuilder(args);

var sqlDb = builder.AddSqlServer("sql")
                   .AddDatabase("schooldata");

var backend = builder.AddProject<Projects.StudentsGrpcApi>("backend")
    .WithReference(sqlDb)
    .WaitFor(sqlDb);

builder.AddProject<Projects.StudentsBlazor>("frontend")
    .WithReference(backend)
    .WaitFor(backend);

builder.Build().Run();
```

`AddSqlServer("sql")` spins up a containerized SQL Server instance under the logical name `sql`. `.AddDatabase("schooldata")` chains a named database onto it. When the backend calls `WithReference(sqlDb)`, Aspire writes the connection string into the backend's environment as `ConnectionStrings__schooldata`. Inside the backend's `Program.cs`, `builder.AddSqlServerDbContext<SchoolDbContext>("schooldata")` picks it up automatically.

> **Q:** You see `WithReference(backend)` and `WaitFor(backend)` written next to each other. What happens if you omit `WaitFor`?
> **A:** The frontend still learns the backend's address, but Aspire may start it before the backend is reporting healthy. First calls during boot fail with connection errors. `WaitFor` ties startup order to health checks; `WithReference` only wires configuration. Pair them whenever the frontend cannot survive a cold backend.

> **Example**
> An A2-style AppHost orchestrating a WebAPI, a Server-Blazor admin site, and a Client-Blazor public site against one SQL Server:
>
> ```cs
> var builder = DistributedApplication.CreateBuilder(args);
>
> var sql = builder.AddSqlServer("sql").AddDatabase("cms");
>
> var api = builder.AddProject<Projects.Cms_Api>("api")
>     .WithReference(sql).WaitFor(sql);
>
> builder.AddProject<Projects.Cms_Admin>("admin")
>     .WithReference(api).WaitFor(api);
>
> builder.AddProject<Projects.Cms_Public>("public")
>     .WithReference(api).WaitFor(api);
>
> builder.Build().Run();
> ```
>
> Three projects talk to one API; the API talks to one database. The AppHost is under 10 lines and replaces a docker-compose file plus reams of connection-string config.

> **Pitfall**
> `AddServiceDefaults()` does NOT belong in the AppHost's `Program.cs`. It belongs in every SERVICE project's `Program.cs`. Putting it in the AppHost makes the orchestrator itself try to register OpenTelemetry + health checks as if it were a microservice — the app fails to start. Keep AppHost focused on `AddProject` / `WithReference` / `WaitFor` / resource registrations.

> **Pitfall**
> AppHost cannot find a sibling service project on its own. You must run `dotnet add reference` from the AppHost's `.csproj` to each service project. Without that, `AddProject<Projects.X>` fails at compile time because `Projects.X` doesn't exist. The `Projects` namespace is generated from referenced projects.

> **Takeaway**
> AppHost = `DistributedApplication.CreateBuilder(args)` + `AddProject<>("name")` per service + `WithReference` + `WaitFor`. Logical names replace hardcoded URLs. Add databases with `AddSqlServer("sql").AddDatabase("name")`; Aspire injects connection strings automatically. `AddServiceDefaults()` goes in each service, never in the AppHost. `dotnet add reference` connects AppHost to service projects.
