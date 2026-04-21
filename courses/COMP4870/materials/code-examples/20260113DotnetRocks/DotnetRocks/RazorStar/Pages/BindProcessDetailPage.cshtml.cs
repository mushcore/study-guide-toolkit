namespace RazorStar.Pages
{
    public class BindProcessDetailPageModel : PageModel
    {
        [BindProperty]
        public Process? MyProcess { get; set; }
        public void OnGet(int id)
        {
            MyProcess = Process.GetProcessById(id);
        }
    }
}
