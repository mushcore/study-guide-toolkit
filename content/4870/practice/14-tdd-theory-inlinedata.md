---
n: 14
id: tdd-theory-inlinedata
title: "Parameterized xUnit test with [Theory] + [InlineData]"
kind: code
lang: csharp
tags: [tdd, xunit, theory, inlinedata, code-question]
source: "Lesson 10 (likely-pattern coding question for TDD bucket — 6 marks on final)"
---

## Prompt

Write a parameterized xUnit test method **`Add_VariousInputs_ReturnsExpectedSum`** for a `Calculator.Add(int, int)` method. The test should:

1. Be marked **`[Theory]`** with three **`[InlineData]`** rows: `(2, 3, 5)`, `(0, 0, 0)`, `(-4, 4, 0)`.
2. Take three int parameters: `a`, `b`, `expected`.
3. Construct a `Calculator`, call `Add(a, b)`, and assert the result equals `expected` using **`Assert.Equal(expected, actual)`** — expected FIRST.

Write only the method.

## Starter

```cs
[Theory]
// TODO: three InlineData rows
public void Add_VariousInputs_ReturnsExpectedSum(int a, int b, int expected)
{
    // Arrange + Act + Assert
}
```

## Solution

```cs
[Theory]
[InlineData(2, 3, 5)]
[InlineData(0, 0, 0)]
[InlineData(-4, 4, 0)]
public void Add_VariousInputs_ReturnsExpectedSum(int a, int b, int expected)
{
    // Arrange
    var calc = new Calculator();

    // Act
    int result = calc.Add(a, b);

    // Assert
    Assert.Equal(expected, result);
}
```

## Why

**`[Theory]`** marks a parameterized test — xUnit runs it **once per `[InlineData]` row**, with the row's values bound to the method parameters in declared order. Each run shows up as a separate test result. **`[Fact]`** is for parameterless single-run tests.

`Assert.Equal(expected, actual)` — **expected FIRST**. Reverse the order and the failure message reports the wrong value as "expected." The compiler doesn't enforce the order; the convention does.

A common wrong approach is using `[Fact]` and looping inside the test body. That makes the loop count as a single test result — if iteration #2 fails, the whole test fails with no clean way to know which row was the culprit. `[Theory]` reports each row separately.

Another wrong approach is misordering `[InlineData(2, 3, 5)]` as `[InlineData(5, 2, 3)]` — the values bind to method parameters by **position**, not by name. Match the parameter order in the method signature.
