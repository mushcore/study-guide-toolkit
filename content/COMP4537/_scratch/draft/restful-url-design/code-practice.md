---
n: 14
id: restful-url-design
title: "Design the URI table for a blog API"
lang: text
tags: [REST, URL-design, versioning, plural-nouns]
source: "Slide 11"
---

## Prompt

Design the complete URI table for a blog API with two resources: `posts` and `comments`. The API must support:

1. List all posts
2. Create a post
3. Get one post by ID
4. Update a post entirely
5. Delete a post
6. List all comments on a specific post
7. Create a comment on a specific post

Use RESTful conventions: plural nouns, `{id}` path parameters, HTTP methods as the action verb (no verbs in URIs).

Also answer: the API is currently at v1. What URI prefix should you use for versioned endpoints? What URI should a client call if they always want the latest version?

## Starter

Complete the URI column. The method column is filled for you. Use `{post-id}` and `{comment-id}` for path parameters.

```text
| HTTP method | URI                          | Action                             |
|-------------|------------------------------|------------------------------------|
| GET         |                              | List all posts                     |
| POST        |                              | Create a new post                  |
| GET         |                              | Get a specific post by ID          |
| PUT         |                              | Replace a specific post entirely   |
| DELETE      |                              | Delete a specific post             |
| GET         |                              | List all comments on a post        |
| POST        |                              | Create a comment on a specific post|
```

Versioning:
- Versioned base URI: ___________
- Latest-pointer URI (no version): ___________ → redirects to ___________
```

## Solution

```text
| HTTP method | URI                                    | Action                              |
|-------------|----------------------------------------|-------------------------------------|
| GET         | /v1/posts                              | List all posts                      |
| POST        | /v1/posts                              | Create a new post                   |
| GET         | /v1/posts/{post-id}                    | Get a specific post by ID           |
| PUT         | /v1/posts/{post-id}                    | Replace a specific post entirely    |
| DELETE      | /v1/posts/{post-id}                    | Delete a specific post              |
| GET         | /v1/posts/{post-id}/comments           | List all comments on a post         |
| POST        | /v1/posts/{post-id}/comments           | Create a comment on a specific post |
```

Versioning:
- Versioned base URI: `/v1/posts`, `/v1/posts/{post-id}/comments`
- Latest-pointer URI: `/posts` → HTTP 302 redirect → `/v2/posts` (when v2 becomes latest)

## Why

**Why plural nouns?**
`/posts` represents the entire collection of posts. `/posts/{post-id}` represents one item in that collection. The same path prefix serves both purposes — collection operations at the root, single-resource operations with an appended ID segment. Singular nouns (`/post`) break this symmetry and make the collection endpoint read incorrectly.

**Why `{post-id}` in the path and not as a query string?**
Path parameters encode resource identity. `GET /posts/42` says "the resource at this specific address is post 42." Query strings encode customization: `GET /posts?author=jane` filters the collection. Using `GET /posts?id=42` for a single resource blurs the line between identity and filtering, and PUT/DELETE have no natural place to accept a query string for identity.

**What triggers a new version?**
Version only when a breaking change is made: the format of response data changes, a field type changes (for example, `id` changes from integer to UUID string), or an endpoint is removed. Adding new optional fields or new endpoints is non-breaking and does not require incrementing the version.

**What does `/posts` → redirect to `/v2/posts` mean?**
The unversioned path is a convenience pointer that always redirects to the latest version using an HTTP `3xx` status code. A client calling `/posts` follows the redirect automatically and receives the v2 response. This works only if versioning was in place before the first public release — clients that already call `/posts` without a version prefix have no migration step when the pointer advances from v1 to v2.
