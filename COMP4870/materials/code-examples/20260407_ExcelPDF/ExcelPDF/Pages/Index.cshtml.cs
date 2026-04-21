using ExcelPDF.Models;
using ExcelStar.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ExcelStar.Pages;

class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;

    [BindProperty]
    public List<SchoolCount> ChartData { get; set; } = default!;

    public IndexModel(ILogger<IndexModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
        List<SchoolCount> studentsInSchool = new List<SchoolCount>();

        var data = Student.GetStudents()
           .GroupBy(_ => _.School)
           .Select(g => new
           {
               Name = g.Key,
               Count = g.Count()
           })
           .OrderByDescending(cp => cp.Count)
           .ToList();

        foreach (var item in data)
        {
            studentsInSchool.Add(new SchoolCount()
            {
                Name = item.Name,
                Count = item.Count
            });
        }

        ChartData = studentsInSchool;

        // Console.WriteLine("============== " + ChartData.Count);
    }
}
