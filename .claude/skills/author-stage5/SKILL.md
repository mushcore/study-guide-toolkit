---
name: author-stage5
description: Stage 5 (Final audit + register) of course authoring. Closes all remaining issues, fills cheat-sheet stubs, compiles the bundle, and wires the app. Invoke in a fresh Claude Code session after stage4 completes.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Stage 5 — Final audit + register

Closes everything, compiles, and wires the course into the app. This is the only task for this session.

## Setup

1. Parse `$ARGUMENTS` → `{id}`.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage5`.
3. Read `content/STANDARDS.md` §Hard gates — know what criticals look like.
4. Read `ADD-NEW-COURSE.md` §Stage 5 — the register steps.

## Execute in order

### 1. Full audit

Run `/audit-content {id}`. Read `content/{id}/audit-report.md`.

List every critical finding. **Do not proceed past this step with open criticals.** Fix each one in the relevant content file, then re-run the audit to confirm closure.

List every warning — these are ship-blocking. Fix all warnings before proceeding to step 2.

### 2. Fill cheat-sheet stubs

Read `content/{id}/cheat-sheet.md`. Find every `##` block with empty or stub-only body.

For each empty block: read the corresponding topic's lesson (`lessons/NN-{slug}.md`) and dive (`topic-dives/{slug}.md`). Fill the block with terse bullets / short tables / inline code. No H3s inside any block.

### 3. Register course

Run `/add-course {id}`.

This re-runs the audit preflight, compiles `content/_dist/{id}.js`, wires the two hardcoded touchpoints, and verifies `npm run build`. Report exactly what it changed and whether the build succeeded.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage5: {ISO datetime} — {one-sentence summary}`
- Set `## Current stage` to `done`.

## Tell the user

Print: audit result before and after fixes (critical/warning/advisory counts), cheat-sheet blocks filled, `/add-course` outcome, bundle item counts per section (lessons, dives, flashcards, code-practice, mock questions).

Then:
> Phase A complete. Manual steps remaining:
> 1. `cd app && npm run dev`
> 2. Verify dashboard shows the course card with correct exam countdown.
> 3. Check every subview: priorities, lessons, dives, mock, code, cheat.
> 4. Confirm a topic card rates and persists (check localStorage).
> 5. No console errors.
> 6. `./deploy.sh`
