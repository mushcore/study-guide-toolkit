---
id: 4870-topic-mcp-model-context-protocol
title: MCP — Model Context Protocol
pillar: tech
priority: high
chapter: W05-06
tags:
  - ai
  - mcp
---

### What MCP is

Open protocol for wiring AI models to external tools, resources, and prompts. Two transports:

-   **stdio** — process pipe (local, co-located tools)
-   **SSE** — Server-Sent Events over HTTP (cloud / remote)

### Three primitives a server exposes

| Primitive | Purpose |
| --- | --- |
| **Tools** | Executable functions the model can call |
| **Resources** | Read-only data (files, DB rows, wiki pages) |
| **Prompts** | Reusable templated prompts |

### Minimal server (Labs W05/W06)

```cs
// W05: stdio MCP server (console app, runs under Claude/other host)
var builder = Host.CreateApplicationBuilder(args);
builder.Services
  .AddMcpServer()
  .WithStdioServerTransport()
  .WithToolsFromAssembly();
await builder.Build().RunAsync();

// Tool class
[McpServerToolType]
public static class Tools {
  [McpServerTool, Description("Multiply two numbers")]
  public static int Multiply(int a, int b) => a * b;
}
```

### W06 — Azure Functions MCP server uses SSE transport

Azure Function app with MCP trigger → reachable over HTTPS → works with any MCP client.

### Exam traps

-   MCP is NOT a Microsoft-only protocol — it's open, maintained by Anthropic + broader community
-   stdio transport = LOCAL only (not network-addressable)
-   SSE = one-way stream from server to client (classic Server-Sent Events)
-   `[McpServerTool]` attribute on the method; `[McpServerToolType]` on the class
