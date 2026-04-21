---
"n": 3
id: 4736-code-buddy-system-tree
title: Buddy system tree
lang: c
tags:
  - allocation
---

## Prompt

Memory 512 KB, min 32 KB. Allocate: X(100), Y(40), Z(40). Then free X. Draw the tree at each step and show block sizes.

## Starter

```c
X(100):

Y(40):

Z(40):

Free X:
```

## Solution

```c
X(100 → 128):
  512 → [256, 256] → first 256 → [128, 128] → X gets first 128.

Y(40 → 64):
  Use free 128 (X's sibling) → [64, 64] → Y gets first 64.

Z(40 → 64):
  Use free 64 (Y's sibling) → Z gets it.

Free X:
  X's buddy was split (holds Y, Z) → cannot coalesce. X's 128 stays free.
  Final: [ 128 free, 128 / [64=Y, 64=Z] ], 256 free
```

## Why

Always round up to power of 2. Coalesce only if buddy is WHOLLY free.
