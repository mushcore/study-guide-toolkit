---
n: 15
id: ajax-cors
title: "AJAX and CORS — server configuration practice"
lang: js
tags: [AJAX, CORS, XMLHttpRequest, readyState]
source: "Slide 5, ISAQuiz7"
related: [nodejs-basics, nodejs-modules]
kind: code
---

## Prompt

The Slide 5 AJAX/CORS flow — client sends a GET request, server responds with the `Access-Control-Allow-Origin` header:

<svg xmlns="http://www.w3.org/2000/svg" width="640" height="200" font-family="monospace" font-size="13">
  <rect x="20" y="60" width="160" height="80" rx="6" fill="#e8f4fd" stroke="#2980b9" stroke-width="2"/>
  <text x="100" y="96" text-anchor="middle" font-weight="bold">Client</text>
  <text x="100" y="114" text-anchor="middle" font-size="11">(ajax.html)</text>
  <text x="100" y="132" text-anchor="middle" font-size="10" fill="#555">XMLHttpRequest</text>
  <line x1="180" y1="90" x2="380" y2="90" stroke="#555" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="280" y="82" text-anchor="middle" font-size="11">GET /api/hello</text>
  <line x1="380" y1="110" x2="180" y2="110" stroke="#27ae60" stroke-width="1.5" marker-end="url(#arrow-green)"/>
  <text x="280" y="128" text-anchor="middle" font-size="11" fill="#27ae60">Access-Control-Allow-Origin: *</text>
  <rect x="380" y="60" width="160" height="80" rx="6" fill="#eafaf1" stroke="#27ae60" stroke-width="2"/>
  <text x="460" y="96" text-anchor="middle" font-weight="bold">Server</text>
  <text x="460" y="114" text-anchor="middle" font-size="11">(app.js)</text>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
    </marker>
    <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#27ae60"/>
    </marker>
  </defs>
</svg>

Complete the Node.js HTTP server below so that:

1. It handles `GET /api/hello` and responds with `{ "message": "Hello" }`.
2. It sets the correct CORS header so **any** origin can read the response.
3. It handles the OPTIONS preflight and responds with status 204.

Your server must use `res` (not `req`) for all response operations.

## Starter

```js
const http = require("http");

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": /* ??? */,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/hello") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": /* ??? */,
    });
    /* write the response body here */
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
```

## Solution

```js
const http = require("http");

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/hello") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(JSON.stringify({ message: "Hello" }));
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
```

## Why

**`"*"` in `Access-Control-Allow-Origin`**: tells the browser any origin may read this response. Without this header the browser receives the response but withholds it from the script, logging a CORS error. The server received the request either way — SOP only prevents the *script* from accessing the response.

**`res` not `req`**: `http.createServer` provides `(req, res)`. `req` is the incoming readable stream; it carries the client's data. `res` is the outgoing writable stream; `writeHead`, `write`, and `end` all belong on `res`. Calling `req.writeHead(...)` throws immediately because `req` has no such method. This is the most common exam trap for ISAQuiz7 Q4.

**`readyState == 4` not `== 5`**: `readyState` spans 0–4. DONE is 4. Code that checks `readyState == 5` never fires because that state does not exist.

**Preflight (OPTIONS) response with 204**: the browser expects a successful (2xx) response to its OPTIONS preflight before it sends the real request. Returning 404 or omitting CORS headers on OPTIONS causes the browser to abort the entire flow without the actual GET ever executing.
