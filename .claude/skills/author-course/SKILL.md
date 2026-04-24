---
name: author-course
description: Progress tracker and dispatcher for Phase A course authoring. Checks current stage and tells which stage skill to invoke next. Use when the user invokes /author-course, starts a new course, or wants to know where they left off.
argument-hint: <course-id> [materials-path]
allowed-tools: Read, Write, Bash, Glob
disable-model-invocation: false
---

# author-course — progress dispatcher

Stages chain in a single session by default — each stage skill, when complete, points to the next and the user (or you) invokes it directly without a session reset. Each stage skill is also safe to invoke standalone in a fresh session. This dispatcher only tracks progress and routes to the right next step.

## What this skill does

1. Parse `$ARGUMENTS` → `{id}` + optional `{materials_path}` (default: `courses/COMP{id}/materials/`).
2. If `content/{id}/_scratch/progress.md` does not exist: run preflight, initialize it, tell user to start Stage 1.
3. If it exists: read `Current stage:` and report it, then tell the user exactly which skill to invoke next (same session is the default; fresh session also works).

## Preflight (runs once, only if no progress file)

1. Confirm cwd is `/Users/kevinliang/BCIT/CST/TERM4`.
2. Glob `{materials_path}/**` — must be non-empty (minimum: slides + syllabus or past-exams). Stop if empty.
3. Glob `content/{id}/` — if ≥3 `.md` files exist outside `_scratch/`, ask user to confirm overwrite or use `/enrich-course`.
4. `mkdir -p content/{id}/{_scratch/draft,_scratch/mock,lessons,practice}`. Do NOT create `topic-dives/` or `code-practice/` — those are deprecated per STANDARDS / SCHEMA and trigger Pass 1.14 criticals.
5. Write `content/{id}/_scratch/progress.md`:

```markdown
# author-course progress — {id}

Materials: {materials_path}
Started: {ISO date}

## Current stage
stage1

## Completed stages
(none yet)

## Open items
(none)
```

## Stage routing table

| Current stage | Tell user to run |
|---|---|
| `stage1` | `/author-stage1 {id}` |
| `stage1b` | `/author-stage1b {id}` |
| `stage2` | `/author-stage2 {id}` |
| `stage3` | `/author-stage3 {id}` |
| `stage4` | `/author-stage4 {id}` |
| `stage5` | `/author-stage5 {id}` |
| `done` | "All stages complete. Run `cd app && npm run dev` to smoke-test, then `./deploy.sh`." |

Recommend the user invoke the skill listed above. Fresh-session resets are optional — each stage skill reads everything it needs from files and is safe to invoke either immediately after the previous stage (same session, context carries forward) or in a fresh session.
