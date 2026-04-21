# W11 File Based C# Apps - Lab Solution

## How This Solution Completes the Lab

This solution implements a **file-based C# app** that reads student data from a JSON file and displays filtered results in a formatted Spectre.Console table -- exactly as required by the lab.

### What was built

1. **`students.json`** - Contains 112 student records (copied from the provided GitHub Gist URL), each with: `StudentId`, `FirstName`, `LastName`, `School`, `Gender`, `DateOfBirth`.

2. **`filterStudents.cs`** - A single-file C# app that:
   - Uses the `#:package` directive to reference `Spectre.Console@0.49.1` inline (no `.csproj` needed)
   - Reads `students.json` using `System.Text.Json`
   - Accepts a command-line keyword argument
   - Filters students by matching the keyword (case-insensitive) against **all fields** (ID, first name, last name, school, gender, date of birth)
   - Displays results in a Spectre.Console table with rounded borders, bold column headers, and a title showing the match count

### Concepts used from the Week 11 lectures

- **File-based apps**: Running a `.cs` file directly with `dotnet run` (no project file needed)
- **Inline package references**: `#:package Spectre.Console@0.49.1` at the top of the file
- **Spectre.Console tables**: Same pattern as `example-4/Locations.cs` from the lecture -- `Table`, `TableTitle`, `TableBorder.Rounded`, `AddColumn`, `AddRow`, `AnsiConsole.Write`
- **JSON deserialization**: `File.ReadAllText` + `JsonSerializer.Deserialize<List<Student>>`
- **Records**: `record Student` for the data model

## How to Run / Test

### Prerequisites

- .NET 10 SDK (or later) installed

### Steps

1. Open a terminal and navigate to the `FilteredStudents` folder:

```bash
cd "C:\Users\klian\Documents\dotnet\Labs\W11 File Based C# Apps\FilteredStudents"
```

2. Run the app with a keyword filter after `--`:

```bash
dotnet run filterStudents.cs -- medicine
dotnet run filterStudents.cs -- liz
dotnet run filterStudents.cs -- fox
dotnet run filterStudents.cs -- 2002
```

### Expected Results

| Command | Matches | Description |
|---------|---------|-------------|
| `-- medicine` | 5 students | Filters by School = Medicine |
| `-- liz` | 5 students | Filters by FirstName = Liz |
| `-- fox` | 2 students | Filters by LastName = Fox |
| `-- 2002` | 6 students | Filters by year in DateOfBirth |

Each run displays a formatted table with rounded borders, bold headers (ID, First Name, Last Name, School, Gender, DOB), and a yellow title showing the match count.
