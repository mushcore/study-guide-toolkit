---
n: 8
id: paging-sizing-48bit-va
title: "Paging sizing — 48-bit VA, 32-bit PA, 8 KB pages (past-exam Q1)"
lang: text
tags: [paging, memory]
---

## Prompt

A machine has **48-bit virtual addresses** and **32-bit physical addresses**. Pages are **8 KB**.

Compute:

1. The number of **virtual pages**.
2. The number of **page frames**.
3. The number of entries needed for a **single-level linear page table**.
4. The size in bytes of that single-level page table, assuming 8-byte PTEs.

The address-bit layout is:

<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto" font-family="ui-monospace, monospace" font-size="13">
  <style>
    .cell { fill: #1f2430; stroke: #7aa2f7; stroke-width: 1.5; }
    .label { fill: #c0caf5; }
    .bits { fill: #9ece6a; font-weight: 600; }
    .title { fill: #e0af68; font-size: 14px; font-weight: 700; }
    .arrow { stroke: #7aa2f7; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
  </style>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#7aa2f7" />
    </marker>
  </defs>
  <text class="title" x="20" y="25">Virtual address (48 bits)</text>
  <rect class="cell" x="20" y="40" width="400" height="40" />
  <rect class="cell" x="420" y="40" width="200" height="40" />
  <text class="label" x="220" y="65" text-anchor="middle">Virtual page number</text>
  <text class="label" x="520" y="65" text-anchor="middle">Offset</text>
  <text class="bits" x="220" y="98" text-anchor="middle">? bits</text>
  <text class="bits" x="520" y="98" text-anchor="middle">? bits</text>
  <text class="title" x="20" y="140">Physical address (32 bits)</text>
  <rect class="cell" x="20" y="155" width="280" height="40" />
  <rect class="cell" x="300" y="155" width="200" height="40" />
  <text class="label" x="160" y="180" text-anchor="middle">Page frame number</text>
  <text class="label" x="400" y="180" text-anchor="middle">Offset</text>
  <text class="bits" x="160" y="213" text-anchor="middle">? bits</text>
  <text class="bits" x="400" y="213" text-anchor="middle">? bits</text>
</svg>

The offset width is set by the page size; solve for it first, then the virtual-page and page-frame widths fall out.

## Starter

```text
offset_bits  = ?
vpage_bits   = ?
frame_bits   = ?

#pages       = ?
#frames      = ?
PT entries   = ?
PT size (B)  = ?
```

## Solution

```text
offset_bits  = log2(8 KB) = log2(2^13) = 13
vpage_bits   = 48 − 13 = 35
frame_bits   = 32 − 13 = 19

#pages       = 2^35
#frames      = 2^19
PT entries   = 2^35         (one entry per virtual page in a linear PT)
PT size (B)  = 2^35 × 8 B   = 2^38 B  = 256 GiB
```

## Why

Page size determines offset width: a page of `2^k` bytes needs exactly `k` offset bits to name every byte inside it. Once offset is fixed, the remaining bits of the virtual and physical addresses index the virtual-page and page-frame tables respectively.

A **linear (single-level) page table** stores one entry per virtual page regardless of whether that page is mapped, which is why 48-bit linear tables are infeasible — here 256 GiB per process. This is the motivation for multi-level page tables (past-exam Q7): second-level tables are allocated only for regions of the address space actually in use.

Verification against `Final_exam_practice_Sol.pdf` Q1 (page 1): `8KB = 2^13 B; # of pages 2^48/2^13 = 2^35; # of page frames 2^32/2^13 = 2^19; entries = 2^48/2^13 = 2^35`. Matches.
