---
"n": 2
id: 4870-code-xunit-test-class-coding-candidate-2
title: "xUnit test class (coding candidate #2)"
lang: cs
variant: starter-solution
tags:
  - tdd
---

## Prompt

Write an xUnit test class for a <code>StringValidator</code> class with a method <code>IsValidEmail(string)</code>. Include: (1) one [Fact] for happy path; (2) one [Theory] with 3 [InlineData] rows of invalid emails; (3) one test asserting a <code>null</code> input throws <code>ArgumentNullException</code>.

## Starter

```cs
using Xunit;

public class StringValidatorTests {
    // TODO: happy path [Fact]

    // TODO: [Theory] with invalid emails

    // TODO: [Fact] that null throws
}
```

## Solution

```cs
using Xunit;
using System;

public class StringValidatorTests {
    private readonly StringValidator _v = new StringValidator();

    [Fact]
    public void IsValidEmail_WellFormed_ReturnsTrue() {
        var result = _v.IsValidEmail("user@bcit.ca");
        Assert.True(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("no-at-sign")]
    [InlineData("@nouser")]
    public void IsValidEmail_Invalid_ReturnsFalse(string input) {
        Assert.False(_v.IsValidEmail(input));
    }

    [Fact]
    public void IsValidEmail_Null_ThrowsArgumentNull() {
        Assert.Throws<ArgumentNullException>(() => _v.IsValidEmail(null));
    }
}
```

## Why

<strong>Marking checklist (10 marks):</strong><ul><li>Test class public, no attributes on class (1)</li><li>[Fact] method name describing scenario (1)</li><li>AAA pattern visible (1)</li><li>[Theory] + 3 [InlineData] (3)</li><li>parameter signature matches InlineData args (1)</li><li>Assert.Throws&lt;ArgumentNullException&gt;(Action) (2)</li><li>Using statement for Xunit (1)</li></ul>
