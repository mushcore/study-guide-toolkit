---
id: query-builder-and-raw-sql
title: "Query Builder and raw SQL — reference"
pillar: tech
priority: mid
tags: [laravel, query-builder, raw-sql, database]
source: "TIDBITS-components_config_db_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [eloquent-orm]
---

## Three data-access patterns — at a glance

The professor's preference hierarchy: Eloquent ORM first, Query Builder second, raw SQL third.

| Pattern | Entry point | Returns | Requires model? |
|---|---|---|---|
| Eloquent ORM | `Student::all()` | Typed model instances | Yes |
| Query Builder | `DB::table('students')` | `stdClass` objects | No |
| Raw SQL | `DB::select('SELECT ...')` | `stdClass` objects | No |

---

## Query Builder — method reference

| Method | Purpose | Example |
|---|---|---|
| `DB::table('t')` | Start a query on table `t` | `DB::table('students')` |
| `->select([...])` | Restrict columns | `->select(['FirstName','LastName','School'])` |
| `->whereNotNull('col')` | Filter rows where col IS NOT NULL | `->whereNotNull('School')` |
| `->where('col', 'op', 'val')` | Add WHERE clause | `->where('FirstName', 'LIKE', 'A%')` |
| `->orderBy('col')` | Sort ascending | `->orderBy('FirstName')` |
| `->get()` | Execute and return collection | (terminal method — required) |

All methods except `->get()` return the builder itself, so they chain. `->get()` is terminal — call it last to fire the query.

---

## Example

> **Example**
>
> Fetch students who have a school, sorted by first name — first in Query Builder, then as equivalent raw SQL.
>
> **Query Builder:**
> ```php
> use Illuminate\Support\Facades\DB;
>
> $students = DB::table('students')
>     ->select(['FirstName', 'LastName', 'School'])
>     ->whereNotNull('School')
>     ->orderBy('FirstName')
>     ->get();
> ```
>
> **Raw SQL equivalent:**
> ```php
> $students = DB::select(
>     'SELECT FirstName, LastName, School FROM students WHERE School IS NOT NULL ORDER BY FirstName'
> );
> ```
>
> Both return an array of `stdClass` objects. The Query Builder version is shorter to change (rename a column → one method argument; add a filter → one chained call). The raw SQL version requires you to rewrite the entire string.

---

## Parameterised raw SQL

Pass user-supplied values as positional bindings — never concatenate them into the string.

```php
// Safe: PDO replaces ? with the bound value
$students = DB::select(
    'SELECT * FROM students WHERE School = ?',
    ['Mining']
);

// Unsafe — never do this:
// $students = DB::select("SELECT * FROM students WHERE School = '$school'");
```

---

## Debugging — query log

```php
DB::enableQueryLog();

$students = DB::table('students')
    ->select(['FirstName', 'LastName', 'School'])
    ->whereNotNull('School')
    ->orderBy('FirstName')
    ->get();

print_r(DB::getQueryLog());
```

`DB::getQueryLog()` returns the SQL string and bound values. Use it to verify that the query Laravel sends matches what you intended.

---

## Pitfall

> **Pitfall**
> Two common mistakes with Query Builder:
>
> 1. **Forgetting `->get()`** — omitting the terminal call returns a `Illuminate\Database\Query\Builder` object, not results. Your loop over `$students` gets nothing. Always end the chain with `->get()`.
>
> 2. **Reaching for raw SQL when Query Builder handles it** — `DB::select('SELECT * FROM students WHERE School IS NOT NULL ORDER BY FirstName')` looks straightforward until you need to add a second filter or change a column name. The Query Builder equivalent is easier to modify and equally safe. Reserve raw SQL for queries that involve SQL constructs the fluent API cannot express.

---

> **Takeaway**
> Query Builder chains `DB::table()->select()->where()->orderBy()->get()` to produce safe, readable queries without a model class. Use it when Eloquent is unavailable or overkill. Always use parameterised bindings (`?` placeholders) with `DB::select()` — string concatenation with user input is a SQL injection vulnerability.
