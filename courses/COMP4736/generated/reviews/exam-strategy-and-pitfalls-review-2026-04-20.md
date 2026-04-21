# Review: exam-strategy-and-pitfalls.md + cheat-sheet-additions.md (B6 — pass 1)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/past-exams/Final_exam_practice.pdf`, `Final_exam_practice_Sol.pdf`
- `materials/slides/Part_10_memory.pdf`, `Part_9_Deadlock.pdf`, `Part_6_7_IPC_1.pdf`, `Part_8_IPC_2.pdf`
- `generated/exam-study/research-deadlock.md`, `research-ipc1-semaphore.md`, `research-ipc2.md`
- `content/4736/topic-dives/*` (11 memory + deadlock + ipc dives)
- `content/SCHEMA.md` (topic-dive + cheat-sheet invariants)
- `COMP4736/CLAUDE.md`, `generated/diagnosis.md`

**Artifacts reviewed:**
- `exam-strategy-and-pitfalls.md` (new topic-dive, priority: high)
- `cheat-sheet-additions.md` (one new `##` block to append)

**Overall verdict:** Ship as-is.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | Strategy dive hits every pitfall category flagged in plan + `diagnosis.md`: time allocation, paging/translation traps, placement, buddy coalescing, RAG direction, column vs row sums, semaphore ordering, strict alternation, IPC signal catchability, unnamed-vs-named pipes. Cheat block has every formula called out on the plan's list. |
| Accuracy | 5 / 5 | Every numeric / structural claim verified against source materials. Past-exam Q2 first-fit=20 / best-fit=12 matches sol-PDF. Banker's / matrix invariants match topic-dive. Formulas match past-exam Q6 sol. |
| Excess (lower is worse) | 5 / 5 | Dive is tight — no filler, every bullet is actionable advice tied to a specific exam pattern. Cheat block is formulas-only, no prose bloat. |
| Pedagogical quality | 5 / 5 | Dive uses `**Pitfall**` and `**Takeaway**` callouts per `SCHEMA.md:257-264`. Every pitfall is phrased as "don't do X, do Y" — actionable, not descriptive. Cross-references to topic-dives enable spaced follow-up. |
| Clarity & structure | 5 / 5 | H2 section ordering matches conceptual prerequisite order (time allocation → per-topic pitfalls → exam-day checklist → cross-refs). No jargon introduced without prior context in other course dives. |
| Exam alignment | 5 / 5 | Every pitfall cites a past-exam pattern (Q2/Q3/Q4/Q8) or a professor emphasis (strict alternation, cond vars have no memory, SIGKILL uncatchable) flagged in `diagnosis.md:207`. |
| Internal consistency | 4 / 5 | One minor id-prefix inconsistency — see Clarity. |

---

## Critical defects (fix before merging to live guide)

None. One trivial polish item under Clarity (non-gating).

---

## Missing content

None. The dive closes the strategic-guidance gap the plan identified. The cheat block includes every formula from the plan's list plus the deadlock detection formula — richer than specified.

---

## Content to remove

None. Every bullet traces to exam-relevant behavior.

---

## Inaccuracies

None found. Independent verification of the non-trivial claims:

| Claim | Verified against | Status |
|---|---|---|
| Past-exam Q2 first-fit picks 20 for 12 MB request | `Final_exam_practice_Sol.pdf` p.1: "first fit ... 12 MB → 20" | ✓ |
| Past-exam Q2 best-fit picks 12 for 12 MB request | Same sol-PDF: "best fit ... 12 MB → 12" | ✓ |
| Past-exam Q3 VA 53448 → page fault | Sol-PDF p.3 "4) 53448 Page fault" | ✓ |
| Past-exam Q4 VA 0x61B4 → page fault (present=0) | Sol-PDF p.4 "Page fault" | ✓ |
| Past-exam Q8 buddy: after A releases 256, sibling 256 cannot coalesce because it holds B's subtree | Sol-PDF pp.10-11 + `content/4736/topic-dives/buddy-system-past-exam-q8.md:24-26` | ✓ |
| `A[j] = E[j] − Σᵢ C[i][j]` | `content/4736/topic-dives/matrix-detection-algorithm-c-r-e-a.md:18`: "Σ_i C[i][j] + A[j] = E[j]" | ✓ |
| `p* = √(2se); Overhead(p*) = √(2se) = p*` | Sol-PDF p.6: "p* = √(2se); Over head = √(2se) = p*" | ✓ |
| Banker's: `Need = Max − Has`, `Available = Total − Σ Has` | `content/4736/topic-dives/banker-s-algorithm-recovery-two-phase-locking.md:15, 24` | ✓ |
| "SIGKILL and SIGSTOP are absolute" | `research-ipc2.md` signals section (plus standard POSIX) | ✓ |
| "`P(mutex)` before `P(empty)` → deadlock in producer-consumer" | `research-ipc1-semaphore.md` + `content/4736/topic-dives/semaphores-p-v-producer-consumer.md` | ✓ |
| "Strict alternation violates requirement 3" | `diagnosis.md:207` highlights as "orange/red highlighted text" in slides | ✓ |

---

## Pedagogical issues

None gating. The dive is active-recall-friendly in its format (imperative "do/don't" rather than descriptive prose), which beats the re-reading failure mode. Tables (time allocation, cheat-block formulas) enable quick look-up during study. Cross-references close the loop to the deeper topic-dives.

---

## Bloom's distribution

Not applicable to strategy / reference artifacts — both the dive and the cheat block are meta-content, not testable items. The dive enables Apply/Analyze-level exam performance by closing failure modes students already know the underlying material for. Skip the Bloom scoring per `diagnosis.md` framing ("process pillar, not tech").

---

## Clarity / consistency issues

- **Topic-dive frontmatter `id`**: draft uses `id: exam-strategy-and-pitfalls`. Existing dives prefix with `4736-topic-` (e.g. `4736-topic-coffman-conditions-strategies`, `4736-topic-buddy-system-past-exam-q8`). For consistency with the existing corpus, change to `id: 4736-topic-exam-strategy-and-pitfalls`. Non-gating — the build will validate uniqueness either way, but adopting the house style makes it easier to find in a corpus-wide grep. Low priority.
- **Cheat-sheet block** — respects `SCHEMA.md:466-468` (single `##` heading, no H3/H4 inside). Bold labels like `**Bit splits.**` are inline emphasis, not H3s, and are allowed. ✓

---

## Exam alignment

- **Time-allocation table** calibrated to the per-question type weights from past-exam sol-PDF: single-VA translate is ~2 min (fast), full matrix detection is 6-8 min (slow, high-weight). Matches professor's stated grading pattern per `diagnosis.md:139`.
- **Exam-day checklist** matches the closed-book / calculator-allowed setup from `COMP4736/CLAUDE.md:10-11`.
- **Cross-references** at the bottom link each pitfall to the authoritative topic-dive — enables spaced-follow-up study on any failed pitfall. Strong.

---

## Internal consistency

- Dive frontmatter `priority: high` ensures it surfaces at the top of the dives list (per app's sort-by-priority).
- Formulas in the cheat block match exactly the formulas used in B1 flashcards, B3 drills, and B5 mock questions. No drift.
- Pitfalls cross-check against live B1/B2/B3/B4/B5 drafts: e.g. the "first-fit vs best-fit confusion" pitfall matches the lesson in B5 q70/q71; the "P(mutex) before P(empty)" pitfall matches B4 q45's deadlock scenario. Internally coherent across the full study guide.

---

## What the guide does well

Every pitfall is phrased imperatively ("don't do X; do Y") with a past-exam or slide-emphasis citation — students can self-check each one against their own habits. The cheat block is formulas-only, not prose — exactly what a night-before-exam review needs. Cross-references at the bottom enable traversal back to the deeper dives without cluttering the pitfall list itself.

---

## Prescribed next actions (ordered)

1. **None required before promotion.** B6 is ship-ready.
2. (Optional, trivial) Prefix the topic-dive id as `4736-topic-exam-strategy-and-pitfalls` to match existing dive naming convention.

Proceed to the holistic final review of the full staged bundle, then promotion.
