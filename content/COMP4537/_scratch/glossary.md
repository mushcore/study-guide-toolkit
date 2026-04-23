# Glossary — COMP4537

Read this before writing any content. Use the canonical form verbatim; never substitute a variant.

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| secret key | "secrete key", shared key, symmetric key | Shared key used by both parties for HMAC signing (e.g., JWT HS256); distinct from a private key | Slide 10 |
| private key | — | One half of an asymmetric key pair; kept secret by its owner; used to sign or decrypt | Slide 9, Slide 10 |
| public key | — | One half of an asymmetric key pair; shared openly; used to verify a signature or encrypt a message | Slide 9, Slide 10 |
| asymmetric encryption | public-key encryption | Encryption system using a mathematically linked key pair (public + private); no shared secret needed | Slide 9, Slide 10 |
| symmetric encryption | shared-key encryption | Encryption system where both parties use the same secret key to encrypt and decrypt | Slide 9, Slide 10 |
| RSA | — | Asymmetric algorithm based on integer factorization; used for key exchange and digital signing | Slide 9, Slide 10 |
| Diffie-Hellman | DH | Key-exchange protocol that lets two parties derive a shared secret over a public channel without transmitting it | Slide 9 |
| MSA | SOA, Microservice Architecture (in this course MSA = SOA) | Architectural style where a system is a set of independently deployable services; professor treats MSA and SOA as equivalent | Slide 2 |
| monolithic architecture | monolith | Single-deployable application where all components share one process and codebase | Slide 2 |
| API-centric architecture | — | Architecture where an API server is the primary component mediating all client-to-service communication | Slide 2 |
| origin | domain, URL | Exact triple of protocol + domain + port; the unit SOP enforces | Slide 5 |
| Same-Origin Policy (SOP) | same-origin policy | Browser rule blocking a script from reading responses from a different origin unless the server explicitly permits it | Slide 5 |
| CORS | Cross-Origin Resource Sharing | Header-based mechanism that lets a server whitelist origins allowed to make cross-origin requests | Slide 5, Quiz 6, Quiz 7 |
| preflight | pre-flight request | Browser-sent OPTIONS request that checks CORS permission before the actual non-simple cross-origin request fires | Slide 5, Quiz 6 |
| withCredentials | with-credentials | XHR / Fetch flag that includes cookies and auth headers in a cross-origin request; requires server CORS consent | Slide 5, Slide 9, Slide 10 |
| readyState | ready state | XMLHttpRequest property tracking connection progress: 0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 3=LOADING, 4=DONE | Slide 5, Quiz 6 |
| XMLHttpRequest | XHR | Browser API for making HTTP requests from JavaScript without reloading the page | Slide 5, Quiz 6 |
| AJAX | — | Technique for sending HTTP requests from a browser script asynchronously; built on XMLHttpRequest or Fetch | Slide 5, Quiz 6, Quiz 7 |
| HttpOnly | HTTP-only, http only | Cookie flag that blocks JavaScript from reading the cookie value, preventing XSS-based theft | Slide 9, Slide 10 |
| SameSite | Same-Site | Cookie attribute controlling when the cookie is sent on cross-site requests: Strict / Lax / None | Slide 9, Slide 10 |
| Secure (cookie flag) | secure flag | Cookie flag restricting transmission to HTTPS connections only | Slide 9, Slide 10 |
| JWT | JSON Web Token, json web token | Three-part (header.payload.signature) token; signed with a secret or key pair for stateless authentication | Slide 10, Slide 11 |
| HS256 | HMAC-SHA256 | Default JWT signing algorithm using a shared secret key | Slide 10 |
| bcrypt | — | Password-hashing library that applies a cost factor to resist brute-force attacks; produces a salted hash | Slide 9, Slide 11 |
| cost factor | salt rounds, rounds | Second argument to `bcrypt.hash()`; controls the number of hashing iterations (higher = slower = safer) | Slide 11 |
| bearer token | access token | OAuth token where possession equals authorization; "anyone who holds this token is implicitly granted access" | Slide 11 |
| OAuth 2.0 | OAuth | Authorization delegation protocol; client exchanges a client ID + secret for a bearer token via an authorization server | Slide 11 |
| client ID | — | Public identifier for an OAuth client application, given by the authorization server during registration | Slide 11 |
| client secret | — | Private credential for an OAuth client application; never exposed to the browser | Slide 11 |
| SSL/TLS | SSL, TLS (don't conflate: TLS is current) | Cryptographic protocol securing HTTP connections; TLS is the modern version; SSL is deprecated | Slide 11 |
| HTTPS | — | HTTP over TLS; encrypts all request and response data in transit | Slide 11 |
| XSS | Cross-Site Scripting | Attack injecting malicious script into a page to steal tokens or cookies from the DOM or localStorage | Slide 10, Slide 12 |
| SQL injection | SQLi | Attack inserting SQL syntax into user input to manipulate a query; prevented by parameterized queries | Slide 12, Quiz 12 |
| rate limiting | — | API protection that caps requests per client per time window to prevent DoS and brute-force | Slide 12 |
| mass assignment | — | Vulnerability where an API auto-binds all request body fields to a model without filtering sensitive properties | Slide 12 |
| OWASP | — | Open Web Application Security Project; source of the API vulnerability categories covered in this course | Slide 12 |
| broken object-level authorization | BOLA | OWASP API flaw where an API exposes object IDs in URLs without verifying the requester owns that object | Slide 12 |
| Promise | promise | Object representing an eventual value; created with `new Promise(executor)` | Slide 6, Quiz 8 |
| executor | — | The function passed to `new Promise()`; runs eagerly on construction; calls resolve or reject | Slide 6 |
| pending | — | Initial Promise state before resolve or reject has been called | Slide 6, Quiz 8 |
| fulfilled | resolved (as a state name) | Promise state after resolve() is called; `.then()` handler receives the value | Slide 6, Quiz 8 |
| rejected | — | Promise state after reject() is called or an uncaught error is thrown; `.catch()` handler fires | Slide 6, Quiz 8 |
| settled | resolved (as a generic synonym for settled) | Promise state that is no longer pending — either fulfilled or rejected | Slide 6 |
| eager (execution) | lazy | Promise executor runs immediately on construction, not deferred until a consumer attaches | Slide 6 |
| .then() | then() | Promise method chaining a callback for the fulfilled value; returns a new Promise | Slide 6, Quiz 9 |
| .catch() | catch() | Promise method registering a rejection handler; equivalent to `.then(undefined, fn)` | Slide 6, Quiz 9 |
| .finally() | finally() | Promise method registering a callback that runs on any settled outcome; receives no argument | Slide 6, Quiz 9 |
| microtask queue | job queue, promise queue | Queue where resolved-promise callbacks are dispatched; drains completely before the next macrotask | Slide 6, Quiz 8, Quiz 9 |
| async function | — | Function declared with the `async` keyword; always returns a Promise wrapping its return value | Slide 9 |
| await | — | Pauses an async function until the awaited Promise settles; syntactic sugar over `.then()` | Slide 9 |
| event loop | — | JavaScript runtime mechanism that dequeues callbacks when the call stack is empty; coordinates macro- and microtasks | Slide 1, Slide 4 |
| single-threaded non-blocking | non-blocking | Node.js execution model: one thread handles all requests by delegating I/O to the OS and resuming via callbacks | Slide 4 |
| V8 | — | Google's JavaScript engine powering Node.js; compiles JS to native machine code | Slide 4 |
| hoisting | — | JavaScript mechanism that moves `var` declarations (not initializations) to the top of their enclosing function scope | Slide 1, Quiz 3 |
| var | — | Pre-ES6 declaration with function scope and hoisting; do not confuse with block-scoped `let`/`const` | Slide 1, Quiz 3 |
| let | — | ES6 block-scoped declaration; not hoisted to initialization; preferred over `var` | Slide 1 |
| const | — | ES6 block-scoped declaration whose binding cannot be reassigned; does not make objects immutable | Slide 1 |
| closure | — | A function that retains access to variables from its enclosing scope after that scope has exited | Slide 3, Quiz 3 |
| REST | RESTful | Architectural style for web APIs using stateless HTTP, resource-oriented URLs, and standard HTTP methods | Slide 3, Slide 8 |
| idempotent | idempotency | Property: applying an operation multiple times produces the same result as applying it once; PUT is idempotent, POST is not | Slide 6, Slide 8 |
| PUT | — | HTTP method that replaces the entire resource at a URI; idempotent | Slide 8 |
| PATCH | — | HTTP method that updates one or more fields of a resource without replacing it; not idempotent | Slide 8 |
| HTTP method | HTTP verb | Action indicator in a request: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove) | Slide 3, Slide 8 |
| status code | HTTP status code | Three-digit response code: 2xx success, 3xx redirect, 4xx client error, 5xx server error | Slide 3, Quiz 7 |
| endpoint | route | Specific URI + HTTP method combination handled by an API server | Slide 3, Slide 8 |
| API versioning | versioning | Convention of embedding a version prefix (e.g., `/v1/`) in URLs so breaking changes don't remove old clients | Slide 8, Slide 11 |
| middleware | — | Express function in the request pipeline that can read, modify, or short-circuit the request before the route handler | Slide 8 |
| JSON | — | Text serialization format for structured data; encoded with `JSON.stringify()`, decoded with `JSON.parse()` | Slide 2, Quiz 5 |
| localStorage | local storage | Browser API persisting key-value strings across sessions; readable by any same-origin JS | Slide 2, Quiz 5 |
| sessionStorage | session storage | Browser API persisting key-value strings for the lifetime of the tab only | Slide 2 |
| primary key | PK | Column (or composite) that uniquely identifies each row in a table; cannot be NULL | Slide 7, Quiz 10 |
| foreign key | FK | Column referencing another table's primary key; enforces referential integrity | Slide 7, Quiz 10 |
| referential integrity | — | Database constraint ensuring every foreign key value points to an existing primary key | Slide 7, Quiz 10 |
| 1NF | first normal form | Every column holds an atomic value; no repeating groups; each row is unique | Slide 7, Slide 10 |
| 2NF | second normal form | Table is in 1NF and every non-key column depends on the whole primary key, not a partial subset | Slide 7, Slide 10 |
| 1:M | one-to-many | Relationship where one row in table A links to many rows in table B | Slide 7, Quiz 10 |
| M:M | many-to-many | Relationship where many rows in table A link to many rows in table B; requires a junction table | Slide 7, Quiz 10 |
| OpenAPI / Swagger | Swagger (as sole name) | JSON/YAML specification format for documenting REST API endpoints, schemas, parameters, and auth | Slide 11 |
| data provisioning | — | Course-specific term: fetching data from a source system and writing it to a target system (used in security context) | Slide 9 |
