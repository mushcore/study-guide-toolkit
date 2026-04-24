---
n: 15
id: aspire-apphost-wiring
title: "Aspire AppHost — wire DB + API + frontend"
kind: code
lang: csharp
tags: [aspire, apphost, orchestration, code-question]
source: "Lesson 11 (likely-pattern coding question for Aspire bucket — 5 marks on final)"
---

## Prompt

Write the contents of an Aspire **`AppHost.cs`** that orchestrates three things:

1. A **SQL Server** resource named `"theserver"` with a database called `"sqldata"`.
2. An API project `Projects.WebApiFIFA` registered as `"backend"`. It must reference the database AND wait for it to be healthy.
3. A frontend project `Projects.BlazorFIFA` registered as `"frontend"`. It must reference the API AND wait for it.

Write only the file contents.

## Starter

```cs
var builder = DistributedApplication.CreateBuilder(args);

// TODO 1: SQL Server + database
// TODO 2: backend API with WithReference + WaitFor
// TODO 3: frontend with WithReference + WaitFor

builder.Build().Run();
```

## Solution

```cs
var builder = DistributedApplication.CreateBuilder(args);

var sqlServerDb = builder.AddSqlServer("theserver")
                         .AddDatabase("sqldata");

var api = builder.AddProject<Projects.WebApiFIFA>("backend")
    .WithReference(sqlServerDb)
    .WaitFor(sqlServerDb);

builder.AddProject<Projects.BlazorFIFA>("frontend")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
```

## Why

`AddProject<Projects.X>("name")` registers a project under a **logical name** — consumers reach it as `http://name/`. **`.WithReference(resource)`** injects the resource's connection info into the project's environment as `ConnectionStrings__sqldata` (or similar). **`.WaitFor(resource)`** blocks startup until the dependency reports healthy via `/health`.

A common wrong approach is calling **`.AddDatabase("sqldata")`** as a top-level builder method. It's not. It chains off **`AddSqlServer(...)`** — `var db = builder.AddSqlServer("server").AddDatabase("name")`.

Another wrong approach is putting **`AddServiceDefaults()`** in the AppHost. That belongs in **each individual service's** `Program.cs`. Adding it to the AppHost breaks boot — the orchestrator tries to register OpenTelemetry and health checks on itself.

A third wrong approach is referencing services by hardcoded URL like `new Uri("http://localhost:5001")`. Aspire assigns ephemeral ports — use the logical name (`http://backend`) and let service discovery resolve it.
