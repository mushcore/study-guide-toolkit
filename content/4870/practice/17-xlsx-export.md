---
n: 17
id: xlsx-export
title: "Export a list to Excel via ClosedXML"
kind: code
lang: cs
tags: [excel, closedxml, file-result, razor-pages]
source: "Labs/W13 Excel, PDF, Chart cocktail/ Q2 (variant — two-column player export, simpler than the lab's multi-column FIFA game table with styling)"
---

## Prompt

On a Razor Page handler `OnGet`, produce an Excel download named `players.xlsx` containing two columns — `Name` and `Score` — with one row per entry in `Player.All()`. Style the header row with a light-gray fill. Return the result as a `FileResult`.

## Starter

```cs
using ClosedXML.Excel;
using System.IO;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;

public class PlayersModel : PageModel
{
    public FileResult OnGet()
    {
        // TODO: build an XLWorkbook, add a "Players" worksheet,
        //       write headers + data, style the header row with a gray fill,
        //       save to a MemoryStream, and return as FileResult
        //       with filename "players.xlsx".
        throw new NotImplementedException();
    }
}
```

## Solution

```cs
using ClosedXML.Excel;
using System.IO;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;

public class PlayersModel : PageModel
{
    public FileResult OnGet()
    {
        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Players");

        sheet.Cell(1, 1).Value = "Name";
        sheet.Cell(1, 2).Value = "Score";

        var header = sheet.Range(sheet.Cell(1, 1).Address, sheet.Cell(1, 2).Address);
        header.Style.Fill.SetBackgroundColor(XLColor.LightGray);
        header.Style.Font.Bold = true;

        int row = 2;
        foreach (var p in Player.All())
        {
            sheet.Cell(row, 1).Value = p.Name;
            sheet.Cell(row, 2).Value = p.Score;
            row++;
        }

        sheet.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);

        return File(
            ms.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "players.xlsx");
    }
}
```

## Why

Five steps — open workbook, add sheet, write headers (row 1) and data (row 2 upward), style the header range, save to a `MemoryStream`, return a `FileResult`. The header range is styled as a group via `IXLRange.Style`; per-cell styling would work but repeats the Fill + Bold setup per column.

`sheet.Columns().AdjustToContents()` auto-fits column widths after data is written. Without it, the downloaded file opens with every column at the default ~8-character width, forcing the user to drag column dividers before the data is readable.

The MIME type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` is the exact OpenXML spreadsheet identifier. `application/excel` or `application/vnd.ms-excel` target different formats (or don't exist) and cause browsers to save the file without a proper extension.

Common wrong approaches:

- **Starting the data loop at `row = 1`.** Row 1 is the header; data starts at row 2. Starting at 1 overwrites the headers with the first player's name.
- **Using `sheet.Cell(0, 0)`.** ClosedXML cells are 1-based. `Cell(0, 0)` either throws or is silently ignored, so the first header never appears.
- **Returning `File(ms, mime, name)` with an unclosed `using` on the MemoryStream.** When using `File(stream, ...)`, the framework reads from the stream asynchronously — a `using` disposes the stream before the read completes and the response body is empty. Either return `ms.ToArray()` (no stream lifetime issue) or let the framework dispose the stream.
