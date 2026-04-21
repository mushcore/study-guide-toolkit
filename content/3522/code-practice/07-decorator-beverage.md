---
n: 7
id: cp-decorator-beverage
title: "Decorator — Beverage + Condiment (guided question)"
lang: python
tags: [pattern, decorator, beverage]
source: "finalexamsmerge.pdf Guided Written Question"
pedagogy: worked-example-first
---

## Prompt

Refactor a beverage+condiment system using the Decorator pattern. You must have:
1. Abstract `Beverage` with `cost()` + `get_description()`.
2. Concrete beverages `DarkRoast` (0.99) + `HouseBlend` (0.89).
3. Abstract `CondimentDecorator(Beverage)` wrapping a beverage + storing a `condiment_cost`.
4. Concrete decorators `Milk` (0.10), `Mocha` (0.20), `Soy` (0.15), `Whip` (0.10).

Target client code:
```python
beverage = DarkRoast()
beverage = Mocha(beverage)
beverage = Whip(beverage)
beverage = Soy(beverage, 0.12)   # custom Soy cost
print(beverage.get_description())  # Dark Roast Coffee, Mocha, Whip, Soy
print(beverage.cost())             # 1.41
```

## Starter

```python
from abc import ABC, abstractmethod

class Beverage(ABC):
    def __init__(self):
        self.description = "Unknown Beverage"
    def get_description(self):
        return self.description
    @abstractmethod
    def cost(self):
        pass

# TODO: DarkRoast, HouseBlend
# TODO: CondimentDecorator(Beverage)
# TODO: Milk, Mocha, Soy, Whip
```

## Solution

```python
from abc import ABC, abstractmethod

class Beverage(ABC):
    def __init__(self):
        self.description = "Unknown Beverage"
    def get_description(self):
        return self.description
    @abstractmethod
    def cost(self):
        pass

class DarkRoast(Beverage):
    def __init__(self):
        super().__init__()
        self.description = "Dark Roast Coffee"
    def cost(self):
        return 0.99

class HouseBlend(Beverage):
    def __init__(self):
        super().__init__()
        self.description = "House Blend Coffee"
    def cost(self):
        return 0.89

class CondimentDecorator(Beverage):
    def __init__(self, beverage, condiment_cost):
        super().__init__()
        self.beverage = beverage
        self.condiment_cost = condiment_cost
    @abstractmethod
    def cost(self):
        pass

class Milk(CondimentDecorator):
    def __init__(self, beverage, custom_cost=0.10):
        super().__init__(beverage, custom_cost)
    def get_description(self):
        return self.beverage.get_description() + ", Milk"
    def cost(self):
        return self.beverage.cost() + self.condiment_cost

class Mocha(CondimentDecorator):
    def __init__(self, beverage, custom_cost=0.20):
        super().__init__(beverage, custom_cost)
    def get_description(self):
        return self.beverage.get_description() + ", Mocha"
    def cost(self):
        return self.beverage.cost() + self.condiment_cost

class Soy(CondimentDecorator):
    def __init__(self, beverage, custom_cost=0.15):
        super().__init__(beverage, custom_cost)
    def get_description(self):
        return self.beverage.get_description() + ", Soy"
    def cost(self):
        return self.beverage.cost() + self.condiment_cost

class Whip(CondimentDecorator):
    def __init__(self, beverage, custom_cost=0.10):
        super().__init__(beverage, custom_cost)
    def get_description(self):
        return self.beverage.get_description() + ", Whip"
    def cost(self):
        return self.beverage.cost() + self.condiment_cost

beverage = DarkRoast()
beverage = Mocha(beverage)
beverage = Whip(beverage)
beverage = Soy(beverage, 0.12)
print(beverage.get_description())   # Dark Roast Coffee, Mocha, Whip, Soy
print(beverage.cost())              # 1.41
```

## Why

Each `CondimentDecorator` subclass holds a `Beverage` reference and adds its own cost/description slice via `self.beverage.cost() + self.condiment_cost`. The chain of `cost()` calls unwinds recursively: `Soy → Whip → Mocha → DarkRoast` = 0.12 + 0.10 + 0.20 + 0.99 = 1.41.

Two wrong approaches:
1. **Subclassing for each combination** (`DarkRoastWithMochaWhipSoy(DarkRoast)`) — classic decorator anti-pattern. Combinatorial class explosion.
2. **Storing condiment costs in a dict inside Beverage** — that's the original pre-refactor code. Violates SRP (Beverage knows all condiments) and OCP (new condiments require editing Beverage).
