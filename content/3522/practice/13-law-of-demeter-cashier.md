---
n: 13
id: cp-lod-cashier
title: "Law of Demeter — Cashier + Customer + Wallet refactor"
lang: python
tags: [law-of-demeter, coupling, refactor]
source: "Week 14 review slides"
pedagogy: productive-failure
kind: code
---

## Prompt

The `Cashier.take_money()` method violates Law of Demeter by reaching through `Customer` into `Wallet`. Refactor so Cashier only calls methods on its direct neighbor (Customer). Customer hides the Wallet from Cashier.

## Starter

```python
class Wallet:
    def __init__(self):
        self._money = 100
    def get_money(self, amount):
        if self._money >= amount:
            self._money -= amount
            return amount
        return 0

class Customer:
    def __init__(self):
        self._wallet = Wallet()
    def get_wallet(self):
        return self._wallet

class Cashier:
    def __init__(self, customer):
        self._customer = customer
    def take_money(self, amount):
        # VIOLATION — Cashier reaches into Customer's Wallet
        return self._customer.get_wallet().get_money(amount)
```

## Solution

```python
class Wallet:
    def __init__(self):
        self._money = 100
    def get_money(self, amount):
        if self._money >= amount:
            self._money -= amount
            return amount
        return 0

class Customer:
    def __init__(self):
        self._wallet = Wallet()
    def get_money(self, amount):
        return self._wallet.get_money(amount)

class Cashier:
    def __init__(self, customer):
        self._customer = customer
    def request_money(self, amount):
        return self._customer.get_money(amount)

cashier = Cashier(Customer())
print(cashier.request_money(40))   # 40
print(cashier.request_money(80))   # 60 (only 60 left)
print(cashier.request_money(10))   # 0 — empty
```

## Why

The refactor adds a `get_money` method on `Customer` that delegates to its Wallet. Cashier no longer knows Customer has a Wallet — the Wallet's existence is an implementation detail of Customer.

Benefit: if Customer later switches from Wallet to BankAccount or a digital payment provider, Cashier's code is unchanged. The chain `customer.get_wallet().get_money(...)` would have broken; `customer.get_money(...)` does not.

Two wrong approaches:
1. **Removing `get_wallet()` but leaving the chain in Cashier.** You've removed the violation from one place but still have the tight coupling elsewhere. The fix is to delegate, not to hide the accessor.
2. **Making Wallet a public attribute on Customer** (`customer.wallet.get_money(...)`). Same depth of violation — Demeter applies to attribute access chains just as much as method-call chains.
