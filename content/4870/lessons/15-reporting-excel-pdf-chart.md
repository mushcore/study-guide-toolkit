---
n: 15
id: reporting-excel-pdf-chart
title: "Reporting — Excel (ClosedXML), PDF (iText 7), Charts (Chart.js)"
hook: "Three small libraries, one Razor page each. ClosedXML uses 1-based cells, iText 7 needs ms.Position = 0, Chart.js needs the @: directive in Razor."
tags: [excel, pdf, chart, closedxml, itext7, chart-js, reporting]
module: "Reporting"
source: "materials/Lessons/W13/PDF & Excel/* + Chart.js/* + FifaWorldCup labs"
bloom_levels: [understand, apply]
related: [file-based-apps]
---

## What this lesson covers

Excel + PDF + Chart together are **2 marks** on the exam — small, but each library has a few "magic strings" and pitfalls that show up in MCQ form. This lesson packs all three together since they're conceptually a single bucket: "ways to produce a report from a Razor page."

Three NuGet libraries:

| Output | Library | NuGet |
|---|---|---|
| **Excel** (`.xlsx`) | ClosedXML | `ClosedXML` |
| **PDF** | iText 7 | `itext7` + **`itext.bouncy-castle-adapter`** |
| **Chart** | Chart.js | (CDN — no NuGet) |

---

## Section 1 — Excel export with ClosedXML

### Vocabulary

| Term | Meaning |
|---|---|
| **`XLWorkbook`** | The whole `.xlsx` file in memory. |
| **`IXLWorksheet`** | One sheet (tab) inside a workbook. |
| **`Cell(row, col)`** | A single cell. **1-based indexing** — `Cell(1, 1)` is `A1`. |
| **`IXLRange`** | A rectangular block of cells, for bulk styling. |
| **`MemoryStream`** | The byte buffer ClosedXML writes the `.xlsx` into. |
| **MIME type** | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |

### Five-step export (W13 FifaWorldCup)

```cs
using ClosedXML.Excel;

public class ExcelModel : PageModel
{
    public FileResult OnGet()
    {
        var data = Game.GetGames();

        using (var workbook = new XLWorkbook())
        {
            // 1. Add a named worksheet
            IXLWorksheet worksheet = workbook.Worksheets.Add("Games");

            // 2. Write headers — 1-based indexing!
            worksheet.Cell(1, 1).Value = "Game Id";
            worksheet.Cell(1, 2).Value = "Year";
            worksheet.Cell(1, 3).Value = "Gender";
            worksheet.Cell(1, 4).Value = "City";
            worksheet.Cell(1, 5).Value = "Country";
            worksheet.Cell(1, 6).Value = "Continent";
            worksheet.Cell(1, 7).Value = "Winner";

            // 3. Style the header range (A1:G1) in bulk
            IXLRange range = worksheet.Range(
                worksheet.Cell(1, 1).Address,
                worksheet.Cell(1, 7).Address);
            range.Style.Fill.SetBackgroundColor(XLColor.Almond);

            // 4. Fill data rows starting at row 2
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

            // 5. Serialize to bytes and return as a download
            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                var strDate = DateTime.Now.ToString("yyyyMMdd");
                string filename = $"FifaWorldCup_{strDate}.xlsx";

                return File(content, contentType, filename);
            }
        }
    }
}
```

### The MIME type — exact

| MIME | Use |
|---|---|
| **`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`** | Modern `.xlsx` (correct) |
| `application/vnd.ms-excel` | Old binary `.xls` — wrong for ClosedXML |
| `application/excel` | Made up — browsers will be confused |

> **Pitfall**
> `Cell(row, col)` is **1-based**, like Excel's UI labels (`A1`, `B2`). NOT 0-based like C# arrays. `Cell(0, 0)` throws.

### Auto-fit and bulk styling

```cs
worksheet.Columns().AdjustToContents();        // auto-size columns to longest content

worksheet.Range("A1:G1").Style.Font.Bold = true;
worksheet.Range("A1:G1").Style.Fill.SetBackgroundColor(XLColor.Almond);
```

---

## Section 2 — PDF export with iText 7

### Vocabulary

| Term | Meaning |
|---|---|
| **`PdfWriter`** | Layer 1 — writes raw bytes to a stream. |
| **`PdfDocument`** | Layer 2 — PDF file structure (pages, cross-ref table, metadata). |
| **`Document`** | Layer 3 — high-level layout API (`Paragraph`, `Table`, `LineSeparator`). |
| **`SetCloseStream(false)`** | Tells `PdfWriter` not to close the underlying `MemoryStream` when the document closes. |
| **`ms.Position = 0`** | Rewind the stream so `FileStreamResult` reads from the beginning. |
| **MIME type** | `application/pdf` |

### Two NuGet packages — both required

```xml
<PackageReference Include="itext7" Version="9.6.0" />
<PackageReference Include="itext.bouncy-castle-adapter" Version="9.6.0" />
```

> **Pitfall**
> Installing only `itext7` compiles fine. **Runtime crash** the first time iText hashes/signs (embeds fonts, produces encrypted output) — `bouncy-castle-adapter` is what supplies the crypto provider. Always install both.

### The four-layer constructor pipeline

```cs
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Geom;
using iText.Kernel.Colors;

public IActionResult OnGet()
{
    var ms = new MemoryStream();

    // Layer 1: raw byte stream sink
    var writer   = new PdfWriter(ms);
    // Layer 2: PDF file structure
    var pdfDoc   = new PdfDocument(writer);
    // Layer 3: high-level layout
    var document = new Document(pdfDoc, PageSize.A4, false);

    // CRITICAL: keep the MemoryStream open after document.Close()
    writer.SetCloseStream(false);

    // Add content
    document.Add(new Paragraph("Report Title")
        .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
        .SetFontSize(20));
    document.Add(new LineSeparator(new SolidLine()));

    var table = new Table(3);
    table.AddCell(new Cell(1, 1)
        .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
        .Add(new Paragraph("Column 1")));
    document.Add(table);

    document.Close();

    // CRITICAL: rewind the stream to the start
    ms.Position = 0;

    return new FileStreamResult(ms, "application/pdf")
    {
        FileDownloadName = $"Report_{DateTime.Now:yyyyMMdd}.pdf"
    };
}
```

### Why `ms.Position = 0` matters

`PdfWriter` advances the `MemoryStream` position to the **end** of the buffer as it writes. `FileStreamResult` reads from the **current position to end** — finds zero bytes — client downloads an empty / corrupted file.

| Fix | Note |
|---|---|
| `ms.Position = 0;` | Rewind explicitly before constructing `FileStreamResult` |
| `File(ms.ToArray(), "application/pdf", "name.pdf")` | Materialize to bytes — position-insensitive |

### Page numbers — post-layout loop

```cs
int total = pdfDoc.GetNumberOfPages();
for (int i = 1; i <= total; i++)
{
    document.ShowTextAligned(
        new Paragraph($"Page {i} of {total}"),
        559, 806,                 // X, Y in points (A4 = 595 × 842)
        i,
        iText.Layout.Properties.TextAlignment.RIGHT,
        iText.Layout.Properties.VerticalAlignment.TOP,
        0);
}
```

---

## Section 3 — Chart.js in Razor

### Vocabulary

| Term | Meaning |
|---|---|
| **Chart.js** | A JavaScript charting library. Loaded via CDN. |
| **`<canvas>`** | HTML element Chart.js draws into. |
| **`@:` directive** | Razor syntax that says "treat this whole line as text output, but allow `@expr` substitutions." |
| **`new Chart(ctx, config)`** | Chart.js v3+ constructor. |

### Three pieces of a Chart.js page

1. A **`<canvas>`** element with an `id`.
2. A **`<script>`** loading Chart.js from the CDN.
3. A **`<script>`** block that builds the chart and references the canvas + data.

### Pie chart skeleton

```razor
@page
@model IndexModel

<h4>Games by Continent</h4>

<div class="chart-container">
    <canvas id="pie-chart" width="400" height="400"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    const Counts     = [];
    const Continents = [];

    @foreach (var item in Model.ChartData)
    {
        @:Counts.push(@item.Count);
        @:Continents.push('@item.Name');
    }

    const ctx = document.getElementById('pie-chart');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Continents,
            datasets: [{
                label: 'Games',
                data: Counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        }
    });
</script>
```

### The `@:` directive — bridging Razor and JS

Inside a `<script>` block, Razor treats content as JavaScript text. The **`@:`** directive at the start of a line says **"this line is a mix of JS text and Razor expressions"**:

```cs
@foreach (var item in Model.ChartData)
{
    @:Counts.push(@item.Count);             // emits: Counts.push(42);
    @:Continents.push('@item.Name');        // emits: Continents.push('Asia');
}
```

> **Pitfall**
> Forgetting `@:` and writing `Counts.push("@item.Name");` directly inside the `@foreach { }` block causes a Razor parse error. Use `@:` for any line mixing JS text + Razor expressions.

### `new Chart(ctx, config)` — Chart.js v3+

| Argument | Type |
|---|---|
| `ctx` | The `<canvas>` element (or its 2D context) |
| `config` | A JS object with `type`, `data`, optional `options` |

`type`: `'pie'`, `'bar'`, `'line'`, `'doughnut'`, `'radar'`, `'scatter'`.

`data`:
- `labels` — array of strings (one per slice / bar / point)
- `datasets` — array; each dataset has `label`, `data` (numbers, aligned with labels), styling

### Bar chart variant

```razor
<canvas id="scores" width="500" height="300"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    const names  = [];
    const scores = [];

    @foreach (var p in Model.Top5)
    {
        @:names.push('@p.Name');
        @:scores.push(@p.Score);
    }

    new Chart(document.getElementById('scores'), {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{ label: 'Score', data: scores }]
        }
    });
</script>
```

Same pattern — only `type` changes.

---

## Question patterns to expect

| Pattern | Example stem | Answer |
|---|---|---|
| **MIME type** | "What MIME type is correct for `.xlsx`?" | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| **MIME type** | "What MIME type is correct for `.pdf`?" | `application/pdf` |
| **Indexing** | "Is `worksheet.Cell(0, 0)` valid in ClosedXML?" | **No** — 1-based indexing |
| **Method recall** | "Which iText method writes a paragraph?" | `document.Add(new Paragraph("..."))` |
| **Failure mode** | "PDF downloads as empty / corrupted" | Forgot `ms.Position = 0` before `FileStreamResult` |
| **Package recall** | "Which two NuGet packages does iText 7 need?" | `itext7` + `itext.bouncy-castle-adapter` |
| **Chart constructor** | "What does Chart.js v3+ use to construct a chart?" | `new Chart(ctx, config)` |
| **Razor directive** | "What's the `@:` directive used for in a `<script>` block?" | Treat the whole line as JS output mixed with Razor expressions |
| **Excel layer** | "Which method serializes a workbook to bytes?" | `workbook.SaveAs(stream)` then `stream.ToArray()` |

---

## Retrieval checkpoints

> **Q:** Is `Cell(row, col)` in ClosedXML 0-based or 1-based?
> **A:** **1-based** — matches Excel's UI labels (`A1` = `Cell(1, 1)`).

> **Q:** What MIME type goes with a ClosedXML `.xlsx` download?
> **A:** **`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`** — exact.

> **Q:** Which two NuGet packages must iText 7 have?
> **A:** **`itext7`** AND **`itext.bouncy-castle-adapter`**. Missing the second one → runtime crash on first hashing/signing.

> **Q:** Why does a PDF sometimes download as "empty or corrupted"?
> **A:** Stream position. `PdfWriter` advances `MemoryStream.Position` to the end. **Set `ms.Position = 0` before `FileStreamResult`** — or use `File(ms.ToArray(), ...)`.

> **Q:** What's the four-layer iText 7 pipeline?
> **A:** **`MemoryStream`** → **`PdfWriter(ms)`** → **`PdfDocument(writer)`** → **`Document(pdfDoc, PageSize.A4, false)`** → `writer.SetCloseStream(false)` → add content → `document.Close()` → `ms.Position = 0` → `FileStreamResult`.

> **Q:** What's the `@:` directive for in a Razor `<script>` block?
> **A:** **Mark a whole line as text output that may contain `@razorExpression` substitutions.** Required because `<script>` content is otherwise treated as opaque JS by Razor.

> **Q:** What's the Chart.js v3+ constructor signature?
> **A:** **`new Chart(ctx, config)`** — `ctx` = canvas element, `config` = `{ type, data, options }`.

> **Q:** What `type` strings does Chart.js v3+ accept?
> **A:** `'pie'`, `'bar'`, `'line'`, `'doughnut'`, `'radar'`, `'scatter'`.

> **Q:** Where does Chart.js run — server or client?
> **A:** **Client only.** No server-side PNG fallback in this course's toolkit. JS-disabled users see nothing.

---

## Common pitfalls

> **Pitfall**
> Treating `Cell(row, col)` as 0-based — `Cell(0, 0)` throws. ClosedXML matches Excel's 1-based UI.

> **Pitfall**
> `[LoadColumn(N)]` in ML.NET is **0-based**. `Cell(r, c)` in ClosedXML is **1-based**. Mixing conventions across the same project is a classic off-by-one source.

> **Pitfall**
> Installing `itext7` without `itext.bouncy-castle-adapter`. Build succeeds. Runtime crashes on first hashing.

> **Pitfall**
> Skipping `ms.Position = 0` before `FileStreamResult` → empty PDF download.

> **Pitfall**
> `ms.Position = 0` is unnecessary if you use `File(ms.ToArray(), "application/pdf", "name.pdf")` — but it's still good practice to be explicit.

> **Pitfall**
> Forgetting `@:` in a `<script>` block when mixing Razor expressions and JS — Razor parse error or malformed JS.

> **Pitfall**
> Hardcoding chart data instead of injecting from `Model` via `@foreach { @:array.push(@expr); }` — chart can't reflect server data.

---

## Takeaway

> **Takeaway**
> **Excel:** `XLWorkbook()` (in `using`) → `Worksheets.Add("name")` → fill with **1-based `Cell(row, col)`** → `Range(start, end).Style` for bulk → `SaveAs(MemoryStream)` → `stream.ToArray()` → `File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "name.xlsx")`.
> **PDF:** Install **both** `itext7` + `itext.bouncy-castle-adapter`. `MemoryStream` → `PdfWriter(ms)` → `PdfDocument(writer)` → `Document(pdfDoc, PageSize.A4, false)` → `writer.SetCloseStream(false)` → `document.Add(new Paragraph(...))` → `document.Close()` → **`ms.Position = 0`** → `FileStreamResult(ms, "application/pdf") { FileDownloadName = ... }`.
> **Chart:** `<canvas id="c">` + `<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js">` + `<script>` block. Use **`@foreach { @:jsArray.push(@razorExpr); }`** to inject server data. **`new Chart(ctx, { type: 'pie'|'bar'|'line', data: { labels, datasets } })`**. Client-side only.
