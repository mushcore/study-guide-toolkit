# Voice Guide — COMP4537

Read this before writing any content for this course. Apply every rule verbatim; do not paraphrase.

---

## Register

Address the reader as "you." Sentences ≤30 words. Lead every paragraph with the mechanism or consequence — never with a transition, throat-clearing, or a bare definition. Active voice throughout; passive only when the actor is genuinely unknown (e.g., "the token is verified by the server" when the server identity is variable or irrelevant).

Paragraphs are 1–4 sentences. Open with the concrete case or the problem, then state the rule. Never open with "X is defined as …".

**Forbidden in teaching claims:** "might", "could", "perhaps", "arguably", "you may want to", "it's worth noting", "it's important to remember", "in this case", "typically". Teachers assert. If the source is ambiguous, write only what the source commits to.

**Forbidden entirely:** "I", "my", "we", "our", "we'll show you", "we've seen", "in this section we", "let's", "as mentioned above". The content has no author voice.

---

## Course-specific format conventions

### 1. Secret key ≠ private key

Use **"secret key"** for the shared symmetric key used in HMAC signing (JWT HS256). Use **"private key"** for the asymmetric counterpart to a public key. These are distinct concepts in this course. The professor misspells "secret" as "secrete" in Slide 10 — write "secret key" correctly in all content; be aware quiz questions may use "secrete key" as a distractor.

### 2. MSA = SOA in this course

The professor states MSA and SOA are "slightly different but refer the same thing in this course" (Slide 2). Use **"MSA"** as the canonical form; note the equivalence when first introducing it. Do not write MSA vs SOA as a contrast in COMP4537 content.

### 3. "Settled" is professor-specific

A promise is **settled** when it has exited the pending state — either fulfilled or rejected. Use "settled" exactly as the professor does. Do not use "resolved" as a synonym for settled; `resolve()` is a specific method call, not a general state.

### 4. Promises are eager

The promise executor runs **eagerly** — immediately on construction, before any `.then()` is attached. Write "the executor runs eagerly" not "the executor runs when the promise is used" or "the executor runs asynchronously."

### 5. PUT replaces; PATCH updates one property

Write exactly: **"PUT replaces the entire resource"** and **"PATCH updates a single property."** This distinction is a tested trap (Slides 6, 8). Never use "update" generically for both methods.

### 6. Idempotent has a precise definition here

Write: **"an operation is idempotent if applying it multiple times produces the same result as applying it once."** Apply this only to PUT (idempotent) vs. POST (not idempotent) as the professor does. Do not extend it to other methods without slide sourcing.

### 7. Origin = protocol + domain + port

Write **"origin"** as a precise term — not interchangeable with "domain" or "URL." The Same-Origin Policy enforces the exact triple (protocol, domain, port). Write "two URLs share an origin only when their protocol, domain, and port all match."

### 8. Bearer token phrasing

In OAuth context write: **"anyone who holds this token is implicitly granted authorization."** This is the professor's direct definition (Slide 11). Do not write "a token that is passed as a bearer."

### 9. bcrypt cost factor

The second argument to `bcrypt.hash()` is the **cost factor** (also called **salt rounds**). Write "cost factor" on first mention; "salt rounds" is acceptable as a synonym. Do not write just "rounds." The professor explicitly asks students to explain what the `10` in `bcrypt.hash("123", 10)` does.

### 10. "Data provisioning" is course-specific

**"Data provisioning"** = fetching data from a source and writing it to a target system. This is non-standard; use it only in the security context where the professor uses it (Slide 9). Do not introduce it in other contexts without sourcing.

---

## Banned patterns

Per Dunlosky (2013) — these do not produce durable learning. Never use as a primary mode:

- "Highlight these terms" or "underline key words" — generate cloze or checkpoints instead.
- "Re-read section X" — generate retrieval prompts instead.
- Summarization as the primary lesson mode — lessons must teach, not summarize.
- Keyword mnemonics for conceptual material.
- Emoji, decorative icons, motivational filler.
- "Good luck!", "You've got this!", "Let's dive in!"

---

## Compliant vs. defect example (domain: cookies + XSS)

**Defect — passive, hedging, definition-first:**
> "It might be worth noting that cookies could potentially be set with the HttpOnly flag, which may prevent access by JavaScript code."

**Compliant — active, mechanism-first, declarative:**
> "Setting the `HttpOnly` flag blocks JavaScript from reading the cookie value, which removes the XSS attack surface for session-token theft. Without it, any injected script on the page can call `document.cookie` and exfiltrate the token."
