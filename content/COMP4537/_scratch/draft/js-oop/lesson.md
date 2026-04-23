---
n: 10
id: js-oop
title: "OOP in JavaScript: Classes, Inheritance, and Composition"
hook: "Three syntaxes create objects in JS — only one uses a blueprint you can extend."
tags: [OOP, classes, extends, super, composition]
module: "JavaScript Foundations and Web Basics"
source: "Slide 1, ISAQuiz4"
bloom_levels: [remember, understand, apply]
related: [js-functions, js-scope-hoisting]
---

JavaScript gives you three ways to create objects. Each has distinct syntax, and exams test whether you recognise which is which.

## Object Literal

The simplest form assigns key-value pairs directly inside braces:

```js
let sandwich = { bread: "white", filling: "turkey" };
```

No constructor, no `new`. You get exactly one object.

## Constructor Function

A constructor function uses `this` to attach properties, and `new` to create instances:

```js
function Person(first, last) {
  this.first = first;
  this.last = last;
}
let p = new Person("Elon", "Musk");
```

Call it without `new` and `this` refers to the global object — a silent bug.

## ES6 Class

A class wraps the constructor pattern in explicit syntax:

```js
class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }
  greet() {
    return `Hello, ${this.first}`;
  }
}
let p = new Person("Elon", "Musk");
```

The `constructor` method runs automatically when you call `new`.

## Inheritance with `extends` and `super`

A subclass inherits all methods from its parent and can add its own:

```js
class Student extends Person {
  constructor(first, last, gpa) {
    super(first, last);   // must come before any use of `this`
    this.gpa = gpa;
  }
}
let s = new Student("Ada", "Lovelace", 4.0);
```

`super(first, last)` calls the parent constructor. Omitting it throws a `ReferenceError` before `this` is accessible.

## Property Access

Two notations reach the same property:

```js
let arr = [{ name: "Ada", gpa: 4.0 }];
arr[0]["gpa"];  // bracket notation
arr[0].gpa;     // dot notation — both return 4.0
```

Use bracket notation when the key is stored in a variable:

```js
let key = "gpa";
arr[0][key];    // resolves to arr[0]["gpa"]
```

`obj[arr[2]]` uses the *value* of `arr[2]` as the property key — not the index itself.

> **Q:** What does `typeof []` return?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** `"object"`. Arrays are objects in JavaScript. `typeof` cannot distinguish them from plain objects.
> </details>

> **Q:** Why does `obj.[moreNums]` throw a syntax error?
>
> <details>
> <summary>Show answer</summary>
>
> **A:** You cannot combine dot notation with bracket notation. Use either `obj.moreNums` or `obj[moreNums]`.
> </details>

## Composition

Composition stores objects as properties of another object instead of using inheritance:

```js
class Engine {
  start() { return "running"; }
}
class Car {
  constructor() {
    this.engine = new Engine();  // Car *has* an Engine
  }
}
let car = new Car();
car.engine.start();
```

Prefer composition when the relationship is "has-a" rather than "is-a".

> **Pitfall:** `typeof []` returns `"object"`, not `"array"`. Quiz 4 tested this directly. Always use `Array.isArray(value)` when you need to confirm something is an array.

> **Takeaway:** Object Literal creates one object inline. Constructor and Class both use `new` and `this`, but Class syntax makes inheritance explicit via `extends` and enforces `super()` before `this`.
