---
n: 9
id: file-based-script
title: "File-based .cs script with all four #: directives"
kind: code
lang: csharp
tags: [file-based-apps, dotnet-10, directives, code-question]
source: "Lesson 08 (likely-pattern coding question for File-based apps bucket — 8 marks on final)"
---

## Prompt

Write the contents of a file **`Locations.cs`** that runs as a file-based .NET 10 app. The script should:

1. Add the **`Spectre.Console`** NuGet package (version `0.49.1`).
2. Set the **`TargetFramework`** MSBuild property to `net9.0`.
3. Print a Spectre `Table` with two columns (`City`, `Country`) populated from a sample list of two cities — `("New York", "USA")` and `("Tokyo", "Japan")`.

The file must run with `dotnet run Locations.cs`. Write the entire file (directives + code).

## Starter

```cs
// TODO 1: #:package directive for Spectre.Console
// TODO 2: #:property directive for TargetFramework
// TODO 3: using Spectre.Console;
// TODO 4: build and render a Table with two cities
```

## Solution

```cs
#:package Spectre.Console@0.49.1
#:property TargetFramework=net9.0

using Spectre.Console;

var cities = new[] {
    new { City = "New York", Country = "USA" },
    new { City = "Tokyo",    Country = "Japan" },
};

var table = new Table();
table.AddColumn("City");
table.AddColumn("Country");
foreach (var c in cities) table.AddRow(c.City, c.Country);
AnsiConsole.Write(table);
```

## Why

Both `#:` directives go at the **top of the file**, **above any `using`**, and **with no space after the colon**. **`#:package Name@Version`** pulls a NuGet at runtime; **`#:property Key=Value`** sets an MSBuild property — no spaces around `=`. The file body is implicit `Main` (top-level statements) — no `class Program { static void Main(...) { ... } }` wrapper needed.

A common wrong approach is writing **`#: package Spectre.Console`** with a space after the colon. That's a parse error — directives are case-sensitive AND must have no space.

Another wrong approach is omitting the version (`#:package Spectre.Console`). It compiles and pulls the latest stable, but the version drifts over time — fine for prototypes, dangerous for reproducibility. For an exam answer, pin the version.

A third wrong approach is wrapping the body in `class Program { static void Main() { ... } }`. Top-level statements ARE the entry point — the wrapper is unnecessary boilerplate.
