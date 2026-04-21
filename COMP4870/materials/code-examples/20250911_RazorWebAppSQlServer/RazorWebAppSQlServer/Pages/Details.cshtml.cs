using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics;

namespace RazorWebAppSQlServer.Pages
{
    public class DetailsModel : PageModel
    {
        public Process? MyProcess { get; set; }
        public void OnGet(int id)
        {
            MyProcess = Process.GetProcessById(id);
        }
    }
}
