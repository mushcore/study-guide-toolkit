---
id: 4736-topic-paging-core-formulas
title: Paging — core formulas
pillar: tech
priority: high
chapter: Part 10
tags:
  - paging
  - memory
---

#### Core formulas (MEMORIZE)

```text
offset_bits     = log2(page_size)
#pages          = 2^(virtual_bits  − offset_bits)
#frames         = 2^(physical_bits − offset_bits)
#PT_entries (1-level)  = #pages
physical_addr   = frame_number × page_size + offset
              = x + (a − A)     (x=VA, A=page base, a=frame base)
```

#### Past-exam Q1 worked

```text
48-bit VA, 32-bit PA, 8 KB pages
  8 KB = 2^13 → offset = 13 bits
  #pages  = 2^(48−13) = 2^35
  #frames = 2^(32−13) = 2^19
  PT entries = 2^35
```
