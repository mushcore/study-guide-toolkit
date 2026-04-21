<!-- converted from razor_pages_localization_SCRIPT.docx -->

# Localizing ASP.NET Razor Pages App
Learn how to localize an ASP.NET Razor Pages App so that, in addition to English, it also works in French, German and Chinese. We will use the generic VS-Code editor with the “ResX Editor” extension.
Add this extension to your VS-Code:

In a terminal window, run these commands to create a Razor Page app and the appropriate folders:
dotnet new razor -f net8.0 -o RazorInternational
cd RazorInternational
mkdir Models
mkdir Resources
mkdir Services
cd Resources
mkdir Pages
mkdir Models
cd ..
Add the following using directives to the Pages/_ViewImports.cshtml file to make these namespaces available to all your .cshtml view files:
@using System.Globalization
@using Microsoft.Extensions.Localization
@using Microsoft.AspNetCore.Mvc.Localization
@using Microsoft.AspNetCore.Localization
We will do something like above to make some namespaces available to all C# class files. Create a file named GlobalUsings.cs in the root of your project with the following content:
global using System.Globalization;
global using Microsoft.Extensions.Options;
global using Microsoft.Extensions.Localization;
global using Microsoft.AspNetCore.Localization;

Add the following to Program.cs right before var app = builder.Build():
// ********** Begin add support for localization
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
var supportedCultures = new[] {
new CultureInfo("en"),
new CultureInfo("de"),
new CultureInfo("ko"),
new CultureInfo("fr"),
new CultureInfo("es"),
new CultureInfo("ru"),
new CultureInfo("ja"),
new CultureInfo("ar"),
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
// ********** End add support for localization
Add the following to Program.cs right after app.UseRouting();
using (var scope = app.Services.CreateScope()) {
var services = scope.ServiceProvider;

var localizationOptions = services.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value;
app.UseRequestLocalization(localizationOptions);
}
These services allow you to inject the IStringLocalizer service into your classes. They also allow you to have localized View files (so you can have views with names like Privacy.fr.cshtml) and inject the IViewLocalizer, to allow you to use localization in your view files.
In the Resources/Pages directory add a file named IndexModel.en.resx. This is the content for the en (English) culture. Add these values to IndexModel.en.resx:
In the same Resource/Pages folder, copy IndexModel.en.resx  to IndexModel.fr.resx, IndexModel.de.resx and IndexModel.zh.resx.

Contents of IndexModel.fr.resx:
Contents of IndexModel.de.resx:
Contents of IndexModel.zh.resx:
The directory structure is significant, because it mirrors that for the Index.cshtml.cs file which this resource is designed for. This approach adopts the path naming convention to ensure that the correct resource is found for the class which it is designed to be used by.
# Using localization in your code-behind class files
Whenever you want to access a localized string in your page code-behind class file, you can inject an IStringLocalizer<T> and use its indexer property. Add the following instance variable to the Pages/Index.cshtml.cs class:
private readonly IStringLocalizer<IndexModel> _localizer;
Inject an IStringLocalizer<T> into the IndexModel constructor. Update the IndexModel constructor so it looks like this:
private readonly IStringLocalizer<IndexModel> _localizer;
private readonly IHtmlLocalizer<IndexModel> _htmlLocalizer;


public IndexModel(ILogger<IndexModel> logger,
IStringLocalizer<IndexModel> localizer,
IHtmlLocalizer<IndexModel> htmlLocalizer) {
_logger = logger;
_localizer = localizer;
_htmlLocalizer = htmlLocalizer;
}

Change the Get() method in Pages/Index.cshtml.cs so it looks like this:
public void OnGet() {
ViewData["Message"] = _localizer["Message"];
}
Add the following right below @page in Pages/Index.cshtml:
@inject IStringLocalizer<IndexModel> localizer
Add this Razor code at the bottom of Pages/Index.cshtml:
<p>@ViewData["Message"]</p>
If we are currently using the fr culture, then the localizer will look for resource file: Resources/Pages/IndexModel.fr.resx
A quick way to try it out is to point your browser to /. This picks up the default value. However, if you point your browser to /?culture=fr, the value is read from the resource file.

## Using localization inside. cshtml Page files
We will read some HTML from the resource file. Add the following code to Pages/Index.cshtml right under @page:
@inject IHtmlLocalizer<IndexModel> htmlLocalizer
In Pages/Index.cshtml, replace the word “Welcome” to:
@localizer["Welcome"]
Also, in Pages/Index.cshtml, replace “Learn about <a href="https://docs.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.” with:
@htmlLocalizer["Learn"]

## Shared Resources
In the root of your application, create a blank class named SharedResource.cs with following content:
namespace RazorInternational;
public class SharedResource {}
Add a class file named SharedResourceService to the Services folder with the following code:
namespace RazorInternational.Services;

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
Add the following code to Program.cs just before “var app = builder.Build();”, so that it makes the SharedResource class available for dependency injection:
builder.Services.AddSingleton<SharedResourceService>();
In the Resource directory add SharedResource.en.resx. This is the shared content for the en (English) culture. Add these values to SharedResource.en.resx:
In the same Resources folder, copy SharedResourcs.en.resx to SharedResource.fr.resx, SharedResource.de.resx and SharedResourcs.zh.resx
Contents of SharedResource.fr.resx:
Contents of SharedResource.de.resx:


Contents of SharedResource.zh.resx:
## With shared resources, you rely on a single file to have all the localization entries in it, so this file can be used among pages or other classes.
## We will localize the Pages/Shared/_Layout.cshtml file. Add the following dependency injection code to the top of the file:
@inject RazorInternational.Services.SharedResourceService sharedLocalizer
Make these replacements in Pages/Shared/_Layout.cshtml:
When you visit the home page, it should look like this for Chinese:

## Data Annotations
To Models folder, add a class named Contact.cs with content:
public class Contact {
[Required(ErrorMessage = "Email is certainly required")]
[EmailAddress(ErrorMessage = "Email is not valid")]
[Display(Name = "Your Email")]
public string? Email { get; set; }
}
Under Resources/Models, add a resource file named Contact.en.resx with the following values:
In the same folder, copy Contact.en.resx to Contact.fr.resx, Contact.de.resx, and Contact.zh.resx.
Contents of Contact.fr.resx:
Contents of Contact.de.resx:
Contents of Contact.zh.resx:
In the /Pages folder, create a Razor Page combination named ContactPage.cshtml & ContactPage.cshtml.cs.
Add these properties to ContactPage.cshtml.cs:
private readonly SharedResourceService _sharedLocalizer;

[BindProperty]
public Contact Contact { get; set; } = default!;
Change the constructor of ContactPage.cshtml.cs to this:
public ContactPage(ILogger<ContactPage> logger, SharedResourceService sharedLocalizer) {
_logger = logger;
_sharedLocalizer = sharedLocalizer;
}
Add the following method to ContactPage.cshtml.cs:
public IActionResult OnPost() {
if (!ModelState.IsValid || Contact == null) {
return Page();
}

ViewData["Result"] = _sharedLocalizer.Get("Success");

return Page();
}

Replace ContactPage.cshtml with this:
@page
@model RazorInternational.Pages.ContactPage

@{
ViewData["Title"] = "Contact Page";
}

<h1>@ViewData["Title"]</h1>

<hr />
<div class="row">
<div class="col-md-4">
<h2>Enter details</h2>
<h4 class="text-success">@(ViewData["Result"] == null ? "" : ViewData["Result"])</h4>
<form method="post">
<div asp-validation-summary="ModelOnly" class="text-danger"></div>
<div class="form-group">
<label asp-for="Contact.Email" class="control-label"></label>
<input asp-for="Contact.Email" class="form-control" />
<span asp-validation-for="Contact.Email" class="text-danger"></span>
</div>

<div class="form-group">
<input type="submit" value="Create" class="btn btn-primary" />
</div>
</form>
</div>
</div>

@section Scripts {
@{await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
Point your browser to /Home/Contact?culture=fr-. You should see that the display name for email is translated.

The full code for ContactPage.cshtml is:
@page
@model RazorInternational.Pages.ContactPage

@{
ViewData["Title"] = "Contact Page";
}

<h1>@ViewData["Title"]</h1>

<hr />
<div class="row">
<div class="col-md-4">
<h2>Enter details</h2>
<h4 class="text-success">@(ViewData["Result"] == null ? "" : ViewData["Result"])</h4>
<form method="post">
<div asp-validation-summary="ModelOnly" class="text-danger"></div>
<div class="form-group">
<label asp-for="Contact.Email" class="control-label"></label>
<input asp-for="Contact.Email" class="form-control" />
<span asp-validation-for="Contact.Email" class="text-danger"></span>
</div>

<div class="form-group">
<input type="submit" value="Create" class="btn btn-primary" />
</div>
</form>
</div>
</div>

@section Scripts {
@{await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
The full code for ContactPage.cshtml.cs is:
namespace RazorInternational.Pages;
public class ContactPage : PageModel {
private readonly ILogger<ContactPage> _logger;
private readonly SharedResourceService _sharedLocalizer;

[BindProperty]
public Contact Contact { get; set; } = default!;

public ContactPage(ILogger<ContactPage> logger, SharedResourceService sharedLocalizer) {
_logger = logger;
_sharedLocalizer = sharedLocalizer;
}

public void OnGet() { }

public IActionResult OnPost() {
if (!ModelState.IsValid || Contact == null) {
return Page();
}

ViewData["Result"] = _sharedLocalizer.Get("Success");

return Page();
}
}
## Set the culture programmatically.
Add the following code to Pages/Shared/_SelectLanguagePartial.cshtml:
@using Microsoft.AspNetCore.Builder
@using Microsoft.AspNetCore.Http.Features
@using Microsoft.AspNetCore.Localization
@using Microsoft.AspNetCore.Mvc.Localization
@using Microsoft.Extensions.Options

@inject IViewLocalizer Localizer
@inject IOptions<RequestLocalizationOptions> LocOptions

@{
var requestCulture = Context.Features.Get<IRequestCultureFeature>();
var cultureItems = LocOptions.Value.SupportedUICultures!
.Select(c => new SelectListItem { Value = c.Name, Text = c.DisplayName })
.ToList();
var returnUrl = string.IsNullOrEmpty(Context.Request.Path) ? "~/" : $"~{Context.Request.Path.Value}";
}

<div title="@Localizer["Request culture provider:"] @requestCulture?.Provider?.GetType().Name">
<form id="selectLanguage" asp-page="/Index"
asp-route-returnUrl="@returnUrl"
method="post" class="form-horizontal" role="form">
<label asp-for="@requestCulture!.RequestCulture.UICulture.Name">@Localizer["Language:"]</label>
<select name="culture"
onchange="this.form.submit();"
asp-for="@requestCulture!.RequestCulture.UICulture.Name" asp-items="cultureItems">
</select>
</form>
</div>
The above code has a form that posts to the Index page. Therefore, you need to add this method into Index.cshtml.cs:
public IActionResult OnPost(string culture, string returnUrl)
{
Response.Cookies.Append(
CookieRequestCultureProvider.DefaultCookieName,
CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
);

return LocalRedirect(returnUrl);
}
Finally, we just need to use the partial view somewhere. Let’s add it to the footer of our _Layout.cshtml. Replace the entire footer section with:
<footer class="border-top footer text-muted">
<div class="row">
<div class="col-md-6">
<p>&copy; @System.DateTime.Now.Year - @sharedLocalizer.Get("Localization")</p>
</div>
<div class="col-md-6 text-right">
@await Html.PartialAsync("_SelectLanguagePartial")
</div>
</div>
</footer>
When you run your application you should see a language switcher at the bottom in the footer section.

| Welcome | Welcome |
| --- | --- |
| Learn | Learn about <a href="https://docs.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>. |
| Message | I hope you will enjoy the content in this website. |
| IndexModel.fr.resx | content for the fr (French) culture |
| --- | --- |
| IndexModel.de.resx | content for the de (German) culture |
| IndexModel.zh.resx | content for the zh (Chinese) culture |
| Welcome | Bienvenue |
| --- | --- |
| Learn | En savoir plus <a href="https://docs.microsoft.com/aspnet/core">sur la création d'applications Web avec ASP.NET Core</a>. |
| Message | J'espère que vous apprécierez le contenu de ce site Web. |
| Welcome | Willkommen |
| --- | --- |
| Learn | Erfahren Sie mehr <a href="https://docs.microsoft.com/aspnet/core">über das Erstellen von Web-Apps mit ASP.NET Core</a>. |
| Message | Ich hoffe, dass Ihnen der Inhalt dieser Website gefallen wird. |
| Welcome | 欢迎 |
| --- | --- |
| Learn | 学习关于 <a href="https://docs.microsoft.com/aspnet/core">使用 ASP.NET Core 构建 Web 应用程序</a>. |
| Message | 我希望您会喜欢本网站的内容。 |
| Localization | Localization |
| --- | --- |
| Privacy | Privacy |
| Success | Success |
| SharedResource.fr.resx | Common content for the fr (French) culture |
| --- | --- |
| SharedResource.de.resx | Common content for the de (German) culture |
| SharedResource.zh.resx | Common content for the zh (Chinese) culture |
| Localization | Accueil |
| --- | --- |
| Privacy | Vie privée |
| Success | Succès |
| Localization | Lokalisierung |
| --- | --- |
| Privacy | Privatsphäre |
| Success | Erfolg |
| Localization | 本土化 |
| --- | --- |
| Privacy | 隐私 |
| Success | 成功 |
| Around | From | To |
| --- | --- | --- |
| Line 7 | <title>@ViewData["Title"] - RazorInternational</title> | <title>@ViewData["Title"] - @sharedLocalizer.Get("Localization")</title> |
| Line 16 | <a class="navbar-brand" asp-area="" asp-page="/Index">RazorInternational</a> | <a class="navbar-brand" asp-area="" asp-page="/Index">@sharedLocalizer.Get("Localization")</a> |
| Line 27 | <a class="nav-link text-dark" asp-area="" asp-page="/Privacy">Privacy</a> | <a class="nav-link text-dark" asp-area="" asp-page="/Privacy">@sharedLocalizer.Get("Privacy")</a> |
| Line 42 | RazorInternational - <a asp-area="" asp-page="/Privacy">Privacy</a> | @sharedLocalizer.Get("Localization") - <a asp-area="" asp-page="/Privacy">@sharedLocalizer.Get("Privacy")</a> |
| Email is certainly required | Email is certainly required |
| --- | --- |
| Email is not valid | Email is not valid |
| Your Email | Your Email |
| Email is certainly required | L'e-mail est certainement requis |
| --- | --- |
| Email is not valid | L'e-mail n'est pas valide |
| Your Email | Votre e-mail |
| Email is certainly required | E-Mail ist auf jeden Fall erforderlich |
| --- | --- |
| Email is not valid | E-Mail ist nicht gültig |
| Your Email | Deine E-Mail |
| Email is certainly required | 电子邮件当然是必需的 |
| --- | --- |
| Email is not valid | 电子邮件无效 |
| Your Email | 你的邮件 |