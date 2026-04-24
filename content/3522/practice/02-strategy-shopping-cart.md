---
n: 2
id: cp-strategy-shopping-cart
title: "Strategy pattern — ShoppingCart shipping refactor"
lang: python
tags: [pattern, strategy, solid, refactor]
source: "practiceGuidedQuestion-sol.pdf"
pedagogy: productive-failure
kind: code
---

## Prompt

The `ShoppingCart` class below violates SRP (it knows about multiple shipping algorithms) and OCP (adding a new shipping type means editing the class). Refactor using the Strategy pattern:

1. Define a `ShippingStrategy` ABC with `calculate_cost(weight, distance)`.
2. Extract `StandardShipping` and `ExpressShipping` as concrete strategies.
3. Change `ShoppingCart` to hold a strategy and delegate via `get_shipping_cost(distance)`.

Target UML:

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="20" y="40" width="220" height="120" class="cls" />
  <text x="85" y="60">ShoppingCart</text>
  <line x1="20" y1="70" x2="240" y2="70" stroke="#333" />
  <text x="30" y="88">- items</text>
  <text x="30" y="104">- weight</text>
  <text x="30" y="120">- shipping_strategy</text>
  <line x1="20" y1="128" x2="240" y2="128" stroke="#333" />
  <text x="30" y="145">+ get_total_price()</text>
  <text x="30" y="160">+ get_shipping_cost(dist)</text>
  <rect x="380" y="40" width="280" height="80" class="iface" />
  <text x="430" y="60" class="it">«abstract» ShippingStrategy</text>
  <line x1="380" y1="70" x2="660" y2="70" stroke="#333" />
  <line x1="380" y1="72" x2="660" y2="72" stroke="#333" />
  <text x="390" y="96" class="it">+ calculate_cost(weight, distance)</text>
  <polygon points="245,100 235,94 235,106" fill="#fff" stroke="#333" />
  <path d="M250,100 L380,100" class="arrow" />
  <text x="280" y="92">has-a</text>
  <rect x="360" y="210" width="160" height="70" class="cls" />
  <text x="380" y="235">StandardShipping</text>
  <text x="370" y="260" font-size="11">+ calculate_cost(...)</text>
  <rect x="540" y="210" width="160" height="70" class="cls" />
  <text x="570" y="235">ExpressShipping</text>
  <text x="550" y="260" font-size="11">+ calculate_cost(...)</text>
  <path d="M440,210 L510,120" class="arrow" />
  <polygon points="505,115 516,117 510,126" class="inh" />
  <path d="M620,210 L550,120" class="arrow" />
  <polygon points="554,115 546,125 541,117" class="inh" />
</svg>

## Starter

```python
class Item:
    def __init__(self, name, weight, price):
        self.name = name
        self.weight = weight
        self.price = price

class ShoppingCart:
    def __init__(self, items):
        self.items = items
        self.weight = sum(i.weight for i in items)
    def get_total_price(self):
        return sum(i.price for i in self.items)
    def get_standard_shipping_cost(self, distance):
        return 5 + 2 * self.weight + 0.1 * distance
    def get_express_shipping_cost(self, distance):
        return 10 + 3 * self.weight + 0.2 * distance
```

## Solution

```python
from abc import ABC, abstractmethod

class Item:
    def __init__(self, name, weight, price):
        self.name = name
        self.weight = weight
        self.price = price

class ShippingStrategy(ABC):
    @abstractmethod
    def calculate_cost(self, weight, distance):
        pass

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
        self.shipping_strategy = None
    def get_total_price(self):
        return sum(i.price for i in self.items)
    def set_shipping_strategy(self, strategy):
        self.shipping_strategy = strategy
    def get_shipping_cost(self, distance):
        return self.shipping_strategy.calculate_cost(self.weight, distance)

cart = ShoppingCart([Item("Book", 1, 10), Item("Shirt", 0.5, 20)])
cart.set_shipping_strategy(StandardShipping())
print(cart.get_shipping_cost(100))   # 18.5
cart.set_shipping_strategy(ExpressShipping())
print(cart.get_shipping_cost(100))   # 34.5
```

## Why

The `ShippingStrategy` abstraction is the pivot. `ShoppingCart` now depends on an interface, not on concrete shipping calculations — that's DIP. Adding `NextDayShipping` is a new class that inherits from `ShippingStrategy`; `ShoppingCart` doesn't change — that's OCP.

Two wrong approaches the past exam trap:
1. **Hard-coding strategy inside `__init__`.** If `ShoppingCart.__init__` does `self.shipping_strategy = StandardShipping()`, you can still swap later via `set_shipping_strategy`, but the cart now imports `StandardShipping` — still coupled. Either inject via constructor (`__init__(self, items, strategy)`) or leave None and require explicit set.
2. **Keeping the two shipping methods alongside the strategy.** Refactor means *remove* the old methods; keeping them means the class still has multiple reasons to change (SRP violation still there).
