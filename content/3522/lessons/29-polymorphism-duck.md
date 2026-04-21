---
n: 29
id: polymorphism-duck
title: "Polymorphism + duck typing"
hook: "In Python, you don't check what an object *is* — you check what it *does*."
tags: [oop, polymorphism, duck-typing]
module: "OOP Foundations"
source: "Week 2 Slides"
bloom_levels: [understand, apply]
related: [abc-abstract, protocols]
---

**Polymorphism** — the same method call produces different behavior depending on the runtime type of the receiver.

```python
class Dog:
    def speak(self): return "Woof"
class Cat:
    def speak(self): return "Meow"

for animal in [Dog(), Cat()]:
    print(animal.speak())     # Woof / Meow
```

The loop calls `.speak()` on each animal; Python dispatches to the right method based on the object's class.

## Duck typing

"If it walks like a duck and quacks like a duck, it IS a duck." Python doesn't care if objects share a common base — only whether they expose the required method.

```python
class Duck:
    def quack(self): print("Quack")
class Person:
    def quack(self): print("(pretending) Quack")

def make_it_quack(thing):
    thing.quack()     # works for any object with .quack()

make_it_quack(Duck())
make_it_quack(Person())
```

No formal interface, no inheritance required. Contrast with Java/C# where `Person` would need to `implement Quacker`.

> **Q:** When should you use an ABC instead of relying on duck typing?
> **A:** When you want the error to surface at construction (attempting to instantiate a subclass that missed a method), instead of at the first method call. Also for static type checkers, IDEs, and documentation — ABCs make the contract explicit. `typing.Protocol` gives structural typing with static checking, bridging both approaches.

## Takeaway

> **Takeaway**
> Polymorphism is same call, different behavior. Duck typing is Python's default compatibility check — methods present? Good enough. ABCs + Protocols make the contract explicit when you want formal enforcement.
