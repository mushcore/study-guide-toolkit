---
n: 13
id: tag-helpers
title: "Tag Helpers — built-in, custom, and the &lt;cache&gt; tag helper"
hook: "Inherit TagHelper. [HtmlTargetElement] for binding. Register in _ViewImports.cshtml. Built-in &lt;cache&gt; caches Razor fragments."
tags: [tag-helper, razor, cache-tag-helper, viewimports]
module: "Razor & Caching"
source: "materials/Lessons/W07/Tag Helpers/* + W11 Tag-Helper Cache + ToonTagDemo"
bloom_levels: [understand, apply]
related: [cache-redis, blazor-quickgrid]
---

## What this lesson covers

Tag Helpers are **3 marks** on the exam, but they show up everywhere in Razor markup so the patterns are worth knowing. Three pieces:

1. **What a Tag Helper is** + the **built-in** ones you've already used (`asp-for`, `asp-controller`, `<environment>`, `<partial>`).
2. **How to write a custom Tag Helper** (the `ToonTag` demo).
3. **The `<cache>` Tag Helper** (covered briefly in Lesson 07; recapped here as the most testable built-in).

---

## Vocabulary

| Term | Meaning |
|---|---|
| **Tag Helper** | A C# class that participates in Razor rendering. Either binds to an element name (`<toon>`) or to attributes (`asp-for="..."`). |
| **`TagHelper`** (base class) | The class custom helpers inherit from. |
| **`[HtmlTargetElement]`** | Attribute that says "what should this helper bind to?" |
| **`Process` / `ProcessAsync`** | The override where you read attributes and produce output. |
| **`TagHelperContext`** | Per-call info — the source attributes, unique ID, items dict. |
| **`TagHelperOutput`** | What you write into — tag name, attributes, content. |
| **`_ViewImports.cshtml`** | The Razor file where Tag Helpers are registered for the directory. |
| **`@addTagHelper`** | Directive in `_ViewImports.cshtml` that registers helpers. |
| **`<cache>`** | A built-in Tag Helper that caches the rendered HTML of a Razor block. |

---

## What is a Tag Helper?

A Razor element or attribute that maps to **server-side C# code** at render time.

**Built-in examples** you've already used:

| Markup | What it does |
|---|---|
| `<input asp-for="Email" />` | Generates `<input type="text" id="Email" name="Email" value="...">` |
| `<a asp-controller="Home" asp-action="Index">Home</a>` | Builds the URL via routing |
| `<form asp-page="/Login">` | Sets the form's `action` attribute via routing |
| `<environment include="Development">...</environment>` | Renders only in the named environment |
| `<partial name="_Footer" />` | Renders a partial view |
| `<cache vary-by-user="true">...</cache>` | Caches the inner rendered HTML |

> **Analogy**
> Tag Helpers are to Razor what custom React components are to JSX — but rendered server-side and producing plain HTML.

---

## Custom Tag Helper recipe — `ToonTag` demo

```cs
using Microsoft.AspNetCore.Razor.TagHelpers;

[HtmlTargetElement("toon")]                 // matches <toon ...>
[HtmlTargetElement(Attributes = "toonie")]  // matches any element with toonie="..."
public class ToonTag : TagHelper
{
    // PascalCase property ↔ kebab-case attribute
    public string? FontFamily      { get; set; }    // binds to font-family="..."
    public string? FontSize        { get; set; }    // binds to font-size="..."
    public string? ForegroundColor { get; set; }    // binds to foreground-color="..."

    public async override Task ProcessAsync(
        TagHelperContext context,
        TagHelperOutput output)
    {
        IEnumerable<Toon> toons = await GetToonsAsync();

        // Write/replace an attribute on the output element
        var customStyle = $"font-family:{FontFamily};font-size:{FontSize};color:{ForegroundColor};";
        output.Attributes.SetAttribute("style", customStyle);

        // Replace inner HTML with computed content
        var html = "<table><tr><th>Name</th><th>Picture</th></tr>";
        foreach (var item in toons)
            html += $"<tr><td>{item.FirstName} {item.LastName}</td>" +
                    $"<td><img src='{item.PictureUrl}' style='width:50px'/></td></tr>";
        html += "</table>";

        output.Content.SetHtmlContent(html);
    }
}
```

Usage in a Razor page:

```html
<toon font-family="arial" font-size="larger" foreground-color="purple"></toon>
```

### Three rules for custom Tag Helpers

1. **Inherit `TagHelper`** (from `Microsoft.AspNetCore.Razor.TagHelpers`).
2. **Decorate with `[HtmlTargetElement(...)]`** — one or more bindings. Stack multiple attributes to bind to several patterns.
3. **Override `ProcessAsync` for async work**, `Process` for purely CPU work.

---

## `[HtmlTargetElement]` — three binding shapes

```cs
[HtmlTargetElement("toon")]                              // by tag name
[HtmlTargetElement(Attributes = "toonie")]               // by any attribute named "toonie"
[HtmlTargetElement("button", Attributes = "data-modal")] // by tag AND attribute (both required)
```

**Stacking** multiple `[HtmlTargetElement]` attributes = **OR** logic — bind to any matching pattern.

---

## PascalCase ↔ kebab-case

Razor auto-translates property names:

| C# property | Razor attribute |
|---|---|
| `FontFamily` | `font-family` |
| `ForegroundColor` | `foreground-color` |
| `MaxItems` | `max-items` |
| `IsEnabled` | `is-enabled` |

**Automatic — no configuration needed.** Override with `[HtmlAttributeName("custom-name")]` if you need a different mapping.

> **Pitfall**
> Property `BorderColor` doesn't bind to `<widget bordercolor="red">` — that single token doesn't get split. It binds to `border-color="red"`.

---

## Output manipulation

| `output.*` | Use |
|---|---|
| `output.TagName = "div"` | Change the rendered tag name |
| `output.Attributes.SetAttribute("class", "btn btn-primary")` | Add or replace an attribute |
| `output.Content.SetHtmlContent(html)` | Replace inner content with HTML |
| `output.Content.SetContent(text)` | Replace inner content with safely escaped text |
| `output.PreElement.SetHtmlContent("<hr/>")` | Insert HTML **before** the element |
| `output.PostElement.SetHtmlContent("<hr/>")` | Insert HTML **after** the element |

---

## Registration — `_ViewImports.cshtml`

Razor does **not auto-discover** Tag Helpers. You must register them in `_ViewImports.cshtml`:

```razor
@using ToonTagDemo
@namespace ToonTagDemo.Pages

@* Register all built-in Tag Helpers (cache, environment, asp-for, etc.) *@
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers

@* Register custom Tag Helpers — two forms *@
@addTagHelper "ToonTagDemo.TagHelpers.ToonTag, ToonTagDemo"
```

| Form | Use |
|---|---|
| `@addTagHelper *, AssemblyName` | Wildcard — register **all** Tag Helpers in the assembly |
| `@addTagHelper "FullTypeName, AssemblyName"` | Register **one specific** type |

The built-in `<cache>`, `<environment>`, `<partial>`, `asp-for`, `asp-controller` Tag Helpers all come from `Microsoft.AspNetCore.Mvc.TagHelpers`.

### Scoping

Drop additional `_ViewImports.cshtml` into a subdirectory to **scope** registrations to pages under it. Files inherit parent `_ViewImports.cshtml` files automatically — no re-registration needed per page.

---

## The `<cache>` Tag Helper recap

Already covered in Lesson 07, but worth recapping here since it's the most exam-relevant **built-in** Tag Helper.

```html
<cache vary-by-user="true"
       vary-by-route="id"
       expires-after="@TimeSpan.FromMinutes(10)"
       expires-sliding="@TimeSpan.FromMinutes(2)">
    @await Html.PartialAsync("_ProductDetail", Model)
</cache>
```

| Attribute | Effect |
|---|---|
| `expires-after="@TimeSpan"` | Absolute TTL |
| `expires-on="@DateTime"` | Absolute wall-clock |
| `expires-sliding="@TimeSpan"` | Idle timeout |
| `vary-by-user="true"` | Per authenticated user |
| `vary-by-route="id"` | Per route param value |
| `vary-by-query="search"` | Per query-string key |
| `vary-by-cookie="SessionId"` | Per cookie value |
| `vary-by-header="User-Agent"` | Per HTTP header |
| `vary-by="@Model.Key"` | Custom key |
| `enabled="@false"` | Bypass cache (debugging) |

> **Note**
> `<cache>` is backed by `IMemoryCache` (per server). For shared cache across servers, use `<distributed-cache>` (same attribute shape, backed by `IDistributedCache` → Redis).

---

## Question patterns to expect

| Pattern | Example stem | Answer |
|---|---|---|
| **Base class** | "Which class do custom Tag Helpers inherit from?" | `TagHelper` (in `Microsoft.AspNetCore.Razor.TagHelpers`) |
| **Attribute** | "Which attribute selects what a Tag Helper binds to?" | `[HtmlTargetElement(...)]` |
| **Override** | "Which method runs async work in a Tag Helper?" | `ProcessAsync(TagHelperContext context, TagHelperOutput output)` |
| **Registration** | "Where do you register Tag Helpers?" | `_ViewImports.cshtml` via `@addTagHelper *, AssemblyName` |
| **Casing** | "How does property `MaxItems` bind in Razor?" | `max-items="..."` (PascalCase ↔ kebab-case) |
| **Output method** | "Which method replaces inner HTML in a Tag Helper?" | `output.Content.SetHtmlContent(html)` |
| **Output method** | "Which method sets an attribute on the output element?" | `output.Attributes.SetAttribute("style", value)` |
| **Cache TH attribute** | "Which `<cache>` attribute creates a separate cache entry per route param?" | `vary-by-route="id"` |
| **Failure mode** | "`<toon>` renders as literal HTML — no table or style. Why?" | Missing `@addTagHelper` entry in `_ViewImports.cshtml` |

---

## Retrieval checkpoints

> **Q:** Which class do custom Tag Helpers inherit from, and where do you register them?
> **A:** Inherit **`TagHelper`** from `Microsoft.AspNetCore.Razor.TagHelpers`. Register in **`_ViewImports.cshtml`** via `@addTagHelper`.

> **Q:** Which attribute decorates a custom Tag Helper to bind it to an element?
> **A:** **`[HtmlTargetElement("name")]`** — also accepts `Attributes = "name"` and can be stacked.

> **Q:** What's the casing convention between C# property names and Razor attribute names?
> **A:** **PascalCase ↔ kebab-case.** `FontFamily` → `font-family`. `MaxItems` → `max-items`.

> **Q:** Which method should you override for async work?
> **A:** **`ProcessAsync(TagHelperContext context, TagHelperOutput output)`** — returns `Task`. Use `Process(...)` for CPU-only work.

> **Q:** Which method on `output` replaces the inner content with raw HTML?
> **A:** **`output.Content.SetHtmlContent(html)`** — vs `SetContent(text)` which escapes.

> **Q:** Two forms of `@addTagHelper` — what are they?
> **A:** Wildcard: **`@addTagHelper *, AssemblyName`** (register all). Specific: **`@addTagHelper "FullTypeName, AssemblyName"`** (register one).

> **Q:** What `<cache>` attribute caches a separate entry per logged-in user?
> **A:** **`vary-by-user="true"`**.

> **Q:** Why might `<toon>` render literally as `<toon>...</toon>` in the browser?
> **A:** **Missing `@addTagHelper`** entry in `_ViewImports.cshtml`. Razor treats unregistered names as unknown HTML.

---

## Common pitfalls

> **Pitfall**
> Razor doesn't auto-discover Tag Helpers. You must register via `@addTagHelper` in `_ViewImports.cshtml`. Without it, `<toon>` is rendered as literal text.

> **Pitfall**
> Blocking with `.Result` or `.Wait()` inside `Process(...)` on an async API. Razor renders on a thread pool that can starve. **Override `ProcessAsync(...)`** whenever the helper awaits anything.

> **Pitfall**
> Registering a Tag Helper in a per-page `.cshtml` file instead of `_ViewImports.cshtml`. Works on one page, forces repetition everywhere else.

> **Pitfall**
> Property `BorderColor` doesn't bind to `bordercolor="..."`. Razor splits PascalCase only at uppercase boundaries — it binds to `border-color="..."`.

> **Pitfall**
> Forgetting `vary-by-*` on a per-user `<cache>` block. The first user's render is shown to everyone until the TTL expires.

---

## Takeaway

> **Takeaway**
> **Custom:** inherit **`TagHelper`** → decorate with **`[HtmlTargetElement("name")]`** or **`[HtmlTargetElement(Attributes = "attr")]`** (stackable) → override **`ProcessAsync(context, output)`**. **PascalCase ↔ kebab-case** auto-translation. Manipulate via **`output.Attributes.SetAttribute(...)`** + **`output.Content.SetHtmlContent(...)`** + optional `output.TagName`. **Register in `_ViewImports.cshtml`:** `@addTagHelper *, Assembly` (wildcard) or `@addTagHelper "FullType, Assembly"` (specific). **Built-in `<cache>`** caches Razor fragments — `vary-by-user/route/query/...` controls partitioning.
