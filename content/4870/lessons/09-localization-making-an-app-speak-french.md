---
"n": 9
id: 4870-lesson-localization-making-an-app-speak-french
title: "Localization: making an app speak French"
hook: Translation is data, not code. You register the service, ship .resx resource files, and ASP.NET does the rest.
tags:
  - localization
module: Localization
---

Localization (4 marks) splits into two concerns that students routinely conflate: **picking a culture** (which language does THIS request want?) and **loading the right strings** (give me the French version of "Hello").

> **Analogy**
>  Think of a restaurant. *Picking a culture* is the host deciding which menu to hand the diner (English? French?). *Loading strings* is the kitchen reading the recipes off the chosen menu. ASP.NET plays both roles automatically once you register the service and drop the right `.resx` files in place.
>
> #### Program.cs wiring
>
> ```cs
> builder.Services.AddLocalization(o => o.ResourcesPath = "Resources");
> builder.Services.Configure<RequestLocalizationOptions>(o => {
>     var cultures = new[] { new CultureInfo("en"), new CultureInfo("fr") };
>     o.DefaultRequestCulture = new RequestCulture("en");
>     o.SupportedCultures    = cultures;
>     o.SupportedUICultures  = cultures;
> });
> app.UseRequestLocalization();  // middleware — PLACE BEFORE UseRouting
> // In a Razor view:
> // @inject IViewLocalizer Localizer
> // <h1>@Localizer["Hello"]</h1>
> ```
>
> *Why two culture lists:* **CurrentCulture** controls number/date/currency *formatting* (0.5 vs 0,5). **CurrentUICulture** controls *which .resx* the translator loads. In practice they match, but they are independent knobs.
>
> #### Resource file convention
>
> The resource file name encodes target language with a culture code: `Pages.Index.fr.resx` for the French translations of `Pages/Index.cshtml`. ASP.NET finds the file by matching the page/model name + the *CurrentUICulture*. No match → falls back to the neutral `Pages.Index.resx`.
>
> #### Culture provider chain — how the culture is decided
>
> flowchart LR
>   REQ\[Incoming request\]
>   REQ --> QS\["1. QueryString
> ?culture=fr"\]
>   QS --> CK\["2. Cookie
> .AspNetCore.Culture"\]
>   CK --> AL\["3. Accept-Language
> browser default"\]
>   AL --> FB\[DefaultRequestCulture\]
>   FB --> APP\[CurrentUICulture set\]
>       
>
> The three built-in providers run in priority order. First match wins — so `?culture=fr` overrides the cookie, which overrides the browser's Accept-Language, which falls back to the default you registered.
>
> > **Q:** **Checkpoint —** A user has `.AspNetCore.Culture` cookie set to `en` and their browser sends `Accept-Language: fr`. They load `/home?culture=de`. What culture is active, and why?
> > **A:** `de`. QueryString is first in the provider chain, so `?culture=de` wins even though the cookie and header disagree. (If the app only registered en/fr as SupportedCultures, the fallback would apply — but the ordering rule itself is what the exam tests.)
>
> > **Note**
> > **Takeaway —** AddLocalization + UseRequestLocalization + .resx naming (Name.fr.resx). Provider chain: query → cookie → Accept-Language → default. CurrentCulture formats, CurrentUICulture translates. (Source: asp\_core\_localization.pptx, razor\_pages\_localization\_SCRIPT.docx)
