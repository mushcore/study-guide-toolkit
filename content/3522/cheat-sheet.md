---
title: "COMP 3522 — exam-eve cheat sheet"
---

## Design patterns — intent & when-to-use

| Pattern | Category | Intent | Use when |
|---|---|---|---|
| **Singleton** | Creational | One instance, global access | Save system, config, registry |
| **Factory** | Creational | Encapsulate object creation in a method | Client should depend on base class only |
| **Abstract Factory** | Creational | Create families of related products | Themes / variants of related objects |
| **Builder** | Creational | Step-by-step construction of complex object | Many optional fields, multiple representations |
| **Lazy Init** | Creational | Defer instantiation until needed | Expensive object rarely used |
| **Bridge** | Structural | Decouple abstraction from implementation | Multiple implementations / platforms vary independently |
| **Decorator** | Structural | Add behavior dynamically via composition | Stack optional features without subclass explosion |
| **Facade** | Structural | Simplified interface to subsystem | Hide subsystem complexity from client |
| **Proxy** | Structural | Same interface, controlled access | Caching, access control, logging, lazy load |
| **Chain of Responsibility** | Behavioral | Pass request along handler chain | Sequence of optional handlers, decoupled order |
| **Iterator** | Behavioral | Sequential access without exposing internals | Custom collection traversal |
| **Mediator** | Behavioral | Centralize component-to-component comms | Many-to-many tight coupling between peers |
| **Observer** | Behavioral | Subject notifies observers on state change | Pub-sub, event broadcast |
| **State** | Behavioral | Behavior changes with internal state | Object behavior tightly tied to state |
| **Strategy** | Behavioral | Swap algorithm at runtime | Multiple interchangeable algorithms |

## Decorator vs Proxy — same shape, different intent

- Both wrap an object implementing the same interface.
- **Decorator** *adds* behavior (stackable: `A(B(C()))` — each layer adds one slice).
- **Proxy** *controls access* (cache / auth / log / lazy load). One leaky getter (`get_real()`) defeats it.
- T/F past-exam: "Decorator and Proxy have similar structures, but very different intents" — **TRUE**.

## State vs Strategy — looks similar, key difference

- Both: a context delegates behavior to a pluggable object.
- **State**: state objects *trigger transitions* — the context's state changes over its lifetime. States often know about other states.
- **Strategy**: strategy is picked by the client externally; no transitions between strategies.
- T/F past-exam: "State objects are independent and unaware of each other" — **FALSE** (that's Observer).

## SOLID one-liners

- **S**RP — one class, one reason to change.
- **O**CP — open for extension, closed for modification.
- **L**SP — subclass must be substitutable for its base without breaking callers.
- **I**SP — many small interfaces beat one fat one; don't force stubs.
- **D**IP — high + low both depend on abstractions; abstractions don't depend on details.

## Law of Demeter — talk to friends only

- Method should call only: `self`, its params, objects it creates, its direct member attrs.
- **BAD**: `self._customer.get_wallet().get_money(amt)` (Cashier reaches through Customer to Wallet).
- **GOOD**: `self._customer.get_money(amt)` (Customer has its own get_money).
- Count the dots. 3+ = refactor by pushing work into the first object.

## ABC + abstractmethod boilerplate

```python
from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self): pass
class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2
```

- `Shape()` raises TypeError. `Circle(3).area()` works.
- If `Circle` forgets `area`, `Circle()` also raises.

## Iterator protocol skeleton

```python
class MyIter:
    def __init__(self, limit):
        self.n = 0; self.limit = limit
    def __iter__(self): return self
    def __next__(self):
        if self.n >= self.limit: raise StopIteration
        self.n += 1; return self.n - 1
```

- `__iter__` returns self. `__next__` advances + returns OR raises StopIteration.
- Forgetting `StopIteration` = infinite loop.

## Generator + yield basics

```python
def count(n):
    i = 0
    while i < n:
        yield i
        i += 1
g = count(3)           # generator object
next(g)  # 0           # body runs to next yield
```

- Generator expression: `(x*x for x in range(10))` — lazy.
- List comp: `[x*x for x in range(10)]` — eager, full list.
- Generators are single-use. Re-iterating needs a fresh call.
- `range()` is NOT a generator — it's a lazy sequence (indexable, reusable).

## Comprehensions — list / dict / set / generator

```python
[x*2 for x in nums if x > 0]          # list
{w: len(w) for w in words}            # dict
{x % 5 for x in range(20)}            # set
(x*x for x in range(10))              # generator (parens)
```

Nested: `[[i*j for j in range(1,2)] for i in range(1,3)]` → `[[1], [2]]` NOT `[[1,2]]`.

## Exceptions — try / except / else / finally / raise / with

```python
try: risky()
except SpecificError as e: handle(e)
except Exception: log(); raise
else: ran_without_error()
finally: always_runs()

with open("f") as f:                   # __enter__ / __exit__
    data = f.read()                    # f closed even on exception
```

- `e.args` = tuple of arguments passed to the exception at raise time.
- `json.dumps()` returns a string; `json.dump(obj, f)` writes to file.

## Multiple inheritance & MRO

```python
class C(A, B): pass
C.__mro__  # (C, A, B, object)
```

- Python uses C3 linearization.
- Always use `super()` (never call parent by name) for cooperative inheritance.
- Diamond: if Bat inherits Mammal + Bird, both from Animal, MRO = Bat → Mammal → Bird → Animal.

## UML notation cheat

| Shape | Meaning |
|---|---|
| solid arrow, hollow △ | inheritance |
| dashed arrow, hollow △ | interface realization |
| solid line, filled ♦ | composition (strong has-a, shared lifetime) |
| solid line, hollow ♢ | aggregation (weak has-a) |
| solid arrow → | association (general uses) |
| dashed arrow → | dependency (transient) |
| `-` private, `+` public, `#` protected | member visibility |
| italic name | abstract class |
| `«interface»` | interface stereotype |

## Profiling — cProfile output reading

```
ncalls  tottime  percall  cumtime  percall  filename:lineno(function)
  70/4    0.000    0.000    0.000    0.000  auction_entities.py:100(__call__)
```

- `ncalls = 70/4` means 70 total calls, 4 primitive (non-recursive). Recursive calls = 66.
- `tottime` = time in this function excluding sub-calls.
- `cumtime` = time including sub-calls.
- Profiling is **dynamic** (runs the code), not static analysis.

## Async / asyncio — sequential vs gather timing

```python
import asyncio, time

async def work(): await asyncio.sleep(0.5)

# Sequential — 1.0 s total
async def seq(): await work(); await work()

# Concurrent via gather — 0.5 s total
async def par(): await asyncio.gather(work(), work())
```

- `await` alone serializes.
- `asyncio.gather(*coros)` runs concurrently; total ≈ slowest.
- `asyncio.create_task(coro)` schedules in background.
- N observers each sleeping 0.5s + two notifies gathered ≈ 0.6s wall time, not 1s or 2s.

## Language decorators (NOT the Decorator pattern)

- `@staticmethod` — no self, no cls. Cannot access class-level vars.
- `@classmethod` — first arg is `cls`. Can access class attrs, make alt constructors.
- `@property` — method exposed as attribute-style access. Pair with `@name.setter`.
