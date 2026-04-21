---
n: 41
id: unit-testing
title: "Unit testing with unittest"
hook: "`TestCase` subclasses. `assertRaises`, `assertEqual`, `assertIsNone`. Know what each actually checks."
tags: [testing, unittest, assertions]
module: "Python Advanced Language Features"
source: "Week 4 Slides, Dec 2024 Final Q4-5"
bloom_levels: [understand, apply, analyze]
related: [exceptions-with]
---

Python's built-in `unittest` module. Tests are methods on classes that inherit `unittest.TestCase`.

```python
import unittest

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(2 + 2, 4)
    def test_raises(self):
        with self.assertRaises(ValueError):
            int("not a number")

if __name__ == "__main__":
    unittest.main()
```

> **Q:** Why does `assertRaises(ZeroDivisionError)` on a function that CATCHES ZeroDivisionError and returns None fail the test?
> **A:** Because assertRaises only passes if the exception propagates OUT of the with-block. If the function internally catches it, the exception never reaches the assertion — no raise, test fails. Unit tests exercise observable behavior at the function's boundary, not its internal mechanics.

## Assertion zoo

| Assertion | Passes when |
|---|---|
| `assertEqual(a, b)` | `a == b` |
| `assertNotEqual(a, b)` | `a != b` |
| `assertTrue(expr)` | `bool(expr)` is True |
| `assertFalse(expr)` | `bool(expr)` is False |
| `assertIsNone(x)` | `x is None` |
| `assertIsNotNone(x)` | `x is not None` |
| `assertRaises(Exc)` | block raises `Exc` (or subclass) |
| `assertAlmostEqual(a, b)` | floating-point approx equal |

## Past-exam trap

```python
def safe_divide(x, y):
    try:
        return x / y
    except ZeroDivisionError:
        return None

class TestExceptionHandling(unittest.TestCase):
    def test_divide_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            safe_divide(5, 0)          # FAILS
    def test_safe_division(self):
        result = safe_divide(10, 2)
        self.assertIsNone(result)       # FAILS
```

Both fail:
- `safe_divide(5, 0)` catches the exception and returns `None`, so `assertRaises` never sees the exception leave the call.
- `safe_divide(10, 2)` returns `5.0` (not None), so `assertIsNone(5.0)` fails.

*Dec 2024 Final Q4-5 both T/F FALSE.*

## Takeaway

> **Takeaway**
> Assertions test specific properties — read what each one actually checks. A test that "looks right" but asserts the wrong property is the classic exam trap. Always ask: does the call raise what the test expects? Does it return what the test expects?
