---
id: jwt-authentication
title: "JWT authentication — full reference"
pillar: tech
priority: high
tags: [jwt, authentication, bearer-token, laravel, api]
source: "PHP_JWT.pptx; laravel-jwt_SCRIPT.docx"
bloom_levels: [understand, apply, analyze]
related: [rest-api-design, session-auth-breeze, laravel-routing-controllers]
---

## JWT structure at a glance

A JWT token is three base64-encoded sections joined by dots:

```text
header.payload.signature
```

**Header** — JSON object, base64-encoded. Declares token type and signing algorithm:

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

Common algorithms: `HS256` (HMAC-SHA256), `RS512` (RSA), `ES384` (ECDSA).

**Payload** — JSON object, base64-encoded. Contains claims (key-value pairs about the user and the token itself).

**Signature** — hash of `base64(header) + "." + base64(payload)` using the server's secret key. Proves the token hasn't been tampered with. The payload is readable by anyone; only the server can produce a valid signature.

---

## Reserved claims — full reference

These seven claim names are standardized by the JWT spec. When present, they must conform to the definitions below. The exam tests all seven.

| Claim | Full name | Meaning | Typical value |
|-------|-----------|---------|---------------|
| `iat` | Issued At | Unix timestamp when the token was created | `1716239022` |
| `iss` | Issuer | Identifier of the application that issued the token; used to reject tokens from other apps | `"your-app.com"` |
| `nbf` | Not Before | Earliest Unix timestamp at which the token is valid; must be ≥ `iat` | `iat + 10` (10-second grace window) |
| `exp` | Expiration Time | Unix timestamp after which the token is invalid; must be > `iat` and > `nbf` | `iat + 3600` (1-hour token) |
| `sub` | Subject | Identifies the principal the token is about — typically the user's primary key | `"42"` |
| `aud` | Audience | Identifies the intended recipient(s) of the token; server rejects tokens not addressed to it | `"your-frontend-app"` |
| `jti` | JWT ID | Unique identifier for this token instance; used to prevent replay attacks | UUID v4 string |

> **Note**
> You can add custom claims alongside reserved ones. `getJWTCustomClaims()` in the User model returns an array of extra key-value pairs to include in the payload.

---

## The 7-step login flow

> **Example**
> **Concrete flow: POST credentials → verify → create token → return → persist → attach → verify**
>
> 1. **Client** sends `POST /api/login` with `{"email": "sam@lee.com", "password": "P@$$w0rd"}`.
> 2. **Server** checks credentials: `Auth::attempt(['email' => ..., 'password' => ...])`.
> 3. **Server** builds the JWT payload: adds `sub` (user ID), `iat` (now), `exp` (now + TTL), `iss`, and any custom claims.
> 4. **Server** signs the token with `JWT_SECRET` using HS256 and returns:
>    ```json
>    {
>      "status": "success",
>      "user": { ... },
>      "authorisation": { "token": "eyJ...", "type": "bearer" }
>    }
>    ```
> 5. **Client** stores the token (e.g., `localStorage.setItem('token', data.authorisation.token)`).
> 6. **Client** attaches the token to every protected request: `Authorization: Bearer eyJ...`.
> 7. **Server** validates the signature on each request; if valid and not expired, routes to the controller. If invalid or expired, returns 401.

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Laravel Server
    C->>S: POST /api/login {email, password}
    S-->>C: 200 {access_token: "eyJ..."}
    Note over C: Stores token (localStorage / memory)
    C->>S: GET /api/students<br/>Authorization: Bearer eyJ...
    S->>S: Verify signature + exp claim
    S-->>C: 200 [{id:1, FirstName:"Ana",...}]
    C->>S: POST /api/logout
    S->>S: Blacklist token (jti)
    S-->>C: 200 {message: "Successfully logged out"}
```

---

## Laravel setup sequence

| Step | Command / file | What it does |
|------|---------------|--------------|
| Install package | `composer require php-open-source-saver/jwt-auth` | Adds the JWT library |
| Publish config | `php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"` | Copies `config/jwt.php` |
| Generate secret | `php artisan jwt:secret` | Writes `JWT_SECRET` to `.env` |
| Set auth guard | Edit `config/auth.php` — add `'api'` guard with `'driver' => 'jwt'` | Routes `auth:api` middleware to JWT |
| Implement interface | Add `JWTSubject` to `User` model; implement `getJWTIdentifier()` and `getJWTCustomClaims()` | Makes User model JWT-compatible |
| Create controller | `php artisan make:controller api/AuthController` | Scaffolds the auth controller |
| Wire routes | Add login/register/logout/refresh to `routes/api.php` | Exposes JWT endpoints |
| Clear caches | `php artisan route:cache && php artisan config:clear && php artisan cache:clear` | Prevents stale config from blocking protected routes |

---

## AuthController method signatures

```php
// Constructor — blocks all methods except login + register
public function __construct()
{
    $this->middleware('auth:api', ['except' => ['login', 'register']]);
}

// login — returns token on success, 401 on failure
public function login(Request $request) { ... }

// register — creates User, calls Auth::login(), returns JSON
public function register(Request $request) { ... }

// logout — invalidates token
public function logout() {
    Auth::logout();
    return response()->json(['status' => 'success', 'message' => 'Successfully logged out']);
}

// refresh — rotates the token (invalidates old, issues new)
public function refresh() {
    return response()->json([
        'status'        => 'success',
        'user'          => Auth::user(),
        'authorisation' => ['token' => Auth::refresh(), 'type' => 'bearer'],
    ]);
}

// user — returns currently authenticated user
public function user() {
    return Auth::user();
}
```

---

## Bearer token format

The client sends the token in the HTTP `Authorization` header on every protected request:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsImlhdCI6MTcxNjIzOTAyMiwiZXhwIjoxNzE2MjQyNjIyfQ.abc123
```

The middleware reads this header, strips the `Bearer ` prefix, and validates the token signature and expiry claims.

---

> **Pitfall**
> **Wrong package:** `tymon/jwt-auth` is a popular older package. This course uses `php-open-source-saver/jwt-auth` exclusively — different Composer name, different service provider namespace (`PHPOpenSourceSaver\JWTAuth\...`), different setup. If you run `php artisan jwt:secret` and get "command not found", the wrong package is installed.
>
> **Missing all 7 reserved claims:** Exam questions test each claim individually. Confusing `iat` (issued at) with `nbf` (not before), or omitting `jti` (unique ID for replay prevention), are frequent errors. Learn the exact 3-letter code and meaning for every claim in the table above.
>
> **Forgetting the `api` guard in `config/auth.php`:** Installing the package and generating the secret is not enough. Without `'driver' => 'jwt'` in the `api` guard, `auth:api` middleware falls back to session auth and rejects all token-based requests with 401.

---

> **Takeaway**
> JWT authentication is stateless: the token carries its own proof of identity via a cryptographic signature, and the server never stores token records. Know the three-part `header.payload.signature` structure, all 7 reserved claims and their exact meanings, the correct package name (`php-open-source-saver/jwt-auth`), the `JWTSubject` interface methods, and the `Authorization: Bearer` header format. These are the exact details the exam tests.
