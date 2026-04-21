using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using CommunityApp.Models;
using CommunityApp.Data;

namespace CommunityApp.Pages.CityPages;

public class DeleteModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public DeleteModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
    public City City { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(int? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var city = await _context.Cities!.FirstOrDefaultAsync(m => m.CityId == id);
        if (city is null)
        {
            return NotFound();
        }
        else
        {
            City = city;
        }

        return Page();
    }

    public async Task<IActionResult> OnPostAsync(int? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var city = await _context.Cities!.FindAsync(id);
        if (city != null)
        {
            City = city;
            _context.Cities!.Remove(City);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage("./Index");
    }
}
