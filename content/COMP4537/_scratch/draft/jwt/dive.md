---
id: jwt
title: "JWT — signing, verification, expiration, and storage security"
pillar: tech
priority: high
source: "Slide 10, Slide 11, ISAQuiz11"
bloom_levels: [understand, apply, analyze]
related: [httponly-cookies, password-hashing, public-private-keys]
---

## Concrete case: verifying identity on every request

An API receives hundreds of requests per second. Each one needs to prove it belongs to an authenticated user. Storing a session record for each request and querying a database to validate it adds latency and server-side state. JSON Web Token (JWT) solves this differently: the server issues a cryptographically signed token at login, then verifies that signature on every subsequent request — no database query required.

## JWT three-part structure

A JWT is three Base64url-encoded strings joined by dots: `header.payload.signature`

| Part | Contents | Details |
|---|---|---|
| Header | Algorithm and token type | `{ "alg": "HS256", "typ": "JWT" }` — declares the signing algorithm |
| Payload | Claims and expiry | `{ "username": "admin", "exp": 1234567890 }` — readable by anyone with the token |
| Signature | HMAC of header + payload with secret key | Computed by the server using HS256; proves the token was not tampered with |

**Pitfall:** The correct parts are header, payload, and signature. ISAQuiz11 Q5 offers "Header, Payload, and Certificate" and "Header, Body, and Footer" as distractors. Certificate and Body are not JWT terms. Selecting either scores zero.

## Signing mechanism

The server computes the signature by running HS256 over the concatenated Base64url-encoded header and payload, using the secret key. Any modification to the header or payload after signing invalidates the signature. When the server receives a token, it recomputes the signature and compares. A mismatch means rejection. This is stateless verification — the server needs only its secret key, not a session store.

## Example: correct sign call vs. the two-issue version

**Example:**

Correct:
```js
const token = jwt.sign({ username }, TOKEN_SECRET, {
  algorithm: 'HS256',
  expiresIn: '120s',
});
```

Two-issue version from the slides:
```js
jwt.sign({ foo: 'bar' }, 'shhhhh!');
```

Issue 1: The secret is `'shhhhh!'` — short and guessable. HMAC security depends entirely on secret length and randomness. A weak secret can be brute-forced.

Issue 2: No `expiresIn` is set. A token without an expiration never becomes invalid. A stolen token grants permanent access.

Both issues together mean an attacker who intercepts or guesses the token has indefinite access.

## Storage security: HttpOnly cookie vs localStorage

| Storage | Readable by JS | XSS exposure | Recommended |
|---|---|---|---|
| `localStorage` | Yes | High — any injected script can read it | No |
| HttpOnly cookie | No | Low — JS cannot access the value | Yes |

An HttpOnly cookie is invisible to JavaScript running in the browser. A Cross-Site Scripting (XSS) attack can execute arbitrary script, but that script cannot read an HttpOnly cookie. Storing the JWT in `localStorage` removes that protection.

Add `Secure` (HTTPS only) and `SameSite` (blocks cross-site cookie submission, mitigating CSRF) to complete the cookie security posture.

**Pitfall:** Omitting both `HttpOnly` and `Secure` on the JWT cookie exposes the token to XSS, CSRF, and unauthorized access simultaneously. ISAQuiz11 Q8 correct answer is "All of the above." A student who selected only XSS scored zero. All three risks are present, not just one.

## Environment variable storage for TOKEN_SECRET

The secret key must never appear in source code. Read it from the environment at runtime:

```js
const TOKEN_SECRET = process.env.TOKEN_SECRET;
```

Generate a strong key once:
```js
require('crypto').randomBytes(64).toString('hex')
```

Store the output in your `.env` file (never committed to version control). Most server frameworks expose environment variables securely at runtime.

## Takeaway

**Takeaway:** JWT security rests on three pillars — a long, random secret key stored in environment variables; a short expiration enforced by `expiresIn`; and delivery via an HttpOnly, Secure, SameSite cookie. Weaken any pillar and a distinct attack vector opens.
