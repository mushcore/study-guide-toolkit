---
id: 4911-topic-mapping-persistent-objects-annotations
title: Mapping Persistent Objects (Annotations)
pillar: tech
priority: high
chapter: Ch 10
tags:
  - jpa
  - tech
---

#### Required on every entity

-   `@Entity` — marks class
-   `@Id` — primary key field or property
-   Public/protected no-arg constructor
-   Class should be top-level, non-final

#### Common annotations

| Annotation | Purpose | Default |
| --- | --- | --- |
| `@Table(name="X")` | Override table name | class name |
| `@Column(name="X", nullable=true, length=255)` | Override column name / constraints | property name, nullable, 255 |
| `@Id` + `@GeneratedValue` | Primary key + auto-generation | AUTO |
| `@Temporal(TemporalType.DATE)` | java.util.Date → DATE/TIME/TIMESTAMP | required for Date |
| `@Enumerated(EnumType.STRING)` | Enum → string (vs ORDINAL = int) | ORDINAL |
| `@Transient` | NOT persisted | — |
| `@Lob` | BLOB (byte\[\]) / CLOB (String) | — |
| `@Version` | Optimistic locking — auto-increment on UPDATE | — |
| `@Embedded / @Embeddable` | Value object (same table) | — |

#### Composite keys — two ways (high-priority flag)

```java
// Option 1: @IdClass — external PK class, multiple @Id fields
public class EmployeePK implements Serializable {
    public Long empId;
    public String dept;
    // equals, hashCode, default ctor required
}

@Entity @IdClass(EmployeePK.class)
public class Employee {
    @Id @Column(name="EMP_ID")   private Long empId;
    @Id @Column(name="DEPT")     private String dept;
}

// Option 2: @EmbeddedId — @Embeddable PK class, single field
@Embeddable
public class ProjectKey implements Serializable {
    private Long projectId;
    private int version;
    // equals, hashCode, default ctor required
}

@Entity
public class Project {
    @EmbeddedId private ProjectKey id;
}
```

**Key: you need to recognize which is which by name**, not memorize full syntax. @EmbeddedId is "more OOP" — one field encapsulates PK.
