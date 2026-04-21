---
id: bridge-dive
title: "Bridge pattern — deep dive"
pillar: tech
priority: mid
tags: [pattern, structural, bridge, abstraction, implementation]
source: "DesignPatternsTable p.7, Week 12 Slides, finalexamsmerge.pdf Q9 Shape+Renderer"
bloom_levels: [understand, apply, analyze]
related: [strategy, abstract-factory]
---

## When to use

Two orthogonal dimensions of variation that would multiply under naive inheritance. Classic tells: shape × renderer, device × remote, document × format, widget × platform.

## Canonical class diagram

<svg viewBox="0 0 640 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    .abs { fill: #fff6ea; stroke: #a06a2a; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
  </style>
  <rect x="20" y="20" width="200" height="90" class="abs" />
  <text x="65" y="40" class="it">Abstraction (Shape)</text>
  <line x1="20" y1="50" x2="220" y2="50" stroke="#333" />
  <text x="30" y="70">- impl: Implementation</text>
  <line x1="20" y1="80" x2="220" y2="80" stroke="#333" />
  <text x="30" y="100">+ draw()</text>
  <rect x="410" y="20" width="210" height="90" class="iface" />
  <text x="440" y="40" class="it">«interface» Implementation</text>
  <line x1="410" y1="50" x2="620" y2="50" stroke="#333" />
  <line x1="410" y1="52" x2="620" y2="52" stroke="#333" />
  <text x="420" y="80" class="it">+ render_circle(r)</text>
  <polygon points="230,65 220,59 220,71" fill="#fff" stroke="#333" />
  <path d="M235,65 L410,65" class="arrow" />
  <text x="290" y="60">bridge (has-a)</text>
  <rect x="20" y="220" width="220" height="60" class="cls" />
  <text x="75" y="245">Circle / Square</text>
  <text x="30" y="270" font-size="11">refined abstractions</text>
  <path d="M130,220 L130,110" class="arrow" />
  <polygon points="125,115 135,115 130,105" fill="#fff" stroke="#333" />
  <rect x="400" y="220" width="220" height="60" class="cls" />
  <text x="425" y="245">RasterRenderer / VectorRenderer</text>
  <text x="410" y="270" font-size="11">concrete implementations</text>
  <path d="M510,220 L515,110" class="arrow" />
  <polygon points="510,115 520,115 515,105" fill="#fff" stroke="#333" />
</svg>

## Worked example — Shape × Renderer

```python
from abc import ABC, abstractmethod

class Renderer(ABC):
    @abstractmethod
    def render_circle(self, radius): pass

class RasterRenderer(Renderer):
    def render_circle(self, radius):
        print(f"Raster circle r={radius}")

class VectorRenderer(Renderer):
    def render_circle(self, radius):
        print(f"Vector circle r={radius}")

class Shape(ABC):
    def __init__(self, renderer):
        self.renderer = renderer
    @abstractmethod
    def draw(self): pass

class Circle(Shape):
    def __init__(self, x, y, radius, renderer):
        super().__init__(renderer)
        self.x, self.y, self.radius = x, y, radius
    def draw(self):
        self.renderer.render_circle(self.radius)

raster_circle = Circle(0, 0, 5, RasterRenderer())
raster_circle.draw()   # Raster circle r=5
```

Two hierarchies — `Shape` abstraction-side, `Renderer` implementation-side — connected by one reference. New shapes don't require new renderers; new renderers don't require new shapes.

## Past-exam MCQ — identifying Abstraction and Implementation

> **Example**
> "In the Bridge design pattern, we say that the Abstractions control the Implementation. Which is which?"
>
> Given Shape + Renderer code:
> - **Abstraction** = `Shape` — the client-facing hierarchy.
> - **Implementation** = `Renderer` — the low-level hierarchy.
> - `Circle` is a refined Abstraction (concrete shape subclass).
> - `RasterRenderer` / `VectorRenderer` are concrete Implementations.
>
> Answer: Option A. *finalexamsmerge.pdf Q9.*

## Bridge vs Strategy

Both have a context holding a pluggable object. Differences:

- **Strategy** — one hierarchy (strategy interface). Client swaps strategy for behavior change.
- **Bridge** — two hierarchies, both extend independently. Relationship fixed at construction, not swapped at runtime.

If the "strategy" and "context" each have their own subclass tree, you're looking at Bridge.

## Pitfalls

> **Pitfall**
> On the exam, do NOT assume Bridge means "behavioral runtime swap". It's primarily structural — the bridge is there so both sides can evolve independently, not necessarily so you swap at runtime.

> **Pitfall**
> Abstraction "controls" Implementation in the sense that the client only ever holds the abstraction. The abstraction delegates to the implementation; never the reverse.

## Takeaway

> **Takeaway**
> Bridge separates two orthogonal dimensions of variation into separate inheritance hierarchies joined by a has-a reference. Use when the Cartesian product of the two would otherwise blow up. Key exam cue: two class trees that reference each other.
