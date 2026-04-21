---
id: 4870-topic-tag-helpers-built-in-and-custom
title: Tag Helpers — built-in and custom
pillar: tech
priority: medium
chapter: W07
tags:
  - taghelpers
  - tag-helpers
---

### Register in \_ViewImports.cshtml

```cs
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper "*, MyApp"  // your custom tag helpers
```

### Built-in reference

| Element | Key attrs |
| --- | --- |
| form | asp-controller, asp-action, asp-route-\* |
| input/label/select/textarea | asp-for, asp-items |
| span/div | asp-validation-for |
| div (summary) | asp-validation-summary |
| a | asp-controller, asp-action, asp-route-\* |
| script / link | asp-append-version, asp-fallback-src |
| environment | names (Development, Production) |
| cache | expires-after, vary-by-\* |

### Custom tag helper skeleton

```cs
using Microsoft.AspNetCore.Razor.TagHelpers;

[HtmlTargetElement("quote")]  // <quote text="..."></quote>
public class QuoteTag : TagHelper {
    public string Text { get; set; }
    public string Author { get; set; }  // attribute: author

    public override void Process(TagHelperContext ctx, TagHelperOutput out) {
        out.TagName = "blockquote";
        out.Attributes.SetAttribute("class", "quote");
        out.Content.SetHtmlContent($""{Text}" — {Author}");
    }
}
```

### Kebab-case rule

Property `FontFamily` → HTML attribute `font-family`. Property `Text` → `text`.
