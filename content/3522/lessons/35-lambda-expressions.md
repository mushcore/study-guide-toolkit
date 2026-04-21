---
n: 35
id: lambda
title: "Lambda — anonymous single-expression functions"
hook: "`lambda x: x * 2` is a function without a name. Best for short throwaways passed to `sort` / `map` / `filter`."
tags: [lambda, anonymous-fn, functions]
module: "Functional Python + Profiling"
source: "Week 6 Slides"
bloom_levels: [remember, understand]
related: [functions-first-class]
---

Lambda is Python's anonymous single-expression function syntax.

```python
square = lambda x: x * x
square(4)                 # 16
```

Equivalent to:

```python
def square(x):
    return x * x
```

## Common uses

```python
# sort by second element of a tuple
pairs = [(1, 9), (2, 3), (3, 5)]
pairs.sort(key=lambda p: p[1])

# map / filter (prefer comprehensions in modern Python)
squares = list(map(lambda x: x * x, range(5)))
evens = list(filter(lambda x: x % 2 == 0, range(10)))

# sort complex objects by attribute
users.sort(key=lambda u: u.age)
```

> **Q:** When should you prefer `def` over `lambda`?
> **A:** When the function has a reusable name, a meaningful docstring, multiple lines of logic, or will be reused in many places. Lambdas shine for tiny, single-use, throwaway callables passed to `sort`, `map`, `filter`. A lambda stored in a variable and used across files is almost always a sign that `def` was the right choice.

## Restrictions

- Single expression. No statements, no `return`.
- No assignments.
- No docstrings.

Use a regular `def` when the logic is multi-line or needs a name.

## Takeaway

> **Takeaway**
> Lambda is syntactic shorthand for short functions, most useful as keys or predicates. Don't force lambdas where a named function would be clearer.
