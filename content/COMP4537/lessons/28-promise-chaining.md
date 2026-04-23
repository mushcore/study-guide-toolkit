---
n: 28
id: promise-chaining
title: ".then() Chaining, .catch(), and .finally()"
hook: "Callback hell collapses to a readable pipeline once you know that .then() always returns a new Promise."
tags: [then, catch, finally, chaining, microtask-queue]
module: "Promises and Async Programming"
source: "Slide 6, ISAQuiz9"
related: [promises-basics, async-await, js-async-event-loop]
bloom_levels: [remember, understand, apply, analyze]
---

## Why chaining exists

Sequential async steps — fetch user, then fetch profile, then render — pile into nested callbacks. Each step must wait for the prior result, so nesting grows. Promise chaining solves this by making each `.then()` return a new Promise, letting you write the steps as a flat sequence.

## How .then() chaining works

`.then()` always returns a new Promise. That return value is what you call the next `.then()` on. The callback you pass to `.then()` receives the fulfilled value of the upstream Promise.

Returning a plain value from a `.then()` callback fulfills the next Promise with that value. Throwing an error rejects it.

```js
new Promise(resolve => {
  resolve(1);
})
.then(a => {
  console.log('First:', a);   // First: 1
  return a * 2;               // fulfills next Promise with 2
})
.then(b => {
  console.log('Second:', b);  // Second: 2
  return b * 3;               // fulfills next Promise with 6
})
.then(c => {
  console.log('Final:', c);   // Final: 6
});
```

Each `.then()` callback receives the return value of the previous one. Nothing inside the chain is synchronous — all three callbacks run as microtasks after the call stack empties.

## .catch() — handling rejection

`.catch(fn)` is shorthand for `.then(undefined, fn)`. Place it at the end of a chain to catch any rejection from any upstream step.

```js
const p = new Promise((resolve, reject) => {
  const success = false;
  if (success) resolve('Everything worked!');
  else reject('Something went wrong');
});

p.then(result => {
  console.log('SUCCESS:', result);
})
.catch(error => {
  console.log('ERROR:', error); // ERROR: Something went wrong
});
```

Removing `.catch()` leaves the rejection unhandled — the runtime emits an unhandled-rejection error. Always attach a `.catch()` at the chain's end when rejection is possible.

A throw inside any `.then()` callback acts as a rejection and skips to the nearest downstream `.catch()`.

## .finally() — runs regardless of outcome

`.finally(f)` runs `f` whether the Promise was fulfilled or rejected. The callback receives no value — `f` is called with `undefined`. After `.finally()` completes, the chain continues with the original fulfilled value or rejection reason, unless `.finally()` itself throws.

Use `.finally()` for cleanup that must happen regardless of success or failure (closing connections, hiding spinners).

> **Q:** A `.then()` callback returns `num * 3`. What is the state of the Promise returned by that `.then()` call?
>
> **A:** Fulfilled, with the value `num * 3`. Returning a plain value from `.then()` resolves the new Promise with that value.

> **Q:** A `.then()` callback contains `throw new Error('bad')`. Which handler runs next?
>
> **A:** The nearest downstream `.catch()`. Throwing inside `.then()` rejects the Promise that `.then()` returned.

## Return vs. throw inside .then()

| Action in `.then()` callback | Effect on the returned Promise |
|---|---|
| `return value` | Fulfilled with `value` |
| `return anotherPromise` | Adopts the state of `anotherPromise` |
| `throw error` | Rejected with `error` |
| (no return) | Fulfilled with `undefined` |

This mirrors try/catch: the `.then()` body is the try block; `.catch()` is the catch block.

> **Pitfall**
> `.then()` callbacks are microtasks — they drain completely before any `setTimeout` callback fires. If your chain includes `setTimeout` calls, every `.then()` in the entire chain runs before the first timeout handler executes, regardless of where the `setTimeout` appears in the code.

## Promise.resolve() and Promise.reject() shortcuts

`Promise.resolve(value)` creates an already-fulfilled Promise with `value`. `Promise.reject(reason)` creates an already-rejected Promise. Both let you enter a chain without needing a full executor.

```js
Promise.resolve(2)
  .then(n => n * 3)  // 6
  .then(n => n + 1)  // 7
  .then(n => console.log(n)); // 7
```

> **Takeaway:** `.then()` returns a new Promise — that single fact makes chaining possible. Return a value to pass it forward, throw to redirect to `.catch()`, and use `.finally()` for unconditional cleanup. Microtask callbacks always complete before any macrotask fires.
