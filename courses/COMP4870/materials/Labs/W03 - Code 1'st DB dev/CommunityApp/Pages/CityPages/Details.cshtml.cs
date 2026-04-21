using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using CommunityApp.Models;
using CommunityApp.Data;

namespace CommunityApp.Pages.CityPages;

public class DetailsModel : PageModel
{
    private readonly ApplicationDbContext _context;
    public DetailsModel(ApplicationDbContext context)
    {
        _context = context;
    }

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
}
