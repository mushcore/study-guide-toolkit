---
id: model-relationships
title: "Eloquent relationships — reference"
pillar: tech
priority: high
tags: [eloquent, relationships, hasMany, belongsTo, laravel]
source: "auth-with-breeze_SQLite_SCRIPT.docx; laravel_with_students_MySQL_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [eloquent-orm, migrations-and-seeders]
---

## Relationship types covered

The Breeze org-registry script demonstrates the **one-to-many** relationship pattern using `hasMany()` and `belongsTo()`. This is the most exam-tested relationship type in COMP3975.

Other Eloquent relationship types (one-to-one, many-to-many, polymorphic) are listed in the script but not demonstrated with code.

## Migration prerequisite

The child table must declare the foreign key. Without it, all relationship queries return empty results silently.

```php
// In the orgs migration up() method
$table->foreignId('user_id')->constrained();
```

`foreignId('user_id')` creates an unsigned big integer. `constrained()` adds a foreign key constraint referencing the `users` table `id` column.

## Declaring hasMany (parent side)

```php
// app/Models/User.php
public function orgs() {
    return $this->hasMany(Org::class);
}
```

Eloquent infers the foreign key as `user_id` (parent model name lowercased + `_id`). You only need to pass a second argument when the column name differs from the convention.

## Declaring belongsTo (child side)

```php
// app/Models/Org.php
public function user() {
    return $this->belongsTo(User::class);
}
```

The method name is **singular** (`user`, not `users`). The method name determines how you access the related model: `$org->user`.

## Querying the relationship

Three equivalent patterns for fetching the current user's orgs:

```php
// Pattern 1 — manual WHERE (no relationship methods needed)
$orgs = Org::where('user_id', Auth::id())->latest('updated_at')->get();

// Pattern 2 — traverse via Auth facade + hasMany chain
$orgs = Auth::user()->orgs()->latest('updated_at')->get();

// Pattern 3 — whereBelongsTo() shorthand
$orgs = Org::whereBelongsTo(Auth::user())->latest('updated_at')->get();
```

Patterns 2 and 3 require the relationship methods to exist on the models.

> **Example**
> The `OrgController::index()` method from the Breeze script uses all three patterns in progression. The final (preferred) version uses Pattern 3:
>
> ```php
> public function index() {
>     $orgs = Org::whereBelongsTo(Auth::user())->latest('updated_at')->get();
>     return view("orgs.index", ['orgs' => $orgs]);
> }
> ```
>
> `whereBelongsTo(Auth::user())` reads as: "give me all Orgs whose `user_id` matches the currently authenticated user." It replaces the manual `where('user_id', Auth::id())` call and reads closer to English.

## Creating through the relationship

```php
Auth::user()->orgs()->create([
    'orgName'    => $request->orgName,
    'street'     => $request->street,
    // ... other fields
]);
```

`->create()` called on a relationship automatically sets the foreign key (`user_id`) to the parent model's primary key. You never write `'user_id' => Auth::id()` manually.

The `Org` model's `$fillable` array must list all attributes passed here, or the mass assignment protection blocks the call.

## Ownership check pattern

```php
public function show(Org $org) {
    if (!$org->user->is(Auth::user())) {
        return abort(403);
    }
    return view('orgs.show')->with('org', $org);
}
```

`$org->user` accesses the related `User` via `belongsTo`. `is()` compares models by primary key. This pattern must appear in `show()`, `edit()`, `update()`, and `destroy()` for any resource a user owns.

> **Pitfall**
> Calling `Auth::user()->orgs` (as a property, no parentheses) returns a **cached collection** loaded all at once. Calling `Auth::user()->orgs()` (as a method, with parentheses) returns a **query builder** you can chain further (e.g. `->latest()`, `->where()`, `->paginate()`). Using the property form and then trying to chain query methods throws a "Call to a member function on array" error.

## whereBelongsTo() vs manual where

| Approach | Code | Requires relationship? |
|---|---|---|
| Manual `where` | `Org::where('user_id', Auth::id())` | No |
| Relationship chain | `Auth::user()->orgs()` | Yes — `hasMany` on User |
| `whereBelongsTo()` | `Org::whereBelongsTo(Auth::user())` | Yes — `belongsTo` on Org |

`whereBelongsTo()` is the most readable and is the pattern shown last (and preferred) in the source script.

> **Takeaway**
> Declare `hasMany` on the parent model and `belongsTo` on the child model — once each. Every controller method that needs to scope queries, create records, or check ownership can then use those methods instead of raw foreign-key comparisons. `whereBelongsTo()` is the cleanest query form; `->orgs()->create()` is the cleanest write form; `$org->user->is(Auth::user())` is the canonical ownership check.
