---
n: 1
id: state
title: "State — behavior changes with internal state"
hook: "A vending machine acts differently depending on what it's doing right now. The State pattern turns that into separate classes, not a 20-branch if-chain."
tags: [pattern, behavioral, state, traffic-light]
module: "Design Patterns — Behavioral"
source: "DesignPatternsTable (1).pdf p.3, Week 10 Slides, Week10SampleCode/document_state_pattern_example.py + game_state_pattern.py, finalexamsmerge.pdf Q1+Q16"
bloom_levels: [understand, apply, analyze]
related: [strategy, observer, abc-abstract]
pedagogy: productive-failure
---

Picture a traffic light. `Red` turns to `Green`, `Green` turns to `Yellow`, `Yellow` turns back to `Red`. The naive way:

```python
class TrafficLight:
    def __init__(self):
        self.color = "red"
    def switch(self):
        if self.color == "red":
            print("Red -> Green")
            self.color = "green"
        elif self.color == "green":
            print("Green -> Yellow")
            self.color = "yellow"
        elif self.color == "yellow":
            print("Yellow -> Red")
            self.color = "red"
```

> **Q:** What breaks when you add a fourth state (say, `Flashing` for maintenance)?
> **A:** Every method on `TrafficLight` that branches on `self.color` needs a new `elif`. Miss one, and the light behaves like the old state in that method. The SRP and OCP violations compound as the state machine grows.

## The fix — state as a class

Extract each state into its own class. The context (`TrafficLight`) holds a reference to the current state object and delegates behavior to it. The state object knows how to transition.

```python
from abc import ABC, abstractmethod

class TrafficLightState(ABC):
    @abstractmethod
    def next(self, traffic_light): pass

class Red(TrafficLightState):
    def next(self, traffic_light):
        print("Red -> Green")
        traffic_light.change_state(Green())

class Green(TrafficLightState):
    def next(self, traffic_light):
        print("Green -> Yellow")
        traffic_light.change_state(Yellow())

class Yellow(TrafficLightState):
    def next(self, traffic_light):
        print("Yellow -> Red")
        traffic_light.change_state(Red())

class TrafficLight:
    def __init__(self):
        self.state = Red()
    def change_state(self, state):
        self.state = state
    def switch(self):
        self.state.next(self)
```

Adding `Flashing` is a new class, zero edits to existing states — OCP satisfied.

## Structure

- **Context** — holds current `state` ref, delegates to it, exposes `change_state()`.
- **State interface** — abstract methods for behaviors that vary by state.
- **Concrete states** — implement behavior AND decide the next transition.

## Pitfalls

> **Pitfall**
> State objects are NOT independent. They typically know about *other* state classes (because they instantiate the next state in their transition logic) and often hold a reference to the context. If you see a T/F claim that "state objects are completely independent and unaware of each other," it is FALSE — that description fits Observer, where observers don't know about each other. *finalexamsmerge.pdf T/F Q7*

> **Pitfall**
> Don't confuse State with Strategy. Both delegate to a pluggable object. The key difference: State objects *trigger their own transitions* (the context's state changes over its lifetime), while Strategy objects are typically swapped by the client from outside and are otherwise independent. Strategy isolates algorithms; State orchestrates a lifecycle.

## Takeaway

> **Takeaway**
> The State pattern trades one class with many `if self.state == X` branches for many state classes each with one behavior. You pay the price of more classes to gain OCP: a new state is a new file, never an edit to an existing one. If the context's behavior is dominated by what it's *doing right now*, reach for State.
