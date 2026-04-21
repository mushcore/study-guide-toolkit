---
n: 25
id: iterators-proto
title: "Iterator protocol — `__iter__` + `__next__`"
hook: "Every `for` loop in Python rides on two dunder methods."
tags: [iterator, protocol, dunder, stopiteration]
module: "OOP Foundations"
source: "Week 5 Slides, finalexamsmerge.pdf Q13, Write-Code DigitSumIterator"
bloom_levels: [remember, understand, apply]
related: [generators-yield, iterator-pattern]
---

An iterator is any object with two methods:
- `__iter__(self)` — returns the iterator (usually `self`).
- `__next__(self)` — returns the next value, or raises `StopIteration` when done.

```python
class Countdown:
    def __init__(self, start):
        self.n = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

for x in Countdown(3):
    print(x)
# 3, 2, 1
```

> **Q:** Why does `__iter__` on the iterator class return `self`?
> **A:** Because THIS object already tracks the iteration state. Returning self means `iter(my_iterator)` gives back the same iterator — one pass only. Contrast with a list: `iter(my_list)` returns a FRESH iterator each time, so you can loop the list twice.

## Iterable vs iterator

- **Iterable** — has `__iter__` returning a fresh iterator. Can be looped multiple times. `list`, `tuple`, `dict`, `str` are iterables.
- **Iterator** — has `__iter__` (returning self) AND `__next__`. Exhausts after one pass.

`iter(x)` calls `x.__iter__()`; `next(x)` calls `x.__next__()`.

## Past-exam trace

> **Example**
> `SomeIterator(5)` with `__next__` returning `current ** 2` then `current -= 2` while `current >= 1`: yields 25, 9, 1. The step is -2 (not -1) — distractors that include 16 and 4 are wrong. *finalexamsmerge.pdf Q13.*

## Pitfalls

> **Pitfall**
> An object with only `__next__` but no `__iter__` is NOT iterable — `for x in obj:` raises `TypeError`. Both dunders required.

> **Pitfall**
> Forgetting to raise `StopIteration` makes the loop run forever. Always have a termination branch that raises, not returns `None`.

## Takeaway

> **Takeaway**
> The iterator protocol is two dunders and one exception. Every generator, every `for` loop, every comprehension uses it under the hood. Past exams test by making you trace the exact sequence of `__next__` calls.
