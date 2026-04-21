---
id: 4736-topic-matrix-detection-algorithm-c-r-e-a
title: Matrix detection algorithm (C, R, E, A)
pillar: tech
priority: high
chapter: Part 9
tags:
  - deadlock
---

#### Matrices

-   **E** (length m) — existing resources per type
-   **A** (length m) — available per type
-   **C** (n × m) — current allocation, C\[i\]\[j\] = resource j held by process i
-   **R** (n × m) — requests, R\[i\]\[j\] = resource j process i wants

Invariant: Σ\_i C\[i\]\[j\] + A\[j\] = E\[j\]

#### Algorithm

1.  Mark all processes unmarked.
2.  Find unmarked i with R\[i\] ≤ A (component-wise).
3.  If found: A ← A + C\[i\], mark i, repeat.
4.  If none satisfiable: unmarked processes are deadlocked.

#### Past-exam Q5 solution

```text
        C             R             E
     R1 R2 R3      R1 R2 R3    R1 R2 R3
P1 [  0  1  0 ] P1 [ 2 0 0 ]  [ 3  2  2 ]
P2 [  2  1  0 ] P2 [ 0 0 2 ]
P3 [  0  0  1 ] P3 [ 3 0 0 ]

Column sums of C: [2, 2, 1]
A = E − sums = [3−2, 2−2, 2−1] = [1, 0, 1]
```
