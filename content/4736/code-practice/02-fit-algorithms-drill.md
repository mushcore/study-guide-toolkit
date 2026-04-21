---
"n": 2
id: 4736-code-fit-algorithms-drill
title: Fit algorithms drill
lang: c
tags:
  - allocation
---

## Prompt

Holes: [5, 12, 8, 20, 6, 14, 18, 25]. Requests: (a) 13, (b) 8, (c) 16. Fill in which hole is taken under First/Best/Worst/Next fit.

## Starter

```c
            13 | 8 | 16
First fit:
Best fit:
Worst fit:
Next fit:
```

## Solution

```c
             13 | 8 | 16
First fit:   20 | 12|  18
Best fit:    14 |  8|  18
Worst fit:   25 | 20|  18
Next fit:    20 | 14|  18

(Note next fit: after 13→20, position at index 3. 8: next ≥8 from index 4 is 14.
16: next ≥16 from position of last alloc (index 5=14, reduced to 6) is 18 at index 6.)
```

## Why

Remember: best fit = smallest adequate hole. Worst fit = largest. Next fit = continues from last-alloc cursor.
