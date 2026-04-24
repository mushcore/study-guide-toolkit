---
n: 17
id: tdd
title: "TDD — Red/Green/Refactor, xUnit, Moq"
hook: "Write failing test first. Minimum code to pass. Refactor green. Moq for dependencies."
tags: [tdd, xunit, moq]
module: "Testing Discipline"
source: "materials/project/GoodBooks/test/GoodBooks.BackendTests/Financial/AccountTests.cs + JournalEntryTests.cs; GoodBooks.ServicesTests/BaseServiceTests.cs + Fixtures/MockRepositoryFixtures.cs"
bloom_levels: [remember, understand, apply]
related: []
---

## TDD cycle

1. **Red** — write failing test describing next requirement. Confirms test infrastructure works.
2. **Green** — write MINIMUM code to pass. No extras.
3. **Refactor** — clean up while tests stay green.

Repeat. Every line of production code exists because a failing test demanded it.

## Three Laws (Robert Martin)

1. No production code without a failing test.
2. No more test than needed to fail (compile errors count).
3. No more production code than needed to pass.

## xUnit attributes

**`[Fact]`** — one-run test, no parameters:

```cs
[Fact]
public void ChildAccounts_DefaultsToEmptyList()
{
    var account = new Account();

    Assert.NotNull(account.ChildAccounts);
    Assert.Empty(account.ChildAccounts);
}
```

**`[Theory]` + `[InlineData]`** — parameterized:

```cs
[Theory]
[InlineData(SequenceNumberTypes.JournalEntry)]
[InlineData(SequenceNumberTypes.PurchaseOrder)]
[InlineData(SequenceNumberTypes.SalesOrder)]
public void WithDifferentTypes_ShouldHandleAllTypes(SequenceNumberTypes type)
{
    // ... one run per InlineData row
}
```

Each `[InlineData(...)]` = one execution. Shows separately in test report.

## Arrange / Act / Assert

```cs
[Fact]
public void TotalBalance_SumsAllDescendantBalances()
{
    // Arrange
    var account = new Account
    {
        Balance = 100m,     // root ignored by DTO logic
        ChildAccounts =
        {
            new Account { Balance = 50m },
            new Account
            {
                Balance = 25m,
                ChildAccounts =
                {
                    new Account { Balance = 10m },
                    new Account { Balance = 5m }
                }
            }
        }
    };

    // Act (property access in this case)

    // Assert
    Assert.Equal(90m, account.TotalBalance);
}
```

One test, one conceptual assertion. Three Assert calls on unrelated properties → split into three tests.

## Assertions (demos use)

| Assertion | Purpose |
|---|---|
| `Assert.Equal(expected, actual)` | Value equality (primitives, strings, collections) — **expected FIRST** |
| `Assert.NotNull(obj)` / `Assert.Null(obj)` | Null checks |
| `Assert.Empty(collection)` / `Assert.NotEmpty(...)` | Collection size |
| `Assert.Single(collection)` | Exactly one element |

Expected-first convention: `Assert.Equal(4, calc.Add(2, 2))`. Swapped → "Expected: 5, but was: 4" messages lie.

## Lifecycle — constructor per test

xUnit creates a FRESH test-class instance per `[Fact]` or `[Theory]` run:

- **Constructor** runs before each test (think `[SetUp]` without attribute)
- **`IDisposable.Dispose()`** runs after each test (think `[TearDown]`)
- No test sees state from another

```cs
public class BaseServiceTests
{
    private readonly Mock<IRepository<SequenceNumber>> _mockSequenceNumberRepo;
    private readonly Mock<IRepository<Bank>> _mockBankRepo;

    public BaseServiceTests()                     // fresh mocks per test
    {
        _mockSequenceNumberRepo = new Mock<IRepository<SequenceNumber>>();
        _mockBankRepo = new Mock<IRepository<Bank>>();
    }

    // [Fact] tests use _mockSequenceNumberRepo and _mockBankRepo
}
```

## Moq — three patterns from GoodBooks

### `Setup(...).Returns(...)` — stub return value

```cs
var banks = new List<Bank>
{
    new Bank { Id = 1, BankName = "Bank A" },
    new Bank { Id = 2, BankName = "Bank B" }
};

_mockBankRepo.Setup(r => r.Table).Returns(banks.AsQueryable());

// Use the fake
var result = _mockBankRepo.Object.Table;

Assert.Equal(2, result.Count());
```

### `Setup(...).Callback<T>(...)` — record side effects

```cs
var sequenceList = new List<SequenceNumber>();

_mockSequenceNumberRepo
    .Setup(r => r.Insert(It.IsAny<SequenceNumber>()))
    .Callback<SequenceNumber>(s => sequenceList.Add(s));

_mockSequenceNumberRepo.Object.Insert(newSequence);

Assert.Single(sequenceList);
```

`It.IsAny<T>()` matches any value. `Callback<T>(Action<T>)` captures what the SUT passed in.

### `Verify(..., Times.Once)` — assert a call happened

```cs
_mockSequenceNumberRepo.Object.Update(existingSequence);

_mockSequenceNumberRepo.Verify(
    r => r.Update(It.IsAny<SequenceNumber>()),
    Times.Once);
```

`Times.Once`, `Times.Never`, `Times.Exactly(3)`. Verify fails test if expression wasn't satisfied.

## Static factory for mock setup — MockRepositoryFixtures

GoodBooks uses static factories (NOT `IClassFixture<T>`):

```cs
public static class MockRepositoryFixtures
{
    public static Mock<IRepository<T>> CreateEmptyRepository<T>() where T : BaseEntity
    {
        var mock = new Mock<IRepository<T>>();
        mock.Setup(r => r.Table).Returns(new List<T>().AsQueryable());
        return mock;
    }

    public static Mock<IRepository<T>> CreateRepositoryWithData<T>(List<T> data)
        where T : BaseEntity
    {
        var mock = new Mock<IRepository<T>>();
        mock.Setup(r => r.Table).Returns(data.AsQueryable());
        return mock;
    }
}
```

Tests call `MockRepositoryFixtures.CreateEmptyRepository<Bank>()` — cuts boilerplate, still fresh mock per test.

## Full example — mock + arrange/act/assert + verify

```cs
[Fact]
public void SequenceNumberRepository_WithExistingSequence_ShouldUpdate()
{
    // Arrange
    var existingSequence = new SequenceNumber { Id = 1, NextNumber = 42 };
    var sequenceList = new List<SequenceNumber> { existingSequence };

    _mockSequenceNumberRepo.Setup(r => r.Table).Returns(() => sequenceList.AsQueryable());
    _mockSequenceNumberRepo
        .Setup(r => r.Update(It.IsAny<SequenceNumber>()))
        .Callback<SequenceNumber>(s => {
            var existing = sequenceList.FirstOrDefault(x => x.Id == s.Id);
            if (existing != null) existing.NextNumber = s.NextNumber;
        });

    // Act
    existingSequence.NextNumber = 43;
    _mockSequenceNumberRepo.Object.Update(existingSequence);

    // Assert
    Assert.Equal(43, existingSequence.NextNumber);
    _mockSequenceNumberRepo.Verify(
        r => r.Update(It.IsAny<SequenceNumber>()),
        Times.Once);
}
```

> **Q:** Colleague suggests moving test-class mock fields from constructor to `static` to "save allocations." What's the risk?
> **A:** Moq `.Setup(...)` calls accumulate on the mock. Test A's stub persists into Test B. Fresh per-test instances eliminate cross-test state.

> **Q:** Test reports "Expected: 4, but was: 5". Code is `Assert.Equal(actualResult, 4)` with `actualResult == 5`. What's the subtle bug?
> **A:** Arguments swapped. Convention is `Assert.Equal(expected, actual)`. Failure message blames the wrong value. Fix: expected first.

> **Pitfall**
> Forgetting `.Object` when passing mock to SUT. `new BankService(_mockBankRepo)` fails type-check — need `_mockBankRepo.Object`.

> **Pitfall**
> `It.IsAny<T>()` in `Setup` accepts any; `It.IsAny<T>()` in `Verify` asserts any. Same syntax, two roles. For specific value: `It.Is<T>(x => x.Id == 1)`.

> **Pitfall**
> "Write test right after code" isn't TDD — retrofit tests often pass on first run without ever failing. Test might be wrong and you'd never know. Red phase exists to prove tests can fail.

> **Takeaway**
> TDD = Red → Green → Refactor. xUnit: `[Fact]` one-run · `[Theory]` + `[InlineData]` parameterized · constructor fresh per test · `Assert.Equal(expected, actual)` expected FIRST. Moq: `new Mock<T>()` → `.Setup(r => r.Method(It.IsAny<...>())).Returns(...)` or `.Callback<T>(...)` → `.Object` → `.Verify(..., Times.Once)`. Static factories for shared mock-setup boilerplate.
