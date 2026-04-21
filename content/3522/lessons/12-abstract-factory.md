---
n: 12
id: abstract-factory
title: "Abstract Factory — families of related products"
hook: "A furniture store sells chairs + sofas + tables. Victorian set or Modern set — but never a Victorian chair with a Modern sofa. An Abstract Factory produces the whole set in one theme."
tags: [pattern, creational, abstract-factory]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.8, Week 10 Slides, Quiz 8, Week10SampleCode/game_abstract_factory.py"
bloom_levels: [understand, apply, analyze]
related: [factory, bridge]
---

Factory Method produces one product per call. Abstract Factory produces *families* of matching products. The client gets a factory object, then asks it for each product — and every product is guaranteed to match the family's theme.

```python
from abc import ABC, abstractmethod

class Chair(ABC):
    @abstractmethod
    def sit(self): pass
class Sofa(ABC):
    @abstractmethod
    def lie(self): pass

class VictorianChair(Chair):
    def sit(self): print("Ornate sitting")
class ModernChair(Chair):
    def sit(self): print("Minimalist sitting")

class VictorianSofa(Sofa):
    def lie(self): print("Velvet lying")
class ModernSofa(Sofa):
    def lie(self): print("Leather lying")

class FurnitureFactory(ABC):
    @abstractmethod
    def create_chair(self): pass
    @abstractmethod
    def create_sofa(self): pass

class VictorianFurniture(FurnitureFactory):
    def create_chair(self): return VictorianChair()
    def create_sofa(self): return VictorianSofa()

class ModernFurniture(FurnitureFactory):
    def create_chair(self): return ModernChair()
    def create_sofa(self): return ModernSofa()

def furnish_room(factory: FurnitureFactory):
    chair = factory.create_chair()
    sofa = factory.create_sofa()
    chair.sit(); sofa.lie()

furnish_room(VictorianFurniture())
# Ornate sitting / Velvet lying
```

Swap the factory, swap the whole family. The client can't accidentally pair a Victorian chair with a Modern sofa — the factory guarantees consistency.

> **Q:** Why not just call Factory twice — `ChairFactory.create('victorian')` + `SofaFactory.create('victorian')`?
> **A:** The client has to remember to pass 'victorian' consistently. One typo produces a Modern chair with a Victorian sofa. Abstract Factory's concrete factory enforces the family — `VictorianFurniture.create_chair()` can only return Victorian chairs. Consistency is guaranteed by construction, not by discipline.

## When to use

- Product families where variants must stay internally consistent (UI themes, database backends with matching connections + queries).
- You want to switch the whole family at once, from configuration.

## Abstract Factory vs Factory

- **Factory (Method)** — one product type, one decision (pick concrete class).
- **Abstract Factory** — N product types, one decision (pick whole family / factory).

## Takeaway

> **Takeaway**
> Abstract Factory is Factory's bigger sibling. Use when consistency across multiple product types matters more than producing any single one. On the exam, the tell is *"families of related objects"* or *"swap the whole theme"*.
