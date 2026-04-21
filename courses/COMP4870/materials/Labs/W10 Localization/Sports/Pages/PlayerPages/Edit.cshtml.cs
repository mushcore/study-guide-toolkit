using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Sports.Models;
using Sports.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Sports.Pages.PlayerPages;

public class EditModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public EditModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public Player Player { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(int? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var player = await _context.Players!.FirstOrDefaultAsync(m => m.PlayerId == id);
        if (player is null)
        {
            return NotFound();
        }
        Player = player;
        ViewData["TeamName"] = new SelectList(_context.Teams, "TeamName", "TeamName");
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

        _context.Attach(Player).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PlayerExists(Player.PlayerId))
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

    private bool PlayerExists(int id)
    {
        return _context.Players!.Any(e => e.PlayerId == id);
    }
}
