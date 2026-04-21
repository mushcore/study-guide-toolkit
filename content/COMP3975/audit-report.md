# Content audit — COMP3975

Date: 2026-04-20
Tree: content/COMP3975/
Stage: 2 (course-level artifacts only — lessons, flashcards, code-practice, mock-exam not yet authored)

## Scorecard (Stage 2 scope)

| Pass | Name | Critical | Warning | Advisory |
|---|---|---|---|---|
| 1 | Schema hard-fails | 0 | 0 | 0 |
| 2 | Source discipline | 0 (n/a — no cards/lessons yet) | — | — |
| 3 | Retrieval affordance | 0 (n/a) | — | — |
| 4 | Elaborative encoding | 0 (n/a) | — | — |
| 5 | Worked examples | 0 (n/a) | — | — |
| 6 | Dual coding | 0 (n/a) | — | — |
| 7 | Pitfall + distractor analysis | 0 (n/a) | — | — |
| 8 | Bloom's + concept variability | 0 (n/a) | — | — |
| 9 | Per-course required artifacts | 0 | 0 | 1 |
| 10 | Peer-shareability + private data | 0 | 0 | 0 |

**Overall verdict (Stage 2)**: Gate-clear — safe to proceed to Stage 3.

**Hard-gate status:**
- [x] `topic-dives/exam-strategy-and-pitfalls.md` exists with `priority: high`
- [x] Strategy dive: time allocation table present
- [x] Strategy dive: ≥5 pitfalls (9 found)
- [x] Strategy dive: "when to skip" heuristic present
- [x] Strategy dive: `**Takeaway**` callout present
- [x] `source:` on exam-strategy dive
- [x] Zero private-data matches
- [x] `exam-strategy-and-pitfalls` id unique across all courses
- [x] course.yaml parses, all required fields present, exam ISO with TZ offset
- [x] cheat-sheet.md starts with `##`, no H3 inside blocks (14 sections)
- [ ] flashcards.yaml — not yet authored (Stage 3)
- [ ] mock-exam.yaml — not yet authored (Stage 4)
- [ ] lessons/ — not yet authored (Stage 3)
- [ ] code-practice/ — not yet authored (Stage 3)

## Blockers

None at this stage.

## Advisory

1. **Pretest mock-exam subset**
   - Severity: Advisory
   - Pass: 9
   - STANDARDS principle: Pretesting / hypercorrection (Richland 2009; Metcalfe 2017)
   - File: content/COMP3975/mock-exam.yaml (not yet authored)
   - Finding: ≥5 questions must be tagged `pretest`. Deferring to Stage 4.
   - Fix: Tag 5–8 foundational questions `pretest` during mock-exam assembly.

## Strengths to preserve

- `exam-strategy-and-pitfalls.md` sources every pitfall to a specific file+question number from materials.
- cheat-sheet.md covers all 14 topic areas with terse bullets — no H3 nesting, schema-compliant.
- course.yaml exam field uses correct ISO 8601 with `-07:00` TZ offset.
