# Adding a New Course to the Study-Guide System

End-to-end recipe for turning a folder of raw course materials (slides, past exams, notes, labs) into a new course live in the `app/` web app.

> **Current flow is direct: raw materials → canonical `content/{id}/` tree → build → register.**
> There used to be two upstream phases — a personal-study scaffold (skills, graphify, `generated/`) and a per-course v1 HTML study guide — but the React+Vite app made both obsolete. See §Legacy at the bottom for what to ignore.

> **Read `content/STANDARDS.md` before authoring.** This doc governs pipeline mechanics; STANDARDS governs *what you write inside each file* — the pedagogical contract grounded in replicated learning science. Skipping it produces content that parses but doesn't teach.

---

## Pipeline at a glance

```
raw materials (PDF / PPTX / DOCX / zip)
   │
   ▼   Phase A — author canonical content from materials
content/{id}/
  ├── course.yaml
  ├── flashcards.yaml
  ├── mock-exam.yaml
  ├── lessons/NN-<slug>.md
  ├── code-practice/NN-<slug>.md
  ├── topic-dives/<slug>.md
  └── cheat-sheet.md
   │
   ▼   Phase B — compile + register in app
content/_dist/{id}.js           ← consumed by app
```

Two phases. Canonical spec lives in `content/SCHEMA.md` — that's the source of truth; this doc is the pipeline wrapper + the teaching standards that govern *what* you write, not just *where*.

---

## Prereq — make the materials readable

Put raw materials somewhere Claude can read. Any path works; convention is `~/BCIT/CST/TERM4/courses/COMP{ID}/materials/` with sub-folders so the author can Glob them cleanly:

```
courses/COMP{ID}/materials/
├── slides/          # lecture slides — PDF preferred; PPTX/DOCX also fine
├── past-exams/      # practice finals + midterms + solutions (ground truth for mock exam + common-mistake callouts)
├── syllabus/        # course outline — exam format, room, date, weighting
├── textbook/        # (optional) PDFs
├── notes/           # lecture notes, exam-detail docs, professor emphasis
├── labs/            # lab handouts + solutions (good source for code-practice)
└── resources/       # everything else
```

If materials are `.zip`, unpack them. If PPTX, PDF export is usually cleaner for extraction but PPTX works. DOCX works directly.

No `.claude/skills/` or per-course `CLAUDE.md` — those were for a personal-study workflow we no longer use (archived to `.archive/`).

**Secondary sources also worth reading** when authoring (for existing courses 4736/4870/4911/4915):
- `courses/COMP{ID}/generated/` — diagnosis reports, the densely-sourced `generated/exam-study/research-*.md` topic notes from the old workflow, past mock exams, and explanation drafts. These are often the best starting point for writing a new lesson or topic-dive since they've already chewed through the slides.
- `courses/COMP{ID}/graphify-out/GRAPH_REPORT.md` — god nodes, communities, and surprising cross-topic connections. Useful for deciding which topics deserve the most ink and for spotting synthesis questions the slides don't make explicit.

For a brand-new course with no prior scaffolding, skip those — just work from `materials/`.

---

## Phase A — author `content/{id}/`

> **Skill shortcut**: `/author-course {id}` drives the five stages below, pausing for your review after each. Use it unless you want to step through manually. The skill expects the course id and the materials path; it reads the rest from `materials/syllabus/` or asks you for anything missing.

Read `content/STANDARDS.md` before authoring. It's the pedagogical contract; every rule here cites it.

Phase A is five stages with a quality gate after each. **Do not advance past a gate with open critical findings** — quality compounds when gates are enforced per-stage and drifts when they're not.

### Stage 1 — Triage

**Inputs read:** every file under `courses/COMP{id}/materials/` (slides, past exams, syllabus, notes, labs). Also read `courses/COMP{id}/generated/exam-study/research-*.md` and `courses/COMP{id}/graphify-out/GRAPH_REPORT.md` if present — these are the densest topic summaries the old workflow produced and the best map of cross-topic structure.

**Produces:** `content/{id}/_scratch/topic-map.md` with:
- Modules (4–8) and topics under each, kebab-case ids globally unique across all courses.
- Per-topic: estimated exam weight (% of final marks), difficulty (low/mid/high), god-node status from graphify, tag list.
- Ranked priority list: hardest × most-heavily-tested at the top. This ranking drives Stage 3 authoring order.
- Diagram inventory: every past-exam question that includes a diagram (page table, RAG, matrix, state machine, timing) is listed — each becomes a required code-practice file per STANDARDS §Per-course required artifacts.

**Gate:** you review + reprioritize the topic map. Module/topic ids can't change after Stage 3 without a rename pass.

### Stage 2 — Course-level artifacts

Produce in this order (dependencies downstream):

1. **`content/{id}/course.yaml`** — meta pulled from the syllabus (+ whatever the skill asked for). Fields: `id`, `code`, `name`, `exam` (ISO 8601 with TZ offset), `room`, `format`, `instructor`, `notes`.
2. **`content/{id}/topic-dives/exam-strategy-and-pitfalls.md`** (`priority: high`) — non-negotiable per STANDARDS. Contents: time allocation per question type, Part-1 vs Part-2 strategy (if applicable), top-5 pitfalls extracted from past-exam solution keys, "when to skip and return" heuristics, common off-by-one / unit / ordering traps. Sourced from `materials/past-exams/` + any `research-*.md`.
3. **`content/{id}/cheat-sheet.md`** skeleton — stub `##` blocks for each major topic + a `## Formulas — quick reference` block if the course has formulas. Fill the Formulas block now from the materials; the per-topic blocks fill in Stage 3.

Writing the exam-strategy dive first is deliberate — it forces you to commit to what the exam actually tests, which calibrates every Bloom's and pitfall decision in Stage 3.

**Gate:** all three files exist, parse, cite sources from `materials/`. Run `/audit-content {id}` and confirm no Pass 1 (schema) or Pass 9 (required-artifacts — strategy dive) criticals.

### Stage 3 — Per-module authoring

One module at a time, **top of the Stage 1 priority list first**. For each topic within the module, produce these four artifacts in order:

1. **`lessons/NN-<slug>.md`** — long-form teaching. Opens concrete (concreteness fading) or with a problem (productive failure — flag via frontmatter `pedagogy: productive-failure`). Contains ≥1 `> **Q:**/**A:**` retrieval checkpoint. Closes with a `**Takeaway**` callout. Has `bloom_levels: [...]` + `source:` + `related:` frontmatter.
2. **`topic-dives/<slug>.md`** — deep reference. Problem-solving dives get ≥1 worked `**Example**` callout with step-by-step reasoning. Non-trivial dives get ≥1 `**Pitfall**` callout sourced from actual past-exam wrong-answer patterns (not invented). Has `priority`, `source`, `bloom_levels`, `related` frontmatter.
3. **Flashcards under the module in `flashcards.yaml`** — atomic, one fact per card. Every card has `source` + `bloom` + `explanation` (why-it-matters mechanism) + `example` (concrete worked case). Cards span ≥2 `type`s per topic (testing-effect moderator). Bloom's distribution across the module targets 30/30/25/15.
4. **`code-practice/NN-<slug>.md`** — for every procedural topic AND for every diagram-question from the Stage 1 diagram inventory. Starter-solution variant (or annotation variant course-wide). `## Why` section names 1–2 common wrong approaches.

**Gate per module:** run `/audit-content {id}`. Close every critical + warning for the current module's files before starting the next module. Advisory findings accumulate — fix at Stage 5 or defer to `/enrich-course`. Do NOT carry critical/warning debt across module boundaries; quality compounds when gates are enforced, drifts when they aren't.

### Stage 4 — Mock-exam assembly

Produce `content/{id}/mock-exam.yaml` — 40–50 novel questions matching the real exam's format, difficulty, and stem patterns. Pull deep concepts from the full topic map (Stage 1); distribute questions proportional to exam weight.

Required per question:
- `source:` citing slide/lab/past-exam question.
- `bloom:` tag.
- `rationale` — for MCQ/MULTI, addresses the correct answer's mechanism AND the misconception each distractor targets (elaborated feedback, Shute 2008). A rationale that only verifies the correct answer is a defect.

Required across the bank:
- ≥5 questions tagged `pretest` — intended for day-one attempt before content review (hypercorrection, Metcalfe 2017).
- ≥2 surface forms per deep concept — same concept, different numbers / framings / contexts (concept variability, Barnett & Ceci 2002).

Do NOT reuse past-exam questions verbatim (they stay in `materials/`). Generate novel questions testing the same concepts, with distractors drawn from real past-exam wrong-answer patterns.

**Gate:** `/audit-content {id}` — Pass 7 (distractor analysis) + Pass 8 (Bloom's + variability) + Pass 9 (pretest subset present) all clean.

### Stage 5 — Final audit + register

1. Full `/audit-content {id}`. Close every remaining critical. Warnings are ship-blocking; advisories are polish and can defer.
2. Fill any remaining `##` blocks in `cheat-sheet.md` from the Stage 3 topic content.
3. `/add-course {id}` — re-runs audit preflight, compiles, wires the three touchpoints, verifies `npm run build`.
4. `cd app && npm run dev` — smoke-test every subview.
5. `./deploy.sh` — ship.

### Exit criteria

- [ ] All seven canonical files exist and pass `/audit-content {id}` with zero critical findings.
- [ ] Every topic has: lesson with retrieval checkpoint + `**Takeaway**`, topic-dive with `**Example**` (if problem-solving) + `**Pitfall**` (if non-trivial), flashcards with full enrichment, code-practice (if procedural).
- [ ] `topic-dives/exam-strategy-and-pitfalls.md` present.
- [ ] `## Formulas — quick reference` block present (if applicable).
- [ ] `pretest`-tagged mock subset present.
- [ ] Diagram-inventory from Stage 1 fully covered by code-practice files.
- [ ] Zero duplicate ids across all courses.
- [ ] Zero private-data matches.

**Do not invent content.** Every claim traces back to `materials/` or a research file. LLM parametric knowledge is forbidden as a source. Sparse source → sparse output.

---

## Phase B — compile + register

> **Skill shortcuts**:
> - `/author-course {id} [materials-path]` — drives **Phase A** end-to-end (the five stages above). Pauses after each stage. Typical entry point for a new course.
> - `/audit-content {id}` — full audit against STANDARDS.md + schema invariants. Called at every stage gate; invoke directly anytime.
> - `/add-course {id}` — **Phase B** automation. Calls `/audit-content` preflight, compiles, wires the three touchpoints, verifies the React build. Called at the end of `/author-course` Stage 5.
> - `/enrich-course {id}` — for existing courses: runs the audit and produces `content/{id}/enrichment-plan.md` with a prioritized gap-closure plan grounded in materials. You review, then apply.

### B1. Compile the bundle

From the TERM4 repo root:

```
npm run build-content                     # all courses
node scripts/build-content.js {ID}        # just the new one
```

Output: `content/_dist/{ID}.js` (populates `window.CONTENT["{ID}"]`) and refreshed `content/_dist/manifest.json`. The build aborts on hard-fail invariants (duplicate ids, cloze with no blanks, mock-question `correct` out of range, code-practice with wrong H2 sections, unparseable YAML).

### B2. Wire three hardcoded touchpoints

The app loads bundles via side-effect imports in a fixed order. Miss one of these three and the new course is silently invisible.

1. `scripts/build-content.js` (~line 21):
   ```js
   const COURSES = ['4736', '4870', '4911', '4915', '{NEW_ID}'];
   ```
2. `content/_dist/_aggregator.js` (~line 6):
   ```js
   const ids = ['4736', '4870', '4911', '4915', '{NEW_ID}'];
   ```
3. `app/src/main.jsx` — add the side-effect import **before** `_aggregator.js`:
   ```js
   import '../../content/_dist/{NEW_ID}.js';
   ```

If the new course uses `annotation` code-practice, the `code` subview dispatch in `app/src/App.jsx` currently hard-codes `route.courseId === '4911'`. Extend that check (or, better, replace it with a `codeVariant` field read from `course.yaml`).

### B3. Verify

```
cd app && npm run dev
```

- Dashboard shows the new course card with correct exam countdown.
- `#/c/{NEW_ID}` renders; every subview (`priorities`, `lessons`, `dives`, `mock`, `code`, `cheat`) has content.
- A topic card rates and persists in `localStorage['sgv2:conf']`.
- No console errors.

`npm run build` then `./deploy.sh` publishes. Don't push until local smoke test passes.

---

## Teaching standards

**Canonical source: `content/STANDARDS.md`.** Read it before authoring. It is the pedagogical contract — grounded in replicated learning science (Dunlosky 2013, Mayer CTML, productive failure, concreteness fading, pretesting, self-explanation, elaborated feedback, cognitive load theory, concept variability). Every rule in STANDARDS is enforceable and cites its evidence; live / fragile research is explicitly excluded.

Below is the **authoring contract** — the minimum each content type must carry. Anything the contract flags but you omit will be caught by `/audit-content`. Full rationale and citations live in STANDARDS.md.

### Quality dimensions × content types

| Dimension | Card | Lesson | Dive | Code-prac | Mock-Q | Cheat-block |
|---|---|---|---|---|---|---|
| **Source citation** | `source:` | frontmatter `source:` | frontmatter `source:` | frontmatter `source:` | `source:` | — |
| **Bloom's tag** | `bloom:` | `bloom_levels: [...]` | same | — | `bloom:` | — |
| **Elaborative encoding** (mechanism) | `explanation` | `**Takeaway**` callout | same | `## Why` (schema) | `rationale` (schema) | — |
| **Worked example** | `example` | `**Example**` ≥1 | same | `## Solution` (schema) | — | — |
| **Dual coding** (visual concepts) | `diagram` type + SVG | Mermaid/SVG | same | inline SVG where applicable | — | — |
| **Retrieval affordance** | inherent | `> **Q:**/**A:**` checkpoint ≥1 | linked cards or inline Q/A | inherent | inherent | — |
| **Pitfall / distractor** | — | `**Pitfall**` for non-trivial | `**Pitfall**` for non-trivial | common-wrong note in `## Why` | distractor analysis in `rationale` | — |
| **Concept variability** | — | — | — | ≥1 variant per topic | ≥2 surface forms per deep concept | — |
| **Concreteness fading** | — | opens concrete, generalizes | opens concrete, generalizes | — | — | — |

### Per-course required artifacts

Every course's `content/{id}/` must include:

1. **`topic-dives/exam-strategy-and-pitfalls.md`** (`priority: high`) — time allocation, domain-specific traps, "when to skip" heuristics, top-5 pitfalls from past-exam solution keys. Non-negotiable: single highest-leverage artifact in the exam-prep window.
2. **Formulas quick-reference cheat-block** (`## Formulas — quick reference` in `cheat-sheet.md`) — required whenever the course has formulas. Terse; symbols defined once.
3. **Diagram-based code-practice** — for every past-exam question that includes a diagram (page table, RAG, matrix, state machine, timing), a matching code-practice file must reproduce the layout with inline SVG.
4. **Pretest mock-exam subset** — ~5–10 questions tagged `pretest` intended for day-one attempt before content review (Richland 2009; Metcalfe 2017 hypercorrection).

### Hard gates (block registration)

`/audit-content` reports these as critical; `/add-course` refuses to register until they pass:

- Every card / question / file has `source:`.
- Every lesson has ≥1 retrieval checkpoint (`> **Q:**/**A:**`).
- Every problem-solving topic-dive has ≥1 `**Example**` callout with step-by-step reasoning.
- Every non-trivial topic-dive has ≥1 `**Pitfall**` callout.
- Every mock MCQ/MULTI `rationale` addresses each distractor, not just the correct answer (elaborated feedback — Shute 2008).
- `topic-dives/exam-strategy-and-pitfalls.md` exists.
- Zero private-data matches (student IDs, personal names, self-assessments).
- Zero duplicate ids across all courses.
- Schema hard-fails from `content/SCHEMA.md §Validation` all clear.

### Advisory checks (surfaced, non-blocking)

- Bloom's distribution within ±10pts of 30/30/25/15.
- Cards have `explanation` + `example` fields populated.
- Cards span ≥2 `type`s per topic (testing-effect moderator).
- Lessons open concrete, not with a bare definition (concreteness fading).
- Diagrams present for visual concepts.
- `related:` frontmatter links to ≥1 other topic (CLT germane load).
- Formulas cheat-block present in quantitative courses.
- Pretest mock-exam subset tagged.
- Conversational register, not third-person passive (Mayer personalization principle).
- ≥2 surface forms per deep concept in mock-exam bank (concept variability).

### Banned patterns (low-utility per Dunlosky 2013)

Never generate as a primary mode:
- Highlighting / underlining — generate cloze or checkpoints instead.
- Re-reading guidance — generate retrieval prompts instead.
- Summarization as primary lesson mode — lessons must teach, not summarize (cheat-sheet is fine for summarization).
- Keyword mnemonics for conceptual material.
- Imagery-for-text ("visualize this paragraph") — use actual diagrams.

---

## Content schema — authoring cheat sheet

Full spec: `content/SCHEMA.md`. This is the short version for authoring time.

**IDs**: kebab-case, ASCII, globally unique across all courses.

**Callouts** (lesson/dive bodies — blockquote with bold label on first line):
- `**Analogy**`, `**Takeaway**`, `**Pitfall**`, `**Example**`, `**Note**`, `**Warning**` → typed div.
- `> **Q:** … \n > **A:** …` → interactive checkpoint (reveal-on-click).
- Other blockquotes → plain `<blockquote>`.

**Code fences**: always language-tagged. Recognised: `c cpp cs java js ts python bash powershell sql proto xml yaml json html css text mermaid console dockerfile makefile ini toml diff regex apache nginx`.

**Diagrams**: fenced `mermaid` (preferred) OR inline `<svg>` (kept as raw HTML — CommonMark allows it).

**Card types** (flashcards.yaml, discriminated by `type`):
- `cloze` — prompt contains `{{word-or-phrase}}` markers, ≥1 blank.
- `name` — term-recall, one unambiguous answer.
- `predict` — code fence + expected-output/behaviour explanation.
- `diagram` — Mermaid with `???X` placeholders + `labels:` dict mapping placeholders to answers.

**Code-practice** — **exactly** these H2s in order:
- `starter-solution` variant: `## Prompt`, `## Starter`, `## Solution`, `## Why`. Starter + Solution each have one fenced block, same lang as frontmatter `lang`.
- `annotation` variant (frontmatter `variant: annotation`): `## Code`, `## Notes`. Notes is an unordered list; each item: `` **line N** · <tag> — <text> ``.

**Mock-exam** types: `MCQ` (single correct int), `MULTI` (list of correct ints), `SHORT` (canonical answer string, no `choices`).

**Lessons**: first body element is NOT a `#` heading (title lives in frontmatter). Body non-empty. Every fence language-tagged.

**Cheat sheet**: body starts with `##`. Each `##` block is terse — no H3/H4 inside.

**Hard-fail invariants** (build aborts):
- Duplicate id anywhere.
- Cloze card with no `{{…}}` blanks.
- Mock-question `correct` out of range.
- Code-practice file missing required H2s or wrong fence count.
- Unparseable YAML / frontmatter.

**Warnings only** (build continues): unknown callout label, code fence without language tag, empty lesson body, tag used only once across corpus.

---

## Exit gate

| Phase | Done when | Proof |
|-------|-----------|-------|
| A | Canonical tree validates | `npm run build-content {ID}` succeeds with non-zero counts per section |
| B | App renders the course | `content/_dist/manifest.json` lists the id + `npm run dev` shows every subview populated, no console errors |

---

## Legacy

All retired workflow docs, extractor scripts, v1 HTML guides, and per-course scaffolding have been moved to `.archive/`. See `.archive/README.md` for the manifest. Nothing in the live pipeline reads from there — if you find yourself following an instruction from `.archive/`, stop: it's describing a retired workflow and will not work against the current React+Vite stack.

**Preserved at original paths** (not archived):
- `courses/COMP{ID}/materials/` — raw source materials, still the ground truth for authoring and updates.
- `scripts/build-content.js` — live compiler.
- `content/` and `content/_dist/` — canonical tree + compiled bundles.
- `app/` — the app.
- `deploy/` — GitHub Pages deploy target.
