using System;
using HealthAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthAPI.Data;

public class HealthContext : DbContext
{
    public HealthContext(DbContextOptions options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Ailment>().Property(p => p.Name).HasMaxLength(40);
        builder.Entity<Medication>().Property(p => p.Name).HasMaxLength(40);
        builder.Entity<Patient>().Property(p => p.Name).HasMaxLength(40);

        builder.Entity<Ailment>().ToTable("Ailment");
        builder.Entity<Medication>().ToTable("Medication");
        builder.Entity<Patient>().ToTable("Patient");

        // seed data
        builder.Entity<Patient>().HasData(SampleData.GetPatients());
        builder.Entity<Medication>().HasData(SampleData.GetMedication());
        builder.Entity<Ailment>().HasData(SampleData.GetAilments());
    }

    public DbSet<Ailment>? Ailments { get; set; }
    public DbSet<Medication>? Medications { get; set; }
    public DbSet<Patient>? Patients { get; set; }
}

