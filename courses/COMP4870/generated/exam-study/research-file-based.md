# File-Based C# Apps - COMP4870 Exam Research (8 Marks)

**Source Materials:** file-based-apps.pptx, file-based-apps.docx, W11 File Based C# Apps Lab  
**Exam Weight:** 8 marks  
**Key Focus:** .NET 10 syntax, #: directives, dotnet run behavior, project conversion

---

## 1. TOPIC SUMMARY & DEFINITION

### What Are File-Based C# Apps?

File-based apps are single-file C# applications (`.cs` files) that run **without a `.csproj` project file**. They leverage .NET's simplified scripting mode introduced in .NET 5 and enhanced in .NET 10.

**Command syntax:**
```bash
dotnet run filename.cs
```

**Key characteristics:**
- Single `.cs` file only (no project structure required)
- No `.csproj` or `project.json`
- Compiled in-memory by `dotnet` CLI
- No persistent `bin/` or `obj/` directories
- Implicit compilation and execution in one command

### Why File-Based Apps Exist

1. **Lightweight scripting** — write quick utilities without project overhead
2. **Learning & prototyping** — test C# concepts without MSBuild complexity
3. **Utility scripts** — one-off CLI tools, data processing, automation
4. **Educational focus** — COMP4870 emphasis on modern .NET paradigms
5. **Accessibility** — lower barrier to entry for beginners

**Primary use cases from materials:**
- Console utilities with package dependencies
- Minimal web APIs (with `#:sdk Microsoft.NET.Sdk.Web`)
- Data filtering/processing (lab example: student JSON filtering)
- Interactive CLI tools (Spectre.Console colored output)

---

## 2. KEY CONCEPTS & SYNTAX

### 2.1 Core Command: `dotnet run filename.cs`

When you execute `dotnet run app.cs`:
1. .NET CLI detects the `.cs` file
2. Creates an implicit, temporary project context
3. Compiles the file in-memory
4. Executes the compiled binary
5. Compilation artifacts stored in:
   - **Linux/Mac:** `~/.dotnet/runfile/`
   - **Windows:** `%USERPROFILE%\.dotnet\runfile\`

**Cache location** (from Example 3):
```
/Users/medhatelmasry/Library/Application Support/dotnet/runfile/ex3-3faf7380d799c76bbc88e4cddcd046da82be3e820364dfb83da6470b19a0cb71/bin/debug/
```

Cache is keyed by filename hash + content hash for performance across runs.

---

### 2.2 Top-Level Statements (Implicit Main)

No `Program` class or `Main()` method required. Code executes at file scope:

```csharp
// HelloDevs.cs
Console.WriteLine("Hello Devs");
```

This is equivalent to:
```csharp
public class Program {
    public static void Main(string[] args) {
        Console.WriteLine("Hello Devs");
    }
}
```

**Command-line arguments via `args`:**
```csharp
var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
```

Execute with:
```bash
dotnet run HelloDevs.cs -- Kevin
// Output: Hello, Kevin!
```

**Important:** The `--` separates `dotnet` arguments from your app's arguments.

---

### 2.3 Implicit Usings (.NET 10 Feature)

File-based apps automatically include common namespaces **without explicit `using` statements**:

```csharp
// No 'using System;' needed
Console.WriteLine("Works automatically");
```

Included implicitly:
- `System`
- `System.Collections.Generic`
- `System.Linq`
- `System.Text`
- `System.Threading.Tasks`

---

### 2.4 THE #: DIRECTIVE SYNTAX (CRITICAL FOR EXAMS)

**SYNTAX RULE:** `#:` with **NO SPACE** after the colon. This is highly MCQ-testable.

#### `#:package` Directive

Import NuGet packages inline without separate package management:

```csharp
#:package Spectre.Console@0.49.1

using Spectre.Console;

var table = new Table();
table.Title = new TableTitle("[bold green]Cities[/]");
table.Border = TableBorder.Rounded;
```

**Format:** `#:package PackageName@version`

**Execution:** `dotnet run filterStudents.cs`

When NuGet packages are declared with `#:package`, they're:
- Downloaded on first run
- Cached in the runfile directory
- Resolved as dependencies automatically

**Example from lab:**
```csharp
#:package Spectre.Console@0.49.1
```

#### `#:property` Directive

Set MSBuild properties inline:

```csharp
#:property TargetFramework=net9.0

var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
```

**Common properties:**
- `TargetFramework=net10.0` — specify .NET version
- `LangVersion=preview` — use preview language features
- `Nullable=enable` — enforce nullable reference types

**Example:**
```csharp
#:property LangVersion=preview
#:property Nullable=enable
```

#### `#:sdk` Directive

Select an SDK/workload:

```csharp
#:sdk Microsoft.NET.Sdk.Web
```

**Common SDKs:**
- `Microsoft.NET.Sdk` (default console app)
- `Microsoft.NET.Sdk.Web` (for ASP.NET Core / minimal APIs)
- `Microsoft.NET.Sdk.BlazorWebAssembly` (Blazor WASM)

**When to use:** Essential for web APIs, ASP.NET Core features, dependency injection.

#### `#:project` Directive

Reference a local class library:

```csharp
#:project ./MyLibrary/MyLibrary.csproj

using MyLibrary;

var person = new Person {
    FirstName = "John",
    LastName = "Doe",
    Email = "john.doe@example.com",
    DateOfBirth = new DateTime(1990, 1, 1)
};
Console.WriteLine($"Name: {person.FirstName} {person.LastName}");
```

Allows file-based apps to use compiled libraries while remaining single-file.

---

### 2.5 File-Based Minimal Web API Example

Create a web server in a single `.cs` file:

**Files required:**
- `WebApi.cs` (main application)
- `webapi.appsettings.json` (configuration, mirrors appsettings.json)
- `webapi.run.json` (launch settings, mirrors launchSettings.json)

**WebApi.cs:**
```csharp
#!/usr/bin/env dotnet

#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

var settingsFile = $"{builder.Environment.ApplicationName}.appsettings.json";
builder.Configuration.AddJsonFile(settingsFile, optional: true, reloadOnChange: true);

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapGet("/", () => new HelloResponse { Message = "Hello, World!" })
    .WithName("HelloWorld");

app.Run();

[JsonSerializable(typeof(HelloResponse))]
internal partial class AppJsonSerializerContext : JsonSerializerContext { }

public record HelloResponse {
    public string Message { get; init; } = string.Empty;
}
```

**Run:**
```bash
dotnet run WebApi.cs
# Server listens on http://localhost:5145
```

**Key directives here:**
- `#:sdk Microsoft.NET.Sdk.Web` — enables ASP.NET Core features
- `#:package Microsoft.AspNetCore.OpenApi@10.0.0` — for API documentation

---

## 3. HOW FILE-BASED EXECUTION WORKS (RUNTIME)

### Step-by-Step Execution Flow

1. **Detection:** CLI identifies `.cs` file extension
2. **Implicit Project Creation:** Generates temporary project metadata based on:
   - `#:sdk` directive (if present; defaults to `Microsoft.NET.Sdk`)
   - `#:property` settings
   - `#:package` declarations
3. **Dependency Resolution:** 
   - Evaluates all `#:package` directives
   - Downloads NuGet packages (cached)
   - Resolves transitive dependencies
4. **Compilation:** 
   - Compiles `.cs` file + implicit usings + referenced packages
   - In-memory compilation (no persistent `bin/obj`)
5. **Execution:** 
   - Runs compiled assembly directly
   - Passes `args` to application
6. **Caching:** 
   - Stores compiled binaries in `~/.dotnet/runfile/`
   - Subsequent runs use cache if source unchanged

### Environment Variables Available

From Example 3, file-based apps can access:

```csharp
Console.WriteLine(Environment.CurrentDirectory);
Console.WriteLine(AppContext.GetData("EntryPointFilePath")); // Path to .cs file
Console.WriteLine(AppContext.BaseDirectory); // Cached runfile bin directory
```

---

## 4. FILE-BASED → PROJECT CONVERSION

### Converting to Traditional .csproj Project

Once prototyping is done, convert a file-based app to a full project:

```bash
dotnet project convert webapi.cs -o ../DemoWebAPI
```

This creates:
- `.csproj` file with all directives converted to MSBuild properties
- `Program.cs` with top-level statements
- `appsettings.json` and `launchSettings.json`
- Full project directory structure

**When to convert:**
- Scaling beyond single file
- Adding multiple source files
- Integration with CI/CD pipelines
- Production deployment requirements
- Team collaboration (projects integrate with VCS)

---

## 5. SHELL SHEBANG FOR EXECUTABLE SCRIPTS (macOS/Linux)

Make `.cs` files directly executable:

```csharp
#!/usr/bin/env dotnet

var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
```

**Setup (macOS/Linux only):**
```bash
chmod +x HelloDevs.cs
ls -l HelloDevs.cs
# Output: -rwxr-xr-x@ 1 user staff 108 Nov 17 10:48 HelloDevs.cs
```

**Execute directly (no `dotnet run` needed):**
```bash
./HelloDevs.cs Kevin
# Output: Hello, Kevin!
```

**You can drop the `.cs` extension:**
```bash
cp HelloDevs.cs HelloDevs
./HelloDevs World
# Output: Hello, World!
```

---

## 6. LIMITATIONS & CONSTRAINTS

### Cannot Do (Single-File Only)

- **Multiple source files:** All code must be in one `.cs` file
- **Part of a solution:** File-based apps are standalone; can't be `<ProjectReference>` in a `.sln`
- **Persistent build artifacts:** `bin/` and `obj/` are cached but inaccessible
- **Complex project structure:** No NuGet package authoring, no SDK extensions

### IDE/Debugging Support

- **VS Code:** Full support with C# extension; can debug with breakpoints
- **Visual Studio:** Limited support; easier to convert to project first
- **Rider:** Supports editing; debugging works post-conversion

### .NET Version Requirements

- **Minimum:** .NET 5.0 (initial support)
- **Enhanced in:** .NET 6, 7, 8, 9
- **Latest features:** .NET 10 (preview language features with `#:property LangVersion=preview`)

---

## 7. PRACTICAL LAB EXAMPLE: FilteredStudents

**Objective:** Read JSON file, filter by keyword, display in formatted table.

**Implementation:**

```csharp
#:package Spectre.Console@0.49.1

using Spectre.Console;
using System.Text.Json;

// Load students from JSON
var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize<List<Student>>(json);

// Get filter from command-line argument
var filter = args.Length > 0 ? args[0].ToLower() : "";

// Filter students
var filtered = students
    .Where(s => s.FirstName.ToLower().Contains(filter) ||
                s.LastName.ToLower().Contains(filter) ||
                s.School.ToLower().Contains(filter) ||
                s.DateOfBirth.Year.ToString().Contains(filter))
    .ToList();

// Display results in table
var table = new Table();
table.Title = new TableTitle($"[bold]Students Matching '{filter}' ({filtered.Count})[/]");
table.Border = TableBorder.Rounded;
table.AddColumn("[bold]ID[/]");
table.AddColumn("[bold]First Name[/]");
table.AddColumn("[bold]Last Name[/]");
table.AddColumn("[bold]School[/]");
table.AddColumn("[bold]Gender[/]");
table.AddColumn("[bold]DOB[/]");

foreach (var student in filtered) {
    table.AddRow(
        student.Id.ToString(),
        student.FirstName,
        student.LastName,
        student.School,
        student.Gender,
        student.DateOfBirth.ToShortDateString()
    );
}

AnsiConsole.Write(table);

public record Student {
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string School { get; set; }
    public string Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
}
```

**Execute:**
```bash
dotnet run filterStudents.cs -- medicine
dotnet run filterStudents.cs -- 2002
dotnet run filterStudents.cs -- liz
```

---

## 8. EXAM TRAPS & COMMON MISCONCEPTIONS

### Trap 1: `#:` Directive Spacing
❌ WRONG: `#: package Spectre.Console@0.49.1` (space after colon)  
✓ CORRECT: `#:package Spectre.Console@0.49.1` (no space)

**Why it matters:** Compiler treats `#: ` as invalid syntax. High MCQ likelihood.

### Trap 2: .NET Version Requirements
File-based apps require **.NET 5.0 or newer**. Cannot use on older frameworks.

Default target in file-based mode is latest installed .NET version.

### Trap 3: Package Versioning
```csharp
#:package Spectre.Console@0.49.1  // Exact version (preferred)
#:package Spectre.Console         // Latest version (not typical in exam context)
```

### Trap 4: Confusing `#:sdk` with Project Type
```csharp
#:sdk Microsoft.NET.Sdk           // Console app (default)
#:sdk Microsoft.NET.Sdk.Web       // Web/API app (required for ASP.NET Core)
```

If you try to use `WebApplication.CreateBuilder()` without `#:sdk Microsoft.NET.Sdk.Web`, compilation fails.

### Trap 5: File-Based Cannot Be Part of Solution
Once you need multiple files or integration with other projects, **you must convert to `.csproj`:**
```bash
dotnet project convert filename.cs -o OutputFolder
```

### Trap 6: Implicit Usings vs. Explicit
Beginners might assume `using System;` is needed. It's **automatic in file-based apps** and **in modern project templates**.

### Trap 7: Converting Directives
When converting to project:
- `#:package X@1.0` → `<PackageReference>` in `.csproj`
- `#:property X=Y` → MSBuild `<PropertyGroup>` in `.csproj`
- `#:sdk X` → `<Sdk>` attribute in `.csproj` root element

---

## 9. FLASHCARDS (SuperMemo 20 Rules)

### Card 1 | [Remember] | Source: file-based-apps.docx
**Q:** What command runs a file-based C# app named `app.cs`?  
**A:** `dotnet run app.cs`  
**Why it matters:** Foundation command for all file-based app execution.

### Card 2 | [Remember] | Source: file-based-apps.docx
**Q:** What is the correct syntax for importing a NuGet package in a file-based app?  
**A:** `#:package PackageName@version` (no space after colon)  
**Why it matters:** Syntax is frequently tested; spacing is a common error.

### Card 3 | [Remember] | Source: file-based-apps.docx
**Q:** What .NET version first introduced file-based apps?  
**A:** .NET 5.0  
**Why it matters:** Establishes minimum compatibility requirement.

### Card 4 | [Understand] | Source: file-based-apps.docx
**Q:** When running `dotnet run app.cs -- arg1 arg2`, what does `--` signify?  
**A:** Separator between dotnet CLI arguments and application arguments  
**Why it matters:** Required for passing command-line args to the application.

### Card 5 | [Understand] | Source: file-based-apps.docx
**Q:** Why don't file-based apps create visible `bin/` and `obj/` directories?  
**A:** Compilation artifacts are cached in `~/.dotnet/runfile/` instead  
**Why it matters:** Explains the cleaner file structure vs. traditional projects.

### Card 6 | [Remember] | Source: file-based-apps.docx
**Q:** Which `#:` directive is required to use ASP.NET Core features like `WebApplication.CreateBuilder()`?  
**A:** `#:sdk Microsoft.NET.Sdk.Web`  
**Why it matters:** Essential for minimal web API file-based apps.

### Card 7 | [Remember] | Source: file-based-apps.docx
**Q:** What does `#:property LangVersion=preview` allow?  
**A:** Use of preview C# language features  
**Why it matters:** Enables modern syntax in file-based contexts.

### Card 8 | [Remember] | Source: file-based-apps.docx
**Q:** On macOS/Linux, what command makes a `.cs` file directly executable?  
**A:** `chmod +x filename.cs`  
**Why it matters:** Enables shebang-based direct execution without `dotnet run`.

### Card 9 | [Understand] | Source: file-based-apps.docx
**Q:** In a file-based app, what namespaces are implicitly available without `using` statements?  
**A:** System, System.Collections.Generic, System.Linq, System.Text, System.Threading.Tasks  
**Why it matters:** Understand implicit usings to avoid `using` statement clutter.

### Card 10 | [Apply] | Source: file-based-apps-lab.docx
**Q:** To filter student JSON data and display results in a colored table, which NuGet package is used?  
**A:** Spectre.Console  
**Why it matters:** Demonstrates practical package integration in file-based apps.

### Card 11 | [Remember] | Source: file-based-apps.docx
**Q:** What syntax converts a file-based app to a traditional `.csproj` project?  
**A:** `dotnet project convert filename.cs -o OutputFolder`  
**Why it matters:** Required when scaling beyond single-file prototype.

### Card 12 | [Understand] | Source: file-based-apps.docx
**Q:** When using `#:project ./MyLibrary/MyLibrary.csproj`, what does this directive enable?  
**A:** Referencing and using types from a local class library  
**Why it matters:** Allows file-based apps to integrate with compiled libraries.

### Card 13 | [Remember] | Source: file-based-apps.docx
**Q:** In a file-based web API, what file mirrors the function of `launchSettings.json`?  
**A:** `webapi.run.json`  
**Why it matters:** Specifies launch profiles and environment configuration.

### Card 14 | [Understand] | Source: file-based-apps.docx
**Q:** What is stored in `~/.dotnet/runfile/` after running a file-based app?  
**A:** Compiled binaries and cached artifacts for subsequent executions  
**Why it matters:** Explains performance optimization and disk usage.

### Card 15 | [Apply] | Source: file-based-apps.docx
**Q:** How do you specify a target .NET version in a file-based app?  
**A:** `#:property TargetFramework=net10.0`  
**Why it matters:** Allows version-specific features and API access.

---

## 10. PRACTICE EXAM: 8 MARKS (6-8 MCQ)

### MOCK EXAM: FILE-BASED C# APPS

**Instructions:** Answer all questions. Each MCQ is worth 1-2 marks. Total = 8 marks.  
**Time:** 15 minutes

---

#### **Question 1** (1 mark) | Syntax
Which statement correctly imports the Spectre.Console NuGet package in a file-based app?

A) `#: package Spectre.Console@0.49.1`  
B) `#:package Spectre.Console@0.49.1`  
C) `using #:package Spectre.Console@0.49.1;`  
D) `<PackageReference Include="Spectre.Console" Version="0.49.1" />`

**Correct Answer:** B  
**Explanation:**
- A: Incorrect spacing (space after `#:`). Syntax error.
- **B: Correct.** No space between `#:` and `package`.
- C: Incorrect syntax; mixing `using` with `#:package`.
- D: XML syntax for `.csproj`; not valid in `.cs` files.

---

#### **Question 2** (1 mark) | Execution & Arguments
When running `dotnet run filterStudents.cs -- medicine`, what does `--` do?

A) Continues the application in background mode  
B) Separates dotnet CLI arguments from application arguments  
C) Indicates a comment line in the .cs file  
D) Declares a new variable with the name `medicine`

**Correct Answer:** B  
**Explanation:**
- A: No such feature in `dotnet run`.
- **B: Correct.** The `--` is a standard CLI separator.
- C: Comments in C# use `//` or `/* */`.
- D: Incorrect; `--` is not a variable declaration syntax.

---

#### **Question 3** (1 mark) | SDK Selection
Which `#:` directive is **required** to create a minimal web API in a file-based app?

A) `#:sdk Microsoft.NET.Sdk`  
B) `#:sdk Microsoft.NET.Sdk.Web`  
C) `#:property WebApplication=true`  
D) `#:package Microsoft.AspNetCore.App`

**Correct Answer:** B  
**Explanation:**
- A: Default SDK; doesn't include ASP.NET Core features.
- **B: Correct.** Web SDK provides `WebApplication.CreateBuilder()` and related APIs.
- C: Not a valid directive.
- D: Package reference alone isn't sufficient; must use Web SDK.

---

#### **Question 4** (1 mark) | File-Based Limitations
Why can a file-based C# app NOT be part of a `.sln` solution?

A) File-based apps don't support C# 12+ features  
B) File-based apps are standalone; they can't be `<ProjectReference>` items  
C) The `.sln` file format is incompatible with `.cs` extensions  
D) File-based apps require a `project.json` file instead

**Correct Answer:** B  
**Explanation:**
- A: False; they support modern C# features.
- **B: Correct.** File-based apps have no project structure; solutions reference `.csproj` files.
- C: Solutions can reference any project type.
- D: `project.json` is legacy (.NET Core 1.x); modern approach uses `.csproj`.

---

#### **Question 5** (1 mark) | Property Directive
What is the purpose of `#:property LangVersion=preview`?

A) Upgrade the minimum .NET Framework version  
B) Enable use of preview C# language features  
C) Set the application's versioning scheme  
D) Configure HTTP/2 protocol support

**Correct Answer:** B  
**Explanation:**
- A: Use `TargetFramework` property for .NET version.
- **B: Correct.** `LangVersion=preview` enables cutting-edge C# syntax.
- C: Version is typically set elsewhere (e.g., `<Version>` in `.csproj`).
- D: Protocol configuration is separate.

---

#### **Question 6** (1 mark) | Conversion
What command converts a file-based app `app.cs` to a traditional `.csproj` project?

A) `dotnet migrate app.cs`  
B) `dotnet project convert app.cs -o OutputFolder`  
C) `dotnet new console -o OutputFolder -p app.cs`  
D) `cp app.cs OutputFolder/ && dotnet new csproj`

**Correct Answer:** B  
**Explanation:**
- A: `migrate` command doesn't exist for this purpose.
- **B: Correct.** Exact syntax for conversion.
- C: `dotnet new` creates templates; doesn't convert existing files.
- D: Manual file copy doesn't create proper project structure.

---

#### **Question 7** (1 mark) | Shebang & Direct Execution (macOS/Linux)
On macOS, to run a `.cs` file directly as an executable (e.g., `./app.cs` instead of `dotnet run app.cs`), what two steps are needed?

A) Add `#!/usr/bin/env dotnet` and run `chmod +x app.cs`  
B) Rename the file to `app` and add `using System;`  
C) Create a symbolic link and set `EXECUTABLE` environment variable  
D) Convert to `.csproj` and compile with `dotnet build`

**Correct Answer:** A  
**Explanation:**
- **A: Correct.** Shebang line + executable permission.
- B: Renaming alone doesn't enable execution; shebang is required.
- C: Symbolic links don't grant execution; permissions are needed.
- D: Unnecessary; file-based apps work without compilation step.

---

#### **Question 8** (2 marks) | Integration & Practical Application
A developer creates a file-based app that uses `WebApplication.CreateBuilder(args)` but forgets to include a required `#:` directive. The app fails to compile with an error about missing namespace. Which directive was forgotten, and why is it necessary?

A) `#:property TargetFramework=net10.0`; specifies .NET version  
B) `#:sdk Microsoft.NET.Sdk.Web`; includes ASP.NET Core assemblies  
C) `#:package Microsoft.AspNetCore@10.0.0`; imports the NuGet package  
D) `#:property Nullable=enable`; enables nullable reference types

**Correct Answer:** B  
**Explanation:**
- A: While `TargetFramework` is useful, it doesn't provide ASP.NET Core APIs.
- **B: Correct.** The Web SDK is **required** to reference `WebApplication` class. Without it, the compiler doesn't link ASP.NET Core assemblies.
- C: Package reference alone is insufficient; the SDK must be active to expose the APIs.
- D: Nullable doesn't relate to missing ASP.NET Core namespaces.

---

### SCORING RUBRIC

| Question | Mark(s) | Difficulty |
|----------|---------|------------|
| 1        | 1       | Remember   |
| 2        | 1       | Understand |
| 3        | 1       | Understand |
| 4        | 1       | Understand |
| 5        | 1       | Understand |
| 6        | 1       | Apply      |
| 7        | 1       | Apply      |
| 8        | 2       | Apply      |
| **TOTAL** | **8** | — |

---

## 11. KEY SYNTAX QUICK REFERENCE

```csharp
// 1. Basic file-based app
Console.WriteLine("Hello Devs");

// 2. Command-line arguments
var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");

// 3. NuGet package import
#:package Spectre.Console@0.49.1
using Spectre.Console;

// 4. Target .NET version
#:property TargetFramework=net10.0

// 5. Preview language features
#:property LangVersion=preview

// 6. Web API setup
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

// 7. Class library reference
#:project ./MyLibrary/MyLibrary.csproj

// 8. Shebang for direct execution (macOS/Linux)
#!/usr/bin/env dotnet

// 9. Access file path at runtime
var filePath = AppContext.GetData("EntryPointFilePath");
var baseDir = AppContext.BaseDirectory;

// 10. Convert to project
// dotnet project convert filename.cs -o OutputFolder
```

---

## 12. STUDY STRATEGY FOR EXAM

**High-priority topics (likely on exam):**
1. Syntax of `#:package`, `#:property`, `#:sdk` directives (NO SPACE AFTER `#:`)
2. Difference between `Microsoft.NET.Sdk` and `Microsoft.NET.Sdk.Web`
3. Running file-based apps: `dotnet run file.cs`
4. Command-line argument handling with `--` separator
5. Conversion process: `dotnet project convert`

**Medium-priority:**
6. Implicit usings and top-level statements
7. Shebang execution on macOS/Linux
8. Cache location and performance implications
9. NuGet package versioning in `#:package`

**Lower-priority (but still fair game):**
10. Direct API exploration (e.g., `AppContext.GetData("EntryPointFilePath")`)
11. File-based minimal web API configuration files
12. Project referencing with `#:project`

**Practice approach:**
- Drill directive syntax until it's automatic.
- Memorize the three primary SDKs.
- Understand WHY `#:sdk Microsoft.NET.Sdk.Web` is required for web APIs.
- Practice command-line argument parsing.
- Know the conversion command by heart.

---

## REFERENCES

- **Slides:** file-based-apps.pptx
- **Notes:** file-based-apps.docx
- **Lab:** W11 File Based C# Apps (FilteredStudents example)
- **Official:** https://www.youtube.com/watch?v=KjqePh3naKQ
- **NuGet Tab:** New "File-based Apps" category on nuget.org

---

**Document Generated:** April 18, 2026  
**Exam Date:** COMP4870 Final Exam  
**Total Study Time Recommended:** 2-3 hours for 8 marks  
