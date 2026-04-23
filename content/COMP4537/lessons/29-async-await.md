---
n: 29
id: async-await
title: "async/await: Cleaner Syntax Over Promises"
hook: "Promise chains grow verbose fast. async/await gives you the same mechanism with synchronous-looking code."
tags: [async, await, promise, syntax]
module: "Promises and Async Programming"
source: "Slide 9, ISAQuiz8"
related: [promises-basics, promise-chaining]
bloom_levels: [remember, understand, apply]
---

## The Problem with Promise Chains

Long `.then()` chains solve the callback problem but introduce their own verbosity.
`async/await` is syntactic sugar over Promises — it does not replace them or change their behavior.
Every `async function` you write still returns a Promise under the hood.

## The async Keyword

Declaring a function `async` makes it automatically return a Promise wrapping its return value.
These two functions are equivalent:

```js
// Promise version
function greet() {
  return Promise.resolve("Hello");
}

// async/await version — identical behavior
async function greet() {
  return "Hello";
}
```

Both return a Promise that fulfills with `"Hello"`.
The runtime wraps the bare return value in `Promise.resolve()` for you.

> **Q:** What does an async function return when you invoke it?
>
> **A:** Always an object — specifically a Promise. Even if the function body returns a plain string, the caller receives a Promise.

## The await Keyword

`await` pauses the async function until the awaited Promise settles, then resumes with the fulfilled value.

```js
async function loadUser() {
  const response = await fetch("/api/user"); // pauses here until fetch settles
  const data = await response.json();        // pauses again
  return data;
}
```

`await` does not block the JavaScript thread.
Other code continues running while `loadUser` is paused at an `await` expression.
Each `await` is equivalent to a `.then()` callback — the microtask queue still drives execution.

> **Pitfall**
> `await` is only valid inside an `async` function. Using it in a regular function causes a `SyntaxError`. Mark the enclosing function `async` before adding any `await`.

## Error Handling

`async/await` replaces `.catch()` with standard `try/catch` blocks.

```js
async function loadUser() {
  try {
    const response = await fetch("/api/user");
    return await response.json();
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
```

A rejected Promise inside `await` throws into the `catch` block.
This maps directly to the `.catch()` handler in a Promise chain.

## Promise Chain vs async/await Side-by-Side

```js
// Promise chain
function getUsername() {
  return fetch("/api/user")
    .then(response => response.json())
    .then(data => data.name)
    .catch(err => console.error(err));
}

// async/await — same behavior
async function getUsername() {
  try {
    const response = await fetch("/api/user");
    const data = await response.json();
    return data.name;
  } catch (err) {
    console.error(err);
  }
}
```

Both functions return a Promise. Callers use them identically: `getUsername().then(name => ...)`.

> **Takeaway:** `async/await` is syntactic sugar over Promises. An async function always returns a Promise (type: object). `await` pauses the function — not the thread — until the Promise settles. Omitting `async` from a function that uses `await` is a `SyntaxError`.
