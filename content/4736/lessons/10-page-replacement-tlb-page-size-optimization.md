---
"n": 10
id: 4736-lesson-page-replacement-tlb-page-size-optimization
title: Page replacement + TLB + page size optimization
hook: The "which page to evict" algorithms, the cache that skips the page table, and the formula for optimal page size.
tags:
  - paging
module: Memory & Paging
---

#### Page replacement algorithms

-   **Optimal** — evict page used furthest in the future. Unimplementable (requires future knowledge). Benchmark only.
-   **FIFO** — evict oldest-loaded. Simple. Suffers **Belady's anomaly** (more frames → more faults, sometimes).
-   **Second Chance** — FIFO but skip pages with referenced bit set (clear bit, move to back).
-   **Clock** — Second Chance using a circular list + hand pointer.
-   **LRU** — evict Least Recently Used. Expensive to implement perfectly.
-   **NFU** — evict Not Frequently Used (counter per page).
-   **Aging** — improved NFU using shifted counters with the referenced bit.
-   **Working Set** / **WSClock** — evict pages outside the process's working set.

<svg viewBox="0 0 720 280" preserveAspectRatio="xMidYMid meet"><text x="20" y="22" class="label-accent">Three frames, reference string 1 2 3 4 1 2 5 1 2 3 4 5</text><text x="20" y="50" class="label">ref →</text><text x="100" y="50" class="sub">1</text><text x="148" y="50" class="sub">2</text><text x="196" y="50" class="sub">3</text><text x="244" y="50" class="sub">4</text><text x="292" y="50" class="sub">1</text><text x="340" y="50" class="sub">2</text><text x="388" y="50" class="sub">5</text><text x="436" y="50" class="sub">1</text><text x="484" y="50" class="sub">2</text><text x="532" y="50" class="sub">3</text><text x="580" y="50" class="sub">4</text><text x="628" y="50" class="sub">5</text><text x="20" y="80" class="label">FIFO</text><rect x="80" y="65" width="40" height="22" class="box-bad"></rect><rect x="128" y="65" width="40" height="22" class="box-bad"></rect><rect x="176" y="65" width="40" height="22" class="box-bad"></rect><rect x="224" y="65" width="40" height="22" class="box-bad"></rect><rect x="272" y="65" width="40" height="22" class="box-bad"></rect><rect x="320" y="65" width="40" height="22" class="box-bad"></rect><rect x="368" y="65" width="40" height="22" class="box-bad"></rect><rect x="416" y="65" width="40" height="22" class="box-ok"></rect><rect x="464" y="65" width="40" height="22" class="box-ok"></rect><rect x="512" y="65" width="40" height="22" class="box-bad"></rect><rect x="560" y="65" width="40" height="22" class="box-bad"></rect><rect x="608" y="65" width="40" height="22" class="box-bad"></rect><text x="668" y="80" class="sub">9 faults</text><text x="20" y="120" class="label">LRU</text><rect x="80" y="105" width="40" height="22" class="box-bad"></rect><rect x="128" y="105" width="40" height="22" class="box-bad"></rect><rect x="176" y="105" width="40" height="22" class="box-bad"></rect><rect x="224" y="105" width="40" height="22" class="box-bad"></rect><rect x="272" y="105" width="40" height="22" class="box-bad"></rect><rect x="320" y="105" width="40" height="22" class="box-bad"></rect><rect x="368" y="105" width="40" height="22" class="box-bad"></rect><rect x="416" y="105" width="40" height="22" class="box-ok"></rect><rect x="464" y="105" width="40" height="22" class="box-ok"></rect><rect x="512" y="105" width="40" height="22" class="box-bad"></rect><rect x="560" y="105" width="40" height="22" class="box-bad"></rect><rect x="608" y="105" width="40" height="22" class="box-bad"></rect><text x="668" y="120" class="sub">9 faults</text><text x="20" y="160" class="label">OPT</text><rect x="80" y="145" width="40" height="22" class="box-bad"></rect><rect x="128" y="145" width="40" height="22" class="box-bad"></rect><rect x="176" y="145" width="40" height="22" class="box-bad"></rect><rect x="224" y="145" width="40" height="22" class="box-bad"></rect><rect x="272" y="145" width="40" height="22" class="box-ok"></rect><rect x="320" y="145" width="40" height="22" class="box-ok"></rect><rect x="368" y="145" width="40" height="22" class="box-bad"></rect><rect x="416" y="145" width="40" height="22" class="box-ok"></rect><rect x="464" y="145" width="40" height="22" class="box-ok"></rect><rect x="512" y="145" width="40" height="22" class="box-bad"></rect><rect x="560" y="145" width="40" height="22" class="box-bad"></rect><rect x="608" y="145" width="40" height="22" class="box-ok"></rect><text x="668" y="160" class="sub">7 faults ★</text><rect x="40" y="195" width="20" height="14" class="box-bad"></rect><text x="65" y="207" class="sub">page fault (eviction)</text><rect x="200" y="195" width="20" height="14" class="box-ok"></rect><text x="225" y="207" class="sub">hit (no fault)</text><text x="20" y="240" class="sub">OPT is the unimplementable lower bound — knows the future. FIFO suffers Belady's anomaly:</text><text x="20" y="256" class="sub">adding a fourth frame can INCREASE faults on the same string. LRU never does.</text></svg>

#### TLB

Small associative cache of recent virtual→physical translations. Sits in MMU.

-   **TLB hit** — translation found, no page table walk.
-   **Soft miss** — not in TLB, but page is in memory. Update TLB; no disk.
-   **Hard miss** — not in TLB, page not in memory. Requires disk I/O. This is a **page fault**.

<svg viewBox="0 0 720 280" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrTLB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">CPU memory access — three outcomes</text><rect x="280" y="50" width="160" height="40" class="box" rx="4"></rect><text x="360" y="74" text-anchor="middle" class="label">CPU emits VA</text><path d="M360 90 L360 110" class="arrow-line" marker-end="url(#arrTLB)"></path><rect x="280" y="110" width="160" height="40" class="box-accent" rx="4"></rect><text x="360" y="134" text-anchor="middle" class="label">TLB lookup</text><path d="M340 150 L120 200" class="arrow-line" marker-end="url(#arrTLB)"></path><path d="M360 150 L360 200" class="arrow-line" marker-end="url(#arrTLB)"></path><path d="M380 150 L600 200" class="arrow-line" marker-end="url(#arrTLB)"></path><rect x="20" y="200" width="200" height="60" class="box-ok" rx="6"></rect><text x="120" y="222" text-anchor="middle" class="label">TLB hit</text><text x="120" y="240" text-anchor="middle" class="sub">~1 ns · no PT walk</text><text x="120" y="254" text-anchor="middle" class="sub">use cached frame</text><rect x="260" y="200" width="200" height="60" class="box-warn" rx="6"></rect><text x="360" y="222" text-anchor="middle" class="label">Soft miss</text><text x="360" y="240" text-anchor="middle" class="sub">walk PT (in RAM) · update TLB</text><text x="360" y="254" text-anchor="middle" class="sub">~100 ns · NO disk</text><rect x="500" y="200" width="200" height="60" class="box-bad" rx="6"></rect><text x="600" y="222" text-anchor="middle" class="label">Hard miss = PAGE FAULT</text><text x="600" y="240" text-anchor="middle" class="sub">page on disk · read in</text><text x="600" y="254" text-anchor="middle" class="sub">~10 ms · evict if full</text></svg>

#### Optimal page size (past-exam Q6)

```text
Overhead = s*e/p + p/2
  s = process size, e = PT entry size, p = page size
Minimize:  d/dp (s*e/p + p/2) = 0
           → -s*e/p^2 + 1/2 = 0
           → p* = √(2*s*e)
Overhead at p* = s*e/√(2se) + √(2se)/2 = √(2se) = p*
```

Larger p → smaller PT, more internal fragmentation. Smaller p → bigger PT, less fragmentation. p\* = √(2se) is the sweet spot.

<svg viewBox="0 0 720 320" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrPS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Total overhead O(p) = s·e/p + p/2  — minimum at p* = √(2se)</text><line x1="80" y1="270" x2="680" y2="270" class="arrow-line" marker-end="url(#arrPS)"></line><line x1="80" y1="50" x2="80" y2="280" class="arrow-line"></line><text x="690" y="285" class="sub">page size p</text><text x="60" y="60" text-anchor="end" class="sub">overhead</text><path d="M100 80 Q120 100 140 130 Q160 160 200 200 Q260 240 380 250" class="arrow-line" stroke="#f7768e"></path><text x="120" y="90" class="sub">PT cost: s·e/p</text><path d="M380 250 Q500 220 600 130 Q640 90 680 70" class="arrow-line" stroke="#e3af68"></path><text x="600" y="90" class="sub">fragmentation: p/2</text><path d="M100 110 Q200 200 380 220 Q500 200 680 100" class="arrow-line" stroke="#7aa2f7" stroke-width="2"></path><text x="430" y="200" class="sub">total = O(p)</text><circle cx="380" cy="220" r="5" fill="#9ece6a"></circle><line x1="380" y1="220" x2="380" y2="270" class="arrow-line dashed"></line><text x="380" y="290" text-anchor="middle" class="label-accent">p* = √(2se)</text><line x1="80" y1="220" x2="380" y2="220" class="arrow-line dashed"></line><text x="60" y="225" text-anchor="end" class="sub">O(p*) = √(2se)</text><rect x="440" y="60" width="240" height="20" class="box"></rect><line x1="450" y1="70" x2="470" y2="70" class="arrow-line" stroke="#f7768e"></line><text x="475" y="74" class="sub">PT cost</text><line x1="540" y1="70" x2="560" y2="70" class="arrow-line" stroke="#e3af68"></line><text x="565" y="74" class="sub">fragmentation</text><line x1="635" y1="70" x2="655" y2="70" class="arrow-line" stroke="#7aa2f7" stroke-width="2"></line><text x="660" y="74" class="sub">total</text></svg>

#### Thrashing

System spends more time paging than executing. Occurs when sum of working sets > physical memory. Remedy: reduce degree of multiprogramming.

> **Takeaway**
> FIFO can be beaten by Second Chance / Clock with almost no extra cost. LRU is great but expensive. Hard miss = page fault (disk I/O). p\* = √(2se).

> **Q:** Process size 1 MB, page table entry 8 bytes. Optimal page size?
> **A:** p\* = √(2 × 2^20 × 8) = √(2^24) = **2^12 = 4 KB**. This is why 4 KB is the typical OS page size.
