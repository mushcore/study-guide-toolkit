---
n: 26
id: inheritance-super
title: "Inheritance and super() — extend, don't duplicate"
hook: "A `Child` that repeats all of `Parent`'s init logic is a bug waiting to happen. `super().__init__()` delegates."
tags: [oop, inheritance, super, override]
module: "OOP Foundations"
source: "Week 2 Slides"
bloom_levels: [understand, apply]
related: [abc-abstract, multiple-inheritance]
---

Inheritance expresses is-a relationships. A `Child` class inherits all attributes and methods of `Parent`; it can override any method and extend with new ones.

```python
class Parent:
    def __init__(self, name):
        self.name = name
    def greet(self):
        return f"Hello, I am {self.name}."

class Child(Parent):
    def __init__(self, name, age):
        super().__init__(name)       # delegate
        self.age = age
    def greet(self):
        return f"{super().greet()} I am {self.age} years old."

Child("Alice", 10).greet()
# Hello, I am Alice. I am 10 years old.
```

> **Q:** Why call `super().__init__(name)` instead of `self.name = name` directly?
> **A:** Delegating to the parent's init runs all of Parent's setup — attributes, side effects, validation — without the child having to remember or duplicate it. If Parent's init later changes, Child picks up the change for free.

## Past-exam output

> **Example**
> A Parent with `greet()` returning `f"Hello, I am {self.name}."` and a Child overriding `greet()` with `f"{super().greet()} I am {self.age} years old."` — `Child("Alice", 10).greet()` outputs `"Hello, I am Alice. I am 10 years old."`. The `super().greet()` call embeds the parent's return value. *Dec 2024 Final T/F Q5.*

## Pitfall

> **Pitfall**
> Forgetting `super().__init__()` in a child class that adds attributes means the parent's attributes never get set. Accessing `self.name` later raises `AttributeError`. Always delegate to super early in your override.

## Takeaway

> **Takeaway**
> `super()` is how Python classes cooperate across an inheritance chain. Use it to avoid duplicating parent logic and to ensure cooperative multiple inheritance works (see MRO in the multiple-inheritance lesson).
