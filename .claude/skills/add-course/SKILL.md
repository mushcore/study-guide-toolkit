---
name: add-course
description: Register a new course in the app. Compiles the content/{id}/ tree to a bundle, wires the two hardcoded touchpoints (build-content.js, main.jsx), handles conditional subview rendering (practice annotation variant, cheat-sheet), and verifies the React build succeeds. Use when the user says "add course {id}", "register course {id}", "wire up course {id}", or invokes /add-course.
argument-hint: <course-id>
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
disable-model-invocation: false
---

You are registering a new course into the `app/` React+Vite app. The canonical content tree already exists at `content/{id}/` — your job is Phase B from `ADD-NEW-COURSE.md`: compile, wire, verify. Do not author content; if the tree is missing or incomplete, stop and tell the user to run authoring first.

## Repo layout (working tree)

- Root: `/Users/kevinliang/BCIT/CST/TERM4/` — monorepo root. `content/`, `scripts/`, `app/` all live here.
- Canonical content: `content/{id}/` per `content/SCHEMA.md §Directory layout`.
- Compiler: `scripts/build-content.js`. Reads `COURSES` array and compiles each to `content/_dist/{id}.js`.
- Aggregator: `content/_dist/_aggregator.js`. Auto-derives course ids from `Object.keys(window.CONTENT)` — no edit needed when adding a course.
- App entry: `app/src/main.jsx`. Side-effect-imports each bundle before `_aggregator.js`, then mounts React.
- Practice subview dispatch: `app/src/App.jsx`. Renders annotation variant when a practice item has `variant: annotation`.

## Inputs

- `$ARGUMENTS` — the course id (e.g. `4916`). Required. Four digits, matches the `content/{id}/` directory name.

If `$ARGUMENTS` is empty, ask the user for the id and stop.

## Execution

Run steps in order. After each step, report pass/fail + what you did. If a step fails, stop and surface the failure — don't patch around it.

### Step 1 — Preflight: file presence + course-parameter detection

1. Confirm `content/{id}/` exists and contains:
   - `course.yaml` (required; must include `cheatsheet_allowed` field).
   - `flashcards.yaml` (required).
   - `mock-exam.yaml` (required).
   - `lessons/` directory with at least `00-exam-strategy.md` present. The strategy file's frontmatter must include `kind: strategy`.
   - `practice/` directory with at least one file. Each file's frontmatter must include `kind: code | applied`.
   - `cheat-sheet.md` — **presence must match `course.yaml.cheatsheet_allowed`**. `true` → file required. `false` → file MUST be absent. Mismatch: stop.
   - No deprecated `topic-dives/` or `code-practice/` directories. Presence: stop and instruct the user to run `/enrich-course {id}` to migrate.

2. Read `content/{id}/course.yaml`. Confirm `id` field matches `{id}`. Capture `code`, `name`, `exam`, `cheatsheet_allowed` for the summary.

3. Practice variant detection: grep `content/{id}/practice/*.md` for frontmatter `variant: annotation`. If any file has it, record that the course uses the annotation variant for Step 5 (dispatch check). This does NOT require a courseId hard-code any more — dispatch reads `variant` off each item.

If Step 1 fails, tell the user exactly what's missing and stop.

### Step 2 — Preflight: hard-gate audit

Run `/audit-content {id}` (invoke the skill directly, not a fresh agent) and read its output at `content/{id}/audit-report.md`.

**If the report lists ANY `critical` finding — under the hard-gate checklist or any pass — stop and do NOT proceed with compilation or wiring.** Surface the critical findings to the user with a concrete summary and point them at the audit report. Suggest `/enrich-course {id}` if the defects suggest missing content rather than structural breakage.

`warning` and `advisory` findings do not block. Include them in the final summary so the user knows the quality picture, but don't halt on them.

Hard gates per `content/STANDARDS.md §Hard gates`:

- `_scratch/exam-scope.md` exists; every authored topic resolves to an entry.
- Every card / question / file has `source:`.
- Every practice `source:` traces to lab/assignment/past-exam.
- Every lab + assignment + past-exam coding/applied question has ≥1 matching practice file.
- Every non-strategy lesson has ≥1 retrieval checkpoint (`> **Q:**/**A:**`).
- Every problem-solving lesson has ≥1 worked `**Example**`.
- Every non-trivial lesson has ≥1 `**Pitfall**`.
- Every MCQ/MULTI `rationale` addresses each distractor (≥3 sentences).
- `lessons/00-exam-strategy.md` exists with `kind: strategy`.
- Cheat-sheet presence matches `course.yaml.cheatsheet_allowed`.
- Zero private-data matches.
- Zero duplicate ids.
- Schema hard-fail invariants clear.
- Deprecated `topic-dives/` and `code-practice/` directories absent.

These reflect the pedagogical contract — a course failing any of them isn't ready to teach peers, so it isn't ready to register.

### Step 3 — Touchpoint: `scripts/build-content.js`

Read the file. Find the `const COURSES = [...]` line (near the top). If `{id}` is already in the array, skip. Otherwise add it at the end preserving the existing quoting and ordering style.

### Step 4 — Touchpoint: `app/src/main.jsx`

Read the file. Find the block of `import '../../content/_dist/NNNN.js';` lines. If an import for `{id}` already exists, skip. Otherwise add a new line **before** the `_aggregator.js` import — aggregator must run last. Match the existing indentation and quoting.

### Step 5 — Dispatch sanity: `app/src/App.jsx` (practice variant + cheat subview)

Two checks, not necessarily edits:

1. **Annotation variant dispatch.** The `practice` subview should render the annotation-variant layout when an item has `variant: annotation`. If the app still contains a legacy `route.courseId === '4911'` hard-code for annotation routing, replace that check with a per-item `variant === 'annotation'` check. If the code already dispatches per-item, skip.

2. **Cheat-sheet subview visibility.** The `cheat` subview / nav link should be hidden when `course.meta.cheatsheet_allowed !== true`. If the app unconditionally shows the `cheat` link in nav, add the conditional. If already gated, skip.

If either check requires more than a trivial edit, note it as a follow-up for the user rather than doing a larger refactor in this skill — flag it but don't block registration.

### Step 6 — Compile

From the TERM4 root:

```
node scripts/build-content.js {id}
```

If the compile fails with a hard-fail invariant (duplicate id, cloze-without-blanks, out-of-range `correct`, wrong practice H2s for the `kind`/`variant`, cheat-sheet presence mismatch, missing exam-strategy lesson, unparseable YAML), surface the exact error and stop. The user needs to fix authoring, not registration.

Confirm `content/_dist/{id}.js` was produced and `content/_dist/manifest.json` now lists the id with non-zero counts per section (lessons, practice, flashcards, mock-exam questions, cheatSheet: null|N blocks).

### Step 7 — Verify the React build

```
cd app && npm run build
```

If build succeeds, Phase B is done. If it fails, read the error — most likely a typo in one of the touchpoints from steps 3–4, or a Step-5 dispatch edit that references a renamed field.

Do NOT run `npm run dev` from this skill (it's a long-running server). Tell the user to run it themselves and confirm the course renders.

### Step 8 — Summary

Report:

- Course id, code, name, exam date, `cheatsheet_allowed` (from course.yaml).
- Audit status: critical = 0 (required to have reached this step), warning count, advisory count. Include a one-line pointer to the audit report for the user.
- Bundle counts from the manifest (modules, topics, cards, lessons, practice-by-kind, mockQuestions, cheatSheet: null|blocks).
- Two-to-three touchpoints touched (build-content.js, main.jsx, optionally App.jsx).
- Next steps for the user: `cd app && npm run dev`, verify dashboard shows the course card, every subview renders (`lessons`, `mock`, `practice`, and — only if `cheatsheet_allowed: true` — `cheat`), `./deploy.sh` once smoke-tested. If warnings exist, suggest running `/enrich-course {id}` to address them before shipping.

## Non-goals

- Do not author content. If `content/{id}/` is incomplete or low-quality, stop and point the user at `ADD-NEW-COURSE.md §Phase A`.
- Do not refactor the two hardcoded touchpoints into a dynamic loader. That's a standing tech-debt item; call it out but don't do it.
- Do not run `npm run dev`, `deploy.sh`, or any push. Those are user actions.
- Do not migrate legacy `topic-dives/` or `code-practice/` trees. That's `/enrich-course`'s job (Category H patches). This skill requires a clean, current-schema tree; it refuses to register otherwise.
