---
n: 17
id: laravel-mcp-implementation
title: "Building an MCP server in Laravel"
hook: "Your Laravel app can expose tools that Claude calls — not just call tools itself."
tags: [mcp, laravel, sse, stdio, json-rpc, server-side]
module: "mcp-module"
priority: low
source: "laravel_mcp.pptx slides 1–12"
bloom_levels: [understand, apply]
related: [mcp-protocol, rest-api-design, laravel-routing-controllers]
pedagogy: productive-failure
---

## Client or server — which side are you on?

Imagine your Laravel app already calls an external MCP server to fetch weather data. That makes Laravel an MCP **client**. Now a different question: what if you want Claude to call *your* Laravel app — to let Claude create a todo, query your database, or trigger a workflow you own?

For that, Laravel must become an MCP **server**.

> **Q:** What does a Laravel app need to do to act as an MCP server rather than an MCP client?
> **A:** It must expose endpoints that respond to `tools/list` and `tools/call` requests in the JSON-RPC 2.0 format — declaring what tools exist and executing them when invoked.

The distinction matters because the responsibilities are opposite. A client discovers and calls tools. A server advertises and executes them.

---

## What the server must expose

An MCP server has two required endpoints, both speaking JSON-RPC 2.0:

- **`tools/list`** — returns an array of tool definitions so any MCP client can discover what the server can do.
- **`tools/call`** — accepts a tool name and arguments, executes the tool, and returns the result.

Every tool definition has exactly three fields:

| Field | Type | Purpose |
|---|---|---|
| `name` | string | Unique identifier the client uses when calling |
| `description` | string | Natural-language explanation; the LLM reads this to decide when to call |
| `inputSchema` | JSON Schema object | Declares the shape and types of the arguments |

The `description` field is load-bearing. Claude decides *whether* to call your tool based on it. A vague description produces missed invocations or wrong invocations.

> **Pitfall**
> Writing `description: "Adds a todo"` is not enough. Claude needs context: what kind of todo, what system it goes into, what the return value means. A description like `"Creates a new todo item in the app's task list and returns the created item's ID"` gives Claude the signal it needs to invoke correctly.

---

## Setting up the Laravel MCP package

Laravel's first-party MCP package installs via Composer and adds two Artisan generators:

```bash
composer require laravel/mcp
php artisan vendor:publish --tag=ai-routes
php artisan make:mcp-server TodoServer
php artisan make:mcp-tool AddTodoTool
```

The `vendor:publish` step registers the MCP route namespace — the endpoints your server will respond on. Each tool lives in its own class scaffolded by `make:mcp-tool`. The server class (from `make:mcp-server`) registers which tools it exposes.

> **Example**
> After running the generators, `TodoServer` declares `AddTodoTool` in its tool list. When a client calls `tools/list` against your server's URL, it receives the tool's `name`, `description`, and `inputSchema`. When it calls `tools/call` with `name: "AddTodoTool"` and valid arguments, Laravel routes the call to `AddTodoTool`'s `handle()` method.

---

## Transport: SSE vs STDIO

Two transport mechanisms exist for MCP servers. The choice depends on where the server runs.

**SSE (Server-Sent Events)** is for remote servers accessible over HTTP. The client opens a persistent HTTP connection and the server streams messages back. Your VS Code `mcp.json` uses SSE when it points to a URL:

```json
{
  "servers": {
    "todo-mcp-server": {
      "url": "http://localhost:8000/mcp/todo",
      "type": "http"
    }
  }
}
```

**STDIO** is for local process-based servers. The client spawns a subprocess and communicates over standard input/output pipes. This requires no HTTP server — the MCP client directly manages the process lifecycle.

For a Laravel app deployed to a URL, SSE is the correct transport. STDIO applies to command-line tools or local scripts, not web frameworks.

> **Q:** A team wants to deploy their MCP server to Azure App Service and connect Claude Desktop to it. Which transport applies?
> **A:** SSE — the server is remote and HTTP-accessible. STDIO only applies to locally-spawned processes.

---

## MCP inspector for local testing

The package ships a built-in inspector command:

```bash
php artisan mcp:inspector mcp/todo
```

This opens a local UI to send `tools/list` and `tools/call` requests to your server manually — equivalent to Postman for MCP endpoints. Use it before connecting any real MCP client.

---

## Composability: client and server at once

A single Laravel app can act as both an MCP client (calling external tools) and an MCP server (exposing tools to Claude). The two roles are independent. One controller can call an external weather MCP server; a separate MCP server class in the same app can expose a `CreateInvoice` tool to Claude.

This composability is what makes MCP-based agent architectures scalable. Each service owns its domain and exposes it as callable tools, while also being free to consume tools from other services.

> **Pitfall**
> Do not confuse the app's own MCP server route with external MCP server URLs. The local `mcp/todo` path is your server's endpoint. Any external MCP server has a completely separate URL and requires its own client configuration.

> **Takeaway**
> Building an MCP server in Laravel means registering tool definitions — each with `name`, `description`, and `inputSchema` — and wiring two JSON-RPC 2.0 endpoints. The transport you choose (SSE for remote, STDIO for local processes) determines how clients connect. Once deployed, Claude can discover and call your tools the same way it calls any other MCP server.
