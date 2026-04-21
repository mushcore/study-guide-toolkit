using Code1stUsersRoles.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Code1stUsersRoles.Data;

public class ApplicationDbContext : IdentityDbContext<XUser, XRole, string>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Use seed method here
        SeedUsersRoles seedUsersRoles = new();
        builder.Entity<XRole>().HasData(seedUsersRoles.Roles);
        builder.Entity<XUser>().HasData(seedUsersRoles.Users);
        builder.Entity<IdentityUserRole<string>>().HasData(seedUsersRoles.UserRoles);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    }
}
