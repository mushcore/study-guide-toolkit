---
id: 4736-topic-placement-algorithms-past-exam-q2
title: Placement algorithms + past-exam Q2
pillar: tech
priority: high
chapter: Part 10
tags:
  - memory
---

#### The four fits

-   **First fit** — first hole ≥ size
-   **Best fit** — smallest hole ≥ size
-   **Worst fit** — largest hole
-   **Next fit** — first fit but from last-alloc position

#### Past-exam Q2 — SOLVED

Holes: \[10, 4, 20, 18, 7, 9, 12, 15\] MB. Requests 12, 10, 9:

|  | 12 MB | 10 MB | 9 MB |
| --- | --- | --- | --- |
| First fit | 20 | 10 | 18 |
| Best fit | 12 | 10 | 9 |
| Worst fit | 20 | 18 | 15 |
| Next fit | 20 | 18 | 9 |
