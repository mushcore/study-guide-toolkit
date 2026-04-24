---
n: 15
id: filebased-spectre-table
title: "Render results as a Spectre.Console table using #:package"
kind: code
lang: cs
tags: [dotnet-10, file-based, directive, spectre-console]
source: "Labs/W11 File Based C# Apps/ Q3 (variant — single-column rendered table of names, simpler than the lab which rendered a multi-column Spectre table with borders, colors, and title)"
---

## Prompt

Replace the plain `Console.WriteLine(s.Name)` output in the filter script with a bordered Spectre.Console table. The table has one column titled "Name" and one row per matching student. Declare the package dependency inline via `#:package`.

## Starter

```cs
// filterStudents.cs
using System.Text.Json;

// TODO: declare a #:package directive for Spectre.Console.
// TODO: import Spectre.Console.

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(
    json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();

var keyword = args.Length > 0 ? args[0] : null;
var matches = keyword is null
    ? students
    : students.Where(s => s.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase));

// TODO: render matches as a bordered Spectre table with one "Name" column.
foreach (var s in matches)
    Console.WriteLine(s.Name);

public record Student(string Name, string School, string Dob, string Gender);
```

## Solution

```cs
// filterStudents.cs
#:package Spectre.Console@0.49.1

using System.Text.Json;
using Spectre.Console;

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(
    json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();

var keyword = args.Length > 0 ? args[0] : null;
var matches = keyword is null
    ? students
    : students.Where(s => s.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase));

var table = new Table();
table.Border = TableBorder.Rounded;
table.AddColumn("Name");

foreach (var s in matches)
    table.AddRow(s.Name);

AnsiConsole.Write(table);

public record Student(string Name, string School, string Dob, string Gender);
```

## Why

`#:package Spectre.Console@0.49.1` is the entire package-management story for this script — the CLI downloads Spectre.Console on first run and caches it in `~/.dotnet/runfile/`. No NuGet restore, no `.csproj`.

`AnsiConsole.Write(table)` is the Spectre pattern for rendering. Spectre tables support borders (`TableBorder.Rounded`, `Heavy`, `Double`, `None`), column alignment, styled text (`[green]Name[/]`), and cell colors — all out of scope for this practice but easy additions.

Common wrong approaches:

- **`#: package Spectre.Console@0.49.1` (space after the colon).** Syntax error. The directive name must sit flush against `#:`. The spaced form is the single most-tested exam distractor.
- **Omitting the version pin (`@0.49.1`).** The CLI pulls the latest version on first run, which may subtly change the API between sessions. Pinning a version makes the script reproducible across machines and months.
- **Calling `Console.WriteLine(table)` instead of `AnsiConsole.Write(table)`.** Spectre tables don't have a meaningful `ToString()` — you see `Spectre.Console.Table`. `AnsiConsole.Write` drives the actual rendering with ANSI escape codes.
