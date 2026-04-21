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
using SchoolLibrary.Data;
using System.Text.Json;

namespace ExportData.Pages;

public class Export2PDFModel : PageModel
{
    private readonly ILogger<Export2PDFModel> _logger;
    private readonly SchoolDbContext? _context;

    public Export2PDFModel(ILogger<Export2PDFModel> logger,
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

        // <p>
        Paragraph header = new Paragraph("Student Data")
          .SetTextAlignment(TextAlignment.CENTER)
          .SetFontSize(20);
        document.Add(header);

        var students = await _context!.Students.ToListAsync();
        foreach (var student in students)
        {
            Paragraph studentData = new Paragraph($"First Name: {student.FirstName}, Last Name: {student.LastName}, School: {student.School}")
              .SetTextAlignment(TextAlignment.LEFT)
              .SetFontSize(12);
            document.Add(studentData);
        }

        document.Close();

        return File(ms.ToArray(), "application/pdf", "StudentData.pdf");
    }

}