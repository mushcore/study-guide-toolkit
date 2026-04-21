<!-- converted from MVC_app_ConsumeAPIs_SCRIPT.docx -->

Working with JSON APIs from ASP.NET MVC
APIs can be consumed from any type of application. In your career you will consume APIs mostly from JavaScript. We can, however, consume APIs from an ASP.NET MVC application too. This is what we will be doing today. There is already an online Students API that we will be working with at https://api4u.azurewebsites.net/api/students. This API works with the following HTTP methods:
The Students API has the following columns:
Let us first create an ASP.NET Core MVC application. Go into your working directory in a terminal window and execute this command:
dotnet new mvc -f net6.0 -o ConsumeStudentsAPI
The above command will create an ASP.NET MVC web application in a directory called ConsumeStudentsAPI. Next, change directory with:
cd ConsumeStudentsAPI
We will need to use a package named Newtonsoft.Json. Therefore, execute the following command to add this package:
dotnet add package Newtonsoft.Json
You can continue either with Visual Studio 2020 or Visual Studio Code. It is really up to you.
Add to the Models folder a class file named Student.cs with the following class definition:
public class Student {
[Display(Name = "ID")]
public string? studentId { get; set; }

[Required]
[Display(Name = "First Name")]
public string? firstName { get; set; }

[Required]
[Display(Name = "Last Name")]
public string? lastName { get; set; }

[Required]
[Display(Name = "School")]
public string? school { get; set; }
}
Notice these annotations:
- Display allows you to have an alternative display name for a property in the model
- Required makes sure that the user enters a value for this property.
We will be using the IHttpClientFactory factory class to make HTTP requests to the API. In order to do this, we will need to add a singleton object into the application. Therefore, add this code to the ConfigureServices() method in Startup.cs:
services.AddHttpClient();
Next, add to the Controllers folder a class file named StudentsController.cs with the following class definitions:
public class StudentsController : Controller {
const string BASE_URL = "https://api4u.azurewebsites.net/";
private readonly ILogger<StudentsController> _logger;
private readonly IHttpClientFactory _clientFactory;
public IEnumerable<Student> Students { get; set; }
public bool GetStudentsError { get; private set; }

public StudentsController(ILogger<StudentsController> logger, IHttpClientFactory clientFactory)
{
_logger = logger;
_clientFactory = clientFactory;
}

public async Task<IActionResult> Index()
{
var message = new HttpRequestMessage();
message.Method = HttpMethod.Get;
message.RequestUri = new Uri($"{BASE_URL}api/students");
message.Headers.Add("Accept", "application/json");

var client = _clientFactory.CreateClient();

var response = await client.SendAsync(message);

if (response.IsSuccessStatusCode) {
using var responseStream = await response.Content.ReadAsStreamAsync();
Students = await JsonSerializer.DeserializeAsync<IEnumerable<Student>>(responseStream);
} else {
GetStudentsError = true;
Students = Array.Empty<Student>();
}

return View(Students);
}

public async Task<IActionResult> Details(string id) {
if (id == null)
return NotFound();

var message = new HttpRequestMessage();
message.Method = HttpMethod.Get;
message.RequestUri = new Uri($"{BASE_URL}api/students/{id}");
message.Headers.Add("Accept", "application/json");

var client = _clientFactory.CreateClient();

var response = await client.SendAsync(message);

Student student = null;

if (response.IsSuccessStatusCode) {
using var responseStream = await response.Content.ReadAsStreamAsync();
student = await JsonSerializer.DeserializeAsync<Student>(responseStream);
} else {
GetStudentsError = true;
}

if (student == null)
return NotFound();

return View(student);
}

// GET: Students/Create
public IActionResult Create() {
return View();
}

[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Create([Bind("studentId,firstName,lastName,school")] Student student)
{
if (ModelState.IsValid) {
HttpContent httpContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(student), Encoding.UTF8);
httpContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

var message = new HttpRequestMessage();
message.Content = httpContent;
message.Method = HttpMethod.Post;
message.RequestUri = new Uri($"{BASE_URL}api/students");

HttpClient client = _clientFactory.CreateClient();
HttpResponseMessage response = await client.SendAsync(message);

var result = await response.Content.ReadAsStringAsync();

return RedirectToAction(nameof(Index));
}
return View(student);
}

public async Task<IActionResult> Edit(string id) {
if (id == null)
return NotFound();

var message = new HttpRequestMessage();
message.Method = HttpMethod.Get;
message.RequestUri = new Uri($"{BASE_URL}api/students/{id}");
message.Headers.Add("Accept", "application/json");

var client = _clientFactory.CreateClient();

var response = await client.SendAsync(message);

Student student = null;

if (response.IsSuccessStatusCode) {
using var responseStream = await response.Content.ReadAsStreamAsync();
student = await JsonSerializer.DeserializeAsync<Student>(responseStream);
} else {
GetStudentsError = true;
}

if (student == null)
return NotFound();

return View(student);
}

[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(string id, [Bind("studentId,firstName,lastName,school")] Student student)
{
if (id != student.studentId)
return NotFound();

if (ModelState.IsValid) {
HttpContent httpContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(student), Encoding.UTF8);
httpContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

var message = new HttpRequestMessage();
message.Content = httpContent;
message.Method = HttpMethod.Put;
message.RequestUri = new Uri($"{BASE_URL}api/students/{id}");

HttpClient client = _clientFactory.CreateClient();
HttpResponseMessage response = await client.SendAsync(message);

var result = await response.Content.ReadAsStringAsync();

return RedirectToAction(nameof(Index));
}
return View(student);
}

// GET: Students/Delete/5
public async Task<IActionResult> Delete(string id) {
if (id == null)
return NotFound();

var message = new HttpRequestMessage();
message.Method = HttpMethod.Get;
message.RequestUri = new Uri($"{BASE_URL}api/students/{id}");
message.Headers.Add("Accept", "application/json");

var client = _clientFactory.CreateClient();

var response = await client.SendAsync(message);

Student student = null;

if (response.IsSuccessStatusCode) {
using var responseStream = await response.Content.ReadAsStreamAsync();
student = await JsonSerializer.DeserializeAsync<Student>(responseStream);
} else {
GetStudentsError = true;
}

if (student == null)
return NotFound();

return View(student);
}

[HttpPost, ActionName("Delete")]
[ValidateAntiForgeryToken]
public async Task<IActionResult> DeleteConfirmed(string id) {
var message = new HttpRequestMessage();
message.Method = HttpMethod.Delete;
message.RequestUri = new Uri($"{BASE_URL}api/students/{id}");

HttpClient client = _clientFactory.CreateClient();
HttpResponseMessage response = await client.SendAsync(message);

var result = await response.Content.ReadAsStringAsync();

return RedirectToAction(nameof(Index));
}
}
The above code represents a controller that has action methods to list, add, edit and delete data. We will need to have views for the action methods in StudentsContrller. Therefore, in the Views folder, create another folder named Students. Inside of the Views/Students folder add these Create.cshtml, Delete.cshtml, Details.cshtml, Edit.cshtml and Index.cshtml files:
## Create.cshtml
@model ConsumeStudentsAPI.Models.Student

@{
ViewData["Title"] = "Add Student";
}

<h1>@ViewData["Title"]</h1>

<hr />
<div class="row">
<div class="col-md-4">
<form asp-action="Create">
<div asp-validation-summary="ModelOnly" class="text-danger"></div>

<div class="form-group">
<label asp-for="studentId" class="control-label"></label>
<input asp-for="studentId" class="form-control" />
<span asp-validation-for="studentId" class="text-danger"></span>
</div>

<div class="form-group">
<label asp-for="firstName" class="control-label"></label>
<input asp-for="firstName" class="form-control" />
<span asp-validation-for="firstName" class="text-danger"></span>
</div>

<div class="form-group">
<label asp-for="lastName" class="control-label"></label>
<input asp-for="lastName" class="form-control" />
<span asp-validation-for="lastName" class="text-danger"></span>
</div>

<div class="form-group">
<label asp-for="school" class="control-label"></label>
<input asp-for="school" class="form-control" />
<span asp-validation-for="school" class="text-danger"></span>
</div>
<input type="submit" value="Create" class="btn btn-success" />
<a asp-action="Index" class="btn btn-primary">&lt;&lt; Back to List</a>
</form>
</div>
</div>
## Delete.cshtml
## @model ConsumeStudentsAPI.Models.Student

## @{
## ViewData["Title"] = "Delete Student";
## }

## <h1>@ViewData["Title"]</h1>

## <h3>Are you sure you want to delete this?</h3>
## <div>
## <hr />
## <dl class="row">
## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.studentId)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.studentId)
## </dd>

## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.firstName)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.firstName)
## </dd>

## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.lastName)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.lastName)
## </dd>

## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.school)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.school)
## </dd>
## </dl>

## <form asp-action="Delete">
## <input type="hidden" asp-for="studentId" />
## <input type="submit" value="Delete" class="btn btn-danger" />
## <a asp-action="Index" class="btn btn-primary">&lt;&lt; Back to List</a>
## </form>
</div>
## Details.cshtml
## @model ConsumeStudentsAPI.Models.Student

## @{
## ViewData["Title"] = "Student Details";
## }

## <h1>@ViewData["Title"]</h1>

## <div>
## <hr />
## <dl class="row">
## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.studentId)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.studentId)
## </dd>

## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.firstName)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.firstName)
## </dd>

## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.lastName)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.lastName)
## </dd>

## <dt class="col-sm-2">
## @Html.DisplayNameFor(model => model.school)
## </dt>
## <dd class="col-sm-10">
## @Html.DisplayFor(model => model.school)
## </dd>
## </dl>
## </div>
## <div>
## <a asp-action="Edit" asp-route-id="@Model.studentId" class="btn btn-warning">Edit</a>
## <a asp-action="Index" class="btn btn-primary">&lt;&lt; Back to List</a>
</div>


## Edit.cshtml
@model ConsumeStudentsAPI.Models.Student

@{
ViewData["Title"] = "Edit Student";
}

<h1>@ViewData["Title"]</h1>
<hr />
<div class="row">
<div class="col-md-4">
<form asp-action="Edit">
<div asp-validation-summary="ModelOnly" class="text-danger"></div>
<input type="hidden" asp-for="studentId" />
<div class="form-group">
<label asp-for="firstName" class="control-label"></label>
<input asp-for="firstName" class="form-control" />
<span asp-validation-for="firstName" class="text-danger"></span>
</div>
<div class="form-group">
<label asp-for="lastName" class="control-label"></label>
<input asp-for="lastName" class="form-control" />
<span asp-validation-for="lastName" class="text-danger"></span>
</div>
<div class="form-group">
<label asp-for="school" class="control-label"></label>
<input asp-for="school" class="form-control" />
<span asp-validation-for="school" class="text-danger"></span>
</div>
<div class="form-group">
<input type="submit" value="Save" class="btn btn-warning" />
<a asp-action="Index" class="btn btn-primary">&lt;&lt; Back to List</a>
</div>
</form>
</div>
</div>
## Index.cshtml
## @model IEnumerable<ConsumeStudentsAPI.Models.Student>

## @{
## ViewData["Title"] = "List Students";
## }

## <div>
## <h1 class="display-4">@ViewData["Title"]</h1>

## <p>
## <a asp-action="Create" class="btn btn-sm btn-success">Create New</a>
## </p>

## <table class="table table-striped table-bordered">
## <tr>
## <th>@Html.DisplayNameFor(model => model.studentId)</th>
## <th>@Html.DisplayNameFor(model => model.firstName)</th>
## <th>@Html.DisplayNameFor(model => model.lastName)</th>
## <th>@Html.DisplayNameFor(model => model.school)</th>
## <th></th>
## </tr>
## @foreach (var item in Model)
## {
## <tr>
## <td>@item.studentId</td>
## <td>@item.firstName</td>
## <td>@item.lastName</td>
## <td>@item.school</td>
## <td style="text-align: center;">
## <a asp-action="Edit" asp-route-id="@item.studentId" class="btn btn-sm btn-warning">Edit</a>
## <a asp-action="Details" asp-route-id="@item.studentId" class="btn btn-sm btn-info">Details</a>
## <a asp-action="Delete" asp-route-id="@item.studentId" class="btn btn-sm btn-danger">Delete</a>
## </td>
## </tr>
## }
## </table>
</div>
We need to add the Students link to the main menu. Therefore add this <li> tag to Views/Shared/_Layout.cshtml after around line 26:
## <li class="nav-item">
## <a class="nav-link text-dark" asp-area="" asp-controller="Students" asp-action="Index">Students</a>
## </li>
Let us run the application and see what we have. The home page looks like this:

Click on Students. A list of students in the database will be shown:

You can try adding, editing, displaying and deleting data.



| POST | insert |
| --- | --- |
| PUT | update |
| GET | read |
| DELETE | delete |
| studentId | string |
| --- | --- |
| firstName | string |
| lastName | string |
| school | string |