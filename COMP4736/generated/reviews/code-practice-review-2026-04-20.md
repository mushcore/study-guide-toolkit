# Review: code-practice/ (B3 — diagram-based drills 08-11, pass 1)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/past-exams/Final_exam_practice.pdf` (Q1, Q3, Q4, Q7 prompts)
- `materials/past-exams/Final_exam_practice_Sol.pdf` (pages 1-11, full solutions for Q1-Q8)
- `materials/slides/Part_10_memory.pdf`
- `content/4736/topic-dives/paging-core-formulas.md`, `address-translation-worked-examples.md`, `two-level-page-tables.md`
- `content/SCHEMA.md` (code-practice format validator)
- `COMP4736/CLAUDE.md`, `generated/diagnosis.md`

**Files reviewed:**
- `08-paging-sizing-48bit-va.md` (Q1)
- `09-single-level-pt-translate.md` (Q3)
- `10-mmu-present-bit-translate.md` (Q4)
- `11-two-level-pt-translate.md` (Q7)

**Overall verdict:** Ship after minor fixes.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | All four diagram-based past-exam memory questions (Q1, Q3, Q4, Q7) mapped 1:1 to drills. Q2, Q5, Q6, Q8 already covered by existing drills 02-07. |
| Accuracy | 5 / 5 | Every numeric answer (8212, 4100, 24684, page-fault, 29109, 9, PF, 18) verified against `Final_exam_practice_Sol.pdf` pages 1-9. SVG page tables match exam figures entry-by-entry. |
| Excess (lower is worse) | 5 / 5 | No off-syllabus content. Each drill is a direct clone of one past-exam Q plus a clean Why. |
| Pedagogical quality | 5 / 5 | All four drills are Apply-level (matches 75% Apply weighting per `diagnosis.md`). Each Why section includes both "direct calculation" and "formula method" per professor's stated grading pattern. Dual coding (SVG + text) on every drill. |
| Clarity & structure | 4 / 5 | Two minor notation issues — see Clarity section. |
| Exam alignment | 5 / 5 | Prompts track past-exam phrasing; Why sections cite specific sol-PDF pages; solutions include both calculation paths the professor weights equally. |
| Internal consistency | 5 / 5 | All four files conform to `SCHEMA.md` code-practice invariants (four H2 sections Prompt/Starter/Solution/Why in order; exactly one fenced block in Starter and Solution; fence language `text` matches frontmatter `lang`). |

---

## Critical defects (fix before merging to live guide)

None. Two minor polish items under Clarity are non-gating; they don't cost exam points but improve student experience.

---

## Missing content

None. Four drills cleanly cover the four missing diagram-based past-exam questions.

---

## Content to remove

None.

---

## Inaccuracies

No factual inaccuracies found. Every numeric claim verified:

| Drill | Claim | Source verification | Status |
|---|---|---|---|
| 08 | 8 KB = 2^13 → offset 13 bits | Sol-PDF p.1 "8Kb = 2^13 B" | ✓ |
| 08 | Pages = 2^35, frames = 2^19, PT entries = 2^35, PT size = 256 GiB | Sol-PDF p.1 + arithmetic 2^35 × 8 B = 2^38 B = 256 GiB | ✓ |
| 09 | Page size + frame size = 4 KB | Sol-PDF p.2 "e.g. 64k-60k = 4K" for page, "32k-28k = 4k" for frame | ✓ |
| 09 | VA 20 → 8212; VA 4100 → 4100; VA 8300 → 24684; VA 53448 → page fault | Sol-PDF pp.2-3 (both direct calc and formula methods) | ✓ |
| 10 | VA 0x61B4 → VP=6, present=0, **page fault** | Sol-PDF p.4 "0110 000110110100 → 110₂ = 6₁₀ Page fault" | ✓ |
| 10 | VA 0xB1B5 → VP=11, frame=111₂=7, PA = 29109 | Sol-PDF p.4 "1011 000110110101 → 1011₂ = 11₁₀ physical address 111 000110110101₂ = 29109₁₀" | ✓ |
| 10 | Virtual address is 16 bits (16 pages × 4 KB = 64 KB = 2^16) | Sol-PDF p.4 "Total virtual addresses = 16 × 4 × 1024 = 2^16 (Virtual address: 16 bits)" | ✓ |
| 11 | VA space = 64 B, physical memory = 32 B, page/frame size = 4 B | Sol-PDF p.9 "64 and 32 bytes … 4 bytes" | ✓ |
| 11 | VA 37 → top=2, 2nd=1, offset=1, frame=2, PA=9 | Sol-PDF p.7 "Memory address = 8 + 1 = 9" | ✓ |
| 11 | VA 25 → top=1, 2nd=2 → page fault | Sol-PDF p.8 "X : Page fault" | ✓ |
| 11 | VA 62 → top=3, 2nd=3, offset=2, frame=4, PA=18 | Sol-PDF p.9 "Memory address = 16 + 2 = 18" | ✓ |

Every second-level page-table entry in drill 11's SVG (PT₀-PT₃) also verified cell-by-cell against sol-PDF pages 7-9.

---

## Pedagogical issues

None material. Dual coding (SVG + text) is strong. Every drill includes both direct-calc and formula-method derivations in Why, matching professor's grading pattern noted in `diagnosis.md:139`.

One minor observation:
- **Drill 10 SVG row 3 shows `frame=000, present=1`.** This is accurate to the exam figure but visually reads as "frame absent + present" since "000" and "absent" look similar at a glance. A student could misread the row as a page fault. Non-gating: the exam figure itself shows this, so reproducing it faithfully is correct. Consider a one-line note in the Why section clarifying that frame 0 is a valid mapping (present=1, frame=0) so VP=3 would translate cleanly — not a fault.

---

## Bloom's distribution

- **Current** (4 drills): 100% Apply.
- **Target:** code-practice drills ARE the Apply/Analyze bank by design; `diagnosis.md` expects Part 2 (written) to be Apply/Analyze-heavy. Flashcard bank carries the Remember/Understand weight.
- **Recommendation:** no change. Drill bank Bloom mix is correct.

---

## Clarity / consistency issues

- **Drill 11, Why section**: "Frame 4 covers physical bytes 16-19" uses inclusive upper-bound notation. The SVG in the same file uses "16 - 20" exclusive-upper-bound notation throughout the physical-memory column. Pick one — suggestion: match SVG (`16-20` exclusive) in Why since the SVG is the primary visual reference. Same issue for any other frame range mentioned in prose.

- **Drill 10, Why section**: the sentence "For 0xB1B5: ... the result is `111 0001 1011 0101₂`. Because physical addresses in this system are 15 bits wide (3 frame bits + 12 offset bits), the physical address = `0x71B5 = 29109`." The `0x71B5` is the 16-bit hex rendering with a leading 0 bit; the 15-bit PA rendering would be `0x71B5` too (since the high bit is 0). Arithmetically identical but potentially confusing. Either write the PA as decimal only (`29109`) or explicitly note "treating the 15-bit PA as a zero-extended 16-bit hex value".

Both items are one-line fixes, no re-authoring.

---

## Exam alignment

- **Past-exam parity:** every drill mirrors the exam's exact question wording and diagram structure. The SVGs reproduce entry-by-entry the page tables shown in `Final_exam_practice.pdf`.
- **Worked-solution format:** Why sections show both the direct calculation (`frame × page_size + offset`) and the formula method (`Y = x + (a − A)`) where applicable — matches the professor's stated expectation per `diagnosis.md:139`.
- **Recommendation:** consider adding a one-line "Common mistake" callout to each Why section (off-by-one in bit splits, forgetting to check present bit, reading rows top-to-bottom vs bottom-to-top on the page table). Low priority; current content is already exam-aligned.

---

## Internal consistency

- All four files pass `SCHEMA.md:315-370` code-practice invariants (H2 order, single-fence Starter/Solution, `lang: text` matches fence language).
- SVG styling is consistent across drills (same dark-theme palette, same monospace font, same cell-height conventions). This will render uniformly in the UI.
- Frontmatter tags are consistent: all four carry `[paging, memory]`; 10 adds `mmu`; 11 adds `multilevel`. Reasonable specialization.

---

## What the guide does well

Every numeric answer matches the solution PDF to the digit, including the hex bit-extractions on Q4 that are easy to get wrong by a single bit. SVG page-tables reproduce the exam figures cell-by-cell rather than simplifying, so a student practicing on these drills sees the exact visual they'll see on the exam. Each Why section includes both the direct-calculation path and the formula path, matching the professor's grading pattern.

---

## Prescribed next actions (ordered)

1. **Drill 11 Why section:** harmonize range notation with the SVG. Change `16-19` / `8-11` inclusive ranges to `16-20` / `8-12` exclusive, matching the SVG's physical-memory column labels.
2. **Drill 10 Why section:** either drop the `= 0x71B5` hex alias (keep `= 29109`) or add a one-line note that 0x71B5 is the 16-bit zero-extended form of the 15-bit PA.
3. (Optional, non-gating) Drill 10 Why section: add a one-line clarifier that row 3's `frame=000` with `present=1` maps to frame 0 (a valid mapping, not a fault).

After actions 1-2, re-review. Expect verdict `Ship as-is`.
