<!-- converted from file-based-apps.docx -->

File-based apps
Simplifying .NET with 'dotnet run file.cs'
https://www.youtube.com/watch?v=KjqePh3naKQ

Notice new “File-based Apps” tab on nuget.org:

# Example 1:
Create a file named HelloDevs.cs, with this code:
Console.WriteLine("Hello Devs");
Then run the code with:
dotnet run HelloDevs.cs
# Example 2: (only on mac or  linux)
#!/usr/bin/env dotnet
var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
The first line allows direct execution of this file on Linux or macOS.
Make the file executable with:
chmod +x HelloDevs.cs
Check that file is executable with:
ls -l HelloDevs.cs
The output looks like this:
-rwxr-xr-x@ 1 medhatelmasry  staff  108 Nov 17 10:48 HelloDevs.cs
Now you can run ex2.cs with simply:
./HelloDevs.cs
You can drop the .cs.
➜  ex1 cp ex2.cs ex2
➜  ex1 ./ex2
Hello, World!
➜  ex1
You can also debug in VS Code.
You can set any MSBuild property with #:property.
For example, get it to run a different framework:
#:property TargetFramework=net9.0

var name = args.Length > 0 ? args[0] : "World";
Console.WriteLine($"Hello, {name}!");
Other option:
#:property LangVersion=preview
## Example 3 - where are the .NET bin and obj folders?
Ex3.cs
Console.WriteLine($"Current directory: {Environment.CurrentDirectory}");
Console.WriteLine(new string('-', 40));
Console.WriteLine($"File path: {AppContext.GetData("EntryPointFilePath")}");
Console.WriteLine(new string('-', 40));
Console.WriteLine($"Base directory: {AppContext.BaseDirectory}");
Output
dotnet ex3.cs
Current directory: /Users/medhatelmasry/Library/CloudStorage/OneDrive-Personal/NETBC/events/2025/11/file-based-apps
----------------------------------------
File path: /Users/medhatelmasry/Library/CloudStorage/OneDrive-Personal/NETBC/events/2025/11/file-based-apps/ex3.cs
----------------------------------------
Base directory: /Users/medhatelmasry/Library/Application Support/dotnet/runfile/ex3-3faf7380d799c76bbc88e4cddcd046da82be3e820364dfb83da6470b19a0cb71/bin/debug/
You can reference a project. Create a class library with:
dotnet new classlib -o MyLibrary
and add to it a Person record. like this:
public record Person {
public string? FirstName { get; set; }
public string? LastName { get; set; }
public string? Email { get; set; }
public DateTime DateOfBirth { get; set; }
}
The project can be referenced with:
#:project ./MyLibrary/MyLibrary.csproj

using MyLibrary;

var person = new Person {
FirstName = "John",
LastName = "Doe",
Email = "john.doe@example.com",
DateOfBirth = new DateTime(1990, 1, 1)
};
Console.WriteLine($"Name: {person.FirstName} {person.LastName}");
Console.WriteLine($"Email: {person.Email}");
Console.WriteLine($"Date of Birth: {person.DateOfBirth.ToShortDateString()}");

Output:
dotnet ex4.cs
Name: John Doe
Email: john.doe@example.com
Date of Birth: 1990-01-01
## File based app using packages
Let’s use package Spectre.Console — it is a popular package that makes console output visually impressive with minimal code. Student data could be displayed in plain text as a beautifully formatted table with colors and borders.
Create a text file named locations.cs and add to it this code:
#:package Spectre.Console@0.49.1

using Spectre.Console;

// create an array with 10 cities: city, country
var cities = new[] {
new { City = "New York", Country = "USA" },
new { City = "London", Country = "UK" },
new { City = "Paris", Country = "France" },
new { City = "Tokyo", Country = "Japan" },
new { City = "Sydney", Country = "Australia" },
new { City = "Berlin", Country = "Germany" },
new { City = "Toronto", Country = "Canada" },
new { City = "Moscow", Country = "Russia" },
};

// list the array using Spectre.Console
var table = new Table();
table.Title = new TableTitle("[bold green]Cities and Countries[/]");
table.Border = TableBorder.Rounded;
table.AddColumn(new TableColumn("[bold]City[/]"));
table.AddColumn(new TableColumn("[bold]Country[/]"));

foreach (var city in cities) {
table.AddRow(city.City, city.Country);
}

AnsiConsole.Write(table);
Run the app with:
dotnet run locations.cs
The output should look like this:
Cities and Countries
╭──────────┬───────────╮
│ City     │ Country   │
├──────────┼───────────┤
│ New York │ USA       │
│ London   │ UK        │
│ Paris    │ France    │
│ Tokyo    │ Japan     │
│ Sydney   │ Australia │
│ Berlin   │ Germany   │
│ Toronto  │ Canada    │
│ Moscow   │ Russia    │
╰──────────┴───────────╯
## File based minimal Web Api
mkdir FileBasedWebApi
cd FileBasedWebApi
echo $null > webapi.appsettings.json
echo $null > webapi.run.json
echo $null > WebApi.cs
code .
Content of webapi.appsettings.json (like appsettings.json):
{
"Logging": {
"LogLevel": {
"Default": "Information",
"Microsoft.AspNetCore": "Warning"
}
},
"AllowedHosts": "*"
}
Content of webapi.run.json (like launchSettings.json):
{
"$schema": "https://json.schemastore.org/launchsettings.json",
"profiles": {
"http": {
"commandName": "Project",
"dotnetRunMessages": true,
"launchBrowser": false,
"applicationUrl": "http://localhost:5145",
"environmentVariables": {
"ASPNETCORE_ENVIRONMENT": "Development"
}
},
"https": {
"commandName": "Project",
"dotnetRunMessages": true,
"launchBrowser": false,
"applicationUrl": "https://localhost:7111;http://localhost:5145",
"environmentVariables": {
"ASPNETCORE_ENVIRONMENT": "Development"
}
}
}
}
Contents of the main C# app, WebApi.cs:
#!/usr/bin/env dotnet

#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0

using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options => {
options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

var settingsFile = $"{builder.Environment.ApplicationName}.appsettings.json";
builder.Configuration.AddJsonFile(settingsFile, optional: true, reloadOnChange: true);

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapGet("/", () => new HelloResponse { Message = "Hello, World!" })
.WithName("HelloWorld");

app.Run();

// Add the JSON serializer context
[JsonSerializable(typeof(HelloResponse))]
internal partial class AppJsonSerializerContext : JsonSerializerContext{
}

// Add the response model
public record HelloResponse {
public string Message { get; init; } = string.Empty;
}
Output:
dotnet Webapi.cs
Using launch settings from /Users/medhatelmasry/Library/CloudStorage/OneDrive-Personal/NETBC/events/2025/11/file-based-apps/ex1/WebApiFileBased/Webapi.run.json...
info: Microsoft.Hosting.Lifetime[14]
Now listening on: http://localhost:5145
info: Microsoft.Hosting.Lifetime[0]
Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
Content root path: /Users/medhatelmasry/Library/CloudStorage/OneDrive-Personal/NETBC/events/2025/11/file-based-apps/ex1/WebApiFileBased
http://localhost:5145

To check whether the app builds, you can run:
dotnet restore Webapi.cs
dotnet clean Webapi.cs
dotnet build Webapi.cs
Publish
dotnet publish Webapi.cs
cd artifacts/Webapi
./Webapi
Convert from file-based to traditional
dotnet project convert webapi.cs -o ../DemoWebAPI




