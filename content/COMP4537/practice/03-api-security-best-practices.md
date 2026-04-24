---
n: 3
id: api-security-best-practices
title: "Fix SQL injection in an Express.js update endpoint"
lang: js
tags: [SQL-injection, parameterized-queries, express, security]
source: "Slide 12, ISAQuiz12 Q2"
kind: code
---

## Prompt

The following Express.js route is vulnerable to SQL injection. Identify the vulnerability and rewrite the route to prevent it using parameterized queries.

The route accepts a `userId` and `newEmail` from the request body and updates the user's email in the database. As written, an attacker can craft a `newEmail` value that contains arbitrary SQL — for example, `' WHERE 1=1; DROP TABLE users; --` — and the database will execute the injected command.

Your task: rewrite the route so that user-supplied values are never embedded directly into the query string.

```
Attack flow:

  Client request body:
  {
    "userId": 42,
    "newEmail": "' WHERE 1=1; DROP TABLE users; --"
  }

          |
          v

  Server builds query string:
  UPDATE users SET email='' WHERE 1=1; DROP TABLE users; --' WHERE id=42

          |
          v

  Database executes:
  1. UPDATE users SET email='' WHERE 1=1  ← modifies all rows
  2. DROP TABLE users                     ← deletes the table
  3. Remainder ignored as comment
```

## Starter

```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database');

app.use(bodyParser.json());

app.put('/update-user', bodyParser.json(), (req, res) => {
  const userId = req.body.userId;
  const newEmail = req.body.newEmail;

  const query = `UPDATE users SET email='${newEmail}' WHERE id=${userId}`;
  const result = database.query(query);

  res.json(result);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

## Solution

```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const database = require('./database');

app.use(bodyParser.json());

app.put('/update-user', bodyParser.json(), (req, res) => {
  const userId = req.body.userId;
  const newEmail = req.body.newEmail;

  const query = 'UPDATE users SET email=? WHERE id=?';
  const result = database.query(query, [newEmail, userId]);

  res.json(result);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

## Why

Template-literal string interpolation embeds user input directly into the SQL string. An attacker sets `newEmail` to `' WHERE 1=1; DROP TABLE users; --` to execute arbitrary SQL. Parameterized queries (`?` placeholders) separate the SQL structure from the data values — the database driver escapes substituted values as data, so injected SQL syntax never executes. The `.replace()` approach (removing quotes from input) fails because attackers use other characters or encodings to bypass it. The ISAQuiz12 Q2 exam question confirmed parameterized queries as the only correct fix.
