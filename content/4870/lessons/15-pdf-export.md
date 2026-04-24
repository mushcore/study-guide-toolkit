---
n: 15
id: pdf-export
title: "PDF export with iText 7"
hook: "PdfWriter → PdfDocument → Document → SetCloseStream(false) → add content → ms.Position = 0."
tags: [pdf, itext7, report]
module: ".NET 10 Scripts & Reporting"
source: "Labs/w13/FifaWorldCup/Pages/PdfReport.cshtml.cs"
bloom_levels: [understand, apply]
related: [excel-export, chart-rendering]
---

## Two packages (not one)

iText 7 needs both:

```xml
<PackageReference Include="itext7" Version="9.6.0" />
<PackageReference Include="itext.bouncy-castle-adapter" Version="9.6.0" />
```

Missing `bouncy-castle-adapter` → runtime crash first time iText hashes/signs (embeds fonts, produces encrypted output). NOT a build error.

## Four-layer constructor pipeline

```cs
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Geom;
using iText.Kernel.Colors;

public IActionResult OnGet()
{
    var ms = new MemoryStream();

    var writer   = new PdfWriter(ms);                         // 1. stream sink
    var pdfDoc   = new PdfDocument(writer);                    // 2. PDF structure
    var document = new Document(pdfDoc, PageSize.A4, false);   // 3. layout engine

    writer.SetCloseStream(false);                              // 4. keep MemoryStream open

    // ... add content ...

    document.Close();
    ms.Position = 0;                                           // CRITICAL — rewind

    return new FileStreamResult(ms, "application/pdf")
    {
        FileDownloadName = $"Report_{DateTime.Now:yyyyMMdd}.pdf"
    };
}
```

Each layer:

- `PdfWriter` — writes bytes to a stream (`MemoryStream`)
- `PdfDocument` — PDF file structure (pages, cross-reference table, metadata)
- `Document` — high-level layout (paragraphs, tables, separators)
- `SetCloseStream(false)` — keeps MemoryStream open after `document.Close()`

## Adding content

```cs
document.Add(new Paragraph("Report Title")
    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
    .SetFontSize(20));

document.Add(new LineSeparator(new SolidLine()));

var table = new Table(3);
table.AddCell(new Cell(1, 1)
    .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
    .Add(new Paragraph("Column 1")));
// ... fill row-major ...
document.Add(table);
```

`Table(n)` = n-column table. `AddCell` fills left-to-right, wrapping on row fill.

## Page numbers — post-layout loop

```cs
int total = pdfDoc.GetNumberOfPages();
for (int i = 1; i <= total; i++)
{
    document.ShowTextAligned(
        new Paragraph($"Page {i} of {total}"),
        559, 806, i,
        iText.Layout.Properties.TextAlignment.RIGHT,
        iText.Layout.Properties.VerticalAlignment.TOP,
        0);
}
```

`559, 806` = X/Y coordinates in points on A4 (595 × 842 points). Near top-right corner.

## The `ms.Position = 0` trap

`PdfWriter` advances `MemoryStream.Position` to end. `FileStreamResult` reads from current position to end — finds zero bytes → client downloads empty file.

**Always `ms.Position = 0` before returning.**

Alternative: `File(ms.ToArray(), "application/pdf", "name.pdf")` — position-insensitive, materializes bytes.

> **Q:** Handler compiles, runs, returns `.pdf`. Users open → "document is empty or corrupted." Handler correct up to `new FileStreamResult(ms, "application/pdf")`. What's missing?
> **A:** `ms.Position = 0` before constructing `FileStreamResult`. Stream's position is at end after writing → reads zero bytes.

> **Pitfall**
> Installing `itext7` without `itext.bouncy-castle-adapter`. Project compiles fine. Runtime crash when hashing/signing.

> **Pitfall**
> MIME type is `application/pdf` (simple). Filename goes in `FileDownloadName` property of `FileStreamResult`, not constructor.

> **Takeaway**
> Install both `itext7` + `itext.bouncy-castle-adapter`. `MemoryStream` → `PdfWriter(ms)` → `PdfDocument(writer)` → `Document(pdfDoc, PageSize.A4, false)` → `writer.SetCloseStream(false)` → `document.Add(new Paragraph(...))` + `new Table(cols)` → page numbers via `pdfDoc.GetNumberOfPages()` loop → `document.Close()` → `ms.Position = 0` → `new FileStreamResult(ms, "application/pdf") { FileDownloadName = "name.pdf" }`.
