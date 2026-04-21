---
id: 4736-topic-segmentation-swapping-bitmaps-vs-lists
title: Segmentation, swapping, bitmaps vs lists
pillar: tech
priority: low
chapter: Part 10
tags:
  - memory
---

#### Segmentation vs paging

-   Paging: fixed-size chunks. Hardware simple. Internal frag.
-   Segmentation: variable-size logical units (code/data/stack). External frag. Easy sharing.
-   Segmentation + paging: each segment is paged. Used by Intel x86.

#### Swapping

Move entire process to/from disk. Slow. Predecessor to virtual memory.

#### Bitmap vs linked list memory tracking

|  | Bitmap | Linked list |
| --- | --- | --- |
| Space | 1 bit per unit | Entry per region |
| Search | Find N 0-bits (slow) | Walk list |
| Update | Toggle bits | Insert/merge nodes |
