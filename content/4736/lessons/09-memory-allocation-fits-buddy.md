---
"n": 9
id: 4736-lesson-memory-allocation-fits-buddy
title: Memory allocation — fits + buddy
hook: Past-exam Q2 and Q8 are rote procedures. Do them correctly → free marks.
tags:
  - memory
  - allocation
module: Memory & Paging
---

#### Past-exam Q2 holes visualized

```text
index:   0    1    2      3     4    5     6      7
holes:  [10] [4] [ 20 ] [ 18 ] [7] [9] [ 12 ] [ 15 ]   MB

Request 12 MB (in order, 1st request):
  first fit:  scan from [0] → first hole ≥ 12 is [2]=20   ✓
  best  fit:  scan all  → smallest ≥ 12 is    [6]=12      ✓
  worst fit:  scan all  → largest is          [2]=20      ✓
  next  fit:  scan from cursor=0 → [2]=20 (cursor→3)       ✓

Request 10 MB (2nd request):
  first fit:  [0]=10 is first ≥10 (skipping now-used [2])
  best  fit:  [0]=10 is smallest ≥10
  worst fit:  [3]=18 is largest remaining
  next  fit:  cursor=3 → [3]=18 (cursor→4)

Request 9 MB (3rd request):
  first fit:  [3]=18 first ≥9 after [0] consumed
  best  fit:  [5]=9
  worst fit:  [7]=15 largest remaining
  next  fit:  cursor=4 → [5]=9 first ≥9 from cursor
```

#### The four fit algorithms

Memory holes tracked in a list. A request of size K picks one hole:

-   **First fit** — first hole ≥ K from the start.
-   **Best fit** — smallest hole ≥ K. Scans whole list. Leaves tiny unusable holes.
-   **Worst fit** — largest hole. Leaves large remainder.
-   **Next fit** — like first fit but starts from position of last allocation.

#### Past-exam Q2 — SOLVED

Holes in order: \[10, 4, 20, 18, 7, 9, 12, 15\] MB. Requests: 12 → 10 → 9.

|  | 12 MB | 10 MB | 9 MB |
| --- | --- | --- | --- |
| First fit | 20 | 10 | 18 |
| Best fit | 12 | 10 | 9 |
| Worst fit | 20 | 18 | 15 |
| Next fit | 20 | 18 | 9 |

Note next fit's first pick = first fit's first pick (20, the first hole ≥ 12). Subsequent picks continue from that position.

#### Buddy system (past-exam Q8) — tree states

```text
STATE 0 (empty):
    [ 1024 free ]

STATE 1 (A requests 200 → round up to 256):
    1024
    ├── 512
    │   ├── 256  ◄── A
    │   └── 256  (free)
    └── 512      (free)

STATE 2 (B requests 50 → round up to 64):
    1024
    ├── 512
    │   ├── 256  ◄── A
    │   └── 256
    │       ├── 128
    │       │   ├── 64  ◄── B
    │       │   └── 64  (free)
    │       └── 128     (free)
    └── 512             (free)

STATE 3 (A releases — buddy holds B, NO coalesce):
    1024
    ├── 512
    │   ├── 256  (free)   ← A's slot, can't merge (buddy busy)
    │   └── 256
    │       ├── 128
    │       │   ├── 64  ◄── B
    │       │   └── 64  (free)
    │       └── 128     (free)
    └── 512             (free)

STATE 4 (C requests 90 → 128 — takes free 128):
    1024
    ├── 512
    │   ├── 256  (free)
    │   └── 256
    │       ├── 128
    │       │   ├── 64  ◄── B
    │       │   └── 64  (free)
    │       └── 128  ◄── C
    └── 512             (free)
```

Memory size = power of 2. On request K, find smallest block ≥ K that is a power of 2. Split larger blocks in half recursively until you reach that size. On free, coalesce with **buddy** (same-size, same-parent block) if buddy is also free.

1024 KB total, min 32 KB.

A requests 200 → round up to 256.
  1024 → split \[512,512\] → split first \[256,256\] → A = first 256.

B requests 50 → round up to 64.
  Take free 256 → \[128,128\] → \[64,64\] → B = first 64.

A releases:
  A's 256 is now free. Check its buddy (the other 256 at the same level).
  Buddy is NOT fully free — its subtree contains B's 64.
  → NO coalesce. A's 256 stays as a free block.

C requests 90 → round up to 128. A free 128 exists in B's subtree
(the sibling of B's 128). C takes that free 128.

> **Takeaway**
> Fit algorithms: memorize which hole each picks. Buddy: always round up to power of 2, always coalesce if buddy free.

> **Q:** In the Q2 hole list, why does worst fit pick 20 then 18 then 15 (not 20, 18, 18)?
> **A:** After the 10 MB request, the 18 became 8 MB remainder (18−10=8). The largest remaining ≥ 9 is now 15.
