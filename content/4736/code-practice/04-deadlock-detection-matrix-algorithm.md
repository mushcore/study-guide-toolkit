---
"n": 4
id: 4736-code-deadlock-detection-matrix-algorithm
title: Deadlock detection — matrix algorithm
lang: c
tags:
  - deadlock
---

## Prompt

E = [4, 2, 3, 1]. C and R given:

C:
P1 [ 1  0  0  0 ]
P2 [ 0  1  1  0 ]
P3 [ 2  0  0  1 ]

R:
P1 [ 2  0  0  1 ]
P2 [ 1  0  1  0 ]
P3 [ 0  1  0  0 ]

Is the system deadlocked? Show your steps.

## Starter

```c
Compute A =
Iteration 1:
Iteration 2:
Iteration 3:
Conclusion:
```

## Solution

```c
Column sums of C: [3, 1, 1, 1]
A = E − sums = [4−3, 2−1, 3−1, 1−1] = [1, 1, 2, 0]

Iter 1: find unmarked i with R[i] ≤ A.
  P1 R=[2,0,0,1], A=[1,1,2,0] → 2>1, fails.
  P2 R=[1,0,1,0] ≤ [1,1,2,0] ✓ → mark P2. A = A + C[2] = [1,1,2,0]+[0,1,1,0] = [1,2,3,0].
Iter 2:
  P1 R=[2,0,0,1], A=[1,2,3,0] → 2>1, fails.
  P3 R=[0,1,0,0] ≤ [1,2,3,0] ✓ → mark P3. A = [1,2,3,0]+[2,0,0,1] = [3,2,3,1].
Iter 3:
  P1 R=[2,0,0,1] ≤ [3,2,3,1] ✓ → mark P1. A = [3,2,3,1]+[1,0,0,0] = [4,2,3,1] = E.

All marked. System NOT deadlocked. Safe sequence: P2, P3, P1.
```

## Why

Keep repeating. If any unmarked processes remain when no more can be satisfied → deadlocked.
