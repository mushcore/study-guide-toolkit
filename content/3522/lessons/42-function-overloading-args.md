---
n: 42
id: function-overloading-args
title: "Function overloading + *args / **kwargs"
hook: "Python has no real overloading. Simulate it with defaults, *args, **kwargs, or @singledispatch."
tags: [functions, args, kwargs, overloading, packing]
module: "Python Advanced Language Features"
source: "Week 4 Slides, Quiz 4"
bloom_levels: [understand, apply]
related: [functions-first-class, polymorphism-duck]
---

Python has no compile-time function overloading. Defining two functions with the same name replaces the first. Simulate overloading with:

> **Q:** Why doesn't Python support true method overloading (like Java — same name, different signatures)?
> **A:** Python is dynamically typed — signatures aren't resolved until runtime. Defining two functions with the same name simply replaces the first. The language substitutes overloading with default args, `*args`/`**kwargs`, and `@singledispatch`. Each approach handles a different facet of what static overloading gives you.

## Default arguments

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}")

greet("Alice")                  # Hello, Alice
greet("Alice", "Hi")            # Hi, Alice
```

## Variadic positional — `*args`

```python
def sum_all(*args):
    return sum(args)           # args is a tuple

sum_all(1, 2, 3)               # 6
```

## Variadic keyword — `**kwargs`

```python
def build(**kwargs):
    return kwargs              # kwargs is a dict

build(name="x", size=10)       # {'name': 'x', 'size': 10}
```

## Packing / unpacking

```python
nums = [1, 2, 3]
print(*nums)                   # unpacks: print(1, 2, 3)

opts = {"end": "!", "sep": "-"}
print("a", "b", **opts)        # a-b!
```

## `@functools.singledispatch`

Poor man's method overloading on argument type:

```python
from functools import singledispatch

@singledispatch
def describe(x):
    return f"object: {x}"

@describe.register
def _(x: int):
    return f"int: {x}"

@describe.register
def _(x: str):
    return f"str: {x}"

describe(42)        # int: 42
describe("hi")      # str: hi
```

## Takeaway

> **Takeaway**
> Python function signatures are flexible at runtime. `*args` collects extras as a tuple; `**kwargs` collects extras as a dict. To dispatch on type explicitly, use `@singledispatch` or branch manually with `isinstance`.
