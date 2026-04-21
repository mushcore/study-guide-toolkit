---
n: 2
id: model-relationships-hasmanybelongs
title: "Eloquent hasMany / belongsTo"
lang: php
tags: [eloquent, relationships, laravel]
source: "laravel_with_students_MySQL_SCRIPT.docx; auth-with-breeze_SQLite_SCRIPT.docx"
pedagogy: worked-example-first
---

## Prompt

A `users` table and an `orgs` table exist. The `orgs` table has a `user_id` foreign key.

Complete the following tasks:

1. Add `hasMany` on `User` so that `Auth::user()->orgs()` works.
2. Add `belongsTo` on `Org` so that `$org->user` works.
3. In `OrgController::index()`, use `whereBelongsTo()` to fetch only the current user's orgs, ordered by most recently updated.
4. In `OrgController::show()`, abort with 403 if the org does not belong to the current user.

## Starter

```php
<?php
// app/Models/User.php (partial)
class User extends Authenticatable
{
    // Task 1: declare hasMany relationship
}

// app/Models/Org.php (partial)
class Org extends Model
{
    protected $fillable = [
        'orgName', 'orgType', 'street', 'city',
        'postalCode', 'province', 'country', 'phone', 'email',
    ];

    // Task 2: declare belongsTo relationship
}

// app/Http/Controllers/OrgController.php (partial)
use App\Models\Org;
use Illuminate\Support\Facades\Auth;

class OrgController extends Controller
{
    public function index()
    {
        // Task 3: fetch current user's orgs using whereBelongsTo(),
        //         ordered by latest updated_at
        $orgs = /* your code here */;
        return view('orgs.index', ['orgs' => $orgs]);
    }

    public function show(Org $org)
    {
        // Task 4: abort(403) if org does not belong to Auth::user()
        return view('orgs.show')->with('org', $org);
    }
}
```

## Solution

```php
<?php
// app/Models/User.php (partial)
class User extends Authenticatable
{
    public function orgs()
    {
        return $this->hasMany(Org::class);
    }
}

// app/Models/Org.php (partial)
class Org extends Model
{
    protected $fillable = [
        'orgName', 'orgType', 'street', 'city',
        'postalCode', 'province', 'country', 'phone', 'email',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// app/Http/Controllers/OrgController.php (partial)
use App\Models\Org;
use Illuminate\Support\Facades\Auth;

class OrgController extends Controller
{
    public function index()
    {
        $orgs = Org::whereBelongsTo(Auth::user())->latest('updated_at')->get();
        return view('orgs.index', ['orgs' => $orgs]);
    }

    public function show(Org $org)
    {
        if (!$org->user->is(Auth::user())) {
            return abort(403);
        }
        return view('orgs.show')->with('org', $org);
    }
}
```

## Why

Two common wrong approaches appear here. First, developers often put `hasMany` on the wrong model — placing it on `Org` instead of `User`. The `hasMany` always goes on the model whose primary key is referenced by the foreign key; `User` owns the `user_id` on `orgs`, so `hasMany` belongs on `User`. Second, developers forget to call the relationship as a method (`orgs()` with parentheses) when chaining query constraints. Writing `Auth::user()->orgs->latest(...)` accesses the property form (a cached collection) and the subsequent `->latest()` chain call fails with a fatal error. Always use parentheses when you intend to build a query.
