---
id: async-await
title: "async/await: Mechanics and Equivalence"
pillar: tech
priority: mid
source: ["Slide 9 (slides 3, 5, 52)", "ISAQuiz8 Q11"]
bloom_levels: [understand, analyze, apply]
related: [promises-intro, promise-chaining, event-loop]
---

## Equivalence to Promise.resolve()

The `async` keyword transforms the return value of a function into a Promise automatically.
`async function f() { return x }` is precisely equivalent to `function f() { return Promise.resolve(x) }`.
The JavaScript engine does the wrapping — you never call `Promise.resolve()` yourself.

This equivalence holds for every return path, including implicit `undefined` returns.
An `async` function with no `return` statement returns `Promise.resolve(undefined)`.

> **Example:** Converting a `.then()` chain to async/await
>
> ```js
> // Original Promise chain
> function getUserAge(id) {
>   return fetch(`/api/users/${id}`)
>     .then(res => res.json())
>     .then(user => user.age)
>     .catch(err => { throw err; });
> }
>
> // async/await equivalent — same Promise returned to caller
> async function getUserAge(id) {
>   try {
>     const res = await fetch(`/api/users/${id}`);
>     const user = await res.json();
>     return user.age;
>   } catch (err) {
>     throw err;
>   }
> }
> ```
>
> Both return a Promise. The caller calls `getUserAge(42).then(age => ...)` in either case.
> The `.then()` chain and the `await` chain compile to the same microtask-queue behavior.

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

> **Pitfall:** Omitting `await` means the function does not wait — it continues immediately with a Promise object, not the resolved value.
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
> Linters (e.g., `no-floating-promises`) catch this automatically.

## Top-Level await

Outside of a module, `await` requires an enclosing `async` function.
Inside an ES module (`type="module"`), top-level `await` is valid — the module itself is treated as an async function.
In CommonJS or a browser script tag without `type="module"`, top-level `await` causes a `SyntaxError`.
