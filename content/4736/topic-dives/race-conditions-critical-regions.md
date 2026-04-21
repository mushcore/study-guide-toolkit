---
id: 4736-topic-race-conditions-critical-regions
title: Race conditions & critical regions
pillar: tech
priority: high
chapter: Part 6/7
tags:
  - sync
---

Race condition: two processes touch shared data; result depends on timing.

#### The 4 rules any solution must satisfy

1.  No two processes simultaneously in the critical region.
2.  No assumptions about CPU speed or count.
3.  No process outside its CR may block another.
4.  No process waits forever.

#### Canonical example — print spooler

Both processes read `in`, both write to that slot, both increment. One file clobbered.
