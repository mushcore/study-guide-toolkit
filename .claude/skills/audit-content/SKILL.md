---
name: audit-content
description: Full audit of a content/{id}/ tree against content/STANDARDS.md (pedagogical contract) + content/SCHEMA.md (hard-fail invariants). Catches both build-blocking defects and pedagogical gaps across every content type (cards, lessons, dives, code-practice, mock-exam, cheat-sheet). Writes content/{id}/audit-report.md. Use when the user says "audit course {id}", "check content for {id}", "validate {id}", "review content/{id}", or invokes /audit-content.
argument-hint: <course-id>
allowed-tools: Read, Write, Bash, Grep, Glob
disable-model-invocation: false
---

You are auditing a canonical course content tree under `content/{id}/` against two contracts:

1. **`content/SCHEMA.md`** — file shapes and hard-fail invariants. Violations break the build.
2. **`content/STANDARDS.md`** — pedagogical contract grounded in replicated learning science (Dunlosky 2013, Mayer CTML, productive failure, concreteness fading, pretesting, self-explanation, elaborated feedback, cognitive load theory, concept variability). Violations are quality defects.

Your job: find every defect. Cite file + line. Rank by severity. No reassurance, no motivational filler, no emoji. You do not reassure; you find defects.

## Inputs

- `$ARGUMENTS` — course id (e.g. `4736`). Required. If empty, ask and stop.
- `content/{id}/` — the tree to audit.
- `content/STANDARDS.md` — pedagogical contract. **Read this first.** Every finding you produce cites a principle from here.
- `content/SCHEMA.md` — schema spec.
- `COMP{id}/materials/` — ground truth (when available). Needed for source spot-checks + missing-coverage detection. Also read `COMP{id}/generated/exam-study/research-*.md` if present — dense source-grounded topic summaries from the old workflow.
- `COMP{id}/graphify-out/GRAPH_REPORT.md` if present — god nodes and community structure. Used to validate priority calibration.
- Other `content/*/` trees — needed for globally-unique-id check.

If `content/{id}/` doesn't exist, stop and tell the user.

## Execution

Ten passes. Each pass produces findings ranked `critical` (blocks `/add-course`), `warning` (advisory but important), `advisory` (polish). All passes cite STANDARDS.md principles by name.

### Parallelism

Pass 1 runs **first and alone** on the main thread — subsequent passes are unreliable against broken YAML. If Pass 1 finds critical defects, stop there and report.

If Pass 1 clears, **Passes 2–10 are independent** and run in parallel. Fan out 9 sub-agents in a single tool-call message, each reading the same tree and producing a structured findings list scoped to its pass. Main thread merges into the final report.

Per-pass sub-agent brief (fill `{PASS_NUMBER}` and `{PASS_NAME}`):

> Run audit Pass {PASS_NUMBER} ({PASS_NAME}) for course `{id}` per `.claude/skills/audit-content/SKILL.md §Pass {PASS_NUMBER}`. Read the spec in full before starting. Output a JSON list of findings, one per defect: `{severity, file, line, principle, finding, fix}`. Cite STANDARDS.md principle by name. Do not touch files. Return under 500 words plus the JSON.

Each pass agent reads only the files its pass targets (schema files → Pass 1 agent reads everything; flashcards → Passes 2/4/8 agents read `flashcards.yaml`; etc.). Main thread passes the file list per agent when relevant to save context.

**Consistency mitigation**: Pass agents don't share context. Main thread dedups findings at merge — the same file:line defect may surface under multiple passes (e.g. a missing `source:` on a flashcard shows in Pass 2 and is also visible in Pass 3 coverage). Dedup on `(file, line, finding-hash)` and cross-reference the principles that apply.

**Opt-out**: if the tree is small (<50 total files across all content types), parallel overhead exceeds savings — run passes serially in main thread.

### Pass 1 — Schema hard-fails

Maps 1:1 to `content/SCHEMA.md §Validation`. If any fail, later passes may be unreliable — report and continue only if YAML parses.

1. All seven files present.
2. YAML + frontmatter parse. Use `node -e` with `js-yaml` + `gray-matter` from the TERM4 root.
3. IDs globally unique across all courses (collect from every `content/*/`).
4. Cloze cards have ≥1 `{{…}}` blank.
5. Mock-question `correct` in range per type (MCQ int, MULTI list, SHORT string, no `choices` for SHORT).
6. Code-practice H2 sections exact: starter-solution = `Prompt/Starter/Solution/Why`; annotation = `Code/Notes`. Starter + Solution each one fenced block with `lang` matching frontmatter.
7. Diagram card: every `???X` placeholder in `mermaid` appears as `labels:` key and vice-versa.
8. `predict.lang` in recognised enum per SCHEMA §Global conventions.
9. Lesson body does not start with `#` (title is in frontmatter).
10. Fenced code blocks have language tags. Advisory when missing.

Severity: all `critical` except (10) which is `advisory`.

### Pass 2 — Source discipline (RAG grounding)

STANDARDS §Source discipline. Every authored unit must cite its source.

1. Every card has `source:` (card-level OR topic-level `source:` that applies). Cards without either: critical.
2. Every lesson has frontmatter `source:`. Missing: critical.
3. Every topic-dive has frontmatter `source:`. Missing: critical.
4. Every code-practice file has frontmatter `source:`. Missing: critical.
5. Every mock question has `source:`. Missing: critical.
6. **Source-citation spot-check (10 random cards)**: for each, if `COMP{id}/materials/` is available, grep the cited file/section for the card's claim. If the source doesn't contain the claim: warning (RAG failure or stale citation).
7. Format sanity: source string contains a recognisable anchor (slide #, page #, section ref, file name). Purely-nominal sources like "lecture" or "textbook" with no locator: warning.

### Pass 3 — Retrieval affordance

STANDARDS §High-utility #1 (practice testing). Every topic must enable retrieval.

1. Every lesson has ≥1 `> **Q:** / > **A:**` checkpoint (regex in body). Missing: critical. (Productive-failure lessons especially need opening checkpoints — lessons with `pedagogy: productive-failure` frontmatter but no opening checkpoint: critical.)
2. Every topic-dive is either (a) linked to by ≥1 card via shared topic id OR (b) has inline `> **Q:** / > **A:**` checkpoints. Neither: warning.
3. Every course has at least one mock question per topic (coverage). Topics with zero mock-coverage: warning.
4. Card-type variety per topic: every topic has cards spanning ≥2 `type`s (cloze+name, or name+predict, etc.) when the concept supports multiple formats. Single-type topics: advisory. STANDARDS §Testing-effect magnitude moderators.

### Pass 4 — Elaborative encoding

STANDARDS §High-utility #4 (elaborative interrogation).

1. Every card has `explanation` field. Missing: warning (advisory on legacy courses until enrichment pass).
2. Every lesson ends with a `**Takeaway**` callout. Missing: warning.
3. Every topic-dive ends with a `**Takeaway**` callout. Missing: warning.
4. Every `explanation` / `**Takeaway**` is mechanism-first (why / how), not a restatement of the answer / heading. Use heuristic: if the `explanation` substring matches the answer ≥50%, flag as "explanation restates answer": warning.

### Pass 5 — Worked examples

STANDARDS §Productive failure vs worked examples + Concreteness fading.

1. Every card has `example` field. Missing: advisory.
2. Every lesson has ≥1 `**Example**` callout OR inline worked-example code block. Missing on non-conceptual lessons: warning.
3. Every problem-solving topic-dive (tags include `deadlock`, `memory`, `query`, `scheduling`, `algorithm`, `routing`, `allocation`, `translation`, `sizing`, `calculation`, or course-specific equivalents — use judgment on tag semantics) has ≥1 `**Example**` callout with step-by-step reasoning (≥3 lines of reasoning, not just problem+answer). Missing: critical.
4. Code-practice `## Solution` + `## Why` present (schema requires these; Pass 1 also checks). Here verify the `## Why` actually explains the mechanism — length ≥ 2 sentences AND references the corresponding slide/page/technique. Short one-line `## Why`: warning.
5. Concreteness-fading opening: every lesson's first body block (after frontmatter) is a concrete instance — a named example, a specific input, a historical case. Lessons whose first block is `X is defined as …` or matches a bare definition pattern: warning. (This supersedes the old "concrete before abstract" — requires a gradient, not just existence.)

### Pass 6 — Dual coding

STANDARDS §Mayer CTML principles 1, 3, 5. Visual concepts get diagrams.

1. Topic-dives tagged with concepts of natural visual structure (state machines, process trees, timing diagrams, pipelines, call flows, trees, graphs, matrices) must contain a `mermaid` fence or inline `<svg>`. Heuristic: tags matching `{state, machine, automaton, graph, tree, pipeline, sequence, timing, matrix, translation, page-table, rag}` flag the dive as visual. Missing diagram on a visual dive: warning.
2. Diagram labels integrated (spatial contiguity — Mayer #5): labels appear inside / adjacent to nodes, not in a separate legend. Heuristic: diagrams followed by a numbered caption legend — flag for manual review.
3. Code-practice files covering diagram-based past-exam questions (page tables, RAGs, matrices) must include inline SVG reproducing the layout. Missing on a diagram-exam problem: critical per STANDARDS §Per-course required artifacts.
4. Card `diagram` type usage: if a course has ≥10 topics and zero `type: diagram` cards, flag advisory — likely an underused card type.

### Pass 7 — Pitfall + distractor analysis

STANDARDS §Elaborated feedback.

1. Every non-trivial topic-dive has ≥1 `**Pitfall**` callout. Trivial = intro / glossary-style (judgment based on body length and tag). Missing on non-trivial: critical.
2. Every non-trivial lesson has ≥1 `**Pitfall**` callout. Missing: warning.
3. Every mock-exam MCQ/MULTI `rationale` addresses each distractor, not just verifies the correct. Heuristic: for `n` choices, `rationale` references each incorrect choice (by content, letter, or position) OR names the misconception each targets. If `rationale` ≤ 2 sentences or only says "the correct answer is …" without distractor analysis: critical. Shute 2008.
4. Code-practice `## Why` sections name 1–2 common wrong approaches. Missing: warning.

### Pass 8 — Bloom's distribution + concept variability

STANDARDS §Bloom's taxonomy + §Concept variability.

1. **Per-course Bloom's distribution.** Tally all cards + mock questions with `bloom:` field. Target ±10pts of 30 Remember / 30 Understand / 25 Apply / 15 Analyze+. Outside ±10pts: warning. Outside ±15pts: critical (transfer will fail).
2. **Per-topic Bloom's spread.** Every topic has ≥1 card at Apply or higher. All-Remember topics: warning.
3. **Mock-exam concept variability.** For each topic with ≥3 mock questions, check that questions vary surface features (numbers, named entities, phrasing) while preserving the deep concept. Heuristic: if ≥2 questions on a topic share ≥60% prompt text overlap, flag: warning. Barnett & Ceci 2002.
4. **Code-practice concept variability.** Topics with only one code-practice file covering a procedural concept that admits variants: advisory ("consider a second variant with different inputs").

### Pass 9 — Per-course required artifacts

STANDARDS §Per-course required artifacts.

1. `topic-dives/exam-strategy-and-pitfalls.md` exists with `priority: high`. Missing: critical.
2. The strategy dive contains (a) time allocation per question type, (b) ≥5 top pitfalls, (c) a "when to skip" heuristic. Missing any: warning.
3. Formulas quick-reference cheat-block: course has formulas (heuristic: any lesson/dive body contains `=` followed by ≥3 math tokens, or contains `^`, `log`, or unit-bearing identifiers like `bytes` / `ms`) → `cheat-sheet.md` must contain a block titled `Formulas — quick reference` (case-insensitive). Missing: warning.
4. Pretest mock-exam subset: ≥5 questions tagged `pretest`. Missing: warning. Richland 2009; Metcalfe 2017.
5. Diagram-based code-practice coverage: for every past-exam question in `COMP{id}/materials/past-exams/` that includes a diagram, a matching code-practice file exists in `content/{id}/code-practice/`. Missing: critical per STANDARDS. (If past-exam files aren't available, note and skip.)

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
| 5 | Worked examples | N | N | N |
| 6 | Dual coding | N | N | N |
| 7 | Pitfall + distractor analysis | N | N | N |
| 8 | Bloom's + concept variability | N | N | N |
| 9 | Per-course required artifacts | N | N | N |
| 10 | Peer-shareability + private data | N | N | N |

**Overall verdict**: [Build-blocking — fix before `npm run build-content` / Gate-blocking — fix before `/add-course` / Polish — safe to ship]

**Hard-gate status** (per STANDARDS §Hard gates):
- [ ] Every card/question/file has `source:`
- [ ] Every lesson has ≥1 retrieval checkpoint
- [ ] Every problem-solving topic-dive has ≥1 worked example
- [ ] Every non-trivial topic-dive has ≥1 `**Pitfall**`
- [ ] Every MCQ/MULTI rationale addresses each distractor
- [ ] `topic-dives/exam-strategy-and-pitfalls.md` exists
- [ ] Zero private-data matches
- [ ] Zero duplicate ids
- [ ] Schema invariants clear

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
- Spot-check source citations against `COMP{id}/materials/` when available — at least 10 cards worth.
- If `materials/` is missing or unreachable, skip the source spot-check and say so explicitly (don't silently pass).
