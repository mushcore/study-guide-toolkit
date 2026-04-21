---
name: enrich-course
description: Upgrade an existing course's content/{id}/ tree to current content/STANDARDS.md. Runs /audit-content to find gaps, then reads materials + research notes + graphify report to produce a prioritized enrichment plan at content/{id}/enrichment-plan.md. Does NOT apply patches — user reviews and applies. Use when the user says "enrich course {id}", "upgrade {id} content", "improve course {id}", "bring {id} up to standards", or invokes /enrich-course.
argument-hint: <course-id>
allowed-tools: Read, Write, Bash, Grep, Glob
disable-model-invocation: false
---

You are producing a **patch plan**, not patches. Your output is a single file: `content/{id}/enrichment-plan.md`. The user reviews it, pushes back on anything weak, and applies the patches themselves (or delegates to another session). You do not edit the content tree.

The goal is to bring an existing course's content to the current pedagogical standard in `content/STANDARDS.md`. Most existing courses were authored before STANDARDS existed and will have systematic gaps — missing `explanation` / `example` / `source` / `bloom` fields on cards, missing `**Pitfall**` callouts, flat Bloom's distributions, missing per-course required artifacts (exam-strategy dive, formulas cheat-block, pretest subset, diagram-based code-practice for every past-exam diagram question).

Your job: find those gaps, trace each to concrete source material in `COMP{id}/materials/` or `COMP{id}/generated/exam-study/research-*.md`, and produce a patch plan the user can work through top-down.

## Inputs

- `$ARGUMENTS` — course id. Required. If empty, ask and stop.
- `content/STANDARDS.md` — **read first**, end-to-end. This is the target state.
- `content/SCHEMA.md` — file shapes.
- `content/{id}/` — current tree. What exists now.
- `COMP{id}/materials/` — ground truth. Every proposed addition traces here. Slides, past exams, syllabus, labs.
- `COMP{id}/generated/exam-study/research-*.md` — dense source-grounded topic summaries from the old workflow. These are often the richest starting material for writing new `explanation` / `example` content; a card that needs enrichment often has 2–3 relevant paragraphs already sitting in one of these files.
- `COMP{id}/graphify-out/GRAPH_REPORT.md` — god nodes + community structure. Used for prioritizing (god nodes are highest-leverage for enrichment) and for identifying cross-topic connections to add to `related:` frontmatter.
- Latest `content/{id}/audit-report.md` (if present) — starting point for gaps; re-run `/audit-content {id}` to refresh before proceeding.

If `content/{id}/` doesn't exist, stop — this skill upgrades existing courses, not new ones. Point to `/add-course` instead.

## Execution

### Step 1 — Refresh the audit

Run `/audit-content {id}` (invoke the skill; don't re-implement its logic here). Read `content/{id}/audit-report.md` after it finishes. Capture every critical, warning, and advisory finding — the patch plan addresses all severity levels, not just criticals.

If the audit surfaces build-blocking schema defects (Pass 1 criticals), surface them to the user and stop. Schema defects are a prerequisite fix, not an enrichment task.

### Step 2 — Read the ground truth

In parallel, read:

- `COMP{id}/materials/past-exams/` — catalog every question with a diagram (page table, RAG, matrix, state machine). Each diagram question maps to a required code-practice file per STANDARDS §Per-course required artifacts. If the content tree doesn't already have a matching file, that's a critical gap.
- `COMP{id}/materials/past-exams/` solution keys — extract the actual wrong-answer patterns. These drive the `**Pitfall**` callouts you'll propose adding. Invented pitfalls are forbidden per STANDARDS §Elaborated feedback; real ones come from solution-key analysis.
- `COMP{id}/generated/exam-study/research-*.md` — for each research topic, catalog which cards / lessons / dives in `content/{id}/` cite it. Research content that doesn't appear in any authored unit is either (a) genuinely redundant, or (b) an enrichment gold-mine.
- `COMP{id}/graphify-out/GRAPH_REPORT.md` — pull the god-node list. God nodes with sparse card enrichment are the highest-leverage enrichment targets.
- `content/{id}/course.yaml` — exam date, format, room. Used to calibrate the exam-strategy dive content.

### Step 3 — Categorize findings by patch type (parallel)

Seven categories (A–G) below are independent. **Fan out 7 sub-agents in a single tool-call message**, one per category. Main thread merges their patch lists into the enrichment plan.

Per-category sub-agent brief (fill `{CATEGORY}` + category description):

> Analyze gaps in category `{CATEGORY}` for course `{id}` and propose patches. Read first: `content/STANDARDS.md`, `content/{id}/audit-report.md`, `content/{id}/` tree, `COMP{id}/materials/` + `research-*.md` + `GRAPH_REPORT.md`. Produce a markdown list of patches scoped to your category only. Per patch: title, severity, STANDARDS principle cited, file(s), current state, proposed change, source citation from materials, rationale. When source is unambiguous, include a proposed draft inline. Do NOT touch any files. Return under 800 words + the patch list.

Agents run in parallel. Main thread assembles their outputs into one plan file, ranked by impact-per-author-minute across all categories.

**Mitigation for overlap**: a single defect may span categories (e.g. a card missing `source:` is both A hard-gate AND C enrichment-fields). Main thread dedups by `(file, line)` and picks the highest-severity category as the primary bucket, noting the other categories as cross-refs.

### Step 3a — Category definitions

Group findings into these categories. Rank within each by impact-per-author-minute (god-node cards > peripheral cards; required artifacts > advisory polish).

**A. Hard-gate critical** — blocks `/add-course`. Fix first.

- Missing `source:` on cards, lessons, dives, code-practice, mock-questions.
- Lessons lacking retrieval checkpoints.
- Problem-solving dives lacking worked examples.
- Non-trivial dives lacking `**Pitfall**` callouts.
- Mock rationales without distractor analysis.
- Missing `topic-dives/exam-strategy-and-pitfalls.md`.
- Private-data leaks.
- Duplicate ids.
- Schema invariant violations (if any remain after Step 1 check).

**B. Per-course required artifacts** — STANDARDS §Per-course required artifacts. Often critical; always high-impact.

- Exam-strategy-and-pitfalls dive.
- Formulas quick-reference cheat-block (if course has formulas).
- Diagram-based code-practice for every past-exam diagram question.
- Pretest mock-exam subset.

**C. Enrichment fields** — STANDARDS §Elaborative encoding + §Worked examples. Mostly warning/advisory per card, but add up to large quality improvements.

- Cards missing `explanation` (why-it-matters mechanism).
- Cards missing `example` (concrete worked case).
- Cards missing `bloom:` tag.
- Lessons missing closing `**Takeaway**` callout.
- Dives missing closing `**Takeaway**` callout.

**D. Dual coding** — STANDARDS §Mayer CTML. Visual concepts need diagrams.

- Visual-concept dives lacking Mermaid/SVG.
- Diagram labels separated from nodes (spatial contiguity).

**E. Concept variability + Bloom's distribution** — STANDARDS §Concept variability + §Bloom's taxonomy.

- Mock-exam bank missing variant surface forms per deep concept.
- Topics with all-Remember cards (need ≥1 Apply-level).
- Course-level Bloom's outside ±10pts of 30/30/25/15.

**F. Interconnection** — STANDARDS §Cognitive Load Theory (germane load).

- Lessons / dives missing `related:` frontmatter cross-links.
- Cross-topic synthesis questions absent from mock-exam (use graphify god-node pairs).

**G. Peer-shareability polish**

- First-person framing.
- Uncited lecture references.
- Hedge words in teaching claims.

### Step 4 — Write the enrichment plan

Write `content/{id}/enrichment-plan.md`. Structure:

```markdown
# Enrichment plan — {id}

Date: <ISO date>
Target: content/{id}/ → current content/STANDARDS.md
Based on: audit-report.md (date), materials/ (list files consulted), research-*.md (list), GRAPH_REPORT.md

## Summary

| Category | Count | Severity |
|---|---|---|
| A. Hard-gate critical | N | Critical |
| B. Required artifacts | N | Mostly critical |
| C. Enrichment fields | N cards across N topics | Warning/advisory |
| D. Dual coding | N dives | Warning |
| E. Bloom's + variability | N | Warning |
| F. Interconnection | N | Advisory |
| G. Peer polish | N | Warning |

**Estimated author-hours to ship**: [range]. God-node cards (high-leverage; enrich first) × hours per card + required artifacts × hours per artifact + rest.

## Apply in this order

Each item below is a concrete patch. The user can work through top-down.

### 1. [Patch title]
- Category: [A–G]
- STANDARDS principle: [cited]
- File(s): [path:line or new file path]
- Current state: [what's there now, quoted if short]
- Proposed change: [exact change — field addition, callout insertion, new file skeleton]
- Source for the new content: [materials/... path + page/slide OR research-*.md §X]
- Rationale: [one sentence — why this fix ranks here in priority]

### 2. [Patch title]
...
```

Sort patches top-down by: (1) severity, (2) god-node leverage from graphify (high-connection concepts first), (3) fix-impact per author-minute (fixes that unblock `/add-course` before polish fixes).

For enrichment-field patches (Category C), when the source material contains enough text to draft an `explanation` or `example` directly, include a **proposed draft** inline. The user edits, not originates. Only propose drafts for fields where source material is unambiguous — don't speculate.

For required-artifacts patches (Category B), include a **file skeleton** with frontmatter filled in from `course.yaml` + section headings + short source-citation stubs for each section. The user fills in the prose.

### Step 5 — Summary to chat

Print a short summary:
- Total patches by category.
- Estimated author-hours.
- Path to the plan file.
- A call to action: "Review `content/{id}/enrichment-plan.md`. Apply patches top-down. Re-run `/audit-content {id}` after each category to track progress."

## Non-negotiable rules

- Do not edit `content/{id}/` files. Only write `content/{id}/enrichment-plan.md`.
- Every proposed patch cites the source in `COMP{id}/materials/` or a research file. If a patch has no source, mark it "unfixable — no source found" and move on. Do not fabricate citations.
- Every proposed change cites a STANDARDS.md principle.
- No motivational filler. No "great start". No emoji.
- Don't propose patches that contradict STANDARDS (e.g. don't propose summarization-based lessons). If the current tree has such patterns, flag them for removal or restructure, not enrichment.
- If materials/ is unavailable for this course, say so explicitly and produce a plan from the tree + research notes + audit only, marking items "needs source verification".
- Keep the plan focused — cap at ~50 top-priority patches. If there are more gaps than that, write the top 50 and append a "backlog" section listing the rest by file.

## Handoff to apply

The plan is read-only for this skill. To apply patches, the user either (a) edits directly with the plan open, (b) runs a fresh session and hands it the plan file, or (c) invokes a future `/apply-enrichment-plan` skill (not yet built — out of scope). After applying, they should re-run `/audit-content {id}` to verify gaps closed and no regressions introduced.
