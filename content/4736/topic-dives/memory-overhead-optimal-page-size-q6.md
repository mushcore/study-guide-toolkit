---
id: 4736-topic-memory-overhead-optimal-page-size-q6
title: Memory overhead & optimal page size (Q6)
pillar: tech
priority: high
chapter: Part 10
tags:
  - paging
  - memory
---

#### Overhead formula

```text
Overhead(p) = s*e/p + p/2
  s = process size
  e = PT entry size
  p = page size
  s*e/p = PT size (every page needs an entry)
  p/2   = avg internal fragmentation (last page half-empty)
```

#### Minimize: take derivative, set to 0

```text
d/dp [s*e/p + p/2] = −s*e/p^2 + 1/2 = 0
  → p^2 = 2se
  → p* = √(2se)

Overhead at p*:  s*e/√(2se) + √(2se)/2
              = √(2se)/2 + √(2se)/2
              = √(2se)
              = p*
```

Classic: s=1 MB, e=8 bytes → p\* = 4 KB.
