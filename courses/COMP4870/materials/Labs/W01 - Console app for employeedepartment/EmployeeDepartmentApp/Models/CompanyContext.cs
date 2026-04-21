using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDepartmentApp.Models;

public partial class CompanyContext : DbContext
{
    public CompanyContext()
    {
    }

    public CompanyContext(DbContextOptions<CompanyContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=company.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("departments");

            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.DepartmentName).HasColumnName("department_name");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.ToTable("employees");

            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.FirstName).HasColumnName("first_name");
            entity.Property(e => e.LastName).HasColumnName("last_name");

            entity.HasOne(d => d.Department).WithMany(p => p.Employees).HasForeignKey(d => d.DepartmentId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
