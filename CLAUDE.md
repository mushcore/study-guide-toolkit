# CLAUDE.md

Router. This directory is a monorepo of BCIT CST Term 4 study-guide tooling.

## Layout

- `content/` — canonical course content (YAML + Markdown per `content/SCHEMA.md`), compiled to `content/_dist/{id}.js` bundles.
- `scripts/build-content.js` — the compiler. `npm run build-content` from this dir.
- `app/` — React + Vite single-page app that consumes the bundles. Dev / build / preview commands run from there.
- `courses/COMP{4736,4870,4911,4915}/` — per-course source directories. `materials/` is ground truth; `generated/` and `graphify-out/` are secondary authoring sources (old diagnosis reports, topic research notes, knowledge-graph reports). Four course ids only.
- `deploy/` — GitHub Pages deploy target for the app build. `./app/deploy.sh` pushes to it.
- `.archive/` — **do not follow.** Retired workflow docs, extractor scripts, v1 HTML guides, and old per-course scaffolding. Describes a superseded pipeline; instructions in there will not work against the current stack. See `.archive/README.md`.

## Where to look for what

| Task | Canonical doc |
|------|---------------|
| Add a new course end-to-end | `ADD-NEW-COURSE.md` |
| **Pedagogical standards (what to write inside each file)** | **`content/STANDARDS.md`** |
| App architecture, dev commands, route shapes | `app/CLAUDE.md` |
| Content file shapes, invariants, compiler pipeline | `content/SCHEMA.md` |

## Skills

- `/author-course {id} [materials-path]` — progress tracker: initializes `content/{id}/_scratch/progress.md` on first run, then tells you which stage skill to invoke next in a fresh session.
- `/author-stage1 {id}` — Stage 1: reads all materials, produces the topic map.
- `/author-stage1b {id}` — Stage 1b: produces voice guide + glossary.
- `/author-stage2 {id}` — Stage 2: produces `course.yaml`, `exam-strategy-and-pitfalls.md`, cheat-sheet skeleton.
- `/author-stage3 {id}` — Stage 3: authors one module (re-invoke in a fresh session per module).
- `/author-stage4 {id}` — Stage 4: assembles `mock-exam.yaml`.
- `/author-stage5 {id}` — Stage 5: final audit, fills cheat-sheet stubs, compiles + registers course.
- `/audit-content {id}` — full audit of a `content/{id}/` tree against `content/STANDARDS.md` + `content/SCHEMA.md`. Writes `content/{id}/audit-report.md`. Called by stage skills; invoke directly anytime.
- `/add-course {id}` — Phase B automation: calls `/audit-content` preflight, compiles the bundle, wires the two hardcoded touchpoints (`scripts/build-content.js`, `app/src/main.jsx`), handles annotation-variant dispatch in `App.jsx`, verifies `npm run build`.
- `/enrich-course {id}` — for upgrading existing courses to current STANDARDS: reads materials + existing tree, runs the audit, and writes `content/{id}/enrichment-plan.md` (gap analysis + prioritized patch plan). Does not apply patches.

**Typical new-course flow**: `/author-course {id}` (init) → fresh session `/author-stage1 {id}` → fresh session `/author-stage1b {id}` → ... → fresh session `/author-stage5 {id}` → smoke-test → `./deploy.sh`. Each stage skill updates the progress file and tells you the next command.

## Hardcoded course ids

Adding or removing a course touches **three** files in lockstep — see `ADD-NEW-COURSE.md §Phase B` or just run `/add-course`.
