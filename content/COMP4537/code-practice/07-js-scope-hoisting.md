---
n: 7
id: js-scope-hoisting
title: "Predict hoisting and scope output"
lang: js
tags: [hoisting, var, let, scope, block-scope]
source: "Slide 1, Slide 3, ISAQuiz6"
---

## Prompt

Three snippets from past exams (ISAQuiz6). Predict the console output of each. If the code throws an error, name the error type and state why.

**Snippet A**
```js
if (m = []) {
  console.log("Green");
}
var m = 10;
```

**Snippet B**
```js
if (true) {
  let a = 5;
}
console.log(a);
```

**Snippet C**
```js
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) {
    s += i;
  }
}
console.log(foo(3));
```

## Starter

```js
// Snippet A — predict the output on the line below
if (m = []) {
  console.log("Green"); // ???
}
var m = 10;

// Snippet B — predict the output or name the error
if (true) {
  let a = 5;
}
console.log(a); // ???

// Snippet C — predict the output
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) {
    s += i;
  }
}
console.log(foo(3)); // ???
```

## Solution

```js
// Snippet A
if (m = []) {
  console.log("Green"); // "Green"
}
var m = 10;
// Output: Green

// Snippet B
if (true) {
  let a = 5;
}
console.log(a); // Uncaught ReferenceError: a is not defined

// Snippet C
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) {
    s += i;
  }
}
console.log(foo(3)); // undefined
```

## Why

**Snippet A — var hoisting + assignment expression**

`var m` is hoisted to the top of the enclosing scope before any code runs. When execution reaches `if (m = [])`, `m` already exists (value `undefined`). The expression `m = []` is an assignment — it sets `m` to `[]` and evaluates to `[]`. An empty array is truthy in JavaScript, so the `if` body executes and prints `"Green"`.

Wrong approach 1: expecting `ReferenceError` because `var m = 10` appears after the `if`. Hoisting moves the declaration above everything in the function — the `= 10` initialization stays in place, but the declaration does not.

Wrong approach 2: expecting the condition to be `undefined` (falsy) because `m` starts as `undefined`. The condition is `m = []`, not `m`. The assignment replaces `undefined` with `[]`.

**Snippet B — let block scope**

`let a = 5` is scoped to the `if` block's `{}`. The variable lives only between the opening and closing brace of that block. After the block closes, `a` is gone. `console.log(a)` in the outer scope finds no binding for `a` and throws `Uncaught ReferenceError: a is not defined`.

Wrong approach: expecting `undefined` by analogy with `var`. `var` would be hoisted to the outer scope, making it `undefined` before assignment. `let` is not hoisted out of its block — it throws a hard `ReferenceError`.

**Snippet C — implicit undefined return**

`foo(3)` runs the loop and computes `s = 3` (0 + 0 + 1 + 2). There is no `return` statement. JavaScript implicitly returns `undefined` from any function that exits without `return <value>`. `console.log(foo(3))` therefore prints `undefined`.

Wrong approach: expecting `3` because the loop computes it. The computed value is stored in the local variable `s`. Without `return s`, it never reaches the caller. `s` is destroyed when the function's stack frame is popped.
