<!-- converted from MVC_DbFirst_VSCode_SCRIPT.docx -->

ASP.NET MVC Code – Database First
# Code Generator
Installing the code generator globally:
dotnet tool install -g dotnet-aspnet-codegenerator
You can then generate artifacts like this:
# Let us start
mkdir AspDb
cd AspDb
dotnet new mvc --auth individual --use-local-db
dotnet-ef dbcontext scaffold "Data Source=max.bcit.ca;Database=Northwind;Persist Security Info=True;User ID=nw;Password=N0rthG@te;" Microsoft.EntityFrameworkCore.SqlServer -c NorthwindContext -o Models/NW
NOTE: On Mac computers, you must replace " with '
In order to automatically generate controllers and views, you need to add this package you your application:
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
The following code will generate the controllers and views for the Categories table in the Northwind database:
dotnet aspnet-codegenerator controller -name CategoriesController -outDir Controllers -m Categories -dc NorthwindContext –udl -scripts




Start VS Code by typing the following in the terminal window:
code .
In appsettings.json, add this to ConnectionStrings block:
"NW": "Data Source=max.bcit.ca;Database=Northwind;Persist Security Info=True;User ID=nw;Password=N0rthG@te;"
Add the following to ConfigureServices() method in Startup.cs:
services.AddDbContext<NorthwindContext>(options => options.UseSqlServer(Configuration.GetConnectionString("NW")));
NOTE: You must resolve the NorthwindContext class. Do this by hitting CTRL + . on the keyboard.
Add “Categories” button to main menu. This is done by adding following to Views/Shared/_Layout.cshtml file to <ul> around line 27:
<li class="nav-item">
<a class="nav-link text-dark" asp-area="" asp-controller="Categories" asp-action="Index">Categories</a>
</li>

dotnet build
dotnet watch run
Go to https://localhost:5001/categories or click on the Categories link on the main menu.
Note that there are two separate database contexts:
Stop the server by typing CTRL + C in the terminal window.
Generate an API for Products with the following command:
dotnet aspnet-codegenerator controller -name ProductsController -outDir Controllers\api -m Products -dc NorthwindContext -actions -api
dotnet build
dotnet watch run
Go to https://localhost:5001/api/products
| Help | dotnet aspnet-codegenerator -h |
| --- | --- |
| Add Controller Help | dotnet aspnet-codegenerator controller -h |
| Add ProcessController | dotnet aspnet-codegenerator controller -name ProcessController -outDir Controllers |
| Add PeopleController with views | dotnet aspnet-codegenerator controller -name PeopleController -outDir Controllers -m Person -dc ApplicationDbContext --useDefaultLayout |
| Add API PeopleController | dotnet aspnet-codegenerator controller -name PeopleController -outDir Controllers\api -m Person -dc ApplicationDbContext -actions -api |
| ApplicationDbContext | Used for user authentication in a local database |
| --- | --- |
| NorthwindContext | Used to access the remote Northwind database |