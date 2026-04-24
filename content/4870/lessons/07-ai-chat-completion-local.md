---
n: 7
id: ai-chat-completion-local
title: "Chat completion with Ollama + SLMs"
hook: "Run Phi-3 on your laptop, stream tokens into a console loop, and never touch a cloud API key."
tags: [ai, slm, ollama, streaming]
module: "AI in .NET"
source: "slides/SLM.pptx; notes/SLM.docx; notes/AI-Models_MAF_SCRIPT.docx; research-ai.md §Ollama, §Chat Completion, §Call Ollama via OllamaSharp, §Ollama Setup Commands, §Endpoint URL Pitfalls"
bloom_levels: [remember, understand, apply]
related: [ai-agent-framework, ai-cloud-models]
---

## Open concrete

You open a terminal, run `ollama pull phi3:latest`, and a few gigabytes later a Small Language Model (SLM) sits on disk. A second command, `ollama run phi3:latest`, hands you a REPL. The same daemon now listens on `http://localhost:11434/`, and your C# console app can talk to it with four lines of `OllamaSharp` code. No API key, no cloud, no rate limit.

This lesson wires that daemon to a `IChatClient` in .NET, sends a `List<ChatMessage>`, and streams the reply token-by-token.

## Ollama: the local runtime

Ollama is a local LLM/SLM runtime. It downloads a model, loads it into memory, and exposes an OpenAI-compatible HTTP API on port `11434`. Everything runs on your machine after the initial pull.

The four commands you need:

```bash
ollama pull phi3:latest
ollama list
ollama show phi3:latest
ollama run phi3:latest
```

`pull` downloads; `list` shows what you have; `show` prints model metadata; `run` opens an interactive chat in the terminal (useful for smoke-testing before you touch C#).

Typical SLMs the course uses: Phi-3 (Microsoft, ~3.8B params), Llava (vision-capable), Llama3.2-1B (tiny). All fit under 5 GB.

> **Q:** Does Ollama need an internet connection at inference time?
> **A:** No. Internet is required only for `ollama pull` to download the model. After that the daemon and model are fully local.

## Configure the endpoint from `appsettings.json`

Keep the URL and model id out of code:

```json
{
  "OllamaUrl": "http://localhost:11434/",
  "ModelId": "phi3:latest"
}
```

Read these at startup, hand them to the client constructor. Changing models becomes a config edit, not a recompile.

## Call Ollama from C# with `OllamaSharp`

Add the packages:

```bash
dotnet add package OllamaSharp
dotnet add package Microsoft.Extensions.AI -v 10.4.0
```

`OllamaSharp` is the third-party NuGet package providing `OllamaApiClient`, which implements `IChatClient` from `Microsoft.Extensions.AI`. The abstraction lets you swap in cloud backends later without rewriting the caller.

The canonical chat-completion loop (from `SLM.docx` Demo #1):

```cs
using Microsoft.Extensions.AI;
using OllamaSharp;

IChatClient chatClient =
    new OllamaApiClient(new Uri("http://localhost:11434/"), "phi3");

List<ChatMessage> chatHistory = new();
chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));

await foreach (ChatResponseUpdate item in
    chatClient.GetStreamingResponseAsync(chatHistory))
{
    Console.Write(item.Text);
}
```

Four moving parts:

1. `OllamaApiClient(uri, modelId)` — constructor takes a `Uri` and a model id string. The returned object implements `IChatClient`.
2. `ChatMessage(ChatRole.User, content)` — one entry in the conversation. `ChatRole` is the enum `User`, `Assistant`, or `System`.
3. `List<ChatMessage>` — acts as your `ChatHistory`. Append each turn in order; the full list is re-sent on every call.
4. `GetStreamingResponseAsync` — returns `IAsyncEnumerable<ChatResponseUpdate>`. Each update carries a `Text` fragment. You print as tokens arrive instead of waiting for the full response.

> **Example**
> Buffered vs streaming. If you call `await chatClient.GetResponseAsync(chatHistory)` instead, you get one `ChatResponse` object back once the model finishes. That is simpler but feels slow on long replies. `GetStreamingResponseAsync` trades a few more lines for immediate feedback — the right default for interactive UIs.

## Using the ChatClient directly (no streaming)

When you only need the final text, the shape collapses:

```cs
string ollamaUrl = "http://localhost:11434/";
string modelId = "llava:7b";
IChatClient ollamaClient = new OllamaApiClient(ollamaUrl, modelId);

var response = await ollamaClient.GetResponseAsync(chatHistory);
Console.WriteLine(response.Text);
```

Same client, different method. `GetResponseAsync` returns a full `ChatResponse`; `GetStreamingResponseAsync` yields `ChatResponseUpdate` items incrementally.

## Multi-turn conversations

`List<ChatMessage>` is the conversation. To keep context across turns, append the user's new message and the model's reply to the same list, then call the client again:

```cs
chatHistory.Add(new ChatMessage(ChatRole.User, "What is its moon?"));
var reply = await chatClient.GetResponseAsync(chatHistory);
chatHistory.Add(new ChatMessage(ChatRole.Assistant, reply.Text));
```

The SLM has no memory of its own. Every call re-sends the whole history. Trim oldest entries when you hit the context window.

> **Pitfall**
> Port typo and protocol traps.
> - Wrong port: `http://localhost:1143` has four digits, not five. The daemon listens on `11434`. A single dropped digit silently fails to connect.
> - Wrong protocol: Ollama is `http://`. GitHub Models is `https://` with the path `/inference`. Mixing them — e.g. `https://localhost:11434/inference` — is a classic exam distractor.
> - "Ollama requires internet" is FALSE. It is fully local after `ollama pull`.
> - Package vs binary: `OllamaSharp` is the NuGet C# client. `ollama` is the CLI binary and daemon. The exam may ask which name is the .NET package — answer: `OllamaSharp`.

## How the pieces sit

```text
Your C# app
    |
OllamaApiClient("http://localhost:11434/", "phi3")  implements IChatClient
    |  HTTP POST, OpenAI-compatible JSON
Ollama daemon  (listens on port 11434)
    |
Loaded SLM (Phi-3 weights in RAM)
    |
Tokens stream back as ChatResponseUpdate fragments
```

Nothing leaves your machine. The daemon is the only process that touches the model; your app only speaks HTTP to `localhost`.

> **Takeaway**
> `OllamaApiClient(new Uri("http://localhost:11434/"), "phi3")` is the full setup for local chat completion. Build a `List<ChatMessage>` with `ChatRole` + content, call `GetStreamingResponseAsync` for token-by-token output or `GetResponseAsync` for one buffered reply, and remember: HTTP, port 11434, no internet needed after `ollama pull`.
