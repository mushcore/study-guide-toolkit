---
n: 2
id: ai-local-models
title: "MAF + Ollama + Docker SLMs"
hook: "Same `OpenAIClient` shape for any OpenAI-compatible URL. MAF wraps any `IChatClient` as an agent."
tags: [ai, maf, ollama, slm, docker]
module: "AI in .NET"
source: "code-examples/20260324_Ollama/Ollama/SLM.OllamaClient/Program.cs + MAF.Phi3/Program.cs; code-examples/20260324_docker-slms/docker-slms/FunnyDockerMAF.cs + SentimentDockerOpenAI.cs"
bloom_levels: [understand, apply]
related: [ai-semantic-kernel]
---

## Ollama — local SLM via OllamaSharp

```cs
using Microsoft.Extensions.AI;
using OllamaSharp;

IChatClient chatClient = new OllamaApiClient(
    new Uri("http://localhost:11434/"), "phi3");

List<ChatMessage> chatHistory = new();
chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));

await foreach (var item in chatClient.GetStreamingResponseAsync(chatHistory))
    Console.Write(item.Text);
```

- Package: `OllamaSharp` + `Microsoft.Extensions.AI`
- `OllamaApiClient(uri, modelId)` returns `IChatClient`
- `ChatMessage(ChatRole.User|Assistant|System, content)`
- `List<ChatMessage>` = conversation history — full list re-sent each call (no server memory)
- `GetStreamingResponseAsync` yields `ChatResponseUpdate` with `.Text` fragments
- `GetResponseAsync` returns one buffered `ChatResponse`

**CLI:** `ollama pull phi3:latest` · `ollama list` · `ollama run phi3:latest`
**Endpoint:** `http://localhost:11434/` — HTTP, port 11434, no auth, fully local after pull

## MAF agent — shape 1: constructor with options

From `MAF.Phi3/Program.cs`:

```cs
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OllamaSharp;

IChatClient ollamaClient = new OllamaApiClient("http://localhost:11434/", "phi3:latest");

ChatClientAgent agent = new ChatClientAgent(
    ollamaClient,
    new ChatClientAgentOptions
    {
        Name = "Astronomer",
        ChatOptions = new ChatOptions
        {
            Instructions = "You are an astronomer who specializes in the solar system.",
            Temperature = 0.7f
        }
    });

Console.WriteLine(await agent.RunAsync("How far is earth from the sun?"));
```

## MAF agent — shape 2: `.AsAIAgent` + session

From `FunnyDockerMAF.cs` (Docker-hosted OpenAI-compatible SLM):

```cs
#:package Microsoft.Agents.AI.OpenAI@*-*

using System.ClientModel;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OpenAI;

var openAIClient = new OpenAIClient(
    new ApiKeyCredential("unused"),
    new OpenAIClientOptions { Endpoint = new Uri("http://localhost:12345/engines/llama.cpp/v1") });
var chatClient = openAIClient.GetChatClient("ai/ministral3:latest");

AIAgent agent = chatClient.AsAIAgent(
    name: "FunnyChatbot",
    instructions: "You are a useful chatbot. Always reply in a funny way with short answers.");

AgentSession session = await agent.CreateSessionAsync();
var chatOptions = new ChatOptions { Temperature = 1f, MaxOutputTokens = 500 };

while (true) {
    Console.Write("\nUser: ");
    var userInput = Console.ReadLine();
    if (string.IsNullOrWhiteSpace(userInput)) break;

    await foreach (var update in agent.RunStreamingAsync(
        userInput, options: new ChatClientAgentRunOptions(chatOptions)))
    {
        if (!string.IsNullOrEmpty(update.Text)) Console.Write(update.Text);
    }
}
```

## Docker SLM — direct ChatClient without MAF

From `SentimentDockerOpenAI.cs`:

```cs
#:package OpenAI@*-*

using OpenAI;
using OpenAI.Chat;
using System.ClientModel;

OpenAIClientOptions options = new OpenAIClientOptions();
options.Endpoint = new Uri("http://localhost:12345/engines/llama.cpp/v1");
ApiKeyCredential credential = new ApiKeyCredential("unused");
ChatClient client = new OpenAIClient(credential, options).GetChatClient("ai/llama3.2:latest");

var response = await client.CompleteChatAsync(prompt);
Console.WriteLine(response.Value.Content[0].Text);
```

## Endpoint + credential matrix

| Backend | Endpoint | Credential | Model id format |
|---|---|---|---|
| GitHub Models | `https://models.github.ai/inference` | `ApiKeyCredential(PAT)` | `openai/gpt-4o-mini` |
| Ollama | `http://localhost:11434/` | (none — OllamaApiClient) | `phi3:latest` |
| Docker SLM | `http://localhost:12345/engines/llama.cpp/v1` | `ApiKeyCredential("unused")` | `ai/ministral3:latest` |

> **Q:** Which extension wraps an `IChatClient` as an `AIAgent`?
> **A:** `.AsAIAgent(name, instructions)`. `.AsAgent()` does not exist.

> **Pitfall**
> `agent.RunAsync(...)` is MAF. `kernel.InvokeAsync(...)` is Semantic Kernel. Not interchangeable.

> **Pitfall**
> `AIFunctionFactory.Create(...)` + tool registration — NOT in any lab or demo for 4870.

> **Pitfall**
> Ollama is HTTP port 11434, no path. Docker SLM is HTTP port 12345 + `/engines/llama.cpp/v1`. GitHub is HTTPS + `/inference`. Mixing paths breaks requests.

> **Takeaway**
> Ollama: `new OllamaApiClient(uri, modelId)` → `IChatClient` → `GetStreamingResponseAsync`. MAF: `new ChatClientAgent(client, options)` OR `client.AsAIAgent(name, instructions)` → `RunAsync`/`RunStreamingAsync`. Multi-turn: `await agent.CreateSessionAsync()`. Docker SLM: `OpenAIClient(ApiKeyCredential("unused"), { Endpoint = docker-url })` then `.GetChatClient(model)`.
