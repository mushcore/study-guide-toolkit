---
n: 11
id: cp-abstract-factory-furniture
title: "Abstract Factory — Furniture families"
lang: python
tags: [pattern, abstract-factory, families]
source: "DesignPatternsTable p.8, Week 10 Slides"
pedagogy: worked-example-first
---

## Prompt

Implement Abstract Factory for furniture. Abstract products: `Chair` + `Sofa`. Concrete families: Victorian + Modern — each with matching chair and sofa. Client passes a factory into `furnish_room(factory)`, which creates both pieces.

## Starter

```python
from abc import ABC, abstractmethod

class Chair(ABC):
    @abstractmethod
    def sit(self): pass

class Sofa(ABC):
    @abstractmethod
    def lie(self): pass

# TODO: VictorianChair, VictorianSofa, ModernChair, ModernSofa
# TODO: FurnitureFactory abstract with create_chair + create_sofa
# TODO: VictorianFurniture, ModernFurniture factories
# TODO: furnish_room(factory) that calls both create methods
```

## Solution

```python
from abc import ABC, abstractmethod

class Chair(ABC):
    @abstractmethod
    def sit(self): pass

class Sofa(ABC):
    @abstractmethod
    def lie(self): pass

class VictorianChair(Chair):
    def sit(self): print("Ornate Victorian chair")
class ModernChair(Chair):
    def sit(self): print("Sleek Modern chair")

class VictorianSofa(Sofa):
    def lie(self): print("Velvet Victorian sofa")
class ModernSofa(Sofa):
    def lie(self): print("Leather Modern sofa")

class FurnitureFactory(ABC):
    @abstractmethod
    def create_chair(self) -> Chair: pass
    @abstractmethod
    def create_sofa(self) -> Sofa: pass

class VictorianFurniture(FurnitureFactory):
    def create_chair(self): return VictorianChair()
    def create_sofa(self): return VictorianSofa()

class ModernFurniture(FurnitureFactory):
    def create_chair(self): return ModernChair()
    def create_sofa(self): return ModernSofa()

def furnish_room(factory: FurnitureFactory):
    chair = factory.create_chair()
    sofa = factory.create_sofa()
    chair.sit()
    sofa.lie()

furnish_room(VictorianFurniture())
# Ornate Victorian chair
# Velvet Victorian sofa

furnish_room(ModernFurniture())
# Sleek Modern chair
# Leather Modern sofa
```

## Why

The `FurnitureFactory` ABC enforces the contract: every concrete factory produces a Chair AND a Sofa. The client (`furnish_room`) depends only on the abstract factory and products — it works with any family that implements the interface.

Key consistency guarantee: a `VictorianFurniture` factory can only return `VictorianChair` + `VictorianSofa`. Clients cannot accidentally mix Modern chair + Victorian sofa because the factory owns that pairing.

Two wrong approaches:
1. **Using Factory Method (one product type) and calling it twice.** Doesn't enforce family consistency — the client must remember to pick matching products for each call.
2. **Passing a string ("victorian" vs "modern") through the client and branching inside a single factory.** Loses the type safety. Abstract Factory's separate concrete-factory classes make the variant explicit in the type system.
