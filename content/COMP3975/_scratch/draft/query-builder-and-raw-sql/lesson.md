---
n: 4
id: query-builder-and-raw-sql
title: "Query Builder and raw SQL — when Eloquent is too much"
hook: "Learn how DB::table() gives you precise control without writing raw SQL strings."
tags: [laravel, query-builder, raw-sql, database]
module: "Laravel Database"
priority: mid
source: "TIDBITS-components_config_db_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [eloquent-orm, migrations-and-seeders]
pedagogy: concreteness-fading
---

## A concrete example: three ways to do the same thing

You need all students who have a school assigned, sorted by first name, selecting three columns. Here are all three patterns in the professor's preference order:

```php
// 1. Eloquent ORM — preferred
$students = Student::select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->orderBy('FirstName')
    ->get();

// 2. Query Builder — second choice
$students = DB::table('students')
    ->select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->orderBy('FirstName')
    ->get();

// 3. Raw SQL — least preferred
$students = DB::select('SELECT * FROM students');
```

Eloquent returns typed model instances. Query Builder returns plain `stdClass` objects. Raw SQL also returns `stdClass` objects but gives you no fluent methods — just a string you write and maintain yourself.

## What is Query Builder?

Query Builder sits between Eloquent and raw SQL. You call `DB::table('table_name')` and chain methods — `->select()`, `->where()`, `->whereNotNull()`, `->orderBy()`, `->get()`. Each method adds one clause to the query. You never write SQL text.

```php
use Illuminate\Support\Facades\DB;

$students = DB::table('students')
    ->select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->orderBy('FirstName')
    ->get();
```

You need the `DB` facade (`use Illuminate\Support\Facades\DB`) before calling `DB::table()`. Without the import, PHP throws a class-not-found error.

> **Q:** The code above chains `->whereNotNull('School')`. What does that clause do to the SQL query produced?
> **A:** It adds `WHERE School IS NOT NULL`, filtering out rows where the School column is NULL.

## What is raw SQL?

Raw SQL uses `DB::select()` with a plain SQL string. The call below fetches all rows from the `students` table:

```php
$students = DB::select('SELECT * FROM students');
```

You get back an array of `stdClass` objects. You can pass parameters to avoid SQL injection:

```php
$students = DB::select('SELECT * FROM students WHERE School = ?', ['Mining']);
```

The `?` placeholder is replaced safely by Laravel's PDO binding — never concatenate user input into the SQL string directly.

> **Pitfall**
> Raw SQL bypasses every Query Builder helper. You write column names as strings — a typo becomes a runtime error, not a compile-time error. You also lose Laravel's automatic parameter quoting when you concatenate variables. Use `DB::select()` only when you need a SQL feature that Query Builder cannot express (e.g., complex subqueries, database-specific functions). For standard CRUD, Query Builder handles it.

## When to use each pattern

The professor's preference hierarchy is explicit: Eloquent first, Query Builder second, raw SQL only when needed.

| Pattern | Use when |
|---|---|
| Eloquent ORM | You have a model and want typed return objects, relationships, or mass-assignment protection. |
| Query Builder | No model available, or the query is complex enough that Eloquent's API is awkward. |
| Raw SQL | You need SQL syntax that Query Builder cannot produce. |

> **Q:** You are writing a controller action that selects `FirstName`, `LastName`, `School` from `students`, filters out null schools, and sorts by `FirstName`. You do not need model instances. Which pattern does the professor prefer in this situation?
> **A:** Query Builder — `DB::table('students')->select([...])->whereNotNull('School')->orderBy('FirstName')->get()`. Eloquent would also be acceptable, but if there is no need for a typed model, Query Builder is the second-choice pattern explicitly demonstrated in the source material.

## Inspecting the actual SQL

When debugging a Query Builder or Eloquent chain, you can log the generated SQL:

```php
DB::enableQueryLog();

$students = DB::table('students')
    ->select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->orderBy('FirstName')
    ->get();

print_r(DB::getQueryLog());
```

`DB::enableQueryLog()` starts recording. `DB::getQueryLog()` returns an array of the SQL strings and bindings. This is your debug tool when a query returns unexpected results.

> **Takeaway**
> Query Builder is the middle layer in Laravel's three-tier data-access stack: more flexible than Eloquent when you have no model, far safer and more readable than raw SQL strings. Always reach for Eloquent first, then Query Builder, then `DB::select()` only when the first two cannot express your query. Call `->get()` at the end of every chain — omitting it returns a query object, not results.
