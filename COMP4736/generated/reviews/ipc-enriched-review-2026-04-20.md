# Review: ipc-enriched.yaml (IPC 1 + IPC 2 enrichment, pass 1)

**Reviewed:** 2026-04-20
**Source of truth:**
- `materials/slides/Part_6_7_IPC_1.pdf`, `Part_8_IPC_2.pdf`, `Semphore.pdf`
- `generated/exam-study/research-ipc1-semaphore.md`, `research-ipc2.md`
- `materials/past-exams/Final_exam_practice.pdf`, `Final_exam_practice_Sol.pdf`
- `generated/graphify-out/GRAPH_REPORT.md` (god-node priorities)
- `content/4736/topic-dives/ipc-1-shared-memory-pipes-signals.md`, `ipc-2-fifo-message-queues-sockets-mmap.md`, `ipc-mechanism-decision-table.md`, `mutual-exclusion-spectrum.md`, `race-conditions-critical-regions.md`, `semaphores-p-v-producer-consumer.md`
- `COMP4736/CLAUDE.md`, `generated/diagnosis.md`

**Questions reviewed:** 60 enriched cards (30 IPC1/Sem + 30 IPC2).

**Overall verdict:** Ship after minor fixes.

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| Coverage | 5 / 5 | All 48 original cards preserved and enriched; 12 new cards added from atomic splits (3 file-descriptor + 5 POSIX semaphore + 2 comparison cards) and Analyze additions (2 per topic). Past-exam-style MCQ seeds covered. |
| Accuracy | 5 / 5 | Every API signature, syscall semantic, and ordering claim verified against `research-ipc1-semaphore.md`, `research-ipc2.md`, and Part 6/7/8 slides. No factual defects. |
| Excess (lower is worse) | 4 / 5 | One card over-packs eight blanks in a single cloze — violates SuperMemo minimum-information rule. See Critical defect 1. |
| Pedagogical quality | 4 / 5 | Bloom distribution 38 / 37 / 17 / 8 is Remember-heavy. Acceptable for an IPC bank serving Part 1 (T/F + mechanism MCQs per `diagnosis.md:142-150`) but formally under target. One atomicity violation (see defect 1). |
| Clarity & structure | 5 / 5 | Explanations add causal / mechanistic depth (not restatement). Examples are distinct from the prompt setup. Cross-references to Part 10 (mmap bridge) are explicit where relevant. |
| Exam alignment | 5 / 5 | Apply cards directly test `shmget` sequence (q exam-style), POSIX/System V call choice, parent-child pipe hygiene. Analyze cards test "which IPC + which sync for scenario X?" decision style that matches Part 1 MCQs + short-answer style. |
| Internal consistency | 5 / 5 | Source-tag format consistent with B1/B2 ("Part 6/7, Slide N; research-ipc1-semaphore.md §X"). Terminology aligned with existing topic-dives. No contradictions with B4/B5 mock questions on same topics. |

---

## Critical defects (fix before merging to live guide)

1. **Cloze card on "Linux's 8 IPC mechanisms" has eight blanks in one prompt.** Violates SuperMemo rule 1 (minimum information per card) and rule 3 (no list-recall). Eight separate fact-recalls in one card means the student either remembers all 8 at once or learns nothing from a partial recall — neither matches the spacing-practice model. Fix: replace with **two** smaller cloze cards (4 blanks each) grouped by IPC 1 vs IPC 2, OR drop the cloze entirely since the two comparison cards below it ("which are bidirectional?", "which have kernel lifetime?") already surface the 8-mechanism set through structural prompts.

   Recommended: **drop the 8-blank cloze**, keep the two comparison cards. The god-node recall that cloze was targeting is already covered by the comparison cards, so replacing is lower-risk than splitting.

---

## Missing content

None gating. Optional additions for future passes (non-gating):

- **Dining philosophers card** — canonical classic IPC problem per `Part_6_7_IPC_1.pdf` but not currently in the bank. Low priority because the other two classics (producer-consumer, readers-writers) are already drilled.
- **Readers-writers card** — same reason. A dedicated card on "why the naive R/W solution starves writers" would fit as Analyze-level.

---

## Content to remove

- **The 8-blank cloze card** — see Critical defect 1. Keep the prompt topic but convert to narrower cards.

---

## Inaccuracies

None found. Independent verification of the high-risk API / behavior claims:

| Claim | Verification | Status |
|---|---|---|
| "pipe(fd): fd[0]=read, fd[1]=write" | `research-ipc2.md §1`; `pipe(2)` manpage | ✓ |
| "Unnamed pipes: related processes only" | `research-ipc2.md §1`; universal Unix convention | ✓ |
| "Dijkstra 1965" | `research-ipc1-semaphore.md §4`: "Semaphores (Dijkstra, 1965)" | ✓ |
| "Peterson's exactly 2 processes" | `research-ipc1-semaphore.md §3`: "works for 2 processes only" | ✓ |
| "Condition variables have no memory" | `research-ipc1-semaphore.md §5`; diagnosis flags this as professor-emphasized | ✓ |
| "SIGKILL + SIGSTOP cannot be caught" | Universal POSIX; `research-ipc2.md §7` | ✓ |
| "MAP_PRIVATE = copy-on-write" | `research-ipc2.md §8`; `mmap(2)` manpage | ✓ |
| "System V IPC objects are kernel-lifetime" | `research-ipc2.md §3, §4`; standard | ✓ |
| "Socket server sequence `socket → bind → listen → accept`" | `research-ipc2.md §6`; consistent with B4 q52 | ✓ |
| "Strict alternation violates requirement 3" | `research-ipc1-semaphore.md §3`; diagnosis.md:207 flags as "orange/red highlighted" | ✓ |
| `sem_close` description: "Decrements the per-process reference count" | POSIX `sem_close(3)` actually "shall deallocate ... indicated semaphore"; reference-count phrasing is implementation detail, not API spec. Still conveys correct user-visible behavior. | Low-severity imprecision; no fix required. |

---

## Pedagogical issues

- **8-blank cloze** — violates **SuperMemo rule 1/3 (atomicity, no list-recall)**. See Critical defect 1.
- **Bloom distribution Remember-heavy (38%)** — violates **Bloom's progression (rule 6)** nominally (target 25%). Accepted: IPC bank feeds Part 1 (T/F + MCQs), which tests definitional recall per `diagnosis.md:142-150`. Distribution appropriate for exam format.
- **Two Analyze cards per topic** — matches B2 ratio. Sufficient for the topic's Part 2 weight (IPC has 0 past-exam Part 2 questions per `diagnosis.md:196-199`).

---

## Bloom's distribution

- **Current** (60 cards):
  - Remember: 23 (38%)
  - Understand: 22 (37%)
  - Apply: 10 (17%)
  - Analyze: 5 (8%)
- **Target** (`diagnosis.md:159`): Remember 25%, Understand 15%, Apply 40%, Analyze 20%.
- **Gap:** Remember +13 pts, Understand +22 pts, Apply −23 pts, Analyze −12 pts.
- **Interpretation:** IPC is Part 1-dominated per `diagnosis.md:44-46` ("IPC almost certainly dominates Part 1 (MCQ/TF)"). Part 1 is Remember/Understand-heavy, so the skew matches the expected exam format. Re-balancing toward Apply would misallocate card budget.
- **Recommendation:** no rebalance.

---

## Clarity / consistency issues

- **Cloze card on 8 mechanisms** — see Critical defect 1.
- All other cards pass clarity checks. Explanations stay 1-3 sentences, examples stay ≤ 6 code lines, answers stay on-point.

---

## Exam alignment

- **Part 1 (T/F + MCQ) readiness:** strong. Cards on SIGKILL/SIGSTOP, monitor mutex, condition-variable memoryless-ness, strict alternation requirement violation, mechanism comparisons — all map directly to likely MCQ stems flagged in `diagnosis.md:142-150`.
- **Part 2 (written) readiness:** not the IPC bank's primary role per `diagnosis.md:196-199` (0 past-exam IPC questions in Part 2). Two Analyze cards per topic cover the outside chance of a written IPC question.
- **Distractor-trap coverage:** IPC bank doesn't author distractors directly (flashcards, not MCQ), but several Analyze cards surface classic traps ("two consumers both wake on `if (!available) wait()`", "bidirectional pipe misconception"). Good.

---

## Internal consistency

- Source-tag format: `"Part 6/7, Slide N; research-ipc1-semaphore.md §X"` uniformly. Same style as B1/B2.
- Cross-batch: the "P(mutex) before P(empty) → deadlock" scenario appears in B2 Analyze card + B4 q45 + B6 pitfall + this bank's 2 cards (understand + analyze). Consistent — no contradictions.
- Terminology: "P/V" vs "sem_wait/sem_post" — both used, paired in the binary-vs-counting card and explicitly equated in the P/V ↔ POSIX mapping cards. No drift.
- Hyperedge "8 IPC mechanisms" consistent with `graphify-out/GRAPH_REPORT.md` (9 edges, top god node).

---

## What the guide does well

Every API card gives a runnable example — `mkfifo + open`, `shmget + shmat`, socketpair + fork — that a student can mentally trace without reaching for manpages. The two P(mutex)/P(empty) cards (understand + analyze) stack to reinforce the ordering rule from two angles. The cross-reference on mmap (Part 8 + Part 10) mirrors the graph's flagged cross-domain bridge.

---

## Prescribed next actions (ordered)

1. **Drop the 8-blank cloze card** (Critical defect 1). The two comparison cards (`bidirectional?`, `kernel-lifetime?`) already surface the 8-mechanism set through structural recall.
2. (Optional, non-gating) Add a dining-philosophers and readers-writers Analyze card in a later pass if time allows.
3. (Optional) Tighten `sem_close` explanation from "decrements the per-process reference count" to "releases this process's handle; the semaphore persists in the kernel until `sem_unlink` and all handles closed".

After action 1, re-review. Expect verdict `Ship as-is`.
