---
n: 8
id: js-async-event-loop
title: "Predict async execution order"
lang: js
tags: [async, event-loop, setTimeout, microtask]
source: "Slide 4, ISAQuiz6, ISAQuiz8"
kind: code
---

## Prompt

Predict the exact console output of the code below. Write the output as a comma-separated list. Then explain why each line prints when it does, using the terms: synchronous, macrotask, microtask, eagerly.

## Starter

```js
setTimeout(function() {
  console.log('A');
}, 0);

new Promise(function(resolve) {
  console.log('B');
  resolve();
}).then(function() {
  console.log('C');
});

const fn = () => new Promise((resolve) => {
  console.log('D');
  resolve('done');
});

fn().then((result) => {
  console.log(result);
});

console.log('E');
```

## Solution

```js
// Output: B, D, E, C, done, A

setTimeout(function() {
  console.log('A');   // macrotask — fires last
}, 0);

new Promise(function(resolve) {
  console.log('B');   // 1st: executor runs eagerly (sync)
  resolve();          // enqueues .then callback to microtask queue
}).then(function() {
  console.log('C');   // 4th: microtask, drains after sync stack empties
});

const fn = () => new Promise((resolve) => {
  console.log('D');   // 2nd: fn() called below; executor runs eagerly (sync)
  resolve('done');    // enqueues .then callback to microtask queue
});

fn().then((result) => {
  console.log(result); // 5th: 'done' — second microtask, drains in order
});

console.log('E');     // 3rd: last synchronous statement
// Stack empties → drain microtask queue: C, then done
// Macrotask fires: A
```

## Why

**Synchronous code runs first in call-stack order.**
`B` prints when the first Promise is constructed — the executor runs eagerly. `D` prints when `fn()` is called — its executor also runs eagerly and synchronously. `E` prints last among the synchronous statements.

**`resolve()` enqueues, it does not execute.**
Both `resolve()` calls enqueue their `.then` callbacks to the microtask queue. Neither callback runs until the call stack empties.

**The event loop drains all microtasks before the next macrotask.**
After `E`, the call stack empties. The event loop drains the entire microtask queue in FIFO order: `C` (from the first Promise), then `done` (from `fn()`).

**`setTimeout(fn, 0)` is still a macrotask.**
A delay of `0` ms does not mean "run now." It means "run as soon as possible after at least 0 ms, as a macrotask." The microtask queue always empties first, so `A` fires after `C` and `done`.

**Final order: `B`, `D`, `E`, `C`, `done`, `A`.**
