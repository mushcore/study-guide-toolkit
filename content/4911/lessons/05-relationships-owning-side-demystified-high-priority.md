---
"n": 5
id: 4911-lesson-relationships-owning-side-demystified-high-priority
title: Relationships — owning side demystified (HIGH PRIORITY)
hook: Why does the "many" side own the FK? Because of how databases work.
tags:
  - relationships
module: JPA — entities & persistence
---

Entities don't live alone. An `Employee` belongs to a `Department`. A `Book` has `Author`s. Relationships.

#### Start with the database

In a relational DB, foreign keys go in ONE place. Look at this:

```text
DEPARTMENT                    EMPLOYEE
+----+--------+              +----+--------+----------+
| id | name   |              | id | name   | dept_id  |  ← FK
+----+--------+              +----+--------+----------+
|  1 | Sales  |              | 10 | Alice  | 1        |
|  2 | Eng    |              | 11 | Bob    | 1        |
+----+--------+              | 12 | Carol  | 2        |
                             +----+--------+----------+
```

The FK `dept_id` is in the Employee row. **Why?** Because an employee has exactly ONE department, but a department can have MANY employees. You can't store "list of employee ids" in the Department row (1:N doesn't fit in a single cell).

So: **in any 1:N, the FK lives on the MANY side.**

#### Owning side = the side with the FK

JPA calls the side with the FK the **owning side**. The other side is the **inverse side**.

For 1:N bidirectional:

```java
// MANY side — OWNING (holds FK)
@Entity
public class Employee {
    @Id private Long id;

    @ManyToOne                              // relationship type
    @JoinColumn(name = "DEPT_ID")            // FK column
    private Department department;
}

// ONE side — INVERSE
@Entity
public class Department {
    @Id private Long id;

    @OneToMany(mappedBy = "department")     // "I'm the inverse.
    private List<Employee> employees;       //  Owner's field is 'department'"
}
```

#### Why mappedBy?

JPA reads **only the owning side** when deciding what SQL to run. If you forget `mappedBy` on the inverse, JPA thinks there are TWO separate relationships and creates a second FK or join table. Disaster.

`mappedBy="department"` literally means: "Hey JPA, I'm the inverse. The OWNING side is the Employee class, and the relationship field on it is called `department`."

#### The 7 flavors — visual reference

Seven relationship types — annotation + FK location

<svg viewBox="0 0 760 720" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrREL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="20" class="label-accent">1. 1:1 unidirectional</text><rect x="20" y="30" width="100" height="40" class="box-accent" rx="5"></rect><text x="70" y="55" text-anchor="middle" class="label">User</text><path d="M120 50 L200 50" class="arrow-line" marker-end="url(#arrREL)"></path><text x="160" y="44" text-anchor="middle" class="sub">1 ── 1</text><rect x="200" y="30" width="100" height="40" class="box" rx="5"></rect><text x="250" y="55" text-anchor="middle" class="label">Profile</text><text x="320" y="42" class="sub">User: @OneToOne + @JoinColumn</text><text x="320" y="58" class="sub">FK: User.profile_id</text><text x="20" y="100" class="label-accent">2. 1:1 bidirectional</text><rect x="20" y="110" width="100" height="40" class="box-accent" rx="5"></rect><text x="70" y="135" text-anchor="middle" class="label">User</text><path d="M120 130 L200 130" class="arrow-line" marker-end="url(#arrREL)"></path><path d="M200 138 L120 138" class="arrow-line" marker-end="url(#arrREL)"></path><rect x="200" y="110" width="100" height="40" class="box" rx="5"></rect><text x="250" y="135" text-anchor="middle" class="label">Profile</text><text x="320" y="118" class="sub">User: @OneToOne + @JoinColumn</text><text x="320" y="134" class="sub">Profile: @OneToOne(mappedBy="profile")</text><text x="320" y="150" class="sub">FK: User.profile_id</text><text x="20" y="180" class="label-accent">3. 1:N unidirectional</text><rect x="20" y="190" width="100" height="40" class="box-accent" rx="5"></rect><text x="70" y="215" text-anchor="middle" class="label">Dept</text><path d="M120 210 L200 210" class="arrow-line" marker-end="url(#arrREL)"></path><text x="160" y="204" text-anchor="middle" class="sub">1 ── N</text><rect x="200" y="190" width="100" height="40" class="box" rx="5"></rect><text x="250" y="215" text-anchor="middle" class="label">Emp</text><text x="320" y="198" class="sub">Dept: @OneToMany + @JoinColumn (or @JoinTable)</text><text x="320" y="214" class="sub">FK: Emp.dept_id (or join table) — owning is on the ONE side here</text><text x="20" y="260" class="label-accent">4. N:1 unidirectional</text><rect x="20" y="270" width="100" height="40" class="box" rx="5"></rect><text x="70" y="295" text-anchor="middle" class="label">Dept</text><path d="M200 290 L120 290" class="arrow-line" marker-end="url(#arrREL)"></path><text x="160" y="284" text-anchor="middle" class="sub">N ── 1</text><rect x="200" y="270" width="100" height="40" class="box-accent" rx="5"></rect><text x="250" y="295" text-anchor="middle" class="label">Emp</text><text x="320" y="278" class="sub">Emp: @ManyToOne + @JoinColumn</text><text x="320" y="294" class="sub">FK: Emp.dept_id (MANY side owns — the natural place)</text><text x="20" y="340" class="label-accent">5. 1:N / N:1 bidirectional ★ COMMON</text><rect x="20" y="350" width="100" height="40" class="box" rx="5"></rect><text x="70" y="375" text-anchor="middle" class="label">Dept</text><path d="M120 370 L200 370" class="arrow-line" marker-end="url(#arrREL)"></path><path d="M200 378 L120 378" class="arrow-line" marker-end="url(#arrREL)"></path><rect x="200" y="350" width="100" height="40" class="box-accent" rx="5"></rect><text x="250" y="375" text-anchor="middle" class="label">Emp</text><text x="320" y="358" class="sub">Emp: @ManyToOne + @JoinColumn (OWNING)</text><text x="320" y="374" class="sub">Dept: @OneToMany(mappedBy="dept")</text><text x="320" y="390" class="sub">FK: Emp.dept_id · MANY side ALWAYS owns</text><text x="20" y="420" class="label-accent">6. M:N unidirectional</text><rect x="20" y="430" width="100" height="40" class="box-accent" rx="5"></rect><text x="70" y="455" text-anchor="middle" class="label">Student</text><path d="M120 450 L200 450" class="arrow-line" marker-end="url(#arrREL)"></path><text x="160" y="444" text-anchor="middle" class="sub">M ── N</text><rect x="200" y="430" width="100" height="40" class="box" rx="5"></rect><text x="250" y="455" text-anchor="middle" class="label">Course</text><text x="320" y="438" class="sub">Student: @ManyToMany + @JoinTable</text><text x="320" y="454" class="sub">Join table: STUDENT_COURSE</text><text x="20" y="500" class="label-accent">7. M:N bidirectional</text><rect x="20" y="510" width="100" height="40" class="box-accent" rx="5"></rect><text x="70" y="535" text-anchor="middle" class="label">Student</text><path d="M120 530 L200 530" class="arrow-line" marker-end="url(#arrREL)"></path><path d="M200 538 L120 538" class="arrow-line" marker-end="url(#arrREL)"></path><rect x="200" y="510" width="100" height="40" class="box" rx="5"></rect><text x="250" y="535" text-anchor="middle" class="label">Course</text><text x="320" y="518" class="sub">Student: @ManyToMany + @JoinTable (OWNING)</text><text x="320" y="534" class="sub">Course: @ManyToMany(mappedBy="courses")</text><text x="320" y="550" class="sub">Join table: STUDENT_COURSE</text><rect x="20" y="600" width="720" height="100" class="box" rx="5"></rect><text x="380" y="624" text-anchor="middle" class="label-accent">Reading guide</text><text x="380" y="646" text-anchor="middle" class="sub">Accent-bordered box = OWNING SIDE — has @JoinColumn / @JoinTable, holds the FK</text><text x="380" y="664" text-anchor="middle" class="sub">Plain box = INVERSE SIDE — has mappedBy="ownerFieldName"</text><text x="380" y="682" text-anchor="middle" class="sub">In any 1:N or N:1, the MANY side owns. In M:N, either side may own (your choice).</text></svg>

#### Cascade + Fetch

-   **CascadeType.ALL** — ops on parent cascade to children (persist, merge, remove, refresh, detach)
-   **FetchType**: \*ToOne = EAGER by default. \*ToMany = LAZY by default.
-   **orphanRemoval=true** — remove child from parent's collection → DB DELETE

> **Takeaway**
> **Takeaway:** In 1:N, MANY side owns (has FK). In bidirectional, the owner has @JoinColumn; the inverse has mappedBy pointing to the owner's FIELD name.

> **Q:** In a bidirectional M:N relationship between Student and Course, which side owns?
> **A:** Either can own. Whoever has @ManyToMany + @JoinTable = owner. The other has @ManyToMany(mappedBy="..."). Usually the more "active" side is made owner by convention.

> **Q:** You write @OneToMany on the ONE side WITHOUT mappedBy. What happens?
> **A:** JPA assumes it's unidirectional and creates a join table (or FK based on defaults) — likely producing duplicate/conflicting mappings. Always use mappedBy on the inverse side of bidirectional.
