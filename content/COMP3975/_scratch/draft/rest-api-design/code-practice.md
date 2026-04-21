---
n: 7
id: rest-api-crud-controller
title: "Complete store() for a REST API resource controller"
lang: php
tags: [rest, api, laravel, resource-controller, validation, json]
source: "laravel_with_sqlite_API_SCRIPT.docx"
pedagogy: worked-example-first
---

## Prompt

You are building a REST API for a `Student` resource. The `Student` model already has `$fillable = ['FirstName', 'LastName', 'School']`.

Complete the `store()` method in `StudentsController` so that it:

1. Validates that `FirstName`, `LastName`, and `School` are all present in the request body.
2. Creates a new `Student` record using mass assignment.
3. Returns the created student as JSON with HTTP status 201.

## Starter

```php
<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentsController extends Controller
{
    public function store(Request $request)
    {
        // TODO: validate that FirstName, LastName, School are required

        // TODO: create the Student record

        // TODO: return JSON response with status 201
    }
}
```

## Solution

```php
<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'FirstName' => 'required',
            'LastName'  => 'required',
            'School'    => 'required',
        ]);

        $student = Student::create([
            'FirstName' => request('FirstName'),
            'LastName'  => request('LastName'),
            'School'    => request('School'),
        ]);

        return response()->json($student, 201);
    }
}
```

## Why

**Why validate before create?** `$request->validate()` must come before `Student::create()`. If any rule fails, Laravel returns a 422 response immediately and execution stops — the database is never touched. Placing `create()` first means invalid data hits the database before the error is caught.

**Why 201, not 200?** `response()->json($student, 201)` sends HTTP 201 Created. Returning the default 200 is semantically wrong for a POST endpoint that creates a new resource. API clients and test suites check status codes; returning 200 fails REST conventions and may break downstream consumers.

**Why not just `return Student::create([...])`?** Returning an Eloquent model directly works in some Laravel versions, but it gives no control over the status code. The `response()->json()` wrapper sets the status code explicitly and ensures the Content-Type header is `application/json` regardless of the request's Accept header.

**Why not skip `$fillable` and just add the fields manually?** If `$fillable` is missing, `Student::create()` throws a `MassAssignmentException` at runtime — the field-by-field assignment in `create([...])` still uses mass assignment under the hood. The guard lives in the model, not in the controller call. You cannot bypass it by listing fields explicitly in the array.
