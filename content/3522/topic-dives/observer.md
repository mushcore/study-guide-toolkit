---
id: observer-dive
title: "Observer — deep dive"
pillar: tech
priority: high
tags: [pattern, behavioral, observer, publish-subscribe]
source: "DesignPatternsTable p.1, Week 9 Slides, Quiz 7, finalexamsmerge.pdf async-Observer Q"
bloom_levels: [understand, apply, analyze]
related: [mediator, state]
---

## When to use

One object's state changes and an unknown-ahead-of-time set of other objects need to react. The subject should not import / know about its reactors.

Signals: you're hard-coding a list of "and now also update X, Y, Z" inside a setter. Every new reactor means editing the subject. Or: observers live in plugins / modules loaded at runtime.

## Canonical class diagram

<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="30" y="30" width="220" height="120" class="cls" />
  <text x="90" y="50">Subject</text>
  <line x1="30" y1="60" x2="250" y2="60" stroke="#333" />
  <text x="40" y="78">- observers: list</text>
  <line x1="30" y1="88" x2="250" y2="88" stroke="#333" />
  <text x="40" y="108">+ attach(Observer)</text>
  <text x="40" y="125">+ detach(Observer)</text>
  <text x="40" y="142">+ notify(data)</text>
  <rect x="410" y="30" width="200" height="80" class="iface" />
  <text x="450" y="50" class="it">«interface» Observer</text>
  <line x1="410" y1="60" x2="610" y2="60" stroke="#333" />
  <line x1="410" y1="62" x2="610" y2="62" stroke="#333" />
  <text x="420" y="85" class="it">+ update(subject, data)</text>
  <path d="M250,75 L410,75" class="arrow dashed" />
  <polygon points="405,70 415,75 405,80" fill="#333" />
  <text x="290" y="68">notifies *</text>
  <rect x="340" y="200" width="120" height="60" class="cls" />
  <text x="360" y="225">ObserverA</text>
  <rect x="480" y="200" width="120" height="60" class="cls" />
  <text x="500" y="225">ObserverB</text>
  <path d="M400,200 L500,110" class="arrow" />
  <polygon points="496,106 507,108 502,117" class="inh" />
  <path d="M540,200 L515,110" class="arrow" />
  <polygon points="510,107 521,108 516,118" class="inh" />
</svg>

## Worked example — price alert

```python
class PriceSubject:
    def __init__(self):
        self._observers = []
        self._price = 0
    def attach(self, o):
        if o not in self._observers:
            self._observers.append(o)
    def detach(self, o):
        if o in self._observers:
            self._observers.remove(o)
    def set_price(self, new_price):
        self._price = new_price
        self._notify()
    def _notify(self):
        for o in self._observers:
            o.update(self, self._price)

class EmailAlert:
    def update(self, subject, price):
        print(f"Email sent: new price {price}")

class DashboardTile:
    def update(self, subject, price):
        print(f"Tile refreshed: {price}")

stock = PriceSubject()
stock.attach(EmailAlert())
stock.attach(DashboardTile())
stock.set_price(42)
# Email sent: new price 42
# Tile refreshed: 42
```

## Async observer (past-exam variant)

```python
import asyncio

class Subject:
    def __init__(self):
        self._observers = []
    async def notify(self, msg):
        for o in self._observers:
            await o.update(msg)

class Observer:
    async def update(self, msg):
        await asyncio.sleep(0.5)
        print(f"Got {msg}")

async def main():
    s = Subject()
    s._observers = [Observer(), Observer()]
    t1 = asyncio.create_task(s.notify("hi"))
    t2 = asyncio.create_task(s.notify("bye"))
    await t1; await t2
# ≈ 1 sec total — two notify()s serialize each observer internally,
# but the two gather-ed tasks interleave.
```

> **Example**
> *finalexamsmerge.pdf async Q:* similar code, answer ≈ 0.6 seconds, not 2.0. The `sleep(0.5)` inside each observer runs concurrently across tasks. If each `notify` has 2 observers with 0.5s sleep = 1s each, and two notifies run concurrently via `create_task`, total ≈ 1s — but with `asyncio.gather(task_notify1, task_notify2)` the serialized awaits overlap. Read the exact code carefully.

## Observer vs Mediator vs Chain of Responsibility

| | Who knows whom | Communication | Intent |
|---|---|---|---|
| **Observer** | Subject knows list of observers; observers know subject | Broadcast: one → many, same event | Decouple state-change from reactions |
| **Mediator** | Mediator knows all components; components know mediator | Routed peer-to-peer through mediator | Replace N² peer coupling |
| **Chain of Responsibility** | Handler knows next handler | Pipeline: request passed until handled | Decouple sender from processor |

## Pitfalls

> **Pitfall**
> Don't hand out the subject from an observer's `update(subject, data)` unless you want observers to mutate the subject. If they do, you've created a feedback loop — subject changes → notify → observer updates subject → notify → stack overflow.

> **Pitfall**
> Iterating `self._observers` and mutating it (e.g., an observer detaches itself during `update`) raises `RuntimeError`. Iterate over a copy: `for o in list(self._observers):`.

> **Pitfall**
> Past-exam T/F: "In the State pattern, state objects are independent and unaware of each other." FALSE — that describes Observer. State objects typically know transition targets.

## Takeaway

> **Takeaway**
> Observer is the pub/sub pattern — broadcast without coupling. Perfect for event systems where reactors come and go and the subject shouldn't care. Pair it with `asyncio` if reactions are I/O-bound.
