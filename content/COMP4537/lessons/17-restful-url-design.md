---
n: 17
id: restful-url-design
title: "RESTful URL Design and API Versioning"
hook: "A consistent URI structure lets any developer predict the endpoint for any operation — before reading your docs."
tags: [REST, URL-design, versioning, plural-nouns, URI]
module: "Web Architecture and Data Exchange"
priority: mid
source: "Slide 8, Slide 11"
bloom_levels: [remember, understand, apply]
related: [rest-anatomy, express-framework, nodejs-modules]
pedagogy: worked-example-first
---

Start with a complete example. The table below is a fully designed `/orders` API — every operation, its HTTP method, and its URI. Read it once, then the rules that generated it will be obvious.

| HTTP method | URI (Endpoint) | Action |
|-------------|----------------|--------|
| GET | /orders | List existing orders |
| POST | /orders | Place a new order |
| GET | /orders/1 | Get details for order #1 |
| GET | /orders/2 | Get details for order #2 |
| PUT | /orders/1 | Update order #1 |
| DELETE | /orders/1 | Cancel order #1 |

Three patterns appear in every row: the noun is plural (`orders`), a specific resource is addressed by appending its ID (`/1`, `/2`), and the HTTP method — not a verb in the URI — expresses the action.

## Plural nouns for resource names

Name every resource collection with a plural noun. The collection itself lives at `/orders`; a single item lives at `/orders/{id}`. This mirrors how humans read the URL: `/orders` means "the orders resource" and `/orders/1` means "order number 1 specifically."

Using verbs in URIs breaks this model. `/getOrders` is not a resource name — it is a function name. HTTP already provides the verb (`GET`). Using both creates redundancy and forces each new operation to invent a new path.

## Path parameters for single-resource operations

When an operation targets one specific resource, encode the identifier in the path — not in a query string. `/patients/1` is correct; `/patients?id=1` is wrong for single-resource CRUD.

The slide 11 patient API demonstrates the full set:

| Method | URI | Description |
|--------|-----|-------------|
| GET | /patients | Retrieves all patients |
| GET | /patients/{patient-id} | Retrieves one patient by ID |
| GET | /patients/name/{patient-name} | Retrieves patients whose name includes the given string |
| GET | /visits/{date1}/{date2} | Returns all visits between two dates |
| POST | /patients | Creates a new patient |
| PUT | /patients/{patient-id} | Updates a patient by ID |
| DELETE | /patients/{patient-id} | Deletes a patient by ID |

The `{date1}/{date2}` segment on the visits endpoint shows how multiple path parameters compose: each segment narrows the resource further.

## Query strings for filtering and customization

A query string — the `?name=value&another-name=value` portion of a URL — passes additional values to customize output without changing the resource being addressed.

Consider the full anatomy of a URI:

```text
http://example.com/api/orders/1/uri-encoder?name=value&another-name=value
|_______________|  |______________________|  |______________________________|
     domain             URI path                       query string
```

- **Domain** — the physical server where the API is hosted.
- **URI path** — the identifier that maps to a specific resource or script on the server.
- **Query string** — part of a GET request that passes values to customize output.

Use path parameters for identity (`/patients/1`) and query strings for filtering, sorting, or pagination (`/patients?page=2&limit=10`).

## API versioning strategy

Exposing an API publicly creates a contract. When a breaking change is necessary — a change in response format, a change in a field's type, or removal of an endpoint — existing clients must not break silently.

The solution is to include the version number as part of the URI:

```text
http://api.example.com/v1
http://example.com/API/v1/gfhdrr
```

This produces versioned endpoints like `GET /v1/patients/` alongside an unversioned pointer. The unversioned path `/catalog` always redirects to the latest version using HTTP `3xx` status codes. Requesting `/catalog` causes a redirect to `/v2/catalog`.

A version-specific URI from the course patient API: `mydomain.com/V1/API/Patients/1` and `mydomain.com/V1.1/API/Patients/1`.

### When to version

Version only when a breaking change is made:

- The format of the response data changes.
- A field type changes (for example, integer to float).
- An endpoint is removed or its behaviour is fundamentally altered.

Non-breaking additions — new optional response fields, new endpoints — do not require a new version.

> **Q:** A client calls `GET /v1/patients/42` and gets back `{ "id": 42, "name": "Jane" }`. You add a new optional field `"email"` to the response. Do you need to release `/v2/patients/42`?
> **A:** No. Adding an optional field is non-breaking. Clients that ignore unknown fields continue working. Version only when existing clients would break.

> **Pitfall**
> POST /orders creates a new resource; PUT /orders/1 replaces an existing one — confusing these sends the wrong HTTP method. POST on a collection creates; PUT on an individual URI replaces. Sending POST to `/orders/1` is ambiguous and most REST frameworks will reject or mishandle it.

> **Pitfall**
> `/catalog` without a version prefix always points to the latest version — but this only works if versioning was in place before the first public release. Adding versioning retroactively means the original `/catalog` clients are already calling the unversioned path, and redirecting them to `/v2/catalog` silently breaks their contract. Start versioning before the first release, not after.

> **Takeaway**
> RESTful URI design has three rules: plural nouns name resource collections, path parameters identify individual resources, and HTTP methods express actions. API versioning belongs in the URI path (`/v1/`) from day one — adding it retroactively breaks existing clients.
