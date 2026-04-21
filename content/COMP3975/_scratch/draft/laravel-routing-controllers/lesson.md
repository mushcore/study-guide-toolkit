---
n: 7
id: laravel-routing-controllers
title: "Routes and resource controllers"
hook: "One line of config replaces five route declarations — here's what Route::resource() buys you and where it can bite you."
tags: [laravel, routing, controllers, resource-routes, middleware]
module: "Laravel Foundations"
priority: mid
source: "laravel_with_sqlite_API_SCRIPT.docx; intro_to_laravel_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [laravel-mvc-blade, artisan-composer, rest-api-design]
pedagogy: concreteness-fading
---

## Start here: one line, five routes

You have a `StudentsController` with five methods. Without resource routing, your `routes/api.php` looks like this:

```php
Route::get('students', [StudentsController::class, 'index']);
Route::get('students/{student}', [StudentsController::class, 'show']);
Route::post('students', [StudentsController::class, 'store']);
Route::put('students/{student}', [StudentsController::class, 'update']);
Route::delete('students/{student}', [StudentsController::class, 'destroy']);
```

Replace all five lines with one resource route:

```php
Route::apiResource('students', StudentsController::class);
```

Laravel generates the same five HTTP-to-method bindings automatically. You write less; the framework does more.

## routes/web.php vs routes/api.php

Laravel keeps two route files for different purposes.

`routes/web.php` handles browser-facing requests. It applies session state, CSRF protection, and redirects users to login pages when authentication fails.

`routes/api.php` handles stateless API requests. It returns JSON, uses token-based authentication, and prefixes every URL with `/api/` automatically. You generate this file with:

```bash
php artisan install:api
```

Put your `Route::resource()` and `Route::apiResource()` calls in `routes/api.php` for REST APIs.

## Route::resource() vs Route::apiResource()

Both macros map HTTP verbs to controller methods. They differ in which methods they include.

| Macro | Methods registered | Use case |
|---|---|---|
| `Route::resource()` | All 7 (index, create, store, show, edit, update, destroy) | Web apps with HTML forms |
| `Route::apiResource()` | 5 (index, store, show, update, destroy) | JSON APIs — no `create` or `edit` |

`create` and `edit` exist only to return HTML forms. A JSON API never needs them, so `Route::apiResource()` drops them.

> **Q:** You're building a JSON API. Which resource macro should you use, and why are two methods omitted?
> **A:** Use `Route::apiResource()`. It omits `create` (returns the "new item" HTML form) and `edit` (returns the "edit item" HTML form) — neither exists in a stateless API.

## The 7 RESTful controller methods

When you scaffold a resource controller, Laravel generates these seven method stubs:

| HTTP verb | URL | Controller method | Purpose |
|---|---|---|---|
| GET | /students | `index()` | List all records |
| GET | /students/create | `create()` | Return HTML create form |
| POST | /students | `store()` | Persist a new record |
| GET | /students/{student} | `show()` | Return one record |
| GET | /students/{student}/edit | `edit()` | Return HTML edit form |
| PUT/PATCH | /students/{student} | `update()` | Update an existing record |
| DELETE | /students/{student} | `destroy()` | Delete a record |

Scaffold a resource controller with the `--api` flag to skip the `create` and `edit` stubs entirely:

```bash
php artisan make:controller api/StudentsController --api --model=Student
```

## Restricting generated routes

You rarely need all five API routes. Use `->only()` to whitelist the ones you want:

```php
Route::apiResource('students', StudentsController::class)
    ->only(['index', 'show', 'store', 'update', 'destroy']);
```

This prevents Laravel from registering routes you have no controller logic for.

## Middleware chaining

To protect a resource route with authentication, chain `->middleware()` onto the registration:

```php
Route::apiResource('students', StudentsController::class)
    ->middleware(['auth:sanctum']);
```

You can stack multiple middleware in the array. Laravel runs them in order before the request reaches your controller.

> **Pitfall:** After adding `->middleware(['auth:sanctum'])` to a route, the route may still appear unprotected if you have a route cache from before the change. Run `php artisan route:clear` after every routing change. A stale cache silently serves the old route table.

## Route caching

Route registration has a small overhead. In production, cache all routes to a single file:

```bash
php artisan route:cache
```

To clear and rebuild the cache after changes:

```bash
php artisan route:clear
```

During local development, skip caching — it prevents newly defined routes from loading. Use `php artisan route:clear` any time routes behave unexpectedly.

> **Q:** You add a new resource route in `routes/api.php` and start the server, but hitting `/api/items` returns a 404. What is the most likely cause?
> **A:** A stale route cache. Run `php artisan route:clear` to discard it, then retry.

> **Takeaway:** `Route::apiResource()` replaces five manual route declarations with one. It binds HTTP verbs to controller methods by convention, so your `routes/api.php` stays short and readable. Always clear the route cache after structural routing changes — a stale cache is the single most common source of "my route doesn't exist" bugs in Laravel.
