---
n: 24
id: sql-crud
title: "SQL CRUD: querying and modifying data"
hook: "SELECT, INSERT, UPDATE, DELETE — four operations that cover everything you do to a relational DB."
tags: [SQL, SELECT, INSERT, UPDATE, DELETE, WHERE, JOIN, CRUD, GROUP-BY, subquery]
module: "Databases and CRUD"
priority: mid
source: "Slide 5, Slide 7, Quiz 10"
bloom_levels: [remember, understand, apply]
related: [db-relational-design, nodejs-db-connect, sql-promises]
---

## The Cartesian problem

Run `SELECT * FROM patient, visit` and you get every patient row paired with every visit row. Three patients and three visits produce nine rows — most of them nonsense.

```sql
-- Wrong: Cartesian product (3 × 3 = 9 rows)
SELECT * FROM patient, visit;

-- Right: equi-join on matching patientid (3 matched rows)
SELECT * FROM patient, visit
WHERE patient.patientid = visit.patientid;
```

The WHERE clause constrains the join. Without it, the database pairs every row in the left table with every row in the right table — this is called a Cartesian product.

---

## SELECT: reading rows

> **Example**
> Find all countries with more than 2 customers. Step 1: `SELECT Country, COUNT(CustomerID) FROM Customers GROUP BY Country` groups rows by country. Step 2: add `HAVING COUNT(CustomerID) > 2` to keep only groups where the count exceeds 2. The WHERE clause cannot do this — it fires before grouping, so the count doesn't exist yet.

`SELECT *` retrieves every column. List specific column names to retrieve only what you need.

```sql
SELECT * FROM Customers;
SELECT CustomerName FROM Customers;
SELECT DISTINCT Country FROM Customers;
```

`DISTINCT` drops duplicate values from the result. If ten customers share the same country, `DISTINCT Country` returns that country once.

Filter rows with `WHERE`:

```sql
SELECT * FROM Customers WHERE Country = 'Mexico';
SELECT CustomerName FROM Customers WHERE City = 'London';
```

WHERE operators include `=`, `BETWEEN`, `LIKE`, and `IN`. SQL keywords are not case-sensitive — `selEct` and `SELECT` are identical. Table names are also case-insensitive.

> **Q:** What does `SELECT DISTINCT Country FROM Customers` return when 50 customers share 5 countries?
> **A:** Five rows — one per unique country value.

---

## INSERT: adding rows

```sql
INSERT INTO patient VALUES
  (1, 'Sara Brown'),
  (2, 'John Smith'),
  (3, 'Jack Ma');

INSERT INTO visit VALUES
  (1, 1, '2002-01-01'),
  (2, 2, '2018-08-08'),
  (3, 2, '2019-09-09');
```

A single INSERT can load multiple rows at once by separating value tuples with commas.

---

## GROUP BY and HAVING

GROUP BY collapses rows into groups, letting aggregate functions like `COUNT` operate per group.

```sql
SELECT Country, COUNT(CustomerID)
FROM Customers
GROUP BY Country;
```

Filter groups with HAVING — not WHERE. WHERE runs before grouping and cannot see aggregate results.

```sql
-- Wrong: WHERE cannot reference an aggregate alias
SELECT Country, COUNT(CustomerID) AS c
FROM Customers
WHERE c > 2
GROUP BY Country;

-- Right: HAVING runs after grouping
SELECT Country, COUNT(CustomerID) AS c
FROM Customers
GROUP BY Country
HAVING c > 2;

-- Wrong: WHERE must come BEFORE GROUP BY
SELECT Country, COUNT(CustomerID)
FROM Customers
GROUP BY Country
WHERE Country LIKE 'A%';

-- Right: WHERE before GROUP BY, HAVING after
SELECT Country, COUNT(CustomerID)
FROM Customers
WHERE Country LIKE 'A%'
GROUP BY Country;
```

> **Pitfall**
> Placing WHERE after GROUP BY is a syntax error. Filtering on an aggregate with WHERE (instead of HAVING) also fails — the database evaluates WHERE before it computes the aggregate.

Clause order: `SELECT → FROM → WHERE → GROUP BY → HAVING`.

> **Q:** You want countries where customer count exceeds 10. Which clause does the filtering?
> **A:** HAVING — because the count is an aggregate computed after GROUP BY.

---

## Subqueries

A subquery is a SELECT inside another SELECT. It runs first and passes its result to the outer query.

```sql
-- All products priced above the average
SELECT * FROM Products
WHERE price > (SELECT AVG(price) FROM Products);

-- The most expensive product(s)
SELECT * FROM Products
WHERE price = (SELECT MAX(price) FROM Products);
```

Use `=` for a subquery that returns one value and `IN` when it returns a set. The MAX example uses `=` but uses `=` correctly only when exactly one row holds the maximum price — use `IN` if ties are possible.

---

## LIKE wildcard

`LIKE` matches patterns. `%` matches zero or more characters; `_` matches exactly one.

```sql
SELECT * FROM Customers WHERE Country LIKE 'A%';
```

This returns every country starting with 'A'.

---

> **Takeaway:** Four rules prevent most SQL mistakes: join with a WHERE condition (not a bare comma), use HAVING (not WHERE) on aggregates, put WHERE before GROUP BY, and wrap subquery comparisons in `=` or `IN` depending on whether the subquery returns one value or many.
