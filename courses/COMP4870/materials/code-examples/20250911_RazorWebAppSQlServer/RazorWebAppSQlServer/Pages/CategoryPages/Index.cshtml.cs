using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RazorWebAppSQlServer.Models.NW;

namespace RazorWebAppSQlServer.Pages.CategoryPages;

public class IndexModel : PageModel
{
    private readonly NorthwindContext _context;

    public IndexModel(NorthwindContext context)
    {
        _context = context;
    }

    public IList<Category> Category { get; set; } = default!;

    public async Task OnGetAsync()
    {
        Category = await _context.Categories.ToListAsync();
    }
}
