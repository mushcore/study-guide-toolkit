---
n: 9
id: breeze-middleware-protect
title: "Protect routes with auth middleware and retrieve the current user"
lang: php
tags: [authentication, session, breeze, middleware, laravel]
source: "auth-with-breeze_SQLite_SCRIPT.docx"
pedagogy: worked-example-first
---

## Prompt

After installing Breeze, protect all `/org` resource routes so that only authenticated users can access them. Inside `OrgController::index()`, retrieve only the organizations belonging to the currently logged-in user, ordered by `updated_at` descending, and pass them to the `orgs.index` view.

## Starter

```php
<?php
// routes/web.php (partial)
use App\Http\Controllers\OrgController;

Route::resource('/org', OrgController::class);

// app/Http/Controllers/OrgController.php (partial)
use App\Models\Org;

public function index() {
    $orgs = Org::all();
    return view('orgs.index', ['orgs' => $orgs]);
}
```

## Solution

```php
<?php
// routes/web.php (partial)
use App\Http\Controllers\OrgController;

Route::resource('/org', OrgController::class)->middleware(['auth']);

// app/Http/Controllers/OrgController.php (partial)
use Illuminate\Support\Facades\Auth;
use App\Models\Org;

public function index() {
    $orgs = Auth::user()->orgs()->latest('updated_at')->get();
    return view('orgs.index', ['orgs' => $orgs]);
}
```

## Why

`->middleware(['auth'])` chained on `Route::resource()` applies the `auth` middleware to all seven generated routes at once. Unauthenticated visitors are redirected to `/login` before the controller method runs.

Inside the controller, `Auth::user()` returns the authenticated User model. Calling `->orgs()` on it uses the `hasMany` Eloquent relationship defined on the User model to scope the query to only that user's records. `->latest('updated_at')->get()` orders by the `updated_at` column descending.

**Common wrong approaches:**

1. **Forgetting to chain middleware on the resource route.** Writing `Route::resource('/org', OrgController::class)` without `->middleware(['auth'])` leaves every `/org` endpoint publicly accessible. The `auth` middleware must be explicitly attached — Breeze does not auto-protect custom routes.

2. **Using `Org::all()` instead of scoping to the current user.** `Org::all()` returns every row in the table regardless of owner. Use `Auth::user()->orgs()->...` or `Org::whereBelongsTo(Auth::user())->...` to restrict results to the authenticated user. The `Auth::id()` raw-comparison form (`Org::where('user_id', Auth::id())->...`) also works but is more verbose than the relationship form.

3. **Using `auth()->user()` instead of `Auth::user()`.** Both resolve to the same object, but Use Auth::user() (facade style) — more explicit, IDE-friendly, and consistent with Laravel's documentation.
