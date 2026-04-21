---
id: 4911-topic-entity-inheritance-3-strategies
title: Entity Inheritance — 3 Strategies
pillar: tech
priority: med
chapter: Ch 12
tags:
  - jpa
  - inheritance
  - tech
---

| Strategy | DB layout | Pros | Cons |
| --- | --- | --- | --- |
| **SINGLE\_TABLE** (default) | One table, discriminator column | Fast (no joins), simple | Nullable subclass cols; violates normalization |
| **JOINED** | Table per class; FK joins subclass↔parent | Normalized; NOT NULL subclass fields | Slower (joins); schema changes harder |
| **TABLE\_PER\_CLASS** | Full table per concrete class (parent fields duplicated) | No joins for single-type queries | Polymorphic queries use UNION; duplicated schema |

```java
// SINGLE_TABLE (default + discriminator)
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "DTYPE", discriminatorType = DiscriminatorType.STRING)
public class Shape { @Id Long id; ... }

@Entity
@DiscriminatorValue("CIRCLE")
public class Circle extends Shape { private double radius; }
```

-   `@MappedSuperclass` — share mapping without being an entity (abstract base).
-   Quiz 3 Q4: strategy specified by `@Inheritance` (NOT @InheritanceStrategy/@InheritanceType — those are fakes).
