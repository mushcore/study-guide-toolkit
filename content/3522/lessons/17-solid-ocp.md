---
n: 17
id: solid-ocp
title: "OCP — open for extension, closed for modification"
hook: "Adding a new weapon type should be a new class, not a new `elif` in `take_damage()`."
tags: [solid, ocp, open-closed]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, Week 14 review (UIWidget + take_damage), Quiz 3"
bloom_levels: [understand, apply, analyze]
related: [solid-srp, strategy, solid-dip]
---

The Open/Closed Principle (Bertrand Meyer): software should be open to *extension*, closed to *modification*. Once a class is shipped and tested, new requirements should add new classes — not rewrite old ones.

```python
# Violation: every new enemy type = edit this method
def take_damage(self):
    if self._type == "Troll":
        print("Dodged!")
    elif self._type == "Evil Turtle":
        print("Blocked!")
    elif self._type == "Human Underling":
        print(f"{self.name} took damage!")
    else:
        print("Missed!")
```

Fix: make `Enemy` an abstract base with a `take_damage()` method; each concrete enemy overrides. New enemies = new subclasses.

```python
class Enemy(ABC):
    @abstractmethod
    def take_damage(self): pass

class Troll(Enemy):
    def take_damage(self): print("Dodged!")
class EvilTurtle(Enemy):
    def take_damage(self): print("Blocked!")
```

> **Q:** What if-chain patterns are OCP red flags?
> **A:** Anything that switches on a type code (`if shape.type == "circle"`), a flag string (`if event == "click"`), or an enum where the class owns behavior per variant. The fix is usually polymorphism — each variant implements the behavior in its own class.

## Past-exam cue

> **Example**
> Quiz question: a `take_damage(self)` method with if-elif over `self._type`. Which SOLID principle would you apply? **OCP.** Distractors: "Object Inversion Principle" (doesn't exist), Law of Demeter (about chain-accessing neighbors, not this). *Week 14 review.*

## Takeaway

> **Takeaway**
> OCP is operationalized through abstraction + inheritance. Define the contract once as an abstract base; extensions implement the contract without touching the base. If you find yourself editing a file to "add support for X", OCP is being violated.
