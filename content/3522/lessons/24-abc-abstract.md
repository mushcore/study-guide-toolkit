---
n: 24
id: abc-abstract
title: "Abstract base classes — enforce a contract"
hook: "Every pattern in this course starts with `from abc import ABC, abstractmethod`. Know why."
tags: [oop, abc, abstractmethod, interface]
module: "OOP Foundations"
source: "Week 2 Slides, Quiz 2"
bloom_levels: [understand, apply]
related: [inheritance-super, protocols, solid-dip]
---

Python has no `interface` keyword. The equivalent is an abstract base class (ABC) — a class that cannot be instantiated and declares methods subclasses must implement.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

Shape()       # TypeError: Can't instantiate abstract class Shape
Circle(3).area()   # OK
```

If `Circle` forgot to override `area`, instantiating it would also raise `TypeError`. The ABC enforces the contract at construction time.

> **Q:** Why would you write `@abstractmethod` on an empty `pass` body?
> **A:** The body runs only if a subclass calls `super().area()` explicitly. More importantly, the decorator makes instantiation of any subclass that hasn't overridden the method fail early — at construction, not when the missing method is first called.

## Pattern usage

Every pattern lesson in this course uses ABCs for the interface layer:
- Strategy: `ShippingStrategy(ABC)` with `@abstractmethod def calculate_cost(self, w, d)`.
- State: `TrafficLightState(ABC)` with `@abstractmethod def next(self, tl)`.
- Observer: `Observer(ABC)` with `@abstractmethod def update(self, subject, data)`.
- Decorator: `Beverage(ABC)` with `@abstractmethod def cost(self)`.

## Pitfall

> **Pitfall**
> `ABC` + no abstract methods = just a regular class. The `@abstractmethod` decorator is what triggers the enforcement. A common bug: inheriting from `ABC` and expecting it to "be an interface" without decorating any methods.

## Takeaway

> **Takeaway**
> Abstract base classes are Python's way of saying "this class is incomplete — subclasses must fill in the blanks". Every pattern uses them. Memorize the two-import line.
