---
n: 13
id: json-localstorage
title: "localStorage origin scope and JSON storage"
lang: js
tags: [localStorage, JSON, origin, sessionStorage]
source: "Quiz 5 Q2, Q6, Slide 2"
kind: code
---

## Prompt

The file `write.html` at `http://myDomain.com/write.html` runs:

```js
localStorage.setItem("user", JSON.stringify({ name: "Alice", role: "admin" }));
```

**Exercise 1.** Write the code in `read.html` at `http://myDomain.com/read.html` to retrieve and parse the user object. Print `user.name` to the console.

**Exercise 2.** Which of these URLs can also access that same localStorage entry? For each, state whether access is **allowed** or **blocked**, and explain why using the origin rule (protocol + domain + port).

- A: `http://myDomain.com/fetch.html`
- B: `https://myDomain.com/read.html`
- C: `http://sub.myDomain.com/read.html`

**Origin scope diagram:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="200" font-family="monospace" font-size="13">
  <!-- Box 1: Same origin (shared) -->
  <rect x="10" y="20" width="190" height="160" rx="6" fill="#d4edda" stroke="#28a745" stroke-width="1.5"/>
  <text x="105" y="42" text-anchor="middle" font-weight="bold" fill="#155724">Same origin → shared</text>
  <text x="105" y="62" text-anchor="middle" fill="#155724">http://myDomain.com/a.html</text>
  <text x="105" y="80" text-anchor="middle" fill="#155724">http://myDomain.com/b.html</text>
  <text x="105" y="98" text-anchor="middle" fill="#155724">http://myDomain.com/c.html</text>
  <text x="105" y="120" text-anchor="middle" fill="#155724" font-size="11">protocol ✓  domain ✓  port ✓</text>
  <text x="105" y="140" text-anchor="middle" fill="#155724" font-size="11">path irrelevant</text>

  <!-- Box 2: Different protocol (blocked) -->
  <rect x="225" y="20" width="190" height="160" rx="6" fill="#f8d7da" stroke="#dc3545" stroke-width="1.5"/>
  <text x="320" y="42" text-anchor="middle" font-weight="bold" fill="#721c24">Different protocol → blocked</text>
  <text x="320" y="66" text-anchor="middle" fill="#721c24">http://myDomain.com/a.html</text>
  <text x="320" y="88" text-anchor="middle" fill="#721c24">vs</text>
  <text x="320" y="110" text-anchor="middle" fill="#721c24">https://myDomain.com/a.html</text>
  <text x="320" y="135" text-anchor="middle" fill="#721c24" font-size="11">http ≠ https → different origin</text>

  <!-- Box 3: Different subdomain (blocked) -->
  <rect x="440" y="20" width="190" height="160" rx="6" fill="#f8d7da" stroke="#dc3545" stroke-width="1.5"/>
  <text x="535" y="42" text-anchor="middle" font-weight="bold" fill="#721c24">Different subdomain → blocked</text>
  <text x="535" y="66" text-anchor="middle" fill="#721c24">http://myDomain.com/a.html</text>
  <text x="535" y="88" text-anchor="middle" fill="#721c24">vs</text>
  <text x="535" y="110" text-anchor="middle" fill="#721c24">http://sub.myDomain.com/a.html</text>
  <text x="535" y="135" text-anchor="middle" fill="#721c24" font-size="11">subdomain ≠ domain → different origin</text>
</svg>
```

---

**Exercise 3.** `https://aaa.com/labs/1/index.html` stores:

```js
localStorage.setItem("session", "abc123");
```

Which URL can read `"session"`?

- A: `https://lab.aaa.com/1/index.html`
- B: `https://aaa.com/labs/5/hello.html`

Explain why one is accessible and one is blocked.

---

## Starter

```js
// ── Exercise 1: read.html ─────────────────────────────────────────────────

// TODO 1: Retrieve the raw string stored under the key "user"
const raw = /* ??? */;

// TODO 2: Parse raw back to a JavaScript object
const user = /* ??? */;

// TODO 3: Print user.name to the console
console.log(/* ??? */);


// ── Exercise 2: Origin analysis table ────────────────────────────────────
// Fill in "allowed" or "blocked" and the reason for each URL.
// Base URL: http://myDomain.com/write.html

const originAnalysis = [
  {
    url: "http://myDomain.com/fetch.html",
    access: "???",   // allowed or blocked?
    reason: "???"
  },
  {
    url: "https://myDomain.com/read.html",
    access: "???",
    reason: "???"
  },
  {
    url: "http://sub.myDomain.com/read.html",
    access: "???",
    reason: "???"
  }
];


// ── Exercise 3: aaa.com scenario ─────────────────────────────────────────
// Which URL can read the "session" value?
// A: https://lab.aaa.com/1/index.html
// B: https://aaa.com/labs/5/hello.html

const aaaAnswer = {
  canAccess: "???",    // "A", "B", or "both"
  reason: "???"
};
```

---

## Solution

```js
// ── Exercise 1: read.html ─────────────────────────────────────────────────

const raw = localStorage.getItem("user");
// raw === '{"name":"Alice","role":"admin"}'

const user = JSON.parse(raw);
// user === { name: "Alice", role: "admin" }

console.log(user.name);
// "Alice"


// ── Exercise 2: Origin analysis table ────────────────────────────────────
// Base URL: http://myDomain.com/write.html  (protocol=http, domain=myDomain.com, port=80)

const originAnalysis = [
  {
    url: "http://myDomain.com/fetch.html",
    access: "allowed",
    reason: "Same protocol (http), same domain (myDomain.com), same port (80). Path differs — irrelevant."
  },
  {
    url: "https://myDomain.com/read.html",
    access: "blocked",
    reason: "Different protocol: https ≠ http. Protocol is part of the origin — this is a different origin."
  },
  {
    url: "http://sub.myDomain.com/read.html",
    access: "blocked",
    reason: "Different subdomain: sub.myDomain.com ≠ myDomain.com. A subdomain is a distinct origin."
  }
];


// ── Exercise 3: aaa.com scenario ─────────────────────────────────────────
// Base: https://aaa.com/labs/1/index.html  (protocol=https, domain=aaa.com, port=443)

const aaaAnswer = {
  canAccess: "B",
  reason:
    "B (https://aaa.com/labs/5/hello.html): same protocol (https), same domain (aaa.com), " +
    "same port (443). Path /labs/5/hello.html differs from /labs/1/index.html — path is irrelevant. " +
    "A (https://lab.aaa.com/1/index.html) is blocked: lab.aaa.com is a different subdomain from " +
    "aaa.com, making it a completely different origin."
};
```

---

## Why

**Origin = protocol + domain + port — path is irrelevant.**

The browser enforces origin isolation as a security boundary. localStorage is one of the resources protected by this boundary. When a page calls `localStorage.setItem`, the browser tags that data with the page's origin. Every `getItem` call checks whether the caller's origin matches — if not, the request is denied (or returns its own empty bucket).

**Why the path does not matter:** the origin is computed before the path is evaluated. `/write.html` and `/read.html` are just different files on the same server under the same protocol and port. The browser treats the entire server (for that protocol+port) as one origin.

**Why a subdomain creates a new origin:** `sub.myDomain.com` is a fully distinct hostname. DNS resolves it separately. Even if it points to the same server, the browser treats it as a separate origin by spec. A malicious subdomain (e.g., a compromised CDN) must not be able to read the main domain's localStorage.

**Why a protocol switch creates a new origin:** `http` and `https` run on different ports (80 vs 443) and have different security properties. An unencrypted `http` page must not be able to read data stored by an encrypted `https` page — they are separate origins.

**Why JSON.stringify is required:** localStorage only stores strings. Passing an object directly calls `.toString()` on it, which produces `"[object Object]"` — the object's structure is lost. `JSON.stringify` produces a proper string encoding (`'{"name":"Alice"}'`) that `JSON.parse` can reconstruct exactly. This is also why nested objects work: JSON is a recursive string format, so any depth of nesting serializes correctly.
