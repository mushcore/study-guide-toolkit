---
"n": 1
id: 4736-code-paging-address-translation
title: Paging — address translation
lang: c
tags:
  - paging
  - memory
kind: code
source: "TODO: trace to lab/assignment/past-exam (legacy — needs enrichment)"
---

## Prompt

A machine has 32-bit virtual addresses, 28-bit physical addresses, 16 KB pages. (a) # virtual pages? (b) # frames? (c) PT entries for a single-level linear table? (d) If VP 0x13 maps to frame 0xA2, find physical address of 0x4C321.

## Starter

```c
// Work here:
// offset bits =
// #pages      =
// #frames     =
// PA of 0x4C321 =
```

## Solution

```c
16 KB = 2^14 → offset = 14 bits
# pages   = 2^(32-14) = 2^18
# frames  = 2^(28-14) = 2^14
PT entries (1-level) = 2^18

VA 0x4C321 = 0100 1100 0011 0010 0001
  VP bits (high 18) = 0x13
  offset (low 14 bits) = 0x0C321
  Frame 0xA2 → base = 0xA2 × 2^14 = 0x288000
  PA = 0x288000 + 0x0C321 = 0x294321
```

## Why

Always split by offset bits first. Convert in hex using page-size alignment.
