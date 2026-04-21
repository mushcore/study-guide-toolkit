namespace RazorStar.Pages
{
    public class ProcessPageModel : PageModel
    {
        public void OnGet()
        {
            Process[] processList = Process.GetProcesses();
            ViewData["Procs"] = processList;
        }
    }
}
