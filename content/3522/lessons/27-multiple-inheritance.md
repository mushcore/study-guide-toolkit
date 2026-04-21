---
n: 27
id: multiple-inheritance
title: "Multiple inheritance + MRO — the diamond problem"
hook: "Two parents, one shared grandparent. Python's C3 linearization picks the method resolution order for you."
tags: [oop, multiple-inheritance, mro, diamond]
module: "OOP Foundations"
source: "Week 5 Slides"
bloom_levels: [understand, apply, analyze]
related: [inheritance-super, abc-abstract]
---

Python allows a class to inherit from multiple parents:

```python
class A:
    def hello(self): print("A")
class B:
    def hello(self): print("B")
class C(A, B):
    pass

C().hello()   # "A" — leftmost first
```

When both parents define the same method, Python resolves by **MRO (Method Resolution Order)** — the sequence Python searches for an attribute. Algorithm: C3 linearization. Inspect via `ClassName.__mro__`:

```python
C.__mro__
# (<class 'C'>, <class 'A'>, <class 'B'>, <class 'object'>)
```

## The diamond problem

```python
class Animal:
    def greet(self): print("Animal")
class Mammal(Animal):
    def greet(self):
        print("Mammal")
        super().greet()
class Bird(Animal):
    def greet(self):
        print("Bird")
        super().greet()
class Bat(Mammal, Bird):   # diamond — both parents inherit from Animal
    def greet(self):
        print("Bat")
        super().greet()

Bat().greet()
# Bat
# Mammal
# Bird      ← MRO routes super() to Bird, not Animal directly
# Animal
```

MRO resolves diamond by linearizing: `Bat → Mammal → Bird → Animal`. `super()` in each class calls the next in MRO, not its own listed parent — this is cooperative multiple inheritance.

> **Q:** Why does `Mammal.greet()` call `super().greet()` and end up in `Bird`, not `Animal`?
> **A:** Because `super()` respects the MRO of the concrete class (`Bat`), not the inheritance graph of the class where `super()` appears. From `Bat`'s perspective, the parent after `Mammal` in the MRO is `Bird`, so `super().greet()` inside `Mammal.greet()` calls `Bird.greet()`.

## Pitfall

> **Pitfall**
> MRO failures raise `TypeError: Cannot create a consistent method resolution order`. Happens when inheritance declarations force an impossible linearization — e.g. `class X(A, B)` where some ancestor of B requires that B come before A. Rearrange the inheritance list or restructure.

## Takeaway

> **Takeaway**
> Multiple inheritance works, but mix parents carefully. Use `super()` religiously (never call parent classes by name) so the MRO handles the chain. When in doubt, print `ClassName.__mro__`.
