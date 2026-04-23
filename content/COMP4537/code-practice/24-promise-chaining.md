---
n: 24
id: promise-chaining-practice
title: "Promise Chain Execution Order — Microtasks vs. Macrotasks"
lang: js
module: "Promises and Async Programming"
topic: promise-chaining
source: "ISAQuiz9, Slide 6"
---

## Prompt

Read the code below. Predict the exact console output order and explain why each line prints when it does.

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => {
    console.log('C');
    return 'fromC';
  })
  .then(val => {
    console.log('D:', val);
  });

setTimeout(() => console.log('E'), 0);

console.log('F');
```

Your task has two parts:

1. List the output lines in order.
2. For each line, state whether its source was the call stack, the microtask queue, or the macrotask queue.

---

### Queue model (ASCII)

```
CALL STACK          MICROTASK QUEUE      MACROTASK QUEUE
──────────          ───────────────      ───────────────
console.log('A')                         [setTimeout B cb]
Promise.resolve()   [then → log('C')]    [setTimeout E cb]
console.log('F')
                    ───── drain ──────
                    log('C') runs
                    [then → log('D')]
                    log('D':'fromC') runs
                                         ── next macrotask ──
                                         log('B') runs
                                         log('E') runs
```

The event loop does not pull from the macrotask queue until the microtask queue is empty.

---

## Starter

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => {
    console.log('C');
    return 'fromC';
  })
  .then(val => {
    console.log('D:', val);
  });

setTimeout(() => console.log('E'), 0);

console.log('F');

// TODO: write the expected output below, one line per console.log call.
// Format: // output: <value>

// Line 1: // output:
// Line 2: // output:
// Line 3: // output:
// Line 4: // output:
// Line 5: // output:
// Line 6: // output:
```

## Solution

```js
console.log('A');
// CALL STACK — runs synchronously first
// output: A

setTimeout(() => console.log('B'), 0);
// Schedules 'B' callback in macrotask queue. Does not run yet.

Promise.resolve()
  .then(() => {
    console.log('C');
    // MICROTASK QUEUE — dispatched after call stack empties
    // output: C
    return 'fromC';
    // Returning 'fromC' fulfills the next Promise with 'fromC'
    // Schedules the second .then() as a new microtask
  })
  .then(val => {
    console.log('D:', val);
    // MICROTASK QUEUE — runs immediately after 'C' microtask completes
    // output: D: fromC
  });

setTimeout(() => console.log('E'), 0);
// Schedules 'E' callback in macrotask queue. Does not run yet.

console.log('F');
// CALL STACK — still synchronous, runs before any queued callbacks
// output: F

// --- call stack now empty ---
// Microtask queue drains:
//   1. then-C runs → logs C, queues then-D
//   2. then-D runs → logs D: fromC
// Microtask queue is now empty.

// Macrotask queue processes one task:
//   1. setTimeout-B fires → logs B

// Microtask queue checked again — empty.

// Macrotask queue processes next task:
//   2. setTimeout-E fires → logs E
```

**Full output in order:**

```
A
F
C
D: fromC
B
E
```

## Why

### Microtask queue priority

When the call stack empties, the event loop drains the entire microtask queue before pulling any macrotask. `.then()` and `.catch()` callbacks are microtasks. `setTimeout` callbacks are macrotasks.

In this exercise:
- `A` and `F` are synchronous — they run on the call stack before anything else.
- `C` and `D` are microtasks — both drain before either macrotask fires.
- `B` and `E` are macrotasks — each fires only after the microtask queue is empty at that moment.

### Common wrong answers

**Wrong answer 1 — assuming interleaving:** `A, F, C, B, D, E`

This assumes `setTimeout('B')` fires between the two `.then()` calls because it was registered first. The microtask queue does not yield between callbacks — it drains completely. `D` always runs before `B`.

**Wrong answer 2 — assuming setTimeout fires first:** `A, B, F, C, D, E`

`setTimeout` with delay `0` does not mean "run immediately." It schedules a macrotask. The call stack (`F`) and then all microtasks (`C`, `D`) complete first.

### Return value propagation

`return 'fromC'` inside the first `.then()` fulfills the Promise that `.then()` returned, with the value `'fromC'`. The second `.then()` receives `'fromC'` as its argument `val`. This is how values flow forward through a chain.
