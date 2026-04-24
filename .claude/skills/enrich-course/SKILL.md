---
name: enrich-course
description: Upgrade an existing course's content/{id}/ tree to current content/STANDARDS.md. Runs /audit-content to find gaps, then reads materials + research notes + graphify report to produce a prioritized enrichment plan at content/{id}/enrichment-plan.md. Handles legacy-schema migration (drop topic-dives, rename code-practice → practice, add exam-strategy lesson, handle conditional cheat-sheet) alongside content gaps. Does NOT apply patches — user reviews and applies. Use when the user says "enrich course {id}", "upgrade {id} content", "improve course {id}", "bring {id} up to standards", or invokes /enrich-course.
argument-hint: <course-id>
allowed-tools: Read, Write, Bash, Grep, Glob
disable-model-invocation: false
---

You are producing a **patch plan**, not patches. Your output is a single file: `content/{id}/enrichment-plan.md`. The user reviews it, pushes back on anything weak, and applies the patches themselves (or delegates to another session). You do not edit the content tree.

The goal is to bring an existing course's content to the current pedagogical standard in `content/STANDARDS.md`. Most existing courses were authored before the current STANDARDS + SCHEMA and will have a mix of:

1. **Legacy-schema debt** — `topic-dives/` tree present (must be deleted; worked examples and pitfalls lift into lessons), `code-practice/` directory (must be renamed to `practice/` with `kind:` field added), missing `course.yaml.cheatsheet_allowed`, missing `_scratch/exam-scope.md`, missing `lessons/00-exam-strategy.md` (strategy may currently be a `topic-dive`).
2. **Content gaps** — missing `explanation` / `example` / `source` / `bloom` on cards, missing `**Pitfall**` callouts on lessons, flat Bloom's distributions, sparse practice coverage vs labs/assignments/past-exams, under-varied mock-exam bank, out-of-scope content authored because no exam-scope filter existed.

Your job: find both classes of defect, trace each fix to concrete source material, and produce a patch plan the user can work through top-down.

## Inputs

- `$ARGUMENTS` — course id. Required. If empty, ask and stop.
- `content/STANDARDS.md` — **read first**, end-to-end. This is the target state.
- `content/SCHEMA.md` — file shapes.
- `content/{id}/` — current tree. What exists now.
- `COMP{id}/materials/` — ground truth. Every proposed addition traces here. Slides, past exams, syllabus, notes, labs, assignments.
- `COMP{id}/generated/exam-study/research-*.md` — dense source-grounded topic summaries from the old workflow.
- `COMP{id}/graphify-out/GRAPH_REPORT.md` — god nodes + community structure.
- Latest `content/{id}/audit-report.md` (if present) — starting point; re-run `/audit-content {id}` to refresh before proceeding.

If `content/{id}/` doesn't exist, stop — this skill upgrades existing courses, not new ones. Point to `/add-course` instead.

## Execution

### Step 1 — Refresh the audit

Run `/audit-content {id}` (invoke the skill; don't re-implement its logic here). Read `content/{id}/audit-report.md` after it finishes. Capture every critical, warning, and advisory finding — the patch plan addresses all severity levels.

If the audit surfaces Pass 1 critical defects (legacy `topic-dives/` or `code-practice/` directory found), those become **Category H** patches (see below). Do not abort — legacy-schema debt is exactly what this skill is for.

### Step 2 — Read and catalog the ground truth (main thread only)

In parallel, read the following on the **main thread**. Build a structured catalog to pass inline to category agents in Step 3 — agents must NOT re-read raw materials files:

- **Exam-coverage doc discovery**: glob `COMP{id}/materials/**` for syllabus exam sections, study guides, instructor review sheets, testable-topic lists. If found, read the relevant file. **Output: the verbatim exam-coverage text plus its source path** — this becomes the basis for `_scratch/exam-scope.md` in Category H.
- `COMP{id}/materials/past-exams/` — catalog every question with a diagram (page table, RAG, matrix, state machine). Each diagram question maps to a required `practice/` file with `kind: applied` per STANDARDS §Per-course required artifacts. **Output: a list of `{exam-file, question-number, diagram-type, expected-practice-file, exists-already}`**.
- `COMP{id}/materials/past-exams/` solution keys — extract actual wrong-answer patterns. These drive `**Pitfall**` proposals. Invented pitfalls forbidden per STANDARDS. **Output: a list of `{topic, common-wrong-approach, source-location}`**.
- `COMP{id}/materials/labs/` and `COMP{id}/materials/assignments/` — catalog every question. Each must map to ≥1 `practice/` file. **Output: `{file, question-number, topic, kind (code|applied), exists-already}`**.
- `COMP{id}/generated/exam-study/research-*.md` — for each research topic, catalog which cards / lessons in `content/{id}/` cite it. Uncited research is an enrichment gold-mine. **Output: mapping of `{research-topic → [content-files-that-cite-it]}` plus uncited-research list**.
- `COMP{id}/graphify-out/GRAPH_REPORT.md` — pull the god-node list. God nodes with sparse card enrichment are the highest-leverage targets. **Output: ranked god-node list with card-count per node**.
- `content/{id}/course.yaml` — exam date, format, room. Check whether `cheatsheet_allowed` field is present and consistent with the syllabus.
- **Legacy-schema scan**: glob `content/{id}/topic-dives/` and `content/{id}/code-practice/`. Record every file present — Category H enumerates their disposition (delete / rename / content-lift).

Store these catalogs in working memory. Step 3 agents receive relevant catalog slices inline — they do NOT read `COMP{id}/materials/` or `COMP{id}/graphify-out/` directly.

### Step 3 — Categorize findings by patch type (parallel)

Eight categories (A–H) below are independent. **Fan out 8 sub-agents in a single tool-call message**, one per category. Main thread merges their patch lists into the enrichment plan.

**Before spawning agents**: the main thread has already read `content/STANDARDS.md` and `content/SCHEMA.md`, and built the catalog in Step 2. Do NOT tell sub-agents to re-read `content/STANDARDS.md`, `content/{id}/` broadly, or `COMP{id}/materials/`. Embed relevant content inline per category.

Per-category sub-agent brief (fill all `{PLACEHOLDERS}` before dispatching):

> Propose patches for category `{CATEGORY}` of course `{id}`.
>
> ## Category definition
> {COPY THE EXACT "**X. Category name**" BLOCK FROM STEP 3a OF THIS SKILL.md}
>
> ## Relevant STANDARDS principles
> {PASTE ONLY THE PARAGRAPHS FROM STANDARDS.md THAT THIS CATEGORY CITES — not the full file}
>
> ## Audit findings scoped to this category
> {PASTE THE RELEVANT SUBSET OF content/{id}/audit-report.md — only findings in this category's scope}
>
> ## Pre-built catalog from materials (do not re-read raw materials)
> {PASTE THE RELEVANT CATALOG SLICE FROM STEP 2 — exam-coverage text for H, diagram inventory for B, pitfall list for A/C, god-node list for C, uncited-research list for C, labs/assignments inventory for B, legacy-schema scan for H}
>
> ## Files to read — read ONLY these, nothing else
> {FILE_LIST — see per-category table below}
>
> Per patch: title, severity, STANDARDS principle cited, file(s), current state, proposed change, source citation, rationale. Include proposed drafts when source is unambiguous. Do NOT touch files. Return ≤800 words + patch list.

Per-category file list (main thread resolves and passes actual paths):

| Category | Files to read |
|---|---|
| A (hard-gate) | Only the specific files named in audit-report.md critical findings — no broad tree read |
| B (required artifacts) | `content/{id}/practice/*.md` listing (or legacy `code-practice/` if not migrated), `content/{id}/lessons/00-exam-strategy.md` (if exists), `content/{id}/mock-exam.yaml` |
| C (enrichment fields) | `COMP{id}/generated/exam-study/research-*.md` + the specific card/lesson files named in audit-report.md warnings |
| D (dual coding) | `content/{id}/lessons/*.md` + `content/{id}/practice/*.md` frontmatter |
| E (Bloom's + variability) | `content/{id}/flashcards.yaml`, `content/{id}/mock-exam.yaml` |
| F (interconnection) | `content/{id}/lessons/*.md` frontmatter (main thread can extract with Grep and pass inline) |
| G (peer polish) | Main thread runs all greps from Pass 10 rules and passes match results inline; agent receives match list only |
| H (legacy-schema migration) | `content/{id}/topic-dives/*.md` listing (filenames + first 30 lines of each for content-lift decisions), `content/{id}/code-practice/*.md` listing, `content/{id}/course.yaml`, `content/{id}/cheat-sheet.md` (if exists) |

Agents run in parallel. Main thread assembles their outputs into one plan file, ranked by impact-per-author-minute across all categories.

**Mitigation for overlap**: a single defect may span categories (e.g. a card missing `source:` is both A hard-gate AND C enrichment-fields). Main thread dedups by `(file, line)` and picks the highest-severity category as primary, noting the other categories as cross-refs.

### Step 3a — Category definitions

Group findings into these categories. Rank within each by impact-per-author-minute.

**A. Hard-gate critical** — blocks `/add-course`. Fix first.

- Missing `source:` on cards, lessons, practice files, mock-questions.
- Non-strategy lessons lacking retrieval checkpoints.
- Problem-solving lessons lacking worked examples.
- Non-trivial lessons lacking `**Pitfall**` callouts.
- Mock rationales without distractor analysis (require ≥3 sentences).
- Practice files with `source:` not resolving to lab/assignment/past-exam.
- Uncovered labs/assignments/past-exam coding/applied questions (missing practice file).
- Private-data leaks.
- Duplicate ids.
- Schema invariant violations remaining after Step 1 check.

**B. Per-course required artifacts** — STANDARDS §Per-course required artifacts. Often critical.

- `_scratch/exam-scope.md` missing (cross-ref Category H, authoring prereq).
- `lessons/00-exam-strategy.md` missing or not `kind: strategy` (cross-ref H for lift-from-dive migration).
- Formulas quick-reference cheat-block missing (if `cheatsheet_allowed: true`).
- Diagram-based `kind: applied` practice missing for every past-exam diagram question.
- Lab + assignment practice coverage (B overlaps with A for criticality).
- Pretest mock-exam subset missing or out of 8–12 range.
- Mock bank size under 60 or over 80.

**C. Enrichment fields** — STANDARDS §Elaborative encoding + §Worked examples.

- Cards missing `explanation` (why-it-matters mechanism).
- Cards missing `example` (concrete worked case).
- Cards missing `bloom:` tag.
- Lessons missing closing `**Takeaway**` callout.
- Practice `## Why` / `## Common wrong approaches` sections one-line or stub.

**D. Dual coding** — STANDARDS §Mayer CTML.

- Visual-concept lessons lacking Mermaid/SVG.
- Applied-practice items with visual structure (page tables, RAGs, matrices) lacking inline SVG in `## Problem`.
- Diagram labels separated from nodes (spatial contiguity).

**E. Concept variability + Bloom's distribution** — STANDARDS §Concept variability + §Bloom's taxonomy.

- Mock-exam bank missing ≥3 surface forms for high-weight topics (≥15% exam weight).
- Practice tree missing ≥2 variants per procedural concept.
- Topics with all-Remember cards (need ≥1 Apply-level).
- Course-level Bloom's outside ±10pts of 20/25/35/20.

**F. Interconnection** — STANDARDS §Cognitive Load Theory (germane load).

- Lessons missing `related:` frontmatter cross-links.
- Cross-topic synthesis questions absent from mock-exam (use graphify god-node pairs).

**G. Peer-shareability polish**

- First-person framing.
- Uncited lecture references.
- Hedge words in teaching claims.

**H. Legacy-schema migration** — this course pre-dates current SCHEMA + STANDARDS.

Patches in this category are structural, not content-enrichment. They migrate the tree to the current layout. Sequence matters: H patches run *before* the others when applied, because A–G reference the new paths.

- **H1. Drop `topic-dives/` directory entirely.** For each dive, decide:
  - *Content-lift*: if the dive has a `**Example**` callout OR `**Pitfall**` callout absent from the matching lesson, lift those into the lesson (propose the exact insertion). Preserves authoring effort.
  - *Exam-strategy migration*: if a dive with id `exam-strategy-and-pitfalls` exists, its content becomes `lessons/00-exam-strategy.md` with `kind: strategy` frontmatter, `n: 0`, `id: exam-strategy`. Content-lift + rename.
  - *Delete*: everything else. Dive content duplicates lesson content; dropping it reduces learner decision fatigue.
- **H2. Rename `code-practice/` → `practice/`.** For each file:
  - Add frontmatter `kind: code` (default).
  - If the file is `variant: annotation`, keep it; otherwise `variant: starter-solution` is the implicit default.
  - Verify `source:` resolves to a lab/assignment/past-exam. If currently slide-only, propose the correct source from the lab/assignment inventory (Step 2) or mark "unfixable — no source anchor; consider deletion."
- **H3. Add `course.yaml.cheatsheet_allowed: <bool>`**. Derive from syllabus / notes. If unclear, propose `false` as safer default and flag for user verification.
- **H4. Create `content/{id}/_scratch/exam-scope.md`** from the exam-coverage doc found in Step 2. If no such doc exists in `materials/`, flag as an unresolvable prereq — instructor input required.
- **H5. Cheat-sheet conditional enforcement**: if the proposed `cheatsheet_allowed: false`, propose deleting `cheat-sheet.md`. If `true` but cheat-sheet missing, propose creating a skeleton (handled as a B patch).
- **H6. Out-of-scope content removal**: any lesson / practice / flashcard topic whose subject doesn't map to the new `_scratch/exam-scope.md` is a deletion candidate. Propose deletion list separately from the rest of the plan so the user can review carefully — this is the highest-regret class of patch.
- **H7. Drop `priority:` field** from flashcards topics (removed from schema; compiler ignores it but audit flags as schema drift).

### Step 4 — Write the enrichment plan

Write `content/{id}/enrichment-plan.md`. Structure:

```markdown
# Enrichment plan — {id}

Date: <ISO date>
Target: content/{id}/ → current content/STANDARDS.md + SCHEMA.md
Based on: audit-report.md (date), materials/ (list files consulted), research-*.md (list), GRAPH_REPORT.md

## Summary

| Category | Count | Severity |
|---|---|---|
| H. Legacy-schema migration | N | Critical (structural) |
| A. Hard-gate critical | N | Critical |
| B. Required artifacts | N | Mostly critical |
| C. Enrichment fields | N cards / N lessons | Warning/advisory |
| D. Dual coding | N lessons / N practice | Warning |
| E. Bloom's + variability | N | Warning |
| F. Interconnection | N | Advisory |
| G. Peer polish | N | Warning |

**Estimated author-hours to ship**: [range]. Legacy migration (H) × hours + god-node enrichment × hours + required artifacts × hours + rest.

## Apply in this order

### Phase 1 — Structural migration (Category H)

H must be applied first — A–G reference the new paths. After Phase 1, re-run `/audit-content {id}` before starting Phase 2; expect the Pass 1 schema critical count to drop to zero.

1. [H1 patch — topic-dive disposition: content-lift X + delete Y]
   ...

### Phase 2 — Hard-gate criticals (Category A + B)

2. [Patch title]
- Category: [A–G]
- STANDARDS principle: [cited]
- File(s): [path:line or new file path]
- Current state: [what's there now, quoted if short]
- Proposed change: [exact change — field addition, callout insertion, new file skeleton]
- Source for the new content: [materials/... path + page/slide OR research-*.md §X]
- Rationale: [one sentence — why this fix ranks here in priority]

### Phase 3 — Quality enrichment (Category C–G)

3. ...

## Out-of-scope content deletion candidates (Category H6 — review carefully)

List every lesson / practice / flashcard topic whose subject doesn't map to the new `_scratch/exam-scope.md`. Include subject line + proposed action (delete / merge-into-in-scope / keep-with-exception). User must explicitly approve each before applying.
```

Sort patches top-down by: (1) H first (structural), (2) A hard-gate, (3) B required artifacts, (4) C–G by god-node leverage + fix-impact.

For enrichment-field patches (Category C), when the source material contains enough text to draft an `explanation` or `example` directly, include a **proposed draft** inline. The user edits, not originates. Only propose drafts where source is unambiguous.

For required-artifacts patches (Category B), include a **file skeleton** with frontmatter filled from `course.yaml` + section headings + short source-citation stubs. User fills prose.

For H1 (topic-dive disposition), for each dive list: action (delete | content-lift to `lessons/{NN}-{slug}.md`), and if content-lift, quote the exact callout(s) to move.

### Step 5 — Summary to chat

Print a short summary:
- Total patches by category.
- Count of out-of-scope deletion candidates flagged.
- Estimated author-hours.
- Path to the plan file.
- A call to action: "Review `content/{id}/enrichment-plan.md`. Apply Phase 1 (H) first, then re-run `/audit-content {id}`. Continue through A → G. Approve H6 deletion candidates explicitly before applying."

## Non-negotiable rules

- Do not edit `content/{id}/` files. Only write `content/{id}/enrichment-plan.md`.
- Every proposed patch cites the source in `COMP{id}/materials/` or a research file. If a patch has no source, mark it "unfixable — no source found" and move on. Do not fabricate citations.
- Every proposed change cites a STANDARDS.md principle.
- No motivational filler. No "great start". No emoji.
- Don't propose patches that contradict STANDARDS (e.g. don't propose summarization-based lessons, don't propose new topic-dives).
- If `materials/` is unavailable for this course, say so explicitly and produce a plan from the tree + research notes + audit only, marking items "needs source verification".
- If no exam-coverage doc exists in `materials/`, flag H4 as "unresolvable — ask instructor" and mark every H6 deletion candidate "do not apply until exam scope is resolved."
- Keep the plan focused — cap at ~60 top-priority patches (bumped from 50 to accommodate H). If more gaps than that, write the top 60 and append a "backlog" section listing the rest by file.

## Handoff to apply

The plan is read-only for this skill. To apply patches, the user either (a) edits directly with the plan open, (b) runs a fresh session and hands it the plan file, or (c) invokes a future `/apply-enrichment-plan` skill (not yet built — out of scope). After applying, they should re-run `/audit-content {id}` to verify gaps closed and no regressions introduced.
