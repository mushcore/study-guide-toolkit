---
title: "COMP 4537 — exam-eve cheat sheet"
---

## Formulas — quick reference

Symbols: `PK` = primary key · `FK` = foreign key · `?` = parameterized placeholder · `CF` = cost factor

**JWT structure**
`base64url(header) . base64url(payload) . base64url(signature)`
Signed with `secret key` (HS256, symmetric) or `private key` (RS256, asymmetric). Verified with the **signer's public key** (asymmetric) or same secret (symmetric).

**bcrypt**
`bcrypt.hash(plaintext, CF)` — CF = cost factor (a.k.a. salt rounds); default 10. Higher CF = slower hash = harder to brute-force.
`bcrypt.compare(plaintext, hash)` → boolean

**SQL parameterized query (injection-safe)**
`db.query('SELECT * FROM t WHERE col = ?', [value])`
`db.query('UPDATE t SET a=? WHERE id=?', [newVal, id])`

**Cartesian join row count**
`SELECT * FROM A, B` → always `rowsA × rowsB` rows regardless of column names.

**readyState values (XMLHttpRequest)**
`0=UNSENT · 1=OPENED · 2=HEADERS_RECEIVED · 3=LOADING · 4=DONE`

**HTTP status code ranges**
`2xx` success · `3xx` redirect · `4xx` client error · `5xx` server error

**localStorage origin**
Origin = `protocol + domain + port`. Scoped per origin — path is irrelevant. Subdomain change = different origin.

**Promise microtask order**
Executor → synchronous code → microtask queue (`.then()` / `.catch()`) → macrotask queue (`setTimeout`)

## JavaScript scope and hoisting

| Keyword | Scope | Hoisted? | Before declaration |
|---|---|---|---|
| `var` | Function | Declaration only (init = `undefined`) | Returns `undefined` |
| `let` | Block `{}` | No | `ReferenceError` (TDZ) |
| `const` | Block `{}` | No | `ReferenceError` (TDZ) |

**Hoisting trap (ISAQuiz6 Q4):** `var m` hoisted → `m=[]` is truthy assignment → prints `"Green"`. The `var m = 10` below the if is irrelevant.

**let block scope (ISAQuiz6 Q5):** `let a` inside `if {}` → `console.log(a)` outside → `Uncaught ReferenceError: a is not defined` (NOT `undefined`).

**No return → undefined (ISAQuiz6 Q6):** Any function without a `return` statement returns `undefined`. `console.log(foo(3))` where `foo` has no `return` → `undefined`.

**Event loop drain order:** synchronous code → microtask queue (ALL drained) → one macrotask → repeat.

## Async JavaScript and event loop

**Model:** single-threaded non-blocking. One thread; I/O delegated to OS; resumes via callbacks through the event queue.

| Queue | Contents | Priority |
|---|---|---|
| Microtask | Promise `.then()` / `.catch()` / `.finally()` | Always drained fully first |
| Macrotask | `setTimeout`, `setInterval`, I/O callbacks | One per loop tick |

**Eager executor (ISAQuiz8):** Promise executor runs synchronously on construction — before any code after the `new Promise(...)` call site.

```js
const fn = () => new Promise((resolve) => {
  console.log(1);    // eager — runs now
  resolve('done');
});
fn().then(res => console.log(res)); // microtask — after sync
console.log('start');               // sync — runs next
// Output: 1, start, done
```

**Pending trap (ISAQuiz8):** If executor never calls `resolve()` or `reject()`, Promise stays pending → `.then()` callbacks never run.

**Native async vs sync:** `setTimeout` / `setInterval` → macrotask (async). `forEach` / `console.log` → synchronous.

## Web architecture patterns (MSA/SOA, monolithic, serverless)

| Pattern | One-line purpose | Key trade-off |
|---------|-----------------|---------------|
| **Monolithic** | Single deployable unit — all logic bundled | Full shutdown + recompile to deploy any change |
| **Layered (n-Tier)** | Horizontal slices: Presentation → Business → Application → Data Access | Strict layer discipline; each layer only calls the one below |
| **MSA / SOA** | Independent services communicating via API | Services communicate **only** via API — no direct DB access |
| **Event-Driven** | Components react to events asynchronously (pub/sub) | Harder to trace causal chains; eventual consistency |
| **Serverless (FaaS)** | Stateless functions on cloud infra | Cold-start latency; stateless by design |
| **MVC** | Model (data) / View (UI) / Controller (coordinates) | Controller can bloat if boundaries blur |
| **MVVM** | Two-way data binding via ViewModel | Angular, Vue, React+state are MVVM-based |

- MSA = SOA in this course — do not contrast them
- Monolithic is not "bad" — correct for MVPs and small teams
- CQRS separates write commands from read queries (LinkedIn feeds)
- Real systems combine patterns (Netflix: MSA + event-driven + CQRS)

## JSON and localStorage / sessionStorage

**Origin rule:** origin = protocol + domain + port — path is irrelevant

| URL pair | Same origin? | Reason |
|----------|-------------|--------|
| `http://a.com/x.html` vs `http://a.com/y.html` | Yes | Path differs — irrelevant |
| `http://a.com` vs `https://a.com` | No | Protocol changed |
| `http://a.com` vs `http://sub.a.com` | No | Different subdomain |

**localStorage API:**
- `setItem(key, value)` — store string
- `getItem(key)` → string or `null`
- `removeItem(key)` — delete one entry
- `clear()` — delete all entries for this origin
- `length` — count of stored items

**JSON round-trip:**
```js
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
const user = JSON.parse(localStorage.getItem('user'));
```

- Only `JSON.stringify()` and `JSON.parse()` exist — `JSON.convert()` throws TypeError
- localStorage persists until explicitly cleared; sessionStorage clears on tab close
- localStorage is browser-specific — Chrome and Firefox do not share it

## REST anatomy — methods, status codes, idempotency

| Method | Idempotent? | Use | Note |
|--------|-------------|-----|------|
| GET | Yes | Retrieve resource | Bookmarkable, cached, URL size limit |
| POST | No | Create resource | Body has no size limit; not bookmarkable |
| PUT | Yes | Replace entire resource | Partial payload overwrites missing fields |
| PATCH | No | Update one property | Only sends changed fields |
| DELETE | Yes | Remove resource | ID in URL; no body needed |
| HEAD | Yes | Check existence | Same as GET without response body |

**Status code ranges:**
- `2xx` success — `200 OK`, `201 Created`
- `3xx` redirect — `301 Moved Permanently`
- `4xx` client error — `400 Bad Request`, `401 Unauthorized`, `404 Not Found`
- `5xx` server error — `500 Internal Server Error`

- `201 Created` is returned after POST creates a resource; `200 OK` is not
- Never send credentials via GET — URL appears in browser history and server logs
- GET has a URL size limit; POST does not

## RESTful URL design and API versioning

**Resource naming:** plural nouns — `/patients` (collection), `/patients/1` (single item)

- Wrong: `GET /getPatient/1` — verb in URI
- Correct: `GET /patients/1` — HTTP method expresses the action

**Path vs query string:**
- Path → identity: `GET /patients/1`
- Query string → customization: `GET /patients?page=2&limit=10`

**API versioning:**
- Version belongs in URI path: `/v1/patients/`
- Unversioned path `/patients/` redirects (3xx) to latest version
- Introduce versioning before first public release — adding it later breaks all existing clients

**Breaking changes that require a new version:**
1. Response data format changes
2. Field type changes (e.g., `int` → `string`)
3. Endpoint removed or fundamentally changed

## Modern web architecture trends

| Pattern | Dominant pressure it solves |
|---------|---------------------------|
| **Serverless** | Infrastructure cost — pay per invocation, not per hour |
| **API-first** | Multi-client flexibility — web, mobile, IoT share one backend |
| **Edge computing** | Latency — process data close to the user, not in a distant data center |
| **Headless** | Frontend freedom — decouple presentation layer from backend |
| **DDD** | Large-codebase complexity — bounded contexts contain domain models |
| **DOMA** | MSA at scale (Uber) — group services into domain clusters with API boundaries |
| **AIaaS** | AI without ML infrastructure — call Google/AWS/Azure API, get AI results |

- Headless ≠ serverless: headless is an API contract decision; serverless is an infrastructure decision
- AutoML platforms (Google AutoML, HuggingFace, Kaggle) customize models without ML expertise

## Node.js runtime and modules

- Single-threaded non-blocking: one thread handles all requests; I/O delegated to OS via libuv; callbacks fire when OS signals done
- Chrome V8 engine compiles JS to native machine code; libuv handles async I/O
- CPU-bound code (loops, crypto) blocks the event loop — offload to worker threads
- Built-in modules: `http`, `url`, `fs` — no install; external: `mysql`, `express` — `npm install` required
- `url.parse(req.url, true).pathname` → `/admin.html` (no query string); `.path` → `/admin.html?user=123`
- `req` = incoming stream (read); `res` = outgoing response (`writeHead`, `write`, `end`) — never call `req.writeHead`
- `.listen(port)` is non-blocking; must be called or server never accepts connections
- File server pattern: `http.createServer` + `url.parse().pathname` + `fs.readFile` → 404 on err, 200 + data on success
- `mysql` is NOT a built-in module (Quiz 7 Q1)

## Express routing and middleware

- `const app = express()` → app object; `app.listen(PORT, cb)` starts server
- `PORT = process.env.PORT || 8888` — read env var with fallback
- Route handlers: `app.get/post/put/patch/delete(path, (req, res) => {})`
- `req.params.id` — URL segment; `req.body` — parsed body (needs `express.json()` middleware)
- `app.use(fn)` registers middleware for every request; must call `next()` to continue pipeline
- CORS middleware registered before routes: sets `Access-Control-Allow-*` headers on every response
- `express.json()` middleware populates `req.body` for POST/PUT
- PUT = idempotent (replaces entire resource); POST = not idempotent (creates new); PATCH = updates one property
- Status codes: GET→200, POST→201, PUT/PATCH/DELETE→200
- API versioning: `/api/v1/` segment lets server evolve without breaking old clients

## AJAX, CORS, and Same-Origin Policy

- SOP (Same-Origin Policy): browser rule; blocks cross-origin reads; origin = protocol + domain + port
- CORS: server grants permission via `Access-Control-Allow-Origin` response header
- `Access-Control-Allow-Origin: *` allows any origin; cannot combine `*` with `withCredentials: true`
- `withCredentials: true` → server must specify exact origin + `Access-Control-Allow-Credentials: true`
- XMLHttpRequest readyState: 0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 3=LOADING, 4=DONE (not 5)
- Canonical guard: `if (this.readyState == 4 && this.status == 200)`
- Preflight (OPTIONS): fires before non-simple requests (non-GET/POST method, or custom headers like `Content-Type: application/json`)
- Simple GET or form-encoded POST → no preflight
- Node.js CORS: handle `OPTIONS` method separately, respond 204 with Allow headers

## Relational DB design — keys, relationships, normalization

- **Primary key (PK):** uniquely identifies each row; cannot be NULL
- **Foreign key (FK):** references another table's PK; enforces referential integrity
- **Referential integrity:** every FK value must match an existing PK; parent table must be created first
- **1:M:** one parent row → many child rows (Patient → Visit)
- **M:M:** requires a junction table with composite PK (AuthorBook(authorid FK, bookid FK))
- **1:1:** FK column in child table is UNIQUE (Person → BirthCertificate)
- **1NF:** every cell holds one atomic value; no repeating groups
- **2NF:** satisfies 1NF + every non-key column depends on the **whole** PK (not a partial subset)
- **Cartesian join:** `SELECT * FROM A, B` → always n × m rows; column name collisions do NOT reduce count
- **Patient/Visit schema:**
  ```sql
  CREATE TABLE patient (patientid INT NOT NULL, name VARCHAR(100), PRIMARY KEY(patientid));
  CREATE TABLE visit (visitid INT NOT NULL, patientid INT NOT NULL, visitDate DATE,
    PRIMARY KEY(visitid), FOREIGN KEY(patientid) REFERENCES patient(patientid));
  ```
- **AUTO_INCREMENT:** DB assigns PK automatically; omit column from INSERT

## SQL CRUD — SELECT, INSERT, UPDATE, DELETE

- **SELECT:** `SELECT * FROM T` · `SELECT DISTINCT col FROM T` · `SELECT col FROM T WHERE cond`
- **WHERE operators:** `=`, `<>`, `BETWEEN`, `LIKE` (`%` = 0+ chars, `_` = 1 char), `IN`
- **Equi-join:** `SELECT * FROM A, B WHERE A.id = B.a_id` (not Cartesian)
- **GROUP BY + HAVING order:** `WHERE` (before GROUP BY) → `GROUP BY` → `HAVING` (after GROUP BY; for aggregates)
  - `WHERE` cannot be used on aggregate functions — use `HAVING`
  - `WHERE col_alias > n` invalid — alias not in scope until after SELECT
- **Subquery:** `SELECT * FROM Products WHERE price > (SELECT AVG(price) FROM Products)`
- **`IS`** is for NULL only: `WHERE col IS NULL` — use `=` for string comparison
- **`SELECT all`** is a syntax error; use `SELECT *`
- **SQL injection fix:** parameterized queries `db.query('SELECT ? WHERE id=?', [val, id])` — never template literals
- **SQL is case-insensitive:** `SELECT` = `select`; table names are also case-insensitive

## Node.js MySQL connection

- **mysql is external:** `npm install mysql` — not built-in (url, http, fs, path are built-in)
- **Credentials MUST be server-side** — never in client JS (exposed via DevTools)
- **3-step pattern:**
  1. `const con = mysql.createConnection({ host, user, password, database })`
  2. `con.connect(err => { ... })`
  3. `con.query(sql, callback)` — result only available inside callback
- **Promise-chained queries:** `const pc = con.promise(); const [rows] = await pc.query(sql, [args])`
- **`[rows, fields]`** — promise query resolves with this array; destructure first element for rows
- **Race condition:** firing UPDATE before awaiting SELECT result → use `await` / `.then()` chaining
- **XAMPP:** installs MySQL engine + phpMyAdmin at `http://localhost/phpmyadmin/`
- **AUTO_INCREMENT:** omit PK from INSERT; `result.insertId` holds generated key

## Promises — states, executor, chaining

**States:** `pending` → `fulfilled` (resolve called) or `rejected` (reject called). Once settled, state is locked.

**Constructor:**
```js
let p = new Promise((resolve, reject) => {
  resolve('value'); // or reject('reason')
});
```

**Executor is eager** — runs synchronously at `new Promise(...)` construction, before subsequent statements.

**Handlers are microtasks** — `.then()` / `.catch()` / `.finally()` run after the current call stack empties, not inline with `resolve()`.

```js
const fn = () => new Promise((resolve) => {
  console.log(1);   // eager executor — sync
  resolve('done');
});
fn().then(v => console.log(v)); // microtask
console.log('start');           // sync
// Output: 1, start, done
```

**Mutual exclusion** — first of `resolve` or `reject` wins; subsequent calls are no-ops.

**Pitfall (ISAQuiz8 Q3):** `reject('3'); resolve('4');` → `'4'` never logs. Promise already settled.

**Pitfall (ISAQuiz8 Q2):** executor never calls resolve/reject → Promise stays pending → `.then()` never fires.

**Chain mechanics:** `.then()` always returns a **new** Promise. Return value from callback → fulfills next. Throw → rejects next.

```js
Promise.resolve(1)
  .then(a => { return a * 2; })   // 2
  .then(b => { return b * 3; })   // 6
  .then(c => console.log(c));      // 6
```

**`.catch(fn)`** = `.then(undefined, fn)` — handles rejection from any upstream step.

**`.finally(f)`** — runs on any settled outcome; `f` receives **no value** (`undefined`); original value passes through.

**Microtask vs macrotask (ISAQuiz9 Q3):**
```
setTimeout   →  macrotask (fires after ALL microtasks drain)
.then()      →  microtask (drains completely before next macrotask)
```
Output order: synchronous → microtasks (all) → macrotask → repeat.

## async / await

`async function f() { return x }` ≡ `function f() { return Promise.resolve(x) }` — always returns a Promise.

`typeof asyncFn()` → `"object"` (ISAQuiz8 Q11).

`await` pauses the **async function** only — not the JS thread. Equivalent to `.then()`.

```js
// Promise chain vs async/await — identical behavior
async function getUser(id) {
  try {
    const res  = await fetch(`/api/users/${id}`);
    const data = await res.json();
    return data.name;
  } catch (err) {
    console.error(err);
  }
}
```

**Pitfall:** Omitting `await` → variable holds a Promise object, not the value. Silent bug — no error thrown.

**Pitfall:** `await` outside an `async` function → `SyntaxError` at parse time.

## HttpOnly cookies — auth flow and flags

**Set-Cookie on login:**
`Set-Cookie: token=abc; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=60`

**Delete on logout (all attributes must match):**
`Set-Cookie: token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure`

| Flag | Effect |
|---|---|
| `HttpOnly` | Blocks `document.cookie` — JS cannot read it (stops XSS theft) |
| `Secure` | HTTPS only |
| `SameSite=None` | Cross-origin sending allowed (requires `Secure`) |
| `SameSite=Strict/Lax` | Restrict cross-site sending → CSRF mitigation |
| `Max-Age=0` | Delete immediately |

**Cross-origin cookie flow** — BOTH required:
- Client: `xhr.withCredentials = true`
- Server: `Access-Control-Allow-Credentials: true`

**Pitfall (ISAQuiz11 Q3, Q8):** Risks of no HttpOnly = **all of them** (XSS + session hijacking + CSRF). Selecting only XSS scores zero.

## Asymmetric and symmetric encryption

| | Symmetric | Asymmetric |
|---|---|---|
| Keys | 1 secret key (shared) | Public + private per party |
| Key exchange needed? | Yes (the hard problem) | No |
| Speed | Fast | Slower |
| Algorithms | AES | RSA, Diffie-Hellman |

**Key directions (OPPOSITE for signing vs encryption):**

| Operation | Sender uses | Receiver uses |
|---|---|---|
| Signing | Sender's **private** key | Sender's **public** key (verify) |
| Encryption | Receiver's **public** key | Receiver's **private** key (decrypt) |

**Amir→Tom double-envelope (ISAQuiz11 Q9):**
1. Encrypt with Tom's **public** key → only Tom's **private** key opens
2. Sign with Amir's **private** key → Tom verifies with Amir's **public** key

**Pitfall:** Verification uses the SENDER's public key (not receiver's). Confusing verify/decrypt = most common Q9 error.

## JWT — structure, signing, storage

**Structure:** `base64url(header).base64url(payload).base64url(signature)` (NOT body/footer/certificate)

**Sign:** `jwt.sign({ username }, TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '120s' })`
**Verify:** `jwt.verify(token, TOKEN_SECRET)` → decoded payload or throws

**Deliver via HttpOnly cookie** (not localStorage — readable by JS):
`res.setHeader('Set-Cookie', 'token=...; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=120')`

**TOKEN_SECRET:** `process.env.TOKEN_SECRET` — never hardcode. Generate: `crypto.randomBytes(64).toString('hex')`

**Pitfall (ISAQuiz11 Q8):** No HttpOnly + no Secure = XSS + CSRF + unauthorized access (all three). Selecting only XSS scores zero.

## OAuth 2.0 and SSL/TLS

**SSL/TLS:** TLS is current; SSL is deprecated. HTTPS = HTTP over TLS. TLS handshake: server sends certificate (contains public key) → negotiate session key → all data encrypted automatically. App code does NOT implement this.

**OAuth 2.0 flow:**
1. App owner registers → gets **client ID** (public) + **client secret** (private, server only)
2. User clicks Login → ClientApp redirects to Google with `client_id` + scope
3. Google shows consent screen → user clicks Allow
4. Google issues **bearer token** → redirects to ClientApp
5. ClientApp uses `Authorization: Bearer <token>` header for all future requests

**Bearer token:** possession = authorization. Anyone holding it is authorized. Must be kept private. Time-limited (e.g., 6 months).

**Delegation:** ClientApp never sees Google password. OAuth 2.0 hands authentication to Google.

## API security vulnerabilities (OWASP top 8 for APIs)

| # | Vulnerability | Fix |
|---|---|---|
| 1 | Broken User Authentication | MFA, session timeout, rate-limit + lockout login, bcrypt |
| 2 | Excessive Data Exposure | Server-side field filtering; generic error messages |
| 3 | Lack of Rate Limiting | `express-rate-limit` at IP + account + app level |
| 4 | Broken Function Level Authorization | `if (req.user.role !== 'admin') return 403` |
| 5 | Broken Object-Level Authorization (BOLA) | Check object ownership, not just authentication |
| 6 | Mass Assignment | Whitelist fields: `const { name, email } = req.body` |
| 7 | Security Misconfiguration | Secrets in env vars; disable unused services |
| 8 | Injection (SQL/NoSQL/Command) | Parameterized queries with `?` placeholders |

**SQL injection pattern (ISAQuiz12 Q2):**
```js
// Vulnerable:
const query = `UPDATE users SET email='${newEmail}' WHERE id=${userId}`;
// Safe:
const query = 'UPDATE users SET email=? WHERE id=?';
database.query(query, [newEmail, userId]);
```
**Pitfall:** `.replace()` is NOT a fix — bypassable with hex encodings. Only parameterized queries work.

**BOLA pattern (ISAQuiz12 Q7):** `getResourceOwner()` that hardcodes owner ID = always returns same user = any authenticated user passes.

## Password hashing with bcrypt

**Hash ≠ Encrypt:** Hash is one-way (no key, irreversible). Encrypt is reversible (key on server = risk). Always hash passwords.

```js
// Register — hash before storing
const hashedPassword = await bcrypt.hash(password, 10); // 10 = cost factor

// Login — compare, never decrypt
const match = await bcrypt.compare(plaintext, storedHash); // → boolean
```

**Cost factor:** 2nd arg to `bcrypt.hash()`. `10` → 2^10 = 1,024 iterations. Higher = slower = harder brute-force.

**Pitfall:** Omit `await` → variable holds a Promise object, not a hash. All logins break silently.

## Swagger / OpenAPI documentation

**OpenAPI / Swagger** = Interface Description Language for RESTful APIs. Produces `swagger.json` (JSON or YAML).

**swagger.json documents:** endpoints (path + HTTP method), request params, request body schema, response schemas + status codes, auth requirements.

**Minimal structure:**
```json
{ "openapi": "3.0.0", "info": { "title": "...", "version": "1.0.0" }, "paths": { "/endpoint": { "get": { "summary": "...", "responses": { "200": { "description": "..." } } } } } }
```

**Workflow:** editor.swagger.io → File > Convert and Save as JSON → open in VS Code → install Swagger Viewer extension → Shift+Alt+P (Preview Swagger) → edit `paths` block.
