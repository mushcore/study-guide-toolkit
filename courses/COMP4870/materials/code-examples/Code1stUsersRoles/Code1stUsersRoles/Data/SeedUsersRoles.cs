using System;
using Microsoft.AspNetCore.Identity;

namespace Code1stUsersRoles.Data;

public class SeedUsersRoles
{
  private readonly List<IdentityRole> _roles;
  private readonly List<IdentityUser> _users;
  private readonly List<IdentityUserRole<string>> _userRoles;

  public SeedUsersRoles()
  {
    _roles = GetRoles();
    _users = GetUsers();
    _userRoles = GetUserRoles(_users, _roles);
  }
  public List<IdentityRole> Roles { get { return _roles; } }
  public List<IdentityUser> Users { get { return _users; } }
  public List<IdentityUserRole<string>> UserRoles { get { return _userRoles; } }
  private List<IdentityRole> GetRoles()
  {
    // Seed Roles
    var adminRole = new IdentityRole("Admin")
    {
      Id = "1", // Static ID instead of dynamic GUID
      ConcurrencyStamp = "1"
    };
    adminRole.NormalizedName = adminRole.Name!.ToUpper();
    var memberRole = new IdentityRole("Member")
    {
      Id = "2", // Static ID instead of dynamic GUID
      ConcurrencyStamp = "2"
    };
    memberRole.NormalizedName = memberRole.Name!.ToUpper();
    List<IdentityRole> roles = new List<IdentityRole>() {
          adminRole,
          memberRole
      };
    return roles;
  }
  private List<IdentityUser> GetUsers()
  {
    // Use static password hashes instead of generating them dynamically
    string staticAdminPasswordHash = "AQAAAAIAAYagAAAAEI9TZgKflMc9GWzVfcIMuVAFN61Nx5vPZPz0tcrqTOQM+jlZSk4kDRTfB1JN3fxcEA==";
    string staticMemberPasswordHash = "AQAAAAIAAYagAAAAEE6wjORcwa9D9cfJe7hOVP4CGSdSlCvQFgaFGS8QI9T2FvyHqqGa1Cr21Yn3ZvJBRA==";

    // Seed Users
    var adminUser = new IdentityUser
    {
      Id = "admin-user-id", // Static ID instead of dynamic GUID
      UserName = "aa@aa.aa",
      Email = "aa@aa.aa",
      EmailConfirmed = true,
      SecurityStamp = "admin-security-stamp",
      ConcurrencyStamp = "admin-concurrency-stamp",
      PasswordHash = staticAdminPasswordHash
    };
    adminUser.NormalizedUserName = adminUser.UserName.ToUpper();
    adminUser.NormalizedEmail = adminUser.Email.ToUpper();

    var memberUser = new IdentityUser
    {
      Id = "member-user-id", // Static ID instead of dynamic GUID
      UserName = "mm@mm.mm",
      Email = "mm@mm.mm",
      EmailConfirmed = true,
      SecurityStamp = "member-security-stamp",
      ConcurrencyStamp = "member-concurrency-stamp",
      PasswordHash = staticMemberPasswordHash
    };
    memberUser.NormalizedUserName = memberUser.UserName.ToUpper();
    memberUser.NormalizedEmail = memberUser.Email.ToUpper();

    List<IdentityUser> users = new List<IdentityUser>() {
        adminUser,
        memberUser,
      };
    return users;
  }
  private List<IdentityUserRole<string>> GetUserRoles(List<IdentityUser> users, List<IdentityRole> roles)
  {
    // Seed UserRoles
    List<IdentityUserRole<string>> userRoles = new List<IdentityUserRole<string>>();
    userRoles.Add(new IdentityUserRole<string>
    {
      UserId = "admin-user-id", // Use the same static ID
      RoleId = "1" // Use the same static ID
    });
    userRoles.Add(new IdentityUserRole<string>
    {
      UserId = "member-user-id", // Use the same static ID
      RoleId = "2" // Use the same static ID
    });
    return userRoles;
  }
}
