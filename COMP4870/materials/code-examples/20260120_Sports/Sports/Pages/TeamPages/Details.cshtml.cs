using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Sports.Models;
using Sports.Data;

namespace Sports.Pages.TeamPages;

public class DetailsModel : PageModel
{
    private readonly ApplicationDbContext _context;
    public DetailsModel(ApplicationDbContext context)
    {
        _context = context;
    }

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
}
