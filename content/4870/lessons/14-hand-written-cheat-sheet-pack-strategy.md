---
"n": 14
id: 4870-lesson-hand-written-cheat-sheet-pack-strategy
title: "Hand-written cheat sheet: pack strategy"
hook: ONE 8.5×11, both sides. Hand-written. What goes on it decides 10-15 marks.
tags:
  - cheat-sheet
module: Exam prep
---

Your cheat sheet is the force multiplier. Pack it right and it answers 15+ MCQ directly.

**Front side layout (suggested):**

-   **Upper-left:** AI/SK/MAF/MCP method cheat block — `Kernel.CreateBuilder`, `AddOllamaChatCompletion`, `ChatHistory`, `IChatCompletionService`, `AsAIAgent`, `AIFunctionFactory.Create`.
-   **Upper-right:** ML.NET 7-step template — `MLContext` → `LoadFromTextFile<T>` → `TrainTestSplit` → pipeline → `Fit` → `Evaluate` → `Save`.
-   **Middle:** Cache patterns — MemoryCache, Redis, `<cache>` tag helper with all vary-by-\* options.
-   **Lower:** gRPC .proto skeleton + server/client Program.cs + csproj `<Protobuf>` line.

**Back side layout (suggested):**

-   xUnit: `[Fact]`, `[Theory]`, `[InlineData]`, `Assert.Equal(expected,actual)`, `Assert.Throws<T>`.
-   File-based: all four `#:` directives with EXAMPLE syntax.
-   Aspire: AppHost Program.cs with `AddProject`, `WithReference`, `AddRedis`, `AddSqlServer`.
-   Localization: `AddLocalization`, resource file naming, CurrentCulture vs CurrentUICulture.
-   Tag Helpers: built-in list + custom class skeleton.
-   QuickGrid: PropertyColumn + PaginationState + filter @bind pattern.
-   Excel/PDF: package names + MIME strings.

> **Analogy**
>  The cheat sheet is like your free souvenir from the topic. Bring back concrete method chains and exact syntax — not prose.

#### Suggested cheat-sheet layout

flowchart TB
  subgraph FRONT\["FRONT SIDE"\]
    F1\["AI/SK/MAF/MCP
method names"\]
    F2\["ML.NET 7-step
pipeline template"\]
    F3\["Cache patterns
vary-by-\* list"\]
    F4\["gRPC proto + server
+ client skeleton"\]
  end
  subgraph BACK\["BACK SIDE"\]
    B1\["xUnit \[Fact\] \[Theory\]
Assert methods"\]
    B2\["#:package #:sdk
#:property"\]
    B3\["Aspire AddProject
WithReference"\]
    B4\["Localization setup
TagHelpers + QuickGrid
Excel/PDF MIME"\]
  end
      

> **Note**
> **Takeaway —** Cheat sheet = method names + exact syntax + package names. Not definitions. Not prose.
