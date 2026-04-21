using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using CommunityApp.Models;
using CommunityApp.Data;

namespace CommunityApp.Pages.ProvincePages;

public class DeleteModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public DeleteModel(ApplicationDbContext context)
    {
        _context = context;
    }

    [BindProperty]
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

    public async Task<IActionResult> OnPostAsync(string? id)
    {
        if (id is null)
        {
            return NotFound();
        }

        var province = await _context.Provinces!.FindAsync(id);
        if (province != null)
        {
            Province = province;
            _context.Provinces.Remove(Province);
            await _context.SaveChangesAsync();
        }

        return RedirectToPage("./Index");
    }
}
