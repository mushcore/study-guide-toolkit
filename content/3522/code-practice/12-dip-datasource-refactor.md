---
n: 12
id: cp-dip-datasource
title: "DIP — UI + DataSource refactor"
lang: python
tags: [solid, dip, refactor]
source: "Week 14 review"
pedagogy: productive-failure
---

## Prompt

The code below violates DIP — `UI` hard-codes a `TextFile` dependency. Refactor so `UI` depends on a `DataSource` abstraction, and `TextFile` + `SQLiteDB` are concrete implementations injected into `UI`.

## Starter

```python
class TextFile:
    def read(self): return "text file data"
    def write(self, data): print(f"writing {data}")

class UI:
    def __init__(self):
        self.text_file = TextFile()
    def load(self):
        return self.text_file.read()
    def save(self, data):
        self.text_file.write(data)
```

## Solution

```python
from abc import ABC, abstractmethod

class DataSource(ABC):
    @abstractmethod
    def retrieve(self): pass
    @abstractmethod
    def update(self, data): pass

class TextFile(DataSource):
    def retrieve(self):
        return "text file data"
    def update(self, data):
        print(f"text file writing {data}")

class SQLiteDB(DataSource):
    def retrieve(self):
        return "sqlite data"
    def update(self, data):
        print(f"sqlite INSERT {data}")

class UI:
    def __init__(self, ds: DataSource):
        self.ds = ds
    def load(self):
        return self.ds.retrieve()
    def save(self, data):
        self.ds.update(data)

ui1 = UI(TextFile())
ui2 = UI(SQLiteDB())
print(ui1.load())      # text file data
print(ui2.load())      # sqlite data
```

## Why

The `DataSource` ABC is the abstraction both UI and storage classes depend on. UI no longer imports `TextFile`; the concrete backend is injected. Adding `JSONFile` is a new `DataSource` subclass; UI unchanged.

Two wrong approaches:
1. **Making `DataSource` concrete (not abstract)** — you can still inject, but the client now depends on a concrete base. An ABC with abstract methods enforces that subclasses implement the contract.
2. **Using a factory inside UI's `__init__` to pick the backend** — moves the type-switching into UI. Loses the "inject at composition root" benefit. Prefer passing the instance.
