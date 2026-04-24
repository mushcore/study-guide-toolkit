---
name: topic-map-4870
description: Modules + topics + authoring order + practice inventory + structural patterns for COMP 4870 final-exam content authoring
type: project
---

# Topic Map — 4870 (Intranet Planning and Development)

Source merge: `materials/syllabus/4870 course outline.pdf`, `courses/COMP4870/4870 final exam details.txt`, `materials/slides/*.pptx`, `materials/notes/*.docx`, `materials/Labs/**`, `materials/assignments/**`, `materials/past-exams/midterm_exam_questions.md`, `courses/COMP4870/generated/exam-study/research-*.md`, `courses/COMP4870/graphify-out/GRAPH_REPORT.md`.

## Exam meta (for `course.yaml`)

| Field | Value |
|---|---|
| `id` | 4870 |
| `code` | COMP 4870 |
| `name` | Intranet Planning and Development |
| `exam` | 2026-04-24T10:30:00-07:00 |
| `format` | 80 marks · 60 min · 60 MCQ (60 marks) + 10 match-two-columns (10 marks) + 1 coding question (10 marks) |
| `room` | SE12-327 |
| `allowed_materials` | one hand-written 8.5"×11" cheat sheet, both sides |
| `cheatsheet_allowed` | **true** |
| `instructor` | Medhat Elmasry |

## Scope summary

- **11 exam-breakdown topics** (authoritative): TDD (6 marks), gRPC (7), Localization (4), Blazor (2), Tag Helpers (3), ML.NET (12), AI (13), Aspire (5), Cache/Redis (8), File-based apps (8), Excel/PDF/Chart (2) = 70 marks across MCQ + match; +10 coding question not pre-announced.
- **Midterm is structural anchor only** — its topics (Razor/MVC/EF/Identity/JWT/SignalR/MCP/Docker-basics/SQL-Server-admin/React) are out-of-scope for the final. Midterm informs Stage 4 mock-exam style calibration, NOT scope.
- All in-scope topics tagged `in-scope: listed` — the only past-exam (midterm) tests different topics, so "tested" is unused for this course. This is expected.

---

## Modules

### Module 1 — AI in .NET (25 marks, 31% of exam)

| id | name | scope | difficulty | god-node | tags | source anchors |
|---|---|---|---|---|---|---|
| `ai-semantic-kernel` | Semantic Kernel SDK | `listed` | mid | yes (Kernel) | [ai, orchestration, plugins] | slides/CSharp_Meets_AI.pptx p.17–24; notes/AI-Models_MAF_SCRIPT.docx; research-ai.md |
| `ai-chat-completion-local` | Chat completion with Ollama + SLM | `listed` | mid | no | [ai, slm, ollama, streaming] | slides/SLM.pptx; notes/SLM.docx; notes/AI-Models_MAF_SCRIPT.docx; research-ai.md §local |
| `ai-cloud-models` | GitHub Models + Azure OpenAI endpoints | `listed` | low | no | [ai, cloud, auth] | notes/AI-Models_MAF_SCRIPT.docx; slides/CSharp_Meets_AI.pptx p.25–28 |
| `ai-agent-framework` | Microsoft Agent Framework (MAF) + tool calling | `listed` | high | yes (ChatClientAgent) | [ai, agent, function-calling] | notes/AI-Models_MAF_SCRIPT.docx; research-ai.md §maf |
| `ml-pipeline-workflow` | Load → Transform → Concatenate → Train → Evaluate → Predict | `listed` | high | yes (MLContext) | [ml-net, pipeline] | slides/ML.NET.pptx; notes/ML.NET_VS2022_SCRIPT.docx; notes/ML.NET_VSCODE_SCRIPT.docx; research-mlnet.md |
| `ml-data-transforms` | OneHotEncoding, Concatenate("Features"), Label column | `listed` | mid | no | [ml-net, feature-eng] | slides/ML.NET.pptx p.11–18; research-mlnet.md §transforms |
| `ml-regression-evaluation` | FastTree trainer, RMSE, R² metrics | `listed` | mid | no | [ml-net, regression, metrics] | slides/ML.NET.pptx p.20–27; research-mlnet.md §eval |
| `ml-prediction-consumption` | ITransformer, PredictionEngine, model save/load | `listed` | mid | no | [ml-net, inference] | notes/ML.NET_VS2022_SCRIPT.docx; research-mlnet.md §consume |
| `ml-automl-cli` | AutoML CLI (`mlnet regression …`) | `listed` | low | no | [ml-net, automl] | notes/ML.NET_vscode_automl_SCRIPT.docx; research-mlnet.md §automl |

### Module 2 — Distributed Services & Orchestration (12 marks, 15%)

| id | name | scope | difficulty | god-node | tags | source anchors |
|---|---|---|---|---|---|---|
| `grpc-proto-contracts` | `.proto` syntax: service / rpc / message / field tags | `listed` | mid | yes (proto) | [grpc, protobuf, contract-first] | slides/gRPC.pptx; notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx; research-grpc.md |
| `grpc-server-implementation` | ServiceBase inheritance, override async, `ServerCallContext` | `listed` | mid | no | [grpc, server] | notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx; Labs/W09 gRPC/ |
| `grpc-client-consumption` | `GrpcChannel`, client stubs, .csproj `<Protobuf>` `GrpcServices` | `listed` | mid | no | [grpc, client, di] | notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx; Labs/W09 gRPC/gRPC ASP.NET Client1.html |
| `aspire-apphost` | `DistributedApplication.CreateBuilder`, `AddProject`, `WithReference`, `WaitFor` | `listed` | mid | yes (AppHost) | [aspire, orchestration] | notes/aspire_SCRIPT.docx; research-aspire.md |
| `aspire-service-defaults` | `AddServiceDefaults`, health endpoints (`/health` vs `/alive`), OTel | `listed` | low | no | [aspire, observability] | notes/aspire_SCRIPT.docx; research-aspire.md §defaults |
| `aspire-orchestrated-resources` | `AddSqlServer`, `AddRedis`, env-var injection, service discovery | `listed` | mid | no | [aspire, service-discovery, db] | notes/aspire_SCRIPT.docx; research-aspire.md §resources |

### Module 3 — Performance & Caching (11 marks, 14%)

| id | name | scope | difficulty | god-node | tags | source anchors |
|---|---|---|---|---|---|---|
| `cache-abstractions` | `IMemoryCache` vs `IDistributedCache`, web-farm problem | `listed` | mid | yes (IDistributedCache) | [cache, architecture] | slides/redis.pptx; notes/DataCache_SCRIPT.docx; research-cache.md |
| `cache-expiration` | Absolute / Sliding / combined, `CacheItemPriority` | `listed` | mid | no | [cache, ttl] | notes/DataCache_SCRIPT.docx; research-cache.md §expiration |
| `cache-aside-pattern` | `GetOrSetAsync`, JSON serialization, extension methods, invalidation | `listed` | mid | no | [cache, pattern] | notes/DataCache_SCRIPT.docx; notes/redis_SCRIPT.docx; research-cache.md §aside |
| `redis-configuration` | StackExchange.Redis, Docker `localhost:6379`, Azure Redis connection | `listed` | low | no | [redis, docker, config] | slides/redis.pptx; notes/redis_SCRIPT.docx |
| `cache-tag-helper` | `<cache>` Razor fragment caching, `vary-by-*` attributes | `listed` | low | no | [cache, razor, tag-helper] | notes/Cache_Tag_Helper_SCRIPT.docx |
| `taghelper-authoring` | Inherit `TagHelper`, `Process`/`ProcessAsync`, `[HtmlTargetElement]` | `listed` | mid | yes (TagHelper) | [tag-helper, razor] | notes/TagHelpers_SCRIPT.docx; research-taghelpers-blazor.md |
| `taghelper-output-registration` | `output.TagName`/`Attributes`/`Content`, PascalCase → kebab-case, `_ViewImports` `@addTagHelper` | `listed` | low | no | [tag-helper, razor] | notes/TagHelpers_SCRIPT.docx |

### Module 4 — Internationalization & Modern UI (6 marks, 7.5%)

| id | name | scope | difficulty | god-node | tags | source anchors |
|---|---|---|---|---|---|---|
| `localization-setup` | `AddLocalization`, `AddViewLocalization`, `UseRequestLocalization` middleware | `listed` | mid | no | [i18n, middleware] | slides/asp_core_localization.pptx; notes/razor_pages_localization_SCRIPT.docx |
| `localization-resources-cultures` | `.resx` naming, `CurrentCulture` vs `CurrentUICulture`, culture providers order (Query/Cookie/Accept-Language) | `listed` | mid | yes (.resx) | [i18n, culture] | notes/razor_pages_localization_SCRIPT.docx; research-localization.md |
| `localization-injection` | `IStringLocalizer<T>`, `IHtmlLocalizer<T>`, `IViewLocalizer`, shared resources | `listed` | low | no | [i18n, di] | notes/razor_pages_localization_SCRIPT.docx §injection |
| `blazor-quickgrid` | `<QuickGrid>`, `<PropertyColumn>`/`<TemplateColumn>`, `PaginationState`, `GridSort<T>.ByAscending`, filter `@bind:event="oninput"` | `listed` | low | no | [blazor, ui] | notes/BlazorServer_QuickGrid.docx; notes/BlazorWasm_QuickGrid.docx; Labs/W07 QuickGrid |

### Module 5 — .NET 10 Scripts & Reporting (10 marks, 12.5%)

| id | name | scope | difficulty | god-node | tags | source anchors |
|---|---|---|---|---|---|---|
| `file-based-app-basics` | `dotnet run file.cs`, top-level statements, implicit usings, no `.csproj` | `listed` | mid | yes (file-based) | [dotnet-10, scripting] | slides/file-based-apps.pptx; notes/file-based-apps.docx; research-file-based.md |
| `file-based-app-directives` | `#:package`, `#:property`, `#:sdk`, `#:project` (no space after colon) | `listed` | mid | no | [dotnet-10, scripting] | notes/file-based-apps.docx; research-file-based.md §directives |
| `file-based-app-web` | `#:sdk Microsoft.NET.Sdk.Web`, minimal API in a single `.cs` file | `listed` | low | no | [dotnet-10, web, minimal-api] | research-file-based.md §web |
| `excel-export` | ClosedXML, 1-based cell indexing, XLSX MIME, `FileResult` | `listed` | low | no | [excel, report] | Labs/W13 Excel, PDF, Chart cocktail; research-excel-pdf-chart.md |
| `pdf-export` | iText7 + `itext.bouncy-castle-adapter`, `PdfWriter` → `PdfDocument` → `Document`, `FileStreamResult`, reset `MemoryStream` position | `listed` | mid | no | [pdf, itext, report] | Labs/W13; research-excel-pdf-chart.md §pdf |
| `chart-rendering` | Chart.js CDN pie chart, Razor `@:Count.push(@item.Count)` data injection, `new Chart(canvas, {...})` | `listed` | low | no | [chart, js, razor] | Labs/W13; research-excel-pdf-chart.md §chart |

### Module 6 — Testing Discipline (6 marks, 7.5%)

| id | name | scope | difficulty | god-node | tags | source anchors |
|---|---|---|---|---|---|---|
| `tdd-cycle` | Red/Green/Refactor, Robert Martin's 3 Laws of TDD | `listed` | mid | yes (TDD) | [tdd, discipline] | slides/TDD_xunit.pptx; notes/TDD_xunit_SCRIPT.docx; research-tdd.md |
| `xunit-attributes-assertions` | `[Fact]` vs `[Theory]` + `[InlineData]`/`[MemberData]`; `Assert.Equal(expected, actual)`, `Assert.Throws<T>`, `Assert.InRange` | `listed` | mid | yes (xUnit) | [tdd, xunit] | slides/TDD_xunit.pptx; notes/TDD_xunit_SCRIPT.docx; research-tdd.md §xunit |
| `xunit-fixtures-lifecycle` | Constructor + `IDisposable.Dispose()` per-test, `IClassFixture<T>`, `ICollectionFixture<T>` | `listed` | low | no | [tdd, xunit, fixtures] | notes/TDD_xunit_SCRIPT.docx §fixtures; research-tdd.md §lifecycle |

---

## Ranked authoring order (in-scope only)

Order = difficulty × marks weight × god-node centrality. Stage 3 authors top→bottom; drop anything below the line if time runs short.

1. `ai-agent-framework` — high × 13 marks × god-node. MAF is newest and most complex; also highest mark weight.
2. `ml-pipeline-workflow` — high × 12 marks × god-node. Full ML pipeline sequence is the single most exam-able concept in ML.NET.
3. `ai-semantic-kernel` — mid-high × 13 marks × god-node. Kernel orchestration + plugin model; the "C# meets AI" backbone.
4. `cache-aside-pattern` — mid × 8 marks. GetOrSetAsync + invalidation appears in multiple lab/code scenarios.
5. `grpc-proto-contracts` — mid × 7 marks × god-node. Proto file syntax + field tags are bread-and-butter MCQ fodder.
6. `file-based-app-directives` — mid × 8 marks. `#:` directive syntax is new-and-confusing; exam will hit it.
7. `ml-data-transforms` — mid × 12 marks. OneHotEncoding + "Features" naming is a classic trap.
8. `taghelper-authoring` — mid × 3 marks × god-node. Inherits-from-TagHelper pattern is canonical.
9. `aspire-apphost` — mid × 5 marks × god-node. AppHost builder API + `WithReference` is testable.
10. `cache-abstractions` — mid × 8 marks × god-node. IMemoryCache vs IDistributedCache distinction is classic web-farm question.
11. `tdd-cycle` — mid × 6 marks × god-node. 3 Laws + Red/Green/Refactor is recall-heavy.
12. `localization-resources-cultures` — mid × 4 marks × god-node. `.resx` naming + CurrentCulture-vs-UICulture.
13. `xunit-attributes-assertions` — mid × 6 marks × god-node. Fact/Theory + assertion order.
14. `grpc-server-implementation` — mid × 7 marks. ServiceBase inheritance, override async.
15. `ml-regression-evaluation` — mid × 12 marks. FastTree + RMSE/R².
16. `ml-prediction-consumption` — mid × 12 marks. PredictionEngine + save/load.
17. `ai-chat-completion-local` — mid × 13 marks. Ollama + ChatClient + streaming.
18. `grpc-client-consumption` — mid × 7 marks. GrpcChannel + .csproj config.
19. `localization-setup` — mid × 4 marks. Middleware registration.
20. `cache-expiration` — mid × 8 marks. Absolute/Sliding/Priority.
21. `file-based-app-basics` — mid × 8 marks. top-level + no csproj.
22. `pdf-export` — mid × 2 marks. iText7 + bouncy-castle + MemoryStream trap.
23. `aspire-orchestrated-resources` — mid × 5 marks. AddSqlServer/AddRedis + env-var injection.
24. `ai-cloud-models` — low × 13 marks. GitHub/Azure OpenAI endpoints + auth.
25. `taghelper-output-registration` — low × 3 marks. output API + `_ViewImports`.
26. `localization-injection` — low × 4 marks. IStringLocalizer/IHtmlLocalizer/IViewLocalizer.
27. `cache-tag-helper` — low × 8 marks. `<cache>` + vary-by.
28. `redis-configuration` — low × 8 marks. Connection string + Docker.
29. `aspire-service-defaults` — low × 5 marks. ServiceDefaults + health endpoints.
30. `file-based-app-web` — low × 8 marks. `#:sdk Microsoft.NET.Sdk.Web`.
31. `blazor-quickgrid` — low × 2 marks. PropertyColumn vs TemplateColumn + PaginationState.
32. `excel-export` — low × 2 marks. ClosedXML + 1-based indexing.
33. `chart-rendering` — low × 2 marks. Chart.js + Razor data injection.
34. `xunit-fixtures-lifecycle` — low × 6 marks. Constructor+Dispose pattern, IClassFixture.
35. `ml-automl-cli` — low × 12 marks. `mlnet regression --dataset`.

---

## Prereq topics (inline, not standalone)

These foundational concepts are referenced by in-scope topics but never appear standalone — they are inlined into the dependent lesson's pre-training section.

- `dependency-injection-basics` → referenced by `grpc-client-consumption`, `cache-aside-pattern`, `localization-injection`, `taghelper-authoring`, `aspire-apphost` (every "register service X" pattern uses `builder.Services.Add*`).
- `async-await-basics` → referenced by `grpc-server-implementation`, `cache-aside-pattern`, `ai-chat-completion-local`, `taghelper-authoring` (all `ProcessAsync`/`GetStreamingResponseAsync`/`GetOrSetAsync`).
- `docker-basics` → referenced by `redis-configuration`, `aspire-orchestrated-resources` (container pulls for SQL Server + Redis).
- `entity-framework-core` → referenced by `grpc-server-implementation`, `cache-aside-pattern` (EF queries wrapped by cache / exposed through gRPC).
- `razor-syntax-basics` → referenced by `localization-*`, `cache-tag-helper`, `taghelper-*`, `chart-rendering` (any `.cshtml` context).
- `blazor-component-basics` → referenced by `blazor-quickgrid` (`@page`, `@code`, `@onclick`).

These are **pre-training inlines only** — 3–5 sentences at the top of the dependent lesson. No standalone lesson, practice, or card.

---

## Out of scope (excluded from authoring)

Dropped entirely per STANDARDS §Exam-scope discipline — lecture-covered but not on the final's 11-topic breakdown:

- Razor Pages foundations (W2)
- ASP.NET MVC fundamentals (W2)
- Entity Framework Core foundations (W1) — **note**: EF still appears inside in-scope lessons as prereq inline, but not standalone.
- Code-1st migrations + Docker basics (W3)
- JWT + Token Authentication (W4)
- Identity / Roles / User Management + Seed Identity (W5)
- SignalR real-time (W6)
- Azure Functions + MCP server (W6)
- Static Web Apps (W7)
- React.js (W7)
- TypeScript foundations (W9)
- MongoDB (W13 second half)

If the learner needs any of these (e.g. to pass midterm-style recall), that's self-study outside this tool.

---

## Practice inventory

Every lab and every A2 deliverable whose topic is in-scope yields ≥1 `practice/NN-<slug>.md` file in Stage 3. Rows below drive Stage 3's authoring. Midterm is structural-anchor only (informs Stage 4 distractors, no practice row).

### Labs (in-scope)

| Source | Exam kind | Topic | Kind | Diagram | Proposed practice file |
|---|---|---|---|---|---|
| `Labs/W07 QuickGrid/` Q1 pagination | n/a | `blazor-quickgrid` | `code` | no | `practice/NN-quickgrid-pagination.md` |
| `Labs/W07 QuickGrid/` Q2 filtering | n/a | `blazor-quickgrid` | `code` | no | `practice/NN-quickgrid-filter.md` |
| `Labs/W07 QuickGrid/` Q3 sorting | n/a | `blazor-quickgrid` | `code` | no | `practice/NN-quickgrid-sort.md` |
| `Labs/W09 gRPC/` Q1 DI register | n/a | `grpc-client-consumption` | `code` | no | `practice/NN-grpc-client-di.md` |
| `Labs/W09 gRPC/` Q2 @inject in Blazor | n/a | `grpc-client-consumption` | `code` | no | `practice/NN-grpc-blazor-inject.md` |
| `Labs/W09 gRPC/` Q3 InteractiveServer | n/a | `blazor-quickgrid` (render-mode inline) | `code` | no | (merged into `NN-grpc-blazor-inject.md`) |
| `Labs/W09 gRPC/` Q4 Aspire AppHost wiring | n/a | `aspire-apphost` | `code` | no | `practice/NN-aspire-apphost-wire-grpc.md` |
| `Labs/W09 gRPC/` Q5 CRUD over gRPC | n/a | `grpc-server-implementation` | `code` | no | `practice/NN-grpc-crud.md` |
| `Labs/W10 Localization/` Q1 add culture | n/a | `localization-resources-cultures` | `code` | no | `practice/NN-localization-add-culture.md` |
| `Labs/W10 Localization/` Q2 culture UI | n/a | `localization-setup` | `applied` | no | `practice/NN-localization-switcher-ui.md` |
| `Labs/W10 Localization/` Q3 translate strings | n/a | `localization-injection` | `code` | no | `practice/NN-localization-translate.md` |
| `Labs/W11 File Based/` Q1 JSON deserialize | n/a | `file-based-app-basics` | `code` | no | `practice/NN-filebased-json-read.md` |
| `Labs/W11 File Based/` Q2 keyword filter | n/a | `file-based-app-basics` | `code` | no | `practice/NN-filebased-filter.md` |
| `Labs/W11 File Based/` Q3 Spectre.Console table | n/a | `file-based-app-directives` | `code` | no | `practice/NN-filebased-spectre-table.md` |
| `Labs/W11 File Based/` Q4 CLI args | n/a | `file-based-app-basics` | `code` | no | `practice/NN-filebased-cli-args.md` |
| `Labs/W13 Excel PDF Chart/` Q1 Razor setup | n/a | (reporting shell — inline prereq) | `code` | no | (merged) |
| `Labs/W13 Excel PDF Chart/` Q2 Excel download | n/a | `excel-export` | `code` | no | `practice/NN-xlsx-export.md` |
| `Labs/W13 Excel PDF Chart/` Q3 PDF download | n/a | `pdf-export` | `code` | no | `practice/NN-pdf-export.md` |
| `Labs/W13 Excel PDF Chart/` Q4 pie chart | n/a | `chart-rendering` | `code` | no | `practice/NN-chartjs-pie.md` |

### Assignments (in-scope slices only)

Assignment 1 is entirely out-of-scope (Razor Pages + React + Identity). Assignment 2 is partially in-scope (Aspire + AI integration; the Blazor Server/WASM split + role-based auth + code-first migration are out-of-scope).

| Source | Exam kind | Topic | Kind | Diagram | Proposed practice file |
|---|---|---|---|---|---|
| A2 § "Aspire orchestration" deliverable | n/a | `aspire-apphost` | `applied` | yes (service topology) | `practice/NN-aspire-orchestrate-multi-project.md` |
| A2 § "AI integration" deliverable | n/a | `ai-agent-framework` | `code` | no | `practice/NN-ai-agent-wire-up.md` |

### Past exams (final)

None. The only past exam is a **midterm**, and the midterm covers out-of-scope topics. No past-final practice rows generated. Midterm feeds Stage 4 mock-exam via structural patterns — see below.

### Derived gaps (no lab/assignment/past-exam anchor — `invention flagged`)

These in-scope topics have **no lab/assignment/past-final coverage** in `materials/`. Per STANDARDS §Practice source discipline, invented practice is forbidden — but some topics may need a practice floor to pass the coverage gate. Stage 3 decision: for each, either (a) skip practice (lesson + cards only, accept advisory warning), or (b) ground the practice in a **code-example folder** under `materials/code-examples/` and cite that as the anchor since those folders are instructor-distributed demos.

Topics with no direct lab/assignment coverage:
- `ai-semantic-kernel` — candidate anchor: `code-examples/20260324_VS-Code-Toolkit/`, `Plugins/`
- `ai-chat-completion-local` — candidate anchor: `code-examples/20260324_Ollama/`, `code-examples/20260324_docker-slms/`
- `ai-cloud-models` — candidate anchor: notes/AI-Models_MAF_SCRIPT.docx GitHub-Models section
- `ml-pipeline-workflow` — candidate anchor: `code-examples/TaxiFarePrediction/`
- `ml-data-transforms` — same anchor
- `ml-regression-evaluation` — same anchor
- `ml-prediction-consumption` — same anchor
- `ml-automl-cli` — candidate anchor: `code-examples/TaxiFareAutoML/`
- `grpc-proto-contracts` — partial lab coverage; supplement with `code-examples/20260303GrpcBasics/`
- `aspire-service-defaults` — anchor: `code-examples/SoccerFIFA_Aspire/`, `code-examples/aspire-react-dotnet/`
- `aspire-orchestrated-resources` — same anchors
- `cache-abstractions` — anchor: `code-examples/20260330_DataCacheDemo/`, `code-examples/20260330_WebApiFIFA_REDIS_Final/`
- `cache-expiration` — same
- `cache-aside-pattern` — same
- `redis-configuration` — anchor: `code-examples/WebApiFIFA_REDIS/`
- `cache-tag-helper` — anchor: `code-examples/20260330_DataCacheDemo/` (Cache Tag Helper section)
- `taghelper-authoring` — anchor: `code-examples/` — no single hit; confirm via notes/TagHelpers_SCRIPT.docx (full example in doc)
- `taghelper-output-registration` — same
- `tdd-cycle`, `xunit-attributes-assertions`, `xunit-fixtures-lifecycle` — anchor: notes/TDD_xunit_SCRIPT.docx has FizzBuzz kata code; also slides/TDD_xunit.pptx step-by-step. Stage 3 treats SCRIPT.docx as lab-equivalent anchor.

**Stage 3 decision path:** prefer `code-examples/` anchor citation format like `source: Lab-equivalent demo — code-examples/TaxiFarePrediction/ (variant — single-model regression pipeline only)`. This is weaker than a lab/assignment/past-exam anchor but stronger than pure invention.

---

## Structural pattern notes (from midterm — calibrates Stage 4 mock-exam + Stage 3 practice depth)

The midterm is the only past-exam available. Its topic coverage is **out-of-scope for the final**, but its structural conventions carry over reliably.

### Midterm composition
- 71 questions total: 60 MCQ + 10 match-two-columns + 1 short-answer.
- **Final matches this exactly in structure**: 60 MCQ + 10 match + 1 coding (final replaces short-answer with a 10-mark coding question).
- Expected MCQ time budget on final: 60 min / 71 Qs ≈ 50 sec/question. Coding question ~ 15–20 min. Match ~ 5–7 min. Strategy lesson (`00-exam-strategy.md`) calibrates off these.

### Phrasing conventions (Stage 4 must mirror)
1. "Which of the following is FALSE about X" (4 instances in midterm) — stem inverts the assertion; learners misread.
2. "Which of the following [command/annotation/directive] …" — pure recall of exact syntax.
3. "In which [file/directory/class] would you find/place X" — navigation of scaffolded project structure.
4. "What [method/class/property] is [used/required] to [action]" — API recall.
5. "To [action], you should use the [directive/annotation/command] named" — imperative naming.

### Distractor conventions
- **5-option MCQ** with 1 correct + 4 plausible.
- **Subtle syntax errors** — brackets vs parens (`[Route["..."]]` vs `[Route("...")]`), wrong method name (`Get()` vs `Find()`), wrong attribute name (`[KEY]` vs `[PRIMARYKEY]` vs `[PRIMARY]`).
- **CLI position traps** — `dotnet ef migrations add M1` vs `ef migrations add M1` vs `migrations ef add M1`.
- **File/directory convention traps** — `Data/ApplicationDbContext.cs` vs `Services/` vs `Models/`.
- **TRUE/FALSE inversion** — "Which is FALSE" questions invite careless reading.

### Typical trap style
- Wrong argument order / syntax.
- Method-naming confusion (plausible-but-wrong verbs).
- Off-by-one in CLI prefix.
- Attribute-vs-property naming.
- Implicit-vs-explicit convention assumptions.

### Depth per type
- **MCQ**: single-line stem + one-line answer; tests factual recall, syntax recognition, naming conventions. Occasional 3-5-line code fence in the stem.
- **Match-two-columns**: 1:1 pairing across 10 distinct technical items; tool / pattern / terminology recognition.
- **Coding question** (final): ~15–25 lines of C#, single method or small class, likely a variant of a lab scenario (gRPC service method, cache-aside function, ML.NET pipeline snippet, Tag Helper `ProcessAsync`, file-based app `#:` directive + filter logic, PDF export action method, TDD test method).

### Wrong-answer patterns (Stage 4 distractor pool)
Top 10 patterns pulled from midterm, adapted for in-scope topics:
1. CLI syntax position errors → adapt to `mlnet regression --dataset ...` ordering, `dotnet run file.cs -- args` double-dash.
2. Method-naming confusion → adapt to `.AsAgent()` vs `.AsAIAgent()`, `kernel.Execute()` vs `kernel.InvokeAsync()`, `.Fit()` vs `.Train()` (ML.NET).
3. Attribute-vs-property syntax → `[Fact]` vs `[Test]` (MSTest vs xUnit), `[Column(0)]` vs `[LoadColumn(0)]` (ML.NET).
4. File/path convention → `Resources/Pages/IndexModel.fr.resx` vs flat layouts; `.proto` file location in .csproj.
5. Directive syntax → `#:package` vs `#: package` (space = invalid) — file-based apps trap.
6. TRUE/FALSE inversion → "Which of the following is FALSE about file-based apps".
7. Interface-vs-class confusion → `IDistributedCache` vs `IMemoryCache` vs `DistributedCache`.
8. Port / URL confusion → Ollama `http://localhost:11434` vs GitHub Models `https://models.github.ai/inference`.
9. Namespace confusion → `Regression.Evaluate` vs `MulticlassClassification.Evaluate`.
10. Order-sensitive API calls → `CopyColumns("Label", ...)` must be first in pipeline; trainer otherwise can't locate Label.

---

## Diagram inventory

No past-exam question in `materials/` carries a diagram-fill. All diagrams are lesson-level (Mayer multimedia / dual-coding) rather than `kind: applied` practice.

Lesson-level diagrams required (inline SVG or Mermaid):

| Topic | Diagram subject | Source |
|---|---|---|
| `ml-pipeline-workflow` | pipeline boxes Load → Transform → Concatenate → Train → Evaluate → Predict | slides/ML.NET.pptx |
| `grpc-proto-contracts` | client-server contract-first flow with .proto in the middle | slides/gRPC.pptx |
| `aspire-apphost` | AppHost → services → DB topology, arrows = `WithReference`/`WaitFor` | notes/aspire_SCRIPT.docx |
| `cache-aside-pattern` | request → cache hit/miss → DB fallback → write-back sequence | slides/redis.pptx |
| `cache-abstractions` | web-farm: one DB, N app-servers, shared Redis vs per-server IMemoryCache | slides/redis.pptx |
| `redis-configuration` | client ↔ Redis single-threaded event loop + master-replica replication | slides/redis.pptx |
| `tdd-cycle` | Red → Green → Refactor circular arrow diagram | slides/TDD_xunit.pptx |
| `localization-resources-cultures` | culture-provider precedence chain (Query → Cookie → Accept-Language) + resource fallback chain | slides/asp_core_localization.pptx |
| `ai-agent-framework` | agent → tools → kernel → LLM call loop, with ChatHistory state | notes/AI-Models_MAF_SCRIPT.docx |
| `file-based-app-basics` | `.cs` file → `dotnet run` → cached binary under `~/.dotnet/runfile/` | research-file-based.md |

`kind: applied` practice (inline SVG in `## Problem`) — candidates (optional, low priority):
- A2 "Aspire orchestration" deliverable → service-topology diagram that learner annotates.
- Cache-aside sequence → learner fills missing edge labels.

---

## Materials gaps flagged for Stage 3

- **No dedicated "Excel/PDF/Chart" slide deck** — only lab handout + `20240308_Reporting_pdf_excel_chart.zip` code example + `20260407_ExcelPDF.zip`. Stage 3 sources heavily from `code-examples/` for this module.
- **No dedicated Blazor slide deck** — `QuickGrid` was lab-only + scripts `BlazorServer_QuickGrid.docx` / `BlazorWasm_QuickGrid.docx`. QuickGrid is light (2 marks), so scope is bounded.
- **No Microsoft Agent Framework slide** — only `AI-Models_MAF_SCRIPT.docx` note. Heaviest topic (13 marks includes MAF), so `ai-agent-framework` lesson leans entirely on the .docx + `research-ai.md`.
- **Midterm solutions not present** — only `midterm_exam_questions.md`. Correct answers are inferred from slides/notes, but wrong-answer patterns are derived from distractor structure rather than solution key.
- **No instructor email / Learning Hub discussion posts** — the `4870 final exam details.txt` is the sole scope doc. Stage 5 audit should verify nothing contradicts it if more comms surface.
- **Syllabus lacks exam-format detail** — the final-exam-details.txt compensates fully. No gap for Stage 2 course.yaml.
