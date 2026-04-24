---
n: 18
id: pdf-players-export
title: "Export a list to PDF via iText 7"
kind: code
lang: cs
tags: [pdf, itext7, file-stream-result, razor-pages]
source: "Labs/W13 Excel, PDF, Chart cocktail/ Q3 (variant — single 'Players' table without page numbering, simpler than the lab's multi-table report with centered title + per-page footer)"
---

## Prompt

On a Razor Page handler, produce a PDF download named `players.pdf` containing a centered title "Players" followed by a two-column table (`Name`, `Score`) with one row per entry in `Player.All()`. Return the result as a `FileStreamResult`. Assume both `itext7` and `itext.bouncy-castle-adapter` NuGet packages are installed.

## Starter

```cs
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.IO;

public class PdfReportModel : PageModel
{
    public IActionResult OnGet()
    {
        // TODO: create a MemoryStream, wrap in PdfWriter → PdfDocument → Document.
        // TODO: call writer.SetCloseStream(false).
        // TODO: add a centered "Players" title, then a 2-column table
        //       with headers and one row per Player.All().
        // TODO: close the Document, rewind the stream, return as FileStreamResult.
        throw new NotImplementedException();
    }
}
```

## Solution

```cs
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.IO;

public class PdfReportModel : PageModel
{
    public IActionResult OnGet()
    {
        var ms = new MemoryStream();

        var writer = new PdfWriter(ms);
        var pdfDoc = new PdfDocument(writer);
        var doc    = new Document(pdfDoc, PageSize.A4, false);
        writer.SetCloseStream(false);

        doc.Add(new Paragraph("Players")
            .SetTextAlignment(TextAlignment.CENTER)
            .SetFontSize(20));

        var table = new Table(2);
        table.AddCell(new Cell().Add(new Paragraph("Name")));
        table.AddCell(new Cell().Add(new Paragraph("Score")));

        foreach (var p in Player.All())
        {
            table.AddCell(new Cell().Add(new Paragraph(p.Name)));
            table.AddCell(new Cell().Add(new Paragraph(p.Score.ToString())));
        }

        doc.Add(table);
        doc.Close();
        ms.Position = 0;

        return new FileStreamResult(ms, "application/pdf")
        {
            FileDownloadName = "players.pdf"
        };
    }
}
```

## Why

The iText pipeline is four layers: `MemoryStream` → `PdfWriter(ms)` → `PdfDocument(writer)` → `Document(pdfDoc, PageSize.A4, false)`. Each layer wraps the previous. `SetCloseStream(false)` keeps the `MemoryStream` open after `doc.Close()` so you can read it into the response.

`new Table(2)` creates a two-column table. `AddCell` fills the next cell left-to-right, wrapping to a new row when the count hits `2 * N`. Each `Cell` wraps a `Paragraph` for text content; you could also style fills, borders, and alignment per cell.

The three-line finish is the whole trap: `doc.Close()` writes the final PDF bytes; `ms.Position = 0` rewinds to the start (without it, `FileStreamResult` reads from the end and serves an empty file); `FileStreamResult` produces the response with the correct filename.

Common wrong approaches:

- **Forgetting `ms.Position = 0`.** The MemoryStream's cursor is at the end after writing. `FileStreamResult` reads from the current position, finds nothing, and the browser downloads a 0-byte PDF labelled "Document is empty or corrupted."
- **Skipping `writer.SetCloseStream(false)`.** Default behavior closes the underlying stream when the Document closes. Subsequent attempts to read from `ms` throw `ObjectDisposedException`.
- **Installing only `itext7` and not `itext.bouncy-castle-adapter`.** Compilation succeeds; runtime throws when iText tries to hash or sign content. Install both packages together.
