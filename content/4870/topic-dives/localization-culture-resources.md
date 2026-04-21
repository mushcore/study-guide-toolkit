---
id: 4870-topic-localization-culture-resources
title: Localization — culture + resources
pillar: tech
priority: medium
chapter: W10
tags:
  - localization
---

### Program.cs setup

```cs
builder.Services.AddLocalization(o => o.ResourcesPath = "Resources");
builder.Services.AddRazorPages()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization();

builder.Services.Configure<RequestLocalizationOptions>(o => {
    var cultures = new[] { new CultureInfo("en"), new CultureInfo("fr"), new CultureInfo("es") };
    o.DefaultRequestCulture = new RequestCulture("en");
    o.SupportedCultures = cultures;
    o.SupportedUICultures = cultures;
});

var app = builder.Build();
app.UseRequestLocalization();
```

### Resource files

Default culture: `Resources/Pages.Index.resx` (or no .resx — strings used as fallbacks). Localized: `Resources/Pages.Index.fr.resx`, `Resources/Pages.Index.es.resx`.

### In PageModel

```cs
public class IndexModel : PageModel {
    private readonly IStringLocalizer<IndexModel> _loc;
    public IndexModel(IStringLocalizer<IndexModel> loc) { _loc = loc; }
    public string Greet() => _loc["Hello"];
}
```

### In Razor view

```cs
@inject IViewLocalizer Localizer
<h1>@Localizer["Welcome"]</h1>
<p>@Html.Raw(Localizer["GreetWithName", User.Identity.Name])</p>
```

### Change culture via cookie

```cs
Response.Cookies.Append(
    CookieRequestCultureProvider.DefaultCookieName,
    CookieRequestCultureProvider.MakeCookieValue(new RequestCulture("fr")),
    new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) });
```

### CurrentCulture vs CurrentUICulture

-   **CurrentCulture** — number/date formatting (e.g., `1,234.56` US vs `1 234,56` FR)
-   **CurrentUICulture** — which .resx to load
