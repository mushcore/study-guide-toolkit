# Review: memory-enriched.yaml (B1 — Memory module enrichment, pass 2)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/slides/Part_10_memory.pdf` (pages 1-20 read in pass 1; index cross-referenced against `generated/diagnosis.md`)
- `materials/past-exams/Final_exam_practice.pdf` (full)
- `materials/past-exams/Final_exam_practice_Sol.pdf` (pages 1-6 cover Q1-Q7)
- `COMP4736/CLAUDE.md`, `generated/diagnosis.md`
- Pass 1 review: `generated/reviews/memory-enriched-review-2026-04-20.md`

**Overall verdict:** Ship after minor fixes.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | Caching-disabled PTE card added (6 atomic cards); next-fit Q2 sequence card added. All past-exam memory questions covered. |
| Accuracy | 4 / 5 | Numeric claims match sol-PDF; Belady/LRU counts verified. One self-contradiction between analyze-card prompt and its example (buddy 1024 KB card). |
| Excess (lower is worse) | 5 / 5 | Training-data claims removed. "Stack algorithm", "NX bit", "SIGSEGV", "99% TLB hit rate", "64-1024 TLB entries", "O(1) Clock" all stripped. |
| Pedagogical quality | 4 / 5 | Bloom distribution moved from 16/51/33/0 → 14/42/36/9. Still under target on Analyze (9% vs 20%) and Remember (14% vs 25%), but the structural zero on Analyze is fixed. |
| Clarity & structure | 4 / 5 | Next-fit example rewritten cleanly; "PA=VA coincidence" phrasing corrected; "5th fit" prompt reworked to stand alone. One inconsistency remains (see Critical defect 1). |
| Exam alignment | 5 / 5 | Analyze cards now test derivation (p*), prediction (LRU vs FIFO fault counts), diagnosis (buddy state), comparison (fit leftovers), remedy selection (thrashing). Matches diagnosis.md Apply/Analyze weighting. |
| Internal consistency | 4 / 5 | Source tags standardized to slide-range format throughout. One prompt/example mismatch on the buddy-1024 analyze card. |

---

## Critical defects (fix before merging to live guide)

1. **Self-contradiction in buddy-1024 analyze card** (file lines ~401-419). The prompt states the arena "has free entries of sizes 512, 256, 128, 64, 32" — implying a free 512 exists. The example, however, shows `[512(busy) | 256(free), 128(free), 64(free), 32(busy), 32(free)]` — which has zero free 512s. The prompt's setup (free 512 present, 1024 impossible) is a valid buddy pathology (the 512's buddy has a busy descendant), but the example illustrates a *different* pathology (no free 512 at all, upper half fully busy). Fix: either
   - **(A) Change the prompt** to "... has free entries of sizes 256, 128, 64, 32 (but no free 512)" — matches the example as written.
   - **(B) Rewrite the example** to `[512(free) | 256(free), 128(free), 64(free), 32(busy), 32(free)]` — matches the prompt; the busy 32 prevents the lower 512 from being wholly free, so the root 1024 still cannot form even though a free 512 exists.

   Option B is pedagogically stronger (demonstrates "buddy's subtree must be wholly free to coalesce" more clearly). Pick one.

---

## Missing content

- **No items now flagged as missing for this batch.** Pass 1's Caching-disabled card and next-fit Q2 sequence card both landed. Analyze-coverage target (20% per `diagnosis.md:159`) not yet met (9% currently) — see Pedagogical issues.

---

## Content to remove

- **None.** Training-data items flagged in pass 1 are all gone. No new bloat.

---

## Inaccuracies

| Guide says | Source says | Source location | Severity |
|---|---|---|---|
| Buddy-1024 analyze card: prompt implies a free 512 KB block, example implies none. | A buddy arena either has a free 512 or doesn't — the card says both. | This card's own prompt vs. example. | Medium — self-contradiction teaches a confused model of buddy state. Fix per Critical defect 1. |
| Analyze card "Why can LRU never exhibit Belady's anomaly?": explanation invokes "inclusion property (k frames ⊆ k+1 frames at every step)". | Slides state LRU is immune but do not name or prove the inclusion property. | `content/4736/topic-dives/page-replacement-algorithms.md` says "LRU + Optimal do not" without mechanism. | Low — the mechanism is correct but the term "inclusion property" is not in materials. Acceptable as elaborative encoding for an Analyze card; consider adding a parenthetical "this is the standard proof but not in the slides" if strictness matters. |
| Analyze card "Which two remedies…" lists "Increase page size" as a remedy for thrashing. | Slides present page-size tradeoffs (57-58) but do not explicitly list "increase page size" as a thrashing remedy. The primary remedy in materials is reducing degree of multiprogramming. | `Part_10_memory.pdf` Slides 57-58 (optimal page size); thrashing section. | Low — plausible and textbook-valid but not directly sourced as a thrashing remedy. Acceptable; if strict, retag as a "secondary" remedy and keep "reduce multiprogramming" as primary. |

---

## Pedagogical issues

- **Bloom distribution still below target on Analyze (9% vs 20%) and Remember (14% vs 25%).** Acceptable for ship — the structural problem (zero Analyze) is resolved. If another Analyze card lands later, prioritize a Remember-level card too so the ratio doesn't drift further off. Principle violated: **Bloom's progression (rule 6)** — partially.
- **Answer length on a few understand cards still >15 words** (e.g. "Virtual page vs page frame?", "TLB soft miss vs hard miss?"). Principle: **Optimize wording (rule 8)**. Low priority — shortening without losing precision is hard here. Keep unless reviewing again.
- **No cloze cards were added** for the enriched topics. `COMP4736/CLAUDE.md:30-32` prefers cloze when converting prose. All enriched cards use `type: name`. Not a defect because the existing topic used `name` consistently; changing card types mid-batch would break the module's visual rhythm. Acceptable.

---

## Bloom's distribution

- **Current** (59 cards in the enriched file):
  - Remember: 8 / 59 = 13.6%
  - Understand: 25 / 59 = 42.4%
  - Apply: 21 / 59 = 35.6%
  - Analyze+: 5 / 59 = 8.5%
- **Target** (per `diagnosis.md:159`): Remember 25% · Understand 15% · Apply 40% · Analyze 20%.
- **Pass 1 delta:** +5 Analyze cards (0% → 8.5%), Remember grew slightly, Understand dropped by a proportional share. Net improvement: large. Net result: Apply is very close to target (35.6% vs 40%), Analyze is closer but still low, Remember/Understand are inverted versus target.
- **Recommendation:** acceptable for ship; not a blocker. If B6 adds an exam-strategy topic-dive with inline recall prompts, those can carry Remember weight to rebalance. Do not hold this batch.

---

## Clarity / consistency issues

- **Line ~402-419 (buddy-1024 analyze card):** see Critical defect 1.
- **Line ~437-453 ("Which two remedies" analyze card):** the prompt says "drawn from Part 10 material". Fine, but the second remedy ("increase page size") is an inference from Slides 57-58 rather than a direct remedy stated in the thrashing slides. Either cite the reasoning chain or drop to a single-remedy prompt. Low severity.
- **Line ~366-367 (inverted page table):** source tag "Part 10, Slides 83-88 (inverted page tables)" uses parenthetical labelling inconsistent with other tags. Cosmetic — either apply parenthetical labelling everywhere or nowhere.
- **Line ~380 ("Both overhead terms at p*: se/p* = 2^23/2^12 = 2 KB"):** arithmetic is correct (2^11 = 2048 bytes = 2 KB). But the claim "Total = 4 KB = p*" — `Overhead = p*` at the optimum is correct only because the two terms sum to √(2se) = p*. Double-check: at optimum, PT cost = p*/2, waste = p*/2, total = p*. Here p* = 4 KB so total overhead = 4 KB. 2 + 2 = 4 KB ✓. Correct.

---

## Exam alignment

- **Strong.** Analyze cards now directly mirror past-exam Part 2 style:
  - Derive p*: mirrors Q6 (formula derivation required by sol-PDF to show both "direct calculation AND formula").
  - Fit-leftover comparison: mirrors Q2 (successive-request application).
  - Buddy state diagnosis: mirrors Q8 (tree analysis).
  - LRU vs FIFO prediction: matches instructor's repeated Belady emphasis (`diagnosis.md:207`).
- **Part 1 (T/F and MCQ) not this batch's scope**, but several Understand cards could be converted to T/F stems in B4 (e.g. "Dirty = 0 means the frame can be evicted without writeback — T or F?").

---

## Internal consistency

- **Source-tag format** standardized to "Part 10, Slides X-Y; topic-dive: Z.md" throughout. One parenthetical exception on the inverted-page-table card — harmonize if it bothers you.
- **"PTE" vs "PT entry"**: still mixed usage. Not fixed in pass 2. Low priority.
- **Buddy analyze card** is the one internal-consistency failure (see Critical defect 1).

---

## What the guide does well

Pass 1 defects closed with no regressions. Numeric answers across all 59 cards continue to match the solution PDF byte-for-byte. Analyze-level cards added in pass 2 are genuinely Analyze (derivation, prediction with numeric verification, diagnosis) — not Understand cards mislabeled. The split of the 6-field PTE list into atomic cards is now complete and pedagogically cleaner than the original list-recall card.

---

## Prescribed next actions (ordered)

1. **Fix the buddy-1024 analyze card contradiction** (Critical defect 1) — pick option B for pedagogical clarity.
2. (Optional, not gating) Add a parenthetical source-grounding note to the LRU-Belady explanation ("mechanism: inclusion property — not in slide text, standard proof") if strict source-grounding is enforced.
3. (Optional, not gating) Move "increase page size" to a secondary-remedy footnote on the thrashing-analyze card, or drop it.
4. (Optional, not gating) If another Bloom rebalance pass runs later, add 2-3 Remember-level atomic cards to lift Remember from 14% toward 25%.

Re-review expected verdict after fix 1: `Ship as-is`.
