# Topic Map — COMP4537

## Exam meta
- Date/time: Final exam week April 20–24, 2026 (exact date/time not specified in materials — scheduled by timetabler)
- Room: In-person; room not specified in materials (to be announced)
- Format: In-person via Learning Hub (laptop required); mix of multiple choice and written/short-answer; 1 double-sided printed cheat sheet allowed (per exam-details.md)
- Allowed materials: 1 double-sided printed cheat sheet (per exam-details.md note)
- Instructor: Amir Amintabar, PhD (aamintabar@bcit.ca)
- Midterm: Feb 23–27, 2026 (in-person, Learning Hub, laptop required; closed book, one sheet of letter-sized paper both sides)

## Modules

### M1: JavaScript Foundations and Web Basics
| Topic id | Topic name | Weight% | Difficulty | Tags | Source files |
|----------|------------|---------|------------|------|--------------|
| js-oop | OOP in JS (classes, inheritance, composition) | 6% | mid | [OOP, classes, extends, super, composition] | Slide 1, Quiz 4 |
| js-scope-hoisting | var/let/const scope, hoisting, event loop | 8% | mid | [hoisting, var, let, const, scope, event-queue] | Slide 1, Slide 3, Quiz 3, Quiz 6 |
| js-functions | Function declarations, callbacks, first-class functions, closures | 6% | mid | [callbacks, higher-order, closures, return-types] | Slide 3, Quiz 3, Quiz 6 |
| js-arrays-loops | Arrays, loops, iteration patterns | 5% | low | [arrays, for-loop, iteration, index] | Quiz 2 |
| html-css-review | HTML DOM structure, CSS box model, selectors, attributes | 4% | low | [HTML, CSS, DOM, box-model, selectors] | Slide 1, Quiz 1 |
| js-async-event-loop | Asynchronous JS, single-threaded non-blocking model, event queue | 5% | high | [async, single-thread, non-blocking, event-loop, setTimeout] | Slide 4, Quiz 6, Quiz 8 |

### M2: Web Architecture and Data Exchange
| Topic id | Topic name | Weight% | Difficulty | Tags | Source files |
|----------|------------|---------|------------|------|--------------|
| web-arch-patterns | Architectural patterns (monolithic, layered, microservice, SOA, serverless, MVC, MVVM, event-driven) | 5% | mid | [architecture, monolithic, microservice, SOA, serverless] | Slide 2 |
| json-localstorage | JSON stringify/parse, localStorage vs sessionStorage, web storage API | 5% | low | [JSON, localStorage, sessionStorage, stringify, parse] | Slide 2, Quiz 5 |
| rest-anatomy | Anatomy of web APIs: endpoints, headers, HTTP methods (GET/POST/PUT/PATCH/DELETE), status codes | 8% | mid | [REST, API, endpoint, headers, body, HTTP-methods] | Slide 3, Slide 8, Quiz 6, Quiz 7 |
| restful-url-design | RESTful URL conventions, resource naming, API versioning (v1/v2), URI design | 4% | mid | [REST, URL-design, versioning, plural-nouns, URI] | Slide 8, Slide 11 |
| modern-web-arch | Modern trends: Headless, DDD, DOMA, edge computing, AI-as-a-Service, microservices evolution | 3% | low | [modern-architecture, headless, edge-computing, AI-web] | Slide 8 |

### M3: Node.js and Server-Side Development
| Topic id | Topic name | Weight% | Difficulty | Tags | Source files |
|----------|------------|---------|------------|------|--------------|
| nodejs-basics | Node.js runtime, V8 engine, non-blocking I/O, restaurant analogy, single-threaded async | 5% | mid | [nodejs, async, non-blocking, V8, server-scripting] | Slide 4, Quiz 7 |
| nodejs-modules | Built-in modules (http, url, fs), require, exports, npm install, package.json | 5% | mid | [modules, require, http, url, fs, npm] | Slide 4, Slide 11, Quiz 7 |
| express-framework | Express: routing, middleware, npm install, RESTful endpoints, environment variables | 5% | mid | [express, routing, middleware, REST, npm] | Slide 8 |
| ajax-cors | AJAX (XMLHttpRequest), readyState codes (0–4), preflight OPTIONS, CORS/SOP headers, withCredentials | 8% | high | [AJAX, CORS, SOP, preflight, OPTIONS, XMLHttpRequest, readyState] | Slide 5, Quiz 6, Quiz 7 |

### M4: Databases and CRUD
| Topic id | Topic name | Weight% | Difficulty | Tags | Source files |
|----------|------------|---------|------------|------|--------------|
| db-relational-design | Relational DB concepts: tables, primary key, foreign key, 1:M, M:M, referential integrity, normalization (1NF, 2NF) | 7% | high | [MySQL, primary-key, foreign-key, 1NF, 2NF, referential-integrity, 1:M, M:M] | Slide 7, Slide 10, Quiz 10 |
| sql-crud | SQL CRUD: SELECT/INSERT/UPDATE/DELETE, WHERE, JOIN, subqueries, GROUP BY, LIKE | 6% | mid | [SQL, SELECT, INSERT, UPDATE, DELETE, WHERE, JOIN, CRUD] | Slide 5, Slide 7, Quiz 10 |
| nodejs-db-connect | Node.js MySQL connection, mysql module, executing queries, XAMPP/phpMyAdmin, cPanel hosting | 4% | mid | [mysql, nodejs, npm, XAMPP, phpMyAdmin, cPanel, hosting] | Slide 5, Slide 7, Quiz 7 |
| sql-promises | Async DB queries using promises, chaining SQL calls, mysql.promise(), successive queries | 4% | high | [promises, async-db, mysql, chaining] | Slide 11 |

### M5: Promises and Async Programming
| Topic id | Topic name | Weight% | Difficulty | Tags | Source files |
|----------|------------|---------|------------|------|--------------|
| promises-basics | Promise object: constructor, executor, resolve/reject, pending/fulfilled/rejected states | 7% | high | [promises, resolve, reject, pending, fulfilled, rejected, executor] | Slide 6, Quiz 8 |
| promise-chaining | .then() chaining, .catch(), .finally(), return values propagation, Promise.resolve/reject | 6% | high | [then, catch, finally, chaining, microtask-queue] | Slide 6, Quiz 9 |
| async-await | async/await syntax, relationship to promises, async function return type | 3% | mid | [async, await, promise, syntax] | Slide 9 |

### M6: API Security
| Topic id | Topic name | Weight% | Difficulty | Tags | Source files |
|----------|------------|---------|------------|------|--------------|
| httponly-cookies | HttpOnly cookies: token-based auth flow, Set-Cookie, SameSite, Secure, Max-Age, withCredentials | 7% | high | [HttpOnly, cookies, token, SameSite, Secure, XSS, withCredentials] | Slide 9, Slide 10, Quiz 11 |
| public-private-keys | Symmetric vs asymmetric encryption, public/private key exchange, RSA, Diffie-Hellman, signing/verifying messages | 5% | high | [asymmetric, symmetric, public-key, private-key, RSA, signing] | Slide 9, Slide 10, Quiz 11 |
| jwt | JWT structure, signing with secret key, HS256, expiration, JWT vs HttpOnly cookies, bcrypt hashing | 7% | high | [JWT, json-web-token, signing, secret-key, bcrypt, hashing, XSS] | Slide 10, Slide 11, Quiz 11 |
| oauth-ssl | OAuth 2.0 flow: onboarding, bearer token, consent screen, client ID/secret; SSL/TLS handshake, HTTPS encryption | 4% | high | [OAuth, bearer-token, SSL, TLS, HTTPS, client-id, client-secret] | Slide 11 |
| api-security-best-practices | Top 8 vulnerabilities: broken auth, excessive data exposure, rate limiting, broken function/object-level authorization, mass assignment, security misconfiguration, SQL injection | 5% | high | [security, SQL-injection, rate-limiting, OWASP, mass-assignment, XSS, CSRF, DoS] | Slide 12, Quiz 12 |
| api-documentation | Swagger/OpenAPI, API specification, endpoint documentation, swagger.json | 2% | low | [swagger, OpenAPI, documentation, JSON] | Slide 11 |
| password-hashing | bcrypt.hash(), salt rounds, why hash not encrypt, hashing passwords before DB storage | 3% | mid | [bcrypt, hash, salt, password-storage] | Slide 11, Slide 9 |

## Ranked priority list
1. **httponly-cookies** — weight ~7%, difficulty high — tested heavily in Quiz 11 (4/9 questions), repeated across Slides 9 and 10; withCredentials + SameSite + Secure flag details are common wrong-answer traps
2. **jwt** — weight ~7%, difficulty high — Quiz 11 dedicated questions; signing, storage (httpOnly cookie vs localStorage), expiration, and bcrypt are all exam staples; slide 10 spends most time here
3. **promises-basics** — weight ~7%, difficulty high — Quiz 8 (11 questions); execution order of resolve/reject vs synchronous code is a notorious trap; appears again in Quiz 9
4. **db-relational-design** — weight ~7%, difficulty high — Quiz 10 (12 questions); 1:M, referential integrity, normalization (1NF/2NF), foreign key; wrong-answer pattern: confusing primary vs foreign key and cross-table delete cascade
5. **ajax-cors** — weight ~8%, difficulty high — Quiz 6, Quiz 7; CORS misconfiguration, preflight OPTIONS, readyState values (0–4), withCredentials; instructor emphasizes SOP nuance repeatedly
6. **rest-anatomy** — weight ~8%, difficulty mid — Quiz 6, Quiz 7; GET vs POST data size/URL vs body, idempotency (PUT vs POST/PATCH), status code ranges (2xx/3xx/4xx/5xx)
7. **js-scope-hoisting** — weight ~8%, difficulty mid — Quiz 3, Quiz 6; var hoisting, block vs function scope, let/const behavior; repeated in early quizzes and review slides
8. **api-security-best-practices** — weight ~5%, difficulty high — Quiz 12 (12 questions); all 8 OWASP-style categories testable; SQL injection parameterized query code is a likely written question
9. **promise-chaining** — weight ~6%, difficulty high — Quiz 9 (10 questions); .catch/.finally ordering, microtask queue vs setTimeout, chained return value types
10. **sql-crud** — weight ~6%, difficulty mid — Quiz 10; SELECT/JOIN/WHERE/GROUP BY syntax, correct vs incorrect query identification

## Diagram inventory
| Past-exam file | Question | Diagram type | Notes |
|----------------|----------|--------------|-------|
| ISAQuiz2.pdf | Q1–Q30 | Code trace diagrams (loop/array output prediction) | All questions involve reading code snippets and predicting console output — no visual diagrams but requires code execution tracing |
| ISAQuiz3.pdf | Q1–Q15 | Code trace diagrams (function output prediction) | Function declaration/hoisting code traces |
| ISAQuiz5.pdf | Q2, Q6 | Code trace (JSON/localStorage) | Q2 and Q6 were 2-point questions where student scored 0 — likely code trace with multiple steps |
| ISAQuiz6.pdf | Q1–Q15 | Code trace (misc JS, scope, event loop) | Includes AJAX, sessionStorage type checking, hoisting code output questions |
| ISAQuiz7.pdf | Q3–Q4 | Code trace (Node.js url module, http server) | Q3: url.parse() pathname extraction; Q4: http.createServer code — reading server code and predicting behavior |
| ISAQuiz8.pdf | Q1–Q11 | Code trace (Promise execution order) | All questions trace promise resolve/reject/then/setTimeout ordering — core diagram type for this course |
| ISAQuiz9.pdf | Q1–Q10 | Code trace (Promise chain, catch, finally) | Q3 specifically asks about setTimeout vs .then() interleaving ordering |
| ISAQuiz10.pdf | Q4, Q6 | DB schema / relationship diagram | Q4: identify relationship type from two-table schema; Q6: count result rows from Cartesian join — requires reading ERD-style table schemas |
| ISAQuiz11.pdf | Q9 | Asymmetric encryption sequence diagram | "Amir sent a message to Tom" — double-encryption flow (public+private key layered signing) |
| ISAQuiz12.pdf | Q2, Q7, Q10 | Code-vulnerability diagrams | Code snippets showing vulnerable API server code; Q10: identify security flaw in Express code |
| Slide 2 (Slide 20) | — | API-centric MSA architecture flow | Client → API gateway → microservices (Korea/UAE/USA/Japan) with JSON responses — labeled architecture diagram |
| Slide 3 (Slides 22–27) | — | API flow diagrams (online movie store) | HTML scraping problem → API solution; browser vs API server response comparison with shape diagrams |
| Slide 4 (Slides 13–23) | — | Threading model diagrams (restaurant analogy) | Single-threaded non-blocking (Example 1), blocking (Example 2), multi-threaded (Example 3) — waiter/table visual; thread-per-request diagram for 100 concurrent requests |
| Slide 5 (Slides 15–19) | — | AJAX/CORS flow diagram | Client (ajax.html) ↔ Server (app.js); CORS header configuration sequence |
| Slide 7 (Slides 19–20) | — | Relational DB schema (patient/visit) | ERD showing Patient and Visit tables with 1:M relationship, PK/FK labels |
| Slide 10 (Slides 7–8) | — | Asymmetric key exchange diagram | Amir→Tom double-envelope signing with public/private keys |
| Slide 10 (Slide 40) | — | ERD for API stats DB | user → APIkey → Resource 1:M relationship diagram |
| Slide 11 (Slide 9) | — | OAuth 2.0 flow diagram | ClientApp → Google OAuth endpoint → consent screen → bearer token redirect |

## Terminology notes
- Professor uses **"secrete key"** to mean **secret key** (symmetric key) — distinct from private key in asymmetric encryption; explicitly clarified in Slide 10
- Professor uses **MSA** and **SOA** interchangeably in this course ("slightly different but refer the same thing in this course" — Slide 2)
- **"Data provisioning"** = fetching data from source to target system (not a standard term); used in Slide 9 security context
- **"Settled"** = a promise that is either fulfilled or rejected (not pending); professor uses this explicitly in Slide 6
- **"Eager"** (for promises) = promise executor runs immediately on construction, not lazily — professor emphasizes this vs "lazy"
- Professor uses **"API-centric"** to mean the architecture style where API server is the primary component; distinguished from monolithic
- **"Idempotent"**: professor defines it as "can be applied multiple times without changing the result" and specifically applies it to PUT (idempotent) vs POST (not idempotent) — Slide 6 review
- Professor distinguishes **PUT** (replace entire resource) vs **PATCH** (update one property) — repeated across Slide 6, Slide 8
- **"Origin"** = combination of domain + protocol + port (professor notes this is what SOP enforces) — Slide 5
- Professor uses **"bearer token"** specifically in OAuth context: "anyone who holds this token is implicitly granted authorization"
- **"Book authoring"** = class participation activity where students write about what they learned; not a standard academic term
- **bcrypt salt rounds** (the `10` in `bcrypt.hash("123", 10)`) — professor explicitly asks "what is that 10 doing?" — it is the cost factor/salt rounds

## Materials gaps
- Exact final exam date, time, and room number not in materials (syllabus says "scheduled by timetabler" for April 20–24 week)
- Exam-details.md is minimal (2 lines): confirms cheat sheet and format but no further detail
- No solution keys for quizzes (PDFs show attempt results with scores but solutions are image-based and not extractable via pdftotext — questions Q2, Q6 in Quiz5 and Q5, Q6 in Quiz11 lost as images)
- Several quiz questions (particularly in Quiz 5, 10, 11, 12) have answer options rendered as images in the Learning Hub export — text extraction captured question stems but not all answer choices
- No lab assignment PDFs in materials — lab content must be inferred from slide references (Lab 0–5 mentioned but not included)
- No past final exam or midterm exam papers — only quiz (ISAQuiz) PDFs available; midterm format/weight (30%) and final (30%) are significant but no practice papers exist
- Slide 7 (CRUD) focuses heavily on DB design theory; the actual Node.js CRUD + Express code examples are in Slide 8 — split across two slides may create authoring confusion
- Slide 6 Promises content is dense with execution order examples; no solution keys for the in-class activities in that slide
