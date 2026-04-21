---
"n": 8
id: 4870-lesson-file-based-c-apps-and-asp-net-aspire
title: File-based C# apps and ASP.NET Aspire
hook: "File-based apps: `.cs` without `.csproj`. Aspire: orchestrate many projects."
tags:
  - file-based
  - aspire
module: Hosting
---

**File-based apps** (.NET 10): write plain `hello.cs`, run with `dotnet run hello.cs`. Use `#:` directives for packages, SDKs, MSBuild properties.

```cs
// hello.cs
#:package Spectre.Console@0.48.0
#:sdk Microsoft.NET.Sdk.Web
#:property LangVersion=preview

using Spectre.Console;
AnsiConsole.MarkupLine("[green]Hello[/]");
```

> **Analogy**
>  File-based C# = Python script. `dotnet project convert file.cs` promotes it to a real project when you outgrow one file.

**CRITICAL:** NO space after the colon. `#: package` ❌. `#:package` ✓.

**Aspire** orchestrates multi-project solutions (web + api + db + cache) via an **AppHost** project.

```cs
// AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);
var cache = builder.AddRedis("cache");
var db    = builder.AddSqlServer("sql").AddDatabase("app");
var api   = builder.AddProject<Projects.Api>("api").WithReference(cache).WithReference(db);
builder.AddProject<Projects.Web>("web").WithReference(api);
builder.Build().Run();
```

**ServiceDefaults**: shared telemetry + service discovery package. Each project calls `builder.AddServiceDefaults()`.

#### Aspire AppHost orchestration — resource graph

flowchart TB
  AH\["AppHost
DistributedApplication.CreateBuilder"\]
  CA\["AddRedis('cache')"\]
  DB\["AddSqlServer → AddDatabase('app')"\]
  API\["AddProject<Projects.Api>('api')"\]
  WEB\["AddProject<Projects.Web>('web')"\]
  AH --> CA
  AH --> DB
  AH --> API
  AH --> WEB
  API -. WithReference .-> CA
  API -. WithReference .-> DB
  WEB -. WithReference + WaitFor .-> API
      

> **Q:** **Checkpoint —** You have a file-based `dashboard.cs` that needs Spectre.Console AND the ASP.NET Core web SDK (because you added a minimal API). Write the two top-of-file directives in the correct syntax.
> **A:** ``` #:sdk Microsoft.NET.Sdk.Web #:package Spectre.Console@0.48.0 ``` Key details: no space after the colon (`#:sdk` not `#: sdk`), package version uses `@` not `=`, SDK directive uses the full MSBuild identifier `Microsoft.NET.Sdk.Web`.

> **Note**
> **Takeaway —** File-based: `#:package`, `#:sdk`, `#:property`. Aspire: AppHost + AddProject + WithReference.
