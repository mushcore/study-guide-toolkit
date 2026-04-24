---
n: 10
id: cp-singleton-save-system
title: "Singleton — SaveSystem via __new__"
lang: python
tags: [pattern, singleton]
source: "DesignPatternsTable p.7, Week 9 Slides"
pedagogy: worked-example-first
kind: code
---

## Prompt

Implement a `SaveSystem` class that can only have one instance. Multiple calls to `SaveSystem()` must return the same object. Use the `__new__` override approach.

## Starter

```python
class SaveSystem:
    # TODO: _instance class variable
    # TODO: __new__ override
    # TODO: __init__ sets self.data = {} (but only once)
    def save(self, key, value):
        self.data[key] = value
    def load(self, key):
        return self.data.get(key)
```

## Solution

```python
class SaveSystem:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.data = {}   # one-time init inside __new__
        return cls._instance

    def save(self, key, value):
        self.data[key] = value

    def load(self, key):
        return self.data.get(key)

s1 = SaveSystem()
s2 = SaveSystem()
print(s1 is s2)        # True — same instance
s1.save("score", 42)
print(s2.load("score")) # 42 — shared state
```

## Why

`__new__` is the actual constructor in Python — it allocates the instance. `__init__` merely initializes an already-allocated instance. Overriding `__new__` to return the cached `_instance` means every `SaveSystem()` call returns the same object.

Important trap: if you put `self.data = {}` inside `__init__`, it runs on EVERY `SaveSystem()` call — wiping the shared state. Do initialization inside `__new__` on first creation, or guard with a flag.

Two wrong approaches:
1. **Using a module-level variable without the class-level guarantee.** Works for convention but doesn't prevent a library user from instantiating multiple. The Singleton class enforces the constraint at the construction site.
2. **Forgetting to return `cls._instance` from `__new__`.** Forgetting the return statement makes `__new__` return `None`, which raises `TypeError: __init__() should return None, not 'SaveSystem'`.
