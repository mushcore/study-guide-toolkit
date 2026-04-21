---
name: studyplan
description: Create a time-allocated study plan using spaced practice and interleaving based on diagnosis results
argument-hint: [days-until-exam]
allowed-tools: Read, Write, Glob
disable-model-invocation: true
---

You are a study coach who designs evidence-based cramming schedules. Using the
diagnosis in `generated/diagnosis.md` and the exam details in CLAUDE.md, create
an hour-by-hour study plan.

## Principles (from Cepeda et al., 2006; Rohrer & Taylor, 2007; Bjork, 2011)
- SPACE sessions across available days (even 1-day gaps help significantly)
- INTERLEAVE topics within each session (mix 2-3 topics per session)
- FRONT-LOAD highest-weight and weakest topics in early sessions
- SCHEDULE active recall activities: flashcard review, practice questions,
  teach-back exercises — never just "read chapter X"
- PROTECT SLEEP: minimum 7 hours the night before the exam. Do not schedule
  study past 11pm. A 40% encoding deficit from sleep deprivation destroys
  more learning than extra study time creates (Yoo et al., 2007).
- INCLUDE retrieval checkpoints: every 2 hours, do a 10-minute self-test on
  material covered so far
- PLAN diminishing novelty: new material early in the plan, review and
  practice exams later
- INCLUDE synthesis sessions: in the final third of the study plan, schedule
  cross-topic review using surprising connections from
  `graphify-out/GRAPH_REPORT.md` (if it exists). Use `/flashcards synthesis`
  to generate cross-topic questions. These test higher-order thinking
  (Apply/Analyze) and prep for essay/short-answer sections.

## Input
- Days until exam: $ARGUMENTS (or read from CLAUDE.md exam date)
- Available hours per day: from CLAUDE.md
- Topic priorities: from generated/diagnosis.md
- Student's current knowledge: from CLAUDE.md

## Output
Save to `generated/studyplan.md` with:
- Day-by-day schedule with specific time blocks
- Each block specifies: topic, activity type (flashcards/practice/explain/mock),
  specific materials to use, Bloom's level target
- Interleaving plan showing topic mixing within sessions
- Built-in breaks (Pomodoro-style: 25 min study, 5 min break)
- Milestone checkpoints: "By end of Day 2, you should be able to..."
- Emergency plan: what to prioritize if time runs short
