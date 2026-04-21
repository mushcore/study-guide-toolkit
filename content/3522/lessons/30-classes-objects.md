---
n: 30
id: classes-objects
title: "Classes, objects, self, privacy"
hook: "Everything in Python is an object — including classes themselves."
tags: [oop, class, object, privacy, self]
module: "OOP Foundations"
source: "Week 2 Slides, Quiz 2, Dec 2024 Final T/F Q3"
bloom_levels: [remember, understand]
related: [inheritance-super, decorators-lang]
---

A class is a blueprint; an object is an instance. In Python, classes are first-class objects — assignable to variables, passable as arguments, returned from functions.

```python
class Point:
    """A 2D point."""
    count = 0                 # class attribute (shared)

    def __init__(self, x, y):
        self.x = x            # instance attribute
        self.y = y
        Point.count += 1

    def distance_from_origin(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Point(3, 4)
p.distance_from_origin()     # 5.0
Point.count                  # 1
```

- `self` is the instance passed in as the first argument to every method.
- `__init__` is the initializer (not technically a constructor — `__new__` is).
- Class attributes are shared across all instances; instance attributes are per-object.

> **Q:** If class attributes are shared, why does `Point.count += 1` work from an instance method?
> **A:** `Point.count += 1` is a class-level access via the class name — it mutates the class attribute. Contrast with `self.count += 1`, which creates an INSTANCE attribute that shadows the class one. The distinction matters: class attributes are shared, instance attributes are per-object.

## Privacy by convention

Python has no `private` keyword. Conventions:

- `name` — public.
- `_name` — "intended private" — a polite convention. Still accessible.
- `__name` — name-mangled. Inside a class, `__name` becomes `_ClassName__name`. Prevents accidental override in subclasses, but does not prevent intentional access.

```python
class A:
    def __init__(self):
        self.__secret = 42

a = A()
a.__secret              # AttributeError
a._A__secret            # 42 — mangled name works
```

## Past-exam T/F

> **Example**
> "Everything in Python is an object." TRUE. Classes, functions, modules, even integers. *Dec 2024 Final T/F Q3.*

## Takeaway

> **Takeaway**
> Classes in Python are objects. Methods are functions bound to instances. Privacy is a convention, not an enforcement. Understand this and Python's introspection (`dir()`, `type()`, `isinstance()`) makes sense.
