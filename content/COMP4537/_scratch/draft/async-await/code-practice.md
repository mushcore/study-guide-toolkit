---
id: async-await-practice
title: "Refactor a Promise Chain to async/await"
lang: js
module: "Promises and Async Programming"
topic: async-await
source: ["Slide 9 (slides 3, 5, 52)"]
---

## Prompt

The function below uses a `.then()` chain to fetch a user's name from an API and log it.
Refactor it to use `async/await` syntax. The behavior must be identical — same Promise returned to the caller, same error handling.

## Starter

```js
// Promise-chain version — refactor this to async/await
function getUserName(userId) {
  return fetch(`/api/users/${userId}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return data.name;
    })
    .catch(function(err) {
      console.error("Failed to load user:", err);
      return null;
    });
}

// Caller — do not change this
getUserName(42).then(name => console.log(name));
```

## Solution

```js
// async/await version — identical behavior
async function getUserName(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return data.name;
  } catch (err) {
    console.error("Failed to load user:", err);
    return null;
  }
}

// Caller is unchanged — getUserName still returns a Promise
getUserName(42).then(name => console.log(name));
```

## Why

**Syntactic sugar over .then()** — every `await` in the solution corresponds directly to a `.then()` in the starter. The underlying Promise and microtask-queue mechanics are identical. The async function still returns a Promise to its caller; the `await` keyword only affects execution inside `getUserName`.

**Omitting await is a common silent bug.** If you write `const data = response.json()` without `await`, `data` holds a Promise object, not the parsed JSON. No error is thrown — the code continues with `data.name` evaluating to `undefined`. This is one of the most frequent async/await mistakes. Always `await` any expression that returns a Promise before accessing its value.

**async does not change the underlying Promise behavior.** The network request, the microtask scheduling, and the fulfillment/rejection flow are all the same. `async/await` only changes how you write the code that reacts to those Promises — the engine still runs the same Promise machinery underneath.

**try/catch maps directly to .catch().** A rejected Promise under `await` throws into the nearest enclosing `catch` block, exactly as `.catch(err => ...)` would handle it in a chain.
