using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Sports.Models;
using Sports.Data;

namespace Sports.Pages.PlayerPages;

public class DetailsModel : PageModel
{
    private readonly ApplicationDbContext _context;
    public DetailsModel(ApplicationDbContext context)
    {
        _context = context;
    }

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
        else
        {
            Player = player;
        }

        return Page();
    }
}
