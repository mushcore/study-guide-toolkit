---
id: 4870-topic-excel-pdf-chart-export
title: Excel / PDF / Chart export
pillar: tech
priority: low
chapter: W13
tags:
  - excelpdf
  - excel
  - pdf
  - chart
---

### Excel with ClosedXML

```cs
using ClosedXML.Excel;
using var wb = new XLWorkbook();
var ws = wb.Worksheets.Add("Sheet1");
ws.Cell(1, 1).Value = "Name";
ws.Cell(1, 2).Value = "Score";
ws.Cell(2, 1).Value = "Alice";
ws.Cell(2, 2).Value = 92;

using var ms = new MemoryStream();
wb.SaveAs(ms);
return File(ms.ToArray(),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "report.xlsx");
```

### PDF with iText7

```cs
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

using var ms = new MemoryStream();
var writer = new PdfWriter(ms);
var pdf = new PdfDocument(writer);
var doc = new Document(pdf);
doc.Add(new Paragraph("Hello PDF"));
var table = new Table(2);
table.AddCell("Name"); table.AddCell("Score");
table.AddCell("Alice"); table.AddCell("92");
doc.Add(table);
doc.Close();
return File(ms.ToArray(), "application/pdf", "report.pdf");
```

**Required packages:** `itext7` + `itext.bouncy-castle-adapter`

### Chart.js (client-side in Razor)

```cs
<canvas id="myChart"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  new Chart(document.getElementById('myChart'), {
    type: 'pie',
    data: {
      labels: [@:Html.Raw(string.Join(',', labels.Select(l => $"'{l}'")))],
      datasets: [{ data: [@:Html.Raw(string.Join(',', values))] }]
    }
  });
</script>
```

### MIME types

-   Excel `.xlsx` → `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
-   PDF → `application/pdf`
-   PNG image → `image/png`
