---
n: 2
id: jwt
title: "JWT — structure, signing, and secure storage"
hook: "A token you can verify without a database lookup — if you sign it right."
tags: [JWT, json-web-token, signing, secret-key, bcrypt, hashing, XSS]
module: "API Security"
source: "Slide 10, Slide 11, ISAQuiz11"
bloom_levels: [understand, apply, analyze]
related: [httponly-cookies, password-hashing, public-private-keys]
---

## The problem: trusting a request without session state

Every time a client sends a request, the server needs to know who is asking. Traditional session-based auth stores session data on the server. JSON Web Token (JWT) auth removes that requirement — the token itself carries all the information the server needs, and the server verifies it by checking a signature.

No database lookup required. No session table. The server trusts the token because the server signed it.

## JWT structure

A JWT is three Base64url-encoded strings joined by dots:

```
base64url(header).base64url(payload).base64url(signature)
```

| Part | Contains | Example fields |
|---|---|---|
| Header | Algorithm and token type | `{ "alg": "HS256", "typ": "JWT" }` |
| Payload | Claims about the user | `{ "username": "admin", "exp": 1234567890 }` |
| Signature | HMAC of header + payload using the secret key | computed by the server |

The payload is readable by anyone who has the token. The signature is what prevents tampering.

**Pitfall:** The three parts of a JWT are header, payload, and signature — NOT header, payload, and certificate. NOT header, body, and footer. ISAQuiz11 Q5 distractors use both wrong terms. Certificate and Body are not JWT concepts.

## How signing works

When the server signs a token, it runs HS256 (a keyed HMAC function) over the concatenated header and payload using the secret key. That produces the signature. The server appends it and sends the full token to the client.

When the server later receives the token back, it recomputes the signature from the header and payload it received. If the recomputed signature matches the one in the token, nothing was altered. If they differ, the token was tampered with and the server rejects it.

This is why signing guarantees authenticity: only the server that holds the secret key can produce a valid signature.

## The login flow

1. The client sends credentials (email and password) to the server.
2. The server validates the credentials. Never store plain-text passwords — always store a bcrypt hash.
3. On success, the server signs a token:

```js
const token = jwt.sign({ username }, TOKEN_SECRET, {
  algorithm: 'HS256',
  expiresIn: '120s',
});
```

4. The server sets the token in an HttpOnly cookie and sends it to the client:

```js
res.setHeader(
  'Set-Cookie',
  `token=${token}; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=120`
);
```

5. The client's browser attaches the cookie automatically on every subsequent request.
6. The server calls `jwt.verify(token, TOKEN_SECRET)` on each protected route to authenticate the request.

Short expiration times (e.g., `120s`) limit how long a stolen token remains useful.

## JWT storage: HttpOnly cookies vs localStorage

Storing a JWT in `localStorage` makes it readable by any JavaScript running on the page — including injected scripts from a Cross-Site Scripting (XSS) attack. A successful XSS attack against `localStorage` lets an attacker steal the token and impersonate the user.

An HttpOnly cookie cannot be read by JavaScript. The browser sends it automatically but the page script never sees the value. That blocks the most common XSS-based token theft vector.

Cookie attribute summary:

| Attribute | Effect |
|---|---|
| `HttpOnly` | JavaScript cannot access the cookie |
| `Secure` | Cookie is sent only over HTTPS |
| `SameSite` | Prevents the browser from sending the cookie on cross-site requests, mitigating CSRF |

**Pitfall:** Omitting both `HttpOnly` and `Secure` on the JWT cookie exposes the token to XSS attacks, CSRF attacks, and unauthorized access — all three, not just XSS. ISAQuiz11 Q8 requires selecting "All of the above." Selecting only "XSS" scores zero.

## Secret key storage

The secret key must stay out of source code. Store it in an environment variable and read it at runtime:

```js
const TOKEN_SECRET = process.env.TOKEN_SECRET;
```

A long, randomly generated key (e.g., 64 random bytes expressed as hex) is significantly harder to brute-force than a short string like `'shhhhh!'`. Generate one with:

```js
require('crypto').randomBytes(64).toString('hex')
```

> **Q:** Where is the safe place to store a JWT secret key on the server?
>
> **A:** In an environment variable. Never commit it to source control or hardcode it in the application.

## Takeaway

**Takeaway:** JWT lets a server authenticate every request without storing session state — but only if you sign with a long secret key stored in an environment variable, set a short expiration, and deliver the token exclusively via an HttpOnly, Secure cookie. Cutting corners on any of those three properties opens a distinct attack vector.
