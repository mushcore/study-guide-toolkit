---
"n": 1
id: 4736-lesson-race-conditions-critical-sections
title: Race conditions & critical sections
hook: Why two processes touching shared data cause chaos — and the 4 rules any fix must satisfy.
tags:
  - sync
module: IPC & Synchronization
---

Two processes modifying shared data without coordination can produce wrong results depending on timing. This is a **race condition**.

> **Analogy**
> Two people pulling cash from one ATM account at the exact same millisecond: both read $100, both subtract $50, both write $50. Account now shows $50 but the bank dispensed $100.

The slides' canonical example is the **print spooler**. Processes A and B both read variable `in` (next free slot), both write their file name to that slot, both increment `in`. One file gets overwritten.

<svg viewBox="0 0 720 240" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrRC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Print spooler race — interleaved access to <tspan class="label">in</tspan></text><line x1="80" y1="50" x2="700" y2="50" class="arrow-line" marker-end="url(#arrRC)"></line><text x="700" y="42" text-anchor="end" class="sub">time →</text><text x="40" y="80" class="label">Proc A</text><rect x="80" y="65" width="120" height="30" class="box-accent" rx="3"></rect><text x="140" y="85" text-anchor="middle" class="sub">read in → 7</text><rect x="320" y="65" width="140" height="30" class="box-accent" rx="3"></rect><text x="390" y="85" text-anchor="middle" class="sub">slot[7] = "a.pdf"</text><rect x="500" y="65" width="120" height="30" class="box-accent" rx="3"></rect><text x="560" y="85" text-anchor="middle" class="sub">in = 8</text><text x="40" y="140" class="label">Proc B</text><rect x="200" y="125" width="120" height="30" class="box-accent" rx="3"></rect><text x="260" y="145" text-anchor="middle" class="sub">read in → 7</text><rect x="460" y="125" width="140" height="30" class="box-bad" rx="3"></rect><text x="530" y="145" text-anchor="middle" class="sub">slot[7] = "b.pdf" ⚠</text><rect x="600" y="125" width="80" height="30" class="box-accent" rx="3"></rect><text x="640" y="145" text-anchor="middle" class="sub">in = 8</text><text x="40" y="200" class="label">slot[7]</text><rect x="80" y="185" width="240" height="30" class="box" rx="3"></rect><text x="200" y="205" text-anchor="middle" class="sub">empty</text><rect x="320" y="185" width="180" height="30" class="box-accent" rx="3"></rect><text x="410" y="205" text-anchor="middle" class="sub">"a.pdf"</text><rect x="500" y="185" width="200" height="30" class="box-bad" rx="3"></rect><text x="600" y="205" text-anchor="middle" class="sub">"b.pdf" — a.pdf LOST</text></svg>

The part of the code that touches shared data is the **critical region** (aka **critical section**). Any correct solution must satisfy **four conditions**:

1.  No two processes simultaneously in their critical regions (**mutual exclusion**).
2.  No assumptions about speed or number of CPUs.
3.  No process outside its critical region may block another.
4.  No process should wait forever to enter its critical region (**no starvation**).

> **Takeaway**
> Race condition → need mutual exclusion on shared data. Mutual exclusion must satisfy all 4 conditions above, not just #1.

> **Q:** A solution uses strict alternation (processes take turns). It satisfies mutual exclusion. Which of the 4 conditions does it violate?
> **A:** **#3**: a process NOT in its critical region can block another from entering (if it's not that process's turn). Strict alternation is rejected.

<svg viewBox="0 0 720 220" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrSA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Strict alternation — fast process B blocked by slow process A</text><line x1="80" y1="50" x2="700" y2="50" class="arrow-line" marker-end="url(#arrSA)"></line><text x="700" y="42" text-anchor="end" class="sub">time →</text><text x="40" y="80" class="label">Proc A</text><rect x="80" y="65" width="200" height="30" class="box-accent" rx="3"></rect><text x="180" y="85" text-anchor="middle" class="sub">in CS (slow)</text><rect x="280" y="65" width="320" height="30" class="box" rx="3"></rect><text x="440" y="85" text-anchor="middle" class="sub">non-CS work · turn=A still!</text><text x="40" y="140" class="label">Proc B</text><rect x="80" y="125" width="200" height="30" class="box" rx="3"></rect><text x="180" y="145" text-anchor="middle" class="sub">non-CS</text><rect x="280" y="125" width="320" height="30" class="box-bad" rx="3"></rect><text x="440" y="145" text-anchor="middle" class="sub">wants CS, BLOCKED — waiting for A's turn to flip</text><text x="180" y="190" text-anchor="middle" class="sub">A is NOT in its CS yet still blocks B from entering — violates condition #3</text></svg>
