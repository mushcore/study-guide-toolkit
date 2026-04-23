---
id: httponly-cookies
title: "HttpOnly cookies — flags, flow, and cross-origin credential rules"
pillar: tech
priority: high
source: "Slide 9, Slide 10, ISAQuiz11"
bloom_levels: [understand, apply, analyze]
related: [jwt, ajax-cors, api-security-best-practices]
---

A JSON Web Token (JWT) stored in `localStorage` is readable by every script on the page. One XSS payload — a malicious script injected through a comment field, a third-party library, or a reflected parameter — calls `localStorage.getItem('token')` and exfiltrates it. Storing the JWT in an HttpOnly cookie removes the read surface entirely: JavaScript on the page cannot access the value, so there is nothing to steal.

## Cookie flags reference

| Flag / Attribute | What it does | Attack it mitigates |
|---|---|---|
| **HttpOnly** | Blocks `document.cookie` access from JavaScript. The browser manages the cookie; scripts cannot read or write it. | XSS-based token theft, session hijacking |
| **Secure** | Restricts the cookie to HTTPS connections only. The browser refuses to send it over plain HTTP. | Token interception on unencrypted networks |
| **SameSite** | Controls cross-origin cookie sending. `Strict` = same-origin only. `Lax` = same-origin + top-level nav. `None` = all origins (requires `Secure`). | Cross-Site Request Forgery (CSRF) |
| **Max-Age** | Sets cookie lifetime in seconds. `Max-Age=60` expires in 60 s. `Max-Age=0` deletes immediately. | Session persistence after logout |
| **Path** | Scopes the cookie to a URL path prefix. `Path=/` makes it available across all routes of the origin. | Limits cookie exposure to unintended routes |

## withCredentials cross-origin rules

| Scenario | Cookie behavior |
|---|---|
| Same-origin request (any method) | Browser always sends cookies. No configuration needed. |
| Cross-origin, `withCredentials = false` (default) | Browser strips all cookies. Server receives no authentication credential. Request fails with 401. |
| Cross-origin, `withCredentials = true`, but server omits `Access-Control-Allow-Credentials: true` | Browser discards the server's response entirely. Cookie was sent, but the client never sees the reply. |
| Cross-origin, `withCredentials = true` AND server sends `Access-Control-Allow-Credentials: true` | Browser sends the cookie and delivers the server response to JavaScript. |

For cross-origin requests that are non-simple (non-GET, or GET with custom headers), the browser sends an OPTIONS preflight first. The server must include `Access-Control-Allow-*` headers in the preflight response before the browser proceeds with the actual request.

> **Example:**
>
> **Login — setting the cookie:**
> ```
> Set-Cookie: token=R99R; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=60
> ```
> `HttpOnly` blocks JavaScript reads. `Path=/` covers all routes. `SameSite=None` permits cross-origin sending (required when client and server run on different origins). `Secure` is mandatory alongside `SameSite=None`. `Max-Age=60` expires the token in 60 seconds.
>
> **Logout — deleting the cookie:**
> ```
> Set-Cookie: token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure
> ```
> `Max-Age=0` instructs the browser to delete the cookie immediately. Every attribute must match the original Set-Cookie header exactly — a mismatched `Path`, `SameSite`, or `Secure` value causes the browser to treat this as a different cookie, leaving the original intact and the user still authenticated.

> **Pitfall:** ISAQuiz11 Q3 asks for the risks of not using HttpOnly. ISAQuiz11 Q8 asks for the risks of not using both HttpOnly and Secure. Both questions have the same trap: the correct answer is "all of the above" (XSS token theft + session hijacking + CSRF). Selecting only "Cross-site scripting (XSS) attacks" scores zero on both. The flags work as a system — removing any one of them opens multiple attack vectors simultaneously.

> **Takeaway:** Each cookie flag closes a distinct attack surface. HttpOnly removes JavaScript read access. Secure enforces HTTPS. SameSite controls cross-site sending and mitigates CSRF. Max-Age bounds the session window. On cross-origin requests, withCredentials on the client and Access-Control-Allow-Credentials on the server must both be true for cookies to flow — either condition alone is insufficient.
