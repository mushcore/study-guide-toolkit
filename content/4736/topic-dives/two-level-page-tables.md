---
id: 4736-topic-two-level-page-tables
title: Two-level page tables
pillar: tech
priority: high
chapter: Part 10
tags:
  - paging
  - memory
---

#### Virtual address split

Split VA into **(top-level index, second-level index, offset)**. Walk top table → second table → frame.

#### Past-exam Q7 (6-bit VA, 2/2/2 split)

```text
Address 37 (100101) = 10 01 01
  top=2, second=1, offset=1
  Second-level[2][1] = PF 2
  Physical = 2*4 + 1 = 9

Address 25 (011001) = 01 10 01
  top=1, second=2 → entry marked X → PAGE FAULT

Address 62 (111110) = 11 11 10
  top=3, second=3, offset=2
  Second-level[3][3] = PF 4
  Physical = 4*4 + 2 = 18
```
