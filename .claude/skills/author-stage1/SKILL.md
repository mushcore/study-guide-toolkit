---
name: author-stage1
description: Stage 1 (Triage) of course authoring. Reads all materials, produces the exam-scope doc + topic map. Invoke after /author-course reports the current stage is stage1 — same session or fresh session both work.
argument-hint: <course-id>
allowed-tools: Read, Write, Bash, Grep, Glob, Agent
disable-model-invocation: false
---

# Stage 1 — Triage

Reads all course materials and produces two files:

1. `content/{id}/_scratch/exam-scope.md` — verbatim extract of what the final exam covers, from the exam-coverage doc in `materials/`. **Non-negotiable prereq** for every downstream stage.
2. `content/{id}/_scratch/topic-map.md` — modules + topics with in-scope tags, authoring order, lab/assignment/past-exam practice inventory.

## Setup

1. Parse `$ARGUMENTS` → `{id}`.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage1`. If not, stop and tell the user to check `/author-course {id}` for the correct stage. Get materials path from `Materials:` line. Note any entries under `## Open items`.
3. If this session has not already loaded them, read `content/STANDARDS.md` (focus on `§Source discipline`, `§Exam-scope discipline`, `§Practice source discipline`, `§Per-course required artifacts`) and `ADD-NEW-COURSE.md §Stage 1`. Skip if they are already in context from an earlier turn.

## Step A — Locate exam-coverage doc (hard prereq)

Before anything else, locate the document in `materials/` that states what the final exam covers. Search strategy:

1. Glob `{materials_path}/**` for likely filenames: `*exam*coverage*`, `*exam*format*`, `*final*review*`, `*study*guide*`, `*exam*topics*`.
2. Grep across `{materials_path}/syllabus/**` and `{materials_path}/notes/**` for phrases: `"will be tested"`, `"final exam"`, `"exam coverage"`, `"exam covers"`, `"topics on the final"`, `"material on the exam"`, `"exam format"`, `"testable topics"`.
3. Read any `materials/notes/` files that look like instructor emails or review sessions.
4. Read syllabus PDFs end-to-end for an exam-coverage section.

**If no exam-coverage doc is found, stop.** Do not proceed to the topic-map. Tell the user:

> I could not locate an exam-coverage document in `materials/`. The pipeline requires one — syllabus exam section, instructor study guide, final review sheet, or instructor email listing testable topics. Please either (a) place the relevant file in `materials/` (typically under `syllabus/` or `notes/`) and re-run this stage, or (b) explicitly confirm that the full course syllabus is in-scope, in which case I can proceed with that as the coverage spec.

Do not invent coverage from lecture slides. LLM judgment on "seems exam-relevant" is forbidden per STANDARDS §Exam-scope discipline.

## Step B — Write `_scratch/exam-scope.md`

When the exam-coverage doc is found, write `content/{id}/_scratch/exam-scope.md` with:

```markdown
# Exam scope — {id}

Source: {materials/path/to/exam-coverage-doc}
Captured: {ISO date}

## What the final exam covers (verbatim extract)

{Paste or closely paraphrase the coverage list from the source. Preserve structure — if the source lists topics under headings, preserve the headings.}

## Source citation

{Exact location in source: page numbers / section headings / slide numbers / email date.}

## Notes

- {Any instructor-clarifying statements found in other materials — e.g. "labs 3, 4, 5 are testable; lab 2 is not"}
- {Any explicit exclusions — "Chapter 12 will not be on the exam"}
```

If the coverage doc is vague ("lectures 1–12 plus labs"), paste verbatim and add a `## Scope interpretation` section noting the fallback: lecture + lab content under that umbrella is in-scope; pure textbook-only material is out-of-scope.

## Step C — Fan out material reads (parallel)

Spawn one Agent per subfolder under the materials path. Typical subfolders: `slides/`, `past-exams/`, `notes/`, `labs/`, `assignments/`, `syllabus/`, `resources/`.

Each sub-agent brief:

> Read every file under `{materials_path}/{subfolder}/`. Return structured markdown (under 500 words):
> 1. Topics covered + estimated emphasis (bold / repeated / chapter-heading signals).
> 2. For `past-exams/`: every question in structured form — `{file, exam-kind (final|midterm|practice-final|other), question-number, topic, type (MCQ/short/coding/applied/diagram), marks, includes-diagram: yes|no, diagram-type (page-table|RAG|matrix|state-machine|timing|tree|other)}`. Determine `exam-kind` from filename (`midterm_*` → midterm; `final*`/`practice-final*` → final/practice-final; otherwise `other`) and document header where ambiguous. Also extract wrong-answer patterns from solution keys. **Midterms are structural anchors — tag them explicitly so downstream stages know to use them for question-style calibration but NOT as exam-scope signal.** See STANDARDS.md §Exam-scope discipline.
> 3. For `labs/`: every lab question in structured form — `{file, lab-number, question-number, title, topic, kind (code|applied), source-file-path}`.
> 4. For `assignments/`: every assignment question in structured form — same shape as labs.
> 5. For `syllabus/`: exam date, format, room, allowed materials (**critical: explicit cheatsheet permission — yes/no/partial**), instructor, coverage statements.
> 6. For `notes/`: exam-format specifics, coverage hints, instructor emphasis, testable-topic lists.
> 7. Terminology the professor uses differently from standard usage.
>
> Do not write any files. Return structured markdown only.

Also spawn one Agent for (if present):
- `courses/COMP{id}/generated/exam-study/research-*.md`
- `courses/COMP{id}/graphify-out/GRAPH_REPORT.md`

Brief: return dense topic summaries, god-node list, surprising cross-topic connections. Under 400 words.

## Step D — Write topic map

Merge all sub-agent reports into `content/{id}/_scratch/topic-map.md`. Required sections:

### Exam meta
From syllabus: code, name, date (ISO+TZ), format, room, allowed materials, **cheatsheet permission (bool — informs `course.yaml.cheatsheet_allowed`)**, instructor.

### Modules (4–8) with topics
Per topic, record:

| Field | Value |
|---|---|
| `id` | kebab-case, globally unique |
| `name` | display string |
| `in-scope` | `tested` / `listed` / `prereq` / `out` — see below for rules |
| `difficulty` | `low` / `mid` / `high` |
| `god-node` | yes/no (from graphify) |
| `tags` | list |
| `source anchors` | list of specific references: `slides/Part9 p.12`, `past-exams/Final_2024 Q5`, `labs/Lab04 Q2`, `assignments/A2 Q3` |

**`in-scope` assignment rules**:
- `tested` — appears in at least one past-exam question (from Step C past-exam catalog).
- `listed` — appears on `_scratch/exam-scope.md` coverage list but no past-exam question found yet.
- `prereq` — foundational background explicitly referenced by an in-scope topic (e.g. "see page-table basics"). Will be inlined into dependent lessons, not authored standalone.
- `out` — lecture-only or textbook-only, no past-exam / coverage-list match. Dropped from authoring.

### Ranked authoring order
In-scope topics only (`tested | listed`), ranked hardest × most-heavily-tested at top. `prereq` topics listed separately with pointer to the dependent lesson(s). `out` topics listed separately under `## Out of scope (excluded from authoring)` for transparency — helps catch coverage-doc errors.

### Practice inventory
For every lab question + assignment question + past-exam coding/applied question cataloged in Step C, one row. Include midterm questions — midterm structure carries into the final even if the topics don't.

| Source | Exam kind | Topic | Kind | Diagram | Proposed practice file |
|---|---|---|---|---|---|
| `labs/Lab04 Q2` | n/a | `jpa-entity` | `code` | no | `practice/NN-jpa-entity-variant.md` |
| `past-exams/Final_2024 Q5` | final | `paging-translation` | `applied` | yes (page table) | `practice/NN-paging-two-level.md` |
| `past-exams/midterm_2026 Q3` | midterm | `class-hierarchy` | `code` | no | `practice/NN-class-hierarchy-variant.md` |

This drives Stage 3's practice authoring — every row must yield ≥1 practice file by end of Stage 3.

### Structural pattern notes
When a practice final is absent (only midterm + non-representative past exams), add a `## Structural pattern notes` subsection with:
- Question mix observed in the midterm (MCQ count, short count, essay count, code count, marks per type).
- Phrasing conventions (e.g. "Write the method signature AND body", "Draw the UML", "Given this code, predict output").
- Typical trap style (off-by-one, confusing-but-valid distractor, trick in the stem's last clause).
- Expected depth per question (e.g. "coding questions target 15–25 lines, single class").

This note informs Stage 4 mock-exam style calibration.

### Diagram inventory
Subset of the practice inventory where `Diagram = yes`. Every diagram-carrying past-exam question becomes a `kind: applied` practice file with inline SVG per STANDARDS §Per-course required artifacts.

Fill every section. "Unknown — materials do not cover" is valid. Never invent.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage1: {ISO datetime} — {one-sentence summary}`
- Set `## Current stage` to `stage1b`.
- Record `cheatsheet_allowed` bool under `## Open items` so Stage 2 uses it verbatim.

## Tell the user

Print a summary:
- Exam-coverage doc located at {path}.
- Module count, in-scope topic count (tested + listed), prereq count, out-of-scope count.
- Priority top-5 (hardest × most-tested).
- Practice-inventory count broken down by source (labs / assignments / past-exams) and kind (code / applied).
- Any materials gaps flagged (e.g. "no assignment solutions found; practice items for A2 Q3 will need invention flagged").
- Cheatsheet permission from syllabus.

Then: "Stage 1 complete. Proceed by invoking `/author-stage1b {id}` — same session is fine (context carries forward; the next skill will skip reads it already has); a fresh session also works."
