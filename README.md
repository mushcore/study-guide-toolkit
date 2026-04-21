# study-guide-toolkit

Turns raw course materials (slides, PDFs, past exams, labs) into a polished React web app study guide. The pipeline has two phases: a structured authoring step that produces a canonical content tree, and a compile-and-register step that bundles the tree for the Vite SPA. The current content covers BCIT CST Term 4 courses; the pipeline is general-purpose.

Live app: <https://mushcore.github.io/study-guides/>

---

## Repo layout

```
/
├── content/                        # canonical course content
│   ├── {courseId}/                 # one directory per course
│   │   ├── course.yaml
│   │   ├── flashcards.yaml
│   │   ├── mock-exam.yaml
│   │   ├── lessons/
│   │   ├── code-practice/
│   │   ├── topic-dives/
│   │   └── cheat-sheet.md
│   ├── _dist/                      # compiled bundles (generated)
│   ├── SCHEMA.md                   # file shapes and hard-fail invariants
│   └── STANDARDS.md                # pedagogical contract
├── scripts/
│   └── build-content.js            # compiler: content/ → _dist/
├── app/                            # React + Vite SPA
│   ├── src/
│   ├── deploy.sh                   # build + push to GitHub Pages
│   └── package.json
├── courses/COMP{id}/               # raw materials per course (ground truth for authoring)
│   ├── materials/                  # slides, past exams, labs, notes
│   ├── generated/                  # secondary authoring sources (old research notes)
│   └── graphify-out/               # knowledge-graph reports
├── deploy/                         # GitHub Pages deploy target (gitlinked, not committed here)
├── package.json                    # root — build-content script only
└── ADD-NEW-COURSE.md               # end-to-end pipeline reference
```

---

## Prerequisites

- Node.js ≥ 18
- Two `npm install` passes: one at the repo root, one inside `app/`

```bash
npm install
cd app && npm install
```

---

## Quick start

Build content bundles, then start the dev server:

```bash
# from repo root
npm run build-content

# from app/
cd app
npm run dev
```

The Vite dev server serves `app/` and is configured with `server.fs.allow: ['..']` so it can load the compiled bundles from `content/_dist/`.

To rebuild a single course bundle instead of all courses:

```bash
node scripts/build-content.js 4736
```

---

## Adding a new course

Full pipeline reference: [`ADD-NEW-COURSE.md`](ADD-NEW-COURSE.md).

The pipeline has two phases:

**Phase A — author the content tree.**
Place raw materials under `courses/COMP{ID}/materials/`. Produce the seven canonical files under `content/{ID}/` following the schema in `content/SCHEMA.md` and the pedagogical contract in `content/STANDARDS.md`.

**Phase B — compile and register.**
Run `npm run build-content`, wire two hardcoded touchpoints in `scripts/build-content.js` and `app/src/main.jsx`, then verify with `npm run build`. (`_aggregator.js` auto-derives course ids from `window.CONTENT` — no edit needed.)

### Claude Code skills

If you are using Claude Code, the following slash commands automate both phases:

| Skill | What it does |
|-------|-------------|
| `/author-course {id} [materials-path]` | Drives Phase A end-to-end (triage → course artifacts → per-module authoring → mock exam → final audit). Pauses after each of five stages for review. |
| `/audit-content {id}` | Full audit of `content/{id}/` against `STANDARDS.md` and `SCHEMA.md`. Writes `content/{id}/audit-report.md`. Called automatically at every stage gate; invoke directly anytime. |
| `/add-course {id}` | Drives Phase B: audit preflight, compile, wire the three touchpoints, verify `npm run build`. |
| `/enrich-course {id}` | For existing courses: runs the audit and writes `content/{id}/enrichment-plan.md` with a prioritized gap-closure plan. Does not apply patches. |

Typical flow:

```
/author-course 4736
# review after each stage
cd app && npm run dev   # smoke-test
./deploy.sh
```

---

## Deploy

`deploy/` is a separate git clone of the GitHub Pages branch. Run from `app/`:

```bash
./deploy.sh                          # uses default commit message
./deploy.sh "fix: update 4736 mock"  # custom message
```

The script runs `npm run build`, syncs `dist/` into `../deploy/`, and pushes to `origin main`. Pages rebuild in approximately 30 seconds. Requires `../deploy/.git` to exist.

Override the deploy target directory:

```bash
DEPLOY_DIR=/path/to/other/clone ./deploy.sh
```

---

## Content schema and standards

| Document | Governs |
|----------|---------|
| `content/SCHEMA.md` | File shapes, required fields, hard-fail build invariants |
| `content/STANDARDS.md` | Pedagogical contract — what to write inside each file (grounded in Dunlosky 2013, Mayer CTML, spaced retrieval, elaborated feedback) |
| `app/CLAUDE.md` | App architecture, route shapes, boot sequence, persistence |

The build aborts on hard-fail invariants: duplicate IDs, cloze cards without blanks, mock-question `correct` index out of range, code-practice files with wrong H2 structure, unparseable YAML. Run `npm run build-content` to validate the full tree.
