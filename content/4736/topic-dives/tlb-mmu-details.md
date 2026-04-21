---
id: 4736-topic-tlb-mmu-details
title: TLB + MMU details
pillar: tech
priority: low
chapter: Part 10
tags:
  - paging
  - memory
---

**MMU** = hardware that translates VA→PA via page table. **TLB** = small cache of recent translations inside MMU.

#### Miss types

-   **Hit** — translation in TLB
-   **Soft miss** — not in TLB, page is in memory → refill TLB
-   **Hard miss** — not in TLB, page not in memory → page fault → disk I/O

#### PT entry fields

Present/absent bit, page frame #, protection (R/W/X), modified (dirty), referenced, caching-disabled.

Page Table Entry (32-bit typical):

```text
 31                                          12  11  10  9  8  7  6  5  4  3  2  1  0
┌───────────────────────────────────────────────┬──┬──┬──┬─────────┬──┐
│         Page Frame Number (20 bits)           │Ca│Mo│Re│ Protect │Pr│
└───────────────────────────────────────────────┴──┴──┴──┴─────────┴──┘
                                                 │   │   │     │     │
  Ca = Caching disabled ──────────────────────────┘   │   │     │     │
  Mo = Modified (dirty) bit ──────────────────────────┘   │     │     │
  Re = Referenced bit ────────────────────────────────────┘     │     │
  Protect = R / W / X permissions ──────────────────────────────┘     │
  Pr = Present/absent bit (0 → page fault on access) ─────────────────┘
```

#### TLB lookup flow

flowchart TD CPU\["CPU issues virtual address"\] --> InTLB{"In TLB?"} InTLB -->|yes| Hit\["TLB HIT — use PA"\] InTLB -->|"no — walk page table"| InMem{"In memory? present = 1?"} InMem -->|yes| Soft\["SOFT MISS — refill TLB, use PA"\] InMem -->|no| Hard\["HARD MISS = PAGE FAULT — disk I/O, update PT + TLB, restart instruction"\] classDef ok fill:#2d4a2a,stroke:#9ece6a,color:#9ece6a classDef warn fill:#3d2f1a,stroke:#e0af68,color:#e0af68 classDef bad fill:#4a2d2a,stroke:#f7768e,color:#f7768e class Hit ok class Soft warn class Hard bad
