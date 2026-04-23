## ADD-NEW-COURSE.md §Stage 1 — Triage

**Inputs read:** every file under `courses/COMP{id}/materials/` (slides, past exams, syllabus, notes, labs). Also read `courses/COMP{id}/generated/exam-study/research-*.md` and `courses/COMP{id}/graphify-out/GRAPH_REPORT.md` if present.

**Produces:** `content/{id}/_scratch/topic-map.md` with:
- Modules (4–8) and topics under each, kebab-case ids globally unique across all courses.
- Per-topic: estimated exam weight (% of final marks), difficulty (low/mid/high), god-node status from graphify, tag list.
- Ranked priority list: hardest × most-heavily-tested at the top. This ranking drives Stage 3 authoring order.
- Diagram inventory: every past-exam question that includes a diagram (page table, RAG, matrix, state machine, timing) is listed — each becomes a required code-practice file per STANDARDS §Per-course required artifacts.

**Topic-map template:**

```markdown
# Topic Map — COMP{id}

## Exam meta
- Date/time: (from syllabus)
- Room: (from syllabus)
- Format: (from syllabus)
- Allowed materials: (from syllabus)
- Instructor: (from syllabus)

## Modules

### M1: {Module Name}
| Topic id | Topic name | Weight% | Difficulty | Tags | Source files |
|----------|------------|---------|------------|------|--------------|
| {topic-id} | {name} | {n}% | low/mid/high | [...] | [...] |

### M2: ...

## Ranked priority list
1. {topic-id} — weight {n}%, difficulty {level} — reason
2. ...

## Diagram inventory
| Past-exam file | Question | Diagram type | Notes |
|----------------|----------|--------------|-------|
| ISAQuiz1.pdf | Q3 | HTTP flow | ... |

## Terminology notes
- Professor uses X to mean Y (differs from standard usage).
- ...

## Materials gaps
- ...
```

**Gate:** review + reprioritize the topic map. Module/topic ids can't change after Stage 3 without a rename pass.
