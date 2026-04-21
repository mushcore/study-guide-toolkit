---
n: 36
id: functions-first-class
title: "Functions as first-class objects"
hook: "A function in Python is an object. Assign it, store it, pass it, return it."
tags: [functions, first-class, higher-order, callable]
module: "Functional Python + Profiling"
source: "Week 6 Slides, Week10SampleCode/callable_object_example.py"
bloom_levels: [understand, apply]
related: [lambda, decorators-lang]
---

Python functions are objects. They can be:

- Assigned to variables: `f = len; f("hello")` → `5`.
- Stored in lists / dicts: `ops = {"+": add, "-": sub}`.
- Passed as arguments: `sorted(items, key=get_age)`.
- Returned from other functions (closures, decorators).

```python
def make_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

double = make_multiplier(2)
double(5)    # 10
```

`double` is a closure — a function that remembers `n = 2` from its enclosing scope.

> **Q:** What's a closure, and why is it useful?
> **A:** A closure is a function that captures variables from its enclosing scope. `make_multiplier(2)` returns a function that "remembers" `n = 2`. Useful for specializing general functions (partial application), decorators (the inner function captures the decorated function), and factory-like patterns without heavy class machinery.

## Callable objects

Any object with `__call__` can be called like a function:

```python
class Counter:
    def __init__(self):
        self.n = 0
    def __call__(self):
        self.n += 1
        return self.n

c = Counter()
c(); c(); c()    # c.n == 3
```

Useful for stateful "functions" — classes that act like functions but carry state between calls.

## Takeaway

> **Takeaway**
> Functions are objects. `__call__` makes an object callable. These two together are how decorators, strategy patterns, and event handlers work in Python without needing special language features.
