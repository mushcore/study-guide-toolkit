# W01 Lab Solution - Console App for Employee/Department

## How This Solution Completes the Lab

### 1. Database Setup (SQL Script)

The file `database_setup.sql` contains the exact SQL from the lab instructions to create the `departments` and `employees` tables with sample data. The application also includes automatic seeding in `Program.cs` — if the database does not exist or is empty, it creates the tables and inserts the sample data using EF Core's `EnsureCreated()` method.

### 2. Reverse-Engineered Database with `dotnet-ef`

The database was scaffolded using:

```bash
dotnet ef dbcontext scaffold "Data Source=company.db" Microsoft.EntityFrameworkCore.Sqlite -c CompanyContext -o Models
```

This generated three files in the `Models/` folder:
- **`CompanyContext.cs`** — The EF Core DbContext with `DbSet<Department>` and `DbSet<Employee>`, including table/column mappings and the foreign key relationship.
- **`Department.cs`** — The Department entity with `DepartmentId`, `DepartmentName`, and a navigation collection `Employees`.
- **`Employee.cs`** — The Employee entity with `EmployeeId`, `FirstName`, `LastName`, `DepartmentId`, and a navigation property `Department`.

### 3. Add a New Department (User Input)

The program prompts the user to enter a department name, creates a new `Department` object, adds it to the context, and calls `SaveChanges()` — following the same CRUD pattern from the lecture's Northwind example.

### 4. Add a New Employee (User Input)

The program prompts for first name, last name, and department ID (after listing all available departments). It creates a new `Employee` object and saves it to the database.

### 5. Display Employees in Each Department

Uses `context.Departments.Include(d => d.Employees)` to eagerly load the related employees for each department, then iterates and prints them — matching the `.Include()` pattern taught in the lecture.

### 6. GroupBy — Method Syntax

```csharp
var methodGroupBy = context.Employees
    .Include(e => e.Department)
    .GroupBy(e => e.Department!.DepartmentName)
    .Select(g => new { Name = g.Key, Count = g.Count() })
    .OrderByDescending(cp => cp.Count);
```

This directly mirrors the lecture's `Products.GroupBy(p => p.Category.CategoryName)` pattern, adapted for employees/departments.

### 7. GroupBy — Query Syntax

```csharp
var queryGroupBy = from e in context.Employees
                   group e by e.Department!.DepartmentName into g
                   orderby g.Count() descending
                   select new { Name = g.Key, Count = g.Count() };
```

This is the LINQ query syntax equivalent, demonstrating the same result using the `from...group...into...select` pattern.

---

## How to Run

### Prerequisites
- .NET 10 SDK (or later)
- `dotnet-ef` global tool (`dotnet tool install --global dotnet-ef`)

### Steps

1. **Navigate to the project directory:**
   ```bash
   cd "Labs/W01 - Console app for employeedepartment/EmployeeDepartmentApp"
   ```

2. **Run the application:**
   ```bash
   dotnet run
   ```
   The database (`company.db`) will be automatically created and seeded with sample data on first run.

3. **Follow the prompts:**
   - Enter a new department name
   - Enter an employee's first name, last name, and department ID
   - View the employee listings and group-by counts

### To Re-scaffold the Database (Optional)

If you want to recreate the database from scratch:

```bash
# Delete the existing database
rm company.db

# The app will re-create and seed it on next run
dotnet run
```

Or manually with sqlite3 (if installed):

```bash
sqlite3 company.db < ../database_setup.sql
```

### Sample Output

```
Enter a new department name:
> HR
1 department(s) added.

Enter employee first name:
> Alice
Enter employee last name:
> Wonder
Available departments:
  1 - Sales
  2 - Engineering
  3 - Marketing
  4 - HR
Enter department ID for the employee:
> 1
1 employee(s) added.

=== Employees by Department ===

Sales:
  John Doe
  Peter Jones
  Alice Wonder

Engineering:
  Jane Smith

Marketing:
  Fred Smith
  Jane French

HR:

=== Employee Count by Department (Method Syntax) ===
Sales   3
Marketing       2
Engineering     1

=== Employee Count by Department (Query Syntax) ===
Sales   3
Marketing       2
Engineering     1
```

## Project Structure

```
EmployeeDepartmentApp/
  Program.cs                 # Main application with all lab features
  EmployeeDepartmentApp.csproj
  Models/
    CompanyContext.cs         # EF Core DbContext (scaffolded)
    Department.cs            # Department entity (scaffolded)
    Employee.cs              # Employee entity (scaffolded)
  company.db                 # SQLite database (auto-created)
```

## NuGet Packages Used

- `Microsoft.EntityFrameworkCore.Sqlite` — SQLite database provider for EF Core
- `Microsoft.EntityFrameworkCore.Design` — Required for `dotnet-ef` scaffolding
- `Microsoft.Data.Sqlite` — Low-level SQLite access (used by the provider)
