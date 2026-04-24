---
n: 1
id: ai-agent-framework
title: "Microsoft Agent Framework (MAF) + tool calling"
hook: "Wrap an `IChatClient` into an agent, register a C# method as a tool, and let the LLM decide when to call it."
tags: [ai, maf, agent, tools, function-calling]
module: "AI in .NET"
source: "notes/AI-Models_MAF_SCRIPT.docx (Demos #2, #3); research-ai.md §maf"
bloom_levels: [understand, apply]
related: [ai-semantic-kernel, ai-chat-completion-local]
---

## The weather-poet agent

You have an `IChatClient` pointed at GitHub Models. You want it to answer "What should I wear in Vancouver?" by calling `WeatherService.GetWeatherAsync("Vancouver")`, reading the result, and writing a short poem. The Microsoft Agent Framework (MAF) turns that three-step pipeline into one `RunAsync` call — the LLM picks the tool, MAF runs it, the LLM stitches the answer.

MAF (package `Microsoft.Agents.AI.OpenAI`, `--prerelease`) sits on top of `IChatClient`. It adds three things: agent wrapping, tool registration, and session state. You write one extension-method call, one factory call per tool, and one `await` per turn.

## Build a bare agent

Start with an `IChatClient`. Wrap it into a `ChatClientAgent` with `.AsAIAgent()`:

```cs
using Microsoft.Agents.AI;

var agent = chatClient.AsAIAgent(
    instructions: "You write short rhyming recipes.",
    name: "CakeRecipeAgent");

var response = await agent.RunAsync("A dessert for a rainy Tuesday.");
Console.WriteLine(response);
```

`AsAIAgent` is an extension method on `IChatClient`. `RunAsync` returns the assembled assistant message. That is the full non-tool case — two method calls.

> **Q:** Which extension method wraps an `IChatClient` into a `ChatClientAgent`?
> **A:** `.AsAIAgent()`. `.AsAgent()` does not exist — it is a common exam distractor.

## Add a tool

A tool is an `AITool`. You build one by handing a C# delegate to `AIFunctionFactory.Create` along with a name and a natural-language description. The LLM reads the description to decide when to call it.

```cs
using Microsoft.Extensions.AI;
using Microsoft.Agents.AI;

AITool getCityNameTool = AIFunctionFactory.Create(
    CityInfo.GetCityNameFromJson,
    name: "GetCityNameFromJson",
    description: "Get the City Name from the given JSON string");

AITool getWeatherTool = AIFunctionFactory.Create(
    WeatherService.GetWeatherAsync,
    name: "GetWeather",
    description: "Get the weather details of a location using city name");

AIAgent agent = chatClient.AsAIAgent(
    name: "WeatherPoetAgent",
    instructions: "You are a helpful assistant that detects cities and describes weather.",
    tools: [getCityNameTool, getWeatherTool]);
```

The `tools:` parameter takes an array of `AITool`. The agent now has two callable functions. When you call `RunAsync`, the LLM inspects the descriptions, decides which tools to call, calls them through MAF, reads the results, and answers.

> **Example**
> Trace the weather-poet turn.
> 1. User input: `"What should I wear in Vancouver?"`.
> 2. LLM sees `GetWeather` description and emits a tool-call for `GetWeather("Vancouver")`.
> 3. MAF invokes `WeatherService.GetWeatherAsync("Vancouver")` and returns the string `"Vancouver: 8C, rainy"`.
> 4. LLM receives the tool result as context and writes the final reply.
> 5. `agent.RunAsync(...)` returns that final reply. The two tool round-trips happen inside one `await`.

## Wrap a lambda as a tool

`AIFunctionFactory.Create` also takes an async lambda. This is how you register a prompt-based step — load a template, substitute values, call `IChatClient.GetResponseAsync`, return the text.

```cs
string shortPoemTemplate = File.ReadAllText(templatePath);

AITool writeShortPoemTool = AIFunctionFactory.Create(
    async (string cityName, string weatherInput) => {
        string prompt = shortPoemTemplate
            .Replace("{{$CityName}}", cityName)
            .Replace("{{$WeatherInput}}", weatherInput);
        var result = await chatClient.GetResponseAsync(prompt);
        return result.Text;
    },
    name: "WriteShortPoem",
    description: "Write a short funny poem about clothes to wear based on city and weather");
```

The lambda parameters become the tool's parameter schema. Names and types travel to the LLM through the factory.

## Keep state across turns

For multi-turn chat, create an `AgentSession` once and pass it into every `RunAsync`. The agent manages history and tool-call state inside the session — you do not build a `List<ChatMessage>`.

```cs
var session = await agent.CreateSessionAsync();

while (true) {
    Console.Write("User > ");
    string? input = Console.ReadLine();
    if (string.IsNullOrWhiteSpace(input)) continue;

    var response = await agent.RunAsync(input, session);
    Console.WriteLine(response.Text);
}
```

For streaming, swap `RunAsync` for `RunStreamingAsync` and `await foreach` the updates:

```cs
await foreach (var update in agent.RunStreamingAsync("Which planet is closest to the sun?")) {
    Console.Write(update);
}
```

> **Q:** You want conversation memory across five `RunAsync` calls. Do you build a `ChatHistory` or an `AgentSession`?
> **A:** `AgentSession`, created via `await agent.CreateSessionAsync()`. `ChatHistory` is a manual `List<ChatMessage>` — fine for raw `IChatClient` use, wrong for MAF agents.

> **Pitfall**
> Four fake APIs that look right on a multiple-choice exam.
> - `.AsAgent()` — does not exist. Use `.AsAIAgent()`.
> - `agent.Invoke()` — does not exist. Use `agent.RunAsync()`.
> - `AITool.Register(method)` — does not exist. Use `AIFunctionFactory.Create(method, name: ..., description: ...)`.
> - `kernel.InvokeAsync()` on an MAF agent — that is Semantic Kernel. MAF uses `agent.RunAsync()`.

> **Pitfall**
> Do not pass both a `ChatHistory` and an `AgentSession` into the same agent run. `ChatHistory` belongs to raw `IChatClient` code. `AgentSession` belongs to MAF agents. Mixing them duplicates state.

> **Pitfall**
> Package names ship separately and both need `--prerelease`. `Microsoft.Agents.AI` is the base. `Microsoft.Agents.AI.OpenAI` adds the OpenAI-compatible `ChatClient` integration used by GitHub Models. Install the one that matches your backend.

> **Takeaway**
> An MAF agent is an `IChatClient` plus `.AsAIAgent()`, plus zero or more `AITool` values from `AIFunctionFactory.Create`, plus an optional `AgentSession` for multi-turn state. You drive it with `RunAsync` or `RunStreamingAsync`. Everything else — `.AsAgent`, `Invoke`, `AITool.Register` — is a distractor.
