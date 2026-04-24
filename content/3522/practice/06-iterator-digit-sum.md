---
n: 6
id: cp-iterator-digit-sum
title: "Iterator — DigitSumIterator (past-exam Write-Code)"
lang: python
tags: [iterator, protocol, stopiteration]
source: "finalexamsmerge.pdf Write-Code DigitSumIterator"
pedagogy: worked-example-first
kind: code
---

## Prompt

Complete the `DigitSumIterator` class. It iterates over positive integers whose digits sum to a specified target, returning the first `num_terms` such numbers. Implement `__next__` and `digit_sum`.

Example usage:
```python
it = DigitSumIterator(target_sum=10, num_terms=5)
for n in it:
    print(n)
# 19, 28, 37, 46, 55
```

## Starter

```python
class DigitSumIterator:
    def __init__(self, target_sum, num_terms):
        self.target_sum = target_sum
        self.num_terms = num_terms
        self.count = 0
        self.current = 1
    def __iter__(self):
        return self
    def digit_sum(self, n):
        # TODO: sum of digits of n using modulus + integer division
        pass
    def __next__(self):
        # TODO: advance current until digit_sum == target_sum, count up
        pass
```

## Solution

```python
class DigitSumIterator:
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

it = DigitSumIterator(target_sum=10, num_terms=5)
for n in it:
    print(n)
# 19
# 28
# 37
# 46
# 55
```

## Why

The iterator protocol is two dunders. `__iter__` returns self (this object IS the iterator). `__next__` advances state and returns the next value, OR raises `StopIteration` when done. The `for` loop calls `iter()` once and `next()` in a loop, catching `StopIteration` to end.

The tricky bit: in `__next__`, you must increment `self.current` in BOTH branches — after a successful match AND after a non-match. Forgetting the non-match increment causes an infinite loop if no more matches exist.

Two wrong approaches:
1. **Returning inside a `for` loop in `__next__` without saving state.** Every call to `__next__` would restart the search from `self.current` but never remember where the last match was. Need the `while self.count < self.num_terms` outer bound and persistent `self.current` between calls.
2. **Forgetting `raise StopIteration`.** If `__next__` returns `None` at the end, the `for` loop prints `None` forever and never stops. `StopIteration` is the explicit termination signal.
