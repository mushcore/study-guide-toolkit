---
n: 37
id: threading-basic
title: "Threading — concurrency via ThreadPoolExecutor"
hook: "Two threads increment a shared counter. The final value is 1, not 2. Welcome to races."
tags: [threading, concurrency, race-condition]
module: "Functional Python + Profiling"
source: "Week 12 Slides, finalexamsmerge.pdf FakeDatabase race MCQ"
bloom_levels: [understand, apply]
related: [asyncio]
---

Python's `concurrent.futures.ThreadPoolExecutor` runs callables in a pool of OS threads.

```python
from concurrent.futures import ThreadPoolExecutor
import time

class FakeDatabase:
    def __init__(self):
        self.value = 0
    def update(self, name):
        print(f"Thread {name}: starting update")
        local_copy = self.value
        local_copy += 1
        time.sleep(0.1)         # simulate work
        self.value = local_copy
        print(f"Thread {name}: finishing update")

db = FakeDatabase()
with ThreadPoolExecutor(max_workers=2) as ex:
    for i in range(2):
        ex.submit(db.update, i)
print(db.value)
```

**Expected output: 1, not 2.** Both threads read `self.value = 0`, each adds 1 to their `local_copy`, each stores `1` back. The second write overwrites the first — a classic race condition. *finalexamsmerge.pdf FakeDatabase Q.*

> **Q:** Why does `self.value` end up at 1 instead of 2 after two threads each try to increment?
> **A:** Both threads read `self.value = 0` into their local_copy BEFORE either writes back. Each computes local_copy = 1. Each writes 1 back. The second write clobbers the first. No addition actually happens twice — just two reads of 0, two writes of 1. Classic lost update.

## Fixing the race

- **Lock**: wrap the read-modify-write in `threading.Lock()` so only one thread runs it at a time.
- **Atomic primitive**: use `threading.atomic` counters (Python 3.12+) or immutable data + reassignment.

## Takeaway

> **Takeaway**
> Threads share memory. Shared-state mutations need synchronization. If you see two threads read-modify-write the same attribute without a lock, the answer is a lost update — final value is 1, not 2.
