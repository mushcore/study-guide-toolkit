---
name: author-stage4
description: Stage 4 (Mock-exam assembly) of course authoring. Produces mock-exam.yaml — 60–80 novel questions with rich distractor analysis. Invoke after all stage3 modules are complete — same session or fresh session both work.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent
disable-model-invocation: false
---

# Stage 4 — Mock-exam assembly

Produces `content/{id}/mock-exam.yaml` — 60–80 novel questions. Alongside the `practice/` tree, the mock-exam is the course's retention engine; this stage invests heavily in distractor analysis and concept variability.

## Setup

1. Parse `$ARGUMENTS` → `{id}`. Get materials path from progress file.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage4`.
3. For each file below, read it only if it is NOT already in context from an earlier stage in this session. If this is a fresh session, read all of them in order:
   - `content/{id}/_scratch/exam-scope.md` — in-scope topics only.
   - `content/{id}/_scratch/topic-map.md` — weights, in-scope tags.
   - `content/{id}/_scratch/voice-guide.md` — apply to question stems + rationales.
   - `content/{id}/_scratch/glossary.md` — canonical terms only.
   - `content/STANDARDS.md` `§Elaborated feedback` + `§Concept variability` + `§Bloom's taxonomy` + `§Exam-scope discipline`.
   - `content/SCHEMA.md §Mock-exam`.

## Allocate question budget

Target **60–80 total questions**. From topic-map weights (restricted to `in-scope: tested | listed` topics), allocate proportionally. Rules:

- **8–12 questions designated `pretest`** — foundational concepts, day-one attempt before content review.
- **High-weight topics (≥15% of exam)**: allocate enough budget for **≥3 surface-form variants** per deep concept.
- **Bloom's distribution target across the full bank**: 20% Remember / 25% Understand / 35% Apply / 20% Analyze+. Within ±10pts per level.
- Do not allocate questions to `prereq` or `out` topics.
- **Structural pattern calibration**: if `_scratch/topic-map.md` has a `## Structural pattern notes` section (from Stage 1 — present when only a midterm anchor was available), match its question-mix proportions, marks-per-type, phrasing conventions, and trap style. The midterm defines *how* questions are asked, not *what* is tested. See STANDARDS.md §Exam-scope discipline. Do NOT reuse midterm questions verbatim — generate novel questions that feel indistinguishable from the midterm's style.

Write the budget as a local working table before spawning agents:

```
topic-id | in-scope | N questions | pretest slots | bloom target mix
```

## Generate questions (parallel by topic)

Spawn one agent per topic with a non-zero budget. Pass voice guide + glossary content inline. Each agent brief:

> Generate {N} novel mock-exam questions for topic `{topic-id}` in course `{id}`.
>
> ## Read first
> 1. `content/{id}/lessons/NN-{slug}.md` — align questions with what was taught.
> 2. Past-exam questions for this topic: {past-exam-files}
> 3. This topic's practice items: `content/{id}/practice/*` files mapped to this topic.
>
> ## Voice guide (apply to question stems and rationales)
> {voice-guide-content}
>
> ## Glossary (canonical terms only)
> {glossary-content}
>
> ## Bloom's target for this topic
> {N questions, split roughly: X Remember, X Understand, X Apply, X Analyze+}
>
> ## Write to content/{id}/_scratch/mock/{topic-id}.yaml
> Array of question objects. Per question required fields:
> - `id`: `{topic-id}-q-NN`.
> - `type`: MCQ | MULTI | SHORT.
> - `topic`: display name.
> - `marks`: integer.
> - `question`: stem (Markdown inline allowed).
> - `choices`: 4 options for MCQ/MULTI.
> - `correct`: int (MCQ) | list[int] (MULTI) | string (SHORT).
> - `rationale`: **≥3 sentences**. Must address the correct-answer mechanism AND name the misconception each distractor targets. Rationale verifying only the correct answer is a defect (Shute 2008 elaborated feedback).
> - `source`: cite slide / lab / assignment / past-exam file + question number.
> - `bloom`: Bloom's level.
> - `tags`: `[pretest]` if designated.
>
> If generating ≥3 questions: produce **≥3 with different surface features** (different numbers, framings, contexts) testing the same deep concept. Comment which trios share deep structure so the orchestrator can verify variability at the bank level.
>
> ## Do not
> - Reuse past-exam questions verbatim.
> - Use invented distractors — only real past-exam wrong-answer patterns (extract from solution keys).
> - Author questions for `prereq` or `out` topics.
> - Touch files outside `content/{id}/_scratch/mock/`.
>
> ## Return
> Under 150 words: question count, Bloom's spread, concept-variability trios flagged, topics where past-exam wrong-answer patterns were sparse.

## Assemble mock-exam.yaml

After all agents return:

1. Concat every `_scratch/mock/{topic-id}.yaml` fragment into `mock-exam.yaml` `questions:` list. Add top-level `duration_seconds` (from topic-map exam meta) and optional `pass_mark`.
2. Apply `tags: [pretest]` to the designated 8–12 foundational questions.
3. **Whole-bank checks** (must be done here — individual agents can't see the full bank):
   - **Concept variability**: for every high-weight topic (≥15% exam weight), confirm ≥3 surface forms present. Under-3: add more before gate.
   - **ID uniqueness**: grep all `id:` values — stop if any duplicates.
   - **Distractor diversity**: grep for verbatim-repeated distractors across questions — flag any.
   - **Bloom's distribution**: count across full bank — must be within ±10pts of 20/25/35/20. Outside: rebalance by swapping/rewriting.
   - **Total count**: confirm 60–80 questions. Under 60: add to high-weight topics. Over 80: drop the weakest variants.
   - **Pretest count**: confirm 8–12 `pretest`-tagged. Adjust if needed.

## Audit gate

Run `/audit-content {id}` — Pass 7 (distractor analysis), Pass 8 (Bloom's + variability), Pass 9 (pretest subset + exam-scope) must all be clean. Fix any criticals before proceeding.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage4: {ISO datetime} — {one-sentence summary}`.
- Set `## Current stage` to `stage5`.

## Tell the user

Print: total question count, Bloom's distribution vs target, pretest subset size, high-weight-topic variability coverage (≥3 surface forms check), audit result.

Then: "Stage 4 complete. Proceed by invoking `/author-stage5 {id}` — same session carries context forward; a fresh session also works."
