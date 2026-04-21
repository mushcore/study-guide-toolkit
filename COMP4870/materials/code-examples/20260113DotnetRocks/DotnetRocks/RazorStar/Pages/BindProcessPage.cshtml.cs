using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorStar.Pages
{
    public class BindProcessPageModel : PageModel
    {
        [BindProperty]
        public Process[]? Procs { get; set; }
        public void OnGet()
        {
            Procs = Process.GetProcesses();
        }
    }
}
