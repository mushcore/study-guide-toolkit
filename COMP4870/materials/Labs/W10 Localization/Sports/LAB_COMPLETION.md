# W10 Localization Lab - Completion Guide

## How This Solution Completes the Lab

This solution adds full ASP.NET Core localization support to the Sports Razor Pages application, following the exact patterns demonstrated in the **RazorInternational** lecture example. The app now supports four languages: **English (en)**, **German (de)**, **French (fr)**, and **Chinese (zh)**.

### What Was Added

#### 1. Localization Services in `Program.cs`
- `AddLocalization()` with `ResourcesPath = "Resources"` to tell the framework where `.resx` files live.
- `RequestLocalizationOptions` configured with supported cultures (`en`, `de`, `fr`, `zh`, `en-US`) and default culture set to `en`.
- `AddMvc().AddViewLocalization().AddDataAnnotationsLocalization()` to enable view and data annotation localization.
- `UseRequestLocalization()` middleware to detect and apply the user's chosen culture on each request.
- `SharedResourceService` registered as a singleton for shared resource access across views.

#### 2. Shared Resource System
- **`SharedResource.cs`** - Empty marker class at the project root, used by the localization framework to locate shared `.resx` files.
- **`Services/SharedResourceService.cs`** - A service that wraps `IStringLocalizerFactory` to provide a simple `Get(key)` method for accessing shared localized strings.
- **`Resources/SharedResource.{en,de,fr,zh}.resx`** - Resource files containing shared keys used across the app layout:
  - `Sports` - App name (Sports / Sport / Sports / ...)
  - `Home` - Navigation link (Home / Heim / Accueil / ...)
  - `Privacy` - Navigation link (Privacy / Privatsphare / Vie privee / ...)
  - `Teams` - Navigation link (Teams / Mannschaften / Equipes / ...)
  - `Players` - Navigation link (Players / Spieler / Joueurs / ...)

#### 3. Page-Specific Localization (Index Page)
- **`Pages/Index.cshtml.cs`** - Injects `IStringLocalizer<IndexModel>` and uses it to pass a localized `Message` via `ViewData`. Also handles culture switching via a POST handler using `CookieRequestCultureProvider`.
- **`Pages/Index.cshtml`** - Injects `IStringLocalizer` and `IHtmlLocalizer` to display localized `Welcome` text and `Learn` HTML content.
- **`Resources/Pages/IndexModel.{en,de,fr,zh}.resx`** - Resource files with keys:
  - `Welcome` - Heading text (Welcome / Willkommen / Bienvenue / ...)
  - `Learn` - HTML link content (localized with embedded `<a>` tag)
  - `Message` - Descriptive paragraph text

#### 4. Layout Localization (`_Layout.cshtml`)
- Injects `SharedResourceService` via `@inject Sports.Services.SharedResourceService sharedLocalizer`.
- All navigation links (`Home`, `Privacy`, `Teams`, `Players`) and the app title now use `@sharedLocalizer.Get("Key")` for localized output.
- Footer includes the language selector partial view.

#### 5. Language Selector (`_SelectLanguagePartial.cshtml`)
- A dropdown form that lists all supported cultures.
- Selecting a language submits the form to `Index.OnPost`, which sets a culture cookie.
- The cookie persists the user's language preference across requests.

#### 6. View Imports (`_ViewImports.cshtml`)
- Added `using` directives for `System.Globalization`, `Microsoft.Extensions.Localization`, `Microsoft.AspNetCore.Mvc.Localization`, and `Microsoft.AspNetCore.Localization` so all Razor pages can use localization types without per-page imports.

---

## How to Run / Test

### Prerequisites
- .NET 10.0 SDK installed

### Running the App

```bash
cd "Labs/W10 Localization/Sports"
dotnet run
```

Then open your browser to the URL shown in the console (typically `https://localhost:5001` or `http://localhost:5000`).

### Testing Localization

1. **Default Language**: The app starts in English (`en`). You should see "Welcome" as the heading, and English navigation links (Home, Privacy, Teams, Players).

2. **Switch Language**: In the footer of any page, use the **language dropdown** to select a different language:
   - **Deutsch (de)**: Navigation changes to "Heim", "Privatsphare", "Mannschaften", "Spieler". The heading shows "Willkommen".
   - **Francais (fr)**: Navigation changes to "Accueil", "Vie privee", "Equipes", "Joueurs". The heading shows "Bienvenue".
   - **Chinese (zh)**: Navigation and heading display in Chinese characters.

3. **Cookie Persistence**: After selecting a language, refresh the page or navigate to other pages. The chosen language persists because it is stored in a cookie.

4. **Verify Shared Resources**: Navigate between pages (Home, Teams, Players, Privacy) and confirm that the navigation bar text updates according to the selected language.

5. **Verify Page-Specific Resources**: On the Home page, check that:
   - The `<h1>` heading is localized (Welcome / Willkommen / Bienvenue / ...).
   - The message paragraph is localized.
   - The "Learn about..." link text is localized (rendered as HTML via `IHtmlLocalizer`).

### Build Verification

```bash
cd "Labs/W10 Localization/Sports"
dotnet build
```

The project should compile with 0 errors and 0 warnings.
