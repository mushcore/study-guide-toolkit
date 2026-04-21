---
n: 18
id: solid-lsp
title: "LSP — subclasses must be substitutable"
hook: "A FreeShipping class that doesn't charge shipping breaks any code that expects a cost. Subclasses must honor the base's contract."
tags: [solid, lsp, liskov]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, practiceGuidedQuestion-sol.pdf"
bloom_levels: [understand, apply]
related: [solid-ocp, abc-abstract]
---

Liskov Substitution Principle (Barbara Liskov): if `S` is a subtype of `T`, then objects of type `T` may be replaced with objects of type `S` without breaking the program. A subclass must honor the base's contract — same method signatures, same behavior expectations.

```python
class ShippingStrategy:
    def calculate_cost(self, weight, distance):
        raise NotImplementedError

class StandardShipping(ShippingStrategy):
    def calculate_cost(self, weight, distance):
        return 5 + 2 * weight + 0.1 * distance

class FreeShipping(ShippingStrategy):   # LSP violation
    def calculate_cost(self, weight, distance):
        if weight > 10:
            raise ValueError("Too heavy for free shipping")
        return 0
```

Code that calls `strategy.calculate_cost(15, 100)` expecting a float now gets a `ValueError` when `strategy` is a `FreeShipping`. The subclass narrowed the acceptable input — that violates LSP. Either accept all inputs the base accepts (returning 0 or None for impossible cases) or widen the base's contract explicitly.

> **Q:** If the FreeShipping subclass is the problem, why not just allow negative costs or sentinel values instead of inheritance?
> **A:** The issue is the subclass CONTRACT — LSP is about whether callers of the base can freely use any subclass. Narrowing preconditions (max weight), widening exceptions, or returning semantically different values all break the caller's assumptions. Either honor the base's contract or don't inherit from it.

## Classic violations

- Subclass throws exceptions the base doesn't.
- Subclass requires more than the base accepts (narrower preconditions).
- Subclass returns less than the base promises (weaker postconditions).
- Subclass changes invariants the base enforces (e.g., `Square(Rectangle)` where setting width also sets height — breaks callers who set independently).

## Pitfall

> **Pitfall**
> LSP is about *behavior*, not just method signatures. A subclass can have the right signatures yet still violate LSP by changing what the methods do in incompatible ways. Tests that pass for `T` should also pass when the test is handed an `S`.

## Takeaway

> **Takeaway**
> If you can't swap a subclass for its base without the calling code noticing, LSP is broken. The fix is to reconsider the inheritance — maybe it's an is-a violation (a Square isn't really a Rectangle in the mathematical sense your code assumes).
