---
n: 5
id: blade-templating-layout
title: "Blade — layout inheritance and partials"
lang: blade
tags: [laravel, blade, views, layout]
source: "intro_to_laravel.pptx slides 11-20"
pedagogy: worked-example-first
---

## Prompt

Build a two-file Blade setup: a parent layout and a child view.

The parent layout (`resources/views/layouts/master.blade.php`) must:
- Output an escaped page title variable with the double-brace syntax
- Include a partial header from `partials.nav`
- Define a `content` injection point

The child view (`resources/views/welcome.blade.php`) must:
- Inherit the parent layout
- Fill the `content` block with an `<h1>` and a `<ul>` that loops over `$items`

## Starter

```blade
{{-- resources/views/layouts/master.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title><!-- OUTPUT $pageTitle SAFELY HERE --></title>
</head>
<body>
    <!-- INCLUDE partials.nav HERE -->
    <div class="container">
        <!-- MARK THE INJECTION POINT FOR 'content' HERE -->
    </div>
</body>
</html>

{{-- resources/views/welcome.blade.php --}}
<!-- INHERIT layouts.master HERE -->

<!-- OPEN the 'content' section HERE -->
<h1>Welcome</h1>
<ul>
    <!-- LOOP OVER $items, output each $item SAFELY -->
</ul>
<!-- CLOSE the section HERE -->
```

## Solution

```blade
{{-- resources/views/layouts/master.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>{{ $pageTitle }}</title>
</head>
<body>
    @include('partials.nav')
    <div class="container">
        @yield('content')
    </div>
</body>
</html>

{{-- resources/views/welcome.blade.php --}}
@extends('layouts.master')

@section('content')
<h1>Welcome</h1>
<ul>
    @foreach($items as $item)
        <li>{{ $item }}</li>
    @endforeach
</ul>
@endsection
```

## Why

**Template hierarchy:** The parent layout declares `@yield('content')` as a named slot. The child view declares `@extends('layouts.master')` to claim that layout, then wraps its HTML in `@section('content') ... @endsection` to fill the slot. Laravel compiles both files together — the child's section replaces the `@yield` call in the parent.

**Double-brace syntax for output:** `{{ $pageTitle }}` and `{{ $item }}` both use the double-brace syntax, which calls `htmlspecialchars()` before rendering. This escapes `<`, `>`, `"`, `'`, and `&` — making the output XSS-safe by default. Never use raw PHP `echo` in Blade; it bypasses this protection.

**@include for partial views:** `@include('partials.nav')` inserts `resources/views/partials/nav.blade.php` inline. The partial receives all variables in scope. Dot-notation maps to directory separators under `resources/views/`.

**Two common wrong approaches:**

1. *Forgetting `@endsection`.* Blade requires every `@section` to have a matching `@endsection`. Omitting it causes a parse error: `Blade::compileString() cannot find the end of the section`. The error is often reported on the *next* `@extends` it encounters, not the offending file.

2. *Using `{!! $item !!}` for loop output.* When iterating over user-supplied data, `{!! !!}` outputs raw HTML and creates an XSS vulnerability. The double-brace syntax `{{ }}` is the correct default for all variable output.
