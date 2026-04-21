---
n: 19
id: solid-isp
title: "ISP — small interfaces, not fat ones"
hook: "A Worker interface with work() + eat() + sleep() forces a Robot class to implement eat(). Split into Workable, Eatable, Sleepable."
tags: [solid, isp, interface-segregation]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, Quiz 3"
bloom_levels: [understand, apply]
related: [solid-lsp, protocols]
---

Interface Segregation Principle: clients shouldn't be forced to depend on interfaces they don't use. A fat base class with many abstract methods forces every subclass to implement methods that don't apply.

```python
# Violation — Robot doesn't eat or sleep
class Worker(ABC):
    @abstractmethod
    def work(self): pass
    @abstractmethod
    def eat(self): pass
    @abstractmethod
    def sleep(self): pass

class Robot(Worker):
    def work(self): ...
    def eat(self): pass       # dummy — ISP violation
    def sleep(self): pass     # dummy — ISP violation
```

Fix: split into smaller interfaces. A class implements only the ones it needs.

```python
class Workable(ABC):
    @abstractmethod
    def work(self): pass

class Feedable(ABC):
    @abstractmethod
    def eat(self): pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self): pass

class Human(Workable, Feedable, Sleepable): ...
class Robot(Workable): ...
```

> **Q:** How small should an interface be? Can you over-segregate?
> **A:** Yes — trivially small interfaces (one method per interface for ten methods) produce ten classes where one cohesive interface would fit. The rule is "group methods that are USED together by the same client." If every real client uses `work + eat`, keep those together; split only when some clients don't need some methods.

## Takeaway

> **Takeaway**
> If a subclass has stub implementations or raises `NotImplementedError` on methods it doesn't actually support, the interface is too fat. Split it — many small focused interfaces beat one grand one.
