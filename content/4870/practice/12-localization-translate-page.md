---
n: 12
id: localization-translate-page
title: "Translate a Razor page's PageModel + view strings"
kind: code
lang: cs
tags: [i18n, di, istringlocalizer, iviewlocalizer]
source: "Labs/W10 Localization/ Q3 (variant — translate exactly two strings on one page, simpler than the lab's full-site string pass)"
---

## Prompt

An `Index.cshtml` page has two strings that need translation: a `<h1>` welcome heading rendered directly in markup, and a `<p>` message whose text is set in the PageModel via `ViewData["Message"]`. The page already has `@inject IViewLocalizer Localizer` available and the PageModel already constructor-injects `IStringLocalizer<IndexModel>`. Replace the hardcoded English strings with localized lookups that pick up translations from `Resources/Pages/IndexModel.<culture>.resx`.

## Starter

```cs
// Pages/Index.cshtml.cs
public class IndexModel : PageModel
{
    private readonly IStringLocalizer<IndexModel> _localizer;

    public IndexModel(IStringLocalizer<IndexModel> localizer)
        => _localizer = localizer;

    public void OnGet()
    {
        // TODO: replace the hardcoded English with a localized lookup
        //       using the key "Message".
        ViewData["Message"] = "This is the message.";
    }
}

// Pages/Index.cshtml
@page
@inject IViewLocalizer Localizer
@model IndexModel

// TODO: replace the hardcoded "Welcome" with a localized lookup
//       using the key "Welcome".
<h1>Welcome</h1>
<p>@ViewData["Message"]</p>
```

## Solution

```cs
// Pages/Index.cshtml.cs
public class IndexModel : PageModel
{
    private readonly IStringLocalizer<IndexModel> _localizer;

    public IndexModel(IStringLocalizer<IndexModel> localizer)
        => _localizer = localizer;

    public void OnGet()
    {
        ViewData["Message"] = _localizer["Message"];
    }
}

// Pages/Index.cshtml
@page
@inject IViewLocalizer Localizer
@model IndexModel

<h1>@Localizer["Welcome"]</h1>
<p>@ViewData["Message"]</p>
```

## Why

You also need two resource files, `Resources/Pages/IndexModel.en.resx` (or no-suffix default) with keys `Welcome → Welcome`, `Message → This is the message.`, and `Resources/Pages/IndexModel.fr.resx` with `Welcome → Bienvenue`, `Message → Ceci est le message.`



The view uses `IViewLocalizer` for strings rendered directly from markup; the PageModel uses `IStringLocalizer<IndexModel>` for strings that are computed in code and passed through `ViewData`. Both resolve against the same resource file — `Resources/Pages/IndexModel.<culture>.resx` — because the generic type parameter on `IStringLocalizer<IndexModel>` and the implicit type parameter on `IViewLocalizer` (the view's generated class) map to the same .resx naming path.

The indexer `_localizer["Key"]` / `Localizer["Key"]` does three things in sequence: look up the current `CultureInfo` from `Thread.CurrentUICulture`, find the matching `.resx` file (falling back through the parent-culture chain), read the key. If the key isn't present in any `.resx`, the indexer returns the key itself as a literal string — so a missing translation shows up as "Welcome" instead of "Bienvenue" rather than blowing up.

Common wrong approaches:

- **Using `@Html.Raw(Localizer["Welcome"])` unnecessarily.** `IViewLocalizer` returns a `LocalizedHtmlString` that Razor already knows how to render. `@Html.Raw` is only needed when you want to bypass HTML encoding, which matters for `IHtmlLocalizer` content (not `IViewLocalizer`).
- **Injecting `IStringLocalizer` (non-generic) into the PageModel.** Without the `<T>` parameter, DI can't decide which resource file to target. The correct injection is `IStringLocalizer<IndexModel>`.
- **Putting the .resx file at `Resources/IndexModel.fr.resx` (missing the `Pages/` subfolder).** Directory layout under `Resources/` must mirror the class location. With the wrong path the file is invisible to the localizer, which silently falls back to the default culture or returns the key.
