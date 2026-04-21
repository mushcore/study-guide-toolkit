---
id: 4736-topic-coffman-conditions-strategies
title: Coffman conditions + strategies
pillar: tech
priority: high
chapter: Part 9
tags:
  - deadlock
---

#### The 4 Coffman conditions (ALL must hold)

1.  Mutual exclusion
2.  Hold and wait
3.  No preemption
4.  Circular wait

#### Prevention strategies (attack each)

| Condition | Attack |
| --- | --- |
| Mutual exclusion | Spooling (virtualize resource) |
| Hold and wait | Request all at once OR release before requesting more |
| No preemption | Allow preemption (take resources back) |
| Circular wait | Global numbering; request in increasing order |

#### Overall strategies

-   Prevention — design rules out condition
-   Avoidance — Banker's: grant only if state remains SAFE
-   Detection + recovery
-   Ostrich — ignore (UNIX/Windows default)
