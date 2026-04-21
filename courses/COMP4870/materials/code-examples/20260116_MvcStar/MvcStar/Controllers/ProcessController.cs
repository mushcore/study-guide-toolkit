using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MvcStar.Controllers
{
    [Authorize]
    public class ProcessController : Controller
    {
        // GET: ProcessController
        public ActionResult Index()
        {
            ViewData["procs"] = Process.GetProcesses();
            return View();
        }
        public ActionResult Display(int id)
        {
            ViewData["proc"] = Process.GetProcessById(id);
            return View();
        }

    }
}
