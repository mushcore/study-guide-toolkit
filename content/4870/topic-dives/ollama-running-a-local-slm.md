---
id: 4870-topic-ollama-running-a-local-slm
title: Ollama — running a local SLM
pillar: tech
priority: high
chapter: W12-13
tags:
  - ai
  - dotnet
---

### Install + download model

```cs
ollama pull llama3        # download
ollama run llama3         # interactive REPL
ollama list               # list downloaded models
```

### C# client via OllamaSharp

```cs
// NuGet: OllamaSharp
var ollama = new OllamaApiClient("http://localhost:11434");
ollama.SelectedModel = "llama3";
await foreach (var chunk in ollama.GenerateAsync("Tell me a joke")) {
    Console.Write(chunk.Response);
}
```

### With Semantic Kernel

```cs
var b = Kernel.CreateBuilder();
b.AddOllamaChatCompletion("llama3", new Uri("http://localhost:11434"));
var kernel = b.Build();
```

### Why Ollama

-   Runs locally — NO API key, NO cloud bill, offline-capable
-   Good for privacy-sensitive or learning contexts
-   Tradeoff: slower, smaller models (7B-13B typical vs 1T+ cloud)

### Exam traps

-   Endpoint is `http://` (not https) on localhost
-   Default port 11434
-   OpenAI SDK is NOT the Ollama SDK — use `OllamaSharp` for direct calls OR SK's `AddOllamaChatCompletion`
