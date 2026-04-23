---
n: 11
id: js-functions
title: "Function declarations, callbacks, first-class functions, closures"
hook: "A function with no return statement still returns something — undefined — and that surprises most developers the first time they see it."
tags: [callbacks, higher-order, closures, return-types]
module: "JavaScript Foundations and Web Basics"
source: "Slide 3, ISAQuiz3, ISAQuiz6"
bloom_levels: [remember, understand, apply, analyze]
related: [js-scope-hoisting, js-oop, js-async-event-loop]
---

Call a function, get a value back — unless the function has no `return` statement. In that case JavaScript automatically returns `undefined`. This default behavior breaks many assumptions and produces silent bugs.

## Parameters vs. arguments

A **parameter** is the variable name listed in the function definition. An **argument** is the actual value you supply at the call site.

```js
function greet(name) {       // name is the parameter
  return "Hello, " + name;
}
greet("John");               // "John" is the argument
```

These two words are not interchangeable. Quiz questions test exactly this distinction.

> **Q:** In `function greet(name) { ... }`, which word describes `name` — parameter or argument?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** `name` is the **parameter**. It is the placeholder variable declared in the function signature. The value passed at the call site — e.g., `"John"` in `greet("John")` — is the **argument**.
> </details>

## What happens when there is no return

Every JavaScript function returns a value. If you omit the `return` statement, the return value is `undefined`.

```js
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) { s += i; }
  // no return statement
}
console.log(foo(3)); // undefined
```

The loop runs and `s` accumulates correctly, but `undefined` is what reaches `console.log`.

> **Pitfall**
> Omitting `return` does not log the last computed value — it logs `undefined`. `console.log(foo(3))` where `foo` has no `return` prints `undefined`, not `3`. ISAQuiz3 tests this directly.

## First-class functions

JavaScript treats functions as first-class values. You can assign a function to a variable, pass it as an argument, or return it from another function.

```js
const double = function(n) { return n * 2; };
[1, 2, 3].map(double); // [2, 4, 6]
```

A **higher-order function** either accepts a function as an argument or returns a function. `Array.map`, `Array.filter`, and `Array.forEach` are all higher-order functions.

## Callbacks

A **callback** is a function passed as an argument to another function. The receiving function calls it later — either synchronously or asynchronously.

```js
function applyTwice(fn, value) {
  return fn(fn(value));
}
applyTwice(double, 3); // 12
```

> **Q:** What does `applyTwice(double, 3)` return if `double` is defined as `n => n * 2`?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** `12`. `double(3)` returns `6`. `double(6)` returns `12`.
> </details>

## Closures

A **closure** is a function that retains access to variables from its enclosing scope after that scope has exited.

```js
function hiGenerator(greeting) {
  return function(name) {
    return greeting + ', ' + name;
  };
}
const sayHi = hiGenerator('Hello');
console.log(sayHi('World')); // Hello, World
```

`hiGenerator` returns an inner function. That inner function closes over `greeting`. When you call `sayHi('World')`, `greeting` is still `'Hello'` even though `hiGenerator` has already returned.

> **Q:** Why does `sayHi('World')` still have access to `greeting` after `hiGenerator` has returned?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** Because `sayHi` is a closure. The inner function captures a reference to `greeting` from its enclosing scope. JavaScript keeps that variable alive as long as the closure references it.
> </details>

## Discarded return values

Calling a function without capturing or logging its return value silently discards it.

```js
function checkString(s) { return s === "John"; }
checkString("John"); // returns true — nothing is printed
```

The function returns `true`, but no output appears because there is no `console.log` at the call site.

> **Pitfall**
> `checkString("John")` returns `true` but prints **nothing**. The return value is discarded when no `console.log` wraps the call. ISAQuiz3 tests this pattern.

> **Takeaway:** Every function returns a value — either the value after `return`, or `undefined` if there is no `return`. Parameters are definition-site names; arguments are call-site values. Closures keep enclosing-scope variables alive.
