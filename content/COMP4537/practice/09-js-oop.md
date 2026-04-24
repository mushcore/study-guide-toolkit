---
n: 9
id: js-oop
title: "Build a class hierarchy with inheritance"
lang: js
tags: [OOP, classes, extends, super, constructor]
source: "Slide 1, ISAQuiz4"
kind: code
---

## Prompt

Build a three-class hierarchy: `Animal` → `Dog` → `GuideDog`.

Requirements:
1. `Animal` stores `name` and `sound`. Its `speak()` method returns `"<name> says <sound>"`.
2. `Dog extends Animal`. Its constructor accepts `name` and `breed`. Pass `name` and `"woof"` to `super()`. Store `breed`.
3. `GuideDog extends Dog`. Its constructor accepts `name`, `breed`, and `owner`. Call `super()` then store `owner`. Add `guide()` returning `"<name> guides <owner>"`.
4. Instantiate a `GuideDog` and log both `speak()` and `guide()`.
5. Log `typeof []` and explain the result in a comment.

## Starter

```js
class Animal {
  constructor(name, sound) {
    // TODO: store name and sound
  }
  speak() {
    // TODO: return "<name> says <sound>"
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // TODO: call super with correct args, store breed
  }
}

class GuideDog extends Dog {
  constructor(name, breed, owner) {
    // TODO: call super, store owner
  }
  guide() {
    // TODO: return "<name> guides <owner>"
  }
}

// Instantiate and log speak() and guide()
// Also log typeof [] with a comment explaining the output
```

## Solution

```js
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  speak() {
    return `${this.name} says ${this.sound}`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "woof");  // must call super before using this
    this.breed = breed;
  }
}

class GuideDog extends Dog {
  constructor(name, breed, owner) {
    super(name, breed);   // calls Dog constructor, which calls Animal constructor
    this.owner = owner;
  }
  guide() {
    return `${this.name} guides ${this.owner}`;
  }
}

const buddy = new GuideDog("Buddy", "Labrador", "Maria");
console.log(buddy.speak());   // "Buddy says woof"
console.log(buddy.guide());   // "Buddy guides Maria"

console.log(typeof []);       // "object" — arrays are objects in JS; use Array.isArray() to detect arrays
```

## Why

`super()` must execute before any reference to `this` in a subclass constructor. The JavaScript engine does not allocate `this` for the subclass until the parent constructor runs. Skipping `super()` throws `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

The prototype chain for `buddy` is: `buddy → GuideDog.prototype → Dog.prototype → Animal.prototype → Object.prototype`. This is why `buddy.speak()` resolves even though `speak` is defined three levels up.

`typeof []` returns `"object"` because arrays are plain objects under the hood. The `typeof` operator has no array case. Use `Array.isArray(value)` whenever you need to confirm something is an array.
