---
n: 9
id: bridge
title: "Bridge — two hierarchies, one pivot"
hook: "A TV remote that works for a Samsung, an LG, or a projector. The remote hierarchy evolves separately from the device hierarchy — connected by one reference."
tags: [pattern, structural, bridge, abstraction, implementation]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.7, Week 12 Slides, finalexamsmerge.pdf Q9 Shape+Renderer"
bloom_levels: [understand, apply, analyze]
related: [strategy, abstract-factory]
---

You have Shapes: Circle, Square, Triangle. You have Renderers: RasterRenderer, VectorRenderer. Naive inheritance: `RasterCircle`, `VectorCircle`, `RasterSquare`, `VectorSquare`, `RasterTriangle`, `VectorTriangle`. Six classes for two orthogonal dimensions — combinatorial.

## Split the hierarchy

```python
class Renderer:
    def render_circle(self, radius): pass

class RasterRenderer(Renderer):
    def render_circle(self, radius):
        print("Drawing a raster circle")

class VectorRenderer(Renderer):
    def render_circle(self, radius):
        print("Drawing a vector circle")

class Shape:
    def draw(self): pass

class Circle(Shape):
    def __init__(self, x, y, radius, renderer):
        self.x, self.y, self.radius = x, y, radius
        self.renderer = renderer    # the bridge
    def draw(self):
        self.renderer.render_circle(self.radius)

circle = Circle(0, 0, 5, RasterRenderer())
circle.draw()   # Drawing a raster circle
```

Two hierarchies — Shape (abstraction) and Renderer (implementation) — connected by one reference. Three shapes × two renderers = five classes, not six. Ten shapes × five renderers = fifteen classes, not fifty.

## Abstraction vs Implementation

> **Q:** Which class is the Abstraction and which is the Implementation?
> **A:** `Shape` is the Abstraction — it's what the client talks to. `Renderer` is the Implementation — the bottom half it delegates to. In past-exam Q9, `Shape` = Abstraction, `Renderer` = Implementation, `Circle` is a refined abstraction, `RasterRenderer` / `VectorRenderer` are concrete implementations. *finalexamsmerge.pdf Q9.*

"The Abstraction controls the Implementation" means Shape decides what the Renderer does via method calls — not vice versa.

## Bridge vs Strategy

Looks similar — a context holding an abstraction and delegating. Differences:

- **Strategy** — one hierarchy (the strategy interface). The context is a plain class.
- **Bridge** — TWO hierarchies that evolve independently. Both have an inheritance tree.
- **Strategy** — typically swap the algorithm at runtime for behavior variation.
- **Bridge** — typically fix the implementation at construction for platform/representation variation.

## Pitfalls

> **Pitfall**
> Confusing Bridge's "implementation" (the low-level hierarchy) with software "implementation" (as opposed to design). In Bridge parlance, the Implementation hierarchy is the concrete-platform side; the Abstraction is the high-level domain-side.

> **Pitfall**
> Drawing the UML: Abstraction → Implementation uses composition (has-a), with the Implementation as an interface, and concrete implementations inheriting. Abstraction hierarchy extends separately via "Refined Abstractions".

## Takeaway

> **Takeaway**
> Bridge is the answer to "two orthogonal hierarchies that would multiply if merged". Keep them separate; bridge them with one reference. Use it when both the domain objects and their underlying platforms evolve.
