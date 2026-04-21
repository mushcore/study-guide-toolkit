---
n: 43
id: enums
title: "Enums — named constants as a class"
hook: "`if status == 1` is a smell. `if status == Status.ACTIVE` is self-documenting."
tags: [enum, constants]
module: "Python Advanced Language Features"
source: "Week 5 Slides"
bloom_levels: [remember, understand]
related: [classes-objects]
---

`enum.Enum` creates a set of named constants bound to a class.

```python
from enum import Enum, auto

class Status(Enum):
    ACTIVE = auto()
    INACTIVE = auto()
    DELETED = auto()

s = Status.ACTIVE
s.name        # "ACTIVE"
s.value       # 1 (auto-assigned integer)
```

> **Q:** Why use `is` instead of `==` to compare Enum values?
> **A:** Enum members are singletons — there's exactly one `Status.ACTIVE` object. `is` checks identity (same object), which is faster and more expressive of intent. `==` also works because Enum defines equality, but `is` is the idiomatic choice for comparing against a known member.

## Common operations

```python
# Iteration
for status in Status:
    print(status)

# Comparison (identity, not value)
if s is Status.ACTIVE:
    ...

# From value
Status(1)              # Status.ACTIVE

# In a set
valid = {Status.ACTIVE, Status.INACTIVE}
```

## `auto()` vs explicit values

```python
class HttpStatus(Enum):
    OK = 200
    NOT_FOUND = 404
    SERVER_ERROR = 500
```

Use explicit values when they matter for external compatibility (HTTP codes, DB enums). Use `auto()` when values are internal and just need to be distinct.

## Takeaway

> **Takeaway**
> Enums give names to magic numbers. Compare with `is` or equality operators, iterate with `for`, convert via `EnumClass(value)`.
