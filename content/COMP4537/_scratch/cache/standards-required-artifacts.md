## Per-course required artifacts

Every course's `content/{id}/` tree must include:

1. **`topic-dives/exam-strategy-and-pitfalls.md`** (`priority: high`) — time allocation per question type, Part-1 vs Part-2 strategy if exam has parts, top-5 pitfalls extracted from past-exam solution keys, "when to skip and return" heuristics, off-by-one / unit / ordering traps specific to this domain. Sourced from `materials/past-exams/` + any `generated/exam-study/research-*.md`. Non-negotiable.
2. **Formulas quick-reference cheat-block** — one `##` block in `cheat-sheet.md` titled `Formulas — quick reference` whenever the course contains formulas. Terse, no derivations, symbols defined once at the top. Skip only for non-quantitative courses (rare).
3. **Diagram-based code-practice from past exams** — for every past-exam question that includes a diagram (page tables, RAGs, matrices, state machines, timing), a matching code-practice file must exist with inline SVG reproducing the layout.
4. **Pretest mock-exam subset** — mock-exam has a `tags: [pretest]` subset of ~5–10 questions the learner is advised to attempt on day one.

## Hard gates (block registration)

**Hard gates** — blocking. `/add-course` refuses to register; `/audit-content` reports as critical:

- Every card/question/file has `source:`.
- Every lesson has ≥1 retrieval checkpoint.
- Every problem-solving topic-dive has ≥1 worked example.
- Every non-trivial topic-dive has ≥1 `**Pitfall**`.
- Every mock MCQ/MULTI `rationale` addresses each distractor (not just verifies the correct answer).
- Every code-practice file has the schema-required H2 sections.
- `topic-dives/exam-strategy-and-pitfalls.md` exists.
- Zero private-data matches.
- Zero duplicate ids.
