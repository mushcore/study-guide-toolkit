---
n: 11
id: localization
title: "Localization — AddLocalization, cultures, IStringLocalizer"
hook: "Five registrations + UseRequestLocalization middleware. Skip the middleware → silent no-op."
tags: [i18n, culture, resx]
module: "Internationalization & Modern UI"
source: "Labs/W10 Localization/Sports/Program.cs + SharedResource.cs + Services/SharedResourceService.cs"
bloom_levels: [understand, apply]
related: [blazor-quickgrid]
---

## W10 Sports lab — full `Program.cs`

```cs
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Options;
using Sports;
using Sports.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1. Register localization services
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

// 2. Declare supported cultures + default
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] {
        new CultureInfo("en"),
        new CultureInfo("de"),
        new CultureInfo("fr"),
        new CultureInfo("zh"),
        new CultureInfo("en-US")
    };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures     = supportedCultures;
    options.SupportedUICultures   = supportedCultures;
});

// 3. Turn on view + data-annotation localization
builder.Services.AddMvc()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization(options =>
    {
        options.DataAnnotationLocalizerProvider = (type, factory) =>
            factory.Create(typeof(SharedResource));
    });

builder.Services.AddSingleton<SharedResourceService>();

var app = builder.Build();

// 4. Apply detected culture to each request (lab uses explicit opts via scope)
using (var scope = app.Services.CreateScope())
{
    var localizationOptions = scope.ServiceProvider
        .GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
    app.UseRequestLocalization(localizationOptions);
}

app.MapRazorPages();
app.Run();
```

Skip any call (especially `UseRequestLocalization`) → every request uses default culture silently.

## What each line does

- **`AddLocalization`** — registers `IStringLocalizer<T>`, `IHtmlLocalizer<T>`, factory. `ResourcesPath` = root folder for `.resx` files.
- **`Configure<RequestLocalizationOptions>`** — allowed cultures + fallback. `SupportedCultures` → formatting (`CurrentCulture`). `SupportedUICultures` → resource file picks (`CurrentUICulture`).
- **`AddViewLocalization`** — wires `IViewLocalizer` for `.cshtml` `@inject`.
- **`AddDataAnnotationsLocalization`** — translates `[Required(ErrorMessage = "X")]` via `IStringLocalizer`. W10 routes through `SharedResource` via `DataAnnotationLocalizerProvider`.
- **`UseRequestLocalization()`** — middleware runs culture providers per request, sets `Thread.CurrentCulture` + `CurrentUICulture`.

## CurrentCulture vs CurrentUICulture

| Property | Controls |
|---|---|
| `Thread.CurrentCulture` | Date/number/currency formatting (`.ToString()`, `decimal.ToString("C")`) |
| `Thread.CurrentUICulture` | Which `.resx` gets loaded by `IStringLocalizer` |

Set both via `SupportedCultures` + `SupportedUICultures`. Setting only one leaves either formatting OR translations at default.

## Resource file paths

For `Pages/Index.cshtml.cs` (class `IndexModel`):

```text
Resources/Pages/IndexModel.fr.resx
```

Rules:

1. **Root** matches `options.ResourcesPath` (conventionally `Resources`).
2. **Subfolder** mirrors the class's folder (`Pages/`).
3. **Filename** = `<ClassName>.<culture>.resx`.

Examples:

- Controller `Controllers/HomeController.cs` → `Resources/Controllers/HomeController.fr.resx`
- Shared marker class → `Resources/SharedResource.fr.resx` (no subfolder if at root namespace)

## Shared resource pattern

Empty marker class at root namespace:

```cs
// Sports/SharedResource.cs
namespace Sports;
public class SharedResource { }
```

Service that uses `IStringLocalizerFactory`:

```cs
// Sports/Services/SharedResourceService.cs
using System.Reflection;
using Microsoft.Extensions.Localization;

namespace Sports.Services;

public class SharedResourceService
{
    private readonly IStringLocalizer localizer;
    public SharedResourceService(IStringLocalizerFactory factory)
    {
        var assemblyName = new AssemblyName(
            typeof(SharedResource).GetTypeInfo().Assembly.FullName!);
        localizer = factory.Create(nameof(SharedResource), assemblyName.Name!);
    }

    public string Get(string key) => localizer[key];
}
```

Register + inject:

```cs
builder.Services.AddSingleton<SharedResourceService>();

// Razor page
@inject SharedResourceService Shared
<footer>© @Shared.Get("CompanyName")</footer>
```

## Culture providers (default order)

`UseRequestLocalization` runs three providers in order. First match wins:

1. **QueryString** — `?culture=fr` in URL. Highest priority.
2. **Cookie** — `.AspNetCore.Culture` cookie (persistent user selection).
3. **AcceptLanguageHeader** — browser's `Accept-Language` header.

## Switch cookie on POST

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

## Three localizer interfaces

| Interface | Where | Returns | Use when |
|---|---|---|---|
| `IStringLocalizer<T>` | Any DI-aware class | Plain text | Code-behind text |
| `IHtmlLocalizer<T>` | Any DI-aware class | Safe HTML | Translation contains markup (anchors, `<strong>`) |
| `IViewLocalizer` | `.cshtml` via `@inject` | Plain text | Rendering straight from markup |

All use indexer: `localizer["Key"]`. Positional args: `localizer["Greet", name]` → `.resx` value `"Hello, {0}!"`.

## PageModel injection

```cs
public class IndexModel : PageModel
{
    private readonly IStringLocalizer<IndexModel> _localizer;
    public IndexModel(IStringLocalizer<IndexModel> localizer) => _localizer = localizer;

    public void OnGet()
    {
        ViewData["Message"] = _localizer["Message"];
    }
}
```

Generic parameter drives which `.resx` to load (`Resources/Pages/IndexModel.<culture>.resx`).

## `IViewLocalizer` in `.cshtml`

```cs
@page
@inject IViewLocalizer Localizer
@model IndexModel

<h1>@Localizer["Welcome"]</h1>
```

> **Q:** `AddLocalization` + `Configure<RequestLocalizationOptions>` + `AddViewLocalization` are all in `Program.cs`. Users report language never switches. Single most likely missing line?
> **A:** `app.UseRequestLocalization()`. Without middleware, no provider runs, `CurrentCulture` / `CurrentUICulture` never set — app behaves as if every user prefers default culture.

> **Q:** `IStringLocalizer<IndexModel>["Welcome"]` returns literal `"Welcome"` though `Resources/Pages/IndexModel.fr.resx` has it as `"Bienvenue"`. Two possible reasons?
> **A:** (1) User's culture isn't French — no `?culture=fr`, no cookie, `Accept-Language` is `en-US`. (2) `UseRequestLocalization()` missing → `CurrentUICulture` stays at default.

> **Pitfall**
> Naming file `Resources/IndexModel.fr.resx` (no `Pages/` subfolder) for class in `Pages/`. Build succeeds but lookup returns key unchanged — folder must mirror class's folder.

> **Pitfall**
> `IStringLocalizer<T>` on translation containing HTML markup → `"<a href=\"/\">Home</a>"` renders as literal text. Use `IHtmlLocalizer<T>` or `@Html.Raw(...)`.

> **Takeaway**
> `AddLocalization(o => o.ResourcesPath = "Resources")` → `Configure<RequestLocalizationOptions>` with `SupportedCultures` + `SupportedUICultures` + `DefaultRequestCulture` → `AddViewLocalization` + `AddDataAnnotationsLocalization(opts => opts.DataAnnotationLocalizerProvider = (t, f) => f.Create(typeof(SharedResource)))` → `app.UseRequestLocalization()`. Resource path: `Resources/<folder>/<ClassName>.<culture>.resx`. Shared: `SharedResource` marker + `SharedResourceService` with `IStringLocalizerFactory.Create(nameof(SharedResource), asmName)`. Inject: `IStringLocalizer<T>` (code), `IHtmlLocalizer<T>` (HTML), `@inject IViewLocalizer` (view). Providers: QueryString → Cookie → Accept-Language.
