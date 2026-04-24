---
"n": 7
id: 4736-code-optimal-page-size-calculation
title: Optimal page size calculation
lang: c
tags:
  - paging
kind: code
source: "TODO: trace to lab/assignment/past-exam (legacy — needs enrichment)"
---

## Prompt

A process is 4 MB. Each PT entry is 4 bytes. (a) Compute optimal page size p*. (b) Compute overhead at p*. (c) How many PT entries at p*?

## Starter

```c
(a) p* =
(b) overhead =
(c) entries =
```

## Solution

```c
s = 4 MB = 2^22 bytes. e = 4 bytes = 2^2 bytes.
(a) p* = √(2se) = √(2 × 2^22 × 2^2) = √(2^25) = 2^12.5
      ≈ 5793 bytes. Round to 4 KB (2^12) or 8 KB (2^13) — commercial systems prefer 4 KB.

(b) Overhead = p* = √(2^25) ≈ 5793 bytes.

(c) Using p = 4 KB: entries = s/p = 2^22 / 2^12 = 2^10 = 1024 entries.
```

## Why

In practice p is power of 2 → round to nearest practical size. 4 KB is industry standard.
