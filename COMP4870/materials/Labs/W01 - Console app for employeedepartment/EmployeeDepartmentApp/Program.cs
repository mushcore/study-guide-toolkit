using Microsoft.EntityFrameworkCore;
using EmployeeDepartmentApp.Models;

CompanyContext context = new();
context.Database.EnsureCreated();

// Seed data if the database is empty
if (!context.Departments.Any())
{
    context.Departments.Add(new Department() { DepartmentName = "Sales" });
    context.Departments.Add(new Department() { DepartmentName = "Engineering" });
    context.Departments.Add(new Department() { DepartmentName = "Marketing" });
    context.SaveChanges();

    context.Employees.Add(new Employee() { FirstName = "John", LastName = "Doe", DepartmentId = 1 });
    context.Employees.Add(new Employee() { FirstName = "Jane", LastName = "Smith", DepartmentId = 2 });
    context.Employees.Add(new Employee() { FirstName = "Peter", LastName = "Jones", DepartmentId = 1 });
    context.Employees.Add(new Employee() { FirstName = "Fred", LastName = "Smith", DepartmentId = 3 });
    context.Employees.Add(new Employee() { FirstName = "Jane", LastName = "French", DepartmentId = 3 });
    context.SaveChanges();
}

// --- Add a new department ---
Console.WriteLine("Enter a new department name:");
string? deptName = Console.ReadLine();

var newDepartment = new Department()
{
    DepartmentName = deptName!
};
context.Departments.Add(newDepartment);
int affected = context.SaveChanges();
Console.WriteLine($"{affected} department(s) added.\n");

// --- Add a new employee ---
Console.WriteLine("Enter employee first name:");
string? firstName = Console.ReadLine();

Console.WriteLine("Enter employee last name:");
string? lastName = Console.ReadLine();

Console.WriteLine("Available departments:");
foreach (var d in context.Departments)
{
    Console.WriteLine($"  {d.DepartmentId} - {d.DepartmentName}");
}

Console.WriteLine("Enter department ID for the employee:");
string? deptIdInput = Console.ReadLine();
int deptId = int.Parse(deptIdInput!);

var newEmployee = new Employee()
{
    FirstName = firstName!,
    LastName = lastName!,
    DepartmentId = deptId
};
context.Employees.Add(newEmployee);
affected = context.SaveChanges();
Console.WriteLine($"{affected} employee(s) added.\n");

// --- Display the list of employees in each department ---
Console.WriteLine("=== Employees by Department ===");
var departments = context.Departments.Include(d => d.Employees);

foreach (var dept in departments)
{
    Console.WriteLine($"\n{dept.DepartmentName}:");
    foreach (var emp in dept.Employees)
    {
        Console.WriteLine($"  {emp.FirstName} {emp.LastName}");
    }
}

// --- GroupBy using Method Syntax ---
Console.WriteLine("\n=== Employee Count by Department (Method Syntax) ===");
var methodGroupBy = context.Employees
    .Include(e => e.Department)
    .GroupBy(e => e.Department!.DepartmentName)
    .Select(g => new
    {
        Name = g.Key,
        Count = g.Count()
    })
    .OrderByDescending(cp => cp.Count);

foreach (var item in methodGroupBy)
{
    Console.WriteLine($"{item.Name}\t{item.Count}");
}

// --- GroupBy using Query Syntax ---
Console.WriteLine("\n=== Employee Count by Department (Query Syntax) ===");
var queryGroupBy = from e in context.Employees
                   group e by e.Department!.DepartmentName into g
                   orderby g.Count() descending
                   select new
                   {
                       Name = g.Key,
                       Count = g.Count()
                   };

foreach (var item in queryGroupBy)
{
    Console.WriteLine($"{item.Name}\t{item.Count}");
}
