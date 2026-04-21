using System.Globalization;
using BlazorStudents.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BlazorStudents.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Student> Students => Set<Student>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Student>().HasData(GetStudents());
    }

    private static IEnumerable<Student> GetStudents()
    {
        string[] p = { Directory.GetCurrentDirectory(), "wwwroot", "students.csv" };
        var csvFilePath = Path.Combine(p);

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            PrepareHeaderForMatch = args => args.Header.ToLower(),
        };

        var data = new List<Student>().AsEnumerable();
        using (var reader = new StreamReader(csvFilePath))
        {
            using (var csvReader = new CsvReader(reader, config))
            {
                data = csvReader.GetRecords<Student>().ToList();
            }
        }

        return data;
    }

}
