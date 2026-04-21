---
id: state-dive
title: "State — deep dive"
pillar: tech
priority: high
tags: [pattern, behavioral, state, traffic-light]
source: "DesignPatternsTable p.3, Week 10 Slides, Week10SampleCode/game_state_pattern.py + document_state_pattern_example.py + dog_state.py, finalexamsmerge.pdf Q1+Q16"
bloom_levels: [understand, apply, analyze]
related: [strategy, abc-abstract]
---

## When to use

Reach for State when your object's behavior is dominated by its current mode and the modes have structured transitions. Classic cases: UI screens (`MainMenu` / `Gameplay` / `GameOver`), documents (`Draft` / `Moderation` / `Published`), connections (`Idle` / `Connected` / `Error`), traffic lights.

Red flags that you need it: your class has an attribute like `self._mode = "idle"` and half your methods branch on it.

## Canonical class diagram

<svg viewBox="0 0 620 340" xmlns="http://www.w3.org/2000/svg">
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
  <text x="50" y="50">Context (TrafficLight)</text>
  <line x1="30" y1="60" x2="210" y2="60" stroke="#333" />
  <text x="40" y="78">- state: State</text>
  <line x1="30" y1="88" x2="210" y2="88" stroke="#333" />
  <text x="40" y="105">+ change_state(State)</text>
  <text x="40" y="122">+ switch()</text>
  <rect x="340" y="30" width="200" height="90" class="iface" />
  <text x="400" y="50" class="it">«interface» State</text>
  <line x1="340" y1="60" x2="540" y2="60" stroke="#333" />
  <line x1="340" y1="62" x2="540" y2="62" stroke="#333" />
  <text x="350" y="85" class="it">+ next(context)</text>
  <path d="M210,80 L340,80" class="arrow dashed" />
  <polygon points="335,75 345,80 335,85" fill="#333" />
  <text x="230" y="75">delegates</text>
  <rect x="260" y="190" width="110" height="60" class="cls" />
  <text x="285" y="215">Red</text>
  <rect x="390" y="190" width="110" height="60" class="cls" />
  <text x="415" y="215">Yellow</text>
  <rect x="520" y="190" width="110" height="60" class="cls" />
  <text x="545" y="215">Green</text>
  <path d="M315,190 L430,130" class="arrow" />
  <polygon points="425,125 436,128 430,137" class="inh" />
  <path d="M445,190 L445,130" class="arrow" />
  <polygon points="440,130 450,130 445,122" class="inh" />
  <path d="M575,190 L460,130" class="arrow" />
  <polygon points="464,125 457,135 452,127" class="inh" />
  <text x="70" y="270" font-size="11" fill="#555">
    Concrete states know how to transition: each one's next() sets context.state to another state.
  </text>
</svg>

## Worked example — vending machine

Three states: `NoCoin`, `HasCoin`, `Dispensing`. Actions: `insert_coin()`, `press_button()`.

```python
from abc import ABC, abstractmethod

class VendingState(ABC):
    @abstractmethod
    def insert_coin(self, machine): pass
    @abstractmethod
    def press_button(self, machine): pass

class NoCoin(VendingState):
    def insert_coin(self, machine):
        print("Coin accepted")
        machine.state = HasCoin()
    def press_button(self, machine):
        print("Insert a coin first")

class HasCoin(VendingState):
    def insert_coin(self, machine):
        print("Already has a coin")
    def press_button(self, machine):
        print("Dispensing...")
        machine.state = Dispensing()
        machine.state.press_button(machine)  # auto-advance

class Dispensing(VendingState):
    def insert_coin(self, machine):
        print("Wait — dispensing")
    def press_button(self, machine):
        print("Done. Ready for next customer.")
        machine.state = NoCoin()

class VendingMachine:
    def __init__(self):
        self.state = NoCoin()
    def insert_coin(self):
        self.state.insert_coin(self)
    def press_button(self):
        self.state.press_button(self)

vm = VendingMachine()
vm.insert_coin()   # Coin accepted
vm.insert_coin()   # Already has a coin
vm.press_button()  # Dispensing... Done.
```

> **Example**
> Adding a `Maintenance` state: create a new class `class Maintenance(VendingState)` with both methods saying "machine under maintenance" and a transition back to `NoCoin` on some trigger. Zero edits to `NoCoin`, `HasCoin`, `Dispensing`, or `VendingMachine`. That is OCP in action.

## Past-exam identification

> **Example**
> *finalexamsmerge.pdf Q1:* Given TrafficLight code with `Red`, `Yellow`, `Green` classes each calling `traffic_light.change_light(...)` → the answer is State. Distractors: Strategy (no state transitions, no context-back-reference), Chain of Responsibility (no `_successor`), Observer (no observer list / notify).

## Pitfalls

> **Pitfall**
> Every state class holding a back-reference to the context tightens coupling. That's OK — it's how State works. But don't also pass the context as a parameter to every method *and* store it on the state; pick one. In Week 14 review, the pattern is "state.set_context(self); state.update()" — `set_context` stores, `update` uses it.

> **Pitfall**
> Forgetting to update `context.state` inside a transition leaves the machine stuck. Writing `Green()` without assigning it to `machine.state` just creates and discards an instance.

> **Pitfall**
> State vs Strategy on the exam: State is identified by a state machine (multiple states, each transitions to other states). Strategy is identified by "one plug-in algorithm, swapped externally, no transitions between algorithms". If you see self-transitions inside the variant classes, it is State. *Dec 2024 Final Q10.*

## Takeaway

> **Takeaway**
> State externalizes the state machine. You trade one class with a growing if-chain for many focused classes that each know one behavior and one transition. Review the TrafficLight code the instructor used in class — past exams cite it verbatim.
