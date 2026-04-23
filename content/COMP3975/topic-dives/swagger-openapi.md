---
id: swagger-openapi
title: "Swagger and OpenAPI — l5-swagger reference"
pillar: tech
priority: high
tags: [swagger, openapi, l5-swagger, api-documentation, laravel]
source: "swagger-with-laravel.pptx; Laravel_L5Swagger_SCRIPT_2026.docx"
bloom_levels: [remember, understand, apply]
related: [rest-api-design, artisan-composer, swagger-openapi]
---

## Concrete starting point

A working `@OA\Info` + `@OA\Get` pair — the minimum needed to get Swagger UI to display one documented endpoint:

```php
// app/Http/Controllers/Controller.php
use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Laravel Students API",
    version: "1.0.0",
    description: "API for managing students",
    contact: new OA\Contact(email: "admin@example.com")
)]
abstract class Controller {}
```

```php
// app/Http/Controllers/api/StudentsController.php
#[OA\Get(
    path: "/api/students",
    tags: ["Students"],
    summary: "Get all students",
    responses: [
        new OA\Response(
            response: 200,
            description: "List of all students",
            content: new OA\JsonContent(
                type: "array",
                items: new OA\Items(ref: "#/components/schemas/Student")
            )
        )
    ]
)]
public function index(): JsonResponse
{
    return response()->json(Student::all());
}
```

---

## OpenAPI vs Swagger

| Term | What it is | Example |
|------|-----------|---------|
| **OpenAPI** | The specification language — a YAML/JSON contract describing REST API paths, parameters, and schemas | The JSON file compiled by `php artisan l5-swagger:generate` |
| **Swagger** | The toolset that reads an OpenAPI spec | Swagger UI (browser docs), Swagger Editor (write/validate), Swagger Codegen (generate SDKs) |

Never use "Swagger" to mean the spec. The spec is OpenAPI.

---

## Setup sequence

```bash
# 1. Install
composer require darkaonline/l5-swagger -W

# 2. Publish config
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"

# 3. Add @OA\Info to Controller.php, @OA\Get/Post/... to each method

# 4. Generate
php artisan l5-swagger:generate

# 5. Visit
# http://localhost:8888/api/documentation
```

---

> **Example:** Documenting a single endpoint from scratch
>
> **Step 1 — Add `#[OA\Info]` to the abstract base `Controller`.**
> Open `app/Http/Controllers/Controller.php` and add `#[OA\Info(title: "Students API", version: "1.0.0")]` above the class declaration. One `@OA\Info` per project is required; without it, `l5-swagger:generate` produces an invalid document.
>
> **Step 2 — Add an operation annotation to the endpoint method.**
> Above `StudentsController::index()`, add `#[OA\Get(path: "/api/students", tags: ["Students"], summary: "List all students", responses: [new OA\Response(response: 200, description: "OK")])]`.
>
> **Step 3 — Generate the OpenAPI document.**
> Run `php artisan l5-swagger:generate`. This scans all `@OA\` annotations and writes `storage/api-docs/api-docs.json`.
>
> **Step 4 — Verify in the browser.**
> Visit `http://localhost:8888/api/documentation`. The "Students" tag should appear with a GET `/api/students` entry. If the UI is stale, confirm `L5_SWAGGER_GENERATE_ALWAYS=true` is set in `.env`.

---

## Annotation type reference

| Annotation | Where | Purpose |
|---|---|---|
| `@OA\Info` | Abstract base `Controller` class | Global API metadata (title, version). Required — one per project. |
| `@OA\Get` | Above `index()` / `show()` | Documents a GET endpoint. |
| `@OA\Post` | Above `store()` | Documents a POST endpoint. |
| `@OA\Put` | Above `update()` | Documents a PUT endpoint. |
| `@OA\Delete` | Above `destroy()` | Documents a DELETE endpoint. |
| `@OA\Parameter` | Inside `@OA\Get` / `@OA\Put` / `@OA\Delete` | Documents a path or query parameter. |
| `@OA\RequestBody` | Inside `@OA\Post` / `@OA\Put` | Documents the JSON request body. |
| `@OA\Response` | Inside any verb annotation | Documents a single HTTP response code and its shape. |
| `@OA\Schema` | Above controller class or method | Defines a reusable data model referenced via `#/components/schemas/Name`. |

---

## @OA\Info required fields

The OpenAPI specification requires `title` and `version`. Both must be present or `php artisan l5-swagger:generate` produces an invalid document.

```php
#[OA\Info(
    title: "My API",     // required
    version: "1.0.0"    // required
)]
```

`description` and `contact` are optional but conventional in course examples.

---

## @OA\Parameter — path vs query

```php
// Path parameter: /api/students/{id}
new OA\Parameter(
    name: "id",
    in: "path",       // "path" | "query" | "header" | "cookie"
    required: true,
    description: "Student ID",
    schema: new OA\Schema(type: "integer")
)

// Query parameter: /api/students?school=BCIT
new OA\Parameter(
    name: "school",
    in: "query",
    required: false,
    schema: new OA\Schema(type: "string")
)
```

---

## @OA\Schema for reusable models

```php
#[OA\Schema(
    schema: "Student",
    properties: [
        new OA\Property(property: "id",        type: "integer", example: 1),
        new OA\Property(property: "FirstName", type: "string",  example: "John"),
        new OA\Property(property: "LastName",  type: "string",  example: "Doe"),
    ]
)]
```

Reference it in any response or request body with `ref: "#/components/schemas/Student"`.

---

## .env and config options

| Setting | File | Effect |
|---|---|---|
| `L5_SWAGGER_GENERATE_ALWAYS=true` | `.env` | Auto-regenerates docs on every request. Development only. |
| `'title' => 'My API'` | `config/l5-swagger.php` | Sets the title shown in Swagger UI. |

Redirect `/` to `/api/documentation` in `routes/web.php`:

```php
Route::get('/', function () {
    return redirect('/api/documentation');
});
```

---

> **Pitfall**
> Every change to a `@OA\ annotation` requires re-running `php artisan l5-swagger:generate` before Swagger UI reflects it. Forgetting this step is the most common source of "my docs are out of date" errors. Set `L5_SWAGGER_GENERATE_ALWAYS=true` in `.env` during development to avoid this.

---

> **Q:** What is the difference between `@OA\Response` and `@OA\Schema`?
> **A:** `@OA\Response` documents a single HTTP response (status code + description) inside an endpoint annotation. `@OA\Schema` defines a reusable data model that multiple responses can reference via `#/components/schemas/Name`.

---

> **Takeaway**
> The l5-swagger workflow has three moving parts: `@OA\ annotations` in PHP files are the authoring source; `php artisan l5-swagger:generate` is the required compile step; `/api/documentation` is the rendered output. OpenAPI is the contract language; Swagger is the toolset that reads it.
