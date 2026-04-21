---
n: 7
id: decorator-pattern
title: "Decorator — add behavior by wrapping, not subclassing"
hook: "Coffee + milk + mocha + whip + extra shot. Don't write a subclass for every combination. Wrap the coffee."
tags: [pattern, structural, decorator, composition, wrapping]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.5, Week 11 Slides, finalexamsmerge.pdf Beverage+Condiment guided Q + Coffee/Milk/Sugar/Caramel MCQ + Notifier refactor"
bloom_levels: [understand, apply, analyze]
related: [proxy, strategy, solid-ocp]
pedagogy: productive-failure
---

Imagine a `Beverage` class with boolean flags: `has_milk`, `has_mocha`, `has_whip`, `has_soy`. The `cost()` method sums them. The `get_description()` method appends strings. Works for four condiments. Now add honey, caramel, cinnamon, ice — and price overrides per order. The class swells.

Alternative: subclass per combination. `MilkMochaWhipBeverage(Beverage)`, `MilkSoyBeverage(Beverage)` — 2^n subclasses for n condiments. Non-starter.

> **Q:** What's the third option?
> **A:** Wrap the beverage. Each condiment becomes a tiny class that holds a `Beverage` and delegates to it. `Mocha(Coffee())` behaves like a Coffee, but its `cost()` returns `wrapped.cost() + 0.20`. Stack them: `Whip(Mocha(Coffee()))`. Each wrapper adds its slice of behavior.

## The shape

```python
from abc import ABC, abstractmethod

class Beverage(ABC):
    @abstractmethod
    def cost(self): pass
    @abstractmethod
    def description(self): pass

class Coffee(Beverage):
    def cost(self): return 0.99
    def description(self): return "Coffee"

class CondimentDecorator(Beverage):
    def __init__(self, beverage):
        self.beverage = beverage   # wrapped reference
    # subclasses must override cost + description

class Mocha(CondimentDecorator):
    def cost(self):
        return self.beverage.cost() + 0.20
    def description(self):
        return self.beverage.description() + ", Mocha"

class Whip(CondimentDecorator):
    def cost(self):
        return self.beverage.cost() + 0.10
    def description(self):
        return self.beverage.description() + ", Whip"

order = Whip(Mocha(Coffee()))
order.cost()         # 0.99 + 0.20 + 0.10 = 1.29
order.description()  # "Coffee, Mocha, Whip"
```

The client treats the whole stack as a `Beverage`. The stack's order encodes the combination, and the composition — not subclassing — is what makes new combos free.

## Decorator MUST use composition

> **Pitfall**
> A class hierarchy where `NotifierWithEmail(Notifier)` simply *overrides* `send()` to print "basic" + "email" is NOT Decorator — it's plain inheritance. Every new combination (basic+sms+slack) needs a new subclass. The giveaway: look for a stored reference to the wrapped object (`self.beverage = beverage`, `self._notifier = notifier`). True Decorator delegates via `super().send()` or the stored ref; the hierarchy has ONE concrete component and ONE decorator base with multiple decorator subclasses. — *finalexamsmerge.pdf Notifier refactoring*

## Decorator vs Proxy

Same class shape — a wrapper implementing the same interface as the wrapped object. The intents differ:

- **Decorator** — *add* behavior (new features, side effects).
- **Proxy** — *control* access to the wrapped object (caching, authorization, logging, lazy load).

> **Pitfall**
> Past-exam T/F: "Decorator and Proxy have similar structures, but very different intents" — TRUE. They share the wrap-and-delegate shape; one extends, the other gatekeeps.

## Takeaway

> **Takeaway**
> Decorator replaces subclass explosion with stackable wrappers that each add one slice of behavior. When you see nested `A(B(C()))` construction with every layer implementing the same interface, you're looking at Decorator. Reach for it when behavior combines additively at runtime.
