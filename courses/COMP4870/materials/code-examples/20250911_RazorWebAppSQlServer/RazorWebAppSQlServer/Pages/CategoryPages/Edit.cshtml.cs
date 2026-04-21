using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RazorWebAppSQlServer.Models.NW;

namespace RazorWebAppSQlServer.Pages.CategoryPages;

public class EditModel : PageModel
{
    private readonly NorthwindContext _context;

    public EditModel(NorthwindContext context)
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
        Category = category;
        return Page();
    }

    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see https://aka.ms/RazorPagesCRUD.
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        _context.Attach(Category).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CategoryExists(Category.CategoryId))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return RedirectToPage("./Index");
    }

    private bool CategoryExists(int categoryid)
    {
        return _context.Categories.Any(e => e.CategoryId == categoryid);
    }
}
