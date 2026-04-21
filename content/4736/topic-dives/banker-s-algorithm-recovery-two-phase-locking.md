---
id: 4736-topic-banker-s-algorithm-recovery-two-phase-locking
title: Banker's algorithm + recovery + two-phase locking
pillar: tech
priority: high
chapter: Part 9
tags:
  - deadlock
---

#### Banker's (avoidance) — the idea

Before granting each request, simulate the grant. Check whether the resulting state is **SAFE**: a safe state admits at least one ordering of processes in which every process can still finish. If the grant would produce an unsafe state, deny (or delay) the request.

Matrices per process: **Max** (declared maximum need), **Has** (currently held), **Need = Max − Has**. A process can complete now iff its remaining Need ≤ Available.

#### Single-resource worked example (10 units total)

```text
Process  Has  Max  Need
   A       3    9     6
   B       2    4     2
   C       2    7     5
Total held = 7  →  Available = 10 − 7 = 3

Safety check: find a process whose Need ≤ Available = 3.
  A: Need 6 ≤ 3? NO
  B: Need 2 ≤ 3? YES → run B. B returns 4 to pool.
     Available = 3 + 2 = 5   (B released its 2 held units)

  A: Need 6 ≤ 5? NO
  C: Need 5 ≤ 5? YES → run C. Available = 5 + 2 = 7

  A: Need 6 ≤ 7? YES → run A. Available = 7 + 3 = 10

Safe sequence exists: B → C → A.  State is SAFE.
```

#### The unsafe twist

```text
Same table, but now A also holds 1 more (Has=4, Need=5).
Total held = 8 → Available = 2.

  A: Need 5 ≤ 2? NO
  B: Need 2 ≤ 2? YES → run B. Available = 2 + 2 = 4
  A: Need 5 ≤ 4? NO
  C: Need 5 ≤ 4? NO

No process can proceed. State is UNSAFE (deadlock possible).
Banker would have DENIED the request that produced this state.
```

Unsafe ≠ deadlocked — but it *can lead to* deadlock, and Banker's refuses any grant that enters it.

#### Recovery methods (when deadlock already happened)

-   Preemption — take back a resource
-   Rollback — checkpoint + restore
-   Kill process(es) in the cycle

#### Two-phase locking

Phase 1 (growing): acquire all locks; if any fails, release and retry. Phase 2 (shrinking): release only.

#### Deadlock vs starvation vs livelock

-   Deadlock — cyclic wait, none progress
-   Starvation — scheduling ignores a process forever
-   Livelock — active state changes but no progress
