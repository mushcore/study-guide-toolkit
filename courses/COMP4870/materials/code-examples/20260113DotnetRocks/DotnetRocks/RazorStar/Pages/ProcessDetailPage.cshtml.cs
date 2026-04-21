namespace RazorStar.Pages
{
    public class ProcessDetailPageModel : PageModel
    {
        public void OnGet(int id)
        {
            var process = Process.GetProcessById(id);
            ViewData["Proc"] = process;
        }
    }
}
