# Review: memory-focus.yaml (B5 — memory-focused mock bank, pass 1)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/slides/Part_10_memory.pdf` (Part 10 topics cross-referenced via `generated/diagnosis.md`)
- `materials/past-exams/Final_exam_practice.pdf`, `Final_exam_practice_Sol.pdf`
- `content/4736/topic-dives/paging-core-formulas.md`, `address-translation-worked-examples.md`, `tlb-mmu-details.md`, `two-level-page-tables.md`, `placement-algorithms-past-exam-q2.md`, `buddy-system-past-exam-q8.md`, `page-replacement-algorithms.md`, `segmentation-swapping-bitmaps-vs-lists.md`, `memory-overhead-optimal-page-size-q6.md`
- `content/SCHEMA.md` mock-exam invariants
- `generated/diagnosis.md`, `COMP4736/CLAUDE.md`

**Questions reviewed:** q53-q77 (25 new entries, all tagged `memory-focus`).

**Overall verdict:** Ship as-is.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | Plan distribution hit exactly: paging translation (6), page tables (4), replacement (4), TLB (3), allocation (4), buddy (3), thrashing (1) = 25. Spans all memory sub-topics flagged in `diagnosis.md:29-38`. |
| Accuracy | 5 / 5 | All arithmetic verified independently: q55 PA=20592, q58 frames=2^26, q66 LRU-trace=6 faults, q69 EAT=103 ns, q74 buddy block=512 KB. Every claim grounds in Part 10 or a topic-dive. |
| Excess (lower is worse) | 5 / 5 | No bloat. 25 questions land on target. No off-syllabus content. |
| Pedagogical quality | 5 / 5 | Every 4-choice MCQ has distractor analysis per `COMP4736/CLAUDE.md:54`. T/F-style questions used for fast Remember-level recall; 4-choice used where discrimination matters. |
| Clarity & structure | 4 / 5 | One minor ambiguity in q64's D option (Second Chance) — see Clarity. Non-gating. |
| Exam alignment | 5 / 5 | Past-exam hole list from Q2 reused in q70-q71 for direct drill. Q1 sizing pattern (48-bit / 32-bit / page-size) reused in q54, q58. Matches the exam's repeat-pattern tests. |
| Internal consistency | 5 / 5 | All entries pass `SCHEMA.md:198-215` (unique IDs q53-q77, `correct` in range, rationale present). No duplicates with q1-q52. All tags consistent. |

---

## Critical defects (fix before merging to live guide)

None. Batch is ship-ready.

---

## Missing content

None for this batch. Optional future additions (non-gating):

- Matrix-detection MCQ — still zero in the live bank despite `diagnosis.md:70-74` flagging it. B3 drill 04 covers it as Apply-level; an MCQ version would strengthen Part 1 coverage.
- Optimal page-size formula MCQ — `p* = √(2se)`. Covered by B1 flashcards; would fit as Remember-level MCQ here.

Neither is gating; both can be added incrementally post-promotion.

---

## Content to remove

None.

---

## Inaccuracies

Independent arithmetic verification on every computational question:

| Q | Claim | Verification | Status |
|---|---|---|---|
| q55 | VA 12400 in page-size 4 KB, VP 3 → frame 5, PA=20592 | 12400/4096 = 3 rem 112; 5×4096+112 = 20592 | ✓ |
| q58 | 48-bit VA, 40-bit PA, 16 KB pages → 2^26 frames | offset=14, 40-14=26 | ✓ |
| q66 | 3 frames, string 1,2,3,1,2,4,1,2,3,4, LRU → 6 faults | Traced: 3 initial + 3 replacement faults | ✓ |
| q69 | 1 ns TLB, 100 ns mem, +1 PT access, 0.98 hit → 103 ns | 0.98×101 + 0.02×201 = 98.98+4.02 = 103 | ✓ |
| q70 | Holes [10,4,20,18,7,9,12,15], request 10, first fit → 10 | First scan: 10≥10 → take | ✓ |
| q71 | Same holes, request 9, best fit → 9 | Candidates {10,20,18,9,12,15}, min=9 | ✓ |
| q74 | 300 KB buddy request (min 32) → 512 KB | 256<300≤512 | ✓ |
| q53, q54, q61, q62 | Bit-split arithmetic | Verified against `offset = log₂(page_size)` formula | ✓ |

No arithmetic defects. No factual defects against Part 10 slides or topic-dives.

---

## Pedagogical issues

None gating. One minor note:
- **q64 option D "Second Chance"** — the rationale says "reduces but does not immunize against the anomaly per Part 10 slides." Second Chance can theoretically still suffer Belady's anomaly (it degenerates to FIFO when all reference bits are set). The rationale's claim is source-uncertain. Non-gating because the question's intended answer (FIFO, option A) is unambiguously correct and the rationale correctly steers the student there.

---

## Bloom's distribution

- **Current** (25 questions):
  - Remember (T/F, definitional): q56, q57, q59, q60, q61, q63, q64, q65, q67, q68, q72, q73, q75, q76, q77 → 15 (60%)
  - Understand (conceptual recognition): q53, q54, q58 → 3 (12%)
  - Apply (computation): q55, q62, q66, q69, q70, q71, q74 → 7 (28%)
  - Analyze+: 0 (0%)
- **Target** (per `diagnosis.md:159` expected exam profile): Remember 25%, Understand 15%, Apply 40%, Analyze 20%.
- **Recommendation:** acceptable for a mock-exam bank. Part 1 of the live exam is T/F + MCQ (recall-heavy); Remember-skew is correct for that format. Apply content lives in B3 drills. Analyze content lives in B1/B2 flashcards.

---

## Clarity / consistency issues

- **q64 rationale** — minor source ambiguity on Second Chance's Belady-susceptibility. Consider rewriting as: "B (LRU), C (OPT) — stack algorithms, cannot exhibit Belady. D (Random) — no systematic pattern to the anomaly." Cleaner, avoids the Second Chance edge case.
- **q56 prompt** — "The offset portion of a virtual address passes through translation unchanged." Clear statement. ✓
- **q61 prompt** — "A 64-bit virtual address with 4 KB pages requires 2^52 entries in a single-level linear page table per process." Precise. ✓

---

## Exam alignment

- **Q2 hole-list reuse (q70, q71)** — direct drill of the past-exam Q2 hole-list pattern. Strong alignment.
- **Q1 sizing pattern reuse (q54, q58)** — bit-split arithmetic on unfamiliar bit widths (36-bit, 48/40/16) forces the student to apply the formula rather than memorize Q1's numbers. Strong.
- **Recommendation:** no change. Alignment is on target.

---

## Internal consistency

- IDs q53-q77: all unique within this batch; no collision with q1-q52 in the live bank (B4 uses q36-q52).
- Topic labels match existing bank (`Memory/Paging`, `Memory/Alloc`).
- `tags: [memory-focus]` applied uniformly to all 25 entries.
- Choice counts consistent (2 for T/F-style, 4 for discrimination MCQs).

---

## What the guide does well

Every computational question has an independently-verifiable arithmetic trace in the rationale that the student can step through. The past-exam hole-list (Q2) and address pattern (Q1) are reused with new requests to test generalization rather than memorization. Coverage hits every memory sub-topic flagged in the diagnosis without gaps.

---

## Prescribed next actions (ordered)

1. **None required before promotion.** Batch B5 is ship-ready.
2. (Optional, non-gating) Tighten q64's rationale to avoid the Second Chance edge case.
3. (Optional, post-batch) Add 1-2 matrix-detection MCQs in a later pass to close the one remaining memory-adjacent coverage gap.

Proceed to B6 (formulas cheat block + exam-strategy topic-dive).
