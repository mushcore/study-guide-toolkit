# COMP4870 Diagnosis — Final Exam Preparation

**Generated**: 2026-04-08
**Exam date**: April 24, 2026 (Exam Week, Week 15)
**Instructor**: Medhat Elmasry

---

## Exam Format Summary

| Detail | Info |
|--------|------|
| **Weight** | 20% of final grade |
| **Pass rule** | Average of midterm + final must be >= 50% |
| **Duration** | ~1.5 hours (based on midterm precedent) |
| **Format** | Written on paper — hand-written questions/short-answer/code |
| **Allowed materials** | One hand-written note sheet (8.5" x 11", both sides) |
| **Question style** | Topic-by-topic breakdown with point allocations per topic area |

**Midterm precedent (Feb 27)**: The midterm divided questions by topic — MVC/Razor Pages, EF/T-SQL, Blazor, WebAPI, .NET Core/MCP/AI, Azure Functions/SWA, SignalR, Docker. Each topic had allocated points. The final will likely follow this same structure.

**What this means**: Prepare breadth-first — you need to answer questions across *all* topics, not just go deep on a few. Your cheat sheet should be organized by topic with key code patterns and syntax.

---

## Topic Inventory

### Pre-Midterm Topics (Weeks 1–7) — Already tested on midterm, but foundational

| # | Topic | Week | Slides | Script | Lab | Assignment | Est. Final Weight |
|---|-------|------|--------|--------|-----|------------|-------------------|
| 1 | C# Fundamentals & Entity Framework Core | 1 | 4870_intro.pptx | Entity Framework Script.html, EF lab | EF lab, Code-First lab | Both | 8% |
| 2 | ASP.NET MVC & Razor Pages | 2 | aspnet_mvc.pptx, ASP.NET RazorPages.pptx | MVC_DbFirst_VSCode_SCRIPT | Code-First lab | A1 backend | 7% |
| 3 | Code-First Development & Docker | 3 | docker_containers.pptx | docker-compose sample | Code-First lab | A2 (SQL Server in Docker) | 7% |
| 4 | Web API & JWT Authentication | 4 | WebAPI.pptx, JWT.pptx | WebAPI_VSCode_SCRIPT | — | A1 (REST API) | 7% |
| 5 | Identity (Users/Roles) & .NET Aspire | 5 | — | ExtendUsersAndRoles_simple, aspire_SCRIPT | gRPC lab (Aspire) | A2 (role-based auth, Aspire) | 6% |
| 6 | SignalR & Blazor (Server/WASM) | 6 | SignalR.pptx | SignalR_SCRIPT, BlazorServer_QuickGrid, BlazorWasm_QuickGrid | QuickGrid lab | A2 (Blazor WASM) | 7% |
| 7 | Azure Functions & Static Web Apps & React | 7 | AzureFunctions.pptx, react_intro.pptx | Node_Azure_Functions_SCRIPT, static-web-apps-SCRIPT, students_react_TS_SCRIPT | Azure Functions MCP, React deploy | A1 (React frontend) | 5% |

### Post-Midterm Topics (Weeks 9–13) — **PRIMARY FOCUS for final exam**

| # | Topic | Week | Slides | Script | Lab | Assignment | Est. Final Weight |
|---|-------|------|--------|--------|-----|------------|-------------------|
| 8 | TypeScript, Charts, PDF & Excel | 9 | — | Node with TypeScript | Blazor Mix & Match, Excel/PDF/Chart | — | 5% |
| 9 | gRPC & Localization | 10 | gRPC.pptx, asp_core_localization.pptx | gRPC_EF_SQLite_VSCode_SCRIPT, razor_pages_localization_SCRIPT | gRPC Blazor Aspire lab, Localize app | — | 8% |
| 10 | TagHelpers & Cache Tag Helper | 11 | — | TagHelpers_SCRIPT, Cache_Tag_Helper_SCRIPT | Tag Helper lab | — | 7% |
| 11 | Data Caching (IMemoryCache & Redis) | 11-12 | redis.pptx | DataCache_SCRIPT, redis_SCRIPT | — | — | 8% |
| 12 | AI/SLM (Ollama, Semantic Kernel, MAF, MCP) | 12 | CSharp_Meets_AI.pptx, SLM.pptx | AI-Models_MAF_SCRIPT, SLM.docx | Semantic Kernel lab, MCP Server lab, Azure Functions MCP lab | A2 (AI requirement) | 8% |
| 13 | TDD & xUnit Testing | 13 | TDD_xunit.pptx | TDD_xunit_SCRIPT | TDD lab | — | 7% |
| 14 | File-Based Apps | 11 | file-based-apps.pptx | file-based-apps.docx | file-based-apps lab | — | 4% |
| 15 | Node.js with TypeScript | 9 | — | Node with TypeScript.docx | — | — | 3% |
| 16 | PDF/Excel/Chart Generation | 9 | — | — | Excel, PDF, Chart lab | — | 3% |

---

## High-Leverage Topics (Top 8) — Study These First

### 1. Entity Framework Core (Code-First, Migrations, Seeding) — ~8%
**Why #1**: Structural backbone of the entire course. God nodes in the knowledge graph: `StudentService`, `StudentsController`, `ApplicationDbContext`. Used in *every* project — MVC, Razor Pages, WebAPI, Blazor, gRPC. Both assignments require EF Code-First with seeding.

**Key code patterns to know**:
- `dotnet-ef migrations add M1 -o Data/Migrations` / `dotnet-ef database update`
- DbContext registration in Program.cs
- Seeding data with `OnModelCreating` or separate seed classes (`SeedUsersRoles`)
- Database-First vs Code-First approach
- Navigation properties and foreign keys
- LINQ queries (GroupBy, Where, Select, ToListAsync)

### 2. Caching (IMemoryCache + Cache Tag Helper + Redis) — ~8%
**Why #2**: Three full lectures/scripts dedicated to this post-midterm. Comprehensive coverage from in-memory to distributed. Extensive code examples. This is the professor's biggest post-midterm investment.

**Key code patterns to know**:
- `builder.Services.AddMemoryCache()` + `IMemoryCache` DI injection
- `_memoryCache.TryGetValue()` / `_memoryCache.Set()` pattern with `MemoryCacheEntryOptions`
- `<cache>` tag helper attributes: `expires-after`, `expires-on`, `expires-sliding`, `vary-by-*` (user, route, query, cookie, header), `priority`
- Cache limitations: not distributed, lost on restart, load-balance issues
- Redis: `docker run --name redis -d -p 6379:6379 redis`
- Redis CLI: `set`, `get`, `del`, `setex` (with TTL), `ttl`
- `AddStackExchangeRedisCache` in Program.cs
- `IDistributedCache` interface + `DistributedCacheExtensions` pattern (SetAsync, TryGetValue, GetOrSetAsync)
- `DistributedCacheEntryOptions`: `.SetSlidingExpiration()` / `.SetAbsoluteExpiration()`
- Cache invalidation pattern: `cache.Remove(key)` after data mutation

### 3. gRPC — ~8%
**Why #3**: Dedicated post-midterm week with slide deck + extensive script + lab (Blazor client consuming gRPC + Aspire orchestration). Tests a different communication pattern than REST.

**Key code patterns to know**:
- Proto file definition (syntax, service, message, rpc methods)
- Server implementation: inheriting from generated base class
- Client setup: `AddGrpcClient<T>()` with DI
- gRPC with EF Core + SQLite
- Blazor Server consuming gRPC service
- Aspire orchestration: `builder.AddProject` + `.WithReference()`
- Difference from REST: binary protocol, HTTP/2, strongly-typed contracts

### 4. AI/SLM Integration (Semantic Kernel, Ollama, MAF, MCP) — ~8%
**Why #4**: Two slide decks (CSharp_Meets_AI, SLM), two detailed scripts, three labs, and Assignment 2 requires AI implementation. This is where the professor is investing heavily in 2026.

**Key code patterns to know**:
- Semantic Kernel: `KernelBuilder`, prompt templates (skprompt.txt), plugins
- Ollama: running local SLMs in Docker, model names (Llama 3.2, Ministral3)
- MAF (Microsoft AI Framework): `AIAgent`, `AITool`, `AIFunctionFactory`, native plugins
- MCP (Model Context Protocol): `McpClient.CreateAsync()`, `StdioClientTransport`, `ListToolsAsync()`, connecting to GitHub Models API
- Azure Functions MCP Server: deploying AI as serverless function
- GitHub Models inference endpoint pattern

### 5. ASP.NET MVC & Razor Pages — ~7%
**Why #5**: Core framework pattern. Assignment 1 backend is ASP.NET Controller. Assignment 2 uses MVC + WebAPI Controllers. Controllers appear in midterm breakdown.

**Key code patterns to know**:
- Controller vs Razor Page model (PageModel vs Controller)
- `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]` attributes
- Model binding, `[BindProperty]`
- Routing: conventional vs attribute routing
- Scaffolding pages/controllers
- Consuming external APIs from MVC (HttpClient pattern)
- Swagger interface for testing

### 6. Docker & Containers — ~7%
**Why #6**: Used throughout the course — SQL Server in Docker (Assignment 2), Redis in Docker, AI models in Docker, gRPC services. Appears on midterm. Foundation for deployment.

**Key code patterns to know**:
- `docker run`, `docker exec -it`, `docker-compose`
- SQL Server in Docker: connection strings, port mapping
- Redis in Docker: `docker run --name redis -d -p 6379:6379 redis`
- Dockerfile basics for Blazor WASM
- Pushing images to Docker Hub
- docker-compose.yml structure (services, ports, environment, volumes)

### 7. TDD & xUnit Testing — ~7%
**Why #7**: Dedicated post-midterm week (Week 13), slide deck + script. Red-Green-Refactor pattern is a software engineering fundamental. Lab requires building tests.

**Key code patterns to know**:
- `[Fact]` attribute, `[Theory]` with `[InlineData]`
- `Assert.Equal()`, `Assert.True()`, `Assert.Throws<>()`
- `dotnet test` command
- Red-Green TDD cycle: write failing test → make it pass → refactor
- FizzBuzz TDD example
- GitHub Copilot for test generation
- Test project setup: `dotnet new xunit`

### 8. SignalR (Real-Time Communication) — ~7%
**Why #8**: Dedicated pre-midterm week, on midterm, graph shows strong community (ChatHub, DrawDotHub, SignalR Hub). Tests real-time web patterns.

**Key code patterns to know**:
- Hub class: `public class ChatHub : Hub { ... }`
- `app.MapHub<ChatHub>("/chatHub")`
- Client-side: `HubConnectionBuilder`, `.withUrl()`, `.build()`, `.start()`
- `connection.invoke("MethodName", args)` / `connection.on("MethodName", callback)`
- Server-to-client: `Clients.All.SendAsync()`, `Clients.Caller`, `Clients.Others`
- LibMan for SignalR client JS library

---

## Question Style Analysis

Based on the midterm format and course materials:

1. **Code-writing questions**: Expect to write C# code snippets — controller actions, service methods, EF queries, Program.cs configuration. The professor's scripts are code-heavy with step-by-step walkthroughs.

2. **Configuration/setup questions**: "Write the line of code to register X service in Program.cs" — e.g., `builder.Services.AddMemoryCache()`, `builder.Services.AddStackExchangeRedisCache(...)`, `builder.Services.AddGrpcClient<T>()`

3. **Command-line questions**: `dotnet` CLI commands (`dotnet-ef migrations add`, `dotnet test`, `dotnet new blazor`), Docker commands (`docker run`, `docker exec`), Redis CLI (`set`, `get`, `setex`, `ttl`)

4. **Architecture/concept questions**: 3-tier architecture, MVC vs Razor Pages, REST vs gRPC, in-memory vs distributed cache, Server-side vs Client-side Blazor, cache hit/miss

5. **Short-answer definitions**: What is SignalR? What is gRPC? What is a Cache Tag Helper? Explain sliding vs absolute expiration.

---

## Bloom's Level Profile

| Level | Expected % | Examples |
|-------|-----------|----------|
| **Remember** | 25% | CLI commands, attribute names, service registration syntax |
| **Understand** | 30% | Explain cache hit/miss, REST vs gRPC, why use distributed cache |
| **Apply** | 30% | Write a controller action, configure Redis, create a proto file, write an xUnit test |
| **Analyze** | 15% | Compare Blazor Server vs WASM, choose caching strategy for scenario, debug code |

---

## Coverage Gaps — All Material, Nothing Yet Studied

Since no `/diagnose` has been run before and no flashcards/mock exams exist for this course, **all topics are gaps**. However, here's what needs attention most urgently:

### Critical Gaps (post-midterm, highest exam weight):
1. **Data Caching (IMemoryCache + Redis)** — Three scripts, extensive code patterns, no past study
2. **gRPC** — Full week + lab, unique protocol patterns
3. **AI/SLM (Semantic Kernel, Ollama, MAF, MCP)** — Two lectures, three labs, Assignment 2 requirement
4. **TDD/xUnit** — Full week + lab, specific assertion patterns
5. **TagHelpers & Cache Tag Helper** — Full week, specific HTML-like syntax
6. **Localization** — Dedicated lab, resource file patterns (.resx), `IStringLocalizer`
7. **File-based apps** — New .NET feature, compact but testable

### Secondary Gaps (pre-midterm, but foundational):
8. **.NET Aspire** — Orchestration pattern, appears in gRPC lab + Assignment 2
9. **Blazor (QuickGrid, Server vs WASM)** — Dedicated QuickGrid lab, Assignment 2
10. **Identity (Users & Roles, seeding)** — Assignment 2 role-based auth

---

## Past Exam Patterns

**No past final exams available.** Based on midterm format:

- Questions are **grouped by topic** with per-topic point allocations
- Expect **~10-13 topic sections** on the final
- Each section has **2-4 questions** worth ~3-10 points each
- Total probably ~100 points across all topics
- **Code writing is the primary format** — this professor teaches through step-by-step code walkthroughs, and tests the same way
- The **hand-written note sheet** means memorization isn't everything — focus your sheet on:
  - Service registration lines (`builder.Services.AddXxx()`)
  - CLI commands (dotnet-ef, docker, redis-cli)
  - Proto file syntax
  - Cache Tag Helper attributes
  - xUnit assertion syntax
  - Key DI patterns (constructor injection)

---

## Graph-Informed Insights

### God Nodes (structural backbones — high exam risk if unfamiliar):
- `StudentService` (16 edges) — service layer pattern, used across Blazor/gRPC/caching
- `StudentsController` (15 edges) — controller pattern, REST API
- `ASP.NET Aspire AppHost` (10 edges) — orchestration, connects multiple projects
- `IndexModel` (8 edges) — Razor Pages pattern
- `GameService` (8 edges) — Redis caching pattern, service layer with IDistributedCache

### Key Communities to study as units (not isolated topics):
- **Community 26/27: Cache & Redis** — IMemoryCache, IDistributedCache, Cache Tag Helper, Redis Docker, DistributedCacheExtensions, GameService
- **Community 9: AI Models & Agent Framework** — AIAgent, AIFunctionFactory, Semantic Kernel, GitHub Models, Plugins
- **Community 41: SignalR Concepts** — ChatHub, DrawDotHub, Hub, HubConnectionBuilder, MapHub
- **Community 18: TDD & xUnit** — Red-Green, Assert.Equal, [Fact], FizzBuzz, dotnet test
- **Community 32: Localization** — IStringLocalizer, ResX files, CookieRequestCultureProvider, RequestLocalizationOptions
- **Community 40: Custom Tag Helpers** — TagHelper base class, HtmlTargetElement, ProcessAsync

### Surprising Cross-Topic Connections (likely exam synthesis questions):
- **MVC Consuming APIs ↔ Assignment 1 Backend** — same controller pattern used both to serve and consume APIs
- **WebAPI with SQLite ↔ Assignment 1** — the HealthAPI pattern directly applies to assignment work
- **Aspire orchestrates everything** — gRPC, Blazor, React, WebAPI all orchestrated via the same `builder.AddProject` pattern
- **Docker is the infrastructure for Redis, SQL Server, and AI models** — one containerization concept, three use cases

---

## Recommended Priority Order

Study in this order, allocating time proportional to weight:

| Priority | Topic | Est. Weight | Why This Order |
|----------|-------|-------------|----------------|
| 1 | **Data Caching (IMemoryCache + Cache Tag Helper + Redis)** | ~8% | Post-midterm, 3 scripts, most code patterns to memorize |
| 2 | **gRPC** | ~8% | Post-midterm, unique protocol, proto file syntax is foreign |
| 3 | **Entity Framework Core** | ~8% | Foundation for everything, spans pre+post midterm |
| 4 | **AI/SLM (Semantic Kernel, Ollama, MAF, MCP)** | ~8% | Post-midterm, 2 lectures, Assignment 2 requirement |
| 5 | **TDD/xUnit** | ~7% | Post-midterm, specific syntax to memorize |
| 6 | **TagHelpers** | ~7% | Post-midterm, custom tag helper code pattern |
| 7 | **SignalR** | ~7% | Hub/client pattern, likely on final since it was on midterm |
| 8 | **Docker** | ~7% | Cross-cutting, used with Redis/SQL Server/AI |
| 9 | **ASP.NET MVC & Razor Pages** | ~7% | Core framework, Assignment 1 |
| 10 | **Web API & JWT** | ~7% | REST endpoints, token auth pattern |
| 11 | **Localization** | ~4% | Post-midterm, IStringLocalizer + .resx pattern |
| 12 | **Blazor (Server/WASM/QuickGrid)** | ~4% | Assignment 2, QuickGrid lab |
| 13 | **.NET Aspire** | ~3% | Orchestration, AppHost pattern |
| 14 | **File-based apps** | ~3% | New feature, compact topic |
| 15 | **Identity (Users/Roles)** | ~3% | Seeding users/roles, Assignment 2 |
| 16 | **Azure Functions / Serverless** | ~3% | Pre-midterm, but MCP lab is post |
| 17 | **React + TypeScript** | ~2% | Pre-midterm, Assignment 1 |
| 18 | **PDF/Excel/Chart** | ~2% | Post-midterm lab, niche |
| 19 | **Node.js with TypeScript** | ~1% | Minimal coverage |
| 20 | **Static Web Apps** | ~1% | Pre-midterm, deployment topic |

---

## Cheat Sheet Strategy

Your one-page note sheet should be organized by topic, prioritizing **syntax you can't easily derive**:

**Side 1 (post-midterm heavy):**
- Cache: `AddMemoryCache()`, `IMemoryCache` pattern, `<cache>` tag helper attributes (expires-after, vary-by-*), Redis setup + `AddStackExchangeRedisCache()`, `IDistributedCache` + extensions
- gRPC: proto file skeleton, `AddGrpcClient<T>()`, service implementation pattern
- TDD: `[Fact]`, `[Theory]`, `[InlineData]`, Assert methods, Red-Green cycle
- TagHelpers: `TagHelper` base, `[HtmlTargetElement]`, `ProcessAsync`, `@addTagHelper`
- AI/SLM: Semantic Kernel setup, Ollama docker command, MCP client pattern
- Localization: `IStringLocalizer<T>`, `.resx` file structure, `RequestLocalizationOptions`

**Side 2 (pre-midterm foundations + commands):**
- EF: migrations commands, DbContext setup, seeding, LINQ queries
- Docker commands: run, exec, compose, common images (SQL Server, Redis)
- WebAPI: controller attributes, REST verb mapping, Swagger
- SignalR: Hub class, MapHub, client JS pattern
- Blazor: Server vs WASM, `@rendermode`, QuickGrid columns
- Aspire: `builder.AddProject`, `WithReference`, `aspire run`
- Identity: `SeedUsersRoles` pattern, role-based `[Authorize]`
- File-based apps: `dotnet run file.cs`, `#:package`, `#:property`

---

## Next Steps

1. Run `/flashcards` for each of the top 8 priority topics
2. Run `/studyplan` with your available hours
3. After 2-3 days of study, run `/weakspots` to identify remaining gaps
4. Run `/mockexam` to simulate exam conditions
