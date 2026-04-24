---
n: 11
id: js-arrays-loops
title: "Predict loop and array output"
lang: js
tags: [arrays, for-loop, iteration, index, break]
source: "ISAQuiz2"
kind: code
---

## Prompt

Predict the exact console output for each snippet below. Write your answers before running the code. Check your boundary conditions, break placement, and index arithmetic carefully.

**Snippet A**
```js
const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
console.log(arr[arr.length / 2]);
```

**Snippet B**
```js
let arr = [];
arr[1] = 1234;
console.log(arr[0]);
console.log(arr[1]);
```

**Snippet C**
```js
for (let i = 0; i < 5; i++) {
  if (i === 2) break;
  console.log(i);
}
```

**Snippet D**
```js
const arr = [10, 20, 30];
for (let i = 0; i < 3; i++) {
  console.log(arr[i - i]);
}
```

**Snippet E**
```js
const names = [['Alice', 'Bob'], ['Carol', 'Dave'], ['Eve', 'Frank']];
console.log(names[2][1]);
```

**Snippet F**
```js
const arr = [1, 2, 3, 4, 5, 6];
arr.length = 4;
console.log(arr.length);
console.log(arr[4]);
```

## Starter

```js
// Work through each snippet — write your predicted output as comments,
// then verify by running the code.

// Snippet A — arr.length / 2 as an index
const arrA = ['a', 'b', 'c', 'd', 'e', 'f'];
// Your prediction: arr[?] = ?
console.log(arrA[arrA.length / 2]);

// Snippet B — sparse array
let arrB = [];
arrB[1] = 1234;
// Your prediction for arrB[0]: ?
// Your prediction for arrB[1]: ?
console.log(arrB[0]);
console.log(arrB[1]);

// Snippet C — break placement
for (let i = 0; i < 5; i++) {
  if (i === 2) break;
  console.log(i);
}

// Snippet D — i - i index expression
const arrD = [10, 20, 30];
for (let i = 0; i < 3; i++) {
  console.log(arrD[i - i]);
}

// Snippet E — nested array access
const names = [['Alice', 'Bob'], ['Carol', 'Dave'], ['Eve', 'Frank']];
console.log(names[2][1]);

// Snippet F — length truncation
const arrF = [1, 2, 3, 4, 5, 6];
arrF.length = 4;
console.log(arrF.length);
console.log(arrF[4]);
```

## Solution

```js
// Snippet A
const arrA = ['a', 'b', 'c', 'd', 'e', 'f'];
console.log(arrA[arrA.length / 2]); // 'd'
// arrA.length = 6; 6/2 = 3; arrA[3] = 'd'

// Snippet B
let arrB = [];
arrB[1] = 1234;
console.log(arrB[0]); // undefined
console.log(arrB[1]); // 1234
// Slot 0 was never assigned — it is a sparse hole that reads as undefined.

// Snippet C
for (let i = 0; i < 5; i++) {
  if (i === 2) break;
  console.log(i);
}
// Output: 0, 1
// When i === 2, break fires before console.log runs. Only 0 and 1 are printed.

// Snippet D
const arrD = [10, 20, 30];
for (let i = 0; i < 3; i++) {
  console.log(arrD[i - i]);
}
// Output: 10, 10, 10
// i - i evaluates to 0 for every i. Every iteration reads arrD[0] = 10.

// Snippet E
const names = [['Alice', 'Bob'], ['Carol', 'Dave'], ['Eve', 'Frank']];
console.log(names[2][1]); // 'Frank'
// names[2] = ['Eve', 'Frank']; index 1 of that sub-array = 'Frank'.

// Snippet F
const arrF = [1, 2, 3, 4, 5, 6];
arrF.length = 4;
console.log(arrF.length); // 4
console.log(arrF[4]);     // undefined
// Setting .length = 4 deletes indices 4 and 5. arrF[4] no longer exists.
```

## Why

**Snippet A:** `arr.length / 2` gives the integer index of the element one past the midpoint in a 6-element array. Because JavaScript arrays are zero-indexed, index `3` is the fourth element.

**Snippet B:** Assigning to `arr[1]` without assigning `arr[0]` creates a sparse array. The engine sets `arr.length` to `2`, but slot `0` is a hole. Reading a hole returns `undefined`.

**Snippet C:** `break` exits the current loop iteration entirely — the rest of the loop body does not run for that `i`. Because the `break` check appears before `console.log`, the value `2` is never printed.

**Snippet D:** `i - i` always equals `0` regardless of `i`. The index expression never advances, so the same element (`arr[0]`) prints on every iteration. This is a common distractor in quizzes.

**Snippet E:** Two bracket expressions chain left-to-right. `names[2]` selects the third sub-array. `[1]` then selects the second element of that sub-array.

**Snippet F:** Reducing `arr.length` permanently deletes all elements at indices equal to or greater than the new length. Reading a deleted index returns `undefined`, not an error. This mirrors the sparse-array behavior from Snippet B.
