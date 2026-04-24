---
"n": 1
id: 4911-cp-p1-simple-entity-with-auto-gen-pk
title: P1 · Simple entity with auto-gen PK
lang: java
variant: annotation
tags:
  - jpa
kind: code
source: "TODO: trace to lab/assignment/past-exam (legacy — needs enrichment)"
---

> Annotate as a JPA entity mapped to table `CUSTOMER`. id must be auto-generated. email must be unique and not null. registrationDate is a java.util.Date (timestamp). computedFullName is computed and should NOT be persisted.

## Code

```java
@Entity
@Table(name = "CUSTOMER")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "REGISTRATION_DATE")
    private java.util.Date registrationDate;

    @Transient
    private String computedFullName;
    // getters/setters...
}
```

## Notes

- **line 1** · `@Entity` — @Entity + @Table first.
- **line 4** · `@Id` — @Id + @GeneratedValue for auto-gen.
- **line 8** · `@Column` — @Column constraints on email.
- **line 17** · `@Temporal` — @Temporal required for java.util.Date.
- **line 21** · `@Transient` — @Transient on computed field.
