using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RazorWebAppSQlServer.Models.NW;

namespace RazorWebAppSQlServer.Pages.CategoryPages;

public class DetailsModel : PageModel
{
    private readonly NorthwindContext _context;
    public DetailsModel(NorthwindContext context)
    {
        _context = context;
    }

    public Category Category { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(int? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var category = await _context.Categories.FirstOrDefaultAsync(m => m.CategoryId == id);
        if (category is null)
        {
            return NotFound();
        }
        else
        {
            Category = category;
        }

        return Page();
    }
}
