---
n: 9
id: jwt-authentication
title: "JWT authentication — stateless API security"
hook: "A token your server signs once and never stores — here's how that actually works."
tags: [jwt, authentication, bearer-token, laravel, api]
module: "API and Authentication"
priority: high
source: "PHP_JWT.pptx; laravel-jwt_SCRIPT.docx"
bloom_levels: [understand, apply, analyze]
related: [rest-api-design, session-auth-breeze, laravel-routing-controllers]
pedagogy: concreteness-fading
---

## The problem sessions can't solve

You have a Laravel REST API. A mobile app calls it. A third-party service calls it. Neither has a browser session — they can't store a session cookie. You need a way to prove identity on every request without looking up a database record each time.

Here is what actually happens when you log in with JWT:

1. Client sends credentials (email + password) to `POST /api/login`.
2. Server checks the credentials.
3. Server creates a JWT token and signs it with a secret key.
4. Server sends the token back to the client.
5. Client stores the token (typically in localStorage) and attaches it to every future request.
6. Server verifies the token's signature on every subsequent request.
7. If the token is valid, the server responds; if not, it returns 401 Unauthorized.

That is the full loop. No session table. No cookie. The token carries its own proof of authenticity.

> **Q:** What does the server check on every request after the initial login?
> **A:** The token's signature — if the signature is valid and the token hasn't expired, the request is allowed through.

---

## JWT structure: three parts, all base64

A JWT token looks like this:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Three sections, dot-separated: `header.payload.signature`. All three are base64-encoded.

**Header** — tells the receiver which algorithm was used:

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

**Payload** — the actual claims (user data + metadata). For example:

```json
{
  "iss": "your-app.com",
  "sub": "42",
  "iat": 1716239022,
  "exp": 1716242622
}
```

**Signature** — computed by hashing `base64(header) + "." + base64(payload)` with a secret key. The server generates this on login; on every future request it recomputes the hash and compares. If they match, the payload hasn't been tampered with.

> **Analogy**
> The header + payload are like a wax-sealed letter. Anyone can read the contents, but the seal (signature) tells the recipient whether the letter was opened and re-sealed. If the seal breaks, the letter is rejected.

---

## The 7 reserved claims

JWT defines a set of standardized payload field names. You are not required to use all of them, but when you do use them they must follow the standard meaning. Know all seven — the exam tests them.

| Claim | Meaning | Typical value |
|-------|---------|---------------|
| `iat` | Issued at — when the token was created | Unix timestamp, e.g. `1716239022` |
| `iss` | Issuer — which application/domain produced the token | `"your-app.com"` |
| `nbf` | Not before — earliest time the token is valid (≥ `iat`) | Unix timestamp (e.g. `iat + 10`) |
| `exp` | Expiration — when the token stops being valid (> `iat` and > `nbf`) | Unix timestamp, e.g. `iat + 3600` |
| `sub` | Subject — who the token is about (typically the user's ID) | `"42"` |
| `aud` | Audience — which application(s) may consume this token | `"your-frontend-app"` |
| `jti` | JWT ID — unique identifier for this specific token (prevents replay) | UUID string |

> **Q:** Which reserved claim identifies the user the token was issued for?
> **A:** `sub` (subject) — it stores the user's identifier, typically the primary key.

---

## Token tampering: why it fails

Suppose an attacker intercepts your token, decodes the base64 payload (anyone can do this — the payload is not encrypted), and changes `"sub": "42"` to `"sub": "1"` to impersonate an admin.

When the modified token arrives at the server, the server recomputes the signature from the new header + payload. The recomputed signature does not match the original signature in the token. The server rejects the request.

The signature protects integrity, not secrecy. If you need the payload to be secret, encrypt it (JWE) — but for most API auth, signing is sufficient.

> **Pitfall**
> JWT payloads are base64-encoded, not encrypted. Never store sensitive data (passwords, credit card numbers) in the payload. The user can decode and read the contents with a simple base64 decode or jwt.io.

---

## Laravel setup: the right package

The package used in this course is `php-open-source-saver/jwt-auth`. This is **not** the same as `tymon/jwt-auth`. They are different packages with different setup steps. Using the wrong one is a common mistake.

**Step 1 — Install the package:**

```bash
composer require php-open-source-saver/jwt-auth
```

**Step 2 — Publish the config:**

```bash
php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"
```

**Step 3 — Generate the secret key:**

```bash
php artisan jwt:secret
```

This writes `JWT_SECRET=...` into your `.env` file. The secret signs and verifies every token.

**Step 4 — Configure the auth guard** in `config/auth.php`. Add an `api` guard that uses the `jwt` driver:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

> **Pitfall**
> Using `tymon/jwt-auth` instead of `php-open-source-saver/jwt-auth` is the most common setup mistake in this course. The package names are similar, the Composer namespaces are different, and the setup steps differ. Always use the exact Composer name: `php-open-source-saver/jwt-auth`.

---

## The JWTSubject interface

Your `User` model must implement the `JWTSubject` interface from `PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject`. This requires two methods:

```php
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    // Returns the value stored in the 'sub' claim of the JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    // Returns an array of custom claims to add to the payload
    public function getJWTCustomClaims()
    {
        return [];
    }
}
```

`getJWTIdentifier()` returns the model's primary key — this becomes the `sub` claim. `getJWTCustomClaims()` returns any extra payload fields you want to include; returning an empty array is fine for basic auth.

---

## AuthController: the five methods

Generate the controller:

```bash
php artisan make:controller api/AuthController
```

The constructor locks all methods behind `auth:api` middleware, except `login` and `register`:

```php
public function __construct()
{
    $this->middleware('auth:api', ['except' => ['login', 'register']]);
}
```

The five methods and what they do:

| Method | Responsibility |
|--------|---------------|
| `register` | Validates input, creates the `User` record, logs the user in, returns JSON |
| `login` | Validates credentials, calls `Auth::attempt()`, returns the JWT token on success |
| `logout` | Calls `Auth::logout()` to invalidate the token |
| `refresh` | Invalidates the current token and issues a new one via `Auth::refresh()` |
| `user` | Returns the currently authenticated user via `Auth::user()` |

**Example login method:**

```php
public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|string|email',
        'password' => 'required|string',
    ]);

    $credentials = $request->only('email', 'password');

    if (!$token = Auth::attempt($credentials)) {
        return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
    }

    return response()->json([
        'status'        => 'success',
        'user'          => Auth::user(),
        'authorisation' => [
            'token' => $token,
            'type'  => 'bearer',
        ],
    ]);
}
```

`Auth::attempt()` returns the JWT token string on success (not just `true`), or `false` on failure. Note the use of `Auth::` facade style — not `auth()->`.

---

## Sending the Bearer token

After login, the client stores the token and sends it with every protected request using the `Authorization` header:

```text
Authorization: Bearer <token>
```

In a REST client like VS Code REST Client or Postman, set the Authorization type to "Bearer Token" and paste the token value. The server's `auth:api` middleware reads this header, validates the signature, and populates `Auth::user()` for the request.

> **Q:** How does the client authenticate after receiving a JWT token?
> **A:** It attaches the token to the `Authorization` header as `Bearer <token>` on every subsequent request.

---

## Routes wiring

Add these routes in `routes/api.php`:

```php
use App\Http\Controllers\api\AuthController;

Route::controller(AuthController::class)->group(function () {
    Route::post('login',    'login');
    Route::post('register', 'register');
    Route::post('logout',   'logout');
    Route::post('refresh',  'refresh');
});
```

Protect your resource routes with the `auth:api` middleware:

```php
Route::middleware('auth:api')->group(function () {
    Route::get('students',          [StudentsController::class, 'index']);
    Route::get('students/{student}', [StudentsController::class, 'show']);
    Route::post('/students',         [StudentsController::class, 'store']);
    Route::put('students/{student}', [StudentsController::class, 'update']);
    Route::delete('students/{student}', [StudentsController::class, 'destroy']);
});
```

After any route or config change, clear caches before testing:

```bash
php artisan route:cache
php artisan config:clear
php artisan cache:clear
```

---

> **Takeaway**
> JWT lets your API verify identity without storing session state. The server signs a token on login; every subsequent request carries that token; the server re-verifies the signature. The three-part `header.payload.signature` structure, the 7 reserved claims, the `php-open-source-saver/jwt-auth` package, the `JWTSubject` interface, and the `Authorization: Bearer` header format are all examinable. The most common wrong-answer trap is using `tymon/jwt-auth` — use the exact package name from this course.
