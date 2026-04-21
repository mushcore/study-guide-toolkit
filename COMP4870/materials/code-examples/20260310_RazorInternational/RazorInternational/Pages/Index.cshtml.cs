using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorInternational.Pages;

public class IndexModel : PageModel
{
    private readonly IStringLocalizer<IndexModel> _localizer;

    public IndexModel(IStringLocalizer<IndexModel> localizer)
    {
        _localizer = localizer;
    }


    public void OnGet()
    {
        ViewData["Message"] = _localizer["Message"];
    }

    public IActionResult OnPost(string culture, string returnUrl)
    {
        Response.Cookies.Append(
         CookieRequestCultureProvider.DefaultCookieName,
         CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
         new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
        );

        return LocalRedirect(returnUrl);
    }

}
