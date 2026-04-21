using System;
using Microsoft.AspNetCore.Identity;

namespace Code1stUsersRoles.Models;

public class XUser : IdentityUser
{
    public XUser() : base() {}

    public string? FirstName { get; set; }
    public string? LastName { get; set; }

}
