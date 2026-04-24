---
n: 8
id: file-based-apps
title: "File-based .NET 10 apps — dotnet run file.cs + #: directives"
hook: "One .cs file, one command, no .csproj. Four #: directives let scripts pull packages, set MSBuild properties, switch SDKs, or reference projects."
tags: [dotnet-10, scripting, directives, file-based]
module: ".NET 10 Scripts"
source: "materials/Lessons/W11/File based apps/* + example-1..4 + FileBasedWebApi"
bloom_levels: [understand, apply]
related: [excel-export, pdf-export, chart-rendering, ai-local-models]
---

## What this lesson covers

File-based apps are **8 marks** on the exam. They're a **.NET 10 feature** that lets you run a single `.cs` file as if it were a script — no `.csproj`, no `bin/`, no `obj/`. The Docker SLM samples in Lesson 02 use this feature (`#:package OpenAI@*-*`).

Four things to know:

1. **`dotnet run file.cs`** — the new command shape.
2. **Top-level statements + implicit `Main`** — file body IS the entry point.
3. **The four `#:` directives** — `#:package`, `#:property`, `#:sdk`, `#:project`.
4. **`dotnet project convert`** — graduate the script to a real project.

---

## Vocabulary

| Term | Meaning |
|---|---|
| **File-based app** | A .NET program that lives in a single `.cs` file with no `.csproj`. .NET 10 feature. |
| **Top-level statements** | C# 9+ feature: file body is implicitly wrapped in a `Main` method. |
| **Implicit usings** | Default namespaces auto-imported (`System`, `System.Linq`, etc.). |
| **`#:` directive** | A line at the top of a `.cs` file that gives MSBuild instructions for the implicit project. |
| **Shebang** | `#!/usr/bin/env dotnet` — Unix line that lets you execute the file directly with `./file.cs`. |
| **MSBuild property** | A name=value pair MSBuild reads (e.g. `TargetFramework`, `Nullable`). |
| **SDK** | A preset bundle of MSBuild logic — `Microsoft.NET.Sdk` (console), `Microsoft.NET.Sdk.Web` (ASP.NET Core), etc. |

---

## Why file-based apps?

| Use case | Old way | File-based way |
|---|---|---|
| Quick automation | `dotnet new console -o`, then edit, then `dotnet run` | One `.cs`, `dotnet run file.cs` |
| Glue script in CI | Bash + dotnet | `.cs` script with `#:package` directive |
| Sharing a snippet | Whole zip file | Email one `.cs` |
| Demo a feature | Project scaffold + nuget restore | `#:package PkgName` and run |

The Docker SLM samples in Lesson 02 use this pattern — a Console-style `.cs` file with `#:package OpenAI@*-*` instead of a `.csproj`.

---

## The simplest file-based app

```cs
// HelloDevs.cs
Console.WriteLine("Hello Devs");
```

```bash
dotnet run HelloDevs.cs
```

What happens under the hood:

1. CLI sees the `.cs` argument and treats it as a file-based app.
2. CLI generates an implicit project context (default SDK = `Microsoft.NET.Sdk`).
3. Compiles in memory.
4. Caches build artifacts under `~/.dotnet/runfile/` keyed by file hash.
5. Executes.

> **Note**
> No `bin/`, no `obj/`, no `.csproj` files appear in your working directory. The build output lives in the cache.

---

## Top-level statements + command-line args

The body of the file IS the entry point — there's no explicit `Main` method.

```cs
#!/usr/bin/env dotnet                  // shebang for Unix direct execution
#:property TargetFramework=net9.0      // MSBuild property (no space around =)

var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
```

Implicit usings (always available, no `using` line needed):

| Namespace | What it gives you |
|---|---|
| `System` | `Console`, `String`, primitives |
| `System.Collections.Generic` | `List<T>`, `Dictionary<K,V>` |
| `System.Linq` | `Where`, `Select`, `ToList`, etc. |
| `System.Text` | `StringBuilder`, `Encoding` |
| `System.Threading.Tasks` | `Task`, `Task<T>`, `async`/`await` |

### Passing args — the `--` separator

```bash
dotnet run greet.cs -- Kevin
# → Hello, Kevin!
```

Without `--`, the CLI interprets `Kevin` as a flag for itself, not as a script arg:

```bash
dotnet run greet.cs Kevin     # → Hello, World! (Kevin not passed)
dotnet run greet.cs -- Kevin  # → Hello, Kevin!
```

> **Pitfall**
> Forgetting the `--` separator is the **#1 file-based-app gotcha**. Args before `--` go to `dotnet`; args after go to `args` in your script.

---

## The four `#:` directives

All directives share the shape **`#:<kind> <value>`** with **NO space between `#:` and the kind**.

| Directive | Purpose | Example |
|---|---|---|
| `#:package` | Add a NuGet dependency | `#:package Spectre.Console@0.49.1` |
| `#:property` | Set an MSBuild property | `#:property TargetFramework=net9.0` |
| `#:sdk` | Switch SDK (web, blazor, etc.) | `#:sdk Microsoft.NET.Sdk.Web` |
| `#:project` | Reference a local `.csproj` | `#:project ./MyLib/MyLib.csproj` |

**Rules:**
- All `#:` directives go **at the top** of the file, **above `using` and code**.
- One directive per line.
- **No space after the colon** — `#: package` is a parse error.
- Directive kind is **case-sensitive**.

---

## `#:package` — pull a NuGet at runtime

```cs
#:package Spectre.Console@0.49.1

using Spectre.Console;

var cities = new[] {
    new { City = "New York", Country = "USA" },
    new { City = "Tokyo",    Country = "Japan" },
};

var table = new Table { Title = new TableTitle("[bold red]Cities[/]") };
table.Border = TableBorder.Rounded;
table.AddColumn("[bold]City[/]");
table.AddColumn("[bold]Country[/]");
foreach (var c in cities) table.AddRow(c.City, c.Country);
AnsiConsole.Write(table);
```

| Form | Meaning |
|---|---|
| `#:package Spectre.Console@0.49.1` | Pin to a specific version |
| `#:package OpenAI@*-*` | Latest of any version (used in Lesson 02 Docker SLM samples) |
| `#:package Spectre.Console` | Latest stable (reproducibility risk — version drifts over time) |

---

## `#:property` — set MSBuild properties

```cs
#:property TargetFramework=net9.0
#:property Nullable=enable
#:property LangVersion=preview
```

- Format: `#:property <Name>=<Value>` — **no spaces around `=`**.
- Stack as many lines as you need.

| Common property | Effect |
|---|---|
| `TargetFramework` | `net8.0`, `net9.0`, `net10.0` |
| `Nullable` | `enable` / `disable` — nullable reference types |
| `LangVersion` | `latest`, `preview`, `12`, `13` |
| `ImplicitUsings` | `enable` / `disable` |

---

## `#:sdk` — pick a different SDK

```cs
#!/usr/bin/env dotnet
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

var app = builder.Build();
app.MapGet("/", () => new HelloResponse { Message = "Hello, World!" });
app.Run();

public record HelloResponse { public string Message { get; init; } = string.Empty; }
```

| SDK | When to use |
|---|---|
| (none / `Microsoft.NET.Sdk`) | Default. Console apps. |
| `Microsoft.NET.Sdk.Web` | Minimal APIs / ASP.NET Core / `WebApplication.CreateBuilder` |
| `Microsoft.NET.Sdk.BlazorWebAssembly` | Blazor WASM apps |

> **Pitfall**
> Without `#:sdk Microsoft.NET.Sdk.Web`, `WebApplication.CreateBuilder(args)` fails to compile — the default console SDK doesn't include ASP.NET Core types.

---

## `#:project` — reference a local project

```cs
#:project ./MyLibrary/MyLibrary.csproj

using MyLibrary;

var person = new Person {
    FirstName   = "John",
    LastName    = "Doe",
    Email       = "john.doe@example.com",
    DateOfBirth = new DateTime(1990, 1, 1)
};
Console.WriteLine($"{person.FirstName} {person.LastName}");
```

The script can use any public type from the referenced project. The reverse (a `.csproj` referencing a `.cs` script) is **not** supported.

---

## Convert a script into a traditional project

```bash
dotnet project convert HelloDevs.cs -o HelloDevsProject
```

| Detail | Result |
|---|---|
| Creates | A folder with a real `.csproj` |
| Moves | The `.cs` into the new folder |
| Translates | All `#:` directives into MSBuild equivalents (`<PackageReference>`, `<TargetFramework>`, etc.) |

Useful when a quick script grows enough that you want a "normal" project layout.

---

## Question patterns to expect

| Pattern | Example stem | Answer |
|---|---|---|
| **Command** | "Which CLI command runs a file-based app?" | `dotnet run file.cs` |
| **Directive recall** | "Which directive declares a NuGet dependency?" | `#:package Name@Version` |
| **Directive recall** | "Which directive switches to the ASP.NET Core SDK?" | `#:sdk Microsoft.NET.Sdk.Web` |
| **Args** | "How do you pass args to a file-based script?" | `dotnet run file.cs -- arg1 arg2` (separator is `--`) |
| **Syntax** | "Which is the correct directive syntax?" | `#:package Name@1.0` (no space after colon) |
| **Conversion** | "Which command converts a `.cs` script to a real project?" | `dotnet project convert file.cs -o Folder` |
| **Which is FALSE** | List of statements about file-based apps | "needs a `.csproj`" / "available in .NET 8" — both wrong |
| **Code → tech** | Snippet starts with `#:package OpenAI@*-*` | File-based .NET 10 app |

---

## Retrieval checkpoints

> **Q:** Which CLI command runs a file-based app?
> **A:** **`dotnet run file.cs`** — the CLI detects the `.cs` arg and compiles it as a single-file app.

> **Q:** Which directive declares a NuGet dependency?
> **A:** **`#:package Name@Version`** — no space after `#:`, version with `@`.

> **Q:** What's the correct way to pass args to a file-based script?
> **A:** **`dotnet run file.cs -- arg1 arg2`** — the `--` separator is required, otherwise `dotnet` swallows the args.

> **Q:** Which directive switches the implicit SDK to ASP.NET Core?
> **A:** **`#:sdk Microsoft.NET.Sdk.Web`** — needed for `WebApplication.CreateBuilder(args)`.

> **Q:** What's the syntax for a property directive?
> **A:** **`#:property Name=Value`** — no spaces around `=`. Stack multiple lines.

> **Q:** What command graduates a file-based script into a traditional project?
> **A:** **`dotnet project convert file.cs -o FolderName`** — creates a `.csproj`, translates `#:` directives.

> **Q:** Why does `#:project ./Lib.csproj` work but the reverse not?
> **A:** A script can reference a project. A project cannot reference a single `.cs` script — projects need `.csproj` references.

> **Q:** What's the minimum file-based ASP.NET Core "hello world"?
> **A:**
> ```cs
> #:sdk Microsoft.NET.Sdk.Web
> var app = WebApplication.CreateBuilder(args).Build();
> app.MapGet("/", () => "Hello!");
> app.Run();
> ```

---

## Common pitfalls

> **Pitfall**
> `#: package ...` (space after the colon) is a **parse error**. The directive must be `#:package` with no space.

> **Pitfall**
> Missing `--` separator → args go to `dotnet`, not your script. `dotnet run greet.cs Kevin` outputs `Hello, World!` instead of `Hello, Kevin!`.

> **Pitfall**
> File-based apps are a **.NET 10** feature. .NET 8 / 9 don't fully support them — `dotnet run file.cs` errors or behaves differently.

> **Pitfall**
> Forgetting `#:sdk Microsoft.NET.Sdk.Web` for a web app — `WebApplication` won't resolve. Default SDK is console.

> **Pitfall**
> `#:property TargetFramework = net9.0` (spaces around `=`) is a parse error. Must be `#:property TargetFramework=net9.0`.

> **Pitfall**
> `#:package` without `@version` always pulls the **latest stable** version — fine for prototypes, dangerous for reproducibility. Pin versions in scripts you ship.

---

## Takeaway

> **Takeaway**
> **`dotnet run file.cs`** runs a `.cs` without a `.csproj`. **Top-level statements** = implicit `Main`. **Implicit usings** cover `System` / `Linq` / etc. **Args via `dotnet run file.cs -- arg1 arg2`** (the `--` is mandatory). **Four directives** at the top, no space after `#:`: **`#:package Name@Ver`**, **`#:property Key=Val`**, **`#:sdk Microsoft.NET.Sdk.Web`**, **`#:project ./path.csproj`**. **`dotnet project convert file.cs -o Folder`** graduates to a traditional project.
