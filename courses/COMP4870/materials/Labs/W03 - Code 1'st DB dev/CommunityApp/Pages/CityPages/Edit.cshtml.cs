using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CommunityApp.Models;
using CommunityApp.Data;

namespace CommunityApp.Pages.CityPages;

public class EditModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public EditModel(ApplicationDbContext context)
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
        City = city;
        ViewData["ProvinceCode"] = new SelectList(_context.Provinces, "ProvinceCode", "ProvinceName");
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            ViewData["ProvinceCode"] = new SelectList(_context.Provinces, "ProvinceCode", "ProvinceName");
            return Page();
        }

        _context.Attach(City).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CityExists(City.CityId))
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

    private bool CityExists(int id)
    {
        return _context.Cities!.Any(e => e.CityId == id);
    }
}
