---
id: 4870-topic-semantic-kernel-kernel-chathistory-plugins
title: Semantic Kernel — Kernel, ChatHistory, Plugins
pillar: tech
priority: high
chapter: W12-13
tags:
  - ai
  - semantic-kernel
---

### Exact registration pattern

```cs
// Program.cs
var builder = Kernel.CreateBuilder();
// Ollama (local)
builder.AddOllamaChatCompletion("llama3", new Uri("http://localhost:11434"));
// OR OpenAI-compatible (e.g., GitHub Models)
builder.AddOpenAIChatCompletion(
    modelId: "gpt-4o-mini",
    apiKey: token,
    endpoint: new Uri("https://models.github.ai/inference"));
Kernel kernel = builder.Build();
```

### Running a prompt

```cs
var chat = kernel.GetRequiredService<IChatCompletionService>();
var history = new ChatHistory("You are a helpful assistant.");
history.AddUserMessage("Hello!");
var response = await chat.GetChatMessageContentAsync(history, kernel: kernel);
Console.WriteLine(response.Content);
```

### Plugins (C# native)

```cs
public class MathPlugin {
    [KernelFunction, Description("Add two numbers")]
    public int Add(int a, int b) => a + b;
}
// Register
kernel.ImportPluginFromType<MathPlugin>();
```

### Plugins (prompt-based / skprompt.txt)

```cs
// Folder structure:
// Plugins/
//   Writer/
//     Summarize/
//       skprompt.txt       <- contains prompt with {{$input}}
//       config.json        <- execution settings

kernel.ImportPluginFromPromptDirectory("Plugins/Writer");
```

### Exam traps

-   `Kernel.CreateBuilder()` NOT `new Kernel()`
-   Ollama default port 11434 (not 11343, not 11434 over HTTPS)
-   Plugin annotation is `[KernelFunction]` not `[SKFunction]` (renamed)
-   System prompt goes into `ChatHistory` ctor OR `AddSystemMessage` — it does NOT go to the user message
