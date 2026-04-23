---
n: 13
id: laravel-localization
title: "Laravel Localization"
hook: "A single codebase, three languages — here's the mechanism that switches 'Submit' to 'Envoyer' at runtime."
tags: [localization, i18n, laravel, translation, middleware]
module: "localization-module"
priority: mid
source: "localization.pptx slides 1–11; laravel-localization.docx; final-practice.docx Q1–Q2"
bloom_levels: [remember, understand, apply]
pedagogy: concreteness-fading
related: [laravel-mvc-blade, laravel-routing-controllers]
---

## A button label in three languages

A travel-site button reads **Submit** in English. Your French users need **Envoyer**. Your German users need **Senden**. You do not want three separate Blade templates. You want one template and a translation lookup.

This is what that looks like in Blade:

```blade
<button>{{ __('Submit') }}</button>
```

When the locale is `'en'`, `__('Submit')` returns `'Submit'`. When the locale is `'fr'` and `resources/lang/fr.json` maps `"Submit"` → `"Envoyer"`, the same call returns `'Envoyer'`. No if-statements in the template. No separate views.

That one line is the entry point. The rest of this lesson explains the file layout, the helpers, and the runtime switching mechanism behind it.

> **Q:** Before reading on — where do you think Laravel stores the French translation for `'Submit'`? What file, what path?
> **A:** `resources/lang/fr.json`. The file contains JSON key-value pairs where the key is the English phrase and the value is the translation.

---

## The translation file system

Laravel's localization layer is entirely file-based. All language files live under `resources/lang/`. Two file types serve different purposes:

| File type | Path | Format | Best use |
|---|---|---|---|
| PHP translation file | `resources/lang/{locale}/messages.php` | PHP array, keyed by short identifier | Structured domain text (named keys like `messages.welcome`) |
| JSON translation file | `resources/lang/{locale}.json` | JSON object, key = English phrase | Simple UI strings (key = the phrase itself) |

A **PHP translation file** returns an associative array:

```php
// resources/lang/en/messages.php
return [
    'welcome' => 'Welcome to our application',
];
```

Retrieve it with `__('messages.welcome')` — dot notation means "the file `messages.php`, key `welcome`".

A **JSON translation file** uses the English string as the key:

```json
// resources/lang/fr.json
{
    "Submit": "Envoyer",
    "Login": "Se connecter"
}
```

Retrieve it with `__('Submit')` — no dot notation, just the English phrase.

> **Pitfall:** Do not use PHP translation files and JSON translation files for the same locale and the same key. Laravel looks them up through different mechanisms. If `resources/lang/fr/messages.php` and `resources/lang/fr.json` both exist, the lookup resolves one but not the other depending on key format. Keep PHP files for domain-specific namespaced keys and JSON files for plain UI strings. Mixing them for the same content causes silent misses.

---

## The `__()` helper

`__()` is the single canonical helper for retrieving a translated string. Use it in Blade and in PHP code:

```blade
{{ __('messages.welcome') }}    {{-- Blade: PHP file key --}}
{{ __('Submit') }}              {{-- Blade: JSON file key --}}
```

```php
// In a controller or middleware
$label = __('messages.welcome');
```

> **Pitfall:** The exam tests this directly. `translate()`, `t()`, `i18n()`, `lang()`, and `trans()` are not the Laravel helper. The canonical form is `__()` — double underscore. Past-exam Q2 listed all four wrong variants as distractors.

---

## Pluralization with `trans_choice()`

Natural language has plural forms. English has two (`apple` vs `apples`). Other languages have more. `trans_choice()` handles this with pipe-delimited rules:

```php
// resources/lang/en/messages.php
return [
    'apples' => '{0} No apples|{1} One apple|[2,*] :count apples',
];
```

The syntax:
- `{0}` — exact match for zero
- `{1}` — exact match for one
- `[2,*]` — range from 2 to infinity
- `:count` — replaced by the numeric argument at runtime

Call it with the count as the second argument:

```php
echo trans_choice('messages.apples', 0);   // "No apples"
echo trans_choice('messages.apples', 1);   // "One apple"
echo trans_choice('messages.apples', 5);   // "5 apples"
```

> **Q:** What does `trans_choice('messages.apples', 3)` return given the rule `'{0} No apples|{1} One apple|[2,*] :count apples'`?
> **A:** `"3 apples"` — the count 3 matches the `[2,*]` range and `:count` is replaced with `3`.

---

## Setting and reading the locale

The **default locale** is set in `config/app.php` under the key `'locale'`:

```php
// config/app.php
'locale' => env('APP_LOCALE', 'en'),
```

At runtime, switch the locale with `App::setLocale()`:

```php
App::setLocale('fr');
```

Read the current locale with `App::getLocale()`:

```php
$current = App::getLocale(); // returns 'fr'
```

Both use the `App` facade — the canonical form for this course. Do not use `app()->setLocale()` in exam answers unless the question specifically asks for it.

---

## Middleware: setting locale per request

Hard-coding `App::setLocale('fr')` in a controller is not scalable. The recommended pattern is a middleware that reads the locale from the session and applies it to every request:

```php
// app/Http/Middleware/Localization.php
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

public function handle(Request $request, Closure $next)
{
    if (Session::has('locale')) {
        App::setLocale(Session::get('locale'));
    }
    return $next($request);
}
```

A dedicated route stores the chosen locale in the session, then redirects back:

```php
// routes/web.php
Route::get('language/{locale}', function ($locale) {
    app()->setLocale($locale);
    session()->put('locale', $locale);
    return redirect()->back();
});
```

The middleware reads it on the next request. This is the full language-switcher pattern from the lab.

---

## Directory structure recap

```text
resources/
└── lang/
    ├── en/
    │   └── messages.php     ← PHP translation file (en)
    ├── fr/
    │   └── messages.php     ← PHP translation file (fr)
    ├── en.json              ← JSON translation file (en)
    ├── fr.json              ← JSON translation file (fr)
    └── de.json              ← JSON translation file (de)
```

Past-exam Q1 tested this path exactly. The distractors were `resources/views/lang`, `storage/lang`, `bootstrap/lang`, and `app/lang`. The correct answer is `resources/lang/`.

> **Pitfall:** Translation files placed in `resources/views/lang/`, `storage/lang/`, or `app/lang/` are silently ignored. The only valid base path is `resources/lang/`. This was tested directly on the past exam (Q1) with all three wrong paths as distractors.

> **Takeaway:** Laravel's localization system requires two things to work: translation files in the right place (`resources/lang/{locale}/` for PHP, `resources/lang/{locale}.json` for JSON) and the `__()` helper in your templates. `App::setLocale()` switches the locale at runtime; middleware is the correct place to call it so every request gets the right language. `trans_choice()` is the pluralization helper — use it when counts change the phrasing.
