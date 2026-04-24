---
n: 0
id: "4870-exam-strategy"
title: "Exam strategy and pitfalls"
hook: "Time allocation, top pitfalls, when to skip."
kind: strategy
tags: [strategy, exam-prep]
module: "Exam prep"
source: "courses/COMP4870/4870 final exam details.txt + materials/past-exams/midterm_exam_questions.md + materials/notes/* + generated/exam-study/research-*.md"
bloom_levels: [analyze, evaluate]
related: [ai-agent-framework, ml-pipeline-workflow, ai-semantic-kernel]
---

## The exam in one sentence

80 marks, 60 minutes, single room (SE12-327), Friday 2026-04-24 10:30–11:30 AM. Bring one hand-written 8.5" × 11" cheat sheet — both sides fair game.

## Format and marks

| Section | Count | Marks each | Section marks | Time budget |
|---|---:|---:|---:|---:|
| Multiple choice | 60 | 1 | 60 | ~40 min |
| Match two columns | 10 | 1 | 10 | ~5 min |
| Coding question | 1 | 10 | 10 | ~12 min |
| Review / skipped | — | — | — | ~3 min |
| **Total** | **71** | — | **80** | **60 min** |

The MCQ + match pool covers 11 pre-announced topics. The coding question's topic is not announced — assume it comes from one of the heavy buckets (AI, ML.NET, Cache/Redis, File-based apps, or gRPC).

## Topic weights — where the marks live

```text
AI ................ 13 marks (16%)   ← heaviest; MAF + Semantic Kernel + SLM/Ollama
ML.NET ............ 12 marks (15%)   ← pipeline + metrics
Cache/Redis ....... 8 marks  (10%)
File-based apps ... 8 marks  (10%)
gRPC .............. 7 marks  (9%)
TDD ............... 6 marks  (8%)
Aspire ............ 5 marks  (6%)
Localization ...... 4 marks  (5%)
Tag Helpers ....... 3 marks  (4%)
Blazor (QuickGrid)  2 marks  (3%)
Excel/PDF/Chart ... 2 marks  (3%)
```

Study proportionally. If the cheat sheet is 8.5" × 11" double-sided, AI + ML.NET + Cache/Redis together deserve ~40% of the real estate.

## Time allocation per question

The 60-minute clock breaks down as 45 seconds per mark. In practice, not every mark burns 45 seconds — MCQ/match questions average ~40 seconds; the coding question gets the remaining block.

**MCQ rhythm.** Read the stem twice. If the answer leaps out within 15 seconds, commit and move on. If not, eliminate the two most obviously wrong choices, mark the remaining two with a dot on the paper, and move on. Come back to dotted questions in the review pass.

**Match rhythm.** Scan all 10 pairs before committing to any. Start with pairs where one side is unique jargon (e.g. a specific CLI command, a specific NuGet package). Work from certainty outward.

**Coding rhythm.** Read the prompt fully before touching the pen. Sketch the signature, write the body, then cross-check edge cases. Twelve minutes is tight — don't aim for the most elegant solution, aim for the most correct one.

## When to skip and return

Skip any question that:
- Burns more than 90 seconds without a clear path. Two skipped questions cost ~90 seconds; two wrong-but-committed questions cost 2 marks. Skipping is cheaper.
- Hinges on a term you genuinely don't recognize. Distractors target confusion; without a foothold, guessing among five options is a 20% hit rate.
- Uses a code-fence stem longer than five lines. These are traps dressed as tests — come back when your head is fresh.

Mark skips with a single dot in the margin. At minute 45, do a focused review pass on dotted questions only.

## Top pitfalls — by topic

Every pitfall below is sourced from lecture scripts, research notes, or the midterm's distractor patterns. No invented hazards.

**Pitfall 1 — `#:package` has no space after the colon.**
`#: package Spectre.Console@0.49.1` is a syntax error. The correct form is `#:package Spectre.Console@0.49.1`. Expect at least one distractor option presenting the spaced form as plausible. Source: `notes/file-based-apps.docx`; `research-file-based.md §directives`.

**Pitfall 2 — `IMemoryCache` does not survive a web farm.**
When asked "which cache abstraction works across multiple app servers behind a load balancer," the answer is `IDistributedCache` (backed by Redis), not `IMemoryCache`. `IMemoryCache` is per-process; each server holds its own copy, so data written on server A is invisible on server B. Source: `notes/DataCache_SCRIPT.docx`; `research-cache.md §architecture`.

**Pitfall 3 — ML.NET trainers look for a column literally named `"Features"`.**
`mlContext.Transforms.Concatenate(outputColumnName: "Features", …)` — the string `"Features"` is not a convention, it's a contract. Rename it to `"Input"` or `"X"` and `FastTree()` cannot find the input. Same goes for `"Label"` on the target side. Source: `slides/ML.NET.pptx p.14`; `research-mlnet.md §transforms`.

**Pitfall 4 — `CurrentCulture` and `CurrentUICulture` are not the same thing.**
`CurrentCulture` drives date, number, and currency formatting. `CurrentUICulture` drives which `.resx` file loads. Setting only one produces a page where numbers are translated but text is not (or vice versa). `UseRequestLocalization()` sets both when configured correctly; forgetting the middleware call leaves both at system default. Source: `notes/razor_pages_localization_SCRIPT.docx`; `research-localization.md`.

**Pitfall 5 — `AddServiceDefaults()` belongs in each service's `Program.cs`, NOT in the AppHost.**
The AppHost's `Program.cs` calls `DistributedApplication.CreateBuilder(args)` and then `.AddProject<>()`. Each individual service's `Program.cs` calls `builder.AddServiceDefaults()` to pick up service discovery, OpenTelemetry, and health endpoints. Swapping these breaks the boot. Source: `notes/aspire_SCRIPT.docx`; `research-aspire.md §defaults`.

## Domain-specific traps — beyond the top 5

**MemoryStream position.** When returning a `FileStreamResult` for a PDF or XLSX you just wrote into a `MemoryStream`, set `ms.Position = 0` before returning. Skip the reset and the client downloads an empty file. Source: `research-excel-pdf-chart.md §pdf`.

**iText7 + bouncy-castle-adapter.** iText7 alone won't run — you need both `iText7` AND `itext.bouncy-castle-adapter` NuGet packages. Forgetting the adapter produces a cryptic runtime error, not a build error. Source: `research-excel-pdf-chart.md`.

**xUnit `Assert.Equal(expected, actual)` argument order.** Expected first, actual second. Reversing produces backwards error messages that waste debugging time. The argument order is not enforced by the compiler. Source: `slides/TDD_xunit.pptx`.

**Protocol Buffer field tags are permanent.** Reusing a tag number for a different field breaks every deployed client that hasn't recompiled. Tags 1–15 are also special — they encode in one byte; tags 16+ take two. Source: `research-grpc.md`.

**ClosedXML cell indexing is 1-based.** `worksheet.Cell(1, 1)` is the top-left cell. Not `(0, 0)`. Source: `Labs/W13 Excel, PDF, Chart cocktail/Excel, PDF, Chart cocktail.html`.

**Route attribute syntax uses parentheses, not brackets.** `[Route("api/[controller]")]` is correct. `[Route["api/[controller]"]]` is a midterm distractor pattern (Q7) — it uses C# indexer syntax instead of method-call syntax. Carries forward into any final-exam routing question. Source: `materials/past-exams/midterm_exam_questions.md Q7`.

**Blazor `TemplateColumn` needs `SortBy=`, not `Sortable=`.** `PropertyColumn` accepts `Sortable="true"` directly. `TemplateColumn` ignores `Sortable` — you must supply `SortBy="@GridSort<T>.ByAscending(x => x.Name)"` to make it sortable. Source: `notes/BlazorServer_QuickGrid.docx`; Labs/W07.

**AI endpoint confusion.** Ollama runs at `http://localhost:11434` (HTTP, no path). GitHub Models runs at `https://models.github.ai/inference` (HTTPS, has `/inference` path). Azure OpenAI uses your deployment-specific URL plus a deployment name. Mixing these is a distractor gift. Source: `notes/AI-Models_MAF_SCRIPT.docx`.

**`.AsAIAgent()`, not `.AsAgent()`.** The MAF method to wrap an `IChatClient` into an agent is literally `.AsAIAgent()`. `.AsAgent()` doesn't exist. Source: `research-ai.md §maf`.

## Off-by-one, unit, and ordering traps specific to this course

- **`ClosedXML` cells are 1-based**; C# arrays and `List<T>` are 0-based. Mixing these breaks row/column math.
- **`[LoadColumn(0)]` on the first column** of a CSV in ML.NET is 0-based despite ClosedXML's opposite convention. Don't generalize across libraries.
- **Protobuf field tags start at 1**, not 0. Tag 0 is reserved.
- **Port 11434 for Ollama, 6379 for Redis, 1433 for SQL Server, 5432 for Postgres.** Aspire tends to pick ephemeral ports unless overridden — don't memorize ports for Aspire-managed services; memorize for stand-alone Docker runs.

## Cheat-sheet packing priorities

Given one 8.5" × 11" page, two sides, prioritize this order. Items above the cut line are high-leverage per mark; below the cut line are nice-to-haves if space permits.

1. **ML.NET pipeline skeleton** — every token of `LoadFromTextFile → Concatenate("Features") → FastTree().Fit(data)`. Boilerplate you shouldn't derive under time pressure.
2. **MAF + Ollama 10-line boot snippet** — `OllamaApiClient` → `.AsIChatClient()` → `ChatClientAgent` → `.RunAsync`.
3. **`GetOrSetAsync` signature + absolute/sliding expiration option object.**
4. **`.proto` file template** — `syntax = "proto3"; service Foo { rpc Bar (X) returns (Y); } message X { int32 id = 1; }`.
5. **Aspire AppHost skeleton** — `CreateBuilder → AddProject<>("name") → WithReference → WaitFor`.
6. **`[HtmlTargetElement]` + `ProcessAsync` signature** for a tag helper.
7. **Localization setup three calls** — `AddLocalization`, `AddViewLocalization`, `UseRequestLocalization`.
8. **File-based apps directive quick-reference** — four directive forms, no-space-after-colon reminder.
9. **xUnit attribute cheat row** — `[Fact]`, `[Theory]` + `[InlineData(...)]`.
10. **QuickGrid column syntax** — `PropertyColumn` vs `TemplateColumn` with `SortBy`.
11. **ClosedXML `worksheet.Cell(r, c).Value = x; wb.SaveAs(stream)` one-liner.**
12. **iText7 `PdfWriter → PdfDocument → Document` three-line open; `doc.Close()` close.**

Do NOT waste space on:
- Anything you can reason about in under 30 seconds from a memorized concept (e.g. "what's a Bloom filter" — no, skip that, it's not on the exam anyway).
- Full paragraphs of prose — the cheat sheet is for code skeletons and naming conventions, not textbook passages.
- Topics from the midterm (Razor, MVC, EF foundations, Identity, JWT, SignalR) — they're **out of scope** for the final.

> **Pitfall**
> The midterm covered Razor Pages, MVC, Entity Framework foundations, Identity, JWT, and SignalR — none of those are on the final. If the cheat sheet you prepared for midterms is still in your head, consciously drop it. Re-studying midterm material costs time you need for AI + ML.NET.

> **Takeaway**
> The final rewards *specific* recall of NuGet names, CLI shapes, and API method names. 70% of MCQ distractors are subtle renames of the correct answer. A cheat sheet that lists exact names and exact call signatures beats a cheat sheet that explains concepts. Teach yourself to flip to the sheet fast enough that the 60-second-per-question budget holds.
