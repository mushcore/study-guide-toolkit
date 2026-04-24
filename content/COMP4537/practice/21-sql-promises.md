---
n: 21
id: sql-promises
title: "Promise-chained SQL: check existence then update"
lang: js
tags: [promises, mysql, async-db, chaining]
source: "Slide 11"
pedagogy: worked-example-first
kind: code
---

## Prompt

Implement a `PUT /patients/:id` handler that does the following:

1. Checks if the patient exists by running a SELECT query against the `patient` table.
2. Rejects with an error (`'Patient not found'`) if the SELECT returns no rows.
3. Updates the patient's `name` field using an UPDATE query if the row exists.

Use `mysql.promise()` to get a promise-based connection and `async/await` to sequence the two queries. Return the UPDATE result object.

---

## Starter

```js
const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Connection is already established — do not modify.
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

const promiseCon = con.promise();

// TODO: implement this function.
// It must:
//   1. SELECT the patient row by patientid
//   2. Throw an error with message 'Patient not found' if no row is returned
//   3. UPDATE the patient's name
//   4. Return the UPDATE result
async function updatePatient(patientId, newName) {
  // your code here
}

app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await updatePatient(id, name);
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.listen(3000);
```

---

## Solution

```js
const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

const promiseCon = con.promise();

async function updatePatient(patientId, newName) {
  // Step 1: check existence
  const [rows] = await promiseCon.query(
    'SELECT * FROM patient WHERE patientid = ?',
    [patientId]
  );

  // Step 2: reject if not found
  if (rows.length === 0) {
    throw new Error('Patient not found');
  }

  // Step 3: update the name
  const [result] = await promiseCon.query(
    'UPDATE patient SET name = ? WHERE patientid = ?',
    [newName, patientId]
  );

  // Step 4: return the UPDATE result
  return result;
}

app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await updatePatient(id, name);
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.listen(3000);
```

---

## Why

**The check must happen before the update.**
The SELECT confirms the row exists at the application layer before any write occurs. Without it, an UPDATE on a nonexistent `patientid` returns `affectedRows: 0` silently — the caller receives a success-looking response for a no-op. Checking first allows the server to return a meaningful 404.

**Why `mysql.promise()` over callback nesting.**
`promiseCon.query()` returns a Promise. Each `await` suspends `updatePatient` until that Promise settles, so the second query only starts after the first resolves. The equivalent callback pattern nests the UPDATE callback inside the SELECT callback — manageable for two queries, but error handling duplicates at every nesting level and the indentation grows with every additional query. A single `try/catch` on the `async` function covers all errors from both queries.

**Common wrong approach: firing both queries without awaiting.**
```js
// Wrong — no ordering guarantee
promiseCon.query('SELECT * FROM patient WHERE patientid = ?', [patientId]);
promiseCon.query('UPDATE patient SET name = ? WHERE patientid = ?', [newName, patientId]);
```
Both queries enter the MySQL queue simultaneously. The UPDATE executes before the SELECT result arrives. The existence check never runs, and the function returns `undefined` instead of the UPDATE result. This is a race condition.
