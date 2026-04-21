# Review: general-expansion.yaml (B4 — mock exam expansion, pass 1)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/slides/Part_10_memory.pdf`, `Part_9_Deadlock.pdf`, `Part_6_7_IPC_1.pdf`, `Part_8_IPC_2.pdf`
- `generated/exam-study/research-deadlock.md`, `research-ipc1-semaphore.md`, `research-ipc2.md`
- `content/4736/mock-exam.yaml` (existing q1-q35 for schema/style alignment)
- `content/SCHEMA.md` mock-exam invariants
- `COMP4736/CLAUDE.md`, `generated/diagnosis.md`

**Questions reviewed:** q36-q52 (17 new entries).

**Overall verdict:** Ship after minor fixes.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | All five plan-specified coverage gaps closed: page-replacement edge cases (q36, q38), TLB/EAT (q37), deadlock recovery (q42, q43, q44), semaphore ordering (q45), two-level PT (q39), buddy fragmentation (q40), IPC 1 (q46-q48), IPC 2 (q49-q52). |
| Accuracy | 3 / 5 | One arithmetic defect on q37 (EAT value does not match any choice with stated inputs). One minor MCQ-discrimination issue on q40. All other questions verified against source materials. |
| Excess (lower is worse) | 5 / 5 | No off-syllabus content; every question maps to a specific Part 6/7/8/9/10 topic or research-file section. |
| Pedagogical quality | 5 / 5 | Every MCQ rationale contains distractor analysis per `COMP4736/CLAUDE.md:53-54`. Mix of T/F-style (fast recall) and 4-choice (discrimination) matches exam Part 1. |
| Clarity & structure | 4 / 5 | One ambiguous MCQ (q40 discriminates by fractions of a percent). |
| Exam alignment | 5 / 5 | Follows the MCQ-with-`["True", "False"]` convention established by q1-q35. Topic labels match existing bank (`Memory/Paging`, `Deadlock`, `IPC1/Sem`, `IPC2`). Distractor analysis in rationale matches professor's emphasis per `diagnosis.md`. |
| Internal consistency | 5 / 5 | All 17 entries pass `SCHEMA.md:198-215` mock-exam invariants (unique IDs, `correct` in range, rationales present, choices non-empty for MCQ/MULTI). No duplicate IDs against q1-q35. |

---

## Critical defects (fix before merging to live guide)

1. **q37 EAT arithmetic is wrong.** The stated inputs (1 ns TLB, 100 ns memory, +1 memory access on PT walk, 95% hit rate) give:
   - TLB hit cost = 1 + 100 = 101 ns
   - TLB miss cost = 1 + 100 + 100 = 201 ns
   - EAT = 0.95 × 101 + 0.05 × 201 = 95.95 + 10.05 = **106 ns**

   The current answer "111 ns" corresponds to a **0.90** hit rate, not 0.95. The correct answer (106) is not among the four choices. **Fix:** change the stated hit rate from `0.95` to `0.90` in the question; 111 ns becomes arithmetically correct. Rationale needs no content change beyond updating the hit-rate value.

2. **q40 discriminates by fractional percentage points, not by exam-meaningful margin.** "Worst internal fragmentation ratio" on `257 KB → 512 KB` is 49.8%, on `129 KB → 256 KB` is 49.6%. The difference (0.2 pts) is smaller than any meaningful exam-scoring discrimination, and a student could plausibly defend either answer. **Fix:** reword the prompt to measure **absolute bytes wasted** (not ratio), which gives a clear winner:
   - 257 KB → 512 KB: 255 KB wasted
   - 129 KB → 256 KB: 127 KB wasted
   - 192 KB → 256 KB: 64 KB wasted
   - 128 KB → 128 KB: 0 KB wasted

   Answer B (257 KB) wins by 128 KB over A — unambiguous. Update rationale to report KB-wasted values.

---

## Missing content

None gating for this batch. Plan specified ~17 new entries and 17 landed. Two optional additions if time allows:

- **Matrix-detection MCQ** — the live mock bank has zero matrix-detection questions despite `generated/diagnosis.md:70-74` flagging it as "CRITICAL" (slides 42-59, past-exam Q5). A short `"Σ_i C[i][j] + A[j] = ?"` MCQ would fit. Non-gating because matrix drilling already lives in B3 code-practice drill 04.
- **Safe-state MCQ** — the new bank covers unsafe-vs-deadlocked (q44) but no direct "given Has/Max/Available, is this state safe?" prompt. B1's Banker's Apply card covers it; optional here.

---

## Content to remove

None.

---

## Inaccuracies

| Guide says | Source says | Source location | Severity |
|---|---|---|---|
| q37 rationale: `EAT = 0.95 × (1 + 100) + 0.05 × (1 + 200) = 95.95 + 15.05 = 111 ns` | `0.05 × 201 = 10.05`, not 15.05. Sum = 106 ns, not 111 ns. | The rationale's own arithmetic. | **High** — student memorizes 111 ns with 0.95 hit rate; gets the wrong answer on an exam EAT problem. Fix per Critical defect 1. |
| q40 prompt: "worst internal fragmentation **ratio**" on 257 vs 129 | 49.8% vs 49.6% — fractional difference, borderline ambiguous. | Arithmetic on `(2^(k+1) − (2^k+1)) / 2^(k+1)`. | Medium — correct answer is technically B but distinguishing by < 0.5 pp is fragile. Fix per Critical defect 2. |
| q49 C: "Named pipe (FIFO) — bidirectional, unrelated processes" | `research-ipc2.md:32` "Directionality: Bidirectional", line 500 "bidirectional, filesystem visibility", line 787 "Can be bidirectional but one direction per file". Course framing treats named pipes as bidirectional, matching the question. | `research-ipc2.md` (multiple sections). | None — verified source-grounded despite ambiguity in the broader literature. Keep as-is. |

---

## Pedagogical issues

- **Two-choice T/F-via-MCQ proportion** — 8 of 17 questions (q36, q39, q41, q44, q46, q48, q51, all T/F style). Matches the exam's Part 1 T/F weight, acceptable. No change needed.
- **Distractor analysis quality** — every 4-choice MCQ includes explicit "A — reason, B — reason, C — reason" distractor analysis. Matches `COMP4736/CLAUDE.md:54` requirement. Strong.
- **No cloze conversion** — mock exam is MCQ/TF only by format; cloze would not fit the live-exam style. No issue.

---

## Bloom's distribution

- **Current** (17 questions, tagged by question style):
  - Remember (recall of fact): q36, q38, q41, q42, q43, q44, q46, q47, q48, q50, q51 → 11 (65%)
  - Understand (application of concept): q39, q49, q52 → 3 (18%)
  - Apply (computation): q37, q40, q45 → 3 (18%)
  - Analyze+: 0 (0%)
- **Target** (per `diagnosis.md:159` expected exam Bloom profile): Remember 25%, Understand 15%, Apply 40%, Analyze 20%.
- **Gap:** Remember +40 pts (over), Apply −22 pts (under), Analyze −20 pts (absent). This is **acceptable for the mock-exam bank** specifically — Part 1 of the live exam (where this bank is most relevant) is described by `diagnosis.md:142-150` as "definitions, T/F on properties, mechanism comparisons" (all Remember-level). Apply/Analyze content lives in code-practice drills (B3). The mock-exam bank should skew Remember-heavy to mirror Part 1.
- **Recommendation:** no rebalance. The profile fits Part 1's testing style.

---

## Clarity / consistency issues

- **q40 "worst internal fragmentation ratio"** — see Critical defect 2. Rewording the metric to "absolute KB wasted" removes the ambiguity.
- **q37 prompt** — currently reads "TLB lookup takes 1 ns; a main-memory access takes 100 ns; PT walk adds one memory access." Precise and unambiguous; only the arithmetic in answer/rationale needs correction (Critical defect 1).
- **q45 option C "Producer holds mutex forever, consumer blocks on mutex"** — correctly describes the deadlock, but the phrase "forever" could be clarified to "until the system is reset / externally intervened". Low priority.

---

## Exam alignment

- **Part 1 (online T/F + MCQ) style match** — strong. T/F-via-MCQ convention (same as q1-q35) avoids any schema change and renders natively in the existing UI.
- **Part 2 (written)** — this bank doesn't target Part 2 directly; that's B3's job (code-practice drills).
- **Distractor discipline** — every 4-choice MCQ (q37, q40, q42, q43, q45, q47, q49, q50, q52) has true-distractor analysis. A student who reads rationales learns not only the correct answer but **why** each wrong option fails.

---

## Internal consistency

- **Schema compliance** — verified: each entry has `id`, `type: MCQ`, `topic`, `marks`, `question`, `choices`, `correct` (int in range), `rationale`. No duplicate IDs with q1-q35.
- **Topic labels** — match the four existing labels (`Memory/Paging`, `Memory/Alloc`, `Deadlock`, `IPC1/Sem`, `IPC2`). No new labels introduced.
- **Marks distribution** — 13 × 1-mark + 4 × 2-mark = 21 marks added. Matches existing q1-q35's 1-mark-default convention with 2-marks reserved for computational prompts.

---

## What the guide does well

Distractor analysis is thorough — every 4-choice MCQ's rationale explains why each wrong option fails, not just why the right one wins. Coverage faithfully closes the plan's specified gaps (page replacement, EAT, deadlock recovery, IPC under-coverage). Zero-schema-change approach (reusing the `["True", "False"]` MCQ pattern for T/F-style questions) avoids build-pipeline and UI changes entirely.

---

## Prescribed next actions (ordered)

1. **Fix q37 arithmetic** (Critical defect 1) — change stated hit rate from 0.95 to 0.90 so the correct answer 111 ns matches. Update rationale's arithmetic string accordingly.
2. **Reword q40 metric** (Critical defect 2) — change "worst internal fragmentation ratio" to "most KB wasted inside the allocated block"; update rationale with absolute-waste values (255, 127, 64, 0).
3. (Optional, non-gating) Add one matrix-detection MCQ to close the diagnosis.md "CRITICAL" coverage gap.

After actions 1-2, re-review. Expect verdict `Ship as-is`.
