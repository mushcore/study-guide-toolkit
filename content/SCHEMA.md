# Content Schema

Single source of truth for the shape of all study-guide content across the four BCIT CST Term-4 courses. Consumers (web app, print, Anki export, CLI, mobile) all read from this structure.

Any change to this schema MUST be reflected here first, then in `scripts/build-content.js` (the compiler), then in consumers.

> **Pedagogy is governed separately.** This doc specifies *file shapes and invariants* (what parses and builds). The *content quality* inside those shapes is governed by `content/STANDARDS.md` — pedagogical rules grounded in replicated learning science (Dunlosky 2013, Mayer CTML, productive failure, concreteness fading, elaborated feedback, etc.). Fields marked `optional` below are frequently *required* by STANDARDS — the schema is permissive so builds don't break on work-in-progress content; `/audit-content` enforces the pedagogical contract.

---

## Directory layout

```
content/
├── SCHEMA.md                              # this file
├── {courseId}/                            # 4736 | 4870 | 4911 | 4915
│   ├── course.yaml                        # course metadata
│   ├── flashcards.yaml                    # full flashcard bank, grouped
│   ├── mock-exam.yaml                     # timed MCQ bank
│   ├── lessons/
│   │   ├── 01-<kebab-slug>.md
│   │   ├── 02-<kebab-slug>.md
│   │   └── NN-<kebab-slug>.md
│   ├── code-practice/
│   │   ├── 01-<kebab-slug>.md
│   │   └── NN-<kebab-slug>.md
│   ├── topic-dives/
│   │   ├── <kebab-slug>.md               # no numeric prefix; ordered by frontmatter `priority`
│   │   └── ...
│   └── cheat-sheet.md                     # single file, H2 per block
```

`{courseId}` ∈ `{ "4736", "4870", "4911", "4915" }`.

---

## Global conventions

- **Encoding:** UTF-8, LF line endings, no BOM.
- **IDs:** kebab-case, lowercase, ASCII. Globally unique across all courses (prefix with course ID if collision risk — e.g. `4736-deadlock-coffman`).
- **Filenames:** kebab-case. Lessons and code-practice files carry a two-digit numeric prefix (`01-`, `02-`, …) to fix ordering on disk.
- **Dates:** ISO 8601 with explicit timezone offset (e.g. `2026-04-22T13:30:00-07:00`).
- **Tags:** lowercase, kebab-case, no spaces. Multi-word tags stay one token (`deadlock-recovery`, not `deadlock recovery`).
- **Language tags:** in fenced code blocks, use standard identifiers: `c`, `cpp`, `cs`, `java`, `js`, `ts`, `python`, `bash`, `powershell`, `sql`, `proto`, `xml`, `yaml`, `json`, `html`, `css`, `text`.
- **Unknown HTML:** when the source contains markup we can't cleanly map to Markdown (e.g. inline `<svg>`, complex `<table>` with colspans), keep it as raw HTML — CommonMark allows embedded HTML blocks.
- **No emoji.** No decorative icons.

---

## File formats

### 1. `course.yaml`

Tiny metadata. Matches the "Course" object in the app's data model.

**Required fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Matches directory name. |
| `code` | string | `"COMP 4736"` etc. |
| `name` | string | Human-readable course name. |
| `exam` | ISO datetime | Must include TZ offset. |
| `room` | string | Physical room. |
| `format` | string | Free-text: `"90 MCQ + short answer · 120 min"`. |

**Optional:**

| Field | Type | Notes |
|-------|------|-------|
| `instructor` | string | |
| `sections` | list[string] | Section IDs (A/B/C). |
| `notes` | string | Markdown. Rendered in dashboard course-card footer. |

**Example:**
```yaml
id: "4736"
code: "COMP 4736"
name: "Operating Systems"
exam: "2026-04-22T13:30:00-07:00"
room: "SE06-220"
format: "90 MCQ + short answer · 120 min"
instructor: "—"
notes: |
  Open book. Closed laptop.
  Bring a calculator.
```

---

### 2. `flashcards.yaml`

The full card bank for a course, grouped by Module → Topic → Card.

**Top-level shape:**
```yaml
modules:
  - id: <module-id>          # kebab-case, unique within course
    name: <module-name>      # display string
    topics:
      - id: <topic-id>       # kebab-case, globally unique
        name: <topic-name>
        tags: [<tag>, ...]   # lowercase, kebab-case
        prose: <one-paragraph context>   # plain text, 1–2 sentences
        cards:
          - type: <card-type>
            ... type-specific fields ...
```

**Topic fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | ✓ | Globally unique. Used as localStorage key for confidence. |
| `name` | string | ✓ | |
| `tags` | list[string] | ✓ | At least one tag. |
| `prose` | string | ✓ | 1–2 sentence summary, shown above cards. |
| `cards` | list[Card] | ✓ | At least one card. |
| `priority` | `high` \| `mid` \| `low` | optional | Author hint; loader may ignore. |
| `source` | string | optional | Lecture/slide reference. |

**Optional fields on every card type** (passed through the build verbatim; surfaced in the UI where the renderer supports them):

| Field | Type | Purpose | STANDARDS principle |
|-------|------|---------|---------------------|
| `explanation` | string (markdown, 1–3 sentences) | Why-it-matters / mechanism / mental model. Rendered in the "More detail" drawer on reveal. | Elaborative interrogation (high-utility #4) |
| `example` | string (markdown or inline HTML; ≤6 lines of code / one worked case / one mini-diagram) | Concrete worked case — numeric walk-through, code snippet, or labeled SVG. | Concreteness fading; worked-example effect |
| `source` | string | Traceable citation — `Part 9, Slide 14` / `Lab 06` / `research-deadlock.md §2.1` / `Ch 14 p.482`. | RAG grounding (hard gate) |
| `bloom` | `remember` \| `understand` \| `apply` \| `analyze` \| `evaluate` \| `create` | Cognitive level. Used for distribution audits and difficulty-adaptive scheduling. | Bloom's taxonomy (Anderson & Krathwohl 2001) |

The build passes these through without validation beyond the base card-type check. `/audit-content` verifies presence and sanity per STANDARDS.md.

**Card types** (discriminated by `type`):

#### `cloze` — fill in the blank(s)
```yaml
- type: cloze
  prompt: "The four Coffman conditions are {{mutual exclusion}}, {{hold-and-wait}}, {{no preemption}}, and {{circular wait}}."
  answer: "mutual exclusion, hold-and-wait, no preemption, circular wait"
```
- `{{word-or-phrase}}` double-brace markers are the blanks. Renderer tokenizes at display time; do not pre-tokenise.

#### `name` — recall a term
```yaml
- type: name
  prompt: "A process holds a resource while waiting on another. What condition?"
  answer: "Hold-and-wait"
```

#### Optional fields (any card type)

| Field | Type | Notes |
|-------|------|-------|
| `explanation` | string (Markdown) | 1-3 sentences. The "why it matters" mechanism — not a restatement of `answer`. Renders in the "More detail" drawer after reveal. |
| `example` | string (Markdown) | Concrete worked case: numeric walkthrough, code snippet (≤ 6 lines), or labelled mini-diagram. Must differ from the prompt setup. Renders in the same drawer. |
| `source` | string | Slide / lab / research reference. Format: `"Part 9, Slide 12"` or `"Lab 06"` or `"research-deadlock.md §3"`. Used for author traceability; not rendered in the current UI. |
| `bloom` | enum | `remember` \| `understand` \| `apply` \| `analyze` \| `evaluate` \| `create`. Author's Bloom-level tag. Used for corpus-wide distribution audits; not rendered in the current UI. |

#### `predict` — predict code output or behaviour
```yaml
- type: predict
  lang: c
  prompt: "What prints first?"           # optional; if absent, card shows code only
  code: |
    sem_t s; sem_init(&s, 0, 0);
    // Thread A:  sem_wait(&s);  printf("A\n");
    // Thread B:  printf("B\n"); sem_post(&s);
  answer: "B, then A. A blocks on sem_wait until B calls sem_post."
```

#### `diagram` — label blanks in a diagram
```yaml
- type: diagram
  prompt: "Complete the wait-for graph for a classic 2-process deadlock:"
  mermaid: |
    graph LR
      P1 -->|waits on| ???A
      P2 -->|waits on| ???B
      ???A -->|held by| P2
      ???B -->|held by| P1
  labels:
    "???A": "R1"
    "???B": "R2"
  answer: "R1 and R2 — each process holds one resource and waits on the other."
```

**Invariants:**
- `topic.id` unique across every course.
- Every topic has ≥1 card.
- `cloze.prompt` must contain ≥1 `{{…}}` blank.
- `diagram.labels` keys must appear verbatim in `diagram.mermaid`.
- `predict.lang` must be a recognised language tag (see Global conventions).

---

### 3. `mock-exam.yaml`

Timed multiple-choice bank.

**Top-level:**
```yaml
duration_seconds: 600          # how long the timer runs
pass_mark: 0.6                 # optional, 0..1
questions:
  - id: q1
    type: MCQ                  # MCQ | MULTI | SHORT  (MULTI = multiple correct)
    topic: "Session Beans"     # free-text, used for topic-aware feedback
    marks: 2
    question: "Which annotation eagerly instantiates a Singleton at app deployment?"
    choices:
      - "@PostConstruct"
      - "@Startup"
      - "@DependsOn"
      - "@Eager"
    correct: 1                 # 0-based index. For MULTI: list of indices [0, 2].
    rationale: "@Startup forces container init at deploy time rather than first-call."
```

**Field reference:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | ✓ | Unique within file. |
| `type` | enum | ✓ | `MCQ` (single correct) \| `MULTI` (multiple) \| `SHORT` (free-text). |
| `topic` | string | ✓ | Free-text topic label. |
| `marks` | int | ✓ | Point value. |
| `question` | string | ✓ | Question stem. May contain Markdown inline. |
| `choices` | list[string] | required for MCQ/MULTI | Markdown allowed inline. |
| `correct` | int \| list[int] \| string | ✓ | Int for MCQ, list for MULTI, string (ideal answer) for SHORT. |
| `rationale` | string | ✓ | Why the answer is right. Shown after submit. |
| `tags` | list[string] | optional | For filtering. A question tagged `pretest` is part of the day-one pretest subset (see STANDARDS.md — Pretesting / hypercorrection). |
| `difficulty` | `easy`\|`medium`\|`hard` | optional | |
| `bloom` | enum | optional | Same enum as card `bloom`. Required by STANDARDS for Bloom's-distribution audit. |
| `source` | string | optional | Traceable citation. Required by STANDARDS for RAG grounding. |

**Invariants:**
- If `type: MCQ`, `correct` is int in `[0, len(choices))`.
- If `type: MULTI`, `correct` is non-empty list of ints in range.
- If `type: SHORT`, `choices` omitted, `correct` is the canonical answer string.

---

### 4. `lessons/NN-<slug>.md`

Long-form teaching, one lesson per file. Consumed by the `Lessons` view.

**Frontmatter (YAML) — required:**
```yaml
---
n: 1                           # integer, 1-based
id: processes-vs-threads       # kebab-case, unique within course
title: "Processes vs threads"
hook: "One-line teaser shown under the title."
tags: [concurrency, memory]
module: "Concurrency & Sync"   # display module name
---
```

**Optional frontmatter:**

| Field | Type | Notes |
|-------|------|-------|
| `priority` | `high`\|`mid`\|`low` | Author hint. |
| `source` | string | Lecture/slide reference. Required by STANDARDS for RAG grounding. |
| `reading_time_min` | int | Estimated minutes. |
| `related` | list[string] | Other lesson IDs or topic IDs. Required by STANDARDS for schema interconnection (CLT germane load). |
| `bloom_levels` | list[enum] | Cognitive levels the lesson spans, e.g. `[understand, apply, analyze]`. Required by STANDARDS. Array (not scalar) because lessons span levels. |
| `pedagogy` | `productive-failure` \| `worked-example-first` \| `concreteness-fading` | Opening pattern. Productive-failure lessons open with a problem or paradox before teaching; worked-example-first show a fully worked case first; concreteness-fading opens concrete and generalizes. Defaults to concreteness-fading when omitted. See STANDARDS.md §Productive failure vs worked examples. |

**Body — CommonMark with these conventions:**

#### Headings
- `##` for major sections, `###` for subsections. Do NOT use `#` in body (that's reserved for the lesson title which lives in frontmatter).

#### Callouts (blockquote + bold label)
The first line of the blockquote is a bold label that determines the callout type. The compiler maps these to styled divs.

```markdown
> **Analogy**
> Processes are separate houses. Threads are roommates in one house — they share the kitchen (memory) but each has their own bed (stack).
```

Recognised labels (case-insensitive on the label, not the content):
- `**Analogy**` → `.analogy`
- `**Takeaway**` → `.takeaway`
- `**Pitfall**` → `.pitfall`
- `**Example**` → `.example`
- `**Note**` → `.note`
- `**Warning**` → `.warning`

Any blockquote without a recognised label renders as a plain `<blockquote>`.

#### Checkpoint (interactive Q/A)
```markdown
> **Q:** What does `fork()` return in parent vs child?
> **A:** Parent gets child's PID (>0); child gets 0; -1 on failure.
```
The compiler extracts these to `{ q, a }` pairs so the web app can render them as reveal-on-click components.

#### Code blocks
Fenced, with language tag:
````markdown
```c
pthread_create(&t, NULL, worker, &shared_data);
```
````
For terminal sessions, use `bash` or `console` (consumer decides highlighting).

#### Tables
Standard GFM tables:
```markdown
| Type | Annotation | State |
|------|------------|-------|
| Stateless | @Stateless | No client state |
```

#### Diagrams
- **Mermaid:** fenced block with `mermaid` as the language.
  ````markdown
  ```mermaid
  graph LR
    P1 --> R1
    R1 --> P2
  ```
  ````
- **SVG:** embed raw HTML. CommonMark permits block-level HTML.
  ```markdown
  <svg viewBox="0 0 680 260">...</svg>
  ```

#### Inline formatting
`**bold**`, `*italic*`, `` `inline code` ``, `[link](url)`. Don't use raw HTML for inline emphasis — prefer Markdown.

**Invariants:**
- First element of body is NOT a top-level `#` heading (title lives in frontmatter).
- Body is non-empty.
- Every fenced code block has a language tag.

---

### 5. `code-practice/NN-<slug>.md`

Coding problems with starter + solution + explanation. One problem per file.

**Frontmatter:**
```yaml
---
n: 1
id: jpa-entity-auto-pk
title: "JPA entity with auto-gen PK"
lang: java                     # default language for code fences below
tags: [jpa, entities]
source: "Lab 04"               # optional at schema level; STANDARDS requires it
pedagogy: worked-example-first # optional: worked-example-first | productive-failure | completion-problem
---
```

**Optional frontmatter:**

| Field | Type | Notes |
|-------|------|-------|
| `source` | string | Traceable citation (past-exam Q#, lab, slide). Required by STANDARDS. |
| `pedagogy` | enum | See STANDARDS.md §Productive failure vs worked examples. Defaults to `worked-example-first` for algorithmic drills, `productive-failure` for design problems. |

**Body — four H2 sections in this order:**

```markdown
## Prompt

Annotate as a JPA entity mapped to table `CUSTOMER`. id must be auto-generated.

## Starter

​```java
public class Customer {
    private Long id;
    private String email;
}
​```

## Solution

​```java
@Entity
@Table(name = "CUSTOMER")
public class Customer {
    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;
}
​```

## Why

`@Entity` + `@Table` map the class. `@Id` + `@GeneratedValue` declares the PK.
```

**Invariants:**
- Exactly four H2 sections: `Prompt`, `Starter`, `Solution`, `Why`. In that order.
- `Starter` contains exactly one fenced code block.
- `Solution` contains exactly one fenced code block.
- Both fences use the same language tag as frontmatter `lang`.

**COMP 4911 variant — line-annotated reading:**

For 4911 problems that are "read & annotate" rather than "write from scratch", use this variant — signalled by frontmatter `variant: annotation`:

```yaml
---
n: 1
id: ejb-stateless-session
title: "@Stateless session bean"
lang: java
variant: annotation
tags: [ejb, session-beans]
---
```

**Body — two H2 sections:**

```markdown
## Code

​```java
@Stateless
public class OrderService {
    @PersistenceContext
    private EntityManager em;

    public void placeOrder(Order o) {
        em.persist(o);
    }
}
​```

## Notes

- **line 1** · `@Stateless` — pooled session bean; no per-client state.
- **line 3** · `@PersistenceContext` — container injects a managed `EntityManager`.
- **line 7** · `em.persist(o)` — transitions entity to Managed; insert flushed at tx commit.
```

**Notes format:**
- Unordered list.
- Each item starts with `**line N**` (1-based, matching the code block), then ` · `, then a short tag (1–3 words), then ` — `, then the note text.
- Compiler parses this into `[{ line: int, tag: string, text: string }, …]`.

---

### 6. `topic-dives/<slug>.md`

Deep reference material for a single topic. Similar to lessons but non-ordered and typically more terse/table-heavy.

**Frontmatter:**
```yaml
---
id: deadlock
title: "Deadlock — prevention, avoidance, detection, recovery"
pillar: tech                   # tech | process
priority: high                 # high | mid | low
chapter: "Ch 5-7"              # optional free-text reference
tags: [deadlock, concurrency]
source: "Part 9"               # optional at schema level; STANDARDS requires it
bloom_levels: [understand, apply, analyze]  # optional; STANDARDS requires it
related: [memory, paging]      # optional; STANDARDS requires ≥1 cross-link
---
```

**Body:** same Markdown conventions as lessons (callouts, code, tables, diagrams). No ordering constraint — dives are navigated by the UI via tag filter / search.

**Optional frontmatter** (same semantics as lesson frontmatter):

| Field | Type | Notes |
|-------|------|-------|
| `source` | string | Traceable citation. Required by STANDARDS. |
| `bloom_levels` | list[enum] | Cognitive levels the dive spans. Required by STANDARDS. |
| `related` | list[string] | Other lesson/dive/topic IDs. Required by STANDARDS (CLT germane load). |

**Required content for specific dive types** (enforced by `/audit-content`, not by the build):

- **`exam-strategy-and-pitfalls`** — every course must include a dive with this id, `priority: high`. Contents: time allocation per question type, Part-1-vs-Part-2 strategy (if applicable), top-5 pitfalls extracted from past-exam solution keys, "when to skip and return" heuristics. Source: `materials/past-exams/` + any `generated/exam-study/research-*.md`. See STANDARDS.md §Per-course required artifacts.
- **Problem-solving topic dives** — must include ≥1 `**Example**` callout with step-by-step worked reasoning, and ≥1 `**Pitfall**` callout.

---

### 7. `cheat-sheet.md`

Printable exam-eve summary. One file per course.

**Frontmatter:** optional course-wide metadata only; per-block metadata goes in the body.

**Body:** flat list of `##` headings, each heading = one cheat-block:

```markdown
---
title: "COMP 4736 — exam-eve cheat sheet"
---

## Session beans — 3 types

- **@Stateless**: pooled, no client state
- **@Stateful**: per-client state, `@Remove` ends, `@PrePassivate` / `@PostActivate`
- **@Singleton**: one instance, `@Lock(READ/WRITE)`, `@Startup`, `@DependsOn`

## EntityManager core

- **`persist(e)`**: New → Managed (INSERT at flush)
- **`merge(e)`**: Detached → Managed (returns new managed instance)
- **`remove(e)`**: Managed → Removed (DELETE at flush)
- **`find(Class, id)`**: load by PK
```

**Compiler output:** one `{ heading, body_html, body_md }` record per `##` block.

**Invariants:**
- Body starts with an `##` heading (no prose above the first block).
- Each block is terse — bullets, short tables, inline code. No H3/H4 subheadings inside blocks (keeps print layout tight).

**STANDARDS-required blocks** (enforced by `/audit-content`):

- **`Formulas — quick reference`** — every course with formulas must include this block. Terse list: formula, one-line meaning, symbol glossary at the top. Skip only for non-quantitative courses. See STANDARDS.md §Per-course required artifacts.

---

## Compilation

The build pipeline is `scripts/build-content.js`. It reads this tree and produces consumer-ready bundles.

**Pipeline:**
1. Walk each `content/{courseId}/` directory.
2. Parse `course.yaml`, `flashcards.yaml`, `mock-exam.yaml` with a YAML parser.
3. For each `.md` file: split frontmatter (`gray-matter`), parse body (`remark` / `marked`).
4. Apply callout/checkpoint/code-practice transforms.
5. Emit either:
   - **JSON mode:** `content/_dist/{courseId}.json` — pure data, consumed via `fetch` or bundler.
   - **JS mode:** `content/_dist/{courseId}.js` — `window.CONTENT["{courseId}"] = {...}`, consumed via `<script>` tag.
6. Validate: every topic id unique, every card valid, every lesson has required frontmatter.

Both output modes produce the same object shape:

```ts
type CompiledCourse = {
  meta: { id, code, name, exam, room, format, instructor?, sections?, notes_html? },
  modules: Module[],                              // from flashcards.yaml
  mockExam: { duration_seconds, pass_mark?, questions: Question[] },
  lessons: Lesson[],                              // from lessons/*.md, sorted by n
  codePractice: CodeProblem[],                    // from code-practice/*.md, sorted by n
  topicDives: TopicDive[],                        // from topic-dives/*.md, sorted by priority→title
  cheatSheet: { title?, blocks: { heading, body_html, body_md }[] }
};

type Lesson = {
  n: int, id, title, hook, tags, module, priority?, source?,
  blocks: LessonBlock[]                           // parsed from body
};

type LessonBlock =
  | { kind: 'p' | 'h2' | 'h3', html, text }
  | { kind: 'code', lang, code }
  | { kind: 'callout', variant: 'analogy'|'takeaway'|'pitfall'|'example'|'note'|'warning', html, text }
  | { kind: 'checkpoint', q, a }
  | { kind: 'table', html }
  | { kind: 'mermaid', source }
  | { kind: 'html', html };                       // SVG, iframes, etc.

type CodeProblem = {
  n, id, title, lang, tags,
  variant: 'starter-solution' | 'annotation',
  // starter-solution:
  prompt_html?, starter?, solution?, why_html?,
  // annotation:
  code?, notes?: { line: int, tag: string, text: string }[]
};
```

Consumers that want less structure can use the raw HTML in each block; consumers that want React components consume the typed blocks.

---

## Adding new content

| Task | Steps |
|------|-------|
| Fix a typo in a lesson | Edit the `.md` file. Re-run `npm run build-content`. |
| Add a new lesson | Create `lessons/NN-slug.md` with next `n`. Build. |
| Add a flashcard to existing topic | Append to `cards:` list in `flashcards.yaml`. Build. |
| Add a new module | Add entry to `modules:` in `flashcards.yaml`, including its topics. Build. |
| Add a new course | Create `{newId}/` with all 7 files. Add id to the build script's course list. |
| Add a new card type | Update this doc → update validator → update compiler → update consumers. |
| Add a new callout variant | Update this doc → update compiler's callout map → update consumer CSS. |
| Add a new pedagogical rule | Update `content/STANDARDS.md` first (with citation) → add check to `/audit-content` → reference from this doc if it affects file shape. |

---

## Validation rules (for the build script)

Hard failures (build aborts):
- Unparseable YAML or Markdown frontmatter.
- Missing required frontmatter field.
- Duplicate `id` anywhere (topic, lesson, code-practice, mock-exam question).
- `cloze` card with no `{{…}}` blanks.
- `mock-exam` question with `correct` out of range.
- `code-practice` file missing required H2 sections or the wrong number of code fences.

Warnings (build succeeds, reports to stderr):
- Unknown callout label.
- Code fence without language tag.
- Lesson body empty.
- Tag used only once across corpus (likely a typo).
