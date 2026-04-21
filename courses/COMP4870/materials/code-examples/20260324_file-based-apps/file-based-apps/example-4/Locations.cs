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
table.Title = new TableTitle("[bold red]Cities and Countries[/]");
table.Border = TableBorder.Rounded;
table.AddColumn(new TableColumn("[bold]City[/]"));
table.AddColumn(new TableColumn("[bold]Country[/]"));

foreach (var city in cities) {
    table.AddRow(city.City, city.Country);
}

AnsiConsole.Write(table);
