---
id: restful-url-design
title: "RESTful URL conventions reference"
pillar: tech
priority: mid
source: "Slide 8, Slide 11"
bloom_levels: [remember, understand, apply]
related: [rest-anatomy, express-framework]
---

## Patient API — concrete starting point

Before the rules, the example. Every row below comes directly from Slide 8 and Slide 11 of the course:

| Method | URI | Description |
|--------|-----|-------------|
| GET | /v1/patients/ | Get the list of all patients |
| GET | /v1/patients/1/ | Get one single patient |
| DELETE | /v1/patients/1/ | Delete a patient (only the ID is needed) |
| POST | /v1/patients/ | Create a new patient (parameters in request body) |
| PUT | /v1/patients/1 | Replace a patient (parameters in body) |

The version prefix (`v1`), plural noun (`patients`), and numeric path parameter (`1`) are not accidents. Each follows a named convention.

## URI anatomy

A full URI has three distinct parts:

```text
http://example.com/api/orders/1/uri-encoder?name=value&another-name=value
|_______________|  |______________________|  |______________________________|
     domain             URI path                       query string
```

- **Domain** — the physical server where the API is hosted (`example.com`).
- **URI path** — the identifier that maps to a resource, file, or method on the server (`/api/orders/1/uri-encoder`). REST APIs use this to address resources.
- **Query string** — the `?key=value&key=value` portion of a GET request; passes values to customize output without changing which resource is addressed.

REST API designers create URIs to convey the API's resource model to consumers. The path encodes identity; the query string encodes customization.

## URI design conventions

| Convention | Rule | Example |
|------------|------|---------|
| Plural nouns | Name collections with plural nouns | `/patients`, `/orders`, `/visits` |
| Path parameters | Identify a single resource by ID in the path | `/patients/{patient-id}`, `/orders/1` |
| Multiple path params | Compose segments for multi-dimensional lookup | `/visits/{date1}/{date2}` |
| Query strings | Pass filter/sort/pagination values | `/patients?page=2&limit=10` |
| No verbs in path | HTTP method is the verb; URI is the noun | `/patients/1` not `/getPatient/1` |
| API versioning | Include version in URI path | `/v1/patients/`, `/v2/orders/` |
| Unversioned latest pointer | Path without version redirects to latest | `/catalog` → `302` → `/v2/catalog` |

## Designing a URI table — worked example

Design the complete endpoint table for an `/orders` resource.

**Step 1 — identify the collection endpoint.** The collection is named with a plural noun: `/orders`. Two operations act on the whole collection: listing all orders (`GET`) and creating a new one (`POST`).

**Step 2 — identify the single-resource endpoint.** A single order is addressed by appending its ID: `/orders/{id}`. Three operations target a specific order: fetching it (`GET`), replacing it entirely (`PUT`), and cancelling it (`DELETE`).

**Step 3 — add the version prefix.** Prepend `/v1/` to every path so the API can evolve without breaking existing clients.

**Step 4 — assemble the table.**

| HTTP method | URI | Action |
|-------------|-----|--------|
| GET | /v1/orders | List existing orders |
| POST | /v1/orders | Place a new order |
| GET | /v1/orders/{id} | Get details for a specific order |
| PUT | /v1/orders/{id} | Replace an order entirely |
| DELETE | /v1/orders/{id} | Cancel an order |

> **Example**
>
> Adding a sub-resource: list all comments on a specific post.
>
> The post is identified by `{post-id}`; its comments are a sub-collection:
>
> ```text
> GET /v1/posts/{post-id}/comments
> ```
>
> Sub-resources nest under the parent path segment. The rule is the same: plural noun, path parameter for the parent ID, then the child collection name.

## API versioning in depth

Include the version number as part of the URI path (`/v1/catalog`). Keep the unversioned path (`/catalog`) mapped to the latest version using an HTTP `3xx` redirect. Clients that always want the latest call `/catalog`; clients that need stability pin to `/v1/catalog`.

**When a new version is needed:**
- The format of the response data changes.
- A field type changes (for example, integer to float).
- An existing endpoint is removed or its behaviour fundamentally changes.

Non-breaking additions (new optional fields, new endpoints) do not require a new version number.

> **Pitfall**
> Don't use verbs in URIs. `/getPatient/1` is wrong; `/patients/1` is right — use the HTTP method to express the action. Verb-in-URI APIs grow a new path for every operation and break the uniform-interface constraint that makes REST predictable.

> **Pitfall**
> API versioning must start before the first public release. Clients that start calling `/patients/1` on day one have no version prefix. Adding `/v1/` later forces every existing client to update their endpoint strings — that is itself a breaking change. Design the versioned URI from the start.

> **Takeaway**
> A RESTful URI is a noun, not a verb. The collection lives at a plural noun (`/patients`); individual resources hang off an ID segment (`/patients/1`). The HTTP method supplies the action. Version in the path from day one so you can evolve without breaking clients.
