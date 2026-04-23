---
n: 22
id: express-framework
title: "Express: Routing, Middleware, and RESTful Endpoints"
hook: "Express gives you declarative routing and a middleware pipeline — two things raw Node.js http server forces you to build by hand."
tags: [express, routing, middleware, rest, npm]
module: "Node.js and Server-Side Development"
bloom_levels: [remember, understand, apply]
source: "Slide 8"
related: [nodejs-basics, nodejs-modules, ajax-cors, rest-anatomy, restful-url-design]
pedagogy: concreteness-fading
---

## Why Express exists

Without Express, each route in a raw `http` server requires manual string matching against `req.url`. Express replaces that with declarative routing — one line per endpoint, with the HTTP method baked in.

Express is an external npm package, not part of Node.js core. Install it with two commands:

```bash
npm init --yes        # creates package.json, tracks dependencies
npm install express   # or: npm i express
```

`npm init --yes` comes first. Running `npm install` without a `package.json` still works, but you lose dependency tracking.

> **Q:** What does `npm init --yes` produce, and why does it matter before installing Express?
> **A:** It creates `package.json`. Without it, installed packages are not recorded as dependencies and cannot be reproduced with `npm install` in a fresh environment.

---

## Route handlers

An Express route handler binds a URI pattern and an HTTP method to a callback. The callback receives `req` (incoming request) and `res` (outgoing response).

```js
const express = require('express');
const app = express();

app.get('/api/v1/patients', (req, res) => {
    res.json(patients);                      // 200 OK, JSON body
});

app.get('/api/v1/patients/:id', (req, res) => {
    const id = req.params.id;               // extract URL segment
    res.json(patients[id]);
});

app.post('/api/v1/patients', (req, res) => {
    const data = req.body;                  // parsed JSON from request body
    // ... save patient
    res.status(201).json({ message: 'Patient created' });
});

app.put('/api/v1/patients/:id', (req, res) => {
    const id = req.params.id;
    // replace entire patient record with req.body
    res.json({ message: 'Patient replaced' });
});

app.delete('/api/v1/patients/:id', (req, res) => {
    const id = req.params.id;
    // remove patient
    res.json({ message: 'Patient deleted' });
});
```

Each HTTP method maps to a distinct Express method: `app.get`, `app.post`, `app.put`, `app.delete`. URL segments prefixed with `:` are named parameters, accessible via `req.params`.

RESTful URL conventions from Slide 8:

| Action | Method | URL |
|--------|--------|-----|
| List all | GET | `/api/v1/patients/` |
| Get one | GET | `/api/v1/patients/:id` |
| Create | POST | `/api/v1/patients/` |
| Replace | PUT | `/api/v1/patients/:id` |
| Delete | DELETE | `/api/v1/patients/:id` |

> **Q:** In Express, which method registers a handler for `POST /api/v1/patients`?
> **A:** `app.post('/api/v1/patients', callback)`.

> **Pitfall**
> PUT replaces the entire resource. PATCH updates one property. Do not use them interchangeably. Sending a PUT with only a `name` field will erase every other field on the record — only the supplied fields survive.

---

## Middleware

Middleware is an Express function in the request pipeline that can read, modify, or short-circuit the request before the route handler. Register middleware with `app.use()`. Middleware registered before route handlers runs for every request.

Two middleware registrations almost every Express API needs:

### Body parsing

```js
app.use(express.json());
```

This parses incoming JSON request bodies and populates `req.body`. Without it, `req.body` is `undefined` inside route handlers.

### CORS headers

```js
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

`next()` passes control to the next middleware or route handler. A middleware that does not call `next()` (and does not send a response) stalls the request permanently.

`Access-Control-Allow-Headers` is required when the browser's preflight includes `Access-Control-Request-Headers` — which it does whenever the request carries `Content-Type: application/json`.

---

## Environment variables

The server port should not be hard-coded. `process.env.PORT` reads the `PORT` environment variable set by the hosting platform. If not set, its value is `undefined`.

```js
const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

The `|| 8888` fallback means local development uses port 8888 when `PORT` is not set in the environment.

---

> **Takeaway**
> Express adds declarative routing (one method call per endpoint), a composable middleware pipeline, and a clean JSON API surface over raw Node.js. The three setup steps that must happen in order: `npm init --yes`, `npm install express`, then register middleware with `app.use()` before route handlers. GET returns existing resources; POST creates new ones; PUT replaces entire resources; DELETE removes them.
