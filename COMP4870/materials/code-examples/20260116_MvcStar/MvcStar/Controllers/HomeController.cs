using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MvcStar.Models;

namespace MvcStar.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        ViewData["Pug"] = "My favorite DOG";
        ViewBag.Animal = "Cheetah";
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult Bingo()
    {
        return View();
    }


}
