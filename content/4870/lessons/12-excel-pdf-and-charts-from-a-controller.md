---
"n": 12
id: 4870-lesson-excel-pdf-and-charts-from-a-controller
title: Excel, PDF, and charts from a controller
hook: Generate a byte array, wrap in File(...), return. The MIME type is the only thing you have to remember.
tags:
  - excel
  - pdf
  - chart
module: Export
---

Excel/PDF/Chart (2 marks) is almost entirely package-name and MIME-type recall. The pattern is identical across all three formats: build the bytes, return `File(bytes, mimeType, fileName)`.

<svg viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrEX" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Three export pipelines — same File() shape, different builders</text><rect x="20" y="40" width="500" height="20" class="box-warn" rx="3"></rect><text x="270" y="55" text-anchor="middle" class="sub">SERVER-SIDE — controller builds bytes, returns File()</text><rect x="540" y="40" width="200" height="20" class="box-ok" rx="3"></rect><text x="640" y="55" text-anchor="middle" class="sub">CLIENT-SIDE</text><text x="40" y="90" class="label">Excel</text><rect x="40" y="100" width="140" height="36" class="box" rx="3"></rect><text x="110" y="120" text-anchor="middle" class="sub">new XLWorkbook</text><text x="110" y="132" text-anchor="middle" class="sub">ws.Cell(r,c).Value</text><path d="M180 118 L210 118" class="arrow-line" marker-end="url(#arrEX)"></path><rect x="210" y="100" width="120" height="36" class="box-accent" rx="3"></rect><text x="270" y="120" text-anchor="middle" class="sub">wb.SaveAs(ms)</text><text x="270" y="132" text-anchor="middle" class="sub">→ MemoryStream</text><path d="M330 118 L360 118" class="arrow-line" marker-end="url(#arrEX)"></path><rect x="360" y="100" width="160" height="36" class="box-ok" rx="3"></rect><text x="440" y="116" text-anchor="middle" class="sub">return File(bytes,</text><text x="440" y="130" text-anchor="middle" class="sub">openxml.spreadsheet, .xlsx)</text><text x="40" y="180" class="label">PDF</text><rect x="40" y="190" width="140" height="36" class="box" rx="3"></rect><text x="110" y="210" text-anchor="middle" class="sub">PdfWriter(ms)</text><text x="110" y="222" text-anchor="middle" class="sub">PdfDocument · doc.Add</text><path d="M180 208 L210 208" class="arrow-line" marker-end="url(#arrEX)"></path><rect x="210" y="190" width="120" height="36" class="box-accent" rx="3"></rect><text x="270" y="210" text-anchor="middle" class="sub">doc.Close()</text><text x="270" y="222" text-anchor="middle" class="sub">→ MemoryStream</text><path d="M330 208 L360 208" class="arrow-line" marker-end="url(#arrEX)"></path><rect x="360" y="190" width="160" height="36" class="box-ok" rx="3"></rect><text x="440" y="206" text-anchor="middle" class="sub">return File(bytes,</text><text x="440" y="220" text-anchor="middle" class="sub">application/pdf, .pdf)</text><text x="40" y="270" class="label">Charts</text><rect x="540" y="100" width="180" height="60" class="box" rx="3"></rect><text x="630" y="124" text-anchor="middle" class="sub">controller returns JSON</text><text x="630" y="140" text-anchor="middle" class="sub">data only</text><path d="M540 130 L520 130" class="arrow-line" marker-end="url(#arrEX)"></path><rect x="540" y="180" width="180" height="80" class="box-warn" rx="3"></rect><text x="630" y="204" text-anchor="middle" class="label">Browser</text><text x="630" y="222" text-anchor="middle" class="sub">Chart.js (CDN script)</text><text x="630" y="238" text-anchor="middle" class="sub">renders &lt;canvas&gt;</text><text x="630" y="254" text-anchor="middle" class="sub">on the client</text><path d="M630 160 L630 180" class="arrow-line" marker-end="url(#arrEX)"></path><rect x="40" y="285" width="680" height="55" class="box" rx="4"></rect><text x="380" y="306" text-anchor="middle" class="label-accent">Take-home</text><text x="380" y="324" text-anchor="middle" class="sub">Excel + PDF: server builds bytes, return File(bytes, MIME, name). Charts: server sends JSON, client renders.</text></svg>

#### Excel — ClosedXML

```cs
using ClosedXML.Excel;

using var wb = new XLWorkbook();
var ws = wb.Worksheets.Add("Sales");
ws.Cell(1, 1).Value = "Product";
ws.Cell(1, 2).Value = "Units";
// ...fill rows...

using var ms = new MemoryStream();
wb.SaveAs(ms);
return File(ms.ToArray(),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "sales.xlsx");
```

#### PDF — itext7

```cs
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

using var ms = new MemoryStream();
var writer = new PdfWriter(ms);
var pdf    = new PdfDocument(writer);
var doc    = new Document(pdf);
doc.Add(new Paragraph("Hello PDF"));
doc.Close();
return File(ms.ToArray(), "application/pdf", "report.pdf");
```

*Why TWO packages for PDF:* `itext7` ships the rendering engine; `itext.bouncy-castle-adapter` provides the cryptographic backend itext relies on for PDF encryption/signing. Installing only `itext7` throws at runtime when iText tries to resolve its crypto provider. Always install BOTH together.

#### Charts — Chart.js via CDN

Charts are client-side: include Chart.js from a CDN in a Razor view, supply a `<canvas>` + JS config. The server never renders the chart — it just sends the data as JSON.

> **Q:** **Checkpoint —** Your controller returns `File(bytes, "application/vnd.ms-excel", "report.xlsx")`. Users complain Excel warns the file is corrupt. What's wrong and what's the fix?
> **A:** `application/vnd.ms-excel` is the LEGACY .xls MIME. Modern .xlsx (Open XML format) needs `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`. Swap the MIME string and the warning disappears.

> **Note**
> **Takeaway —** Excel = ClosedXML (XLWorkbook). PDF = itext7 + bouncy-castle-adapter. Charts = Chart.js CDN. Always `File(bytes, mime, name)`. (Source: Add package for PDF.html, W13 lab)
