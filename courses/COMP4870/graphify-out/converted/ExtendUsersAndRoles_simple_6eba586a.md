<!-- converted from ExtendUsersAndRoles_simple.docx -->

## Extend Identity Users and Roles in ASP.NET
In this tutorial, we will learn how to add more data fields to the standard ASP.NET users & roles database. To proceed with this tutorial, you need the following:
VS Code
You have installed .NET 7.0
You have installed the dotnet-ef tool
You have installed the dotnet-aspnet-codegenerator tool
Getting Started
Create a new razor pages application with the following terminal window command:
dotnet new razor --auth individual -o XtendUsersRoles
Open the application folder in VS Code.
Suppose we want to capture more data about the user, in addition to email and password. Let us assume we want to extend user data with FirstName & LastName.
An easy way to do this is to create a new class that extends IdentityUser and adds the above properties. Create a Models folder and add a new class named XUser to it with the following class code:
public class XUser : IdentityUser {
public XUser() : base() { }

public string? FirstName { get; set; }
public string? LastName { get; set; }
}
We may also wish to extend the standard roles table with a CreatedDate property.
Just as we did with users, we will also create another class for roles that inherits from IdentityRole. In the Models folder, create another class named XRole and add to it the following code:
public class XRole: IdentityRole {

public XRole() : base() { }

public XRole(string roleName) : base(roleName) { }

public XRole(string roleName, DateTime createdDate) : base(roleName) {
base.Name = roleName;

this.CreatedDate = createdDate;
}

public DateTime CreatedDate { get; set; }
}
Add the following to Pages/ _ViewImports.cshtml:
@using XtendUsersRoles.Models
Edit Data/ApplicationDbContext.cs file and make ApplicationDbContext  inherit from IdentityDbContext<XUser, XRole, string>. The ApplicationDbContext class code should look like this:
public class ApplicationDbContext : IdentityDbContext<XUser, XRole, string> {
public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
: base(options) { }
}
Add Data/ModelBuilderExtension.cs with the following code:
public static class ModelBuilderExtensions {
public static void Seed(this ModelBuilder builder) {
var pwd = "P@$$w0rd";
var passwordHasher = new PasswordHasher<XUser>();

// Seed Roles
var adminRole = new XRole() {
Name = "Admin",
CreatedDate = DateTime.Now
};
adminRole.NormalizedName = adminRole.Name.ToUpper();

var memberRole = new XRole() {
Name = "Member",
CreatedDate = DateTime.Now
};
memberRole.NormalizedName = memberRole.Name.ToUpper();

List<XRole> roles = new List<XRole>() {
adminRole,
memberRole
};

builder.Entity<XRole>().HasData(roles);


// Seed Users
var adminUser = new XUser {
UserName = "aa@aa.aa",
Email = "aa@aa.aa",
EmailConfirmed = true,
FirstName = "Adam",
LastName = "Atkins"
};
adminUser.NormalizedUserName = adminUser.UserName.ToUpper();
adminUser.NormalizedEmail = adminUser.Email.ToUpper();
adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, pwd);

var memberUser = new XUser {
UserName = "mm@mm.mm",
Email = "mm@mm.mm",
EmailConfirmed = true,
FirstName = "Mike",
LastName = "Moore"
};
memberUser.NormalizedUserName = memberUser.UserName.ToUpper();
memberUser.NormalizedEmail = memberUser.Email.ToUpper();
memberUser.PasswordHash = passwordHasher.HashPassword(memberUser, pwd);

List<XUser> users = new List<XUser>() {
adminUser,
memberUser,
};

builder.Entity<XUser>().HasData(users);

// Seed UserRoles
List<IdentityUserRole<string>> userRoles = new List<IdentityUserRole<string>>();

userRoles.Add(new IdentityUserRole<string> {
UserId = users[0].Id,
RoleId = roles.First(q => q.Name == "Admin").Id
});

userRoles.Add(new IdentityUserRole<string> {
UserId = users[1].Id,
RoleId = roles.First(q => q.Name == "Member").Id
});


builder.Entity<IdentityUserRole<string>>().HasData(userRoles);
}
}
Add the following OnModelCreating() method to ApplicationDbContext.cs:
protected override void OnModelCreating(ModelBuilder builder) {
base.OnModelCreating(builder);

// Use seed method here
builder.Seed();
}
In the Program.cs class, replace the builder.Services.AddDefaultIdentity. . .  statement with this:
builder.Services.AddIdentity<XUser, XRole>(
options => {
options.Stores.MaxLengthForKeys = 128;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultUI()
.AddDefaultTokenProviders()
.AddRoles<XRole>();
Edit Pages/Shared/_LoginPartial.cshtml and change:
@inject SignInManager<IdentityUser> SignInManager
@inject UserManager<IdentityUser> UserManager

TO

@inject SignInManager<XUser> SignInManager
@inject UserManager<XUser> UserManager
Let us start with a clean database and migration. Therefore, delete app.db and the Data/Migrations folder.
Then, execute the following commands from within a terminal window in the root folder of the application:
dotnet ef migrations add M1 -o Data/Migrations
dotnet ef database update
At this stage, all the database tables are created and seeded. Let us run our application.

To prove that user and role data are successfully seeded, login with one of the below credentials that were previously seeded:
Email: aa@aa.aa    Password: P@$$w0rd
Email: mm@mm.mm    Password: P@$$w0rd
The next task we need to accomplish is to modify the registration page so that the application can capture extended data such as FirstName & LastName. ASP.NET provides ASP.NET Core Identity as a Razor Class Library. This means that the registration UI is baked into the assemblies and is surfaced with the .AddDefaultUI() option with the services.AddIdentity() command in Program.cs.
We need to add some additional packages so that we can scaffold the view for account registration. From within a terminal window at the root of your application, run the following commands:
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

If you do not already have the .NET code-generation (scaffolding) tool, execute the following command from within a terminal window:
dotnet tool install -g dotnet-aspnet-codegenerator
Here are some useful commands pertaining to the code-generation (scaffolding) tool:
Since we need to modify the registration controller and view, we instruct the scaffolder to surface the code used for registration. To do this, we will scaffold three pages that pertain to account registration and login. Run the following command from within a terminal window:
dotnet aspnet-codegenerator identity --files "Account.Register;Account.Login;Account.RegisterConfirmation" -dc ApplicationDbContext
The above command generates a handful of razor view pages under folder Areas/Identity/Pages/Account.

Edit the code-behind file Areas/Identity/Pages/Account/Register.cshtml.cs.
Add the following properties to the InputModel class:
[Required]
[DataType(DataType.Text)]
[StringLength(50, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 2)]
[Display(Name ="First Name")]
public string FirstName { get; set; }

[Required]
[DataType(DataType.Text)]
[StringLength(50, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 2)]
[Display(Name = "Last Name")]
public string LastName { get; set; }

In the same file, edit the code in the OnPostAsync() method so that line:
var user = CreateUser();
is changed to:
var user = new XUser {
UserName = Input.Email,
Email = Input.Email,
FirstName = Input.FirstName,
LastName = Input.LastName
};
Next, let us update the UI. Edit razor page Areas\Identity\Pages\Account\Register.cshtml. Add the following markup to the form right before the email/username block:
<div class="form-floating">
<input asp-for="Input.FirstName" class="form-control" autocomplete="firstname" aria-required="true"/>
<label asp-for="Input.FirstName"></label>
<span asp-validation-for="Input.FirstName" class="text-danger"></span>
</div>
<div class="form-floating">
<input asp-for="Input.LastName" class="form-control" autocomplete="lastname" aria-required="true"/>
<label asp-for="Input.LastName"></label>
<span asp-validation-for="Input.LastName" class="text-danger"></span>
</div>

The code generator added some unnecessary code to Program.cs around line 14. Find the following code in Program.cs and comment it out or delete it:
builder.Services.AddDefaultIdentity<XUser>(
options => options.SignIn.RequireConfirmedAccount = true
).AddEntityFrameworkStores<ApplicationDbContext>();
Run the web application and click on the Register button on the top-right side.

When you click on Register, all user data will be saved in the database.


We have succeeded in updating the registration page so that additional user data is stored. Thanks for coming this far in this tutorial.

| Help with the tool | dotnet aspnet-codegenerator identity -h |
| --- | --- |
| List all the views that can be scaffolded | dotnet aspnet-codegenerator identity --listFiles |
| Scaffold three views | dotnet aspnet-codegenerator identity --files "Account.Register;Account.Login;Account.RegisterConfirmation" |
| Expose all files | dotnet aspnet-codegenerator identity |