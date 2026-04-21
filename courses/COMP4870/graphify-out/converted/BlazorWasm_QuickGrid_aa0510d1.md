<!-- converted from BlazorWasm_QuickGrid.docx -->

# QuickGrid
Create a new server-side Blazor app as follows:
dotnet new blazorserver -f net7.0 -o ConfBlazor
cd ConfBlazor
Add this package to the blazor app:
dotnet add package Microsoft.AspNetCore.Components.QuickGrid
Add this _Imports.razor:
@using Microsoft.AspNetCore.Components.QuickGrid
@using ?????.Models
Add this class to Models/Student.cs to generate some sample student data:
namespace ConfBlazor.Models;
public class Student {
required public int? Id { get; set; }
required public string FirstName { get; set; }
required public string LastName { get; set; }
required public string School { get; set; }

public static IQueryable<Student> GetStudents() {
int ndx = 0;
List<Student> students = new List<Student>() {
new Student() { Id = ++ndx, FirstName="Max", LastName="Pao", School="Science" },
new Student() { Id = ++ndx, FirstName="Tom", LastName="Fay", School="Mining" },
new Student() { Id = ++ndx, FirstName="Ann", LastName="Sun", School="Nursing" },
new Student() { Id = ++ndx, FirstName="Joe", LastName="Fox", School="Computing" },
new Student() { Id = ++ndx, FirstName="Sue", LastName="Mai", School="Mining" },
new Student() { Id = ++ndx, FirstName="Ben", LastName="Lau", School="Business" },
new Student() { Id = ++ndx, FirstName="Zoe", LastName="Ray", School="Mining" },
new Student() { Id = ++ndx, FirstName="Sam", LastName="Ash", School="Medicine" },
new Student() { Id = ++ndx, FirstName="Dan", LastName="Lee", School="Computing" },
new Student() { Id = ++ndx, FirstName="Pat", LastName="Day", School="Science" },
new Student() { Id = ++ndx, FirstName="Kim", LastName="Rex", School="Computing" },
new Student() { Id = ++ndx, FirstName="Tim", LastName="Ram", School="Business" },
new Student() { Id = ++ndx, FirstName="Rob", LastName="Wei", School="Mining" },
new Student() { Id = ++ndx, FirstName="Jan", LastName="Tex", School="Science" },
new Student() { Id = ++ndx, FirstName="Jim", LastName="Kid", School="Business" },
new Student() { Id = ++ndx, FirstName="Ben", LastName="Chu", School="Medicine" },
new Student() { Id = ++ndx, FirstName="Mia", LastName="Tao", School="Computing" },
new Student() { Id = ++ndx, FirstName="Ted", LastName="Day", School="Business" },
new Student() { Id = ++ndx, FirstName="Amy", LastName="Roy", School="Science" },
new Student() { Id = ++ndx, FirstName="Ian", LastName="Kit", School="Nursing" },
new Student() { Id = ++ndx, FirstName="Liz", LastName="Tan", School="Medicine" },
new Student() { Id = ++ndx, FirstName="Mat", LastName="Roy", School="Tourism" },
new Student() { Id = ++ndx, FirstName="Deb", LastName="Luo", School="Medicine" },
new Student() { Id = ++ndx, FirstName="Ana", LastName="Poe", School="Computing" },
new Student() { Id = ++ndx, FirstName="Lyn", LastName="Raj", School="Science" },
new Student() { Id = ++ndx, FirstName="Amy", LastName="Ash", School="Tourism" },
new Student() { Id = ++ndx, FirstName="Kim", LastName="Kid", School="Mining" },
new Student() { Id = ++ndx, FirstName="Bec", LastName="Fry", School="Nursing" },
new Student() { Id = ++ndx, FirstName="Eva", LastName="Lap", School="Computing" },
new Student() { Id = ++ndx, FirstName="Eli", LastName="Yim", School="Business" },
new Student() { Id = ++ndx, FirstName="Sam", LastName="Hui", School="Science" },
new Student() { Id = ++ndx, FirstName="Joe", LastName="Jin", School="Mining" },
new Student() { Id = ++ndx, FirstName="Liz", LastName="Kuo", School="Agriculture" },
new Student() { Id = ++ndx, FirstName="Ric", LastName="Mak", School="Tourism" },
new Student() { Id = ++ndx, FirstName="Pam", LastName="Day", School="Computing" },
new Student() { Id = ++ndx, FirstName="Stu", LastName="Gad", School="Business" },
new Student() { Id = ++ndx, FirstName="Tom", LastName="Bee", School="Tourism" },
new Student() { Id = ++ndx, FirstName="Bob", LastName="Lam", School="Agriculture" },
new Student() { Id = ++ndx, FirstName="Jim", LastName="Ots", School="Medicine" },
new Student() { Id = ++ndx, FirstName="Tom", LastName="Mag", School="Mining" },
new Student() { Id = ++ndx, FirstName="Hal", LastName="Doe", School="Agriculture" },
new Student() { Id = ++ndx, FirstName="Roy", LastName="Kim", School="Nursing" },
new Student() { Id = ++ndx, FirstName="Vis", LastName="Cox", School="Science" },
new Student() { Id = ++ndx, FirstName="Kay", LastName="Aga", School="Tourism" },
new Student() { Id = ++ndx, FirstName="Reo", LastName="Hui", School="Business" },
new Student() { Id = ++ndx, FirstName="Bob", LastName="Roe", School="Medicine" },
};
return students.AsQueryable();
}
}
Replace FetchData.razor with the following:
@page "/fetchdata"

<PageTitle>Students</PageTitle>

<h1>Students</h1>

<QuickGrid Items="@students">
<PropertyColumn Property="@(_ => _.Id)" Sortable="true" />
<PropertyColumn Property="@(_ => _.FirstName)" Sortable="true" />
<PropertyColumn Property="@(_ => _.LastName)" Sortable="true" />
<PropertyColumn Property="@(_ => _.School)" Sortable="true" />
</QuickGrid>

@code {
IQueryable<Student> students = Student.GetStudents();
}

Note that sorting works.
## Pagination:
Add this variable inside @code { . . .  }
private PaginationState pagination = new PaginationState { ItemsPerPage = 10 };
Add this property:
<QuickGrid Items="@people" Pagination="@pagination">
Add this under </QuickGrid>:
<Paginator State="@pagination" />
This can be changed to be placed above <QuickGrid> instead of below <QuickGrid>.

## TemplateColumn
Replace:
<PropertyColumn Property="@(_ => _.FirstName)" Sortable="true" />
<PropertyColumn Property="@(_ => _.LastName)" Sortable="true" />
WITH
<TemplateColumn Title="Name">
<div class="flex items-center">
<nobr>
<strong>@context.FirstName @context.LastName</strong>
</nobr>
</div>
</TemplateColumn>

Note that the Name column combines first and last names. Unfortunately, it is not sortable.
Add this sortByName variable to @code {  . . . }:
GridSort<Student> sortByName = GridSort<Student>
.ByAscending(_ => _.FirstName).ThenAscending(_ => _.LastName);
Also, add this highlighted attribute:
<TemplateColumn Title="Name" SortBy="@sortByName">
Now, the Name column can be sorted:

### Filtering
Replace the component with this code for full filtering:
<h3>Students</h3>

<p>There are @filtered.Count() email recipients.</p>

<div class="search-box">
<input class="form-control me-sm-2 " style="width: 95%" type="search" autofocus @bind="studentsFilter"
@bind:event="oninput" placeholder="Search Filter ..." />
</div>

<QuickGrid Items="@filtered" Pagination="@pagination">
<PropertyColumn Property="@(_ => _.Id)" Sortable="true" />
<TemplateColumn Title="Name" SortBy="@sortByName">
<div class="flex items-center">
<nobr>
<strong>@context.FirstName @context.LastName</strong>
</nobr>
</div>
</TemplateColumn>

<PropertyColumn Property="@(_ => _.School)" Sortable="true" />
</QuickGrid>
<Paginator State="@pagination" />

@code {
IQueryable<RazorInternational.Models.Student> students = Student.GetStudents();
private PaginationState pagination = new PaginationState { ItemsPerPage = 10 };

string? studentsFilter;

GridSort<Student> sortByName = GridSort<Student>
.ByAscending(_ => _.FirstName).ThenAscending(_ => _.LastName);

private List<Student>? studentsList
{
get
{
var data = students.ToList();
if (!data.Any()) {
return null;
} else {

return data;
}
}
}

private IQueryable<Student> filtered
{
get
{
if (studentsList == null || !studentsList.Any()) {
return Enumerable.Empty<Student>().AsQueryable();
}

if (string.IsNullOrEmpty(studentsFilter)) {
return studentsList!.AsQueryable();
} else {
var filteredList = studentsList!.AsQueryable()
.Where(
b => b.FirstName!.Contains(studentsFilter, StringComparison.CurrentCultureIgnoreCase)
|| b.LastName!.Contains(studentsFilter, StringComparison.CurrentCultureIgnoreCase)
|| b.School!.Contains(studentsFilter, StringComparison.CurrentCultureIgnoreCase)
);
return filteredList;
}
}
}
}

Visit https://aspnet.github.io/quickgridsamples/ for more examples.
