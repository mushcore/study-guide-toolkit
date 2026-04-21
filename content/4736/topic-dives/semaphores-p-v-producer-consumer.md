---
id: 4736-topic-semaphores-p-v-producer-consumer
title: Semaphores — P, V, producer-consumer
pillar: tech
priority: high
chapter: Part 6/7
tags:
  - semaphores
  - ipc
  - sync
---

**P(s)**: if s>0 decrement; else block. **V(s)**: increment; wake one if blocked. Both atomic.

#### Binary vs counting

Binary (init 1) = lock. Counting (init N) = N resources.

#### Producer-consumer pattern (VERBATIM)

```c
empty = N;  full = 0;  mutex = 1;
producer: P(empty); P(mutex); insert; V(mutex); V(full);
consumer: P(full);  P(mutex); remove; V(mutex); V(empty);
```

**Trap:** Swapping P(mutex) before P(empty) in producer deadlocks.
