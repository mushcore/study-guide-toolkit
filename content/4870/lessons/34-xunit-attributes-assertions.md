---
n: 34
id: xunit-attributes-assertions
title: "xUnit — [Fact], [Theory], [InlineData], Assert.Equal, AAA"
hook: "One attribute per test method, one Assert per logical check, expected-actual order matters."
tags: [tdd, xunit, assert]
module: "Testing Discipline"
source: "slides/TDD_xunit.pptx; notes/TDD_xunit_SCRIPT.docx; research-tdd.md"
bloom_levels: [remember, apply]
related: [tdd-cycle, xunit-fixtures-lifecycle]
---

## `[Fact]` for single-scenario tests

xUnit's most common attribute. A `[Fact]` method has no parameters and runs once:

```cs
using Xunit;

public class CalculatorTests
{
    [Fact]
    public void Add_TwoPlusTwo_ReturnsFour()
    {
        var calc = new Calculator();
        int result = calc.Add(2, 2);
        Assert.Equal(4, result);
    }
}
```

The test class itself needs no attribute in xUnit — the framework discovers any class containing test methods. Each `[Fact]` produces one entry in the test-runner output.

## `[Theory]` + `[InlineData]` for parameterized tests

When one conceptual test has multiple input sets, use `[Theory]` + one or more data attributes:

```cs
[Theory]
[InlineData(1, 2, 3)]
[InlineData(0, 0, 0)]
[InlineData(-1, 1, 0)]
[InlineData(int.MaxValue, 0, int.MaxValue)]
public void Add_Variants_ReturnsCorrectSum(int a, int b, int expected)
{
    var calc = new Calculator();
    Assert.Equal(expected, calc.Add(a, b));
}
```

Each `[InlineData(...)]` triggers one execution. Four data rows = four runs of the same method body. Each run shows up separately in the test report, so a single failing row doesn't obscure the passing rows.

For larger or more complex data, use `[MemberData(nameof(MethodReturningIEnumerable))]` or `[ClassData(typeof(DataProviderClass))]`. `[InlineData]` is fine for small cases; member/class data is better once the parameters need computation or exceed a few lines.

## Arrange / Act / Assert (AAA)

Every test has three sections — by convention arranged top-to-bottom with or without comments:

```cs
[Fact]
public void Add_NegativeAndPositive_ReturnsSum()
{
    // Arrange
    var calc = new Calculator();

    // Act
    int result = calc.Add(-5, 10);

    // Assert
    Assert.Equal(5, result);
}
```

**Arrange** sets up the inputs and any dependencies (mocks, doubles, fixtures). **Act** performs the single operation under test. **Assert** verifies the result. Keeping them separate makes tests readable and makes failures easy to diagnose — you can tell whether arrangement, action, or expectation went wrong just by glancing at which block the stack trace points to.

One test, one conceptual assertion. If you find yourself writing three different `Assert.Equal` calls checking unrelated properties, consider splitting into three tests.

## Assertion family

xUnit's `Assert` class exposes matchers for the common cases:

| Assertion | Purpose |
|---|---|
| `Assert.Equal(expected, actual)` | Value equality. Works for primitives, strings, collections (content-wise). |
| `Assert.NotEqual(expected, actual)` | The opposite. |
| `Assert.True(bool)` / `Assert.False(bool)` | Boolean checks. |
| `Assert.Null(object)` / `Assert.NotNull(object)` | Null checks. |
| `Assert.Throws<T>(() => action())` | Expects the lambda to throw `T`. Returns the thrown instance for further assertions. |
| `Assert.InRange(value, low, high)` | Value between two bounds. |
| `Assert.Contains(expected, collection)` | Membership. |
| `Assert.IsType<T>(object)` / `Assert.IsAssignableFrom<T>(object)` | Exact type / subtype check. |
| `Assert.Same(expected, actual)` | Reference equality. Different from `Equal`. |

The first two arguments of `Assert.Equal(expected, actual)` matter. Expected first, actual second. Reversing produces failure messages like "Expected 5, Actual 4" that lie — you'll chase the wrong value. The compiler doesn't enforce the order; your discipline does.

## Exception testing

```cs
[Fact]
public void Divide_ByZero_Throws()
{
    var calc = new Calculator();
    var ex = Assert.Throws<DivideByZeroException>(() => calc.Divide(10, 0));
    Assert.Contains("zero", ex.Message);
}
```

`Assert.Throws<T>` returns the exception instance, letting you assert on its `Message` or custom properties. The test fails if the lambda doesn't throw `T` (or throws a more-derived type — use `Assert.ThrowsAny<T>` when derived exceptions are acceptable).

> **Q:** A coworker's failing test reports "Expected: 4, but was: 5". You look at the code and see `calc.Add(2, 2)` should return 4. Clicking through, the `Assert.Equal` call is `Assert.Equal(actualResult, 4);`. What's the subtle problem and what does the message really mean?
> **A:** The arguments are swapped. `Assert.Equal(expected, actual)` is the correct order; this call has `actualResult` as the first arg and `4` as the second. The "Expected: 4" in the failure message is really the actual value of `actualResult`, and "but was: 5" is really the expected value 4 — so the failure message is misleading. The underlying math is correct; the test infrastructure is lying because of the argument swap. Fix: always put expected first.

> **Example**
> Combining `[Theory]`, exception assertions, and AAA in one test file:
>
> ```cs
> public class RoleManagerTests
> {
>     [Theory]
>     [InlineData(null)]
>     [InlineData("")]
>     [InlineData("   ")]
>     public void Assign_EmptyRoleName_Throws(string roleName)
>     {
>         // Arrange
>         var mgr = new RoleManager();
>
>         // Act + Assert (exception cases: act and assert fold together)
>         Assert.Throws<ArgumentException>(() => mgr.Assign("alice", roleName));
>     }
> }
> ```
>
> Three runs, one method body. The exception case is the canonical example where Act and Assert are one call (`Assert.Throws(...)`).

> **Pitfall**
> `Assert.Equal(actual, expected)` with arguments swapped compiles fine and fails only on the test actually failing — at which point the error message blames the wrong value. The convention (expected first) is consistent across MSTest, NUnit, and xUnit, so cross-framework muscle memory applies. Code-review tests for argument order every time.

> **Takeaway**
> `[Fact]` for one-run tests, `[Theory]` + `[InlineData]` for parameterized tests. Arrange-Act-Assert inside every test body. `Assert.Equal(expected, actual)` — expected always first. Exception tests use `Assert.Throws<T>(() => action())`, which returns the exception for further assertions. The compiler does not check argument order; your discipline does.
