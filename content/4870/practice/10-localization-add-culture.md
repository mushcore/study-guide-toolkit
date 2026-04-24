---
n: 10
id: localization-add-culture
title: "Register French as a supported culture in Program.cs"
kind: code
lang: cs
tags: [i18n, program-cs, request-localization]
source: "Labs/W10 Localization/ Q1 (variant — adding one additional culture to an English-only app, simpler than the lab which added four cultures plus a switcher)"
---

## Prompt

You have an existing Razor Pages app that currently only supports English. Add French as a supported culture so that `IStringLocalizer` loads French `.resx` files when `CurrentUICulture` is `fr`. Use `Resources/` as the resource root. English must remain the default.

## Starter

```cs
var builder = WebApplication.CreateBuilder(args);

// TODO: register localization services with ResourcesPath = "Resources".
// TODO: configure RequestLocalizationOptions for English and French,
//       with English as the default.

builder.Services.AddRazorPages()
    .AddViewLocalization();

var app = builder.Build();

// TODO: enable UseRequestLocalization middleware.

app.MapRazorPages();
app.Run();
```

## Solution

```cs
using System.Globalization;
using Microsoft.AspNetCore.Localization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLocalization(opts => opts.ResourcesPath = "Resources");

builder.Services.Configure<RequestLocalizationOptions>(opts =>
{
    var supported = new[]
    {
        new CultureInfo("en"),
        new CultureInfo("fr"),
    };
    opts.DefaultRequestCulture = new RequestCulture("en");
    opts.SupportedCultures     = supported;
    opts.SupportedUICultures   = supported;
});

builder.Services.AddRazorPages()
    .AddViewLocalization();

var app = builder.Build();

app.UseRequestLocalization();

app.MapRazorPages();
app.Run();
```

## Why

Three service registrations plus one middleware call are the minimum to flip a single-language app into a multi-culture app.

`AddLocalization(opts => opts.ResourcesPath = "Resources")` tells the framework where `.resx` files live. `RequestLocalizationOptions.SupportedCultures` sets which values `Thread.CurrentCulture` (formatting) may take; `SupportedUICultures` sets which values `Thread.CurrentUICulture` (resource lookup) may take. Both must be set, typically to the same list, or you end up with a half-localized page.

`app.UseRequestLocalization()` is the middleware that runs the registered culture providers on each request and applies the result. Without it, the options are configured but nothing executes them.

Common wrong approaches:

- **Forgetting `app.UseRequestLocalization()`.** Services are registered, resource files exist, but no request ever has its culture set from the providers. `IStringLocalizer<T>["Key"]` always returns the English value.
- **Setting `SupportedCultures` but not `SupportedUICultures`.** Numbers format in French, but strings stay in English because `CurrentUICulture` never changes from the default. Always set both.
- **Importing `System.Globalization` but omitting `Microsoft.AspNetCore.Localization`.** `CultureInfo` comes from the first namespace, but `RequestCulture` and `CookieRequestCultureProvider` come from the second. The code compiles only when both are imported.
