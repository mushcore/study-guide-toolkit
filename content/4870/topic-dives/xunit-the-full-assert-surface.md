---
id: 4870-topic-xunit-the-full-assert-surface
title: xUnit — the full Assert surface
pillar: tech
priority: high
chapter: W08
tags:
  - tdd
---

### Full example — AAA + Theory + exception + async

```cs
public class CalculatorTests : IDisposable {
    private readonly Calculator _calc;

    public CalculatorTests() {   // setup
        _calc = new Calculator();
    }

    public void Dispose() { }    // teardown

    [Fact]
    public void Add_TwoPositives_ReturnsSum() {
        var r = _calc.Add(2, 3);
        Assert.Equal(5, r);
    }

    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(0, 0, 0)]
    [InlineData(-1, 1, 0)]
    public void Add_Various(int a, int b, int expected) {
        Assert.Equal(expected, _calc.Add(a, b));
    }

    [Fact]
    public void Divide_ByZero_Throws() {
        var ex = Assert.Throws<DivideByZeroException>(() => _calc.Divide(5, 0));
        Assert.Contains("zero", ex.Message);
    }

    [Fact]
    public async Task LongTask_Completes() {
        await Assert.ThrowsAsync<TimeoutException>(async () => await _calc.SlowAsync());
    }
}
```

### Asserts in the course

`Equal, NotEqual, True, False, Null, NotNull, Same, NotSame, Throws<T>, ThrowsAsync<T>, Contains, DoesNotContain, Empty, NotEmpty, InRange, IsType<T>, IsAssignableFrom<T>, Collection`

### Test data sources

`[InlineData(...)]` — literal args. `[MemberData(nameof(Data))]` — reference a static `IEnumerable<object[]>` property. `[ClassData(typeof(X))]` — class implementing `IEnumerable<object[]>`.

### Shared fixtures

`IClassFixture<TFx>` — one fixture per test class. `ICollectionFixture<TFx>` + `[Collection("Name")]` — shared across classes.
