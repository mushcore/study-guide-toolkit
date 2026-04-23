## Source discipline (RAG grounding)

Every authored unit traces to `materials/` or a `generated/exam-study/research-*.md` note. LLM parametric knowledge is a forbidden source. This is the guardrail against hallucinated content that looks plausible but contradicts the course.

**Enforcement:**
- `source:` field on every card, mock question, code-practice file, lesson, and dive.
- Audit spot-checks a random sample of 10 cards per pass: cited source must exist and contain the claim.
- Acceptable source formats: `Part 9, Slide 12` / `Lab 06` / `Final_exam_practice_Sol.pdf p.3 Q7` / `research-deadlock.md §2.1` / `Ch 14 p.482`.
