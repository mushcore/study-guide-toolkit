---
id: lazy-init-dive
title: "Lazy Initialization — deep dive"
pillar: tech
priority: low
tags: [pattern, creational, lazy-init]
source: "DesignPatternsTable p.9, Week 10 Slides"
bloom_levels: [remember, understand]
related: [proxy, singleton]
---

## When to use

Expensive construction you don't want to pay up front. The object is created on first access; subsequent accesses reuse the cached instance.

## Worked example

```python
class Service:
    def __init__(self):
        self._core = None

    def access_core(self):
        if self._core is None:
            print("constructing Core...")
            self._core = Core()
        return self._core

    def cheap_method(self):
        return "no core needed"

s = Service()
s.cheap_method()        # no construction
s.access_core()         # constructing Core...
s.access_core()         # (no print — already constructed)
```

## Pythonic: `functools.cached_property`

```python
from functools import cached_property

class Service:
    @cached_property
    def core(self):
        print("constructing Core...")
        return Core()
```

Computes once on first access, stores on the instance, returns cached value thereafter.

## Relation to Virtual Proxy

A Virtual / Lazy Proxy combines Proxy's structural wrapping with Lazy Init's deferred construction. The proxy looks like the real subject; the real subject isn't built until the first real method call.

## Takeaway

> **Takeaway**
> Lazy Init is the simplest creational pattern. Check-null-then-construct, store on the instance, return. `functools.cached_property` makes it a one-liner in Python.
