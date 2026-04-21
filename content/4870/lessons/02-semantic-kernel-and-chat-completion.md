---
"n": 2
id: 4870-lesson-semantic-kernel-and-chat-completion
title: Semantic Kernel and chat completion
hook: SK is Microsoft's AI glue. Build a Kernel, feed it messages, let it call plugins.
tags:
  - semantic-kernel
module: AI & ML.NET
---

**Semantic Kernel (SK)** orchestrates LLM calls. You build a `Kernel`, it exposes `IChatCompletionService`, you hand it a `ChatHistory` with messages, it returns a response.

> **Analogy**
>  Kernel is a kitchen. Plugins are ingredients. ChatHistory is the conversation log. The chef (LLM) cooks responses based on what's in the log.

```cs
// Program.cs — register SK
var builder = Kernel.CreateBuilder();
builder.AddOllamaChatCompletion("llama3", new Uri("http://localhost:11434"));
// OR GitHub Models endpoint: https://models.github.ai/inference
Kernel kernel = builder.Build();
var chat = kernel.GetRequiredService<IChatCompletionService>();
var history = new ChatHistory("You are helpful.");
history.AddUserMessage("Hello");
var reply = await chat.GetChatMessageContentAsync(history, kernel: kernel);
```

**Plugins:** C# classes decorated with `[KernelFunction]`. Register via `kernel.ImportPluginFromType<T>()` or `ImportPluginFromPromptDirectory` for skprompt.txt plugins.

#### The SK call chain

flowchart TB
  B\["Kernel.CreateBuilder()"\] --> AD\["AddOllamaChatCompletion / AddOpenAIChatCompletion"\]
  AD --> K\["Kernel = Build()"\]
  K -- "GetRequiredService<IChatCompletionService>" --> CS\[IChatCompletionService\]
  K -- "ImportPluginFromType<T>" --> PL\["Plugin
\[KernelFunction\]"\]
  H\["ChatHistory('system')
.AddUserMessage(...)"\] --> CS
  CS -- GetChatMessageContentAsync --> OUT\[response\]
      

> **Q:** **Checkpoint —** You have a built `Kernel` and want to send a user question. Which object do you resolve first, what do you construct, and what method returns the model's reply? Name all three.
> **A:** Resolve `IChatCompletionService` via `kernel.GetRequiredService<IChatCompletionService>()`. Construct a `ChatHistory` (optionally seeded with a system message), then `history.AddUserMessage("...")`. Call `await chat.GetChatMessageContentAsync(history, kernel: kernel)` — its result's `.Content` is the reply string.

> **Note**
> **Takeaway —** Kernel + ChatHistory + IChatCompletionService is the trio. Memorize this chain.
