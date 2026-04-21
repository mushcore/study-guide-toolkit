---
"n": 7
id: 4870-lesson-tdd-xunit-red-green-refactor
title: "TDD / xUnit: red, green, refactor"
hook: Write the test first. Watch it fail. Make it pass. Clean it up.
tags:
  - tdd
module: Testing
---

**TDD** = Test-Driven Development. Robert Martin's three laws: (1) no code without a failing test, (2) no more test than what fails, (3) no more code than what makes it pass.

```cs
using Xunit;
public class CalculatorTests
{
    [Fact]
    public void Add_TwoPositives_ReturnsSum()
    {
        // Arrange
        var calc = new Calculator();
        // Act
        var result = calc.Add(2, 3);
        // Assert
        Assert.Equal(5, result); // expected, actual — ORDER MATTERS
    }

    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(0, 0, 0)]
    [InlineData(-1, 1, 0)]
    public void Add_Various(int a, int b, int expected)
    {
        var calc = new Calculator();
        Assert.Equal(expected, calc.Add(a, b));
    }
}
```

> **Analogy**
>  \[Fact\] = one photograph. \[Theory\] + \[InlineData\] = same photo shoot, different subjects. The \[InlineData\] rows ARE the test cases.

**Setup:** Use the test class's constructor. **Teardown:** Implement `IDisposable`. **Shared state:** `IClassFixture<T>`.

**Assert methods:** Equal, True, False, Null, NotNull, Throws<T>, ThrowsAsync<T>, Contains, Empty, InRange, IsType<T>.

#### The TDD cycle

flowchart LR
  R\["RED
write failing test"\] --> G\["GREEN
make it pass
smallest change"\]
  G --> F\["REFACTOR
clean up, stay green"\]
  F --> R
      

> **Warning**
> **Common mistakes (sourced from TDD\_xunit.pptx slide warnings):**
>
> -   **Swapping the Assert.Equal arguments** — `Assert.Equal(actual, expected)` compiles and passes, but on failure the message says "Expected: <your actual>, Actual: <your expected>" which sends you debugging in the wrong direction.
> -   **Using \[Fact\] with parameters** — xUnit will refuse to run it. Parametrized tests need `[Theory]` paired with at least one `[InlineData(...)]`, `[MemberData(...)]`, or `[ClassData(typeof(X))]`.
> -   **Expecting \[SetUp\] / \[TestInitialize\]** — xUnit has neither. Setup goes in the class constructor; teardown goes in `Dispose()` (implement `IDisposable`).
> -   **Testing async with `Assert.Throws`** — for async code use `await Assert.ThrowsAsync<T>(...)`. The sync variant returns before the awaited exception surfaces and silently passes.

> **Q:** **Checkpoint —** You have three test methods that need the same in-memory DbContext. Should each method `new` its own, use a constructor, or use `IClassFixture<T>`? Explain.
> **A:** Use `IClassFixture<DbFixture>` when the setup is *expensive* and the tests do not write to it. xUnit creates the fixture once per class and injects it via the constructor, so all 3 methods share one instance. Use a plain constructor when setup is *cheap* or tests mutate state — constructor runs fresh per method, which keeps tests isolated.

> **Note**
> **Takeaway —** \[Fact\]=no args, \[Theory\]=with data. Assert.Equal(expected, actual). Constructor setup, IDisposable teardown.
