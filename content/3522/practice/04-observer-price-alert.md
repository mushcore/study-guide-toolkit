---
n: 4
id: cp-observer-price-alert
title: "Observer pattern — price alert broadcast"
lang: python
tags: [pattern, observer, publish-subscribe]
source: "DesignPatternsTable p.1, Week 9 Slides"
pedagogy: worked-example-first
kind: code
---

## Prompt

Implement a `Subject` class that maintains a list of observers and notifies them when its `price` changes. Observers receive a `(subject, price)` pair in `update()`. Attach two observers (`EmailAlert`, `DashboardTile`) and trigger a price change.

Target UML:

<svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="20" y="40" width="220" height="110" class="cls" />
  <text x="70" y="60">PriceSubject</text>
  <line x1="20" y1="70" x2="240" y2="70" stroke="#333" />
  <text x="30" y="88">- observers: list</text>
  <text x="30" y="105">- price: float</text>
  <line x1="20" y1="115" x2="240" y2="115" stroke="#333" />
  <text x="30" y="132">+ attach/detach/notify</text>
  <text x="30" y="148">+ set_price(p)</text>
  <rect x="380" y="40" width="220" height="70" class="iface" />
  <text x="415" y="60" class="it">«interface» Observer</text>
  <line x1="380" y1="70" x2="600" y2="70" stroke="#333" />
  <line x1="380" y1="72" x2="600" y2="72" stroke="#333" />
  <text x="390" y="95" class="it">+ update(subject, price)</text>
  <path d="M240,85 L380,85" class="arrow dashed" />
  <polygon points="375,80 385,85 375,90" fill="#333" />
  <text x="270" y="78">notifies *</text>
  <rect x="340" y="200" width="120" height="60" class="cls" />
  <text x="360" y="225">EmailAlert</text>
  <rect x="480" y="200" width="140" height="60" class="cls" />
  <text x="495" y="225">DashboardTile</text>
  <path d="M400,200 L460,110" class="arrow" />
  <polygon points="455,105 466,108 461,117" class="inh" />
  <path d="M550,200 L510,110" class="arrow" />
  <polygon points="505,107 516,108 511,117" class="inh" />
</svg>

## Starter

```python
class PriceSubject:
    def __init__(self):
        self._observers = []
        self._price = 0
    # TODO: attach, detach, set_price, _notify

class EmailAlert:
    # TODO: update(subject, price)
    pass

class DashboardTile:
    # TODO: update(subject, price)
    pass
```

## Solution

```python
class PriceSubject:
    def __init__(self):
        self._observers = []
        self._price = 0
    def attach(self, observer):
        if observer not in self._observers:
            self._observers.append(observer)
    def detach(self, observer):
        if observer in self._observers:
            self._observers.remove(observer)
    def _notify(self):
        for observer in list(self._observers):
            observer.update(self, self._price)
    def set_price(self, new_price):
        self._price = new_price
        self._notify()

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

## Why

The subject stores observers as a bare list. It doesn't import or know the types `EmailAlert` / `DashboardTile` — only that they quack with `update(subject, price)`. That's duck typing and loose coupling in one.

Two wrong approaches:
1. **Iterating `self._observers` while an observer detaches itself during update.** Python raises `RuntimeError: list changed size during iteration`. Iterate over a copy: `for o in list(self._observers):`.
2. **Confusing with State pattern.** If the claim is "observers know about each other and trigger transitions", that's State, not Observer. Observers are independent peers — they don't know other observers exist. *Past-exam T/F trap.*
