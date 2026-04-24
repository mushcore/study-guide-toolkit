---
n: 10
id: mmu-present-bit-translate
title: "MMU translate with present/absent bits (past-exam Q4)"
lang: text
tags: [paging, memory, mmu]
kind: code
source: "TODO: trace to lab/assignment/past-exam (legacy — needs enrichment)"
---

## Prompt

The system has **16 virtual pages of 4 KB each** (so the virtual address space is 16 × 4 KB = 64 KB = 2^16 B, making virtual addresses 16 bits wide). The MMU page table is shown below: each row holds `(frame_number_in_binary, present_bit)`.

Translate **(a) 25012 (0x61B4)** and **(b) 45493 (0xB1B5)** to physical addresses. For any row whose present bit is `0`, report **PAGE FAULT**.

<svg viewBox="0 0 680 600" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto" font-family="ui-monospace, monospace" font-size="12">
  <style>
    .pt-row    { fill: #1f2430; stroke: #565f89; stroke-width: 1; }
    .pt-header { fill: #24283b; stroke: #7aa2f7; stroke-width: 1.5; }
    .pt-text   { fill: #c0caf5; }
    .pt-present0 { fill: #f7768e; font-weight: 700; }
    .pt-present1 { fill: #9ece6a; font-weight: 700; }
    .title     { fill: #e0af68; font-size: 13px; font-weight: 700; }
    .callout   { fill: #bb9af7; font-size: 12px; }
  </style>
  <text class="title" x="20" y="22">Page table — 16 entries (VP → (frame, present))</text>
  <rect class="pt-header" x="20" y="32" width="380" height="26" />
  <text class="pt-text" x="40"  y="50">VP index</text>
  <text class="pt-text" x="160" y="50">Frame # (3 bits, binary)</text>
  <text class="pt-text" x="340" y="50">Present</text>
  <!-- 16 rows, top = index 15, bottom = index 0 (to match exam layout) -->
  <g>
    <rect class="pt-row" x="20" y="58"  width="380" height="26" /><text class="pt-text" x="40" y="76">15</text><text class="pt-text" x="200" y="76">000</text><text class="pt-present0" x="340" y="76">0</text>
    <rect class="pt-row" x="20" y="84"  width="380" height="26" /><text class="pt-text" x="40" y="102">14</text><text class="pt-text" x="200" y="102">000</text><text class="pt-present0" x="340" y="102">0</text>
    <rect class="pt-row" x="20" y="110" width="380" height="26" /><text class="pt-text" x="40" y="128">13</text><text class="pt-text" x="200" y="128">000</text><text class="pt-present0" x="340" y="128">0</text>
    <rect class="pt-row" x="20" y="136" width="380" height="26" /><text class="pt-text" x="40" y="154">12</text><text class="pt-text" x="200" y="154">000</text><text class="pt-present0" x="340" y="154">0</text>
    <rect class="pt-row" x="20" y="162" width="380" height="26" /><text class="pt-text" x="40" y="180">11</text><text class="pt-text" x="200" y="180">111</text><text class="pt-present1" x="340" y="180">1</text>
    <rect class="pt-row" x="20" y="188" width="380" height="26" /><text class="pt-text" x="40" y="206">10</text><text class="pt-text" x="200" y="206">000</text><text class="pt-present0" x="340" y="206">0</text>
    <rect class="pt-row" x="20" y="214" width="380" height="26" /><text class="pt-text" x="40" y="232">9</text> <text class="pt-text" x="200" y="232">101</text><text class="pt-present1" x="340" y="232">1</text>
    <rect class="pt-row" x="20" y="240" width="380" height="26" /><text class="pt-text" x="40" y="258">8</text> <text class="pt-text" x="200" y="258">000</text><text class="pt-present0" x="340" y="258">0</text>
    <rect class="pt-row" x="20" y="266" width="380" height="26" /><text class="pt-text" x="40" y="284">7</text> <text class="pt-text" x="200" y="284">000</text><text class="pt-present0" x="340" y="284">0</text>
    <rect class="pt-row" x="20" y="292" width="380" height="26" /><text class="pt-text" x="40" y="310">6</text> <text class="pt-text" x="200" y="310">000</text><text class="pt-present0" x="340" y="310">0</text>
    <rect class="pt-row" x="20" y="318" width="380" height="26" /><text class="pt-text" x="40" y="336">5</text> <text class="pt-text" x="200" y="336">011</text><text class="pt-present1" x="340" y="336">1</text>
    <rect class="pt-row" x="20" y="344" width="380" height="26" /><text class="pt-text" x="40" y="362">4</text> <text class="pt-text" x="200" y="362">100</text><text class="pt-present1" x="340" y="362">1</text>
    <rect class="pt-row" x="20" y="370" width="380" height="26" /><text class="pt-text" x="40" y="388">3</text> <text class="pt-text" x="200" y="388">000</text><text class="pt-present1" x="340" y="388">1</text>
    <rect class="pt-row" x="20" y="396" width="380" height="26" /><text class="pt-text" x="40" y="414">2</text> <text class="pt-text" x="200" y="414">110</text><text class="pt-present1" x="340" y="414">1</text>
    <rect class="pt-row" x="20" y="422" width="380" height="26" /><text class="pt-text" x="40" y="440">1</text> <text class="pt-text" x="200" y="440">001</text><text class="pt-present1" x="340" y="440">1</text>
    <rect class="pt-row" x="20" y="448" width="380" height="26" /><text class="pt-text" x="40" y="466">0</text> <text class="pt-text" x="200" y="466">010</text><text class="pt-present1" x="340" y="466">1</text>
  </g>
  <!-- Legend / bit-split diagram -->
  <text class="title" x="440" y="22">Address split (16-bit VA)</text>
  <rect class="pt-row" x="440" y="32" width="100" height="40" />
  <rect class="pt-row" x="540" y="32" width="120" height="40" />
  <text class="pt-text" x="490" y="58" text-anchor="middle">VP (4 bits)</text>
  <text class="pt-text" x="600" y="58" text-anchor="middle">Offset (12 bits)</text>
  <text class="callout" x="440" y="110">Rule:</text>
  <text class="callout" x="440" y="130">• 16 pages → 4 VP bits</text>
  <text class="callout" x="440" y="150">• 4 KB page → 12 offset bits</text>
  <text class="callout" x="440" y="170">• 8 frames → 3 frame-# bits</text>
  <text class="callout" x="440" y="190">• present=0 → trap (page fault)</text>
</svg>

## Starter

```text
(a) 25012 = 0x61B4

    Binary VA       = ?
    VP (top 4 bits) = ?
    Offset (low 12) = ?
    PT[VP]          = (frame=?, present=?)
    Result          = ?

(b) 45493 = 0xB1B5

    Binary VA       = ?
    VP (top 4 bits) = ?
    Offset (low 12) = ?
    PT[VP]          = (frame=?, present=?)
    Result          = ?
```

## Solution

```text
(a) 25012 = 0x61B4

    Binary VA       = 0110 0001 1011 0100
    VP              = 0110₂ = 6
    Offset          = 0001 1011 0100₂ = 0x1B4
    PT[6]           = (000, present=0)
    Result          = **PAGE FAULT**

(b) 45493 = 0xB1B5

    Binary VA       = 1011 0001 1011 0101
    VP              = 1011₂ = 11
    Offset          = 0001 1011 0101₂ = 0x1B5
    PT[11]          = (111, present=1)
    Frame 111₂ = 7
    Physical binary = 111 0001 1011 0101  (15 bits: 3 frame + 12 offset)
    Physical decimal= 29109
```

## Why

The virtual address is 16 bits wide because the address space is `16 pages × 4 KB = 64 KB = 2^16 B`. Splitting into `(VP, offset)` uses the top 4 bits (since `16 = 2^4` pages) for the VP index and the low 12 bits (since `4 KB = 2^12` bytes) for the offset.

For **0x61B4**: the top-4-bit nibble is `0x6 = 6`. Row 6 of the page table holds frame=`000` with present=0, so the MMU raises a page fault — the OS's page-fault handler would then load the page from backing store.

For **0xB1B5**: the top nibble is `0xB = 11`. Row 11 holds frame=`111` with present=1. The MMU replaces the 4 VP bits with the 3 frame bits and concatenates the 12-bit offset. The result is `111 0001 1011 0101₂`. Physical addresses in this system are 15 bits wide (3 frame bits + 12 offset bits); the decimal value is **29109**.

Note: row 3 of the page table has `frame=000` with `present=1`. Frame 0 is a valid mapping — a VP=3 access would translate to frame 0 (the physical range 0-4 KB), not a fault. Only the present bit decides fault vs. translate.

Sanity check: the exam solution shows `111 0001 1011 0101₂ = 29109₁₀`. Matches.

Verification against `Final_exam_practice_Sol.pdf` Q4 (page 4):
- (a) `0110 000110110100 → 110₂ = 6₁₀ → Page fault`
- (b) `1011 000110110101 → 1011₂ = 11₁₀ → physical 111 000110110101₂ = 29109₁₀`

Both match.
