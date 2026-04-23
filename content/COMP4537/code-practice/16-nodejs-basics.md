---
n: 16
id: nodejs-basics
title: "Minimal non-blocking HTTP server"
lang: js
tags: [nodejs, http, non-blocking, server-scripting]
source: "Slide 4"
pedagogy: worked-example-first
---

## Prompt

The diagram below shows Node.js's three threading models side by side. Study it, then write a minimal Node.js HTTP server that responds with `"Hello from Node.js!"` without blocking the event loop.

<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="monospace" font-size="13">
  <!-- Example 1: Single-threaded non-blocking -->
  <rect x="10" y="10" width="210" height="200" rx="6" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5"/>
  <text x="115" y="32" text-anchor="middle" font-weight="bold" fill="#0369a1">Example 1</text>
  <text x="115" y="48" text-anchor="middle" font-size="11" fill="#0369a1">Single-threaded non-blocking</text>
  <rect x="25" y="58" width="80" height="24" rx="3" fill="#0ea5e9"/>
  <text x="65" y="74" text-anchor="middle" fill="white" font-size="11">1 Thread</text>
  <line x1="65" y1="82" x2="65" y2="105" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="4,2"/>
  <rect x="25" y="105" width="80" height="20" rx="3" fill="#bae6fd"/>
  <text x="65" y="119" text-anchor="middle" font-size="10" fill="#0369a1">Req 1 → OS</text>
  <line x1="115" y1="115" x2="175" y2="115" stroke="#64748b" stroke-width="1" marker-end="url(#arr)"/>
  <rect x="25" y="132" width="80" height="20" rx="3" fill="#bae6fd"/>
  <text x="65" y="146" text-anchor="middle" font-size="10" fill="#0369a1">Req 2 → OS</text>
  <rect x="25" y="158" width="80" height="20" rx="3" fill="#bae6fd"/>
  <text x="65" y="172" text-anchor="middle" font-size="10" fill="#0369a1">Req 3 → OS</text>
  <rect x="120" y="105" width="80" height="73" rx="3" fill="#e0f2fe"/>
  <text x="160" y="130" text-anchor="middle" font-size="10" fill="#0369a1">OS handles</text>
  <text x="160" y="144" text-anchor="middle" font-size="10" fill="#0369a1">all I/O</text>
  <text x="160" y="158" text-anchor="middle" font-size="10" fill="#0369a1">callbacks fire</text>
  <text x="160" y="172" text-anchor="middle" font-size="10" fill="#0369a1">when ready</text>

  <!-- Example 2: Single-threaded blocking -->
  <rect x="255" y="10" width="210" height="200" rx="6" fill="#fff7ed" stroke="#f97316" stroke-width="1.5"/>
  <text x="360" y="32" text-anchor="middle" font-weight="bold" fill="#c2410c">Example 2</text>
  <text x="360" y="48" text-anchor="middle" font-size="11" fill="#c2410c">Single-threaded blocking</text>
  <rect x="270" y="58" width="80" height="24" rx="3" fill="#f97316"/>
  <text x="310" y="74" text-anchor="middle" fill="white" font-size="11">1 Thread</text>
  <rect x="270" y="90" width="80" height="20" rx="3" fill="#fed7aa"/>
  <text x="310" y="104" text-anchor="middle" font-size="10" fill="#c2410c">Req 1 → wait</text>
  <rect x="270" y="116" width="80" height="30" rx="3" fill="#fecaca" stroke="#dc2626" stroke-width="1"/>
  <text x="310" y="133" text-anchor="middle" font-size="10" fill="#991b1b">BLOCKED</text>
  <rect x="270" y="152" width="80" height="20" rx="3" fill="#fed7aa"/>
  <text x="310" y="166" text-anchor="middle" font-size="10" fill="#c2410c">Req 2 → wait</text>
  <rect x="270" y="178" width="80" height="22" rx="3" fill="#fecaca" stroke="#dc2626" stroke-width="1"/>
  <text x="310" y="193" text-anchor="middle" font-size="10" fill="#991b1b">BLOCKED</text>

  <!-- Example 3: Multi-threaded -->
  <rect x="500" y="10" width="210" height="200" rx="6" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5"/>
  <text x="605" y="32" text-anchor="middle" font-weight="bold" fill="#15803d">Example 3</text>
  <text x="605" y="48" text-anchor="middle" font-size="11" fill="#15803d">Multi-threaded (thread/request)</text>
  <rect x="515" y="60" width="65" height="18" rx="3" fill="#22c55e"/>
  <text x="547" y="73" text-anchor="middle" fill="white" font-size="10">Thread 1</text>
  <rect x="515" y="82" width="65" height="18" rx="3" fill="#22c55e"/>
  <text x="547" y="95" text-anchor="middle" fill="white" font-size="10">Thread 2</text>
  <rect x="515" y="104" width="65" height="18" rx="3" fill="#22c55e"/>
  <text x="547" y="117" text-anchor="middle" fill="white" font-size="10">Thread 3</text>
  <text x="547" y="138" text-anchor="middle" font-size="18" fill="#15803d">...</text>
  <rect x="515" y="150" width="65" height="18" rx="3" fill="#22c55e"/>
  <text x="547" y="163" text-anchor="middle" fill="white" font-size="10">Thread 100</text>
  <text x="605" y="185" text-anchor="middle" font-size="11" fill="#15803d">Each blocks on I/O</text>
  <text x="605" y="200" text-anchor="middle" font-size="11" fill="#dc2626">100 threads in memory</text>
</svg>

Requirements:
- Use only the built-in `http` module (no Express, no third-party packages).
- Set the response status to `200` and `Content-Type` to `text/plain`.
- Write `"Hello from Node.js!"` to the response body.
- Listen on port `3000`.

## Starter

```js
const http = require('http');

const server = http.createServer((req, res) => {
  // TODO: set response status code and Content-Type header
  // Hint: use res.writeHead(statusCode, headersObject)

  // TODO: write the response body
  // Hint: use res.write(body)

  // TODO: signal that the response is complete
  // Hint: use res.end()
});

// TODO: tell the server to listen on port 3000
// Hint: server.listen(port, callback)
```

## Solution

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello from Node.js!');
  res.end();
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Why

`http.createServer()` registers a callback that fires for every incoming HTTP request. The callback receives the request (`req`) and response (`res`) objects — write headers and body on the **response** object, not the request.

`res.writeHead(200, { 'Content-Type': 'text/plain' })` sends the HTTP status line and headers. `res.write()` buffers body content. `res.end()` flushes the buffer and closes the connection — omitting it leaves the client waiting forever.

`server.listen()` is **non-blocking**: it registers a port listener with the OS and returns immediately. The Node.js event loop is now running, and every incoming connection fires the request callback asynchronously. The server never sits blocked between requests.

**Common mistake:** calling `readFileSync` inside the request handler to load a template. `readFileSync` blocks the entire event loop — every other request waits while the file loads. Replace it with `fs.readFile(path, callback)` so the thread stays free to handle other requests while the OS reads the file.

**Quiz 7 note:** `res.writeHead()`, `res.write()`, and `res.end()` all operate on the **response** (`res`) object. Calling them on `req` is a common exam distractor and will throw a runtime error.
