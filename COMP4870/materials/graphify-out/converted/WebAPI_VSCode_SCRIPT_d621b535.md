<!-- converted from WebAPI_VSCode_SCRIPT.docx -->

ASP.NET Web API with SQLite
VS Code extensions needed:
- C#
- C# Extensions
Create a Web API controller with dotnet CLI:
dotnet new webapi -o HealthAPI
cd HealthAPI
dotnet watch run
Point browser to https://localhost:5001/weatherforecast. You will see the following:

Look at WeatherForecastController:
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase {
private static readonly string[] Summaries = new[] {
"Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

private readonly ILogger<WeatherForecastController> _logger;

public WeatherForecastController(ILogger<WeatherForecastController> logger) {
_logger = logger;
}

[HttpGet]
public IEnumerable<WeatherForecast> Get() {
var rng = new Random();
return Enumerable.Range(1, 5).Select(index => new WeatherForecast {
Date = DateTime.Now.AddDays(index),
TemperatureC = rng.Next(-20, 55),
Summary = Summaries[rng.Next(Summaries.Length)]
}).ToArray();
}
}
Add these tools:
dotnet tool install -g dotnet-ef
dotnet tool install -g microsoft.dotnet-scaffold
Let us add these packages:
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Sqlite.Design
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
We will scaffold a simple API controller. Stop the web server then run this terminal command:
dotnet scaffold
Start the server with dotnet watch then point your browser to http://localhost:5000/api/values. This is what you will see:
["value1","value2"]
Let us have a look at the controller named ValuesController.
Add instance variable:
string[] days = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
Make the Get() method return the following:
return days;
Save then refresh the page. You will see the following:

Change the name of the first Get() method to GetDays(). Save and refresh the web page. You get the same result as before. While the name of the action method starts with the name Get then it will respond to the GET verb.
Change content of the Get(int id) method to the following:
if (id > -1 && id < days.Count())
return days[id];
else
return "NotFound";
Save & refresh webpage. No change.
Add /1 to the URL. This is what you should see:

Replace /1 with /11 in the URL. This is what you will see:

Add a connection string to appsettings.Development.json as shown below:
"ConnectionStrings": {
"DefaultConnection": "DataSource=Health.db;Cache=Shared;"
}
Create two folders: Data & Models.
Inside the Models folder, add the following three classes for Ailment, Medication and Patient:
public class Patient {
public int PatientId { get; set; }
public string? Name { get; set; }
public ICollection<Ailment>? Ailments { get; set; }
public ICollection<Medication>? Medications { get; set; }
}

public class Medication
{
[Key]
public string? Name { get; set; }
public string? Doses { get; set; }


[ForeignKey("PatientId")]
    [JsonIgnore]
public Patient? Patient { get; set; }
public int PatientId { get; set; }
}

public class Ailment
{
[Key]
public string? Name { get; set; }


[ForeignKey("PatientId")]
[JsonIgnore]
public Patient? Patient { get; set; }
public int PatientId { get; set; }
}
Note: make sure the above classes are in namespace HealthAPI.Models.
Developers prefer having sample data when building data driven applications. Therefore, we will create some dummy data to ensure that our application behaves as expected. Create a class file named SampleData in the Data directory and add to it the following code:
public class SampleData {
public static List<Patient> GetPatients()
{
List<Patient> patients = new List<Patient>() {
new Patient() {
PatientId = 1,
Name="Jim Jones",
},
new Patient() {
PatientId = 2,
Name="Ann Smith",
},
new Patient() {
PatientId = 3,
Name="Tom Myers",
},
};

return patients;
}

public static List<Medication> GetMedication() {
List<Medication> medication = new List<Medication>() {
new Medication() {
Name="Tylenol",
Doses = "2 tablets per day",
PatientId = 1
},
new Medication() {
Name="Aspirin",
Doses = "3 tablets per day",
PatientId = 1
},
new Medication() {
Name="Advil",
Doses = "1 tablet per day",
PatientId = 2
},
new Medication() {
Name="Robaxin",
Doses = "2 teaspoons per day",
PatientId = 3
},
new Medication() {
Name="Voltarin",
Doses = "apply cream twice per day",
PatientId = 2
},
};

return medication;
}

public static List<Ailment> GetAilments() {
List<Ailment> ailments = new List<Ailment>() {
new Ailment() {
Name="Headache",
PatientId = 1
},
new Ailment() {
Name="Tummy pain",
PatientId = 1
},
new Ailment() {
Name="Flu",
PatientId = 2
},
new Ailment() {
Name="Bone fracture",
PatientId = 3
},
new Ailment() {
Name="Covid",
PatientId = 2
},
};

return ailments;
}

}
Next, add an Entity Framework context class. Inside the Data folder, add a class file named HealthContext with the following content:
public class HealthContext : DbContext {
public HealthContext(DbContextOptions options) : base(options) { }

protected override void OnModelCreating(ModelBuilder builder) {
base.OnModelCreating(builder);

builder.Entity<Ailment>().Property(p => p.Name).HasMaxLength(40);
builder.Entity<Medication>().Property(p => p.Name).HasMaxLength(40);
builder.Entity<Patient>().Property(p => p.Name).HasMaxLength(40);

builder.Entity<Ailment>().ToTable("Ailment");
builder.Entity<Medication>().ToTable("Medication");
builder.Entity<Patient>().ToTable("Patient");

builder.Entity<Patient>().HasData(SampleData.GetPatients());
builder.Entity<Medication>().HasData(SampleData.GetMedication());
builder.Entity<Ailment>().HasData(SampleData.GetAilments());
}

public DbSet<Ailment>? Ailments { get; set; }
public DbSet<Medication>? Medications { get; set; }
public DbSet<Patient>? Patients { get; set; }
}
Now we need to register the context (DataContext) with dependency injection as a service in Program.cs. Add the following code right before “var app = builder.Build();” in Program.cs:
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<HealthContext>(options =>
options.UseSqlite(connectionString));
Let us add a migration and subsequently update the database. Execute the following CLI commands in a terminal window.
dotnet-ef migrations add M1 -o Data/Migrations
dotnet-ef database update
Start the application with dotnet watch run, then point your browser to https://localhost:5001/weatherforecast.
If we run the application, we should see that the tables are created.
Run the application then check that the database tables indeed contain data.

## Patients Controller
Add a patients controller using the scaffolding tool
Start your application and browse to /api/patients:

Why are ailments and medications null? To see ailment and medication information, change lambda expression in Patients controller Get() action method to:
return await _context.Patients
.Include(i => i.Ailments)
.Include(m => m.Medications)
.ToListAsync();
Save then refresh the page. It should look like this:

To query a single patient, use URL /api/patients/3:

Again, the ailments and medications are null. The LINQ code in GetPatient([FromRoute] int id) should be:
var patient = await _context.Patients
.Include(i => i.Ailments)
.Include(m => m.Medications)
.FirstOrDefaultAsync(i => i.PatientId == id);
Save and refresh the page. It should look like this:

Suppose you want to create a custom routing. For example, you only want the medication for patient 3. Add this action method to the Patients controller:
// GET api/patients/3/medication
[HttpGet("{id:int}/medication")]
public async Task<IActionResult> GetMedications(int id) {
var patient = await _context.Patients!
.Include(m => m.Medications)
.FirstOrDefaultAsync(i => i.PatientId == id);

if (patient == null)
return NotFound();

return Ok(patient.Medications);
}
Entering /api/patients/1/medication in the URL yields:

If you want migrations to be applied automatically, add the following code in Program.cs right before the last “app.Run()” statement
using (var scope = app.Services.CreateScope()) {
var services = scope.ServiceProvider;

var context = services.GetRequiredService<HealthContext>();
context.Database.Migrate();
}
# CORS
Create a file named show.html in the root folder of your project and add to it the following HTML & JavaScript:
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>CORS Client</title>
</head>
<body>
<h3>CORS Client</h3>
<button id="btnGetData">Get Data</button>
<pre id="preOutput"></pre>
<script>
const baseUrl = "http://localhost:7035";

var showResponse = function (object) {
document.querySelector("#preOutput").innerHTML = JSON.stringify(
object,
null,
4
);
};

const button = document.querySelector("#btnGetData");
button.addEventListener("click", (e) => {
getData();
});

var getData = async function () {
var url = baseUrl + "/api/patients";

await fetch(url)
.then((response) => {
return response.json();
})
.then((data) => {
showResponse(data);
});

return false;
};
</script>
</body>
</html>

View the show.html page by double-clicking on it in the file system.
When you click on the “Get Patients” button, the following error will appear:

To understand where this error is coming from, hit F12 in your browser and check the console. This error will appear:

We need to enable CORS (Cross Origin Resource Sharing) on the API project. This is done by adding to the server-side API project the following code in Program.cs just before “var app = builder.Build();”:
// Add Cors
builder.Services.AddCors(o => o.AddPolicy("HealthPolicy", builder => {
builder.AllowAnyOrigin()
.AllowAnyMethod()
.AllowAnyHeader();
}));
Also, in the same Program.cs file, add this code just before UseAuthorization():
app.UseRouting();
app.UseCors();
The above specifies a CORS policy named HealthPolicy. We can then selectively apply this policy for controllers. Add the following annotation to the PatientsController class:
[EnableCors("HealthPolicy")]
Save your code then make a new request for patient data from index.html. This time you should be successful:


## Postman
Postman is a very useful tool for testing RESTful services. Download Postman & install from https://www.getpostman.com/apps.
### Retrieve data with the GET method
Once you have started Postman, enter the Patients endpoint into the URL field then click on the Send button. This is the result:

Because we are using SSL, there is a setting that needs to be adjusted in Postman. Click on the wrench icon on the top right corner of Postman then click on Settings. Turn “SSL certificate verification” to OFF.

Now if you go back and click on the Send button it should display the ailments from the database.

### Insert data with the POST method
Let us next add a new patient into the database. Change GET to POST, click on the Body tab, and change radio button to raw then set content-type to “JSON (application/json)”. Enter into the body section the JSON object like: {"name": "Steve Wagner"}

Click on the Send button.  The response coming back from the API confirms that a record has been added to the patient’s database table:

### Update data with the PUT method
Let us change “Steve Wagner” to “Linda Gardner”. Change the method to PUT, the URL needs to be /api/patients/4 the JSON object is: {"patientId": 4, "name": "Linda Gardner"}

Click on Send. This is what the response should look like:

Remember that 200+ status bodes are good, 400+ status codes mean something is wrong with the data, and 500+ status codes mean that there is a problem with the code running on the server side. Status code 204 simple means that the server has returned a no content status code. Look at the server side action method for a better understanding.
If you make a GET request on URL /api/patients/4 you will see that the name has indeed changed to “Lind Gardner”.

### Delete data with the DELETE method
It is always easiest to destroy. To delete a record simple use the DELETE method with URL /api/patients/4. That’s it.

If you make a GET request on URL /api/patients/4, you will get a status error 404 for not found.
