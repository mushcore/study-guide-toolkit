---
"n": 3
id: 4911-lesson-jpa-from-zero-mapping-objects-to-tables
title: JPA from zero — mapping objects to tables
hook: "The \"O\" in ORM: how Java objects become database rows."
tags:
  - jpa
module: JPA — entities & persistence
---

You have a `Customer` class in Java. The data lives in a `CUSTOMER` table in PostgreSQL. You want to save/load/delete.

#### The hard way (without JPA)

You'd write:

```java
PreparedStatement ps = conn.prepareStatement(
    "INSERT INTO CUSTOMER (id, name) VALUES (?, ?)");
ps.setLong(1, c.getId());
ps.setString(2, c.getName());
ps.executeUpdate();
```

Boring. Error-prone. Every table needs its own boilerplate. Doesn't scale.

#### The JPA way

**JPA (Java Persistence API)** is an **Object-Relational Mapper (ORM)**. It converts Java objects to SQL automatically.

You annotate the class:

```java
@Entity
@Table(name = "CUSTOMER")
public class Customer {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "NAME")
    private String name;
}
```

Translation:

-   `@Entity` — "this class maps to a DB table"
-   `@Table(name="CUSTOMER")` — "specifically the CUSTOMER table" (optional; default = class name)
-   `@Id` — "this field is the primary key"
-   `@GeneratedValue` — "DB auto-generates the id"
-   `@Column(name="NAME")` — "map to the NAME column" (optional; default = field name)

JPA persistence stack — how a Java call becomes a SQL statement

<svg viewBox="0 0 640 460" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrJPA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><rect x="60" y="20" width="520" height="50" class="box" rx="5"></rect><text x="320" y="42" text-anchor="middle" class="label">Your Business Code</text><text x="320" y="60" text-anchor="middle" class="sub">customer.setName("Alice")</text><path d="M320 70 L320 90" class="arrow-line" marker-end="url(#arrJPA)"></path><rect x="60" y="90" width="520" height="50" class="box-accent" rx="5"></rect><text x="320" y="112" text-anchor="middle" class="label">EntityManager</text><text x="320" y="130" text-anchor="middle" class="sub">@PersistenceContext injects this · API surface</text><path d="M320 140 L320 160" class="arrow-line" marker-end="url(#arrJPA)"></path><rect x="60" y="160" width="520" height="50" class="box-accent" rx="5"></rect><text x="320" y="182" text-anchor="middle" class="label">Persistence Context</text><text x="320" y="200" text-anchor="middle" class="sub">tracks managed entities · dirty checking · 1st-level cache</text><path d="M320 210 L320 230" class="arrow-line" marker-end="url(#arrJPA)"></path><rect x="60" y="230" width="520" height="50" class="box" rx="5"></rect><text x="320" y="252" text-anchor="middle" class="label">Persistence Unit</text><text x="320" y="270" text-anchor="middle" class="sub">persistence.xml · defines provider + datasource</text><path d="M320 280 L320 300" class="arrow-line" marker-end="url(#arrJPA)"></path><rect x="60" y="300" width="520" height="50" class="box" rx="5"></rect><text x="320" y="322" text-anchor="middle" class="label">JPA Provider</text><text x="320" y="340" text-anchor="middle" class="sub">Hibernate / EclipseLink — generates SQL</text><path d="M320 350 L320 370" class="arrow-line" marker-end="url(#arrJPA)"></path><rect x="60" y="370" width="520" height="40" class="box" rx="5"></rect><text x="320" y="395" text-anchor="middle" class="label">JDBC Connection Pool · container-managed</text><path d="M320 410 L320 425" class="arrow-line" marker-end="url(#arrJPA)"></path><rect x="60" y="425" width="520" height="30" class="box-ok" rx="5"></rect><text x="320" y="445" text-anchor="middle" class="label">Database — PostgreSQL / MySQL / Oracle</text></svg>

**Big picture:** you touch Java objects. The EntityManager + Persistence Context track changes. At TX commit, the provider emits SQL through JDBC. You never write INSERT/UPDATE directly (unless you want to).  
Lazy loading fails on detached entities because the Persistence Context (middle layer) is no longer watching.

#### The EntityManager — the helper

Annotations describe the mapping. The **EntityManager** does the actual work.

```java
@PersistenceContext
EntityManager em;

Customer c = new Customer();
c.setName("Alice");
em.persist(c);                          // INSERT

Customer found = em.find(Customer.class, 1L);  // SELECT
found.setName("Bob");                    // Java setter...
// UPDATE runs automatically on TX commit

em.remove(found);                        // DELETE
```

#### The magic: dirty checking

The EntityManager tracks every object you load. If you modify a tracked object, when the transaction commits, JPA diffs the old vs new state and generates the right UPDATE statement **automatically**.

You never write SQL again (mostly).

> **Takeaway**
> **Takeaway:** JPA = annotations describe mapping; EntityManager is the API that does SQL for you. @Entity marks a class, @Id marks the key, @Column maps a field. Everything else is details.

> **Q:** If you forget @Table on an entity, what table name does JPA use?
> **A:** The class name. So a Customer class maps to a "Customer" table by default. @Table(name="X") overrides this.

> **Q:** You load a Customer, change its name, then call... what to save?
> **A:** Nothing! On transaction commit, JPA's dirty checking detects the change and generates UPDATE automatically. That's the whole point of managed entities.
