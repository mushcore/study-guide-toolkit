---
title: "COMP 4870 — exam-eve cheat sheet"
---

## AI — Semantic Kernel skeleton

```cs
var b = Kernel.CreateBuilder();
b.AddOllamaChatCompletion("llama3",
  new Uri("http://localhost:11434"));
Kernel kernel = b.Build();

var chat = kernel.GetRequiredService
  <IChatCompletionService>();
var h = new ChatHistory("system");
h.AddUserMessage("...");
var r = await chat.GetChatMessageContentAsync(h, kernel: kernel);

kernel.ImportPluginFromType<MyPlugin>();
// [KernelFunction, Description("...")]
```

## AI — MAF agent skeleton

```cs
using Microsoft.Agents.AI;
var client = new OpenAIClient(cred,
  new OpenAIClientOptions { Endpoint =
    new Uri("https://models.github.ai/inference")});
var agent = client.AsAIAgent("gpt-4o-mini");
var tool = AIFunctionFactory.Create(
  MyFn, "name", "desc");
agent.Tools.Add(tool);
var s = new AgentSession(agent);
await foreach (var u in s.RunStreamingAsync("q"))
  Console.Write(u);
```

## AI — MCP transports + primitives

-   **stdio** — local process pipe
-   **SSE** — HTTP Server-Sent Events

3 primitives: **Tools** (exec) · **Resources** (data) · **Prompts** (templates)

Server tool: `[McpServerTool]` on method, `[McpServerToolType]` on class. `.WithStdioServerTransport().WithToolsFromAssembly()`

## ML.NET — 7-step pipeline

```cs
var ml = new MLContext(seed:0);
IDataView d = ml.Data.LoadFromTextFile<T>(
  "x.csv", hasHeader:true, separatorChar:',');
var sp = ml.Data.TrainTestSplit(d, 0.2);

var p = ml.Transforms.Concatenate("Features",...)
  .Append(ml.Regression.Trainers.FastTree());

ITransformer m = p.Fit(sp.TrainSet);
var pr = m.Transform(sp.TestSet);
var mx = ml.Regression.Evaluate(pr, "Label");
ml.Model.Save(m, d.Schema, "m.zip");
```

Attrs: `[LoadColumn(0)]`, `[ColumnName("Label")]`, `[ColumnName("Score")]` (output)

## ML.NET — trainer namespaces

-   `mlContext.Regression.Trainers` — FastTree, FastForest, Sdca
-   `BinaryClassification.Trainers` — Logistic, AveragedPerceptron
-   `MulticlassClassification.Trainers` — NaiveBayes, SdcaMax
-   `Clustering.Trainers` — KMeans

Metrics: Regression → RSquared, RMSE. Binary → Accuracy, AUC, F1. Multi → MacroAccuracy, LogLoss.

## Cache — 3 strategies

```cs
// In-memory
builder.Services.AddMemoryCache();
_cache.TryGetValue<T>("k", out var v);
_cache.Set("k", v, new MemoryCacheEntryOptions {
  AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
  SlidingExpiration = TimeSpan.FromMinutes(2)});

// Redis
builder.Services.AddStackExchangeRedisCache(
  o => o.Configuration = "localhost:6379");
// inject IDistributedCache

// Tag helper
<cache expires-after="@TimeSpan.FromMinutes(10)"
  vary-by-user="true" vary-by-route="id">
  <partial name="_X"/></cache>
```

## gRPC — proto + server + client

```cs
// .proto
syntax = "proto3";
option csharp_namespace = "X";
service S { rpc M (Req) returns (Rep); }
message Req { int32 a = 1; }
message Rep { string r = 1; }

// csproj
<Protobuf Include="Protos/s.proto"
  GrpcServices="Server"/>

// server
builder.Services.AddGrpc();
app.MapGrpcService<Impl>();
public class Impl : S.SBase {
  public override Task<Rep> M(Req r, ServerCallContext c)
    => Task.FromResult(new Rep{R="hi"});
}

// client
var ch = GrpcChannel.ForAddress("https://...");
var c = new S.SClient(ch);
await c.MAsync(new Req{A=1});
```

## xUnit — cheat block

```cs
[Fact]
public void X_When_Y() {
  // Arrange
  var s = new Svc();
  // Act
  var r = s.Do();
  // Assert  EXPECTED, ACTUAL
  Assert.Equal(5, r);
}

[Theory]
[InlineData(1,2,3)]
[InlineData(0,0,0)]
public void Add(int a,int b,int e) =>
  Assert.Equal(e, new Calc().Add(a,b));

Assert.Throws<Ex>(()=>bad());
await Assert.ThrowsAsync<Ex>(async ()=>await bad());
// teardown → IDisposable
// shared → IClassFixture<F>
```

## File-based C# — all directives

```cs
#:package Spectre.Console@0.48.0
#:package Newtonsoft.Json@13.0.3
#:sdk Microsoft.NET.Sdk.Web
#:property LangVersion=preview
#:project ./lib/X.csproj

Console.WriteLine("Hello");
```

-   Run: `dotnet run app.cs`
-   Convert: `dotnet project convert app.cs`
-   NO space after colon
-   .NET 10 required

## Aspire — AppHost template

```cs
var b = DistributedApplication
  .CreateBuilder(args);

var cache = b.AddRedis("cache");
var sql   = b.AddSqlServer("sql");
var db    = sql.AddDatabase("app");

var api = b.AddProject<Projects.Api>("api")
  .WithReference(cache)
  .WithReference(db);

b.AddProject<Projects.Web>("web")
  .WithReference(api).WaitFor(api);

b.Build().Run();
```

Each service: `builder.AddServiceDefaults();`

## Localization setup

```cs
builder.Services.AddLocalization(
  o => o.ResourcesPath = "Resources");
builder.Services.AddRazorPages()
  .AddViewLocalization();

builder.Services.Configure
  <RequestLocalizationOptions>(o => {
  var c = new[]{new CultureInfo("en"),
                new CultureInfo("fr")};
  o.DefaultRequestCulture = new RequestCulture("en");
  o.SupportedCultures = c;
  o.SupportedUICultures = c;
});
app.UseRequestLocalization();

// Razor: @inject IViewLocalizer L
// @L["Hello"]
// File: Pages.Index.fr.resx
```

**CurrentCulture**\=formatting · **CurrentUICulture**\=resx lookup

## Tag Helpers — built-in + custom

```cs
// _ViewImports.cshtml
@addTagHelper *,
  Microsoft.AspNetCore.Mvc.TagHelpers

// Built-in
<form asp-controller="Home" asp-action="X"/>
<input asp-for="Name"/>
<span asp-validation-for="Name"/>
<a asp-controller="Home" asp-action="Index"
  asp-route-id="5">Go</a>
<script src="s.js" asp-append-version="true"/>

// Custom
[HtmlTargetElement("quote")]
public class QuoteTag : TagHelper {
  public string Text { get; set; }
  public override void Process(TagHelperContext c,
    TagHelperOutput o) {
    o.TagName = "blockquote";
    o.Content.SetHtmlContent(Text);
  }
}
```

Property PascalCase → attribute kebab-case

## Blazor QuickGrid

```cs
@using Microsoft.AspNetCore
  .Components.QuickGrid

<QuickGrid Items="@q" Pagination="@p">
  <PropertyColumn
    Property="@(_=>_.Name)" Sortable="true"/>
  <TemplateColumn Title="X" SortBy="@sort">
    <strong>@context.Y</strong>
  </TemplateColumn>
</QuickGrid>
<Paginator State="@p"/>

@code {
  PaginationState p =
    new() { ItemsPerPage = 10 };
  GridSort<T> sort = GridSort<T>
    .ByAscending(x=>x.Y);
}
```

Filter: `<input @bind="f" @bind:event="oninput"/>`

## Excel / PDF / Chart

**Excel (ClosedXML)**

```cs
using var w = new XLWorkbook();
var s = w.Worksheets.Add("x");
s.Cell(1,1).Value = "hi";
using var ms = new MemoryStream();
w.SaveAs(ms);
return File(ms.ToArray(),
 "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
 "x.xlsx");
```

**PDF (iText7 + bouncy-castle-adapter)**

```cs
var w = new PdfWriter(ms);
var pdf = new PdfDocument(w);
var d = new Document(pdf);
d.Add(new Paragraph("hi"));
d.Close();
return File(ms.ToArray(),"application/pdf","x.pdf");
```

Chart.js via CDN, client-side

## MCQ trap patterns (from midterm)

1.  Fake method names — eliminate if namespace chain looks wrong
2.  Bracket style swaps: `[Route("api/[c]")]` vs `Route("[api]/[c]")`
3.  Word order swap: `dotnet ef update database` vs `dotnet ef database update`
4.  Singular/plural: `migrations add` not `migration add`
5.  Fake interfaces: `AuthManager`, `IdentityManager` — not real
6.  Protocol: gRPC = HTTP/2 (not 1.1); Ollama = http (not https)

## Match-column patterns to expect

Column A (concept) → Column B (canonical identifier):

-   SK → `Kernel.CreateBuilder`
-   MAF → `AIAgent`, `AIFunctionFactory`
-   MCP → stdio / SSE transports
-   ML.NET → `MLContext`, `LoadFromTextFile`, `Fit`
-   Redis → `AddStackExchangeRedisCache`
-   Cache tag → `<cache vary-by-*>`
-   gRPC → `.proto`, `AddGrpc`, HTTP/2
-   xUnit → `[Fact]`, `[Theory] [InlineData]`
-   File-based → `#:package`, `#:sdk`
-   Aspire → `AddProject`, `WithReference`
-   Localization → `IViewLocalizer`, `Pages.Index.fr.resx`
-   QuickGrid → `PropertyColumn`, `PaginationState`

## Time budget (60 min, 80 marks)

MCQ (60): 30 min → 30 s each. If >45s → skip, come back.

Match (10): 5 min — do LAST minus code.

Code (10): 15 min — start with skeleton, get structure marks even if logic wrong.

Review: 10 min — revisit skipped MCQs, double-check match column.

**Don't**: spend >2 min on any MCQ. 40 MCQ at 60% > 20 MCQ at 90%.

## Morning-of checklist

-   Eat carbs + protein
-   Hand-written cheat sheet: both sides filled, black pen
-   Student ID + 2 pens + pencil + eraser
-   No smartwatches, phones off
-   Arrive 15 min early
-   First: read ALL questions, answer easiest first, skip hard
-   Match column → do when brain fatigues from MCQ (pattern matching is easier)
-   Code question → read requirements TWICE, write skeleton first
