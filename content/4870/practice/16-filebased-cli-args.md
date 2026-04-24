---
n: 16
id: filebased-cli-args
title: "Accept keyword from command-line args in a file-based app"
kind: code
lang: cs
tags: [dotnet-10, file-based, cli, args]
source: "Labs/W11 File Based C# Apps/ Q4 (variant — default to \"medicine\" keyword when no arg given, matching the lab's start.sh default behavior)"
---

## Prompt

Modify the filter script so that when `dotnet run filterStudents.cs -- <keyword>` is invoked with no keyword, the script defaults to `"medicine"` (matching the lab's `start.sh` convention) instead of listing every student. When a keyword IS supplied, use it.

Print the effective keyword on the first line: `Filtering by: <keyword>`.

## Starter

```cs
// filterStudents.cs
using System.Text.Json;

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(
    json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();

// TODO: determine the effective keyword — use args[0] if given,
//       otherwise default to "medicine".
// TODO: print "Filtering by: <keyword>".
// TODO: filter by Name OR School containing the keyword.
foreach (var s in students)
    Console.WriteLine(s.Name);

public record Student(string Name, string School, string Dob, string Gender);
```

## Solution

```cs
// filterStudents.cs
using System.Text.Json;

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(
    json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();

var keyword = args.Length > 0 ? args[0] : "medicine";
Console.WriteLine($"Filtering by: {keyword}");

var matches = students.Where(s =>
    s.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
    s.School.Contains(keyword, StringComparison.OrdinalIgnoreCase));

foreach (var s in matches)
    Console.WriteLine($"  {s.Name} ({s.School})");

public record Student(string Name, string School, string Dob, string Gender);
```

## Why

The default-value pattern `args.Length > 0 ? args[0] : "medicine"` mirrors what the lab's `start.sh` does: if the user doesn't type a keyword, apply a sensible default. This is common in CLI tools — a zero-arg run should still do something useful rather than listing everything or erroring.

Extending the predicate to search both `Name` and `School` is a single `||` between two `.Contains(...)` calls. With more than two fields, a helper method keeps the lambda readable.

Run examples:

- `dotnet run filterStudents.cs` → keyword = `"medicine"` (default).
- `dotnet run filterStudents.cs -- alice` → keyword = `"alice"`.
- `dotnet run filterStudents.cs -- "St. Mary"` → keyword = `"St. Mary"` (quotes keep the space).

Common wrong approaches:

- **Checking `args.Length >= 0`.** Always true. The predicate must be `> 0` or `== 1`.
- **Accessing `args[0]` without a length guard.** If the user runs with no args, `args[0]` throws `IndexOutOfRangeException`. The ternary is the idiomatic fix.
- **Defaulting to `string.Empty` or `null`.** Empty-string `Contains` matches everything (every string contains the empty string), so the filter returns the full list — technically not wrong but hides the intent. Using a real default like `"medicine"` makes the zero-arg behavior match the lab's scripted demo.
