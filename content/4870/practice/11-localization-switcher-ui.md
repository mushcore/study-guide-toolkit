---
n: 11
id: localization-switcher-ui
title: "Build a culture-switcher dropdown that persists the user's choice"
kind: applied
tags: [i18n, ui, cookie]
source: "Labs/W10 Localization/ Q2 (variant — a single switcher in a partial that POSTs to one handler, simpler than the lab's multi-partial + multi-handler breakdown)"
---

## Problem

You have an app with `AddLocalization`, `RequestLocalizationOptions` declaring `en` and `fr`, and `UseRequestLocalization()` middleware all in place. Now add a language-selector UI:

1. A `<select>` dropdown in the footer showing every supported culture (the user can click to change).
2. Selecting a culture POSTs to a handler that writes the `.AspNetCore.Culture` cookie and redirects back to the page the user was on.
3. The chosen culture persists across browser restarts (cookie `Expires` = 1 year).

The URL displayed is irrelevant; the switcher must work regardless of the current route. Describe the markup and the handler code, then trace what happens on the first reload after switching.

## Walkthrough

1. **Build the cultureItems list.** In a shared partial `_SelectLanguagePartial.cshtml`, inject `IOptions<RequestLocalizationOptions>` to read the declared `SupportedUICultures`. Convert each to a `SelectListItem` with `Value = c.Name` (e.g. `"fr"`) and `Text = c.DisplayName` (e.g. `"French (France)"`).

2. **Render the form.** Use a Razor form that POSTs to an `OnPost` handler on the current page:

   ```cshtml
   @using Microsoft.AspNetCore.Localization
   @inject IOptions<RequestLocalizationOptions> LocOpts

   @{
       var current = Context.Features.Get<IRequestCultureFeature>();
       var items = LocOpts.Value.SupportedUICultures!
           .Select(c => new SelectListItem { Value = c.Name, Text = c.DisplayName })
           .ToList();
   }

   <form asp-page="/Index" method="post">
       <select name="culture"
               onchange="this.form.submit();"
               asp-for="@current!.RequestCulture.UICulture.Name"
               asp-items="items">
       </select>
       <input type="hidden" name="returnUrl" value="@Context.Request.Path" />
   </form>
   ```

3. **Write the `OnPost` handler.** In the PageModel:

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

   `DefaultCookieName` is the built-in value `.AspNetCore.Culture` that `CookieRequestCultureProvider` looks for. `MakeCookieValue` formats the string exactly the way the provider expects (`c=<culture>|uic=<uiculture>`).

4. **Trace the first reload.** The user selects `fr` and the form submits. The handler writes `.AspNetCore.Culture=c=fr|uic=fr` as a cookie with a 1-year expiry, then `LocalRedirect`s back to the same page. On the redirected GET, `UseRequestLocalization` runs its providers in order: `QueryStringRequestCultureProvider` finds nothing (no `?culture=`), `CookieRequestCultureProvider` reads `.AspNetCore.Culture=c=fr|uic=fr` and returns `fr`, so `Thread.CurrentCulture` and `CurrentUICulture` both become `fr`. `IStringLocalizer<T>` now returns French values; dates and numbers format in French.

## Common wrong approaches

- **Not passing `returnUrl`.** `LocalRedirect("/")` hard-codes the home page, so switching languages on any deep page bounces the user back to the top. Pass the current path as a hidden field and redirect there instead.
- **Using `Redirect(returnUrl)` instead of `LocalRedirect(returnUrl)`.** `Redirect` accepts any URL, including external ones, which opens an open-redirect vulnerability if `returnUrl` comes from user input. `LocalRedirect` rejects absolute URLs.
- **Setting the cookie without `CookieOptions.Expires`.** Without an expiry the cookie becomes a session cookie that disappears when the browser closes. Users expect a persistent language choice — always set `Expires` at least months out.
- **Using `CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture, culture))` redundantly.** The single-arg form already sets both `Culture` and `UICulture`. Adding the second arg only differs when you deliberately want dates in one locale and UI strings in another — rarely desired.

## Why

Persistent language selection requires coordination between three moving parts: the UI (dropdown with `onchange="this.form.submit();"`), the server handler (cookie write + `LocalRedirect`), and the middleware pipeline (`CookieRequestCultureProvider` reading `.AspNetCore.Culture` on subsequent requests). The cookie format is non-negotiable — the provider knows exactly which name and value shape to look for. The year-long expiry makes the choice survive browser restarts; the `LocalRedirect` keeps users on the page they were viewing; and the whole mechanism works on every page without per-page handler code because the form POSTs to a single `OnPost(culture, returnUrl)` method that sits on a base PageModel or on a dedicated `/LanguageSwitcher` handler.
