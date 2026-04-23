---
n: 23
id: promises-basics-practice
title: "Trace Promise execution order"
lang: js
module: "Promises and Async Programming"
topic: promises-basics
source: "Slide 6, ISAQuiz8"
---

## Prompt

Read the code below and answer two questions:

1. What is the exact console output, in order? Write your answer as a comma-separated list.
2. For each line of output, explain which mechanism caused it to print at that point: synchronous executor, microtask queue, or ignored-because-already-settled.

```js
let promise = new Promise(function(resolve, reject) {
  console.log('2');
  reject('3');
  resolve('4');
  console.log('5');
});

promise.then(
  function(value)  { console.log(value); },
  function(reason) { console.log(reason); }
);

console.log('1');
```

This is ISAQuiz8 Q3 pattern. The trap: `resolve('4')` is called after `reject('3')`, but `'4'` does not appear in the output. Explain why.

## Starter

Fill in the blanks to complete a similar problem. The executor calls `resolve` first, then `reject`. Predict the output.

```js
let p = new Promise(function(resolve, reject) {
  console.log('A');
  resolve('B');   // called first — what state does this produce?
  reject('C');    // called second — what happens?
  console.log('D');
});

p.then(
  function(value)  { console.log(value); },  // fires if ___
  function(reason) { console.log(reason); }  // fires if ___
);

console.log('E');

// Predict the output:
// __, __, __, __
// Is 'C' ever logged? ___
// Why? ___
```

## Solution

```js
// Output of the starter: A, D, E, B
// 'C' is never logged.

let p = new Promise(function(resolve, reject) {
  console.log('A'); // 1st: executor runs eagerly — sync
  resolve('B');     // 2nd: state → fulfilled (sync); enqueue .then(onFulfilled) as microtask
  reject('C');      // ignored — promise already settled by resolve('B')
  console.log('D'); // 3rd: executor continues synchronously
});

p.then(
  function(value)  { console.log(value); },  // fires when fulfilled
  function(reason) { console.log(reason); }  // fires when rejected
);

console.log('E'); // 4th: synchronous, after executor and .then() registration

// Call stack empties.
// Microtask queue drains:
//   → onFulfilled('B') runs → logs 'B'   // 5th

// Final output: A, D, E, B
// 'C' is never logged because resolve('B') settled the promise first.
// reject('C') is silently ignored — settlement is permanent.
```

## Why

**The executor runs eagerly — synchronously on construction.**
`new Promise(executor)` calls `executor` immediately. Every `console.log` inside the executor prints before any subsequent statement outside the Promise. That is why `'A'` and `'D'` appear before `'E'`.

**`resolve()` and `reject()` are mutually exclusive — first call wins.**
`resolve('B')` transitions the Promise from pending to fulfilled. The state is now locked. When `reject('C')` runs a moment later, the Promise is already settled, so the runtime silently ignores it. `'C'` never reaches any handler.

**`resolve()` enqueues the handler; it does not call it inline.**
`resolve('B')` changes the Promise's state synchronously, then places the `onFulfilled` callback in the microtask queue. The callback does not run until the current call stack is empty. `console.log('E')` is still on the call stack, so it runs before `'B'` is logged.

**Common wrong approaches:**

1. *Assuming `.then()` fires when `resolve()` is called.* Students write the output as `A, B, D, E` — placing `'B'` right after `resolve()`. `resolve()` only enqueues the handler. The handler runs after the stack empties.

2. *Assuming both `resolve` and `reject` run because they are both called.* Both calls execute in the executor, but only the first one settles the Promise. The second is a no-op. A Promise cannot be both fulfilled and rejected.
