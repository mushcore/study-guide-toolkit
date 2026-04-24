---
n: 13
id: file-based-apps
title: "File-based .NET apps — dotnet run file.cs + #: directives"
hook: "One file, one command, no csproj. Four directives for package/property/sdk/project."
tags: [dotnet-10, scripting, directives]
module: ".NET 10 Scripts & Reporting"
source: "code-examples/20260324_file-based-apps/file-based-apps/example-1/HelloDevs.cs + example-2/HelloScript.cs + example-3/Where.cs + example-4/Locations.cs + FileBasedWebApi/WebApi.cs"
bloom_levels: [understand, apply]
related: [excel-export, pdf-export, chart-rendering]
---

## One file, one command

.NET 10 runs a standalone `.cs` without a `.csproj`. Save as `HelloDevs.cs`:

```cs
Console.WriteLine("Hello Devs");
```

Then:

```bash
dotnet run HelloDevs.cs
```

CLI detects the `.cs` arg, generates implicit project context, compiles in memory, executes. Artifacts cached under `~/.dotnet/runfile/` keyed by file hash.

No `bin/`, no `obj/`, no `.csproj`. One file.

## Top-level statements + args

File body IS `Main`:

```cs
#!/usr/bin/env dotnet
#:property TargetFramework=net9.0
var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
```

Implicit usings: `System`, `System.Collections.Generic`, `System.Linq`, `System.Text`, `System.Threading.Tasks`.

Pass args with `--` separator:

```bash
dotnet run greet.cs -- Kevin
# → Hello, Kevin!
```

Without `--`, CLI interprets `Kevin` as flag to itself → `"Hello, World!"`.

## The four `#:` directives

All share shape `#:<kind> <value>` — NO space after colon. `#: package` fails.

| Directive | Purpose |
|---|---|
| `#:package Name@Version` | NuGet dependency |
| `#:property Key=Value` | MSBuild property |
| `#:sdk SdkName` | SDK selection |
| `#:project ./path.csproj` | Local project reference |

Directives at top of file, above `using` and code.

## `#:package` (example-4 Locations.cs)

```cs
#:package Spectre.Console@0.49.1

using Spectre.Console;

var cities = new[] {
    new { City = "New York", Country = "USA" },
    new { City = "Tokyo",    Country = "Japan" },
};

var table = new Table();
table.Title = new TableTitle("[bold red]Cities and Countries[/]");
table.Border = TableBorder.Rounded;
table.AddColumn(new TableColumn("[bold]City[/]"));
table.AddColumn(new TableColumn("[bold]Country[/]"));
foreach (var c in cities) table.AddRow(c.City, c.Country);
AnsiConsole.Write(table);
```

`#:package <Name>@<Version>`. CLI downloads + caches. Omit `@version` → latest stable (reproducibility risk).

## `#:property` (example-2 HelloScript.cs)

```cs
#:property TargetFramework=net9.0
#:property Nullable=enable
#:property LangVersion=preview
```

`#:property <Name>=<Value>` (no spaces around `=`). Stack multiple lines.

## `#:sdk` (FileBasedWebApi/WebApi.cs)

```cs
#!/usr/bin/env dotnet
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

builder.Services.AddOpenApi();

var app = builder.Build();
app.MapGet("/", () => new HelloResponse { Message = "Hello, World!" })
   .WithName("HelloWorld");
app.Run();

[JsonSerializable(typeof(HelloResponse))]
internal partial class AppJsonSerializerContext : JsonSerializerContext { }

public record HelloResponse { public string Message { get; init; } = string.Empty; }
```

SDKs:

- `Microsoft.NET.Sdk` — default console (no directive)
- `Microsoft.NET.Sdk.Web` — ASP.NET Core / minimal APIs
- `Microsoft.NET.Sdk.BlazorWebAssembly` — Blazor WASM

Without `#:sdk Microsoft.NET.Sdk.Web`, `WebApplication.CreateBuilder(args)` fails — default SDK lacks ASP.NET Core types.

## `#:project` (example-3 Where.cs)

```cs
#:project ./MyLibrary/MyLibrary.csproj

using MyLibrary;

var person = new Person {
    FirstName = "John",
    LastName  = "Doe",
    Email     = "john.doe@example.com",
    DateOfBirth = new DateTime(1990, 1, 1)
};
Console.WriteLine($"{person.FirstName} {person.LastName}");
```

Adds project reference — script can use types from referenced `.csproj`. Reverse (`.csproj` referencing a `.cs`) not supported.

## Convert to traditional project

```bash
dotnet project convert HelloDevs.cs -o HelloDevsProject
```

Creates folder with `.csproj`, moves `.cs` in, preserves `#:` directives as MSBuild equivalents.

> **Q:** `dotnet run greet.cs Kevin` outputs `Hello, World!` not `Hello, Kevin!`. What did you forget?
> **A:** The `--` separator. `dotnet run greet.cs -- Kevin` passes `Kevin` to script.

> **Q:** `var builder = WebApplication.CreateBuilder(args);` fails with "`WebApplication` not found." Missing?
> **A:** `#:sdk Microsoft.NET.Sdk.Web` at top. Default console SDK lacks ASP.NET Core.

> **Pitfall**
> `#: package ...` (space after colon) → parse error. Directive names case-sensitive. One directive per line.

> **Pitfall**
> .NET 8/9 do NOT fully support file-based flow. `dotnet run file.cs` errors or shims differently. Course targets .NET 10.

> **Takeaway**
> `dotnet run file.cs` compiles + runs a `.cs` without project. Top-level statements = `Main`. Implicit usings cover System/Linq/etc. Args via `dotnet run file.cs -- arg1 arg2`. Four directives at top (no space after `#:`): `#:package Name@Ver`, `#:property Key=Val`, `#:sdk Microsoft.NET.Sdk.Web`, `#:project ./path.csproj`. `dotnet project convert file.cs -o Folder` graduates to traditional project.
