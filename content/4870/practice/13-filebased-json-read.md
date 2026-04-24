---
n: 13
id: filebased-json-read
title: "Deserialize students.json in a file-based app"
kind: code
lang: cs
tags: [dotnet-10, file-based, json, deserialize]
source: "Labs/W11 File Based C# Apps/ Q1 (variant — deserialize one JSON file into a typed list and print the count, simpler than the lab's multi-field filter)"
---

## Prompt

Given a file `students.json` (a JSON array of `{ name, school, dob, gender }` objects) in the current directory, write a file-based C# app (`readStudents.cs`) that:

1. Reads the file with `File.ReadAllText`.
2. Deserializes it into a `List<Student>` using `System.Text.Json`.
3. Prints `Loaded N students.` where N is the count.

Use a `Student` record declared below the top-level code.

## Starter

```cs
// readStudents.cs

// TODO: read students.json, deserialize into a List<Student>,
//       and print the count.

public record Student(string Name, string School, string Dob, string Gender);
```

## Solution

```cs
// readStudents.cs
using System.Text.Json;

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(
    json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

Console.WriteLine($"Loaded {students?.Count ?? 0} students.");

public record Student(string Name, string School, string Dob, string Gender);
```

## Why

Three file-based-app idioms show up. First, top-level statements replace `Main` — `File.ReadAllText(...)` runs at the top of the file. Second, implicit usings cover `System.IO` (for `File`) and `System.Collections.Generic` (for `List<T>`), so no `using` directives are needed for those. `System.Text.Json` is NOT implicit, so it needs an explicit `using`. Third, type declarations (the `Student` record) live below top-level statements — the compiler rewrites the file so top-level code goes into an implicit `Main` and type declarations are compiled as peers.

`PropertyNameCaseInsensitive = true` lets your PascalCase C# record match typical camelCase JSON. Without it, deserialization returns a list where every property is null.

Run with `dotnet run readStudents.cs`. Output: `Loaded 6 students.` (or whatever the file contains).

Common wrong approaches:

- **Declaring `Student` above the top-level code.** The compiler requires type declarations after top-level statements. Moving the record to the top of the file produces a compilation error.
- **Omitting `PropertyNameCaseInsensitive`.** JSON like `{"name":"Alice"}` won't bind to a property `Name` by default — properties come out as their default values (null for strings). Case-insensitive matching bridges the case convention gap.
- **Using `args[0]` as the filename without a fallback.** If the script is invoked without args (`dotnet run readStudents.cs`), `args[0]` throws IndexOutOfRange. Hardcode the filename or guard with `args.Length > 0`.
