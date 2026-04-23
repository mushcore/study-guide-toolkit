---
id: promises-basics
title: "Deep Dive: Promise Constructor, Executor, and State Machine"
pillar: tech
priority: high
source: "Slide 6, ISAQuiz8"
bloom_levels: [understand, apply, analyze]
related: [js-async-event-loop, sql-promises]
---

## The Promise as a state machine

A Promise is not a value container — it is a state machine that eventually produces a value or an error. The three states form a directed graph with one-way transitions:

```
pending  ──resolve()──►  fulfilled
pending  ──reject()───►  rejected
```

There is no transition from fulfilled to rejected, from rejected to fulfilled, or from any settled state back to pending. Once the Promise is settled, its state is locked.

The practical consequence: whichever of `resolve` or `reject` fires first wins. Every subsequent call to either function — including the one that "should have" run — is a no-op.

## Constructor syntax in full

```js
let promise = new Promise(function(resolve, reject) {
  // executor body — runs eagerly on construction
  // call resolve(value) to fulfill
  // call reject(reason) to reject
  // do nothing to leave it pending forever
});
```

`resolve` and `reject` are functions supplied by the JavaScript runtime — you do not define them. They are already wired to the Promise's internal state. Calling `resolve(value)` transitions state to fulfilled and stores `value` as the Promise's result. Calling `reject(reason)` transitions state to rejected and stores `reason` as the rejection cause.

The executor receives no return value — its return is ignored. Anything that needs to flow out of the executor must go through `resolve` or `reject`.

## Eager execution: what it means precisely

"Eager" means the executor runs on the current call stack, synchronously, at the moment `new Promise(executor)` is evaluated. No timer, no deferral, no queuing.

Contrast with lazy patterns (e.g., a plain function that you call later). With a Promise, you cannot delay the executor by waiting to call `.then()` — the executor already ran when you assigned the Promise to a variable.

```js
console.log('before');
let p = new Promise((resolve) => {
  console.log('inside executor'); // runs here, not when .then() is added
  resolve(42);
});
console.log('after construction');
p.then((v) => console.log('then:', v));
console.log('after then()');

// Output:
// before
// inside executor
// after construction
// after then()
// then: 42
```

## Resolve and reject change state synchronously; handlers run asynchronously

This distinction is the source of almost every exam mistake on this topic.

`resolve()` changes the Promise's internal state to fulfilled — that state change happens synchronously, on the call stack, right when `resolve()` is called. But the `.then()` handler is not called at that moment. JavaScript queues the handler in the **microtask queue** and continues executing the rest of the synchronous call stack. The handler runs only after the current call stack is completely empty.

> **Example — ISAQuiz8 Q3 execution trace:**
>
> ```js
> let promise = new Promise(function(resolve, reject) {
>   console.log('2');   // (A) executor runs eagerly — sync
>   reject('3');        // (B) state → rejected; enqueue .then(fn_reject) as microtask
>   resolve('4');       // (C) ignored — promise already settled
>   console.log('5');   // (D) executor continues synchronously
> });
> promise.then(fn_resolve, fn_reject);
> console.log('1');    // (E) synchronous
> ```
>
> Step-by-step:
>
> 1. `new Promise(executor)` — executor starts immediately.
> 2. **(A)** `console.log('2')` — prints `2`. Output: `2`.
> 3. **(B)** `reject('3')` — state transitions to rejected. The rejection handler (`fn_reject`) is enqueued as a microtask with argument `'3'`. No output yet.
> 4. **(C)** `resolve('4')` — Promise is already settled; this call is ignored. `'4'` will never be logged.
> 5. **(D)** `console.log('5')` — still inside executor, still sync. Output: `2`, `5`.
> 6. Executor returns. `promise.then(fn_resolve, fn_reject)` is called — registers handlers (the rejection handler is already queued; nothing new enqueued here since the Promise is settled).
> 7. **(E)** `console.log('1')` — sync. Output: `2`, `5`, `1`.
> 8. Call stack empties. Microtask queue drains: `fn_reject('3')` runs and logs `'3'`. Output: `2`, `5`, `1`, `3`.
>
> Final output: **`2`, `5`, `1`, `3`**. The value `'4'` never appears.

## Mutual exclusion and once-only settlement

The rule "only the first call wins" holds across all possible code paths — including timers.

```js
let promise = new Promise((resolve) => {
  setInterval(() => resolve('Hi'), 100);
});

promise.then((val) => console.log(val));
// Output: Hi  (printed exactly once, never again)
```

`setInterval` fires its callback every 100 ms. Each firing calls `resolve('Hi')`. Only the first firing settles the Promise. Every subsequent `resolve('Hi')` call is a no-op. The `.then()` handler fires exactly once.

> **Pitfall — common wrong mental model:** Students assume `resolve()` calls `.then()` the way a function calls another function. The actual sequence is: `resolve()` → state change (sync) → enqueue handler to microtask queue → call stack empties → event loop dequeues handler → handler runs. The `.then()` handler and `resolve()` are never on the call stack at the same time.

A second common mistake: assuming `.then()` on an already-resolved Promise is synchronous. Even if the Promise is already fulfilled at the moment `.then()` is attached, the handler still goes through the microtask queue.

```js
Promise.resolve().then(() => console.log(1));
console.log(2);
// Output: 2, 1  — not 1, 2
```

`Promise.resolve()` returns an already-fulfilled Promise. Attaching `.then()` to it still enqueues the callback as a microtask. `console.log(2)` is synchronous and runs first.

## State reference table

| State | How reached | Can transition? | Handler that fires |
|---|---|---|---|
| pending | Initial state on construction | Yes — to fulfilled or rejected | None yet |
| fulfilled | `resolve(value)` called | No | `.then(onFulfilled)` |
| rejected | `reject(reason)` called | No | `.catch(onRejected)` or `.then(null, onRejected)` |
| settled | Either fulfilled or rejected | No | — (collective term, not a state name) |

Note: "resolved" is not a state name in this course. Use "fulfilled" for the success state. "Resolved" is sometimes used loosely in documentation to mean "settled," which causes confusion — avoid it.
