---
name: glossary-4870
description: Canonical terms for COMP 4870 — use verbatim in all authored content to prevent variant drift
type: project
---

# Glossary — 4870

Read this before writing any content. Use the **Canonical** form verbatim; never substitute a **Variant to avoid**. Every term listed below appeared ≥2 times in topic-map.md or research notes with a non-trivial risk of variant phrasing.

## Frameworks & platforms

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| ASP.NET Core | ASP.NET, .NET Core, DotNet Core | Cross-platform web framework used throughout the course. | slides/4870_intro.pptx |
| .NET | DotNet, Dotnet, dot-net | Cross-platform runtime + class library platform. | slides/4870_intro.pptx |
| `dotnet` CLI | DotNet CLI, `DotNet` command | Command-line interface for .NET (`dotnet run`, `dotnet build`, `dotnet ef …`). | notes/WebAPI_VSCode_SCRIPT.docx |
| C# | CSharp, C-Sharp | Language used for all server-side code. | slides/4870_intro.pptx |
| Entity Framework Core | EF, EntityFramework, Entity Framework | Object-relational mapper. Write "Entity Framework Core" on first mention per lesson, then "EF Core" subsequently. | slides/4870_intro.pptx |
| EF Core | Entity-Framework-Core, EFCore | Short form after first mention. | notes/WebAPI_VSCode_SCRIPT.docx |
| Razor Pages | razor pages, RazorPages | Page-centric ASP.NET Core UI framework. **Out of scope for final** — use only in prereq inlines. | slides/ASP.NET RazorPages.pptx |
| .NET Aspire | Aspire (first mention), DotNet Aspire | Orchestration stack for cloud-native multi-service .NET apps. Write ".NET Aspire" on first mention per lesson, then "Aspire". | notes/aspire_SCRIPT.docx |
| Blazor | blazor | Client-side or server-side .NET UI framework. | notes/BlazorServer_QuickGrid.docx |
| Blazor Server | Blazor server, server-side Blazor | Variant of Blazor where C# runs server-side over a SignalR loop. | notes/BlazorServer_QuickGrid.docx |
| Blazor WebAssembly | Blazor WASM, Blazor-WASM, BlazorWASM | Variant where C# runs in-browser via WebAssembly. After first mention, "Blazor WASM" is acceptable short form. | notes/BlazorWasm_QuickGrid.docx |

## AI stack

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| Large Language Model (LLM) | Large language model, large-language-model | Generative text model with billions of parameters. Spell out on first mention per lesson, then "LLM". | slides/CSharp_Meets_AI.pptx |
| Small Language Model (SLM) | Small language model, small-language-model | Compact model (~1B–10B params) runnable on-device. Spell out on first mention, then "SLM". | slides/SLM.pptx |
| Semantic Kernel | SemanticKernel, semantic kernel, SK | Microsoft's orchestration SDK for LLMs in .NET. | slides/CSharp_Meets_AI.pptx; notes/AI-Models_MAF_SCRIPT.docx |
| `Kernel` | `SemanticKernel` object, semantic kernel instance | The runtime orchestrator instance; created via `KernelBuilder`. | slides/CSharp_Meets_AI.pptx |
| `KernelBuilder` | kernel-builder, Kernel.Builder | Fluent builder that configures and constructs a `Kernel`. | slides/CSharp_Meets_AI.pptx |
| Microsoft Agent Framework | MAF (first mention), Agent Framework | Agentic SDK for multi-turn reasoning with tool calling, built on Semantic Kernel. Spell out first mention per lesson, then "MAF". | notes/AI-Models_MAF_SCRIPT.docx |
| `ChatClientAgent` | chat agent, ChatAgent | MAF agent type wrapping an `IChatClient`. | notes/AI-Models_MAF_SCRIPT.docx |
| `IChatClient` | ChatClient interface, iChatClient | Abstraction over chat-completion backends (Ollama, OpenAI, Azure OpenAI, GitHub Models). | notes/AI-Models_MAF_SCRIPT.docx |
| `ChatMessage` | chat-message, ChatMessages | One entry in a conversation, carries `ChatRole` + content. | notes/AI-Models_MAF_SCRIPT.docx |
| `ChatRole` | chat-role, role | Enum: `User`, `Assistant`, `System`. | notes/AI-Models_MAF_SCRIPT.docx |
| `ChatHistory` | chat-history, conversation log | Ordered list of `ChatMessage` for multi-turn context. | notes/AI-Models_MAF_SCRIPT.docx |
| Ollama | ollama | Local LLM/SLM runtime; default endpoint `http://localhost:11434`. | slides/SLM.pptx |
| OllamaSharp | OllamaSDK, Ollama SDK | .NET SDK for Ollama; provides `OllamaApiClient` implementing `IChatClient`. | notes/AI-Models_MAF_SCRIPT.docx |
| GitHub Models | github-models, GitHub's models | Hosted inference endpoint at `https://models.github.ai/inference`. | notes/AI-Models_MAF_SCRIPT.docx |
| Azure OpenAI | AzureOpenAI, AOAI | Azure-hosted OpenAI deployment. Requires deployment name + `AzureKeyCredential`. | slides/CSharp_Meets_AI.pptx |
| `AzureKeyCredential` | AzureCredential, API key credential | Auth object for GitHub Models and Azure OpenAI. | notes/AI-Models_MAF_SCRIPT.docx |
| `AIFunctionFactory.Create` | AIFunction.Create, Function.Create | Wraps a C# delegate into an `AITool` for agent tool calling. | notes/AI-Models_MAF_SCRIPT.docx |
| `AITool` | AiTool, AI tool object | MAF abstraction for a callable tool passed to an agent. | notes/AI-Models_MAF_SCRIPT.docx |

## ML.NET

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| ML.NET | ML.Net, MLNet, ml-net | .NET framework for custom machine-learning model training and inference. | slides/ML.NET.pptx |
| `MLContext` | ml-context, MLContextInstance | Entry-point object giving access to data, transforms, trainers, evaluators. | slides/ML.NET.pptx |
| `IDataView` | data-view, IDataset | Streaming view over tabular data used across the ML.NET pipeline. | slides/ML.NET.pptx |
| `ITransformer` | Transformer interface, trained model | The trained, immutable model returned by `Fit()`. | slides/ML.NET.pptx |
| `PredictionEngine` | prediction engine, Predictor | Single-row inference wrapper around an `ITransformer`. | notes/ML.NET_VS2022_SCRIPT.docx |
| Label | label column, Y, target column | Column the model predicts; must be named `Label` in the pipeline. | slides/ML.NET.pptx |
| Features | feature column, X, input columns | Concatenated input column; must be named `Features` in the pipeline. | slides/ML.NET.pptx |
| `OneHotEncoding` | one-hot encoding (prose OK outside code), OneHot, OHE | Transform that expands a categorical column into binary indicator columns. Use the code form when referring to the API method; prose "one-hot encoding" OK for the concept. | slides/ML.NET.pptx |
| `Concatenate` | concatenate columns, ColumnConcatenator | Transform that combines multiple feature columns into a single `Features` vector. | slides/ML.NET.pptx |
| `FastTree` | FastTrees, Fast Tree trainer | Gradient-boosted-tree trainer in `Microsoft.ML.FastTree`. | slides/ML.NET.pptx |
| RMSE | RMS, root-mean-squared error (use once, then RMSE) | Root Mean Squared Error — regression metric in original units of the label. | slides/ML.NET.pptx |
| R² | R-squared, RSquared (API form OK), R squared | Coefficient of determination, range 0–1. In code, the property is `RSquared`; in prose, use "R²". | slides/ML.NET.pptx |
| AutoML | Auto-ML, auto ML | Automated model search; `Microsoft.ML.AutoML` package or `mlnet` CLI. | notes/ML.NET_vscode_automl_SCRIPT.docx |
| `mlnet` CLI | MLNet CLI, ML-NET CLI | Command-line AutoML tool: `mlnet regression --dataset train.csv --label-col Label`. | notes/ML.NET_vscode_automl_SCRIPT.docx |

## gRPC

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| gRPC | GRPC, Grpc, gRpc | RPC framework using HTTP/2 and Protocol Buffers. | slides/gRPC.pptx |
| Protocol Buffers | Protobuf (short form OK), Proto Bufs | Google's binary serialization format used by gRPC. Spell out on first mention; "protobuf" acceptable after. | slides/gRPC.pptx |
| `.proto` file | proto file, Proto file (body OK for heading) | Text file defining services and messages; compiled by `Grpc.Tools`. | notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx |
| field tag | field number (both are used — prefer "field tag") | Immutable numeric identifier for a message field; tags 1–15 encode in 1 byte. | research-grpc.md |
| `service` keyword | Service block | Declares a gRPC service in a `.proto` file. | slides/gRPC.pptx |
| `rpc` keyword | RPC method, rpc-method | Declares a single gRPC method inside a service. | slides/gRPC.pptx |
| `message` keyword | Message type | Declares a structured payload type in a `.proto` file. | slides/gRPC.pptx |
| `ServerCallContext` | ServerContext, gRPC context | Per-call context object passed to every server-side method. | notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx |
| `GrpcChannel` | Grpc channel, RPC channel | Long-lived client connection; use `GrpcChannel.ForAddress(url)`. | notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx |

## .NET Aspire

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| AppHost | App Host, app-host, Apphost | Aspire orchestration project; its `Program.cs` calls `DistributedApplication.CreateBuilder`. | notes/aspire_SCRIPT.docx |
| `DistributedApplication` | Distributed Application, DistApp | Aspire's orchestrator type, created via `CreateBuilder`. | notes/aspire_SCRIPT.docx |
| `ServiceDefaults` | service-defaults, service defaults project | Shared library providing `AddServiceDefaults` extension for every Aspire service. | notes/aspire_SCRIPT.docx |
| `AddServiceDefaults` | `AddDefaults`, `AddAspireDefaults` | Extension method registering service discovery, OpenTelemetry, health checks, resilience. Called in each service's `Program.cs`, NOT in the AppHost. | notes/aspire_SCRIPT.docx |
| service discovery | Service Discovery, service-discovery (as noun) | Aspire mechanism resolving logical service names (e.g. `http://backend`) at runtime. | notes/aspire_SCRIPT.docx |
| `WithReference` | `.Reference()`, WithRef | AppHost call wiring a dependency's connection info into a project. | notes/aspire_SCRIPT.docx |
| `WaitFor` | `.WaitForDependency()`, WaitOn | AppHost call delaying a project's start until the named resource is ready. | notes/aspire_SCRIPT.docx |
| `/health` | /Health, health endpoint (prose OK) | Readiness endpoint: returns 200 only when all registered health checks pass. | notes/aspire_SCRIPT.docx |
| `/alive` | /Alive, liveness endpoint (prose OK) | Liveness endpoint: returns 200 for checks tagged `"live"`. | notes/aspire_SCRIPT.docx |
| OpenTelemetry | Open Telemetry, OpenTel (OTel acceptable after first mention) | Distributed tracing + metrics + logging framework auto-configured by ServiceDefaults. | notes/aspire_SCRIPT.docx |

## Caching

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| `IMemoryCache` | In-memory cache interface, MemoryCache | Per-process in-memory cache; breaks in multi-server deployments. | notes/DataCache_SCRIPT.docx |
| `IDistributedCache` | Distributed cache interface, IDistCache | Cross-process cache abstraction; Redis is the canonical backend. | notes/DataCache_SCRIPT.docx |
| Redis | redis, REDIS | In-memory key-value store used as the distributed cache backend. | slides/redis.pptx |
| StackExchange.Redis | StackExchangeRedis, Stack Exchange Redis | .NET Redis client library. | notes/redis_SCRIPT.docx |
| cache-aside | Cache Aside, Cache-Aside pattern (prose OK), lookaside | Pattern where the app checks cache, on miss queries DB, then populates cache. | notes/DataCache_SCRIPT.docx |
| `GetOrSetAsync` | GetOrAdd, GetOrCreate | Extension method implementing cache-aside in one call. | notes/DataCache_SCRIPT.docx |
| absolute expiration | hard expiration, fixed expiration | TTL that fires at a wall-clock moment regardless of access. | notes/DataCache_SCRIPT.docx |
| sliding expiration | rolling expiration, sliding TTL | TTL that resets on each cache access. | notes/DataCache_SCRIPT.docx |
| Cache Tag Helper | cache-tag-helper, `<cache>` helper | Razor tag helper `<cache vary-by-…>…</cache>` for fragment caching. Uses `IMemoryCache` by default. | notes/Cache_Tag_Helper_SCRIPT.docx |

## Tag Helpers & Razor

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| Tag Helper | TagHelper (class name only), tag-helper | Server-side Razor extension that emits HTML. Use "Tag Helper" in prose; "`TagHelper`" when referring to the base class. | notes/TagHelpers_SCRIPT.docx |
| `[HtmlTargetElement]` | HtmlTarget, TargetElement | Attribute declaring which HTML tag/attribute the Tag Helper binds to. | notes/TagHelpers_SCRIPT.docx |
| `ProcessAsync` | Process async, ProcessASync | Async override on `TagHelper` that emits the rendered output. | notes/TagHelpers_SCRIPT.docx |
| `_ViewImports.cshtml` | ViewImports, _ViewImports.cshml | Razor file that globally registers Tag Helpers via `@addTagHelper`. | notes/TagHelpers_SCRIPT.docx |
| `@addTagHelper` | addTagHelper, @addtaghelper | Razor directive registering a Tag Helper assembly in `_ViewImports.cshtml`. | notes/TagHelpers_SCRIPT.docx |

## Localization

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| Localization | localization, Localisation | Adapting UI strings to a specific locale. | slides/asp_core_localization.pptx |
| Globalization | Internationalization (use "Globalization" to match course slides), i18n | Designing an app to *be capable* of localization. | slides/asp_core_localization.pptx |
| `.resx` | resx file, .RESX | XML resource file storing localized strings keyed by name. | notes/razor_pages_localization_SCRIPT.docx |
| `IStringLocalizer<T>` | StringLocalizer, IStringLocalizer | DI-injectable localizer keyed by a type's fully-qualified name. | notes/razor_pages_localization_SCRIPT.docx |
| `IHtmlLocalizer<T>` | HtmlLocalizer | Variant of `IStringLocalizer` that returns HTML-safe content. | notes/razor_pages_localization_SCRIPT.docx |
| `IViewLocalizer` | ViewLocalizer | Localizer injected with `@inject` inside a `.cshtml` view. | notes/razor_pages_localization_SCRIPT.docx |
| `CurrentCulture` | current-culture, current Culture | Culture controlling date/number formatting. | notes/razor_pages_localization_SCRIPT.docx |
| `CurrentUICulture` | current-UI-culture, CurrentUiCulture | Culture controlling which resource-file translations load. | notes/razor_pages_localization_SCRIPT.docx |
| `UseRequestLocalization` | UseLocalization (wrong method), UseRequestCulture | Middleware applying culture providers to each request. | notes/razor_pages_localization_SCRIPT.docx |

## Blazor QuickGrid

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| QuickGrid | Quick Grid, Quick-Grid | Microsoft's data-grid Blazor component in `Microsoft.AspNetCore.Components.QuickGrid`. | notes/BlazorServer_QuickGrid.docx |
| `PropertyColumn` | Property Column | Column type bound directly to a property; supports `Sortable="true"` out of the box. | notes/BlazorServer_QuickGrid.docx |
| `TemplateColumn` | Template Column | Column type with custom render fragment; requires `SortBy` for sortability. | notes/BlazorServer_QuickGrid.docx |
| `PaginationState` | Pagination State, `Pagination` (without State) | Paging state object bound to `<QuickGrid Pagination="…">` and `<Paginator State="…">`. | notes/BlazorServer_QuickGrid.docx |
| `GridSort<T>.ByAscending` | GridSort.Asc, SortBy.Ascending | Sort descriptor factory used with `TemplateColumn`'s `SortBy`. | notes/BlazorServer_QuickGrid.docx |
| `InteractiveServer` | Interactive-Server, Server interactive | Render mode enabling Blazor Server SignalR loop. | Labs/W09 gRPC/ |

## File-based apps

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| file-based apps | file based apps, filebased apps | .NET 10 feature running a single `.cs` file with `dotnet run file.cs`. | slides/file-based-apps.pptx |
| `#:package` | `#: package` (**space after colon is invalid**), `#package` | Directive importing a NuGet package. | slides/file-based-apps.pptx |
| `#:property` | `#: property`, `#property` | Directive setting an MSBuild property (e.g. `TargetFramework=net10.0`). | notes/file-based-apps.docx |
| `#:sdk` | `#: sdk`, `#sdk` | Directive switching SDK (e.g. `Microsoft.NET.Sdk.Web`). | notes/file-based-apps.docx |
| `#:project` | `#: project`, `#project` | Directive referencing a .csproj. | notes/file-based-apps.docx |
| top-level statements | top level statements, top-level-statements | C# 9+ feature removing the need for `Program` class and `Main`. | slides/file-based-apps.pptx |

## Reporting (Excel / PDF / Chart)

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| ClosedXML | Closed XML, ClosedXml | .NET Excel library used to write `.xlsx` files. 1-based cell indexing. | Labs/W13 Excel, PDF, Chart cocktail |
| iText7 | itext7 (use iText7 in prose, `iText7` as package name), iText 7 | PDF generation library. Requires `itext.bouncy-castle-adapter` for signing dependencies. | Labs/W13 |
| `PdfWriter` | Pdf Writer | iText7 stream writer; pair with `PdfDocument` + `Document`. | Labs/W13 |
| Chart.js | ChartJS, Chart-js | Client-side JS charting library loaded via CDN. | Labs/W13 |
| `FileResult` | File Result | MVC/Razor return type for downloading a byte[] file. | Labs/W13 |
| `FileStreamResult` | File Stream Result | MVC/Razor return type for streaming a response body; reset `MemoryStream.Position` to 0 before returning. | Labs/W13 |

## Testing (TDD / xUnit)

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| TDD | tdd, test-driven development (prose OK once, then TDD) | Test-Driven Development. Write failing test → pass → refactor. | slides/TDD_xunit.pptx |
| Red / Green / Refactor | red-green-refactor, RGR | The three-step TDD cycle. | slides/TDD_xunit.pptx |
| xUnit | XUnit, Xunit (match casing the framework uses in its own docs) | .NET test framework used in this course; NuGet package `xunit`. | slides/TDD_xunit.pptx |
| `[Fact]` | `[Test]` (that's NUnit), Fact attribute | xUnit attribute marking a parameterless test. | slides/TDD_xunit.pptx |
| `[Theory]` | Theory attribute, Parameterized test | xUnit attribute marking a data-driven test; pair with `[InlineData]` / `[MemberData]`. | slides/TDD_xunit.pptx |
| `[InlineData]` | InlineData attribute, @InlineData | Data attribute supplying inline arguments to a `[Theory]`. | slides/TDD_xunit.pptx |
| Arrange / Act / Assert | AAA (first mention only), arrange-act-assert | Three-section structure inside every xUnit test body. | slides/TDD_xunit.pptx |
| `IClassFixture<T>` | ClassFixture, ClassFixture<T> | xUnit interface sharing a fixture instance across tests in one class. | notes/TDD_xunit_SCRIPT.docx |

## Data & miscellaneous

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| Dependency Injection (DI) | dependency injection (use "Dependency Injection" on first mention, then "DI"), dep injection | Pattern of supplying services to consumers via constructor parameters. | notes/WebAPI_VSCode_SCRIPT.docx |
| `DbContext` | Db Context, DbContexts | EF Core base class representing a session with the database. | notes/WebAPI_VSCode_SCRIPT.docx |
| SQL Server | MSSQL, Microsoft SQL Server (use "SQL Server"), SqlServer | Relational DB used in 4870 demos; containerized via Aspire `AddSqlServer`. | notes/aspire_SCRIPT.docx |
| SQLite | SQLite3 (use "SQLite"), SqlLite | File-based DB used in gRPC labs. | notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx |
| Docker | docker, DOCKER | Container platform running Redis and SQL Server locally. | slides/docker_containers.pptx |
| Spectre.Console | SpectreConsole, Spectre Console | NuGet library for styled CLI output used in W11 file-based-apps lab. | Labs/W11 File Based C# Apps |
