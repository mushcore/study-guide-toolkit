---
n: 30
id: excel-export
title: "Excel export with ClosedXML — 1-based cells, FileResult, XLSX MIME"
hook: "New workbook, add a worksheet, fill cells, save to MemoryStream, return as FileResult."
tags: [excel, closedxml, report]
module: ".NET 10 Scripts & Reporting"
source: "Labs/W13 Excel, PDF, Chart cocktail/; research-excel-pdf-chart.md §3"
bloom_levels: [understand, apply]
related: [pdf-export, chart-rendering]
---

## Five steps to an `.xlsx` download

Given the NuGet package `ClosedXML` (v0.105.0 in the course solution), a Razor Page handler can emit an Excel file in about 20 lines:

```cs
using ClosedXML.Excel;
using System.IO;

public FileResult OnGet()
{
    var games = Game.GetGames();

    using var workbook = new XLWorkbook();
    IXLWorksheet sheet  = workbook.Worksheets.Add("Games");

    // 1. Headers
    sheet.Cell(1, 1).Value = "Game ID";
    sheet.Cell(1, 2).Value = "Year";
    sheet.Cell(1, 3).Value = "Continent";

    // 2. Header styling
    IXLRange header = sheet.Range(sheet.Cell(1, 1).Address, sheet.Cell(1, 3).Address);
    header.Style.Fill.SetBackgroundColor(XLColor.Almond);
    header.Style.Font.Bold = true;

    // 3. Data rows
    int row = 1;
    foreach (var g in games)
    {
        row++;
        sheet.Cell(row, 1).Value = g.GameId;
        sheet.Cell(row, 2).Value = g.Year;
        sheet.Cell(row, 3).Value = g.Continent;
    }

    // 4. Write to a MemoryStream
    using var stream = new MemoryStream();
    workbook.SaveAs(stream);
    var bytes = stream.ToArray();

    // 5. Return as FileResult
    return File(
        bytes,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        $"Games_{DateTime.Now:yyyyMMdd}.xlsx");
}
```

Five moving parts:

1. `XLWorkbook()` creates an in-memory workbook. `using` disposes it after.
2. `Worksheets.Add("Games")` adds a named sheet.
3. `Cell(row, col)` is **1-based**, not 0-based — `Cell(1, 1)` is the top-left cell. `Range(cellA, cellB)` selects rectangular regions for bulk styling.
4. `SaveAs(stream)` writes the workbook into a `MemoryStream`; `stream.ToArray()` gives the byte array.
5. `File(bytes, mimeType, filename)` returns a `FileResult` — ASP.NET Core serves the file as a download with the supplied filename.

## The MIME type matters

Excel's MIME type is a mouthful: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`. Getting this wrong — e.g. `application/excel` or `application/vnd.ms-excel` (which is the old `.xls` binary format) — confuses browsers, which may either download without an extension or open the wrong app. Stick with the exact OpenXML string.

## Styling the output

`ClosedXML` exposes the full Excel styling model through fluent setters:

```cs
sheet.Cell(1, 1).Style.Fill.BackgroundColor = XLColor.Almond;
sheet.Cell(1, 1).Style.Font.Bold = true;
sheet.Cell(1, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

sheet.Columns().AdjustToContents();  // auto-fit column widths
```

Autofit is common for exported reports so users don't land on a sheet whose columns are all 8 characters wide. Call after filling data, before saving.

## Row-and-column mental model

ClosedXML's 1-based indexing matches how Excel's UI labels cells. `Cell(5, 3)` is row 5 column 3 — displayed as `C5` in Excel. When you're used to `int[,]` in C# where `arr[0, 0]` is the first element, flipping to 1-based causes subtle off-by-one bugs. A safe pattern: start your data loop at `row = 1` and pre-increment with `row++` before each data write, so row 2 is the first data row (row 1 is headers).

> **Q:** Users report that downloaded Excel files sometimes have a trailing blank row, and the totals formula breaks when they add rows. Looking at your handler, you see `for (int i = 0; i < games.Count; i++) sheet.Cell(i, 1).Value = games[i].Name;`. What is wrong?
> **A:** The loop starts at `i = 0`, but ClosedXML cells are 1-based — `sheet.Cell(0, 1)` is invalid or silently skipped. The first actual write lands in row 1, overwriting the headers. Start the loop at `i = 1` and write to `sheet.Cell(i + 1, 1)`, or pre-increment a separate `row` counter starting at 1 (for the header) and incrementing before each data write.

> **Example**
> A minimal export handler that just dumps a `List<Player>` to Excel:
>
> ```cs
> public FileResult OnGet()
> {
>     using var wb = new XLWorkbook();
>     var sheet = wb.Worksheets.Add("Players");
>
>     sheet.Cell(1, 1).Value = "Name";
>     sheet.Cell(1, 2).Value = "Score";
>
>     int row = 2;
>     foreach (var p in Player.All())
>     {
>         sheet.Cell(row, 1).Value = p.Name;
>         sheet.Cell(row, 2).Value = p.Score;
>         row++;
>     }
>
>     using var ms = new MemoryStream();
>     wb.SaveAs(ms);
>     return File(ms.ToArray(),
>                 "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
>                 "players.xlsx");
> }
> ```
>
> 15 lines, including styling-free data dump. Add `sheet.Columns().AdjustToContents()` before `SaveAs` to auto-fit columns.

> **Pitfall**
> Treating `Cell(row, col)` as 0-based like C# arrays. Excel and ClosedXML both use 1-based indexing — `Cell(1, 1)` is A1. Writing to `Cell(0, 0)` either throws or silently targets an invalid address. If your first data row is row 2 (because row 1 is headers), your loop counter starts at 2, not 0 or 1.

> **Takeaway**
> Install `ClosedXML`, open an `XLWorkbook()` inside a `using`, add a named worksheet, fill cells with 1-based indexing, save to a `MemoryStream`, and return `File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "name.xlsx")`. Use `Range(start, end).Style` for bulk styling and `Columns().AdjustToContents()` to auto-fit column widths before saving.
