# ASP.NET Core Localization — Exam Study Guide (4 marks)

**Instructor:** Medhat Elmasry  
**Topics Covered:** Globalization, Localization, Resource Files, Culture Providers, Razor Pages localization  
**Reference:** https://andrewlock.net/adding-localisation-to-an-asp-net-core-application/

---

## 1. Topic Summaries

### What is Localization / Globalization (i18n)?

**Globalization (i18n):**
- The process of designing applications that support different cultures and languages
- A design-time discipline: building your app structure to accommodate multiple locales from the start
- Requires planning resource files, culture detection, and locale-aware formatting

**Localization (L10n):**
- The process of adapting a globalized app to a specific culture or locale
- Concrete implementation: providing translated strings, date/number formats, and currency for a target culture
- Happens after globalization foundation is in place

**Key Difference:**
- **Globalization = Design for ANY culture** (structure, extensibility)
- **Localization = Specific translations and formatting** (en, fr, de, zh, etc.)

### ASP.NET Core Localization Support

ASP.NET Core provides built-in localization services via:
- `Microsoft.Extensions.Localization` (for string localization)
- `Microsoft.AspNetCore.Localization` (for request culture detection)
- Resource files (.resx) for storing translated strings
- Dependency injection of `IStringLocalizer<T>` and `IHtmlLocalizer<T>`
- Request culture providers to detect user's preferred culture

---

## 2. Key Concepts

### Resource Files (.resx)

**What they are:**
- XML-based files that store key-value pairs for localized strings
- One file per culture per component (class, page, shared resources)

**Naming convention (CRITICAL for exams):**
```
Pages/IndexModel.en.resx         (default/English)
Pages/IndexModel.fr.resx         (French)
Pages/IndexModel.de.resx         (German)
Pages/IndexModel.zh.resx         (Chinese)

Controllers/HomeController.en.resx
Controllers/HomeController.fr.resx

Resources/SharedResource.en.resx  (shared across app)
Resources/SharedResource.fr.resx
```

**How ASP.NET Core finds them:**
1. Directory structure mirrors the class/page structure
2. Culture code suffix (`en`, `fr`, `de`, `zh`) determines which file is used
3. If exact culture match not found, fallback to invariant culture (no suffix) or default culture
4. All resource files must be in the `Resources/` directory (configured in Program.cs)

### IStringLocalizer<T> vs IHtmlLocalizer<T>

**IStringLocalizer<T>:**
- Used in code-behind (PageModel, Controller classes)
- Accessed via indexer: `_localizer["Key"]`
- Returns plain text strings
- Injection: `IStringLocalizer<IndexModel> localizer`

**IHtmlLocalizer<T>:**
- Used in code-behind for HTML content
- Marks content as safe HTML (no XSS encoding)
- Used when resource contains HTML: `<a href="...">Learn more</a>`
- Injection: `IHtmlLocalizer<IndexModel> htmlLocalizer`

**IViewLocalizer:**
- Used in .cshtml Razor views
- Injected directly in views: `@inject IViewLocalizer Localizer`
- Access via: `@Localizer["Key"]`

### ResourcesPath Configuration

**In Program.cs:**
```csharp
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
```

- Sets the root directory where all resource files live
- Folder structure under `Resources/` must match class namespaces
- **Convention:** `Resources/Pages/IndexModel.en.resx` for a class in `Pages/Index.cshtml.cs`

### RequestLocalizationOptions

**Configures which cultures the app supports:**
```csharp
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] {
        new CultureInfo("en"),
        new CultureInfo("fr"),
        new CultureInfo("de"),
        new CultureInfo("zh"),
        new CultureInfo("en-US")
    };
    
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});
```

**Key properties:**
- `DefaultRequestCulture`: Fallback if no culture detected from providers
- `SupportedCultures`: Affects **number/date formatting** (CurrentCulture)
- `SupportedUICultures`: Affects **localized strings** (CurrentUICulture)
- Both are typically set to the same list

### CultureInfo

**Represents a specific culture:**
- `CultureInfo("en")` = generic English
- `CultureInfo("fr")` = generic French
- `CultureInfo("en-US")` = US English
- `CultureInfo("fr-CA")` = Canadian French

**Used to instantiate RequestCulture:**
```csharp
new RequestCulture("en")  // string
new RequestCulture(new CultureInfo("en-US"))  // or via CultureInfo object
```

### CurrentCulture vs CurrentUICulture

**CRITICAL DISTINCTION (exam trap):**

| Property | Purpose | Affects |
|----------|---------|---------|
| `Thread.CurrentCulture` | Number/date formatting | `.ToString()`, `decimal.ToString()`, `DateTime.ToString()` |
| `Thread.CurrentUICulture` | Resource string selection | `IStringLocalizer<T>["Key"]`, which .resx file to load |

**Example:**
```csharp
Thread.CurrentCulture = new CultureInfo("fr-FR");   // Affects dates: "3,14" (comma for decimal)
Thread.CurrentUICulture = new CultureInfo("fr-FR"); // Selects French .resx files
```

Both should be set together in ASP.NET Core via `RequestLocalizationOptions` and middleware.

---

## 3. Code Patterns (VERBATIM)

### Program.cs Setup

**Register localization services:**
```csharp
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] {
        new CultureInfo("en"),
        new CultureInfo("fr"),
        new CultureInfo("de"),
        new CultureInfo("zh"),
        new CultureInfo("en-US")
    };
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

builder.Services.AddMvc()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization();
```

**Enable middleware (after var app = builder.Build()):**
```csharp
using (var scope = app.Services.CreateScope()) {
    var services = scope.ServiceProvider;
    var localizationOptions = services.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
    app.UseRequestLocalization(localizationOptions);
}
```

**Alternative (simpler, less flexible):**
```csharp
app.UseRequestLocalization();
```

### Razor Page (PageModel Code-Behind)

**Inject IStringLocalizer<T>:**
```csharp
public class IndexModel : PageModel {
    private readonly IStringLocalizer<IndexModel> _localizer;
    
    public IndexModel(IStringLocalizer<IndexModel> localizer) {
        _localizer = localizer;
    }
    
    public void OnGet() {
        ViewData["Message"] = _localizer["Message"];
    }
}
```

**Culture switching handler:**
```csharp
public IActionResult OnPost(string culture, string returnUrl)
{
    Response.Cookies.Append(
        CookieRequestCultureProvider.DefaultCookieName,
        CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
        new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
    );
    
    return LocalRedirect(returnUrl);
}
```

### Razor Page (.cshtml View)

**Inject localizers:**
```html
@page
@inject IStringLocalizer<IndexModel> localizer
@inject IHtmlLocalizer<IndexModel> htmlLocalizer
@model IndexModel
```

**Use in markup:**
```html
<h1>@localizer["Welcome"]</h1>
<p>@ViewData["Message"]</p>
<div>@htmlLocalizer["Learn"]</div>
```

### Shared Resources (App-Wide Strings)

**Create SharedResource.cs (empty class):**
```csharp
namespace RazorInternational;
public class SharedResource { }
```

**Create SharedResourceService:**
```csharp
public class SharedResourceService {
    private readonly IStringLocalizer localizer;
    
    public SharedResourceService(IStringLocalizerFactory factory) {
        var assemblyName = new AssemblyName(typeof(SharedResource).GetTypeInfo().Assembly.FullName!);
        localizer = factory.Create(nameof(SharedResource), assemblyName.Name!);
    }
    
    public string Get(string key) {
        return localizer[key];
    }
}
```

**Register in Program.cs:**
```csharp
builder.Services.AddSingleton<SharedResourceService>();
```

**Use in views:**
```html
@inject RazorInternational.Services.SharedResourceService sharedLocalizer

<footer>
    <p>&copy; @System.DateTime.Now.Year - @sharedLocalizer.Get("Localization")</p>
</footer>
```

### Resource File Naming Convention

For a class `Pages/Index.cshtml.cs` (class name: `IndexModel`):
- **Structure:** `Resources/Pages/IndexModel.[culture].resx`
- **Examples:**
  - `Resources/Pages/IndexModel.en.resx` (English, default)
  - `Resources/Pages/IndexModel.fr.resx` (French)
  - `Resources/Pages/IndexModel.de.resx` (German)

For shared resources:
- `Resources/SharedResource.en.resx`
- `Resources/SharedResource.fr.resx`

For models (data annotations):
- `Resources/Models/Contact.en.resx`
- `Resources/Models/Contact.fr.resx`

---

## 4. Culture Providers (Detect User's Culture)

**Three built-in providers (evaluated in order):**

1. **QueryStringRequestCultureProvider**
   - Checks URL query string: `?culture=fr` or `?culture=fr-FR`
   - Highest priority (checked first)
   - Example: `/Home/Index?culture=de`

2. **CookieRequestCultureProvider**
   - Checks cookie: `c=%43en-US|uic=en-US` (default cookie name)
   - Used when user explicitly selects language via UI
   - Set via `Response.Cookies.Append(CookieRequestCultureProvider.DefaultCookieName, ...)`
   - Persists across sessions

3. **AcceptLanguageHeaderRequestCultureProvider**
   - Checks `Accept-Language` HTTP header sent by browser
   - Automatic based on browser settings (en-US, fr-FR, etc.)
   - Lowest priority

**Order matters:** First match wins. If query string matches, it takes priority over cookie and header.

**Configuration example (custom order):**
```csharp
options.RequestCultureProviders = new[] {
    new QueryStringRequestCultureProvider(),
    new CookieRequestCultureProvider(),
    new AcceptLanguageHeaderRequestCultureProvider()
};
```

---

## 5. Culture Switching from UI

**HTML form in _SelectLanguagePartial.cshtml:**
```html
@using Microsoft.AspNetCore.Localization
@inject IOptions<RequestLocalizationOptions> LocOptions

@{
    var requestCulture = Context.Features.Get<IRequestCultureFeature>();
    var cultureItems = LocOptions.Value.SupportedUICultures!
        .Select(c => new SelectListItem { Value = c.Name, Text = c.DisplayName })
        .ToList();
}

<form id="selectLanguage" asp-page="/Index" method="post">
    <label>Language:</label>
    <select name="culture" onchange="this.form.submit();" 
            asp-for="@requestCulture!.RequestCulture.UICulture.Name" 
            asp-items="cultureItems">
    </select>
</form>
```

**Handler in PageModel (OnPost):**
```csharp
public IActionResult OnPost(string culture, string returnUrl)
{
    Response.Cookies.Append(
        CookieRequestCultureProvider.DefaultCookieName,
        CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
        new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
    );
    
    return LocalRedirect(returnUrl);
}
```

**Key points:**
- `CookieRequestCultureProvider.DefaultCookieName` = the standard cookie name (`.AspNetCore.Culture`)
- `CookieRequestCultureProvider.MakeCookieValue()` = properly formats the cookie value
- Form POSTs to Index page, which stores the selected culture in a cookie
- Cookie persists for 1 year

---

## 6. Date/Number Formatting

**CurrentCulture affects formatting:**

```csharp
Thread.CurrentCulture = new CultureInfo("en-US");
decimal price = 1234.56m;
Console.WriteLine(price.ToString("C"));  // $1,234.56 (US format)

Thread.CurrentCulture = new CultureInfo("fr-FR");
Console.WriteLine(price.ToString("C"));  // 1 234,56 € (French format)

DateTime date = new DateTime(2025, 3, 15);
Thread.CurrentCulture = new CultureInfo("en-US");
Console.WriteLine(date.ToString("D"));  // Saturday, March 15, 2025

Thread.CurrentCulture = new CultureInfo("de-DE");
Console.WriteLine(date.ToString("D"));  // Samstag, 15. März 2025
```

**In ASP.NET Core:**
- `RequestLocalizationOptions.SupportedCultures` sets `Thread.CurrentCulture`
- This affects how `.ToString()`, dates, and numbers render in views
- **IMPORTANT:** UI strings come from `CurrentUICulture`, formatting comes from `CurrentCulture`

---

## 7. Flashcards (SuperMemo 20 Rules Style)

### Card 1: Globalization vs Localization

**Q:** What is the difference between globalization and localization in ASP.NET Core?

**A:** 
- **Globalization:** Design-time process of building an app to support multiple cultures (structure, extensibility, fallback mechanisms)
- **Localization:** Runtime adaptation to a specific culture (actual translations, locale-specific formatting, resource selection)
- Globalization = "design for ANY culture"; Localization = "translations for SPECIFIC culture"

---

### Card 2: Resource File Naming

**Q:** What is the correct naming convention for resource files in ASP.NET Core Localization?

**A:**
- Format: `[ResourcesPath]/[Namespace]/[ClassName].[culture].resx`
- Example: `Resources/Pages/IndexModel.fr.resx` for French
- Example: `Resources/SharedResource.en.resx` for shared English strings
- Default culture (no .culture suffix) is optional fallback
- Culture codes: `en`, `fr`, `de`, `zh`, `en-US`, `fr-CA`, etc.

---

### Card 3: IStringLocalizer vs IHtmlLocalizer

**Q:** When do you use IStringLocalizer<T> vs IHtmlLocalizer<T>?

**A:**
- **IStringLocalizer<T>:** Plain text strings (no HTML markup); use in code-behind classes
- **IHtmlLocalizer<T>:** HTML content that should NOT be encoded (links, formatting); use in code-behind when content contains markup
- **IViewLocalizer:** Direct use in .cshtml views via `@inject IViewLocalizer Localizer`
- All use indexer pattern: `localizer["Key"]`

---

### Card 4: RequestLocalizationOptions

**Q:** What does RequestLocalizationOptions do?

**A:**
Configures which cultures the app supports:
- `SupportedCultures`: List of cultures (affects `CurrentCulture` for date/number formatting)
- `SupportedUICultures`: List of cultures (affects `CurrentUICulture` for string resource selection)
- `DefaultRequestCulture`: Fallback culture if no provider matches
- Typically set to the same list
- Set via `builder.Services.Configure<RequestLocalizationOptions>(options => ...)`
- Middleware must be applied: `app.UseRequestLocalization()`

---

### Card 5: Culture Providers & Order

**Q:** What are the three culture providers and in what order are they evaluated?

**A:**
1. **QueryStringRequestCultureProvider** (highest priority): `?culture=fr`
2. **CookieRequestCultureProvider**: Cookie `.AspNetCore.Culture` (persistent)
3. **AcceptLanguageHeaderRequestCultureProvider** (lowest priority): Browser `Accept-Language` header
- First match wins; order is configurable via `options.RequestCultureProviders`

---

### Card 6: CurrentCulture vs CurrentUICulture

**Q:** What is the difference between Thread.CurrentCulture and Thread.CurrentUICulture?

**A:**
- **CurrentCulture:** Controls number, date, and currency formatting in `.ToString()` and format strings
- **CurrentUICulture:** Controls which .resx resource file is loaded; affects `IStringLocalizer["Key"]` lookups
- Both are set by `RequestLocalizationMiddleware` from the detected culture
- Must be set together for consistent localization

---

### Card 7: Shared Resources Pattern

**Q:** How do you implement app-wide shared resources (strings used across multiple pages)?

**A:**
1. Create empty marker class `SharedResource.cs` in root
2. Create `SharedResourceService` that accepts `IStringLocalizerFactory`
3. Register as singleton: `builder.Services.AddSingleton<SharedResourceService>()`
4. Create shared resource files: `Resources/SharedResource.en.resx`, `.fr.resx`, etc.
5. Inject `SharedResourceService` in views/pages and call `.Get("Key")`
- Avoids duplication of translations across multiple .resx files

---

### Card 8: Cookie-Based Culture Switching

**Q:** How do you implement a language switcher that persists across sessions?

**A:**
```csharp
Response.Cookies.Append(
    CookieRequestCultureProvider.DefaultCookieName,
    CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
    new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
);
```
- `DefaultCookieName` = `.AspNetCore.Culture` (standard cookie)
- `MakeCookieValue()` = formats culture code correctly
- Cookie persists 1 year, survives browser restart
- Form POSTs the selected culture, sets cookie, redirects back

---

### Card 9: ResourcesPath Configuration

**Q:** What does `AddLocalization(options => options.ResourcesPath = "Resources")` do?

**A:**
- Sets the root directory where all .resx resource files must live
- All resource files must be under `Resources/` folder
- Subdirectories under `Resources/` match the class namespace structure
- Example: Class in `Pages/Index.cshtml.cs` → `Resources/Pages/IndexModel.en.resx`
- If omitted, resources are assumed to be in project root (not recommended)

---

### Card 10: Data Annotations Localization

**Q:** How do you localize validation messages in data models?

**A:**
```csharp
builder.Services.AddDataAnnotationsLocalization(options =>
{
    options.DataAnnotationLocalizerProvider = (type, factory) =>
        factory.Create(typeof(SharedResource));
});
```
- Localization provider for `[Display(Name = "...")]`, `[Required]`, etc.
- Attribute strings are looked up in `SharedResource.en.resx`, `.fr.resx`, etc.
- Allows model validation messages to be translated
- Must use `SharedResource` or another shared class

---

## 8. Exam Traps (Easy Mistakes)

### Trap 1: CurrentCulture vs CurrentUICulture Confusion

**Common mistake:** Setting only `CurrentCulture` and expecting localized strings to appear.

**Why it's wrong:** You need BOTH:
- `CurrentCulture` = formatting (3.14 vs 3,14)
- `CurrentUICulture` = string resources (which .resx to load)

**Fix:** Set both via `RequestLocalizationOptions` and ensure middleware runs.

---

### Trap 2: Wrong Resource File Naming

**Common mistake:** 
```
Resources/IndexModel.fr.resx  (WRONG - missing Pages/)
```

**Correct:**
```
Resources/Pages/IndexModel.fr.resx
```

The directory structure under `Resources/` must match the class location relative to project root.

---

### Trap 3: Forgot to Call UseRequestLocalization()

**Common mistake:** Configure `RequestLocalizationOptions` but forget to add middleware.

```csharp
// Configured but no middleware = silent failure
builder.Services.Configure<RequestLocalizationOptions>(options => { ... });

// MISSING THIS:
app.UseRequestLocalization();  // Or pass options: app.UseRequestLocalization(localizationOptions);
```

**Result:** Culture is never detected, always uses default, no localization happens.

---

### Trap 4: Culture Provider Order

**Common mistake:** Assuming providers run in any order.

**Truth:** Order is strict:
1. QueryString first (can override everything)
2. Cookie second
3. Header last

If you want header to take precedence over cookie, you must reorder `RequestCultureProviders`.

---

### Trap 5: Forgetting AddViewLocalization()

**Common mistake:**
```csharp
builder.Services.AddMvc()  // Missing .AddViewLocalization()
```

**Result:** `@inject IViewLocalizer` fails because service isn't registered.

**Fix:**
```csharp
builder.Services.AddMvc()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization();
```

---

### Trap 6: ResourcesPath Naming Convention

**Common mistake:**
```csharp
options.ResourcesPath = "Resources";  // Correct
options.ResourcesPath = "Localization";  // Wrong - resource files must be in Resources/
```

If you change the folder name, you MUST move all .resx files to match.

---

## 9. Practice MCQs

### Question 1 (1 mark)

**What does IStringLocalizer<T> do when a resource key is not found in any .resx file?**

A) Throws a KeyNotFoundException  
B) Returns the key itself as the string  
C) Returns an empty string  
D) Falls back to the parent culture  

**Correct answer: B**

**Explanation:** If no resource exists for a key, ASP.NET Core returns the key itself. This allows you to design your app without creating the default/fallback .resx file upfront.

---

### Question 2 (1 mark)

**You have a Razor Page at `Pages/Index.cshtml.cs` (class name `IndexModel`). Where should you place the French resource file?**

A) `Resources/IndexModel.fr.resx`  
B) `Resources/Pages/IndexModel.fr.resx`  
C) `Resources/Pages/Index.fr.resx`  
D) `Localization/Pages/IndexModel.fr.resx`  

**Correct answer: B**

**Explanation:** Resource file directory structure must mirror the class location. The class is in `Pages/`, so resources go in `Resources/Pages/ClassName.culture.resx`.

---

### Question 3 (1 mark)

**In which order are culture providers evaluated?**

A) AcceptLanguageHeader → Cookie → QueryString  
B) QueryString → Cookie → AcceptLanguageHeader  
C) Cookie → QueryString → AcceptLanguageHeader  
D) They run in parallel; order doesn't matter  

**Correct answer: B**

**Explanation:** QueryString has highest priority, then Cookie, then Header. First match wins. This allows query string to override user cookies/preferences for testing.

---

### Question 4 (1 mark)

**Which interface is used for localized strings in Razor view files (.cshtml)?**

A) IStringLocalizer<T>  
B) IHtmlLocalizer<T>  
C) IViewLocalizer  
D) IResourceLocalizer  

**Correct answer: C**

**Explanation:** `IViewLocalizer` is injected directly in .cshtml views: `@inject IViewLocalizer Localizer`. The generic T versions are for code-behind classes.

---

### Question 5 (1 mark)

**You want to implement a language switcher that persists the user's language choice across browser sessions. Which component should you use?**

A) QueryStringRequestCultureProvider  
B) CookieRequestCultureProvider  
C) AcceptLanguageHeaderRequestCultureProvider  
D) None; language selection cannot persist  

**Correct answer: B**

**Explanation:** Cookies persist across sessions. You set the cookie via `Response.Cookies.Append()` in a form handler, and `CookieRequestCultureProvider` reads it on subsequent requests.

---

## 10. Quick Reference Table

| Concept | Code / Value |
|---------|--------------|
| Add localization services | `builder.Services.AddLocalization(options => options.ResourcesPath = "Resources")` |
| Configure supported cultures | `builder.Services.Configure<RequestLocalizationOptions>(options => { ... })` |
| Enable middleware | `app.UseRequestLocalization()` or `app.UseRequestLocalization(localizationOptions)` |
| Inject in PageModel | `IStringLocalizer<PageName> localizer` |
| Inject in .cshtml | `@inject IViewLocalizer Localizer` |
| Access resource | `localizer["Key"]` or `Localizer["Key"]` |
| Set culture cookie | `Response.Cookies.Append(CookieRequestCultureProvider.DefaultCookieName, ...)` |
| Query string culture | `?culture=fr` or `?culture=en-US` |
| Default cookie name | `.AspNetCore.Culture` |
| Resource file location | `Resources/[ClassName]/[Type].[culture].resx` |
| Resource file example | `Resources/Pages/IndexModel.fr.resx` |
| Shared resources class | `public class SharedResource { }` (empty marker) |
| Format culture string | `dd/MM/yyyy` (de-DE) vs `MM/dd/yyyy` (en-US) |

---

## 11. Exam Strategy

**When you see a localization question:**

1. **Identify the requirement:** String resource? Culture detection? Formatting? Persistence?
2. **Check the file/class location:** Determines correct resource file path
3. **Determine which interface:** PageModel → `IStringLocalizer<T>`, View → `IViewLocalizer`, HTML content → `IHtmlLocalizer<T>`
4. **Verify setup:** Is `UseRequestLocalization()` called? Are resources registered?
5. **Culture flow:** QueryString → Cookie → Header (in that order)
6. **Resource naming:** Always `Resources/[Namespace]/[ClassName].[culture].resx`

**Time allocation:** With 4 marks available, expect 4-5 MCQs or a short coding question. Study the code patterns verbatim.

---

**Last Updated:** 2025-04-18  
**Exam Weight:** 4 marks (approximately 5-6% of final exam)

