---
n: 1
id: ai-semantic-kernel
title: "Semantic Kernel + GitHub Models"
hook: "Wire GitHub Models into Razor Pages with `AddKernel()` and inject `IChatCompletionService`."
tags: [ai, semantic-kernel, github-models]
module: "AI in .NET"
source: "Labs/W02 AI on Github/GitHubAiModelSK/Program.cs + Pages/Index.cshtml.cs"
bloom_levels: [understand, apply]
related: [ai-local-models]
---

## W02 wiring — Program.cs

```cs
using Microsoft.SemanticKernel;
using OpenAI;
using System.ClientModel;

var builder = WebApplication.CreateBuilder(args);

// Load AI credentials and endpoint from appsettings.json
var modelId   = builder.Configuration["AI:Model"]!;
var uri       = builder.Configuration["AI:Endpoint"]!;
var githubPAT = builder.Configuration["AI:PAT"]!;

// Configure OpenAI client to use GitHub Models endpoint instead of OpenAI's
var client = new OpenAIClient(
    new ApiKeyCredential(githubPAT),
    new OpenAIClientOptions { Endpoint = new Uri(uri) });

// Register the chat completion service with the GitHub Models client
builder.Services.AddOpenAIChatCompletion(modelId, client);
// Register Semantic Kernel and all its dependencies in the DI container
builder.Services.AddKernel();

builder.Services.AddRazorPages();
// Session storage requires distributed cache to persist ChatHistory across requests
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
```

Five moves:

1. Read `AI:Model`, `AI:Endpoint`, `AI:PAT` from `appsettings.json`.
2. Build `OpenAIClient` with `ApiKeyCredential` (from `System.ClientModel`) + `Endpoint` override.
3. `AddOpenAIChatCompletion(modelId, client)` registers chat service.
4. `AddKernel()` registers Kernel + deps in DI.
5. `AddSession()` + `AddDistributedMemoryCache()` persist `ChatHistory` across HTTP requests.

Only one NuGet: `Microsoft.SemanticKernel`.

## PageModel — inject `IChatCompletionService`

```cs
using Microsoft.SemanticKernel.ChatCompletion;

public class IndexModel : PageModel
{
    // Injected from DI container — resolves to OpenAI client wired in Program.cs
    private readonly IChatCompletionService _chat;
    public IndexModel(IChatCompletionService chat) => _chat = chat;

    // Two-way model binding: form POST populates this, then pass to GetStreamingChatMessageContentsAsync
    [BindProperty] public string? UserMessage { get; set; }
    // Holds accumulated chat history for display on the Razor page
    public List<ChatEntry> ChatMessages { get; set; } = new();
}
```

## Build ChatHistory + stream

`ChatHistory` constructor takes system prompt directly:

```cs
// ChatHistory tracks system prompt + all prior turns (for multi-turn conversation context)
ChatHistory chat = new(@"
    You are an AI assistant that helps people find information.
    The response must be brief and should not exceed one paragraph.
    If you do not know the answer then simply say 'I do not know the answer'.");

// Reconstruct conversation history from session storage (User + Assistant messages alternate)
foreach (var entry in chatEntries)
{
    if (entry.Role == "User") chat.AddUserMessage(entry.Message);
    else                      chat.AddAssistantMessage(entry.Message);
}

// Add the current form submission to the conversation
chat.AddUserMessage(UserMessage);

// Stream the response token-by-token (for real-time UI updates)
StringBuilder sb = new();
await foreach (var message in _chat.GetStreamingChatMessageContentsAsync(chat))
{
    sb.Append(message.Content);
}
var response = sb.ToString();
```

## Session persistence

```cs
// Deserialize chat history from distributed cache (empty list if first request)
var historyJson = HttpContext.Session.GetString("ChatHistory");
var chatEntries = string.IsNullOrEmpty(historyJson)
    ? new List<ChatEntry>()
    : System.Text.Json.JsonSerializer.Deserialize<List<ChatEntry>>(historyJson)!;

// ... run turn, append User + Assistant entries to chatEntries list ...

// Persist updated history back to session storage for next request
HttpContext.Session.SetString("ChatHistory",
    System.Text.Json.JsonSerializer.Serialize(chatEntries));
```

`ChatEntry` is a local POCO (`Role`, `Message`).

## GitHub Models endpoint config

```json
{
  "AI": {
    "Model": "openai/gpt-4o-mini",
    "Endpoint": "https://models.github.ai/inference",
    "PAT": "github_pat_..."
  }
}
```

- HTTPS + `/inference` suffix required
- Model id format: vendor prefix (`openai/gpt-4o-mini`)
- Credential: GitHub PAT passed through `ApiKeyCredential`

> **Q:** Which credential class authenticates GitHub Models in W02?
> **A:** `ApiKeyCredential` (from `System.ClientModel`). `OpenAIClient` ctor takes it + `OpenAIClientOptions { Endpoint = new Uri(uri) }`.

> **Pitfall**
> Lab does NOT use `KernelBuilder`, `Kernel.CreateBuilder()`, `ImportPluginFromType<T>()`, `[KernelFunction]`, or `skprompt.txt`. Those are SK features but out of scope of what was demoed.

> **Pitfall**
> `ApiKeyCredential` NOT `AzureKeyCredential`. `AzureKeyCredential` belongs to `Azure.AI.Inference` / `ChatCompletionsClient` — different SDK.

> **Takeaway**
> SK wiring in W02: `OpenAIClient(ApiKeyCredential(pat), { Endpoint })` → `AddOpenAIChatCompletion(modelId, client)` → `AddKernel()` → inject `IChatCompletionService` → build `ChatHistory(systemPrompt)` → `GetStreamingChatMessageContentsAsync`.
