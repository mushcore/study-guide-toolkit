---
n: 31
id: pdf-export
title: "PDF export with iText 7 — PdfWriter → PdfDocument → Document, FileStreamResult"
hook: "Two NuGet packages, four constructors, one rule: reset MemoryStream.Position before returning."
tags: [pdf, itext7, report]
module: ".NET 10 Scripts & Reporting"
source: "Labs/W13 Excel, PDF, Chart cocktail/; research-excel-pdf-chart.md §3"
bloom_levels: [understand, apply]
related: [excel-export, chart-rendering]
---

## Two packages, not one

iText 7 generates PDFs but does not ship a full crypto stack on its own. You need both packages:

```xml
<PackageReference Include="itext7" Version="9.6.0" />
<PackageReference Include="itext.bouncy-castle-adapter" Version="9.6.0" />
```

Forgetting the `bouncy-castle-adapter` produces a runtime `NoClassDefFound`-style error the first time iText tries to sign or hash anything — not a build error, so the mistake sneaks through local dev. Add both packages from day one.

## Four constructors in order

The iText 7 pipeline stacks four types, each wrapping the previous one:

```cs
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Geom;
using iText.Kernel.Colors;

public async Task<IActionResult> OnGet()
{
    var ms = new MemoryStream();

    var writer   = new PdfWriter(ms);                   // stream sink
    var pdfDoc   = new PdfDocument(writer);              // PDF structure
    var document = new Document(pdfDoc, PageSize.A4, false);  // layout engine

    writer.SetCloseStream(false);                        // keep MemoryStream open

    // ...add content...

    document.Close();
    ms.Position = 0;                                      // CRITICAL: rewind before returning

    return new FileStreamResult(ms, "application/pdf")
    {
        FileDownloadName = $"Report_{DateTime.Now:yyyyMMdd}.pdf"
    };
}
```

Each layer does one job:

- **`PdfWriter`** — writes bytes to a stream (often a `MemoryStream`).
- **`PdfDocument`** — PDF file structure (pages, cross-reference table, metadata).
- **`Document`** — high-level layout (paragraphs, tables, line separators).
- **`SetCloseStream(false)`** — tells `PdfWriter` not to close the `MemoryStream` when `document.Close()` runs. You need the stream to stay open so you can return it.

## Adding content

`Document.Add(...)` accepts any `IBlockElement`. The most common ones:

```cs
document.Add(new Paragraph("Report Title")
    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
    .SetFontSize(20));

document.Add(new LineSeparator(new SolidLine()));

var table = new Table(3);
table.AddCell(new Cell(1, 1)
    .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
    .Add(new Paragraph("Column 1")));
// ... data rows ...
document.Add(table);
```

`Table(3)` is a three-column table; each `AddCell` fills the next cell left-to-right, wrapping to a new row when the row fills up.

## Page numbers

Add page numbers after content is laid out, because you need to know how many pages the PDF has:

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

The magic numbers `559, 806` are X/Y coordinates in points on an A4 page (595 × 842 points). `559, 806` lands the text near the top-right corner. Adjust if your page size or margins differ.

## The `MemoryStream.Position = 0` trap

`PdfWriter` writes bytes into the `MemoryStream`, advancing its position to the end. If you return the stream as-is to `FileStreamResult`, ASP.NET Core reads from the current position to the end — which is empty. The client downloads a zero-byte file.

**Always set `ms.Position = 0` before returning.** `FileStreamResult` then reads from the beginning.

An alternative: skip `FileStreamResult` and use `File(ms.ToArray(), "application/pdf", "name.pdf")`. `.ToArray()` materializes the stream and the position is irrelevant. For large PDFs the stream form saves memory; for small ones either works.

> **Q:** Your handler compiles, runs, and returns a `.pdf` file. Users open it and see a zero-byte file ("document is empty or corrupted"). The handler is correct up to `new FileStreamResult(ms, "application/pdf")`. What's missing?
> **A:** `ms.Position = 0` before constructing the `FileStreamResult`. After writing, the MemoryStream's position is at the end — `FileStreamResult` reads from current position, finds zero bytes, delivers an empty file. Rewinding fixes it. Alternatively, use `File(ms.ToArray(), "application/pdf", "name.pdf")` which is position-insensitive.

> **Example**
> Minimal PDF export with one title + one table:
>
> ```cs
> public IActionResult OnGet()
> {
>     var ms = new MemoryStream();
>     var writer = new PdfWriter(ms);
>     var doc    = new Document(new PdfDocument(writer), PageSize.A4, false);
>     writer.SetCloseStream(false);
>
>     doc.Add(new Paragraph("Players")
>         .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
>         .SetFontSize(18));
>
>     var table = new Table(2);
>     table.AddCell("Name").AddCell("Score");
>     foreach (var p in Player.All())
>     {
>         table.AddCell(p.Name);
>         table.AddCell(p.Score.ToString());
>     }
>     doc.Add(table);
>
>     doc.Close();
>     ms.Position = 0;
>
>     return new FileStreamResult(ms, "application/pdf")
>     {
>         FileDownloadName = "players.pdf"
>     };
> }
> ```
>
> Every layer is present: MemoryStream → PdfWriter → PdfDocument → Document → add elements → close → rewind → return.

> **Pitfall**
> Installing only `itext7` without `itext.bouncy-castle-adapter`. The project compiles fine. Runtime crashes when iText tries to hash or sign — typically while embedding fonts or producing encrypted output. Add both packages together; don't wait for the first crash to notice.

> **Takeaway**
> Install both `itext7` and `itext.bouncy-castle-adapter`. Build a `MemoryStream`, wrap it in `PdfWriter`, wrap that in `PdfDocument`, wrap that in `Document(pdfDoc, PageSize.A4, false)`, and call `writer.SetCloseStream(false)`. Add content with `Document.Add(new Paragraph(...))` and `Document.Add(new Table(cols))`. Add page numbers in a post-layout loop using `pdfDoc.GetNumberOfPages()`. Call `document.Close()`, then `ms.Position = 0`, then return `new FileStreamResult(ms, "application/pdf") { FileDownloadName = "name.pdf" }`.
