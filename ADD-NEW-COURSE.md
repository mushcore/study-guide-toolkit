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
  ├── course.yaml                          # includes cheatsheet_allowed: bool
  ├── flashcards.yaml
  ├── mock-exam.yaml                       # 60–80 Qs, rich distractor analysis
  ├── lessons/
  │   ├── 00-exam-strategy.md             # kind: strategy (required)
  │   └── NN-<slug>.md
  ├── practice/                            # kind: code | applied; traces to lab/assignment/past-exam
  │   └── NN-<slug>.md
  └── cheat-sheet.md                       # OPTIONAL — only if cheatsheet_allowed: true
   │
   ▼   Phase B — compile + register in app
content/_dist/{id}.js           ← consumed by app
```

Two phases. Canonical spec lives in `content/SCHEMA.md` — that's the source of truth; this doc is the pipeline wrapper + the teaching standards that govern *what* you write, not just *where*.

Removed from earlier versions of this pipeline:
- `topic-dives/` — duplicated lesson content. Worked examples + pitfalls now live in lessons.
- `priorities` subview — invited browsing (low-utility re-reading per Dunlosky 2013).
- Unconditional cheat-sheet — only authored when the real exam permits one.

---

## Prereq — make the materials readable

Put raw materials somewhere Claude can read. Any path works; convention is `~/BCIT/CST/TERM4/courses/COMP{ID}/materials/` with sub-folders so the author can Glob them cleanly:

```
courses/COMP{ID}/materials/
├── slides/          # lecture slides — PDF preferred; PPTX/DOCX also fine
├── past-exams/      # practice finals + midterms + solutions (see "Midterms as structural anchors" below)
├── syllabus/        # course outline — exam format, room, date, weighting, EXAM COVERAGE LIST
├── textbook/        # (optional) PDFs
├── notes/           # lecture notes, exam-detail docs, professor emphasis, instructor emails about what is on the exam
├── labs/            # lab handouts + solutions — source for practice/ (kind: code or kind: applied)
├── assignments/     # assignment specs + solutions — source for practice/
└── resources/       # everything else
```

**Midterms as structural anchors.** When a practice final isn't available for a course, the midterm is the second-best signal for *question structure*: how questions are phrased, how many marks are assigned, what depth is expected, what proportions of MCQ / short / essay / code / applied appear, what kind of distractors are used. Instructors consistently recycle structural patterns between midterm and final even when the topic coverage differs. Drop midterms into `past-exams/` with a `midterm_` prefix in the filename (e.g. `midterm_2025.pdf`) so Stage 1 can tag them distinctly. The midterm informs:

- **Stage 4 mock-exam style**: question phrasing, marks distribution, distractor conventions. Novel questions should match the midterm's structural pattern even when testing finals-only topics.
- **Practice depth**: if the midterm asked "write class X given interface Y, 8 marks," the practice tree should include variants at that same complexity.
- **`lessons/00-exam-strategy.md` time allocation**: target times per question type calibrate off midterm data when no practice final exists.

The midterm does **not** define exam scope — scope still comes from the explicit exam-coverage doc (syllabus exam section / instructor study guide / final review sheet). See `content/STANDARDS.md §Exam-scope discipline`.

If materials are `.zip`, unpack them. If PPTX, PDF export is usually cleaner for extraction but PPTX works. DOCX works directly.

**Hard prereq — exam-coverage doc must be present.** `materials/` MUST contain a document stating what the final exam covers — typically the syllabus exam section, an instructor-provided study guide, a final review sheet, or an email from the professor listing testable topics. Stage 1 locates this document and writes `content/{id}/_scratch/exam-scope.md` from it; every downstream stage filters on that file. If no exam-coverage doc is in `materials/`, authoring stops. Ask the instructor for one. See `content/STANDARDS.md §Exam-scope discipline`.

No `.claude/skills/` or per-course `CLAUDE.md` — those were for a personal-study workflow we no longer use (archived to `.archive/`).

**Secondary sources also worth reading** when authoring (for existing courses 4736/4870/4911/4915):
- `courses/COMP{ID}/generated/` — diagnosis reports, the densely-sourced `generated/exam-study/research-*.md` topic notes from the old workflow, past mock exams, and explanation drafts. These are often the best starting point for writing a new lesson since they've already chewed through the slides.
- `courses/COMP{ID}/graphify-out/GRAPH_REPORT.md` — god nodes, communities, and surprising cross-topic connections. Useful for deciding which topics deserve the most ink and for spotting synthesis questions the slides don't make explicit.

For a brand-new course with no prior scaffolding, skip those — just work from `materials/`.

---

## Phase A — author `content/{id}/`

> **Skill shortcut**: `/author-course {id}` drives the five stages below, pausing for your review after each. Use it unless you want to step through manually. The skill expects the course id and the materials path; it reads the rest from `materials/syllabus/` or asks you for anything missing.

Read `content/STANDARDS.md` before authoring. It's the pedagogical contract; every rule here cites it.

Phase A is five stages with a quality gate after each. **Do not advance past a gate with open critical findings** — quality compounds when gates are enforced per-stage and drifts when they're not.

### Stage 1 — Triage

**Inputs read:** every file under `courses/COMP{id}/materials/` (slides, past exams, syllabus, notes, labs, assignments). Also read `courses/COMP{id}/generated/exam-study/research-*.md` and `courses/COMP{id}/graphify-out/GRAPH_REPORT.md` if present — these are the densest topic summaries the old workflow produced and the best map of cross-topic structure.

**Produces two files:**

1. `content/{id}/_scratch/exam-scope.md` — **first output, produced before the topic map.** Locate the exam-coverage doc in `materials/` (syllabus exam section, instructor-provided study guide, final review sheet, professor email). Copy the coverage list verbatim with citation to the source file. If no such doc exists, stop authoring and tell the user. See `content/STANDARDS.md §Exam-scope discipline`.

2. `content/{id}/_scratch/topic-map.md` with:
   - Modules (4–8) and topics under each, kebab-case ids globally unique across all courses.
   - Per-topic: `in-scope: tested | listed | prereq | out` tag (see STANDARDS for semantics), difficulty (low/mid/high), god-node status from graphify, tag list, list of source-material anchors (slide refs, past-exam question refs, lab/assignment refs).
   - Ranked authoring order for in-scope topics: hardest × most-heavily-tested at the top. Internal-only; not a consumer-facing priority. `out` topics are dropped entirely.
   - **Lab + assignment + past-exam practice inventory**: every lab question, every assignment question, every past-exam coding/applied question. Each becomes a required practice file per STANDARDS §Practice source discipline. Also tag whether the question includes a diagram (page table, RAG, matrix, state machine, timing) — those practice items become `kind: applied` with inline SVG.

**Gate:** you review + reprioritize the topic map and verify `exam-scope.md` matches the real coverage doc. Module/topic ids can't change after Stage 3 without a rename pass.

### Stage 2 — Course-level artifacts

Produce in this order (dependencies downstream):

1. **`content/{id}/course.yaml`** — meta pulled from the syllabus (+ whatever the skill asked for). Fields: `id`, `code`, `name`, `exam` (ISO 8601 with TZ offset), `room`, `format`, **`cheatsheet_allowed` (bool — inspect the exam format / syllabus for explicit permission; default `false`)**, `instructor`, `notes`.
2. **`content/{id}/lessons/00-exam-strategy.md`** (`kind: strategy`) — non-negotiable per STANDARDS. Contents: time allocation per question type, Part-1 vs Part-2 strategy (if applicable), top-5 pitfalls extracted from past-exam solution keys, "when to skip and return" heuristics, common off-by-one / unit / ordering traps. Sourced from `materials/past-exams/` + any `research-*.md`. The `strategy` kind waives the retrieval-checkpoint and opens-concrete rules.
3. **`content/{id}/cheat-sheet.md`** skeleton — **only if `cheatsheet_allowed: true`**. Stub `##` blocks for each in-scope major topic + a `## Formulas — quick reference` block if the course has formulas. Fill the Formulas block now from the materials; the per-topic blocks fill in Stage 3. When `cheatsheet_allowed: false`, skip this step entirely.

Writing the exam-strategy lesson first is deliberate — it forces you to commit to what the exam actually tests, which calibrates every Bloom's and pitfall decision in Stage 3.

**Gate:** required files exist, parse, cite sources from `materials/`. Run `/audit-content {id}` and confirm no Pass 1 (schema) or Pass 9 (required-artifacts — strategy lesson, cheat-sheet presence/absence matches flag) criticals.

### Stage 3 — Per-module authoring

One module at a time, **top of the Stage 1 authoring order first**. Loop only over `in-scope: tested | listed` topics — skip `out` entirely; `prereq` content is inlined into dependent lessons rather than getting its own files. For each in-scope topic, produce these three artifacts in order:

1. **`lessons/NN-<slug>.md`** — long-form teaching. Opens concrete (concreteness fading) or with a problem (productive failure — flag via frontmatter `pedagogy: productive-failure`). Contains ≥1 `> **Q:**/**A:**` retrieval checkpoint. Contains ≥1 `**Example**` callout with step-by-step reasoning for non-conceptual topics. Contains ≥1 `**Pitfall**` callout for non-trivial topics, sourced from real past-exam wrong-answer patterns (not invented). Closes with a `**Takeaway**` callout. Has `bloom_levels: [...]` + `source:` + `related:` frontmatter.
2. **Flashcards under the module in `flashcards.yaml`** — atomic, one fact per card. Every card has `source` + `bloom` + `explanation` (why-it-matters mechanism) + `example` (concrete worked case). Cards span ≥2 `type`s per topic (testing-effect moderator). Per-course Bloom's distribution targets 20/25/35/20.
3. **`practice/NN-<slug>.md`** — the retention engine. Required coverage: for every lab/assignment/past-exam question in the Stage 1 practice inventory mapped to this topic, ≥1 practice file. Each file: `kind: code` or `kind: applied`; `source:` traces to the lab/assignment/past-exam entry with variant notation (`Lab 04 Q2 (variant — simpler SQL join, 3 tables → 2)`); `## Why` / `## Common wrong approaches` names 1–2 common wrong approaches. Diagram-based past-exam questions use `kind: applied` with inline SVG reproducing the layout. Invented practice is forbidden — no lab/assignment/past-exam anchor means no practice item.

**Gate per module:** run `/audit-content {id}`. Close every critical + warning for the current module's files before starting the next module. Advisory findings accumulate — fix at Stage 5 or defer to `/enrich-course`. Do NOT carry critical/warning debt across module boundaries; quality compounds when gates are enforced, drifts when they aren't.

### Stage 4 — Mock-exam assembly

Produce `content/{id}/mock-exam.yaml` — **60–80 novel questions** matching the real exam's format, difficulty, and stem patterns. Pull deep concepts from the full in-scope topic map (Stage 1); distribute questions proportional to exam weight. Mock + practice are the retention engine — this stage invests heavily.

Required per question:
- `source:` citing slide/lab/assignment/past-exam question.
- `bloom:` tag.
- `rationale` — ≥3 sentences. Addresses the correct answer's mechanism AND the misconception each distractor targets (elaborated feedback, Shute 2008). A rationale that only verifies the correct answer is a defect.

Required across the bank:
- 8–12 questions tagged `pretest` — intended for day-one attempt before content review (hypercorrection, Metcalfe 2017).
- ≥3 surface forms per high-weight deep concept — same concept, different numbers / framings / contexts (concept variability, Barnett & Ceci 2002).
- Bloom's distribution target: 20/25/35/20 (Remember/Understand/Apply/Analyze+).

Do NOT reuse past-exam questions verbatim (they stay in `materials/`). Generate novel questions testing the same concepts, with distractors drawn from real past-exam wrong-answer patterns.

**Gate:** `/audit-content {id}` — Pass 7 (distractor analysis) + Pass 8 (Bloom's + variability) + Pass 9 (pretest subset present) all clean.

### Stage 5 — Final audit + register

1. Full `/audit-content {id}`. Close every remaining critical. Warnings are ship-blocking; advisories are polish and can defer.
2. If `cheatsheet_allowed: true`, fill any remaining `##` blocks in `cheat-sheet.md` from the Stage 3 topic content. If `cheatsheet_allowed: false`, verify no cheat-sheet file exists.
3. `/add-course {id}` — re-runs audit preflight, compiles, wires the two touchpoints, verifies `npm run build`.
4. `cd app && npm run dev` — smoke-test every subview.
5. `./deploy.sh` — ship.

### Exit criteria

- [ ] `content/{id}/_scratch/exam-scope.md` exists and every authored file's topic resolves to an entry in it.
- [ ] `course.yaml` has `cheatsheet_allowed` set; `cheat-sheet.md` presence matches the flag.
- [ ] `lessons/00-exam-strategy.md` exists with `kind: strategy`.
- [ ] Every in-scope topic has: lesson with retrieval checkpoint + `**Takeaway**` + `**Pitfall**` (non-trivial) + `**Example**` (problem-solving); flashcards with full enrichment; ≥1 practice item traced to a lab / assignment / past-exam.
- [ ] Every lab + assignment + past-exam coding/applied question in `materials/` is covered by ≥1 practice file.
- [ ] Mock-exam bank: 60–80 questions, 8–12 `pretest`-tagged, Bloom's within ±10pts of 20/25/35/20, ≥3 surface forms per high-weight concept.
- [ ] `## Formulas — quick reference` block present in cheat-sheet (if `cheatsheet_allowed: true` and course has formulas).
- [ ] `/audit-content {id}` reports zero critical findings.
- [ ] Zero duplicate ids across all courses.
- [ ] Zero private-data matches.

**Do not invent content.** Every claim traces back to `materials/` or a research file. LLM parametric knowledge is forbidden as a source. Sparse source → sparse output.

---

## Phase B — compile + register

> **Skill shortcuts**:
> - `/author-course {id} [materials-path]` — drives **Phase A** end-to-end (the five stages above). Pauses after each stage. Typical entry point for a new course.
> - `/audit-content {id}` — full audit against STANDARDS.md + schema invariants. Called at every stage gate; invoke directly anytime.
> - `/add-course {id}` — **Phase B** automation. Calls `/audit-content` preflight, compiles, wires the two touchpoints, verifies the React build. Called at the end of `/author-course` Stage 5.
> - `/enrich-course {id}` — for existing courses: runs the audit and produces `content/{id}/enrichment-plan.md` with a prioritized gap-closure plan grounded in materials. You review, then apply.

### B1. Compile the bundle

From the TERM4 repo root:

```
npm run build-content                     # all courses
node scripts/build-content.js {ID}        # just the new one
```

Output: `content/_dist/{ID}.js` (populates `window.CONTENT["{ID}"]`) and refreshed `content/_dist/manifest.json`. The build aborts on hard-fail invariants (duplicate ids, cloze with no blanks, mock-question `correct` out of range, practice file with wrong H2 sections for its `kind`/`variant`, cheat-sheet presence not matching `cheatsheet_allowed`, missing exam-strategy lesson, unparseable YAML).

### B2. Wire two hardcoded touchpoints

The app loads bundles via side-effect imports in a fixed order. Miss one of these two and the new course is silently invisible.

1. `scripts/build-content.js` (~line 21):
   ```js
   const COURSES = ['4736', '4870', '4911', '4915', '{NEW_ID}'];
   ```
2. `app/src/main.jsx` — add the side-effect import **before** `_aggregator.js`:
   ```js
   import '../../content/_dist/{NEW_ID}.js';
   ```

`_aggregator.js` auto-derives course ids from `Object.keys(window.CONTENT)` — no edit needed there.

If any practice file uses `variant: annotation` (`kind: code`), the `practice` subview dispatch in `app/src/App.jsx` may need to render the annotation variant. The current code reads `variant` off each practice item — no `courseId` hard-code required once the schema rename lands.

### B3. Verify

```
cd app && npm run dev
```

- Dashboard shows the new course card with correct exam countdown.
- `#/c/{NEW_ID}` renders; every subview (`lessons`, `mock`, `practice`, and — only if `cheatsheet_allowed: true` — `cheat`) has content.
- A topic card rates and persists in `localStorage['sgv2:conf']`.
- No console errors.

`npm run build` then `./deploy.sh` publishes. Don't push until local smoke test passes.

---

## Teaching standards

**Canonical source: `content/STANDARDS.md`.** Read it before authoring. It is the pedagogical contract — grounded in replicated learning science (Dunlosky 2013, Mayer CTML, productive failure, concreteness fading, pretesting, self-explanation, elaborated feedback, cognitive load theory, concept variability). Every rule in STANDARDS is enforceable and cites its evidence; live / fragile research is explicitly excluded.

Below is the **authoring contract** — the minimum each content type must carry. Anything the contract flags but you omit will be caught by `/audit-content`. Full rationale and citations live in STANDARDS.md.

### Quality dimensions × content types

| Dimension | Card | Lesson | Practice | Mock-Q | Cheat-block |
|---|---|---|---|---|---|
| **Source citation** | `source:` | frontmatter `source:` | frontmatter `source:` — lab/assignment/past-exam | `source:` | — |
| **Bloom's tag** | `bloom:` | `bloom_levels: [...]` | — | `bloom:` | — |
| **Elaborative encoding** (mechanism) | `explanation` | `**Takeaway**` callout | `## Why` (schema) | `rationale` (schema) | — |
| **Worked example** | `example` | `**Example**` ≥1 | `## Solution` (code) / `## Walkthrough` (applied) (schema) | — | — |
| **Dual coding** (visual concepts) | `diagram` type + SVG | Mermaid/SVG | inline SVG for applied kind with visual structure | — | — |
| **Retrieval affordance** | inherent | `> **Q:**/**A:**` checkpoint ≥1 (waived for `kind: strategy`) | inherent | inherent | — |
| **Pitfall / distractor** | — | `**Pitfall**` for non-trivial | `## Why` / `## Common wrong approaches` names 1–2 | distractor analysis in `rationale` | — |
| **Concept variability** | — | — | ≥2 variants per procedural concept | ≥3 surface forms per high-weight concept | — |
| **Concreteness fading** | — | opens concrete, generalizes (waived for `kind: strategy`) | — | — | — |

### Per-course required artifacts

Every course's `content/{id}/` must include:

1. **`_scratch/exam-scope.md`** — produced in Stage 1 from the exam-coverage doc in `materials/`. Every authored file traces to an entry. See `content/STANDARDS.md §Exam-scope discipline`.
2. **`lessons/00-exam-strategy.md`** (`kind: strategy`) — time allocation, domain-specific traps, "when to skip" heuristics, top-5 pitfalls from past-exam solution keys. Non-negotiable: single highest-leverage artifact in the exam-prep window.
3. **Practice coverage** — ≥1 practice file for every lab/assignment/past-exam coding/applied question in `materials/`. Diagram-carrying past-exam questions → `kind: applied` with inline SVG.
4. **Pretest mock-exam subset** — 8–12 questions tagged `pretest` intended for day-one attempt before content review (Richland 2009; Metcalfe 2017 hypercorrection).
5. **Cheat-sheet (conditional)** — authored only when `course.yaml.cheatsheet_allowed: true`. When authored and the course has formulas, include `## Formulas — quick reference` block.

### Hard gates (block registration)

`/audit-content` reports these as critical; `/add-course` refuses to register until they pass:

- `_scratch/exam-scope.md` exists; every authored file's topic resolves to an entry.
- Every card / question / file has `source:`.
- Every practice file's `source:` resolves to a lab, assignment, or past-exam entry.
- Every lab + assignment + past-exam coding/applied question in `materials/` has ≥1 matching practice file.
- Every non-strategy lesson has ≥1 retrieval checkpoint (`> **Q:**/**A:**`).
- Every problem-solving lesson has ≥1 `**Example**` callout with step-by-step reasoning.
- Every non-trivial lesson has ≥1 `**Pitfall**` callout.
- Every mock MCQ/MULTI `rationale` addresses each distractor, not just the correct answer (elaborated feedback — Shute 2008).
- `lessons/00-exam-strategy.md` exists with `kind: strategy`.
- `cheat-sheet.md` presence matches `course.yaml.cheatsheet_allowed`.
- Zero private-data matches (student IDs, personal names, self-assessments).
- Zero duplicate ids across all courses.
- Schema hard-fails from `content/SCHEMA.md §Validation` all clear.

### Advisory checks (surfaced, non-blocking)

- Bloom's distribution within ±10pts of 20/25/35/20.
- Cards have `explanation` + `example` fields populated.
- Cards span ≥2 `type`s per topic (testing-effect moderator).
- Non-strategy lessons open concrete, not with a bare definition (concreteness fading).
- Diagrams present for visual concepts.
- `related:` frontmatter links to ≥1 other topic (CLT germane load).
- Formulas cheat-block present (when `cheatsheet_allowed: true` and course has formulas).
- Pretest mock-exam subset tagged (8–12 questions).
- ≥3 surface forms per high-weight concept in mock-exam bank (concept variability).
- ≥2 variants per procedural concept in practice tree.
- Conversational register, not third-person passive (Mayer personalization principle).

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

**Practice** — `kind: code | applied` in frontmatter. `source:` must resolve to `materials/labs/*`, `materials/assignments/*`, or `materials/past-exams/*`.

- `kind: code`, `variant: starter-solution` (default): `## Prompt`, `## Starter`, `## Solution`, `## Why`. Starter + Solution each have one fenced block, same lang as frontmatter `lang`.
- `kind: code`, `variant: annotation`: `## Code`, `## Notes`. Notes is an unordered list; each item: `` **line N** · <tag> — <text> ``.
- `kind: applied`: `## Problem`, `## Walkthrough`, `## Common wrong approaches`, `## Why`. Inline SVG in `## Problem` for visual-structure problems (page tables, RAGs, matrices, state machines). Walkthrough ≥3 steps.

**Mock-exam** types: `MCQ` (single correct int), `MULTI` (list of correct ints), `SHORT` (canonical answer string, no `choices`).

**Lessons**: first body element is NOT a `#` heading (title lives in frontmatter). Body non-empty. Every fence language-tagged. Optional `kind: strategy` marks the exam-strategy lesson (waives retrieval-checkpoint and opens-concrete rules).

**Cheat sheet (conditional)**: only authored when `course.yaml.cheatsheet_allowed: true`. Body starts with `##`. Each `##` block is terse — no H3/H4 inside.

**Hard-fail invariants** (build aborts):
- Duplicate id anywhere.
- Cloze card with no `{{…}}` blanks.
- Mock-question `correct` out of range.
- Practice file missing required H2s for its `kind` + `variant`, or wrong fence count.
- `cheat-sheet.md` presence not matching `course.yaml.cheatsheet_allowed`.
- Missing `lessons/00-exam-strategy.md` with `kind: strategy`, or multiple lessons with that id.
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
