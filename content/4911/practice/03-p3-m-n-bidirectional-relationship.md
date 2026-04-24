---
"n": 3
id: 4911-cp-p3-m-n-bidirectional-relationship
title: P3 · M:N bidirectional relationship
lang: java
variant: annotation
tags:
  - relationships
kind: code
source: "TODO: trace to lab/assignment/past-exam (legacy — needs enrichment)"
---

> Student ↔ Course — many-to-many BIDIRECTIONAL. Join table named `STUDENT_COURSE` with columns `STUDENT_ID` and `COURSE_ID`. Student is the owning side.

## Code

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
        name = "STUDENT_COURSE",
        joinColumns = @JoinColumn(name = "STUDENT_ID"),
        inverseJoinColumns = @JoinColumn(name = "COURSE_ID")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

## Notes

- **line 10** · `@JoinTable` — Owning side has @JoinTable with joinColumns (owner's FK) + inverseJoinColumns (other side's FK).
- **line 26** · Inverse side uses — Inverse side uses mappedBy pointing to owner's field name ("courses").
