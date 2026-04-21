using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorInternational.Models;
using RazorInternational.Services;

namespace RazorInternational.Pages;

public class ContactModel : PageModel
{
    private readonly SharedResourceService _sharedLocalizer;

    [BindProperty]
    public Contact Contact { get; set; } = default!;

    public ContactModel(SharedResourceService sharedLocalizer)
    {
        _sharedLocalizer = sharedLocalizer;
    }


    public void OnGet()
    {
    }

    public IActionResult OnPost()
    {
        if (!ModelState.IsValid || Contact == null)
        {
            return Page();
        }

        ViewData["Result"] = _sharedLocalizer.Get("Success");

        return Page();
    }

}

