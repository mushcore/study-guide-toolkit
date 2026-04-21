using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using CommunityApp.Models;
using CommunityApp.Data;

namespace CommunityApp.Pages.ProvincePages;

public class IndexModel : PageModel
{
    private readonly ApplicationDbContext _context;

    public IndexModel(ApplicationDbContext context)
    {
        _context = context;
    }

    public IList<Province> Province { get; set; } = default!;

    public async Task OnGetAsync()
    {
        Province = await _context.Provinces!.ToListAsync();
    }
}
