---
n: 33
id: tdd-cycle
title: "TDD cycle — Red, Green, Refactor + three Laws of TDD"
hook: "Write the failing test first. Write the minimum code to pass. Refactor once green."
tags: [tdd, discipline, red-green-refactor]
module: "Testing Discipline"
source: "slides/TDD_xunit.pptx; notes/TDD_xunit_SCRIPT.docx; research-tdd.md"
bloom_levels: [remember, understand, apply]
related: [xunit-attributes-assertions, xunit-fixtures-lifecycle]
---

## Three phases on repeat

Test-Driven Development builds features in a tight loop:

1. **Red** — Write a failing test that describes the next tiny requirement. The feature doesn't exist yet, so the test fails immediately. A failing test on a feature you haven't written is confirmation that your testing infrastructure works.
2. **Green** — Write the *minimum* production code that makes the test pass. No extras, no "while I'm here" improvements. If the ugliest shortcut would pass the test, that's the answer — refactoring comes next.
3. **Refactor** — With the test green, clean up the code. Rename variables, extract helpers, remove duplication. Run the test after every change. You never refactor with a failing test on the table.

Repeat. Every new requirement is a new Red-Green-Refactor cycle.

```text
   ┌──► Red  ─► Green ─► Refactor ──┐
   │                                │
   └─────────── repeat ─────────────┘
```

## Why write the test first

Writing a test first forces you to decide the public shape before the implementation: what's the class called, what's the method signature, what types do inputs and outputs take? These decisions are expensive to change once production code exists. By making the decision through a test, you get interface-level design for free.

It also guarantees the test can actually fail. A test written after the code often passes on the first run — but you haven't proven the test would catch a regression. The Red phase removes that ambiguity.

## Robert C. Martin's Three Laws

1. **You are not allowed to write any production code unless it is to make a failing test pass.**
2. **You are not allowed to write any more of a unit test than is sufficient to make it fail** (compilation failures count).
3. **You are not allowed to write any more production code than is sufficient to make the currently failing test pass.**

The three laws sound absolute because they are. Strict TDD practitioners follow them to the letter. Looser interpretations treat them as directional guidance — the spirit is "test-first, minimum-viable, continuously green." Either way, the three laws distinguish TDD from "I write tests, just not first."

## The FizzBuzz worked example

FizzBuzz: given an integer, return `"Fizz"` if divisible by 3, `"Buzz"` if divisible by 5, `"FizzBuzz"` if divisible by both, otherwise the integer as a string.

Following TDD strictly, here's the first cycle:

```cs
// Red: write the failing test.
[Fact]
public void Given2Result2()
{
    var fb = new FizzBuzz();
    Assert.Equal("2", fb.GetResult(2));
}
```

Compile error: no `FizzBuzz` class. That's a "test failure" by Law 2. Create the class + method with the smallest possible body:

```cs
// Green: minimum code to make the test pass.
public class FizzBuzz
{
    public string GetResult(int n) => n.ToString();
}
```

Test passes. No refactor needed yet.

```cs
// Red: next test.
[Fact]
public void Given3ResultFizz()
{
    var fb = new FizzBuzz();
    Assert.Equal("Fizz", fb.GetResult(3));
}
```

Test fails — `GetResult(3)` returns `"3"`, not `"Fizz"`. Update:

```cs
// Green: minimum to pass BOTH tests.
public string GetResult(int n)
    => n % 3 == 0 ? "Fizz" : n.ToString();
```

Both tests green. Continue the cycle: add a test for 5 → Buzz, then 15 → FizzBuzz, then refactor the if/else pile into a clean form when duplication emerges.

The point isn't that TDD delivers clever code. It's that every line of production code exists because a failing test demanded it.

## When TDD hurts

Not every scenario benefits from test-first. Exploratory spikes ("does this library even support what I need?") move faster when you prototype first and test-harness the viable result. UI tweaks, prototyping, and research code are commonly written without TDD — the test-first discipline gets in the way when the goal is learning.

For production business logic, algorithms, and anything where a regression is expensive, TDD shines.

> **Q:** You're adding a `Discount.Calculate(order)` method. You write `Discount.Calculate` first (eyeballing the logic), then write a test. The test passes on the first run. Which TDD phase did you skip and what's the risk?
> **A:** You skipped the **Red** phase. You never proved the test can fail — it may be tautological (checking something the code trivially satisfies) or have a wrong assertion. The fix next time: write the test with a specific expected value BEFORE writing any `Discount.Calculate` body. Watch it fail; then implement.

> **Example**
> A full one-cycle demo of TDD:
>
> ```cs
> // 1. Red — test fails; Calculator doesn't exist.
> [Fact]
> public void Add_TwoPlusTwo_Returns4()
> {
>     Assert.Equal(4, new Calculator().Add(2, 2));
> }
>
> // 2. Green — minimum code to pass.
> public class Calculator { public int Add(int a, int b) => a + b; }
>
> // 3. Refactor — nothing to clean up yet. Move to next Red.
> ```

> **Pitfall**
> "I'll write the test right after I write the code" is not TDD. Retrofit tests often pass on first run without you ever seeing them fail, which means the test might be wrong and you'd never know. The three Laws exist specifically to prevent this class of false-confidence. Strict TDD means committing to Red → Green → Refactor, in that order, every time.

> **Takeaway**
> TDD is Red → Green → Refactor: write a failing test, write the minimum code to pass it, then clean up without breaking it. Robert Martin's three Laws enforce test-first discipline: no production code without a failing test; no more test than needed to fail; no more production code than needed to pass. The discipline pays off in design quality and regression safety; it's overkill for spikes and prototypes.
