---
n: 26
id: nodejs-db-connect
title: "Node.js MySQL connection: setup, query, and hosting"
hook: "mysql is not built-in — three steps connect your Node.js server to a relational database."
tags: [mysql, nodejs, npm, XAMPP, phpMyAdmin, cPanel, hosting]
module: "Databases and CRUD"
priority: mid
source: "Slide 5, Slide 7, Quiz 7"
bloom_levels: [remember, understand, apply]
related: [sql-crud, sql-promises, nodejs-modules]
---

Your Node.js server needs to store and retrieve data. MySQL runs the database, but Node.js cannot talk to it without a dedicated module. The `mysql` package bridges that gap.

## The three-step connection pattern

> **Example**
> Slide 5 shows this exact sequence: `npm install mysql` → `mysql.createConnection({host, user, password, database})` → `con.connect(cb)` → `con.query(sql, cb)` where the INSERT result is only accessible inside the callback. Each step depends on the previous completing successfully.

Unlike `http`, `fs`, or `path`, the `mysql` module is not built into Node.js. Run `npm install mysql` in your project directory before anything else.

Once installed, the pattern has three steps:

**Step 1 — Install and require**

```js
const mysql = require('mysql');
```

**Step 2 — Create a connection object**

```js
const con = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'mydb'
});
```

**Step 3 — Connect, then query inside the callback**

```js
con.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');

  con.query('INSERT INTO score (name, score) VALUES ("Elon Musk", 100)', function(err, result) {
    if (err) throw err;
    console.log('Record inserted');
  });
});
```

Results from `con.query()` are only available inside its callback. The query is asynchronous — code on the line after `con.query(...)` runs before the database responds.

## XAMPP: one-click local MySQL

XAMPP installs two things at once: the MySQL database engine, and phpMyAdmin — a web-based admin tool that runs on PHP. Start MySQL from the XAMPP control panel, then click Admin to open `http://localhost/phpmyadmin/`. From there you can create databases, create tables, and run raw SQL from the SQL tab.

Slide 7 demonstrates creating a `patient` table visually in phpMyAdmin. The `AUTO_INCREMENT` attribute lets MySQL assign a unique `patientid` automatically on each INSERT — you do not supply that column value yourself.

## Credentials belong on the server, never the client

> **Pitfall** The `mysql` module is an **external** module — it does not ship with Node.js. Forgetting `npm install mysql` causes a "Cannot find module" error at runtime. `url`, `http`, `fs`, `path`, and `os` ARE built-in; `mysql` is NOT.

Placing your database connection code in client-side JavaScript exposes your username and password to anyone who views the page source. Always run `mysql` connection logic inside your server-side Node.js file. The browser never sees it.

> **Q:** You try `const mysql = require('mysql')` and Node.js throws "Cannot find module 'mysql'". What is the most likely cause?
> **A:** The `mysql` package has not been installed. Run `npm install mysql` in the project directory first.

> **Q:** A query returns `undefined` when you try to log `result` on the line after `con.query(...)`. Why?
> **A:** `con.query` is asynchronous. `result` is only defined inside the callback function — it does not exist yet on the next synchronous line.

## Hosting on cPanel

To deploy to shared hosting, create a database user in cPanel, assign it privileges on your database, then update the `host` value in `createConnection` from `'localhost'` to your remote database host. The rest of the connection pattern stays the same.

For local development, `nodemon` (installed via `npm install nodemon`) restarts the Node.js process automatically when you save a file. Regular `node` does not restart on changes.

> **Takeaway** Three steps connect Node.js to MySQL: `npm install mysql`, `mysql.createConnection({...})`, then `con.connect()` with all queries nested inside its callback. Keep credentials server-side. Use XAMPP locally, cPanel for production hosting.
