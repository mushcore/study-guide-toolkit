---
id: 4870-topic-microsoft-agent-framework-maf
title: Microsoft Agent Framework (MAF)
pillar: tech
priority: high
chapter: W12-13
tags:
  - ai
  - maf
---

### Create an agent

```cs
// NuGet: Microsoft.Agents.AI, Microsoft.Agents.AI.OpenAI
using Microsoft.Agents.AI;
using OpenAI;

var client = new OpenAIClient(new ApiKeyCredential(token),
    new OpenAIClientOptions { Endpoint = new Uri("https://models.github.ai/inference") });
AIAgent agent = client.AsAIAgent("gpt-4o-mini");
agent.Instructions = "You are a helpful weather assistant.";
```

### Register an AI tool (function)

```cs
string GetWeather(string city) => $"It is sunny in {city}.";

AIFunction weatherTool = AIFunctionFactory.Create(
    GetWeather,
    name: "get_weather",
    description: "Get current weather for a city.");

agent.Tools.Add(weatherTool);
```

### Sessions & streaming

```cs
var session = new AgentSession(agent);
// Single turn
var response = await session.RunAsync("Weather in Vancouver?");
Console.WriteLine(response);

// Stream tokens
await foreach (var update in session.RunStreamingAsync("And Toronto?")) {
    Console.Write(update.Content);
}
```

### Exam traps

-   `AsAIAgent` is an extension on an OpenAI client — not `.ToAIAgent` or `.CreateAgent`
-   `AIFunctionFactory.Create(delegate, name, description)` — delegate comes first
-   Tools are added to `agent.Tools` (collection), not via a method
-   `AgentSession` carries multi-turn history — creating a new session each call = no memory
