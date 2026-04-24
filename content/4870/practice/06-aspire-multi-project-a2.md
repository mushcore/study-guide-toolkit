---
n: 6
id: aspire-multi-project-a2
title: "Orchestrate an Assignment-2-style multi-project stack"
kind: code
lang: cs
tags: [aspire, apphost, sql-server]
source: "Assignment 2 (variant — WebAPI + Server-Blazor admin + Client-Blazor public against one SQL Server, simpler than A2's full-stack which also adds AI integration and role-based auth)"
---

## Prompt

Assignment 2's architecture: one WebAPI (the data tier), one Server-Blazor project (admin site for authors + admins), one Client-Blazor WASM project (public-facing reader). All three share one SQL Server database named `cms`. Write the AppHost `Program.cs` that wires this up: the API depends on the database; both Blazor sites depend on the API.

## Starter

```cs
var builder = DistributedApplication.CreateBuilder(args);

// TODO: register SQL Server + a database called "cms".
// TODO: register the WebAPI under "api" with the database injected.
// TODO: register the Server-Blazor admin site and the Client-Blazor
// public site, both depending on the api.

builder.Build().Run();
```

## Solution

```cs
var builder = DistributedApplication.CreateBuilder(args);

var db = builder.AddSqlServer("sql")
                .AddDatabase("cms");

var api = builder.AddProject<Projects.Cms_Api>("api")
    .WithReference(db)
    .WaitFor(db);

builder.AddProject<Projects.Cms_Admin>("admin")
    .WithReference(api)
    .WaitFor(api);

builder.AddProject<Projects.Cms_Public>("public")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
```

## Why

The dependency graph is explicit: `db → api → (admin, public)`. `AddSqlServer("sql").AddDatabase("cms")` gives the API a connection string via `ConnectionStrings__cms`. The API's `Program.cs` calls `builder.AddSqlServerDbContext<CmsDbContext>("cms")` and EF Core picks up the injected value — no `appsettings.json` edits per environment. Each Blazor project reaches the API as `http://api/`; the admin site uses that for admin-only endpoints, the public site uses it for anonymous reads.

Common wrong approaches:

- **Registering two separate databases, one for admin and one for public.** A2 explicitly requires a shared database so content authored in admin appears on the public site. Registering `AddDatabase("admin-cms")` and `AddDatabase("public-cms")` produces two isolated SQL Server databases that never sync.
- **Skipping `WaitFor(api)` on the Blazor projects.** Both sites launch, hit the API on first render, and fail because the API hasn't finished EF migrations yet. The user sees a spinner or an error; the root cause is startup-order, not code.
- **Adding AI integration at the AppHost level via `WithEnvironment("OPENAI_KEY", ...)`.** A2 does require AI, but AI config belongs inside each service that needs it — via that service's `appsettings.json` or its own `WithEnvironment` call in AppHost scoped to one project, not leaked as a global env var. Scoping secrets to the service that uses them limits blast radius.
