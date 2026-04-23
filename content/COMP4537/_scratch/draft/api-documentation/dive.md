---
id: api-documentation
title: "OpenAPI / Swagger — API specification format"
pillar: tech
priority: low
source: "Slide 11"
bloom_levels: [understand, apply]
related: [rest-anatomy, restful-url-design]
---

## Why documentation belongs in the codebase

A RESTful API ships with behaviour baked in but contract implicit. Consumers who hit an undocumented endpoint must inspect source code or fire trial requests to learn the parameter names, required fields, and error codes. OpenAPI / Swagger solves this by encoding that contract as a structured file alongside the code.

## What OpenAPI / Swagger documents

OpenAPI / Swagger is an Interface Description Language that describes a REST API in JSON or YAML. A single `swagger.json` captures:

| Concern | What is recorded |
|---|---|
| Endpoints | Path strings and their supported HTTP methods |
| Parameters | Path params, query params, and headers (name, type, required) |
| Request body schemas | Shape and field types of JSON payloads |
| Response schemas | Shape of each response body per status code |
| Status codes | Every possible code the endpoint returns |
| Authentication | Security scheme applied to each endpoint |

## Structure of a swagger.json file

A minimal `swagger.json` has three top-level keys:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Patient API",
    "version": "1.0.0"
  },
  "paths": {
    "/patients": { ... }
  }
}
```

- `openapi` — the OpenAPI specification version
- `info` — human-readable metadata (title, version, description)
- `paths` — the core of the file; maps each endpoint URL to its method definitions

All endpoint documentation lives under `paths`. Each path key maps to HTTP method keys (`get`, `post`, `put`, `delete`), and each method key holds the parameter list, request body, and response definitions.

## Workflow

1. Go to [editor.swagger.io](https://editor.swagger.io/) and use **File > Convert and Save as JSON** to download a working sample.
2. Open the file in VS Code.
3. Install the [Swagger Viewer extension](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer).
4. Press **Shift + Alt + P** (Preview Swagger) to see the rendered interactive documentation.
5. Edit the `paths` block to match your project's actual endpoints.

> **Example**
>
> Minimal `swagger.json` fragment for a single GET endpoint:
>
> ```json
> {
>   "openapi": "3.0.0",
>   "info": { "title": "Patient API", "version": "1.0.0" },
>   "paths": {
>     "/patients": {
>       "get": {
>         "summary": "Get all patients",
>         "responses": {
>           "200": { "description": "List of patients" }
>         }
>       }
>     }
>   }
> }
> ```
>
> This fragment is enough for Swagger UI to render a clickable, testable panel for the `GET /patients` endpoint.

**Takeaway:** A `swagger.json` file gives your API an explicit, machine-readable contract. Start from the editor.swagger.io sample to get valid structure, then replace the `paths` entries with your project's real endpoints. The Swagger Viewer extension in VS Code renders the result without leaving the editor.
