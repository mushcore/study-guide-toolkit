---
id: js-functions
title: "Deep dive: function mechanics, closures, and callbacks"
pillar: tech
priority: mid
source: "Slide 3, ISAQuiz3, ISAQuiz6"
bloom_levels: [understand, apply, analyze]
related: [js-scope-hoisting, js-oop]
---

## Parameter vs. argument — the exact distinction

The function signature declares **parameters**: named placeholders that exist only inside the function body. The call site supplies **arguments**: the concrete values bound to those placeholders.

```js
function subtract(a, b) { return a - b; }
//                ^  ^  — parameters

subtract(23, 12);
//       ^^  ^^ — arguments
```

When the question says "what is `a` in the definition," the answer is always **parameter**. When it says "what is `23` in the call," the answer is always **argument**.

> **Pitfall:** Using "parameter" and "argument" interchangeably is wrong. Every quiz that covers this topic tests the distinction by name. Commit both terms as separate definitions, not synonyms.

---

## Return values — tracing output

**Example — chained subtraction (ISAQuiz3 style):**

```js
function subtract(a, b) { return a - b; }
console.log(subtract(23, 12) - subtract(10, 3));
```

Trace step by step:

1. `subtract(23, 12)` → `23 - 12` → `11`
2. `subtract(10, 3)` → `10 - 3` → `7`
3. `11 - 7` → `4`
4. `console.log(4)` → prints `4`

**Example — loop with function call (ISAQuiz3 style):**

```js
function tripleNumber(n) { return n * 3; }
for (let i = 0; i < 4; i++) {
  console.log(tripleNumber(i));
}
```

Trace:

| `i` | `tripleNumber(i)` | printed |
|-----|-------------------|---------|
| 0   | 0                 | `0`     |
| 1   | 3                 | `3`     |
| 2   | 6                 | `6`     |
| 3   | 9                 | `9`     |

Output: `0`, `3`, `6`, `9` on separate lines.

**Example — no return statement:**

```js
function foo(n) {
  var s = 0;
  for (let i = 0; i < n; i++) { s += i; }
}
console.log(foo(3));
```

`foo` computes `s = 0 + 1 + 2 = 3` internally but never returns it. JavaScript's implicit return is `undefined`. `console.log` prints `undefined`.

> **Pitfall:** Forgetting `return` is a logic error JavaScript does not flag. The function runs, produces an internal result, then discards it. `console.log(foo(3))` outputs `undefined`, not `3`.

---

## First-class functions

JavaScript functions are values. They can be stored in variables, passed to other functions, and returned from functions.

```js
const isAboveFive = function(n) { return n > 5; };
console.log(isAboveFive(10)); // true
```

Assigning a function expression to a variable is equivalent in behavior to a function declaration for call purposes.

---

## Higher-order functions and callbacks

A **higher-order function** takes a function as an argument or returns one. Built-in array methods are the canonical examples.

```js
function doubleEveryNum(arr) {
  return arr.map(n => n * 2);
}
console.log(doubleEveryNum([5, 4, 3, 2])); // [10, 8, 6, 4]
```

`Array.map` is the higher-order function. The arrow function `n => n * 2` is the **callback** — passed as an argument, called by `map` for each element.

**Discarded return value — a silent trap:**

```js
function checkString(s) { return s === "John"; }
checkString("John"); // nothing printed
```

`checkString("John")` evaluates to `true` inside the engine. No output appears because nothing captures or logs the return value.

---

## Closures

A **closure** is a function that retains access to variables from its enclosing scope after that scope has exited.

**Example — hiGenerator (ISAQuiz6):**

```js
function hiGenerator(greeting) {
  return function(name) {
    return greeting + ', ' + name;
  };
}
const sayHi = hiGenerator('Hello');
console.log(sayHi('World')); // Hello, World
```

Execution trace:

1. `hiGenerator('Hello')` runs. `greeting` is bound to `'Hello'`.
2. `hiGenerator` returns the inner function. Its execution context ends.
3. `sayHi` holds a reference to that inner function.
4. `sayHi('World')` runs. Inside, `name` is `'World'`. `greeting` is still `'Hello'` because the closure kept it alive.
5. Returns `'Hello, World'`. `console.log` prints `Hello, World`.

The key insight: the inner function's scope chain includes `greeting` from `hiGenerator`'s scope. JavaScript's garbage collector does not release `greeting` while the closure exists.

**Why closures matter:** They enable function factories, private state, and callback patterns — all central to how higher-order functions work in JavaScript.
