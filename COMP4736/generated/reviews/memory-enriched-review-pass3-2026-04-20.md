# Review: memory-enriched.yaml (B1 — Memory module enrichment, pass 3)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/slides/Part_10_memory.pdf` (pages 1-20 read; index cross-referenced against `generated/diagnosis.md`)
- `materials/past-exams/Final_exam_practice.pdf` (full)
- `materials/past-exams/Final_exam_practice_Sol.pdf` (pages 1-6 cover Q1-Q7)
- `COMP4736/CLAUDE.md`, `generated/diagnosis.md`
- Prior reviews: pass 1 and pass 2 under `generated/reviews/`

**Overall verdict:** Ship as-is.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | All past-exam memory Qs covered (Q1-Q4, Q6-Q8). 6-field PTE split complete. Next-fit Q2 sequence present. |
| Accuracy | 5 / 5 | Numeric answers verified against sol-PDF. Belady / LRU fault counts hand-verified. Buddy-1024 analyze card now internally consistent. |
| Excess (lower is worse) | 5 / 5 | No unsourced claims; training-data terms ("stack algorithm", "NX bit", "SIGSEGV", TLB %s) all removed in pass 2 and stay out. |
| Pedagogical quality | 4 / 5 | Bloom distribution 14/42/36/9 — Analyze still below 20% target, Remember below 25%. Not a defect sufficient to gate ship; elaborations are substantive and examples differ from prompt setup. |
| Clarity & structure | 5 / 5 | Buddy-1024 contradiction resolved. Next-fit example clean. "5th fit" prompt stands on its own. No remaining garbled examples. |
| Exam alignment | 5 / 5 | Analyze cards mirror past-exam Part 2 patterns (derivation, successive-request application, state-diagnosis, comparison). |
| Internal consistency | 5 / 5 | Source-tag format standardized to "Part 10, Slides X-Y" throughout. Prompt ↔ example alignment correct on every card. |

---

## Critical defects (fix before using this guide)

None. Pass 2 Critical defect 1 (buddy-1024 prompt/example contradiction) is resolved: the example now shows the **left 512 wholly free and the right 512 split with a busy leaf**, matching the prompt's free-list {512, 256, 128, 64, 32} and explaining the non-coalesce. Self-consistency verified.

---

## Missing content

None gating. See Pedagogical issues for non-gating Bloom-mix suggestions.

---

## Content to remove

None.

---

## Inaccuracies

None newly found in pass 3. Two low-severity items held over from pass 2 are acknowledged non-gating:

| Guide says | Source says | Source location | Severity |
|---|---|---|---|
| LRU-Belady explanation names the "inclusion property (k frames ⊆ k+1 frames at every step)". | Slides state LRU is immune to Belady without naming or proving the inclusion property. | `content/4736/topic-dives/page-replacement-algorithms.md`; `Part_10_memory.pdf`. | Low — mechanism correct; term is standard but not in slide text. Acceptable as elaborative encoding for an Analyze card. |
| Thrashing-remedies analyze card lists "increase page size" alongside "reduce multiprogramming". | Slides present page-size tradeoffs (57-58) but do not list "increase page size" explicitly as a thrashing remedy. | `Part_10_memory.pdf` Slides 57-58 + thrashing section. | Low — textbook-valid inference; not directly in materials. Acceptable. |

---

## Pedagogical issues

- **Bloom distribution still under target on Analyze (9% vs 20%) and Remember (14% vs 25%).** Acceptable for ship — the structural zero on Analyze is gone; the mix has shifted in the right direction without introducing Remember/Understand cards that would inflate bloat. Future rebalance, if needed, should happen in B6 (cheat-sheet / exam-strategy dive) where Remember-level recall prompts naturally belong.
- **Answer length** — a few Understand cards remain over 15 words. Tightening further would risk losing precision; held.
- **Card type** — entire batch uses `type: name`, no `cloze`. Intentional: preserves the module's existing visual rhythm, and the topic cards are already concise. `COMP4736/CLAUDE.md:30-32` prefers cloze but does not require it when prose-to-cloze conversion would bloat the prompt.

---

## Bloom's distribution

- **Current** (59 cards): Remember 14% · Understand 42% · Apply 36% · Analyze 8.5%.
- **Target** (`diagnosis.md:159`): Remember 25% · Understand 15% · Apply 40% · Analyze 20%.
- **Gap** vs target: Analyze −11.5 pts, Remember −11 pts, Understand +27 pts, Apply −4 pts.
- **Recommendation:** acceptable for this batch's ship. Address residual imbalance in B4 (mock exam MCQs will add Remember-weighted content) and B6 (cheat-sheet recall prompts).

---

## Clarity / consistency issues

- **Cosmetic:** inverted-page-table card uses parenthetical labelling in source tag (`"Part 10, Slides 83-88 (inverted page tables)"`) while others use plain slide ranges. One-line harmonization possible but not material.
- **Cosmetic:** "PTE" and "PT entry" still mixed. Not gating; consumer will understand either.

---

## Exam alignment

- Strong and unchanged from pass 2: Analyze cards directly mirror past-exam Part 2 patterns.
- **Observation** — no T/F-friendly stems, but that is by design; T/F conversion is the concern of B4 (mock exam), not this batch.

---

## Internal consistency

No contradictions remain. Numeric, conceptual, and structural claims align across the 59 cards and against the solution PDF.

---

## What the guide does well

Three-pass iteration converged cleanly: pass 1 found 10 substantive issues, pass 2 validated the fixes and caught one emergent contradiction, pass 3 confirms closure. Analyze-level cards genuinely test Analyze skills (derive, predict, diagnose, compare, remedy) rather than being relabeled Understand cards. Source discipline is now consistent: every card traces to a specific slide range and/or topic-dive.

---

## Prescribed next actions (ordered)

1. **None required before promotion.** Batch B1 is ship-ready.
2. (Optional, post-batch) Consider harmonizing the one parenthetical source-tag style on the inverted-PT card for visual uniformity.
3. (Optional, in B4/B6) Rebalance the course-wide Bloom mix — B4's mock exam and B6's cheat-sheet/strategy dive are natural homes for additional Remember-weight content.

Proceed to B2 (Deadlock flashcard enrichment). Carry forward the authoring rules validated here: slide-range source tags, Analyze cards embedded mid-topic, explanations that add causal mechanism rather than restate the answer, and each example distinct from the prompt setup.
