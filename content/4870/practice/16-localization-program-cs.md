---
n: 16
id: localization-program-cs
title: "Localization wiring in Program.cs (5 calls + middleware)"
kind: code
lang: csharp
tags: [localization, i18n, code-question]
source: "Lesson 12 (likely-pattern coding question for Localization bucket — 4 marks on final)"
---

## Prompt

Write the localization wiring inside `Program.cs` for an ASP.NET Core Razor Pages app. The wiring should:

1. Register **`AddLocalization`** with `ResourcesPath = "Resources"`.
2. Configure **`RequestLocalizationOptions`** with three supported cultures (`"en"`, `"fr"`, `"de"`), default culture `"en"`, and use the same list for **both** `SupportedCultures` and `SupportedUICultures`.
3. Add **view localization** via `AddMvc().AddViewLocalization()`.
4. After `var app = builder.Build();`, call **`app.UseRequestLocalization(...)`** middleware.

Skip the unrelated parts (DB context, MapRazorPages). Write only the localization-specific lines.

## Starter

```cs
// (1) AddLocalization with ResourcesPath
// (2) Configure RequestLocalizationOptions
// (3) AddMvc + AddViewLocalization

var app = builder.Build();

// (4) UseRequestLocalization middleware
```

## Solution

```cs
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] {
        new CultureInfo("en"),
        new CultureInfo("fr"),
        new CultureInfo("de")
    };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures     = supportedCultures;
    options.SupportedUICultures   = supportedCultures;
});

builder.Services.AddMvc().AddViewLocalization();

var app = builder.Build();

app.UseRequestLocalization();
```

## Why

Five things must be wired:
- **`AddLocalization`** registers `IStringLocalizer<T>` and `IHtmlLocalizer<T>` in DI; `ResourcesPath` is the root folder under which `.resx` files live.
- **`SupportedCultures`** drives **formatting** (`Thread.CurrentCulture`); **`SupportedUICultures`** drives **`.resx` selection** (`Thread.CurrentUICulture`). Set BOTH or one of formatting/translation will silently default.
- **`AddViewLocalization()`** wires `IViewLocalizer` for `.cshtml` `@inject`.
- **`UseRequestLocalization()`** is the middleware that runs the culture providers (query string → cookie → Accept-Language) and **sets `CurrentCulture` + `CurrentUICulture` per request**.

A common wrong approach is **forgetting `app.UseRequestLocalization()`** — every other line in `Program.cs` looks correct, no exception is thrown, and every request silently uses the default culture.

Another wrong approach is setting only **one** of `SupportedCultures` / `SupportedUICultures`. Numbers might format in French while UI text stays in English (or vice versa). Set both to the same list unless you specifically need them different.
