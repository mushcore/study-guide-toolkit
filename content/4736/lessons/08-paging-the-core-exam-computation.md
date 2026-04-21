---
"n": 8
id: 4736-lesson-paging-the-core-exam-computation
title: Paging — the core exam computation
hook: >-
  Virtual addresses get split into (page #, offset). Page table maps page # to frame #. Physical addr = frame # × page
  size + offset. Memorize.
tags:
  - paging
module: Memory & Paging
---

Paging splits virtual memory into fixed-size **pages** and physical memory into equal-size **frames**. A **page table** maps page → frame.

> **Analogy**
> **Why powers of 2, and why split at all?** Hardware can't do arbitrary division at memory-access speed. If page size is 2^k, the high bits of the virtual address ARE the page number and the low bits ARE the offset — a pure bit-slice, no arithmetic. The OS caches recent translations in a tiny hardware table (the TLB); fixed-size pages make that cache fast and simple. This is why every real OS uses page sizes like 4 KB, 8 KB, 2 MB — always 2^k.

#### The MMU in one picture

flowchart LR VA\["Virtual Address — page# + offset"\] --> PT\["Page Table lookup PT page#"\] PT -->|"present = 0"| PF\["PAGE FAULT — OS handles"\] PT -->|"present = 1 — copy frame#"| PA\["Physical Address — frame# + offset"\] classDef danger fill:#4a2d2a,stroke:#f7768e,color:#f7768e classDef ok fill:#2a3a4a,stroke:#7aa2f7,color:#e5e5e5 class PF danger class PA ok

#### Key formulas (COMMIT TO MEMORY)

```text
offset_bits   = log2(page_size)
#pages        = 2^(virtual_bits - offset_bits)
#frames       = 2^(physical_bits - offset_bits)
#PT_entries   = #pages        (one-level linear)

physical_addr = frame# * page_size + offset
             = x + (a - A)  where x = virtual addr,
                            A = virtual page base,
                            a = physical frame base
```

#### Worked example (past-exam Q1)

48-bit virtual, 32-bit physical, 8 KB pages.

```text
8 KB = 2^13 → offset = 13 bits
#pages  = 2^48 / 2^13 = 2^35
#frames = 2^32 / 2^13 = 2^19
PT entries = 2^35     (one entry per virtual page)
```

#### Worked example (past-exam Q3)

Page size = 4 K (inferred from figure: 64K − 60K = 4K). Virtual space 0–64K has 16 pages; physical memory has 8 frames (0–32K). The figure's page table, transcribed:

| VP | Frame | VP | Frame |
| --- | --- | --- | --- |
| 0 | 2 | 8 | X (absent) |
| 1 | 1 | 9 | 5 |
| 2 | 6 | 10 | X |
| 3 | 0 | 11 | 7 |
| 4 | 4 | 12 | X |
| 5 | 3 | 13–15 | X |
| 6 | X |  |  |
| 7 | X |  |  |

Read each row left-to-right in the PDF figure; X = present/absent bit = 0 → page fault on access.

<svg viewBox="0 0 720 460" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrPG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">16 virtual pages → 8 physical frames (X = page fault)</text><text x="80" y="50" text-anchor="middle" class="label">Virtual pages</text><text x="80" y="64" text-anchor="middle" class="sub">0–64K, 4K each</text><text x="540" y="50" text-anchor="middle" class="label">Physical frames</text><text x="540" y="64" text-anchor="middle" class="sub">0–32K, 4K each</text><rect x="20" y="80" width="120" height="22" class="box-accent"></rect><text x="80" y="96" text-anchor="middle" class="sub">VP 0 → frame 2</text><rect x="20" y="103" width="120" height="22" class="box-accent"></rect><text x="80" y="119" text-anchor="middle" class="sub">VP 1 → frame 1</text><rect x="20" y="126" width="120" height="22" class="box-accent"></rect><text x="80" y="142" text-anchor="middle" class="sub">VP 2 → frame 6</text><rect x="20" y="149" width="120" height="22" class="box-accent"></rect><text x="80" y="165" text-anchor="middle" class="sub">VP 3 → frame 0</text><rect x="20" y="172" width="120" height="22" class="box-accent"></rect><text x="80" y="188" text-anchor="middle" class="sub">VP 4 → frame 4</text><rect x="20" y="195" width="120" height="22" class="box-accent"></rect><text x="80" y="211" text-anchor="middle" class="sub">VP 5 → frame 3</text><rect x="20" y="218" width="120" height="22" class="box-bad"></rect><text x="80" y="234" text-anchor="middle" class="sub">VP 6 → X (fault)</text><rect x="20" y="241" width="120" height="22" class="box-bad"></rect><text x="80" y="257" text-anchor="middle" class="sub">VP 7 → X (fault)</text><rect x="20" y="264" width="120" height="22" class="box-bad"></rect><text x="80" y="280" text-anchor="middle" class="sub">VP 8 → X</text><rect x="20" y="287" width="120" height="22" class="box-accent"></rect><text x="80" y="303" text-anchor="middle" class="sub">VP 9 → frame 5</text><rect x="20" y="310" width="120" height="22" class="box-bad"></rect><text x="80" y="326" text-anchor="middle" class="sub">VP 10 → X</text><rect x="20" y="333" width="120" height="22" class="box-accent"></rect><text x="80" y="349" text-anchor="middle" class="sub">VP 11 → frame 7</text><rect x="20" y="356" width="120" height="22" class="box-bad"></rect><text x="80" y="372" text-anchor="middle" class="sub">VP 12–15 → X (all fault)</text><rect x="480" y="80" width="120" height="32" class="box-accent"></rect><text x="540" y="100" text-anchor="middle" class="sub">F0 (0K) ← VP3</text><rect x="480" y="113" width="120" height="32" class="box-accent"></rect><text x="540" y="133" text-anchor="middle" class="sub">F1 (4K) ← VP1</text><rect x="480" y="146" width="120" height="32" class="box-accent"></rect><text x="540" y="166" text-anchor="middle" class="sub">F2 (8K) ← VP0</text><rect x="480" y="179" width="120" height="32" class="box-accent"></rect><text x="540" y="199" text-anchor="middle" class="sub">F3 (12K) ← VP5</text><rect x="480" y="212" width="120" height="32" class="box-accent"></rect><text x="540" y="232" text-anchor="middle" class="sub">F4 (16K) ← VP4</text><rect x="480" y="245" width="120" height="32" class="box-accent"></rect><text x="540" y="265" text-anchor="middle" class="sub">F5 (20K) ← VP9</text><rect x="480" y="278" width="120" height="32" class="box-accent"></rect><text x="540" y="298" text-anchor="middle" class="sub">F6 (24K) ← VP2</text><rect x="480" y="311" width="120" height="32" class="box-accent"></rect><text x="540" y="331" text-anchor="middle" class="sub">F7 (28K) ← VP11</text><path d="M140 91 Q310 91 480 162" class="arrow-line" marker-end="url(#arrPG)"></path><path d="M140 114 Q310 114 480 129" class="arrow-line" marker-end="url(#arrPG)"></path><path d="M140 137 Q310 137 480 294" class="arrow-line" marker-end="url(#arrPG)"></path><path d="M140 160 Q310 160 480 96" class="arrow-line" marker-end="url(#arrPG)"></path><path d="M140 183 Q310 183 480 228" class="arrow-line" marker-end="url(#arrPG)"></path><path d="M140 206 Q310 206 480 195" class="arrow-line" marker-end="url(#arrPG)"></path><path d="M140 298 Q310 298 480 261" class="arrow-line" marker-end="url(#arrPG)"></path><path d="M140 344 Q310 344 480 327" class="arrow-line" marker-end="url(#arrPG)"></path><rect x="160" y="395" width="400" height="55" class="box-warn" rx="4"></rect><text x="360" y="416" text-anchor="middle" class="label">VA 53448 → page = 53448 / 4096 = 13</text><text x="360" y="434" text-anchor="middle" class="sub">VP 13 marked X → MMU raises PAGE FAULT (no frame to use)</text></svg>

```text
Address 20 (page 0):
  page 0 maps to frame 2 (8K-12K, i.e. base 8192)
  offset = 20
  physical = 8192 + 20 = 8212

Address 4100 (page 1):
  page 1 maps to frame 1 (4K-8K, base 4096)
  offset = 4100 - 4096 = 4
  physical = 4096 + 4 = 4100

Address 8300 (page 2):  page 2 → frame 6 (24K) → physical = 24576 + 108 = 24684
Address 53448:          falls in page marked X (absent) → PAGE FAULT
```

#### Two-level page table (past-exam Q7)

Virtual addr split into **(top-level index, second-level index, offset)**. Walk top table → second table → frame.

<svg viewBox="0 0 720 360" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrTL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Two-level walk: VA 37 = 100101 (6 bits)</text><rect x="40" y="50" width="60" height="40" class="box-accent"></rect><text x="70" y="74" text-anchor="middle" class="label">10</text><rect x="100" y="50" width="60" height="40" class="box-accent"></rect><text x="130" y="74" text-anchor="middle" class="label">01</text><rect x="160" y="50" width="60" height="40" class="box"></rect><text x="190" y="74" text-anchor="middle" class="label">01</text><text x="70" y="106" text-anchor="middle" class="sub">top = 2</text><text x="130" y="106" text-anchor="middle" class="sub">2nd = 1</text><text x="190" y="106" text-anchor="middle" class="sub">offset = 1</text><rect x="280" y="50" width="160" height="180" class="box" rx="4"></rect><text x="360" y="70" text-anchor="middle" class="label">Top-level table</text><rect x="290" y="80" width="140" height="22" class="box"></rect><text x="360" y="96" text-anchor="middle" class="sub">[0] → table A</text><rect x="290" y="103" width="140" height="22" class="box"></rect><text x="360" y="119" text-anchor="middle" class="sub">[1] → table B</text><rect x="290" y="126" width="140" height="22" class="box-accent"></rect><text x="360" y="142" text-anchor="middle" class="sub">[2] → table C ★</text><rect x="290" y="149" width="140" height="22" class="box"></rect><text x="360" y="165" text-anchor="middle" class="sub">[3] → table D</text><path d="M70 90 Q120 130 290 137" class="arrow-line" marker-end="url(#arrTL)"></path><text x="200" y="135" class="sub">index 2</text><rect x="500" y="50" width="160" height="180" class="box" rx="4"></rect><text x="580" y="70" text-anchor="middle" class="label">2nd-level table C</text><rect x="510" y="80" width="140" height="22" class="box"></rect><text x="580" y="96" text-anchor="middle" class="sub">[0] → frame 5</text><rect x="510" y="103" width="140" height="22" class="box-accent"></rect><text x="580" y="119" text-anchor="middle" class="sub">[1] → frame 2 ★</text><rect x="510" y="126" width="140" height="22" class="box"></rect><text x="580" y="142" text-anchor="middle" class="sub">[2] → frame 9</text><rect x="510" y="149" width="140" height="22" class="box"></rect><text x="580" y="165" text-anchor="middle" class="sub">[3] → frame X</text><path d="M430 137 Q470 137 510 114" class="arrow-line" marker-end="url(#arrTL)"></path><text x="450" y="125" class="sub">walk</text><rect x="160" y="270" width="400" height="60" class="box-ok" rx="6"></rect><text x="360" y="293" text-anchor="middle" class="label">PA = frame# × page_size + offset</text><text x="360" y="312" text-anchor="middle" class="sub">= 2 × 4 + 1 = 9</text><path d="M580 230 Q580 250 360 270" class="arrow-line" marker-end="url(#arrTL)"></path><text x="510" y="260" class="sub">frame 2</text><path d="M190 110 Q190 200 360 270" class="arrow-line" marker-end="url(#arrTL)"></path><text x="240" y="230" class="sub">offset 1</text></svg>

```text
Virtual addr 37 = 1 0 0 1 0 1     (6-bit VA)
                  └─┬─┘ └─┬─┘ └─┬─┘
                  top    2nd   offset
                 (5-4)  (3-2)  (1-0)
                  = 2    = 1    = 1
                    │      │      │
                    ▼      │      │
          top-level table  │      │
              [2]  ────►   │      │
                           ▼      │
              second-level table  │
                   [2][1] = PF 2  │
                           │      │
                           └───┬──┘
                               ▼
                   PA = PF × page_size + offset
                      = 2  ×     4     +    1
                      = 9

6-bit VA, 2-bit offset, 2-bit top, 2-bit second
Address 37 = 100101 → top=10=2, second=01=1, offset=01=1
Second table[2][1] = PF 2 → physical = 2*4 + 1 = 9
```

> **Takeaway**
> Four numbers dominate: #pages, #frames, offset, frame number. Do the arithmetic in powers of 2 when possible. If PT entry shows "X" or absent bit = 0 → PAGE FAULT.

**Common mistakes.**

-   **Using virtual bits when computing #frames.** #pages uses virtual\_bits − offset; #frames uses physical\_bits − offset. Past-exam Q1 trips students who grab the wrong base.
-   **Ignoring the present/absent bit.** The MMU checks it BEFORE using the frame number. Entry value "X" in the figure or present=0 means page fault — not frame 0, not zero physical address (past-exam Q3 VA 53448, Q4 VA 25012).
-   **Mixing up the two address formulas.** PA = frame# × page\_size + offset (from raw frame number) or PA = x + (a − A) (from bases). Both are valid; pick one and stick with it per question.
-   **Computing offset as VA mod #pages.** Offset = VA − (VP × page\_size), i.e. VA mod page\_size. Mixing the two gives nonsense.
-   **Two-level: splitting bits the wrong way.** Leftmost = top-level index, middle = second-level, rightmost = offset. Past-exam Q7 marks each carefully — swap any two and every answer is wrong.

> **Q:** 32-bit VA, 4 KB pages. How many entries in a single-level page table?
> **A:** offset = log2(4K) = 12. Entries = 2^(32−12) = 2^20 = **1,048,576**.
