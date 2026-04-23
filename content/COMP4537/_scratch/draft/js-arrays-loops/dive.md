---
id: js-arrays-loops
title: "Arrays and Loop Mechanics — Deep Dive"
pillar: tech
priority: low
source: "ISAQuiz2"
bloom_levels: [understand, apply]
related: [js-scope-hoisting, js-functions]
---

JavaScript arrays are integer-keyed objects. Writing to a non-contiguous index does not fill the skipped slots — those slots exist as holes and read back as `undefined`.

---

**Example — sparse array hole**

```js
let arr = [];
arr[1] = 1234;
console.log(arr.length); // 2
console.log(arr[0]);     // undefined — slot 0 is a hole
console.log(arr[1]);     // 1234
```

Slot `0` was never assigned. The engine reports `arr.length` as `2` because the highest index is `1`, but reading index `0` returns `undefined`.

---

**Example — `arr[i - i]` always reads index 0**

```js
const arr = [10, 20, 30];
for (let i = 0; i < 3; i++) {
  console.log(arr[i - i]); // i - i === 0 every iteration
}
// Output: 10, 10, 10
```

The expression `i - i` simplifies to `0` for every value of `i`. The loop always reads `arr[0]`, not a moving index.

---

**Example — `arr.length` truncation**

```js
const arr = [1, 2, 3, 4, 5, 6];
arr.length = 4;
console.log(arr); // [1, 2, 3, 4]
```

Reducing `arr.length` deletes every element at index `>= newLength`. The operation is irreversible without re-adding the values.

---

**Pitfall — off-by-one with `<=`**

```js
const arr = [1, 2, 3];
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]);
  // i = 3 → arr[3] → undefined (out of bounds)
}
```

`arr.length` is `3`. Valid indices are `0`, `1`, `2`. When `i === 3`, the slot `arr[3]` does not exist. Use `i < arr.length` to stop at the last valid index.

---

**Pitfall — `parseInt` with non-digit-leading strings**

```js
console.log(parseInt("Hello123")); // NaN
console.log(parseInt("123Hello")); // 123 — stops at 'H'
```

`parseInt` parses left-to-right. If the first character is not a valid digit (or `-`/`+`), it returns `NaN` immediately. If valid digits come first, it stops at the first invalid character.

---

## Common array access patterns

| Pattern | Expression | Result (arr = `[10,20,30,40]`) |
|---|---|---|
| First element | `arr[0]` | `10` |
| Last element | `arr[arr.length - 1]` | `40` |
| Second-to-last | `arr[arr.length - 2]` | `30` |
| Middle element (even-length arr, 6 items) | `arr[arr.length / 2]` | `arr[3]` = 4th item |
| Out-of-bounds | `arr[arr.length]` | `undefined` |
| Unassigned sparse slot | `arr[0]` when only `arr[1]` set | `undefined` |
| Nested array | `matrix[row][col]` | depends on row/col |
| Truncate | `arr.length = n` | removes elements from index `n` onward |
