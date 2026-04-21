---
n: 28
id: decorators-lang
title: "Language decorators — @staticmethod, @classmethod, @property"
hook: "Distinct from the Decorator pattern. These are Python syntax sugar for method-level annotations."
tags: [python, decorators, staticmethod, classmethod, property]
module: "OOP Foundations"
source: "Week 2 + Week 6 Slides, Quiz 2, Dec 2024 Final Q1"
bloom_levels: [remember, understand, apply]
related: [decorator-pattern, classes-objects]
---

Python decorators are functions that modify other functions or methods. The `@decorator` syntax above a `def` applies the decorator to the function below. Built-in decorators for class methods:

## `@staticmethod`

No `self`, no `cls`. Just a function that happens to live inside a class namespace.

```python
class MathUtils:
    @staticmethod
    def square(x):
        return x * x

MathUtils.square(5)    # 25 — no instance needed
```

Cannot access instance attributes (no `self`) OR class attributes (no `cls`). If it needs neither, use staticmethod.

> **Pitfall**
> Past-exam T/F trap: "The `@staticmethod` decorator allows a method to access class-level variables." FALSE. Use `@classmethod` for class-level access. *Dec 2024 Final T/F Q1.*

> **Q:** If `@staticmethod` can't access class vars, why namespace it inside a class at all?
> **A:** Organization and discovery — the method is logically related to the class's domain. `MathUtils.square(x)` reads cleaner than a free-floating `square(x)`. Static methods also participate in inheritance (subclasses can override) unlike free functions. Think of them as "functions that belong here conceptually."

## `@classmethod`

First argument is `cls` (the class itself), not `self`. Can access class attributes, create alternative constructors, or work with subclasses polymorphically.

```python
class Pizza:
    shape = "round"
    def __init__(self, toppings):
        self.toppings = toppings
    @classmethod
    def margherita(cls):
        return cls(["tomato", "mozzarella", "basil"])

p = Pizza.margherita()   # alternative constructor
```

## `@property`

Exposes a method as if it were an attribute. Access `obj.total` instead of `obj.get_total()`.

```python
class Cart:
    def __init__(self):
        self.items = []
    @property
    def total(self):
        return sum(i.price for i in self.items)

cart = Cart()
cart.total      # calls total() under the hood — no parens
```

Pair with `@total.setter` for writable properties.

## Takeaway

> **Takeaway**
> Three decorators, three signatures: `@staticmethod` (no self/cls), `@classmethod` (cls), `@property` (self, exposed attribute-style). Don't confuse these language-level decorators with the Decorator *pattern* — entirely different concept.
