using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics;

namespace RazorWebAppSQlServer.Pages
{
    [Authorize]
    public class ProcessesModel : PageModel
    {
        public Process[]? MyProcesses { get; set; }
        public void OnGet()
        {
            MyProcesses = Process.GetProcesses();
        }
    }
}
