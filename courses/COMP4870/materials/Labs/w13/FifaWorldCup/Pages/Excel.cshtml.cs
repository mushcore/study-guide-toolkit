using ClosedXML.Excel;
using FifaWorldCup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FifaWorldCup.Pages;

public class ExcelModel : PageModel
{
    public FileResult OnGet()
    {
        var data = Game.GetGames();

        using (var workbook = new XLWorkbook())
        {
            IXLWorksheet worksheet =
            workbook.Worksheets.Add("Games");
            worksheet.Cell(1, 1).Value = "Game Id";
            worksheet.Cell(1, 2).Value = "Year";
            worksheet.Cell(1, 3).Value = "Gender";
            worksheet.Cell(1, 4).Value = "City";
            worksheet.Cell(1, 5).Value = "Country";
            worksheet.Cell(1, 6).Value = "Continent";
            worksheet.Cell(1, 7).Value = "Winner";

            IXLRange range = worksheet.Range(worksheet.Cell(1, 1).Address, worksheet.Cell(1, 7).Address);
            range.Style.Fill.SetBackgroundColor(XLColor.Almond);

            int index = 1;

            foreach (var item in data)
            {
                index++;

                worksheet.Cell(index, 1).Value = item.GameId;
                worksheet.Cell(index, 2).Value = item.Year;
                worksheet.Cell(index, 3).Value = item.Gender;
                worksheet.Cell(index, 4).Value = item.City;
                worksheet.Cell(index, 5).Value = item.Country;
                worksheet.Cell(index, 6).Value = item.Continent;
                worksheet.Cell(index, 7).Value = item.Winner;

            }

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                var strDate = DateTime.Now.ToString("yyyyMMdd");
                string filename = string.Format($"FifaWorldCup_{strDate}.xlsx");

                return File(content, contentType, filename);
            }
        }
    }
}
