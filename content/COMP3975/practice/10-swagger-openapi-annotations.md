---
n: 10
id: swagger-openapi-annotations
title: "Write @OA\\Info and @OA\\Get annotations for a Laravel controller"
lang: php
tags: [swagger, openapi, l5-swagger, api-documentation, laravel]
source: "Laravel_L5Swagger_SCRIPT_2026.docx Steps 3 and 5"
pedagogy: worked-example-first
kind: code
---

## Prompt

You have a Laravel API with a `StudentsController` that has an `index()` method returning all students.

1. Add the `@OA\Info` block to `app/Http/Controllers/Controller.php`. Use title `"Students API"`, version `"1.0.0"`, and description `"Manages student records"`.
2. Add a `@OA\Get` annotation to the `index()` method in `StudentsController`. Document the successful 200 response with a JSON array of `Student` objects (reference `#/components/schemas/Student`).
3. Identify the artisan command needed to make Swagger UI reflect your changes.

## Starter

```php
<?php
// app/Http/Controllers/Controller.php

namespace App\Http\Controllers;

// TODO: add the OpenApi Attributes import

// TODO: add the @OA\Info annotation here
abstract class Controller
{
    //
}
```

```php
<?php
// app/Http/Controllers/api/StudentsController.php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class StudentsController extends Controller
{
    // TODO: add a @OA\Get annotation here
    //       path: /api/students
    //       tags: ["Students"]
    //       summary: "Get all students"
    //       responses: one OA\Response for HTTP 200 returning a JSON array of Student objects
    public function index(): JsonResponse
    {
        return response()->json(Student::all());
    }
}
```

## Solution

```php
<?php
// app/Http/Controllers/Controller.php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Students API",
    version: "1.0.0",
    description: "Manages student records"
)]
abstract class Controller
{
    //
}
```

```php
<?php
// app/Http/Controllers/api/StudentsController.php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class StudentsController extends Controller
{
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
}
```

After editing both files, regenerate the docs:

```bash
php artisan l5-swagger:generate
```

Then visit `/api/documentation` to see the rendered endpoint.

## Why

**Why `@OA\Info` goes on the base `Controller` class.**
The OpenAPI spec requires exactly one `@OA\Info` block per project. Placing it on the abstract base `Controller` is the convention because every API controller extends it, so the annotation is always reachable by the l5-swagger scanner. Putting it anywhere else (a random controller, a model) works technically but creates confusion about where global metadata lives.

**Why `php artisan l5-swagger:generate` is a required step.**
l5-swagger does not watch for annotation changes. It reads PHP files and produces an OpenAPI JSON artifact only when you explicitly run the generate command. Swagger UI reads that artifact, not your PHP source. Every edit to an annotation requires a regeneration. The common wrong approach is to edit annotations and refresh `/api/documentation` directly — the page shows the previously compiled JSON, not your new annotations.

**Why `-W` is needed for the install command.**
`composer require darkaonline/l5-swagger -W` uses the `--with-all-dependencies` flag to allow Composer to update transitive dependencies when resolving the package. Omitting `-W` on Laravel 11+ often produces a dependency conflict error and the package is not installed.
