---
n: 22
id: coupling-cohesion
title: "Coupling & cohesion — the twin measuring sticks"
hook: "Low coupling, high cohesion. Classes should be tight internally, loose externally."
tags: [coupling, cohesion, dependency-injection]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, Quiz 3, review_sample_code/coupling_*.py"
bloom_levels: [understand, apply, analyze]
related: [law-of-demeter, solid-dip, solid-srp]
---

Two dual measures of design quality:

- **Coupling** — how dependent one class is on another's details. Measured by the number and intimacy of references. Low coupling = easy to change, easy to test.
- **Cohesion** — how closely a class's members belong together. Measured by whether the methods share attributes / purpose. High cohesion = easy to understand.

Good design aims for **low coupling, high cohesion**.

## Types of coupling (worst → best)

1. **Content coupling** — one class directly modifies another's private state. Avoid.
2. **Common coupling** — multiple classes share a global variable. Avoid.
3. **Control coupling** — one class passes a flag that controls another's internal branching.
4. **Stamp coupling** — passing a whole object when only one field is needed.
5. **Data coupling** — parameters are simple values. Good.

## Two-way coupling is especially bad

```python
class A:
    def __init__(self, b): self.b = b
class B:
    def __init__(self, a): self.a = a   # cyclic!
```

A knows about B, B knows about A. Changing either breaks both. Break the cycle with an interface or mediator.

## Dependency injection reduces coupling

Instead of a class creating its dependencies, pass them in:

```python
# High coupling — Cart creates its own dependencies
class Cart:
    def __init__(self):
        self.shipping = StandardShipping()   # coupled to concrete class

# Low coupling — inject
class Cart:
    def __init__(self, shipping: ShippingStrategy):
        self.shipping = shipping
```

> **Q:** Is zero coupling the goal?
> **A:** No — classes must collaborate, so some coupling is mandatory. The goal is MINIMAL and INDIRECT coupling. Zero coupling means classes can't talk to each other at all, which is useless. Data coupling (passing simple values through parameters) is the baseline "good enough" target.

## Takeaway

> **Takeaway**
> Coupling is the enemy of change. DI, interfaces, and DIP all aim to reduce it. Cohesion is the friend of understanding — keep related things together (SRP is essentially "keep cohesion high"). Measure by asking "if I change X, how many other files must I also change?" — the answer is a rough coupling score.
