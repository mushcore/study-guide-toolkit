using System;
using Microsoft.AspNetCore.Identity;

namespace Code1stUsersRoles.Models;

public class XRole : IdentityRole
{

    public XRole() : base() { }

    public XRole(string roleName) : base(roleName) { }

    public XRole(string roleName, DateTime createdDate) : base(roleName)
    {
        base.Name = roleName;

        this.CreatedDate = createdDate;
    }

    public DateTime CreatedDate { get; set; }
}

