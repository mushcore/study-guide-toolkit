---
id: eloquent-orm
title: "Eloquent ORM — reference"
pillar: tech
priority: high
tags: [eloquent, orm, laravel, database, crud]
source: "laravel_with_students_MySQL_SCRIPT.docx; TIDBITS-components_config_db_SCRIPT.docx"
bloom_levels: [understand, apply, analyze]
related: [model-relationships, migrations-and-seeders, query-builder-and-raw-sql]
---

## Concrete opening: Student CRUD in six steps

> **Example**
>
> **Step 1 — Generate model + migration.**
>
> ```bash
> php artisan make:model Student -m
> ```
>
> This creates `app/Models/Student.php` and a timestamped migration file in `database/migrations/`.
>
> **Step 2 — Define `$fillable` in the model.**
>
> ```php
> protected $fillable = ['FirstName', 'LastName', 'School'];
> ```
>
> Without this array, any call to `Student::create()` or `$student->update()` throws a `MassAssignmentException`.
>
> **Step 3 — Read all rows.**
>
> ```php
> $students = Student::all();
> ```
>
> Returns an Eloquent Collection. Each element is a `Student` instance with column values as properties.
>
> **Step 4 — Read one row by id.**
>
> ```php
> $student = Student::findOrFail($id);  // 404 if not found
> ```
>
> **Step 5 — Create a new record.**
>
> ```php
> Student::create([
>     'FirstName' => request('FirstName'),
>     'LastName'  => request('LastName'),
>     'School'    => request('School'),
> ]);
> ```
>
> **Step 6 — Update, then delete.**
>
> ```php
> $student->update(['FirstName' => 'Tom', 'School' => 'Mining']);
> $student->delete();
> ```

---

## Model conventions

| Convention | Rule | Example |
|---|---|---|
| Table name | Plural snake_case of the class name | `Student` → `students` |
| Primary key | `id` (auto-increment) by default | Override with `protected $primaryKey = 'sid'` |
| Timestamps | `created_at` / `updated_at` auto-managed | Disable with `public $timestamps = false` |
| Model location | `app/Models/` | `app/Models/Student.php` |

---

## Read methods

| Method | Returns | Notes |
|---|---|---|
| `Student::all()` | Collection of all rows | No constraints possible after `all()` |
| `Student::find($id)` | Model or `null` | Returns `null` if not found |
| `Student::findOrFail($id)` | Model or 404 | Throws `ModelNotFoundException` → HTTP 404 |
| `Student::where(...)->get()` | Filtered Collection | Terminate builder chains with `->get()` |
| `Student::latest()->paginate(5)` | Paginator | Ordered by `created_at` DESC, 5 per page |

---

## Filtered query builder pattern

```php
$students = Student::select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->where('FirstName', 'LIKE', 'A%')
    ->orderBy('FirstName')
    ->get();
```

Every builder chain ends with `->get()` to execute and return results.

---

## Write methods

| Method | Description | Requires `$fillable` |
|---|---|---|
| `new Student(); $s->prop = val; $s->save()` | Property-by-property insert | No |
| `Student::create([...])` | One-call insert with array | Yes |
| `$student->FirstName = 'x'; $student->save()` | Property-by-property update | No |
| `$student->update([...])` | One-call update with array | Yes |
| `$student->delete()` | Delete the record | No |

---

## `$fillable` — mass assignment protection

```php
protected $fillable = ['FirstName', 'LastName', 'School'];
```

The `$fillable` array is a whitelist. Only the listed columns may be set through `create()` or `update()`. Columns absent from `$fillable` are silently ignored — they cannot be set by a user-supplied array. This blocks attacks where a crafted POST body sets fields like `is_admin`.

Never use `$guarded = []` to disable protection entirely. Use `$fillable` exclusively.

---

## Validation pattern

```php
$request->validate([
    'FirstName' => 'required',
    'LastName'  => 'required',
    'School'    => 'required',
]);
```

Always validate before calling `create()` or `save()`. Laravel returns a 422 with error messages automatically on failure.

---

## Data access hierarchy (professor's preference order)

1. **Eloquent ORM** — preferred. Model-level, readable, relationship-aware.
2. **Query Builder** — `DB::table('students')->select()->where()->get()`. Use for complex joins.
3. **Raw SQL** — `DB::select('SELECT * FROM students')`. Last resort.

---

## Tinker — interactive model testing

```bash
php artisan tinker
```

Inside tinker, run any Eloquent command interactively:

```php
\App\Models\Student::all();
$s = new \App\Models\Student();
$s->FirstName = 'Ann';
$s->save();
```

Use tinker to verify model behavior without building a full controller.

---

> **Pitfall:** `Student::all()->where(...)` does not filter at the SQL level. `all()` loads every row into PHP memory, and the chained `where()` is a Collection method that filters in PHP. For any server-side filter, use `Student::where(...)->get()` so the database does the work.

---

> **Takeaway:** Eloquent ORM reduces CRUD to named PHP methods backed by the `Model` base class. The three rules that cause the most exam mistakes are: (1) `all()` cannot be constrained — use `where()->get()` instead; (2) `create()` and `update()` require `$fillable`; (3) `findOrFail()` is the correct way to trigger a 404 on a missing record.
