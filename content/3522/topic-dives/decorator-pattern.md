---
id: decorator-pattern-dive
title: "Decorator pattern — deep dive"
pillar: tech
priority: high
tags: [pattern, structural, decorator, composition]
source: "DesignPatternsTable p.5, Week 11 Slides, finalexamsmerge.pdf Beverage+Condiment guided Q + Notifier refactor + Dec 2024 Q8+Q14"
bloom_levels: [understand, apply, analyze]
related: [proxy, strategy]
---

## When to use

Behavior combines additively at runtime. You want to stack optional features without subclass explosion. Canonical domains: I/O streams (buffered + compressed + encrypted + logged), UI (scroll + border + shadow), messaging (basic + email + SMS + Slack), beverages.

## Canonical class diagram

<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    .abs { fill: #fff6ea; stroke: #a06a2a; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="260" y="20" width="180" height="70" class="iface" />
  <text x="300" y="40" class="it">«interface» Beverage</text>
  <line x1="260" y1="50" x2="440" y2="50" stroke="#333" />
  <line x1="260" y1="52" x2="440" y2="52" stroke="#333" />
  <text x="270" y="75" class="it">+ cost() / description()</text>
  <rect x="30" y="200" width="160" height="70" class="cls" />
  <text x="75" y="225">Coffee</text>
  <text x="40" y="250" font-size="11">concrete component</text>
  <path d="M110,200 L310,90" class="arrow" />
  <polygon points="305,85 316,88 311,97" class="inh" />
  <rect x="260" y="200" width="240" height="100" class="abs" />
  <text x="300" y="225" class="it">CondimentDecorator</text>
  <line x1="260" y1="235" x2="500" y2="235" stroke="#333" />
  <text x="270" y="255">- beverage: Beverage</text>
  <line x1="260" y1="263" x2="500" y2="263" stroke="#333" />
  <text x="270" y="283">+ cost() / description()</text>
  <path d="M380,200 L380,90" class="arrow" />
  <polygon points="375,95 385,95 380,85" fill="#fff" stroke="#333" />
  <path d="M500,250 C560,250 540,170 400,160" class="arrow" />
  <text x="540" y="220" font-size="10">wraps</text>
  <rect x="540" y="320" width="100" height="30" class="cls" />
  <text x="555" y="340" font-size="11">Mocha / Whip / Soy</text>
  <path d="M560,320 L390,300" class="arrow" />
  <polygon points="394,294 388,304 382,296" class="inh" />
</svg>

Each concrete decorator inherits from `CondimentDecorator` and adds its slice of behavior.

## Worked example — nested cost trace

```python
coffee = Coffee()              # cost = 0.99
mocha = Mocha(coffee)          # cost = 0.99 + 0.20 = 1.19
whip  = Whip(mocha)            # cost = 1.19 + 0.10 = 1.29
soy   = Soy(whip, 0.12)        # cost = 1.29 + 0.12 = 1.41
soy.description()
# "Coffee, Mocha, Whip, Soy"
soy.cost()
# 1.41
```

Each wrapper's `cost()` = `self.beverage.cost() + self.condiment_cost`. The call chain unwinds like a recursive sum.

## Past-exam MCQ — output trace

```python
class Coffee:
    def cost(self): return 5
class MilkDecorator:
    def __init__(self, c): self._c = c
    def cost(self): return self._c.cost() + 2
class SugarDecorator:
    def __init__(self, c): self._c = c
    def cost(self): return self._c.cost() + 1
class CaramelDecorator:
    def __init__(self, c): self._c = c
    def cost(self): return self._c.cost() + 3

x = CaramelDecorator(SugarDecorator(MilkDecorator(Coffee())))
print(x.cost())                                           # 5+2+1+3 = 11
print(CaramelDecorator(CaramelDecorator(SugarDecorator(MilkDecorator(Coffee())))).cost())
# 5+2+1+3+3 = 14 — not Option C (11, 11)
```

Wait — re-read the past-exam Q14 carefully. First expression `coffee_with_all_decorators = CaramelDecorator(SugarDecorator(MilkDecorator(Coffee())))` = 5+2+1+3 = 11. `print(coffee_with_all_decorators.cost())` → 11. Second `print`: `CaramelDecorator(CaramelDecorator(SugarDecorator(MilkDecorator(Coffee()))))` = 5+2+1+3+3 = 14. Answer: (11, 14) — Option B. *Dec 2024 Final Q14.*

> **Example**
> Stacking two Caramels doubles the +3 bump. Python doesn't dedupe decorator types — each instance adds its own cost. If business rules say "Caramel only once", enforce in the decorator (check if inner already has Caramel), not in the client.

## The composition rule

```python
# WRONG (inheritance, not Decorator)
class NotifierWithEmail(Notifier):
    def send(self):
        print("basic"); print("email")

# RIGHT (Decorator — composition)
class NotifierDecorator(Notifier):
    def __init__(self, notifier):
        self._notifier = notifier
    def send(self):
        self._notifier.send()

class EmailNotifier(NotifierDecorator):
    def send(self):
        super().send()
        print("email")

# Usage: client stacks them at runtime
notifier = SMSNotifier(EmailNotifier(Notifier()))
notifier.send()
# basic / email / sms
```

## Pitfalls

> **Pitfall**
> Inheritance-only impl without composition = NOT Decorator. The red flag is a subclass that does NOT hold a reference to a wrapped object. *finalexamsmerge.pdf Notifier refactor — the original code was wrong for this reason.*

> **Pitfall**
> Decorators stack in order. `Mocha(Whip(Coffee()))` and `Whip(Mocha(Coffee()))` produce the same cost but different descriptions ("Coffee, Whip, Mocha" vs "Coffee, Mocha, Whip"). If description ordering matters, document the expected stack.

> **Pitfall**
> Decorator vs Proxy — same structure, different intent. Decorator adds behavior; Proxy controls access. T/F: "Decorator and Proxy have similar structures, but very different intents" is TRUE. *Dec 2024 Final Q3 T/F.*

## Takeaway

> **Takeaway**
> Decorator: wrap, store, delegate, add. The stored reference is the structural requirement; if it's missing, it's not Decorator. Past exams use Coffee, Beverage, and Notifier as the test cases — know them cold.
