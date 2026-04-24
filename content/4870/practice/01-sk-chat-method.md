---
n: 1
id: sk-chat-method
title: "SK chat method — wire history, send, return reply"
kind: code
lang: csharp
tags: [ai, semantic-kernel, chat-completion, code-question]
source: "Lesson 01 (likely-pattern coding question for AI bucket — 13 marks on final)"
---

## Prompt

Create a method **`AskAi`** inside a Razor PageModel. The method should:

1. Be **`async`** and return **`Task<string>`**.
2. Take one parameter — `string userMessage`.
3. Build a `ChatHistory` with the system prompt `"You are a helpful assistant. Reply in one sentence."`.
4. Append the `userMessage` as a user message.
5. Call **`GetStreamingChatMessageContentsAsync`** on the injected `IChatCompletionService`, accumulate the streamed tokens into a `StringBuilder`, and return the result.

Assume the field `private readonly IChatCompletionService _chat;` is already injected via constructor. Write only the method.

## Starter

```cs
public async Task<string> AskAi(string userMessage)
{
    // TODO 1: build ChatHistory with the system prompt
    // TODO 2: append userMessage as user message
    // TODO 3: stream tokens, accumulate, return
}
```

## Solution

```cs
public async Task<string> AskAi(string userMessage)
{
    var chat = new ChatHistory("You are a helpful assistant. Reply in one sentence.");
    chat.AddUserMessage(userMessage);

    var sb = new StringBuilder();
    await foreach (var msg in _chat.GetStreamingChatMessageContentsAsync(chat))
    {
        sb.Append(msg.Content);
    }
    return sb.ToString();
}
```

## Why

The **`ChatHistory(systemPrompt)`** constructor takes the system prompt directly — you don't need a separate `AddSystemMessage` call. Streaming returns an `IAsyncEnumerable<...>`; the `await foreach` accumulates each `Content` chunk.

A common wrong approach is to use **`_chat.GetChatMessageContentAsync(chat)`** (singular, no streaming) and skip the `StringBuilder`. That returns one `ChatMessageContent` whose `.Content` is the full reply. It works, but the prompt explicitly asks for streaming — pick the right method.

Another wrong approach: confusing `IChatCompletionService` (Semantic Kernel) with **`IChatClient`** (`Microsoft.Extensions.AI` — used by Ollama / MAF). The method names differ: SK uses **`GetStreamingChatMessageContentsAsync`**; Microsoft.Extensions.AI uses **`GetStreamingResponseAsync`**. Mixing them won't compile.
