using Microsoft.EntityFrameworkCore;
using Sports.Models;

namespace Sports.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Seed();
    }
    
    public DbSet<Team>? Teams { get; set; }
    public DbSet<Player>? Players { get; set; }
}