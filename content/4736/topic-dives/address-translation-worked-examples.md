---
id: 4736-topic-address-translation-worked-examples
title: Address translation — worked examples
pillar: tech
priority: high
chapter: Part 10
tags:
  - memory
  - paging
---

#### Past-exam Q3 (page size 4K)

```text
Page table (partial):  VP 0→frame 2, VP 1→frame 1,
                       VP 2→frame 6, VP 5→frame 3, VP 7→frame 0
VA 20     → VP 0, offset 20   → PA = 8192 + 20 = 8212
VA 4100   → VP 1, offset 4    → PA = 4096 + 4  = 4100
VA 8300   → VP 2, offset 108  → PA = 24576+108 = 24684
VA 53448  → VP absent (X)     → PAGE FAULT
```

#### Past-exam Q4 (16 4-KB pages)

```text
VA 25012 (0x61B4) = 0110 0001 1011 0100
  VP = 0110 = 6  → entry 000,  present=0 → PAGE FAULT
VA 45493 (0xB1B5) = 1011 0001 1011 0101
  VP = 1011 = 11 → entry 111,  present=1 → frame 7
  PA = 111 + offset = 1110001101101012 = 29109
```
