---
id: nodejs-db-connect
title: "Deep dive: Node.js MySQL — module setup, connection lifecycle, and hosting"
priority: mid
source: "Slide 5, Slide 7, Quiz 7"
bloom_levels: [understand, apply]
related: [sql-crud, sql-promises, nodejs-modules]
---

# Deep dive: Node.js MySQL — module setup, connection lifecycle, and hosting

Start with a concrete example. Slide 5 shows this exact insert:

```js
con.query('INSERT INTO score (name, score) VALUES ("Elon Musk", 100)', function(err, result) {
  if (err) throw err;
  console.log('Record inserted');
});
```

That single call hides three prior steps. Understanding each one prevents the most common errors.

## The connection lifecycle, step by step

**Example: `createConnection → connect → query`**

```js
const mysql = require('mysql');                    // 1. Load external module

const con = mysql.createConnection({               // 2. Build config object (no network activity yet)
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'mydb'
});

con.connect(function(err) {                        // 3. Open socket to MySQL; callback fires on success or error
  if (err) throw err;
  console.log('Connected!');

  con.query('INSERT INTO score (name, score) VALUES ("Elon Musk", 100)', function(err, result) {
    // 4. SQL sent; result available HERE — not outside this function
    if (err) throw err;
    console.log('Record inserted');
  });
});
```

What each step produces:

| Step | Call | Effect |
|---|---|---|
| 1 | `require('mysql')` | Module object loaded from `node_modules/` |
| 2 | `createConnection({...})` | Config object created — no network connection |
| 3 | `con.connect(cb)` | TCP socket opened to MySQL; callback fires when ready |
| 4 | `con.query(sql, cb)` | SQL sent; callback fires with `(err, result)` when DB responds |

`con.query` is asynchronous. Any code after `con.query(...)` but outside the callback runs before the database responds. Accessing `result` there always yields `undefined`.

## AUTO_INCREMENT: skip the primary key on INSERT

When a column is declared `AUTO_INCREMENT`, MySQL assigns the next unique integer automatically. The Slide 7 `patient` table uses this:

```sql
CREATE TABLE patient (
  patientid INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100),
  PRIMARY KEY (patientid)
);
```

An INSERT that omits `patientid` is correct — not an error:

```js
con.query("INSERT INTO patient (name) VALUES ('Ada Lovelace')", function(err, result) {
  if (err) throw err;
  console.log('Patient added, id:', result.insertId);
});
```

`result.insertId` gives you the generated key without you ever having to specify or track it.

## phpMyAdmin vs command-line

XAMPP gives you two ways to manage MySQL locally:

- **phpMyAdmin** — browser-based at `http://localhost/phpmyadmin/`. Create databases and tables through forms; run SQL from the SQL tab and press GO. Useful for inspecting table structure and verifying inserts visually.
- **MySQL command-line client** — type SQL directly in a terminal session (`mysql -u root`). Faster for scripted operations; requires no browser.

Both reach the same underlying MySQL engine. phpMyAdmin requires PHP, which XAMPP also installs. The command-line client ships with MySQL itself.

> **Pitfall** `mysql` is NOT a built-in Node.js module (Quiz 7 Q1). Built-in modules — `url`, `http`, `fs`, `path`, `os` — are available immediately via `require`. The `mysql` package must be installed first: `npm install mysql`. Skipping this step causes a "Cannot find module" crash at startup.

> **Pitfall** Placing `mysql.createConnection({...})` in a client-side JavaScript file (loaded in the browser) exposes your database username and password in plain text to every visitor (Quiz 7 Q9). DB connection code runs only on the server. The browser sends HTTP requests to your Node.js server; your server talks to MySQL. The client never holds credentials.

## cPanel hosting: moving from localhost to production

On a shared cPanel host, the workflow has three changes from local development:

1. **Create a DB user in cPanel** — use the MySQL Databases panel to create a user and assign it to your database with the required privileges (SELECT, INSERT, UPDATE, DELETE at minimum).
2. **Note the remote host value** — cPanel provides the database hostname (often something like `yourdomain.com` or an internal host string). Replace `'localhost'` in `createConnection` with that value.
3. **Deploy your Node.js app** — the connection config is the only line that changes:

```js
const con = mysql.createConnection({
  host: 'your-cpanel-db-host',   // changed from 'localhost'
  user: 'cpanel_dbuser',
  password: 'cpanel_password',
  database: 'cpanel_dbname'
});
```

The rest of the connect-and-query pattern is identical to local development.
