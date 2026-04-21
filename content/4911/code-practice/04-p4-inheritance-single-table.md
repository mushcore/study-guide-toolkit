---
"n": 4
id: 4911-cp-p4-inheritance-single-table
title: P4 · Inheritance — SINGLE_TABLE
lang: java
variant: annotation
tags:
  - inheritance
---

> Shape hierarchy: Circle and Rectangle. Use SINGLE\_TABLE inheritance with discriminator column `SHAPE_TYPE`.

## Code

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "SHAPE_TYPE", discriminatorType = DiscriminatorType.STRING)
public class Shape {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String color;
}

@Entity
@DiscriminatorValue("CIRCLE")
public class Circle extends Shape {
    private double radius;
}

@Entity
@DiscriminatorValue("RECTANGLE")
public class Rectangle extends Shape {
    private double width;
    private double height;
}
```

## Notes

<!-- note parsing degraded: some notes lack exact line references; summary-scope lines used instead -->
- **line 1** · `@Entity` — Parent: @Entity + @Inheritance + @DiscriminatorColumn.
- **line 13** · `@Entity` — Subclass: @Entity + @DiscriminatorValue.
- **line 5** · `@Id` — Parent holds @Id — subclasses inherit it.
- **lines 1–23** · All columns in — All columns in one table.
