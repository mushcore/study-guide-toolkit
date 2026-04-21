# COMP4870 Exam Research: Excel/PDF/Chart Generation (2 marks)

## 1. Topic Summary

**Week 13** covers generating **three export formats** in ASP.NET Core Razor Pages:

| Format | Package | Use Case | Controller Return Type |
|--------|---------|----------|------------------------|
| **Excel (.xlsx)** | ClosedXML | Tabular data export with formatting | `FileResult` via `File()` |
| **PDF** | iText 7 (+ bouncy-castle adapter) | Professional reports with tables, styling, page numbers | `FileStreamResult` |
| **Chart (client-side)** | Chart.js (CDN) | Interactive pie/bar/line charts rendered in browser | N/A (JavaScript) |

**Key insight:** Each format requires a different package because they solve different problems:
- ClosedXML abstracts the Office Open XML format (.xlsx binary protocol)
- iText 7 generates PDF bytecode with layout engine
- Chart.js is a client-side JavaScript library (no server rendering)

---

## 2. Exact NuGet Packages

**From `FifaWorldCup.csproj`:**

```xml
<PackageReference Include="ClosedXML" Version="0.105.0" />
<PackageReference Include="itext7" Version="9.6.0" />
<PackageReference Include="itext.bouncy-castle-adapter" Version="9.6.0" />
```

**Package breakdown:**
- `ClosedXML 0.105.0` — Excel generation (uses OpenXML SDK under the hood)
- `itext7 9.6.0` — PDF layout, text, tables, page numbers
- `itext.bouncy-castle-adapter 9.6.0` — Cryptographic support for iText (required dependency; do NOT forget)

**Chart.js:** Loaded from CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
```

---

## 3. Code Patterns (Verbatim)

### Excel Generation (ClosedXML)

```csharp
using ClosedXML.Excel;

public FileResult OnGet()
{
    var data = Game.GetGames();

    using (var workbook = new XLWorkbook())
    {
        IXLWorksheet worksheet = workbook.Worksheets.Add("Games");
        
        // Headers
        worksheet.Cell(1, 1).Value = "Game Id";
        worksheet.Cell(1, 2).Value = "Year";
        
        // Style header row
        IXLRange range = worksheet.Range(worksheet.Cell(1, 1).Address, worksheet.Cell(1, 2).Address);
        range.Style.Fill.SetBackgroundColor(XLColor.Almond);
        
        // Data rows
        int index = 1;
        foreach (var item in data)
        {
            index++;
            worksheet.Cell(index, 1).Value = item.GameId;
            worksheet.Cell(index, 2).Value = item.Year;
        }

        using (var stream = new MemoryStream())
        {
            workbook.SaveAs(stream);
            var content = stream.ToArray();
            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            string filename = "Export_" + DateTime.Now.ToString("yyyyMMdd") + ".xlsx";

            return File(content, contentType, filename);
        }
    }
}
```

**Key points:**
- `XLWorkbook()` creates in-memory workbook
- `Worksheets.Add(name)` adds a sheet
- `Cell(row, col).Value = x` indexes 1-based (NOT 0-based)
- `SetBackgroundColor(XLColor.Almond)` applies fills
- `.SaveAs(stream)` writes to MemoryStream
- `File(bytes, mimeType, fileName)` returns for download

### PDF Generation (iText 7)

```csharp
using iText.Kernel.Pdf;
using iText.Layout.Element;
using iText.Kernel.Colors;

public async Task<IActionResult> OnGet()
{
    MemoryStream ms = new MemoryStream();

    PdfWriter writer = new PdfWriter(ms);
    PdfDocument pdfDoc = new PdfDocument(writer);
    iText.Layout.Document document = new iText.Layout.Document(pdfDoc, iText.Kernel.Geom.PageSize.A4, false);
    writer.SetCloseStream(false);

    // Centered title
    iText.Layout.Element.Paragraph header = new iText.Layout.Element.Paragraph("Report Title")
        .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
        .SetFontSize(20);
    document.Add(header);

    // Add line separator
    iText.Layout.Element.LineSeparator ls = new iText.Layout.Element.LineSeparator(new SolidLine());
    document.Add(ls);

    // Add table
    Table table = new Table(3, false); // 3 columns
    
    Cell header1 = new Cell(1, 1)
        .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
        .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
        .Add(new Paragraph("Column 1"));
    table.AddCell(header1);
    
    // Add data rows
    foreach (var item in data)
    {
        Cell cell = new Cell(1, 1)
            .Add(new Paragraph(item.ToString()));
        table.AddCell(cell);
    }
    
    document.Add(table);

    // Page numbering
    int n = pdfDoc.GetNumberOfPages();
    for (int i = 1; i <= n; i++)
    {
        document.ShowTextAligned(new Paragraph("Page " + i + " of " + n),
            559, 806, i, iText.Layout.Properties.TextAlignment.RIGHT,
            iText.Layout.Properties.VerticalAlignment.TOP, 0);
    }

    document.Close();
    byte[] byteInfo = ms.ToArray();
    ms.Write(byteInfo, 0, byteInfo.Length);
    ms.Position = 0;

    FileStreamResult fileStreamResult = new FileStreamResult(ms, "application/pdf");
    fileStreamResult.FileDownloadName = "Export.pdf";
    return fileStreamResult;
}
```

**Key points:**
- `PdfWriter(stream)` + `PdfDocument(writer)` + `Document(pdfDoc, PageSize.A4, false)`
- `SetCloseStream(false)` keeps MemoryStream open
- `Paragraph()` for text with `.SetTextAlignment()`, `.SetFontSize()`
- `Table(colCount, false)` creates table with fixed columns
- `Cell()` with `.SetBackgroundColor()`, `.Add(Paragraph())`
- `.ShowTextAligned(...)` for page numbering (coordinates 559, 806 = top-right A4)
- Return `FileStreamResult` with `FileDownloadName`

### Chart.js (Client-Side, Razor Template)

**Index.cshtml:**
```html
@page
@model IndexModel

<div class="text-center">
    <h4>Games by Continent</h4>
    <div class="chart-container">
        <canvas id="pie-chart" width="100" height="300"></canvas>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    var Count = [];
    var Continents = [];

    @if (Model.ChartData.Count > 0)
    {
        foreach (var item in Model.ChartData)
        {
            @:Count.push(@item.Count);
            @:Continents.push('@item.Name');
        }
    }

    var Continent = {
        label: "Continent",
        data: Count,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    };

    var datasetvalues = {
        labels: Continents,
        datasets: [Continent]
    };

    var pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Games by Continent'
            }
        }
    };

    var pieChart = new Chart(
        document.getElementById('pie-chart').getContext('2d'), {
        type: 'pie',
        data: datasetvalues,
        options: pieChartOptions
    });
</script>
```

**Index.cshtml.cs:**
```csharp
public class IndexModel : PageModel
{
    [BindProperty]
    public List<ContinentCount> ChartData { get; set; } = default!;

    public void OnGet()
    {
        var data = Game.GetGames()
            .GroupBy(_ => _.Continent)
            .Select(g => new { Name = g.Key, Count = g.Count() })
            .OrderByDescending(cp => cp.Count)
            .ToList();

        ChartData = data.Select(d => new ContinentCount { Name = d.Name, Count = d.Count }).ToList();
    }
}
```

**Key points:**
- `@:` escapes Razor to inject JavaScript lines
- `Model.ChartData` passed from C# to JavaScript array
- `new Chart(canvas, { type: 'pie', data, options })` creates chart
- `type: 'pie'` (other options: `'bar'`, `'line'`, `'doughnut'`)
- No server-side rendering; all rendering happens in the browser

---

## 4. ContentType MIME Strings

**CRITICAL for downloads — these must match exactly:**

| Format | MIME Type (ContentType) |
|--------|------------------------|
| **Excel** | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| **PDF** | `application/pdf` |
| **PNG** (chart export) | `image/png` |
| **JPEG** | `image/jpeg` |

**Why it matters:** Browser uses MIME type to determine if file is "download" (Content-Disposition: attachment) or "view inline" (Content-Disposition: inline).

---

## 5. Controller Pattern: File() Return Types

### Pattern 1: `File()` for byte arrays (Excel)
```csharp
public FileResult OnGet()
{
    byte[] content = /* generate bytes */;
    string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    string fileName = "report.xlsx";
    
    return File(content, contentType, fileName);
}
```

**Returns:** `FileResult` (base class)
- Content-Disposition header set to `attachment; filename=...`
- Browser treats as download

### Pattern 2: `FileStreamResult` for streams (PDF)
```csharp
public IActionResult OnGet()
{
    MemoryStream ms = new MemoryStream();
    /* write PDF bytes to ms */
    ms.Position = 0;
    
    FileStreamResult fileStreamResult = new FileStreamResult(ms, "application/pdf");
    fileStreamResult.FileDownloadName = "report.pdf";
    
    return fileStreamResult;
}
```

**Returns:** `FileStreamResult` (implements `IActionResult`)
- Wraps a stream instead of byte array
- More memory-efficient for large files
- `FileDownloadName` property triggers download header

### Pattern 3: Return `async Task<IActionResult>` (PDF with async operations)
```csharp
public async Task<IActionResult> OnGet()
{
    MemoryStream ms = new MemoryStream();
    
    PdfWriter writer = new PdfWriter(ms);
    PdfDocument pdfDoc = new PdfDocument(writer);
    /* ... generate PDF ... */
    
    ms.Position = 0;
    FileStreamResult fileStreamResult = new FileStreamResult(ms, "application/pdf");
    fileStreamResult.FileDownloadName = "report.pdf";
    
    return fileStreamResult;
}
```

---

## 6. Flashcards (SuperMemo 20 Rules)

### Card 1: ClosedXML Package
**Q:** What NuGet package is used to export data as Excel files in ASP.NET Core?  
**A:** `ClosedXML` (version 0.105.0 in course). Abstracts the Office Open XML format and allows programmatic cell manipulation, formatting, and workbook generation without COM.

---

### Card 2: iText 7 PDF Stack
**Q:** What three packages are required to generate PDFs with iText 7 in ASP.NET Core?  
**A:** 
1. `itext7` (9.6.0) — core PDF layout engine
2. `itext.bouncy-castle-adapter` (9.6.0) — cryptographic support (required dependency)
3. No third package; these two are sufficient for PDF generation.

---

### Card 3: Excel Cell Indexing
**Q:** In ClosedXML, what coordinate system is used for cells?  
**A:** 1-based indexing: `worksheet.Cell(1, 1)` is the top-left cell (row 1, column 1). NOT 0-based like arrays.

---

### Card 4: Excel MIME Type
**Q:** What is the exact MIME type (ContentType) for Excel files?  
**A:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (not `application/excel` or `application/x-xlsx`).

---

### Card 5: PDF Page Numbering
**Q:** In iText 7, how do you add page numbers to a PDF?  
**A:** Loop through `pdfDoc.GetNumberOfPages()`, then call `document.ShowTextAligned(new Paragraph("Page i of n"), 559, 806, i, TextAlignment.RIGHT, VerticalAlignment.TOP, 0)`. Coordinates 559, 806 place text top-right on A4 page.

---

### Card 6: Chart.js Data Injection
**Q:** How do you pass C# data to Chart.js in a Razor view?  
**A:** Use Razor's `@:` escape to inject JavaScript in a loop:
```
@foreach (var item in Model.ChartData)
{
    @:Count.push(@item.Count);
    @:Continents.push('@item.Name');
}
```

---

### Card 7: File Download Return Types
**Q:** When should you return `FileResult` vs `FileStreamResult`?  
**A:** 
- `FileResult`: Small files (byte array in memory). `return File(bytes, contentType, fileName);`
- `FileStreamResult`: Large files (stream). Avoids loading entire file into memory.

---

### Card 8: Chart.js Library Import
**Q:** What is the canonical CDN URL for Chart.js@3.9.1?  
**A:** `https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js` (used in course materials).

---

## 7. Exam Traps & High-Confidence Distinctions

### Trap 1: Wrong MIME type for Excel
**Mistake:** Using `"application/excel"` or `"application/xlsx"`  
**Correct:** `"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"`  
**Why it matters:** Incorrect MIME type may cause browser to misinterpret file or prevent download.

### Trap 2: Forgetting itext.bouncy-castle-adapter
**Mistake:** Installing only `itext7`  
**Correct:** Install both `itext7` AND `itext.bouncy-castle-adapter` (same version)  
**Why it matters:** iText 7 requires bouncy-castle for cryptographic operations. Missing it causes runtime errors.

### Trap 3: ClosedXML uses 1-based indexing
**Mistake:** `worksheet.Cell(0, 0)` for top-left  
**Correct:** `worksheet.Cell(1, 1)` for top-left  
**Why it matters:** 0-based indexing (like arrays) will either throw exception or write to wrong cell.

### Trap 4: Chart.js is client-side only
**Mistake:** Trying to use Chart.js in C# code  
**Correct:** Chart.js runs in the browser via JavaScript; C# only prepares the data and sends it to the view  
**Why it matters:** Chart.js cannot render on the server. You must inject data into JavaScript variables.

### Trap 5: PDF requires FileStreamResult (usually)
**Mistake:** Returning a byte array with `File()` for large PDFs  
**Correct:** Use `FileStreamResult` with a MemoryStream to avoid memory overhead  
**Why it matters:** Large PDFs loaded entirely into `byte[]` waste memory; streams are more efficient.

### Trap 6: SetCloseStream(false) for iText PDFs
**Mistake:** Creating `PdfWriter(ms)` without `writer.SetCloseStream(false)`  
**Correct:** Always call `writer.SetCloseStream(false)` to keep the MemoryStream open after document close  
**Why it matters:** Without it, the stream is closed prematurely and cannot be returned to the client.

### Trap 7: MemoryStream position must be reset to 0
**Mistake:** Passing MemoryStream to FileStreamResult without resetting position  
**Correct:** Call `ms.Position = 0;` before returning FileStreamResult  
**Why it matters:** If position is at the end, the client receives an empty file.

---

## 8. Practice MCQ (2-3 Questions)

### Question 1: Package Selection
**Which of the following is the CORRECT combination of packages to export Excel and PDF in a Razor Pages app?**

A) ClosedXML + itext7 (only)  
B) ClosedXML + itext7 + itext.bouncy-castle-adapter  
C) EPPlus + itext.bouncy-castle-adapter  
D) ClosedXML + PDFSharp + itext.bouncy-castle-adapter  

**Answer:** B  
**Explanation:** ClosedXML for Excel, and BOTH itext7 and itext.bouncy-castle-adapter (they are a required pair) for PDF. EPPlus is an alternative to ClosedXML but not used in the course. PDFSharp is an alternative to iText but not used in the course.

---

### Question 2: MIME Type and Return Type
**You are exporting a 500MB dataset as a PDF. Which return type and MIME type combination is BEST?**

A) `FileResult` with `"application/pdf"`  
B) `FileStreamResult` with `"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"`  
C) `FileStreamResult` with `"application/pdf"`  
D) `FileResult` with `"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"`  

**Answer:** C  
**Explanation:** FileStreamResult is more memory-efficient for large files (streams vs byte arrays). `"application/pdf"` is the correct MIME type for PDF. Option B is wrong because the MIME type is for Excel. Option D is inefficient (FileResult for large files) and wrong MIME type combo.

---

### Question 3: ClosedXML Cell Access
**What is the correct way to set the value in the top-left cell of a ClosedXML worksheet?**

A) `worksheet.Cell("A0").Value = "Header";`  
B) `worksheet.Cell(0, 0).Value = "Header";`  
C) `worksheet.Cell(1, 1).Value = "Header";`  
D) `worksheet[1, 1] = "Header";`  

**Answer:** C  
**Explanation:** ClosedXML uses 1-based row and column indexing. Row 1, Column 1 is the top-left cell. Options A (uses column letter notation, which is valid but "A0" is row 0, which is invalid), B (0-based), and D (array notation not supported) are all wrong.

---

## Summary Table: Quick Exam Reference

| Topic | Answer | Source |
|-------|--------|--------|
| Excel package | ClosedXML 0.105.0 | FifaWorldCup.csproj |
| PDF packages | itext7 9.6.0 + itext.bouncy-castle-adapter 9.6.0 | FifaWorldCup.csproj |
| Excel MIME | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | Excel.cshtml.cs |
| PDF MIME | application/pdf | PdfReport.cshtml.cs |
| Excel return | FileResult via File(bytes, mimeType, fileName) | Excel.cshtml.cs line 54 |
| PDF return | FileStreamResult with FileDownloadName | PdfReport.cshtml.cs lines 60-63 |
| Chart library | Chart.js 3.9.1 (CDN) | Index.cshtml line 17 |
| Chart type | 'pie' (also 'bar', 'line', 'doughnut') | Index.cshtml line 75 |
| Cell indexing | 1-based: Cell(row, col) | Excel.cshtml.cs line 18 |
| PDF page numbers | ShowTextAligned at (559, 806) | PdfReport.cshtml.cs lines 49-52 |

