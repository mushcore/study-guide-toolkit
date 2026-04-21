using FifaWorldCup.Models;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Element;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FifaWorldCup.Pages;

public class PdfReportModel : PageModel
{
    public async Task<IActionResult> OnGet()
    {
        MemoryStream ms = new MemoryStream();

        PdfWriter writer = new PdfWriter(ms);
        PdfDocument pdfDoc = new PdfDocument(writer);
        iText.Layout.Document document = new iText.Layout.Document(pdfDoc, iText.Kernel.Geom.PageSize.A4, false);
        writer.SetCloseStream(false);

        iText.Layout.Element.Paragraph header = new iText.Layout.Element.Paragraph("FIFA World Cup Report")
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
        fileStreamResult.FileDownloadName = "FifaWorldCup.pdf";

        return fileStreamResult;
    }

    private async Task<Table> GetPdfTable()
    {
        // Table
        Table table = new Table(7, false);

        // Headings
        Cell cellGameId = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
           .Add(new Paragraph("Game Id"));

        Cell cellYear = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
           .Add(new Paragraph("Year"));

        Cell cellGender = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
           .Add(new Paragraph("Gender"));

        Cell cellCity = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
           .Add(new Paragraph("City"));

        Cell cellCountry = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
           .Add(new Paragraph("Country"));

        Cell cellContinent = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
           .Add(new Paragraph("Continent"));

        Cell cellWinner = new Cell(1, 1)
           .SetBackgroundColor(iText.Kernel.Colors.ColorConstants.LIGHT_GRAY)
           .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
           .Add(new Paragraph("Winner"));

        table.AddCell(cellGameId);
        table.AddCell(cellYear);
        table.AddCell(cellGender);
        table.AddCell(cellCity);
        table.AddCell(cellCountry);
        table.AddCell(cellContinent);
        table.AddCell(cellWinner);

        Game[] games = Game.GetGames().ToArray();

        foreach (var item in games)
        {
            Cell cId = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                .Add(new Paragraph(item.GameId.ToString()));

            Cell cYear = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                .Add(new Paragraph(item.Year.ToString()));

            Cell cGender = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                .Add(new Paragraph(item.Gender));

            Cell cCity = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
                .Add(new Paragraph(item.City));

            Cell cCountry = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
                .Add(new Paragraph(item.Country));

            Cell cContinent = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
                .Add(new Paragraph(item.Continent));

            Cell cWinner = new Cell(1, 1)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT)
                .Add(new Paragraph(item.Winner));

            table.AddCell(cId);
            table.AddCell(cYear);
            table.AddCell(cGender);
            table.AddCell(cCity);
            table.AddCell(cCountry);
            table.AddCell(cContinent);
            table.AddCell(cWinner);
        }

        return table;
    }

}
