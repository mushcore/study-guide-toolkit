using ExcelStar.Models;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Element;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ExcelStar.Pages;

public class PdfReportModel : PageModel
{
    public async Task<IActionResult> OnGet()
    {
        MemoryStream ms = new MemoryStream();

        PdfWriter writer = new PdfWriter(ms);
        PdfDocument pdfDoc = new PdfDocument(writer);
        iText.Layout.Document document = new iText.Layout.Document(pdfDoc, iText.Kernel.Geom.PageSize.A4, false);
        writer.SetCloseStream(false);

        iText.Layout.Element.Paragraph header = new iText.Layout.Element.Paragraph("BCIT Students Report")
          .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
          .SetFontSize(20);

        document.Add(header);

        iText.Layout.Element.Paragraph subheader = new iText.Layout.Element.Paragraph(DateTime.Now.ToShortDateString())
          .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
          .SetFontSize(15);
        document.Add(subheader);

        // empty line
        document.Add(new Paragraph(""));

        // Line separator
        iText.Layout.Element.LineSeparator ls = new iText.Layout.Element.LineSeparator(new SolidLine());
        document.Add(ls);

        // empty line
        document.Add(new Paragraph(""));

        // Add table containing data
        document.Add(await GetPdfTable());

        // Page Numbers
        int n = pdfDoc.GetNumberOfPages();
        for (int i = 1; i <= n; i++)
        {
            document.ShowTextAligned(new Paragraph(String
              .Format("Page " + i + " of " + n)),
              559, 806, i, iText.Layout.Properties.TextAlignment.RIGHT,
              iText.Layout.Properties.VerticalAlignment.TOP, 0);
        }

        document.Close();
        byte[] byteInfo = ms.ToArray();
        ms.Write(byteInfo, 0, byteInfo.Length);
        ms.Position = 0;

        FileStreamResult fileStreamResult = new FileStreamResult(ms, "application/pdf");

        //Uncomment this to return the file as a download
        fileStreamResult.FileDownloadName = "BCIT-Students.pdf";

        return fileStreamResult;
    }

    private async Task<Table> GetPdfTable()
    {
        // Table
        Table table = new Table(4, false);

        // Headings
        Cell cellProductId = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
           .Add(new Paragraph("Student ID"));

        Cell cellProductName = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
           .Add(new Paragraph("First Name"));

        Cell cellQuantity = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
           .Add(new Paragraph("Last Name"));

        Cell cellUnitPrice = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
           .Add(new Paragraph("School"));

        table.AddCell(cellProductId);
        table.AddCell(cellProductName);
        table.AddCell(cellQuantity);
        table.AddCell(cellUnitPrice);

        Student[] students = Student.GetStudents().ToArray();

        foreach (var item in students)
        {
            Cell cId = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                .Add(new Paragraph(item.Id.ToString()));

            Cell cName = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
                .Add(new Paragraph(item.FirstName));

            Cell cQty = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT)
                .Add(new Paragraph(item.LastName));

            Cell cPrice = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT)
                .Add(new Paragraph(item.School));

            table.AddCell(cId);
            table.AddCell(cName);
            table.AddCell(cQty);
            table.AddCell(cPrice);
        }

        return table;
    }

}

