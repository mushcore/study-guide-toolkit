---
n: 2
id: jwt
title: "Sign and verify a JWT in Express.js"
lang: js
tags: [JWT, express, HS256, secret-key, httpOnly-cookie, environment-variable]
source: "Slide 10"
---

## Prompt

An Express.js login endpoint must: (1) validate credentials, (2) sign a JWT with a secret key using HS256 with a 2-minute expiration, (3) return the JWT in an HttpOnly cookie. A separate `/protected` endpoint must verify the JWT from the cookie and respond with the decoded payload or a 401.

## Starter

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const TOKEN_SECRET = process.env.TOKEN_SECRET; // store in env

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // TODO: validate, sign JWT, set httpOnly cookie
});

app.get('/protected', (req, res) => {
  const token = req.cookies?.token;
  // TODO: verify JWT and respond
});

app.listen(3000);
```

## Solution

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

const TOKEN_SECRET = process.env.TOKEN_SECRET;

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'secret') {
    const token = jwt.sign({ username }, TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: '120s',
    });
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=120`);
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/protected', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    res.json({ payload: decoded });
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.listen(3000);
```

## Why

`jwt.sign()` with `algorithm: 'HS256'` and `expiresIn` produces a signed, time-limited token the server can verify without storing session state. Storing the token in an HttpOnly cookie means JavaScript can never read it, blocking XSS-based token theft. Placing `TOKEN_SECRET` in an environment variable keeps it out of source code. Common wrong approaches: (1) signing with no `expiresIn` — a stolen token never expires; (2) storing the JWT in `localStorage` — readable by any injected script; (3) using a short, guessable secret like `'shhhhh!'` — HMAC security depends on secret length and randomness.
