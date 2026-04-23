---
n: 12
id: js-arrays-loops
title: "Arrays, Loops, and Iteration Patterns"
hook: "Assigning to arr[1] without touching arr[0] leaves a silent hole — reading arr[0] returns undefined, not an error."
tags: [arrays, for-loop, iteration, index]
module: "JavaScript Foundations and Web Basics"
source: "ISAQuiz2"
bloom_levels: [remember, understand, apply]
related: [js-scope-hoisting, js-functions]
---

Assigning a value to index 1 without assigning index 0 creates a sparse array. Reading the unassigned slot returns `undefined`, not an error.

```js
let arr = [];
arr[1] = 1234;
console.log(arr[0]); // undefined — slot 0 was never written
```

Arrays in JavaScript are objects. Any integer key you skip stays uninitialized, and uninitialized slots read as `undefined`.

---

## Indexing with `arr.length`

`arr.length` equals the count of slots, not the last valid index. The last valid index is always `arr.length - 1`.

```js
const arr = ['a', 'b', 'c', 'd', 'e', 'f']; // 6 elements
console.log(arr[arr.length / 2]); // arr[3] = 'd'
console.log(arr[arr.length - 2]); // arr[4] = 'e'  ← second-to-last
```

> **Pitfall**
> Using `i <= arr.length` in a loop lets `i` reach `arr.length`. That slot does not exist. You read `undefined` on the final iteration. Always use `i < arr.length`.

---

## `for` loops — boundary and direction

A standard ascending loop runs from index `0` up to but not including `arr.length`.

```js
const arr = [1, 2, 3];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // 1, 2, 3
}
```

A descending loop includes both the starting and ending values.

```js
for (let i = 5; i >= 0; i--) {
  console.log(i); // 5, 4, 3, 2, 1, 0  ← both endpoints included
}
```

`break` exits the loop immediately. The body does not execute for the iteration that triggers `break`.

```js
for (let i = 0; i < 5; i++) {
  if (i === 2) break;
  console.log(i); // 0, 1  ← stops before i reaches 2
}
```

---

## Nested loops and total iterations

Two nested loops of length `m` and `n` produce `m × n` total iterations.

```js
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    console.log(i, j); // 9 pairs total
  }
}
```

> **Q:** What does the following print?
>
> ```js
> const arr = [10, 20, 30];
> for (let i = 0; i < 3; i++) {
>   console.log(arr[i - i]);
> }
> ```
>
> <details>
> <summary>Show answer</summary>
>
> **A:** `10`, `10`, `10` — `i - i` is always `0`, so every iteration reads `arr[0]`.
> </details>

---

## Accumulator pattern

Accumulators collect a running total across iterations. The loop condition determines how many times the accumulator updates.

```js
let acc = 0;
for (let i = 0; i <= 2; i++) {
  acc += 2;
}
console.log(acc); // 6 — three iterations: i = 0, 1, 2
```

Count the iterations carefully. `i <= 2` runs when `i` is `0`, `1`, and `2` — that is three times, not two.

---

## Nested arrays

Access a nested array element with two bracket expressions: the first selects the outer array, the second selects within it.

```js
const names = [['Alice', 'Bob'], ['Carol', 'Dave'], ['Eve', 'Frank']];
console.log(names[2][1]); // 'Frank'
```

`names[2]` is `['Eve', 'Frank']`. Index `1` of that sub-array is `'Frank'`.

---

## Truncating with `arr.length`

Setting `arr.length` to a smaller value deletes every element from that index onward. The deletion is permanent and silent.

```js
const arr = [1, 2, 3, 4, 5, 6];
arr.length = 4;
console.log(arr); // [1, 2, 3, 4]
```

> **Pitfall**
> `parseInt("Hello123")` returns `NaN`. `parseInt` reads left-to-right and stops at the first character that is not a valid digit. When the string starts with a letter, no digit is found, so the result is `NaN`.

---

> **Takeaway:** Off-by-one errors in loop boundaries and unassigned sparse array slots are the two most common sources of `undefined` in JavaScript array code. Use `i < arr.length`, not `i <= arr.length`, and always assign every index you intend to read.
