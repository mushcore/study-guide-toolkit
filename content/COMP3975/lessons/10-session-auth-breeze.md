---
n: 10
id: session-auth-breeze
title: "Session authentication with Laravel Breeze"
hook: "Add a full login/register/logout system to any Laravel app in two commands."
tags: [authentication, session, breeze, laravel, tailwind]
module: "API and Authentication"
priority: mid
source: "auth-with-breeze_SQLite_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [jwt-authentication, laravel-routing-controllers, model-relationships]
pedagogy: concreteness-fading
---

## Start with a protected route

Before you know how Breeze works, look at what it produces. After installation, `routes/web.php` contains this:

```php
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
```

Try navigating to `/dashboard` without logging in. Laravel redirects you to `/login` automatically. That redirect is the `auth` middleware at work — it checks whether a session exists for the current request and bounces unauthenticated visitors to the login page.

That one line — `->middleware(['auth', 'verified'])` — is the entire protection mechanism. Everything else Breeze installs (routes, controllers, views) is the scaffolding that creates and destroys those sessions.

> **Q:** Without reading further, what do you think `'verified'` adds on top of `'auth'`?
> **A:** `'auth'` requires the user to be logged in. `'verified'` additionally requires their email address to have been verified. A logged-in but unverified user still gets blocked by `'verified'`.

## Installing Breeze

Breeze is a Composer dev-dependency, then an Artisan installer:

```bash
composer require laravel/breeze --dev
php artisan breeze:install
```

`breeze:install` publishes routes, controllers, and Blade views directly into your project. Run your migrations and serve as normal:

```bash
php artisan migrate
php artisan serve --port=8888
```

> **Pitfall**
> Breeze uses **Tailwind CSS** for all its views — not Bootstrap. If you are used to `laravel/ui` (which scaffolds Bootstrap), the class names are completely different. The exam explicitly distinguishes these two packages. `laravel/ui` = Bootstrap; Breeze = Tailwind. Never mix them up in an exam answer.

## What Breeze installs

After installation your project gains:

**Routes** — Breeze writes all authentication routes into `routes/auth.php`, which is `require`d from `routes/web.php`. Two groups exist:

- `guest` middleware group: register, login, forgot-password, reset-password.
- `auth` middleware group: verify-email, confirm-password, logout, password update.

**Controllers** — all in `app/Http/Controllers/Auth/`:
- `RegisteredUserController` — handles register form + new user creation.
- `AuthenticatedSessionController` — handles login form + session creation/destruction.
- `PasswordResetLinkController` and `NewPasswordController` — handle password reset flow.
- `EmailVerificationNotificationController`, `VerifyEmailController` — handle email verification.

**Views** — Blade templates under `resources/views/auth/`, `resources/views/components/`, `resources/views/layouts/`, and `resources/views/profile/`.

None of these controllers need modification for basic use. You protect your own routes by attaching middleware — the controllers do the rest.

## The Auth facade

Once a user is authenticated, two facade calls give you their data anywhere in a controller:

```php
use Illuminate\Support\Facades\Auth;

// Returns the full authenticated User model, or null if not logged in
$user = Auth::user();

// Returns the authenticated user's primary key (integer), or null
$id = Auth::id();
```

> **Note**
> The voice guide for this course specifies `Auth::user()` and `Auth::id()` (facade style). Do not substitute `auth()->user()` — both work, but Prefer facade style Auth::user() — consistent with Laravel's static-analysis tooling.

The practical pattern: inside any controller protected by the `auth` middleware, `Auth::user()` is guaranteed non-null. You can call it without a null-check.

```php
public function index() {
    $orgs = Auth::user()->orgs()->latest('updated_at')->get();
    return view('orgs.index', ['orgs' => $orgs]);
}
```

This fetches only the records belonging to the currently logged-in user via the `orgs()` Eloquent relationship defined on the User model.

## Middleware names

Two middleware names are relevant for session auth:

| Middleware | Meaning |
|---|---|
| `auth` | Request must have a valid authenticated session. Redirects to login if not. |
| `verified` | Same as `auth`, plus the user's email must be verified. |

You apply them per-route or per-group:

```php
// Single route
Route::get('/dashboard', fn() => view('dashboard'))
    ->middleware(['auth', 'verified']);

// Group — applies auth to all routes inside
Route::middleware('auth')->group(function () {
    Route::resource('/org', OrgController::class);
});
```

> **Q:** Which middleware name do you chain when you want every route in a group to require a logged-in user?
> **A:** `'auth'`. Use `->middleware('auth')->group(...)` or pass `'auth'` in the middleware array. `'verified'` adds the email-verification requirement on top.

## Sanctum as the token alternative

Breeze covers session-based authentication — appropriate for traditional Blade applications where the browser manages the session cookie. For API clients (mobile apps, SPAs making fetch calls), Laravel Sanctum provides token-based authentication via `createToken()`. The exam treats these as distinct alternatives:

- Breeze → session + cookie → Blade apps.
- Sanctum → personal access tokens → API/SPA clients.
- JWT (`php-open-source-saver/jwt-auth`) → stateless tokens → fully decoupled API clients.

> **Takeaway**
> Breeze gives you a complete session-auth system in two commands. The key mechanism: `->middleware(['auth'])` on a route checks for a valid session and redirects unauthenticated visitors to login. `Auth::user()` and `Auth::id()` retrieve the authenticated user in any controller. Breeze is Tailwind-based — not Bootstrap — and that distinction is exam-testable.
