using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MvcStar.Controllers
{
    public class ConcreteController : Controller
    {
        // GET: ConcreteController
        public ActionResult Index()
        {
            return View(Process.GetProcesses());
        }
        public ActionResult Display(int id)
        {
            return View(Process.GetProcessById(id));
        }

    }
}
