---
id: async-await
title: "async/await: Mechanics and Equivalence"
pillar: tech
priority: mid
source: "Slide 9, ISAQuiz8"
bloom_levels: [understand, analyze, apply]
related: [promises-basics, promise-chaining, js-async-event-loop]
---

## Equivalence to Promise.resolve()

The `async` keyword transforms the return value of a function into a Promise automatically.
`async function f() { return x }` is precisely equivalent to `function f() { return Promise.resolve(x) }`.
The JavaScript engine does the wrapping — you never call `Promise.resolve()` yourself.

This equivalence holds for every return path, including implicit `undefined` returns.
An `async` function with no `return` statement returns `Promise.resolve(undefined)`.

> **Example**
>
> Step-by-step execution trace for the async/await version:
>
> ```js
> async function getUserAge(id) {
>   try {
>     const res = await fetch(`/api/users/${id}`);
>     const user = await res.json();
>     return user.age;
>   } catch (err) {
>     throw err;
>   }
> }
>
> getUserAge(42).then(age => console.log(age));
> ```
>
> 1. Engine encounters `async function getUserAge` — any `return` will be wrapped in `Promise.resolve()` automatically. The function itself returns a Promise to the caller.
> 2. `getUserAge(42)` is called. Execution enters the function body synchronously up to the first `await`.
> 3. `await fetch(...)` — the engine suspends `getUserAge` here. The continuation (lines after `await`) is scheduled as a microtask. The current call stack continues; the event loop is free.
> 4. When `fetch` settles, the microtask fires and `getUserAge` resumes. `res` receives the `Response` object.
> 5. `await res.json()` — `getUserAge` suspends again; a second microtask is scheduled.
> 6. When `res.json()` settles, the microtask fires and `getUserAge` resumes. `user` receives the parsed object.
> 7. `return user.age` — the engine wraps `user.age` in `Promise.resolve(user.age)`. The `.then(age => console.log(age))` callback is queued as a microtask and logs the age.
>
> The `.then()` chain version follows the same microtask sequence — `async/await` is syntactic sugar, not a different execution model.

## await and the Event Loop

`await` suspends the async function and schedules its continuation on the microtask queue.
The JavaScript thread is not blocked — the event loop processes other tasks while the function is paused.
When the awaited Promise settles, the continuation is queued as a microtask and runs before the next macrotask.

This is identical to `.then(callback)` — `await expr` desugars to:

```js
expr.then(value => /* rest of the function */);
```

The async function is just a generator-like wrapper the engine manages for you.

## Error Propagation

A rejected Promise under `await` throws an exception inside the async function.
`try/catch` catches it exactly as it would catch a synchronous throw.

```js
async function risky() {
  try {
    const data = await mightReject();
    return data;
  } catch (err) {
    // err is the rejection reason
    console.error(err);
    return null;
  }
}
```

If you do not catch the rejection, the returned Promise of the async function is itself rejected.
The caller's `.catch()` or outer `try/catch` handles it at that level.

> **Pitfall**
> Omitting `await` means the function does not wait — it continues immediately with a Promise object, not the fulfilled value.
>
> ```js
> async function broken() {
>   const data = fetch("/api/user"); // missing await
>   console.log(data.name);         // undefined — data is a Promise, not the response
> }
> ```
>
> This is a silent bug: no error is thrown, but `data` holds a Promise object.
> The fix is simple — add `await` before `fetch(...)`.

> **Takeaway:** `async` makes a function always return a Promise. `await` suspends the function and schedules its continuation as a microtask — the event loop is never blocked. Omitting `await` before a Promise-returning call is a silent bug: the variable holds a Promise object, not the fulfilled value. Error propagation maps exactly: `try/catch` inside an async function is equivalent to `.catch()` in a chain.
