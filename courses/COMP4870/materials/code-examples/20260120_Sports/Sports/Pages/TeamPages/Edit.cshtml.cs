using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Sports.Models;
using Sports.Data;

namespace Sports.Pages.TeamPages;

public class EditModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public EditModel(ApplicationDbContext context)
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
        Team = team;
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

        _context.Attach(Team).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TeamExists(Team.TeamName))
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

    private bool TeamExists(string? id)
    {
        return _context.Teams!.Any(e => e.TeamName == id);
    }
}
