---
n: 5
id: mediator
title: "Mediator — a traffic cop for peer-to-peer chaos"
hook: "Five UI widgets. Each one triggers updates to the others. That's twenty direct dependencies. Add a sixth widget — thirty. A mediator collapses this to a star."
tags: [pattern, behavioral, mediator, coordination]
module: "Design Patterns — Behavioral"
source: "DesignPatternsTable (1).pdf p.4, Week 11 Slides, Lecture Transcripts (Mediator intro + example), finalexamsmerge.pdf dashboard-widgets MCQ"
bloom_levels: [understand, apply, analyze]
related: [observer, facade]
---

A dashboard has four filters: date range, region, product, and view-type. Changing the date range might invalidate the current product filter. Changing the region might reset the view. Without a mediator, each filter holds references to every other filter — N² coupling. Add a fifth filter and you're editing every other one.

## The mediator catches the ball

```python
class Mediator:
    def notify(self, sender, event): raise NotImplementedError

class Component:
    def __init__(self, mediator):
        self._mediator = mediator

class DateFilter(Component):
    def on_change(self):
        self._mediator.notify(self, "date_changed")

class DashboardMediator(Mediator):
    def __init__(self):
        self.date_filter = DateFilter(self)
        self.region_filter = RegionFilter(self)
        self.view = ViewPanel(self)
    def notify(self, sender, event):
        if sender is self.date_filter and event == "date_changed":
            self.region_filter.reset()
            self.view.refresh()
        elif sender is self.region_filter and event == "region_changed":
            self.view.refresh()
```

Each component calls `self._mediator.notify(self, event)` blindly. The mediator decides who reacts. Components hold one ref (to the mediator) — not N-1 refs.

> **Q:** Same scenario as Observer: a broadcast on change. When is Mediator the better choice?
> **A:** Observer = one subject, many homogeneous reactors, broadcast-the-same-event. Mediator = many peers that interact *differently* with each other — the coordinator picks what happens to whom. Past-exam MCQ: "a modular dashboard application where widgets (charts, filters, status panels) need to update one another based on user actions, but should remain independent and reusable" → **Mediator**, not Observer. *finalexamsmerge.pdf*

## Structure

- **Mediator interface** — declares `notify(sender, event)`.
- **Concrete mediator** — knows every component, routes messages.
- **Components** — hold mediator ref, fire events, never talk to each other directly.

## Mediator vs Facade

Facade is one-way: client → subsystem via a simplified API. Subsystem components stay oblivious. Mediator is two-way: components talk *through* the mediator to each other.

## Pitfalls

> **Pitfall**
> The mediator can become a god-object as components proliferate. When a mediator grows to thousands of lines of routing logic, you haven't solved the coupling — you've centralized it. Split into smaller mediators or re-examine whether the components actually need to coordinate.

> **Pitfall**
> Past-exam distractor: "Mediator focuses on dynamic one-way communication, while Observer centralizes communication among objects" — backwards. *Mediator* centralizes communication; *Observer* is the one-way broadcast. *Dec 2024 Final Q9: correct = B.*

## Takeaway

> **Takeaway**
> Mediator turns N² peer-to-peer coupling into N-to-1 coupling with a central coordinator. You pay by concentrating routing knowledge in one class — worth it when components need complex, asymmetric reactions to each other.
