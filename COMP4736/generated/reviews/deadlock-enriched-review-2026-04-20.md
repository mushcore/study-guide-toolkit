# Review: deadlock-enriched.yaml (B2 — Deadlock module enrichment, pass 1)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/slides/Part_9_Deadlock.pdf` (slide ranges per `generated/diagnosis.md` topic inventory)
- `materials/past-exams/Final_exam_practice.pdf` Q5 (RAG → C, R, E)
- `materials/past-exams/Final_exam_practice_Sol.pdf` Q5 solution
- `generated/exam-study/research-deadlock.md` (slide-derived notes, §1-§12)
- `content/4736/topic-dives/coffman-conditions-strategies.md`
- `content/4736/topic-dives/matrix-detection-algorithm-c-r-e-a.md`
- `content/4736/topic-dives/banker-s-algorithm-recovery-two-phase-locking.md`
- `COMP4736/CLAUDE.md`, `generated/diagnosis.md`

**Overall verdict:** Ship after minor fixes.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | 4 list-recall cards split atomically (Coffman → 4 + cloze; deadlock/starvation/livelock → 3; recovery methods → 3; 2PL phases → 2). All past-exam Q5 matrix elements covered. |
| Accuracy | 3 / 5 | Two factual defects in Analyze cards: Q5-matrix example's "P3 satisfiable" arithmetic is wrong; Banker's A/B/C card has a mid-sentence self-correction artifact. Numeric claims on other cards verified against sol-PDF and research-deadlock.md. |
| Excess (lower is worse) | 5 / 5 | No training-data leakage. 2PL retry claim traces to `banker-s-algorithm-recovery-two-phase-locking.md` (topic-dive), not slides — source tag needs correction but content is grounded. |
| Pedagogical quality | 3 / 5 | Bloom mix 33 / 39 / 14 / 14 vs. target 25 / 15 / 40 / 20. **Apply at 14% is 26 pts below target** — B2 has too few computational drills given the exam's heavy Apply weighting on matrix arithmetic and Banker's traces. |
| Clarity & structure | 4 / 5 | Most cards clean. Banker's A/B/C analyze card contains a "wait, Available can't go negative" self-correction in the middle of the answer — reads like a scratchpad, not a finished answer. |
| Exam alignment | 4 / 5 | Q5 directly drilled. Banker's covered. Coffman structural diagnosis card matches instructor's emphasis. Missing: Banker's multi-resource trace drills and matrix-detection drills on a fresh system (not just Q5). |
| Internal consistency | 4 / 5 | Source tags mostly consistent with slide-range format established in B1. Two tags use generic section names ("Part 9 recovery section", "Part 9 two-phase section") without slide numbers — acceptable since diagnosis doesn't pin these exactly. |

---

## Critical defects (fix before merging to live guide)

1. **Analyze card "Past-exam Q5: C = …, R = …, E = [3,2,2]" has a factually wrong example.** The example scenario changes E to [5, 2, 2] and claims "P3 [3,0,0] NO". Trace:
   - A = E − col(C) = [5−2, 2−2, 2−1] = [3, 0, 1]
   - P1 [2,0,0] ≤ [3,0,1] → YES → mark, release C[P1]=[0,1,0] → A = [3, 1, 1]
   - P3 [3,0,0] ≤ **[3,1,1]** → **3 ≤ 3 YES** → satisfiable (not deadlocked)
   - P3 releases C[P3]=[0,0,1] → A = [3, 1, 2]
   - P2 [0,0,2] ≤ [3,1,2] → YES → safe
   - **Result: no deadlock, not "P2 and P3 deadlocked"**

   **Fix:** change R[P3] in the example from [3,0,0] to **[4,0,0]**. Re-trace: A=[3,0,1] → P1 satisfies → A=[3,1,1] → P3 [4,0,0] ≤ [3,1,1]? 4 > 3 NO; P2 [0,0,2] ≤ [3,1,1]? 2 > 1 NO. P2 and P3 deadlocked, P1 escapes. Matches the intended lesson.

2. **Analyze card "Banker's system A/B/C" answer contains a mid-sentence thinking-aloud artifact.** The answer reads: `"Available would be 1 − 2 = wait, Available can't go negative — B only has 1 unit available to grant."` That "wait" is a reviewer-visible slip. Fix: rewrite as a clean two-step answer:
   > Available = Total − Σ Has = 10 − 9 = 1. B requests 2 but only 1 is free → the request cannot even be attempted (fails Banker's first gate: sufficient resources). **Cannot grant; no safety trace required.**

3. **Source-tag inconsistency on 2PL retry claim.** The `growing phase` card's explanation introduces "if any lock fails, release all acquired so far and retry" but the source tag is `"Part 9 two-phase section; research-deadlock.md §9"`. That research section does not mention retry. The retry language traces to `content/4736/topic-dives/banker-s-algorithm-recovery-two-phase-locking.md`. **Fix:** change source tag on both 2PL cards to `"Part 9 two-phase section; topic-dive: banker-s-algorithm-recovery-two-phase-locking.md"`.

---

## Missing content

- **Banker's multi-resource trace drill.** `research-deadlock.md §4` and `diagnosis.md:85-89` both flag multi-resource Banker's as high-weight (slides 84-87 dedicate 4 slides to worked examples). Current deadlock bank has only a single-resource Banker's card plus a constraint-check analyze card. Add at least one Apply-level card: "Given C, R, Max, A for 4 processes × 4 resources, find a safe sequence or show none exists."

- **Matrix detection drill on a fresh (non-Q5) system.** Q5 is drilled twice (once in the Apply card for the column-sum formula, once in the Analyze card). Students need a second matrix scenario to generalize the algorithm — not memorize Q5's numbers. Add one Apply card using the `research-deadlock.md §3` worked example (E = [4,2,3,1], A = [2,1,0,0], 3-process C/R from the slides — already computed in the research doc, so citations are clean).

- **Prevention summary table card** (slide 95 per `diagnosis.md:102`). The four prevention strategies are covered individually, but instructor emphasizes the **summary table** (Mutual exclusion→Spool, Hold-and-wait→Request-all, No-preemption→Preempt, Circular-wait→Number). Add a single Apply-level "Given scenario X, which prevention strategy applies and why?" card — matches Q4-style exam prompting.

---

## Content to remove

- **None.** No off-syllabus material, no filler. Every card traces to Part 9 material.

---

## Inaccuracies

| Guide says | Source says | Source location | Severity |
|---|---|---|---|
| Analyze Q5-matrix example: "P3 [3,0,0] NO" with A=[3,1,1] | 3 ≤ 3 is component-wise satisfied; P3 is marked and releases, P2 and P3 both finish (no deadlock). | This card's own arithmetic (E=[5,2,2] path). | **High** — teaches the student an incorrect matrix-algorithm trace. See Critical defect 1. |
| Banker's A/B/C analyze card: "Available would be 1 − 2 = wait, Available can't go negative" | Answer should read as finished prose, not scratchpad. | The card itself. | **High** — the mid-sentence correction is an obvious revision artifact. See Critical defect 2. |
| 2PL growing phase: "if any lock fails, release all acquired so far and retry" | Only the topic-dive `banker-s-algorithm-recovery-two-phase-locking.md:64` mentions this. `research-deadlock.md §9` and `Part_9_Deadlock.pdf` 2PL section describe acquire / release phases only. | Source tag cites research-deadlock.md §9 (which doesn't support retry). | **Medium** — content is sourced but tag misrouted. Re-cite. |
| "UNIX/Windows" listed as Ostrich users | Correct per `research-deadlock.md §11` and slide 106 context, but omits Linux (modern Linux does have deadlock detection in some kernel subsystems). | `research-deadlock.md §11` lists "Windows, Linux for certain scenarios". | Low — acceptable simplification, matches slide-level framing. |

---

## Pedagogical issues

- **Bloom Apply under-represented (14% vs 40% target).** Violates **Bloom's progression (rule 6)**. The deadlock exam topic is Apply-heavy: Q5 is a full matrix computation, and multi-resource Banker's traces are worked in detail on slides 84-87. Fix: add the two Apply cards listed under Missing content, and consider retagging 2-3 existing Understand cards that actually require computation.
- **Only one cloze card** (the Coffman four-condition overlap). Other topic-dives convert naturally to cloze: "The fundamental matrix invariant is `Σᵢ C[i][j] + {{A[j]}} = {{E[j]}}`". Add 1-2 cloze cards to hit the `cloze preferred` guidance in `COMP4736/CLAUDE.md:30-32`. Non-blocking.
- **No dual-coding reference for RAG.** Q5's resource-allocation graph is a critical diagram; the analyze card that decomposes it into Coffman conditions describes the graph in prose. Consider embedding a mini-mermaid or ASCII cycle in the `example` field of that card. Non-blocking; flashcards don't require dual coding.

---

## Bloom's distribution

- **Current** (36 cards): Remember 33% · Understand 39% · Apply 14% · Analyze 14%.
- **Target** (`diagnosis.md:159`): Remember 25% · Understand 15% · Apply 40% · Analyze 20%.
- **Gap:** Apply −26 pts, Analyze −6 pts, Remember +8 pts, Understand +24 pts.
- **Recommendation:** Add 3-4 Apply-tagged cards from the Missing-content list (Banker's multi-resource, fresh matrix detection, prevention-strategy diagnosis). Retag 2 Understand cards that actually compute something (e.g. "Formula for A given E and C?" is already Apply ✓; check "Detection algorithm — what condition makes process i satisfiable?" — component-wise check is Apply-grade, currently tagged Apply ✓). After those additions, Apply should reach ~25-30% — still under the 40% target but within an acceptable rebalance window given this is a flashcard bank (computational drills live in code-practice B3).

---

## Clarity / consistency issues

- **Banker's A/B/C analyze card answer** — self-correction artifact (see Critical defect 2).
- **Ostrich card source** — uses "Part 9, Slide 106". `diagnosis.md:106` confirms slide 106, so this tag is valid. Keep.
- **Two-phase-locking card source** — uses "Part 9 two-phase section" without a slide number. Acceptable if `diagnosis.md` doesn't pin exact slides, but a student looking for "the two-phase slide" has no landmark. Low priority: can be left generic.
- **Recovery cards source** — "Part 9 recovery section". Same pattern as above. Acceptable.
- **Q5-matrix analyze card** — the prompt shows the matrices in inline-array notation `[[0,1,0],[2,1,0],[0,0,1]]`. Readable but dense. Consider aligning into a mini-table in the prompt for quicker scan, matching the sol-PDF layout. Non-blocking cosmetic.

---

## Exam alignment

- **Q5 directly drilled:** dedicated Apply card on column-sum → A derivation, plus Analyze card on full detection trace. Strong.
- **Banker's covered:** single-resource Apply card (verbatim from original bank) + new Analyze card (with the arithmetic issue to fix).
- **Coffman structural diagnosis:** Analyze card "name exact Coffman condition each structural element corresponds to" mirrors the Q4-style prompt pattern (diagnose a scenario, apply a framework). Strong.
- **Missing:** multi-resource Banker's trace, fresh matrix-detection drill, prevention-strategy diagnosis. See Missing content.

---

## What the guide does well

Four list-recall cards from the original bank are now atomic — a genuine pedagogical improvement over the lists. The Ostrich analyze card with cost-benefit framing elevates what was a memorization card in the original bank into an actual engineering judgment prompt. Coffman-condition split cards each lead with a diagnostic prompt ("which condition requires X?") rather than flat definitions, which matches how the exam tests these (e.g. Q4-style structural identification).

---

## Prescribed next actions (ordered)

1. **Fix the Q5-matrix analyze card example** (Critical defect 1) — change R[P3] to [4,0,0] and re-verify trace.
2. **Rewrite the Banker's A/B/C analyze card answer** (Critical defect 2) — remove the self-correction; present as a clean two-step reasoning.
3. **Re-cite 2PL retry claim** (Critical defect 3) — change source tag on both 2PL split cards to topic-dive path.
4. **Add Banker's multi-resource Apply card** (Missing content 1) — source from `research-deadlock.md §4` worked example.
5. **Add fresh matrix-detection Apply card** (Missing content 2) — source from `research-deadlock.md §3` 4-resource example.
6. **Add prevention-strategy diagnosis Apply card** (Missing content 3) — Q4-style prompt.
7. (Optional, not gating) Add 1-2 cloze cards to broaden `type` diversity.
8. (Optional, not gating) Embed mini-RAG in the Coffman-diagnosis Analyze card `example`.

After actions 1-6, re-review. Expect verdict to rise to `Ship as-is` if Bloom Apply reaches ~25% and the three critical defects are clean.
