## Exam meta

- 2026-04-24 · 10:30–11:30 · SE12-327 · 80 marks / 60 min
- 60 MCQ + 10 match + 1 coding
- Allowed: one hand-written 8.5" × 11" sheet, both sides

## AI — Semantic Kernel, MAF, Ollama, cloud models

- **Packages**: `Microsoft.Agents.AI.OpenAI --prerelease` (MAF+OpenAI) · `OllamaSharp` · `Microsoft.SemanticKernel` · `Microsoft.Extensions.AI 10.4.0`
- **MAF agent**: `var agent = chatClient.AsAIAgent(name, instructions, tools);` — `.AsAgent()` does NOT exist
- **MAF tool**: `AIFunctionFactory.Create(method, name: "N", description: "D")` returns `AITool`
- **MAF call**: `await agent.RunAsync(input, session)` or `agent.RunStreamingAsync(...)` — NOT `agent.Invoke(...)`
- **Multi-turn**: `var session = await agent.CreateSessionAsync();`
- **Ollama**: `new OllamaApiClient(new Uri("http://localhost:11434/"), "phi3")` — HTTP, port 11434, no auth
- **GitHub Models**: `new ChatClient(model, new AzureKeyCredential(token), new OpenAIClientOptions { Endpoint = new Uri("https://models.github.ai/inference") })` — HTTPS, `/inference` path, model name `"openai/gpt-4o-mini"`
- **Semantic Kernel**: `new KernelBuilder().AddOpenAIChatCompletion(...).Build()` → `Kernel` · `kernel.InvokeAsync(...)` (not `Execute`) · `[KernelFunction]` (not `[SkillFunction]`) · plugins: `kernel.ImportPluginFromPromptDirectory(dir)` or `.ImportPluginFromType<T>()`
- **Template var**: `{{$variableName}}` in `skprompt.txt`
- **Chat**: `ChatMessage(ChatRole.User, content)` + `List<ChatMessage>`; stream with `await foreach (var u in chatClient.GetStreamingResponseAsync(history))`

## ML.NET

- **7-step pipeline**:
  1. `var ml = new MLContext(seed: 0);`
  2. `IDataView data = ml.Data.LoadFromTextFile<T>(path, hasHeader: true, separatorChar: ',');`
  3. `var pipe = ml.Transforms.CopyColumns("Label", "FareAmount")`
  4. `  .Append(ml.Transforms.Categorical.OneHotEncoding("VendorIdEncoded", "VendorId"))`
  5. `  .Append(ml.Transforms.Concatenate("Features", "VendorIdEncoded", "TripDistance"))`
  6. `  .Append(ml.Regression.Trainers.FastTree());`
  7. `ITransformer model = pipe.Fit(data);`
- **Evaluate**: `var metrics = ml.Regression.Evaluate(model.Transform(testData), "Label", "Score");` — reads `metrics.RSquared` and `metrics.RootMeanSquaredError`
- **Predict**: `var engine = ml.Model.CreatePredictionEngine<TIn, TOut>(model); var p = engine.Predict(input);`
- **Save/Load**: `ml.Model.Save(model, data.Schema, "model.zip");` / `ml.Model.Load("model.zip", out var schema);`
- **Output class**: `[ColumnName("Score")] public float FareAmount;`
- **[LoadColumn(N)]** is 0-based; names `"Label"` and `"Features"` are hardcoded
- **AutoML CLI**: `mlnet regression --dataset train.csv --label-col 6 --train-time 60`
- **Namespace trap**: `Regression` vs `BinaryClassification` vs `MulticlassClassification` — pick by task

## Cache / Redis

- **Register**:
  - Memory: `builder.Services.AddMemoryCache();`
  - Redis: `builder.Services.AddStackExchangeRedisCache(o => o.Configuration = "localhost:6379");` (package `Microsoft.Extensions.Caching.StackExchangeRedis`)
- **IMemoryCache fails in web farms** — use `IDistributedCache` or sticky sessions
- **Expiration**: `new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10), SlidingExpiration = TimeSpan.FromMinutes(2), Priority = CacheItemPriority.High };`
  - Combined: expires at `min(absolute, idle+sliding)`
  - Priority ≠ expiration time; controls eviction under memory pressure only
- **TryGetValue**: `if (_cache.TryGetValue<T>(k, out var v)) { ... }` — needs `out`
- **GetOrCreateAsync**: `await _cache.GetOrCreateAsync(k, entry => { entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5); return FetchAsync(); });`
- **Invalidate on write**: `_cache.Remove(key);` after `SaveChangesAsync()`
- **Docker Redis**: `docker run --name redis -d -p 6379:6379 redis`
- **Redis CLI**: `SETEX key 10 "val"` (seconds) · `GET key` · `DEL key` · `TTL key`
- **Cache Tag Helper**: `<cache vary-by-user="true" vary-by-route="id" expires-after="@TimeSpan.FromMinutes(10)">...</cache>` — backs onto IMemoryCache (same farm trap)
- **vary-by-***: `user`, `route`, `query`, `cookie`, `header`, custom `vary-by="@Model.Key"`

## File-based apps

- **Run**: `dotnet run file.cs` · `dotnet run file.cs -- arg1 arg2` (`--` separator required)
- **Cache**: `~/.dotnet/runfile/` (macOS/Linux) · `%USERPROFILE%\.dotnet\runfile\` (Windows)
- **Directives (no space after colon)**:
  - `#:package Spectre.Console@0.49.1`
  - `#:property TargetFramework=net10.0` / `Nullable=enable` / `LangVersion=preview`
  - `#:sdk Microsoft.NET.Sdk.Web` (for web APIs)
  - `#:project ./Lib/Lib.csproj` (reference a project)
- **Implicit usings**: `System`, `System.Linq`, `System.Collections.Generic`, `System.Text`, `System.Threading.Tasks` (NOT `System.Text.Json`)
- **Top-level statements**: file body runs as `Main`; type declarations go AFTER the code
- **Convert**: `dotnet project convert file.cs -o Folder`
- **Minimal web**: `#:sdk Microsoft.NET.Sdk.Web` then `var app = WebApplication.CreateBuilder(args).Build(); app.MapGet("/", () => "hi"); app.Run();`

## gRPC

- **Packages**: `Grpc.Tools` (build), `Google.Protobuf`, `Grpc.Net.Client` (client), `Grpc.Net.ClientFactory` (DI)
- **.proto** (proto3):
  - `syntax = "proto3";` · `option csharp_namespace = "NS";`
  - `service Foo { rpc Bar (Req) returns (Resp); }`
  - `message Req { int32 id = 1; string name = 2; }`
  - Field tags 1–15 = 1 byte; 16+ = 2 bytes; PERMANENT (`reserved 2;` when removed)
  - `repeated T` = list; unset proto3 scalars = zero-values (NO null)
- **.csproj**: `<Protobuf Include="Protos\foo.proto" GrpcServices="Server|Client|Both" />`
- **Server**:
  ```cs
  public class FooService : FooRemote.FooRemoteBase {
    public override Task<Resp> Bar(Req r, ServerCallContext ctx) => Task.FromResult(new Resp { ... });
  }
  ```
  Register: `builder.Services.AddGrpc(); app.MapGrpcService<FooService>();`
- **Client**:
  - Raw: `using var ch = GrpcChannel.ForAddress("http://localhost:5099"); var c = new FooRemote.FooRemoteClient(ch); var r = await c.BarAsync(req);`
  - DI: `builder.Services.AddGrpcClient<FooRemote.FooRemoteClient>(o => o.Address = new Uri("http://backend"));` then `@inject FooRemote.FooRemoteClient _c`
- **Blazor host**: `@rendermode InteractiveServer` required for async calls

## TDD — xUnit

- **Cycle**: Red (failing test) → Green (minimum code) → Refactor (clean up with tests green)
- **3 Laws**: (1) no prod code without a failing test · (2) no more test than needed to fail · (3) no more prod code than needed to pass
- **Attributes**:
  - `[Fact]` — one run
  - `[Theory]` + `[InlineData(...)]` — one run per InlineData
  - `[Theory]` + `[MemberData(nameof(Provider))]` — data from static member
- **Body pattern**: Arrange / Act / Assert
- **Assertions**: `Assert.Equal(expected, actual)` (expected FIRST) · `Assert.NotEqual` · `Assert.True/False` · `Assert.Null/NotNull` · `Assert.Throws<T>(() => action)` returns exception · `Assert.InRange(v, low, high)` · `Assert.Contains(item, collection)` · `Assert.Same(a, b)` (reference)
- **Lifecycle**: constructor runs before EACH test; `IDisposable.Dispose()` runs after. No `[Setup]`/`[TearDown]` attributes.
- **Fixtures**:
  - `IClassFixture<TFixture>` — share one fixture across one class's tests
  - `ICollectionFixture<TFixture>` + `[CollectionDefinition("X")]` + `[Collection("X")]` — share across multiple classes
- **Commands**: `dotnet new xunit -n Tests` · `dotnet add reference` · `dotnet test`

## .NET Aspire

- **AppHost Program.cs**:
  ```cs
  var builder = DistributedApplication.CreateBuilder(args);
  var db = builder.AddSqlServer("sql").AddDatabase("cms");
  var cache = builder.AddRedis("cache");
  var api = builder.AddProject<Projects.Api>("api").WithReference(db).WithReference(cache).WaitFor(db);
  builder.AddProject<Projects.Web>("web").WithReference(api).WaitFor(api);
  builder.Build().Run();
  ```
- **`AddProject<Projects.X>("name")`** — logical name for service discovery (`http://name`)
- **`WithReference`** — injects connection info into consumer as env-var
- **`WaitFor`** — delays startup until dependency reports healthy
- **Service's Program.cs**: `builder.AddServiceDefaults();` + `app.MapDefaultEndpoints();` — NEVER in AppHost
- **ServiceDefaults installs**: service discovery · OpenTelemetry · `/health` (readiness, all checks pass) + `/alive` (liveness, "live" tagged only) · HttpClient resilience
- **Typed consumers**: `builder.AddSqlServerDbContext<CmsDb>("cms");` · `builder.AddRedisDistributedCache("cache");`
- **Run**: `cd AppHost && dotnet watch` · dashboard on `http://localhost:15888`

## Localization

- **Program.cs**:
  ```cs
  builder.Services.AddLocalization(o => o.ResourcesPath = "Resources");
  builder.Services.Configure<RequestLocalizationOptions>(o => {
    var sup = new[] { new CultureInfo("en"), new CultureInfo("fr") };
    o.DefaultRequestCulture = new RequestCulture("en");
    o.SupportedCultures = sup;
    o.SupportedUICultures = sup;
  });
  builder.Services.AddRazorPages().AddViewLocalization();
  // Later:
  app.UseRequestLocalization();   // ESSENTIAL — silent failure without it
  ```
- **Resource path**: `Resources/<folder>/<ClassName>.<culture>.resx` — for `Pages/Index.cshtml.cs` (class `IndexModel`) → `Resources/Pages/IndexModel.fr.resx`
- **Shared**: empty class `SharedResource` + `Resources/SharedResource.fr.resx` + service using `IStringLocalizerFactory.Create(nameof(SharedResource), assemblyName)`
- **Inject**:
  - Code-behind text: `IStringLocalizer<T>` · `localizer["Key"]`
  - Code-behind HTML: `IHtmlLocalizer<T>` (no XSS encoding)
  - View: `@inject IViewLocalizer Localizer` then `@Localizer["Key"]`
- **CurrentCulture** = formatting (dates/numbers); **CurrentUICulture** = which .resx loads. SET BOTH.
- **Providers (order)**: QueryString (`?culture=fr`) → Cookie (`.AspNetCore.Culture`) → Accept-Language header
- **Switch cookie**: `Response.Cookies.Append(CookieRequestCultureProvider.DefaultCookieName, CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)), new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) });`
- **Positional args**: `localizer["Greet", name]` → `.resx` `"Hello, {0}!"`

## Tag Helpers

- **Custom**:
  ```cs
  [HtmlTargetElement("toon")]
  public class ToonTagHelper : TagHelper {
    public string? FontFamily { get; set; }   // kebab-case: font-family
    public override async Task ProcessAsync(TagHelperContext ctx, TagHelperOutput output) {
      output.TagName = "div";
      output.Content.SetHtmlContent("<p>Hi</p>");     // Set replaces; Append preserves
      output.Attributes.SetAttribute("style", "color:red");
      // output.SuppressOutput(); to render nothing
    }
  }
  ```
- **Register in `_ViewImports.cshtml`**: `@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers` (built-ins) · `@addTagHelper *, MyApp` (custom)
- **PascalCase ↔ kebab-case**: `FontFamily` ↔ `font-family`
- **`[HtmlTargetElement("tag")]`** or `[HtmlTargetElement("div", Attributes = "toonie")]` (stack multiple)
- **Process vs ProcessAsync**: async for awaiting; sync `Process` for CPU-only
- **Output manipulation**: `TagName`, `Content.SetHtmlContent/AppendHtmlContent`, `PreContent`, `PostContent`, `Attributes.SetAttribute/RemoveAll`, `SuppressOutput()`

## Blazor QuickGrid

- Package: `Microsoft.AspNetCore.Components.QuickGrid`
- `@rendermode InteractiveServer` (or WebAssembly/Auto) required
- `<QuickGrid Items="@iqueryable" Pagination="@paginationState">`
  - `<PropertyColumn Property="@(x => x.Name)" Sortable="true" />` — sort works out of the box
  - `<TemplateColumn Title="Full" SortBy="@sortExpr"><div>@context.First @context.Last</div></TemplateColumn>` — needs `SortBy`, not `Sortable`
- `private PaginationState _p = new() { ItemsPerPage = 15 };` + `<Paginator State="@_p" />`
- Multi-key sort: `GridSort<T>.ByAscending(x => x.A).ThenAscending(x => x.B)`
- Live filter: `<input @bind="_filter" @bind:event="oninput" />` + computed `IQueryable` property

## Excel / PDF / Chart

- **Excel (ClosedXML)**:
  ```cs
  using var wb = new XLWorkbook();
  var sheet = wb.Worksheets.Add("Games");
  sheet.Cell(1, 1).Value = "Name";      // 1-BASED indexing
  int r = 2; foreach (var x in data) { sheet.Cell(r, 1).Value = x.Name; r++; }
  sheet.Columns().AdjustToContents();
  using var ms = new MemoryStream();
  wb.SaveAs(ms);
  return File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "export.xlsx");
  ```
- **PDF (iText 7 + `itext.bouncy-castle-adapter`)**:
  ```cs
  var ms = new MemoryStream();
  var writer = new PdfWriter(ms);
  var pdfDoc = new PdfDocument(writer);
  var doc = new Document(pdfDoc, PageSize.A4, false);
  writer.SetCloseStream(false);
  doc.Add(new Paragraph("Title").SetTextAlignment(TextAlignment.CENTER).SetFontSize(20));
  var table = new Table(2);
  foreach (var x in data) { table.AddCell(x.Name); table.AddCell(x.Score.ToString()); }
  doc.Add(table);
  doc.Close();
  ms.Position = 0;   // CRITICAL
  return new FileStreamResult(ms, "application/pdf") { FileDownloadName = "r.pdf" };
  ```
- **Chart.js** (client-side only):
  ```html
  <canvas id="c" width="400" height="400"></canvas>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  <script>
    const labels = []; const counts = [];
    @foreach (var x in Model.Data) { @:labels.push('@x.Name'); @:counts.push(@x.Count); }
    new Chart(document.getElementById('c'), { type: 'pie', data: { labels, datasets: [{ data: counts, backgroundColor: [...] }] } });
  </script>
  ```

## Final-hour triage

- **`#:package` NOT `#: package`** — no space after colon
- **`.AsAIAgent()` NOT `.AsAgent()`** · **`RunAsync` NOT `Invoke`** · **`InvokeAsync` NOT `Execute`** (SK)
- **Ollama HTTP :11434 · GitHub HTTPS /inference**
- **`ITransformer` from `Fit()` NOT `IDataView`**
- **Column names `"Label"` and `"Features"` are hardcoded in ML.NET**
- **`[LoadColumn(N)]` is 0-based; ClosedXML `Cell(r,c)` is 1-based**
- **MemoryStream `Position = 0` before `FileStreamResult`** (PDF export)
- **`Assert.Equal(expected, actual)` — expected FIRST**
- **`AddServiceDefaults()` in each service, NOT AppHost**
- **`IMemoryCache` fails in web farms; use `IDistributedCache`**
- **`TemplateColumn SortBy=`, PropertyColumn `Sortable="true"`**
- **`CurrentCulture` (formatting) and `CurrentUICulture` (resources) — set BOTH**
- **`UseRequestLocalization()` middleware or localization silently no-ops**
- **iText needs `itext.bouncy-castle-adapter` package alongside `itext7`**
- **Every cards/lessons/practice file must have `source:`**
