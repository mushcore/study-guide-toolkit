---
n: 10
id: singleton
title: "Singleton — exactly one, globally reachable"
hook: "A save system. A config registry. A DB connection pool. Some things should exist in exactly one instance, accessible from anywhere."
tags: [pattern, creational, singleton]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.7, Week 9 Slides, Quiz 7"
bloom_levels: [remember, understand, apply]
related: [factory]
---

The definition is short: ensure a class has only one instance, and provide a global point of access to it. When a second `SaveSystem()` is a bug, Singleton says "make the second one impossible."

## Python implementations

### Via `__new__` override

```python
class SaveSystem:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init()
        return cls._instance
    def _init(self):
        self.data = {}

s1 = SaveSystem()
s2 = SaveSystem()
s1 is s2   # True
```

Every `SaveSystem()` call returns the same object. The class itself is the "global access point".

### Via decorator

```python
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Config: ...
```

### Via module-level

In Python, modules are already singletons — import once, cache forever. A module-level variable is the simplest singleton.

> **Q:** What's the downside of making everything a Singleton?
> **A:** Singletons are global mutable state in disguise. They couple unrelated code through the shared instance, break unit tests (tests share the same instance), and make dependencies implicit. Use sparingly — only when there really must be one.

## When to use

- Shared resources (config, logger, connection pool).
- Coordinating access point (save system, event bus).
- Caches where duplication would waste memory.

## When NOT to use

- Anywhere you can just pass an instance via constructor (dependency injection).
- Anywhere testability matters.
- "Global variables dressed up" is an anti-pattern smell.

## Takeaway

> **Takeaway**
> Singleton is two things: one instance + global access. Both halves matter — a class with only one instance that isn't globally reachable isn't a Singleton; a globally-reachable class that allows multiple instances isn't either. Its biggest risk: hidden coupling through shared state.
