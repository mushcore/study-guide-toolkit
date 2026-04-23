---
id: js-scope-hoisting
title: "Deep Dive: var/let/const Scope, Hoisting, and the Event Loop"
pillar: tech
priority: high
source: "Slide 1, Slide 3, ISAQuiz3, ISAQuiz6"
bloom_levels: [understand, apply, analyze]
related: [js-functions, js-async-event-loop]
---

## How the JavaScript compiler creates scope

Before executing any code, V8 (and every other JS engine) performs a compilation pass. During that pass, all `var` declarations inside a function are registered in the function's variable environment with the initial value `undefined`. This registration is hoisting. The assignment expression associated with the declaration is NOT moved — it executes at the original line.

`let` and `const` declarations are also processed during compilation, but they are placed in the Temporal Dead Zone (TDZ). Any read or write before the declaration line throws `ReferenceError`. The TDZ ends the moment the declaration line executes.

## Scope comparison table

| Keyword | Scope unit | Initial value before declaration line | Re-assignable | Re-declarable |
|---------|-----------|---------------------------------------|---------------|---------------|
| `var`   | Function  | `undefined` (hoisted)                 | Yes           | Yes           |
| `let`   | Block `{}`| TDZ → `ReferenceError`                | Yes           | No            |
| `const` | Block `{}`| TDZ → `ReferenceError`                | No            | No            |

A "block" is any pair of `{}`: `if`, `for`, `while`, or a bare `{}`.

---

## Worked Examples

**Example 1 — var hoisting with assignment expression (ISAQuiz6 Q4)**

```js
if (m = []) {
  console.log("Green");
}
var m = 10;
```

Step-by-step:
1. Compilation pass: `var m` is hoisted. `m` now exists in the enclosing scope with value `undefined`.
2. Execution reaches `m = []`. This is an assignment expression, not a declaration. It sets `m = []` and evaluates to `[]`.
3. `if ([])` — arrays are truthy in JavaScript, even empty ones.
4. The `if` body runs: `"Green"` is printed.
5. `var m = 10` executes: `m` is re-assigned to `10` (re-declaration of `var` is legal).

Output: `Green`

Students who miss step 1 expect a `ReferenceError` on `m = []` because `var m = 10` appears later in the source. Hoisting makes that expectation wrong.

**Example 2 — let block scope (ISAQuiz6 Q5)**

```js
if (true) {
  let a = 5;
}
console.log(a);
```

Step-by-step:
1. `let a = 5` is scoped to the `if` block's `{}`.
2. The block closes. `a` goes out of scope — it is not moved to the outer scope.
3. `console.log(a)` runs in the outer scope. `a` does not exist there.
4. Result: `Uncaught ReferenceError: a is not defined`.

Students sometimes expect `undefined` here by analogy with `var` hoisting. `let` produces a hard `ReferenceError`, not `undefined`, when accessed outside its block.

**Example 3 — function with no return (ISAQuiz6 Q6)**

```js
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) {
    s += i;
  }
}
console.log(foo(3));
```

Step-by-step:
1. `foo(3)` executes. The loop runs: `s = 0 + 0 + 1 + 2 = 3`.
2. Execution reaches the closing `}` without hitting `return`.
3. JavaScript implicitly returns `undefined` from any function that exits without a `return` statement carrying a value.
4. `console.log(undefined)` prints `undefined`.

The trap: students see the loop compute `s = 3` and expect `3` to appear. The variable `s` is local to `foo`. Without `return s`, it never escapes.

---

## Pitfalls

**Pitfall 1 — var hoisting gives `undefined`, not `ReferenceError`**

```js
console.log(x); // undefined — NOT ReferenceError
var x = 42;
```

The declaration is hoisted; the value is not. Every exam question that asks "what does this print before the var declaration" expects `undefined`.

**Pitfall 2 — let/const block scope gives `ReferenceError`, not `undefined`**

```js
if (true) {
  let a = 5;
}
console.log(a); // ReferenceError: a is not defined
```

Do not confuse with `var`. `let` outside its block is a hard error, not a silent `undefined`.

**Pitfall 3 — no return → `undefined` return value**

```js
function compute() { var x = 9; }
console.log(compute()); // undefined
```

Any function that finishes without `return <value>` returns `undefined`. The internal computation is irrelevant to the caller.

---

## Event loop mechanics

JavaScript runs on a single thread. The event loop coordinates three structures:

| Structure | Contents | Drain order |
|-----------|----------|-------------|
| Call stack | Currently executing frames | Runs until empty |
| Microtask queue | Resolved Promise `.then()` / `queueMicrotask()` callbacks | Drains completely after each task |
| Callback queue (macrotask) | `setTimeout`, `setInterval`, I/O callbacks | One per event-loop tick |

The drain order is strict: call stack → microtask queue (fully drained) → one macrotask → microtask queue again → repeat.

**Example — microtask before macrotask**

```js
setTimeout(() => console.log("macro"), 0);
Promise.resolve().then(() => console.log("micro"));
console.log("sync");
```

Output:
```
sync
micro
macro
```

Reason: `"sync"` runs first (synchronous). The Promise `.then()` enqueues a microtask. `setTimeout` with `0` ms enqueues a macrotask. When the call stack empties, the microtask queue drains first → `"micro"`. Then the event loop picks the macrotask → `"macro"`.
