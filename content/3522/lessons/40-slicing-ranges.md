---
n: 40
id: slicing-ranges
title: "Slicing + ranges — cut sequences cleanly"
hook: "`seq[::-1]` reverses. `range(5, 0)` is empty. Small details, big point values."
tags: [slicing, ranges, sequences]
module: "Python Advanced Language Features"
source: "Week 4 Slides, Quiz 4, finalexamsmerge.pdf T/F"
bloom_levels: [remember, understand, apply]
related: [comprehensions]
---

## Slicing

`sequence[start:stop:step]` — all three optional.

```python
s = [0, 1, 2, 3, 4, 5]
s[1:4]       # [1, 2, 3] — stop exclusive
s[:3]        # [0, 1, 2]
s[3:]        # [3, 4, 5]
s[::-1]      # [5, 4, 3, 2, 1, 0] — reversed
s[::2]       # [0, 2, 4] — every second
s[-2:]       # [4, 5] — last two
```

- `start` default 0, `stop` default `len(s)`, `step` default 1.
- Negative indices count from the end.
- Out-of-range slices don't raise — `s[100:200]` returns `[]`.

> **Q:** Why does `s[100:200]` on a 6-element list return `[]` instead of raising IndexError?
> **A:** Slicing silently clamps out-of-range bounds to the actual length — it's a design decision to make slicing forgiving. Indexing (`s[100]`) does raise IndexError because it must return an element. Slicing returns a (possibly empty) subsequence, so clamping is well-defined.

## `range()`

`range(stop)` / `range(start, stop)` / `range(start, stop, step)`. Returns a range object — lazy, indexable, reusable.

```python
list(range(5))             # [0, 1, 2, 3, 4]
list(range(0))             # []  — empty
list(range(5, 0))          # []  — empty (no negative step)
list(range(5, 0, -1))      # [5, 4, 3, 2, 1]
```

> **Example**
> *finalexamsmerge.pdf T/F:* "range(0) and range(5, 0) both return empty sequences." TRUE.

## `range()` is NOT a generator

A range object is lazy and iterable — but it's a sequence, not a generator. It's indexable (`range(10)[5] == 5`), has a known length (`len(range(10)) == 10`), and can be iterated multiple times.

> **Example**
> *finalexamsmerge.pdf T/F:* "The function `range()` in Python returns a generator object that lazily evaluates its values." FALSE — returns a `range` object, not a generator.

## Takeaway

> **Takeaway**
> Slicing is half-open on the stop end (exclusive). `range()` follows the same rule. Neither raises on out-of-range values — they silently clip. Reverse with `[::-1]`. Empty ranges come from `step` direction mismatch with `start`/`stop`.
