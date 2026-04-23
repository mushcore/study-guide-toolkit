---
n: 1
id: httponly-cookies
title: "HttpOnly cookies — token auth flow and cookie flags"
hook: "Your session token is one JavaScript call away from being stolen — unless you set this flag."
tags: [HttpOnly, cookies, token, SameSite, Secure, XSS, withCredentials]
module: "API Security"
source: "Slide 9, Slide 10, ISAQuiz11"
bloom_levels: [understand, apply, analyze]
related: [jwt, ajax-cors, api-security-best-practices]
---

Imagine your login page stores the session token in `localStorage`. Any injected script — from a malicious ad, a forum post, or a compromised dependency — runs `localStorage.getItem('token')` and ships your token to an attacker's server. The server never knew anything happened. The HttpOnly cookie flag closes this attack surface completely: the browser holds the token, JavaScript cannot read it, and the browser sends it automatically on every same-origin request.

## The token auth flow

After the server validates credentials at `POST /login`, it responds with a `Set-Cookie` header rather than a JSON body containing the token. The browser stores the cookie and attaches it to every subsequent request to the same origin — without any JavaScript involvement.

```mermaid
sequenceDiagram
    participant Browser
    participant Server

    Browser->>Server: POST /login (username + password)
    Server->>Server: Validate credentials, generate token
    Server-->>Browser: 200 OK + Set-Cookie: token=abc123; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=60
    Note over Browser: Browser stores cookie. JavaScript cannot read it.

    Browser->>Server: GET /profile (Cookie: token=abc123 auto-attached)
    Server->>Server: Read cookie, validate session
    Server-->>Browser: 200 OK + profile data

    Browser->>Server: POST /logout
    Server-->>Browser: 200 OK + Set-Cookie: token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure
    Note over Browser: Browser deletes cookie immediately.
```

The server reads the cookie on every protected request. If the session is valid, it processes the request. If not, it returns `401 Unauthorized`.

## Cookie flags and what each one does

### HttpOnly

Setting `HttpOnly` blocks `document.cookie` access in the browser. Any JavaScript on the page — including injected scripts from Cross-Site Scripting (XSS) attacks — cannot read the token value. The browser still sends the cookie automatically on every HTTP request to the setting origin.

### Secure

The `Secure` flag restricts the cookie to HTTPS connections only. Over plain HTTP, the browser refuses to send the cookie. This prevents token interception on unencrypted networks.

### SameSite

SameSite controls whether the browser sends the cookie on cross-origin requests:

- **`SameSite=Strict`** — browser only sends the cookie on same-origin requests. Cross-site navigations (clicking a link from another site) do not include the cookie.
- **`SameSite=Lax`** — browser sends the cookie on same-origin requests and on top-level navigations (clicking a link), but not on cross-origin subresource requests like XHR or fetch.
- **`SameSite=None`** — browser sends the cookie on all requests, including cross-origin. Requires `Secure` to also be set; without `Secure`, the browser rejects the `SameSite=None` directive.

Use `SameSite=None; Secure` when your client and server run on different origins (for example, a React app on `http://localhost` talking to an Express server on `http://localhost:3000`).

### Max-Age

`Max-Age` sets the cookie lifetime in seconds. `Max-Age=60` expires the cookie 60 seconds after the browser receives it. Setting `Max-Age=0` on logout forces the browser to delete the cookie immediately.

### Path

`Path=/` makes the cookie available on every route of the origin. Without specifying `Path`, the cookie applies only to the path from which it was set.

## The full Set-Cookie header

```
Set-Cookie: token=abc123; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=60
```

On logout, the server sends a matching header with `Max-Age=0` and an empty value:

```
Set-Cookie: token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure
```

The attributes must match the original cookie exactly. If any attribute differs, the browser treats it as a different cookie and does not delete the original.

## withCredentials and cross-origin requests

For same-origin requests, the browser sends cookies automatically with no additional configuration. For cross-origin requests, two conditions must both hold:

1. The client sets `withCredentials: true` on the XMLHttpRequest (or `credentials: 'include'` on fetch).
2. The server responds with `Access-Control-Allow-Credentials: true`.

If withCredentials is false (the default) on a cross-origin request, the browser strips all cookies from the request. The server receives no authentication cookie, cannot identify the user, and returns `401 Unauthorized`.

When the client uses withCredentials and the request is non-GET (or non-simple), the browser first sends an OPTIONS preflight request. The server must respond to this preflight with the required `Access-Control-Allow-*` headers before the browser sends the actual request.

> **Q:** A user logs in successfully, but every subsequent `GET /profile` request returns 401. The client makes requests to a different origin and uses XMLHttpRequest. What is the most likely cause?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** The cross-origin XMLHttpRequest is not sending the HttpOnly cookie because `withCredentials` is not set to `true` on the client. By default, cross-origin requests strip all cookies. Setting `withCredentials = true` on the XHR, combined with the server returning `Access-Control-Allow-Credentials: true`, causes the browser to include the cookie.
> </details>

> **Pitfall**
> Not using HttpOnly risks ALL of: XSS token theft, session hijacking, AND CSRF — not just XSS. ISAQuiz11 Q3 and Q8 both test this. Selecting only XSS scores zero. When a quiz asks for the risks of omitting HttpOnly (or both HttpOnly and Secure), the correct answer is always "all of the above." The flags work as a system: HttpOnly prevents JavaScript reads, Secure prevents interception, and SameSite prevents cross-site request forgery.

> **Takeaway:** HttpOnly removes the JavaScript attack surface for token theft. Secure restricts transmission to HTTPS. SameSite controls cross-site sending. withCredentials enables cross-origin cookie delivery only when the server also opts in with Access-Control-Allow-Credentials. Logout requires a matching Set-Cookie header with Max-Age=0 — mismatched attributes silently fail to delete the cookie.
