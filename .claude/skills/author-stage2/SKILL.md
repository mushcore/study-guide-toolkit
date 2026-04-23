---
name: author-stage2
description: Stage 2 (Course-level artifacts) of course authoring. Produces course.yaml, exam-strategy-and-pitfalls.md, and the cheat-sheet skeleton. Invoke in a fresh Claude Code session after stage1b completes.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Stage 2 — Course-level artifacts

Produces three files that all downstream stages depend on. This is the only task for this session.

## Setup

1. Parse `$ARGUMENTS` → `{id}`. Get materials path from progress file.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage2`.
3. Read in this order (read each once; do not re-read):
   - `content/{id}/_scratch/topic-map.md`
   - `content/{id}/_scratch/voice-guide.md` — apply to everything you write.
   - `content/{id}/_scratch/glossary.md` — canonical terms only throughout.
   - `content/STANDARDS.md` §Per-course required artifacts + §Hard gates.
   - `content/SCHEMA.md` §course.yaml, §topic-dives, §cheat-sheet.
   - `ADD-NEW-COURSE.md` §Stage 2.
4. Read past-exam solution keys under `{materials_path}/past-exams/` — required source for pitfalls.

## Write (in this order — dependencies flow downward)

### 1. `content/{id}/course.yaml`

Fields from exam-meta in topic-map. Follow SCHEMA §course.yaml exactly. ISO 8601 date with TZ offset.

### 2. `content/{id}/topic-dives/exam-strategy-and-pitfalls.md`

`priority: high`. Frontmatter also needs: `source`, `bloom_levels`, `related` (link to top-3 priority topics from topic-map).

Body must contain — all sourced from materials:
- Time allocation per question type (derive from exam format + past-exam patterns).
- Part-1 vs Part-2 strategy if the exam has two parts.
- Top-5 pitfalls from past-exam solution keys — cite the specific file + question number for each.
- "When to skip and return" heuristic.
- Off-by-one / unit / ordering traps specific to this domain.
- ≥1 `**Pitfall**` callout and ≥1 `**Takeaway**` callout.

**Invented pitfalls are forbidden.** No source → write `<!-- source not found: {claim} -->` and flag it to the user. Do not fabricate.

### 3. `content/{id}/cheat-sheet.md`

- If the course has formulas (detect via `=`, `^`, `log`, unit identifiers in materials): add `## Formulas — quick reference` block now, filled from materials.
- Stub `##` blocks (heading only, no body content) for each major topic from the topic-map. Stage 3 fills the bodies.
- No H3s inside any block.

## Audit gate

Run `/audit-content {id}`. Check Pass 1 (schema) and Pass 9 (required-artifacts — strategy dive). Report results. If any criticals: fix before proceeding.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage2: {ISO datetime} — {one-sentence summary}`
- Set `## Current stage` to `stage3`.
- Add any flagged missing sources to `## Open items`.

## Tell the user

Print: three files written, pitfall count (sourced vs flagged-missing), formula block present/absent, audit result.

Then: "Stage 2 complete. Open a new session and run `/author-stage3 {id}`."
