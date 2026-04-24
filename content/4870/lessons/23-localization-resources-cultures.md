---
n: 23
id: localization-resources-cultures
title: "Localization resources + cultures — .resx files, CurrentCulture, providers"
hook: "Name the .resx file right; set both cultures; let providers pick."
tags: [i18n, culture, resx]
module: "Internationalization & Modern UI"
source: "slides/asp_core_localization.pptx; notes/razor_pages_localization_SCRIPT.docx; research-localization.md"
bloom_levels: [remember, understand, apply]
related: [localization-setup, localization-injection]
---

## One `.resx` file per class per culture

For a Razor page at `Pages/Index.cshtml.cs` (class name `IndexModel`), your French translations live at exactly this path:

```text
Resources/Pages/IndexModel.fr.resx
```

The rules:

1. **Root folder** matches `options.ResourcesPath` (conventionally `Resources`).
2. **Subfolder** mirrors the class's folder relative to the project root (`Pages/` here).
3. **Filename** is `<ClassName>.<culture>.resx`.

For other conventions:

- A controller `Controllers/HomeController.cs` → `Resources/Controllers/HomeController.fr.resx`.
- A shared resource (see the localization-injection lesson) → `Resources/SharedResource.fr.resx`.
- A model with data-annotations → `Resources/Models/ContactForm.fr.resx`.

A `.resx` file is XML that stores key → localized-string pairs. The Visual Studio / Rider designer edits them as a two-column grid; VS Code users install the "ResX Editor" extension.

## Culture codes

Each `.resx` targets one culture, named by standard BCP-47 tags:

| Tag | Meaning |
|---|---|
| `en` | Generic English |
| `fr` | Generic French |
| `en-US` | US English (regional) |
| `fr-CA` | Canadian French |
| `zh-Hans` | Simplified Chinese |

ASP.NET Core's fallback chain: requested culture → parent culture → default. So `fr-CA.resx` falls back to `fr.resx`, which falls back to the un-suffixed `.resx` if one exists. Most apps ship `en.resx` (or `en-US.resx`) as the default and add non-English variants as needed.

## `CurrentCulture` vs `CurrentUICulture` — not the same

Two separate `Thread`-scoped values drive localization behaviour:

| Property | What it controls |
|---|---|
| `Thread.CurrentCulture` | Date, number, and currency formatting (`.ToString()`, `decimal.ToString("C")`, etc.) |
| `Thread.CurrentUICulture` | Which `.resx` gets loaded by `IStringLocalizer[...]` |

Set only `CurrentCulture` and your numbers format correctly but your UI strings stay in the default language. Set only `CurrentUICulture` and UI strings translate but dates still render in `en-US` format. ASP.NET Core's `UseRequestLocalization()` middleware sets both together from the detected culture — see the localization-setup lesson.

## Culture providers — who picks the culture

`RequestLocalizationMiddleware` runs three providers in a strict order. First match wins:

1. **`QueryStringRequestCultureProvider`** — `?culture=fr` in the URL. Highest priority; useful for testing and for deep links to specific languages.
2. **`CookieRequestCultureProvider`** — reads `.AspNetCore.Culture` cookie. This is how persistent user selection works (see the switcher UI in localization-setup).
3. **`AcceptLanguageHeaderRequestCultureProvider`** — reads the browser's `Accept-Language` header. Automatic, zero UI required.

Order is configurable via `options.RequestCultureProviders` if you want the header to beat the cookie. Default order is the one above.

> **Q:** A page's `IStringLocalizer<IndexModel>["Welcome"]` returns the literal string `"Welcome"` even though `Resources/Pages/IndexModel.fr.resx` contains a `Welcome` key translated to `"Bienvenue"`. What two independent misconfigurations could cause this?
> **A:** (1) The user's detected culture isn't French — maybe `?culture=fr` isn't set, no cookie exists, and the `Accept-Language` header is `en-US`. (2) `UseRequestLocalization()` middleware is missing from `Program.cs`, so no provider runs and `CurrentUICulture` stays at the default. Fix either / both.

> **Example**
> Resource-file layout for a course website supporting English and French:
>
> ```text
> Resources/
> ├── Pages/
> │   ├── IndexModel.fr.resx
> │   └── CoursesModel.fr.resx
> ├── Controllers/
> │   └── HomeController.fr.resx
> ├── Models/
> │   └── EnrollForm.fr.resx
> └── SharedResource.fr.resx
> ```
>
> English uses the default un-suffixed `.resx` (or a parallel `.en.resx` set). Adding German later means copying the file tree and swapping `.fr.resx` for `.de.resx`.

> **Pitfall**
> Naming a resource file `Resources/IndexModel.fr.resx` (no `Pages/` subfolder) for a class in `Pages/Index.cshtml.cs`. The file exists, the build succeeds, but `IStringLocalizer<IndexModel>` looks in `Resources/Pages/IndexModel.fr.resx` and finds nothing — the indexer returns the key unchanged. Directory structure under `Resources/` must mirror the class's folder.

> **Takeaway**
> One `.resx` per class per culture, at `Resources/<folder>/<ClassName>.<culture>.resx`. `CurrentCulture` controls formatting; `CurrentUICulture` controls which `.resx` loads — set both. Culture providers run in order QueryString → Cookie → AcceptLanguageHeader; first match wins. If a lookup returns the key verbatim, check the file path AND whether the middleware actually detected your target culture.
