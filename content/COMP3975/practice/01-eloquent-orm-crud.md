---
n: 1
id: eloquent-orm-crud
title: "Eloquent ORM — CRUD operations"
lang: php
tags: [eloquent, crud, laravel]
source: "laravel_with_sqlite_API_SCRIPT.docx"
pedagogy: worked-example-first
kind: code
---

## Prompt

A `Student` model maps to a `students` table with columns `id`, `FirstName`, `LastName`, `School`, `created_at`, and `updated_at`.

Implement an API controller's four core methods using Eloquent ORM:

1. `index()` — return all students.
2. `store(Request $request)` — validate the three required fields, then insert a new student and return it with HTTP 201.
3. `show($id)` — return the student or a JSON 404 message if not found.
4. `destroy($id)` — delete the student or return a JSON 404 message if not found.

The `Student` model already has `$fillable` defined for the three fields.

## Starter

```php
<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentsController extends Controller
{
    public function index()
    {
        // TODO: return all students
    }

    public function store(Request $request)
    {
        // TODO: validate FirstName, LastName, School (all required)
        // TODO: create and return student with HTTP 201
    }

    public function show($id)
    {
        // TODO: find student; return JSON 404 message if not found
    }

    public function destroy($id)
    {
        // TODO: find student; return JSON 404 message if not found
        // TODO: delete and return success flag
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
    public function index()
    {
        return Student::all();
    }

    public function store(Request $request)
    {
        request()->validate([
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

    public function show($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        return response()->json($student);
    }

    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $isSuccess = $student->delete();

        return response()->json(['success' => $isSuccess]);
    }
}
```

## Why

`Student::all()` returns every row as an Eloquent Collection. Laravel automatically serializes it to JSON when returned from a controller, so `index()` needs no extra wrapping.

`Student::create()` requires the `$fillable` array on the model. Without it, Laravel throws a `MassAssignmentException` even when your fields look safe — the protection is unconditional. The `store()` method validates first so invalid input never reaches `create()`.

`show()` and `destroy()` use `Student::find($id)` rather than `findOrFail()` because an API endpoint should return a JSON error body, not Laravel's HTML 404 page. `findOrFail()` is the correct choice for web controllers where Laravel's exception-to-HTML mapping is acceptable; for JSON APIs, check for `null` manually and return `response()->json(['message' => '...'], 404)`.

Two common wrong approaches: (1) using `Student::all()` in `index()` and then chaining `->where()` — `all()` loads the full table into PHP memory before any filter runs; (2) forgetting `$fillable` and wondering why `create()` silently fails or throws — the model must declare the whitelist before mass assignment works.
