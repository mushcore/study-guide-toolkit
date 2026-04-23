---
n: 12
id: localization-setup
title: "Localization setup — PHP translation file, __(), trans_choice()"
lang: php
tags: [localization, i18n, laravel, translation]
source: "localization.pptx slides 4–7; laravel-localization.docx"
pedagogy: worked-example-first
---

## Prompt

Create a PHP translation file for the `en` locale that defines a welcome message and an item-count string. Then write a PHP snippet that:

1. Uses `__()` to retrieve the welcome message.
2. Uses `trans_choice()` to render the item-count string for counts of 0, 1, and 5.

The item-count string must use pipe-delimited plural rules covering zero, one, and two-or-more.

## Starter

```php
<?php

// FILE 1: resources/lang/en/messages.php
// TODO 1: Return an associative array with two keys:
//   'welcome' => the string 'Welcome to our application'
//   'items'   => a pipe-delimited pluralization string covering
//                {0} no items, {1} one item, [2,*] :count items

// FILE 2: A controller or route closure (simulate with plain PHP here)
// TODO 2: Call __() to retrieve the 'messages.welcome' string and echo it.

// TODO 3: Call trans_choice() three times for 'messages.items' with
//         counts 0, 1, and 5. Echo each result on its own line.
```

## Solution

```php
<?php

// FILE 1: resources/lang/en/messages.php
return [
    'welcome' => 'Welcome to our application',
    'items'   => '{0} No items|{1} One item|[2,*] :count items',
];

// FILE 2: Route closure / controller action
// Retrieve a simple translated string
echo __('messages.welcome');
// Output: Welcome to our application

// Pluralized translations
echo trans_choice('messages.items', 0);  // No items
echo trans_choice('messages.items', 1);  // One item
echo trans_choice('messages.items', 5);  // 5 items
```

## Why

`__('messages.welcome')` uses dot notation: `messages` is the filename (`messages.php`) and `welcome` is the array key. Laravel loads the file for the active locale — `resources/lang/{locale}/messages.php` — and returns the matching value.

`trans_choice()` evaluates the pipe-delimited string left-to-right, returning the first rule whose range covers the count. `{0}` matches exactly 0; `{1}` matches exactly 1; `[2,*]` matches 2 through infinity. The `:count` placeholder is replaced with the numeric argument.

Two common wrong approaches:

1. **Using `trans()` instead of `__()`.** `trans()` is a lower-level function. The canonical form is `__()` — Laravel docs and all examples use this helper. Never substitute it.
2. **Using `__()` for pluralization.** `__()` cannot evaluate pipe-delimited rules. It returns the raw string verbatim, including the `|` characters. Always use `trans_choice()` when the output depends on a count.
