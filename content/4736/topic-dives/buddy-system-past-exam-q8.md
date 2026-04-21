---
id: 4736-topic-buddy-system-past-exam-q8
title: Buddy system — past-exam Q8
pillar: tech
priority: high
chapter: Part 10
tags:
  - allocation
  - memory
---

Blocks are powers of 2. On alloc, split larger blocks until smallest power-of-2 ≥ request. On free, coalesce with buddy (same-size, same-parent) if buddy is free.

#### 1024 KB, min 32 KB, sequence A(200), B(50), A frees, C(90)

```text
A requests 200 → round up to 256
  1024 → [512, 512] → [256, 256, 512]. A gets first 256.

B requests 50 → round up to 64
  Use A's sibling 256 → [128, 128] → [64, 64]. B gets one 64.

A releases 256:
  A's buddy is the OTHER 256 at A's level — and that 256
  is NOT wholly free (it contains B's 64-byte subtree).
  → NO coalesce. A's 256 stays free, next to the B-subtree 256.

C requests 90 → round up to 128
  A free 128 sits in the B-subtree (B's 128-level sibling).
  C takes that 128 directly; no further splitting.
```

Coalesce rule: two blocks merge only if BOTH are fully free. A busy descendant anywhere in the buddy's subtree blocks the merge.
