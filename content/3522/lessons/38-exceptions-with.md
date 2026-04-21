---
n: 38
id: exceptions-with
title: "Exceptions + `with` statement"
hook: "`try / except / finally` catches errors. `with` guarantees cleanup. Combine them for bulletproof resource handling."
tags: [exceptions, try-except, context-manager, with]
module: "Python Advanced Language Features"
source: "Week 4 Slides, Quiz 4, finalexamsmerge.pdf T/F args, Dec 2024 Final Q4-5"
bloom_levels: [understand, apply, analyze]
related: [unit-testing]
---

## Basic structure

```python
try:
    risky_operation()
except SpecificError as e:
    handle(e)
except Exception as e:
    log(e); raise
else:
    # runs only if no exception was raised
    pass
finally:
    # runs regardless — cleanup goes here
    cleanup()
```

- `except SpecificError` catches that class + subclasses.
- `as e` binds the exception instance.
- `else` runs only when the try block completed normally.
- `finally` runs always — return paths, exceptions, both.

> **Q:** When should `finally` run — before or after `except`?
> **A:** After. Order is try → (match? except : propagate), then else (only if no exception), then finally (always, regardless of success/failure/exception). `finally` is for cleanup that must happen no matter what: closing files, releasing locks, restoring state.

## Custom exceptions

```python
class AppError(Exception):
    """Base for all app errors."""

class ValidationError(AppError):
    def __init__(self, field, msg):
        super().__init__(f"{field}: {msg}")
        self.field = field
```

## The `args` attribute

Every exception has an `args` tuple containing the arguments passed to its constructor.

```python
try:
    raise ValueError("bad input", 42)
except ValueError as e:
    e.args    # ('bad input', 42)
```

> **Example**
> *finalexamsmerge.pdf T/F:* "The `args` attribute of an exception contains a tuple of all arguments passed to the exception during initialization." TRUE.

## Context managers (`with`)

`with` guarantees `__exit__` runs even if the block raises — for cleanup.

```python
with open("file.txt") as f:
    data = f.read()
# f is automatically closed, even on exception
```

## Past-exam unit-test trap

```python
def safe_divide(x, y):
    try:
        return x / y
    except ZeroDivisionError:
        return None

class TestExceptionHandling(unittest.TestCase):
    def test_divide_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            safe_divide(5, 0)          # fails — safe_divide catches!
    def test_safe_division(self):
        result = safe_divide(10, 2)
        self.assertIsNone(result)       # fails — returns 5.0, not None
```

Both tests fail. `safe_divide` catches `ZeroDivisionError` internally, so `assertRaises` never sees it. `safe_divide(10, 2)` returns `5.0`, not `None`. *Dec 2024 Final Q4-5.*

## Takeaway

> **Takeaway**
> `try/except` handles; `finally` cleans up; `with` wraps both with `__exit__` guarantees. On the exam, read unit tests very carefully — does the asserted exception ever leave the function body?
