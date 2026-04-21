# .archive/

Legacy artifacts from superseded workflows. Kept for reference; **not part of the current pipeline**. The canonical new-course pipeline is in `../ADD-NEW-COURSE.md` — raw materials → `content/{id}/` → `npm run build-content` → registered in `study-guidev2/`.

Do not run any script or follow any doc from this directory for new work. Anything here that feels like an instruction is describing a retired workflow and will confuse the current React+Vite stack.

## What's here

### `docs/` — retired workflow prompts + research

| File | What it was | Why retired |
|------|-------------|-------------|
| `COURSE-SETUP-GUIDE.md` | Per-course folder setup: `materials/`, `.claude/skills/`, `graphify-out/`, `generated/`, course-level `CLAUDE.md`. | Personal-study scaffold; the v2 app replaces it. |
| `STUDY-WORKFLOW.md` | Day-to-day flow using the six `.claude/skills/` (`/diagnose`, `/explain`, `/flashcards`, `/mockexam`, `/studyplan`, `/weakspots`). | Same as above. |
| `skeleton.html` | 972-line vanilla-JS+CSS single-file template for v1 study guides. | Superseded by the React app. |
| `REVIEW-PROMPT.md` | 9-dimension peer-share review against `generated/exam-study/index.html`. | Review workflow was tied to the v1 HTML. |
| `APPLY-FIXES-PROMPT.md` | Applied review blockers to the v1 HTML. | Same. (Its 14 teaching principles are preserved in `../ADD-NEW-COURSE.md §Teaching standards`.) |
| `EXTRACTION-PROMPT.md` | One-time v1 HTML → `content/{id}/` migration. | Migration already done for 4736/4870/4911/4915; new courses author `content/{id}/` directly. |
| `MASTER-STUDY-PLAN.md` | 7-day cram schedule for the Apr 2026 exams. | One-off, dated. |
| `CLAUDE-DESIGN-PROMPT.md` | Brief that seeded the v2 redesign. | One-off artifact; the app exists now. |
| `studyplanner.md` | Research base (Wozniak, Roediger & Karpicke, Cepeda et al., etc.) behind the old workflow. | Evidence summary preserved in `../ADD-NEW-COURSE.md §Teaching standards`. |

### `scripts/` — retired extractors

| File | What it was |
|------|-------------|
| `extract-4736.js`, `extract-4870.js`, `extract-4911.js`, `extract-4915.js` | Course-specific scrapers that pulled `DATA = { … }` out of the v1 `index.html` files and wrote `content/{id}/*`. |
| `extract-helpers.js` | Shared turndown config + custom HTML→Markdown rules. |

The live compiler `scripts/build-content.js` is NOT archived — it's still the production build.

### `study-guides/` — retired v1 HTML guides

`comp4736/`, `comp4870/`, `comp4911/`, `comp4915/` — the single-file vanilla HTML study guides. The canonical equivalent now lives under `content/{id}/` and is rendered by the React app. `index.html` + `sync.sh` at the root of that dir were the legacy landing page + deploy helper.

### `per-course/COMP*/` — retired per-course scaffolding

For each course: the old personal-study scaffold that used to live at `../COMP{ID}/`:
- `.claude/` — local skills/agents/rules/settings (`diagnose`, `explain`, `flashcards`, `mockexam`, `studyplan`, `weakspots`, `material-reader`, `flashcard-quality`).
- `.graphifyignore`.
- `CLAUDE.md` — course-level exam-cramming instructions for the old workflow.
- `COURSE-SETUP-GUIDE.md`, `HOW-TO-STUDY.md`, `MASTER-STUDY-PLAN.md`, `STUDY-WORKFLOW.md`, `studyplanner.md` — per-course copies of the workflow docs.
- `skeleton.html` (4736), `EXAM-STUDY-TEMPLATE.md` (4911) — local template copies.

**Left in place** at `../COMP{ID}/` (still useful as authoring sources for `content/{id}/`):
- `materials/` — raw source ground truth.
- `generated/` — diagnosis reports, topic-grounded research notes (`generated/exam-study/research-*.md`), past-mock exams, explanations, old flashcard dumps. Densest source-grounded summaries of each course; the first place to look when re-authoring or patching `content/{id}/`.
- `graphify-out/` — `GRAPH_REPORT.md` + `graph.json`. Surfaces god nodes, communities, and surprising connections across a course — useful when deciding which topics deserve the most ink.
- Loose source files (e.g. COMP4870's `Course Outline ...pdf`, `midterm exam info.png`).

## Safe to delete?

Yes — nothing in the live pipeline reads from `.archive/`. Before deleting, note:
- The v1 HTMLs under `.archive/study-guides/comp*/index.html` contain the original `DATA = { priorities, quizzes, … }` arrays. `priorities` and `quizzes` were dropped during extraction — if you ever want them back, they live here.
