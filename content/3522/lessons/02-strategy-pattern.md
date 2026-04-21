---
n: 2
id: strategy
title: "Strategy — swap algorithms at runtime"
hook: "A duck that flies one way. A rubber duck that doesn't fly at all. A jetpack duck. Don't subclass every combination — compose behavior."
tags: [pattern, behavioral, strategy, algorithm-swap]
module: "Design Patterns — Behavioral"
source: "DesignPatternsTable (1).pdf p.3, Week 9-10 Slides, review_sample_code/strategy_sample_code*.py, practiceGuidedQuestion-sol.pdf, finalexamsmerge.pdf Q4 Duck simulator"
bloom_levels: [understand, apply, analyze]
related: [state, solid-ocp, solid-srp]
pedagogy: concreteness-fading
---

Head First's classic example: a `Duck` class with subclasses for mallard, rubber, and decoy ducks. Each overrides `fly()` and `quack()`. Fine for three ducks. Now add a `RocketDuck` that flies differently *and* quacks like a mallard. Subclass explosion.

## Compose, don't inherit

Extract the varying behavior into its own hierarchy.

```python
class FlyBehavior:
    def fly(self): raise NotImplementedError
class FlyWithWings(FlyBehavior):
    def fly(self): print("I'm flying with wings!")
class FlyNoWay(FlyBehavior):
    def fly(self): print("I can't fly :(")

class Duck:
    def __init__(self, fly_behavior):
        self._fly_behavior = fly_behavior
    def perform_fly(self):
        self._fly_behavior.fly()

mallard = Duck(FlyWithWings())
rubber  = Duck(FlyNoWay())
mallard.perform_fly()  # I'm flying with wings!
```

Swap at runtime: `mallard._fly_behavior = FlyNoWay()` turns a flying duck into a grounded one without replacing the object.

> **Q:** Why is this better than `class FlyingMallard(Duck, FlyWithWings)` using multiple inheritance?
> **A:** Inheritance locks behavior at class-definition time. Strategy lets you change behavior per-instance, at runtime, without subclassing. You also avoid combinatorial subclass growth (`m × n` flyXquack combinations become `m + n` behaviors).

## Structure

- **Context** — holds a `strategy` ref, delegates via `execute()` (or `perform_xxx()`).
- **Strategy interface** — the contract every algorithm implements.
- **Concrete strategies** — interchangeable algorithm implementations.

## When to reach for Strategy

- You have an `if/elif` chain selecting an algorithm by type code.
- You want to add new algorithms without changing the context class (OCP).
- The algorithms share an input contract but differ in implementation.

Past-exam SOLID refactor pattern: a `ShoppingCart` with `get_standard_shipping()` + `get_express_shipping()` methods violates OCP (adding overnight shipping = editing the cart). Extract `ShippingStrategy` interface with `calculate_cost(weight, distance)`, inject via `set_shipping_strategy()`. Cart depends on the interface, not concrete shipping logic. *practiceGuidedQuestion-sol.pdf*

## Pitfalls

> **Pitfall**
> The client has to know the concrete strategies exist in order to pick one. Strategy does not hide the variants — it just decouples the context from them. Past-exam MCQ listed this as the canonical Strategy drawback. *Dec 2024 Final Q7*

> **Pitfall**
> Strategy objects are stateless by convention. If two clients share the same strategy instance, keeping state inside it leaks between them. Keep algorithm state in the context or pass it via method args.

## Takeaway

> **Takeaway**
> Strategy replaces "what kind of X am I?" inheritance with "what algorithm do I currently have?" composition. It is the answer when your algorithm varies and your object type doesn't.
