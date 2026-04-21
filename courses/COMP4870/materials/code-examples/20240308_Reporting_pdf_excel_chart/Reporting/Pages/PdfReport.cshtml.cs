using iText.Kernel.Colors;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Reporting.Data;
using Reporting.Models;

namespace MyApp.Namespace
{
    public class PdfReportModel : PageModel
    {
        private readonly ILogger<PdfReportModel> _logger;
        private readonly SchoolDbContext _context;

        public PdfReportModel(ILogger<PdfReportModel> logger,
            SchoolDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> OnGet()
        {
            MemoryStream ms = new MemoryStream();

            PdfWriter writer = new PdfWriter(ms);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4, false);
            writer.SetCloseStream(false);

            Paragraph header = new Paragraph("My School Report")
              .SetTextAlignment(TextAlignment.CENTER)
              .SetFontSize(20);

            document.Add(header);

            Paragraph subheader = new Paragraph(DateTime.Now.ToShortDateString())
              .SetTextAlignment(TextAlignment.CENTER)
              .SetFontSize(15);
            document.Add(subheader);

            // empty line
            document.Add(new Paragraph(""));

            // Line separator
            LineSeparator ls = new LineSeparator(new SolidLine());
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
                  559, 806, i, TextAlignment.RIGHT,
                  VerticalAlignment.TOP, 0);
            }

            document.Close();
            byte[] byteInfo = ms.ToArray();
            ms.Write(byteInfo, 0, byteInfo.Length);
            ms.Position = 0;

            FileStreamResult fileStreamResult = new FileStreamResult(ms, "application/pdf");

            //Uncomment this to return the file as a download
            fileStreamResult.FileDownloadName = "StudentsReport.pdf";

            return fileStreamResult;
        }

        private async Task<Table> GetPdfTable()
        {
            // Table
            Table table = new Table(3, false);

            // Headings
            Cell cellStudentId = new Cell(1, 1)
               .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
               .SetTextAlignment(TextAlignment.CENTER)
               .Add(new Paragraph("Student ID"));

            Cell cellName = new Cell(1, 1)
               .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
               .SetTextAlignment(TextAlignment.LEFT)
               .Add(new Paragraph("Name"));

            Cell cellSchool = new Cell(1, 1)
               .SetBackgroundColor(ColorConstants.LIGHT_GRAY)
               .SetTextAlignment(TextAlignment.CENTER)
               .Add(new Paragraph("School"));

            table.AddCell(cellStudentId);
            table.AddCell(cellName);
            table.AddCell(cellSchool);

            Student[] students = await GetStudentsAsync();

            foreach (var item in students)
            {
                Cell cId = new Cell(1, 1)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .Add(new Paragraph(item.StudentId.ToString()));

                Cell cName = new Cell(1, 1)
                    .SetTextAlignment(TextAlignment.LEFT)
                    .Add(new Paragraph($"{item.FirstName} {item.LastName}"));

                Cell cQty = new Cell(1, 1)
                    .SetTextAlignment(TextAlignment.RIGHT)
                    .Add(new Paragraph(item.School));


                table.AddCell(cId);
                table.AddCell(cName);
                table.AddCell(cQty);

            }

            return table;
        }

        private async Task<Student[]> GetStudentsAsync()
        {
            var students = await _context.Students.ToArrayAsync();
            return students!;
        }
    }
}
