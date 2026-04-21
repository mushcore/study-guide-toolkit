using System;
using Code1stUsersRoles.Models;
using Microsoft.AspNetCore.Identity;

namespace Code1stUsersRoles.Data;

public class SeedUsersRoles
{
    private readonly List<XRole> _roles;
    private readonly List<XUser> _users;
    private readonly List<IdentityUserRole<string>> _userRoles;

    public SeedUsersRoles()
    {
        _roles = GetRoles();
        _users = GetUsers();
        _userRoles = GetUserRoles(_users, _roles);
    }
    public List<XRole> Roles { get { return _roles; } }
    public List<XUser> Users { get { return _users; } }
    public List<IdentityUserRole<string>> UserRoles { get { return _userRoles; } }
    private List<XRole> GetRoles()
    {
        // Seed Roles
        var adminRole = new XRole("Admin");
        adminRole.NormalizedName = adminRole.Name!.ToUpper();
        adminRole.CreatedDate = DateTime.Now.AddYears(-10);

        var memberRole = new XRole("Member");
        memberRole.NormalizedName = memberRole.Name!.ToUpper();
        memberRole.CreatedDate = DateTime.Now.AddYears(-3);

        List<XRole> roles = new List<XRole>() {
            adminRole,
            memberRole
        };
        return roles;
    }
    private List<XUser> GetUsers()
    {
        string pwd = "P@$$w0rd";
        var passwordHasher = new PasswordHasher<XUser>();
        // Seed Users
        var adminUser = new XUser
        {
            UserName = "aa@aa.aa",
            Email = "aa@aa.aa",
            EmailConfirmed = true,
            FirstName = "Adam",
            LastName = "Anderson"
        };
        adminUser.NormalizedUserName = adminUser.UserName.ToUpper();
        adminUser.NormalizedEmail = adminUser.Email.ToUpper();
        adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, pwd);
        var memberUser = new XUser
        {
            UserName = "mm@mm.mm",
            Email = "mm@mm.mm",
            EmailConfirmed = true,
            FirstName = "Mary",
            LastName = "Miller"
        };
        memberUser.NormalizedUserName = memberUser.UserName.ToUpper();
        memberUser.NormalizedEmail = memberUser.Email.ToUpper();
        memberUser.PasswordHash = passwordHasher.HashPassword(memberUser, pwd);
        List<XUser> users = new List<XUser>() {
            adminUser,
            memberUser,
        };
        return users;
    }
    private List<IdentityUserRole<string>> GetUserRoles(List<XUser> users, List<XRole> roles)
    {
        // Seed UserRoles
        List<IdentityUserRole<string>> userRoles = new List<IdentityUserRole<string>>();
        userRoles.Add(new IdentityUserRole<string>
        {
            UserId = users[0].Id,
            RoleId = roles.First(q => q.Name == "Admin").Id
        });
        userRoles.Add(new IdentityUserRole<string>
        {
            UserId = users[1].Id,
            RoleId = roles.First(q => q.Name == "Member").Id
        });
        return userRoles;
    }
}
