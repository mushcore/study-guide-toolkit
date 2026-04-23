---
id: js-oop
title: "OOP in JavaScript: Deep Dive"
pillar: tech
priority: mid
source: "Slide 1, ISAQuiz4"
bloom_levels: [understand, apply]
related: [js-functions]
---

JavaScript's three object-creation syntaxes share an underlying prototype model but differ in readability, extensibility, and exam-trap density.

## Syntax Comparison

| Feature | Object Literal | Constructor Function | ES6 Class |
|---|---|---|---|
| Syntax | `{ key: value }` | `function F() { this.x = v; }` | `class F { constructor() {} }` |
| Instantiation | Direct assignment | `new F()` | `new F()` |
| Multiple instances | No (copy manually) | Yes | Yes |
| Inheritance | Manual prototype wiring | Manual prototype wiring | `extends` + `super()` |
| `new` required | No | Yes (silent bug if omitted) | Yes (throws without `new`) |
| Typical use | Config objects, one-offs | Pre-ES6 code, legacy APIs | Modern OOP |

## Inheritance Mechanics

`extends` sets up the prototype chain. `super()` delegates construction to the parent.

**Example — Student extends Person:**

```js
class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }
  greet() {
    return `${this.first} ${this.last}`;
  }
}

class Student extends Person {
  constructor(first, last, gpa) {
    super(first, last);  // parent constructor runs first
    this.gpa = gpa;      // now `this` is safe to use
  }
  info() {
    return `${this.greet()} — GPA: ${this.gpa}`;
  }
}

let s = new Student("Ada", "Lovelace", 4.0);
console.log(s.info());   // "Ada Lovelace — GPA: 4.0"
console.log(s instanceof Person);  // true
```

The `Student` prototype chain: `s → Student.prototype → Person.prototype → Object.prototype`.

## Composition vs Inheritance

**Example — Engine as a property of Car:**

```js
class Engine {
  constructor(cylinders) {
    this.cylinders = cylinders;
  }
  start() {
    return `${this.cylinders}-cylinder engine running`;
  }
}

class Car {
  constructor(model, cylinders) {
    this.model = model;
    this.engine = new Engine(cylinders);  // composition
  }
  drive() {
    return `${this.model}: ${this.engine.start()}`;
  }
}

let car = new Car("Civic", 4);
console.log(car.drive());  // "Civic: 4-cylinder engine running"
```

`Car` does not extend `Engine`. It *owns* one. Changing `Engine`'s internals does not break `Car`'s public API.

## Computed Property Access

Bracket notation resolves the variable first, then looks up the key:

**Example:**

```js
let profile = { name: "Elon", gpa: 3.9 };
let field = "gpa";

profile[field];        // 3.9 — uses the value of `field`
profile["gpa"];        // 3.9 — same result
profile.gpa;           // 3.9 — dot notation

let arr = ["name", "gpa", "id"];
profile[arr[1]];       // profile["gpa"] → 3.9
```

`profile[arr[1]]` evaluates `arr[1]` to `"gpa"`, then reads `profile["gpa"]`.

## `typeof` Behavior

```js
typeof {};          // "object"
typeof [];          // "object"  ← not "array"
typeof null;        // "object"  ← legacy bug in JS
typeof function(){}; // "function"
typeof 42;          // "number"
typeof "hi";        // "string"
typeof undefined;   // "undefined"
```

**Pitfall:** `typeof []` returns `"object"`. ISAQuiz4 tested this. To check for an array, use `Array.isArray(value)`. To distinguish `null` from a plain object, use `value === null`.

**Pitfall:** `obj.[moreNums]` is invalid syntax. The dot and bracket notations are mutually exclusive for a single property access. Write `obj.moreNums` or `obj[moreNums]` — never both together.
