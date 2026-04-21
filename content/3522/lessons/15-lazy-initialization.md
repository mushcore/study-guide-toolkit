---
n: 15
id: lazy-init
title: "Lazy Initialization — create only when first needed"
hook: "Don't instantiate the expensive thing when the program boots. Wait until someone actually asks for it."
tags: [pattern, creational, lazy-init, deferred]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.9, Week 10 Slides"
bloom_levels: [remember, understand]
related: [proxy, singleton]
---

Simple pattern, simple idea. A field that's expensive to construct is not constructed at init time — only when first accessed.

```python
class Service:
    def __init__(self):
        self._core = None   # not constructed yet

    def access_core(self):
        if self._core is None:
            self._core = Core()   # expensive construction deferred
        return self._core

    def cheap_method(self):
        return "doesn't touch _core"
```

If a client only ever calls `cheap_method()`, `Core` is never constructed. First `access_core()` triggers construction; subsequent calls reuse the instance.

> **Q:** What's the trade-off? Why not always lazy-init everything?
> **A:** Lazy init adds a check on every access (`if self._core is None`) and makes the first access slower (construction cost). For cheap objects, the overhead isn't worth it. Use it when construction is genuinely expensive AND the object is only sometimes needed. Premature laziness is as wasteful as premature eagerness.

## When to use

- Construction is expensive (network, disk, large memory).
- Not every code path needs the object.
- You want to avoid paying the cost until confirmed necessary.

## Relation to Proxy

A Virtual (or Lazy) Proxy is essentially Lazy Initialization wrapped in the Proxy structural shape — same interface as the real subject, construction deferred to first method call.

## Python's `functools.cached_property`

```python
from functools import cached_property
class Service:
    @cached_property
    def core(self):
        print("constructing")
        return Core()
```

Same semantics: computed on first access, cached forever on the instance.

## Takeaway

> **Takeaway**
> Lazy Initialization pays construction cost on demand, at most once per instance. The simplest pattern in the course — worth a single mental slot, not a full lesson on exam day.
