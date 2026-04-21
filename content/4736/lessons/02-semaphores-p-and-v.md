---
"n": 2
id: 4736-lesson-semaphores-p-and-v
title: Semaphores — P and V
hook: Dijkstra's 1965 fix for the lost-wakeup problem. Two atomic operations, one integer, every sync problem solved.
tags:
  - semaphores
module: IPC & Synchronization
---

A **semaphore** is an integer counter with two atomic operations:

-   **P(s)** aka `down`, `wait`, `sem_wait`: if s > 0, decrement s and continue. Else, block (sleep) until someone signals.
-   **V(s)** aka `up`, `signal`, `sem_post`: increment s; if any process is blocked on s, wake one.

Both P and V are **atomic**: once the OS starts the operation, it finishes the whole thing before any other process can run. If a process is mid-P(s), no one else can read or change s until P completes. That indivisibility is why semaphores fix the "lost wakeup" problem — "check the counter" and "block or decrement" happen as one uninterruptible step, so no signal can slip through the gap.

> **Analogy**
> A nightclub with N spots. P = try to enter (bouncer lets you in if count < N, else you wait in line). V = leave (bouncer waves the next person in).

**Binary semaphore** = initialized to 1, acts like a lock. **Counting semaphore** = initialized to N, represents N available resources.

sequenceDiagram autonumber participant Prod as Producer participant E as empty = N participant M as mutex = 1 participant F as full = 0 participant Cons as Consumer Prod->>E: P(empty) \[blocks if 0\] Prod->>M: P(mutex) Note over Prod: insert\_item() Prod->>M: V(mutex) Prod->>F: V(full) "item ready" F-->>Cons: P(full) unblocks Cons->>M: P(mutex) Note over Cons: remove\_item() Cons->>M: V(mutex) Cons->>E: V(empty) "slot freed"

Init: `empty = N` (empty slots), `full = 0` (full slots), `mutex = 1` (binary buffer lock).

```c
// Producer-consumer with semaphores (VERBATIM from Part 6/7)
empty = N;   // count of empty slots, init N
full  = 0;   // count of full slots, init 0
mutex = 1;   // binary semaphore for buffer access

producer:
  P(empty);        // wait for empty slot
  P(mutex);        // lock buffer
  insert_item();
  V(mutex);        // unlock
  V(full);         // signal new item

consumer:
  P(full);         // wait for item
  P(mutex);
  remove_item();
  V(mutex);
  V(empty);
```

**Trap:** swapping `P(mutex)` and `P(empty)` on producer can cause deadlock (locks buffer while no empty slot exists, consumer can't remove anything).

> **Takeaway**
> P decrements + maybe blocks. V increments + maybe wakes. Always lock mutex *inside* the count semaphores (empty/full), never outside.

<svg viewBox="0 0 720 240" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrSEM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Semaphore value over time — init s=2, three Ps then a V</text><line x1="80" y1="180" x2="700" y2="180" class="arrow-line" marker-end="url(#arrSEM)"></line><text x="700" y="172" text-anchor="end" class="sub">time →</text><line x1="80" y1="60" x2="80" y2="190" class="arrow-line"></line><text x="60" y="70" text-anchor="end" class="sub">s=2</text><text x="60" y="105" text-anchor="end" class="sub">s=1</text><text x="60" y="140" text-anchor="end" class="sub">s=0</text><line x1="80" y1="70" x2="200" y2="70" class="arrow-line"></line><line x1="200" y1="70" x2="200" y2="105" class="arrow-line"></line><line x1="200" y1="105" x2="320" y2="105" class="arrow-line"></line><line x1="320" y1="105" x2="320" y2="140" class="arrow-line"></line><line x1="320" y1="140" x2="500" y2="140" class="arrow-line"></line><line x1="500" y1="140" x2="500" y2="105" class="arrow-line"></line><line x1="500" y1="105" x2="680" y2="105" class="arrow-line"></line><text x="200" y="55" text-anchor="middle" class="sub">P(P1)</text><text x="320" y="55" text-anchor="middle" class="sub">P(P2)</text><text x="410" y="125" text-anchor="middle" class="sub">P(P3) — blocks (s=0)</text><text x="500" y="92" text-anchor="middle" class="sub">V — P3 wakes</text><circle cx="200" cy="70" r="3" fill="#7aa2f7"></circle><circle cx="320" cy="105" r="3" fill="#7aa2f7"></circle><circle cx="410" cy="140" r="4" fill="#f7768e"></circle><circle cx="500" cy="140" r="3" fill="#9ece6a"></circle><text x="380" y="215" text-anchor="middle" class="sub">Atomic: each P/V completes before any other P/V starts — no signal slips through the gap.</text></svg>

**Common mistakes.**

-   **Treating condition variables like semaphores.** A CV `signal()` with no waiter is *lost*. Semaphore V() increments the counter so the signal persists. Mock-exam T/F: "A condition variable signal is queued if no process is currently waiting." → False.
-   **"Semaphores use busy waiting."** False. P() blocks the process; only TSL, Peterson's, and plain lock variables busy-wait.
-   **Swapping P(mutex) before P(empty)** on the producer. Producer holds the buffer lock while no slot exists; consumer cannot enter the buffer to free one → deadlock.
-   **Using a binary semaphore for N resources.** Use a counting semaphore initialized to N. Binary is only for mutual exclusion.

> **Q:** Semaphore init to 3. Four processes call P() in order. What are their states?
> **A:** First 3 pass (s: 3→2→1→0). Fourth blocks. Semaphore s = 0 with 1 process waiting.
