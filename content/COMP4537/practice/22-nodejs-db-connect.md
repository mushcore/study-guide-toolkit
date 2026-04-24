---
n: 22
id: nodejs-db-connect
title: "Connect Node.js to MySQL and insert a record"
lang: js
tags: [mysql, nodejs, npm, CRUD]
source: "Slide 5, Quiz 7"
pedagogy: worked-example-first
kind: code
---

# Connect Node.js to MySQL and insert a record

## Prompt

Write a Node.js script that connects to a local MySQL database named `clinic` and inserts a new patient record (name: `'Ada Lovelace'`) into the `patient` table. Assume XAMPP is running and the table already exists with columns `patientid` (AUTO_INCREMENT) and `name`.

## Starter

```js
const mysql = require('mysql');

// Step 1: create the connection object
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clinic'
});

// Step 2: connect to MySQL — add the connect() call here

  // Step 3: insert a patient named 'Ada Lovelace' — add the query() call here

```

## Solution

```js
const mysql = require('mysql');

// Step 1: create the connection object
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clinic'
});

// Step 2: open the connection
con.connect(function(err) {
  if (err) throw err;
  console.log('Connected to clinic database.');

  // Step 3: insert a new patient — patientid is omitted because it is AUTO_INCREMENT
  con.query(
    "INSERT INTO patient (name) VALUES ('Ada Lovelace')",
    function(err, result) {
      if (err) throw err;
      console.log('Patient inserted. New patientid:', result.insertId);
    }
  );
});
```

## Why

**Why does `mysql` need `npm install`?**
`mysql` is an external package — it does not ship with Node.js. Built-in modules like `http`, `fs`, and `path` are available immediately via `require`. The `mysql` package must be added to your project first: run `npm install mysql` in the project directory. Skipping this step causes a "Cannot find module 'mysql'" crash when the script starts.

**Why is `patientid` omitted from the INSERT?**
The `patientid` column is declared `AUTO_INCREMENT`. MySQL assigns the next unique integer automatically on every INSERT. You do not supply that value — supplying it would override the counter and risk collisions. `result.insertId` inside the callback gives you the generated id if you need it.

**Common wrong approach — accessing the result outside the callback:**

```js
con.query("INSERT INTO patient (name) VALUES ('Ada Lovelace')", function(err, result) {
  // result is available here
});
console.log(result); // WRONG — result is undefined here; the callback has not fired yet
```

`con.query` is asynchronous. Node.js sends the SQL to MySQL and immediately continues to the next synchronous line. The callback fires later, when MySQL responds. Any code that needs `result` must live inside the callback.
