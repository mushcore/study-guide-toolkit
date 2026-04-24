---
name: author-stage2
description: Stage 2 (Course-level artifacts) of course authoring. Produces course.yaml, the exam-strategy lesson, and the cheat-sheet skeleton if the exam permits one. Invoke after stage1b completes — same session or fresh session both work.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Stage 2 — Course-level artifacts

Produces three files (one conditional) that all downstream stages depend on.

## Setup

1. Parse `$ARGUMENTS` → `{id}`. Get materials path from progress file.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage2`. Capture `cheatsheet_allowed` value under `## Open items` (set by Stage 1 from syllabus).
3. For each of the files below, read it only if it is NOT already in context from an earlier stage in this session. If this is a fresh session, read all of them in order:
   - `content/{id}/_scratch/exam-scope.md` — the coverage list. Every artifact you produce filters on this.
   - `content/{id}/_scratch/topic-map.md` — modules + in-scope topics + cheatsheet permission.
   - `content/{id}/_scratch/voice-guide.md` — apply to everything you write.
   - `content/{id}/_scratch/glossary.md` — canonical terms only throughout.
   - `content/STANDARDS.md` `§Per-course required artifacts` + `§Hard gates` + `§Exam-scope discipline`.
   - `content/SCHEMA.md` `§course.yaml`, `§lessons/NN-<slug>.md`, `§Exam-strategy lesson`, `§cheat-sheet.md`.
   - `ADD-NEW-COURSE.md §Stage 2`.
4. Read past-exam solution keys under `{materials_path}/past-exams/` — required source for pitfalls. (Stage 1 only catalogued questions; solution keys are read fresh here.)

## Write (in this order — dependencies flow downward)

### 1. `content/{id}/course.yaml`

Fields from exam-meta in topic-map. Follow SCHEMA `§course.yaml` exactly. ISO 8601 date with TZ offset.

**Required: `cheatsheet_allowed` bool.** Pull from Step A below:

**Step A — determine `cheatsheet_allowed`:**
1. Re-read syllabus + notes specifically for explicit language: `"cheat sheet"`, `"reference page"`, `"one-page notes"`, `"formula sheet"`, `"open notes"`, `"closed book"`, `"open book"`.
2. Default `cheatsheet_allowed: false` unless the syllabus or instructor communication *explicitly* permits a learner-prepared reference page.
3. If the exam is explicitly open-book, set `true` (the textbook + notes substitute for a cheat-sheet).
4. If unclear after re-reading, set `false` and flag under `## Open items` in progress.md for user confirmation. Better to skip authoring than to waste effort on a sheet the learner can't bring.

### 2. `content/{id}/lessons/00-exam-strategy.md`

Special lesson. Frontmatter:

```yaml
---
n: 0
id: exam-strategy
title: "Exam strategy and pitfalls"
hook: "Time allocation, top pitfalls, when to skip."
kind: strategy
tags: [strategy, exam-prep]
module: "Exam prep"
source: "materials/past-exams/* + materials/syllabus/*"
bloom_levels: [analyze, evaluate]
related: [<top-3 priority topic ids from topic-map>]
---
```

Body must contain — all sourced from materials:
- Time allocation per question type (derive from exam format + past-exam patterns).
- Part-1 vs Part-2 strategy if the exam has two parts.
- Top-5 pitfalls from past-exam solution keys — cite the specific file + question number for each.
- "When to skip and return" heuristic.
- Off-by-one / unit / ordering traps specific to this domain.
- ≥1 `**Pitfall**` callout and ≥1 `**Takeaway**` callout.

**Waivers for `kind: strategy` (per STANDARDS):**
- No retrieval checkpoint required (`> **Q:**/**A:**`).
- May open with structure / bullet lists rather than a concrete instance.

**Invented pitfalls are forbidden.** No source → write `<!-- source not found: {claim} -->` and flag it to the user. Do not fabricate.

### 3. `content/{id}/cheat-sheet.md` (conditional)

**Author only if `course.yaml.cheatsheet_allowed: true`.** Otherwise skip this step entirely and ensure no cheat-sheet file exists.

When authored:
- If the course has formulas (detect via `=`, `^`, `log`, unit identifiers in materials): add `## Formulas — quick reference` block now, filled from materials.
- Stub `##` blocks (heading only, no body content) for each in-scope major topic from the topic-map. Stage 3 fills the bodies.
- No H3s inside any block.

## Audit gate

Run `/audit-content {id}`. Check Pass 1 (schema) and Pass 9 (required-artifacts: strategy lesson exists with `kind: strategy`, cheat-sheet presence matches `cheatsheet_allowed`). Report results. If any criticals: fix before proceeding.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage2: {ISO datetime} — {one-sentence summary}`.
- Set `## Current stage` to `stage3`.
- Under `## Course parameters` (create if missing), record `cheatsheet_allowed: {bool}` so Stage 3/5 use the same value without re-deriving.
- Add any flagged missing sources to `## Open items`.

## Tell the user

Print: course.yaml produced with `cheatsheet_allowed: {bool}`, exam-strategy lesson created (pitfall count — sourced vs flagged-missing), cheat-sheet skeleton authored/skipped, formula block present/absent, audit result.

Then: "Stage 2 complete. Proceed by invoking `/author-stage3 {id}` for the first module — same session carries context forward; a fresh session also works."
