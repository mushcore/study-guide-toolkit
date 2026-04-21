---
id: factory-dive
title: "Factory pattern — deep dive"
pillar: tech
priority: mid
tags: [pattern, creational, factory]
source: "DesignPatternsTable p.8, Week 9 Slides, Quiz 7"
bloom_levels: [understand, apply, analyze]
related: [abstract-factory, builder, solid-dip]
---

## When to use

You need to create objects, but the decision of *which concrete class* should live in one place, behind an abstraction. Clients depend on the abstract product and the factory — never on concrete products.

## Factory Method vs Simple Factory

- **Simple Factory** — one class with a `create()` static/class method branching on input.
- **Factory Method (GoF)** — abstract creator class with an abstract `factory_method()`; concrete creators override it to return different products.

The course uses both interchangeably — know the simple-factory form for MCQs, the Factory-Method form for class diagrams.

## Canonical class diagram (Factory Method)

<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .abs { fill: #fff6ea; stroke: #a06a2a; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="30" y="20" width="200" height="90" class="abs" />
  <text x="90" y="40" class="it">Creator</text>
  <line x1="30" y1="50" x2="230" y2="50" stroke="#333" />
  <text x="40" y="70">+ some_operation()</text>
  <text x="40" y="88" class="it">+ create_product() : Product</text>
  <rect x="410" y="20" width="210" height="70" class="iface" />
  <text x="460" y="40" class="it">«interface» Product</text>
  <line x1="410" y1="50" x2="620" y2="50" stroke="#333" />
  <line x1="410" y1="52" x2="620" y2="52" stroke="#333" />
  <text x="420" y="75" class="it">+ do_stuff()</text>
  <path d="M230,65 L410,55" class="arrow dashed" />
  <polygon points="405,50 415,55 405,60" fill="#333" />
  <rect x="30" y="200" width="200" height="70" class="cls" />
  <text x="70" y="225">ConcreteCreator</text>
  <text x="40" y="255" font-size="11">+ create_product()</text>
  <path d="M130,200 L130,110" class="arrow" />
  <polygon points="125,115 135,115 130,105" fill="#fff" stroke="#333" />
  <rect x="410" y="200" width="210" height="70" class="cls" />
  <text x="460" y="225">ConcreteProduct</text>
  <path d="M515,200 L515,90" class="arrow" />
  <polygon points="510,95 520,95 515,85" fill="#fff" stroke="#333" />
</svg>

## Worked example

```python
from abc import ABC, abstractmethod

class User(ABC):
    @abstractmethod
    def post(self, msg): pass

class Guest(User):
    def post(self, msg): print(f"(guest) {msg}")
class Member(User):
    def post(self, msg): print(f"(member) {msg}")

class UserFactory:
    @staticmethod
    def create(kind):
        if kind == "guest": return Guest()
        if kind == "member": return Member()
        raise ValueError(f"Unknown {kind}")

user = UserFactory.create(session.kind)
user.post("hi")
```

## Past-exam pitfalls

> **Pitfall**
> Past-exam MCQ: "Which best illustrates a disadvantage of Factory in large systems?" Correct: **"The number of classes may grow quickly due to the need for one factory per product."** Distractors (strict ban on constructors, reliance on subclassing, incompatibility with other patterns) are not canonical drawbacks. *finalexamsmerge.pdf.*

> **Pitfall**
> The factory's `create()` body is itself an `if/elif` chain on type code — you've moved the branching from the client to the factory. Acceptable because the factory owns that concern now; consolidate via a `{kind: klass}` registry if the chain grows.

## Takeaway

> **Takeaway**
> Factory isolates object creation decisions in one place. The client depends on the product abstraction and the factory. Know the drawback: factories can proliferate — one per product — inflating class count without helping coupling.
