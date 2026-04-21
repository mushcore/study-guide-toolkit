using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ToonApiClient.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    public Toon[]? toons { get; set; }

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public async Task OnGet()
    {
        toons = await ToonService.GetToonsAsync();
    }
}
