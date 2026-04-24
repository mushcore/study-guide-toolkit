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

// Connect to local Ollama server running phi3 model on port 11434 (no auth)
IChatClient chatClient = new OllamaApiClient(
    new Uri("http://localhost:11434/"), "phi3");

// Chat history is maintained locally; server has no memory, so full list is re-sent each call
List<ChatMessage> chatHistory = new();
chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));

// Stream response tokens as they arrive (for real-time console output)
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

// Create chat client for local Ollama Phi3 model
IChatClient ollamaClient = new OllamaApiClient("http://localhost:11434/", "phi3:latest");

// Wrap the chat client in an agent with personality and behavior instructions
ChatClientAgent agent = new ChatClientAgent(
    ollamaClient,
    new ChatClientAgentOptions
    {
        Name = "Astronomer",
        ChatOptions = new ChatOptions
        {
            // System prompt defines the agent's role and behavior
            Instructions = "You are an astronomer who specializes in the solar system.",
            // Temperature: 0.7 = balanced creativity (0 = deterministic, 1 = very random)
            Temperature = 0.7f
        }
    });

// Send a prompt and get streaming response
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

// Point OpenAI client to Docker container running llama.cpp on port 12345
// "unused" credential required by OpenAI SDK even though Docker container doesn't check it
var openAIClient = new OpenAIClient(
    new ApiKeyCredential("unused"),
    new OpenAIClientOptions { Endpoint = new Uri("http://localhost:12345/engines/llama.cpp/v1") });
// Get chat client and specify which model to use
var chatClient = openAIClient.GetChatClient("ai/ministral3:latest");

// Convert generic IChatClient to MAF AIAgent with role definition
AIAgent agent = chatClient.AsAIAgent(
    name: "FunnyChatbot",
    instructions: "You are a useful chatbot. Always reply in a funny way with short answers.");

// Create a session to track multi-turn conversation state on the agent
AgentSession session = await agent.CreateSessionAsync();
// Set inference parameters (randomness and max response length)
var chatOptions = new ChatOptions { Temperature = 1f, MaxOutputTokens = 500 };

// Multi-turn loop: each iteration sends a prompt and streams response
while (true) {
    Console.Write("\nUser: ");
    var userInput = Console.ReadLine();
    if (string.IsNullOrWhiteSpace(userInput)) break;

    // Stream response chunks with the specified chat options
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

// Configure endpoint to point to local Docker container (not OpenAI cloud)
OpenAIClientOptions options = new OpenAIClientOptions();
options.Endpoint = new Uri("http://localhost:12345/engines/llama.cpp/v1");
// Credential is unused by Docker backend but required by OpenAI SDK signature
ApiKeyCredential credential = new ApiKeyCredential("unused");
// Create client and get chat interface for llama3.2 model
ChatClient client = new OpenAIClient(credential, options).GetChatClient("ai/llama3.2:latest");

// Send message and wait for complete response (non-streaming)
var response = await client.CompleteChatAsync(prompt);
// Extract text from first content item in response
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
