using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Sports.Models;
using Sports.Data;

namespace Sports.Pages.PlayerPages;

public class DeleteModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public DeleteModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public Player Player { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(int? playerid)
    {
        if (playerid is null)
        {
            return NotFound();
        }

        var player = await _context.Players!.FirstOrDefaultAsync(m => m.PlayerId == playerid);
        if (player is null)
        {
            return NotFound();
        }
        else
        {
            Player = player;
        }

        return Page();
    }

    public async Task<IActionResult> OnPostAsync(int? playerid)
    {
        if (playerid is null)
        {
            return NotFound();
        }

        var player = await _context.Players!.FindAsync(playerid);
        if (player != null)
        {
            Player = player;
            _context.Players!.Remove(Player);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage("./Index");
    }
}
