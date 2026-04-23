---
n: 14
id: mcp-client-request
title: "PHP MCP client — tools/list via cURL"
lang: php
tags: [mcp, curl, json-rpc, php, tools]
source: "laravel_mcp.pptx slides 4–5; cURL.pptx slides 4–6"
pedagogy: worked-example-first
---

## Prompt

Write a PHP function `list_mcp_tools(string $serverUrl): array` that sends a `tools/list` request to an MCP server using cURL.

Requirements:
- Use the JSON-RPC 2.0 format: `jsonrpc`, `id`, `method` fields.
- Set the `Content-Type: application/json` header.
- Return the decoded JSON response as a PHP array.
- Handle cURL failure by throwing a `RuntimeException` with the cURL error message.

## Starter

```php
<?php

function list_mcp_tools(string $serverUrl): array
{
    $payload = json_encode([
        // TODO: fill in the JSON-RPC 2.0 fields
    ]);

    $handle = curl_init($serverUrl);

    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    // TODO: set POST method, body, and headers

    $response = curl_exec($handle);

    if ($response === false) {
        // TODO: throw RuntimeException with cURL error
    }

    curl_close($handle);

    // TODO: decode and return the JSON response
}
```

## Solution

```php
<?php

function list_mcp_tools(string $serverUrl): array
{
    $payload = json_encode([
        'jsonrpc' => '2.0',
        'id'      => 1,
        'method'  => 'tools/list',
    ]);

    $handle = curl_init($serverUrl);

    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($handle, CURLOPT_POST, true);
    curl_setopt($handle, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($handle, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
    ]);

    $response = curl_exec($handle);

    if ($response === false) {
        $error = curl_error($handle);
        curl_close($handle);
        throw new RuntimeException("cURL error: $error");
    }

    curl_close($handle);

    return json_decode($response, true);
}
```

## Why

**JSON-RPC 2.0 format.** Every Model Context Protocol message is a JSON-RPC 2.0 envelope. The three required fields are `jsonrpc` (always the string `"2.0"`), `id` (a client-chosen integer so responses can be matched to requests), and `method` (the operation name). For discovery, the method is `tools/list`. A common wrong approach is omitting `jsonrpc` or sending the method as a query parameter — both violate the JSON-RPC spec and will be rejected by a compliant server.

**Why cURL.** PHP's native cURL extension gives direct control over HTTP method, headers, and body. `CURLOPT_RETURNTRANSFER` is the critical option: without it, `curl_exec()` prints the response directly to output instead of returning it as a string. `CURLOPT_POST` switches the request from GET to POST, required because JSON-RPC sends a body. A common mistake is setting `CURLOPT_URL` separately after `curl_init()` — passing the URL to `curl_init()` directly is equivalent and cleaner.

**Request/response structure.** The server responds with a JSON object containing a `result` key (on success) or an `error` key (on failure). `json_decode($response, true)` converts the JSON string to a PHP associative array. Always check for a cURL-level failure (`$response === false`) before attempting to decode — otherwise `json_decode(false, true)` silently returns `null` and the caller receives no error signal.
