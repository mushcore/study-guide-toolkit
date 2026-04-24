---
n: 21
id: taghelper-authoring
title: "Tag Helper authoring — TagHelper base class, ProcessAsync, HtmlTargetElement"
hook: "Inherit, decorate, override `ProcessAsync`. HTML attributes map to PascalCase properties."
tags: [tag-helper, razor, asp-net-core]
module: "Performance & Caching"
source: "notes/TagHelpers_SCRIPT.docx; research-taghelpers-blazor.md"
bloom_levels: [understand, apply]
related: [taghelper-output-registration, cache-tag-helper]
---

## The three-piece recipe

Custom Tag Helpers let you emit HTML from server-side C#. Three pieces create one:

1. **Inherit from `TagHelper`** (from `Microsoft.AspNetCore.Razor.TagHelpers`).
2. **Decorate with `[HtmlTargetElement("name")]`** — the tag name Razor binds to.
3. **Override `ProcessAsync(TagHelperContext, TagHelperOutput)`** (or `Process` for synchronous bodies) — the body that emits HTML.

```cs
using Microsoft.AspNetCore.Razor.TagHelpers;

[HtmlTargetElement("toon")]
public class ToonTagHelper : TagHelper
{
    public string? FontFamily { get; set; }
    public string? FontSize   { get; set; }

    public override async Task ProcessAsync(
        TagHelperContext context,
        TagHelperOutput output)
    {
        var toons = await FetchToonsAsync();
        var rows = string.Join("", toons.Select(t => $"<tr><td>{t.Name}</td></tr>"));

        output.TagName = "table";                       // rewrite the element
        output.Content.SetHtmlContent(rows);             // inject inner HTML
        output.Attributes.SetAttribute(                  // attach a computed style
            "style", $"font-family:{FontFamily};font-size:{FontSize};");
    }
}
```

Use it in a Razor page:

```cs
<toon font-family="arial" font-size="larger"></toon>
```

At render time, the tag becomes a `<table>` with your computed rows.

## PascalCase properties ↔ kebab-case attributes

Razor auto-translates between C# property names and HTML attribute names. `FontFamily` on the C# side becomes `font-family` on the HTML side. `ForegroundColor` becomes `foreground-color`. No underscores, no camelCase — always kebab-case in the Razor markup.

```cs
public string? ForegroundColor { get; set; }   // C#
```

```html
<toon foreground-color="purple"></toon>        <!-- Razor -->
```

This mapping is a one-way derivation, not a config choice. Write your property names in PascalCase; Razor handles the rest.

## `[HtmlTargetElement]` — target tags or attributes

The simplest form targets a tag name:

```cs
[HtmlTargetElement("toon")]          // binds to <toon ...>
```

You can also target an existing tag when a specific attribute is present:

```cs
[HtmlTargetElement("div", Attributes = "toonie")]  // binds to <div toonie ...>
```

Multiple `[HtmlTargetElement]` attributes stack — one Tag Helper can bind to several patterns.

## `ProcessAsync` vs `Process`

Override `ProcessAsync` when your body awaits anything — an HTTP call, a DB query, file I/O. Override `Process` when the body is CPU-only. Mixing them (calling `Task.Run(...)` inside `Process`) blocks the rendering thread and can deadlock; async rendering flows through `ProcessAsync` cleanly.

## Output manipulation primitives

The `TagHelperOutput` object exposes three main knobs:

| Mutation | Effect |
|---|---|
| `output.TagName = "div"` | Change the rendered tag name. Set `null` to suppress the element. |
| `output.Content.SetHtmlContent("...")` | Replace inner HTML. |
| `output.Content.AppendHtmlContent("...")` | Append without clearing existing content. |
| `output.Attributes.SetAttribute("key", "val")` | Add or replace an HTML attribute. |
| `output.PreContent` / `output.PostContent` | Inject HTML before / after the element body. |

The difference between `Set` and `Append` matters: `Set` wipes whatever the page author wrote between the open and close tags; `Append` preserves it.

> **Q:** A Tag Helper has a property `public string? BorderColor { get; set; }`. The page author writes `<widget bordercolor="red">`. The property stays null. Why?
> **A:** Razor maps PascalCase to kebab-case — `BorderColor` binds to `border-color`, not `bordercolor`. Rewrite the markup as `<widget border-color="red">` and the property populates.

> **Example**
> A minimal "environment badge" tag that emits a colored span:
>
> ```cs
> [HtmlTargetElement("env-badge")]
> public class EnvBadgeTagHelper : TagHelper
> {
>     public string? Name { get; set; }
>
>     public override void Process(TagHelperContext _, TagHelperOutput output)
>     {
>         output.TagName = "span";
>         output.Attributes.SetAttribute(
>             "style", Name == "prod" ? "color:red" : "color:green");
>         output.Content.SetHtmlContent($"env: {Name}");
>     }
> }
> ```
>
> `<env-badge name="dev"></env-badge>` renders as `<span style="color:green">env: dev</span>`. No async I/O → override `Process`, not `ProcessAsync`.

> **Pitfall**
> Using `Task.Run(...)` or synchronous blocking inside `Process` to call an async API. Razor renders views on a thread pool that starves under blocking calls — the page appears to hang, or throws a deadlock. Override `ProcessAsync` whenever your helper does anything async.

> **Takeaway**
> Create a Tag Helper by inheriting from `TagHelper`, decorating with `[HtmlTargetElement("tag-name")]`, and overriding `ProcessAsync(context, output)`. PascalCase properties (`FontFamily`) bind to kebab-case HTML attributes (`font-family`). Use `output.TagName`, `output.Content.SetHtmlContent`, and `output.Attributes.SetAttribute` to rewrite the rendered element. Pick `ProcessAsync` for async bodies and `Process` for CPU-only.
