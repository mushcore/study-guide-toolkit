---
"n": 3
id: 4870-lesson-microsoft-agent-framework-maf-and-mcp
title: Microsoft Agent Framework (MAF) and MCP
hook: MAF is SK's bigger sibling — agents with memory, tools, planners. MCP is tool transport.
tags:
  - maf
  - mcp
module: AI & ML.NET
---

**MAF** (Microsoft.Agents.AI) wraps an LLM into an `AIAgent`. It uses `AIFunction` (one tool) built via `AIFunctionFactory.Create(delegate)`.

```cs
// MAF agent with tools
var client = new OpenAIClient(...); // points to GitHub Models or Ollama
var agent = client.AsAIAgent("gpt-4o-mini");
var tool = AIFunctionFactory.Create(GetWeather, "get_weather", "Get weather");
agent.Tools.Add(tool);
var session = new AgentSession(agent);
await foreach (var update in session.RunStreamingAsync("What's the weather?")) {
    Console.Write(update);
}
```

> **Analogy**
>  SK = calling a chef on the phone for each order (you pass the full ChatHistory every call). MAF + AgentSession = a chef who remembers THIS conversation (the session tracks messages across calls within one session — NOT across app restarts). MCP = a universal plug that any kitchen tool honours — the AI host speaks one protocol, any MCP server can respond.

**Scope warning (exam trap):** `AgentSession` holds multi-turn history WITHIN one session object. It does not by itself persist between app runs — if you want persistence you save/restore the history yourself (source: AI-Models\_MAF\_SCRIPT.docx).

**MCP (Model Context Protocol):** Transport for AI tools. Two transports:

-   `stdio` — local process over stdin/stdout
-   `SSE` — Server-Sent Events over HTTP (cloud)

#### MAF agent stack

flowchart TB
  C\[OpenAIClient / GitHub Models\] -- ".AsAIAgent('gpt-4o-mini')" --> A\[AIAgent\]
  A -- "agent.Tools.Add(tool)" --> F\["AIFunction
AIFunctionFactory.Create"\]
  A --> S\["AgentSession
holds multi-turn history"\]
  S -- "RunAsync / RunStreamingAsync" --> R\["Response
or token stream"\]
      

#### MCP transports — stdio vs SSE

flowchart LR
  subgraph STDIO\["stdio (LOCAL)"\]
    H1\[AI Host\] <-. stdin/stdout .-> T1\["MCP Server
co-located process"\]
  end
  subgraph SSE\["SSE (REMOTE / CLOUD)"\]
    H2\[AI Host\] <-. HTTP SSE .-> T2\["MCP Server
Azure Functions HTTPS"\]
  end
      

> **Q:** **Checkpoint —** An MCP server runs as a Python process on the same machine as your .NET host. Which transport do you configure, and what is the concrete mechanism it uses to pass messages?
> **A:** **stdio**. The host spawns the MCP server as a child process and exchanges JSON-RPC messages over the child's stdin/stdout. No TCP port, no HTTP — just a process pipe. SSE would be wrong because the server is not network-addressable.

> **Note**
> **Takeaway —** AsAIAgent() converts a model client into an agent. AIFunctionFactory.Create() wraps a C# method into a tool.
