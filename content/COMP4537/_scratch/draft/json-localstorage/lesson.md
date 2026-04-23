---
n: 16
id: json-localstorage
title: "JSON and Web Storage"
module: "Web Architecture and Data Exchange"
tags: [JSON, localStorage, sessionStorage, stringify, parse, origin]
priority: mid
source: "Slide 2, Quiz 5"
bloom_levels: [remember, understand, apply]
related: [rest-anatomy, restful-url-design, ajax-cors]
pedagogy: productive-failure
hook: "localStorage only stores strings — the moment you try to store an object you lose all its structure, unless you know how to use JSON."
---

## The Problem

You want to store a user's profile object in the browser so it persists across page refreshes. localStorage only stores strings — how do you store an object?

```js
// This silently breaks — localStorage coerces the object to "[object Object]"
localStorage.setItem("user", { name: "Alice", role: "admin" });

// Correct: serialize first, then store
localStorage.setItem("user", JSON.stringify({ name: "Alice", role: "admin" }));

// Retrieve and restore the object
const user = JSON.parse(localStorage.getItem("user"));
```

The answer is `JSON.stringify` on the way in, `JSON.parse` on the way out. Everything else in this topic builds on that pair.

---

## Web Storage: What It Is

Before HTML5, cookies were the only client-side storage option. Web storage replaced them for most use cases: it is more secure, holds much more data (generally 5 MB), and never leaves the browser automatically.

Web storage is **client-side only** — it lives in your browser's local data. The server never receives it unless you send it explicitly.

Web storage is scoped to the **origin** (protocol + domain + port). All pages sharing the same origin share the same storage. Pages at a different origin cannot read or write it.

---

## localStorage vs sessionStorage

| | localStorage | sessionStorage |
|---|---|---|
| **Expiry** | No expiration — data persists until explicitly deleted | Session only — deleted when the browser tab closes |
| **Scope** | All tabs and windows sharing the same origin | Single tab only |
| **Use case** | Persistent preferences, cached data | Temporary state (e.g., form wizard progress) |

Before using either, check browser support:

```js
if (typeof Storage !== "undefined") {
  // Web storage is available
} else {
  // Not supported — fall back to cookies or server-side storage
}
```

---

## The localStorage API

All keys and values are stored as strings.

```js
// Store
localStorage.setItem("theme", "dark");

// Retrieve — returns the string value, or null if the key doesn't exist
const theme = localStorage.getItem("theme"); // "dark"

// Remove one item
localStorage.removeItem("theme");

// Clear all items for this origin
localStorage.clear();
```

> **Q:** After this sequence runs, what does `console.log(value)` print?
> ```js
> localStorage.setItem("color", "blue");
> const value = localStorage.getItem("color"); // "blue" captured here
> localStorage.removeItem("color");
> localStorage.setItem("color", "red");
> console.log(value);
> ```
> **A:** `"blue"`. `getItem` returned the string `"blue"` at the moment it was called. The variable `value` holds that string. Later changes to localStorage do not retroactively change `value`.

---

## JSON: Serializing Objects for Storage and Transport

localStorage stores only strings. To store a JavaScript object, convert it to a JSON string first.

**Flatten (object → string):**
```js
const user = { name: "Alice", role: "admin" };
const serialized = JSON.stringify(user);
// '{"name":"Alice","role":"admin"}'
localStorage.setItem("user", serialized);
```

**Restore (string → object):**
```js
const serialized = localStorage.getItem("user");
const user = JSON.parse(serialized);
// { name: "Alice", role: "admin" }
```

JSON is a flat string. It behaves like any other string in transit or storage — only `JSON.parse` reconstructs the object structure.

Nested objects are valid JSON:
```json
{"user": {"profile": {"name": "Alice"}}}
```

The only built-in JSON methods are `JSON.stringify()` and `JSON.parse()`. There is no `JSON.convert()`.

---

## Origin Scope — The Critical Rule

Web storage is per **origin** (protocol + domain + port). The path component of a URL is irrelevant.

All three of these pages share exactly the same localStorage:

- `http://myDomain.com/write.html`
- `http://myDomain.com/read.html`
- `http://myDomain.com/fetch.html`

They share the same protocol (`http`), domain (`myDomain.com`), and port (implicit 80).

**Pitfall — things that DO break origin:**

- `https://myDomain.com/read.html` — different protocol (`https` vs `http`) → different origin → **blocked**
- `http://sub.myDomain.com/read.html` — different subdomain → different origin → **blocked**
- `https://lab.aaa.com/1/index.html` cannot access localStorage written by `https://aaa.com/labs/1/index.html` — even though the domain looks similar, `lab.aaa.com` is a different subdomain from `aaa.com` → **different origin**

> **Q:** `https://aaa.com/labs/1/index.html` stores a value. Which URL can read it?
> - A: `https://lab.aaa.com/1/index.html`
> - B: `https://aaa.com/labs/5/hello.html`
>
> **A:** B. Same protocol (`https`), same domain (`aaa.com`), same port (443). The path `/labs/5/hello.html` is irrelevant. A is blocked because `lab.aaa.com` is a different subdomain.

---

## Viewing localStorage in DevTools

Open Chrome DevTools → **Application** tab → Storage → Local Storage. You can inspect, edit, and delete entries there.

---

## Cross-Browser Isolation

**Pitfall** — localStorage is browser-specific. Data stored in Chrome is not accessible from Firefox, even on the same machine. "Persistent" means persistent within a single browser, not across all browsers on the device.

---

**Takeaway:** localStorage persists strings by origin (protocol + domain + port) — path is irrelevant, but protocol and subdomain matter. Use `JSON.stringify` to store objects and `JSON.parse` to restore them. `getItem` captures a string at call time — subsequent storage changes do not alter variables that already hold that value.
