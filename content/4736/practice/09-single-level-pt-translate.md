---
n: 9
id: single-level-pt-translate
title: "Single-level page table — translate 4 VAs (past-exam Q3)"
lang: text
tags: [paging, memory]
kind: code
source: "TODO: trace to lab/assignment/past-exam (legacy — needs enrichment)"
---

## Prompt

Using the following page table, obtain **(a)** the page size, **(b)** the page frame size, and **(c)** the physical address for each of these virtual addresses: **20, 4100, 8300, 53448**. `X` in the frame column means the page is not present (page fault).

<svg viewBox="0 0 660 560" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto" font-family="ui-monospace, monospace" font-size="12">
  <style>
    .pt-row    { fill: #1f2430; stroke: #565f89; stroke-width: 1; }
    .pt-header { fill: #24283b; stroke: #7aa2f7; stroke-width: 1.5; }
    .pt-text   { fill: #c0caf5; }
    .pt-x      { fill: #f7768e; font-weight: 700; }
    .pt-frame  { fill: #9ece6a; font-weight: 700; }
    .frame-box { fill: #1f2430; stroke: #565f89; stroke-width: 1; }
    .frame-hdr { fill: #24283b; stroke: #7aa2f7; stroke-width: 1.5; }
    .title     { fill: #e0af68; font-size: 13px; font-weight: 700; }
    .arrow     { stroke: #7aa2f7; stroke-width: 1; fill: none; opacity: 0.5; }
  </style>
  <text class="title" x="20" y="20">Virtual address space (16 pages × 4 KB)</text>
  <rect class="pt-header" x="20" y="30" width="260" height="24" />
  <text class="pt-text" x="40" y="47">VA range</text>
  <text class="pt-text" x="180" y="47">Frame #</text>
  <!-- 16 page-table rows: index, range, frame -->
  <g>
    <rect class="pt-row" x="20"  y="54"  width="260" height="28" /><text class="pt-text" x="40" y="73">60K - 64K</text><text class="pt-x"     x="180" y="73">X</text>
    <rect class="pt-row" x="20"  y="82"  width="260" height="28" /><text class="pt-text" x="40" y="101">56K - 60K</text><text class="pt-x"     x="180" y="101">X</text>
    <rect class="pt-row" x="20"  y="110" width="260" height="28" /><text class="pt-text" x="40" y="129">52K - 56K</text><text class="pt-x"     x="180" y="129">X</text>
    <rect class="pt-row" x="20"  y="138" width="260" height="28" /><text class="pt-text" x="40" y="157">48K - 52K</text><text class="pt-x"     x="180" y="157">X</text>
    <rect class="pt-row" x="20"  y="166" width="260" height="28" /><text class="pt-text" x="40" y="185">44K - 48K</text><text class="pt-frame" x="180" y="185">7</text>
    <rect class="pt-row" x="20"  y="194" width="260" height="28" /><text class="pt-text" x="40" y="213">40K - 44K</text><text class="pt-x"     x="180" y="213">X</text>
    <rect class="pt-row" x="20"  y="222" width="260" height="28" /><text class="pt-text" x="40" y="241">36K - 40K</text><text class="pt-frame" x="180" y="241">5</text>
    <rect class="pt-row" x="20"  y="250" width="260" height="28" /><text class="pt-text" x="40" y="269">32K - 36K</text><text class="pt-x"     x="180" y="269">X</text>
    <rect class="pt-row" x="20"  y="278" width="260" height="28" /><text class="pt-text" x="40" y="297">28K - 32K</text><text class="pt-x"     x="180" y="297">X</text>
    <rect class="pt-row" x="20"  y="306" width="260" height="28" /><text class="pt-text" x="40" y="325">24K - 28K</text><text class="pt-x"     x="180" y="325">X</text>
    <rect class="pt-row" x="20"  y="334" width="260" height="28" /><text class="pt-text" x="40" y="353">20K - 24K</text><text class="pt-frame" x="180" y="353">3</text>
    <rect class="pt-row" x="20"  y="362" width="260" height="28" /><text class="pt-text" x="40" y="381">16K - 20K</text><text class="pt-frame" x="180" y="381">4</text>
    <rect class="pt-row" x="20"  y="390" width="260" height="28" /><text class="pt-text" x="40" y="409">12K - 16K</text><text class="pt-frame" x="180" y="409">0</text>
    <rect class="pt-row" x="20"  y="418" width="260" height="28" /><text class="pt-text" x="40" y="437">8K - 12K</text><text class="pt-frame" x="180" y="437">6</text>
    <rect class="pt-row" x="20"  y="446" width="260" height="28" /><text class="pt-text" x="40" y="465">4K - 8K</text><text class="pt-frame" x="180" y="465">1</text>
    <rect class="pt-row" x="20"  y="474" width="260" height="28" /><text class="pt-text" x="40" y="493">0K - 4K</text><text class="pt-frame" x="180" y="493">2</text>
  </g>
  <!-- Physical memory: 8 frames -->
  <text class="title" x="420" y="20">Physical memory (8 frames × 4 KB)</text>
  <rect class="frame-hdr" x="420" y="30" width="220" height="24" />
  <text class="pt-text" x="440" y="47">PA range</text>
  <text class="pt-text" x="580" y="47">Frame #</text>
  <g>
    <rect class="frame-box" x="420" y="54"  width="220" height="28" /><text class="pt-text" x="440" y="73">28K - 32K</text>  <text class="pt-frame" x="580" y="73">7</text>
    <rect class="frame-box" x="420" y="82"  width="220" height="28" /><text class="pt-text" x="440" y="101">24K - 28K</text> <text class="pt-frame" x="580" y="101">6</text>
    <rect class="frame-box" x="420" y="110" width="220" height="28" /><text class="pt-text" x="440" y="129">20K - 24K</text> <text class="pt-frame" x="580" y="129">5</text>
    <rect class="frame-box" x="420" y="138" width="220" height="28" /><text class="pt-text" x="440" y="157">16K - 20K</text> <text class="pt-frame" x="580" y="157">4</text>
    <rect class="frame-box" x="420" y="166" width="220" height="28" /><text class="pt-text" x="440" y="185">12K - 16K</text> <text class="pt-frame" x="580" y="185">3</text>
    <rect class="frame-box" x="420" y="194" width="220" height="28" /><text class="pt-text" x="440" y="213">8K - 12K</text>  <text class="pt-frame" x="580" y="213">2</text>
    <rect class="frame-box" x="420" y="222" width="220" height="28" /><text class="pt-text" x="440" y="241">4K - 8K</text>   <text class="pt-frame" x="580" y="241">1</text>
    <rect class="frame-box" x="420" y="250" width="220" height="28" /><text class="pt-text" x="440" y="269">0K - 4K</text>   <text class="pt-frame" x="580" y="269">0</text>
  </g>
</svg>

## Starter

```text
(a) page size  = ?
(b) frame size = ?

(c) For each VA, identify: VP (virtual page index), offset, frame#, PA.

VA 20     → VP=?, offset=?, frame=?, PA=?
VA 4100   → VP=?, offset=?, frame=?, PA=?
VA 8300   → VP=?, offset=?, frame=?, PA=?
VA 53448  → VP=?, offset=?, frame=?, PA=?
```

## Solution

```text
(a) page size  = 4 KB = 4096 B     (ranges in the VA column span 4K each)
(b) frame size = 4 KB = 4096 B     (must match page size)

Use:
  VP     = VA div page_size
  offset = VA mod page_size
  PA     = frame# × page_size + offset

VA 20    → VP=0,  offset=20    ; PT[0]=2  ; PA = 2·4096 + 20    = 8212
VA 4100  → VP=1,  offset=4     ; PT[1]=1  ; PA = 1·4096 + 4     = 4100
VA 8300  → VP=2,  offset=108   ; PT[2]=6  ; PA = 6·4096 + 108   = 24684
VA 53448 → VP=13, offset=200   ; PT[13]=X ; **PAGE FAULT**
```

## Why

Translation is a three-step pipeline: **split VA** into `(VP, offset)`; **look up** `PT[VP]`; **concatenate** `(frame#, offset)` to form PA. The offset is a pure passthrough — only the high-order bits change.

- VP=0 at PT row `0K - 4K` → frame 2 → frame base `2 × 4096 = 8192`. VA 20 is offset 20 inside VP 0, so PA = `8192 + 20 = 8212`.
- VP=1 at `4K - 8K` → frame 1. Coincidentally `VP = frame#` here, so the identity holds within that page only: PA = 4096 + 4 = 4100.
- VP=2 at `8K - 12K` → frame 6. Frame base = `6 × 4096 = 24576`. PA = 24576 + 108 = 24684.
- VP=13 at `52K - 56K` → frame `X` → page fault. The MMU traps; the OS either loads the page from backing store or kills the process on an invalid reference.

The formula-based derivation also appears in the sol key as `Y = x + (a − A)` where `x` is the VA, `A` is the virtual page base, and `a` is the frame base. For VA 20: `Y = 20 + (8192 − 0) = 8212`. Both methods give the same answer; showing both on a written exam earns full marks per the instructor's worked solutions.

Verification against `Final_exam_practice_Sol.pdf` Q3 (pages 2-3): PA values 8212, 4100, 24684, and page fault match exactly.
