---
n: 2
id: ollama-console-loop
title: "Ollama console chat loop with multi-turn history"
kind: code
lang: csharp
tags: [ai, ollama, ichatclient, console, code-question]
source: "Lesson 02 (likely-pattern coding question for AI bucket — 13 marks on final)"
---

## Prompt

Create the contents of `Program.cs` for a console chat app talking to a **local Ollama Phi-3** model. The program should:

1. Create an `IChatClient` from `OllamaApiClient` pointed at **`http://localhost:11434/`** with model id `"phi3"`.
2. Maintain a `List<ChatMessage>` for chat history.
3. Loop forever — read a line from the console, append it as a `ChatRole.User` message, stream the response with `GetStreamingResponseAsync`, print each token as it arrives, then append the assembled response as a `ChatRole.Assistant` message.

Assume `using Microsoft.Extensions.AI;` and `using OllamaSharp;` are present. Write only the body of `Main`.

## Starter

```cs
// TODO 1: create IChatClient pointing at Ollama on localhost:11434, model "phi3"
// TODO 2: create List<ChatMessage> for history
// TODO 3: loop — read input, add user msg, stream response, append assistant msg
```

## Solution

```cs
IChatClient chatClient = new OllamaApiClient(new Uri("http://localhost:11434/"), "phi3");

List<ChatMessage> chatHistory = new();

while (true)
{
    Console.WriteLine("Your prompt:");
    var userPrompt = Console.ReadLine();
    chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));

    Console.WriteLine("AI Response:");
    var response = "";
    await foreach (ChatResponseUpdate item in
        chatClient.GetStreamingResponseAsync(chatHistory))
    {
        Console.Write(item.Text);
        response += item.Text;
    }
    chatHistory.Add(new ChatMessage(ChatRole.Assistant, response));
    Console.WriteLine();
}
```

## Why

`OllamaApiClient` returns an **`IChatClient`** — the chat interface from `Microsoft.Extensions.AI`. Ollama listens on **port 11434** with no auth. The server has **no memory** between calls, so you must re-send the **full** `chatHistory` every turn — and append the model's reply yourself before the next iteration.

A common wrong approach is to forget to append the assistant's response back into `chatHistory`. The model then has no record of its own previous answers — every prompt looks like the first message of a fresh conversation.

Another wrong approach: passing **`new ApiKeyCredential("...")`** as a second arg to `OllamaApiClient`. The Ollama constructor doesn't take a credential — it's local loopback, no auth. That's the OpenAI/Docker SLM pattern (Lesson 02), not the Ollama one.
