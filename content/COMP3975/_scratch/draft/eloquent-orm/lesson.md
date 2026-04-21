---
n: 1
id: eloquent-orm
title: "Eloquent ORM — querying and persisting data"
hook: "One method call fetches every row. Another persists a new one. Here is how Eloquent makes database work feel like PHP."
tags: [eloquent, orm, laravel, database, crud]
module: "Laravel Database"
priority: high
source: "laravel_with_students_MySQL_SCRIPT.docx; laravel_with_sqlite_API_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [model-relationships, migrations-and-seeders, query-builder-and-raw-sql]
pedagogy: concreteness-fading
---

## A concrete starting point

You have a `students` table in your database. You want every row as a PHP object.

```php
$students = Student::all();
```

That one line returns an Eloquent Collection — a PHP array-like object where each element is a `Student` model instance with properties like `$student->FirstName` and `$student->School`.

This is Eloquent ORM. You work with PHP objects. Eloquent translates your method calls into SQL behind the scenes.

> **Q:** What does `Student::all()` return — a plain PHP array or an Eloquent Collection?
> **A:** An Eloquent Collection. Each element is a `Student` model instance, not a raw array. You access columns as object properties, e.g. `$student->FirstName`.

---

## What Eloquent ORM is

Eloquent ORM is Laravel's object-relational mapper. It maps each database table to a PHP class called a **model**. Laravel follows a naming convention: a `Student` model maps to the `students` table by default.

You create the model with Artisan:

```bash
php artisan make:model Student -m
```

The `-m` flag generates a migration alongside the model. The model file lives in `app/Models/Student.php`.

The default `Student.php` looks like this:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    //
}
```

That empty class already inherits `all()`, `find()`, `findOrFail()`, `create()`, `save()`, `update()`, and `delete()` from the `Model` base class.

---

## Reading data

### Fetch all rows

```php
$students = Student::all();
```

Use this when you need every row. For large tables, use `paginate()` instead.

### Fetch one row by primary key

```php
$student = Student::find($id);
```

`find()` returns `null` if the record does not exist. Use `findOrFail()` when a missing record should produce a 404:

```php
$student = Student::findOrFail($id);
```

`findOrFail()` throws a `ModelNotFoundException`, which Laravel automatically converts to a 404 HTTP response.

### Filtered queries

Eloquent queries chain builder methods just like Query Builder, but you call them on the model class:

```php
$students = Student::select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->where('FirstName', 'LIKE', 'A%')
    ->orderBy('FirstName')
    ->get();
```

Note the `->get()` at the end. Builder chains require `->get()` to execute and return results. `Student::all()` is a shorthand that does not accept chained constraints — it always fetches all rows.

> **Pitfall:** `Student::all()->where(...)` does NOT filter at the database level. `all()` fetches every row into memory first, then `where()` filters in PHP. For any filtered query, start with `Student::where(...)` and end with `->get()`.

---

## Writing data

### Insert a new record (property-by-property)

```php
$student = new Student();
$student->FirstName = 'Jane';
$student->LastName = 'Bond';
$student->School = 'International Espionage';
$student->save();
```

You instantiate the model, assign properties, then call `save()`. Laravel builds and executes an `INSERT` statement.

### Insert with mass assignment

```php
Student::create([
    'FirstName' => request('FirstName'),
    'LastName'  => request('LastName'),
    'School'    => request('School'),
]);
```

`create()` is a one-call shorthand. It accepts an associative array and inserts in one step.

**Mass assignment requires `$fillable`.** Before `create()` will work, you must declare which fields are allowed:

```php
protected $fillable = [
    'FirstName',
    'LastName',
    'School',
];
```

> **Pitfall:** Calling `Student::create($request->all())` without `$fillable` throws a `MassAssignmentException`. Laravel blocks mass assignment by default to prevent attackers from setting fields like `is_admin` via a crafted POST body. The `$fillable` array is your whitelist — list only the fields users are permitted to set.

### Update a record

```php
$student = Student::findOrFail($id);
$student->FirstName = $request->get('FirstName');
$student->LastName  = $request->get('LastName');
$student->School    = $request->get('School');
$student->save();
```

Alternatively, use the `update()` method with an array (also requires `$fillable`):

```php
$student->update([
    'FirstName' => request('FirstName'),
    'LastName'  => request('LastName'),
    'School'    => request('School'),
]);
```

### Delete a record

```php
$student = Student::find($id);
$student->delete();
```

---

## Validation before writing

Always validate user input before persisting it:

```php
$request->validate([
    'FirstName' => 'required',
    'LastName'  => 'required',
    'School'    => 'required',
]);
```

Laravel returns validation errors automatically. Invalid requests never reach `create()` or `save()`.

---

## Eloquent vs Query Builder vs raw SQL

The professor's explicit preference hierarchy places Eloquent first:

| Pattern | Syntax | When to use |
|---|---|---|
| Eloquent ORM | `Student::all()` / `Student::create()` | Default — clean, testable, model-level |
| Query Builder | `DB::table('students')->select()->get()` | Complex queries Eloquent cannot express cleanly |
| Raw SQL | `DB::select('SELECT * FROM students')` | Last resort — vendor-specific SQL, performance tuning |

> **Q:** Your controller needs students whose `School` is not null, sorted by `FirstName`. Which Eloquent chain do you write?
> **A:** `Student::whereNotNull('School')->orderBy('FirstName')->get()` — chain builder methods on the model class and terminate with `->get()`.

---

> **Takeaway:** Eloquent ORM maps your PHP model to a database table. You read with `all()`, `find()`, `findOrFail()`, and builder chains ending in `->get()`. You write with property assignment plus `save()`, or with `create()` backed by a `$fillable` array. The `$fillable` whitelist is not optional — it is the guard between user input and your database schema.
