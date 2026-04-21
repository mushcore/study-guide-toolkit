---
n: 6
id: iterator-pattern
title: "Iterator pattern — traverse without exposing internals"
hook: "Any time you write a `for x in thing:` loop, Python is using the Iterator pattern under the hood. Writing one yourself is how you customize traversal."
tags: [pattern, behavioral, iterator, protocol]
module: "Design Patterns — Behavioral"
source: "DesignPatternsTable, Week 5 Slides, finalexamsmerge.pdf Q13 SomeIterator, Write-Code DigitSumIterator"
bloom_levels: [remember, understand, apply]
related: [iterators-proto, generators-yield]
---

In Python, the Iterator pattern is the *iterator protocol* — two dunder methods.

```python
class SquaresDown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current >= 1:
            result = self.current ** 2
            self.current -= 2
            return result
        raise StopIteration

for x in SquaresDown(5):
    print(x)
# 25, 9, 1
```

`SomeIterator(5)` with the code above would print `25, 9, 1` — **not** `25, 16, 9, 4, 1` (the step is `-2`, not `-1`). *finalexamsmerge.pdf Q13 answer: B.*

## Rules

- `__iter__(self)` returns the iterator (usually `self`).
- `__next__(self)` returns the next item OR raises `StopIteration`.
- An object with both is an iterator. An object that returns a separate iterator from `__iter__` is *iterable*.
- `for x in obj:` calls `iter(obj)` once, then `next(iterator)` in a loop, catching `StopIteration`.

> **Q:** Why return `self` from `__iter__` instead of a helper object?
> **A:** When the iterator IS the state machine (no separate traversal object), `self` is simpler. If you want multiple concurrent traversals of the same collection, return a fresh helper instead — otherwise the second loop sees the first loop's consumed state.

## When Iterator vs generator

A generator function (`yield`) produces the same behavior with less boilerplate. Use an iterator class when you need to *expose* the iteration state (attributes readable between calls), inherit iteration logic, or pickle/resume mid-traversal.

## Takeaway

> **Takeaway**
> Iterator is the thinnest pattern in the course — two methods and a `StopIteration`. Master it because every generator, every `for` loop, every `yield from` rides on top of it.
