---
n: 35
id: xunit-fixtures-lifecycle
title: "xUnit lifecycle — constructor + IDisposable, IClassFixture, ICollectionFixture"
hook: "Constructor runs before every test. IClassFixture shares expensive setup across a class. ICollectionFixture shares across multiple classes."
tags: [tdd, xunit, fixture, lifecycle]
module: "Testing Discipline"
source: "notes/TDD_xunit_SCRIPT.docx; research-tdd.md"
bloom_levels: [remember, apply]
related: [tdd-cycle, xunit-attributes-assertions]
---

## One test class per test — by default

xUnit creates a fresh instance of the test class for every `[Fact]` or `[Theory]` execution. That means:

- The **constructor** runs before each test (think of it as xUnit's `[SetUp]`).
- If the class implements `IDisposable`, **`Dispose()`** runs after each test (think of it as xUnit's `[TearDown]`).
- No test sees state left over from another test. Each run is independent.

```cs
public class CalculatorTests : IDisposable
{
    private readonly Calculator _calc;

    public CalculatorTests()              // runs before EACH test
    {
        _calc = new Calculator();
    }

    [Fact]
    public void Add_Works() => Assert.Equal(5, _calc.Add(2, 3));

    [Fact]
    public void Subtract_Works() => Assert.Equal(1, _calc.Subtract(3, 2));

    public void Dispose()                  // runs after EACH test
    {
        // cleanup if needed
    }
}
```

This is different from older frameworks (NUnit, MSTest) that use `[SetUp]` / `[TearDown]` attribute-decorated methods. xUnit relies on standard C# object lifecycle — no attribute, no hidden convention.

## `IClassFixture<T>` — share across a test class

Sometimes setup is expensive — spinning up a `DbContext`, starting an in-memory server, loading a large file. Running that cost before every test makes the test suite slow. `IClassFixture<T>` shares one instance across every test in one class:

```cs
public class DbFixture : IDisposable
{
    public MyDbContext Db { get; } = new MyDbContext(...);
    public DbFixture() { /* seed data */ }
    public void Dispose() => Db.Dispose();
}

public class UserServiceTests : IClassFixture<DbFixture>
{
    private readonly DbFixture _fixture;

    public UserServiceTests(DbFixture fixture)     // xUnit injects the shared instance
        => _fixture = fixture;

    [Fact]
    public void FindUser_Exists() { /* use _fixture.Db */ }

    [Fact]
    public void FindUser_Missing() { /* use _fixture.Db */ }
}
```

xUnit creates the `DbFixture` once, injects it into every test class instance via the constructor, and disposes it after all tests in the class finish. Each `[Fact]` still runs in its own `UserServiceTests` instance — `IClassFixture` shares the fixture, not the test class.

## `ICollectionFixture<T>` — share across multiple classes

When multiple test classes need the same shared state (e.g. one expensive resource serving several test suites), use `ICollectionFixture<T>` plus `[CollectionDefinition]` and `[Collection]`:

```cs
[CollectionDefinition("DbCollection")]
public class DbCollection : ICollectionFixture<DbFixture> { }

[Collection("DbCollection")]
public class UserServiceTests { /* ... */ }

[Collection("DbCollection")]
public class OrderServiceTests { /* ... */ }
```

One `DbFixture` instance is shared across `UserServiceTests`, `OrderServiceTests`, and any other class in the `"DbCollection"`. Runs get serialized within the collection (xUnit parallelizes across collections but not within), so "shared" doesn't race.

## Parallelization defaults

By default, xUnit runs **tests within one class serially** and **classes in different classes in parallel**. A class using `IClassFixture<T>` or `ICollectionFixture<T>` follows the same rule, but the shared fixture is not re-created — it's instantiated once.

Opt into full parallelization or opt out of parallelization via `[assembly: CollectionBehavior(...)]` in `AssemblyInfo.cs` or an `xunit.runner.json` file. Rarely needed; the defaults are sensible for most suites.

## When to reach for a fixture

| Scenario | Use |
|---|---|
| Independent unit of logic, no setup cost | Plain class; no fixture |
| Expensive setup (DB, HttpClient, server) shared by one class's tests | `IClassFixture<T>` |
| Expensive setup shared by multiple test classes | `ICollectionFixture<T>` + `[Collection]` |
| Static reference data (list of 100 country codes) | Static field in the test class; not a fixture |

Fixtures trade isolation for speed. Use them only when the setup is genuinely expensive. An in-memory `List<int>` does not warrant a fixture.

> **Q:** You add a new `[Fact]` to an existing test class. The test passes on your machine but fails in CI, complaining that a database row it expects isn't present. You didn't change anything else. What's the most likely lifecycle reason?
> **A:** Another test in the same class (or a sibling class in the same collection) previously modified shared state through the fixture. Because xUnit reuses the fixture across tests, one test's writes persist into subsequent tests. Fix options: make the fixture's `DbContext` reset between tests (add cleanup to `Dispose` on the test class itself), or move the affected tests to their own collection so their state stays isolated.

> **Example**
> A test class that shares a seeded in-memory DB across its tests via `IClassFixture`:
>
> ```cs
> public class SeededDbFixture : IDisposable
> {
>     public MyDb Db { get; } = new MyDb(new DbContextOptionsBuilder<MyDb>()
>         .UseInMemoryDatabase($"test-{Guid.NewGuid()}").Options);
>
>     public SeededDbFixture()
>     {
>         Db.Users.AddRange(new User("Alice"), new User("Bob"));
>         Db.SaveChanges();
>     }
>
>     public void Dispose() => Db.Dispose();
> }
>
> public class UserQueryTests : IClassFixture<SeededDbFixture>
> {
>     private readonly SeededDbFixture _fx;
>     public UserQueryTests(SeededDbFixture fx) => _fx = fx;
>
>     [Fact] public void FindAlice() => Assert.NotNull(_fx.Db.Users.Find(1));
>     [Fact] public void CountUsers() => Assert.Equal(2, _fx.Db.Users.Count());
> }
> ```
>
> Seeding runs once per class; each test sees the pre-populated DB without paying setup cost.

> **Pitfall**
> Using `IClassFixture<T>` for a resource whose tests mutate it. The fixture is shared — if `TestA` adds a user and `TestB` counts users, `TestB`'s result depends on whether `TestA` ran first. xUnit does NOT guarantee test order. Use a fixture only when tests treat it as read-only, or reset state in the test class's own `IDisposable.Dispose`.

> **Takeaway**
> Constructor runs before each test; `Dispose` (when implementing `IDisposable`) runs after. `IClassFixture<T>` shares one expensive setup instance across all tests in one class. `ICollectionFixture<T>` + `[CollectionDefinition]` + `[Collection("Name")]` shares across multiple classes. Tests inside one class (or one collection) run serially; different classes run in parallel by default. Reach for a fixture only when setup cost justifies it — keep plain tests simple.
