# Review: code-practice/ (B3 — diagram-based drills 08-11, pass 2)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/past-exams/Final_exam_practice.pdf`, `Final_exam_practice_Sol.pdf` (full)
- `materials/slides/Part_10_memory.pdf`
- `content/4736/topic-dives/*` (paging-core-formulas, address-translation-worked-examples, two-level-page-tables)
- `content/SCHEMA.md`
- Pass 1 review: `generated/reviews/code-practice-review-2026-04-20.md`

**Files reviewed:**
- `08-paging-sizing-48bit-va.md`
- `09-single-level-pt-translate.md`
- `10-mmu-present-bit-translate.md`
- `11-two-level-pt-translate.md`

**Overall verdict:** Ship as-is.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | All four diagram-based past-exam memory questions covered; unchanged from pass 1. |
| Accuracy | 5 / 5 | Every numeric answer still matches sol-PDF. Pass 2 changes were notation-only — no arithmetic affected. |
| Excess (lower is worse) | 5 / 5 | No bloat. |
| Pedagogical quality | 5 / 5 | Dual-coding SVG + text on every drill; Apply-level throughout matching the 75% Apply weighting in `diagnosis.md`. |
| Clarity & structure | 5 / 5 | Pass 1 notation issues resolved: drill 11 range notation now matches SVG (exclusive upper); drill 10 PA rendering is now unambiguously "15-bit binary, decimal 29109" with frame-0-valid clarifier. |
| Exam alignment | 5 / 5 | Unchanged from pass 1 — direct-calc and formula methods both present; prompts mirror exam phrasing. |
| Internal consistency | 5 / 5 | All four files still conform to `SCHEMA.md:315-370` code-practice invariants. |

---

## Critical defects (fix before using this guide)

None. All pass 1 prescribed fixes verified in place.

---

## Missing content

None gating. The optional pass 1 suggestion (common-mistakes callout per drill) remains optional and is deferred to B6 (exam-strategy topic-dive), which is the natural home for exam-strategy content.

---

## Content to remove

None.

---

## Inaccuracies

None newly found. All pass 1 numeric verifications still hold.

---

## Pedagogical issues

None gating. Dual coding is strong on all four drills. Direct-calc + formula method are both demonstrated where professor grading expects both.

---

## Bloom's distribution

- **Current:** 100% Apply across all four drills — unchanged from pass 1.
- **Target:** code-practice bank carries the Apply/Analyze weight by design; flashcard banks (B1, B2) carry Remember/Understand. Correct split.
- **Recommendation:** no change.

---

## Clarity / consistency issues

- **Drill 11 Why section:** now uses `16-20` and `8-12` exclusive-upper-bound notation, matching the SVG physical-memory column. Consistent. ✓
- **Drill 10 Why section:** PA rendering now states `15 bits wide (3 frame bits + 12 offset bits); the decimal value is 29109` without the ambiguous `0x71B5` hex alias. Added clarifier on row 3 (`frame=000, present=1` is a valid frame-0 mapping, not a fault). ✓
- **Drill 10 Solution block:** `Physical binary = 111 0001 1011 0101  (15 bits: 3 frame + 12 offset)` — explicit width annotation. No ambiguity.

No remaining issues.

---

## Exam alignment

Unchanged. All four drills mirror the exam's diagram-based Part 2 questions with faithful SVG reproductions and verified numeric answers.

---

## Internal consistency

- Schema invariants: all four files still pass (H2 order, single-fence Starter/Solution, `lang: text` consistent).
- Cross-drill terminology: "VP" and "frame#" used consistently; page-size vs frame-size equality stated consistently across 09, 10, 11.
- SVG palette/fonts consistent across all four drills.

---

## What the guide does well

Pass 1 defects cleanly resolved without affecting any numeric answer. Drill 10's frame-0-valid clarifier pre-empts a likely student misread (`frame=000` + `present=1` looks paradoxical at a glance). Drill 11's notation harmonization removes a minor inconsistency between prose and SVG that would have nagged attentive readers.

---

## Prescribed next actions (ordered)

1. **None required before promotion.** Batch B3 is ship-ready.
2. (Optional, post-batch) B6 exam-strategy topic-dive could cite each drill's Why section for common-mistake callouts — natural cross-link, not a drill-level change.

Proceed to B4 (mock exam expansion + TF type).
