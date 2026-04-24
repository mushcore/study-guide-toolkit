---
name: exam-scope-4870
description: Verbatim extract of final exam coverage for COMP 4870 — weeks 7–13 with explicit topic/marks breakdown from instructor handout
type: project
---

# Exam scope — 4870

Source: `courses/COMP4870/4870 final exam details.txt` (instructor-provided final exam handout; cross-referenced with `courses/COMP4870/materials/syllabus/4870 course outline.pdf` for schedule + instructor name)
Captured: 2026-04-23

## What the final exam covers (verbatim extract)

> The final exam is on Friday April 24, 2026 from 10:30 AM to 11:30 AM in room SE12-327. You are allowed to bring with you one hand-written cheat sheet on a standard 8 1/2" X 11" piece of paper. You can write on both sides of the paper.
>
> Material covered in the exam is for weeks 7-13.
>
> Questions Breakdown: TDD (6), gRPC (7), Localization (4), Blazor (2), Tag Helpers (3), ML.NET (12), AI (13), Aspire (5), Cache/Redis (8), File-based apps (8), Excel/PDF/Chart (2)
>
> Time: 60 minutes
>
> 60   multiple choice questions   60 marks
> 10   match two columns questions 10 marks
> 1    coding question             10 marks
>  TOTAL                           80 marks

## Source citation

`courses/COMP4870/4870 final exam details.txt` (plain-text handout from instructor Medhat Elmasry).

## Exam meta (for `course.yaml`)

- `exam`: 2026-04-24T10:30:00-07:00 (PDT; BCIT Burnaby)
- `room`: SE12-327
- `format`: 80 marks total, 60 min — 60 MCQ (60 marks) + 10 match-two-columns (10 marks) + 1 coding question (10 marks)
- `cheatsheet_allowed`: **true** (one hand-written 8.5"×11" sheet, both sides)
- `instructor`: Medhat Elmasry

## Topic weights (authoritative — drives Stage 4 mock-exam distribution)

Breakdown sums to 70 marks across 11 topics, matching the combined MCQ + match-two-columns pool (60 + 10 = 70). The 10-mark coding question is separate and its topic is not pre-announced.

| Topic              | Marks | % of 80 | Weight class      |
|--------------------|------:|--------:|-------------------|
| AI                 |    13 |    16.3 | **heavy**         |
| ML.NET             |    12 |    15.0 | **heavy**         |
| Cache/Redis        |     8 |    10.0 | heavy             |
| File-based apps    |     8 |    10.0 | heavy             |
| gRPC               |     7 |     8.8 | medium            |
| TDD                |     6 |     7.5 | medium            |
| Aspire             |     5 |     6.3 | medium            |
| Localization       |     4 |     5.0 | medium            |
| Tag Helpers        |     3 |     3.8 | light             |
| Blazor             |     2 |     2.5 | light             |
| Excel/PDF/Chart    |     2 |     2.5 | light             |

Top-3 = 41% of the MCQ/match pool: **AI, ML.NET, Cache/Redis**.

## Scope interpretation

The "weeks 7–13" header is coarse — the breakdown includes topics introduced earlier (Aspire: W5; Blazor: W6; Semantic Kernel/AI: W4–6) that are drilled / reused in weeks 7–13 labs and projects. **The 11-topic breakdown is the authoritative scope list.** Anything not in the breakdown is out-of-scope regardless of weekly schedule position.

Explicit exclusions (not in breakdown, lecture-only):
- Razor Pages & MVC foundations (W2) — out-of-scope for final, was midterm territory.
- Code-1st Development & Docker fundamentals (W3) — out-of-scope except where reused inside in-scope topics (e.g. EF inside AI/ML.NET demos).
- API / Token Auth / JWT foundations (W4) — out-of-scope unless invoked by in-scope topics.
- Identity / Extend Identity + Seed (W5) — out-of-scope except Aspire.
- SignalR (W6) — out-of-scope.
- Serverless Azure Functions + Static Web Apps + React.js (W7) — out-of-scope (the "AI" topic on the final refers to Semantic Kernel / ML-surface AI, not React wiring).
- TypeScript fundamentals (W9) — out-of-scope except where it appears inside Excel/PDF/Chart or File-based apps.
- MongoDB (W13 second half) — out-of-scope unless embedded in TDD lab content.

## Notes

- Cheatsheet permission is **explicit yes** — `cheatsheet_allowed: true` in `course.yaml`. The cheat-sheet artifact is required per STANDARDS §Per-course required artifacts.
- No practice final exists. `materials/past-exams/midterm_exam_questions.md` is a **midterm** — structural anchor only (question style, marks distribution, distractor conventions), NOT scope signal. Midterm topics (Razor, MVC, EF, Code-1st, Identity roles) are out-of-scope for the final.
- "AI" on the breakdown maps to the AI-stack slides: `CSharp_Meets_AI.pptx`, `SLM.pptx`, plus notes `AI-Models_MAF_SCRIPT.docx`, `SLM.docx`, `Plugins/` code-example. Semantic Kernel (W4) folds into this bucket.
- No private data in the source handout.
