---
n: 28
id: file-based-app-directives
title: "File-based app `#:` directives — package, property, sdk, project"
hook: "Four directives put NuGet, MSBuild, SDK, and project refs inline. No space after the colon."
tags: [dotnet-10, scripting, directives]
module: ".NET 10 Scripts & Reporting"
source: "notes/file-based-apps.docx; research-file-based.md §2.4"
bloom_levels: [remember, apply]
related: [file-based-app-basics, file-based-app-web]
---

## The four `#:` directives

File-based apps declare build-time metadata through four directives. All four share the same shape: `#:<kind> <value>` — the `#` immediately followed by `:` followed immediately by the directive name, no space. A space after the colon is a syntax error and a common exam distractor.

| Directive | Purpose |
|---|---|
| `#:package` | Add a NuGet package dependency |
| `#:property` | Set an MSBuild property (e.g. `TargetFramework`) |
| `#:sdk` | Switch SDK (default is console; `Microsoft.NET.Sdk.Web` for web APIs) |
| `#:project` | Reference a local `.csproj` |

Directives go at the top of the file, above any `using` or code.

## `#:package`

```cs
#:package Spectre.Console@0.49.1

using Spectre.Console;

var table = new Table();
table.AddColumn("City");
table.AddRow("New York");
AnsiConsole.Write(table);
```

Format: `#:package <PackageName>@<Version>`. The CLI downloads the package on first run, caches it under `~/.dotnet/runfile/`, and resolves references automatically. Subsequent runs use the cache.

Omit the `@version` and you get the latest stable version — fine for quick exploration, risky for anything you want to reproduce weeks later.

## `#:property`

```cs
#:property TargetFramework=net10.0
#:property Nullable=enable
#:property LangVersion=preview

Console.WriteLine($"Running on: {Environment.Version}");
```

Format: `#:property <Name>=<Value>` (the `=` matters; no spaces around it).

Common properties:

- `TargetFramework=net10.0` — pin the .NET version.
- `Nullable=enable` — turn on nullable reference types.
- `LangVersion=preview` — allow not-yet-stabilized C# language features.

You can stack multiple `#:property` lines.

## `#:sdk`

```cs
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
var app = builder.Build();
app.MapGet("/", () => "Hello from a file-based web app!");
app.Run();
```

Format: `#:sdk <SdkName>`. Three SDKs matter for 4870:

- `Microsoft.NET.Sdk` — default console app (no directive needed).
- `Microsoft.NET.Sdk.Web` — ASP.NET Core / minimal APIs.
- `Microsoft.NET.Sdk.BlazorWebAssembly` — Blazor WASM (out of scope but good to recognize).

Without `#:sdk Microsoft.NET.Sdk.Web`, calls like `WebApplication.CreateBuilder(args)` fail to resolve because the default SDK doesn't include ASP.NET Core types.

## `#:project`

```cs
#:project ./MyLibrary/MyLibrary.csproj

using MyLibrary;

var person = new Person { FirstName = "John", LastName = "Doe" };
Console.WriteLine($"{person.FirstName} {person.LastName}");
```

Format: `#:project <relative-path-to-.csproj>`. Adds a project reference — the file-based script can now use types from `MyLibrary`. Useful when you have a shared library project and want a one-off script that consumes it.

The reverse (a `.csproj` referencing a file-based `.cs`) is not supported — file-based apps cannot be consumed as dependencies. Convert them to projects first with `dotnet project convert`.

> **Q:** A classmate's `app.cs` has `#: package Spectre.Console@0.49.1` at the top. The script fails with a parser error on that line. What's the fix?
> **A:** Remove the space after the colon. The correct form is `#:package Spectre.Console@0.49.1` — `#:` + directive name with nothing between them. The spaced form is a classic exam distractor and not a legal syntax.

> **Example**
> A full minimal web API in one file, using three directives stacked:
>
> ```cs
> #:sdk Microsoft.NET.Sdk.Web
> #:package Microsoft.AspNetCore.OpenApi@10.0.0
> #:property Nullable=enable
>
> var builder = WebApplication.CreateBuilder(args);
> builder.Services.AddOpenApi();
> var app = builder.Build();
>
> app.MapOpenApi();
> app.MapGet("/", () => "Hello file-based web!");
>
> app.Run();
> ```
>
> Run with `dotnet run api.cs`. The SDK swap turns a console script into an ASP.NET Core web host.

> **Pitfall**
> `#:package`, `#:property`, `#:sdk`, `#:project` are all case-sensitive and have NO space after the colon. Writing `#: package`, `#:Package`, or `#: sdk Microsoft.NET.Sdk.Web` all fail. Each `#:` directive must sit on its own line — you cannot combine two directives on one line with a separator.

> **Takeaway**
> Four directives drive file-based-app build metadata: `#:package PackageName@version` for NuGet, `#:property Name=Value` for MSBuild properties, `#:sdk SdkName` for SDK selection, `#:project ./Path/To.csproj` for project references. No space after `#:`. Stack as many as you need at the top of the file — the CLI parses them before compilation.
