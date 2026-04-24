---
n: 10
id: js-functions
title: "Predict function call output"
lang: js
tags: [functions, callbacks, closures, return-types]
source: "Slide 3, ISAQuiz3"
kind: code
---

## Prompt

Each snippet below matches an ISAQuiz3-style question. For each one, predict the exact console output before running it. Write your answer before checking the solution.

**Trace A — no return statement**

```js
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) { s += i; }
}
console.log(foo(3));
```

**Trace B — chained function calls**

```js
function subtract(a, b) { return a - b; }
console.log(subtract(23, 12) - subtract(10, 3));
```

**Trace C — discarded return value**

```js
function checkString(s) { return s === "John"; }
checkString("John");
```

**Trace D — loop with function call**

```js
function tripleNumber(n) { return n * 3; }
for (let i = 0; i < 4; i++) {
  console.log(tripleNumber(i));
}
```

**Trace E — closure (ISAQuiz6 hiGenerator)**

```js
function hiGenerator(greeting) {
  return function(name) {
    return greeting + ', ' + name;
  };
}
const sayHi = hiGenerator('Hello');
console.log(sayHi('World'));
```

## Starter

```js
// Work through each trace by hand before running.
// Fill in your predicted output as a comment on each console.log line.

function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) { s += i; }
}
console.log(foo(3));               // your prediction: ?

function subtract(a, b) { return a - b; }
console.log(subtract(23, 12) - subtract(10, 3)); // your prediction: ?

function checkString(s) { return s === "John"; }
checkString("John");               // your prediction: ?

function tripleNumber(n) { return n * 3; }
for (let i = 0; i < 4; i++) {
  console.log(tripleNumber(i));    // your predictions: ?
}

function hiGenerator(greeting) {
  return function(name) {
    return greeting + ', ' + name;
  };
}
const sayHi = hiGenerator('Hello');
console.log(sayHi('World'));       // your prediction: ?
```

## Solution

```js
// Trace A — no return statement
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) { s += i; }
  // no return → implicitly returns undefined
}
console.log(foo(3)); // undefined

// Trace B — chained subtraction
function subtract(a, b) { return a - b; }
// subtract(23, 12) = 11
// subtract(10, 3)  = 7
// 11 - 7 = 4
console.log(subtract(23, 12) - subtract(10, 3)); // 4

// Trace C — discarded return value
function checkString(s) { return s === "John"; }
checkString("John"); // returns true — but nothing is printed (no console.log)

// Trace D — loop output
function tripleNumber(n) { return n * 3; }
for (let i = 0; i < 4; i++) {
  console.log(tripleNumber(i));
}
// 0
// 3
// 6
// 9

// Trace E — closure
function hiGenerator(greeting) {
  return function(name) {
    return greeting + ', ' + name;
  };
}
const sayHi = hiGenerator('Hello');
console.log(sayHi('World')); // Hello, World
```

## Why

**Trace A:** `foo` has no `return` statement. JavaScript returns `undefined` from any function that reaches the end without an explicit `return`. The loop ran and computed `s = 3`, but that value was never returned. `console.log(undefined)` prints `undefined`.

**Trace B:** Both calls to `subtract` execute before the outer subtraction. `subtract(23, 12)` returns `11`. `subtract(10, 3)` returns `7`. The expression becomes `11 - 7`, which is `4`.

**Trace C:** `checkString("John")` evaluates `"John" === "John"`, which is `true`, and returns it. But no code captures or logs that return value. The call site discards it silently. Nothing is printed to the console.

**Trace D:** The `for` loop iterates `i` from `0` to `3` inclusive. Each iteration calls `tripleNumber(i)` and logs the result. `0*3=0`, `1*3=3`, `2*3=6`, `3*3=9`. Each `console.log` call executes synchronously in order, printing one value per line.

**Trace E:** `hiGenerator('Hello')` binds `greeting = 'Hello'` and returns the inner function. The inner function is a closure — it captures `greeting` from `hiGenerator`'s scope. After `hiGenerator` returns, `greeting` stays alive because the closure references it. Calling `sayHi('World')` binds `name = 'World'` and evaluates `'Hello' + ', ' + 'World'`, producing `'Hello, World'`.
