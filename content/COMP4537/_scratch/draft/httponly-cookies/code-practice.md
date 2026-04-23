---
n: 1
id: httponly-cookies
title: "Set a secure HttpOnly cookie on login"
lang: js
tags: [HttpOnly, cookies, express, SameSite, Secure, withCredentials, CORS]
source: "Slide 9, Slide 10"
---

## Prompt

Build an Express.js server with a `/login` POST endpoint. On successful credentials, set a cookie that: (a) is inaccessible to JavaScript, (b) is transmitted over HTTPS only, (c) allows cross-origin requests, (d) expires after 60 seconds. The client makes cross-origin XMLHttpRequest requests with withCredentials set to true, so the server must configure CORS credentials headers and handle OPTIONS preflight.

## Starter

```js
const express = require('express');
const app = express();

app.use(express.json());

// TODO: add CORS middleware for cross-origin credential requests
// TODO: handle OPTIONS preflight

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // TODO: validate credentials
  // TODO: set secure HttpOnly cookie
});

app.listen(3000);
```

## Solution

```js
const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'secret') {
    res.setHeader(
      'Set-Cookie',
      'token=abc123; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=60'
    );
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(3000);
```

## Why

`HttpOnly` blocks `document.cookie` access in the browser, eliminating the attack surface for XSS-based token theft. `Secure` restricts the cookie to HTTPS. `SameSite=None` allows cross-origin cookie sending (required when client and server have different origins), but only works when `Secure` is also set. `Max-Age=60` sets a 60-second TTL. `Access-Control-Allow-Credentials: true` tells the browser to actually send the cookie on cross-origin requests when the client uses `withCredentials: true` — without it, the browser strips the cookie even with withCredentials set. Common wrong approach: storing the token in `localStorage` — localStorage is readable by any same-origin JavaScript, making it vulnerable to XSS injection.
