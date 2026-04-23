---
n: 6
id: password-hashing
title: "Password hashing with bcrypt — why hash, not encrypt"
hook: "Even you shouldn't be able to recover a stored password — hashing is how you guarantee that."
tags: [bcrypt, hash, salt, password-storage]
module: "API Security"
source: "Slide 9, Slide 11"
bloom_levels: [understand, apply]
related: [jwt, api-security-best-practices, httponly-cookies]
---

## The problem: what happens when your database leaks

Imagine an attacker exfiltrates your users table. If you stored passwords as plaintext, every user's password is immediately readable. If you encrypted them, the attacker can also steal your server's decryption key — and reverse every password in one step. Neither approach protects your users.

The fix is hashing. A hash function maps input of any size to a fixed-size output. That mapping is one-way: given the hash, there is no algorithm to recover the original input. Even the server cannot reverse it. A database breach exposes hashes, not passwords.

## Hash vs encrypt

Hashing and encryption are not interchangeable — they solve different problems.

- **Encryption** is reversible. The server holds a key. Anyone who gains that key can decrypt all stored values. Password storage cannot rely on encryption because the server always holds the risk.
- **Hashing** is one-way. No key exists. Given `hash(password)`, the server can verify a submitted password by hashing it and comparing, but cannot recover the original. This is the property password storage requires.

**Pitfall:** Encrypting passwords instead of hashing is a security misconfiguration. An attacker with server access — through a vulnerability, insider threat, or subpoena — gains the decryption key and can reverse every stored password. Hashing removes that attack surface entirely.

## bcrypt in Node.js

Install the library and require it:

```js
const bcrypt = require('bcrypt');
```

Hash a password on registration:

```js
const hashedPassword = await bcrypt.hash(plaintext, 10);
```

`bcrypt.hash()` is asynchronous — it returns a Promise. You must `await` it. If you omit `await`, you store a Promise object in the database, not a hash. All subsequent logins will break silently.

## The cost factor

The second argument to `bcrypt.hash()` is the **cost factor** (also called salt rounds). The value `10` means bcrypt performs 2^10 = 1,024 internal hashing iterations before producing the final hash.

A higher cost factor makes each hash slower to compute. Slower hashing is good for password storage: an attacker running millions of brute-force guesses per second pays the full cost for every attempt. Raising the cost factor from 10 to 12 makes brute-force roughly four times harder with no change to your API.

> **Q:** What does the `10` in `bcrypt.hash('123', 10)` control?
>
> **A:** It is the cost factor. It sets the number of hashing iterations to 2^10 = 1,024. A higher value makes each hash computation slower, which makes brute-force attacks more expensive for an attacker.

## Verifying a password on login

Never decrypt a stored hash. Instead, hash the submitted plaintext and compare:

```js
const match = await bcrypt.compare(plaintext, storedHash);
```

`bcrypt.compare()` returns a boolean: `true` if the plaintext matches the hash, `false` otherwise. It never decrypts. It never exposes the original password. This call is also asynchronous — `await` is required.

**Takeaway:** Hash passwords with bcrypt before storage. Never store plaintext or encrypted passwords. `bcrypt.hash(password, costFactor)` is async — always await it. The cost factor controls brute-force resistance. Verify with `bcrypt.compare()`, which returns a boolean and never decrypts.
