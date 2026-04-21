---
id: builder-dive
title: "Builder pattern — deep dive"
pillar: tech
priority: mid
tags: [pattern, creational, builder, director]
source: "DesignPatternsTable p.9, Week 10 Slides, Lecture Transcripts"
bloom_levels: [understand, apply]
related: [factory, abstract-factory]
---

## When to use

Object construction requires many steps, some optional, with order dependencies. A constructor with a dozen parameters is a smell. Builder extracts construction into its own class(es) that build step-by-step and hand back the finished product.

## Canonical class diagram

<svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
  </style>
  <rect x="20" y="40" width="160" height="90" class="cls" />
  <text x="70" y="60">Director</text>
  <line x1="20" y1="70" x2="180" y2="70" stroke="#333" />
  <text x="30" y="88">- builder: Builder</text>
  <line x1="20" y1="96" x2="180" y2="96" stroke="#333" />
  <text x="30" y="115">+ make(type)</text>
  <rect x="250" y="40" width="200" height="110" class="iface" />
  <text x="295" y="60" class="it">«interface» Builder</text>
  <line x1="250" y1="70" x2="450" y2="70" stroke="#333" />
  <line x1="250" y1="72" x2="450" y2="72" stroke="#333" />
  <text x="260" y="90" class="it">+ reset()</text>
  <text x="260" y="108" class="it">+ build_step_A/B/Z()</text>
  <text x="260" y="128" class="it">+ get_result() : Product</text>
  <path d="M180,95 L250,95" class="arrow" />
  <polygon points="190,90 180,95 190,100" fill="#fff" stroke="#333" />
  <text x="200" y="85" font-size="10">uses</text>
  <rect x="510" y="40" width="160" height="90" class="cls" />
  <text x="545" y="60">ConcreteBuilder</text>
  <text x="520" y="90" font-size="11">implements steps</text>
  <text x="520" y="110" font-size="11">constructs Product</text>
  <path d="M590,40 L365,150" class="arrow" />
  <polygon points="370,148 378,138 382,148" class="inh" />
  <rect x="350" y="220" width="200" height="60" class="cls" />
  <text x="420" y="245">Product</text>
  <text x="370" y="270" font-size="11">the thing being built</text>
</svg>

## Worked example

```python
class Pizza:
    def __init__(self):
        self.size = None
        self.toppings = []
    def __str__(self):
        return f"{self.size} pizza with {', '.join(self.toppings)}"

class PizzaBuilder:
    def __init__(self):
        self.reset()
    def reset(self):
        self._pizza = Pizza()
        return self
    def set_size(self, s):
        self._pizza.size = s; return self
    def add(self, t):
        self._pizza.toppings.append(t); return self
    def get_result(self):
        p = self._pizza; self.reset(); return p

class PizzaDirector:
    def __init__(self, b):
        self.b = b
    def margherita(self):
        self.b.reset().set_size("M").add("Tomato").add("Mozzarella").add("Basil")
        return self.b.get_result()
    def hawaiian(self):
        self.b.reset().set_size("L").add("Ham").add("Pineapple")
        return self.b.get_result()

d = PizzaDirector(PizzaBuilder())
print(d.margherita())  # M pizza with Tomato, Mozzarella, Basil
```

Clients either use the Director (canonical recipes) or the Builder directly (custom).

## Past-exam cue

> **Example**
> MCQ: "Which design pattern constructs complex objects step by step?" → **Builder**. *finalexamsmerge.pdf MCQ Q1.*

## Takeaway

> **Takeaway**
> Builder splits construction into named steps. Pair with a Director for canonical recipes. Skip when a constructor with defaults or keyword args would do the job.
