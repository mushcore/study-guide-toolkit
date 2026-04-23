---
id: laravel-localization
title: "Laravel Localization — translation files, helpers, locale switching"
pillar: tech
priority: mid
tags: [localization, i18n, laravel, translation, middleware]
source: "localization.pptx slides 1–11; laravel-localization.docx; final-practice.docx Q1–Q2"
bloom_levels: [remember, understand, apply]
related: [laravel-mvc-blade, laravel-routing-controllers]
---

## Concrete anchor

A Blade view renders `{{ __('Submit') }}`. When `App::getLocale()` returns `'fr'`, Laravel looks up `resources/lang/fr.json`, finds the key `"Submit"`, and returns `"Envoyer"`. The template never changes. Only the locale and the translation file determine the output.

---

## PHP translation file vs JSON translation file

| | PHP translation file | JSON translation file |
|---|---|---|
| **Path** | `resources/lang/{locale}/messages.php` | `resources/lang/{locale}.json` |
| **Format** | PHP file returning an associative array | JSON object with key-value pairs |
| **Key form** | Short identifier (`'welcome'`) retrieved with dot notation (`messages.welcome`) | English phrase as key (`"Submit"`) retrieved directly |
| **Best use** | Structured, domain-specific text with logical grouping | Simple UI strings where the English phrase is the natural key |
| **Lookup call** | `__('messages.welcome')` | `__('Submit')` |

**PHP translation file example:**

```php
// resources/lang/en/messages.php
return [
    'welcome' => 'Welcome to our application',
    'apples'  => '{0} No apples|{1} One apple|[2,*] :count apples',
];
```

**JSON translation file example:**

```json
// resources/lang/fr.json
{
    "Submit": "Envoyer",
    "Login":  "Se connecter",
    "Logout": "Fermer la session"
}
```

---

## `__()` — the translation helper

`__()` is the canonical retrieval helper. Use it in Blade and in PHP:

```blade
{{ __('messages.welcome') }}   {{-- dot notation → PHP file --}}
{{ __('Submit') }}             {{-- plain phrase → JSON file --}}
```

```php
$label = __('messages.welcome');
```

> **Pitfall:** `trans()`, `t()`, `i18n()`, `translate()`, and `lang()` are not Laravel helpers. The exam directly tests this (past-exam Q2, all four wrong variants appeared as distractors). Write `__()` — double underscore — and nothing else.

---

## `trans_choice()` — pluralization

`trans_choice()` evaluates pipe-delimited rules in the translation string and substitutes `:count`:

**Syntax:** `'{N} text_for_N|{M} text_for_M|[range_start,range_end] text :count'`

```php
// resources/lang/en/messages.php
'apples' => '{0} No apples|{1} One apple|[2,*] :count apples',
```

```php
trans_choice('messages.apples', 0);  // "No apples"
trans_choice('messages.apples', 1);  // "One apple"
trans_choice('messages.apples', 4);  // "4 apples"
```

Rule tokens:
- `{N}` — exact integer match
- `[a,b]` — inclusive range; `*` means no upper bound
- `:count` — placeholder replaced by the numeric argument

---

## `App::setLocale()` and `App::getLocale()`

```php
App::setLocale('fr');          // switch locale for this request
$locale = App::getLocale();    // returns 'fr'
```

The default locale is defined in `config/app.php`:

```php
'locale' => env('APP_LOCALE', 'en'),
```

Supported locales are declared via a custom key (added to `config/app.php` by the developer):

```php
'supported_locales' => ['en', 'fr', 'de'],
```

---

> **Example:** Adding French support to a Laravel app in four steps
>
> **Step 1 — Create the French translation file.**
>
> ```php
> // resources/lang/fr/messages.php
> return [
>     'welcome' => 'Bienvenue dans notre application',
>     'submit'  => 'Envoyer',
> ];
> ```
>
> **Step 2 — Call `App::setLocale('fr')` early in the request.**
>
> The canonical place is a `Localization` middleware that reads `session('locale')` and calls `App::setLocale()` before the controller runs.
>
> **Step 3 — Use `__()` in the Blade template.**
>
> ```blade
> <h1>{{ __('messages.welcome') }}</h1>
> <button>{{ __('messages.submit') }}</button>
> ```
>
> **Step 4 — Verify the output.**
>
> With `App::getLocale()` returning `'fr'`, Laravel resolves `messages.welcome` from `resources/lang/fr/messages.php` and renders "Bienvenue dans notre application". Switching back to `'en'` renders the English string without any template change.

## Middleware pattern for locale switching

```php
// app/Http/Middleware/Localization.php
public function handle(Request $request, Closure $next)
{
    if (Session::has('locale')) {
        App::setLocale(Session::get('locale'));
    }
    return $next($request);
}
```

The middleware is registered in `bootstrap/app.php` inside the `->withMiddleware()` block. A dedicated route writes the chosen locale to the session:

```php
Route::get('language/{locale}', function ($locale) {
    app()->setLocale($locale);
    session()->put('locale', $locale);
    return redirect()->back();
});
```

`App::getLocale()` in `AppServiceProvider::boot()` reads the current locale to pass it to a language-switcher partial view.

---

## Directory structure

```text
resources/
└── lang/
    ├── en/
    │   └── messages.php     ← PHP translation file
    ├── fr/
    │   └── messages.php
    ├── en.json              ← JSON translation file
    ├── fr.json
    └── de.json
```

Past-exam Q1 tested this path. The correct answer is `resources/lang/`. Distractors included `resources/views/lang`, `storage/lang`, and `app/lang`.

> **Pitfall:** Do not mix PHP translation files and JSON translation files for the same locale and same key. They are resolved through separate lookup chains. Use PHP files for namespaced domain text and JSON files for plain UI strings.

> **Takeaway:** Three things determine localization behavior: (1) translation files at the correct path (`resources/lang/`), (2) the `__()` helper in templates and code, and (3) `App::setLocale()` called early in the request — middleware is the canonical place. `trans_choice()` handles any pluralization that `__()` cannot express.
