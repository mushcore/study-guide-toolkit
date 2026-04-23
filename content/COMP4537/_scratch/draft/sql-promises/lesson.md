---
n: 25
id: sql-promises
title: "Async DB queries with promises: chaining successive SQL calls"
hook: "You can't run an UPDATE before confirming the row exists — promises enforce that order."
tags: [promises, async-db, mysql, chaining, successive-queries]
module: "Databases and CRUD"
priority: high
source: "Slide 11"
bloom_levels: [understand, apply, analyze]
related: [nodejs-db-connect, promises-basics, promise-chaining]
---

## The problem: two queries that must run in order

A `PUT /patients/:id` route needs to do two things: confirm the patient record exists, then update it. You cannot fire the UPDATE first — you risk modifying a nonexistent row or returning a misleading success response.

That ordering constraint is not free. The `mysql` module's default query API is callback-based and does not wait for one query to finish before the next starts.

## Callback nesting: it works, but it compounds

The callback approach wraps the UPDATE inside the SELECT callback so the second query only runs after the first resolves.

```js
const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

function checkAndUpdate(patientId, newName) {
  return new Promise((resolve, reject) => {
    con.query(
      'SELECT * FROM patient WHERE patientid = ?',
      [patientId],
      (err, rows) => {
        if (err) return reject(err);
        if (rows.length === 0) return reject(new Error('Patient not found'));

        con.query(
          'UPDATE patient SET name = ? WHERE patientid = ?',
          [newName, patientId],
          (err2, result) => {
            if (err2) return reject(err2);
            resolve(result);
          }
        );
      }
    );
  });
}
```

Two levels of nesting are manageable. Add a third query — say, log the change to an audit table — and the nesting grows into "callback hell": hard to read, hard to handle errors uniformly.

## mysql.promise(): convert the connection to promise-based

`mysql` exposes a `.promise()` method on any connection object. Calling `con.promise()` returns a promise-based wrapper around the same underlying connection. Every `query()` call on that wrapper returns a Promise instead of taking a callback.

```js
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

const promiseCon = con.promise();
```

`promiseCon.query(sql, params)` resolves with `[rows, fields]` — a two-element array. Destructure the first element to access the result rows:

```js
const [rows] = await promiseCon.query('SELECT * FROM patient WHERE patientid = ?', [id]);
```

## .then() chaining: SELECT then UPDATE

With a promise-based connection, chain `.then()` calls to enforce the ordering constraint explicitly.

```js
promiseCon
  .query('SELECT * FROM patient WHERE patientid = ?', [patientId])
  .then(([rows]) => {
    if (rows.length === 0) throw new Error('Patient not found');
    return promiseCon.query(
      'UPDATE patient SET name = ? WHERE patientid = ?',
      [newName, patientId]
    );
  })
  .then(([result]) => {
    console.log('Updated rows:', result.affectedRows);
  })
  .catch(err => {
    console.error('DB error:', err.message);
  });
```

Each `.then()` receives the resolved value of the previous promise. Throwing inside `.then()` skips remaining `.then()` handlers and jumps to `.catch()`.

> **Q:** What does `promiseCon.query()` resolve with, and how do you extract just the rows?
> **A:** It resolves with `[rows, fields]`. Destructure the first element: `const [rows] = await promiseCon.query(...)`.

## async/await equivalent

`async/await` is syntactic sugar over `.then()` chaining. The ordering guarantee is identical.

```js
async function updateIfExists(patientId, newName) {
  const [rows] = await promiseCon.query(
    'SELECT * FROM patient WHERE patientid = ?',
    [patientId]
  );
  if (rows.length === 0) throw new Error('Patient not found');

  const [result] = await promiseCon.query(
    'UPDATE patient SET name = ? WHERE patientid = ?',
    [newName, patientId]
  );
  return result;
}
```

`await` suspends `updateIfExists` until the Promise settles. Execution resumes at the next line only after the query resolves.

> **Q:** Why does `async/await` enforce query ordering where a plain fire-and-forget approach does not?
> **A:** `await` pauses the function until the awaited Promise settles. The next query only starts after the previous one has resolved.

> **Pitfall:** Firing the UPDATE without awaiting the SELECT produces a race condition. Both queries enter the MySQL queue simultaneously. The UPDATE executes before the SELECT result arrives. You skip the existence check entirely and write to a row that may not exist — with no error thrown.

> **Takeaway:** Use `con.promise()` to get a promise-based query interface, then chain `.then()` or `await` successive queries to guarantee ordering. Two SQL statements that depend on each other's results always need explicit sequencing.
