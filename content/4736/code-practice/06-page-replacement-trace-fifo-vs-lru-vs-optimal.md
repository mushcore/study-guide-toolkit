---
"n": 6
id: 4736-code-page-replacement-trace-fifo-vs-lru-vs-optimal
title: Page replacement trace — FIFO vs LRU vs Optimal
lang: c
tags:
  - sync
  - paging
---

## Prompt

Reference string: 0 1 2 3 0 1 4 0 1 2 3 4. Three page frames, all initially empty. Trace FIFO, LRU, and Optimal. Report the page-fault count for each. A H (hit) row and numeric fault count per algorithm is sufficient.

## Starter

```c
Ref:         0 1 2 3 0 1 4 0 1 2 3 4
FIFO faults:
LRU  faults:
Opt  faults:
```

## Solution

```c
Ref:         0 1 2 3 0 1 4 0 1 2 3 4
FIFO:        F F F F F F F H H F F H   →  9 faults
LRU:         F F F F F F F H H F F F   →  10 faults
Optimal:     F F F F H H F H H F F H   →  7 faults

FIFO queue (front = oldest):
  0  → [0]
  1  → [0,1]
  2  → [0,1,2]
  3  → evict 0   → [1,2,3]
  0  → evict 1   → [2,3,0]
  1  → evict 2   → [3,0,1]
  4  → evict 3   → [0,1,4]
  0  → hit
  1  → hit
  2  → evict 0   → [1,4,2]
  3  → evict 1   → [4,2,3]
  4  → hit

LRU (most-recent last):
  0  → [0]
  1  → [0,1]
  2  → [0,1,2]
  3  → evict 0   → [1,2,3]
  0  → evict 1   → [2,3,0]
  1  → evict 2   → [3,0,1]
  4  → evict 3   → [0,1,4]
  0  → hit, reorder → [1,4,0]
  1  → hit, reorder → [4,0,1]
  2  → evict 4   → [0,1,2]
  3  → evict 0   → [1,2,3]
  4  → evict 1   → [2,3,4]

Optimal (evict page whose NEXT use is furthest in future):
  0  → {0}
  1  → {0,1}
  2  → {0,1,2}
  3  → next uses: 0@4, 1@5, 2@9. Evict 2.   → {0,1,3}
  0  → hit
  1  → hit
  4  → next uses of {0,1,3}: 0@7, 1@8, 3@10. Evict 3. → {0,1,4}
  0  → hit
  1  → hit
  2  → after here only 3,4 remain. 0 and 1 are never referenced again → evict either (say 0). → {1,4,2}
  3  → 1 never referenced again, 2 never, 4@11. Evict 1. → {4,2,3}
  4  → hit
```

## Why

FIFO evicts by load time (ignores use). LRU evicts by last-access time. Optimal needs future knowledge — it is a lower bound used as a benchmark. This trace shows LRU can be WORSE than FIFO on specific reference patterns, which is why no algorithm dominates all workloads (Part\_10\_memory.pdf; Lesson 10).
