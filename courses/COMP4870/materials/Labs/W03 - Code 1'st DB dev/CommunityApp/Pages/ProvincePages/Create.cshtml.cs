using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using CommunityApp.Models;
using CommunityApp.Data;

namespace CommunityApp.Pages.ProvincePages;

public class CreateModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public CreateModel(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult OnGet()
    {
        return Page();
    }

    [BindProperty]
    public Province Province { get; set; } = default!;

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        _context.Provinces!.Add(Province);
        await _context.SaveChangesAsync();

        return RedirectToPage("./Index");
    }
}
