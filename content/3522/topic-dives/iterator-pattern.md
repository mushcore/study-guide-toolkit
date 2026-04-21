---
id: iterator-pattern-dive
title: "Iterator pattern — deep dive"
pillar: tech
priority: mid
tags: [pattern, behavioral, iterator, protocol]
source: "DesignPatternsTable, Week 5 Slides, finalexamsmerge.pdf Q13 SomeIterator + DigitSumIterator Write-Code"
bloom_levels: [remember, understand, apply]
related: [iterators-proto, generators-yield]
---

## When to use

You want an object to be consumable by `for x in obj:` but the traversal is custom — skipping, infinite, computed lazily, or based on internal state you don't want to expose directly.

In Python the pattern is baked into the language via `__iter__` + `__next__`. You rarely need a separate `Iterator` class — usually the collection IS the iterator.

## The protocol

```python
class DigitSumIterator:
    """Yields positive ints whose digits sum to target_sum."""
    def __init__(self, target_sum, num_terms):
        self.target_sum = target_sum
        self.num_terms = num_terms
        self.count = 0
        self.current = 1
    def __iter__(self):
        return self
    def digit_sum(self, n):
        total = 0
        while n > 0:
            total += n % 10
            n //= 10
        return total
    def __next__(self):
        while self.count < self.num_terms:
            if self.digit_sum(self.current) == self.target_sum:
                result = self.current
                self.count += 1
                self.current += 1
                return result
            self.current += 1
        raise StopIteration

for n in DigitSumIterator(target_sum=10, num_terms=5):
    print(n)
# 19, 28, 37, 46, 55
```

*Past-exam Write-Code solution, finalexamsmerge.pdf.*

## Iterator vs iterable

- **Iterable** — has `__iter__` returning a fresh iterator each call. A list, tuple, dict is iterable.
- **Iterator** — has `__iter__` returning self AND `__next__`. Exhausts after one pass.

A list can be iterated multiple times because `iter(list)` returns a new iterator each time. A generator cannot be re-iterated without re-creating it.

## Output-trace example

> **Example**
> `SomeIterator(5)` with `__next__`: returns `current ** 2` then `current -= 2` while `current >= 1`. Start 5 → yield 25, current=3 → yield 9, current=1 → yield 1, current=-1 → `StopIteration`. Output: **25, 9, 1**. Distractor B in the past exam was close but excluded 1; the stop condition is `>= 1`, so current=1 still yields (before decrement). *finalexamsmerge.pdf Q13 correct: B.*

## When to pick a generator instead

```python
def digit_sum_gen(target_sum, num_terms):
    n, count = 1, 0
    while count < num_terms:
        if sum(int(d) for d in str(n)) == target_sum:
            yield n
            count += 1
        n += 1
```

Same behavior, less boilerplate, no `StopIteration` needed (the return ends it). Use the class form when you want inheritance, introspection, or the ability to re-start.

## Pitfalls

> **Pitfall**
> Forgetting `__iter__` — an object with only `__next__` is NOT iterable. `for x in obj:` raises `TypeError`.

> **Pitfall**
> Returning something other than `self` from `__iter__` on an iterator class. If your object IS the iterator (stateful), return self. If it's a collection that produces separate iterators, return a new iterator object.

## Takeaway

> **Takeaway**
> Iterator is the two-method pattern that powers every `for` loop in Python. The exam tests mechanical tracing — compute `__next__` step by step, respect the stop condition exactly.
