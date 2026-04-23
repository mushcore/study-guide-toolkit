---
id: rest-anatomy
title: "REST API anatomy reference"
pillar: tech
priority: high
source: "Slide 3, Slide 8, Quiz 6, Quiz 7"
bloom_levels: [remember, understand, apply]
related: [restful-url-design, ajax-cors, express-framework]
---

A patient management API at `https://api.example.com/v1/patients` illustrates every concept here. Each request you send has four parts: an endpoint (the URL), headers (metadata), a body (the payload), and an HTTP method (the action). The server's response includes a status code and its own headers.

---

## HTTP methods

| Method | What it does | Idempotent? | Typical use | When NOT to use |
|--------|-------------|-------------|-------------|-----------------|
| GET | Retrieve a resource; returns data only | Yes | `GET /patients/` — list all; `GET /patients/1/` — get one | Never use GET to send credentials — data appears in the URL |
| POST | Create a new resource instance | No | `POST /patients/` — create patient; use when sending large data | Do not use POST when you only need to read data |
| PUT | Replace the entire resource at a URI | Yes | `PUT /patients/1` — replace patient #1's full record | Do not use PUT when you only want to update one field |
| PATCH | Update one or more fields of a resource | No | `PATCH /patients/1` — update just the phone number | Do not use PATCH when you need to replace the whole record |
| DELETE | Delete the specified resource | Yes | `DELETE /patients/1/` — delete patient #1 by ID | Requires only the resource ID; no body needed |
| HEAD | Same as GET but without a response body | Yes | Check if a resource exists without downloading it | Not for data retrieval when you need the body |

PUT replaces the entire resource; PATCH updates a single property.

An operation is idempotent if applying it multiple times produces the same result as applying it once. Sending `PUT /patients/1` with the same payload ten times leaves the record in the same state as sending it once. Sending `POST /patients/` ten times creates ten records.

---

## GET vs POST behavioral differences

| Behavior | GET | POST |
|----------|-----|------|
| Data location | URL query string | Request body |
| Bookmarkable | Yes | No |
| Cached by browser | Yes | No |
| Appears in browser history | Yes | No |
| Size limit | Yes — URL length limit | No |
| Safe to send credentials | No | No (use HTTPS + auth headers) |

---

## Status code ranges

| Range | Category | Common example |
|-------|----------|----------------|
| 1xx | Informational responses | 100 Continue |
| 2xx | Successful responses | 200 OK, 201 Created |
| 3xx | Redirects | 301 Moved Permanently |
| 4xx | Client errors | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Server errors | 500 Internal Server Error |

**200 OK** — the request succeeded. For GET, the resource was fetched. For PUT/POST, the result is transmitted.

**201 Created** — a new resource was created. Returned after a successful POST or some PUT requests.

---

## Pitfalls

> **Pitfall**
> GET has a URL size limit; POST does not. The claim "there are no size limits for both GET and POST" is false. GET data goes into the URL query string, which browsers and servers cap at a few kilobytes. POST data goes in the request body — no size limit. Exam questions present this as a true/false trap.

> **Pitfall**
> PUT vs PATCH confusion — PUT is idempotent, PATCH is not. PUT replaces the entire resource at a URI with the request payload. Sending PUT with a partial object overwrites the rest of the fields with nothing. PATCH applies only the fields you send. Confusing them in an exam scenario (e.g., "edit one profile field") costs marks — the answer is PATCH, not PUT.

---

## Example: choosing the right HTTP method

> **Example**
>
> **Scenario:** You are building a patient management API. For each situation below, pick the correct HTTP method.
>
> Step 1: Is the client reading data without changing anything? → **GET** `/patients/` (list all) or `GET /patients/1` (get one).
>
> Step 2: Is the client creating a new resource that does not yet exist? → **POST** `/patients/` — body contains the new patient's data; server assigns the ID.
>
> Step 3: Is the client replacing an entire existing resource (all fields supplied)? → **PUT** `/patients/1` — the full record is overwritten. Missing fields in the payload become empty/null.
>
> Step 4: Is the client changing only one or a few fields on an existing resource? → **PATCH** `/patients/1` — only the changed fields are sent; everything else is left untouched.
>
> Step 5: Is the client removing a resource permanently? → **DELETE** `/patients/1` — ID in the URL; no request body needed.
>
> Decision rule: GET=read, POST=create new, PUT=replace whole, PATCH=update field(s), DELETE=remove.

---

## Example: tracing a POST /patients/ request

**Scenario:** Create a new patient named Alice, age 30.

**Request**

```
POST https://api.example.com/v1/patients/
```

Headers sent by the client:
```
Content-Type: application/json
Authorization: Bearer <token>
API-Key: abc123xyz
```

Body sent by the client:
```json
{
  "name": "Alice",
  "age": 30
}
```

**Why POST?** The request creates a new resource. POST is not idempotent — calling it twice creates two patients. The data is in the body, not the URL, so there is no size constraint and the credentials are not exposed in the URL.

**Server response**

Status line: `201 Created`

Response headers:
```
Content-Type: application/json
Location: https://api.example.com/v1/patients/42/
```

Response body:
```json
{
  "id": 42,
  "name": "Alice",
  "age": 30
}
```

The server returns `201 Created` (not `200 OK`) because a new resource was created. The `Location` header tells the client where to find the new resource.

---

**Takeaway:** Match the HTTP method to the action — GET retrieves, POST creates, PUT replaces the whole record, PATCH updates one field, DELETE removes. GET is bookmarkable and cached but has a URL size limit. POST has no size limit. Status 201 signals creation; 200 signals success without creation. Never send credentials via GET.
