# Review: memory-enriched.yaml (B1 — Memory module enrichment, pass 1)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/slides/Part_10_memory.pdf` (pages 1-20 read + index cross-referenced against `generated/diagnosis.md`)
- `materials/past-exams/Final_exam_practice.pdf` (full)
- `materials/past-exams/Final_exam_practice_Sol.pdf` (pages 1-6 read; covers Q1-Q7)
- `COMP4736/CLAUDE.md` (exam format + authoring rules)
- `generated/diagnosis.md` (topic weights, Bloom distribution targets, slide ranges)

**Overall verdict:** Ship after minor fixes.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 4 / 5 | All past-exam Qs (Q1, Q2, Q3, Q4, Q6, Q7, Q8) covered in cards; missing one PTE field (Caching-disabled) and a next-fit sequence card to match parity with other fits. |
| Accuracy | 3 / 5 | Arithmetic and translations verified against `Final_exam_practice_Sol.pdf` and match. Several claims lack source in `materials/` (training-data leakage) — see Inaccuracies table. |
| Excess (lower is worse) | 4 / 5 | A few asides (TLB hit-rate %, TLB entry-count range, NX bit / SIGSEGV terminology) add no exam value and are unsourced. Remove. |
| Pedagogical quality | 3 / 5 | Zero Analyze-level cards (target per `diagnosis.md` = 20%). Bloom mix is heavily skewed toward Understand (~51%). Elaborations are generally substantive, but the imbalance costs points on Part 2 which is Apply/Analyze heavy. |
| Clarity & structure | 3 / 5 | One garbled example (next-fit card), one misleading O(1) claim, one ambiguous "PA = VA coincidence" framing. Otherwise clear. |
| Exam alignment | 4 / 5 | Cards tightly track past-exam Q1-Q8 numbers. Missing Analyze-level practice (e.g. deriving overhead formula, predicting OPT vs LRU behavior). |
| Internal consistency | 3 / 5 | PTE fields split into 5 atomic cards while `tlb-mmu-details.md` enumerates 6. Caching-disabled bit dropped with no note. Source tags use generic "Part 10 slides" instead of the slide-range specificity required by `COMP4736/CLAUDE.md:42` ("Part 9, Slide 12" format). |

---

## Critical defects (fix before merging to live guide)

1. **PTE fields card split is incomplete.** The "5 fields of a PTE?" original card was replaced with 5 atomic cards (Pr, PFN, Protection, Dirty, Referenced). The source (`content/4736/topic-dives/tlb-mmu-details.md` PTE diagram) lists **6** fields; **Caching-disabled (Ca)** is missing. Fix: add a 6th atomic card "Which PTE field signals the MMU to skip the CPU cache for this page?" → answer "Caching-disabled bit (Ca)". Source: Part 10 slides; topic-dive tlb-mmu-details.md.

2. **Garbled next-fit example** (card "Define **Next fit**", file line 498-508). Example text contradicts itself: "Scan from index 3 → 18 ≥ 9 ✓ → skip? first-fit says take. Next-fit from index 3: 18, 7, 9 → **9**". The correct behavior is "next-fit from index 3 → 18 ≥ 9 ✓ → take 18". Fix: rewrite the example to a clean trace. Suggest using the sol-PDF Q2 next-fit sequence (20, 18, 9 for 12/10/9) since that's the exam pattern.

3. **Training-data leakage — remove or source.** These claims appear nowhere in `materials/`:
   - **Line 180:** "~99% hit rate" and "Typical size: 64–1024 entries" in the TLB card explanation. Not in Part 10 slides. Remove the numbers; the hit-rate claim requires a source or deletion.
   - **Line 183:** EAT example uses fabricated numbers (1 ns TLB, 100 ns RAM). Acceptable as illustrative arithmetic but label it as such, not as "typical values".
   - **Line 121:** "SIGSEGV on Unix" and "NX bit" — neither term appears in Part 10 slides. Fix: rephrase as "trap to the OS" without Unix-specific jargon.
   - **Line 274-275:** "Stack algorithms (LRU, OPT) are monotone in frame count and cannot exhibit the anomaly." The term "stack algorithm" is textbook (Tanenbaum) terminology not in the slide excerpts. Fix: drop the term; keep the claim "LRU and OPT cannot exhibit Belady's anomaly" which diagnosis confirms.
   - **Line 302:** "O(1) LRU approximation" — slides describe Clock but do not use "O(1)". Keep the description, drop the complexity notation unless found in slides.

4. **Misleading O(1) claim** (card "Why must memory-list entries include a pointer...", line 452-453). Answer: "algorithms can traverse and mutate the list in O(1) local edits." Traversal is O(n). Fix: "...so **edits** (splicing and coalescing neighbors) are O(1) — traversal is still O(n)."

5. **Source-tag granularity** violates `COMP4736/CLAUDE.md:42` rule 7 requiring slide-specific tags (format "Part 9, Slide 12"). Current tags use "Part 10 slides" alone. `generated/diagnosis.md:55-64` supplies slide ranges per topic. Fix: tighten to the ranges below wherever applicable:
   - Paging core formulas / address translation: "Part 10, Slides 47-72"
   - Memory allocation + placement: "Part 10, Slides 19-36"
   - Buddy system: "Part 10, Slides 34-36"
   - Two-level + inverted PT: "Part 10, Slides 90-97" (inverted: 83-88)
   - Optimal page size formula: "Part 10, Slides 57-58"
   - TLB / MMU: "Part 10, Slides 73-81"
   - Base / limit / swapping / bitmaps: "Part 10, Slides 4-21"

---

## Missing content

- **Caching-disabled PTE bit** — evidence: `content/4736/topic-dives/tlb-mmu-details.md` PTE diagram explicitly labels it. Add a 6th atomic card (see Critical defect #1).
- **Next-fit sequence on Q2** — evidence: `Final_exam_practice_Sol.pdf` p.1 shows next-fit row filled in (20, 18, 9). Current draft has sequence cards for first-fit (implicit via "picks 20"), best-fit (12, 10, 9), worst-fit (20, 18, 15) but **no next-fit sequence card**. Add: "Past-exam Q2: next fit picks which holes for requests 12, 10, 9?" answer "20, 18, 9".
- **Analyze-level cards (currently zero).** Target ~20% per `diagnosis.md:159`. Candidates sourced from materials:
  - *Compare*: "Which placement algorithm leaves the smallest total fragment after 3 successive allocations on a given hole list?" (source: past-exam Q2).
  - *Derive*: "Derive p* = √(2se) starting from Overhead(p) = se/p + p/2." (source: topic-dive `memory-overhead-optimal-page-size-q6.md`).
  - *Predict*: "Given a reference string 1,2,3,4,1,2,5,1,2,3,4,5 with 3 vs 4 frames under FIFO — which produces more faults and by how many?" (source: Belady illustration referenced in topic-dive `page-replacement-algorithms.md`).
  - *Diagnose*: "If a buddy-system free list has an entry of every power of 2 up to 512 KB but cannot satisfy a 1024 KB request, what does that tell you about the arena state?" (source: buddy invariants, topic-dive `buddy-system-past-exam-q8.md`).
  - Add 4-6 such cards, tagged `bloom: analyze`, each with explanation + example.

---

## Content to remove

- **"~99% hit rate" claim** in TLB card (line 180) — unsourced. Source check: `Part_10_memory.pdf` pages 1-20 read contain no quantified TLB hit-rate figure; diagnosis.md does not cite one either.
- **"Typical size: 64–1024 entries"** (line 180) — unsourced, same reason.
- **"NX bit" / "SIGSEGV on Unix"** terminology (lines 121, 124) — these are Linux/x86 specifics not in Part 10 slides. Replace with generic "protection trap".
- **"Stack algorithms"** terminology (line 274) — replace with the factual claim ("LRU and OPT cannot exhibit Belady's anomaly") without introducing a new term that the slides do not use.

---

## Inaccuracies

| Guide says | Source says | Source location | Severity |
|---|---|---|---|
| "TLB … ~99% hit rate. Typical size: 64–1024 entries." (line 180) | No TLB hit-rate or size figure in examined material. | `Part_10_memory.pdf` pages 1-20; `generated/diagnosis.md`; `content/4736/topic-dives/tlb-mmu-details.md` | Medium — misleads student to memorize an unsourced number. |
| Example "PA = (0x1A3 << 12) \| 0x4B0 = 0x1A34B0." (line 113) | Bit-shift + OR is one valid expression but slides use concatenation notation. Mathematically equivalent. | Part 10 slide bits diagrams. | Low — notation choice, not error. |
| "Scan from index 3 → 18 ≥ 9 ✓ → skip? first-fit says take. Next-fit from index 3: 18, 7, 9 → **9**" (next-fit define example) | Next-fit with rover at index 3 and request 9 takes the hole at index 3 (18 MB), not index 6 (9 MB). | `content/4736/topic-dives/placement-algorithms-past-exam-q2.md` and sol-PDF Q2 next-fit row. | High — teaches incorrect algorithm trace. |
| "traverse and mutate the list in O(1) local edits" (line 453) | Traversal is O(n) in a linked list; only the edit step is O(1). | Standard data-structure fact; Part 10 slides describe list walk without complexity. | Medium — misleading to a student who will be MCQ'd on complexity. |
| "Coincidence that PA = VA here: when VP_k → frame_k the physical address equals the virtual address." (line 215) | Correct but phrased as if the whole equality holds for any VA, when in fact it holds only within that page's offset range AND when VP_k → frame_k. | Sol-PDF Q3 VA 4100 worked example. | Low — technically correct, slightly confusing. |
| "PTE fields" (split cards) list 5 fields | `tlb-mmu-details.md` PTE diagram lists 6 (Pr, Ca, Mo, Re, Protection, PFN) | `content/4736/topic-dives/tlb-mmu-details.md` lines 24-37 | Medium — one exam-testable field missing from the set of atomic cards. |

---

## Pedagogical issues

- **Bloom distribution imbalance** — violates principle: *Bloom's progression (rule 6, CLAUDE.md)*. Draft has ~16/51/33/0 (Remember/Understand/Apply/Analyze) vs. diagnosis target 25/15/40/20. Fix: add 4-6 Analyze cards (see Missing content) and convert 2-3 Understand cards into Apply cards by replacing "what is X" prompts with "given this state, compute / decide X".
- **Answer length** — `COMP4736/CLAUDE.md:43` requires "trim every unnecessary word; shorter = faster review". Several answers exceed 15 words (e.g. "Virtual page vs page frame?" answer: ~27 words). Tighten where possible.
- **No dual-coding diagrams** — Part 10 slides 47-72 rely heavily on page-table *diagrams*. No flashcard embeds a diagram. Acceptable for flashcards (diagram problems live in `code-practice/`), but cards could reference the diagram in the `example` field via a brief ASCII schematic in 2-3 lines. Low-severity addition.
- **Redundant explanation vs answer** — several cards' `explanation` paraphrases the `answer` instead of adding mechanism / why. Examples: "Formula for offset bits?", "Define First fit" — explanation re-states what the answer said. Rewrite these so explanation adds causal or mechanistic depth the answer doesn't.

---

## Bloom's distribution

- **Current** (counted from `bloom:` tags in draft):
  - Remember: 7 / 45 = 16%
  - Understand: 23 / 45 = 51%
  - Apply: 15 / 45 = 33%
  - Analyze+: 0 / 45 = 0%
- **Target** (per `generated/diagnosis.md:159` expected final-exam profile):
  - Remember 25% · Understand 15% · Apply 40% · Analyze 20%
- **Recommendation:** add 4-6 Analyze cards (candidates listed above); re-tag 3-4 current Understand cards as Apply where they already require a computation; keep Remember roughly as-is.

---

## Clarity / consistency issues

- **Line 214-216** ("Coincidence that PA = VA here…") — sounds like a general identity; clarify to "within this page's offset range".
- **Line 500-506** ("Define **Next fit**" example) — contradictory trace; rewrite.
- **Line 547** ("Start {10,4,20,18,7,9,12,15}: pick 20 (→ 8). Then max = 18…") — parentheticals are dense; consider a two-line table.
- **Line 631 "Name the 5th fit algorithm variant in the slides?"** — question is meta ("5th") and depends on an implicit ordering. Reword to "What fit-algorithm variant uses separate free-lists per common request size?" so it stands on its own without reference to a slide order.
- **Inconsistent reference style:** some sources use "past-exam Q2", others "Part 10 slides; past-exam Q2". Pick one format (the second is richer) and apply throughout.

---

## Exam alignment

- Strong alignment to past-exam Q1 (48-bit VA), Q3 (4K page-table translate), Q4 (MMU present bits), Q6 (overhead formula), Q7 (two-level 6-bit), Q8 (buddy 1024/200/50/90). Numeric answers verified against `Final_exam_practice_Sol.pdf`.
- **Missing Part 2 practice patterns:** past exam requires *showing work* ("direct calculation AND formula" per `diagnosis.md:139`). Draft cards give the answer; no card asks student to produce both a direct computation and a formula derivation for the same VA. Consider one Apply card that explicitly asks for both methods — matches professor's grading pattern.
- **Part 1 T/F / MCQ readiness** — not this batch's responsibility (handled in B4), but note that none of the current enriched cards are written in a form that trivially converts to a T/F stem. Minor.

---

## Internal consistency

- **Source-tag format** inconsistent (some cards say "Past-exam Q3", others "Part 10 slides; past-exam Q3"). Standardize to the richer form.
- **"PTE" vs "PT entry"** terminology used interchangeably. Pick one (PTE is more common and concise) and apply across all cards.
- **"VP"** abbreviated in some places, written out as "virtual page" in others. OK for card prompts; enforce consistency within a single card.

---

## What the guide does well

Numeric accuracy against the solution PDF is tight: every computed physical address in the draft matches the sol key. The split of the original list-recall "5 fields of a PTE?" card into atomic cards is a genuine pedagogical improvement and follows CLAUDE.md rules. Examples are concrete and fresh rather than copies of the prompt setup.

---

## Prescribed next actions (ordered)

1. **Fix the garbled next-fit example** (line 500-506) — high severity, changes the algorithm behavior shown to student.
2. **Add the Caching-disabled PTE atomic card** to complete the 6-field split.
3. **Remove unsourced numbers and Unix-specific terminology**: "99% TLB hit rate", "64–1024 entries", "NX bit", "SIGSEGV", "stack algorithms".
4. **Fix the O(1) complexity claim** on the memory-list-pointer card.
5. **Add 4-6 Analyze-tagged cards** to close the Bloom gap (candidates listed under Missing content).
6. **Tighten source tags** to slide-range format per `diagnosis.md`.
7. **Rewrite the "Next fit" card's question** to stand on its own without a "5th" ordering reference.
8. **Add the Q2 next-fit sequence card** for parity with first/best/worst sequences.
9. **Trim answers >15 words** where possible without losing precision (target: "Virtual page vs page frame?", "Present/absent bit = 0 means what?", "Clock algorithm" cards).
10. **Rewrite 3-4 Understand explanations** that currently restate the answer — replace with causal / mechanistic content.

After these fixes, re-review. Expect verdict to rise to `Ship as-is`.
