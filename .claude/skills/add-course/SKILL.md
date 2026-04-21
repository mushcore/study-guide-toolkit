---
name: add-course
description: Register a new course in the app. Compiles the content/{id}/ tree to a bundle, wires the three hardcoded touchpoints (build-content.js, _aggregator.js, main.jsx), handles the annotation-variant dispatch in App.jsx if needed, and verifies the React build succeeds. Use when the user says "add course {id}", "register course {id}", "wire up course {id}", or invokes /add-course.
argument-hint: <course-id>
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
disable-model-invocation: false
---

You are registering a new course into the `app/` React+Vite app. The canonical content tree already exists at `content/{id}/` — your job is Phase B from `ADD-NEW-COURSE.md`: compile, wire, verify. Do not author content; if the tree is missing or incomplete, stop and tell the user to run authoring first.

## Repo layout (working tree)

- Root: `/Users/kevinliang/BCIT/CST/TERM4/` — monorepo root. `content/`, `scripts/`, `app/` all live here.
- Canonical content: `content/{id}/` with seven files (see `content/SCHEMA.md`).
- Compiler: `scripts/build-content.js`. Reads `COURSES` array and compiles each to `content/_dist/{id}.js`.
- Aggregator: `content/_dist/_aggregator.js`. Has its own `ids` array for flattening into window globals.
- App entry: `app/src/main.jsx`. Side-effect-imports each bundle before `_aggregator.js`, then mounts React.
- Code-practice dispatch: `app/src/App.jsx`. Hard-coded `route.courseId === '4911'` for annotation variant.

## Inputs

- `$ARGUMENTS` — the course id (e.g. `4916`). Required. Four digits, matches the `content/{id}/` directory name.

If `$ARGUMENTS` is empty, ask the user for the id and stop.

## Execution

Run steps in order. After each step, report pass/fail + what you did. If a step fails, stop and surface the failure — don't patch around it.

### Step 1 — Preflight: file presence + variant detection

1. Confirm `content/{id}/` exists and contains all seven files: `course.yaml`, `flashcards.yaml`, `mock-exam.yaml`, `lessons/`, `code-practice/`, `topic-dives/`, `cheat-sheet.md`. If any missing, stop.
2. Read `content/{id}/course.yaml`. Confirm `id` field matches `{id}`. Capture `code`, `name`, `exam` for the summary.
3. Determine code-practice variant: Grep `content/{id}/code-practice/*.md` for frontmatter `variant: annotation`. If any file has it, the course uses the annotation variant; flag this for Step 6 (dispatch patch).

If Step 1 fails, tell the user exactly what's missing and stop.

### Step 2 — Preflight: hard-gate audit

Run `/audit-content {id}` (invoke the skill directly, not a fresh agent) and read its output at `content/{id}/audit-report.md`.

**If the report lists ANY `critical` finding — under the hard-gate checklist or any pass — stop and do NOT proceed with compilation or wiring.** Surface the critical findings to the user with a concrete summary and point them at the audit report. Suggest `/enrich-course {id}` if the defects suggest missing content rather than structural breakage.

`warning` and `advisory` findings do not block. Include them in the final summary so the user knows the quality picture, but don't halt on them.

Hard gates per `content/STANDARDS.md §Hard gates`:

- Every card / question / file has `source:`.
- Every lesson has ≥1 retrieval checkpoint (`> **Q:**/**A:**`).
- Every problem-solving topic-dive has ≥1 worked `**Example**`.
- Every non-trivial topic-dive has ≥1 `**Pitfall**`.
- Every MCQ/MULTI `rationale` addresses each distractor.
- `topic-dives/exam-strategy-and-pitfalls.md` exists (`priority: high`).
- Zero private-data matches.
- Zero duplicate ids.
- Schema hard-fail invariants clear.

These reflect the pedagogical contract — a course failing any of them isn't ready to teach peers, so it isn't ready to register.

### Step 3 — Touchpoint: `scripts/build-content.js`

Read the file. Find the `const COURSES = [...]` line (near the top, around line 21). If `{id}` is already in the array, skip. Otherwise add it at the end preserving the existing quoting and ordering style.

### Step 4 — Touchpoint: `content/_dist/_aggregator.js`

Read the file. Find the `const ids = [...]` line (top of the IIFE, around line 6). If `{id}` is already in the array, skip. Otherwise add it at the end. Keep style consistent with the existing entries.

### Step 5 — Touchpoint: `app/src/main.jsx`

Read the file. Find the block of `import '../../content/_dist/NNNN.js';` lines. If an import for `{id}` already exists, skip. Otherwise add a new line **before** the `_aggregator.js` import — aggregator must run last. Match the existing indentation and quoting.

### Step 6 — Dispatch: `app/src/App.jsx` (annotation variant only)

If Step 1 flagged the annotation variant, find the line in `App.jsx`:

```
{route.name === 'code' && (route.courseId === '4911' ? <CodeAnnotation ... /> : <CodeApplied ... />)}
```

Extend the condition to include `{id}`, e.g. `(route.courseId === '4911' || route.courseId === '{id}')`. If the course uses the default starter-solution variant, skip this step.

If you see a growing chain of `||` ids, mention it to the user as a cleanup opportunity — the principled fix is a `codeVariant` field in `course.yaml` read by the aggregator — but don't refactor in this skill; it's out of scope.

### Step 7 — Compile

From the TERM4 root:

```
node scripts/build-content.js {id}
```

If the compile fails with a hard-fail invariant (duplicate id, cloze-without-blanks, out-of-range `correct`, wrong code-practice H2 sections, unparseable YAML), surface the exact error and stop. The user needs to fix authoring, not registration.

Confirm `content/_dist/{id}.js` was produced and `content/_dist/manifest.json` now lists the id with non-zero counts per section.

### Step 8 — Verify the React build

```
cd app && npm run build
```

If build succeeds, Phase B is done. If it fails, read the error — most likely a typo in one of the touchpoints from steps 3–5.

Do NOT run `npm run dev` from this skill (it's a long-running server). Tell the user to run it themselves and confirm the course renders.

### Step 9 — Summary

Report:

- Course id, code, name, exam date (from course.yaml).
- Audit status: critical = 0 (required to have reached this step), warning count, advisory count. Include a one-line pointer to the audit report for the user.
- Bundle counts from the manifest (modules, topics, cards, lessons, codePractice, topicDives, cheatBlocks, mockQuestions).
- Three-to-four touchpoints touched (build-content.js, _aggregator.js, main.jsx, optionally App.jsx).
- Next steps for the user: `cd app && npm run dev`, verify dashboard shows the course card, every subview renders, `./deploy.sh` once smoke-tested. If warnings exist, suggest running `/enrich-course {id}` to address them before shipping.

## Non-goals

- Do not author content. If `content/{id}/` is incomplete or low-quality, stop and point the user at `ADD-NEW-COURSE.md §Phase A`.
- Do not refactor the three hardcoded touchpoints into a dynamic loader. That's a standing tech-debt item; call it out but don't do it.
- Do not run `npm run dev`, `deploy.sh`, or any push. Those are user actions.
