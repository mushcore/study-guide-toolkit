#:package Spectre.Console@0.49.1

using System.Text.Json;
using System.Text.Json.Serialization;
using Spectre.Console;

var keyword = args.Length > 0 ? args[0] : "";

var json = File.ReadAllText("students.json");
var students = JsonSerializer.Deserialize(json, AppJsonContext.Default.ListStudent)!;

var filtered = students.Where(s =>
    s.StudentId.ToString().Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
    s.FirstName!.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
    s.LastName!.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
    s.School!.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
    s.Gender!.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
    s.DateOfBirth!.Contains(keyword, StringComparison.OrdinalIgnoreCase)
).ToList();

var table = new Table();
table.Title = new TableTitle($"[bold yellow]Students Matching '{keyword}' ({filtered.Count})[/]");
table.Border = TableBorder.Rounded;
table.AddColumn(new TableColumn("[bold]ID[/]"));
table.AddColumn(new TableColumn("[bold]First Name[/]"));
table.AddColumn(new TableColumn("[bold]Last Name[/]"));
table.AddColumn(new TableColumn("[bold]School[/]"));
table.AddColumn(new TableColumn("[bold]Gender[/]"));
table.AddColumn(new TableColumn("[bold]DOB[/]"));

foreach (var s in filtered)
{
    table.AddRow(
        s.StudentId.ToString(),
        s.FirstName!,
        s.LastName!,
        s.School!,
        s.Gender!,
        s.DateOfBirth!
    );
}

AnsiConsole.Write(table);

record Student
{
    public int StudentId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? School { get; set; }
    public string? Gender { get; set; }
    public string? DateOfBirth { get; set; }
}

[JsonSerializable(typeof(List<Student>))]
internal partial class AppJsonContext : JsonSerializerContext
{
}
