---
n: 19
id: excel-export
title: "Excel export with ClosedXML — XLWorkbook → File()"
kind: code
lang: csharp
tags: [excel, closedxml, reporting, code-question]
source: "Lesson 15 (likely-pattern coding question for Reporting bucket — 2 marks on final)"
---

## Prompt

Write a Razor PageModel handler **`OnGet`** that exports a list of `Game` objects to an Excel `.xlsx` file. The handler should:

1. Return a **`FileResult`**.
2. Create an **`XLWorkbook`** in a `using` block.
3. Add a worksheet named `"Games"`.
4. Write headers in row 1 (`"Game Id"`, `"Year"`, `"City"`, `"Country"`) using **1-based `Cell(row, col)`** indexing.
5. Loop over `Game.GetGames()` writing each game's `GameId`, `Year`, `City`, `Country` starting at row 2.
6. Save to a `MemoryStream` and return via **`File(bytes, mimeType, filename)`** with the correct `.xlsx` MIME type.

Write only the handler.

## Starter

```cs
public FileResult OnGet()
{
    var data = Game.GetGames();

    using (var workbook = new XLWorkbook())
    {
        // TODO 1: add "Games" worksheet
        // TODO 2: write headers in row 1
        // TODO 3: loop data, write rows starting at row 2
        // TODO 4: SaveAs MemoryStream → return File(bytes, mime, filename)
    }
}
```

## Solution

```cs
public FileResult OnGet()
{
    var data = Game.GetGames();

    using (var workbook = new XLWorkbook())
    {
        IXLWorksheet worksheet = workbook.Worksheets.Add("Games");

        worksheet.Cell(1, 1).Value = "Game Id";
        worksheet.Cell(1, 2).Value = "Year";
        worksheet.Cell(1, 3).Value = "City";
        worksheet.Cell(1, 4).Value = "Country";

        int index = 1;
        foreach (var item in data)
        {
            index++;
            worksheet.Cell(index, 1).Value = item.GameId;
            worksheet.Cell(index, 2).Value = item.Year;
            worksheet.Cell(index, 3).Value = item.City;
            worksheet.Cell(index, 4).Value = item.Country;
        }

        using (var stream = new MemoryStream())
        {
            workbook.SaveAs(stream);
            var content = stream.ToArray();
            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            string filename    = $"Games_{DateTime.Now:yyyyMMdd}.xlsx";

            return File(content, contentType, filename);
        }
    }
}
```

## Why

ClosedXML uses **1-based** cell indexing — `Cell(1, 1)` is `A1` in Excel UI. The MIME type is **`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`** (exact string) — this is the modern `.xlsx` MIME, not the legacy `.xls` one. `workbook.SaveAs(stream)` serializes to the stream; `stream.ToArray()` materializes the bytes.

A common wrong approach is treating `Cell(row, col)` as **0-based** like a C# array. `Cell(0, 0)` throws. ClosedXML matches Excel's UI labels — start at row 1, column 1.

Another wrong approach is using the wrong MIME type — `application/excel`, `application/vnd.ms-excel` (old binary `.xls`), or `application/octet-stream`. Browsers may still download with the wrong extension or fail to associate with Excel.

A third wrong approach is forgetting to wrap the stream in `using` (or returning the stream directly). The `MemoryStream` here is materialized to bytes via `ToArray()` before return — `File(bytes, ...)` is position-insensitive. (The PDF lesson's `FileStreamResult` pattern is what needs `ms.Position = 0`.)
