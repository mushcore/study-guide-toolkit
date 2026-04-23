---
id: password-hashing
title: "bcrypt — hashing passwords for secure storage"
pillar: tech
priority: mid
source: "Slide 9, Slide 11"
bloom_levels: [understand, apply]
related: [jwt, api-security-best-practices]
---

## The concrete case

Your registration endpoint receives a password. You store it in a database. A year later, that database is breached. Every user whose password you stored as plaintext — or encrypted, with your key on the same server — is now fully compromised. Hashing is the only storage strategy that limits that damage: the attacker gets hashes, not passwords.

## Hash vs encrypt

| Property | Hash | Encrypt |
|---|---|---|
| Reversible? | No | Yes |
| Key required to reverse? | No key exists | Yes |
| Safe for password storage? | Yes | No |

Hashing is a one-way function. No key, no reversal. Encryption is a two-way function: whoever holds the key can decrypt. A server that encrypts passwords always holds the decryption key, which means an attacker who reaches the server holds it too.

## bcrypt usage

**Install / require:**

```js
const bcrypt = require('bcrypt');
```

**Hash a password:**

```js
const hash = await bcrypt.hash(password, costFactor);
```

`bcrypt.hash()` is asynchronous and returns a Promise. You must `await` it. The second argument is the cost factor, which controls the number of hashing iterations (2^costFactor). Higher cost factor = slower hash = more resistant to brute force.

**Verify a password:**

```js
const match = await bcrypt.compare(password, hash);
```

Returns a boolean. `bcrypt.compare()` never decrypts — it hashes the submitted plaintext using the parameters stored inside the hash string and compares the result. This call is also async — `await` is required.

> **Example**
>
> Registration and login flow:
>
> ```js
> // Registration — hash before storing
> const COST_FACTOR = 10;
> const hashedPassword = await bcrypt.hash(req.body.password, COST_FACTOR);
> users.push({ email: req.body.email, password: hashedPassword });
>
> // Login — compare, never decrypt
> const user = users.find(u => u.email === req.body.email);
> const match = await bcrypt.compare(req.body.password, user.password);
> if (!match) return res.status(401).json({ message: 'Invalid credentials' });
> ```

> **Pitfall**
> Encrypting passwords instead of hashing. The server holds the decryption key. An attacker with server access can reverse every stored password in one step. Hashing removes this risk entirely.

**Pitfall 2:** Calling `bcrypt.hash()` without `await`. The variable receives a Promise object, not a hash string. Every subsequent `bcrypt.compare()` call will return `false`, breaking all logins with no obvious error.

**Takeaway:** Use `bcrypt.hash(password, costFactor)` to hash on storage and `bcrypt.compare(plaintext, hash)` to verify on login. Both are async — always await them. Hashing is one-way by design; encryption is the wrong tool for password storage.
