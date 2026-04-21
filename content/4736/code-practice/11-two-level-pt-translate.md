---
n: 11
id: two-level-pt-translate
title: "Two-level page table — translate 3 VAs (past-exam Q7)"
lang: text
tags: [paging, memory, multilevel]
---

## Prompt

A two-level page table covers a **6-bit virtual address space** with the split **2 bits top | 2 bits second | 2 bits offset**. The top-level table has 4 entries (one per top index 0..3), and each second-level table has 4 entries. Page and frame size = 4 bytes. Physical memory = 32 bytes (8 frames × 4 B).

Top-level page table and second-level tables are shown. `X` in a second-level table's PF column means "page not present".

Translate:

1. **37 (0x25)**
2. **25 (0x19)**
3. **62 (0x3E)**

<svg viewBox="0 0 780 520" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto" font-family="ui-monospace, monospace" font-size="12">
  <style>
    .cell    { fill: #1f2430; stroke: #565f89; stroke-width: 1; }
    .hdr     { fill: #24283b; stroke: #7aa2f7; stroke-width: 1.5; }
    .t       { fill: #c0caf5; }
    .x       { fill: #f7768e; font-weight: 700; }
    .pf      { fill: #9ece6a; font-weight: 700; }
    .title   { fill: #e0af68; font-size: 13px; font-weight: 700; }
    .group0  { fill: #2b2f3a; }
    .group1  { fill: #2d2a1f; }
    .group2  { fill: #1f2d28; }
    .group3  { fill: #2a1f2d; }
  </style>
  <!-- Top-level page table -->
  <text class="title" x="20" y="20">Top-level PT (index=top 2 bits)</text>
  <rect class="hdr" x="20" y="30" width="140" height="24" />
  <text class="t" x="40"  y="47">Top idx</text>
  <text class="t" x="110" y="47">→ 2nd</text>
  <g>
    <rect class="cell" x="20" y="54"  width="140" height="28" /><text class="t" x="40" y="73">3</text><text class="t" x="110" y="73">PT₃</text>
    <rect class="cell" x="20" y="82"  width="140" height="28" /><text class="t" x="40" y="101">2</text><text class="t" x="110" y="101">PT₂</text>
    <rect class="cell" x="20" y="110" width="140" height="28" /><text class="t" x="40" y="129">1</text><text class="t" x="110" y="129">PT₁</text>
    <rect class="cell" x="20" y="138" width="140" height="28" /><text class="t" x="40" y="157">0</text><text class="t" x="110" y="157">PT₀</text>
  </g>
  <!-- Second-level tables (one per top index, stacked) -->
  <text class="title" x="220" y="20">Second-level PTs — (2nd idx → frame#, or X)</text>
  <!-- PT₃ -->
  <rect class="group0" x="200" y="30" width="200" height="120" />
  <text class="title" x="210" y="48">PT₃ (top=3)</text>
  <g>
    <rect class="cell" x="220" y="54"  width="160" height="22" /><text class="t" x="240" y="70">2nd=3</text><text class="pf" x="360" y="70">4</text>
    <rect class="cell" x="220" y="76"  width="160" height="22" /><text class="t" x="240" y="92">2nd=2</text><text class="x"  x="360" y="92">X</text>
    <rect class="cell" x="220" y="98"  width="160" height="22" /><text class="t" x="240" y="114">2nd=1</text><text class="x"  x="360" y="114">X</text>
    <rect class="cell" x="220" y="120" width="160" height="22" /><text class="t" x="240" y="136">2nd=0</text><text class="pf" x="360" y="136">3</text>
  </g>
  <!-- PT₂ -->
  <rect class="group1" x="200" y="160" width="200" height="120" />
  <text class="title" x="210" y="178">PT₂ (top=2)</text>
  <g>
    <rect class="cell" x="220" y="184" width="160" height="22" /><text class="t" x="240" y="200">2nd=3</text><text class="pf" x="360" y="200">0</text>
    <rect class="cell" x="220" y="206" width="160" height="22" /><text class="t" x="240" y="222">2nd=2</text><text class="x"  x="360" y="222">X</text>
    <rect class="cell" x="220" y="228" width="160" height="22" /><text class="t" x="240" y="244">2nd=1</text><text class="pf" x="360" y="244">2</text>
    <rect class="cell" x="220" y="250" width="160" height="22" /><text class="t" x="240" y="266">2nd=0</text><text class="x"  x="360" y="266">X</text>
  </g>
  <!-- PT₁ -->
  <rect class="group2" x="420" y="30" width="200" height="120" />
  <text class="title" x="430" y="48">PT₁ (top=1)</text>
  <g>
    <rect class="cell" x="440" y="54"  width="160" height="22" /><text class="t" x="460" y="70">2nd=3</text><text class="x"  x="580" y="70">X</text>
    <rect class="cell" x="440" y="76"  width="160" height="22" /><text class="t" x="460" y="92">2nd=2</text><text class="x"  x="580" y="92">X</text>
    <rect class="cell" x="440" y="98"  width="160" height="22" /><text class="t" x="460" y="114">2nd=1</text><text class="pf" x="580" y="114">7</text>
    <rect class="cell" x="440" y="120" width="160" height="22" /><text class="t" x="460" y="136">2nd=0</text><text class="pf" x="580" y="136">5</text>
  </g>
  <!-- PT₀ -->
  <rect class="group3" x="420" y="160" width="200" height="120" />
  <text class="title" x="430" y="178">PT₀ (top=0)</text>
  <g>
    <rect class="cell" x="440" y="184" width="160" height="22" /><text class="t" x="460" y="200">2nd=3</text><text class="pf" x="580" y="200">6</text>
    <rect class="cell" x="440" y="206" width="160" height="22" /><text class="t" x="460" y="222">2nd=2</text><text class="pf" x="580" y="222">1</text>
    <rect class="cell" x="440" y="228" width="160" height="22" /><text class="t" x="460" y="244">2nd=1</text><text class="x"  x="580" y="244">X</text>
    <rect class="cell" x="440" y="250" width="160" height="22" /><text class="t" x="460" y="266">2nd=0</text><text class="x"  x="580" y="266">X</text>
  </g>
  <!-- Physical memory -->
  <text class="title" x="660" y="20">Physical memory (8 frames × 4 B)</text>
  <rect class="hdr" x="660" y="30" width="100" height="24" />
  <text class="t" x="680" y="47">Frame</text>
  <g>
    <rect class="cell" x="660" y="54"  width="100" height="22" /><text class="t" x="680" y="70">7 (28-32)</text>
    <rect class="cell" x="660" y="76"  width="100" height="22" /><text class="t" x="680" y="92">6 (24-28)</text>
    <rect class="cell" x="660" y="98"  width="100" height="22" /><text class="t" x="680" y="114">5 (20-24)</text>
    <rect class="cell" x="660" y="120" width="100" height="22" /><text class="t" x="680" y="136">4 (16-20)</text>
    <rect class="cell" x="660" y="142" width="100" height="22" /><text class="t" x="680" y="158">3 (12-16)</text>
    <rect class="cell" x="660" y="164" width="100" height="22" /><text class="t" x="680" y="180">2 (8-12)</text>
    <rect class="cell" x="660" y="186" width="100" height="22" /><text class="t" x="680" y="202">1 (4-8)</text>
    <rect class="cell" x="660" y="208" width="100" height="22" /><text class="t" x="680" y="224">0 (0-4)</text>
  </g>
  <!-- Bit-split legend -->
  <text class="title" x="20" y="320">6-bit VA split</text>
  <rect class="cell" x="20" y="330" width="80" height="30" /><text class="t" x="60" y="350" text-anchor="middle">Top (2)</text>
  <rect class="cell" x="100" y="330" width="80" height="30" /><text class="t" x="140" y="350" text-anchor="middle">2nd (2)</text>
  <rect class="cell" x="180" y="330" width="80" height="30" /><text class="t" x="220" y="350" text-anchor="middle">Offset (2)</text>
</svg>

**Additional questions** (part of Q7):

- **(a)** Size of virtual address space and physical memory.
- **(b)** Page and page frame size.

## Starter

```text
(a) Virtual address space size  = ?
    Physical memory size        = ?

(b) Page size   = ?
    Frame size  = ?

(c) For each VA: split into top/second/offset, look up second-level PT,
    then compute physical address = frame × frame_size + offset.

VA 37 (100101)  → top=?, 2nd=?, offset=? ; PT=?, frame=? ; PA=?
VA 25 (011001)  → top=?, 2nd=?, offset=? ; PT=?, frame=? ; PA=?
VA 62 (111110)  → top=?, 2nd=?, offset=? ; PT=?, frame=? ; PA=?
```

## Solution

```text
(a) Virtual address space = 2^6 = 64 bytes
    Physical memory       = 8 frames × 4 B = 32 bytes

(b) Page size  = 4 bytes   (offset is 2 bits → 2^2 = 4)
    Frame size = 4 bytes   (must match page size)

(c) VA 37 (100101) → top=10₂=2, 2nd=01₂=1, offset=01₂=1
    PT₂[2nd=1] = frame 2
    PA = 2 × 4 + 1 = **9**

    VA 25 (011001) → top=01₂=1, 2nd=10₂=2, offset=01₂=1
    PT₁[2nd=2] = X
    PA = **PAGE FAULT**

    VA 62 (111110) → top=11₂=3, 2nd=11₂=3, offset=10₂=2
    PT₃[2nd=3] = frame 4
    PA = 4 × 4 + 2 = **18**
```

## Why

Multi-level translation is a chain of lookups. Each chunk of bits selects the next table; the final offset is concatenated directly onto the selected frame. In this 2/2/2 split:

1. **Top 2 bits** index the top-level table, which points to a second-level table.
2. **Next 2 bits** index that second-level table, which holds the frame number (or `X`).
3. **Last 2 bits** are the offset, concatenated directly onto `frame × frame_size` to form the physical address.

- VA 37 = 100101₂. Top=2 → PT₂. 2nd=1 → frame 2. Frame 2 covers physical range `8-12` (exclusive upper); adding offset 1 gives PA = 8 + 1 = **9**.
- VA 25 = 011001₂. Top=1 → PT₁. 2nd=2 → `X`. The page is not present → **page fault**.
- VA 62 = 111110₂. Top=3 → PT₃. 2nd=3 → frame 4. Frame 4 covers `16-20` (exclusive upper); adding offset 2 gives PA = 16 + 2 = **18**.

The key advantage of two-level translation: if an entire top-level region is unused, the OS can omit its second-level table. Compare with a single-level table for the same 6-bit VA: 16 entries (one per virtual page) whether used or not. Here we store 4 top-level entries plus second-level tables only for regions in use. For a 64-bit address space, this saving is the difference between infeasible and tractable.

Verification against `Final_exam_practice_Sol.pdf` Q7 (pages 7-9):
- VA 37: top=2, 2nd=1, offset=1 → base 8 + offset 1 = **9** ✓
- VA 25: top=1, 2nd=2 → `X` → **Page fault** ✓
- VA 62: top=3, 2nd=3, offset=2 → base 16 + offset 2 = **18** ✓

All three match the solution PDF exactly.
