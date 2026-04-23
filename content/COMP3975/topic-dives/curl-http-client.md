---
id: curl-http-client
title: "cURL HTTP Client — PHP reference"
pillar: tech
priority: mid
tags: [curl, http, php, rest-client]
source: "cURL.pptx slides 4–5"
bloom_levels: [remember, understand, apply]
related: [rest-api-design, swagger-openapi]
---

## Concrete anchor: fetching a student list

This request fetches JSON from a REST API and decodes it — the complete, runnable starting point:

```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
// $data is now a PHP associative array
?>
```

## The five-step sequence

Every PHP cURL interaction follows the same pattern regardless of the HTTP method:

```
curl_init()  →  curl_setopt()  →  curl_exec()  →  curl_close()  →  json_decode()
```

| Step | Function | What it does |
|------|----------|--------------|
| 1 | `curl_init()` | Opens a new cURL session; returns a **cURL handle** |
| 2 | `curl_setopt($ch, OPT, val)` | Sets one option; call once per option |
| 3 | `curl_exec($ch)` | Sends the HTTP request; returns response body as string |
| 4 | `curl_close($ch)` | Frees the cURL handle and its memory |
| 5 | `json_decode($response, true)` | Converts JSON string to PHP associative array |

## Common CURLOPT options

| Option | Value | Effect |
|--------|-------|--------|
| `CURLOPT_URL` | `'https://...'` | Sets the request URL |
| `CURLOPT_RETURNTRANSFER` | `true` | Returns response as string instead of printing it |
| `CURLOPT_POST` | `true` | Switches request method to POST |
| `CURLOPT_POSTFIELDS` | JSON string | Sets the POST request body |
| `CURLOPT_HTTPHEADER` | `['Content-Type: application/json']` | Sets custom HTTP headers |
| `CURLOPT_SSL_VERIFYHOST` | `0` | Disables SSL host verification (dev only) |
| `CURLOPT_SSL_VERIFYPEER` | `0` | Disables SSL peer verification (dev only) |

> **Note**
> `CURLOPT_SSL_VERIFYHOST` and `CURLOPT_SSL_VERIFYPEER` set to `0` is acceptable in local development but must never reach production — it disables certificate validation entirely.

## Full GET example

```php
<?php
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if ($response === false) {
    echo 'cURL error: ' . curl_error($ch);
} else {
    $data = json_decode($response, true);
    // Use $data here
}

curl_close($ch);
?>
```

## Full POST example

```php
<?php
$payload = json_encode([
    'FirstName' => 'Jane',
    'LastName'  => 'Smith',
    'School'    => 'BCIT',
]);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
?>
```

> **Example:** Five-step cURL GET request to a JSON API
>
> **Step 1 — Open a cURL session.**
> `$ch = curl_init();` — returns a cURL handle that all subsequent calls use.
>
> **Step 2 — Set required options.**
> `curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');` sets the target URL.
> `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);` tells cURL to return the response as a string instead of printing it directly. This option is mandatory — without it, `curl_exec()` returns `true` and the response goes to the browser.
>
> **Step 3 — Execute and capture.**
> `$response = curl_exec($ch);` sends the HTTP GET request and stores the JSON string in `$response`.
>
> **Step 4 — Release the handle.**
> `curl_close($ch);` frees the memory and connection resources associated with the handle.
>
> **Step 5 — Decode the response.**
> `$data = json_decode($response, true);` converts the JSON string to a PHP associative array. The `true` argument is required — without it, `json_decode` returns a `stdClass` object, not an array.

> **Pitfall**
> Omitting `CURLOPT_RETURNTRANSFER` means `curl_exec()` returns `true` (or `false` on error) and sends the response body directly to the browser. The variable you assign to is not the response body — it is `true`. Calling `json_decode(true, true)` returns `null` silently. Always set `CURLOPT_RETURNTRANSFER` to `true` before executing.

> **Takeaway**
> PHP cURL is a five-step procedure: init a handle, set options (always including `CURLOPT_RETURNTRANSFER`), execute, close, decode. Every variation — GET, POST, custom headers, SSL bypass — is just adding options in step 2. The pattern never changes.
