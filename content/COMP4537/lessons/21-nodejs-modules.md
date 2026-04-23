---
n: 21
id: nodejs-modules
title: "Node.js built-in modules: http, url, fs"
hook: "Three modules, one file server — here's how http, url, and fs work together."
tags: [modules, require, http, url, fs, npm]
module: "Node.js and Server-Side Development"
bloom_levels: [remember, understand, apply, analyze]
source: "Slide 4, Slide 11, Quiz 7"
related: [nodejs-basics, express-framework, rest-anatomy]
---

## What is a module?

You want your Node.js server to parse a URL and return a file. You need three built-in modules to do it.

A module is a set of functions you include in your application — like a JavaScript library. Node.js ships with built-in modules you can use immediately. You also write custom modules and install external ones via npm.

To load any module, use `require`:

```js
// Built-in module
const http = require('http');

// Custom module (relative path with ./)
const math = require('./math');

// External module (installed via npm)
const express = require('express');
```

Custom modules expose functions using `exports` or `module.exports`:

```js
// math.js
exports.area = function(r) {
  return Math.PI * r * r;
};
```

## Module overview

| Module | Role | Key method |
|--------|------|------------|
| `http` | Create HTTP servers | `http.createServer(callback).listen(port)` |
| `url` | Parse URL strings into parts | `url.parse(urlString, true)` |
| `fs` | Read and write files | `fs.readFile(path, callback)` |

## http — create a web server

`http.createServer` accepts a callback with two arguments: `req` (the incoming request) and `res` (the response you send back).

```js
const http = require('http');

http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('Hello World');
  res.end();
}).listen(8080);
```

Three response methods:
- `res.writeHead(statusCode, headers)` — sets the HTTP status and content-type header
- `res.write(data)` — writes a chunk of response body
- `res.end()` — signals the response is complete; **required**

> **Pitfall**
> `req` is the **incoming** request object. `res` is the **outgoing** response object. Writing `req.writeHead()` or `req.write()` does nothing — those methods do not exist on the request. Always send data using `res`. (ISAQuiz7 Q4)

## url — parse URL strings

`url.parse(urlString, true)` breaks a URL string into its components. The second argument `true` parses the query string into an object.

```js
const url = require('url');
const adr = 'http://localhost:8888/default.htm?name=John&age=23';
const q = url.parse(adr, true);

console.log(q.host);      // 'localhost:8888'
console.log(q.pathname);  // '/default.htm'
console.log(q.search);    // '?name=John&age=23'
console.log(q.query);     // { name: 'John', age: '23' }
console.log(q.query.name); // 'John'
```

> **Q:** Which property of `url.parse()` gives you just the path, without the query string?
>
> **A:** `pathname`. For `http://localhost:8000/admin.html?user=123`, `pathname` returns `/admin.html`. `path` returns `/admin.html?user=123` — it includes the query string.

> **Pitfall**
> `parsed.path` includes the query string. `parsed.pathname` does not. The exam uses exactly this distinction: ISAQuiz7 Q3 asks what `parsed.pathname` returns for `http://localhost:8000/admin.html?user=123` — the correct answer is `/admin.html`, not `/admin.html?user=123`. Selecting `parsed.path` is the common wrong answer.

## fs — read files from disk

`fs.readFile` reads a file asynchronously. The callback receives an error (if any) and the file data.

```js
const fs = require('fs');

fs.readFile('index.html', function(err, data) {
  if (err) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404 Not Found');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(data);
  res.end();
});
```

Always check `err` first. If the file does not exist, send a 404 and stop — `return` prevents `res.end()` from being called twice.

## npm and external modules

Built-in modules (`http`, `url`, `fs`) need no installation. External modules do.

```bash
npm install mysql
npm install express
# shorthand
npm i express
```

`npm init --yes` creates a `package.json` file that records project metadata and installed module versions. Every project has one.

```js
// External module after npm install
const express = require('express');
```

Environment variables are available through `process.env`:

```js
const port = process.env.PORT;  // undefined if not set
```

> **Takeaway**
> Three built-in modules cover the core of a Node.js file server: `http` creates the server, `url` parses the request URL, and `fs` reads the file. Use `pathname` (not `path`) to get the route, and always write the response through `res` (not `req`). External modules like mysql and express require `npm install` first.
