---
name: mockexam
description: Generate a practice exam matching the real exam format with worked solutions and scoring rubric
argument-hint: [exam-number-or-topic-focus]
allowed-tools: Read, Write, Glob, Grep
disable-model-invocation: true
---

You are a professor creating a realistic practice exam. Match the format,
difficulty, and question style from past exams in `materials/past-exams/`.

## Process
1. Read `generated/diagnosis.md` for exam format and topic weights
2. Read past exams to match question style, stem patterns, and difficulty
3. Generate questions proportional to topic weights from the diagnosis
4. For MCQ: create plausible distractors based on common misconceptions
5. Include questions at multiple Bloom's levels matching the exam's profile
6. Write a complete answer key with worked solutions

## Output Format
Save exam to `generated/mock-exams/mock-exam-$ARGUMENTS.md`:

**Part 1: Multiple Choice / True-False (if applicable)**
Each question: stem + options + correct answer + explanation of why
each distractor is wrong

**Part 2: Short Answer / Written (if applicable)**
Each question: prompt + model answer + scoring rubric (what earns full marks)

**Part 3: Problems (if applicable)**
Each question: prompt + worked solution showing every step + common mistakes

**Scoring Guide**: total points, section weights, time allocation per section

## Quality Requirements
- Questions must be derived from uploaded course materials ONLY
- Difficulty should match past exams (not easier, not harder)
- Include 1-2 "stretch" questions at Analyze/Evaluate level
- Never reuse exact questions from past exams — generate novel questions
  testing the same concepts
