---
n: 13
id: azure-function-http
title: "HTTP-triggered Azure Function — query-string greeting"
lang: typescript
tags: [azure, serverless, typescript, http-trigger]
source: "ts-function-apps.pptx slide 7; static-web-apps-SCRIPT.docx"
pedagogy: worked-example-first
---

## Prompt

Write a minimal HTTP-triggered Azure Function in TypeScript. The function reads a `name` parameter from the query string. It returns a JSON response `{ "message": "Hello, <name>!" }` with HTTP 200. If `name` is absent, use `"World"` as the default.

Use the typed imports `AzureFunction`, `Context`, and `HttpRequest` from `@azure/functions`.

## Starter

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest) => {
  // TODO: read 'name' from req.query
  // TODO: set context.res with status 200, JSON body, and Content-Type header
};

export default httpTrigger;
```

## Solution

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest) => {
  const name = req.query.name || "World";

  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Hello, ${name}!` }),
  };
};

export default httpTrigger;
```

## Why

`req.query.name` is typed as `string | undefined` by `HttpRequest`. The `|| "World"` fallback handles the undefined case without a separate null check.

`context.res` is the output binding declared in `function.json` with `"direction": "out"` and `"type": "http"`. Assigning to it is the correct output pattern — do not `return` a value from the function body (that is a common wrong approach that silently does nothing in the v3/v4 runtime without proper config).

Setting `"Content-Type": "application/json"` explicitly prevents Azure from defaulting to `text/plain`, which causes consumers to receive the JSON as a string rather than a parsed object.

Two frequent wrong approaches:
- Using `return { body: ... }` without assigning `context.res` — works only in newer runtime variants and is not the pattern shown in slides.
- Omitting the `Content-Type` header — the response arrives as plain text, breaking JSON consumers.
