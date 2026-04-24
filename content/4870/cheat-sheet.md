## Exam meta

- 2026-04-24 · 10:30–11:30 · SE12-327 · 80 marks / 60 min
- 60 MCQ + 10 match + 1 coding
- Allowed: one hand-written 8.5" × 11" sheet, both sides

## Condensed handwriting versions

**Shorthand legend (write in a tiny corner of your sheet):**

```text
bldr  = builder
bs    = builder.Services
mlc   = mlContext
td    = trainingData
opts  = options
ctx   = ServerCallContext / TagHelperContext
```

---

<details>
<summary><b>Block 1 — ML.NET pipeline + train + save (Style A)</b> · 12 marks · ~12 lines</summary>

```cs
// mlc = MLContext, td = trainingData (IDataView)
var p = mlc.Transforms
  .CopyColumns("Label", "FareAmount")                         // rename target → "Label"
  .Append(mlc.Transforms.Categorical.OneHotEncoding(
      "VendorIdEncoded", "VendorId"))                         // text → numeric vector
  .Append(mlc.Transforms.Concatenate("Features",              // pack inputs → "Features"
      "VendorIdEncoded", "PassengerCount", "TripDistance"))
  .Append(mlc.Regression.Trainers.FastTree());                // pick trainer

ITransformer model = p.Fit(td);                               // train
mlc.Model.Save(model, td.Schema, "Model.zip");                // schema REQUIRED
```

**Attributes (must include):**

```cs
class TaxiTrip {
  [LoadColumn(0)] public string VendorId;       // 0-BASED
  [LoadColumn(6)] public float  FareAmount;     // target
}
class TaxiTripFarePrediction {
  [ColumnName("Score")] public float FareAmount; // NOT "Prediction" — silent fail
}
```

**3 magic strings:** `"Label"` · `"Features"` · `"Score"`

</details>

<details>
<summary><b>Block 2 — AI wiring + endpoints (Style B)</b> · 13 marks · ~10 lines</summary>

```cs
// Build OpenAI-compatible client (works for GitHub / Ollama Docker / Azure)
var client = new OpenAIClient(
    new ApiKeyCredential(key),                          // NOT AzureKeyCredential!
    new OpenAIClientOptions { Endpoint = new Uri(url) });

bs.AddOpenAIChatCompletion(modelId, client);
bs.AddKernel();
// Inject IChatCompletionService into PageModel
```

**Endpoint table (must include):**

```text
GitHub :  https://models.github.ai/inference   →  ApiKeyCredential(PAT)
Ollama :  http://localhost:11434/              →  OllamaApiClient (no cred)
Docker :  http://localhost:12345/engines/llama.cpp/v1
                                                →  ApiKeyCredential("unused")
```

</details>

<details>
<summary><b>Block 3 — MAF two agent shapes (Style B)</b> · 13 marks share · ~9 lines</summary>

```cs
// Shape 1: explicit ctor (use when you set many options)
var agent = new ChatClientAgent(client, new ChatClientAgentOptions {
    Name = "Astronomer",
    ChatOptions = new ChatOptions {
        Instructions = "...",
        Temperature  = 0.7f
    }
});

// Shape 2: extension (shorter)
AIAgent agent = client.AsAIAgent(name: "Bot", instructions: "...");

// Multi-turn + invoke
var session = await agent.CreateSessionAsync();
await agent.RunAsync(prompt);          // buffered
await agent.RunStreamingAsync(prompt); // streaming
```

</details>

<details>
<summary><b>Block 4 — Cache + Redis (Style B)</b> · 8 marks · ~12 lines</summary>

```cs
// Register Redis as IDistributedCache backing store
bs.AddStackExchangeRedisCache(opts => {
    opts.Configuration = "localhost";   // port 6379 default
    opts.ConfigurationOptions = new ConfigurationOptions {
        AbortOnConnectFail = true,      // crash if Redis down (default false swallows!)
        EndPoints = { opts.Configuration }
    };
});

// Cache-aside extension (call from services)
public static async Task<T?> GetOrSetAsync<T>(
    this IDistributedCache cache,
    string key,
    Func<Task<T>> task,
    DistributedCacheEntryOptions? options = null);

// Options - fluent style
new DistributedCacheEntryOptions()
  .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))   // hard deadline
  .SetSlidingExpiration(TimeSpan.FromMinutes(2));    // idle reset
```

</details>

<details>
<summary><b>Block 5 — gRPC server override + registration (Style A)</b> · 7 marks · ~14 lines</summary>

```cs
// Inherit from ServiceName.ServiceNameBase (generated)
// UNARY override — return Task<TResponse>
public override Task<StudentModel> GetStudentInfo(
    StudentLookupModel request, ServerCallContext context)
{
    var s = _context.Students.Find(request.StudentId);
    return Task.FromResult(new StudentModel { ... });
}

// SERVER-STREAMING override — return Task + IServerStreamWriter
public override async Task RetrieveAll(
    Empty request,
    IServerStreamWriter<StudentModel> responseStream,
    ServerCallContext context)
{
    foreach (var s in _context.Students)
        await responseStream.WriteAsync(new StudentModel { ... });
}

// Server Program.cs
builder.Services.AddGrpc();
app.MapGrpcService<StudentsService>();

// Client
builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(opts =>
    opts.Address = new Uri("http://backend"));

// .csproj
// <Protobuf Include="Protos\x.proto" GrpcServices="Server|Client|Both" />
```

</details>

<details>
<summary><b>Block 6 — Aspire AppHost + ServiceDefaults (Style B)</b> · 5 marks · ~10 lines</summary>

```cs
// AppHost (DistributedApplication, NOT WebApplication!)
var bldr = DistributedApplication.CreateBuilder(args);

var db = bldr.AddSqlServer("server").AddDatabase("sqldata");

bldr.AddProject<Projects.WebApi>("backend")
    .WithReference(db)        // injects ConnectionStrings__sqldata env-var
    .WaitFor(db);             // waits for /health

bldr.Build().Run();

// Each service's Program.cs (NEVER in AppHost!)
bldr.AddServiceDefaults();    // OTel + svc discovery + /health + /alive
app.MapDefaultEndpoints();
bldr.AddSqlServerDbContext<ApplicationDbContext>("sqldata");  // by logical name
```

</details>

<details>
<summary><b>Block 7 — File-based apps directives (Style A)</b> · 8 marks · ~6 lines</summary>

```cs
#:sdk Microsoft.NET.Sdk.Web                  // for ASP.NET Core (default = console)
#:package Spectre.Console@0.49.1             // NuGet
#:property TargetFramework=net10.0           // MSBuild prop (NO spaces around =)
#:project ./MyLib/MyLib.csproj               // local project ref

// NO space after #: (#: package fails!)
// Run:  dotnet run file.cs -- arg1 arg2     (-- required to pass args!)
// Convert:  dotnet project convert file.cs -o Folder
```

</details>

<details>
<summary><b>Block 8 — Localization Program.cs recipe (Style A)</b> · 4 marks · ~17 lines</summary>

```cs
// (1) Register
builder.Services.AddLocalization(opts =>
    opts.ResourcesPath = "Resources");

// (2) Configure cultures (set BOTH SupportedCultures AND SupportedUICultures!)
builder.Services.Configure<RequestLocalizationOptions>(opts => {
    var cultures = new[] {
        new CultureInfo("en"), new CultureInfo("fr"), new CultureInfo("de") };
    opts.DefaultRequestCulture = new RequestCulture("en");
    opts.SupportedCultures   = cultures;     // formatting (CurrentCulture)
    opts.SupportedUICultures = cultures;     // .resx selection (CurrentUICulture)
});

// (3) Views + data annotations
builder.Services.AddMvc()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization(opts =>
        opts.DataAnnotationLocalizerProvider =
            (t, f) => f.Create(typeof(SharedResource)));

// (4) MIDDLEWARE — most-forgotten line! Without it, silent no-op.
app.UseRequestLocalization();

// .resx path: Resources/<folder>/<ClassName>.<culture>.resx
```

</details>

<details>
<summary><b>Block 9 — TDD xUnit + Moq (Style B)</b> · 6 marks · ~14 lines</summary>

```cs
[Fact]   // single-run test    [Theory] + [InlineData(...)]   // parameterized
public void Test_Name() {
    // ARRANGE
    var mock = new Mock<IRepo<T>>();
    mock.Setup(r => r.Method(It.IsAny<T>())).Returns(value);
    // .Callback<T>(x => sideEffect)

    // ACT
    var sut = new Service(mock.Object);    // .Object! (mock.Object, not mock)
    sut.DoWork();

    // ASSERT — expected FIRST
    Assert.Equal(expected, actual);
    mock.Verify(r => r.Method(It.IsAny<T>()), Times.Once);
}

// xUnit lifecycle: ctor runs FRESH per test (no [SetUp] needed)
// Times.Once / Times.Never / Times.Exactly(n)
// It.IsAny<T>() = match any; It.Is<T>(x => x.Id == 1) = specific
```

</details>

<details>
<summary><b>Block 10 — Custom Tag Helper (Style A)</b> · 3 marks · ~12 lines</summary>

```cs
[HtmlTargetElement("toon")]                  // bind to <toon ...> elements
public class ToonTag : TagHelper            // INHERIT TagHelper
{
    public string? FontFamily { get; set; }  // PascalCase → kebab: font-family

    public override async Task ProcessAsync(
        TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("style", "...");
        output.Content.SetHtmlContent(html);  // SetContent for safe text
    }
}

// Register in _ViewImports.cshtml:
// @addTagHelper *, AssemblyName                   (wildcard)
// @addTagHelper "Full.TypeName, AssemblyName"    (specific)
```

</details>

## Handwriting priority — what MUST be on your sheet

You cannot fit this whole doc on one sheet. Handwrite the 12 items below in this order. Everything else is reference. Condense as you copy — the goal is recall under pressure, not pretty notes.

---

### Tier 1 — Code you cannot derive (write verbatim)

#### 1. ML.NET pipeline skeleton — 12 marks

**What it does:** Builds a regression model that predicts a number (taxi fare in $) from input columns. Trains on labeled data, then saves the trained model to a `.zip` file you can ship.

**You'll write this when the question says:** "Build an ML.NET pipeline", "train a regression model", "predict X from columns Y, Z".

```cs
// "MLContext" is the root factory for everything ML.NET — data loaders, transforms, trainers.
// "trainingData" is an IDataView (a lazy table loaded from CSV, see attribute block below).

var pipeline = mlContext.Transforms
    // STEP 1: rename your target column to "Label"
    //         (trainers look up the answer by literal name "Label", not "FareAmount")
    .CopyColumns("Label", "FareAmount")

    // STEP 2: convert text categories to numeric vectors
    //         ("VTS" → [0,1], "CMT" → [1,0]) — models can't do math on strings
    .Append(mlContext.Transforms.Categorical.OneHotEncoding(
        "VendorIdEncoded",          // output column name (your choice)
        "VendorId"))                 // input column from CSV

    // STEP 3: pack ALL feature columns into one vector named "Features"
    //         (trainers look up inputs by literal name "Features")
    .Append(mlContext.Transforms.Concatenate("Features",
        "VendorIdEncoded", "PassengerCount", "TripDistance"))

    // STEP 4: pick a regression algorithm — FastTree is the course default
    .Append(mlContext.Regression.Trainers.FastTree());

// STEP 5: actually train. Returns ITransformer (NOT IDataView).
ITransformer model = pipeline.Fit(trainingData);

// STEP 6: save to disk so you can load it in another process.
//         The schema is REQUIRED — without it, .zip can't rehydrate.
mlContext.Model.Save(model, trainingData.Schema, "Model.zip");
```

**Plus two attributes** that map CSV columns and prediction output to C# fields:

```cs
public class TaxiTrip {
    [LoadColumn(0)] public string VendorId;        // 0-BASED column index in CSV
    [LoadColumn(4)] public float  TripDistance;
    [LoadColumn(6)] public float  FareAmount;      // the target (what we want to predict)
}

public class TaxiTripFarePrediction {
    [ColumnName("Score")] public float FareAmount; // FastTree writes prediction to "Score"
                                                    // NOT "Prediction" — that fails silently!
}
```

**3 magic strings to remember:** `"Label"` (target), `"Features"` (inputs), `"Score"` (output).

---

#### 2. AI wiring + endpoints — 13 marks

**What it does:** Sets up Semantic Kernel so you can inject `IChatCompletionService` into a Razor Page and chat with an AI model. The trick: GitHub Models, Ollama, and Docker SLMs all use the **same `OpenAIClient`** — you just point it at different URLs.

**You'll write this when the question says:** "wire Semantic Kernel", "configure SK in Program.cs", "inject IChatCompletionService".

```cs
// Build the HTTP client that talks to the AI service.
// Same class used for GitHub Models, Azure OpenAI, AND local Docker SLMs —
// only the endpoint URL + credential change.
var client = new OpenAIClient(
    new ApiKeyCredential(key),                                // PAT for GitHub, "unused" for Docker
    new OpenAIClientOptions { Endpoint = new Uri(url) });     // pick URL from table below

// Hand the client to Semantic Kernel's chat-completion service.
// "modelId" looks like "openai/gpt-4o-mini" for GitHub, "phi3:latest" for Docker.
builder.Services.AddOpenAIChatCompletion(modelId, client);

// Register the Kernel itself + its dependencies in DI.
// AFTER this, any class can inject IChatCompletionService via constructor.
builder.Services.AddKernel();
```

**Endpoint URLs** — memorize the shape of each:

| Backend | URL | Credential |
|---|---|---|
| **GitHub Models** (cloud) | `https://models.github.ai/inference` | `ApiKeyCredential(githubPAT)` |
| **Ollama** (local) | `http://localhost:11434/` | none — uses `OllamaApiClient` instead |
| **Docker SLM** (local) | `http://localhost:12345/engines/llama.cpp/v1` | `ApiKeyCredential("unused")` |

**Critical:** the credential class is `ApiKeyCredential` (from `System.ClientModel`), **not** `AzureKeyCredential`.

---

#### 3. MAF — two agent shapes

**What it does:** MAF (Microsoft Agent Framework) wraps any chat client as an "agent" that has a name, persistent instructions (system prompt), and a multi-turn session that tracks conversation history for you.

**You'll write this when the question says:** "create a MAF agent", "wrap an IChatClient as an agent", "multi-turn chat with session".

```cs
// SHAPE 1 — explicit constructor (used in MAF.Phi3 / Ollama lab)
//           Best when you have multiple options to set.
ChatClientAgent agent = new ChatClientAgent(
    chatClient,                                  // any IChatClient (Ollama, Docker, etc.)
    new ChatClientAgentOptions {
        Name = "Astronomer",                     // agent identifier
        ChatOptions = new ChatOptions {
            Instructions = "You are an astronomer...",  // system prompt
            Temperature  = 0.7f                  // 0 = deterministic, 1 = creative
        }
    });
```

```cs
// SHAPE 2 — extension method (used in FunnyDockerMAF lab)
//           Shorter — just name + instructions.
AIAgent agent = chatClient.AsAIAgent(
    name:         "Bot",
    instructions: "You are a useful chatbot...");
```

```cs
// MULTI-TURN — open a session so the agent remembers prior turns automatically
//              (no manual List<ChatMessage> like the raw Ollama pattern)
AgentSession session = await agent.CreateSessionAsync();

await agent.RunAsync(prompt);            // buffered — wait for whole reply
await agent.RunStreamingAsync(prompt);   // streaming — tokens arrive one at a time
```

**Don't confuse with SK:** MAF uses `RunAsync` / `RunStreamingAsync`. SK uses `kernel.InvokeAsync` / `GetStreamingChatMessageContentsAsync`. Different SDKs.

---

#### 4. Cache — distributed + Redis registration

**What it does:** Registers Redis as the backing store for `IDistributedCache`, so cached values survive restarts AND are visible across multiple app servers behind a load balancer. Also defines the cache-aside extension that everyone uses.

**You'll write this when the question says:** "configure Redis caching", "register IDistributedCache", "cache-aside pattern".

```cs
// === Program.cs registration ===
// Tells ASP.NET Core: "use Redis for IDistributedCache"
builder.Services.AddStackExchangeRedisCache(opts => {
    opts.Configuration = "localhost";              // Redis server address (port 6379 default)
    opts.ConfigurationOptions = new ConfigurationOptions {
        AbortOnConnectFail = true,                 // crash on startup if Redis is down
                                                    // (default false → silently swallows writes!)
        EndPoints = { opts.Configuration }
    };
});
```

```cs
// === Cache-aside extension method (defined in DistributedCacheExtensions.cs) ===
// "Try the cache. On miss, run the lambda, cache the result, return it."
// You CALL this from services — you don't need to write the body in the exam.
public static async Task<T?> GetOrSetAsync<T>(
    this IDistributedCache cache,                  // 'this' = extension on IDistributedCache
    string key,                                    // cache key (include params! e.g. $"games:{country}")
    Func<Task<T>> task,                            // lambda that fetches data on miss
    DistributedCacheEntryOptions? options = null); // TTL config
```

```cs
// === How you USE it in a service ===
var cacheOptions = new DistributedCacheEntryOptions()
    .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))   // hard deadline
    .SetSlidingExpiration(TimeSpan.FromMinutes(2));    // idle timeout (resets on access)

var games = await cache.GetOrSetAsync(
    $"games:country:{country}",                        // key includes parameter!
    async () => await context.Games                    // lambda runs ONLY on cache miss
        .Where(g => g.Country == country)
        .ToListAsync(),
    cacheOptions);

// On WRITE, invalidate manually — TTL alone leaves stale data
cache.Remove("games");
```

**Memory cache equivalent** (single server, lost on restart): `AddMemoryCache()` + `IMemoryCache` + `TryGetValue(key, out T v)` + `Set(key, v, options)`.

---

#### 5. gRPC — server override + registration

**What it does:** gRPC is a binary RPC framework over HTTP/2. You write a `.proto` contract, build-time codegen produces a base class, you inherit and override the methods. The exam loves the override signature.

**You'll write this when the question says:** "implement a gRPC service method", "override a gRPC RPC", "register a gRPC service in Program.cs".

```cs
// === UNARY RPC override (one request → one response) ===
// Inherit from generated base: [ServiceName].[ServiceName]Base (e.g. StudentRemote.StudentRemoteBase)
public override Task<TResponse> Method(
    TRequest request,                          // the incoming message
    ServerCallContext context)                 // call metadata (auth, deadline) — NOT optional!
{
    // Do work, then wrap the response in Task.FromResult
    return Task.FromResult(new TResponse { ... });
}
```

```cs
// === SERVER-STREAMING RPC override (one request → many responses) ===
// Differences: return type is Task (not Task<T>), extra IServerStreamWriter parameter
public override async Task RetrieveAll(
    Empty request,
    IServerStreamWriter<T> responseStream,     // write multiple messages to this
    ServerCallContext context)
{
    foreach (var item in items)
        await responseStream.WriteAsync(new T { ... });   // push each one
}
```

```cs
// === Server Program.cs ===
builder.Services.AddGrpc();                    // register gRPC framework
app.MapGrpcService<MyService>();               // wire your implementation as an endpoint

// === Client (consumer) ===
// Registers a typed CLIENT STUB in DI — inject and call methods like normal C#
builder.Services.AddGrpcClient<TStub>(opts =>
    opts.Address = new Uri("http://backend")); // logical name resolved by Aspire service discovery
```

**`.csproj` codegen control:** `<Protobuf Include="Protos\x.proto" GrpcServices="Server|Client|Both" />`. Server projects use `"Server"`, client projects use `"Client"`. Get this wrong → "TypeName not found" errors.

**Critical:** forgetting the `override` keyword silently shadows the base method → clients get `RpcException: UNIMPLEMENTED`.

---

#### 6. Aspire AppHost + ServiceDefaults

**What it does:** Aspire is "docker compose for .NET microservices, written in C#". The AppHost project orchestrates everything (databases, APIs, frontends). Each service project includes `ServiceDefaults` for telemetry + health checks + service discovery.

**You'll write this when the question says:** "wire Aspire AppHost", "register a service in Aspire", "AddServiceDefaults".

```cs
// === AppHost/Program.cs — the orchestrator ===
// Different builder than normal services!
var builder = DistributedApplication.CreateBuilder(args);

// Register a SQL Server resource (runs in container) + create the "sqldata" database
var db = builder.AddSqlServer("server").AddDatabase("sqldata");

// Register an API project, with logical name "backend"
builder.AddProject<Projects.Api>("backend")
    .WithReference(db)         // injects ConnectionStrings__sqldata env-var
    .WaitFor(db);              // delays startup until db reports healthy

builder.Build().Run();
```

```cs
// === Each service's Program.cs (NEVER in AppHost!) ===
// Adds: OpenTelemetry, /health + /alive endpoints, service discovery, HttpClient resilience
builder.AddServiceDefaults();
app.MapDefaultEndpoints();
```

```cs
// === In a consumer (e.g. WebApiFIFA) — read the DB connection by logical name ===
// No connection string in appsettings.json — Aspire injects it via env-var
builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");
```

**Logical names** replace hardcoded URLs. A frontend reaches the API as `http://backend/` — Aspire resolves to the actual port at runtime.

**Critical pitfall:** `AddServiceDefaults()` belongs in **each service**, **NEVER in AppHost** — putting it in AppHost breaks boot.

---

#### 7. File-based apps — 4 directives

**What it does:** .NET 10 lets you run a single `.cs` file as a script — no `.csproj`, no `bin/`, no `obj/`. Directives at the top tell the implicit MSBuild project what packages, properties, SDK, or projects to use.

**You'll write this when the question says:** "create a file-based .NET app", "single-file script", "what does `#:package` do?".

```cs
#!/usr/bin/env dotnet                          // optional shebang for ./file.cs on Unix

// 4 directive types — ALL go at top of file, ABOVE any using statements
#:sdk Microsoft.NET.Sdk.Web                    // switch SDK (default is console;
                                                // .Web needed for WebApplication.CreateBuilder)
#:package Spectre.Console@0.49.1               // pull a NuGet package
#:property TargetFramework=net10.0             // set an MSBuild property
#:project ./MyLibrary/MyLibrary.csproj         // reference a local project

// Top-level statements — file body IS the entry point (no Main method needed)
Console.WriteLine($"Hello {args[0]}");
```

**Three syntax rules — exam loves these:**

1. **NO space after `#:`** → `#: package X` is a parse error
2. **NO spaces around `=`** → `#:property TargetFramework = net10.0` is a parse error
3. **Version after `@`** → `#:package Foo@1.0.0`

**Run command:**

```bash
dotnet run file.cs                # no args
dotnet run file.cs -- Kevin       # the -- is REQUIRED to pass args to the script
                                  # (without --, "Kevin" goes to dotnet, not your code)
```

**Convert to traditional project:** `dotnet project convert file.cs -o FolderName`

---

#### 8. Localization Program.cs

**What it does:** Wires multi-language support — `.resx` files per culture, an `IStringLocalizer<T>` you inject and call as `localizer["Key"]`, plus middleware that picks the culture per request from query string / cookie / Accept-Language header.

**You'll write this when the question says:** "configure localization", "support multiple languages", "register IStringLocalizer".

```cs
// === STEP 1 — Register localization services ===
// Registers IStringLocalizer<T>, IHtmlLocalizer<T>, factory.
// ResourcesPath = root folder where .resx files live.
builder.Services.AddLocalization(opts =>
    opts.ResourcesPath = "Resources");

// === STEP 2 — Declare supported cultures ===
builder.Services.Configure<RequestLocalizationOptions>(opts => {
    var cultures = new[] {
        new CultureInfo("en"),
        new CultureInfo("fr"),
        new CultureInfo("de")
    };
    opts.DefaultRequestCulture = new RequestCulture("en");
    opts.SupportedCultures     = cultures;     // controls FORMATTING (CurrentCulture)
                                                // — dates, numbers, currency
    opts.SupportedUICultures   = cultures;     // controls .RESX FILE selection (CurrentUICulture)
                                                // — translated text
});

// === STEP 3 — Enable views + data annotations ===
builder.Services.AddMvc()
    .AddViewLocalization()                     // wires @inject IViewLocalizer in .cshtml
    .AddDataAnnotationsLocalization(opts =>    // translates [Required(ErrorMessage="X")]
        opts.DataAnnotationLocalizerProvider =
            (t, f) => f.Create(typeof(SharedResource)));   // route ALL validation msgs
                                                            // through SharedResource.<culture>.resx

// === STEP 4 — MIDDLEWARE (the most-forgotten line!) ===
// WITHOUT THIS, localization is silently a no-op — every request uses default culture.
// No exception thrown. Hours of confusion.
app.UseRequestLocalization();
```

**`.resx` file path convention:**

```text
Resources/<folder>/<ClassName>.<culture>.resx

Example for Pages/Index.cshtml.cs (class IndexModel):
  Resources/Pages/IndexModel.fr.resx
  Resources/Pages/IndexModel.de.resx

Example for shared marker class Sports/SharedResource.cs:
  Resources/SharedResource.fr.resx
```

**Use it in code:** `_localizer["Welcome"]` returns translated text. **In view:** `@inject IViewLocalizer Localizer` → `@Localizer["Welcome"]`.

---

### Tier 2 — Quick reference (write tersely)

#### 9. TDD — xUnit + Moq

**What it does:** Write a test that uses a fake (mock) implementation of an interface so the system-under-test runs in isolation from the real database, HTTP service, etc. Verify it called the fake the way you expected.

**You'll write this when the question says:** "write an xUnit test", "verify the method was called", "stub a dependency with Moq", "test using AAA".

```cs
[Fact]                                          // single-run test (no params)
public void Test_Description()
{
    // === ARRANGE — create the fake + set up its behavior ===
    var mock = new Mock<IRepository<T>>();      // fake implementation of an interface

    // Setup: "when r.Method(any T) is called, return value"
    mock.Setup(r => r.Method(It.IsAny<T>()))
        .Returns(value);
    // Alt: .Callback<T>(x => sideEffect)        // record what was passed in

    // === ACT — exercise the system-under-test ===
    var sut = new Service(mock.Object);          // .Object gets the FAKE implementation
                                                  // (passing 'mock' alone fails type-check!)
    sut.DoWork();

    // === ASSERT — verify outcome ===
    Assert.Equal(expected, actual);              // EXPECTED FIRST (swapping = misleading errors)

    // Verify the SUT actually called the mock method
    mock.Verify(r => r.Method(It.IsAny<T>()), Times.Once);
    // Times.Once / Times.Never / Times.Exactly(3)
}
```

**Parameterized — runs once per `[InlineData]` row:**

```cs
[Theory]
[InlineData(2, 3, 5)]                           // run 1: a=2, b=3, expected=5
[InlineData(0, 0, 0)]                           // run 2: a=0, b=0, expected=0
[InlineData(-4, 4, 0)]                          // run 3: a=-4, b=4, expected=0
public void Add(int a, int b, int expected)
{
    Assert.Equal(expected, new Calculator().Add(a, b));
}
```

**xUnit lifecycle:** the test class **constructor runs fresh before every test**. No `[SetUp]`/`[TearDown]` attributes — initialize fields in the constructor, dispose in `Dispose()`. Don't make mocks `static` (state leaks across tests).

---

#### 10. Custom Tag Helper

**What it does:** A C# class that participates in Razor rendering. When Razor sees `<toon font-family="arial">`, it calls your `Process` method which can rewrite the tag, set attributes, or replace the inner HTML.

**You'll write this when the question says:** "create a custom Tag Helper", "make a Razor element bind to a C# class".

```cs
[HtmlTargetElement("toon")]                     // bind to <toon ...> elements
public class ToonTag : TagHelper                // INHERIT from TagHelper
{
    // PascalCase property → kebab-case attribute (auto-translated)
    public string? FontFamily { get; set; }     // binds to font-family="..."

    // Override Process (sync) or ProcessAsync (async) — use Async if you await anything
    public override async Task ProcessAsync(
        TagHelperContext context,
        TagHelperOutput output)                 // the rendered output you mutate
    {
        output.TagName = "div";                 // change the rendered element name
        output.Attributes.SetAttribute("style", "...");   // set/replace an attribute
        output.Content.SetHtmlContent(html);    // replace inner HTML
                                                 // (use SetContent for safe text)
    }
}
```

**Registration — in `_ViewImports.cshtml`** (Razor doesn't auto-discover):

```razor
@addTagHelper *, AssemblyName                   // register ALL helpers in assembly (wildcard)
@addTagHelper "Full.TypeName, AssemblyName"     // register ONE specific type

@* Built-in helpers (cache, environment, partial, asp-for): *@
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
```

**Casing trap:** `BorderColor` binds to `border-color`, NOT `bordercolor`. Razor splits at uppercase boundaries.

---

#### 11. Blazor QuickGrid

**What it does:** Microsoft's data grid component for Blazor. Bind `IQueryable<T>`, get sortable/pageable columns + a paginator. Use `PropertyColumn` for direct property display, `TemplateColumn` for custom markup (action links).

**You'll write this when the question says:** "display data in a Blazor grid", "use QuickGrid", "add pagination + filter".

```razor
@page "/students"
@rendermode InteractiveServer                   // REQUIRED — without this, clicks/inputs do nothing

@* Live filter — @bind:event="oninput" fires on EVERY keystroke (not just focus loss) *@
<input @bind="Filter" @bind:event="oninput" />

@* Items binds to IQueryable<T> — EF translates sort/filter into SQL automatically *@
<QuickGrid Items="@Students" Pagination="@pagination">

    @* Direct property display, sortable header *@
    <PropertyColumn Property="s => s.Name" Sortable="true" />

    @* Custom markup with row context — for action links, multi-property cells *@
    <TemplateColumn Context="s">
        <a href="@($"edit/{s.Id}")">Edit</a>
    </TemplateColumn>

</QuickGrid>

@* Paginator State="..." in Server lab; Value="..." in WASM template — both exist *@
<Paginator State="@pagination" />

@code {
    private PaginationState pagination =
        new PaginationState { ItemsPerPage = 15 };
}
```

---

#### 12. Reporting — Excel / PDF / Chart

**What it does:** Three different "generate a file from a Razor page" patterns. Excel builds an `.xlsx` workbook in memory. PDF builds a PDF via iText 7's 4-layer pipeline. Chart.js renders a pie/bar chart in the browser from server-computed data.

**You'll write this when the question says:** "export to Excel", "generate a PDF report", "render a chart in Razor".

---

**Excel (ClosedXML)** — build `.xlsx` in memory, return as download:

```cs
// Create workbook in a using block so it disposes correctly
using var wb = new XLWorkbook();
var ws = wb.Worksheets.Add("Games");            // named sheet

// WRITE CELLS — ClosedXML is 1-BASED (Cell(1,1) = A1), NOT 0-based like C# arrays!
ws.Cell(1, 1).Value = "Header";

// Serialize to bytes
using var stream = new MemoryStream();
wb.SaveAs(stream);

// Return as file download — MIME type is the LONG openxmlformats string, NOT "application/excel"
return File(stream.ToArray(),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "report.xlsx");
```

---

**PDF (iText 7)** — 4-layer construction pipeline. Needs **both** NuGet packages installed:

```xml
<PackageReference Include="itext7" Version="9.6.0" />
<PackageReference Include="itext.bouncy-castle-adapter" Version="9.6.0" />
<!-- Missing the adapter → BUILD FINE, RUNTIME CRASH on first font/hash operation -->
```

```cs
var ms = new MemoryStream();

// Layer 1: stream sink (writes bytes)
var writer = new PdfWriter(ms);
// Layer 2: PDF file structure (pages, metadata)
var pdfDoc = new PdfDocument(writer);
// Layer 3: high-level layout engine (Paragraph, Table, LineSeparator)
var doc = new Document(pdfDoc, PageSize.A4, false);

// Keep the MemoryStream open after doc.Close()
writer.SetCloseStream(false);

// Add content
doc.Add(new Paragraph("..."));
doc.Close();

// CRITICAL — rewind the stream. PdfWriter advanced position to END;
// FileStreamResult reads from current-position → zero bytes → empty PDF download.
ms.Position = 0;

return new FileStreamResult(ms, "application/pdf") {
    FileDownloadName = "report.pdf"
};
```

---

**Chart.js (Razor + JS)** — server injects data into JS arrays via the `@:` directive:

```razor
@* The canvas is what Chart.js draws into *@
<canvas id="chart"></canvas>

@* Load Chart.js from CDN (client-side rendering only) *@
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    const labels = [], data = [];

    // @: directive at start of line = "this line is JS text with Razor @expressions"
    // Without @:, Razor tries to parse the line as Razor and fails
    @foreach (var item in Model.Data)
    {
        @:labels.push('@item.Name');       // outputs: labels.push('Asia');
        @:data.push(@item.Count);           // outputs: data.push(42);
    }

    // Chart.js v3+ constructor: new Chart(canvasElement, config)
    new Chart(document.getElementById('chart'), {
        type: 'pie',                        // 'pie' | 'bar' | 'line' | 'doughnut'
        data: { labels, datasets: [{ data }] }
    });
</script>
```

**Three common failures to remember:**
- Excel: `Cell(0, 0)` throws — it's 1-based like the Excel UI.
- PDF: forgot `ms.Position = 0` → empty/corrupted download.
- Chart: forgot `@:` inside `<script>` → Razor parse error.

---

### Skip from cheat sheet — memorize instead

Easy to recall under pressure once you've seen them 2-3 times:

- **Port numbers:** Ollama `11434`, Redis `6379`, SQL `1433`
- **Acronyms:** MCP = Model Context Protocol, SLM = Small Language Model, MAF = Microsoft Agent Framework
- **"Which is FALSE" pattern answers** — see midterm-pattern table below
- **CLI commands** that are short and self-explanatory: `mlnet regression --dataset --label-col --train-time`, `dotnet new blazorwasm -o Name`, `func start`, `ollama pull phi3`

## High-probability MCQ recall — by topic

Each row is a **single-fact question pattern from the midterm** ("Which method does X?", "What does X stand for?", "Which class does Y?"), now applied to W07-W13. Memorize the right side. Topics ordered by mark weight.

**Reading the shading:**
- **Full-opacity row** = high-leverage. Write this on your sheet.
- <span style="opacity:0.4;">Faded / dimmed row</span> = easy to remember OR duplicates a code block already on your sheet — **drop these first** if you run out of space.

### AI — Semantic Kernel + MAF + Ollama (13 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Credential class for <code>OpenAIClient</code> (GitHub Models)</td><td><code>ApiKeyCredential</code> (from <code>System.ClientModel</code>)</td></tr>
<tr><td><strong>NOT</strong> the credential class — common distractor</td><td><code>AzureKeyCredential</code> (Azure SDK, different)</td></tr>
<tr><td>Method that registers SK chat completion</td><td><code>builder.Services.AddOpenAIChatCompletion(modelId, client)</code></td></tr>
<tr><td>Method that registers the Kernel itself</td><td><code>builder.Services.AddKernel()</code></td></tr>
<tr><td>Interface injected into PageModel for SK chat</td><td><code>IChatCompletionService</code></td></tr>
<tr><td>Method that streams tokens from SK</td><td><code>GetStreamingChatMessageContentsAsync(chat)</code></td></tr>
<tr style="opacity:0.4;"><td>Constructor for SK chat history with system prompt</td><td><code>new ChatHistory("system prompt")</code></td></tr>
<tr style="opacity:0.4;"><td>Append a user turn to ChatHistory</td><td><code>chat.AddUserMessage("...")</code></td></tr>
<tr><td>GitHub Models endpoint</td><td><code>https://models.github.ai/inference</code></td></tr>
<tr><td>Ollama daemon URL</td><td><code>http://localhost:11434/</code></td></tr>
<tr><td>Ollama daemon port</td><td><strong>11434</strong></td></tr>
<tr><td>NuGet package for Ollama client</td><td><code>OllamaSharp</code></td></tr>
<tr><td>Class to talk to local Ollama</td><td><code>OllamaApiClient</code></td></tr>
<tr><td>Interface returned by <code>OllamaApiClient</code></td><td><code>IChatClient</code> (from <code>Microsoft.Extensions.AI</code>)</td></tr>
<tr style="opacity:0.4;"><td>Method that streams from <code>IChatClient</code></td><td><code>GetStreamingResponseAsync(history)</code> — already in MAF code block</td></tr>
<tr><td>Extension that wraps IChatClient as MAF agent</td><td><code>chatClient.AsAIAgent(name, instructions)</code></td></tr>
<tr><td><strong>NOT</strong> the extension method — common distractor</td><td><code>.AsAgent()</code> (does not exist)</td></tr>
<tr style="opacity:0.4;"><td>MAF buffered call</td><td><code>agent.RunAsync(prompt)</code> — already in MAF code block</td></tr>
<tr style="opacity:0.4;"><td>MAF streaming call</td><td><code>agent.RunStreamingAsync(prompt)</code> — already in MAF code block</td></tr>
<tr><td>MAF multi-turn session creation</td><td><code>await agent.CreateSessionAsync()</code></td></tr>
<tr style="opacity:0.4;"><td>MAF agent constructor (alternative shape)</td><td><code>new ChatClientAgent(client, ChatClientAgentOptions)</code> — already in MAF code block</td></tr>
<tr><td>SLM stands for</td><td><strong>Small Language Model</strong></td></tr>
<tr><td>LLM stands for</td><td><strong>Large Language Model</strong></td></tr>
<tr><td>MAF stands for</td><td><strong>Microsoft Agent Framework</strong></td></tr>
<tr><td>Docker SLM endpoint</td><td><code>http://localhost:12345/engines/llama.cpp/v1</code></td></tr>
<tr style="opacity:0.4;"><td>Docker SLM credential value</td><td><code>ApiKeyCredential("unused")</code> — already in endpoint table</td></tr>
</tbody>
</table>

### MCP (part of 13 AI marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>MCP stands for</td><td><strong>Model Context Protocol</strong></td></tr>
<tr><td>MCP purpose</td><td>Interoperability between heterogeneous AI hosts and tool servers</td></tr>
<tr><td>MCP data format</td><td><strong>JSON</strong></td></tr>
<tr><td>MCP network protocol (per midterm Q43)</td><td><strong>gRPC</strong></td></tr>
</tbody>
</table>

### ML.NET (12 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Root factory class</td><td><code>MLContext</code> (use <code>new MLContext(seed: 0)</code> for determinism)</td></tr>
<tr><td>Return type of <code>pipeline.Fit(data)</code></td><td><code>ITransformer</code> (NOT <code>IDataView</code>)</td></tr>
<tr><td>Required output column for trainers (input vector)</td><td><code>"Features"</code></td></tr>
<tr><td>Required target column name</td><td><code>"Label"</code></td></tr>
<tr><td>Column name regression trainers write predictions to</td><td><code>"Score"</code></td></tr>
<tr><td>Method that renames the target column</td><td><code>CopyColumns(outputColumnName, inputColumnName)</code></td></tr>
<tr style="opacity:0.4;"><td>Method that one-hot-encodes a text column</td><td><code>mlContext.Transforms.Categorical.OneHotEncoding(out, in)</code> — already in pipeline code</td></tr>
<tr style="opacity:0.4;"><td>Method that packs features into a vector</td><td><code>mlContext.Transforms.Concatenate("Features", ...)</code> — already in pipeline code</td></tr>
<tr style="opacity:0.4;"><td>Default regression trainer in TaxiFare demo</td><td><code>mlContext.Regression.Trainers.FastTree()</code> — already in pipeline code</td></tr>
<tr><td>Method that evaluates a regression model</td><td><code>mlContext.Regression.Evaluate(predictions, "Label", "Score")</code></td></tr>
<tr><td>Return type of <code>Regression.Evaluate(...)</code></td><td><code>RegressionMetrics</code></td></tr>
<tr><td><code>RegressionMetrics</code> property — variance explained</td><td><code>RSquared</code> (range 0–1, unitless)</td></tr>
<tr><td><code>RegressionMetrics</code> property — avg error</td><td><code>RootMeanSquaredError</code> (in label units)</td></tr>
<tr><td>Attribute that maps CSV column to class field</td><td><code>[LoadColumn(N)]</code> (<strong>0-based</strong>)</td></tr>
<tr><td>Attribute on prediction class output field</td><td><code>[ColumnName("Score")]</code></td></tr>
<tr><td>Single-row inference factory</td><td><code>mlContext.Model.CreatePredictionEngine&lt;TIn, TOut&gt;(model)</code></td></tr>
<tr style="opacity:0.4;"><td>Save trained model — required args</td><td><code>Model.Save(model, dataView.Schema, path)</code> — already in pipeline code</td></tr>
<tr style="opacity:0.4;"><td>Load trained model — signature</td><td><code>Model.Load(path, out DataViewSchema schema)</code></td></tr>
<tr><td>AutoML CLI binary name (lowercase, no dot)</td><td><strong><code>mlnet</code></strong></td></tr>
<tr><td>AutoML flag for exploration budget</td><td><code>--train-time</code> (in seconds)</td></tr>
<tr style="opacity:0.4;"><td>AutoML flag for target column</td><td><code>--label-col</code> (0-based index OR column name) — niche</td></tr>
<tr><td><strong>What does <code>R² = 0.89</code> mean?</strong></td><td>"Model explains 89% of variance" (NOT "89% accurate")</td></tr>
<tr><td><strong><code>RMSE = 3.30</code> in taxi-fare model means</strong></td><td>"Predictions miss by ~$3.30 on average" (NOT a percentage)</td></tr>
</tbody>
</table>

### Cache + Redis (8 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Method that registers in-memory cache</td><td><code>builder.Services.AddMemoryCache()</code></td></tr>
<tr><td>Interface registered by <code>AddMemoryCache()</code></td><td><code>IMemoryCache</code></td></tr>
<tr><td>Method that registers Redis</td><td><code>builder.Services.AddStackExchangeRedisCache(opts =&gt; { ... })</code></td></tr>
<tr><td>Interface registered by <code>AddStackExchangeRedisCache()</code></td><td><code>IDistributedCache</code></td></tr>
<tr><td>Redis default port</td><td><strong>6379</strong></td></tr>
<tr><td>Memory cache "try-then-set" method</td><td><code>_cache.TryGetValue(key, out T? value)</code></td></tr>
<tr><td>Distributed cache extension for cache-aside</td><td><code>cache.GetOrSetAsync&lt;T&gt;(key, lambda, options)</code></td></tr>
<tr style="opacity:0.4;"><td>Cache options class — fluent style</td><td><code>DistributedCacheEntryOptions</code> — already in cache code</td></tr>
<tr style="opacity:0.4;"><td>Cache options class — object init</td><td><code>MemoryCacheEntryOptions { ... }</code> — easy to recall pattern</td></tr>
<tr style="opacity:0.4;"><td>Hard wall-clock TTL property</td><td><code>AbsoluteExpiration</code> — easy</td></tr>
<tr style="opacity:0.4;"><td>Idle-timeout TTL (resets on access)</td><td><code>SlidingExpiration</code> — easy</td></tr>
<tr><td><code>Priority</code> is — eviction order or TTL?</td><td><strong>Eviction order under memory pressure</strong> (NOT a TTL)</td></tr>
<tr style="opacity:0.4;"><td>Setting that crashes startup if Redis is down</td><td><code>AbortOnConnectFail = true</code> — already in cache code</td></tr>
<tr style="opacity:0.4;"><td>Cache invalidation on write — method</td><td><code>cache.Remove(key)</code> — trivially guessable</td></tr>
<tr><td>Redis CLI: set with 10-second TTL</td><td><code>SETEX key 10 "value"</code> (seconds, not ms)</td></tr>
<tr style="opacity:0.4;"><td>Redis CLI: set with millisecond TTL</td><td><code>PSETEX key ms "value"</code> — niche</td></tr>
<tr style="opacity:0.4;"><td>Built-in Razor caching tag</td><td><code>&lt;cache vary-by-user vary-by-route ...&gt;</code> — easy</td></tr>
<tr style="opacity:0.4;"><td><code>&lt;cache&gt;</code> Tag Helper backed by</td><td><code>IMemoryCache</code></td></tr>
<tr><td><strong>Why does load-balanced app see stale data with <code>AddMemoryCache</code>?</strong></td><td>Each instance has its own <code>IMemoryCache</code> — switch to Redis-backed <code>IDistributedCache</code></td></tr>
</tbody>
</table>

### File-based apps — .NET 10 (8 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Command to run a file-based app</td><td><code>dotnet run file.cs</code></td></tr>
<tr><td>Pass args to file-based script</td><td><code>dotnet run file.cs -- arg1 arg2</code> (<code>--</code> is required)</td></tr>
<tr><td>Convert script to traditional project</td><td><code>dotnet project convert file.cs -o FolderName</code></td></tr>
<tr><td>Directive — declare NuGet dependency</td><td><code>#:package Name@Version</code></td></tr>
<tr><td>Directive — set MSBuild property</td><td><code>#:property TargetFramework=net10.0</code></td></tr>
<tr><td>Directive — switch SDK</td><td><code>#:sdk Microsoft.NET.Sdk.Web</code> (for ASP.NET Core)</td></tr>
<tr><td>Directive — reference a project</td><td><code>#:project ./Lib/Lib.csproj</code></td></tr>
<tr><td>Directive syntax rule #1</td><td><strong>NO space after <code>#:</code></strong> (<code>#: package</code> fails)</td></tr>
<tr><td>Directive syntax rule #2</td><td><strong>NO spaces around <code>=</code></strong> in <code>#:property</code></td></tr>
<tr><td>Directive position requirement</td><td>All directives at <strong>top of file</strong>, above <code>using</code> and code</td></tr>
<tr><td>.NET version where file-based apps work</td><td><strong>.NET 10</strong> (8/9 don't fully support)</td></tr>
<tr style="opacity:0.4;"><td>Cache location for compiled scripts</td><td><code>~/.dotnet/runfile/</code> — niche</td></tr>
</tbody>
</table>

### gRPC (7 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr style="opacity:0.4;"><td>gRPC stands for</td><td><strong>g</strong>oogle <strong>R</strong>emote <strong>P</strong>rocedure <strong>C</strong>all — easy</td></tr>
<tr><td>Wire format</td><td>Binary <strong>Protobuf</strong> (NOT JSON)</td></tr>
<tr><td>Required transport</td><td><strong>HTTP/2</strong></td></tr>
<tr><td>Method that registers gRPC services</td><td><code>builder.Services.AddGrpc()</code></td></tr>
<tr><td>Method that maps a service implementation</td><td><code>app.MapGrpcService&lt;MyService&gt;()</code></td></tr>
<tr><td>Method that registers a client stub</td><td><code>builder.Services.AddGrpcClient&lt;TStub&gt;(opts =&gt; opts.Address = ...)</code></td></tr>
<tr><td>Server class inheritance shape</td><td><code>public class X : ServiceName.ServiceNameBase</code></td></tr>
<tr><td>Unary RPC override signature</td><td><code>(Request request, ServerCallContext context) → Task&lt;Response&gt;</code></td></tr>
<tr><td>Server-streaming differences</td><td>Return <code>Task</code> (not <code>Task&lt;T&gt;</code>) + extra <code>IServerStreamWriter&lt;T&gt;</code> parameter</td></tr>
<tr style="opacity:0.4;"><td><code>.proto</code> syntax declaration</td><td><code>syntax = "proto3";</code> — easy</td></tr>
<tr style="opacity:0.4;"><td><code>.proto</code> C# namespace option</td><td><code>option csharp_namespace = "X";</code> — niche</td></tr>
<tr><td><code>.csproj</code> codegen attribute</td><td><code>&lt;Protobuf Include="..." GrpcServices="Server|Client|Both" /&gt;</code></td></tr>
<tr><td>Tag numbers 1–15 are special because...</td><td>They encode in <strong>1 byte</strong> on the wire (16+ take 2)</td></tr>
<tr style="opacity:0.4;"><td><code>repeated T items = 1;</code> C# type</td><td><code>RepeatedField&lt;T&gt;</code> (use <code>.Add(...)</code>) — niche</td></tr>
<tr><td>Error when <code>override</code> is missing</td><td>Method shadows base → client gets <code>RpcException: UNIMPLEMENTED</code></td></tr>
</tbody>
</table>

### TDD — xUnit + Moq (6 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr style="opacity:0.4;"><td>Three phases of TDD</td><td><strong>Red → Green → Refactor</strong> — easy</td></tr>
<tr><td>Attribute marking a single-run test</td><td><code>[Fact]</code></td></tr>
<tr><td>Attribute marking a parameterized test</td><td><code>[Theory]</code> (paired with <code>[InlineData(...)]</code>)</td></tr>
<tr><td><code>Assert.Equal</code> argument order</td><td><strong>expected first</strong>, actual second</td></tr>
<tr style="opacity:0.4;"><td>Assertion for not-null</td><td><code>Assert.NotNull(obj)</code> — easy</td></tr>
<tr style="opacity:0.4;"><td>Assertion for empty collection</td><td><code>Assert.Empty(collection)</code> — easy</td></tr>
<tr style="opacity:0.4;"><td>Assertion for exactly one element</td><td><code>Assert.Single(collection)</code> — niche</td></tr>
<tr style="opacity:0.4;"><td>Assertion for exception</td><td><code>Assert.Throws&lt;TException&gt;(() =&gt; action())</code> — easy</td></tr>
<tr><td>Moq creation</td><td><code>new Mock&lt;IRepository&lt;T&gt;&gt;()</code></td></tr>
<tr><td>Moq stub method</td><td><code>mock.Setup(r =&gt; r.Method(It.IsAny&lt;T&gt;())).Returns(value)</code></td></tr>
<tr style="opacity:0.4;"><td>Moq capture call args</td><td><code>.Callback&lt;T&gt;(x =&gt; sideEffect)</code> — already in TDD code block</td></tr>
<tr><td>Pass mock to system-under-test</td><td><code>new SUT(mock.Object)</code> (the <code>.Object</code> property!)</td></tr>
<tr><td>Moq assert call happened</td><td><code>mock.Verify(r =&gt; r.Method(...), Times.Once)</code></td></tr>
<tr><td><code>It.IsAny&lt;T&gt;()</code> meaning</td><td>"Match any value of type T"</td></tr>
<tr style="opacity:0.4;"><td><code>It.Is&lt;T&gt;(x =&gt; x.Id == 1)</code> meaning</td><td>"Match T values where predicate is true" — niche</td></tr>
<tr><td>xUnit lifecycle — when does ctor run?</td><td><strong>Before every test</strong> (no <code>[SetUp]</code> attribute needed)</td></tr>
<tr style="opacity:0.4;"><td>xUnit cleanup — equivalent of <code>[TearDown]</code></td><td><code>IDisposable.Dispose()</code> — niche</td></tr>
<tr><td><strong>Why "test right after code" isn't TDD</strong></td><td>Retrofit tests pass on first run — no Red phase to prove they can fail</td></tr>
</tbody>
</table>

### .NET Aspire (5 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Orchestrator builder creation</td><td><code>var builder = DistributedApplication.CreateBuilder(args)</code></td></tr>
<tr><td>Method that registers a project</td><td><code>builder.AddProject&lt;Projects.X&gt;("logical-name")</code></td></tr>
<tr><td>Method that injects connection info</td><td><code>.WithReference(resource)</code> (writes <code>ConnectionStrings__X</code> env-var)</td></tr>
<tr><td>Method that delays startup</td><td><code>.WaitFor(resource)</code> (waits for <code>/health</code>)</td></tr>
<tr style="opacity:0.4;"><td>Method that adds an env-var</td><td><code>.WithEnvironment("Key", "Value")</code> — easy</td></tr>
<tr style="opacity:0.4;"><td>Resource — SQL Server</td><td><code>builder.AddSqlServer("name").AddDatabase("dbname")</code> — already in code block</td></tr>
<tr style="opacity:0.4;"><td>Resource — Redis</td><td><code>builder.AddRedis("name")</code> — easy</td></tr>
<tr><td>Service-side <code>Program.cs</code> calls — two methods</td><td><code>builder.AddServiceDefaults()</code> + <code>app.MapDefaultEndpoints()</code></td></tr>
<tr><td><code>AddServiceDefaults()</code> belongs in</td><td><strong>Each service's <code>Program.cs</code></strong> (NEVER in AppHost)</td></tr>
<tr><td>What <code>AddServiceDefaults()</code> registers</td><td>OpenTelemetry + service discovery + health checks + HttpClient resilience</td></tr>
<tr><td>URL form for service-discovery</td><td><code>http://logical-name/</code> (no port hardcoded)</td></tr>
<tr><td>Readiness endpoint</td><td><code>/health</code> (all checks must pass)</td></tr>
<tr><td>Liveness endpoint</td><td><code>/alive</code> (only <code>"live"</code>-tagged checks)</td></tr>
<tr style="opacity:0.4;"><td>Consume DB connection by logical name</td><td><code>builder.AddSqlServerDbContext&lt;ApplicationDbContext&gt;("sqldata")</code> — already in code block</td></tr>
</tbody>
</table>

### Localization (4 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Method that registers core localization</td><td><code>builder.Services.AddLocalization(opts =&gt; opts.ResourcesPath = "Resources")</code></td></tr>
<tr><td>Middleware that applies request culture</td><td><code>app.UseRequestLocalization()</code></td></tr>
<tr><td><strong>Why localization "doesn't switch language"</strong></td><td>Missing <code>app.UseRequestLocalization()</code> middleware</td></tr>
<tr style="opacity:0.4;"><td>Configures supported cultures</td><td><code>Configure&lt;RequestLocalizationOptions&gt;(opts =&gt; { ... })</code> — already in code block</td></tr>
<tr><td>Property controlling formatting</td><td><code>Thread.CurrentCulture</code> (dates, numbers)</td></tr>
<tr><td>Property controlling <code>.resx</code> selection</td><td><code>Thread.CurrentUICulture</code></td></tr>
<tr><td>Interface for code-behind text</td><td><code>IStringLocalizer&lt;T&gt;</code></td></tr>
<tr><td>Interface for HTML-containing translations</td><td><code>IHtmlLocalizer&lt;T&gt;</code></td></tr>
<tr><td>Interface for <code>.cshtml</code> views</td><td><code>IViewLocalizer</code> (used with <code>@inject</code>)</td></tr>
<tr><td><code>.resx</code> path convention</td><td><code>Resources/&lt;folder&gt;/&lt;ClassName&gt;.&lt;culture&gt;.resx</code></td></tr>
<tr><td>Default culture provider order</td><td>Query string → cookie → <code>Accept-Language</code> header</td></tr>
<tr style="opacity:0.4;"><td>Cookie name for culture</td><td><code>.AspNetCore.Culture</code> — niche</td></tr>
</tbody>
</table>

### Tag Helpers (3 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Custom Tag Helper base class</td><td><code>TagHelper</code> (in <code>Microsoft.AspNetCore.Razor.TagHelpers</code>)</td></tr>
<tr><td>Attribute that binds to an element</td><td><code>[HtmlTargetElement("name")]</code></td></tr>
<tr><td>Override for async work</td><td><code>ProcessAsync(TagHelperContext context, TagHelperOutput output)</code></td></tr>
<tr style="opacity:0.4;"><td>Override for sync work</td><td><code>Process(...)</code> — easy</td></tr>
<tr style="opacity:0.4;"><td>Set output element name</td><td><code>output.TagName = "div"</code> — already in code block</td></tr>
<tr style="opacity:0.4;"><td>Set / replace an attribute</td><td><code>output.Attributes.SetAttribute("style", "...")</code> — already in code block</td></tr>
<tr style="opacity:0.4;"><td>Replace inner HTML</td><td><code>output.Content.SetHtmlContent(html)</code> — already in code block</td></tr>
<tr style="opacity:0.4;"><td>Replace inner text (escaped)</td><td><code>output.Content.SetContent(text)</code> — niche</td></tr>
<tr><td>Where to register Tag Helpers</td><td><code>_ViewImports.cshtml</code></td></tr>
<tr><td>Wildcard registration</td><td><code>@addTagHelper *, AssemblyName</code></td></tr>
<tr><td>Specific-type registration</td><td><code>@addTagHelper "Full.TypeName, AssemblyName"</code></td></tr>
<tr><td>C# <code>FontFamily</code> property → HTML attribute</td><td><code>font-family</code> (PascalCase ↔ kebab-case)</td></tr>
<tr style="opacity:0.4;"><td>Built-in helpers' assembly</td><td><code>Microsoft.AspNetCore.Mvc.TagHelpers</code> — niche</td></tr>
</tbody>
</table>

### Blazor + QuickGrid (2 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Best description of Blazor</td><td>"Blazor is .NET in the browser"</td></tr>
<tr><td>Blazor file extension</td><td><code>.razor</code></td></tr>
<tr><td>Page-load lifecycle method</td><td><code>OnInitializedAsync()</code></td></tr>
<tr><td>Nav menu file location</td><td><code>Shared/NavMenu.razor</code></td></tr>
<tr style="opacity:0.4;"><td>Razor operator</td><td><code>@</code> — single character, easy</td></tr>
<tr style="opacity:0.4;"><td>Two-way bind directive</td><td><code>@bind</code> (or <code>@bind-value</code>) — easy</td></tr>
<tr style="opacity:0.4;"><td>Make <code>@bind</code> fire on every keystroke</td><td><code>@bind:event="oninput"</code> — already in QuickGrid code</td></tr>
<tr style="opacity:0.4;"><td>Clickable nav anchor tag</td><td><code>&lt;NavLink&gt;</code> — easy</td></tr>
<tr><td>Blazor WASM CLI scaffold</td><td><code>dotnet new blazorwasm -o Name</code></td></tr>
<tr style="opacity:0.4;"><td>Blazor Server CLI scaffold</td><td><code>dotnet new blazor -o Name</code> — niche</td></tr>
<tr><td>Blazor WASM API call class</td><td><code>HttpClient</code></td></tr>
<tr><td><strong>Blazor WASM CANNOT...</strong></td><td>Directly access a database (must call an API)</td></tr>
<tr style="opacity:0.4;"><td>Blazor Server transport</td><td><strong>SignalR</strong> over WebSockets — easy concept</td></tr>
<tr style="opacity:0.4;"><td>Render mode for interactive Server</td><td><code>@rendermode InteractiveServer</code> — already in QuickGrid code</td></tr>
<tr style="opacity:0.4;"><td>QuickGrid column for direct property</td><td><code>&lt;PropertyColumn Property="x =&gt; x.Field" Sortable="true" /&gt;</code> — already in code</td></tr>
<tr style="opacity:0.4;"><td>QuickGrid column for custom markup</td><td><code>&lt;TemplateColumn Context="x"&gt; ... &lt;/TemplateColumn&gt;</code> — already in code</td></tr>
<tr style="opacity:0.4;"><td>QuickGrid pagination state class</td><td><code>PaginationState { ItemsPerPage = N }</code> — already in code</td></tr>
<tr style="opacity:0.4;"><td>QuickGrid pager component</td><td><code>&lt;Paginator State="@pagination" /&gt;</code> — already in code</td></tr>
</tbody>
</table>

### Excel / PDF / Chart (2 marks)

<table>
<thead><tr><th>Q pattern</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>Excel <code>.xlsx</code> MIME type</td><td><code>application/vnd.openxmlformats-officedocument.spreadsheetml.sheet</code></td></tr>
<tr><td>ClosedXML cell indexing</td><td><strong>1-based</strong> (<code>Cell(1, 1)</code> = <code>A1</code>)</td></tr>
<tr style="opacity:0.4;"><td>Add a worksheet</td><td><code>workbook.Worksheets.Add("Name")</code> — trivial</td></tr>
<tr style="opacity:0.4;"><td>ClosedXML save method</td><td><code>workbook.SaveAs(stream)</code> — easy</td></tr>
<tr><td>iText 7 — required NuGet packages</td><td><code>itext7</code> <strong>AND</strong> <code>itext.bouncy-castle-adapter</code></td></tr>
<tr style="opacity:0.4;"><td>iText 7 — pipeline order</td><td><code>MemoryStream</code> → <code>PdfWriter(ms)</code> → <code>PdfDocument(writer)</code> → <code>Document(pdfDoc, PageSize.A4, false)</code> — already in code block</td></tr>
<tr style="opacity:0.4;"><td>iText 7 — keep stream open after Close</td><td><code>writer.SetCloseStream(false)</code> — already in code block</td></tr>
<tr><td><strong>Why PDF download is empty/corrupted</strong></td><td>Forgot <code>ms.Position = 0</code> before <code>FileStreamResult</code></td></tr>
<tr><td>PDF MIME type</td><td><code>application/pdf</code></td></tr>
<tr style="opacity:0.4;"><td>Add a paragraph (iText)</td><td><code>document.Add(new Paragraph("..."))</code> — trivial</td></tr>
<tr><td>Chart.js v3+ constructor</td><td><code>new Chart(ctx, { type, data })</code></td></tr>
<tr><td>Razor directive for JS lines with <code>@expr</code></td><td><code>@:</code> (e.g. <code>@:array.push(@item.Count);</code>)</td></tr>
<tr><td>Chart.js renders where</td><td><strong>Client-side only</strong> (no server fallback)</td></tr>
<tr style="opacity:0.4;"><td>Chart <code>type</code> values</td><td><code>'pie'</code> / <code>'bar'</code> / <code>'line'</code> / <code>'doughnut'</code> / <code>'radar'</code> / <code>'scatter'</code></td></tr>
</tbody>
</table>

---

**Out of scope from midterm — DON'T put on cheat sheet:** Razor Pages basics (page-level routing, OnGet/OnPost), MVC controllers, Entity Framework / Migrations / `[Key]` / `[MaxLength]`, Identity / `[Authorize]` / `IdentityRole`, JWT, Azure App Services / Functions / Static Web Apps / Resource Groups, SignalR `Hub` class. These were W01-W06 material.

## AI — Semantic Kernel + MAF + Ollama + GitHub Models

**TL;DR** — All OpenAI-compatible endpoints use the same `OpenAIClient(new ApiKeyCredential(key), new OpenAIClientOptions { Endpoint = new Uri(url) })` shape. Only URL + credential change.

**Semantic Kernel wiring (W02 lab, GitHub Models):**

```cs
using Microsoft.SemanticKernel;
using OpenAI;
using System.ClientModel;

var client = new OpenAIClient(
    new ApiKeyCredential(builder.Configuration["AI:PAT"]!),
    new OpenAIClientOptions { Endpoint = new Uri(builder.Configuration["AI:Endpoint"]!) });

builder.Services.AddOpenAIChatCompletion(builder.Configuration["AI:Model"]!, client);
builder.Services.AddKernel();
```

- Package: `Microsoft.SemanticKernel` (only)
- Inject `IChatCompletionService` into PageModel
- `ChatHistory chat = new("system prompt");` + `.AddUserMessage(...)` / `.AddAssistantMessage(...)`
- Stream: `await foreach (var m in _chat.GetStreamingChatMessageContentsAsync(chat)) sb.Append(m.Content);`
- Endpoint: `https://models.github.ai/inference` · Model id: `openai/gpt-4o-mini`
- Session persistence: JSON-serialize `List<ChatEntry>` to `HttpContext.Session`

**MAF agent — two shapes:**

1. Ctor (MAF.Phi3):
```cs
ChatClientAgent agent = new ChatClientAgent(ollamaClient,
    new ChatClientAgentOptions { Name = "Astronomer",
        ChatOptions = new ChatOptions { Instructions = "...", Temperature = 0.7f }});
await agent.RunAsync("How far is earth from the sun?");
```

2. `.AsAIAgent` (FunnyDockerMAF):
```cs
AIAgent agent = chatClient.AsAIAgent(name: "Bot", instructions: "...");
AgentSession session = await agent.CreateSessionAsync();
await foreach (var u in agent.RunStreamingAsync(input,
    options: new ChatClientAgentRunOptions(chatOptions))) Console.Write(u.Text);
```

- Package: `Microsoft.Agents.AI` + `Microsoft.Agents.AI.OpenAI`
- Multi-turn: `AgentSession session = await agent.CreateSessionAsync()`
- `.AsAIAgent()` NOT `.AsAgent()` · `RunAsync`/`RunStreamingAsync` NOT `Invoke`

**Ollama (local SLM):**

```cs
IChatClient chatClient = new OllamaApiClient(new Uri("http://localhost:11434/"), "phi3");
List<ChatMessage> chatHistory = new();
chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));
await foreach (var u in chatClient.GetStreamingResponseAsync(chatHistory))
    Console.Write(u.Text);
```

- Package: `OllamaSharp` + `Microsoft.Extensions.AI`
- HTTP (not HTTPS) · port 11434 · no auth · fully local after `ollama pull phi3`
- CLI: `ollama pull phi3:latest` · `ollama list` · `ollama run phi3:latest`

**Docker local SLM (OpenAI-compatible):**

```cs
var openAIClient = new OpenAIClient(
    new ApiKeyCredential("unused"),        // local runtimes ignore credential
    new OpenAIClientOptions { Endpoint = new Uri("http://localhost:12345/engines/llama.cpp/v1") });
var chatClient = openAIClient.GetChatClient("ai/ministral3:latest");
// Either: await chatClient.CompleteChatAsync(prompt)
// Or:     chatClient.AsAIAgent(name, instructions)
```

**Traps**

- Credential is `ApiKeyCredential` (from `System.ClientModel`) — NOT `AzureKeyCredential`
- W02 lab does NOT use `KernelBuilder`, `Kernel.CreateBuilder()`, `ImportPluginFromType<T>`, `[KernelFunction]`, or `skprompt.txt` — those are SK features but out of the demoed scope
- `AIFunctionFactory.Create(...)` + tool registration — NOT in any lab or demo
- Endpoint URL shapes:
  - GitHub: `https://models.github.ai/inference`
  - Ollama: `http://localhost:11434/`
  - Docker SLM: `http://localhost:12345/engines/llama.cpp/v1`
- Model id formats:
  - GitHub: vendor prefix `openai/gpt-4o-mini`
  - Ollama: bare tag `phi3:latest`
  - Docker SLM: image id `ai/ministral3:latest`

## ML.NET (TaxiFarePrediction demo)

**Pipeline (end-to-end):**

```cs
MLContext mlContext = new MLContext(seed: 0);

IDataView trainingData = mlContext.Data.LoadFromTextFile<TaxiTrip>(
    trainDataPath, hasHeader: true, separatorChar: ',');

var pipeline = mlContext.Transforms
    .CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("VendorIdEncoded", "VendorId"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("RateCodeEncoded", "RateCode"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("PaymentTypeEncoded", "PaymentType"))
    .Append(mlContext.Transforms.Concatenate("Features",
        "VendorIdEncoded", "RateCodeEncoded", "PassengerCount",
        "TripDistance", "PaymentTypeEncoded"))
    .Append(mlContext.Regression.Trainers.FastTree());

ITransformer model = pipeline.Fit(trainingData);
mlContext.Model.Save(model, trainingData.Schema, "Model.zip");
```

**Evaluate (separate test file — no TrainTestSplit in demo):**

```cs
IDataView testData = mlContext.Data.LoadFromTextFile<TaxiTrip>(testDataPath, hasHeader: true, separatorChar: ',');
var predictions = model.Transform(testData);
var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");
// metrics.RSquared, metrics.RootMeanSquaredError
```

**Predict one row:**

```cs
var engine = mlContext.Model.CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);
var prediction = engine.Predict(sample);
Console.WriteLine($"Predicted fare: {prediction.FareAmount:0.####}");
```

**Load:**

```cs
DataViewSchema schema;
ITransformer loaded = mlContext.Model.Load("Model.zip", out schema);
```

**Input class:** `[LoadColumn(N)]` is 0-based. E.g. `[LoadColumn(0)] public string VendorId;`

**Output class:** `[ColumnName("Score")] public float FareAmount;`

**AutoML CLI:** `mlnet regression --dataset train.csv --label-col 6 --train-time 60 --has-header true`

**Must-know**

- `Fit()` returns **`ITransformer`** — NOT `IDataView`
- Column names `"Label"` and `"Features"` are hardcoded — trainers look them up by that exact string
- `Evaluate` needs the task-matching namespace: `mlContext.Regression.Evaluate(...)` for regression
- Read `RSquared` (0–1, variance explained, unitless) + `RootMeanSquaredError` (label units — dollars for fare, lower = better)

**Traps**

- `RSquared = 0.89` ≠ "89% accuracy" (accuracy is classification; R² is unitless variance-explained)
- RMSE is in label units, NOT percentage
- Demo uses only `FastTree` — no LightGbm/Sdca/FastForest shown as dev-code
- `PredictionEnginePool` NOT demoed — keep to `CreatePredictionEngine<TIn,TOut>`

## Cache + Redis

**IMemoryCache (DataCacheDemo):**

```cs
// Register
builder.Services.AddMemoryCache();

// Use (cache-aside)
if (!_memoryCache.TryGetValue(cacheKey, out Product[]? productList))
{
    productList = await FetchAsync();
    var cacheExpiryOptions = new MemoryCacheEntryOptions
    {
        AbsoluteExpiration  = DateTime.Now.AddSeconds(50),
        Priority            = CacheItemPriority.High,
        SlidingExpiration   = TimeSpan.FromSeconds(20)
    };
    _memoryCache.Set(cacheKey, productList, cacheExpiryOptions);
}
```

**IDistributedCache + Redis (WebApiFIFA_REDIS_Final):**

```cs
// Register
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost";
    options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions
    {
        AbortOnConnectFail = true,
        EndPoints = { options.Configuration }
    };
});

// Consume via GetOrSetAsync extension
var cacheOptions = new DistributedCacheEntryOptions()
    .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
    .SetSlidingExpiration(TimeSpan.FromMinutes(2));

var games = await cache.GetOrSetAsync(
    $"games:country:{country}",
    async () => await context.Games.Where(g => g.Country == country).ToListAsync(),
    cacheOptions);

// Invalidate on write
cache.Remove("games");
```

**`GetOrSetAsync<T>` extension (DistributedCacheExtensions.cs):**

```cs
public static async Task<T?> GetOrSetAsync<T>(this IDistributedCache cache, string key,
    Func<Task<T>> task, DistributedCacheEntryOptions? options = null)
{
    options ??= new DistributedCacheEntryOptions()
        .SetSlidingExpiration(TimeSpan.FromMinutes(30))
        .SetAbsoluteExpiration(TimeSpan.FromHours(1));

    if (cache.TryGetValue(key, out T? value) && value is not null)
        return value;

    value = await task();
    if (value is not null)
        await cache.SetAsync<T>(key, value, options);
    return value;
}
```

Serializes to JSON bytes internally. `TryGetValue<T>` returns bool, writes via `out`.

**Docker Redis:** `docker run --name redis -d -p 6379:6379 redis`
**Redis CLI:** `SETEX key 10 "val"` (seconds) · `GET key` · `TTL key` · `KEYS pattern:*`

**Cache Tag Helper:**

```cs
<cache vary-by-user="true" vary-by-route="id" expires-after="@TimeSpan.FromMinutes(10)">
    @await Html.PartialAsync("_ProductDetail", Model)
</cache>
```

`vary-by-*`: `user`, `route`, `query`, `cookie`, `header`, custom `vary-by="@Model.Key"`.

**Must-know**

- Registration call + injected interface:
  - `AddMemoryCache()` → `IMemoryCache`
  - `AddStackExchangeRedisCache(...)` → `IDistributedCache`
- `IMemoryCache` is per-process; `IDistributedCache` is shared via Redis
- `AbsoluteExpiration` = hard deadline. `SlidingExpiration` = idle timeout (resets on access). Entry dies at whichever fires first.
- `Priority` is eviction-order under memory pressure, NOT TTL
- `AbortOnConnectFail = true` → fail fast when Redis unreachable (default is `false` → swallow writes silently)
- Invalidate with `cache.Remove(key)` from every write path

**Traps**

- `IMemoryCache` variant: `AbsoluteExpiration = DateTime.Now + TimeSpan` (object initializer)
- `IDistributedCache` variant: fluent `.SetAbsoluteExpiration(TimeSpan).SetSlidingExpiration(TimeSpan)`
- Lab uses `TryGetValue(out T? v)` + `Set(...)` for memory, NOT `GetOrCreateAsync`

## File-based apps (.NET 10)

**Run:** `dotnet run file.cs` · `dotnet run file.cs -- arg1 arg2` (`--` separator required)
**Cache:** `~/.dotnet/runfile/`

**Directives (NO space after `#:`):**

```cs
#!/usr/bin/env dotnet
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0
#:property TargetFramework=net10.0
#:project ./MyLibrary/MyLibrary.csproj

// top-level code here
```

| Directive | Purpose |
|---|---|
| `#:package Name@Ver` | NuGet dependency |
| `#:property Key=Val` | MSBuild property (TargetFramework, Nullable, LangVersion) |
| `#:sdk SdkName` | SDK selection (`Microsoft.NET.Sdk` default, `.Web` for minimal API) |
| `#:project ./path.csproj` | Reference a local project |

**Implicit usings:** `System`, `System.Linq`, `System.Collections.Generic`, `System.Text`, `System.Threading.Tasks`

**Convert to project:** `dotnet project convert file.cs -o Folder`

**Minimal web API (FileBasedWebApi/WebApi.cs):**

```cs
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
var app = builder.Build();
app.MapGet("/", () => new { Message = "Hello!" });
app.Run();
```

**Traps**

- `#: package ...` (space after colon) → parse error
- Without `#:sdk Microsoft.NET.Sdk.Web`, `WebApplication.CreateBuilder` does not resolve
- CLI args: `dotnet run file.cs Kevin` passes `Kevin` to `dotnet`, not script — use `--`

## gRPC (W09 lab)

**`.proto` (proto3):**

```proto
syntax = "proto3";
option csharp_namespace = "GrpcStudentsServer";
package greet;

service StudentRemote {
  rpc GetStudentInfo (StudentLookupModel) returns (StudentModel);
  rpc RetrieveAllStudents (Empty) returns (StudentList);
}

message Empty {}
message StudentLookupModel { int32 studentId = 1; }
message StudentModel {
  int32 studentId = 1;
  string firstName = 2;
  string lastName = 3;
  string school = 4;
}
message StudentList { repeated StudentModel items = 1; }
```

**`.csproj`:** `<Protobuf Include="Protos\students.proto" GrpcServices="Server|Client|Both" />`

**Server (StudentsService.cs):**

```cs
public class StudentsService : StudentRemote.StudentRemoteBase
{
    private readonly SchoolDbContext _context;
    public StudentsService(ILogger<StudentsService> logger, SchoolDbContext ctx) => _context = ctx;

    public override Task<StudentModel> GetStudentInfo(StudentLookupModel request, ServerCallContext ctx)
    {
        var s = _context.Students!.Find(request.StudentId);
        return Task.FromResult(s is null ? new StudentModel() : new StudentModel {
            StudentId = s.StudentId, FirstName = s.FirstName, LastName = s.LastName, School = s.School
        });
    }
}

// Program.cs
builder.Services.AddGrpc();
app.MapGrpcService<StudentsService>();
```

**Client (BlazorGrpcClient/Program.cs — Aspire):**

```cs
builder.AddServiceDefaults();
builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(options =>
{
    options.Address = new Uri("http://backend");      // Aspire logical name
});

// In .razor:
@rendermode InteractiveServer
@inject StudentRemote.StudentRemoteClient _grpc

var reply = await _grpc.GetStudentInfoAsync(new StudentLookupModel { StudentId = 3 });
```

**Must-know**

- Field tags 1–15 encode in 1 byte, 16+ take 2
- Tags are permanent — `reserved 2;` after deletion (never reuse)
- Unset proto3 scalars are zero-values (`0`, `""`, `false`), NOT null
- Every server override takes `(Request, ServerCallContext)` and returns `Task<Response>`
- Inherit from `ServiceName.ServiceNameBase` (generated)
- Register with `AddGrpc()` + `MapGrpcService<T>()`
- Streaming override: `Task` return + `IServerStreamWriter<T>` as 2nd param (drop request payload)
- `GrpcServices="Server"` vs `"Client"` matters — client project uses `Client`

**Traps**

- gRPC requires HTTP/2 — wrong Kestrel config → cryptic connection error
- Missing `override` keyword → method silently shadows; client gets `UNIMPLEMENTED`
- `"Both"` only for projects that host both sides (rare)

## TDD — xUnit + Moq (GoodBooks project)

**Cycle:** Red (failing test) → Green (minimum code) → Refactor (clean up with tests green)

**Attributes:**

```cs
[Fact]
public void Add_TwoPlusTwo_ReturnsFour()
{
    // Arrange
    var calc = new Calculator();
    // Act
    int result = calc.Add(2, 2);
    // Assert
    Assert.Equal(4, result);            // expected FIRST
}

[Theory]
[InlineData(SequenceNumberTypes.JournalEntry)]
[InlineData(SequenceNumberTypes.PurchaseOrder)]
[InlineData(SequenceNumberTypes.SalesOrder)]
public void WithDifferentTypes_ShouldHandleAllTypes(SequenceNumberTypes type) { ... }
```

**Assertions used in demos:** `Assert.Equal(expected, actual)` · `Assert.NotNull` · `Assert.Empty` · `Assert.Null` · `Assert.Single` · `Assert.NotEmpty`

**Lifecycle:** xUnit creates a new test-class instance per test. Constructor = pre-test setup. `IDisposable.Dispose()` = post-test cleanup. No `[Setup]`/`[TearDown]` attributes.

**Moq patterns (GoodBooks BaseServiceTests.cs):**

```cs
public class BaseServiceTests
{
    private readonly Mock<IRepository<SequenceNumber>> _mockSequenceNumberRepo;

    public BaseServiceTests()              // fresh mock per test
    {
        _mockSequenceNumberRepo = new Mock<IRepository<SequenceNumber>>();
    }

    [Fact]
    public void Example()
    {
        // Setup stub
        var list = new List<SequenceNumber>();
        _mockSequenceNumberRepo
            .Setup(r => r.Table)
            .Returns(() => list.AsQueryable());

        // Setup callback (side effect)
        _mockSequenceNumberRepo
            .Setup(r => r.Insert(It.IsAny<SequenceNumber>()))
            .Callback<SequenceNumber>(s => list.Add(s));

        // Use the fake (note .Object)
        _mockSequenceNumberRepo.Object.Insert(new SequenceNumber());

        // Verify
        _mockSequenceNumberRepo.Verify(r => r.Update(It.IsAny<SequenceNumber>()), Times.Once);
    }
}
```

**Static factory for fixture setup (MockRepositoryFixtures.cs):**

```cs
public static class MockRepositoryFixtures
{
    public static Mock<IRepository<T>> CreateEmptyRepository<T>() where T : BaseEntity
    {
        var mock = new Mock<IRepository<T>>();
        mock.Setup(r => r.Table).Returns(new List<T>().AsQueryable());
        return mock;
    }
}
```

Tests call `MockRepositoryFixtures.CreateEmptyRepository<Bank>()` to share boilerplate — still fresh mock per test.

**Must-know**

- `Assert.Equal(expected, actual)` — expected FIRST. Swapped → misleading failure messages.
- `Moq` flow: `new Mock<T>()` → `.Setup(r => r.Method(It.IsAny<...>())).Returns(...)` or `.Callback<T>(...)` → `.Object` to get the fake → `.Verify(..., Times.Once)`
- Constructor per test = fresh state; don't make mocks static fields
- `It.IsAny<T>()` matches any value of type `T`; `It.Is<T>(x => x.Id == 1)` for specific matching

## .NET Aspire (SoccerFIFA_Aspire demo)

**AppHost:**

```cs
var builder = DistributedApplication.CreateBuilder(args);

var sqlServerDb = builder.AddSqlServer("theserver").AddDatabase("sqldata");

var api = builder.AddProject<Projects.WebApiFIFA>("backend")
    .WithReference(sqlServerDb)
    .WaitFor(sqlServerDb)
    .WithEnvironment("ParentCompany", builder.Configuration["Company"]);

builder.AddProject<Projects.BlazorFIFA>("frontend")
    .WithReference(api)
    .WaitFor(api);

builder.Build().Run();
```

**Service (WebApiFIFA/Program.cs):**

```cs
builder.AddServiceDefaults();
builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");
// ...
app.MapDefaultEndpoints();
```

**ServiceDefaults installs:** service discovery · OpenTelemetry · `/health` (readiness, all checks) + `/alive` (liveness, "live"-tagged only) · HttpClient resilience

**Must-know**

- `AddProject<Projects.X>("logical-name")` → consumers reach as `http://logical-name/`
- `WithReference(resource)` injects connection string as env-var (`ConnectionStrings__sqldata`)
- `WaitFor(resource)` delays startup until healthy
- `AddSqlServerDbContext<T>("db-name")` reads injected connection string
- `WithEnvironment(key, value)` for arbitrary env-vars
- AppHost needs `dotnet add reference` to every service project (for `Projects.X` namespace)

**Traps**

- `AddServiceDefaults()` + `MapDefaultEndpoints()` go in EACH service, NEVER in AppHost
- `AddDatabase` only chains off `AddSqlServer` — NOT on top-level builder
- Dashboard on `http://localhost:15888` (or similar)

## Localization (W10 Sports lab)

**Program.cs:**

```cs
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] {
        new CultureInfo("en"), new CultureInfo("de"),
        new CultureInfo("fr"), new CultureInfo("zh"),
        new CultureInfo("en-US")
    };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures   = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

builder.Services.AddMvc()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization(options =>
    {
        options.DataAnnotationLocalizerProvider = (type, factory) =>
            factory.Create(typeof(SharedResource));
    });

builder.Services.AddSingleton<SharedResourceService>();

// Middleware — lab uses explicit options via scope
using (var scope = app.Services.CreateScope())
{
    var localizationOptions = scope.ServiceProvider
        .GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
    app.UseRequestLocalization(localizationOptions);
}
```

**SharedResource marker + service:**

```cs
// SharedResource.cs
namespace Sports;
public class SharedResource { }

// SharedResourceService.cs
public class SharedResourceService
{
    private readonly IStringLocalizer localizer;
    public SharedResourceService(IStringLocalizerFactory factory)
    {
        var asm = new AssemblyName(typeof(SharedResource).GetTypeInfo().Assembly.FullName!);
        localizer = factory.Create(nameof(SharedResource), asm.Name!);
    }
    public string Get(string key) => localizer[key];
}
```

**Resource file paths:** `Resources/<folder>/<ClassName>.<culture>.resx`
- `Pages/Index.cshtml.cs` (class `IndexModel`) → `Resources/Pages/IndexModel.fr.resx`
- Shared (marker class): `Resources/SharedResource.fr.resx`

**Inject:**

- Code-behind text: `IStringLocalizer<T>` — `localizer["Key"]`
- Code-behind HTML: `IHtmlLocalizer<T>` (no XSS encoding)
- Razor view: `@inject IViewLocalizer Localizer` — `@Localizer["Key"]`

**Culture providers (default order, first match wins):** QueryString (`?culture=fr`) → Cookie (`.AspNetCore.Culture`) → Accept-Language header

**Switch cookie:**

```cs
Response.Cookies.Append(
    CookieRequestCultureProvider.DefaultCookieName,
    CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
    new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) });
```

**Must-know**

- `CurrentCulture` = formatting (dates/numbers) · `CurrentUICulture` = which .resx loads — SET BOTH via `SupportedCultures` + `SupportedUICultures`
- `UseRequestLocalization()` middleware is REQUIRED — without it, everything silently defaults
- `DataAnnotationLocalizerProvider = (type, factory) => factory.Create(typeof(SharedResource))` routes all validation messages through the shared `.resx`
- Positional args: `localizer["Greet", name]` → `.resx` value `"Hello, {0}!"`

## Tag Helpers (ToonTagDemo)

**Custom helper:**

```cs
using Microsoft.AspNetCore.Razor.TagHelpers;

[HtmlTargetElement("toon")]
[HtmlTargetElement(Attributes = "toonie")]    // stacked — two bindings
public class ToonTag : TagHelper
{
    public string? FontFamily { get; set; }      // kebab-case: font-family
    public string? FontSize { get; set; }
    public string? ForegroundColor { get; set; }

    public async override Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        var toons = await GetToonsAsync();

        string customStyle =
            $"font-family: {FontFamily};font-size: {FontSize};color: {ForegroundColor};";
        output.Attributes.SetAttribute("style", customStyle);

        string html = "<table><tr><th>Name</th><th>Picture</th></tr>";
        foreach (var t in toons)
            html += $"<tr><td>{t.FirstName} {t.LastName}</td><td><img src='{t.PictureUrl}'/></td></tr>";
        html += "</table>";
        output.Content.SetHtmlContent(html);
    }
}
```

**Usage:** `<toon font-family="arial" font-size="larger" foreground-color="purple"></toon>`

**Registration (`_ViewImports.cshtml`):**

```cs
@using ToonTagDemo
@namespace ToonTagDemo.Pages
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper "ToonTagDemo.TagHelpers.ToonTag, ToonTagDemo"
```

- Form 1 (wildcard): `@addTagHelper *, AssemblyName`
- Form 2 (specific type): `@addTagHelper "FullTypeName, AssemblyName"`
- Built-ins: `@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers`

**Must-know**

- Inherit `TagHelper`; decorate with one or more `[HtmlTargetElement]`; override `ProcessAsync` (async) or `Process` (sync)
- PascalCase property (`FontFamily`) ↔ kebab-case HTML attribute (`font-family`)
- `output.Attributes.SetAttribute("key", "val")` + `output.Content.SetHtmlContent(html)` = the two primary outputs in the demo
- Without `_ViewImports.cshtml` registration, Razor emits `<toon>` as literal unknown HTML

## Blazor QuickGrid (W07 lab)

**Server lab shape:**

```cs
@page "/students"
@rendermode InteractiveServer
@inject IDbContextFactory<ApplicationDbContext> DbFactory
@implements IAsyncDisposable

<input type="search" @bind="FilterValue" @bind:event="oninput" placeholder="Search..." />

<QuickGrid Class="table" Items="@FilteredStudents" Pagination="@pagination">
    <PropertyColumn Property="student => student.FirstName" Sortable="true" />
    <PropertyColumn Property="student => student.LastName"  Sortable="true" />

    <TemplateColumn Context="student">
        <a href="@($"students/edit?studentid={student.StudentId}")">Edit</a> |
        <a href="@($"students/details?studentid={student.StudentId}")">Details</a>
    </TemplateColumn>
</QuickGrid>

<Paginator State="@pagination" />

@code {
    private ApplicationDbContext context = default!;
    private PaginationState pagination = new PaginationState { ItemsPerPage = 15 };
    private string FilterValue = string.Empty;

    IQueryable<Student>? FilteredStudents {
        get {
            var students = context.Students.AsQueryable();
            if (!string.IsNullOrWhiteSpace(FilterValue))
                students = students.Where(s => s.FirstName!.ToLower().Contains(FilterValue.ToLower()));
            return students;
        }
    }

    protected override void OnInitialized() => context = DbFactory.CreateDbContext();
    public async ValueTask DisposeAsync() => await context.DisposeAsync();
}
```

**Must-know**

- `@rendermode InteractiveServer` (or WebAssembly/Auto) required for sort/page/filter to work
- `<QuickGrid Items="IQueryable<T>" Pagination="@state">`
- `<PropertyColumn Property="x => x.Field" Sortable="true">` auto-sorts
- `<TemplateColumn Context="x">` for custom markup with row access via `x`
- `<Paginator State="@pagination">` (Server lab) vs `<Paginator Value="@pages">` (WASM BlazorSchool demo) — both valid
- `PaginationState { ItemsPerPage = N }`
- Live filter: `@bind="..." @bind:event="oninput"` (not default `onchange`) + computed `IQueryable` property
- WASM variant adds `<ColumnOptions>` with per-column search inputs and `ResizableColumns="true"`

## Excel / PDF / Chart (W13 FifaWorldCup)

**Excel (ClosedXML) — Pages/Excel.cshtml.cs:**

```cs
using ClosedXML.Excel;

public FileResult OnGet()
{
    var data = Game.GetGames();

    using (var workbook = new XLWorkbook())
    {
        IXLWorksheet worksheet = workbook.Worksheets.Add("Games");
        worksheet.Cell(1, 1).Value = "Game Id";         // 1-BASED
        worksheet.Cell(1, 2).Value = "Year";
        // ... header row ...

        IXLRange range = worksheet.Range(worksheet.Cell(1, 1).Address, worksheet.Cell(1, 7).Address);
        range.Style.Fill.SetBackgroundColor(XLColor.Almond);

        int index = 1;
        foreach (var item in data)
        {
            index++;
            worksheet.Cell(index, 1).Value = item.GameId;
            // ... fill columns ...
        }

        using (var stream = new MemoryStream())
        {
            workbook.SaveAs(stream);
            var content = stream.ToArray();
            return File(content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"FifaWorldCup_{DateTime.Now:yyyyMMdd}.xlsx");
        }
    }
}
```

**PDF (iText 7 — needs `itext7` + `itext.bouncy-castle-adapter`):**

```cs
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Geom;

var ms = new MemoryStream();
var writer = new PdfWriter(ms);
var pdfDoc = new PdfDocument(writer);
var document = new Document(pdfDoc, PageSize.A4, false);
writer.SetCloseStream(false);

document.Add(new Paragraph("Report Title")
    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
    .SetFontSize(20));

var table = new Table(3);
// ... AddCell(...) in row-major order ...
document.Add(table);

// Page numbers after layout
int total = pdfDoc.GetNumberOfPages();
for (int i = 1; i <= total; i++) {
    document.ShowTextAligned(new Paragraph($"Page {i} of {total}"),
        559, 806, i,
        iText.Layout.Properties.TextAlignment.RIGHT,
        iText.Layout.Properties.VerticalAlignment.TOP, 0);
}

document.Close();
ms.Position = 0;          // CRITICAL before FileStreamResult

return new FileStreamResult(ms, "application/pdf") {
    FileDownloadName = $"Report_{DateTime.Now:yyyyMMdd}.pdf"
};
```

**Chart.js (client-side only):**

```cs
<canvas id="pie-chart" width="400" height="400"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    const Counts = [];
    const Continents = [];

    @foreach (var item in Model.ChartData)
    {
        @:Counts.push(@item.Count);
        @:Continents.push('@item.Name');
    }

    new Chart(document.getElementById('pie-chart'), {
        type: 'pie',
        data: {
            labels: Continents,
            datasets: [{
                label: 'Games',
                data: Counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ]
            }]
        }
    });
</script>
```

**Must-know**

- Excel: `Cell(row, col)` is **1-based** (row 1 col 1 = A1 in Excel UI)
- Excel MIME: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (exact string)
- iText pipeline: `MemoryStream` → `PdfWriter(ms)` → `PdfDocument(writer)` → `Document(pdfDoc, PageSize.A4, false)` → `writer.SetCloseStream(false)`
- `ms.Position = 0` BEFORE `FileStreamResult` (else zero-byte download)
- Chart.js `@:` Razor directive injects JS lines: `@:Counts.push(@item.Count);`
- Chart renders only in browser — no server fallback

## Final-hour triage

- **`ApiKeyCredential`** (System.ClientModel) NOT `AzureKeyCredential` for OpenAIClient
- **`.AsAIAgent()`** NOT `.AsAgent()` · **`RunAsync`** NOT `Invoke`
- **Ollama HTTP :11434** · **GitHub HTTPS /inference** (model: `openai/gpt-4o-mini`)
- **`ITransformer` from `Fit()`** NOT `IDataView`
- **Column names `"Label"` and `"Features"`** are hardcoded in ML.NET
- **`[LoadColumn(N)]` is 0-based; ClosedXML `Cell(r,c)` is 1-based**
- **MemoryStream `Position = 0`** before `FileStreamResult` (PDF export)
- **`Assert.Equal(expected, actual)`** — expected FIRST
- **`AddServiceDefaults()` + `MapDefaultEndpoints()`** in each service, NOT AppHost
- **`AbortOnConnectFail = true`** for Redis (default is false → writes swallowed)
- **`TemplateColumn Context="x"`** (row access), `<Paginator State="@pagination">` (W07 Server lab)
- **`CurrentCulture` (formatting) + `CurrentUICulture` (resources)** — set BOTH
- **`UseRequestLocalization()`** middleware required or localization silently no-ops
- **iText needs `itext7` + `itext.bouncy-castle-adapter`** together
- **`#:` directives** — no space after colon · `#:sdk Microsoft.NET.Sdk.Web` for web
- **`@rendermode InteractiveServer`** on Blazor pages that await (QuickGrid, gRPC)
- **gRPC override:** `Task<Response>` + `ServerCallContext`; `Task` + `IServerStreamWriter<T>` for streaming
- **proto3 field tags:** 1–15 = 1 byte · permanent · `reserved N;` after delete
- **Moq:** `.Setup().Returns/Callback` → `.Object` → `.Verify(..., Times.Once)`
