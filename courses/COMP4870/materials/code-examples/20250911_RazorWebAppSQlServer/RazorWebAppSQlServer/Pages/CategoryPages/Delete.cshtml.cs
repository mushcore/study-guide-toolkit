using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RazorWebAppSQlServer.Models.NW;

namespace RazorWebAppSQlServer.Pages.CategoryPages;

public class DeleteModel : PageModel
{
    private readonly NorthwindContext _context;

    public DeleteModel(NorthwindContext context)
    {
        _context = context;
    }

    [BindProperty]
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

    public async Task<IActionResult> OnPostAsync(int? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var category = await _context.Categories.FindAsync(id);
        if (category != null)
        {
            Category = category;
            _context.Categories.Remove(Category);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage("./Index");
    }
}
