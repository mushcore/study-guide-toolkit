---
id: sql-promises
title: "Deep dive: promise-chained SQL queries in Node.js"
priority: high
source: "Slide 11"
bloom_levels: [understand, apply, analyze]
related: [nodejs-db-connect, promises-basics, promise-chaining]
---

## Concrete scenario: the API stat update

One recurring pattern in the course API: a route needs to READ a resource's current stat value before it can UPDATE it. Fetch the row — confirm it exists and get its current value — then write the new value back.

You cannot compute the new stat without the old one. You cannot update what you have not confirmed exists. These two SQL statements must run sequentially, and the result of the first determines what the second writes.

This is the general "read-then-write" pattern: present throughout any API that enforces application-level referential integrity.

## Why the default callback API is insufficient for chaining

`mysql`'s default `query()` takes a callback: `con.query(sql, params, callback)`. To sequence two queries with callbacks, you nest the second inside the first's callback.

That nesting compounds. A three-query chain looks like this:

```js
con.query(sql1, params1, (err1, rows1) => {
  // handle err1
  con.query(sql2, params2, (err2, rows2) => {
    // handle err2
    con.query(sql3, params3, (err3, result) => {
      // handle err3
      // finally done
    });
  });
});
```

> **Pitfall:** Callback nesting beyond two levels produces "callback hell" — error handling duplicates at every level, indentation grows horizontally, and control flow is hard to follow. A single `.catch()` on a promise chain replaces all those scattered `if (err) return` checks.

## mysql.promise(): what it returns and why destructuring matters

`con.promise()` wraps the existing connection and returns an object with the same API, but every `query()` call returns a Promise instead of accepting a callback.

That Promise resolves with `[rows, fields]` — a two-element array. The `fields` element contains column metadata. For most application logic you only want `rows`. Destructure on the left side of `await` or inside `.then()`:

```js
const [rows] = await promiseCon.query('SELECT * FROM patient WHERE patientid = ?', [id]);
// rows is the array of result objects
// fields is discarded
```

Omitting the destructure and writing `const result = await promiseCon.query(...)` gives you the whole `[rows, fields]` array. Then `result[0]` is `rows` and `result[1]` is `fields`. Destructuring is just shorthand.

## Worked example: step-by-step trace of the SELECT → UPDATE chain

**Example:** The stat update flow.

```js
const con = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'mydb' });
const promiseCon = con.promise();

promiseCon
  .query('SELECT * FROM patient WHERE patientid = ?', [42])   // Step 1
  .then(([rows]) => {                                          // Step 2
    // rows = [{ patientid: 42, name: 'Ada', ... }]
    if (rows.length === 0) throw new Error('Patient not found');
    return promiseCon.query(                                   // Step 3
      'UPDATE patient SET name = ? WHERE patientid = ?',
      ['Ada Lovelace', 42]
    );
  })
  .then(([result]) => {                                        // Step 4
    // result = { affectedRows: 1, changedRows: 1, ... }
    console.log('Done:', result.affectedRows, 'row(s) updated');
  })
  .catch(err => {                                              // Step 5
    console.error(err.message);
  });
```

Trace:

1. `promiseCon.query(SELECT ...)` enters the MySQL queue. The Node.js event loop continues.
2. MySQL responds. The Promise settles as fulfilled. The `.then(([rows]) => ...)` handler enters the microtask queue and runs after the synchronous stack empties.
3. Inside the handler, `rows` is `[{ patientid: 42, name: 'Ada', ... }]`. Length is 1, so the throw is skipped. `return promiseCon.query(UPDATE ...)` issues the second query and returns a new Promise.
4. The second Promise settles. The next `.then(([result]) => ...)` handler runs. `result.affectedRows` is `1`.
5. If any step throws, the `.catch()` handler runs. One handler covers all error cases in the chain.

## Connection to bcrypt

`bcrypt.hash()` is async and returns a Promise — the same pattern applies when hashing a password before INSERT. Chain `.then()` after `bcrypt.hash()` resolves, then call `promiseCon.query(INSERT ...)` inside that handler. The hash is guaranteed to be complete before the DB write starts.

```js
bcrypt.hash(plainPassword, saltRounds)
  .then(hash => promiseCon.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, hash]))
  .then(([result]) => { /* user created */ })
  .catch(err => { /* handle */ });
```

The Promise chain composes any async operation — not just SQL queries.
