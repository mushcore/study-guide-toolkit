using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using CommunityApp.Models;
using CommunityApp.Data;

namespace CommunityApp.Pages.ProvincePages;

public class DetailsModel : PageModel
{
    private readonly ApplicationDbContext _context;
    public DetailsModel(ApplicationDbContext context)
    {
        _context = context;
    }

    public Province Province { get; set; } = default!;

    public async Task<IActionResult> OnGetAsync(string? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var province = await _context.Provinces!.FirstOrDefaultAsync(m => m.ProvinceCode == id);
        if (province is null)
        {
            return NotFound();
        }
        else
        {
            Province = province;
        }

        return Page();
    }
}
