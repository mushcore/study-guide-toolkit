---
n: 6
id: resource-controller-routes
title: "Resource controller and routes"
lang: php
tags: [laravel, routing, controllers]
source: "laravel_with_sqlite_API_SCRIPT.docx"
pedagogy: worked-example-first
---

## Prompt

You have a `Student` model and a `StudentsController` in `app/Http/Controllers/api/`. Wire up a full REST API for students using a resource route in `routes/api.php`. The API must:

1. Register all five API endpoints (index, store, show, update, destroy) with one `Route::apiResource()` call.
2. Implement `index()` to return all students.
3. Implement `store()` with validation for `FirstName`, `LastName`, and `School`, and return the created student with HTTP 201.
4. Handle a missing student in `show()` by returning a JSON 404 response.

## Starter

```php
<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\StudentsController;

// TODO: register the resource route here


// app/Http/Controllers/api/StudentsController.php
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
        // TODO: create and return the student with HTTP 201
    }

    public function show($id)
    {
        // TODO: find student or return JSON 404
    }

    public function update(Request $request, $id)
    {
        // (leave empty for this exercise)
    }

    public function destroy($id)
    {
        // (leave empty for this exercise)
    }
}
```

## Solution

```php
<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\StudentsController;

Route::apiResource('students', StudentsController::class);


// app/Http/Controllers/api/StudentsController.php
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

    public function update(Request $request, $id) {}
    public function destroy($id) {}
}
```

## Why

`Route::apiResource('students', StudentsController::class)` replaces five individual `Route::get/post/put/delete` declarations with one line. Laravel binds HTTP verbs to controller methods by name convention: GET /api/students calls `index()`, POST /api/students calls `store()`, GET /api/students/{id} calls `show()`, and so on.

`response()->json($student, 201)` in `store()` explicitly sets HTTP status 201 Created — the correct status for a successful resource creation. Returning a bare model (`return $student`) implicitly sends 200, which is technically wrong for a POST that creates a resource.

`Student::find($id)` returns `null` when no row matches. Checking `if (!$student)` before returning lets you send a structured JSON error instead of a 500 server error or an empty response.

**Common wrong approaches:**

- **Using five individual Route::get/post/put/delete declarations instead of Route::apiResource().** This works but is verbose and error-prone. If you rename the controller, you must update every line. Resource routing updates automatically.
- **Using Route::resource() instead of Route::apiResource() in routes/api.php.** `Route::resource()` also registers `create` and `edit` routes (for HTML forms). In a JSON API these routes are useless — they match GET /api/students/create and GET /api/students/{id}/edit, which will confuse API clients.
- **Forgetting $fillable on the Student model.** `Student::create([...])` throws a `MassAssignmentException` if `$fillable` does not list the fields you are assigning. Add `protected $fillable = ['FirstName', 'LastName', 'School'];` to the `Student` model.
- **Forgetting php artisan route:clear after adding or changing routes.** A stale route cache causes 404s or serves the old route table regardless of what is in `routes/api.php`.
