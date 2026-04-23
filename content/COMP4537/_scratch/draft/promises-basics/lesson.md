---
n: 27
id: promises-basics
title: "Promises: Constructor, States, and Eager Execution"
hook: "A function can only return one value — but an async operation can succeed or fail. A Promise solves that mismatch."
tags: [promises, resolve, reject, pending, fulfilled, rejected, executor]
module: "Promises and Async Programming"
source: "Slide 6, ISAQuiz8"
related: [js-async-event-loop, sql-promises]
bloom_levels: [remember, understand, apply, analyze]
pedagogy: productive-failure
---

A function that makes an HTTP request cannot return the response directly — the response does not exist yet when the function returns. The Promise object exists to represent that eventual value and to route the result to the right handler when it does arrive.

## The constructor and executor

Creating a Promise looks like this:

```js
let promise = new Promise((resolve, reject) => {
  // executor body
  resolve('Done!');
});
```

You pass one function — the **executor** — to `new Promise()`. JavaScript calls that executor immediately when the Promise is constructed, before the next synchronous statement runs. The runtime provides two arguments: `resolve` and `reject`. Call `resolve(value)` to signal success; call `reject(reason)` to signal failure.

The executor runs **eagerly**. "Eagerly" means right now, synchronously, on the call stack. Nothing defers it.

## The three states

Every Promise begins in the **pending** state. It transitions to exactly one other state:

| Event | New state | Handler that fires |
|---|---|---|
| `resolve(value)` called | **fulfilled** | `.then(onFulfilled)` |
| `reject(reason)` called | **rejected** | `.catch(onRejected)` or `.then(null, onRejected)` |

Once a Promise leaves pending it is **settled**. Settlement is final — state never changes again.

```js
let promise = new Promise((resolve, reject) => {
  reject('Rejected!');   // settles the promise immediately
  resolve('Resolved!'); // ignored — already settled
});

promise.then(
  (value)  => { console.log(value); },  // never fires
  (reason) => { console.log(reason); }  // logs 'Rejected!'
);
```

`resolve` and `reject` are **mutually exclusive** — only the first call that settles the Promise matters. Every subsequent call to either function is silently ignored.

## Executor timing vs handler timing

The executor is synchronous. The `.then()` handler is not.

```js
const fn1 = () => new Promise((resolve, reject) => {
  console.log(1);       // executor — runs NOW (eager, sync)
  resolve('success');   // enqueues .then callback to microtask queue
});

fn1().then((res) => {
  console.log(res);     // runs AFTER 'start' — microtask, not sync
});

console.log('start');   // runs synchronously, before microtask drains
// Output: 1, start, success
```

`resolve()` does not call the `.then()` handler directly. It changes the Promise's state, then JavaScript enqueues the handler in the **microtask queue**. That queue drains only after the current synchronous call stack is empty.

> **Q:** What is the output of the code above, and why does `'start'` print before `'success'`?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** Output is `1`, `start`, `success`.
>
> `1` prints immediately because the executor runs eagerly. `resolve('success')` enqueues the `.then` callback as a microtask — it does not run yet. `console.log('start')` runs next because it is synchronous. Only after the call stack empties does the microtask queue drain, printing `'success'`.
> </details>

## What happens if resolve is never called

If the executor never calls `resolve()` or `reject()`, the Promise stays pending forever. Every `.then()` or `.catch()` chain attached to it is silently skipped.

```js
let promise = new Promise((resolve, reject) => {
  console.log('executor ran'); // prints
  // resolve and reject never called
});

promise.then(() => console.log('then ran')); // never prints
// Promise state: pending
```

> **Pitfall:** Students often expect `.then()` to fire immediately when `resolve()` is called. `resolve()` only *enqueues* the handler. The handler fires after the current synchronous call stack empties — not inline. Any synchronous code after the `new Promise(...)` expression runs before any `.then()` callback, even if `resolve()` was called inside the executor.

> **Takeaway:** `new Promise(executor)` runs the executor immediately and synchronously. The executor calls `resolve` or `reject` to settle the Promise. Settlement is permanent — only the first call counts. `.then()` and `.catch()` handlers are microtasks: they run after all synchronous code in the current call stack, not at the moment `resolve` or `reject` is called.
