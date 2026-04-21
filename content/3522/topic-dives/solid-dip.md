---
id: solid-dip-dive
title: "DIP — deep dive"
pillar: tech
priority: high
tags: [solid, dip, abstraction, dependency-inversion]
source: "Week 3 Slides, Week 14 review, Dec 2024 Final T/F Q2"
bloom_levels: [understand, apply, analyze]
related: [solid-ocp, strategy, factory, bridge]
---

## The two statements

1. High-level modules should not depend on low-level modules. **Both should depend on abstractions.**
2. Abstractions should not depend on details. **Details should depend on abstractions.**

## Before-and-after diagram

<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .abs { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .bad { stroke: #c44; }
    .good { stroke: #2a8; }
    .arrow { fill: none; stroke-width: 1.5; }
    .inh { fill: #fff; }
  </style>
  <text x="70" y="20" font-weight="bold">Wrong (no DIP)</text>
  <rect x="20" y="40" width="100" height="50" class="cls" />
  <text x="55" y="65">UI</text>
  <text x="10" y="105" font-size="11">high-level</text>
  <path d="M120,65 L200,65" class="arrow bad" stroke="#c44" />
  <polygon points="195,60 205,65 195,70" fill="#c44" />
  <rect x="210" y="40" width="100" height="50" class="cls" />
  <text x="220" y="65">TextFile</text>
  <text x="230" y="105" font-size="11">low-level</text>
  <text x="420" y="20" font-weight="bold">Right (DIP)</text>
  <rect x="380" y="40" width="100" height="50" class="cls" />
  <text x="415" y="65">UI</text>
  <path d="M480,65 L560,65" class="arrow good" stroke="#2a8" />
  <polygon points="555,60 565,65 555,70" fill="#2a8" />
  <rect x="570" y="40" width="120" height="50" class="abs" />
  <text x="590" y="65">DataSource</text>
  <text x="580" y="105" font-size="11">abstraction</text>
  <rect x="480" y="180" width="100" height="45" class="cls" />
  <text x="495" y="205">TextFile</text>
  <rect x="590" y="180" width="100" height="45" class="cls" />
  <text x="605" y="205">SQLiteDB</text>
  <path d="M530,180 L615,95" class="arrow good" stroke="#2a8" />
  <polygon points="610,88 621,90 615,100" fill="#fff" stroke="#2a8" />
  <path d="M635,180 L640,95" class="arrow good" stroke="#2a8" />
  <polygon points="635,88 645,88 640,98" fill="#fff" stroke="#2a8" />
</svg>

Left: UI points directly at TextFile — changing storage backend means editing UI. Right: UI points at the DataSource abstraction; TextFile and SQLiteDB both implement it. Swap backends freely.

## Refactored code

```python
from abc import ABC, abstractmethod

class DataSource(ABC):
    @abstractmethod
    def retrieve(self): pass
    @abstractmethod
    def update(self, data): pass

class TextFile(DataSource):
    def retrieve(self): ...
    def update(self, data): ...

class SQLiteDB(DataSource):
    def retrieve(self): ...
    def update(self, data): ...

class UI:
    def __init__(self, ds: DataSource):
        self.ds = ds            # inject abstraction
    def refresh(self):
        return self.ds.retrieve()
```

## Past-exam cues

> **Example**
> *Dec 2024 Final T/F Q2:* "DIP suggests that both high-level and low-level modules should depend on abstractions, not concrete implementations, which promotes loose coupling and flexibility." → TRUE.

> **Example**
> Quiz: "Which is FALSE regarding DIP?"
> - Low-level should not depend on high-level ✓ (true DIP statement — one direction of rule 1)
> - **Abstractions depend on details** ← FALSE (that's the inverse of rule 2)
> - High-level should not depend on low-level ✓
> - High- and low-level both depend on abstractions ✓

## Pitfall

> **Pitfall**
> DIP is NOT the same as Dependency Injection (DI). DI is a technique; DIP is a principle. DI usually implements DIP but you can have one without the other.

## Takeaway

> **Takeaway**
> DIP inverts the natural dependency arrow. Both ends point up at a shared abstraction. Memorize both statements word-for-word — the exam quizzes them with subtle word swaps.
