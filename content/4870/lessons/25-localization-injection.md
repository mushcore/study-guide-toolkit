---
n: 25
id: localization-injection
title: "Localizer injection — IStringLocalizer, IHtmlLocalizer, IViewLocalizer, shared resources"
hook: "Three localizer types, three injection sites. Pick by what you render."
tags: [i18n, di, istringlocalizer, iviewlocalizer]
module: "Internationalization & Modern UI"
source: "notes/razor_pages_localization_SCRIPT.docx; research-localization.md §2, §5"
bloom_levels: [remember, apply]
related: [localization-setup, localization-resources-cultures]
---

## Three localizer interfaces for three render surfaces

.NET ships three localizer types. They differ in where you inject them and what kind of content they return.

| Interface | Where | Returns | Use when |
|---|---|---|---|
| `IStringLocalizer<T>` | Any DI-aware class (PageModel, Controller, Service) | Plain text | Rendering a string into a variable or `ViewData` |
| `IHtmlLocalizer<T>` | Any DI-aware class | Marked-safe HTML | The translation contains markup (anchor tags, `<strong>`, etc.) |
| `IViewLocalizer` | `.cshtml` views directly via `@inject` | Plain text | Rendering straight from markup without routing through the PageModel |

All three use the same indexer syntax: `localizer["Key"]`, optionally `localizer["Key", arg1, arg2]` for positional string-format substitutions.

## `IStringLocalizer<T>` in a PageModel

```cs
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
```

The generic parameter `<IndexModel>` drives two things: which resource file to load (the name maps to `Resources/Pages/IndexModel.<culture>.resx`) and which service registration to pick in DI. Always generic; never a plain `IStringLocalizer` unless you want the shared-resource pattern below.

## `IViewLocalizer` inline in a `.cshtml`

```cs
@page
@inject IViewLocalizer Localizer
@model IndexModel

<h1>@Localizer["Welcome"]</h1>
<p>@Localizer["Intro"]</p>
```

The implicit generic parameter is the type of the `.cshtml` file's generated class — which maps to the same resource file as `IStringLocalizer<IndexModel>` would. Use `IViewLocalizer` when the string is only ever rendered directly in markup; use `IStringLocalizer<T>` when code-behind needs the string.

## `IHtmlLocalizer<T>` for HTML-bearing translations

```cs
public class IndexModel : PageModel
{
    private readonly IHtmlLocalizer<IndexModel> _html;

    public IndexModel(IHtmlLocalizer<IndexModel> html) => _html = html;

    public IHtmlContent Learn() => _html["LearnMore"];
}
```

With `LearnMore` in the `.resx` set to `"Read <a href=\"/docs\">the docs</a>"`, `IHtmlLocalizer` returns an `IHtmlContent` that renders the anchor verbatim. `IStringLocalizer` would HTML-encode the angle brackets so the user sees the raw HTML source — not what you want.

Rule of thumb: if the translated string contains any `<` character that should be interpreted as markup, use `IHtmlLocalizer`. Otherwise use `IStringLocalizer`.

## Shared resources for strings used everywhere

Strings like navigation labels, footer copyright, or common button text appear on many pages. Duplicating translations across every per-page `.resx` is tedious and error-prone. The shared-resources pattern uses one empty marker class plus a service:

```cs
// Marker class — the "type" whose resource file holds shared strings.
namespace MyApp;
public class SharedResource { }
```

Create `Resources/SharedResource.fr.resx` (no subfolder — the marker is at the root namespace).

Register a service:

```cs
public class SharedLocalizer
{
    private readonly IStringLocalizer _inner;

    public SharedLocalizer(IStringLocalizerFactory factory)
    {
        var assembly = typeof(SharedResource).Assembly.GetName();
        _inner = factory.Create(nameof(SharedResource), assembly.Name!);
    }

    public string Get(string key) => _inner[key];
}
```

Register and inject:

```cs
// Program.cs
builder.Services.AddSingleton<SharedLocalizer>();

// Razor page
@inject SharedLocalizer Shared
<footer>© @DateTime.Now.Year — @Shared.Get("CompanyName")</footer>
```

Strings translated once; visible everywhere.

## Arguments and formatting

All three localizers accept positional args:

```cs
_localizer["GreetUser", userName]
// .resx value: "Hello, {0}!"
// Renders: "Hello, Alice!" (en) / "Bonjour, Alice !" (fr)
```

Use this instead of string concatenation so translators can reorder `{0}` and `{1}` in languages with different word order.

> **Q:** You add `IViewLocalizer Localizer` to a `.cshtml` file and get a runtime error: "no service for type `IViewLocalizer` has been registered." Services and middleware are configured. What's missing?
> **A:** `AddViewLocalization()` wasn't called on the MVC / Razor Pages builder. `AddLocalization` alone registers `IStringLocalizer<T>` but not `IViewLocalizer`. Add `.AddViewLocalization()` to the `AddMvc()` or `AddRazorPages()` chain.

> **Example**
> A three-page site with per-page strings (via `IViewLocalizer`) and shared navigation (via `SharedLocalizer`):
>
> ```cs
> @page
> @inject IViewLocalizer PageL
> @inject SharedLocalizer Shared
> @model IndexModel
>
> <nav>
>     <a href="/">@Shared.Get("NavHome")</a>
>     <a href="/Courses">@Shared.Get("NavCourses")</a>
> </nav>
>
> <h1>@PageL["Welcome"]</h1>
> ```
>
> The nav labels come from `Resources/SharedResource.<culture>.resx`; the welcome comes from `Resources/Pages/IndexModel.<culture>.resx`. Each translator owns a scoped file set.

> **Pitfall**
> Using `IStringLocalizer<T>` to render a translation that contains HTML markup. The indexer returns a `LocalizedString` whose `Value` gets HTML-encoded when rendered in Razor, so `"<a href=\"/\">Home</a>"` shows up as literal `<a href="/">Home</a>` text. Either use `IHtmlLocalizer<T>` or wrap the value with `@Html.Raw(...)` (riskier — you lose XSS protection).

> **Takeaway**
> `IStringLocalizer<T>` for code-behind plain text; `IHtmlLocalizer<T>` for code-behind HTML content; `IViewLocalizer` for direct `.cshtml` use via `@inject`. Shared strings get a `SharedResource` marker class plus a singleton service using `IStringLocalizerFactory.Create(nameof(SharedResource), assemblyName)`. Indexer `localizer["Key"]` is the same across all three; positional args `["Key", val1, val2]` fill `{0}` / `{1}` placeholders in the `.resx` value.
