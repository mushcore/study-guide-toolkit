---
n: 9
id: cp-bridge-shape-renderer
title: "Bridge — Shape + Renderer"
lang: python
tags: [pattern, bridge, shape, renderer]
source: "finalexamsmerge.pdf Q9"
pedagogy: worked-example-first
kind: code
---

## Prompt

Implement the Bridge pattern. Create two independent hierarchies:
1. **Abstraction** `Shape` with subclass `Circle`; `Shape` holds a `Renderer` ref.
2. **Implementation** `Renderer` interface with `RasterRenderer` + `VectorRenderer` concrete classes, each implementing `render_circle(radius)`.

Client calls `Circle(...).draw()`; draw delegates to the injected renderer.

## Starter

```python
class Shape:
    def draw(self):
        pass

class Renderer:
    def render_circle(self, radius):
        pass

# TODO: Circle(Shape) holds renderer, implements draw()
# TODO: RasterRenderer, VectorRenderer
```

## Solution

```python
from abc import ABC, abstractmethod

class Renderer(ABC):
    @abstractmethod
    def render_circle(self, radius):
        pass

class RasterRenderer(Renderer):
    def render_circle(self, radius):
        print(f"Drawing a raster circle radius={radius}")

class VectorRenderer(Renderer):
    def render_circle(self, radius):
        print(f"Drawing a vector circle radius={radius}")

class Shape(ABC):
    def __init__(self, renderer):
        self.renderer = renderer
    @abstractmethod
    def draw(self):
        pass

class Circle(Shape):
    def __init__(self, x, y, radius, renderer):
        super().__init__(renderer)
        self.x = x
        self.y = y
        self.radius = radius
    def draw(self):
        self.renderer.render_circle(self.radius)

raster_circle = Circle(0, 0, 5, RasterRenderer())
raster_circle.draw()   # Drawing a raster circle radius=5

vector_circle = Circle(0, 0, 5, VectorRenderer())
vector_circle.draw()   # Drawing a vector circle radius=5
```

## Why

The two hierarchies (`Shape` and `Renderer`) evolve independently. Adding `Square(Shape)` doesn't require a new renderer. Adding `OpenGLRenderer(Renderer)` doesn't require a new shape. They meet at ONE reference — `self.renderer` inside the Shape.

On the exam, identify parts:
- **Abstraction** (Shape) — the client-facing hierarchy.
- **Implementation** (Renderer) — the delegated-to hierarchy.
- **Refined Abstraction** (Circle) — concrete Shape subclass.
- **Concrete Implementation** (RasterRenderer / VectorRenderer).

Two wrong approaches:
1. **Subclass per combination** (`RasterCircle`, `VectorCircle`, `RasterSquare`, `VectorSquare`). Cartesian-product class explosion — the very thing Bridge prevents.
2. **Reversing Abstraction and Implementation.** Renderer is NOT the abstraction; it's the low-level delegate. If the exam swaps the two, the answer is wrong. *finalexamsmerge.pdf Q9 Option A correct.*
