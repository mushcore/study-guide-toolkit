using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Sports.Models;
using Sports.Data;

namespace Sports.Pages.TeamPages;

public class DeleteModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public DeleteModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public Team Team { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(string? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var team = await _context.Teams!.FirstOrDefaultAsync(m => m.TeamName == id);
        if (team is null)
        {
            return NotFound();
        }
        else
        {
            Team = team;
        }

        return Page();
    }

    public async Task<IActionResult> OnPostAsync(string? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var team = await _context.Teams!.FindAsync(id);
        if (team != null)
        {
            Team = team;
            _context.Teams.Remove(Team);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage("./Index");
    }
}
