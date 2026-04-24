---
name: author-stage5
description: Stage 5 (Final audit + register) of course authoring. Closes all remaining issues, fills cheat-sheet stubs if authored, compiles the bundle, and wires the app. Invoke after stage4 completes — same session or fresh session both work.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Stage 5 — Final audit + register

Closes everything, compiles, and wires the course into the app.

## Setup

1. Parse `$ARGUMENTS` → `{id}`.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage5`. Capture `cheatsheet_allowed` under `## Course parameters`.
3. Read `content/{id}/course.yaml` — verify `cheatsheet_allowed` matches the progress-file value. If they disagree: ask user which is correct, fix both, continue.
4. If not already in context from an earlier stage in this session, read `content/STANDARDS.md §Hard gates` and `ADD-NEW-COURSE.md §Stage 5`. Otherwise reuse what is already loaded.

## Execute in order

### 1. Full audit

Run `/audit-content {id}`. Read `content/{id}/audit-report.md`.

List every critical finding. **Do not proceed past this step with open criticals.** Fix each one in the relevant content file, then re-run the audit to confirm closure.

List every warning — these are ship-blocking. Fix all warnings before proceeding to step 2.

### 2. Cheat-sheet handling

**If `course.yaml.cheatsheet_allowed: true`:**
- Read `content/{id}/cheat-sheet.md`. Find every `##` block with empty or stub-only body.
- For each empty block: read the corresponding topic's lesson (`lessons/NN-{slug}.md`). Fill the block with terse bullets / short tables / inline code. No H3s inside any block.
- If the course has formulas and no `## Formulas — quick reference` block exists, add one sourced from materials.

**If `course.yaml.cheatsheet_allowed: false`:**
- Confirm `content/{id}/cheat-sheet.md` does NOT exist. If it does, delete it (the real exam doesn't permit one; authoring it wastes effort and misleads the learner).
- Skip to step 3.

### 3. Register course

Run `/add-course {id}`.

This re-runs the audit preflight, compiles `content/_dist/{id}.js`, wires the two hardcoded touchpoints, and verifies `npm run build`. Report exactly what it changed and whether the build succeeded.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage5: {ISO datetime} — {one-sentence summary}`.
- Set `## Current stage` to `done`.

## Tell the user

Print: audit result before and after fixes (critical/warning/advisory counts), cheat-sheet outcome (filled N blocks / skipped because not allowed / deleted stray file), `/add-course` outcome, bundle item counts per section (lessons, flashcards, practice, mock questions, cheatSheet: null|N blocks).

Then:
> Phase A complete. Manual steps remaining:
> 1. `cd app && npm run dev`.
> 2. Verify dashboard shows the course card with correct exam countdown.
> 3. Check every subview: `lessons`, `mock`, `practice`, and — if `cheatsheet_allowed: true` — `cheat`.
> 4. Confirm a topic card rates and persists (check localStorage).
> 5. No console errors.
> 6. `./deploy.sh`.
