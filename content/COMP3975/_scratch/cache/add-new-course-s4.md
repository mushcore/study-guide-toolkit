### Stage 4 — Mock-exam assembly

Produce `content/{id}/mock-exam.yaml` — 40–50 novel questions matching the real exam's format, difficulty, and stem patterns. Pull deep concepts from the full topic map (Stage 1); distribute questions proportional to exam weight.

Required per question:
- `source:` citing slide/lab/past-exam question.
- `bloom:` tag.
- `rationale` — for MCQ/MULTI, addresses the correct answer's mechanism AND the misconception each distractor targets (elaborated feedback, Shute 2008). A rationale that only verifies the correct answer is a defect.

Required across the bank:
- ≥5 questions tagged `pretest` — intended for day-one attempt before content review (hypercorrection, Metcalfe 2017).
- ≥2 surface forms per deep concept — same concept, different numbers / framings / contexts (concept variability, Barnett & Ceci 2002).

Do NOT reuse past-exam questions verbatim (they stay in `materials/`). Generate novel questions testing the same concepts, with distractors drawn from real past-exam wrong-answer patterns.

**Gate:** `/audit-content {id}` — Pass 7 (distractor analysis) + Pass 8 (Bloom's + variability) + Pass 9 (pretest subset present) all clean.
