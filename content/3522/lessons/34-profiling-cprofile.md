---
n: 34
id: profiling
title: "Profiling with cProfile — measure before you optimize"
hook: "`ncalls` says 70/4. That means 70 total calls, 4 of them primitive — 66 were recursive."
tags: [profiling, cprofile, performance]
module: "Functional Python + Profiling"
source: "Week 6 Slides + Lab Optimization Slides, Week 14 review, Dec 2024 Final T/F Q"
bloom_levels: [understand, apply]
related: [generators-yield]
---

`cProfile` is Python's built-in deterministic profiler. Run a module or call under it; get a table of per-function statistics.

```python
import cProfile
cProfile.run('some_expensive_function()')
```

Output columns:

| Column | Meaning |
|---|---|
| `ncalls` | Number of calls. `70/4` means 70 total, 4 primitive (non-recursive). |
| `tottime` | Total time spent in this function, excluding sub-calls. |
| `percall` (first) | `tottime / ncalls`. |
| `cumtime` | Cumulative time including sub-calls. |
| `percall` (second) | `cumtime / primitive_ncalls`. |
| `filename:lineno(function)` | Where the function is defined. |

> **Q:** Profile says function foo has `tottime = 0.001` but `cumtime = 5.0`. What does that mean?
> **A:** foo itself runs in 1ms, but it calls other functions that together take 5 seconds. The bottleneck isn't foo — it's what foo calls. To speed up this call path, look at the functions foo invokes, not foo's own body. cumtime reveals inclusive cost; tottime reveals exclusive cost.

## Reading `ncalls`

A single integer (e.g. `70`) means all non-recursive.

A slash (e.g. `70/4`) means 70 total calls, 4 primitive. The difference (66) is the count of recursive calls.

> **Example**
> *Week 14 review:* `auction_entities.py:100(__call__)` with `ncalls = 70/4` → **66 recursive calls** (70 − 4). This is what the quiz asks about.

## Pitfall

> **Pitfall**
> Past-exam T/F trap: "Profiling is a static program analysis technique that allows developers to analyze code performance without running the program." FALSE. Profiling is dynamic — it measures an actual execution. Static analysis is a different tool (linting, type checking).

## Takeaway

> **Takeaway**
> cProfile counts calls, times them, and sorts. `ncalls` with a slash tells you recursion. `tottime` vs `cumtime` tells you whether THIS function is slow or whether it's called into slow things. Optimize the top of the `tottime` column first.
