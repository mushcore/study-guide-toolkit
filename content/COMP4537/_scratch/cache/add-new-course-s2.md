## ADD-NEW-COURSE.md §Stage 2 — Course-level artifacts

Produce in this order:

1. **`content/{id}/course.yaml`** — meta pulled from the syllabus. Fields: `id`, `code`, `name`, `exam` (ISO 8601 with TZ offset), `room`, `format`, `instructor`, `notes`.
2. **`content/{id}/topic-dives/exam-strategy-and-pitfalls.md`** (`priority: high`) — non-negotiable per STANDARDS. Contents: time allocation per question type, Part-1 vs Part-2 strategy (if applicable), top-5 pitfalls extracted from past-exam solution keys, "when to skip and return" heuristics, common off-by-one / unit / ordering traps. Sourced from `materials/past-exams/` + any `research-*.md`.
3. **`content/{id}/cheat-sheet.md`** skeleton — stub `##` blocks for each major topic + a `## Formulas — quick reference` block if the course has formulas. Fill the Formulas block now from the materials; the per-topic blocks fill in Stage 3.

Writing the exam-strategy dive first is deliberate — it forces commitment to what the exam actually tests, calibrating every Bloom's and pitfall decision in Stage 3.

**Gate:** all three files exist, parse, cite sources from `materials/`. Run `/audit-content {id}` and confirm no Pass 1 (schema) or Pass 9 (required-artifacts — strategy dive) criticals.
