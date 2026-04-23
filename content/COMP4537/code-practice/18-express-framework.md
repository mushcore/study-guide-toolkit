---
n: 18
id: express-framework
title: "Build an Express REST API with CORS middleware"
lang: js
tags: [express, routing, middleware, rest, npm]
source: "Slide 8"
---

## Prompt

Build an Express server that:

1. Reads the port from `process.env.PORT` with a fallback of `8888`.
2. Applies a CORS middleware (using `app.use`) that sets `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers` on every response, then calls `next()`.
3. Applies `express.json()` middleware to parse JSON request bodies.
4. Exposes four RESTful endpoints for a patients resource:
   - `GET /api/v1/patients` — return the full `patients` array as JSON.
   - `GET /api/v1/patients/:id` — return the patient at the given index.
   - `POST /api/v1/patients` — append `req.body` to `patients`, respond with status 201 and a JSON confirmation.
   - `PUT /api/v1/patients/:id` — replace the patient at the given index with `req.body`, respond with a JSON confirmation.
5. Starts the server on `PORT` and logs the port number.

## Starter

```js
const express = require('express');
const app = express();
const PORT = // TODO: read from process.env or default to 8888

// In-memory data store
let patients = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob',   age: 45 },
];

// TODO: CORS middleware — set the three Access-Control-Allow-* headers, then call next()
app.use((req, res, next) => {

});

// TODO: body-parsing middleware
app.use(/* ??? */);

// TODO: GET all patients
app.get('/api/v1/patients', (req, res) => {

});

// TODO: GET one patient by id (use req.params.id)
app.get('/api/v1/patients/:id', (req, res) => {

});

// TODO: POST — create new patient (data in req.body, respond 201)
app./* ??? */('/api/v1/patients', (req, res) => {

});

// TODO: PUT — replace entire patient at :id (data in req.body)
app./* ??? */('/api/v1/patients/:id', (req, res) => {

});

// TODO: start the server
app.listen(/* ??? */, () => {

});
```

## Solution

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8888;

// In-memory data store
let patients = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob',   age: 45 },
];

// CORS middleware — registered once, applies to every request
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next(); // must call next() or the request stalls
});

// Body-parsing middleware — populates req.body for POST and PUT
app.use(express.json());

// GET all patients — 200 OK with JSON array
app.get('/api/v1/patients', (req, res) => {
    res.json(patients);
});

// GET one patient by id — id comes from URL segment
app.get('/api/v1/patients/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const patient = patients.find(p => p.id === id);
    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
});

// POST — create new patient (not idempotent; each call adds a record)
app.post('/api/v1/patients', (req, res) => {
    const data = req.body;
    patients.push(data);
    res.status(201).json({ message: 'Patient created', patient: data });
});

// PUT — replace entire patient record at :id (idempotent)
app.put('/api/v1/patients/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    patients[index] = { ...req.body, id }; // replace all fields
    res.json({ message: 'Patient replaced', patient: patients[index] });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## Why

**Why must middleware call `next()`?**

Express processes middleware in the order registered. Each middleware either sends a response (ending the pipeline) or calls `next()` to hand off to the next middleware or route handler. CORS middleware only sets headers — it does not send a response. Without `next()`, Express has no signal to continue, so the request hangs and the client times out. Every middleware that does not terminate the request must call `next()`.

**Why is PUT idempotent but POST is not?**

An operation is idempotent if applying it multiple times produces the same result as applying it once. PUT sends a complete replacement document for a specific resource id. Sending the same PUT twice leaves the resource in exactly the same final state — the second call overwrites the first with identical data. POST, by contrast, creates a new resource on each call. Two identical POST requests produce two separate patient records.

**Common wrong approach: CORS headers inside each route handler**

Placing `res.setHeader('Access-Control-Allow-Origin', '*')` inside individual route handlers instead of shared middleware has two failure modes. First, any route you forget to update leaks CORS errors in the browser. Second, it does not handle the browser's preflight `OPTIONS` request — the browser sends `OPTIONS` before `POST` or `PUT` with `Content-Type: application/json`, and if the server has no `OPTIONS` handler, the preflight fails and the actual request is never sent. Middleware registered with `app.use()` runs for every request, including `OPTIONS`.
