---
n: 8
id: jwt-auth-setup
title: "JWT login method in AuthController"
lang: php
tags: [jwt, authentication, laravel, api, bearer-token]
source: "laravel-jwt_SCRIPT.docx"
pedagogy: worked-example-first
---

## Prompt

Implement the `login()` method for a Laravel `AuthController` that uses `php-open-source-saver/jwt-auth`. The method must:

1. Validate that `email` (required, string, email format) and `password` (required, string) are present.
2. Attempt authentication using `Auth::attempt()` with only the email and password credentials.
3. Return a 401 JSON response with `status: error` and `message: Unauthorized` if credentials are wrong.
4. Return a 200 JSON response with `status: success`, the authenticated user object, and an `authorisation` block containing the token string and type `"bearer"` if credentials are correct.

## Starter

```php
<?php

namespace App\Http\Controllers\api;

use \Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function login(Request $request)
    {
        // TODO: validate email and password fields

        // TODO: build $credentials from only the validated fields

        // TODO: attempt authentication; capture token or handle failure

        // TODO: return JSON response with user + authorisation block
    }
}
```

## Solution

```php
<?php

namespace App\Http\Controllers\api;

use \Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Unauthorized',
            ], 401);
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
}
```

## Why

**Stateless auth vs sessions.** A session-based app stores auth state in a server-side session table and hands the client a session cookie. Every request requires a database lookup. JWT replaces that lookup with a cryptographic check: `Auth::attempt()` returns a signed token string, the client stores it, and every subsequent request proves identity by sending the token in `Authorization: Bearer <token>`. The server re-derives and verifies the signature in memory — no session table, no per-request DB query for the auth check.

**What breaks if you cut corners:**

- **Using `tymon/jwt-auth` instead of `php-open-source-saver/jwt-auth`:** Different Composer package, different service provider, different namespace. `php artisan jwt:secret` will not exist. The course uses `php-open-source-saver/jwt-auth` exclusively — use the exact package name.
- **Not setting `'driver' => 'jwt'` in `config/auth.php`:** Without the jwt driver in the `api` guard, `auth:api` middleware ignores the Bearer token and returns 401 for every protected request. Installing the package is not enough — the guard must be wired.
- **Not implementing JWTSubject on the User model:** `Auth::attempt()` will throw an error if the User model does not implement `getJWTIdentifier()` and `getJWTCustomClaims()`. The interface tells the package which value to store in the `sub` claim.
- **Not clearing config cache after changes:** After editing `config/auth.php`, run `php artisan config:clear` before testing. Laravel caches the config; stale cache means the old (non-JWT) guard is still active.
