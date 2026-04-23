---
n: 14
id: rest-anatomy
title: "Anatomy of Web APIs"
module: "Web Architecture and Data Exchange"
tags: [REST, API, endpoint, headers, HTTP-methods, status-code]
priority: high
source: "Slide 3, Slide 8, Quiz 6, Quiz 7"
bloom_levels: [remember, understand, apply, analyze]
related: [restful-url-design, ajax-cors, nodejs-modules]
pedagogy: productive-failure
hook: "An API server that returns JSON instead of HTML stays stable even when the UI redesigns — here is how every part of that contract is structured."
---

## The problem HTML scraping creates

Imagine you scrape IMDB for movie ratings. Your scraper reads the HTML, parses it, and extracts the data you need. Then IMDB redesigns their page. Your scraper breaks — every selector is wrong.

The solution is an API server that returns JSON or XML. The rule of thumb is: OMDb does not change what a given URL returns. The structure of the data stays stable even when the UI changes. That stability is why web APIs exist.

---

## The four parts of a web API call

Every API call has four components: headers, body, endpoint, and HTTP method.

### 1. Endpoint

The endpoint is the URL where the API server is listening. It is the address you send your request to.

Example: `https://api.example.com/v1/patients/`

### 2. Headers

Headers carry additional details for client-server communication.

**Request headers** include:
- `API-key` — a subscription key so the server knows who is making the request
- `count` — the number of objects you want
- `pageNo` — which page of results to return

**Response headers** include:
- `status` — the HTTP status code
- `content-type` — the type of resource being returned (e.g., `text/html`, `image/png`, `application/json`)

### 3. Body (Data)

The body contains the information you want to send to the server. A POST request creating a new patient sends the patient's data in the body. A GET request has no body.

### 4. HTTP Methods

The HTTP method tells the server what action to perform on the resource.

| Method | Action | Idempotent? |
|--------|--------|-------------|
| GET | Retrieve a resource; should only retrieve data | Yes |
| POST | Create a new resource instance | No |
| PUT | Replace the entire resource at a URI | Yes |
| PATCH | Update one or more fields of a resource | No |
| DELETE | Delete the specified resource | Yes |
| HEAD | Same as GET but without a response body | Yes |

An operation is idempotent if applying it multiple times produces the same result as applying it once. PUT replaces the entire resource; PATCH updates a single property.

---

## GET vs POST: behavioral differences

GET is simpler and faster, and handles most read operations. But GET and POST behave differently in several ways you need to know for the exam.

| Behavior | GET | POST |
|----------|-----|------|
| Bookmarkable | Yes | No |
| Cached by browser | Yes | No |
| Stays in browser history | Yes | No |
| Size limit | Yes (URL length limit) | No |
| Data location | URL query string | Request body |

> **Q:** Which HTTP method can send 1 GB of data?
> **A:** POST. GET appends data to the URL, which has a length limit. POST places data in the request body, which has no size limit.

> **Q:** GET requests can be bookmarked — true or false?
> **A:** True. Because GET data appears in the URL, the browser can save and replay the request as a bookmark. POST data is in the body and cannot be bookmarked.

---

## When to use each method

Use the patient API as a mental model:

- **GET** `API/v1/patients/` — get a list of all patients
- **GET** `API/v1/patients/1/` — get one patient by ID
- **POST** `API/v1/patients/` — create a new patient (data in body)
- **PUT** `API/v1/patients/1` — replace patient #1's record entirely
- **PATCH** `API/v1/patients/1` — update one field on patient #1
- **DELETE** `API/v1/patients/1/` — delete patient #1 (only needs the ID)

Use POST when sending large amounts of data — POST has no size limitations. Use PUT when you are replacing an object entirely with something new. Use PATCH when you are updating only one property.

---

## Status codes

Status codes appear in the response headers. The first digit tells you the category.

| Range | Category |
|-------|----------|
| 1xx | Informational responses |
| 2xx | Successful responses |
| 3xx | Redirects |
| 4xx | Client errors |
| 5xx | Server errors |

Key codes:
- **200 OK** — request succeeded. For GET, the resource was fetched and transmitted. For PUT/POST, the result is transmitted.
- **201 Created** — a new resource was created, typically after POST or some PUT requests.

---

## Pitfalls

**Pitfall:** Sending credentials via GET is not safe. GET data appears in the URL — the username and password are visible in browser history, server logs, and any proxy between client and server. Always use POST (or a more secure mechanism) when sending credentials.

**Pitfall:** "There are no size limits for both GET and POST" is false. GET appends data to the URL; URLs have a length limit enforced by browsers and servers. POST places data in the body and has no size limit. Exam questions test this directly.

---

**Takeaway:** An API call has four parts — endpoint, headers, body, and HTTP method. GET retrieves and is bookmarkable but has a URL size limit. POST creates and has no size limit. PUT replaces the entire resource; PATCH updates a single property. Status codes group by first digit: 2xx success, 4xx client error, 5xx server error.
