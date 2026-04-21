# W13 Excel, PDF, Chart Cocktail - Lab Solution

## How This Solution Completes the Lab

This solution is a **Razor Pages app** that loads the FIFA World Cup dataset from the provided gist and, in the same app, lets the user:

1. **Download the data as an Excel (.xlsx) file** using **ClosedXML**.
2. **Download the data as a PDF** using **iText 7**.
3. **Render a pie chart** of games played by continent using **Chart.js** -- exactly as required by the lab.

The implementation follows the **same patterns** demonstrated in the Week 13 lecture example `20260407_ExcelPDF/ExcelPDF/` (ClosedXML for Excel, iText 7 for PDF, Chart.js from CDN for charts).

### What Was Built

#### 1. `FifaWorldCup.csproj`
- `net10.0` Razor Pages project with the three lecture packages pinned to the same versions:
  - `ClosedXML 0.105.0`
  - `itext7 9.6.0`
  - `itext.bouncy-castle-adapter 9.6.0`

#### 2. `Models/Game.cs`
- `Game` class with the 7 fields from the gist: `GameId`, `Year`, `Gender`, `City`, `Country`, `Continent`, `Winner`.
- Static `GetGames()` method seeding all **33 tournaments** (1930--2027) from the provided gist URL. This mirrors the lecture's `Student.GetStudents()` pattern so there is no database and no external HTTP call at request time -- the app is self-contained.

#### 3. `Models/ContinentCount.cs`
- Tiny view model (`Name`, `Count`) used by the pie chart, same pattern as the lecture's `SchoolCount.cs`.

#### 4. `Pages/Excel.cshtml` + `Excel.cshtml.cs` (Excel download)
- `OnGet()` returns a `FileResult`.
- Creates an `XLWorkbook`, adds a `Games` worksheet, writes 7 bold-ish header cells with an `Almond` background fill (same color used in the lecture), then loops through `Game.GetGames()` to fill rows.
- Saves the workbook to a `MemoryStream` and returns it as `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` with filename `FifaWorldCup_{yyyyMMdd}.xlsx`.

#### 5. `Pages/PdfReport.cshtml` + `PdfReport.cshtml.cs` (PDF download)
- Follows the exact iText 7 pattern from the lecture's `PdfReport.cshtml.cs`:
  - `PdfWriter` -> `PdfDocument` -> `iText.Layout.Document` on A4.
  - Centered header (`"FIFA World Cup Report"`, font size 20), centered date subheader (font size 15), `SolidLine` separator.
  - `GetPdfTable()` builds a 7-column `Table` with light-gray header cells (Game Id, Year, Gender, City, Country, Continent, Winner) and one row per game.
  - Page numbering via `document.ShowTextAligned(...)` in the top-right corner.
- Returns a `FileStreamResult` with `FileDownloadName = "FifaWorldCup.pdf"` so the browser downloads it.

#### 6. `Pages/Index.cshtml` + `Index.cshtml.cs` (pie chart)
- `OnGet()` groups `Game.GetGames()` by `Continent`, projects to `ContinentCount`, and orders descending by count. Same LINQ shape as the lecture's `IndexModel`, but keyed on `Continent` instead of `School`.
- The Razor view loads `chart.js@3.9.1` from jsDelivr (same CDN URL the lecture uses) and mixes Razor + JavaScript to `push` counts and continent names into two arrays. It then creates a `new Chart(..., { type: 'pie', data, options })`.
- The lab explicitly asked for a **pie chart**, so `type: 'pie'` is used (the lecture's `ChartPage.cshtml` shows the same `pieChartOptions` shape with a `doughnut` variant -- switching to `pie` is the only change).

#### 7. Layout and scaffolding
- `Pages/Shared/_Layout.cshtml` with a navbar containing `Home`, `Export to Excel`, and `FIFA World Cup PDF` links -- the same navbar structure the lecture example uses.
- Standard `_ViewImports.cshtml`, `_ViewStart.cshtml`, `Error.cshtml`, `wwwroot/css/site.css`, `wwwroot/js/site.js`, `Properties/launchSettings.json`, `appsettings.json`, and `libman.json` matching the lecture template.

### Key Patterns Used (from W13 Lectures)

| Concept | Implementation |
|---------|---------------|
| Excel generation | `using var workbook = new XLWorkbook(); workbook.Worksheets.Add(...); workbook.SaveAs(stream)` (ClosedXML) |
| Excel header styling | `IXLRange.Style.Fill.SetBackgroundColor(XLColor.Almond)` |
| Excel download | `return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename)` |
| PDF generation | `PdfWriter` -> `PdfDocument` -> `iText.Layout.Document` on A4 |
| PDF table | `new Table(n, false)`, `Cell.SetBackgroundColor(ColorConstants.LIGHT_GRAY).Add(new Paragraph(...))` |
| PDF page numbers | `document.ShowTextAligned(new Paragraph("Page i of n"), 559, 806, i, RIGHT, TOP, 0)` |
| PDF download | `new FileStreamResult(ms, "application/pdf") { FileDownloadName = "..." }` |
| Chart.js from CDN | `<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>` |
| Razor -> JS data injection | `@:Count.push(@item.Count); @:Continents.push('@item.Name');` inside a `@foreach` |
| Group-by for chart data | `.GroupBy(_ => _.Continent).Select(g => new { Name = g.Key, Count = g.Count() }).OrderByDescending(...)` |

### Dataset Summary (from the gist)

| Continent | Games | Notes |
|-----------|-------|-------|
| Europe | 14 | Most-hosted continent |
| South America | 7 | Incl. 2014 Brazil, 2027 (W) Brazil |
| North America | 7 | Incl. 2026 Canada/Mexico/USA |
| Asia | 3 | 2002 Korea/Japan, 2007 China (W), 2022 Qatar |
| Africa | 1 | 2010 South Africa |
| Oceania | 1 | 2023 Australia (W) |
| **Total** | **33** | 1930--2027 (Men + Women) |

---

## How to Run / Test

### Prerequisites

- .NET 10 SDK

### Steps

1. Open a terminal in the lab folder:

   ```bash
   cd "materials/labs/w13/FifaWorldCup"
   ```

2. Run the app:

   ```bash
   dotnet run
   ```

3. Open the URL shown in the console (default: `http://localhost:5123` / `https://localhost:7121`).

### Testing the Three Features

1. **Pie chart (Home)** -- The landing page shows a pie chart titled *"Games played by continent"* with six slices:
   - Europe (14), South America (7), North America (7), Asia (3), Africa (1), Oceania (1).
   - Hover over a slice to see the continent name and count.

2. **Export to Excel** -- Click **"Export to Excel"** in the navbar. The browser downloads `FifaWorldCup_YYYYMMDD.xlsx`. Open it:
   - Sheet name: `Games`.
   - Row 1 is the header row (Game Id, Year, Gender, City, Country, Continent, Winner) filled in Almond.
   - Rows 2--34 contain all 33 World Cup tournaments.

3. **FIFA World Cup PDF** -- Click **"FIFA World Cup PDF"** in the navbar. The browser downloads `FifaWorldCup.pdf`. Open it:
   - A4, centered title *"FIFA World Cup Report"*, today's date, separator line.
   - 7-column table with light-gray header cells and all 33 tournaments.
   - *"Page i of n"* in the top-right corner of each page.

### Build Verification

```bash
cd "materials/labs/w13/FifaWorldCup"
dotnet build
```

The project builds with **0 warnings, 0 errors** on .NET 10.

### Solution Structure

```
FifaWorldCup/
├── FifaWorldCup.csproj             # net10.0 + ClosedXML + iText 7
├── Program.cs                      # Razor Pages boilerplate
├── appsettings.json
├── appsettings.Development.json
├── libman.json                     # (optional) Chart.js local copy
├── Properties/
│   └── launchSettings.json
├── Models/
│   ├── Game.cs                     # 33 seeded games from the gist
│   └── ContinentCount.cs           # chart view model
├── Pages/
│   ├── _ViewImports.cshtml
│   ├── _ViewStart.cshtml
│   ├── Index.cshtml                # pie chart (Chart.js)
│   ├── Index.cshtml.cs             # GroupBy Continent
│   ├── Excel.cshtml
│   ├── Excel.cshtml.cs             # ClosedXML download
│   ├── PdfReport.cshtml
│   ├── PdfReport.cshtml.cs         # iText 7 download
│   ├── Error.cshtml
│   ├── Error.cshtml.cs
│   └── Shared/
│       └── _Layout.cshtml          # navbar: Home / Excel / PDF
└── wwwroot/
    ├── css/site.css
    └── js/site.js
```
