---
id: js-async-event-loop
title: "Deep Dive: Event Loop, Microtasks, and Macrotasks"
pillar: tech
priority: mid
source: "Slide 4, ISAQuiz6, ISAQuiz8"
bloom_levels: [understand, apply, analyze]
related: [promises-basics, nodejs-basics, js-scope-hoisting]
---

## Why one thread can handle everything

The single-threaded non-blocking model delegates every I/O operation to the operating system. The OS performs the work asynchronously and notifies Node.js when it finishes. Node.js places the associated callback into the event queue. The event loop picks that callback up only after the call stack is empty.

The V8 engine compiles JavaScript to native machine code. It does not interpret line-by-line at runtime. Compilation happens before execution, which is why JS can be fast despite its single-thread constraint.

The thread-per-request model allocates one OS thread per incoming request. One hundred concurrent requests spawn one hundred threads. Each thread blocks on its I/O, consuming memory even while idle. The single-thread async model handles the same one hundred requests on one thread — the thread never blocks because all I/O is delegated.

## Macrotasks vs microtasks

| Property | Macrotask | Microtask |
|---|---|---|
| Queue name | Macrotask queue (task queue) | Microtask queue (job queue) |
| Sources | `setTimeout`, `setInterval`, I/O callbacks, `setImmediate` (Node.js) | Promise `.then` / `.catch` / `.finally`, `queueMicrotask` |
| Drain rule | **One** task per event-loop tick | **All** tasks drained before next macrotask |
| Priority | Lower — runs after microtask queue empties | Higher — runs before any macrotask |
| Starvation risk | No | Yes — infinite microtask chain blocks macrotasks forever |

The drain rule difference is load-bearing for every ordering question. After the synchronous call stack empties, the event loop drains the **entire** microtask queue before touching the next macrotask. A resolved Promise chain with ten `.then()` calls all executes before a single `setTimeout` callback fires.

## Worked example: full execution trace

```js
// (A)
setTimeout(function() {
  console.log(1);   // macrotask
}, 1);

// (B)
new Promise(function(resolve) {
  console.log(2);   // sync — executor runs eagerly
  resolve();
}).then(function() {
  console.log(4);   // microtask
});

// (C)
console.log(3);     // sync
```

**Step-by-step trace:**

1. **Line A** — `setTimeout(fn, 1)` is called. The runtime registers `fn` with the timer Web API. Control returns immediately. The call stack does not pause. `fn` will become a macrotask after at least 1 ms.
2. **Line B** — `new Promise(executor)` constructs the Promise. The executor function runs **eagerly and synchronously** right now. `console.log(2)` fires. Output so far: `2`.
3. **Still line B** — `resolve()` is called. The Promise transitions to fulfilled. The `.then(fn)` callback is enqueued to the **microtask queue**. No output yet for `4`.
4. **Line C** — `console.log(3)` runs synchronously. Output so far: `2`, `3`.
5. **Call stack empties.** The event loop checks: are there microtasks? Yes. It drains the microtask queue completely. `console.log(4)` runs. Output so far: `2`, `3`, `4`.
6. **Microtask queue empty.** The event loop pulls one macrotask: the `setTimeout` callback. `console.log(1)` runs. Final output: `2`, `3`, `4`, `1`.

**Example — eager executor with pending chain:**

```js
new Promise(function(resolve) {
  console.log(1);
  console.log(2);
  // resolve is never called
}).then(() => console.log(3)).then(() => console.log(4));

console.log(5);
```

Trace:

1. Executor runs eagerly: `1`, `2` print.
2. The Promise stays **pending** — `resolve` was never called.
3. `.then(() => console.log(3))` registers a reaction, but the Promise is pending so nothing enqueues.
4. `console.log(5)` runs: `5` prints.
5. Call stack empties. Microtask queue is empty (nothing was resolved). Macrotask queue is empty.
6. Final output: `1`, `2`, `5`. Lines `3` and `4` never print.

**Pitfall:** Students assume the Promise executor is deferred like a `setTimeout`. It is not. The executor runs the instant `new Promise(executor)` is evaluated — before any following synchronous statement. Confusing eager execution with deferred execution is the most common source of wrong output predictions on async ordering questions.

## What counts as native async

`setTimeout` and `setInterval` are Web APIs backed by the browser or Node.js runtime timer subsystem. Calling them offloads the timer to the runtime; the callback returns as a macrotask.

`forEach` is synchronous. It runs each iteration inline on the call stack — no queuing, no deferral. Passing an async function to `forEach` does not make `forEach` itself async. Each call to the async function returns a Promise immediately; `forEach` discards those Promises.

`console.log` is synchronous. It writes to stdout and returns.
