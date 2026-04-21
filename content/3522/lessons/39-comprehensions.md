---
n: 39
id: comprehensions
title: "Comprehensions — list, dict, set, generator"
hook: "`[x*2 for x in nums if x > 0]` replaces four lines of loop boilerplate with one."
tags: [comprehensions, list, dict, set, generator-expr]
module: "Python Advanced Language Features"
source: "Week 5 Slides, finalexamsmerge.pdf short Q word_lengths, Dec 2024 T/F Q4"
bloom_levels: [understand, apply, analyze]
related: [generators-yield]
---

Comprehensions are concise syntax for constructing collections from iterables.

## List comprehension

```python
squares = [x * x for x in range(5)]         # [0, 1, 4, 9, 16]
even_squares = [x * x for x in range(10) if x % 2 == 0]
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]   # 4 pairs
```

> **Q:** When should you NOT use a comprehension?
> **A:** When the logic requires multiple statements, side effects, or the comprehension spans more than one line in a readable form. Comprehensions are for MAPPING and FILTERING collections into collections. A comprehension with nested conditions and three clauses is usually less readable than a small `for` loop with a clear intermediate variable.

## Dict + set comprehensions

```python
squares_dict = {x: x * x for x in range(5)}
unique_lengths = {len(w) for w in words}
```

## Generator expression

```python
lazy = (x * x for x in range(1000000))   # parens — lazy
sum(lazy)                                 # no huge list allocated
```

## Nested comprehensions — past-exam traps

```python
x = [[i * j for j in range(1, 2)] for i in range(1, 3)]
print(x)    # [[1], [2]] — NOT [[1, 2]]
```

Outer loops over `i in range(1, 3)` (i.e., 1, 2). For each i, inner `[i*j for j in range(1, 2)]` = `[i*1]` = `[i]`. So `[[1], [2]]`. *Dec 2024 Final T/F Q4 tests this.*

## Past-exam construction

> **Example**
> Given `words = ["apple", "banana", "orange", "kiwi", "pineapple"]`, produce `[(5, 'apple'), (6, 'banana'), (6, 'orange'), (4, 'kiwi'), (9, 'pineapple')]`.
>
> ```python
> [(len(w), w) for w in words]
> ```
> *finalexamsmerge.pdf short written Q.*

## Takeaway

> **Takeaway**
> Comprehensions are list/dict/set/gen construction in one line. Brackets = list, parens = generator, curly braces = set or dict (disambiguated by colon). Nested comprehensions evaluate outer-to-inner; trace by hand for output questions.
