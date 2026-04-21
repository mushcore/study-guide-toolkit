---
"n": 5
id: 4736-code-semaphore-pseudocode-readers-writers-simplified
title: Semaphore pseudocode — readers/writers (simplified)
lang: c
tags:
  - semaphores
  - ipc
---

## Prompt

Write pseudocode using semaphores for a simple MUTEX-protected counter increment by N threads. Use P() and V().

## Starter

```c
sem_t mutex = 1;
int counter = 0;

void thread(void) {
  // ...
}
```

## Solution

```c
sem_t mutex = 1;
int counter = 0;

void thread(void) {
  P(mutex);           // enter critical section
  counter = counter + 1;
  V(mutex);           // leave critical section
}

// Any number of threads may call thread().
// Without P/V, counter++ is NOT atomic → race condition.
```

## Why

Binary semaphore (init 1) serves as a lock. P locks, V unlocks. Short critical section keeps throughput high.
