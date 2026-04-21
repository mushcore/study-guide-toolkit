---
"n": 6
id: 4911-lesson-jpql-building-a-query-step-by-step
title: JPQL — building a query step by step
hook: Stop reading JPQL syntax. Start writing queries.
tags:
  - jpql
module: JPQL / queries & transactions
---

JPQL (Java Persistence Query Language) looks like SQL but operates on **entities + fields**, not tables + columns.

#### Start simple

```sql
-- All employees
SELECT e FROM Employee e
```

Note: `Employee` = entity class name (not "EMPLOYEE" table). `e` = alias. Alias is required.

#### Filter: WHERE

```sql
SELECT e FROM Employee e WHERE e.salary > 50000
```

Hardcoded values are bad. Use **parameters**:

```sql
SELECT e FROM Employee e WHERE e.salary > :minSal
```

Then: `q.setParameter("minSal", 50000)`. Named params (`:name`) > positional (`?1`).

#### Navigate relationships with dots

```sql
SELECT e FROM Employee e WHERE e.department.name = :dept
```

JPA joins automatically. You don't write JOIN for simple paths. `e.department` = the Department entity, `e.department.name` = its name field.

#### Explicit JOINs — when you need them

You need JOIN when you want to project joined fields or filter by the joined side without navigation:

```sql
SELECT e FROM Employee e JOIN e.projects p WHERE p.active = true
```

#### JOIN FETCH — solve N+1 problem

Without FETCH: load 100 employees, iterate, access `emp.getDepartment().getName()` → 100 extra SQL queries. N+1 disaster.

With FETCH: load both in ONE query.

```sql
SELECT e FROM Employee e JOIN FETCH e.department
```

#### Aggregates

```sql
SELECT AVG(e.salary), COUNT(e), MAX(e.salary) FROM Employee e;
SELECT e.department.name, COUNT(e) FROM Employee e
  GROUP BY e.department.name
  HAVING COUNT(e) > 10
```

#### Constructor expression — DTOs

```sql
SELECT new com.x.EmpSummary(e.id, e.name, e.salary) FROM Employee e
```

Returns `EmpSummary` DTOs directly (needs matching constructor).

#### Practice: walk through a real query

From the midterm: given Customer⟷Reservation (N:N) and Reservation→Cruise (N:1), write "all cruises that `:cust` has reserved."

**Step 1 — what do you select?** Cruise objects. `SELECT c FROM Cruise c`

**Step 2 — you need Reservations linked to Cruise.** `SELECT c FROM Cruise c JOIN c.reservations r`

**Step 3 — filter by customer.** `JOIN r.customers cu WHERE cu = :cust`

**Step 4 — avoid duplicate cruises.** Add DISTINCT:

```sql
SELECT DISTINCT c FROM Cruise c
  JOIN c.reservations r
  JOIN r.customers cu
  WHERE cu = :cust
```

#### EntityManager query methods

```java
TypedQuery<Cruise> q = em.createQuery(jpql, Cruise.class);
q.setParameter("cust", someCustomer);
List<Cruise> results = q.getResultList();      // 0+ results

Cruise one = q.getSingleResult();               // EXACTLY 1 — or exception

int count = em.createQuery("UPDATE Employee e SET e.salary = e.salary * 1.1")
              .executeUpdate();                 // bulk UPDATE/DELETE
```

> **Takeaway**
> **Takeaway:** Entity names + field paths + aliases. Named parameters. DISTINCT for collection-based queries. FETCH to avoid N+1. Write queries yourself to build the reflex.

> **Q:** Write JPQL: all employees whose manager has name "Carol."
> **A:** SELECT e FROM Employee e WHERE e.manager.name = 'Carol' — assuming Employee has a self-referencing manager field.

> **Q:** Your query returns 5 duplicate Cruise rows. What's missing?
> **A:** DISTINCT. Joins on collections naturally produce duplicates when there are multiple matching children.
