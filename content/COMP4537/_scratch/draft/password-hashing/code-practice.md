---
n: 6
id: password-hashing
title: "Hash passwords on registration and verify on login"
lang: js
tags: [bcrypt, hash, cost-factor, express, password-storage]
source: "Slide 11"
---

## Prompt

Complete the Express.js `/register` and `/login` routes. On registration, hash the user's password with bcrypt before storing. On login, compare the submitted password against the stored hash. Use a cost factor of 10.

## Starter

```js
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

const users = []; // in-memory store for demo

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // TODO: hash password, store user
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // TODO: find user, compare password, respond
});

app.listen(3000);
```

## Solution

```js
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

const users = [];
const COST_FACTOR = 10;

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, COST_FACTOR);
  users.push({ email, password: hashedPassword });
  res.status(201).json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
});

app.listen(3000);
```

## Why

`bcrypt.hash()` is async — omitting `await` stores a Promise object in the database instead of the hash, breaking all subsequent logins. The cost factor (10) controls the number of hashing iterations (2^10 = 1024); higher values make brute-force attacks slower at scale. `bcrypt.compare()` safely checks plaintext against the stored hash without decrypting — hashing is one-way by design. Common wrong approaches: (1) storing plaintext passwords — a database breach exposes every user's password directly; (2) encrypting instead of hashing — the server holds the decryption key, so an attacker with server access can reverse all passwords.
