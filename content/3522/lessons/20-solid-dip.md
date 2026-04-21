---
n: 20
id: solid-dip
title: "DIP — depend on abstractions, not on concrete"
hook: "A UI class that imports TextFile directly is stuck with text files forever. Make it depend on DataSource, then TextFile + SQLite + JSONFile all fit."
tags: [solid, dip, dependency-inversion, abstraction]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, Week 14 review"
bloom_levels: [understand, apply, analyze]
related: [solid-ocp, strategy, factory]
---

The Dependency Inversion Principle has two statements:
1. High-level modules should not depend on low-level modules. Both should depend on abstractions.
2. Abstractions should not depend on details. Details should depend on abstractions.

In picture form: the arrow from UI (high-level) to TextFile (low-level) is inverted — both now point up to DataSource (the abstraction).

```python
# Violation — UI hard-coded to TextFile
class UI:
    def __init__(self):
        self.text_file = TextFile()    # concrete dep

# DIP-compliant
class DataSource(ABC):
    @abstractmethod
    def retrieve(self): pass

class TextFile(DataSource): ...
class SQLiteDB(DataSource): ...
class JSONFile(DataSource): ...

class UI:
    def __init__(self, ds: DataSource):
        self.ds = ds           # depends on abstraction
```

> **Q:** Past-exam quiz: "Which is FALSE about DIP?"
> **A:** The false option is "Abstractions depend on details" — that's the inverse of DIP rule 2. All the others are true:
> - Low-level modules should not depend on high-level modules ✓
> - High-level modules should not depend on low-level modules ✓
> - High-level and Low-level modules should depend on abstractions ✓

## DIP enables OCP + Strategy + Factory

- **OCP**: UI stays closed when you add a new `DataSource` subclass.
- **Strategy**: inject any concrete strategy at runtime.
- **Factory**: a factory returns an abstraction-typed object; the client depends only on the abstraction.

## Past-exam T/F

> **Example**
> *Dec 2024 Final T/F Q2:* "DIP suggests that both high-level and low-level modules should depend on abstractions, not concrete implementations, which promotes loose coupling and flexibility in the codebase." — TRUE.

## Takeaway

> **Takeaway**
> DIP inverts the natural dependency arrow: both sides point up at a shared abstraction. This is the principle that makes most of the patterns in this course possible — Strategy, Factory, Observer all rely on DIP underneath. Memorize the two statements word for word; the exam quizzes them directly.
