using CsvHelper.Configuration;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using Microsoft.EntityFrameworkCore;
using SchoolLibrary;
using System.Globalization;

namespace SchoolAPI.Data;

public class SchoolDbContext : DbContext
{
    public DbSet<Student> Students { get; set; }

    public SchoolDbContext(DbContextOptions<SchoolDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var csvFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/students.csv");
        builder.Entity<Student>().HasData(Utils.GetDataFromCsvFile(csvFilePath));
    }

}
