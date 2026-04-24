---
n: 27
id: file-based-app-basics
title: "File-based .NET apps — single .cs file, no csproj, `dotnet run file.cs`"
hook: "Drop a `.cs` file, run it. No project, no build folder."
tags: [dotnet-10, scripting, file-based]
module: ".NET 10 Scripts & Reporting"
source: "slides/file-based-apps.pptx; notes/file-based-apps.docx; research-file-based.md"
bloom_levels: [understand, apply]
related: [file-based-app-directives, file-based-app-web]
---

## One file, one command

`.NET 10` lets you run a standalone `.cs` file without ever creating a `.csproj`. Save this as `HelloDevs.cs`:

```cs
Console.WriteLine("Hello Devs");
```

Then run:

```bash
dotnet run HelloDevs.cs
```

The CLI detects the `.cs` argument, generates an implicit project context, compiles the file in memory, and executes it. Compilation artifacts are cached under `~/.dotnet/runfile/` (macOS / Linux) or `%USERPROFILE%\.dotnet\runfile\` (Windows), keyed by file hash + content hash so subsequent runs are fast.

No `bin/`, no `obj/`, no `.csproj`. Just one file.

## Top-level statements + implicit usings

File-based apps skip the `Program` class + `Main` ceremony. Code at file scope IS `Main`:

```cs
Console.WriteLine(args.Length > 0 ? args[0] : "World");
```

Several namespaces are imported implicitly: `System`, `System.Collections.Generic`, `System.Linq`, `System.Text`, `System.Threading.Tasks`. You can write `Console.WriteLine`, `List<int>`, or `foreach (var x in arr.Where(p))` without any `using` directives.

## Command-line arguments

`args` is a regular `string[]` in scope at the top level:

```cs
// greet.cs
var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
```

Invoke with a `--` separator so the CLI knows which args belong to your script vs `dotnet run` itself:

```bash
dotnet run greet.cs -- Kevin
# → Hello, Kevin!
```

The `--` is not optional when you pass arguments. Without it the CLI interprets your `Kevin` as a flag to itself and you get "Hello, World!".

## When file-based apps are (and aren't) the right tool

**Right fit:**

- One-off utilities — data massaging, log grepping, quick prototypes.
- Teaching examples — no project plumbing to distract from the concept.
- Inline web APIs (see `file-based-app-web` lesson).
- Scripts that need a NuGet package without ceremony (see `file-based-app-directives`).

**Wrong fit:**

- Multi-file projects — no way to reference a sibling `.cs` from another `.cs` without converting to a project.
- Anything that needs a full project structure (unit test suites, complex build steps, code analyzers).
- Long-lived services where deployment tooling expects a `.csproj`.

When the single-file approach outgrows its use case, convert to a traditional project:

```bash
dotnet project convert HelloDevs.cs -o HelloDevsProject
```

The command creates a folder with the `.csproj`, moves the `.cs` into it, and preserves any `#:` directives as the project's equivalent settings (see `file-based-app-directives`).

> **Q:** You run `dotnet run greet.cs Kevin` and see `Hello, World!` rather than `Hello, Kevin!`. What did you forget?
> **A:** The `--` separator. `dotnet run greet.cs Kevin` passes `Kevin` to `dotnet`, not to your script. The correct invocation is `dotnet run greet.cs -- Kevin` — everything after `--` becomes `args` inside your `.cs`.

> **Example**
> A three-line utility that reads stdin and prints line counts, with no project overhead:
>
> ```cs
> // count.cs
> var lines = Console.In.ReadToEnd().Split('\n');
> Console.WriteLine($"Lines: {lines.Length}");
> ```
>
> Run: `cat some-file.txt | dotnet run count.cs`. No `.csproj`, no `bin/`, no setup — the CLI caches the compiled binary under `~/.dotnet/runfile/` for subsequent invocations.

> **Pitfall**
> .NET versions before 10 do NOT fully support the file-based flow. On .NET 8 or 9, `dotnet run file.cs` either errors or requires a different shim. The course targets .NET 10; verify with `dotnet --version` if a script silently fails.

> **Takeaway**
> `dotnet run file.cs` compiles and runs a single `.cs` file without a project. Top-level statements replace `class Program { static void Main }`. Implicit usings cover `System`, `System.Linq`, `System.Collections.Generic`, `System.Text`, and `System.Threading.Tasks`. Pass CLI args with `dotnet run file.cs -- arg1 arg2`. Use `dotnet project convert file.cs -o Folder` to graduate to a traditional project when single-file stops fitting.
