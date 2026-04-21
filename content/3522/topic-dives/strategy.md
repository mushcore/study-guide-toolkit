---
id: strategy-dive
title: "Strategy — deep dive"
pillar: tech
priority: high
tags: [pattern, behavioral, strategy, algorithm-swap]
source: "DesignPatternsTable p.3, Week 9-10 Slides, review_sample_code/strategy_sample_code*.py, practiceGuidedQuestion-sol.pdf, finalexamsmerge.pdf Q4 + Dec 2024 Q7"
bloom_levels: [understand, apply, analyze]
related: [state, solid-ocp, solid-srp]
---

## When to use

You have a family of algorithms with the same signature. You want to pick one per-instance or swap one at runtime. The context using the algorithm should not care which one runs.

Signature red flag: a giant method that takes a `mode: str` argument and branches on it.

## Canonical class diagram

<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="30" y="30" width="180" height="100" class="cls" />
  <text x="60" y="50">Context</text>
  <line x1="30" y1="60" x2="210" y2="60" stroke="#333" />
  <text x="40" y="78">- strategy: Strategy</text>
  <line x1="30" y1="88" x2="210" y2="88" stroke="#333" />
  <text x="40" y="105">+ set_strategy(Strategy)</text>
  <text x="40" y="122">+ do_something()</text>
  <rect x="370" y="30" width="200" height="90" class="iface" />
  <text x="410" y="50" class="it">«interface» Strategy</text>
  <line x1="370" y1="60" x2="570" y2="60" stroke="#333" />
  <line x1="370" y1="62" x2="570" y2="62" stroke="#333" />
  <text x="380" y="85" class="it">+ execute(data)</text>
  <polygon points="215,80 205,74 205,86" fill="#fff" stroke="#333" />
  <path d="M220,80 L370,80" class="arrow" />
  <text x="240" y="75">has-a</text>
  <rect x="300" y="190" width="120" height="60" class="cls" />
  <text x="325" y="215">StrategyA</text>
  <rect x="440" y="190" width="120" height="60" class="cls" />
  <text x="465" y="215">StrategyB</text>
  <path d="M360,190 L460,130" class="arrow" />
  <polygon points="455,125 466,128 460,137" class="inh" />
  <path d="M500,190 L475,130" class="arrow" />
  <polygon points="470,126 481,128 475,138" class="inh" />
</svg>

## Worked example — shipping calculator refactor

**Before** — a `ShoppingCart` with two hard-coded shipping methods, violating SRP + OCP:

```python
class ShoppingCart:
    def get_standard_shipping_cost(self, distance):
        return 5 + 2 * self.weight + 0.1 * distance
    def get_express_shipping_cost(self, distance):
        return 10 + 3 * self.weight + 0.2 * distance
```

**After** — Strategy pattern:

```python
from abc import ABC, abstractmethod

class ShippingStrategy(ABC):
    @abstractmethod
    def calculate_cost(self, weight, distance): pass

class StandardShipping(ShippingStrategy):
    def calculate_cost(self, weight, distance):
        return 5 + 2 * weight + 0.1 * distance

class ExpressShipping(ShippingStrategy):
    def calculate_cost(self, weight, distance):
        return 10 + 3 * weight + 0.2 * distance

class ShoppingCart:
    def __init__(self, items):
        self.items = items
        self.weight = sum(i.weight for i in items)
    def set_shipping_strategy(self, strategy):
        self.shipping_strategy = strategy
    def get_shipping_cost(self, distance):
        return self.shipping_strategy.calculate_cost(self.weight, distance)

cart = ShoppingCart([...])
cart.set_shipping_strategy(StandardShipping())
cart.get_shipping_cost(100)
```

Adding `NextDayShipping` is a new class — `ShoppingCart` unchanged. *practiceGuidedQuestion-sol.pdf*

> **Example**
> Duck simulator: `Duck` has `_fly_behavior` and `_quack_behavior` attributes injected at construction. `MallardDuck(FlyWithWings(), Quack())`, `RubberDuck(FlyNoWay(), Squeak())`. `duck.perform_fly()` delegates. Answer to past-exam Q4: Strategy. *finalexamsmerge.pdf Q4*

## Strategy vs related patterns

| Pattern | Shape | Key difference |
|---|---|---|
| **Strategy** | Context → Strategy (abstract) | Client picks strategy; no transitions between strategies |
| **State** | Context → State (abstract) | States pick next state; lifecycle inside |
| **Bridge** | Abstraction → Implementation | Both hierarchies evolve independently; not a run-time swap primarily |
| **Factory** | Creator → Product | Strategy swaps *behavior* of existing object; Factory *produces* objects |

## Pitfalls

> **Pitfall**
> Client must know about concrete strategies to construct them. Strategy does not reduce the number of classes the client has to know — it just decouples the context. *Dec 2024 Final Q7 correct: B.*

> **Pitfall**
> Don't store strategy-specific state in the Strategy object if multiple contexts share it. Example: caching last result inside a shared `StandardShipping()` instance leaks between carts. Make strategies pure.

> **Pitfall**
> UML arrow direction matters on the exam: Context → Strategy is a composition (filled diamond on Context's end) or plain association. ConcreteStrategyA and B inherit from Strategy (hollow triangle pointing up).

## Takeaway

> **Takeaway**
> Strategy is the "interface + inject" refactor for if-chains on algorithm choice. Pair it with DIP — the Context depends on an abstraction, concrete strategies implement the abstraction. This is also the canonical exam refactor when you're given SOLID-violating code.
