---
id: express-framework
title: "Express routing and RESTful API design"
pillar: tech
priority: mid
tags: [express, routing, middleware, rest, npm]
bloom_levels: [understand, apply, analyze]
source: "Slide 8"
related: [nodejs-basics, ajax-cors, rest-anatomy, restful-url-design]
---

## Building a patients CRUD API with Express

Slide 8 builds a patients API end-to-end: one server, four endpoints, JSON in and out. That API is the clearest model for what an Express RESTful server looks like when all the pieces are in place.

> **Example**
>
> **Step 1 — scaffold the project**
> ```bash
> npm init --yes
> npm install express
> ```
>
> **Step 2 — create `server.js`**
> ```js
> const express = require('express');
> const app = express();
> const PORT = process.env.PORT || 8888;
> ```
>
> **Step 3 — register CORS middleware (before all routes)**
> ```js
> app.use((req, res, next) => {
>     res.setHeader('Access-Control-Allow-Origin', '*');
>     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
>     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
>     next();
> });
> app.use(express.json());
> ```
>
> **Step 4 — define endpoints**
> ```js
> // GET all patients
> app.get('/api/v1/patients', (req, res) => {
>     res.json(patients);
> });
>
> // GET one patient by id
> app.get('/api/v1/patients/:id', (req, res) => {
>     const id = req.params.id;
>     res.json(patients[id]);
> });
>
> // POST — create new patient (not idempotent)
> app.post('/api/v1/patients', (req, res) => {
>     const data = req.body;
>     // save data ...
>     res.status(201).json({ message: 'Patient created' });
> });
>
> // PUT — replace entire patient record (idempotent)
> app.put('/api/v1/patients/:id', (req, res) => {
>     const id = req.params.id;
>     // replace full record with req.body ...
>     res.json({ message: 'Patient replaced' });
> });
>
> // DELETE — remove patient
> app.delete('/api/v1/patients/:id', (req, res) => {
>     const id = req.params.id;
>     // remove ...
>     res.json({ message: 'Patient deleted' });
> });
> ```
>
> **Step 5 — start the server**
> ```js
> app.listen(PORT, () => {
>     console.log(`Server running on port ${PORT}`);
> });
> ```

---

## HTTP method semantics

> **Pitfall**
> POST creates a new resource and is not idempotent — calling it twice creates two records. PUT replaces the existing resource and is idempotent — an operation is idempotent if applying it multiple times produces the same result as applying it once. Sending the same PUT twice leaves the resource in the same final state. PATCH modifies one property of the resource. These three methods have distinct semantics that are testable on the exam; do not treat them as interchangeable.

| HTTP method | Express method | Typical status code | Idempotent? | Action |
|-------------|---------------|---------------------|-------------|--------|
| GET | `app.get` | 200 OK | Yes | Read resource(s) |
| POST | `app.post` | 201 Created | No | Create new resource |
| PUT | `app.put` | 200 OK | Yes | Replace entire resource |
| PATCH | `app.patch` | 200 OK | Yes | Update one property |
| DELETE | `app.delete` | 200 OK | Yes | Remove resource |

GET is simpler and faster for small data retrieval. POST carries data in the request body, making it suitable for large payloads and for operations that create new server-side state.

---

## API versioning

The `/v1/` segment in `GET /api/v1/patients/` is an API versioning convention. It lets the server evolve endpoints without breaking existing clients — a v2 can coexist with v1 while clients migrate.

---

> **Takeaway**
> Express maps HTTP methods directly to method calls on the app object. Middleware registered with `app.use()` before route handlers applies to every request. POST is not idempotent; PUT replaces the entire resource and is idempotent; PATCH updates a single property. These distinctions are tested.
