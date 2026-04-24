## Exam meta

- 2026-04-24 · 10:30–11:30 · SE12-327 · 80 marks / 60 min
- 60 MCQ + 10 match + 1 coding
- Allowed: one hand-written 8.5" × 11" sheet, both sides

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
