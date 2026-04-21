---
id: 4870-topic-file-based-c-every-directive
title: File-based C# — every directive
pillar: tech
priority: high
chapter: W11
tags:
  - filebased
  - file-based
---

### All four directives

```cs
// ==== app.cs ====
#:package Spectre.Console@0.48.0       // NuGet package
#:package Newtonsoft.Json@13.0.3
#:sdk Microsoft.NET.Sdk.Web            // use ASP.NET SDK
#:property LangVersion=preview         // MSBuild property
#:property TargetFramework=net10.0
#:project ./lib/MyHelpers.csproj       // reference another project

using Spectre.Console;

AnsiConsole.MarkupLine("[green]Hello[/]");

foreach (var arg in args) Console.WriteLine(arg);
```

**Run:** `dotnet run app.cs -- extra args` (anything after `--` goes to `args`)

### CRITICAL syntax rules

-   `#:package` — NO space after colon (`#: package` ❌)
-   Directives must be at TOP of file before any code
-   @version optional → uses latest if omitted
-   SDK names are Microsoft-standard: `Microsoft.NET.Sdk` (default), `Microsoft.NET.Sdk.Web`, `Microsoft.NET.Sdk.Worker`

### Minimal Web API — single file

```cs
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/", () => "Hello");
app.Run();
```

### Convert to a real project

```cs
dotnet project convert app.cs -o NewFolder
```

### Shebang (mac/linux)

```cs
#!/usr/bin/env dotnet
#:package Spectre.Console@0.48.0
...
```

Then `chmod +x app.cs` and run as `./app.cs`.
