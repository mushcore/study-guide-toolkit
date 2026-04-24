---
n: 13
id: tdd-moq-test
title: "xUnit test with Moq — Setup, .Object, Verify"
kind: code
lang: csharp
tags: [tdd, xunit, moq, fact, code-question]
source: "Lesson 10 (likely-pattern coding question for TDD bucket — 6 marks on final)"
---

## Prompt

Write an xUnit test method **`Insert_WithNewSequence_ShouldCallRepositoryInsertOnce`**. The test should:

1. Be marked **`[Fact]`** and follow the **AAA** pattern (Arrange, Act, Assert).
2. **Arrange** — create a `Mock<IRepository<SequenceNumber>>` and a new `SequenceNumber` instance.
3. **Act** — call `mockRepo.Object.Insert(newSequence)`.
4. **Assert** — use **`Verify`** with **`Times.Once`** to confirm `Insert` was called exactly once with **any** `SequenceNumber` argument.

Write only the method (assume `using Moq;` and `using Xunit;`).

## Starter

```cs
[Fact]
public void Insert_WithNewSequence_ShouldCallRepositoryInsertOnce()
{
    // Arrange
    // TODO: create mock + new SequenceNumber

    // Act
    // TODO: call Insert via .Object

    // Assert
    // TODO: Verify Insert called exactly once with any SequenceNumber
}
```

## Solution

```cs
[Fact]
public void Insert_WithNewSequence_ShouldCallRepositoryInsertOnce()
{
    // Arrange
    var mockRepo      = new Mock<IRepository<SequenceNumber>>();
    var newSequence   = new SequenceNumber { Id = 1, NextNumber = 42 };

    // Act
    mockRepo.Object.Insert(newSequence);

    // Assert
    mockRepo.Verify(
        r => r.Insert(It.IsAny<SequenceNumber>()),
        Times.Once);
}
```

## Why

The Moq pattern is **`new Mock<T>()`** → use **`.Object`** to pass the fake into code-under-test → **`.Verify(expression, Times.X)`** to assert calls happened. **`It.IsAny<T>()`** is the argument matcher meaning "any value of type T" — used in both `Setup` and `Verify`.

A common wrong approach is **`new BankService(_mockRepo)`** instead of **`new BankService(_mockRepo.Object)`**. The constructor expects the interface; the `Mock<T>` wrapper is not the interface. Compile error.

Another wrong approach is **swapping arguments** in `Assert.Equal` (`Assert.Equal(actual, expected)`). The convention is **expected first** — swapping makes failure messages lie ("Expected 5, but was 4" when you actually expected 4 and got 5).

A third wrong approach is making the mock a **`static`** field. Moq `.Setup(...)` calls accumulate on the mock object, so test order changes results. xUnit's per-test instance lifecycle (constructor runs before every test) gives you a fresh mock automatically when fields are non-static.
