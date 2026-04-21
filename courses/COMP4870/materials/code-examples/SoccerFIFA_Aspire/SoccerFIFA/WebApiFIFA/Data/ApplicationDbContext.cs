using System.Globalization;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using LibraryFIFA;
namespace WebApiFIFA.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Game> Games => Set<Game>();
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Game>().HasData(GetGames());
        }
        public static IEnumerable<Game> GetGames()
        {
            string[] p = { Directory.GetCurrentDirectory(), "wwwroot", "fifa-world-cup.csv"
};
            var csvFilePath = Path.Combine(p);
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Encoding = Encoding.UTF8,
                PrepareHeaderForMatch = args => args.Header.ToLower(),
            };
            var data = new List<Game>().AsEnumerable();
            using (var reader = new StreamReader(csvFilePath))
            {
                using (var csvReader = new CsvReader(reader, config))
                {
                    data = csvReader.GetRecords<Game>().ToList();
                }
            }
            return data;
        }
    }
}