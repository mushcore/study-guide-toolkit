---
n: 10
id: tag-helpers
title: "Custom Tag Helpers — TagHelper, ProcessAsync, _ViewImports"
hook: "Inherit TagHelper. Decorate with [HtmlTargetElement]. Register in _ViewImports.cshtml."
tags: [tag-helper, razor]
module: "Performance & Caching"
source: "code-examples/ToonTagDemo/ToonTagDemo/TagHelpers/ToonTag.cs + Pages/_ViewImports.cshtml"
bloom_levels: [understand, apply]
related: [cache-redis]
---

## The recipe (ToonTagDemo)

```cs
using Microsoft.AspNetCore.Razor.TagHelpers;

[HtmlTargetElement("toon")]
[HtmlTargetElement(Attributes = "toonie")]        // stacked — two bindings
public class ToonTag : TagHelper
{
    public string? FontFamily { get; set; }         // kebab-case: font-family
    public string? FontSize { get; set; }
    public string? ForegroundColor { get; set; }

    public async override Task ProcessAsync(
        TagHelperContext context,
        TagHelperOutput output)
    {
        IEnumerable<Toon> toons = await GetToonsAsync();

        string customStyle =
            $"font-family: {FontFamily};font-size: {FontSize};color: {ForegroundColor};";
        output.Attributes.SetAttribute("style", customStyle);

        string html = "<table><tr><th>Name</th><th>Picture</th></tr>";
        foreach (var item in toons)
            html += $"<tr><td>{item.FirstName} {item.LastName}</td>" +
                    $"<td><img src='{item.PictureUrl}' style='width:50px'/></td></tr>";
        html += "</table>";

        output.Content.SetHtmlContent(html);
    }
}
```

Usage in Razor:

```cs
<toon font-family="arial" font-size="larger" foreground-color="purple"></toon>
```

## Three pieces

1. **Inherit `TagHelper`** (`Microsoft.AspNetCore.Razor.TagHelpers`).
2. **Decorate with `[HtmlTargetElement(...)]`** — one or more bindings. Stack multiple attributes to match several patterns.
3. **Override `ProcessAsync`** for async work (HTTP, DB, file I/O). Override `Process` for CPU-only.

## `[HtmlTargetElement]` — tag OR attribute

```cs
[HtmlTargetElement("toon")]                  // matches <toon ...>
[HtmlTargetElement(Attributes = "toonie")]   // matches any element with toonie=".."
```

ToonTagDemo stacks both — the helper binds to both patterns.

## PascalCase ↔ kebab-case

Razor auto-translates property names. `FontFamily` in C# binds to `font-family` in markup. `ForegroundColor` ↔ `foreground-color`. Automatic — no config.

## Output manipulation (demo uses two)

```cs
output.Attributes.SetAttribute("style", customStyle);    // add/replace attribute
output.Content.SetHtmlContent(html);                     // replace inner HTML
```

ToonTagDemo does not rewrite `output.TagName` — rendered element stays `<toon>` with computed style + injected table.

## Registration — `_ViewImports.cshtml`

Razor does NOT auto-discover Tag Helpers. From `ToonTagDemo/Pages/_ViewImports.cshtml`:

```cs
@using ToonTagDemo
@namespace ToonTagDemo.Pages
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper "ToonTagDemo.TagHelpers.ToonTag, ToonTagDemo"
```

Two `@addTagHelper` forms:

1. **Wildcard** — `@addTagHelper *, AssemblyName` — every helper in assembly.
2. **Specific type** — `@addTagHelper "FullTypeName, AssemblyName"` — one helper.

Built-ins always via: `@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers` (includes `<cache>`, `<environment>`, `<partial>`, `asp-for`, `asp-controller`, etc.).

## Scoping

Drop additional `_ViewImports.cshtml` into subdirectory to scope registrations to pages under it. Files inherit parent `_ViewImports.cshtml` files. No re-registration per page.

> **Q:** You write `<toon>` in a Razor page. Razor outputs literal `<toon>` in the rendered HTML — no table, no style. Most likely missing step?
> **A:** `@addTagHelper` entry in `_ViewImports.cshtml`. Without it, Razor treats `<toon>` as unknown HTML.

> **Q:** Property `BorderColor` stays null when page has `<widget bordercolor="red">`. Why?
> **A:** PascalCase ↔ kebab-case. `BorderColor` binds to `border-color`, not `bordercolor`.

> **Pitfall**
> Blocking `.Result` or `.Wait()` inside `Process` on an async API — Razor renders on thread pool that starves. Override `ProcessAsync` whenever helper awaits.

> **Pitfall**
> Registering helper in a per-page `.cshtml` file instead of `_ViewImports.cshtml`. Works for one page, forces repetition everywhere else.

> **Takeaway**
> Inherit `TagHelper` → decorate with `[HtmlTargetElement("name")]` or `[HtmlTargetElement(Attributes = "attr")]` (stackable) → override `ProcessAsync(context, output)`. PascalCase property ↔ kebab-case attribute. Manipulate via `output.Attributes.SetAttribute(...)` + `output.Content.SetHtmlContent(...)`. Register in `_ViewImports.cshtml`: `@addTagHelper *, Assembly` (wildcard) or `@addTagHelper "FullType, Assembly"` (specific).
