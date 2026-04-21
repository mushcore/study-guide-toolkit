# TDD & xUnit.net: COMP4870 Exam Study Guide

**Exam Value:** 6 marks | **Question Type:** Likely coding-question candidate  
**Status:** Exam-focused, high-leverage topic

---

## 1. TOPIC SUMMARIES

### What is TDD?

**Test-Driven Development (TDD)** is a software design methodology where unit tests are written *before* production code. This inverts traditional development order and ensures code is designed to be testable from the ground up.

**Core Purpose:** Drive software design through test requirements, not after-the-fact verification.

### The Red/Green/Refactor Cycle

TDD operates in a three-phase loop:

1. **RED Phase**: Write a unit test that *fails* because the feature doesn't exist yet
   - Tests nothing; implementation is missing
   - Confirms the test framework works and can detect failures
   - Validates you've identified the requirement correctly

2. **GREEN Phase**: Write the *minimum code* necessary to make the test pass
   - Don't over-engineer; don't add extra features
   - Production code should be *just enough* to satisfy the test
   - Speed matters here; refactoring comes next

3. **REFACTOR Phase**: Improve the code without breaking the test
   - Clean up variable names, reduce duplication, improve readability
   - Re-run tests after each refactoring to ensure nothing broke
   - Only refactor when tests pass

**Repeat** this cycle for each feature or requirement.

### Robert C. Martin's 3 Laws of TDD

1. You are not allowed to write any production code unless it is to make a failing test pass
2. You are not allowed to write any more of a unit test than is sufficient to make it fail (compilation failures count as failures)
3. You are not allowed to write any more production code than is sufficient to make the currently failing test pass

These laws enforce discipline: test-first thinking, minimal viable code, and continuous validation.

### Why TDD?

- **Confidence**: Tests that pass prove the code works as designed
- **Design**: Writing tests first forces you to think about the interface before implementation
- **Regression Prevention**: Tests catch bugs when code changes
- **Documentation**: Tests serve as executable specifications
- **Refactoring Safety**: Refactor without fear of breaking functionality

### Unit Testing vs. Integration Testing

| Aspect | Unit Test | Integration Test |
|--------|-----------|------------------|
| **Scope** | Single class or method | Multiple components together |
| **Isolation** | Mocks/stubs dependencies | Real dependencies |
| **Speed** | Very fast (milliseconds) | Slower (seconds) |
| **Failure Diagnosis** | Pinpoints exact problem | Identifies integration issues |
| **Frequency** | Run hundreds per build | Run dozens per build |

**For TDD, focus on unit tests.** They're fast, isolated, and ideal for test-first design.

### xUnit.net: The Testing Framework

**xUnit.net** is a modern open-source unit testing framework for C#/.NET. It replaces older frameworks (NUnit, MSTest) with:

- Simpler attribute syntax
- Constructor-based setup (no `[SetUp]` method)
- Parameterized tests with `[Theory]` and data attributes
- Better test isolation and parallelization
- Integration with Visual Studio Test Explorer and `dotnet test` CLI

**Key Commands:**
```bash
dotnet new xunit -n MyTests              # Create xUnit test project
dotnet add reference ../MyLibrary        # Add reference to code under test
dotnet test                              # Run all tests
```

---

## 2. KEY CONCEPTS & SYNTAX

### Test Attributes

#### `[Fact]`
A test method that runs once with no data. Used for tests with fixed inputs.

```csharp
[Fact]
public void Add_TwoPositiveNumbers_ReturnsSum()
{
    var calc = new Calculator();
    var result = calc.Add(2, 3);
    Assert.Equal(5, result);
}
```

**Key Point**: One `[Fact]` = one test execution.

#### `[Theory]`
A parameterized test method that runs once per data set. Combined with data attributes.

```csharp
[Theory]
[InlineData(1, 2, 3)]
[InlineData(0, 0, 0)]
[InlineData(-1, 1, 0)]
public void Add_WithVariousInputs_ReturnsCorrectSum(int a, int b, int expected)
{
    var calc = new Calculator();
    var result = calc.Add(a, b);
    Assert.Equal(expected, result);
}
```

**Key Point**: One `[Theory]` method + three `[InlineData]` = three test executions.

### Data Attributes

#### `[InlineData(...)]`
Inline data values. Good for simple, readable test cases.

```csharp
[Theory]
[InlineData(2, 2, 4)]
[InlineData(3, 5, 8)]
public void Add_ReturnsSum(int a, int b, int expected)
{
    Assert.Equal(expected, new Calculator().Add(a, b));
}
```

#### `[MemberData]`
References a property or method that returns `IEnumerable<object[]>`. Good for complex test data.

```csharp
public static IEnumerable<object[]> AddTestData =>
    new List<object[]>
    {
        new object[] { 1, 2, 3 },
        new object[] { -1, 1, 0 },
        new object[] { 100, 200, 300 }
    };

[Theory]
[MemberData(nameof(AddTestData))]
public void Add_WithMemberData_ReturnsSum(int a, int b, int expected)
{
    Assert.Equal(expected, new Calculator().Add(a, b));
}
```

#### `[ClassData]`
References a class that implements `IEnumerable<object[]>`. Best for reusable, complex data sets across multiple test methods.

```csharp
public class AddTestDataClass : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator()
    {
        yield return new object[] { 1, 2, 3 };
        yield return new object[] { 0, 0, 0 };
    }
    
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

[Theory]
[ClassData(typeof(AddTestDataClass))]
public void Add_WithClassData_ReturnsSum(int a, int b, int expected)
{
    Assert.Equal(expected, new Calculator().Add(a, b));
}
```

### Arrange / Act / Assert (AAA) Pattern

All unit tests follow this structure:

1. **Arrange**: Set up the object and any dependencies
2. **Act**: Call the method under test
3. **Assert**: Verify the result matches expectations

```csharp
[Fact]
public void Withdraw_WithSufficientBalance_DecreasesBalance()
{
    // Arrange
    var account = new BankAccount(1000);
    
    // Act
    account.Withdraw(200);
    
    // Assert
    Assert.Equal(800, account.Balance);
}
```

**Exam Tip**: Tests with clear AAA structure are easier to read and maintain. Expect exam questions to test your ability to identify or write proper AAA structure.

### Assert Methods

xUnit provides static methods in the `Assert` class to verify conditions:

| Method | Usage | Example |
|--------|-------|---------|
| `Equal(expected, actual)` | Value equality | `Assert.Equal(5, result)` |
| `NotEqual(notExpected, actual)` | Value inequality | `Assert.NotEqual(0, result)` |
| `True(bool)` | Boolean is true | `Assert.True(user.IsActive)` |
| `False(bool)` | Boolean is false | `Assert.False(user.IsDeleted)` |
| `Null(object)` | Reference is null | `Assert.Null(result)` |
| `NotNull(object)` | Reference is not null | `Assert.NotNull(user)` |
| `Same(expected, actual)` | Same object reference | `Assert.Same(list1, list2)` |
| `NotSame(notExpected, actual)` | Different references | `Assert.NotSame(obj1, obj2)` |
| `Contains(item, collection)` | Item in collection | `Assert.Contains("Bob", names)` |
| `DoesNotContain(item, collection)` | Item not in collection | `Assert.DoesNotContain("X", names)` |
| `Empty(collection)` | Collection has zero items | `Assert.Empty(list)` |
| `NotEmpty(collection)` | Collection has items | `Assert.NotEmpty(items)` |
| `InRange(value, min, max)` | Value within range | `Assert.InRange(age, 0, 120)` |
| `IsType<T>(object)` | Exact type match | `Assert.IsType<string>(obj)` |
| `IsAssignableFrom<T>(object)` | Type or subclass | `Assert.IsAssignableFrom<IEnumerable>(obj)` |
| `Throws<T>(Action)` | Exception thrown | `Assert.Throws<ArgumentException>(() => method())` |
| `ThrowsAsync<T>(Func<Task>)` | Async exception | `await Assert.ThrowsAsync<IOException>(() => asyncMethod())` |

**Exam Trap**: Don't confuse `IsType<T>` (exact match) with `IsAssignableFrom<T>` (inheritance/interface compatibility).

### xUnit Lifecycle: Setup and Teardown

xUnit uses **constructor for setup** (no `[SetUp]` attribute like NUnit), and **`IDisposable` for teardown**.

#### Constructor-Based Setup

```csharp
public class CalculatorTests
{
    private Calculator _calc;
    
    // Constructor runs before EACH test
    public CalculatorTests()
    {
        _calc = new Calculator();
    }
    
    [Fact]
    public void Add_ReturnsSum()
    {
        var result = _calc.Add(2, 3);
        Assert.Equal(5, result);
    }
}
```

**Key Point**: Constructor runs once per test method, ensuring test isolation.

#### IDisposable for Teardown

```csharp
public class DatabaseTests : IDisposable
{
    private TestDatabase _db;
    
    public DatabaseTests()
    {
        _db = new TestDatabase();
        _db.Open();
    }
    
    [Fact]
    public void Query_ReturnsData()
    {
        var result = _db.GetUsers();
        Assert.NotEmpty(result);
    }
    
    // Runs after EACH test
    public void Dispose()
    {
        _db?.Close();
        _db?.Dispose();
    }
}
```

#### Fixtures: Shared State Across Tests

Use `IClassFixture<T>` to share expensive setup (e.g., database connection) across all tests in a class.

```csharp
public class DatabaseFixture : IDisposable
{
    public TestDatabase Db { get; private set; }
    
    public DatabaseFixture()
    {
        Db = new TestDatabase();
        Db.Open();
    }
    
    public void Dispose()
    {
        Db?.Close();
        Db?.Dispose();
    }
}

public class UserRepositoryTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;
    
    public UserRepositoryTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }
    
    [Fact]
    public void GetUser_ById_ReturnsUser()
    {
        var repo = new UserRepository(_fixture.Db);
        var user = repo.GetById(1);
        Assert.NotNull(user);
    }
}
```

**For collection-wide setup** (one-time, shared across all test classes), use `ICollectionFixture<T>` and declare a collection:

```csharp
[CollectionDefinition("Database collection")]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
{
    // Empty; only used to define the fixture
}

[Collection("Database collection")]
public class UserRepositoryTests
{
    // Shared fixture set up once for all classes in this collection
}
```

---

## 3. CODE PATTERNS (VERBATIM)

### Basic Test Class with [Fact]

```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_Returns_Sum()
    {
        // Arrange
        var calc = new Calculator();
        
        // Act
        var result = calc.Add(2, 3);
        
        // Assert
        Assert.Equal(5, result);
    }
    
    [Fact]
    public void Subtract_Returns_Difference()
    {
        var calc = new Calculator();
        var result = calc.Subtract(5, 2);
        Assert.Equal(3, result);
    }
}
```

### Theory with InlineData

```csharp
public class CalculatorTests
{
    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(0, 0, 0)]
    [InlineData(-1, 1, 0)]
    [InlineData(100, 200, 300)]
    public void Add(int a, int b, int expected)
    {
        var calc = new Calculator();
        var result = calc.Add(a, b);
        Assert.Equal(expected, result);
    }
}
```

### Fixture with Constructor and IDisposable

```csharp
public class DatabaseFixture : IDisposable
{
    public TestDatabase Database { get; private set; }
    
    public DatabaseFixture()
    {
        Database = new TestDatabase();
        Database.Initialize();
    }
    
    public void Dispose()
    {
        Database?.Cleanup();
    }
}

public class RepositoryTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;
    
    public RepositoryTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }
    
    [Fact]
    public void SaveUser_Persists_ToDatabase()
    {
        var repo = new UserRepository(_fixture.Database);
        repo.Save(new User { Name = "Alice" });
        
        var retrieved = repo.GetByName("Alice");
        Assert.NotNull(retrieved);
    }
}
```

### Exception Testing

```csharp
public class ValidationTests
{
    [Fact]
    public void Constructor_WithNullName_ThrowsArgumentNullException()
    {
        var ex = Assert.Throws<ArgumentNullException>(() => new User(null));
        Assert.Equal("name", ex.ParamName);
    }
    
    [Fact]
    public async Task SaveAsync_WithoutConnection_ThrowsIOException()
    {
        var repo = new Repository(null);
        await Assert.ThrowsAsync<IOException>(() => repo.SaveAsync(new User()));
    }
}
```

### FizzBuzz Example (From Course Materials)

```csharp
public class FizzBuzzTests
{
    [Fact]
    public void Given2Result2()
    {
        var fb = new FizzBuzz();
        Assert.Equal("2", fb.GetResult(2));
    }
    
    [Fact]
    public void Given3ResultFizz()
    {
        var fb = new FizzBuzz();
        Assert.Equal("Fizz", fb.GetResult(3));
    }
    
    [Fact]
    public void Given5ResultBuzz()
    {
        var fb = new FizzBuzz();
        Assert.Equal("Buzz", fb.GetResult(5));
    }
    
    [Fact]
    public void Given15ResultFizzBuzz()
    {
        var fb = new FizzBuzz();
        Assert.Equal("FizzBuzz", fb.GetResult(15));
    }
    
    [Fact]
    public void GivenMoreThan1000ThrowException()
    {
        var fb = new FizzBuzz();
        Action act = () => fb.GetResult(1001);
        Assert.Throws<Exception>(act);
    }
}
```

---

## 4. MOCKING BASICS

### Mock vs. Stub vs. Fake

| Type | Purpose | Example |
|------|---------|---------|
| **Mock** | Verify interactions; check if methods were called | `Mock<IEmailService>` — assert `SendEmail` was called |
| **Stub** | Provide canned responses; not tested for calls | Return fixed data without verification |
| **Fake** | Real, simplified implementation | In-memory database instead of SQL Server |

**For exams, focus on mocks** — they're the most common in xUnit tests.

### Moq Framework Basics

**Installation:**
```bash
dotnet add package Moq
```

#### Setup and Returns

```csharp
[Fact]
public void SendNotification_WithValidEmail_SendsViaService()
{
    // Arrange
    var mockEmailService = new Mock<IEmailService>();
    mockEmailService
        .Setup(m => m.Send(It.IsAny<string>(), It.IsAny<string>()))
        .Returns(true);
    
    var notifier = new Notifier(mockEmailService.Object);
    
    // Act
    var result = notifier.SendNotification("user@example.com", "Hello");
    
    // Assert
    Assert.True(result);
}
```

#### Verify Method Calls

```csharp
[Fact]
public void Withdraw_CallsAuditService_ToLogTransaction()
{
    // Arrange
    var mockAudit = new Mock<IAuditService>();
    var account = new BankAccount(mockAudit.Object);
    
    // Act
    account.Withdraw(100);
    
    // Assert
    mockAudit.Verify(
        a => a.LogTransaction(It.IsAny<string>()),
        Times.Once
    );
}
```

**Times.Once** — method called exactly once  
**Times.Never** — method never called  
**Times.AtLeastOnce** — called one or more times

---

## 5. TEST PROJECT SETUP

### Create Test Project

```bash
# Create solution
dotnet new sln -n MyProject

# Create main library
dotnet new classlib -n MyLibrary
dotnet sln add ./MyLibrary/MyLibrary.csproj

# Create xUnit test project
dotnet new xunit -n MyLibrary.Tests
dotnet sln add ./MyLibrary.Tests/MyLibrary.Tests.csproj

# Add reference from tests to library
dotnet add ./MyLibrary.Tests/MyLibrary.Tests.csproj reference ./MyLibrary/MyLibrary.csproj
```

### Run Tests

```bash
# Run all tests
dotnet test

# Run with verbose output
dotnet test --verbosity normal

# Run specific test class
dotnet test --filter ClassName=CalculatorTests

# Run specific test method
dotnet test --filter Name~Add_Returns_Sum
```

### Integration with Visual Studio

- **Test Explorer**: View → Test Explorer (Ctrl+E, T)
- **Run Tests**: Right-click on test method → Run Test
- **Debug Tests**: Right-click → Debug Test
- xUnit tests appear with `[Fact]` or `[Theory]` indicators

---

## 6. FLASHCARDS (SuperMemo-style)

### Card 1: Red/Green/Refactor Cycle
**Q:** What are the three phases of the TDD cycle, and what happens in each?

**A:** 
1. **Red**: Write a failing test (test first, before code)
2. **Green**: Write minimum code to pass the test
3. **Refactor**: Improve code without breaking tests

---

### Card 2: [Fact] vs [Theory]
**Q:** When do you use `[Fact]` vs `[Theory]` in xUnit?

**A:** 
- `[Fact]`: Fixed test data, runs once
- `[Theory]`: Parameterized test, runs once per data set (with `[InlineData]`, `[MemberData]`, `[ClassData]`)

---

### Card 3: Robert Martin's 3 Laws
**Q:** State Robert C. Martin's three laws of TDD.

**A:**
1. Write no production code until a test fails
2. Write no more test code than needed to make it fail
3. Write no more production code than needed to make it pass

---

### Card 4: Arrange/Act/Assert
**Q:** What is the Arrange/Act/Assert pattern, and why is it important?

**A:**
- **Arrange**: Set up test data and objects
- **Act**: Call the method under test
- **Assert**: Verify the result
It keeps tests readable, organized, and focused on one behavior.

---

### Card 5: xUnit Setup/Teardown
**Q:** How does xUnit handle setup (before each test) and teardown (after each test)?

**A:**
- **Setup**: Constructor (runs before each test)
- **Teardown**: `IDisposable.Dispose()` (runs after each test)
(Unlike NUnit, no `[SetUp]` or `[TearDown]` attributes)

---

### Card 6: IClassFixture<T>
**Q:** What is `IClassFixture<T>` and when would you use it?

**A:** Shares a single instance of a fixture across all tests in a test class. Use when setup is expensive (e.g., database connection, file I/O) and can be reused safely.

---

### Card 7: Assert.Equal vs Assert.Same
**Q:** What is the difference between `Assert.Equal()` and `Assert.Same()`?

**A:**
- `Assert.Equal()`: Checks value equality (object.Equals)
- `Assert.Same()`: Checks reference equality (ReferenceEquals) — same object instance

---

### Card 8: [InlineData]
**Q:** Write a [Theory] test with [InlineData] to test a Multiply method with three cases.

**A:**
```csharp
[Theory]
[InlineData(2, 3, 6)]
[InlineData(0, 5, 0)]
[InlineData(-2, 3, -6)]
public void Multiply_ReturnsProduct(int a, int b, int expected)
{
    var result = new Calculator().Multiply(a, b);
    Assert.Equal(expected, result);
}
```

---

### Card 9: Exception Testing
**Q:** Write a test that verifies a method throws `ArgumentNullException` when called with a null argument.

**A:**
```csharp
[Fact]
public void Constructor_WithNullName_ThrowsArgumentNullException()
{
    var ex = Assert.Throws<ArgumentNullException>(() => new User(null));
    Assert.Equal("name", ex.ParamName);
}
```

---

### Card 10: Unit vs Integration Tests
**Q:** What is the difference between a unit test and an integration test in TDD?

**A:**
- **Unit Test**: Tests one method or class in isolation; mocks dependencies
- **Integration Test**: Tests multiple components working together with real dependencies

---

### Card 11: Moq Setup
**Q:** How do you set up a mock to return a value when a method is called?

**A:**
```csharp
var mock = new Mock<IService>();
mock.Setup(m => m.GetData())
    .Returns("test data");
```

---

### Card 12: Moq Verify
**Q:** How do you verify that a mocked method was called exactly once?

**A:**
```csharp
mock.Verify(m => m.DoSomething(), Times.Once);
```

---

### Card 13: Dotnet New xUnit
**Q:** What command creates a new xUnit test project and adds a reference to the main library?

**A:**
```bash
dotnet new xunit -n MyLibrary.Tests
dotnet add ./MyLibrary.Tests/MyLibrary.Tests.csproj reference ./MyLibrary/MyLibrary.csproj
```

---

### Card 14: Dotnet Test
**Q:** What command runs all xUnit tests in a solution?

**A:**
```bash
dotnet test
```

---

### Card 15: IsType<T> vs IsAssignableFrom<T>
**Q:** What is the difference between `Assert.IsType<T>()` and `Assert.IsAssignableFrom<T>()`?

**A:**
- `IsType<T>()`: Exact type match only
- `IsAssignableFrom<T>()`: Type or any subclass/interface implementation

---

## 7. EXAM TRAPS & MISCONCEPTIONS

### Trap 1: Assert.Equal Argument Order
**Trap:** Using `Assert.Equal(actual, expected)` instead of `Assert.Equal(expected, actual)`

**Reality:** xUnit expects `Assert.Equal(expected, actual)`. The parameter names in the error message make this clear, but it's easy to reverse.

```csharp
// Wrong order (will confuse error messages)
Assert.Equal(result, 5);

// Correct order
Assert.Equal(5, result);
```

---

### Trap 2: [Fact] vs [Theory] Confusion
**Trap:** Using `[Fact]` when you need parameterized tests, or forgetting `[InlineData]` with `[Theory]`

**Reality:**
- `[Fact]` = no parameters
- `[Theory]` = must have at least one data attribute (`[InlineData]`, `[MemberData]`, `[ClassData]`)

```csharp
// WRONG: [Theory] without data
[Theory]
public void Add_ReturnsSum(int a, int b, int expected) { }

// CORRECT: [Theory] with [InlineData]
[Theory]
[InlineData(1, 2, 3)]
public void Add_ReturnsSum(int a, int b, int expected) { }

// CORRECT: [Fact] for no parameters
[Fact]
public void Add_ReturnsSum() { }
```

---

### Trap 3: Constructor Setup vs [SetUp]
**Trap:** Using `[SetUp]` attribute (NUnit syntax) in xUnit

**Reality:** xUnit uses **constructor** for setup, not `[SetUp]`.

```csharp
// NUnit (wrong for xUnit)
[SetUp]
public void Setup() { _calc = new Calculator(); }

// xUnit (correct)
public CalculatorTests()
{
    _calc = new Calculator();
}
```

---

### Trap 4: Dispose Timing
**Trap:** Assuming `IDisposable.Dispose()` runs before all tests, not after each test

**Reality:** `Dispose()` runs **after each individual test**, not once at the end of the test class. Constructor runs before each test.

```csharp
// Constructor: before each test
// Dispose: after each test
public class MyTests : IDisposable
{
    public MyTests() { /* runs before each [Fact] */ }
    public void Dispose() { /* runs after each [Fact] */ }
}
```

---

### Trap 5: xUnit vs NUnit vs MSTest
**Trap:** Mixing syntax from different frameworks

**Reality:** Each framework has different attributes and patterns:

| Feature | xUnit | NUnit | MSTest |
|---------|-------|-------|--------|
| Test Method | `[Fact]` | `[Test]` | `[TestMethod]` |
| Parameterized | `[Theory]` + `[InlineData]` | `[TestCase]` | `[DataTestMethod]` + `[DataRow]` |
| Setup | Constructor | `[SetUp]` | `[TestInitialize]` |
| Teardown | `IDisposable` | `[TearDown]` | `[TestCleanup]` |

**For COMP4870**, focus on **xUnit only**.

---

### Trap 6: Mock Verification Timing
**Trap:** Forgetting to verify mock calls, or verifying before acting

**Reality:** Verify **after** acting. The pattern is: Arrange → Act → Assert (which includes Verify).

```csharp
// WRONG: Verify before acting
mockService.Verify(m => m.Send(), Times.Once);
notifier.SendNotification();

// CORRECT: Arrange, Act, then Assert/Verify
var mock = new Mock<IEmailService>();
notifier.SendNotification(mock.Object);
mock.Verify(m => m.Send(), Times.Once);
```

---

## 8. PRACTICE MCQ (5-6 Questions)

### MCQ 1
**Question:** In TDD, the RED phase involves:
- (A) Writing production code that passes all tests
- (B) Writing a test that fails because the feature doesn't exist yet
- (C) Refactoring code to improve readability
- (D) Deploying code to production

**Answer:** (B)  
**Explanation:** RED phase creates a failing test before implementation. This confirms the test framework works and validates you've identified the requirement.

---

### MCQ 2
**Question:** Which attribute is used for parameterized tests in xUnit?
- (A) `[Fact]`
- (B) `[Theory]`
- (C) `[Test]`
- (D) `[TestCase]`

**Answer:** (B)  
**Explanation:** `[Theory]` combined with `[InlineData]`, `[MemberData]`, or `[ClassData]` creates parameterized tests. `[Fact]` is for fixed tests with no parameters.

---

### MCQ 3
**Question:** In xUnit, how many times does the constructor run for a test class with 5 `[Fact]` methods?
- (A) Once, before all tests
- (B) Once, after all tests
- (C) Five times, once before each test
- (D) Zero times

**Answer:** (C)  
**Explanation:** xUnit instantiates the test class before each test method, so the constructor runs once per test. This ensures test isolation.

---

### MCQ 4
**Question:** Which assertion method checks that two objects refer to the *same instance in memory*?
- (A) `Assert.Equal(expected, actual)`
- (B) `Assert.Same(expected, actual)`
- (C) `Assert.NotNull(actual)`
- (D) `Assert.IsType<T>(actual)`

**Answer:** (B)  
**Explanation:** `Assert.Same()` uses reference equality (ReferenceEquals). `Assert.Equal()` uses value equality (object.Equals).

---

### MCQ 5
**Question:** In a Moq mock setup, what does `It.IsAny<string>()` do?
- (A) Matches any string value passed to the method
- (B) Requires an exact string match
- (C) Throws an exception if a string is passed
- (D) Ignores the parameter

**Answer:** (A)  
**Explanation:** `It.IsAny<T>()` is a matcher that accepts any value of type T. It's useful when the specific parameter value doesn't matter for the test.

---

### MCQ 6
**Question:** Which command runs all xUnit tests in a solution and displays output?
- (A) `dotnet build`
- (B) `dotnet run`
- (C) `dotnet test`
- (D) `dotnet execute`

**Answer:** (C)  
**Explanation:** `dotnet test` discovers and runs all test methods in the solution, reporting pass/fail results.

---

## 9. CODING TEMPLATE: Full xUnit Test Class

```csharp
using Xunit;
using MyLibrary;

namespace MyLibrary.Tests
{
    /// <summary>
    /// Unit tests for the StringValidator class.
    /// Demonstrates [Fact], [Theory], exception testing, and fixtures.
    /// </summary>
    public class StringValidatorTests
    {
        private readonly StringValidator _validator;

        // Constructor: setup before each test
        public StringValidatorTests()
        {
            _validator = new StringValidator();
        }

        // ===== [Fact] Tests =====

        [Fact]
        public void IsValidEmail_WithValidEmail_ReturnsTrue()
        {
            // Arrange
            string email = "user@example.com";

            // Act
            bool result = _validator.IsValidEmail(email);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsValidEmail_WithNullEmail_ReturnsFalse()
        {
            // Act & Assert
            Assert.False(_validator.IsValidEmail(null));
        }

        [Fact]
        public void IsValidEmail_WithEmptyEmail_ReturnsFalse()
        {
            // Act & Assert
            Assert.False(_validator.IsValidEmail(string.Empty));
        }

        // ===== [Theory] Tests =====

        [Theory]
        [InlineData("valid@example.com", true)]
        [InlineData("invalid.email@", false)]
        [InlineData("no-at-sign.com", false)]
        [InlineData("spaces in@email.com", false)]
        [InlineData("test+alias@domain.co.uk", true)]
        public void IsValidEmail_WithVariousInputs_ReturnsExpectedResult(
            string email, 
            bool expected)
        {
            // Arrange & Act
            bool result = _validator.IsValidEmail(email);

            // Assert
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("", 0)]
        [InlineData("a", 1)]
        [InlineData("hello world", 11)]
        [InlineData("   ", 3)]
        public void GetLength_WithVariousStrings_ReturnsCorrectLength(
            string input, 
            int expectedLength)
        {
            // Act
            int result = _validator.GetLength(input);

            // Assert
            Assert.Equal(expectedLength, result);
        }

        // ===== Exception Tests =====

        [Fact]
        public void ValidateNonNull_WithNullInput_ThrowsArgumentNullException()
        {
            // Arrange & Act & Assert
            var ex = Assert.Throws<ArgumentNullException>(
                () => _validator.ValidateNonNull(null)
            );
            Assert.Equal("input", ex.ParamName);
        }

        [Fact]
        public async void ValidateAsync_WithTimeout_ThrowsTimeoutException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<TimeoutException>(
                () => _validator.ValidateAsync(null)
            );
        }

        // ===== Collection Tests =====

        [Fact]
        public void GetValidEmails_WithMixedInput_ReturnsOnlyValid()
        {
            // Arrange
            var emails = new[] 
            { 
                "valid@example.com", 
                "invalid", 
                "another@domain.org" 
            };

            // Act
            var result = _validator.GetValidEmails(emails);

            // Assert
            Assert.NotEmpty(result);
            Assert.Equal(2, result.Count());
            Assert.Contains("valid@example.com", result);
            Assert.DoesNotContain("invalid", result);
        }

        // ===== Type Tests =====

        [Fact]
        public void GetValidationResult_ReturnsCorrectType()
        {
            // Act
            var result = _validator.GetValidationResult("test@example.com");

            // Assert
            Assert.IsType<ValidationResult>(result);
        }
    }
}
```

**Key Features:**
- Constructor setup (once per test)
- 3 `[Fact]` tests with different scenarios
- 2 `[Theory]` tests with `[InlineData]` (5+ cases total)
- 2 exception tests (sync and async)
- 1 collection test (Contains, DoesNotContain)
- 1 type test (IsType<T>)
- Full AAA structure on every test
- Clear variable names and comments

---

## 10. SUMMARY FOR EXAM PREP

### High-Priority Topics
1. **Red/Green/Refactor cycle**: Understand each phase and why it matters
2. **[Fact] vs [Theory]**: Know when to use each and how to add data
3. **Arrange/Act/Assert**: Write tests with this structure
4. **Assert methods**: Memorize common ones (Equal, NotEqual, True, False, Null, Same, Throws, Contains, IsType)
5. **xUnit setup/teardown**: Constructor + IDisposable (not [SetUp])
6. **Fixture sharing**: IClassFixture<T> for expensive setup
7. **Exception testing**: Assert.Throws<T> and Assert.ThrowsAsync<T>

### Quick Reference: Assert Methods
```
Equal, NotEqual, True, False, Null, NotNull, Same, NotSame,
Contains, DoesNotContain, Empty, NotEmpty, InRange, IsType, 
IsAssignableFrom, Throws, ThrowsAsync
```

### Command Line
```bash
dotnet new xunit -n MyTests
dotnet add reference ../MainProject
dotnet test
dotnet test --filter Name~TestMethodName
```

### Red Flags
- Mixing framework syntax (NUnit [SetUp] in xUnit)
- Reversing Assert.Equal argument order
- Using [Fact] when you need parameters
- Forgetting constructor setup or Dispose cleanup
- Not following AAA structure

---

**Study Strategy:**
1. Read Section 2 (Key Concepts) twice
2. Code along with the template in Section 9
3. Flashcards (Section 6) for retention
4. Practice MCQ (Section 8) to identify weak areas
5. Write your own [Theory] test with 5+ [InlineData] cases
6. Simulate a 30-minute exam write (see template)

**Expected exam question:** Write a complete xUnit test class with at least 1 [Fact], 1 [Theory], and 1 exception test. Emphasize AAA structure and correct assertion method usage.

