---
n: 11
id: curl-api-request
title: "Make a GET request with cURL and decode the JSON response"
lang: php
tags: [curl, http, php, rest-client]
source: "cURL.pptx slides 4–5"
pedagogy: worked-example-first
---

## Prompt

Make a GET request to `https://api.example.com/students` using PHP cURL. Store the decoded JSON response in a PHP associative array called `$students`.

Use the standard five-step sequence: `curl_init()` → `curl_setopt()` → `curl_exec()` → `curl_close()` → `json_decode()`.

## Starter

```php
<?php

// TODO 1: Initialize a cURL session and store the handle in $ch

// TODO 2: Set CURLOPT_URL to 'https://api.example.com/students'

// TODO 3: Set CURLOPT_RETURNTRANSFER to true so the response is stored, not printed

// TODO 4: Execute the request and store the raw response in $response

// TODO 5: Close/release the cURL handle

// TODO 6: Decode the JSON response into a PHP associative array called $students

var_dump($students);
?>
```

## Solution

```php
<?php

// Step 1: Initialize — get a cURL handle
$ch = curl_init();

// Step 2: Configure the URL and return-transfer option
curl_setopt($ch, CURLOPT_URL, 'https://api.example.com/students');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Step 3: Execute — sends the HTTP GET request
$response = curl_exec($ch);

// Step 4: Release the cURL handle
curl_close($ch);

// Step 5: Decode JSON string into a PHP associative array
$students = json_decode($response, true);

var_dump($students);
?>
```

## Why

**Step 1 — `curl_init()`** opens a new cURL session and returns a **cURL handle** (a PHP resource). Every subsequent `curl_*` call takes that handle as its first argument. Without it there is no session to configure or execute.

**Step 2 — `curl_setopt()` × 2** configures the request. `CURLOPT_URL` sets the target endpoint. `CURLOPT_RETURNTRANSFER` is the critical option: when set to `true`, `curl_exec()` captures the response body as a string and assigns it to `$response`. Without it, `curl_exec()` sends the response straight to the browser — `$response` receives `true` (boolean), not the data. Calling `json_decode(true, true)` returns `null` with no error — a silent failure that is hard to diagnose.

**Step 3 — `curl_exec($ch)`** sends the HTTP request. If the request fails, it returns `false`; check with `if ($response === false)` (strict equality, because an empty string `''` is a valid response).

**Step 4 — `curl_close($ch)`** frees the cURL handle and its associated memory. Omitting this leaks the resource for the duration of the script.

**Step 5 — `json_decode($response, true)`** converts the JSON string into a PHP associative array. The second argument `true` is mandatory for array output — without it you get a `stdClass` object and must use `->` property access instead of `['key']` syntax.

**Common wrong approach:** Many beginners skip `CURLOPT_RETURNTRANSFER` and wonder why the response appears on screen and `$response` is unusable. Others pass `json_decode($response)` without `true` and then get PHP errors when they try `$students[0]['name']` on an object.
