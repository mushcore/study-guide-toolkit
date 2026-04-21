---
n: 21
id: law-of-demeter
title: "Law of Demeter — talk to friends, not strangers"
hook: "`customer.get_wallet().get_money(amount)` reaches across two classes. Let the customer hand over the money."
tags: [law-of-demeter, coupling, design-principle]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, Week 14 review (Cashier/Customer/Wallet)"
bloom_levels: [understand, apply]
related: [coupling-cohesion, solid-srp]
---

Law of Demeter: each unit should have only limited knowledge about other units — only units "closely related" to the current one. A method should call methods only on:

1. Itself (`self`).
2. Its parameters.
3. Objects it creates.
4. Its direct member attributes.

"Don't talk to strangers" — don't chain calls that reach deep into another object's internals.

```python
# Violation — train wreck
money = self._customer.get_wallet().get_money(amount)
#                      ^^^^^^^^^^^^^^ Cashier knows Customer has a Wallet
```

Cashier now depends on Customer's internal structure. Change Wallet's API and Cashier breaks. Fix: give Customer a `get_money` method that delegates to its own wallet.

```python
# OK
money = self._customer.get_money(amount)
# Customer.get_money: return self._wallet.get_money(amount)
```

Cashier no longer knows Customer holds a Wallet. If Customer later switches to `BankAccount`, Cashier is unaffected.

> **Q:** Why is it sometimes called "Suggestion of Demeter"?
> **A:** Because it's one of the most frequently broken rules — Python's duck typing + fluent APIs make chained calls tempting. Treat it as a strong default, not an absolute ban.

## Pitfall

> **Pitfall**
> Past-exam scenario: `obj.getX().getY().getZ().doSomething()`. Violates Law of Demeter. Refactor by pushing behavior into the first object so the chain disappears. *Week 14 review.*

## Takeaway

> **Takeaway**
> Count the dots. Two-dot chains are usually fine. Three+ (`a.b.c.d`) are red flags — the calling class knows too much. Refactor by adding a method on the first object that handles the chain internally.
