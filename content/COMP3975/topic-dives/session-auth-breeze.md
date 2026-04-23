---
id: session-auth-breeze
title: "Session authentication with Laravel Breeze — deep reference"
pillar: tech
priority: mid
tags: [authentication, session, breeze, laravel, tailwind, middleware]
source: "auth-with-breeze_SQLite_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [jwt-authentication, laravel-routing-controllers, model-relationships]
---

## Install commands (exact sequence)

```bash
composer require laravel/breeze --dev
php artisan breeze:install
php artisan migrate
php artisan serve --port=8888
```

`composer require laravel/breeze --dev` pulls the package as a dev dependency. `php artisan breeze:install` publishes routes, controllers, and Blade views into the project. `php artisan migrate` runs the users table migration Breeze depends on.

## Built-in authentication routes

Breeze registers these routes in `routes/auth.php`:

| Route | Method | Controller | Purpose |
|---|---|---|---|
| `register` | GET / POST | `RegisteredUserController` | Show / process registration form |
| `login` | GET / POST | `AuthenticatedSessionController` | Show / process login form |
| `logout` | POST | `AuthenticatedSessionController@destroy` | Destroy session |
| `forgot-password` | GET / POST | `PasswordResetLinkController` | Request reset link |
| `reset-password/{token}` | GET / POST | `NewPasswordController` | Show / process reset form |
| `verify-email` | GET | `EmailVerificationPromptController` | Prompt email verification |
| `confirm-password` | GET / POST | `ConfirmablePasswordController` | Re-confirm password for sensitive actions |

All guest-only routes (`register`, `login`, password reset) are wrapped in `Route::middleware('guest')`. All post-login routes (`verify-email`, `logout`, etc.) are wrapped in `Route::middleware('auth')`.

## Protected route group — complete example

> **Example**
> Here is a complete pattern from the course: a resource controller fully protected by the `auth` middleware, with the controller using `Auth::user()` to scope queries to the logged-in user.
>
> ```php
> // routes/web.php
> use App\Http\Controllers\OrgController;
>
> Route::resource('/org', OrgController::class)->middleware(['auth']);
> ```
>
> ```php
> // app/Http/Controllers/OrgController.php
> use Illuminate\Support\Facades\Auth;
> use App\Models\Org;
>
> public function index() {
>     $orgs = Auth::user()->orgs()->latest('updated_at')->get();
>     return view('orgs.index', ['orgs' => $orgs]);
> }
>
> public function show(Org $org) {
>     if (!$org->user->is(Auth::user())) {
>         return abort(403);
>     }
>     return view('orgs.show')->with('org', $org);
> }
> ```
>
> `Route::resource(...)->middleware(['auth'])` applies the `auth` middleware to all seven resource routes at once. Inside the controller, `Auth::user()` is guaranteed non-null because unauthenticated requests never reach the method. The `show()` method additionally checks ownership — a logged-in user must not be able to view another user's record.

## Auth facade methods

| Call | Return type | Returns |
|---|---|---|
| `Auth::user()` | `User\|null` | Full authenticated User model |
| `Auth::id()` | `int\|null` | Authenticated user's primary key |
| `Auth::check()` | `bool` | `true` if a user is authenticated |

All three return `null` / `false` when called outside an authenticated request. Inside a route protected by `auth` middleware, `Auth::user()` and `Auth::id()` are always non-null.

## Middleware comparison

| Middleware | Requires | Redirect on fail |
|---|---|---|
| `auth` | Valid session | `/login` |
| `verified` | Valid session + email verified | `/verify-email` |
| `guest` | No session (unauthenticated) | `/dashboard` (or configured home) |

## Tailwind vs Bootstrap — exam distinction

> **Pitfall**
> Breeze scaffolds Blade views styled with **Tailwind CSS**. The older `laravel/ui` package (not covered in this course) scaffolds Bootstrap views. These are distinct packages with distinct class names. An exam question may ask which CSS framework Breeze uses — the answer is Tailwind, not Bootstrap. Do not confuse the two.

## Sanctum vs Breeze vs JWT

| Package | Auth type | Token/session | Typical use |
|---|---|---|---|
| Breeze | Session | Cookie-based session | Traditional Blade / full-page apps |
| Sanctum | Token (personal access token) | DB-stored token | SPA / mobile API |
| `php-open-source-saver/jwt-auth` | Token (JWT) | Stateless JWT | Fully decoupled API |

Breeze and Sanctum are both first-party Laravel packages. Sanctum's `createToken()` method issues a token returned in the response body; Breeze manages a session stored server-side and returned as a cookie.

> **Takeaway**
> Breeze wires the entire session-auth flow — registration, login, logout, password reset, and email verification — into your project with two commands. Protect your own routes by attaching `->middleware(['auth'])` (or `->middleware(['auth', 'verified'])` when email verification is required). Inside protected controllers, `Auth::user()` and `Auth::id()` always return the authenticated user's data. Breeze uses Tailwind CSS; this is an exam-testable distinction from the Bootstrap-based `laravel/ui`.
