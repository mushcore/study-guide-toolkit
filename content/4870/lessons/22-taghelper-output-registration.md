---
n: 22
id: taghelper-output-registration
title: "Tag Helper output manipulation + registration via _ViewImports"
hook: "Register globally in `_ViewImports.cshtml`; manipulate `output` in `Process`."
tags: [tag-helper, razor, view-imports]
module: "Performance & Caching"
source: "notes/TagHelpers_SCRIPT.docx; research-taghelpers-blazor.md"
bloom_levels: [remember, apply]
related: [taghelper-authoring, cache-tag-helper]
---

## `_ViewImports.cshtml` registers Tag Helpers globally

Tag Helpers are not discovered automatically from assemblies. Each Razor project has a `_ViewImports.cshtml` at the top of `Pages/` or `Views/` where registration happens:

```cs
@using MyApp
@namespace MyApp.Pages
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper *, MyApp
```

Two parts per `@addTagHelper` directive:

1. **A glob** — `*` means "every Tag Helper in the assembly," or a fully qualified type name for a single helper.
2. **An assembly name** — the DLL that contains the helpers.

`Microsoft.AspNetCore.Mvc.TagHelpers` is the built-ins (`<cache>`, `<environment>`, `<partial>`, `asp-for`, `asp-controller`, etc.). `MyApp` is wherever your custom helpers live — usually the app's own assembly.

Individual `.cshtml` files inherit from `_ViewImports.cshtml`. You do NOT re-register helpers per-page; registration is global by convention.

## Scoping registrations

Drop a `_ViewImports.cshtml` into a subdirectory to scope registrations to pages under that directory:

```text
Pages/
├── _ViewImports.cshtml          ← global
├── Admin/
│   ├── _ViewImports.cshtml      ← additional for admin pages
│   └── Dashboard.cshtml
```

The admin `Dashboard.cshtml` inherits both files. This pattern is useful when a third-party package adds Tag Helpers you only want in one feature area.

## `@removeTagHelper` — selectively disable

When the global `*, Microsoft.AspNetCore.Mvc.TagHelpers` registration enables a helper you don't want, remove it by exact name:

```cs
@removeTagHelper "Microsoft.AspNetCore.Mvc.TagHelpers.CacheTagHelper, Microsoft.AspNetCore.Mvc.TagHelpers"
```

Rarely needed, but handy for stripping `<cache>` globally when your team has decided to use output caching middleware instead.

## Shaping output in `Process` / `ProcessAsync`

The `TagHelperOutput` passed into your override is the knob panel. Four main capabilities:

**Rewrite the tag name.**

```cs
output.TagName = "div";        // <mytag> → <div>
output.TagName = null;          // suppress the element entirely; keep its content inline
```

**Replace, append, or prepend inner content.**

```cs
output.Content.SetHtmlContent("<p>Hi</p>");
output.Content.AppendHtmlContent("<p>More</p>");
output.PreContent.SetHtmlContent("<!-- begin -->");
output.PostContent.SetHtmlContent("<!-- end -->");
```

`SetHtmlContent` wipes whatever the page author wrote between `<mytag>` and `</mytag>`. `AppendHtmlContent` preserves it and adds after. `PreContent` / `PostContent` inject outside the element's inner HTML but inside the render stream.

**Add, replace, or remove attributes.**

```cs
output.Attributes.SetAttribute("class", "badge badge-warning");
output.Attributes.RemoveAll("data-legacy");
```

**Suppress the entire output.**

```cs
output.SuppressOutput();        // render nothing
```

Useful when a conditional property says "don't show this at all."

## Distinguishing `Content` from `PreContent` / `PostContent`

Given `<mytag>existing inner</mytag>` and this override:

```cs
output.PreContent.SetHtmlContent("[pre]");
output.Content.AppendHtmlContent("[appended]");
output.PostContent.SetHtmlContent("[post]");
```

The rendered HTML is `<mytag>[pre]existing inner[appended][post]</mytag>` — Pre and Post live inside the tag but outside the inner-content area; appended-content adds to existing inner text.

> **Q:** Your Tag Helper targets `<widget>` and overrides `ProcessAsync` with `output.Content.SetHtmlContent("<p>New</p>")`. The page has `<widget><p>Old</p></widget>`. The rendered output shows only `<widget><p>New</p></widget>` — the `<p>Old</p>` vanished. What would preserve it?
> **A:** Swap `SetHtmlContent` for `AppendHtmlContent`. `SetHtmlContent` replaces existing content wholesale; `AppendHtmlContent` keeps the original and adds after. If you want the new content before the existing, use `PreContent.SetHtmlContent` instead.

> **Example**
> A helper that renders nothing when a feature flag is off:
>
> ```cs
> [HtmlTargetElement("feature-gate")]
> public class FeatureGateTagHelper : TagHelper
> {
>     public string? Flag { get; set; }
>     private readonly IFeatureFlags _flags;
>
>     public FeatureGateTagHelper(IFeatureFlags flags) => _flags = flags;
>
>     public override void Process(TagHelperContext _, TagHelperOutput output)
>     {
>         if (!_flags.IsEnabled(Flag!))
>             output.SuppressOutput();
>         else
>             output.TagName = null;   // render children, drop the wrapper tag
>     }
> }
> ```
>
> `<feature-gate flag="new-checkout">…children…</feature-gate>` emits the children when enabled, nothing when disabled, and never emits the `<feature-gate>` wrapper tag itself.

> **Pitfall**
> Forgetting the `@addTagHelper` line in `_ViewImports.cshtml`. The helper compiles fine in its assembly but Razor treats `<toon>` as an unknown HTML element — rendering literal `<toon>` in the page source. The DI container has nothing to do with Tag Helper discovery; `_ViewImports.cshtml` is the only place Razor looks.

> **Takeaway**
> Register helpers once per Razor project in `_ViewImports.cshtml` via `@addTagHelper *, AssemblyName`. In the helper itself, shape the result with `output.TagName`, `output.Content` (`Set` replaces, `Append` preserves), `output.PreContent` / `output.PostContent` for injections around the body, and `output.Attributes.SetAttribute` / `RemoveAll` for attributes. `output.SuppressOutput()` removes the element entirely when a condition fails.
