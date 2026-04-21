using FifaWorldCup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FifaWorldCup.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    [BindProperty]
    public List<ContinentCount> ChartData { get; set; } = default!;

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
        List<ContinentCount> gamesInContinent = new List<ContinentCount>();

        var data = Game.GetGames()
           .GroupBy(_ => _.Continent)
           .Select(g => new
           {
               Name = g.Key,
               Count = g.Count()
           })
           .OrderByDescending(cp => cp.Count)
           .ToList();

        foreach (var item in data)
        {
            gamesInContinent.Add(new ContinentCount()
            {
                Name = item.Name,
                Count = item.Count
            });
        }

        ChartData = gamesInContinent;
    }
}
