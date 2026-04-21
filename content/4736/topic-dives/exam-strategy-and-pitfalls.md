---
id: 4736-topic-exam-strategy-and-pitfalls
title: "Exam strategy and common pitfalls"
pillar: process
priority: high
chapter: All parts
tags: [exam-strategy, pitfalls]
---

This dive is process, not content. Its job is to keep you from dropping points on problems you already know how to solve. Everything here is derived from the practice final's solution PDF and the three research files under `generated/exam-study/`.

## Time allocation

The exam is split into two parts. Don't let Part 1 eat Part 2 minutes — Part 1 is T/F + MCQ (fast, many points) and Part 2 is written calculation (slow, high per-question weight).

| Question type | Target time |
|---|---|
| T/F (Part 1) | 20–30 s |
| MCQ (Part 1) | 45–60 s |
| Single-VA page-table translate | 2–3 min |
| Full matrix detection (C/R/E/A, 3 processes) | 6–8 min |
| Full fit-algorithm table (3 requests × 4 fits) | 5–6 min |
| Full buddy-system trace | 5–7 min |
| Optimal-page-size derivation | 3–4 min |

> **Takeaway**
> If a single Part 2 question goes past its target by 50%, skip and come back. One fully-completed question worth 10 marks beats one partially-correct question worth 6 marks.

## Common pitfalls

### Paging / address translation

> **Pitfall**
> **Off-by-one in bit splits.** Offset is `log₂(page_size)`. For 4 KB pages the offset is **12 bits**, not 11 and not 13. Double-check: the offset must span every byte inside the page (`2^offset = page_size`).

> **Pitfall**
> **Using VA bits where PA bits belong.** Frame count depends on **physical** address width. Pages depend on **virtual**. 48-bit VA + 32-bit PA + 8 KB pages: 2^35 pages, 2^19 frames — not the same 2^35 twice.

> **Pitfall**
> **Forgetting to check the present bit.** Past-exam Q3 VA 53448 → page marked X → page fault. Q4 VA 0x61B4 → entry present=0 → page fault. Always check the bit; never compute PA from an X entry.

> **Pitfall**
> **Hex → binary errors.** For Q4-style problems, write the full 16-bit binary expansion before splitting. 0x61B4 = `0110 0001 1011 0100`. Confirm the nibble count — 4 hex digits = 16 bits.

### Placement / allocation

> **Pitfall**
> **First-fit vs best-fit confusion on a single request.** First-fit stops at the first ≥ hole; best-fit scans all holes for the minimum. On successive requests, first-fit can take a hole that best-fit leaves alone. Past-exam Q2 12 MB request: first fit = 20, best fit = 12.

> **Pitfall**
> **Next-fit rover starts at the head, not wherever.** For the first request on a fresh list, next-fit = first-fit. The rover only matters starting from the second request.

### Buddy system

> **Pitfall**
> **"Adjacent" blocks are not necessarily buddies.** Buddy = the sibling created by the same split. Two same-size blocks at adjacent addresses but different parents cannot coalesce.

> **Pitfall**
> **Coalescing requires the buddy to be *wholly* free.** A busy leaf anywhere in the buddy's subtree blocks the merge. Past-exam Q8 after A releases 256: the sibling 256 contains B's 64, so no coalesce.

> **Pitfall**
> **Rounding down instead of up on allocation.** Request 300 KB → 512 KB block, not 256. Always round **up** to the next power of 2 ≥ max(request, min_block).

### Deadlock detection / avoidance

> **Pitfall**
> **RAG arrow direction.** `R → P` means R is **allocated to** P. `P → R` means P is **requesting** R. Swapping the direction inverts the analysis.

> **Pitfall**
> **Column sums vs row sums in the C matrix.** `A[j] = E[j] − Σ_i C[i][j]` sums a **column** (all processes' holdings of resource j). Row sums tell you a process's total holdings across resource types — useful but not for A.

> **Pitfall**
> **Unsafe ≠ deadlocked.** Banker's refuses any grant that produces an unsafe state, but unsafe states aren't necessarily deadlocked yet. Don't write "deadlock" when the question says "unsafe".

### Semaphores / synchronization

> **Pitfall**
> **`P(mutex)` before `P(empty)` in producer-consumer → deadlock.** The producer holds mutex while waiting on empty; the consumer cannot acquire mutex to remove items. **Always** `P(resource)` before `P(mutex)`.

> **Pitfall**
> **Condition variables have no memory.** A signal with no waiter is lost. This is why monitor code uses `while (!predicate) cond_wait()`, not `if`.

> **Pitfall**
> **Strict alternation violates requirement 3.** Even if one process is outside its critical region, the other is blocked waiting its turn. Peterson's and TSL fix this; strict alternation does not.

### IPC

> **Pitfall**
> **SIGKILL cannot be caught.** SIGTERM can, SIGINT can, SIGUSR1/2 can. Only SIGKILL and SIGSTOP are absolute.

> **Pitfall**
> **Unnamed pipes need fork.** They're unidirectional between **related** processes. For unrelated processes: named pipes (FIFO) or Unix-domain sockets.

## Exam-day checklist

- Calculator + blank paper + pencil permitted — practice arithmetic **on paper**, not mentally.
- Laptop fully charged; bring charger anyway.
- Closed book — no reference materials. Memorize the formulas block in the cheat sheet the night before.
- Sleep ≥ 7 hours the night before. Fatigue costs more marks than any single weak topic.
- Read every question's **last sentence** first — it's usually the one that tells you what to compute.

## Cross-references

- Paging formulas and worked examples: `lessons/` and `topic-dives/paging-core-formulas.md`, `address-translation-worked-examples.md`, `two-level-page-tables.md`
- Fit algorithms: `topic-dives/placement-algorithms-past-exam-q2.md`
- Buddy system: `topic-dives/buddy-system-past-exam-q8.md`
- Matrix detection: `topic-dives/matrix-detection-algorithm-c-r-e-a.md`
- Coffman + prevention: `topic-dives/coffman-conditions-strategies.md`
- Banker's + recovery + 2PL: `topic-dives/banker-s-algorithm-recovery-two-phase-locking.md`
- Semaphores and producer-consumer: `topic-dives/semaphores-p-v-producer-consumer.md`
- Race conditions / mutual exclusion: `topic-dives/race-conditions-critical-regions.md`, `mutual-exclusion-spectrum.md`
