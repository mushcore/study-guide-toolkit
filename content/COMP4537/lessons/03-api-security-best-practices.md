---
n: 3
id: api-security-best-practices
title: "Top 8 API security vulnerabilities and how to prevent them"
hook: "One unsanitized input field can give an attacker access to your entire database — here are the eight patterns to close."
tags: [security, SQL-injection, rate-limiting, OWASP, mass-assignment, XSS, CSRF, DoS]
module: "API Security"
source: "Slide 12, ISAQuiz12"
bloom_levels: [understand, apply, analyze]
related: [httponly-cookies, jwt, sql-crud, express-framework]
---

An attacker submits `' WHERE 1=1; DROP TABLE users; --` as their email address. Your Express route builds the query with a template literal: the injected string becomes valid SQL and your entire users table is gone. That single unsanitized input field was the entry point. Each of the eight vulnerabilities below has an equally concrete entry point — and an equally concrete fix.

## 1. Broken User Authentication

Weak passwords, absent session timeouts, and improper token handling let attackers pose as legitimate users. A server that reuses expired tokens or sets no session expiry keeps valid sessions alive indefinitely. Credential recovery and forgot-password endpoints are full login vectors — they need the same protections.

**Prevention:** Require strong passwords and enforce multi-factor authentication (MFA). Set session timeouts. Rate-limit and lock accounts after repeated failures. Store passwords with a strong hashing algorithm such as bcrypt, never in plain text.

```js
// Rate-limit by IP before processing login
if (loginAttempts[ip] >= 3) {
  return res.status(429).json({ message: 'Too many login attempts. Try again later.' });
}
```

> **Q:** Which measure specifically protects against brute force attacks on a login endpoint?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** Temporarily locking out the account (or the IP) after multiple unsuccessful login attempts. Rate limiting and lockout force an attacker to slow down exponentially — they cannot run thousands of password guesses per second. MFA adds a second factor so a guessed password alone is insufficient. ISAQuiz12 Q8 confirmed account lockout; Q4 confirmed rate limiting's purpose is brute force mitigation.
> </details>

> **Pitfall**
> Storing sensitive information in plain text inside a cookie is a vulnerability regardless of whether the `HttpOnly` and `Secure` flags are set. Those flags restrict JavaScript access and HTTPS-only transmission — they do not encrypt or protect the value itself. ISAQuiz12 Q6 confirmed this: "storing sensitive information in plain text within a cookie while employing the `Secure` and `HttpOnly` attributes" does NOT help with preventing Broken User Authentication.

## 2. Excessive Data Exposure

An API accidentally returns more data than the client needs — a full user record including SSN when only name and email were requested, or a detailed error message exposing the database schema. Filtering at the client side is not a defense: the full payload already left the server.

**Prevention:** Filter the response payload on the server before sending it. Never pass raw model objects through `to_json()` or `toString()` — cherry-pick specific fields. Encrypt sensitive data at rest and in transit. Return generic error messages to the client.

```js
// WRONG — returns the entire user object
res.json(user);

// RIGHT — return only what the client needs
res.json({ name: user.name, email: user.email });
```

> **Pitfall**
> ISAQuiz12 Q3 asked which option is NOT an example of Excessive Data Exposure. The trap answer was "filtering out and removing unnecessary details from Error Messages before displaying them to users." That is the PREVENTION, not an example of the vulnerability. Confusing the prevention with an example of the problem is the exact mistake the exam tests.

> **Q:** An API endpoint returns all student grades and relies on the client app to hide irrelevant ones. Is this Excessive Data Exposure?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** Yes. Client-side filtering does not protect data — the full payload travels over the network and is visible to anyone who inspects the response. The server must filter before sending.
> </details>

## 3. Lack of Resources / Rate Limiting

A server with no request limits lets a single client send thousands of requests per second. This exhausts memory, CPU, and file handles, making the service unavailable to legitimate users. Attackers bypass per-IP limits by spreading requests across multiple IP addresses or user accounts.

**Prevention:** Apply rate limiting at multiple levels — IP address, user account, and application. Use libraries such as `express-rate-limit`. Validate request payloads to reject oversized bodies before processing begins.

```js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

## 4. Broken Function Level Authorization

An attacker calls a privileged function — such as `delete_course()` — because the server never checks whether the caller has admin rights. The route exists and is reachable; authorization is simply missing.

**Prevention:** Check the caller's role before executing any privileged function. Never expose admin-only routes without server-side role verification. Supplement with penetration testing and vulnerability scanners to find unchecked routes.

```js
if (req.user.role !== 'admin') {
  return res.status(403).send('You are not authorized to perform this action');
}
```

## 5. Broken Object-Level Authorization (BOLA)

A student editing their own profile sends `PUT /api/users/42/edit-profile`. Nothing stops them from changing `42` to `99` and editing another user's profile. The server validates that the user is authenticated but never checks whether the authenticated user owns object `99`.

**Prevention:** Use a multi-layered approach: Role-Based Access Control (RBAC) for function-level checks, combined with object-level Access Control Lists (ACLs) to verify ownership. Fine-grained controls at the object level catch the cases that role checks miss.

> **Q:** ISAQuiz12 Q10 shows an Express route `PUT /update-profile/:userId` guarded by `isResourceOwner` middleware. What vulnerability does a bug in `isResourceOwner` expose?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** Broken Object-Level Authorization (BOLA). If `isResourceOwner` does not correctly verify that the authenticated user owns the requested `userId`, other users can modify profiles they do not own. ISAQuiz12 Q7 showed the same pattern with a hardcoded owner ID — the function always returned `'user123'` instead of checking the actual resource owner.
> </details>

## 6. Mass Assignment

A user model has `name`, `email`, and `password` fields. If the API passes `req.body` directly to the model, an attacker adds `"isAdmin": true` to the request body and elevates their own privileges. The vulnerability is that the API trusts the client to send only the fields it should control.

**Prevention:** Never pass the raw request body to a model. Whitelist the specific properties you accept. Use input validation libraries to strip or reject unexpected keys.

```js
// WRONG — attacker can inject isAdmin, isBanned, etc.
const user = await User.update(req.body);

// RIGHT — only accept expected fields
const { name, email } = req.body;
const user = await User.update({ name, email });
```

## 7. Security Misconfiguration

Default passwords left on database management systems, secret keys hardcoded in source code, and detailed error stacks sent to clients all count as security misconfigurations. A hardcoded JWT secret key exposed in source control gives any attacker the ability to forge tokens.

**Prevention:** Disable unnecessary services and features. Store secrets in environment variables, not in source code. Return generic error messages to clients — log details server-side only.

```js
// WRONG — secret is hardcoded and visible in source
jwt.verify(token, 'secretkey', (err, decoded) => { ... });

// RIGHT — load from environment variable
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { ... });
```

## 8. Injection (SQL, NoSQL, Command)

Untrusted user input is concatenated directly into a SQL query, NoSQL query, or shell command. The database or shell executes the injected payload as a command, not as a data value. An attacker sets `newEmail` to `' WHERE 1=1; DROP TABLE users; --` and the server deletes the table.

**Prevention:** Use parameterized queries. The `?` placeholder tells the database driver to treat the substituted value as a data string — SQL syntax in the value is never interpreted as SQL.

```js
// VULNERABLE — template literal embeds user input directly into SQL
const query = `UPDATE users SET email='${newEmail}' WHERE id=${userId}`;
const result = database.query(query);

// SAFE — parameterized query: values passed separately
const query = 'UPDATE users SET email=? WHERE id=?';
const result = database.query(query, [newEmail, userId]);
```

> **Q:** Which of these prevents SQL injection: using `.replace()` to strip quotes from user input, or using `?` placeholders with a separate values array?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** Parameterized queries (`?` placeholders). The `.replace()` approach strips single quotes but fails against other characters, hex encodings, and multi-byte sequences that attackers use to bypass string sanitization. The database driver with parameterized queries treats the entire substituted value as a data literal — SQL syntax in the value never executes. ISAQuiz12 Q2 confirmed this directly.
> </details>

> **Pitfall**
> `.replace()` is NOT a SQL injection fix. It is bypassable with other character encodings and attack vectors that do not rely on single quotes. Only parameterized queries with `?` placeholders actually prevent injection, because the database driver separates SQL structure from data at the protocol level. Source: ISAQuiz12 Q2, exam-strategy Pitfall 5.

**Takeaway:** Each of the eight vulnerabilities has a predictable entry point: trust the client, skip a check, or expose too much. The fixes follow a pattern — validate and filter input, check authorization at both function and object level, use parameterized queries, store secrets in environment variables, and rate-limit credential endpoints. Parameterized queries and object-level authorization checks appear on exams repeatedly because they are the most commonly missed.
