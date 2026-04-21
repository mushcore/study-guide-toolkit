---
"n": 4
id: 4870-code-semantic-kernel-chat-plugin
title: Semantic Kernel chat + plugin
lang: cs
variant: starter-solution
tags:
  - semantic-kernel
---

## Prompt

Register Semantic Kernel with Ollama llama3 endpoint. Create a plugin with a [KernelFunction] method <code>GetWeather(string city)</code>. Run a chat with a user prompt "What is the weather in Vancouver?" and print the response.

## Starter

```cs
using Microsoft.SemanticKernel;

public class WeatherPlugin {
    // TODO: [KernelFunction] GetWeather
}

// Program.cs
// TODO: build kernel with Ollama
// TODO: import plugin
// TODO: chat history with user prompt
// TODO: get response
```

## Solution

```cs
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System.ComponentModel;

public class WeatherPlugin {
    [KernelFunction, Description("Get weather for a city")]
    public string GetWeather(string city) => $"Sunny in {city}.";
}

// Program.cs
var builder = Kernel.CreateBuilder();
builder.AddOllamaChatCompletion("llama3", new Uri("http://localhost:11434"));
Kernel kernel = builder.Build();

kernel.ImportPluginFromType<WeatherPlugin>();

var chat = kernel.GetRequiredService<IChatCompletionService>();
var history = new ChatHistory("You are helpful.");
history.AddUserMessage("What is the weather in Vancouver?");

var response = await chat.GetChatMessageContentAsync(history, kernel: kernel);
Console.WriteLine(response.Content);
```

## Why

<strong>Marking checklist (10 marks):</strong><ul><li>Kernel.CreateBuilder() (1)</li><li>AddOllamaChatCompletion with correct endpoint (2)</li><li>ImportPluginFromType&lt;T&gt; (1)</li><li>[KernelFunction] attribute (2)</li><li>IChatCompletionService via GetRequiredService (1)</li><li>ChatHistory with system prompt (1)</li><li>AddUserMessage + GetChatMessageContentAsync (2)</li></ul>
