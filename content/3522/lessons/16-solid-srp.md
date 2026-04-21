---
n: 16
id: solid-srp
title: "SRP — one class, one reason to change"
hook: "A ShoppingCart that manages items AND calculates shipping AND calculates taxes has three reasons to change. Split it."
tags: [solid, srp, single-responsibility]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, Week 14 review (UIWidget draw), practiceGuidedQuestion-sol.pdf"
bloom_levels: [understand, apply, analyze]
related: [solid-ocp, strategy]
---

Single Responsibility Principle: a class should have one reason to change. If editing the shipping tax logic means opening the same file as editing product catalog logic, you have two responsibilities jammed into one class.

```python
# Violation
class ShoppingCart:
    def __init__(self, items): ...
    def get_total_price(self): ...
    def get_standard_shipping_cost(self, distance): ...
    def get_express_shipping_cost(self, distance): ...
    def apply_discount(self, code): ...
    def send_receipt_email(self, addr): ...
```

Six methods, six reasons to change — pricing rules, shipping, promos, email infrastructure. Refactor: move shipping into a `ShippingStrategy`, discount into a `DiscountService`, email into a `ReceiptMailer`. Cart delegates.

> **Q:** How do you spot SRP violations?
> **A:** Name the responsibilities out loud. If the class needs more than one "and" ("manages items AND calculates shipping AND..."), you're over the limit. Also: count reasons the class might be re-opened in PRs — shipping-rate change, email-template change, tax-code change — each is a separate axis.

## Pitfall

> **Pitfall**
> Past-exam MCQ: "a class like Character directly handles all weapon attack logic" — violates SRP. The character class should not know the mechanics of every weapon; extract `WeaponStrategy` (or similar). *finalexamsmerge.pdf MCQ.*

## Takeaway

> **Takeaway**
> SRP isn't about line count — it's about *axes of change*. One axis per class. On the exam, look for classes with if-chains over type codes or methods named after side concerns — that's multi-responsibility in disguise.
