---
n: 2
id: model-relationships
title: "Eloquent relationships — hasMany and belongsTo"
hook: "One foreign key, two model methods — and you never write a JOIN again."
tags: [eloquent, relationships, hasMany, belongsTo, laravel]
module: "Laravel Database"
priority: high
source: "laravel_with_students_MySQL_SCRIPT.docx; auth-with-breeze_SQLite_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [eloquent-orm, migrations-and-seeders]
pedagogy: concreteness-fading
---

## The concrete case: User owns many Orgs

In the Breeze org-registry app, each authenticated user creates organizations. One user can own many orgs. Each org belongs to exactly one user. The `orgs` table has a `user_id` foreign key column that records this ownership.

Without Eloquent relationships, you query orgs like this:

```php
$orgs = Org::where('user_id', Auth::id())->latest('updated_at')->get();
```

That works, but it hard-codes the foreign key name every time you need it. Eloquent relationships let you express the same intent through the model graph instead.

## Declaring the relationship

You declare a one-to-many relationship in two model files — one for each side.

**Parent side — `User` hasMany `Org`.**
Open `app/Models/User.php` and add:

```php
public function orgs() {
    return $this->hasMany(Org::class);
}
```

**Child side — `Org` belongsTo `User`.**
Open `app/Models/Org.php` and add:

```php
public function user() {
    return $this->belongsTo(User::class);
}
```

The method name on the child side (`user`) is singular. The method name on the parent side (`orgs`) is plural. That naming convention tells you which side of the relationship you are on.

> **Q:** After adding `hasMany` and `belongsTo`, what single change lets the `index()` controller method use the relationship instead of a raw `where` clause?
>
> **A:** Replace `Org::where('user_id', Auth::id())->...->get()` with `Auth::user()->orgs()->...->get()`. The relationship method replaces the manual foreign-key filter.

## Querying through the relationship

Once the methods exist, you have three equivalent ways to fetch the current user's orgs:

```php
// Option 1 — manual where (no relationship needed)
$orgs = Org::where('user_id', Auth::id())->latest('updated_at')->get();

// Option 2 — relationship chain via Auth facade
$orgs = Auth::user()->orgs()->latest('updated_at')->get();

// Option 3 — whereBelongsTo() shorthand
$orgs = Org::whereBelongsTo(Auth::user())->latest('updated_at')->get();
```

All three produce the same SQL. Options 2 and 3 require the relationship methods to be declared on the models.

> **Pitfall**
> The `orgs` table **must** have a `user_id` column for `hasMany(Org::class)` to work. Eloquent infers the foreign key name by taking the parent model name (`User`), lowercasing it, and appending `_id`. If your migration omits `$table->foreignId('user_id')->constrained()`, every relationship query silently returns an empty result — no error, just zero rows.

## Saving through the relationship

When a logged-in user creates a new org, you can attach it directly through the relationship. This automatically sets `user_id` for you:

```php
Auth::user()->orgs()->create([
    'orgName'    => $request->orgName,
    'street'     => $request->street,
    'city'       => $request->city,
    'postalCode' => $request->postalCode,
    'province'   => $request->province,
    'country'    => $request->country,
    'phone'      => $request->phone,
    'email'      => $request->email,
]);
```

You do not pass `user_id` explicitly. The relationship sets it.

Note that `$fillable` on `Org` must list every attribute you pass here. Without it, Eloquent's mass assignment protection blocks the `create()` call entirely.

## Checking ownership

When showing or editing a single org, you must verify the current user owns it. Use the `belongsTo` relationship to traverse from the child to its parent:

```php
public function show(Org $org) {
    if (!$org->user->is(Auth::user())) {
        return abort(403);
    }
    return view('orgs.show')->with('org', $org);
}
```

`$org->user` returns the related `User` model (using `belongsTo`). The `is()` method compares models by primary key. This pattern prevents one authenticated user from viewing another user's orgs.

> **Q:** What does `$org->user->is(Auth::user())` return if the org belongs to a different user?
>
> **A:** It returns `false`. The `is()` method compares the two models' primary key values. When they differ, the check fails and `abort(403)` fires.

> **Takeaway**
> `hasMany` and `belongsTo` are declared once per model and replace every manual `WHERE user_id = ?` filter in your controllers. They also power `whereBelongsTo()` and `->create()` through the relationship, keeping foreign key logic out of your controller code entirely.
