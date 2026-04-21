---
"n": 7
id: 4736-lesson-deadlock-detection-the-matrix-algorithm
title: Deadlock detection — the matrix algorithm
hook: The exam will give you a resource graph. You produce C, R, E, A matrices. Procedural.
tags:
  - deadlock
module: Deadlock
---

Given **n processes** and **m resource types**, four matrices/vectors describe system state:

-   **E** — Existing resource vector (length m): total instances of each type.
-   **A** — Available resource vector (length m): free right now.
-   **C** — Current allocation matrix (n×m): `C[i][j]` = resources of type j held by process i.
-   **R** — Request matrix (n×m): `R[i][j]` = resources of type j process i is requesting.

**Invariant:** `Σi C[i][j] + A[j] = E[j]` for each resource type j.

<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg" style="background:#0d1117;border:1px solid #262626;border-radius:4px;width:100%;max-width:520px;"><defs><marker id="rag-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9ece6a"></path></marker><marker id="rag-rh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f7768e"></path></marker></defs><rect x="50" y="30" width="70" height="50" fill="none" stroke="#e0af68" stroke-width="1.5" rx="4"></rect><text x="85" y="22" fill="#e0af68" text-anchor="middle" font-family="ui-monospace" font-size="13">R1</text> <circle cx="68" cy="55" r="3" fill="#e0af68"></circle><circle cx="85" cy="55" r="3" fill="#e0af68"></circle><circle cx="102" cy="55" r="3" fill="#e0af68"></circle><rect x="225" y="30" width="70" height="50" fill="none" stroke="#e0af68" stroke-width="1.5" rx="4"></rect><text x="260" y="22" fill="#e0af68" text-anchor="middle" font-family="ui-monospace" font-size="13">R2</text> <circle cx="250" cy="55" r="3" fill="#e0af68"></circle><circle cx="270" cy="55" r="3" fill="#e0af68"></circle><rect x="400" y="30" width="70" height="50" fill="none" stroke="#e0af68" stroke-width="1.5" rx="4"></rect><text x="435" y="22" fill="#e0af68" text-anchor="middle" font-family="ui-monospace" font-size="13">R3</text> <circle cx="425" cy="55" r="3" fill="#e0af68"></circle><circle cx="445" cy="55" r="3" fill="#e0af68"></circle><circle cx="85" cy="250" r="25" fill="none" stroke="#7aa2f7" stroke-width="1.5"></circle><text x="85" y="255" fill="#7aa2f7" text-anchor="middle" font-family="ui-monospace" font-size="14">P1</text> <circle cx="260" cy="250" r="25" fill="none" stroke="#7aa2f7" stroke-width="1.5"></circle><text x="260" y="255" fill="#7aa2f7" text-anchor="middle" font-family="ui-monospace" font-size="14">P2</text> <circle cx="435" cy="250" r="25" fill="none" stroke="#7aa2f7" stroke-width="1.5"></circle><text x="435" y="255" fill="#7aa2f7" text-anchor="middle" font-family="ui-monospace" font-size="14">P3</text> <line x1="115" y1="80" x2="245" y2="232" stroke="#9ece6a" stroke-width="1.5" marker-end="url(#rag-ah)"></line><text x="175" y="145" fill="#9ece6a" font-family="ui-monospace" font-size="12">2</text> <line x1="230" y1="80" x2="108" y2="230" stroke="#9ece6a" stroke-width="1.5" marker-end="url(#rag-ah)"></line><text x="158" y="145" fill="#9ece6a" font-family="ui-monospace" font-size="12">1</text> <line x1="260" y1="80" x2="260" y2="225" stroke="#9ece6a" stroke-width="1.5" marker-end="url(#rag-ah)"></line><text x="268" y="155" fill="#9ece6a" font-family="ui-monospace" font-size="12">1</text> <line x1="435" y1="80" x2="435" y2="225" stroke="#9ece6a" stroke-width="1.5" marker-end="url(#rag-ah)"></line><text x="443" y="155" fill="#9ece6a" font-family="ui-monospace" font-size="12">1</text> <line x1="75" y1="225" x2="75" y2="82" stroke="#f7768e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#rag-rh)"></line><text x="55" y="150" fill="#f7768e" font-family="ui-monospace" font-size="12">2</text> <line x1="282" y1="234" x2="405" y2="82" stroke="#f7768e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#rag-rh)"></line><text x="348" y="150" fill="#f7768e" font-family="ui-monospace" font-size="12">2</text> <line x1="410" y1="240" x2="125" y2="82" stroke="#f7768e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#rag-rh)"></line><text x="275" y="170" fill="#f7768e" font-family="ui-monospace" font-size="12">3</text> <line x1="40" y1="315" x2="65" y2="315" stroke="#9ece6a" stroke-width="1.5" marker-end="url(#rag-ah)"></line><text x="70" y="319" fill="#9ece6a" font-family="ui-monospace" font-size="11">allocation (→ C)</text> <line x1="225" y1="315" x2="250" y2="315" stroke="#f7768e" stroke-width="1.5" stroke-dasharray="4" marker-end="url(#rag-rh)"></line><text x="255" y="319" fill="#f7768e" font-family="ui-monospace" font-size="11">request (→ R)</text></svg>

Past-exam Q5 resource graph. Dots = resource instances (E = \[3, 2, 2\]).

#### Building matrices from a resource graph

Past-exam Q5: graph has R1, R2, R3 and P1, P2, P3. Arrow **resource→process** = allocation (contributes to C). Arrow **process→resource** = request (contributes to R).

```text
SOLVED (past-exam Q5):
         C                R                E
      R1 R2 R3         R1 R2 R3         R1 R2 R3
P1 [  0  1  0 ]   P1 [ 2  0  0 ]      [ 3  2  2 ]
P2 [  2  1  0 ]   P2 [ 0  0  2 ]
P3 [  0  0  1 ]   P3 [ 3  0  0 ]
```

#### Detection algorithm

1.  Mark all processes as unmarked.
2.  Find unmarked process i with `R[i] ≤ A` (row-wise).
3.  If found: `A = A + C[i]` (release its resources), mark i, goto 2.
4.  If not found and any unmarked remain: those are **deadlocked**.

#### Tiny worked example (do this before attempting Q5)

```text
E = [3, 2]     (3 of R1, 2 of R2)       2 processes

C:            R:
   R1 R2        R1 R2
P1 [ 1 1 ]  P1 [ 1 0 ]
P2 [ 1 1 ]  P2 [ 1 1 ]

Step 1 — compute A:
  column sums of C = [2, 2]
  A = E − sums = [3−2, 2−2] = [1, 0]

Step 2 — iterate:
  Mark none. Look for unmarked i with R[i] ≤ A = [1, 0].
  P1: R[P1] = [1, 0] ≤ [1, 0] ✓
    → mark P1. A ← A + C[P1] = [1,0] + [1,1] = [2, 1]
  P2: R[P2] = [1, 1] ≤ [2, 1] ✓
    → mark P2. A ← [2,1] + [1,1] = [3, 2] = E ✓

All marked. System is NOT deadlocked.
Safe sequence: P1, P2.

If at any step NO unmarked process satisfies R[i] ≤ A,
the remaining unmarked processes are deadlocked.
```

> **Takeaway**
> C records who holds what. R records who wants what. E is total capacity. A = E − (column sums of C). Detect by repeatedly finding satisfiable processes and freeing their resources.

> **Q:** Given E = \[3 2 2\] and above C, compute A (available).
> **A:** Column sums of C: R1 = 0+2+0 = 2, R2 = 1+1+0 = 2, R3 = 0+0+1 = 1. A = E − sums = \[3−2, 2−2, 2−1\] = **\[1 0 1\]**.
