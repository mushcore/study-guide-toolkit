---
id: singleton-dive
title: "Singleton pattern — deep dive"
pillar: tech
priority: mid
tags: [pattern, creational, singleton, global-state]
source: "DesignPatternsTable p.7, Week 9 Slides, Quiz 7"
bloom_levels: [remember, understand, apply]
related: [factory, lazy-init]
---

## When to use

A single instance must be shared across the whole program (config, logger, save system, connection pool). Multiple instances would either waste resources or cause correctness bugs.

## Class diagram

<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
  </style>
  <rect x="120" y="40" width="200" height="100" class="cls" />
  <text x="190" y="60">Singleton</text>
  <line x1="120" y1="70" x2="320" y2="70" stroke="#333" />
  <text x="130" y="90">- instance: Singleton</text>
  <line x1="120" y1="98" x2="320" y2="98" stroke="#333" />
  <text x="130" y="118">+ get_instance() : Singleton</text>
  <path d="M320,100 C360,100 360,50 220,40" fill="none" stroke="#333" />
  <polygon points="224,36 214,44 222,50" fill="#333" />
</svg>

The self-referencing arrow represents the class holding its own instance.

## Python implementations

### 1. Override `__new__`

```python
class Singleton:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Singleton(); b = Singleton()
a is b   # True
```

Pitfall: `__init__` runs on every `Singleton()` call, so avoid putting one-time setup there. Use a flag or move to `__new__`.

### 2. Decorator

```python
def singleton(cls):
    _instances = {}
    def wrapper(*args, **kwargs):
        if cls not in _instances:
            _instances[cls] = cls(*args, **kwargs)
        return _instances[cls]
    return wrapper

@singleton
class Config: ...
```

### 3. Metaclass

```python
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Config(metaclass=SingletonMeta): ...
```

### 4. Module-level (idiomatic Python)

In Python, modules are cached after first import — a module-level variable is already a de facto singleton.

```python
# save_system.py
data = {}
def save(k, v): data[k] = v

# other.py
from save_system import save   # shared across imports
```

## Common pitfalls

> **Pitfall**
> Singleton is global mutable state in costume. Tests that share the instance pollute each other; code that depends on the Singleton can't be used with a mock. Prefer dependency injection when practical.

> **Pitfall**
> Multithreading: the `if cls._instance is None` check is not atomic. Two threads can both pass the check before either assigns. Guard with a lock if thread-safety matters.

> **Pitfall**
> A class with only one instance that isn't globally accessible isn't a Singleton — it's just "one instance". The "global point of access" half of the definition matters for the exam.

## Takeaway

> **Takeaway**
> Singleton guarantees one instance with global access. Simple pattern, but its downsides (hidden coupling, test hostility) make it controversial. Know the four Python implementations and know when *not* to reach for it.
