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
| Coverage | 4 / 5 | Past-exam Qs (Q1-Q4, Q6-Q8) covered; missing Caching-disabled PTE field + next-fit sequence card. |
| Accuracy | 3 / 5 | Arithmetic verified against `Final_exam_practice_Sol.pdf` — match. Several claims unsourced (training-data leakage) — see Inaccuracies. |
| Excess (lower is worse) | 4 / 5 | Few unsourced asides (TLB hit-rate %, entry-count range, NX bit / SIGSEGV). Remove. |
| Pedagogical quality | 3 / 5 | 0 Analyze cards (target per `diagnosis.md` = 20%). Bloom skewed Understand (~51%). Imbalance hurts Part 2 (Apply/Analyze heavy). |
| Clarity & structure | 3 / 5 | Garbled next-fit example, misleading O(1) claim, ambiguous "PA = VA coincidence". Otherwise clear. |
| Exam alignment | 4 / 5 | Cards track past-exam Q1-Q8. Missing Analyze practice (overhead formula derivation, OPT vs LRU prediction). |
| Internal consistency | 3 / 5 | PTE split into 5 atomic cards; `tlb-mmu-details.md` lists 6. Caching-disabled dropped silently. Tags use "Part 10 slides" not slide-range format per `COMP4736/CLAUDE.md:42`. |

---

## Critical defects (fix before merging to live guide)

1. **PTE fields card split incomplete.** "5 fields of a PTE?" replaced with 5 atomic cards (Pr, PFN, Protection, Dirty, Referenced). Source (`content/4736/topic-dives/tlb-mmu-details.md` PTE diagram) lists **6**; **Caching-disabled (Ca)** missing. Fix: add 6th atomic card "Which PTE field signals MMU to skip CPU cache for this page?" → "Caching-disabled bit (Ca)". Source: Part 10 slides; topic-dive tlb-mmu-details.md.

2. **Garbled next-fit example** (card "Define **Next fit**", line 498-508). Example contradicts itself: "Scan from index 3 → 18 ≥ 9 ✓ → skip? first-fit says take. Next-fit from index 3: 18, 7, 9 → **9**". Correct: "next-fit from index 3 → 18 ≥ 9 ✓ → take 18". Fix: rewrite to clean trace. Use sol-PDF Q2 next-fit sequence (20, 18, 9 for 12/10/9) — exam pattern.

3. **Training-data leakage — remove or source.** Absent from `materials/`:
   - **Line 180:** "~99% hit rate" and "Typical size: 64–1024 entries" in TLB card. Not in Part 10 slides. Remove; hit-rate claim needs source or deletion.
   - **Line 183:** EAT example uses fabricated numbers (1 ns TLB, 100 ns RAM). OK as illustrative arithmetic but label it so, not "typical values".
   - **Line 121:** "SIGSEGV on Unix" and "NX bit" — absent from Part 10 slides. Fix: rephrase as "trap to the OS".
   - **Line 274-275:** "Stack algorithms (LRU, OPT) are monotone in frame count and cannot exhibit the anomaly." "Stack algorithm" is Tanenbaum terminology, not in slide excerpts. Fix: drop term; keep "LRU and OPT cannot exhibit Belady's anomaly".
   - **Line 302:** "O(1) LRU approximation" — slides describe Clock without "O(1)". Keep description, drop complexity notation unless in slides.

4. **Misleading O(1) claim** (card "Why must memory-list entries include a pointer...", line 452-453). Answer: "algorithms can traverse and mutate the list in O(1) local edits." Traversal is O(n). Fix: "...so **edits** (splicing and coalescing neighbors) are O(1) — traversal is still O(n)."

5. **Source-tag granularity** violates `COMP4736/CLAUDE.md:42` rule 7 requiring slide-specific tags ("Part 9, Slide 12"). Current tags: "Part 10 slides" only. `generated/diagnosis.md:55-64` supplies slide ranges. Fix to:
   - Paging core formulas / address translation: "Part 10, Slides 47-72"
   - Memory allocation + placement: "Part 10, Slides 19-36"
   - Buddy system: "Part 10, Slides 34-36"
   - Two-level + inverted PT: "Part 10, Slides 90-97" (inverted: 83-88)
   - Optimal page size formula: "Part 10, Slides 57-58"
   - TLB / MMU: "Part 10, Slides 73-81"
   - Base / limit / swapping / bitmaps: "Part 10, Slides 4-21"

---

## Missing content

- **Caching-disabled PTE bit** — `content/4736/topic-dives/tlb-mmu-details.md` PTE diagram labels it. Add 6th atomic card (see Critical defect #1).
- **Next-fit sequence Q2** — `Final_exam_practice_Sol.pdf` p.1: next-fit row = 20, 18, 9. Draft has first-fit, best-fit (12, 10, 9), worst-fit (20, 18, 15) but **no next-fit sequence card**. Add: "Past-exam Q2: next fit picks which holes for requests 12, 10, 9?" → "20, 18, 9".
- **Analyze-level cards (currently zero).** Target ~20% per `diagnosis.md:159`. Candidates from materials:
  - *Compare*: "Which placement algorithm leaves smallest total fragment after 3 allocations on given hole list?" (source: past-exam Q2).
  - *Derive*: "Derive p* = √(2se) from Overhead(p) = se/p + p/2." (source: `memory-overhead-optimal-page-size-q6.md`).
  - *Predict*: "Given reference string 1,2,3,4,1,2,5,1,2,3,4,5 with 3 vs 4 frames under FIFO — which produces more faults and by how many?" (source: `page-replacement-algorithms.md`).
  - *Diagnose*: "If buddy-system free list has every power of 2 up to 512 KB but can't satisfy 1024 KB, what does that tell you about arena state?" (source: `buddy-system-past-exam-q8.md`).
  - Add 4-6 such cards tagged `bloom: analyze`, each with explanation + example.

---

## Content to remove

- **"~99% hit rate"** in TLB card (line 180) — unsourced. `Part_10_memory.pdf` pages 1-20 + `diagnosis.md` cite no TLB hit-rate figure.
- **"Typical size: 64–1024 entries"** (line 180) — unsourced, same reason.
- **"NX bit" / "SIGSEGV on Unix"** (lines 121, 124) — Linux/x86 specifics absent from Part 10 slides. Replace with "protection trap".
- **"Stack algorithms"** (line 274) — replace with factual claim ("LRU and OPT cannot exhibit Belady's anomaly"); don't introduce term slides don't use.

---

## Inaccuracies

| Guide says | Source says | Source location | Severity |
|---|---|---|---|
| "TLB … ~99% hit rate. Typical size: 64–1024 entries." (line 180) | No TLB hit-rate or size figure in examined material. | `Part_10_memory.pdf` pages 1-20; `generated/diagnosis.md`; `content/4736/topic-dives/tlb-mmu-details.md` | Medium — student memorizes unsourced number. |
| Example "PA = (0x1A3 << 12) \| 0x4B0 = 0x1A34B0." (line 113) | Bit-shift + OR valid but slides use concatenation notation. Mathematically equivalent. | Part 10 slide bits diagrams. | Low — notation choice, not error. |
| "Scan from index 3 → 18 ≥ 9 ✓ → skip? first-fit says take. Next-fit from index 3: 18, 7, 9 → **9**" | Next-fit rover at index 3, request 9: takes hole at index 3 (18 MB), not index 6 (9 MB). | `content/4736/topic-dives/placement-algorithms-past-exam-q2.md`; sol-PDF Q2. | High — teaches wrong algorithm trace. |
| "traverse and mutate the list in O(1) local edits" (line 453) | Traversal O(n); only edit step O(1). | Part 10 slides describe list walk without complexity. | Medium — misleads MCQ on complexity. |
| "Coincidence that PA = VA here: when VP_k → frame_k..." (line 215) | Correct but implies equality holds for any VA — only holds within page offset range when VP_k → frame_k. | Sol-PDF Q3 VA 4100 worked example. | Low — technically correct, slightly confusing. |
| "PTE fields" split lists 5 fields | `tlb-mmu-details.md` PTE diagram lists 6 (Pr, Ca, Mo, Re, Protection, PFN) | `content/4736/topic-dives/tlb-mmu-details.md` lines 24-37 | Medium — exam-testable field missing. |

---

## Pedagogical issues

- **Bloom imbalance** — violates *Bloom's progression (rule 6, CLAUDE.md)*. Draft: ~16/51/33/0 (Remember/Understand/Apply/Analyze) vs. target 25/15/40/20. Fix: add 4-6 Analyze cards; convert 2-3 Understand cards to Apply by replacing "what is X" with "given state, compute/decide X".
- **Answer length** — `COMP4736/CLAUDE.md:43`: trim every word; shorter = faster review. Several answers exceed 15 words (e.g. "Virtual page vs page frame?" ~27 words). Tighten.
- **No dual-coding diagrams** — Part 10 slides 47-72 rely on page-table diagrams. No card embeds one. Acceptable; cards could reference diagram in `example` field via 2-3 line ASCII schematic. Low severity.
- **Redundant explanation vs answer** — several `explanation` fields paraphrase `answer` instead of adding mechanism/why. Examples: "Formula for offset bits?", "Define First fit". Rewrite to add causal/mechanistic depth.

---

## Bloom's distribution

- **Current** (from `bloom:` tags):
  - Remember: 7 / 45 = 16%
  - Understand: 23 / 45 = 51%
  - Apply: 15 / 45 = 33%
  - Analyze+: 0 / 45 = 0%
- **Target** (per `generated/diagnosis.md:159`):
  - Remember 25% · Understand 15% · Apply 40% · Analyze 20%
- **Recommendation:** add 4-6 Analyze cards (candidates above); re-tag 3-4 Understand as Apply where computation already required; keep Remember as-is.

---

## Clarity / consistency issues

- **Line 214-216** ("Coincidence that PA = VA here…") — sounds like general identity; clarify to "within this page's offset range".
- **Line 500-506** ("Define **Next fit**" example) — contradictory trace; rewrite.
- **Line 547** ("Start {10,4,20,18,7,9,12,15}: pick 20 (→ 8). Then max = 18…") — dense parentheticals; use two-line table.
- **Line 631** "Name the 5th fit algorithm variant in the slides?" — meta question depends on implicit ordering. Reword: "What fit-algorithm variant uses separate free-lists per common request size?"
- **Inconsistent reference style:** some use "past-exam Q2", others "Part 10 slides; past-exam Q2". Standardize to richer form.

---

## Exam alignment

- Strong alignment to past-exam Q1 (48-bit VA), Q3 (4K page-table translate), Q4 (MMU present bits), Q6 (overhead formula), Q7 (two-level 6-bit), Q8 (buddy 1024/200/50/90). Numeric answers verified against `Final_exam_practice_Sol.pdf`.
- **Missing Part 2 patterns:** past exam requires *showing work* ("direct calculation AND formula" per `diagnosis.md:139`). No card asks student to produce both computation + formula derivation for same VA. Add one Apply card — matches professor's grading.
- **Part 1 T/F / MCQ readiness** — B4 responsibility, but no enriched card trivially converts to T/F stem. Minor.

---

## Internal consistency

- **Source-tag format** inconsistent ("Past-exam Q3" vs "Part 10 slides; past-exam Q3"). Standardize to richer form.
- **"PTE" vs "PT entry"** interchangeable. Pick PTE (common, concise), apply throughout.
- **"VP"** vs "virtual page" mixed. OK across cards; enforce within single card.

---

## What the guide does well

Numeric accuracy tight: every computed PA matches sol key. PTE atomic-card split is genuine pedagogical improvement per CLAUDE.md rules. Examples concrete, not copies of prompt setup.

---

## Prescribed next actions (ordered)

1. **Fix garbled next-fit example** (line 500-506) — high severity, wrong algorithm trace shown to student.
2. **Add Caching-disabled PTE atomic card** to complete 6-field split.
3. **Remove unsourced numbers + Unix-specific terms**: "99% TLB hit rate", "64–1024 entries", "NX bit", "SIGSEGV", "stack algorithms".
4. **Fix O(1) claim** on memory-list-pointer card.
5. **Add 4-6 Analyze-tagged cards** to close Bloom gap (candidates under Missing content).
6. **Tighten source tags** to slide-range format per `diagnosis.md`.
7. **Rewrite "Next fit" card question** to stand alone without "5th" ordering reference.
8. **Add Q2 next-fit sequence card** for parity with first/best/worst.
9. **Trim answers >15 words** without losing precision (targets: "Virtual page vs page frame?", "Present/absent bit = 0 means what?", "Clock algorithm").
10. **Rewrite 3-4 Understand explanations** that restate answer — add causal/mechanistic depth.

After fixes, re-review. Expect verdict: `Ship as-is`.