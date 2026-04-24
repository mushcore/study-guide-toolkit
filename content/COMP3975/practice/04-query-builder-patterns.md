---
n: 4
id: query-builder-patterns
title: "Query Builder — filtering and ordering"
lang: php
tags: [laravel, query-builder]
source: "TIDBITS-components_config_db_SCRIPT.docx"
pedagogy: worked-example-first
kind: code
---

## Prompt

Using the Query Builder facade, query the `students` table. Select the `FirstName`, `LastName`, and `School` columns. Exclude rows where `School` is NULL. Sort results by `FirstName` ascending. Return the collection.

The `DB` facade is already imported. Do not use Eloquent or raw SQL.

## Starter

```php
use Illuminate\Support\Facades\DB;

public function qbuilder() {
    $students = DB::table('students')
        // your chain here
        ;

    dd($students);
}
```

## Solution

```php
use Illuminate\Support\Facades\DB;

public function qbuilder() {
    $students = DB::table('students')
        ->select(['FirstName', 'LastName', 'School'])
        ->whereNotNull('School')
        ->orderBy('FirstName')
        ->get();

    dd($students);
}
```

## Why

`DB::table('students')` opens the Query Builder on the `students` table. `->select([...])` restricts which columns are fetched — passing an array of column names. `->whereNotNull('School')` adds `WHERE School IS NOT NULL`. `->orderBy('FirstName')` adds `ORDER BY FirstName ASC`. `->get()` is the terminal method that fires the query and returns a collection of `stdClass` objects.

**Wrong approach 1 — reaching for raw SQL instead:**
```php
// Avoid this for a query Query Builder handles cleanly
$students = DB::select(
    'SELECT FirstName, LastName, School FROM students WHERE School IS NOT NULL ORDER BY FirstName'
);
```
Raw SQL works here, but adding a second filter or renaming a column now requires rewriting the entire SQL string. The Query Builder chain is easier to change safely and is equally correct.

**Wrong approach 2 — forgetting `->get()` at the end of the chain:**
```php
// This returns a Builder object, not results
$students = DB::table('students')
    ->select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->orderBy('FirstName');
// dd($students) prints a Builder object — no rows

// Fix: add ->get()
$students = DB::table('students')
    ->select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->orderBy('FirstName')
    ->get();
```
Every method before `->get()` returns the builder itself (for chaining). The query is not sent to the database until you call `->get()`. Omitting it is the single most common Query Builder mistake.
