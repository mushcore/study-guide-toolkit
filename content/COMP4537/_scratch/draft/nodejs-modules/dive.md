---
id: nodejs-modules
priority: mid
bloom_levels: [understand, apply, analyze]
source: "Slide 4, Slide 11, Quiz 7"
related: [nodejs-basics, express-framework, rest-anatomy]
---

# Topic Dive: Node.js Modules — Building a File Server

Build a file server that maps URL pathnames to files on disk, returns them if they exist, and sends a 404 if they do not. That single task exercises all three built-in modules: `http`, `url`, and `fs`.

---

> **Example — Complete file server (Slide 4, Example 6)**
>
> ```js
> const http = require('http');
> const url = require('url');
> const fs = require('fs');
>
> http.createServer(function(req, res) {
>   // Step 1: parse the incoming request URL
>   const q = url.parse(req.url, true);
>   const filename = '.' + q.pathname;  // e.g. './default.htm'
>
>   // Step 2: try to read the file
>   fs.readFile(filename, function(err, data) {
>     if (err) {
>       // Step 3a: file not found — send 404
>       res.writeHead(404, { 'Content-Type': 'text/html' });
>       res.end('404 Not Found');
>       return;
>     }
>     // Step 3b: file found — send contents
>     res.writeHead(200, { 'Content-Type': 'text/html' });
>     res.write(data);
>     res.end();
>   });
> }).listen(8080);
> ```
>
> **Step-by-step:**
> 1. `require` loads all three modules before the server starts.
> 2. `http.createServer` registers a callback — runs on every request.
> 3. `url.parse(req.url, true)` parses the raw URL string from the request into structured parts.
> 4. `q.pathname` extracts just the path (e.g. `/default.htm`) without the query string.
> 5. `fs.readFile` reads the file asynchronously. On error, sends 404 and returns. On success, sends the file data.
> 6. `.listen(8080)` binds the server to port 8080. Without this call, the server never accepts connections.

---

## pathname vs path — the exam trap

> **Pitfall (ISAQuiz7 Q3)**
>
> Given:
> ```js
> const url = require('url');
> const address = 'http://localhost:8000/admin.html?user=123';
> const parsed = url.parse(address, true);
> ```
>
> | Property | Value |
> |----------|-------|
> | `parsed.pathname` | `/admin.html` |
> | `parsed.path` | `/admin.html?user=123` |
> | `parsed.search` | `?user=123` |
> | `parsed.query` | `{ user: '123' }` |
>
> `pathname` stops before the `?`. `path` includes everything after the origin up to and including the query string. Using `parsed.path` as a filename means your server looks for a file named `/admin.html?user=123` — which does not exist, even if `/admin.html` does.

---

## req vs res — the other exam trap

> **Pitfall (ISAQuiz7 Q4)**
>
> `http.createServer` passes two objects to your callback:
> - `req` — the **incoming** request from the client. Read from it (URL, headers, body).
> - `res` — the **outgoing** response you build and send. Write to it (`writeHead`, `write`, `end`).
>
> Wrong:
> ```js
> req.writeHead(200, { 'Content-Type': 'text/html' }); // does nothing
> req.write('Hello');                                    // does nothing
> ```
>
> Correct:
> ```js
> res.writeHead(200, { 'Content-Type': 'text/html' });
> res.write('Hello');
> res.end();
> ```
>
> `req.writeHead` is not a function. Calling it throws a TypeError at runtime. The exam presents code using `req` methods as a distractor — mark it wrong immediately.

---

## Built-in vs external modules

| Module | Type | Requires install? | How to require |
|--------|------|-------------------|----------------|
| `http` | Built-in | No | `require('http')` |
| `url` | Built-in | No | `require('url')` |
| `fs` | Built-in | No | `require('fs')` |
| `mysql` | External | Yes — `npm install mysql` | `require('mysql')` |
| `express` | External | Yes — `npm install express` | `require('express')` |

Quiz 7 Q1: "Which is NOT a built-in module?" — answer is `mysql`. `http`, `url`, and `fs` ship with Node.js.

Custom modules use a relative path:

```js
require('./modules/math')   // works
require('./modules/math.js') // also works — .js extension optional
```

---

> **Takeaway**
> `pathname` gives you the clean path; `path` includes the query string. `res` sends the response; `req` reads the request. Built-in modules need no install; external modules need `npm install` and appear in `package.json`. The file-server pattern — `http` + `url.parse().pathname` + `fs.readFile` — is the canonical Node.js exam scenario.
