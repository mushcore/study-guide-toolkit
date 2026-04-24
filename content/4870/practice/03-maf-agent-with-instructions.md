---
n: 3
id: maf-agent-with-instructions
title: "MAF agent with instructions + multi-turn session"
kind: code
lang: csharp
tags: [ai, maf, agent, session, code-question]
source: "Lesson 02 (likely-pattern coding question for AI bucket — 13 marks on final)"
---

## Prompt

Create a method **`RunAstronomerAgent`** inside `Program.cs`. The method should:

1. Be **`async`** and return **`Task`**.
2. Build an `IChatClient` from `OllamaApiClient` using `"http://localhost:11434/"` and model `"phi3:latest"`.
3. Wrap it as a **`ChatClientAgent`** with the name `"Astronomer"` and the instruction `"You are an astronomer who specializes in the solar system."`. Set `Temperature = 0.7f`.
4. Open a multi-turn `AgentSession`.
5. Call `agent.RunAsync("How far is earth from the sun?")` and print the result.

Write only the method.

## Starter

```cs
public static async Task RunAstronomerAgent()
{
    // TODO 1: create IChatClient via OllamaApiClient
    // TODO 2: build ChatClientAgent with name + instructions + Temperature
    // TODO 3: open AgentSession
    // TODO 4: RunAsync the prompt and print
}
```

## Solution

```cs
public static async Task RunAstronomerAgent()
{
    IChatClient ollamaClient = new OllamaApiClient(
        new Uri("http://localhost:11434/"), "phi3:latest");

    ChatClientAgent agent = new ChatClientAgent(
        ollamaClient,
        new ChatClientAgentOptions
        {
            Name = "Astronomer",
            ChatOptions = new ChatOptions
            {
                Instructions = "You are an astronomer who specializes in the solar system.",
                Temperature  = 0.7f
            }
        });

    var session = await agent.CreateSessionAsync();

    Console.WriteLine(await agent.RunAsync("How far is earth from the sun?"));
}
```

## Why

MAF wraps any `IChatClient` as an `AIAgent`. **`ChatClientAgentOptions`** carries the persona (`Name`, `ChatOptions.Instructions`) and per-call defaults (`Temperature`, `MaxOutputTokens`). **`AgentSession`** opens a multi-turn conversation that the agent maintains internally — no manual `List<ChatMessage>` like the raw Ollama pattern.

A common wrong approach is to call **`agent.Invoke(prompt)`** or **`kernel.InvokeAsync(prompt)`**. `Invoke` is **Semantic Kernel** vocabulary — MAF agents use **`RunAsync`** (buffered) and **`RunStreamingAsync`** (token-stream). Mixing the two SDKs' verbs won't compile.

Another wrong approach: using **`chatClient.AsAgent(...)`** instead of **`chatClient.AsAIAgent(...)`** — `.AsAgent()` doesn't exist. The MAF extension method is literally `.AsAIAgent`.
