---
n: 12
id: rest-anatomy
title: "HTTP method selection for a patient API"
lang: js
tags: [REST, HTTP-methods, fetch, express]
source: "Slide 8, Quiz 7"
---

## Prompt

Given a patient management API at `https://api.example.com/v1/patients`, write the client-side JavaScript `fetch()` calls for:

1. Get all patients
2. Create a new patient named "Alice", age 30
3. Replace patient #5's record entirely (id=5, name="Bob", age=25)
4. Delete patient #5

Use the correct HTTP method for each operation.

---

## Starter

```js
const BASE = "https://api.example.com/v1/patients";

// 1. Get all patients
async function getAllPatients() {
  // TODO: fetch with the correct HTTP method
  // Hint: this method is bookmarkable and cached
}

// 2. Create a new patient: { name: "Alice", age: 30 }
async function createPatient(data) {
  // TODO: fetch with the correct HTTP method
  // Hint: this method has no size limit and creates a new resource
  // Hint: include Content-Type header and put data in the body
}

// 3. Replace patient #5 entirely: { id: 5, name: "Bob", age: 25 }
async function replacePatient(id, data) {
  // TODO: fetch with the correct HTTP method
  // Hint: this method replaces the ENTIRE record; it is idempotent
}

// 4. Delete patient #5
async function deletePatient(id) {
  // TODO: fetch with the correct HTTP method
  // Only the ID is needed — no body
}
```

---

## Solution

```js
const BASE = "https://api.example.com/v1/patients";

// 1. Get all patients
async function getAllPatients() {
  const res = await fetch(`${BASE}/`);
  const patients = await res.json();
  return patients;
}

// 2. Create a new patient
async function createPatient(data) {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // Expect 201 Created
  const newPatient = await res.json();
  return newPatient;
}

// 3. Replace patient #5 entirely
async function replacePatient(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // Expect 200 OK — resource replaced, not newly created
  const updated = await res.json();
  return updated;
}

// 4. Delete patient #5
async function deletePatient(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
  // Expect 200 OK or 204 No Content
  return res.status;
}

// Usage
createPatient({ name: "Alice", age: 30 });
replacePatient(5, { id: 5, name: "Bob", age: 25 });
deletePatient(5);
```

---

## Why

**Operation 1 — GET:**
`fetch()` defaults to GET when no `method` is specified. GET retrieves data without modifying server state. GET requests are bookmarkable — the browser can save `https://api.example.com/v1/patients/` as a bookmark and replay it. GET responses are also cached by the browser. GET is not limited to simple cases: it is the correct method for any read-only operation.

**Operation 2 — POST:**
POST creates a new resource. The patient data goes in the request body, not the URL, so there is no size limit — POST can send gigabytes of data where GET cannot. The `Content-Type: application/json` header tells the server how to parse the body. The server returns `201 Created` (not `200 OK`) because a new resource was created.

**Operation 3 — PUT:**
PUT replaces the entire resource at a URI. Sending `PUT /patients/5` with `{ id: 5, name: "Bob", age: 25 }` overwrites every field of patient #5's record with the provided values. PUT is idempotent — sending the same PUT request 10 times leaves the record in the same state as sending it once. The server returns `200 OK` here (not `201`) because the resource already existed; it was replaced, not created. Do not use PATCH here — PATCH updates only the fields you send, not the whole record.

**Operation 4 — DELETE:**
DELETE removes the specified resource. Only the resource ID is needed in the URL — no request body is required. DELETE is idempotent: deleting patient #5 twice leaves the same result (patient #5 does not exist).

**Status code note:** Watch for the `201 Created` vs `200 OK` distinction. After `createPatient()`, the server returns `201`. After `replacePatient()`, the server returns `200`. The difference matters on the exam.
