---
n: 24
id: localization-setup
title: "Localization setup — AddLocalization, AddViewLocalization, UseRequestLocalization"
hook: "Three registrations in Program.cs; one middleware call. Skip any and localization silently fails."
tags: [i18n, middleware, program-cs]
module: "Internationalization & Modern UI"
source: "notes/razor_pages_localization_SCRIPT.docx; research-localization.md §3"
bloom_levels: [understand, apply]
related: [localization-resources-cultures, localization-injection]
---

## The five-line localization boilerplate

Every ASP.NET Core app that localizes anything needs this in `Program.cs`:

```cs
var builder = WebApplication.CreateBuilder(args);

// 1. Register localization services + where resource files live
builder.Services.AddLocalization(opts => opts.ResourcesPath = "Resources");

// 2. Declare supported cultures + default
builder.Services.Configure<RequestLocalizationOptions>(opts =>
{
    var supported = new[]
    {
        new CultureInfo("en"),
        new CultureInfo("fr"),
        new CultureInfo("de"),
    };
    opts.DefaultRequestCulture = new RequestCulture("en");
    opts.SupportedCultures      = supported;   // formatting (CurrentCulture)
    opts.SupportedUICultures    = supported;   // resource-file picks (CurrentUICulture)
});

// 3. Turn on view + data-annotation localization
builder.Services.AddMvc()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization();

var app = builder.Build();

// 4. Apply detected culture to each request
app.UseRequestLocalization();

app.MapRazorPages();
app.Run();
```

Five registrations, one middleware call. Skip any one and the chain falls silently.

## What each line does

- **`AddLocalization`** registers `IStringLocalizer<T>`, `IHtmlLocalizer<T>`, and the underlying factory. `ResourcesPath` is the root folder for `.resx` files.
- **`Configure<RequestLocalizationOptions>`** declares which cultures the app is willing to serve and the fallback. `SupportedCultures` sets the allowed values for `CurrentCulture` (formatting); `SupportedUICultures` sets allowed values for `CurrentUICulture` (which `.resx`).
- **`AddViewLocalization`** wires up `IViewLocalizer` so you can `@inject` it in `.cshtml` files.
- **`AddDataAnnotationsLocalization`** translates validation attributes like `[Required(ErrorMessage = "FieldRequired")]` through `IStringLocalizer`.
- **`app.UseRequestLocalization()`** is the middleware that actually runs the culture providers on each request and sets `Thread.CurrentCulture` + `CurrentUICulture` accordingly.

Register the services but forget `UseRequestLocalization` and you get a silent no-op: every request uses the default culture, and any user-selected language is ignored.

## Middleware ordering matters

`UseRequestLocalization` must run **before** any middleware or endpoint that reads localized content. The typical order:

```cs
app.UseRequestLocalization();   // 1. detect culture
app.UseStaticFiles();            // 2. static content
app.UseRouting();                // 3. endpoint matching
app.UseAuthorization();          // 4. auth
app.MapRazorPages();             // 5. endpoints
```

Putting `UseRequestLocalization` after `UseRouting` or `UseEndpoints` causes endpoint handlers to run with the default culture even when the user's preferred culture was detectable.

## Explicit options + middleware

The simple `app.UseRequestLocalization()` call reads options from DI and applies them. If you need to manipulate options at middleware time (e.g. swap providers) you can pass them explicitly:

```cs
using (var scope = app.Services.CreateScope())
{
    var opts = scope.ServiceProvider
        .GetRequiredService<IOptions<RequestLocalizationOptions>>()
        .Value;
    app.UseRequestLocalization(opts);
}
```

Same effect; more boilerplate. Use the explicit form only when you need it.

## Culture-switcher handler

The UI for letting a user switch language is covered in the practice file and `localization-injection` lesson. The core handler is a `POST` that writes the `.AspNetCore.Culture` cookie:

```cs
public IActionResult OnPost(string culture, string returnUrl)
{
    Response.Cookies.Append(
        CookieRequestCultureProvider.DefaultCookieName,
        CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
        new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) });

    return LocalRedirect(returnUrl);
}
```

`CookieRequestCultureProvider` will pick this up on subsequent requests, because the cookie provider is registered by `UseRequestLocalization()` by default.

> **Q:** Your app has `AddLocalization`, `Configure<RequestLocalizationOptions>`, and `AddViewLocalization` in `Program.cs`. Users report language is never switching. What's the single most likely missing line?
> **A:** `app.UseRequestLocalization()`. Without the middleware call, no provider runs, `CurrentCulture` / `CurrentUICulture` never get set from the request, and the app behaves as if every user preferred the default culture. The symptoms are exactly "nothing localizes no matter what I do."

> **Example**
> The minimum viable localization boot — trimmed to the three absolute essentials for a single-language-switch demo:
>
> ```cs
> var builder = WebApplication.CreateBuilder(args);
>
> builder.Services.AddLocalization(o => o.ResourcesPath = "Resources");
> builder.Services.Configure<RequestLocalizationOptions>(o =>
> {
>     o.DefaultRequestCulture = new RequestCulture("en");
>     o.SupportedCultures   = new[] { new CultureInfo("en"), new CultureInfo("fr") };
>     o.SupportedUICultures = o.SupportedCultures;
> });
> builder.Services.AddRazorPages().AddViewLocalization();
>
> var app = builder.Build();
> app.UseRequestLocalization();
> app.MapRazorPages();
> app.Run();
> ```
>
> With a matching pair of `Resources/Pages/IndexModel.en.resx` and `Resources/Pages/IndexModel.fr.resx`, appending `?culture=fr` to any page now flips it to French.

> **Pitfall**
> Calling `AddLocalization` without `AddViewLocalization` in a Razor Pages app. `IStringLocalizer<PageModel>` works in code-behind, but `@inject IViewLocalizer` in `.cshtml` fails at runtime with "no service registered." Always pair them when views need to localize directly.

> **Takeaway**
> Register `AddLocalization` (with `ResourcesPath`), configure `RequestLocalizationOptions` (SupportedCultures + SupportedUICultures + DefaultRequestCulture), call `AddViewLocalization` and `AddDataAnnotationsLocalization` if you need them, and — critically — call `app.UseRequestLocalization()` early in the middleware pipeline. Skipping the middleware is the most common reason localization silently does nothing.
