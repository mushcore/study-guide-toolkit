---
id: 4911-topic-entity-relationships-all-7-types-high-priority
title: Entity Relationships — All 7 Types (HIGH PRIORITY)
pillar: tech
priority: high
chapter: Ch 11
tags:
  - jpa
  - relationships
  - tech
---

"Technically difficult. He CAN ask hard questions here." — Bruce

#### The seven flavors

| # | Relationship | Direction | Owning side | Inverse side |
| --- | --- | --- | --- | --- |
| 1 | 1:1 | Uni | @OneToOne + @JoinColumn | — |
| 2 | 1:1 | Bi | @OneToOne + @JoinColumn | @OneToOne(mappedBy="...") |
| 3 | 1:N | Uni (from one) | @OneToMany + @JoinColumn / @JoinTable | — |
| 4 | N:1 | Uni (from many) | @ManyToOne + @JoinColumn | — |
| 5 | 1:N / N:1 | Bi | **Many side**: @ManyToOne + @JoinColumn | One side: @OneToMany(mappedBy="...") |
| 6 | M:N | Uni | @ManyToMany + @JoinTable | — |
| 7 | M:N | Bi | Either side: @ManyToMany + @JoinTable | Other: @ManyToMany(mappedBy="...") |

#### Owning side rule

The side with the **@JoinColumn (or @JoinTable)** is the owner — holds the FK. The inverse side uses `mappedBy="ownerFieldName"`.

In 1:N bidirectional, the **MANY side always owns** (holds the FK in its row).

#### Cascade + Fetch

-   **CascadeType**: ALL, PERSIST, MERGE, REMOVE, REFRESH, DETACH. Default = none.
-   **FetchType**: EAGER default for \*ToOne, LAZY default for \*ToMany.
-   **orphanRemoval=true** on @OneToMany: orphaned children deleted from DB, not just unlinked.

#### Bidirectional 1:N example (the code annotation pattern)

```java
// ONE side (inverse)
@Entity
public class Department {
    @Id private Long id;
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employees = new ArrayList<>();
}

// MANY side (owning — holds FK)
@Entity
public class Employee {
    @Id private Long id;
    @ManyToOne
    @JoinColumn(name = "DEPT_ID")    // FK column
    private Department department;
}
```
