---
n: 17
id: nodejs-modules
title: "Node.js file server — http, url, fs"
lang: js
tags: [modules, require, http, url, fs]
source: "Slide 4, ISAQuiz7"
related: [nodejs-basics, express-framework]
kind: code
---

## Prompt

A client browser sends this request to your Node.js server:

```
GET http://localhost:8000/admin.html?user=123 HTTP/1.1
```

Visualized as URL parts — `pathname` vs `path` is the key distinction (ISAQuiz7 Q3):

```
┌─────────────────────────────────────────────────────────────┐
│  http://localhost:8000/admin.html?user=123                  │
│  └──────┘ └────────────┘└──────────┘└────────┘             │
│  protocol     host       pathname    search                  │
│                                                              │
│  url.parse(req.url, true)                                    │
│  ├── .host      → 'localhost:8000'                          │
│  ├── .pathname  → '/admin.html'          ← use this         │
│  ├── .path      → '/admin.html?user=123' ← NOT this         │
│  ├── .search    → '?user=123'                               │
│  └── .query     → { user: '123' }                           │
└─────────────────────────────────────────────────────────────┘
```

Write a Node.js HTTP server that:

1. Parses the incoming request URL using the `url` module to extract the **pathname only** (not the full path with query string).
2. Attempts to read the file at that pathname using `fs.readFile`.
3. If the file exists, responds with HTTP 200 and the file contents.
4. If the file does not exist, responds with HTTP 404 and the text `'404 Not Found'`.
5. Listens on port 8000.

## Starter

```js
const http = require('______');
const url = require('______');
const fs = require('______');

http.createServer(function(req, res) {
  // Step 1: parse the URL — get the pathname without the query string
  const q = url.parse(______, true);
  const filename = '.' + q.______;  // e.g. './admin.html'

  // Step 2: read the file
  fs.readFile(filename, function(err, data) {
    if (err) {
      // Step 3a: file not found
      res.______(404, { 'Content-Type': 'text/html' });
      res.end('404 Not Found');
      return;
    }
    // Step 3b: file found
    res.______(200, { 'Content-Type': 'text/html' });
    res.______(data);
    res.end();
  });

}).______; // Step 4: bind to port 8000
```

## Solution

```js
const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer(function(req, res) {
  // Step 1: parse the URL — pathname gives path WITHOUT query string
  const q = url.parse(req.url, true);
  const filename = '.' + q.pathname;  // e.g. './admin.html'

  // Step 2: read the file asynchronously
  fs.readFile(filename, function(err, data) {
    if (err) {
      // Step 3a: file does not exist — send 404
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404 Not Found');
      return;  // stop here — prevents res.end() from being called twice
    }
    // Step 3b: file found — send its contents
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });

}).listen(8000);
```

## Why

**Why `pathname` and not `path`?**

`url.parse()` splits the URL into components. `path` includes the query string: `/admin.html?user=123`. `pathname` stops before the `?`: `/admin.html`. The file on disk is named `admin.html`, not `admin.html?user=123`. Using `path` as the filename causes `fs.readFile` to fail even when the file exists — you get an unnecessary 404. (ISAQuiz7 Q3 tests exactly this distinction.)

**Why `res` and not `req`?**

`req` is the `IncomingMessage` object — it carries data arriving from the client (URL, headers, body). `res` is the `ServerResponse` object — it is the writable stream that sends data back to the client. `res.writeHead`, `res.write`, and `res.end` are the only methods that put bytes on the wire to the browser. `req.writeHead` does not exist; calling it throws `TypeError: req.writeHead is not a function`. (ISAQuiz7 Q4 presents a version of the server using `req` as the distractor.)

**Why do you need `.listen(8000)`?**

`http.createServer()` returns a server object but does not bind it to any port. Without `.listen()`, the Node.js process has no open handles and exits immediately. No requests can arrive if the server is not listening.

**Common wrong answers from ISAQuiz7:**

| Wrong | Why it is wrong |
|-------|-----------------|
| Use `q.path` as filename | Includes query string — file lookup always fails |
| Write response with `req.writeHead` | req has no writeHead — TypeError at runtime |
| Pass port number inside `writeHead` | writeHead takes status code and headers, not a port |
| Omit `.listen()` | Server exits immediately, never accepts connections |
