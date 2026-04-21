using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Reporting.Data;
using Reporting.ViewModels;

namespace MyApp.Namespace
{
    public class ChartPageModel : PageModel
    {
        private readonly ILogger<ChartPageModel> _logger;
        private readonly SchoolDbContext _context;

        [BindProperty]
        public List<SchoolCount> ChartData { get; set; } = default!;

        public ChartPageModel(ILogger<ChartPageModel> logger,
        SchoolDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public void OnGet()
        {
            List<SchoolCount> studentsInSchool = new List<SchoolCount>();

            var data = _context.Students
               .GroupBy(s => s.School)
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
        }
    }
}
