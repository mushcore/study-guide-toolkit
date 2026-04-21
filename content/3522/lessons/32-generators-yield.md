---
n: 32
id: generators-yield
title: "Generators + yield — lazy sequences"
hook: "Don't build a list of 10 million Fibonacci numbers. Yield them one at a time."
tags: [generators, yield, lazy, iterator]
module: "Functional Python + Profiling"
source: "Week 6 Slides, finalexamsmerge.pdf Q6 pipeline"
bloom_levels: [understand, apply, analyze]
related: [iterators-proto, iterator-pattern]
---

A function with `yield` is a generator — calling it doesn't run the body; it returns a generator object. Each `next()` call resumes the function until the next `yield`, returning the yielded value.

```python
def count_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

g = count_to(3)
next(g)   # 1
next(g)   # 2
next(g)   # 3
next(g)   # StopIteration

for x in count_to(3): print(x)   # 1, 2, 3
```

Generators implement the iterator protocol automatically — `__iter__` returns self, `__next__` resumes execution.

> **Q:** Why are generators single-use?
> **A:** Because the generator object IS the iteration state. Once `__next__` raises StopIteration, the generator has exhausted its yield points. To re-iterate, call the generator function again to create a new generator object with fresh state. Lists can re-iterate because `iter(list)` creates a fresh iterator each time.

## Generator expression

```python
squares = (x * x for x in range(10))   # parens, not brackets
sum(squares)
# 285
```

Identical to list comprehension syntactically, but lazy — values produced on demand.

## Pipeline trace (past-exam)

```python
def data_source():
    for i in range(10):
        yield i
def f1(numbers):
    for n in numbers:
        yield n * 2
def f2(numbers):
    for n in numbers:
        if n % 2 == 0:
            yield n

pipeline = f2(f1(data_source()))
for result in pipeline:
    print(result)
```

Trace: `data_source` yields `0..9` → `f1` doubles → `0, 2, 4, ..., 18` → `f2` filters even → ALL are already even → prints `0, 2, 4, 6, 8, 10, 12, 14, 16, 18`. Answer: Option C. *finalexamsmerge.pdf Q6.*

## Pitfall

> **Pitfall**
> Generators are single-use. Once exhausted, iterating again yields nothing. To re-iterate, call the generator function again to get a fresh generator object.

> **Pitfall**
> `range()` returns a range object — lazy, indexable, reusable. It is NOT a generator. A past-exam T/F distractor claims otherwise; it's FALSE. *finalexamsmerge.pdf p1.*

## Takeaway

> **Takeaway**
> Generators give you lazy iteration with minimal syntax. Use `yield` for one-shot streams; use a list comprehension only when you need the full list materialized. Pipeline trace questions require you to walk each `yield` call by hand.
