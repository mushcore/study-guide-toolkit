---
n: 17
id: custom-tag-helper
title: "Custom Tag Helper — TagHelper + ProcessAsync"
kind: code
lang: csharp
tags: [tag-helper, razor, code-question]
source: "Lesson 13 (likely-pattern coding question for Tag Helpers bucket — 3 marks on final)"
---

## Prompt

Write a custom Tag Helper named **`GreetingTagHelper`**. The helper should:

1. Inherit from **`TagHelper`** and bind to the element name **`<greeting>`**.
2. Expose a **`Name`** property (binds to `name="..."`).
3. In **`Process`** (synchronous — no async work), set the output's content to `"Hello, {Name}!"` using **`output.Content.SetContent(...)`**.
4. Set the output element's tag name to `"h1"` (so `<greeting name="World">` renders as `<h1>Hello, World!</h1>`).

Write only the class.

## Starter

```cs
using Microsoft.AspNetCore.Razor.TagHelpers;

[HtmlTargetElement("greeting")]
public class GreetingTagHelper : TagHelper
{
    // TODO 1: Name property
    // TODO 2: override Process — set TagName to "h1", set content to "Hello, {Name}!"
}
```

## Solution

```cs
using Microsoft.AspNetCore.Razor.TagHelpers;

[HtmlTargetElement("greeting")]
public class GreetingTagHelper : TagHelper
{
    public string? Name { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "h1";
        output.Content.SetContent($"Hello, {Name}!");
    }
}
```

## Why

The three rules: inherit **`TagHelper`**, decorate with **`[HtmlTargetElement(...)]`**, override **`Process`** (sync) or **`ProcessAsync`** (async). PascalCase property `Name` automatically binds to kebab-case attribute `name="..."`. **`output.TagName`** rewrites the rendered tag; **`output.Content.SetContent(...)`** safely escapes text (use `SetHtmlContent` for raw HTML).

A common wrong approach is forgetting to **register the helper in `_ViewImports.cshtml`** with `@addTagHelper "FullTypeName, AssemblyName"` (or `@addTagHelper *, AssemblyName`). Razor doesn't auto-discover helpers — without the registration, `<greeting>` renders as literal unknown HTML.

Another wrong approach is using **`output.Content.SetHtmlContent($"<h1>Hello, {Name}!</h1>")`** without setting `output.TagName`. That produces `<greeting><h1>Hello, World!</h1></greeting>` — the outer `<greeting>` element doesn't disappear unless you also rewrite it (or call `output.TagName = null;` to erase it).
