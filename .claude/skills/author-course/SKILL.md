---
name: author-course
description: Drive Phase A end-to-end — produce a full canonical content/{id}/ tree from raw course materials, following the 5-stage playbook in ADD-NEW-COURSE.md §Phase A and enforcing content/STANDARDS.md at every audit gate. Pauses after each stage for user review. Use when the user says "author course {id}", "create content for {id}", "build study guide for {id}", "start a new course {id}", or invokes /author-course.
argument-hint: <course-id> [materials-path]
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

You are driving Phase A authoring for a new course. Your output is a complete, audit-clean `content/{id}/` tree — every rule from `content/STANDARDS.md` enforced. The five stages in `ADD-NEW-COURSE.md §Phase A` are the spec; this skill is the driver.

**Core principles (non-negotiable):**
- Every authored unit cites a source in `courses/COMP{id}/materials/` or a `research-*.md` file. LLM parametric knowledge is forbidden (STANDARDS §Source discipline).
- You pause after each stage. The user reviews and says "proceed" / redirects / asks for revisions. Do not chain stages without that handshake — authoring is judgment-heavy and per-stage quality gates prevent drift.
- No critical audit findings may cross a stage boundary. Warnings can if the user approves; advisories always can.
- Do not invent content. Sparse source → sparse output. If materials don't cover a topic, flag it rather than fabricate.

## Parallelism plan + drift mitigations

Three stages fan out to sub-agents; two stay serial. Parallel authoring drifts in voice + terminology + duplicate work unless actively mitigated — the mitigations below are as important as the fan-out itself.

| Stage | Mode | Fan-out | Mitigation |
|---|---|---|---|
| 1. Triage | **parallel** | 1 agent per `materials/` subfolder + 1 for research/graphify | Main thread dedups and merges into single topic-map; drives voice-guide + glossary produced next. |
| 1b. Voice guide + glossary | serial | — | Produces the drift-prevention artifacts every Stage 3 + 4 sub-agent reads verbatim. |
| 2. Course-level artifacts | serial | — | Three files with sequential dependencies; exam-strategy dive drives later decisions. |
| 3. Per-module authoring | **parallel by topic** | 4–8 agents per module; serial across modules | Voice-guide + glossary + reserved `n` ranges + per-topic scratch dirs + post-merge consistency sweep + module audit gate. |
| 4. Mock-exam | **parallel by topic** | 1 agent per topic with a non-trivial question count | Voice-guide + glossary + main-thread whole-bank checks (concept variability, distractor diversity, Bloom's distribution, id uniqueness). |
| 5. Final audit + register | serial | — | Whole-tree operations. |

**Drift mitigations (apply to every parallel stage):**

1. **Voice guide** (`_scratch/voice-guide.md`) — every sub-agent reads verbatim before drafting. Register, sentence length, banned patterns, course-specific conventions. Produced in Stage 1b.
2. **Glossary** (`_scratch/glossary.md`) — canonical term ↔ variants table. Every sub-agent uses the canonical form; variants are flagged as defects in the consistency sweep. Produced in Stage 1b, grown opportunistically as later stages surface more terms.
3. **Pre-reserved namespaces** — main thread assigns `n` ranges for lessons + code-practice, card id prefixes per topic, scratch-output paths per sub-agent. Prevents id + file collisions.
4. **Scratch-only writes per sub-agent** — each agent writes only to `_scratch/draft/{topic-id}/` or `_scratch/mock/{topic-id}.yaml`. Main thread merges into canonical tree. No agent touches `flashcards.yaml` or `mock-exam.yaml` directly.
5. **Post-merge consistency sweep** — main thread, after every fan-out: grep for glossary variants, spot-check 3 random artifacts for voice register, verify cross-references resolve, dedup overlapping cards/questions.
6. **Serial module boundary** — audit gate after every module in Stage 3. Prevents quality debt from compounding across modules.
7. **Whole-bank-only checks stay main-thread** — concept variability (≥2 surface forms per deep concept), Bloom's distribution, distractor diversity. Sub-agents can't see these because they're scoped to one topic.

## Inputs

- `$ARGUMENTS` — `<course-id> [materials-path]`. Course id required (e.g. `4920`). Materials path optional; defaults to `courses/COMP{id}/materials/` at TERM4 root.

If the course id is empty or `content/{id}/` already has substantive content, stop and clarify — this skill is for authoring *new* courses. Use `/enrich-course {id}` for upgrading existing trees.

## Preflight (run once, before Stage 1)

1. Confirm working directory is TERM4 root (`/Users/kevinliang/BCIT/CST/TERM4`). The skills, scripts, and content/ live here.
2. Confirm materials path exists and is non-empty. If it's empty, stop — need at least slides + syllabus + past exams to author.
3. Read `content/STANDARDS.md` end-to-end. This is the pedagogical contract.
4. Read `content/SCHEMA.md` — file shapes.
5. Read `ADD-NEW-COURSE.md §Phase A` — the 5-stage playbook you're driving.
6. Skim `.archive/` — do NOT follow anything there, it's retired workflow.
7. Check for prior attempts: if `content/{id}/_scratch/topic-map.md` already exists, ask the user whether to resume from there or start fresh.
8. `mkdir -p content/{id}/{_scratch,lessons,code-practice,topic-dives}`.

Report preflight status to the user in one sentence before starting Stage 1.

## Stage 1 — Triage (parallel read)

**Parallelize**: fan out one read-only sub-agent per `materials/` subfolder. Each extracts topic signals from its slice independently, main thread merges.

Spawn agents in a single tool-call message (so they run concurrently). Typical fan-out: `slides/`, `past-exams/`, `notes/`, `labs/`, `syllabus/`, `resources/` → 4–6 agents.

**Sub-agent brief per agent** (fill `{SUBFOLDER}`):

> Read every file under `courses/COMP{id}/materials/{SUBFOLDER}/`. Do not read other subfolders. Report (under 400 words):
> 1. Topics covered, with estimated emphasis per topic (bold / repeated / chapter-heading signals).
> 2. Every diagram encountered — type (page table, RAG, matrix, state machine, timing, tree), associated question or slide #.
> 3. For past-exams: question count per topic, wrong-answer patterns from solution keys if present.
> 4. For syllabus: exam date, format, room, allowed materials, instructor (once, for main thread).
> 5. Any terminology the professor uses that differs from common usage. Main thread will dedup across agents into a glossary.
>
> Do not write files. Return structured markdown.

Also spawn one additional agent to read (if present): `courses/COMP{id}/generated/exam-study/research-*.md` and `courses/COMP{id}/graphify-out/GRAPH_REPORT.md`. Report: dense topic summaries available per topic, god-node list, surprising cross-topic connections.

**Main thread merges** all agent outputs into `content/{id}/_scratch/topic-map.md`:

```markdown
# Topic map — {id}

Date: <ISO>
Sources scanned: <list of file counts per subfolder>

## Exam meta (from syllabus)
- Code: [COMP XXXX]
- Name: [...]
- Date: [ISO+TZ]
- Format: [...]
- Room: [...]
- Allowed: [open/closed book, calculator, cheat sheet]
- Instructor: [...]

## Modules (4–8)

### Module 1: <name> — kebab-id
- Topic: <name> — kebab-id
  - Weight: ~N% of final
  - Difficulty: low | mid | high
  - God-node status: yes (N connections) | no
  - Tags: [...]
  - Source coverage: <brief — which materials cover this>
  - Notes: <any nuance from past-exam patterns>

... (more topics, more modules)

## Ranked priority list (hardest × most-tested at top)
1. <module>/<topic> — weight N% × difficulty HIGH → rank 1
2. ...

## Diagram inventory (required code-practice targets)
- <past-exam source — q#> — diagram type: page table / RAG / matrix / state / timing — topic: <topic-id>
- ...
```

Fill every section. If any can't be filled from materials, say "unknown — materials do not cover". Don't invent.

**Gate** — print a summary of module count, topic count, priority top-5, and diagram count. Ask: "Review `content/{id}/_scratch/topic-map.md` and tell me what to change, or say 'proceed' to Stage 1b."

Wait for the user. Accept revisions, rewrite the file, re-print the summary, ask again. Only proceed when the user says "proceed".

## Stage 1b — Voice guide + glossary (consistency mitigation for parallel authoring)

Parallel authoring in Stage 3 + 4 risks drift: different agents pick different terms for the same concept, register wobbles between chatty and formal, sentence length varies. Produce two shared artifacts every downstream sub-agent reads verbatim.

### 1b.1 `content/{id}/_scratch/voice-guide.md`

```markdown
# Voice guide — {id}

Read this before writing any content. Apply verbatim.

## Register
- Second person ("you"), conversational but declarative (Mayer 2020 personalization principle; d ≈ 0.79).
- Never first person — "I", "my", "we'll show you" forbidden.
- Declarative. No "might", "could", "perhaps", "arguably" in teaching claims. Teachers assert.
- Active voice. Passive only when the actor is genuinely unknown or irrelevant.

## Sentence + paragraph
- ≤30 words per sentence. Stacked clauses split.
- Paragraphs 1–4 sentences. No walls of text.
- Lead with the mechanism. Bullets assert a claim AND explain it; bullet-as-noun is a defect.

## Format conventions (this course)
- [Derived from materials — e.g. "Professor uses `page-table entry` not `PTE`", "Addresses given in hex, byte-sized units", "All semaphore examples use `P`/`V` not `wait`/`signal`"]
- [Add domain-specific conventions here after Stage 1 reveals them]

## Banned patterns (STANDARDS §Banned patterns)
- Summarization as primary mode. Lessons teach, not summarize.
- "Highlight these key terms" guidance — use cloze instead.
- "Re-read section X" — replace with retrieval prompt.
- Keyword mnemonics on conceptual material.
- Emoji, decorative icons, motivational filler.
```

Derive the `Format conventions (this course)` block from the triage output — anything the professor consistently does differently from standard usage goes here.

### 1b.2 `content/{id}/_scratch/glossary.md`

Every term that appears ≥2 times in materials with potential for variant phrasing. Sub-agents pick the canonical form, never a variant.

```markdown
# Glossary — {id}

Read this before writing any content. Use the canonical form verbatim; never substitute a synonym.

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| page table entry | PTE, page table row, page descriptor | Row in a page table mapping a virtual page number to a physical frame number, plus status bits. | Part 10, Slide 34 |
| (etc.) | | | |
```

Produce ~30–80 entries depending on course density. Pull every term that triage surfaced as potentially-variant. Glossary is not a card set — it's an internal consistency tool.

**Gate** — print voice-guide key rules + glossary size. Ask: "Review `_scratch/voice-guide.md` + `_scratch/glossary.md`. Additions / corrections, or 'proceed' to Stage 2?"

## Stage 2 — Course-level artifacts

Three files, in this order, each sourced from materials:

### 2.1 `content/{id}/course.yaml`

Fields from the topic-map exam-meta + SCHEMA §1. ISO 8601 date with TZ offset.

### 2.2 `content/{id}/topic-dives/exam-strategy-and-pitfalls.md`

`priority: high`. Required content:
- Time allocation per question type (derive from exam format + past-exam patterns).
- Part-1 vs Part-2 strategy if applicable.
- Top-5 pitfalls extracted from past-exam solution keys — cite the specific past-exam source for each.
- "When to skip and return" heuristic.
- Off-by-one / unit / ordering traps specific to this course's domain.
- ≥1 `**Pitfall**` callout, ≥1 `**Takeaway**`, `related:` frontmatter linking to top-3 priority topics.

Source every pitfall. Invented pitfalls are forbidden.

### 2.3 `content/{id}/cheat-sheet.md`

Skeleton:
- If the course has formulas (detect via `=` / `^` / `log` / unit identifiers in materials), add `## Formulas — quick reference` block now, filled from materials.
- Stub `##` blocks for each major topic (one per topic from the topic map). Leave body content for Stage 3 to fill.

**Gate** — run `/audit-content {id}`. Report Pass 1 (schema) + Pass 9 (required-artifacts — strategy dive) status. Zero criticals required. Ask: "Review `course.yaml`, `exam-strategy-and-pitfalls.md`, `cheat-sheet.md` skeleton. Say 'proceed' for Stage 3 or redirect."

Wait for the user.

## Stage 3 — Per-module authoring (parallel by topic)

**Serial across modules** (audit gate prevents drift). **Parallel across topics within each module** — N topic-agents fan out concurrently, main thread merges, audit gates.

### 3.0 Main thread reserves namespaces before fan-out

Prevents file-write collisions + id collisions across sub-agents:

- **Lesson `n` range** for this module — e.g. if module 2 has 5 topics and lessons 1–4 are used, reserve `n = 5..9`. Assign one `n` per topic agent.
- **Code-practice `n` range** — same scheme, per applicable topic.
- **Card id namespace** — cards in topic `X` use id `X-card-NN` (kebab). Topic ids are globally unique from Stage 1.
- **Scratch output paths** — each agent writes to `_scratch/draft/{topic-id}/`. Main thread merges into canonical tree after fan-out.

### 3.1 Spawn topic agents (single tool-call message, all concurrent)

Per-topic agent brief, with `{TOPIC_ID}`, `{MODULE_NAME}`, `{COURSE_ID}`, and the topic's source-file list filled in by the main thread. Spawn one agent per topic in the module — typical fan-out 4–8 agents per module.

> Author all four content artifacts for topic `{TOPIC_ID}` in module `{MODULE_NAME}` of course `{COURSE_ID}`.
>
> ## Read first, in this order
> 1. `content/STANDARDS.md` — pedagogical contract.
> 2. `content/SCHEMA.md` §Card types, §Lessons, §Topic-dives, §Code-practice.
> 3. `content/{id}/_scratch/voice-guide.md` — voice + register. Apply verbatim.
> 4. `content/{id}/_scratch/glossary.md` — canonical terms. Never substitute a variant.
> 5. `content/{id}/_scratch/topic-map.md` — your topic's row + neighbors.
> 6. Your topic's source material (main thread provides the file list — typically 1–3 slide ranges + related past-exam questions + any `research-*.md`).
>
> ## Write to scratch only
> All output under `content/{id}/_scratch/draft/{TOPIC_ID}/`:
>
> - `lesson.md` — will become `lessons/{reserved_n}-<slug>.md`.
> - `dive.md` — will become `topic-dives/<slug>.md`.
> - `cards.yaml` — YAML fragment containing one topic entry `{id, name, tags, prose, cards: [...]}`. Main thread merges into `flashcards.yaml`.
> - `code-practice.md` if the topic is procedural OR maps to an entry in the diagram inventory. Will become `code-practice/{reserved_n}-<slug>.md`.
>
> Do NOT touch files outside `_scratch/draft/{TOPIC_ID}/`.
>
> ## Contract per artifact
> - **Lesson**: opens concrete (concreteness fading) OR with a problem (productive failure — set `pedagogy:` frontmatter). ≥1 `> **Q:**/**A:**` checkpoint. Closes with `**Takeaway**` callout. Frontmatter `bloom_levels` + `source` + `related`. ≤30 words per sentence. Mermaid / SVG for visual concepts. `**Pitfall**` callout for non-trivial topics.
> - **Dive**: frontmatter `priority` (from topic map weight), `source`, `bloom_levels`, `related`. Problem-solving topics: ≥1 worked `**Example**` with step-by-step reasoning. Non-trivial topics: ≥1 `**Pitfall**` sourced from past-exam solution keys (not invented). Visual concepts: Mermaid / SVG.
> - **Cards fragment**: every card has `type` + `source` + `bloom` + `explanation` + `example`. Cloze cards have `{{...}}` markers with sentence context. Cards span ≥2 types. Bloom's spans Remember → Apply at minimum. Atomic — 1 fact, answer ≤15 words, no enumeration, no yes/no. Ids use `{TOPIC_ID}-card-NN` prefix.
> - **Code-practice** (if applicable): `## Prompt` / `## Starter` / `## Solution` / `## Why` exact H2s. Starter + Solution each one fenced block, `lang` matches frontmatter. `## Why` explains mechanism + names 1–2 common wrong approaches. Diagram-inventory topics reproduce the past-exam diagram as inline SVG.
>
> ## Do not
> - Do not invent content. No source → flag and skip that claim.
> - Do not substitute glossary variants. Use the canonical form verbatim.
> - Do not deviate from voice-guide register (second person, declarative, ≤30 words/sentence, no first person, no hedges).
> - Do not cross-reference another topic's content — you haven't read it. Use `related: [id]` frontmatter only.
> - Do not touch any file outside `_scratch/draft/{TOPIC_ID}/`.
>
> ## Return
> One paragraph, under 200 words: artifacts produced, source files cited, claims dropped for missing source, terms you wanted to use that weren't in the glossary.

### 3.2 Main thread merges + consistency sweep

After all topic agents return:

1. **Assign `n` + rename**: move `_scratch/draft/{topic-id}/lesson.md` → `lessons/{reserved_n}-<slug>.md`, same for code-practice.
2. **Move dives**: `dive.md` → `topic-dives/<slug>.md`.
3. **Merge cards fragments**: concat every `cards.yaml` into the module's entry in `flashcards.yaml`. Grep for card-id collisions (shouldn't happen due to topic-id prefix, but verify).
4. **Glossary additions**: if agents flagged missing terms, add them to `_scratch/glossary.md` for future modules.
5. **Consistency sweep** — mitigate residual drift:
   - Grep every produced file for glossary-variant terms (variants agents may have snuck in). Fix in place.
   - Spot-check voice register across 3 random lessons — flag first-person slips, hedges, stacked-clause sentences >30 words. Fix.
   - Confirm every `related: [...]` frontmatter id resolves to a real topic / lesson / dive id.
   - Grep for duplicate or near-duplicate card prompts across the module (agents working in isolation may have produced overlapping cards). Dedup.

### 3.3 Backfill cheat-sheet

For each topic completed, backfill its `##` block in `cheat-sheet.md` with terse bullets / short tables / inline code. No H3s inside blocks.

### 3.4 Module gate

Run `/audit-content {id}`. Report critical + warning counts scoped to this module's files.

**Close every critical and warning before advancing.** Advisories accumulate for Stage 5.

Ask: "Module `<name>` complete. N criticals / N warnings / N advisories. Proceed to next module (`<next>`) or review?"

Wait for "proceed". Repeat Stages 3.0–3.4 for the next module in priority order until all authored.

## Stage 4 — Mock-exam assembly (parallel by topic)

Produce `content/{id}/mock-exam.yaml` — 40–50 novel items. Fan out question generation across topics; main thread assembles + enforces concept-variability (whole-bank view).

### 4.0 Main thread allocates question budget

From topic-map weights, allocate N questions per topic proportional to exam weight. Reserve 5–10 slots for `pretest` tag spanning foundational concepts. Reserve variety: ≥2 surface forms per high-weight deep concept.

### 4.1 Spawn topic agents (concurrent)

One agent per topic with a non-trivial question count. Agents write to `_scratch/mock/{topic-id}.yaml`. Brief:

> Generate `{N}` novel mock-exam questions for topic `{TOPIC_ID}` in course `{COURSE_ID}`.
>
> ## Read first
> 1. `content/STANDARDS.md` §Elaborated feedback + §Concept variability.
> 2. `content/{id}/_scratch/voice-guide.md` — register.
> 3. `content/{id}/_scratch/glossary.md` — canonical terms.
> 4. Your topic's source material + past-exam questions on this topic (main thread provides file list).
> 5. `content/{id}/topic-dives/{topic-slug}.md` and `content/{id}/lessons/NN-{topic-slug}.md` — so your questions align with what was taught.
>
> ## Write to `_scratch/mock/{topic-id}.yaml`
> YAML fragment — array of question objects (will be merged into `mock-exam.yaml` `questions:` list).
>
> ## Per question
> - `id`: `{topic-id}-q-NN`.
> - `type`: MCQ | MULTI | SHORT. Default MCQ. Use MULTI when ≥2 correct answers are pedagogically important.
> - `topic`: the topic display name.
> - `marks`: integer, match course weighting.
> - `question`: the stem. Markdown inline allowed.
> - `choices`: for MCQ/MULTI, list of options. 4 options default.
> - `correct`: int (MCQ) | list[int] (MULTI) | string (SHORT).
> - `rationale`: ≥3 sentences. Explains the correct answer's mechanism AND names the misconception each distractor targets. A rationale that only verifies the correct answer is a defect (Shute 2008).
> - `source`: cite the slide / past-exam / lab.
> - `bloom`: Bloom's level.
> - Optional `tags`, `difficulty`.
>
> ## Variety within your topic
> If generating ≥3 questions, produce ≥2 with different surface features (different numbers, framings, contexts) testing the same deep concept (concept variability, Barnett & Ceci 2002). Flag in a comment which pairs share deep structure so main thread can verify.
>
> ## Ground rules
> - Do NOT reuse past-exam questions verbatim. Generate novel questions testing the same concepts.
> - Distractors drawn from real past-exam wrong-answer patterns — not invented plausible-sounding wrong answers.
> - Voice-guide register. Glossary canonical terms.
> - Do not touch any file outside `_scratch/mock/{topic-id}.yaml`.
>
> Return a one-paragraph summary: question count, Bloom's spread, which pairs you flagged as concept-variability variants.

### 4.2 Main thread assembles + pretest picks

1. Concat every `_scratch/mock/{topic-id}.yaml` fragment into the `questions:` list of `mock-exam.yaml`. Add top-level `duration_seconds` (from course format) + optional `pass_mark`.
2. Pick 5–10 questions spanning foundational concepts, add `tags: [pretest]`. These are for day-one attempt before content review.
3. **Whole-bank checks main thread must do** (single-agent blind-spot):
   - Concept variability: for every high-weight topic, confirm ≥2 surface forms. If missing, request another pass from that topic's agent.
   - ID uniqueness across the full `questions:` list.
   - Distractor diversity — flag any distractors repeated verbatim across multiple questions.
   - Bloom's distribution across the full bank within ±10pts of 30/30/25/15.

### 4.3 Gate

`/audit-content {id}` — Pass 7 (distractor analysis) + Pass 8 (Bloom's + variability) + Pass 9 (pretest subset present) must all clean. Print audit summary. Ask: "Mock exam complete — N questions, pretest subset N. Proceed to Stage 5 or review?"

Wait.

**Opt-out**: if total bank is <15 questions (small course), skip fan-out — generate serially in main thread. Parallel overhead exceeds savings below that threshold.

## Stage 5 — Final audit + register

1. Full `/audit-content {id}`. Close every remaining critical. Warnings ship-blocking, advisories defer.
2. Verify cheat-sheet blocks all filled (no empty `##` headings).
3. Invoke `/add-course {id}` — it re-runs audit preflight, compiles the bundle, wires the three touchpoints (`scripts/build-content.js`, `content/_dist/_aggregator.js`, `app/src/main.jsx`), verifies `npm run build`.
4. Report final status: course id, bundle counts, touchpoints modified, audit warning/advisory counts for the user's follow-up list.

Tell the user the next manual step: `cd app && npm run dev`, smoke-test dashboard + every subview, then `./deploy.sh`.

## Handoff and safety

- Never chain stages without the user's "proceed" — authoring quality drifts without the gate.
- Never fabricate source citations. If materials don't cover a topic claim, output "— source not found in materials" and surface it to the user rather than invent.
- Never patch around audit criticals. Fix the underlying content.
- If `courses/COMP{id}/generated/exam-study/research-*.md` exists, consult it before drafting — those are often the densest starting points for `explanation` / `example` fields on cards and for pitfall content on dives.
- Respect the topic-map Stage-1 priority order in Stage 3. Don't author low-priority modules before high-priority ones.
- Keep the `_scratch/` directory out of the audit (it's ephemeral). Do not reference `_scratch/topic-map.md` from any committed content file.

## Failure modes

- **Materials too sparse for a topic**: flag it, mark the topic `priority: low`, minimum viable coverage (1 lesson paragraph + 1 dive + 3 cards + 1 mock question). Do not expand to pad.
- **Past-exam solution keys missing**: pitfall callouts become harder — use what the slides flag as "common mistakes" + genuine off-by-one / unit traps from the math. Flag to user.
- **Audit Pass 1 critical after a stage**: something broke YAML / frontmatter / structure. Stop, fix, re-audit before continuing.
- **User requests a stage redo**: reset the stage's outputs, don't try to patch. Quality compounds; patched-over work drifts.
- **Sub-agent returns with glossary-variant terms**: consistency sweep catches. Fix in place. If an agent consistently violates the glossary, its topic needs re-authoring, not patching — the artifact is contaminated by off-vocab phrasing throughout.
- **Sub-agent fabricates source citations** (claims a source that doesn't contain the claim): detected by main-thread spot-check during merge. Reject the artifact and re-spawn. Fabrication is a hard disqualifier — don't try to salvage.
- **Duplicate or overlapping cards across topic sub-agents**: dedup during merge. Near-duplicate prompts (>60% token overlap) across topics usually signal genuine cross-topic concepts — move to a cross-course tag rather than duplicate.
