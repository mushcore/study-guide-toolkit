---
n: 12
id: curl-http-client
title: "cURL as an HTTP Client"
hook: "One function call gives you a live REST API response — but only if you set the right option first."
tags: [curl, http, php, rest-client]
module: "Swagger and cURL"
priority: mid
source: "cURL.pptx slides 4–5"
related: [rest-api-design, swagger-openapi]
bloom_levels: [remember, understand, apply]
pedagogy: concreteness-fading
---

## A working GET request, start to finish

Run this code and `$data` holds the decoded JSON from the API.

```php
<?php
// Step 1: Initialize — get a cURL handle
$ch = curl_init();

// Step 2: Configure options
curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Step 3: Execute — sends the HTTP request
$response = curl_exec($ch);

// Step 4: Release the handle
curl_close($ch);

// Step 5: Decode JSON string into a PHP associative array
$data = json_decode($response, true);
?>
```

Every cURL request follows this exact five-step sequence: `curl_init()` → `curl_setopt()` → `curl_exec()` → `curl_close()` → `json_decode()`.
Skipping or reordering any step produces either an error or silent wrong output.

> **Q:** What does `curl_init()` return?
> **A:** A cURL handle — a PHP resource you pass to every subsequent `curl_*` function call.

## The five-step sequence in detail

### Step 1 — `curl_init()`

`curl_init()` initializes a new cURL session and returns a **cURL handle**.
You store that handle in a variable (conventionally `$ch`) and pass it to all later calls.

```php
$ch = curl_init();
```

You can also pass the URL directly: `curl_init('https://api.example.com/students')`.
Both approaches are valid; passing it separately with `curl_setopt` is clearer for multiple options.

### Step 2 — `curl_setopt()`

`curl_setopt($ch, OPTION, value)` configures one option at a time.
Call it once per option, or use `curl_setopt_array()` to set many at once.

The two most critical options:

```php
curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
```

`CURLOPT_URL` tells cURL where to connect.
`CURLOPT_RETURNTRANSFER` is the option that determines whether the response is returned as a string (`true`) or printed directly to the screen (`false`).

> **Pitfall**
> Forgetting `CURLOPT_RETURNTRANSFER` is the most common cURL mistake. When it is not set (or set to `false`), `curl_exec()` prints the response to the browser immediately — `$response` is `true`, not the data. The variable is useless and you cannot call `json_decode()` on it.

### Step 3 — `curl_exec()`

`curl_exec($ch)` sends the HTTP request and returns the response body as a string.
Always check for errors before continuing:

```php
$response = curl_exec($ch);
if ($response === false) {
    echo 'cURL error: ' . curl_error($ch);
}
```

Use `=== false` (strict equality) because an empty response string `''` is valid and truthy-false comparisons would misidentify it as an error.

### Step 4 — `curl_close()`

`curl_close($ch)` releases the cURL handle and frees the associated memory.
Call it after `curl_exec()` and before you process the response — but after you are done making requests with that handle.

```php
curl_close($ch);
```

### Step 5 — `json_decode()`

REST APIs return JSON strings. `json_decode($response, true)` converts the JSON string into a PHP associative array.

```php
$data = json_decode($response, true);
```

The second argument `true` forces associative array output. Without it, `json_decode` returns a `stdClass` object instead.

> **Q:** What does `json_decode($response, true)` return when the second argument is omitted?
> **A:** A `stdClass` object — not an associative array. Access becomes `$data->name` instead of `$data['name']`.

## Sending a POST request

For POST requests, add two additional options after the standard ones:

```php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'FirstName' => 'Jane',
    'LastName'  => 'Smith',
    'School'    => 'BCIT',
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
```

`CURLOPT_POST` switches the request method to POST.
`CURLOPT_POSTFIELDS` carries the request body — pass a JSON-encoded string for REST APIs, and set `Content-Type: application/json` via `CURLOPT_HTTPHEADER`.

> **Takeaway**
> cURL in PHP follows a strict five-step pattern. The single most important option is `CURLOPT_RETURNTRANSFER` — set it to `true` or `curl_exec()` outputs to screen and your variable holds nothing useful. After executing, `json_decode($response, true)` converts the JSON string into the associative array your application actually uses.
