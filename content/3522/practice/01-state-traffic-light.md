---
n: 1
id: cp-state-traffic-light
title: "State pattern — TrafficLight from scratch"
lang: python
tags: [pattern, state, uml, traffic-light]
source: "finalexamsmerge.pdf Q1 + Q16 (Dec 2024 Final)"
pedagogy: worked-example-first
kind: code
---

## Prompt

Implement a traffic light using the State pattern. The light cycles Red → Green → Yellow → Red. Each call to `switch()` advances one step and prints the transition. Use an abstract `TrafficLightState` base class with a `next(traffic_light)` method. Each concrete state changes the context's state via `traffic_light.change_state(...)`.

Target UML (reproduce on exam if asked):

<svg viewBox="0 0 620 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="30" y="30" width="180" height="90" class="cls" />
  <text x="45" y="50">TrafficLight</text>
  <line x1="30" y1="60" x2="210" y2="60" stroke="#333" />
  <text x="40" y="78">- state: TrafficLightState</text>
  <line x1="30" y1="86" x2="210" y2="86" stroke="#333" />
  <text x="40" y="103">+ change_state(state)</text>
  <text x="40" y="117">+ switch()</text>
  <rect x="340" y="30" width="240" height="90" class="iface" />
  <text x="390" y="50" class="it">«interface» TrafficLightState</text>
  <line x1="340" y1="60" x2="580" y2="60" stroke="#333" />
  <line x1="340" y1="62" x2="580" y2="62" stroke="#333" />
  <text x="350" y="85" class="it">+ next(traffic_light)</text>
  <path d="M210,75 L340,75" class="arrow dashed" />
  <polygon points="335,70 345,75 335,80" fill="#333" />
  <rect x="260" y="180" width="110" height="60" class="cls" />
  <text x="295" y="205">Red</text>
  <rect x="390" y="180" width="110" height="60" class="cls" />
  <text x="420" y="205">Yellow</text>
  <rect x="520" y="180" width="100" height="60" class="cls" />
  <text x="550" y="205">Green</text>
  <path d="M315,180 L430,120" class="arrow" />
  <polygon points="425,115 436,118 430,127" class="inh" />
  <path d="M445,180 L445,120" class="arrow" />
  <polygon points="440,120 450,120 445,112" class="inh" />
  <path d="M570,180 L460,120" class="arrow" />
  <polygon points="464,115 456,125 451,117" class="inh" />
</svg>

## Starter

```python
from abc import ABC, abstractmethod

class TrafficLightState(ABC):
    @abstractmethod
    def next(self, traffic_light):
        pass

class Red(TrafficLightState):
    # TODO

class Yellow(TrafficLightState):
    # TODO

class Green(TrafficLightState):
    # TODO

class TrafficLight:
    # TODO: __init__ starts in Red, has change_state and switch
    pass
```

## Solution

```python
from abc import ABC, abstractmethod

class TrafficLightState(ABC):
    @abstractmethod
    def next(self, traffic_light):
        pass

class Red(TrafficLightState):
    def next(self, traffic_light):
        print("Red light -> Switching to green.")
        traffic_light.change_state(Green())

class Yellow(TrafficLightState):
    def next(self, traffic_light):
        print("Yellow light -> Switching to red.")
        traffic_light.change_state(Red())

class Green(TrafficLightState):
    def next(self, traffic_light):
        print("Green light -> Switching to yellow.")
        traffic_light.change_state(Yellow())

class TrafficLight:
    def __init__(self):
        self.state = Red()
    def change_state(self, state):
        self.state = state
    def switch(self):
        self.state.next(self)

tl = TrafficLight()
tl.switch()   # Red light -> Switching to green.
tl.switch()   # Green light -> Switching to yellow.
tl.switch()   # Yellow light -> Switching to red.
tl.switch()   # Red light -> Switching to green. (cycle repeats)
```

## Why

The abstract `TrafficLightState` guarantees every concrete state answers the same question ("what happens next?") while letting each pick its own transition target. The context (`TrafficLight`) holds one state reference and delegates `switch()` to it — zero `if/elif` on state name.

Two common wrong approaches on the exam:
1. **Missing the context back-reference.** If `Red.next()` doesn't receive the traffic_light or can't mutate it, you can't transition. The standard signature `next(self, traffic_light)` threads the context through so transitions work.
2. **State tries to instantiate the next state but doesn't assign it.** Writing `Green()` alone creates and discards. Must call `traffic_light.change_state(Green())`. Past-exam Q16 distractors have this bug — the "faithful" implementation is the one where every `next()` ends in `traffic_light.change_state(...)`.
