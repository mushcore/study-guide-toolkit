<!-- converted from aspire_SCRIPT.docx -->

Aspire.NET
dotnet new install Aspire.ProjectTemplates --force
Clone this GitHub repo:
git clone https://github.com/medhatelmasry/SoccerFIFA

Inside the SoccerFIFA folder, create Aspire projects with:

cd SoccerFIFA
dotnet new aspire --force
In a terminal window in SoccerFIFA folder:
dotnet sln add ./BlazorFIFA/BlazorFIFA.csproj
dotnet sln add ./WebApiFIFA/WebApiFIFA.csproj
dotnet sln add ./LibraryFIFA/LibraryFIFA.csproj
Next, we will need to add references in the SoccerFIFA.AppHost to the BlazorFIFA and WebApiFIFA projects with these commands:
dotnet add ./SoccerFIFA.AppHost/SoccerFIFA.AppHost.csproj reference ./BlazorFIFA/BlazorFIFA.csproj
dotnet add ./SoccerFIFA.AppHost/SoccerFIFA.AppHost.csproj reference ./WebApiFIFA/WebApiFIFA.csproj
Also, both BlazorFIFA and WebApiFIFA projects need to have references into SoccerFIFA.ServiceDefaults
dotnet add ./BlazorFIFA/BlazorFIFA.csproj reference ./SoccerFIFA.ServiceDefaults/SoccerFIFA.ServiceDefaults.csproj
dotnet add ./WebApiFIFA/WebApiFIFA.csproj reference ./SoccerFIFA.ServiceDefaults/SoccerFIFA.ServiceDefaults.csproj
Then, in Program.cs of both BlazorFIFA and WebApiFIFA, add this code:
// Add service defaults & Aspire components.
builder.AddServiceDefaults();
In AppHost.cs file in SoccerFIFA.AppHost, add this code right before “builder.Build().Run();”:
var api = builder.AddProject<Projects.WebApiFIFA>("backend");
builder.AddProject<Projects.BlazorFIFA>("frontend")
.WithReference(api)
.WaitFor(api);
Now, the relative name for the API app is the name “backend”. Therefore, we can change the base address to http://backend. Change Constants.cs file in BlazorFIFA to:
public const string ApiBaseUrl = "http://backend/";
Test the application. In the SoccerFIFA.AppHost folder, start the application with:
dotnet watch
NOTE: If you are asked to enter a token, copy and paste it from the value in your terminal window:

Click on the above link or copy and paste it into a browser:

Click on first endpoint:

Click on second endpoint >> All Games:


# Passing environment variables around
To the SoccerFIFA.AppHost project’s appsetttings.json file, add the following setting:
"Company": "ABC Corporation"
Let us pass this along from SoccerFIFA.AppHost project into the WebApiFIFA project. Therefore, in the SoccerFIFA.AppHost project, find the following statement:
var api = builder.AddProject<Projects.WebApiFIFA>("backend");
and add to it this code:
.WithEnvironment("ParentCompany", builder.Configuration["Company"])
The final statement would look like this:
var api = builder.AddProject<Projects.WebApiFIFA>("backend")
.WithEnvironment("ParentCompany", builder.Configuration["Company"]);
Restart the application in the SoccerFIFA.AppHost project. Inspect environment variables for the WebApiFIFA project. You will find the key ‘ParentCompany’ and its value.


# Using SQL-Server with custom connection string
Replacing SQLite in WebAPI so that it uses SQL Server instead.
Cleanup the backend API project (WebApiFIFA) from all traces of SQLite by doing the following:

- Delete SQLite files college.db, college.db-shm, and college.db-wal.
- In WebApiFIFA.csproj, delete:
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.4" />
- Delete the Data/Migrations folder.
- Delete the ConnectionStrings section in appsettings.json
Suppose we want to connect to our own in-house database? Start a database in a SQL-Server container with:

docker run --cap-add SYS_PTRACE -e ACCEPT_EULA=1 -e MSSQL_SA_PASSWORD=SqlPassword! -p 1444:1433 --name azsql -d mcr.microsoft.com/azure-sql-edge
Let us add a connection string for the database in the appsettings.json file belonging to the SoccerFIFA.AppHost project as follows:
"ConnectionStrings": {
"DefaultConnection": "Server= localhost,1444;Database=FIFADB;UID=sa;PWD=SqlPassword!;TrustServerCertificate=True;"
}
Add this code in Program.cs in the SoccerFIFA.AppHost project above ‘var api = ….’:
var connstr = builder.AddConnectionString("DefaultConnection");
Also, in the same Program.cs file, attach this to the ‘var api = ….’ Statement:
.WithReference(connstr)
Add the following package to the WebApiFIFA project:
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
In the Program.cs in the WebApiFIFA project, change UseSqlite to:
UseSqlServer
We need to create new migrations that target SQL Server. Therefore, run this command in the WebApiFIFA project’s terminal window:
dotnet ef migrations add M1 -o Data/Migrations
To automatically apply migrations to the SQL Server database, add this to Program.cs belonging to WebApiFIFA right before app.Run():
using (var scope = app.Services.CreateScope()) {
var services = scope.ServiceProvider;

var context = services.GetRequiredService<ApplicationDbContext>();
context.Database.Migrate();
}
Run the application from SoccerFIFA.AppHost. It should work with your custom database, in this care represented by a database listening on port 1444.

# Let Aspire take care of connection strings
Add this package to WebApiFIFA:
dotnet add package Aspire.Microsoft.EntityFrameworkCore.SqlServer
In WebApiFIFA project Program.cs file, comment out this code:
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(connectionString));
Add this code right before builder.AddServiceDefaults():
builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");
## Configure the AppHost
The SoccerFIFA.AppHost project is the orchestrator for your app. It's responsible for connecting and configuring the different projects and services of your app. Add the .NET Aspire Entity Framework Core Sql Server library package to your AspireStorage.AppHost project:
dotnet add package Aspire.Hosting.SqlServer
Delete the appsettings.json connection string in the SoccerFIFA.AppHost project.
"ConnectionStrings": {
"DefaultConnection": "Server= localhost,1444;Database=FIFADB;UID=sa;PWD=SqlPassword!;TrustServerCertificate=True;"
}
Comment out (or delete) this line of code in Program.cs in the AspireStorage.AppHost:
var connstr = builder.AddConnectionString("DefaultConnection");
Replace the above code with:
var sqlServerDb = builder.AddSqlServer("sql")
.AddDatabase("sqldata");


Change .WithReference(connstr) to:
.WithReference(sqlServerDb)
The preceding code adds a SQL Server Container resource to your app and configures a connection to a database called sqldata. The Entity Framework classes you configured earlier will automatically use this connection when migrating and connecting to the database.
# Run application
Run the application inside the SoccerFIFA.AppHost folder with:
dotnet watch
