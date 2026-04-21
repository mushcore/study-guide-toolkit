using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Sports.Models;
using Sports.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Sports.Pages.PlayerPages;

public class CreateModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public CreateModel(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult OnGet()
    {
        ViewData["TeamName"] = new SelectList(_context.Teams, "TeamName", "TeamName");
        return Page();
    }

    [BindProperty]
    public Player Player { get; set; } = default!;

    // To protect from overposting attacks, see https://aka.ms/RazorPagesCRUD.
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        _context.Players!.Add(Player);
        await _context.SaveChangesAsync();

        return RedirectToPage("./Index");
    }
}
