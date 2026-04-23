---
id: comp4537-exam-strategy-and-pitfalls
title: "Exam strategy and top pitfalls — COMP 4537"
pillar: tech
priority: high
source: "ISAQuiz1–12.pdf; courses/COMP4537/materials/notes/exam-details.md; Slide 1–12"
bloom_levels: [understand, apply, analyze]
related: [httponly-cookies, jwt, ajax-cors]
---

## Exam format

The final exam runs in-person via Learning Hub (laptop required). Format is a mix of multiple-choice questions (MCQ) and written/short-answer questions. One double-sided printed cheat sheet (letter-size) is permitted. No electronic notes, no internet access beyond the Learning Hub quiz interface.

No solution keys for past quizzes exist in extractable form — the pitfalls below are derived from wrong-answer patterns observed across ISAQuiz1–12, where scored attempts reveal which answers were selected incorrectly.

## Time allocation

There is no published per-question time limit for the final. Use quiz benchmarks to calibrate:

| Question type | Typical time budget |
|---|---|
| Straightforward MCQ (definition recall) | 30–45 s |
| Code-trace MCQ (predict output, trace execution order) | 60–90 s |
| Written/short-answer (explain a mechanism) | 2–3 min |
| Written/short-answer requiring code (e.g. parameterized query) | 3–4 min |

The quizzes average 1 question per minute under timed conditions (e.g. Quiz 6: 17 questions / ~5 min actual, or Quiz 12: 12 questions / 4 min). Expect the final to be more deliberate — budget 1.5 min per MCQ on average.

Prioritize written questions that touch the top-5 exam topics (httponly-cookies, jwt, promises-basics, db-relational-design, ajax-cors) — these are highest-weight and highest-difficulty. Secure those marks first if you can choose question order.

## When to skip and return

Skip any code-trace question that requires more than two full mental passes in under 60 seconds. Mark it, move on, and return after easier questions. Returning with fresh working memory reduces off-by-one errors in execution order tracing.

Skip a written question if you can't produce the mechanism in the first sentence — a blank answer scores the same as a wrong one. Return time allowing.

Do not skip MCQ questions with a clear distractor you can eliminate — partial elimination is faster than a full cold solve.

## Part-structure strategy

The available materials show no evidence of a distinct Part 1 / Part 2 split with separate instructions. Treat the exam as a single sequential flow. If the proctor announces a two-part structure not documented in materials, apply the time allocation table above to each part proportionally.

## Top-5 sourced pitfalls

### Pitfall 1 — Promise executor timing: synchronous code wins (ISAQuiz8, Q2 and Q3)

The promise executor runs eagerly — immediately when `new Promise(executor)` is called, before any `.then()` is attached and before the next synchronous line. But `.then()` callbacks are dispatched to the microtask queue and run only after the current synchronous call stack empties.

```js
const fn1 = () => new Promise((resolve, reject) => {
  console.log(1);       // runs NOW (eager executor)
  resolve('success');
});
fn1().then((res) => {
  console.log(res);     // runs AFTER 'start' (microtask)
});
console.log('start');   // runs synchronously, before microtask drains
```

Output: `1`, `start`, `success` — not `1`, `success`, `start`.

The trap: students assume `.then()` fires immediately after `resolve()` is called, before the next synchronous statement. It does not. The microtask queue drains only after all synchronous code on the current stack finishes.

A second variant (ISAQuiz8, Q3): if the executor never calls `resolve()` or `reject()`, `.then()` callbacks never run. Output of `console.log(1); console.log(2);` in executor + `.then(() => console.log(3)).then(() => console.log(4));` + `console.log(5);` is: `1, 2, 5` — the `.then()` chains are silent because the promise stays pending.

> **Pitfall**
> Calling `resolve()` inside the executor does not immediately execute the `.then()` callback. It enqueues it. `console.log('start')` on the next line still runs first.

### Pitfall 2 — HttpOnly/Secure cookie risks: answer is "all of the above" (ISAQuiz11, Q3 and Q8)

Missing the `HttpOnly` flag exposes the cookie to **XSS** (JavaScript can read `document.cookie`), **session hijacking** (attacker reads session token), and also facilitates **CSRF** (cross-site request forgery) indirectly. The exam distractors isolate one risk ("only XSS" or "only CSRF") — the correct answer covers all of them.

Concretely from ISAQuiz11 Q8: "What are the potential risks of not using the HTTPOnly and Secure flags for a JWT cookie?" — answer is "All of the above" (XSS exposure, CSRF vulnerability, unauthorized access to sensitive user information). Selecting only "XSS" scores zero.

The `Secure` flag protects against transmission over HTTP (cookie only sent on HTTPS). The `HttpOnly` flag blocks JavaScript access. These are orthogonal protections; removing either opens a distinct attack surface.

> **Takeaway**
> When the exam asks about cookie security risks, the answer is almost always the most comprehensive option. Flags like `HttpOnly` and `Secure` together close multiple distinct attack vectors — the exam tests whether you see the full picture, not just one layer.

### Pitfall 3 — localStorage origin scope: path is irrelevant, subdomain is not (ISAQuiz5, Q2 and Q6)

localStorage is scoped to the **origin** (protocol + domain + port). All pages sharing the same origin share the same localStorage. Different origins do not.

- `http://myDomain.com/read.html`, `http://myDomain.com/fetch.html`, and `http://myDomain.com/get.html` all share the same localStorage — same origin (ISAQuiz5, Q2 correct answer). The path (`/read.html` vs `/fetch.html`) is irrelevant.
- `https://lab.aaa.com/1/index.html` **cannot** access the localStorage of `https://aaa.com/labs/1/index.html` — different subdomain = different origin (ISAQuiz5, Q6: student selected `lab.aaa.com`, marked wrong).
- `https://aaa.com/labs/5/hello.html` **can** access it — same protocol (`https`), same domain (`aaa.com`), same port (443 implicit). The path difference (`/labs/1/` vs `/labs/5/`) does not affect origin.

The trap: assuming localStorage is scoped to a specific URL or that all pages under one domain share storage regardless of protocol. Switching from `http://` to `https://` creates a different origin even on the same domain.

### Pitfall 4 — Asymmetric key direction: verify with the SENDER's public key (ISAQuiz11, Q9)

When Amir sends a message signed with his **private key**, Tom verifies the signature using **Amir's public key** — not Tom's private key, not Tom's public key, not Amir's private key.

The distractors in ISAQuiz11 Q9 present all four key combinations. The correct answer is "Amir's Public key." The reasoning: Amir signs with his private key (only he can produce the signature). Anyone with Amir's public key can verify the signature. Tom uses Amir's public key — a key Amir shares openly.

The trap: students confuse "verify" (uses sender's public key) with "decrypt" (uses recipient's private key) or assume the receiver's keys are involved in verification.

> **Pitfall**
> Signing ≠ encrypting. Signing: sender uses their **private** key → receiver verifies with sender's **public** key. Encryption for confidentiality: sender uses receiver's **public** key → receiver decrypts with their own **private** key. These are different operations with different key directions.

### Pitfall 5 — SQL injection: `.replace()` is not a fix; parameterized queries are (ISAQuiz12, Q2)

Template-literal SQL interpolation is vulnerable:
```js
const query = `UPDATE users SET email='${newEmail}' WHERE id=${userId}`;
```

ISAQuiz12 Q2 presents two "fixes": one using `.replace()` to remove quotes, another using parameterized queries. The correct answer is the parameterized form:
```js
const query = 'UPDATE users SET email=? WHERE id=?';
const result = database.query(query, [newEmail, userId]);
```

The `.replace()` approach is marked wrong — it is bypassable (attacker uses other characters or encodings to inject). Only parameterized queries (`?` placeholders with a separate values array) actually prevent SQL injection, because the driver treats substituted values as data, never as SQL syntax.

## Domain-specific traps (off-by-one, ordering, unit)

**readyState is 0–4, not 1–5.** `0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 3=LOADING, 4=DONE`. DONE is 4, not 5. (Source: Slide 5, Quiz 6.)

**`let` block scope causes ReferenceError outside the block.** A `let` declared inside `if (condition) { let a = ...; }` is not accessible after the closing brace. This is not the same as `var`, which hoists to function scope. ISAQuiz6 Q5: accessing a block-scoped `let` outside its block throws `Uncaught ReferenceError: a is Not defined`. (Source: ISAQuiz6, Q5.)

**Function without `return` logs `undefined`.** `console.log(foo(3))` where `foo` has no `return` statement prints `undefined`, not the last computed value. ISAQuiz6 Q6: `function foo(n) { var s = 0; for (...) { s += i; } }` → `console.log(foo(3))` → `undefined`. (Source: ISAQuiz6, Q6.)

**JWT structure: header, payload, signature — not body, not certificate.** ISAQuiz11 Q5 distractors include "Header, Payload, and Certificate" and "Header, Body, and Footer." The correct structure is header.payload.signature, all Base64url-encoded and dot-separated. (Source: Slide 10, ISAQuiz11, Q5.)

**`var` hoists declaration only, not value.** In ISAQuiz6 Q4: `if (m=[]) { console.log("Green"); } ... var m=10;` — `var m` is hoisted so `m` exists (as `undefined`) when the `if` runs, and `m=[]` is an assignment expression evaluating to `[]` (truthy) — output is `Green`. Students expect a ReferenceError. (Source: ISAQuiz6, Q4.)

**Cartesian join always returns n × m rows.** `SELECT * FROM Tabel1, Tabel2` always produces `n × m` rows regardless of duplicate column names or content. ISAQuiz10 Q6: distractors claim column name collision reduces row count. It does not. (Source: ISAQuiz10, Q6.)

**1NF compliance does not imply 2NF compliance in this course.** ISAQuiz10 Q5: a table with single-valued cells (satisfies 1NF) can still fail 2NF if non-key columns depend on each other rather than solely on the primary key. The professor's answer for the PersonID/Name/City/Country table is D: "violates 2NF, but complies with 1NF." (Source: ISAQuiz10, Q5.)

> **Takeaway**
> The five named pitfalls account for the majority of the wrong answers observed across ISAQuiz5, 8, 10, 11, and 12. Prioritise: promise execution order (microtask queue), cookie flag coverage ("all of the above"), localStorage origin scope (subdomain ≠ same origin), asymmetric key direction (verify with sender's public key), and parameterized queries (`.replace()` does not prevent SQL injection). These five areas, plus the domain-specific traps table, cover the highest-density wrong-answer patterns in the course.
