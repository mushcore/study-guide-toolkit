---
name: author-stage4
description: Stage 4 (Mock-exam assembly) of course authoring. Produces mock-exam.yaml. Invoke in a fresh Claude Code session after all stage3 modules are complete.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent
disable-model-invocation: false
---

# Stage 4 — Mock-exam assembly

Produces `content/{id}/mock-exam.yaml` — 40–50 novel questions. This is the only task for this session.

## Setup

1. Parse `$ARGUMENTS` → `{id}`. Get materials path from progress file.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage4`.
3. Read in this order (read each once):
   - `content/{id}/_scratch/topic-map.md` — weights, diagram inventory.
   - `content/{id}/_scratch/voice-guide.md` — apply to question stems + rationales.
   - `content/{id}/_scratch/glossary.md` — canonical terms only.
   - `content/STANDARDS.md` §Elaborated feedback + §Concept variability + §Bloom's distribution.
   - `content/SCHEMA.md` §Mock-exam.

## Allocate question budget

From topic-map weights, allocate proportionally to total 40–50 questions. Rules:
- ≥5 questions designated `pretest` (foundational concepts, day-one attempt before content review).
- High-weight topics (≥15% of exam): allocate enough budget for ≥2 surface-form variants.

Write the budget as a local working table before spawning agents:
```
topic-id | N questions | pretest slot
```

## Generate questions (parallel by topic)

Spawn one agent per topic with a non-zero budget. Pass voice guide + glossary content inline. Each agent brief:

> Generate {N} novel mock-exam questions for topic `{topic-id}` in course `{id}`.
>
> ## Read first
> 1. content/{id}/topic-dives/{slug}.md and content/{id}/lessons/NN-{slug}.md — align questions with what was taught.
> 2. Past-exam questions for this topic: {past-exam-files}
>
> ## Voice guide (apply to question stems and rationales)
> {voice-guide-content}
>
> ## Glossary (canonical terms only)
> {glossary-content}
>
> ## Write to content/{id}/_scratch/mock/{topic-id}.yaml
> Array of question objects. Per question required fields:
> - `id`: `{topic-id}-q-NN`
> - `type`: MCQ | MULTI | SHORT
> - `topic`: display name
> - `marks`: integer
> - `question`: stem (Markdown inline allowed)
> - `choices`: 4 options for MCQ/MULTI
> - `correct`: int (MCQ) | list[int] (MULTI) | string (SHORT)
> - `rationale`: ≥3 sentences. Must address the correct-answer mechanism AND name the
>   misconception each distractor targets. Rationale verifying only the correct answer
>   is a defect (Shute 2008 elaborated feedback).
> - `source`: cite slide / past-exam file + question number
> - `bloom`: Bloom's level
> - `tags`: [pretest] if designated
>
> If generating ≥3 questions: produce ≥2 with different surface features (different numbers,
> framings, contexts) testing the same deep concept. Comment which pairs share deep structure.
>
> ## Do not
> - Reuse past-exam questions verbatim.
> - Use invented distractors — only real past-exam wrong-answer patterns.
> - Touch files outside content/{id}/_scratch/mock/.
>
> ## Return
> Under 100 words: question count, Bloom's spread, concept-variability pairs flagged,
> topics where past-exam wrong-answer patterns were sparse.

## Assemble mock-exam.yaml

After all agents return:

1. Concat every `_scratch/mock/{topic-id}.yaml` fragment into `mock-exam.yaml` `questions:` list. Add top-level `duration_seconds` (from topic-map exam meta) and optional `pass_mark`.
2. Apply `tags: [pretest]` to the designated 5–10 foundational questions.
3. **Whole-bank checks** (must be done here — individual agents can't see the full bank):
   - **Concept variability**: for every high-weight topic, confirm ≥2 surface forms present.
   - **ID uniqueness**: grep all `id:` values — stop if any duplicates.
   - **Distractor diversity**: grep for verbatim-repeated distractors across questions — flag any.
   - **Bloom's distribution**: count across full bank — target within ±10pts of 30/30/25/15.

## Audit gate

Run `/audit-content {id}` — Pass 7 (distractor analysis), Pass 8 (Bloom's + variability), Pass 9 (pretest subset) must all be clean. Fix any criticals before proceeding.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage4: {ISO datetime} — {one-sentence summary}`
- Set `## Current stage` to `stage5`.

## Tell the user

Print: question count, Bloom's distribution, pretest subset size, audit result.

Then: "Stage 4 complete. Open a new session and run `/author-stage5 {id}`."
