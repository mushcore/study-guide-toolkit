---
n: 31
id: protocols
title: "Protocols — structural duck typing with type checking"
hook: "Get the flexibility of duck typing AND the safety of static type checking."
tags: [oop, protocols, typing, structural]
module: "OOP Foundations"
source: "Week 5 Slides"
bloom_levels: [understand, apply]
related: [abc-abstract, polymorphism-duck]
---

`typing.Protocol` (PEP 544) defines an interface by *shape*, not by inheritance. Any class exposing the listed methods satisfies the Protocol, whether or not it declares so.

```python
from typing import Protocol

class Quackable(Protocol):
    def quack(self) -> None: ...

class Duck:
    def quack(self) -> None:
        print("Quack")

class Person:
    def quack(self) -> None:
        print("(pretending) Quack")

def make_it_quack(thing: Quackable) -> None:
    thing.quack()

make_it_quack(Duck())
make_it_quack(Person())
```

Neither `Duck` nor `Person` inherits from `Quackable`. Both have a `quack()` method. Static type checkers (mypy, pyright) accept both as compatible.

> **Q:** If Python is already duck-typed, why use Protocol at all?
> **A:** Static type checkers (mypy, pyright) need a way to describe "any object with these methods". Without Protocol, you'd have to use `Any` or inherit a Protocol class to satisfy the checker. Protocol lets the checker verify compatibility without runtime inheritance — bridging static safety and duck flexibility.

## Protocol vs ABC

- **ABC** — nominal typing. You MUST inherit from the ABC to be considered compatible.
- **Protocol** — structural typing. If your class has the methods, it IS compatible.

Protocol is Pythonic duck typing made static-checkable. ABC is for when you want runtime enforcement at instantiation.

## Takeaway

> **Takeaway**
> Protocols formalize duck typing. Use when you want the flexibility ("any class with these methods works") plus type-checker support. Use ABC when you want to block instantiation of incomplete subclasses at runtime.
