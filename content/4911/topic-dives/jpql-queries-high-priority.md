---
id: 4911-topic-jpql-queries-high-priority
title: JPQL — Queries (HIGH PRIORITY)
pillar: tech
priority: high
chapter: Ch 13
tags:
  - jpql
  - tech
---

"Students struggle here. Fair game on final." — Bruce. Practice WRITING queries, not just recognizing.

#### Syntax essentials (JPQL)

```sql
-- Basic
SELECT e FROM Employee e WHERE e.salary > :min;

-- Path navigation
SELECT e FROM Employee e WHERE e.department.name = :deptName;

-- INNER JOIN (only employees with a dept)
SELECT e FROM Employee e JOIN e.department d WHERE d.name = :n;

-- LEFT JOIN (include those without)
SELECT e FROM Employee e LEFT JOIN e.department d;

-- FETCH JOIN (avoid N+1)
SELECT b FROM Book b JOIN FETCH b.author;

-- Aggregates
SELECT COUNT(e), AVG(e.salary), MAX(e.salary) FROM Employee e;

-- GROUP BY / HAVING
SELECT e.department, COUNT(e) FROM Employee e
GROUP BY e.department HAVING COUNT(e) > 10;

-- Constructor expression (DTO)
SELECT new com.x.EmpDto(e.id, e.name) FROM Employee e;

-- Subquery
SELECT e FROM Employee e WHERE e.salary >
    (SELECT AVG(e2.salary) FROM Employee e2);

-- IN operator (treat collection as source)
SELECT p FROM Employee e, IN(e.phones) p;
```

#### Named params + pagination (Java side)

```java
q.setParameter("min", 50000);  // :min
q.setParameter(1, 50000);       // ?1

q.setFirstResult(20).setMaxResults(10).getResultList();

em.createQuery("UPDATE Employee e SET e.salary = e.salary * 1.1")
  .executeUpdate();
```

#### Query API methods

-   `em.createQuery(jpql, Type.class)` → **TypedQuery<T>**
-   `em.createNamedQuery("name", Type.class)` → uses @NamedQuery
-   `em.createNativeQuery(sql)` → raw SQL
-   `q.getResultList()` — List (empty if 0)
-   `q.getSingleResult()` — expect exactly 1 (NoResult/NonUniqueResult exceptions)
-   `q.executeUpdate()` — INSERT/UPDATE/DELETE; returns count
