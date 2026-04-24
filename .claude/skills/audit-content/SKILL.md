---
name: audit-content
description: Full audit of a content/{id}/ tree against content/STANDARDS.md (pedagogical contract) + content/SCHEMA.md (hard-fail invariants). Catches both build-blocking defects and pedagogical gaps across every content type (cards, lessons, practice, mock-exam, conditional cheat-sheet). Writes content/{id}/audit-report.md. Use when the user says "audit course {id}", "check content for {id}", "validate {id}", "review content/{id}", or invokes /audit-content.
argument-hint: <course-id>
allowed-tools: Read, Write, Bash, Grep, Glob
disable-model-invocation: false
---

You are auditing a canonical course content tree under `content/{id}/` against two contracts:

1. **`content/SCHEMA.md`** — file shapes and hard-fail invariants. Violations break the build.
2. **`content/STANDARDS.md`** — pedagogical contract grounded in replicated learning science (Dunlosky 2013, Mayer CTML, productive failure, concreteness fading, pretesting, self-explanation, elaborated feedback, cognitive load theory, concept variability, exam-scope discipline, practice source discipline). Violations are quality defects.

Your job: find every defect. Cite file + line. Rank by severity. No reassurance, no motivational filler, no emoji. You do not reassure; you find defects.

## Inputs

- `$ARGUMENTS` — course id (e.g. `4736`). Required. If empty, ask and stop.
- `content/{id}/` — the tree to audit.
- `content/{id}/_scratch/exam-scope.md` — authoritative list of what the final exam covers. Every authored file's topic must resolve here.
- `content/STANDARDS.md` — pedagogical contract. **Read this first.** Every finding you produce cites a principle from here.
- `content/SCHEMA.md` — schema spec.
- `COMP{id}/materials/` — ground truth (when available). Needed for source spot-checks, exam-scope verification, and practice coverage (lab / assignment / past-exam).
- `COMP{id}/generated/exam-study/research-*.md` if present — dense source-grounded topic summaries.
- `COMP{id}/graphify-out/GRAPH_REPORT.md` if present — god nodes and community structure.
- Other `content/*/` trees — needed for globally-unique-id check.

If `content/{id}/` doesn't exist, stop and tell the user.

## Execution

Ten passes. Each pass produces findings ranked `critical` (blocks `/add-course`), `warning` (advisory but important), `advisory` (polish). All passes cite STANDARDS.md principles by name.

### Parallelism

Pass 1 runs **first and alone** on the main thread — subsequent passes are unreliable against broken YAML. If Pass 1 finds critical defects, stop there and report.

If Pass 1 clears, **Passes 2–10 are independent** and run in parallel. Fan out 9 sub-agents in a single tool-call message, each reading the same tree and producing a structured findings list scoped to its pass. Main thread merges into the final report.

**Before spawning agents**: the main thread has already read `content/STANDARDS.md`, `content/SCHEMA.md`, and `content/{id}/_scratch/exam-scope.md`. Do NOT tell sub-agents to re-read these files. Instead, copy the relevant pass section from this SKILL.md and the 1–3 STANDARDS paragraphs it cites directly into each brief. This eliminates 9× redundant reads of ~1000 lines.

Per-pass sub-agent brief (fill all `{PLACEHOLDERS}` before dispatching):

> Audit Pass {PASS_NUMBER} ({PASS_NAME}) for course `{id}`.
>
> ## Pass rules (do not re-read STANDARDS.md, SCHEMA.md, or SKILL.md)
> {COPY THE EXACT "### Pass N — Name" BLOCK FROM THIS SKILL.md HERE}
>
> ## Relevant STANDARDS excerpts
> {PASTE ONLY THE 1–3 PARAGRAPHS FROM STANDARDS.md THAT THIS PASS CITES — not the full file}
>
> ## Exam-scope doc (do not re-read)
> {PASTE THE CONTENT OF content/{id}/_scratch/exam-scope.md}
>
> ## Files to read — read ONLY these, nothing else
> {FILE_LIST — resolved from the per-pass table below; pass actual paths, not globs}
>
> Output: JSON array `[{severity, file, line, principle, finding, fix}]`. Cite STANDARDS.md principle by name. Do not touch files. Return ≤500 words + JSON.

Per-pass file list (main thread resolves globs and passes actual paths):

| Pass | Files to read |
|---|---|
| 2 | `flashcards.yaml`, `lessons/*.md`, `practice/*.md`, `mock-exam.yaml` — plus ≤10 random spot-check source files from `COMP{id}/materials/` |
| 3 | `flashcards.yaml`, `lessons/*.md`, `mock-exam.yaml` |
| 4 | `flashcards.yaml`, `lessons/*.md` |
| 5 | `lessons/*.md`, `practice/*.md` |
| 6 | `lessons/*.md`, `practice/*.md` |
| 7 | `lessons/*.md`, `mock-exam.yaml`, `practice/*.md` |
| 8 | `flashcards.yaml`, `mock-exam.yaml` |
| 9 | `course.yaml`, `cheat-sheet.md` (if present), `lessons/00-exam-strategy.md`, `mock-exam.yaml`, `practice/*.md` frontmatter — plus file names (not contents) of `COMP{id}/materials/labs/`, `materials/assignments/`, `materials/past-exams/` |
| 10 | Main thread runs all greps from the Pass 10 rules and passes match results inline; agent receives the match list only, not raw files |

All paths above are relative to `content/{id}/` unless noted. Pass 10 agent receives pre-computed grep output instead of reading the full tree.

**Consistency mitigation**: Pass agents don't share context. Main thread dedups findings at merge — the same file:line defect may surface under multiple passes (e.g. a missing `source:` on a flashcard shows in Pass 2 and is also visible in Pass 3 coverage). Dedup on `(file, line, finding-hash)` and cross-reference the principles that apply.

**Opt-out**: if the tree is small (<50 total files across all content types), parallel overhead exceeds savings — run passes serially in main thread.

### Pass 1 — Schema hard-fails

Maps 1:1 to `content/SCHEMA.md §Validation`. If any fail, later passes may be unreliable — report and continue only if YAML parses.

1. Required files present: `course.yaml`, `flashcards.yaml`, `mock-exam.yaml`, `lessons/00-exam-strategy.md`, at least one file under `lessons/` (beyond strategy), at least one file under `practice/`. `cheat-sheet.md` is conditional — see rule 10.
2. YAML + frontmatter parse. Use `node -e` with `js-yaml` + `gray-matter` from the TERM4 root.
3. IDs globally unique across all courses (collect from every `content/*/`).
4. Cloze cards have ≥1 `{{…}}` blank.
5. Mock-question `correct` in range per type (MCQ int, MULTI list, SHORT string, no `choices` for SHORT).
6. Practice H2 sections exact per `kind` + `variant`:
   - `kind: code`, `variant: starter-solution` (default): `Prompt / Starter / Solution / Why`. Starter + Solution each exactly one fenced block with lang matching frontmatter `lang`.
   - `kind: code`, `variant: annotation`: `Code / Notes`. Notes is unordered list.
   - `kind: applied`: `Problem / Walkthrough / Common wrong approaches / Why`. Walkthrough has ≥3 list items or ≥3 sentences.
7. Diagram card: every `???X` placeholder in `mermaid` appears as `labels:` key and vice-versa.
8. `predict.lang` in recognised enum per SCHEMA §Global conventions.
9. Lesson body does not start with `#` (title is in frontmatter).
10. `course.yaml.cheatsheet_allowed` present (bool). `cheat-sheet.md` presence matches: if `true`, file MUST exist; if `false`, file MUST NOT exist.
11. Exactly one lesson with `id: exam-strategy` and `kind: strategy`, located at `lessons/00-exam-strategy.md`.
12. Every `practice/*.md` has `kind: code | applied` + `source:` in frontmatter.
13. Fenced code blocks have language tags. Advisory when missing.
14. **Deprecated directories are absent**: `topic-dives/` and `code-practice/` must not exist. If found, critical (content is stale — migrate to `lessons/` + `practice/` before auditing further).

Severity: all `critical` except (13) which is `advisory`.

### Pass 2 — Source discipline (RAG grounding)

STANDARDS §Source discipline + §Practice source discipline. Every authored unit must cite its source.

1. Every card has `source:` (card-level OR topic-level `source:` that applies). Cards without either: critical.
2. Every lesson has frontmatter `source:`. Missing: critical.
3. Every practice file has frontmatter `source:`. Missing: critical.
4. **Practice source must resolve to lab / assignment / past-exam.** Per STANDARDS §Practice source discipline, slide-only sources are banned — practice without a lab/assignment/past-exam anchor is invented practice. Grep each practice file's `source:` for path tokens `labs/`, `assignments/`, `past-exams/`, `Lab `, `Assignment `, `Final`, `Midterm`, `A1`, `A2`, `A3`. Practice file whose source has none of these: critical. The variant notation `(variant — ...)` is expected and fine.
5. Every mock question has `source:`. Missing: critical.
6. **Source-citation spot-check (10 random cards + 5 random practice items)**: for each, if `COMP{id}/materials/` is available, grep the cited file/section for the claim / problem stem. If the source doesn't contain the claim: warning (RAG failure or stale citation).
7. Format sanity: source string contains a recognisable anchor (slide #, page #, section ref, file name, lab/assignment/exam identifier). Purely-nominal sources like "lecture" or "textbook" with no locator: warning.

### Pass 3 — Retrieval affordance

STANDARDS §High-utility #1 (practice testing). Every topic must enable retrieval.

1. Every non-strategy lesson has ≥1 `> **Q:** / > **A:**` checkpoint (regex in body). Missing: critical. Productive-failure lessons (`pedagogy: productive-failure`) especially need opening checkpoints — missing: critical. **Strategy lessons (`kind: strategy`) are waived** per STANDARDS §Per-course required artifacts.
2. Every lesson topic is linked by ≥1 card via shared topic id OR has inline `> **Q:**/**A:**` checkpoints. Neither: warning.
3. Every in-scope topic has at least one mock question (coverage). Topics with zero mock-coverage: warning.
4. Card-type variety per topic: every topic has cards spanning ≥2 `type`s (cloze+name, or name+predict, etc.) when the concept supports multiple formats. Single-type topics: advisory. STANDARDS §Testing-effect magnitude moderators.

### Pass 4 — Elaborative encoding

STANDARDS §High-utility #4 (elaborative interrogation).

1. Every card has `explanation` field. Missing: warning (advisory on legacy courses until enrichment pass).
2. Every non-strategy lesson ends with a `**Takeaway**` callout. Missing: warning. (Strategy lessons should still have one, but it's structural rather than pedagogical — warning not critical.)
3. Every `explanation` / `**Takeaway**` is mechanism-first (why / how), not a restatement of the answer / heading. Use heuristic: if the `explanation` substring matches the answer ≥50%, flag as "explanation restates answer": warning.

### Pass 5 — Worked examples + concreteness fading

STANDARDS §Productive failure vs worked examples + §Concreteness fading.

1. Every card has `example` field. Missing: advisory.
2. Every non-strategy, non-conceptual lesson has ≥1 `**Example**` callout OR inline worked-example code block. Missing: warning.
3. Every problem-solving lesson (tags include `deadlock`, `memory`, `query`, `scheduling`, `algorithm`, `routing`, `allocation`, `translation`, `sizing`, `calculation`, or course-specific equivalents — judgment on tag semantics) has ≥1 `**Example**` callout with step-by-step reasoning (≥3 lines of reasoning, not just problem+answer). Missing: critical.
4. Practice `kind: code` — `## Solution` + `## Why` present (schema also checks). Here verify `## Why` actually explains mechanism: length ≥ 2 sentences AND references the source lab/assignment/exam question. Short one-line `## Why`: warning.
5. Practice `kind: applied` — `## Walkthrough` has ≥3 steps AND explains each. `## Common wrong approaches` has ≥1 named approach. Walkthrough with a single step or no explanation: critical. Missing `## Common wrong approaches` entries: critical.
6. Concreteness-fading opening: every non-strategy lesson's first body block (after frontmatter) is a concrete instance — a named example, a specific input, a historical case. Lessons whose first block is `X is defined as …` or matches a bare definition pattern: warning. (Strategy lessons waived.)

### Pass 6 — Dual coding

STANDARDS §Mayer CTML principles 1, 3, 5. Visual concepts get diagrams.

1. Lessons tagged with concepts of natural visual structure (state machines, process trees, timing diagrams, pipelines, call flows, trees, graphs, matrices) must contain a `mermaid` fence or inline `<svg>`. Heuristic: tags matching `{state, machine, automaton, graph, tree, pipeline, sequence, timing, matrix, translation, page-table, rag}` flag the lesson as visual. Missing diagram on a visual lesson: warning.
2. Diagram labels integrated (spatial contiguity — Mayer #5): labels appear inside / adjacent to nodes, not in a separate legend. Heuristic: diagrams followed by a numbered caption legend — flag for manual review.
3. Practice `kind: applied` covering diagram-based past-exam questions (page tables, RAGs, matrices, state machines) must include inline SVG reproducing the layout in `## Problem`. Missing on a diagram-exam problem: critical per STANDARDS §Per-course required artifacts.
4. Card `diagram` type usage: if a course has ≥10 topics and zero `type: diagram` cards, flag advisory — likely an underused card type.

### Pass 7 — Pitfall + distractor analysis

STANDARDS §Elaborated feedback.

1. Every non-trivial, non-strategy lesson has ≥1 `**Pitfall**` callout. Trivial = intro / glossary-style (judgment based on body length and tag). Missing on non-trivial: warning. **Strategy lessons MUST have ≥1 `**Pitfall**` callout** (it's their core content): missing: critical.
2. Every mock-exam MCQ/MULTI `rationale` addresses each distractor, not just verifies the correct. Heuristic: for `n` choices, `rationale` references each incorrect choice (by content, letter, or position) OR names the misconception each targets. If `rationale` ≤ 2 sentences or only says "the correct answer is …" without distractor analysis: critical. Shute 2008. STANDARDS requires ≥3 sentences per rationale.
3. Practice `kind: code` `## Why` names 1–2 common wrong approaches. Missing: warning.
4. Practice `kind: applied` `## Common wrong approaches` list has ≥1 named approach with explanation. Single unexplained bullet: warning.

### Pass 8 — Bloom's distribution + concept variability

STANDARDS §Bloom's taxonomy + §Concept variability.

1. **Per-course Bloom's distribution.** Tally all cards + mock questions with `bloom:` field. Target ±10pts of **20 Remember / 25 Understand / 35 Apply / 20 Analyze+**. Outside ±10pts: warning. Outside ±15pts: critical (transfer will fail).
2. **Per-topic Bloom's spread.** Every in-scope topic has ≥1 card at Apply or higher. All-Remember topics: warning.
3. **Mock-exam concept variability.** For every high-weight topic (≥15% exam weight), require ≥3 surface forms testing the same deep concept. Under-3: warning. Heuristic for same-deep-structure: ≥2 questions on a topic share ≥60% prompt text overlap → flag as identical-surface; must appear ≥3 times distinct. Barnett & Ceci 2002.
4. **Practice concept variability.** Topics with only one practice file covering a procedural concept that admits variants: advisory ("consider a second variant with different inputs"). For high-weight procedural topics: warning if under 2 variants.

### Pass 9 — Per-course required artifacts + exam-scope mapping

STANDARDS §Per-course required artifacts + §Exam-scope discipline + §Practice source discipline.

1. `content/{id}/_scratch/exam-scope.md` exists. Missing: critical (authoring is forbidden without it).
2. `lessons/00-exam-strategy.md` exists with `kind: strategy`. Missing: critical.
3. The strategy lesson contains (a) time allocation per question type, (b) ≥5 top pitfalls, (c) a "when to skip" heuristic, (d) ≥1 `**Pitfall**` callout, (e) ≥1 `**Takeaway**` callout. Missing any: warning (unless all absent → critical).
4. **Exam-scope mapping**: every authored file (`lessons/*.md`, `practice/*.md`, every topic in `flashcards.yaml`, every mock question's topic) must map to an entry in `_scratch/exam-scope.md`. For each file, grep its topic/tags against the exam-scope content. Unmapped: critical. Allowed exception: the strategy lesson itself (it's about the exam, not tested on it).
5. **Cheat-sheet conditional**:
   - If `course.yaml.cheatsheet_allowed: true`, `cheat-sheet.md` must exist with non-empty `##` blocks. Missing or stub-only: warning.
   - If `course.yaml.cheatsheet_allowed: false`, `cheat-sheet.md` must NOT exist. Presence: critical.
   - If `cheatsheet_allowed: true` AND the course has formulas (heuristic: any lesson body contains `=` followed by ≥3 math tokens, or contains `^`, `log`, or unit-bearing identifiers like `bytes` / `ms`) → cheat-sheet must contain `## Formulas — quick reference`. Missing: warning.
6. Pretest mock-exam subset: 8–12 questions tagged `pretest`. Missing or out of range: warning. Richland 2009; Metcalfe 2017.
7. **Practice coverage gate**: for every file under `COMP{id}/materials/labs/`, `materials/assignments/`, and every coding/applied question in `materials/past-exams/`, at least one `practice/*.md` file has a `source:` that references it. Uncovered labs/assignments/past-exam questions: critical per STANDARDS §Practice source discipline. (If materials files aren't available, note and skip.)
8. Mock-exam total count in 60–80. Out of range: warning.

### Pass 10 — Peer-shareability + private data

STANDARDS §Peer-shareability.

1. Grep every content file for:
   - `A\d{8}` (BCIT student id pattern).
   - "my weak", "my comfort", "I think", "I should focus", "weak for me", "I struggle".
   - Paths under a home directory (`/Users/`, `/home/`, `C:\\Users\\`).
   - `lab submission` / attached labs pasted in.
   Any match: critical.
2. First-person framing: "I ", "me ", "my " at sentence start in teaching content. Context-check — "I/O" and similar don't count. Matches: warning.
3. Lecture references without mechanism: grep "lecture", "the professor", "we saw", "as discussed in class". Each hit: warning (reviewer decides whether surrounding prose teaches the mechanism).
4. Hedge words in teaching claims: " might ", " could be ", " perhaps", " probably", " arguably". Each hit: warning. Teachers assert.
5. Declarative-language opposite: weasel phrases `some people say`, `it is said that`, `one could argue`. Each hit: warning.

## Output

Write the report to `content/{id}/audit-report.md` (overwrite if present) AND print a summary to chat. File structure:

```markdown
# Content audit — {id}

Date: <ISO date>
Tree: content/{id}/

## Scorecard
| Pass | Name | Critical | Warning | Advisory |
|---|---|---|---|---|
| 1 | Schema hard-fails | N | N | N |
| 2 | Source discipline | N | N | N |
| 3 | Retrieval affordance | N | N | N |
| 4 | Elaborative encoding | N | N | N |
| 5 | Worked examples + concreteness | N | N | N |
| 6 | Dual coding | N | N | N |
| 7 | Pitfall + distractor analysis | N | N | N |
| 8 | Bloom's + concept variability | N | N | N |
| 9 | Required artifacts + exam-scope | N | N | N |
| 10 | Peer-shareability + private data | N | N | N |

**Overall verdict**: [Build-blocking — fix before `npm run build-content` / Gate-blocking — fix before `/add-course` / Polish — safe to ship]

**Hard-gate status** (per STANDARDS §Hard gates):
- [ ] `_scratch/exam-scope.md` exists; every authored topic resolves to an entry
- [ ] Every card/question/file has `source:`
- [ ] Every practice `source:` traces to lab/assignment/past-exam
- [ ] Every lab + assignment + past-exam coding/applied question has ≥1 matching practice file
- [ ] Every non-strategy lesson has ≥1 retrieval checkpoint
- [ ] Every problem-solving lesson has ≥1 worked example
- [ ] Every non-trivial lesson has ≥1 `**Pitfall**`
- [ ] Every MCQ/MULTI rationale addresses each distractor
- [ ] `lessons/00-exam-strategy.md` exists with `kind: strategy`
- [ ] Cheat-sheet presence matches `course.yaml.cheatsheet_allowed`
- [ ] Zero private-data matches
- [ ] Zero duplicate ids
- [ ] Schema invariants clear
- [ ] Deprecated `topic-dives/` and `code-practice/` directories absent

## Blockers (fix in order — highest impact per author-minute first)

1. **[Title]**
   - Severity: Critical | Warning | Advisory
   - Pass: [1–10]
   - STANDARDS principle: [cite]
   - File: content/{id}/path/to/file:LINE
   - Finding: [one sentence — what's wrong]
   - Fix: [one sentence — concrete change]

2. ...

## Strengths to preserve (max 3, one line each)
- ...
```

Sort blockers by severity then by fix-impact. Critical before warning before advisory. Within each severity: grouped by pass, ordered by how many downstream findings a single fix eliminates.

If Pass 1 finds critical YAML-parse or structural issues, stop there and report — Passes 2–10 can't be trusted against broken YAML.

If ALL passes return zero critical findings, explicitly say so and recommend proceeding to `/add-course {id}`.

## Non-negotiable rules

- Every finding cites file + line AND STANDARDS principle.
- No motivational filler. No "great start". No emoji.
- Don't edit the content tree — this is a critique pass. If the user wants fixes applied, that's `/enrich-course` or a manual pass.
- Spot-check source citations against `COMP{id}/materials/` when available — at least 10 cards + 5 practice items worth.
- If `materials/` is missing or unreachable, skip the source spot-check AND the practice coverage gate in Pass 9 and say so explicitly (don't silently pass).
- If `_scratch/exam-scope.md` is missing, that's an immediate Pass 9 critical — Pass 9.1 — and should be reported clearly before analyzing anything else in Pass 9.
