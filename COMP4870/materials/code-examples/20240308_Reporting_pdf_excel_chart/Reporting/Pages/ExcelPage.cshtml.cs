using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Reporting.Data;

namespace MyApp.Namespace;
public class ExcelPageModel : PageModel
{
    private readonly ILogger<ExcelPageModel> _logger;
    private readonly SchoolDbContext _context;

    public ExcelPageModel(ILogger<ExcelPageModel> logger,
        SchoolDbContext context) {
        _logger = logger;
        _context = context;
    }

    public async Task<FileResult> OnGet() {
        var data = await _context.Students.ToListAsync();

        using (var workbook = new XLWorkbook()) {
            IXLWorksheet worksheet =
            workbook.Worksheets.Add("Students");
            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "First";
            worksheet.Cell(1, 3).Value = "Last";
            worksheet.Cell(1, 4).Value = "School";

            IXLRange range = worksheet.Range(worksheet.Cell(1, 1).Address, worksheet.Cell(1, 4).Address);
            range.Style.Fill.SetBackgroundColor(XLColor.Yellow)
            .Font.FontColor = XLColor.Black;

            int index = 1;

            foreach (var item in data) {
                index++;

                worksheet.Cell(index, 1).Value = item.StudentId;
                worksheet.Cell(index, 2).Value = item.FirstName;
                worksheet.Cell(index, 3).Value = item.LastName;
                worksheet.Cell(index, 4).Value = item.School;

            }

            using (var stream = new MemoryStream()) {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                var strDate = DateTime.Now.ToString("yyyyMMdd");
                string filename = string.Format($"Students_{strDate}.xlsx");

                return File(content, contentType, filename);
            }
        }
    }
}

