---
n: 11
id: factory
title: "Factory — let a method pick the class"
hook: "Don't scatter `new ConcreteThing()` through the client. Give the client a method that returns the right concrete thing for its situation."
tags: [pattern, creational, factory]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.8, Week 9 Slides, Quiz 7"
bloom_levels: [understand, apply, analyze]
related: [abstract-factory, builder]
---

A forum serves both guests and members. Without a factory:

```python
user = GuestUser() if is_guest else MemberUser()
user.post(msg)
```

The client code imports both concrete classes and carries the decision logic everywhere a user is created. Now add `Moderator` and `Banned` — every user-creation site needs editing.

## Move the decision into a factory

```python
from abc import ABC, abstractmethod

class User(ABC):
    @abstractmethod
    def post(self, msg): pass

class GuestUser(User):
    def post(self, msg): print(f"(guest) {msg}")
class MemberUser(User):
    def post(self, msg): print(f"member: {msg}")

class UserFactory:
    @staticmethod
    def create(kind):
        if kind == "guest": return GuestUser()
        if kind == "member": return MemberUser()
        raise ValueError(f"Unknown user kind: {kind}")

user = UserFactory.create(session.kind)
user.post("hello")
```

The client only imports `UserFactory` + `User` (the abstract base). Concrete classes stay behind the factory.

> **Q:** If the client still has to pass a type string ("guest"/"member") to the factory, haven't we just moved the conditional?
> **A:** Yes — Factory relocates the `if/elif` from many call sites to one place (the factory's `create()`). The win is that the decision lives in ONE file; adding a new user kind is a two-line edit in the factory instead of edits scattered across the codebase. It's a coupling reduction, not a decision elimination.

## Factory vs Abstract Factory

- **Factory (Method)** — one decision point producing one product. `UserFactory.create(kind)` returns a `User`.
- **Abstract Factory** — a factory interface with multiple product methods, and multiple concrete factories producing families of related products. `FurnitureFactory` might have `create_chair()` + `create_sofa()`, with `ModernFurnitureFactory` and `VictorianFurnitureFactory` as concrete variants.

## Canonical drawbacks

> **Pitfall**
> Past-exam MCQ asked for a disadvantage of Factory in large systems. Correct: "The number of classes may grow quickly due to the need for one factory per product." If every product gets its own factory, you've multiplied classes without reducing coupling. Consolidate factories or use Abstract Factory for related groups. *finalexamsmerge.pdf.*

> **Pitfall**
> The factory's `create()` method is an `if/elif` chain on type code — classic code smell for OCP violation. You traded one set of branches for another. Using a registry (`{kind: klass}`) or reflection can improve it, but be aware Factory isn't a free lunch.

## Takeaway

> **Takeaway**
> Factory isolates the decision of "which concrete class now?" into one place. The client depends on the abstract product and the factory, never on the concrete product. It's a basic step toward Dependency Inversion — small, focused, often the right first refactor when `new X()` scatter appears.
