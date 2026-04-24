---
n: 1
id: ai-agent-wire-up-console
title: "Wire a single-tool MAF agent in a console app"
kind: code
lang: csharp
tags: [ai, maf, agent, tools, console]
source: "Assignment 2 (variant — console-only MAF agent registering one tool via AIFunctionFactory.Create, simpler than A2's full-stack AI-integrated Blazor)"
---

## Prompt

Write `Program.cs` for a console app that uses the Microsoft Agent Framework (MAF) to answer weather questions with one tool.

Requirements:
- Start from an existing `IChatClient chatClient` (assume it is already constructed against GitHub Models).
- Define a static C# method `WeatherService.GetWeatherForCity(string city)` that returns a plain string like `"Vancouver: 8C, rainy"` for any input.
- Register that method as an `AITool` using `AIFunctionFactory.Create` with `name: "GetWeatherForCity"` and a description the LLM can read.
- Build a `ChatClientAgent` with `.AsAIAgent(...)`, passing the tool in the `tools:` array plus an `instructions:` string and a `name:`.
- Create an `AgentSession` once via `await agent.CreateSessionAsync()`.
- Loop: read a line from the console, call `agent.RunAsync(input, session)`, and print the `.Text` property.

Do not use `ChatHistory`, `.AsAgent()`, `agent.Invoke()`, or `AITool.Register()` — none exist in MAF.

## Starter

```cs
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;

public static class WeatherService
{
    public static string GetWeatherForCity(string city)
    {
        // TODO: return a stub string like "Vancouver: 8C, rainy"
        throw new NotImplementedException();
    }
}

public class Program
{
    public static async Task Main(string[] args)
    {
        IChatClient chatClient = BuildChatClient(); // assume provided

        // TODO 1: wrap WeatherService.GetWeatherForCity as an AITool using AIFunctionFactory.Create.
        // TODO 2: build the agent with chatClient.AsAIAgent(name, instructions, tools).
        // TODO 3: create an AgentSession with await agent.CreateSessionAsync().
        // TODO 4: loop — read input, call agent.RunAsync(input, session), print response.Text.
    }

    private static IChatClient BuildChatClient() => throw new NotImplementedException();
}
```

## Solution

```cs
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;

public static class WeatherService
{
    public static string GetWeatherForCity(string city)
    {
        return $"{city}: 8C, rainy";
    }
}

public class Program
{
    public static async Task Main(string[] args)
    {
        IChatClient chatClient = BuildChatClient();

        AITool weatherTool = AIFunctionFactory.Create(
            WeatherService.GetWeatherForCity,
            name: "GetWeatherForCity",
            description: "Get the current weather summary for a given city name.");

        AIAgent agent = chatClient.AsAIAgent(
            name: "WeatherAgent",
            instructions: "You answer weather questions. Call GetWeatherForCity whenever the user asks about a city's weather.",
            tools: [weatherTool]);

        var session = await agent.CreateSessionAsync();

        while (true)
        {
            Console.Write("User > ");
            string? input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input)) continue;

            var response = await agent.RunAsync(input, session);
            Console.WriteLine(response.Text);
        }
    }

    private static IChatClient BuildChatClient() => throw new NotImplementedException();
}
```

## Why

The LLM decides when to call `GetWeatherForCity` based on the description string. That is the entire function-calling contract — the description is metadata the model reads, not a comment for humans.

A common wrong approach: build a `List<ChatMessage> history` and append each user and assistant message manually, passing the list into every `RunAsync` call. That is the raw `IChatClient` pattern. MAF agents use `AgentSession` from `await agent.CreateSessionAsync()`; passing both a manual `ChatHistory` and a session duplicates state.

A second wrong approach: register the method with `AITool.Register(WeatherService.GetWeatherForCity)` or `chatClient.AsAgent(...)`. Neither compiles — MAF ships `AIFunctionFactory.Create` and `.AsAIAgent()`. `.AsAgent()` and `AITool.Register()` are documented exam distractors.

A third wrong approach: call `agent.Invoke(input)` or `kernel.InvokeAsync(...)`. `Invoke` is Semantic Kernel vocabulary; MAF agents expose `RunAsync` (buffered) and `RunStreamingAsync` (token-by-token). Mixing the two SDKs' verbs on the same object does not interop.
