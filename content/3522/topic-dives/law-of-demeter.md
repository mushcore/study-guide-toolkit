---
id: law-of-demeter-dive
title: "Law of Demeter — deep dive"
pillar: tech
priority: mid
tags: [law-of-demeter, coupling, friends]
source: "Week 3 Slides, Week 14 review"
bloom_levels: [understand, apply]
related: [coupling-cohesion, solid-dip]
---

## The rule

A method `m` of class `A` should only call methods on:

1. `self` (methods of `A` itself)
2. Parameters of `m`
3. Objects `m` creates
4. `self`'s direct member attributes

**Not** on objects returned by method calls on those. Not on grandchildren.

## Wallet worked example

Three classes: Cashier → Customer → Wallet. Cashier wants the money.

```python
class Wallet:
    def __init__(self): self._money = 100
    def get_money(self, amount):
        if self._money >= amount:
            self._money -= amount; return amount
        return 0

class Customer:
    def __init__(self):
        self._wallet = Wallet()
    def get_wallet(self): return self._wallet

class Cashier:
    def __init__(self, customer):
        self._customer = customer
    def take_money(self, amount):
        # BAD — train wreck
        return self._customer.get_wallet().get_money(amount)
```

Cashier knows Customer has a Wallet. Break Wallet's API — break Cashier.

```python
# GOOD — add get_money to Customer, Cashier talks to neighbor only
class Customer:
    def __init__(self):
        self._wallet = Wallet()
    def get_money(self, amount):
        return self._wallet.get_money(amount)

class Cashier:
    def request_money(self, amount):
        return self._customer.get_money(amount)
```

Cashier now talks to Customer only. Customer handles Wallet internally.

> **Example**
> The refactor replaces `a.b.c.d()` with `a.do_the_thing()` where `a` internally does the chain. The depth of the chain is absorbed into the first object's interface.

## Pitfall

> **Pitfall**
> Chained fluent APIs (`str.strip().lower().split()`) look like LoD violations but aren't — each call returns the same type, so you're staying within one object's contract. LoD is about reaching across *objects* whose relationships the caller shouldn't know.

## Takeaway

> **Takeaway**
> Count the dots. Two dots usually fine, three+ usually smell. When you see a chain, ask whether pushing the work into the first object would eliminate it. If yes, refactor. The sign on the exam: a method body that starts with `self._x.get_something().get_another_thing().do_something()`.
