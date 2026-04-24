---
n: 20
id: sql-crud
title: "SQL queries: GROUP BY, HAVING, and subqueries"
lang: sql
tags: [SQL, GROUP-BY, HAVING, subquery, WHERE]
source: "Slide 7, Quiz 10"
pedagogy: worked-example-first
kind: code
---

## Prompt

The NorthWind-style Customers table has three columns: `CustomerID`, `CustomerName`, and `Country`.

Write a query that lists each country alongside its customer count, but returns only countries with more than 2 customers.

---

## Starter

The scaffold below has SELECT, FROM, and GROUP BY in place. Two things are missing or wrong:

1. The HAVING clause is absent — add it to filter groups where the count exceeds 2.
2. The alias `c` is referenced in a WHERE clause — move the filter to the correct clause.

```sql
SELECT Country, COUNT(CustomerID) AS c
FROM Customers
WHERE c > 2
GROUP BY Country;
```

Fix both issues so the query runs correctly.

---

## Solution

```sql
SELECT Country, COUNT(CustomerID) AS c
FROM Customers
GROUP BY Country
HAVING c > 2;
```

---

## Why

**Why WHERE c > 2 fails:**

The database processes clauses in a fixed order: FROM → WHERE → GROUP BY → HAVING → SELECT. WHERE fires before GROUP BY runs. At that point, no groups exist yet, so COUNT has not been computed and the alias `c` does not exist. The database rejects the query with an error.

**Why HAVING works:**

HAVING fires after GROUP BY. Each group has been formed and its aggregate value computed. HAVING can now compare `c` (the count per country) against 2 and discard any group below the threshold.

**Common wrong approach — alias in WHERE:**

```sql
-- Wrong: alias 'c' is not visible to WHERE
SELECT Country, COUNT(CustomerID) AS c
FROM Customers
WHERE c > 2
GROUP BY Country;
```

The alias exists only in the SELECT output, which is computed last. WHERE cannot reference it.

**Correct structure:**

```sql
-- WHERE filters individual rows before grouping (use it for non-aggregate conditions)
-- HAVING filters groups after aggregation
SELECT Country, COUNT(CustomerID) AS c
FROM Customers
WHERE Country LIKE 'A%'   -- optional: filter rows before grouping
GROUP BY Country
HAVING c > 2;             -- filter groups after COUNT runs
```

If you also want to restrict which rows enter the grouping (for example, only countries starting with 'A'), add a WHERE clause before GROUP BY. The two clauses serve different purposes and can coexist.
