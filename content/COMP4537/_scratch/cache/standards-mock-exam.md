## Elaborated feedback (Shute 2008)

Every mock-question `rationale` field includes:
(a) the mechanism behind the correct answer, AND
(b) the misconception each distractor targets.
A rationale that only restates the correct answer is a defect.

## Concept variability for transfer (Barnett & Ceci 2002)

Mock-exam banks include at least 2 questions testing the same *deep concept* through different *surface features* (different numbers, different framings, different contexts). Identical-surface-feature questions inflate count without teaching transfer.

## Bloom's distribution

Target: ~30% Remember, ~30% Understand, ~25% Apply, ~15% Analyze+.
Per-course distribution within ±10pts triggers warning; >±15pts triggers critical.

## Pretesting / hypercorrection (Richland et al. 2009; Metcalfe 2017)

- Mock exam is a **day-one** artifact, not an end-of-study one.
- Mock-exam has a `tags: [pretest]` subset of ~5–10 questions for day-one attempt before content review.
- Rationale fields are elaborated so corrections carry enough signal to trigger hypercorrection.

## Mock-exam per-question required fields

- `id`: {topic-id}-q-NN
- `type`: MCQ | MULTI | SHORT
- `topic`: display name
- `marks`: integer
- `question`: stem
- `choices`: 4 options (MCQ/MULTI)
- `correct`: int (MCQ) | list[int] (MULTI) | string (SHORT)
- `rationale`: ≥3 sentences naming correct answer mechanism AND misconception each distractor targets
- `source`: cite slide / past-exam file + question number
- `bloom`: Bloom's level
- `tags`: [pretest] on designated questions

For topics with ≥3 questions: produce ≥2 with different surface features testing same deep concept.
