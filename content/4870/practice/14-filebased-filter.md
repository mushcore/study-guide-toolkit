---
n: 14
id: filebased-filter
title: "Filter a deserialized list by keyword (case-insensitive)"
kind: code
lang: cs
tags: [dotnet-10, file-based, linq, filter]
source: "Labs/W11 File Based C# Apps/ Q2 (variant — filter by Name substring only, simpler than the lab which searched Name OR School OR Dob OR Gender)"
---

## Prompt

Extend the previous script (`readStudents.cs`) to accept a `keyword` command-line argument. Filter the loaded `List<Student>` to rows where the `Name` property contains the keyword (case-insensitive). Print each matching student's `Name`. If no keyword is supplied, print every student.

## Starter

```cs
// readStudents.cs
using System.Text.Json;

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(
    json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();

// TODO: read an optional keyword from args and filter students by Name.
// TODO: print each matching student's Name on its own line.

public record Student(string Name, string School, string Dob, string Gender);
```

## Solution

```cs
// readStudents.cs
using System.Text.Json;

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(
    json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();

var keyword = args.Length > 0 ? args[0] : null;

var matches = keyword is null
    ? students
    : students.Where(s => s.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase));

foreach (var s in matches)
    Console.WriteLine(s.Name);

public record Student(string Name, string School, string Dob, string Gender);
```

## Why

`args` is available at the top level in every file-based app. The ternary `args.Length > 0 ? args[0] : null` defaults gracefully when the user invokes `dotnet run readStudents.cs -- ` without a value. `string.Contains(..., StringComparison.OrdinalIgnoreCase)` is the .NET 5+ overload that skips `.ToLower()` allocations and normalizes consistently across cultures.

Invoke with `dotnet run readStudents.cs -- alice`. Without the `--`, the CLI consumes `alice` as its own argument and your script sees empty `args`.

Common wrong approaches:

- **Calling `.ToLower()` on both sides of the comparison.** It works but allocates a new string per row — fine for a script, expensive in a hot loop. `StringComparison.OrdinalIgnoreCase` avoids the allocation.
- **Forgetting the `--` when running.** `dotnet run readStudents.cs alice` hands `alice` to the CLI (which ignores it silently or errors). Everything after `--` becomes `args` inside the script.
- **Returning the filtered query as `IEnumerable` and enumerating it twice.** LINQ queries are lazy — iterating a `Where` result twice re-evaluates the predicate per row. For small data it doesn't matter; for large data, materialize with `.ToList()` once.
