---
id: abstract-factory-dive
title: "Abstract Factory — deep dive"
pillar: tech
priority: mid
tags: [pattern, creational, abstract-factory, families]
source: "DesignPatternsTable p.8, Week 10 Slides, Quiz 8, Week10SampleCode/game_abstract_factory.py"
bloom_levels: [understand, apply, analyze]
related: [factory, bridge]
---

## When to use

Your client needs *multiple* related products that must match internally. Mixing Victorian chair + Modern sofa = visual inconsistency. Mixing MySQL connection + PostgreSQL query builder = runtime failure. Abstract Factory produces whole matching sets.

## Canonical class diagram

<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="240" y="20" width="240" height="90" class="iface" />
  <text x="275" y="40" class="it">«interface» FurnitureFactory</text>
  <line x1="240" y1="50" x2="480" y2="50" stroke="#333" />
  <line x1="240" y1="52" x2="480" y2="52" stroke="#333" />
  <text x="250" y="75" class="it">+ create_chair() : Chair</text>
  <text x="250" y="92" class="it">+ create_sofa() : Sofa</text>
  <rect x="20" y="180" width="200" height="70" class="cls" />
  <text x="55" y="205">VictorianFurniture</text>
  <text x="30" y="232" font-size="11">+ create_chair(), create_sofa()</text>
  <rect x="240" y="180" width="200" height="70" class="cls" />
  <text x="290" y="205">ModernFurniture</text>
  <text x="250" y="232" font-size="11">+ create_chair(), create_sofa()</text>
  <path d="M120,180 L330,110" class="arrow" />
  <polygon points="325,105 336,108 331,117" class="inh" />
  <path d="M340,180 L360,110" class="arrow" />
  <polygon points="355,105 366,108 361,117" class="inh" />
  <rect x="500" y="180" width="100" height="50" class="cls" />
  <text x="520" y="205">Chair</text>
  <rect x="600" y="180" width="100" height="50" class="cls" />
  <text x="625" y="205">Sofa</text>
  <rect x="500" y="280" width="100" height="40" class="cls" />
  <text x="510" y="305" font-size="10">Victorian/Modern Chair</text>
  <rect x="600" y="280" width="100" height="40" class="cls" />
  <text x="610" y="305" font-size="10">Victorian/Modern Sofa</text>
  <path d="M550,280 L550,230" class="arrow" />
  <path d="M650,280 L650,230" class="arrow" />
</svg>

## Worked example

```python
from abc import ABC, abstractmethod

class Chair(ABC):
    @abstractmethod
    def sit(self): pass
class Sofa(ABC):
    @abstractmethod
    def lie(self): pass

class VictorianChair(Chair):
    def sit(self): print("Ornate")
class ModernChair(Chair):
    def sit(self): print("Sleek")
class VictorianSofa(Sofa):
    def lie(self): print("Velvet")
class ModernSofa(Sofa):
    def lie(self): print("Leather")

class FurnitureFactory(ABC):
    @abstractmethod
    def create_chair(self) -> Chair: pass
    @abstractmethod
    def create_sofa(self) -> Sofa: pass

class VictorianFactory(FurnitureFactory):
    def create_chair(self): return VictorianChair()
    def create_sofa(self): return VictorianSofa()

class ModernFactory(FurnitureFactory):
    def create_chair(self): return ModernChair()
    def create_sofa(self): return ModernSofa()

def furnish(f: FurnitureFactory):
    f.create_chair().sit()
    f.create_sofa().lie()

furnish(VictorianFactory())
# Ornate
# Velvet
```

Swap `VictorianFactory` → `ModernFactory` → entire family changes consistently.

## Abstract Factory vs Factory Method

- **Factory Method** — one product, one method (`create_product() -> Product`).
- **Abstract Factory** — multiple products, multiple methods (`create_chair() -> Chair`, `create_sofa() -> Sofa`), guaranteed consistent.

If you're picking "one concrete class among N", use Factory Method. If you need "one family among N", use Abstract Factory.

## Takeaway

> **Takeaway**
> Abstract Factory = a factory that produces whole product families. The big win is consistency: clients can't pair products from different families by accident. Scale grows with (product types × families).
