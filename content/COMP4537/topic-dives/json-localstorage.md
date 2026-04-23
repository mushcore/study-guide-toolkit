---
id: json-localstorage
title: "JSON and web storage reference"
pillar: tech
priority: mid
source: "Slide 2, Quiz 5"
bloom_levels: [remember, understand, apply]
related: [rest-anatomy, ajax-cors]
---

## Scenario: writer.html and reader.html

`http://myDomain.com/writer.html` stores a user object:

```js
// writer.html
const user = { name: "Alice", role: "admin" };
localStorage.setItem("user", JSON.stringify(user));
```

`http://myDomain.com/reader.html` retrieves it later — even after a full page reload:

```js
// reader.html
const user = JSON.parse(localStorage.getItem("user"));
console.log(user.name); // "Alice"
```

This works because both pages share the same origin: `http` + `myDomain.com` + port 80. localStorage persists until explicitly cleared — no server round-trip required.

---

## localStorage API Reference

| Method | Signature | Returns | Description |
|---|---|---|---|
| `setItem` | `setItem(key: string, value: string): void` | `undefined` | Store a string value under key |
| `getItem` | `getItem(key: string): string \| null` | string or `null` | Retrieve value by key; `null` if key absent |
| `removeItem` | `removeItem(key: string): void` | `undefined` | Delete one key-value pair |
| `clear` | `clear(): void` | `undefined` | Delete all key-value pairs for this origin |
| `key` | `key(index: number): string \| null` | string or `null` | Return key name at numeric index |
| `length` | `length: number` (property) | number | Count of stored items |

All keys and values are stored as strings. Numbers and objects are coerced silently — use `JSON.stringify`/`JSON.parse` for non-string values.

---

## Origin Scope Table

Origin = protocol + domain + port. The path is irrelevant.

### Quiz 5 Q2 scenario — base: `http://myDomain.com/write.html`

| URL | Same origin? | Reason |
|---|---|---|
| `http://myDomain.com/read.html` | Yes | Same protocol, domain, port — path differs but irrelevant |
| `http://myDomain.com/fetch.html` | Yes | Same protocol, domain, port |
| `http://myDomain.com/get.html` | Yes | Same protocol, domain, port |
| `https://myDomain.com/read.html` | **No** | Protocol changed: `http` → `https` |
| `http://sub.myDomain.com/read.html` | **No** | Different subdomain = different origin |

### Quiz 5 Q6 scenario — base: `https://aaa.com/labs/1/index.html`

| URL | Same origin? | Reason |
|---|---|---|
| `https://aaa.com/labs/5/hello.html` | **Yes** | Same protocol (`https`), same domain (`aaa.com`), same port (443) — path irrelevant |
| `https://lab.aaa.com/1/index.html` | **No** | `lab.aaa.com` is a different subdomain from `aaa.com` |

---

## JSON.stringify / JSON.parse Flow

```mermaid
graph LR
    A["JavaScript Object\n{ name: 'Alice' }"] -->|JSON.stringify| B["JSON String\n'{\"name\":\"Alice\"}'"]
    B -->|localStorage.setItem| C["localStorage\n(string only)"]
    C -->|localStorage.getItem| D["JSON String\n'{\"name\":\"Alice\"}'"]
    D -->|JSON.parse| E["JavaScript Object\n{ name: 'Alice' }"]
```

The string travels safely across network requests, file writes, or localStorage entries. `JSON.parse` reconstructs the original object structure.

---

> **Pitfall**
> Path is irrelevant to origin; subdomain is not. `http://myDomain.com/a.html` and `http://myDomain.com/b.html` share localStorage. `http://sub.myDomain.com/a.html` does not — different subdomain means a completely separate origin and a completely separate localStorage bucket.

---

> **Pitfall**
> Nested JSON is valid (Quiz 5 Q10 trap). A common misconception is that JSON can only represent flat objects. Nesting is fully supported — `JSON.stringify` serializes deeply nested objects correctly and `JSON.parse` reconstructs them.

```json
{
  "user": {
    "profile": {
      "name": "Alice",
      "role": "admin"
    }
  }
}
```

---

> **Pitfall**
> `JSON.convert()` does not exist. The only two built-in JSON methods are `JSON.stringify()` and `JSON.parse()`. Any code referencing `JSON.convert()` will throw `TypeError: JSON.convert is not a function`.

---

**Example** — Storing and retrieving a JavaScript object via JSON in localStorage:

```js
// Store
const profile = {
  name: "Alice",
  scores: [95, 88, 72],
  settings: { theme: "dark", lang: "en" }
};
localStorage.setItem("profile", JSON.stringify(profile));

// Retrieve
const raw = localStorage.getItem("profile"); // string or null
if (raw !== null) {
  const profile = JSON.parse(raw);
  console.log(profile.name);          // "Alice"
  console.log(profile.scores[0]);     // 95
  console.log(profile.settings.theme); // "dark"
}
```

Check for `null` before parsing — `JSON.parse(null)` returns `null` rather than throwing, but treating it as an object will fail.

---

**Takeaway:** localStorage is a string-only key-value store scoped to the origin (protocol + domain + port). Use `JSON.stringify` to serialize objects before storing them and `JSON.parse` to restore them. Origin is determined by protocol + domain + port — the path never matters, but a protocol switch or subdomain change creates a completely separate storage bucket.
