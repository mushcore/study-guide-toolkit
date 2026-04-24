---
n: 10
id: file-based-web-api
title: "Minimal Web API as a single .cs file"
kind: code
lang: csharp
tags: [file-based-apps, dotnet-10, minimal-api, web, code-question]
source: "Lesson 08 (likely-pattern coding question for File-based apps bucket — 8 marks on final)"
---

## Prompt

Write the contents of **`WebApi.cs`** — a single-file ASP.NET Core minimal API. The file should:

1. Use the **`Microsoft.NET.Sdk.Web`** SDK via a `#:sdk` directive.
2. Build a `WebApplication` from `WebApplication.CreateBuilder(args)`.
3. Map a `GET /` endpoint that returns the JSON object `{ "Message": "Hello, World!" }`.
4. Run the app.

The file must run with `dotnet run WebApi.cs`. Write the entire file.

## Starter

```cs
// TODO 1: #:sdk directive for ASP.NET Core
// TODO 2: var builder = WebApplication.CreateBuilder(args);
// TODO 3: var app = builder.Build();
// TODO 4: app.MapGet("/", () => ...);
// TODO 5: app.Run();
```

## Solution

```cs
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () => new { Message = "Hello, World!" });

app.Run();
```

## Why

The default file-based SDK is **`Microsoft.NET.Sdk`** (console). Without **`#:sdk Microsoft.NET.Sdk.Web`**, the `WebApplication` type doesn't resolve — the default console SDK doesn't include ASP.NET Core types. The `#:sdk` directive switches the implicit project's SDK at script-compile time.

A common wrong approach is omitting the `#:sdk` directive entirely — the script fails with `WebApplication could not be found` even though all the syntax looks correct.

Another wrong approach is wrapping the body in `class Program { static void Main(string[] args) { ... } }`. File-based apps use top-level statements; `args` is automatically available inside the body without an explicit signature.
