---
n: 7
id: api-documentation
title: "API documentation with OpenAPI / Swagger"
hook: "A production-ready API tells consumers exactly what it expects — Swagger makes that contract machine-readable."
tags: [swagger, OpenAPI, documentation, JSON]
module: "API Security"
source: "Slide 11"
bloom_levels: [understand, apply]
related: [rest-anatomy, restful-url-design, express-framework]
---

## The problem: guessing games are not a production strategy

You built a RESTful API that works. Now someone else needs to consume it. Without documentation, they must guess which endpoints exist, what parameters each one accepts, and what the response looks like. That guessing slows them down and breaks integrations when your assumptions differ from theirs.

API documentation solves this by publishing a formal contract: here are the endpoints, here are the expected inputs, here are the possible outputs.

## What OpenAPI / Swagger is

OpenAPI / Swagger is an **Interface Description Language** for describing RESTful APIs expressed using JSON (or YAML). It produces a machine-readable specification file — typically named `swagger.json` — that documents the full surface of your API.

Tools can read that file to auto-generate interactive documentation, client SDKs, and test harnesses. The specification is not prose; it is structured data that both humans and programs can parse.

A `swagger.json` file documents:

- **Endpoints** — every path (`/patients`, `/users/:id`) and its supported HTTP methods
- **Request parameters** — path params, query params, and headers
- **Request body schemas** — the shape of JSON payloads sent to the API
- **Response schemas and status codes** — what the API returns for each outcome
- **Authentication requirements** — which endpoints require a token or API key

## Workflow: from sample to your own spec

**Step 1 — Get a starter file.** Go to [editor.swagger.io](https://editor.swagger.io/). Use File > Convert and Save as JSON. You now have a working `swagger.json` you can open and inspect.

**Step 2 — Install the VS Code extension.** Install the [Swagger Viewer extension](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer) in VS Code.

**Step 3 — Open and preview.** Open your `swagger.json` in VS Code and run **Preview Swagger** (Shift + Alt + P). VS Code renders the interactive documentation panel directly.

**Step 4 — Customize.** Modify the `paths` section to match your project's actual endpoints, parameters, and response shapes.

## What a path object looks like

The `paths` key maps each endpoint URL to an object describing its HTTP methods:

```json
{
  "/patients": {
    "get": {
      "summary": "Get all patients",
      "responses": {
        "200": { "description": "List of patients" }
      }
    }
  }
}
```

Each HTTP method block can also include `parameters` (for query/path params) and `requestBody` (for POST/PUT payloads). The structure is hierarchical and consistent across all endpoints.

## Retrieval checkpoint

> **Q:** What does a `swagger.json` file describe about an API endpoint?
>
> **A:** The path, the supported HTTP method(s), any request parameters or body schema, the possible response status codes and their schemas, and any authentication requirements.

**Takeaway:** OpenAPI / Swagger turns your API's implicit contract into an explicit, machine-readable `swagger.json`. Start from the editor.swagger.io sample, customize the `paths` block to match your project, and preview the result in VS Code with the Swagger Viewer extension.
