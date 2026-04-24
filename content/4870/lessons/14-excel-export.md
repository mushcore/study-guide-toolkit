---
n: 14
id: excel-export
title: "Excel export with ClosedXML"
hook: "XLWorkbook → Worksheet → 1-based Cell writes → MemoryStream → FileResult."
tags: [excel, closedxml, report]
module: ".NET 10 Scripts & Reporting"
source: "Labs/w13/FifaWorldCup/Pages/Excel.cshtml.cs"
bloom_levels: [understand, apply]
related: [pdf-export, chart-rendering]
---

## Five-step export (W13 FifaWorldCup)

```cs
using ClosedXML.Excel;
using FifaWorldCup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class ExcelModel : PageModel
{
    public FileResult OnGet()
    {
        var data = Game.GetGames();

        using (var workbook = new XLWorkbook())
        {
            IXLWorksheet worksheet = workbook.Worksheets.Add("Games");

            // 1. Headers (1-BASED indexing)
            worksheet.Cell(1, 1).Value = "Game Id";
            worksheet.Cell(1, 2).Value = "Year";
            worksheet.Cell(1, 3).Value = "Gender";
            worksheet.Cell(1, 4).Value = "City";
            worksheet.Cell(1, 5).Value = "Country";
            worksheet.Cell(1, 6).Value = "Continent";
            worksheet.Cell(1, 7).Value = "Winner";

            // 2. Header styling
            IXLRange range = worksheet.Range(
                worksheet.Cell(1, 1).Address,
                worksheet.Cell(1, 7).Address);
            range.Style.Fill.SetBackgroundColor(XLColor.Almond);

            // 3. Data rows
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

            // 4. Save to MemoryStream
            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                var strDate = DateTime.Now.ToString("yyyyMMdd");
                string filename = $"FifaWorldCup_{strDate}.xlsx";

                // 5. Return as FileResult
                return File(content, contentType, filename);
            }
        }
    }
}
```

## Five moving parts

1. `XLWorkbook()` — in-memory workbook. `using` disposes.
2. `Worksheets.Add("Name")` — named sheet.
3. `Cell(row, col)` — **1-BASED** indexing (matches Excel UI labels: `A1` = `Cell(1, 1)`).
4. `SaveAs(stream)` → `stream.ToArray()` → bytes.
5. `File(bytes, mimeType, filename)` → ASP.NET Core serves as download.

## MIME type (exact)

```text
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

Wrong: `application/excel`, `application/vnd.ms-excel` (old `.xls` binary). Wrong MIME → browser confusion.

## `Range` for bulk styling

```cs
IXLRange header = worksheet.Range(
    worksheet.Cell(1, 1).Address,
    worksheet.Cell(1, 7).Address);
header.Style.Fill.SetBackgroundColor(XLColor.Almond);
header.Style.Font.Bold = true;
```

## Auto-fit columns

```cs
worksheet.Columns().AdjustToContents();
```

Call after filling data, before saving.

## Row counter pattern

Demo uses `int index = 1; foreach { index++; ...Cell(index, ...) }` — pre-increment before each data write. Row 1 = headers, row 2 = first data. No off-by-one.

> **Q:** Users report downloaded Excel has trailing blank row, totals formula breaks. Handler has `for (int i = 0; i < games.Count; i++) sheet.Cell(i, 1).Value = games[i].Name;`. What's wrong?
> **A:** Loop starts at `i = 0`, but `Cell(0, 1)` is invalid (ClosedXML 1-based). First write lands in row 1, overwriting headers. Start at `i = 1`, write to `Cell(i + 1, 1)`, OR pre-increment row counter starting at 1.

> **Pitfall**
> Treating `Cell(row, col)` as 0-based like C# arrays. Excel + ClosedXML use 1-based — `Cell(1, 1)` is A1.

> **Pitfall**
> `[LoadColumn(N)]` in ML.NET is 0-based. `Cell(r, c)` in ClosedXML is 1-based. Mixing conventions between readers and writers = off-by-one.

> **Takeaway**
> `XLWorkbook()` in `using` → `Worksheets.Add("name")` → fill with 1-based `Cell(row, col)` → `Range(start, end).Style` for bulk → `SaveAs(MemoryStream)` → `stream.ToArray()` → `File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "name.xlsx")`.
