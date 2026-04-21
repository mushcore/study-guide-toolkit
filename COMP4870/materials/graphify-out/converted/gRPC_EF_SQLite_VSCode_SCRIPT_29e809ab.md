<!-- converted from gRPC_EF_SQLite_VSCode_SCRIPT.docx -->

# Produce & consume .NET gRPC DB Driven Service with SQLite & VS Code
# Setup
Let’s build a gRPC server then client.
You need .NET 10.0 & VS Code
In a working directory, run the following to create a solution with two projects: grpc and console:
mkdir GrpcBasics
cd GrpcBasics
dotnet new sln
dotnet new grpc -o GrpcStudentsServer
dotnet sln add ./GrpcStudentsServer/GrpcStudentsServer.csproj
cd GrpcStudentsServer
mkdir Models
mkdir Data
dotnet add package Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Grpc.Tools
cd ..
dotnet new console -o GrpcStudentsClient
dotnet sln add ./GrpcStudentsClient/GrpcStudentsClient.csproj
cd GrpcStudentsClient
dotnet add package Google.Protobuf
dotnet add package Grpc.Net.Client
dotnet add package Grpc.Tools
cd ..
We just created a folder names GrpcBasics containing two folders:
- GrpcStudents has a grpc server-side application. We created Models and Data folders and added some packages that allow us to use EF & SQLite
- GrpcStudentsClient is a console app into which was added packages: Google.Protobuf, Grpc.Net.Client and Grpc.Tools
The proto file defines in the GrpcStudents server-side project defines the contract between the server and the client.
# GrpcStudents/Protos/greet.proto
syntax = "proto3";

option csharp_namespace = "GrpcStudents";

package greet;

// The greeting service definition.
service Greeter {
// Sends a greeting
rpc SayHello (HelloRequest) returns (HelloReply);
}

// The request message containing the user's name.
message HelloRequest {
string name = 1;
}

// The response message containing the greetings.
message HelloReply {
string message = 1;
}
GrpcStudents/Services/GreeterService.cs is implementation for SayHello() method
namespace GrpcStudents.Services;

public class GreeterService : Greeter.GreeterBase
{
private readonly ILogger<GreeterService> _logger;
public GreeterService(ILogger<GreeterService> logger)
{
_logger = logger;
}

public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
{
return Task.FromResult(new HelloReply
{
Message = "Hello " + request.Name
});
}
}

If you navigate to the definition of GreeterBase, you will find a generated file named GreetGrpc.cs where the abstract class is defined. This file is regenerated with every build.
When you run the server-side GrpcStudents project, this is what you will see a terminal:

If you point your browser to the appropriate URL, this is what appears:

This tells us that we need to create a client.
Copy the Protos folder from the server project (GrpcStudents) to the client project (GrpcStudentsClient).
In GrpcStudentsClient/Protos/greet.proto, change the namespace to:
option csharp_namespace = "GrpcStudentsClient";
Edit the GrpcStudentsClient.csproj file.
Add the following to GrpcStudentsClient.csproj:
<ItemGroup>
<Protobuf Include="Protos\greet.proto" GrpcServices="Client" />
</ItemGroup>

Build the server and client projects.

Replace code in Program.cs with this:
using Grpc.Net.Client;
using GrpcStudentsClient;

// The port number must match the port of the gRPC server.
using var channel = GrpcChannel.ForAddress("http://localhost:5119");
var client = new Greeter.GreeterClient(channel);
var reply = await client.SayHelloAsync(
new HelloRequest { Name = "Jane Bond" });
Console.WriteLine("Greeting: " + reply.Message);
Console.WriteLine("Press any key to exit...");

Console.ReadLine();
Start the server-side project then the client-side project. This is the output:
Greeting: Hello Jane Bond
What just happened?
We just learned that we could consume a gRPC service by simply copying the proto file and pointing to the correct URL for the service. Let us do something slightly more complicated that involves student data saved in SQLite.
## Database Model
In the server-side GrpcStudents project, add a Student class file in the Models folder with the following content:
public class Student {
public int StudentId { get; set; }
[Required]
public string? FirstName { get; set; }
[Required]
public string? LastName { get; set; }
[Required]
public string? School { get; set; }
}
Add this connection string to the appsettings.json file on the server-side GrpcStudents project:
"ConnectionStrings": {
"DefaultConnection": "DataSource=college.db;Cache=Shared"
},
We will be using the Entity Framework Code First approach. The starting point is to create a database context class. Add a C# class file named SchoolDbContext.cs in the Data folder with the following class code:
public class SchoolDbContext : DbContext {
public DbSet<Student>? Students { get; set; }

public SchoolDbContext(DbContextOptions<SchoolDbContext> options) : base(options) { }

protected override void OnModelCreating(ModelBuilder builder) {
base.OnModelCreating(builder);

builder.Entity<Student>().HasData(
new {
StudentId = 1,
FirstName = "Jane",
LastName = "Smith",
School = "Medicine"
}, new {
StudentId = 2,
FirstName = "John",
LastName = "Fisher",
School = "Engineering"
}, new {
StudentId = 3,
FirstName = "Pamela",
LastName = "Baker",
School = "Food Science"
}, new {
StudentId = 4,
FirstName = "Peter",
LastName = "Taylor",
School = "Mining"
}
);
}
}
Notice the above code is adding four records of seed data into the database.
Add the following code to Program.cs in the server-side GrpcStudents project, right after builder.Services.AddGrpc():
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SchoolDbContext>(options =>
options. UseSqlite(connectionString!));
Remember to build your server-side project before proceeding. Then, from within a terminal window in the GrpcStudents root directory, run the following command to create a migration:
dotnet ef migrations add M1 -o Data/Migrations
The next step is to create the SQLite college.db database file. This is done by running the following command from inside a terminal window at the root folder of the application.
dotnet ef database update
## Students Service
Let us setup our own gRPC students service.
Inside the Protos folder in GrpcServer project, add a new file named students.proto.
The content of students.proto is:
syntax = "proto3";

option csharp_namespace = "GrpcStudentsServer";

package greet;

// The student service definition.
service StudentRemote {
rpc GetStudentInfo (StudentLookupModel) returns (StudentModel);
}

// The request message
message StudentLookupModel {
int32 studentId = 1;
}

// The response message
message StudentModel {
int32 studentId = 1;
string firstName = 2;
string lastName = 3;
string school = 4;
}
Edit GrpcStudentsServer.csproj and add reference to the students.proto file as shown below:
<ItemGroup>
<Protobuf Include="Protos\greet.proto" GrpcServices="Server" />
<Protobuf Include="Protos\students.proto" GrpcServices="Server" />
</ItemGroup>

Build the server-side GrpcStudentsServer project.


Add a class named StudentsService into the GrpcStudents/Services folder. Contents of StudentsService.cs are:
public class StudentsService : StudentRemote.StudentRemoteBase {
private readonly ILogger<StudentsService> _logger;
private readonly SchoolDbContext _context;

public StudentsService(ILogger<StudentsService> logger, SchoolDbContext context) {
_logger = logger;
_context = context;
}

public override Task<StudentModel> GetStudentInfo(StudentLookupModel request, ServerCallContext context) {
StudentModel output = new StudentModel();

var c = _context.Students!.Find(request.StudentId);

_logger.LogInformation("Sending Student response");

if (c != null) {
output.StudentId = c.StudentId;
output.FirstName = c.FirstName;
output.LastName = c.LastName;
output.School = c.School;
}

return Task.FromResult(output);
}
}
On the server-side GrpcStudentsServer project, in Program.cs, add following mapping after app.MapGrpcService<GreeterService>();
app.MapGrpcService<StudentsService>();
Build the server-side GrpcStudents project.


Copy students.proto from GrpcStudentsServer project to GrpcStudentsClient. In GrpcStudentsClient/Protos/students.proto, change the namespace to:
option csharp_namespace = "GrpcStudentsClient";
Just like we did with the server-side .csproj file, edit GrpcStudentsClient.csproj and add reference to the students.proto file as shown below:
<ItemGroup>
<Protobuf Include="Protos\greet.proto" GrpcServices="Client" />
<Protobuf Include="Protos\students.proto" GrpcServices="Client" />
</ItemGroup>

Build both server-side and client-side projects.

Except for the statement with the URL and Console.ReadLine() statement, comment all other code in Main() method on client-side Program.cs.  Add the following code before Console.ReadLine():
var sClient = new StudentRemote.StudentRemoteClient(channel);
var sInput = new StudentLookupModel { StudentId = 3 };
var sReply = await sClient.GetStudentInfoAsync(sInput);
Console.WriteLine($"{sReply.StudentId}, {sReply.FirstName}  {sReply.LastName}, {sReply.School}");
Run server-side then client-side applications. You should see this result on the client-side:

Below is the complete proto file containing CRUD operations:
### GrpsStudents/Protos/students.proto
syntax = "proto3";

option csharp_namespace = "GrpcStudentsServer";

package greet;

// The student service definition.
service StudentRemote {
rpc GetStudentInfo (StudentLookupModel) returns (StudentModel);
rpc InsertStudent (StudentModel) returns (Reply);
rpc UpdateStudent (StudentModel) returns (Reply);
rpc DeleteStudent (StudentLookupModel) returns (Reply);
rpc RetrieveAllStudents (Empty) returns (StudentList);
}

message Reply {
string result = 1;
bool isOk = 2;
}

message Empty {}

// The request message
message StudentLookupModel {
int32 studentId = 1;
}

// The response message
message StudentModel {
int32 studentId = 1;
string firstName = 2;
string lastName = 3;
string school = 4;
}

message StudentList
{
repeated StudentModel items = 1;
}


Build server-side project.


### StudentsService.cs
### Add the following additional methods to StudentsService.cs:
public override Task<Reply> InsertStudent(StudentModel request, ServerCallContext context) {
var c = _context.Students!.Find(request.StudentId);

if (c != null) {
return Task.FromResult(
new Reply() {
Result = $"Student {request.FirstName} {request.LastName} already exists.",
IsOk = false
}
);
}

Student student = new Student() {
StudentId = request.StudentId,
LastName = request.LastName,
FirstName = request.FirstName,
School = request.School,
};

_logger.LogInformation("Sending student response");

try {
_context.Students!.Add(student);
var returnVal = _context.SaveChanges();
} catch (Exception ex) {
_logger.LogInformation(ex.ToString());
}

return Task.FromResult(
new Reply() {
Result = $"Student {request.FirstName} {request.LastName} with ID {student.StudentId} was successfully inserted.",
IsOk = true
}
);
}

public override Task<Reply> UpdateStudent(StudentModel request, ServerCallContext context) {
var c = _context.Students!.Find(request.StudentId);

if (c == null) {
return Task.FromResult(
new Reply() {
Result = $"Student {request.FirstName} {request.LastName} cannot be found.",
IsOk = false
}
);
}

c.FirstName = request.FirstName;
c.LastName = request.LastName;
c.School = request.School;

_logger.LogInformation("Sending Student response");

try {
var returnVal = _context.SaveChanges();
} catch (Exception ex) {
_logger.LogInformation(ex.ToString());
}

return Task.FromResult(
new Reply() {
Result = $"Student {request.FirstName} {request.LastName} was successfully updated.",
IsOk = true
}
);
}

public override Task<Reply> DeleteStudent(StudentLookupModel request, ServerCallContext context) {
var c = _context.Students!.Find(request.StudentId);

if (c == null) {
return Task.FromResult(
new Reply() {
Result = $"Student ID {request.StudentId} cannot be found.",
IsOk = false
}
);
}

_logger.LogInformation("Sending Student response");

try {
_context.Students!.Remove(c);
var returnVal = _context.SaveChanges();
} catch (Exception ex) {
_logger.LogInformation(ex.ToString());
}

return Task.FromResult(
new Reply() {
Result = $"Student with {request.StudentId} was successfully deleted.",
IsOk = true
}
);
}
public override Task<StudentList> RetrieveAllStudents(Empty request, ServerCallContext context) {
_logger.LogInformation("Sending Student response");

StudentList list = new StudentList();

try {
List<StudentModel> studentList = new List<StudentModel>();

var students = _context.Students!.ToList();

foreach (Student c in students) {
studentList.Add(new StudentModel()
{
StudentId = c.StudentId,
FirstName = c.FirstName,
LastName = c.LastName,
School = c.School,
});
}

list.Items.AddRange(studentList);
} catch (Exception ex) {
_logger.LogInformation(ex.ToString());
}

return Task.FromResult(list);
}



Build client-side project.

Here is some additional code for testing the other operations in Program.cs:

/*
// ########################### Insert Student
StudentModel newStudent = new StudentModel()
{
FirstName = "Jim",
LastName = "Cox",
School = "Multimedia",
};
var replyNewStudent = sClient.InsertStudent(newStudent);
Console.WriteLine($"Result={replyNewStudent.Result} & isOk={replyNewStudent.IsOk}");
*/

/*
// ########################### Update Student
StudentModel updateStudent = new StudentModel()
{
StudentId = 2,
FirstName = "Jane",
LastName = "Jones",
School = "Pharmacy",
};
var replyUpdateStudent = sClient.UpdateStudent(updateStudent);
Console.WriteLine($"Result={replyUpdateStudent.Result} & isOk={replyUpdateStudent.IsOk}");
*/

/*
// ########################### Delete Student
var deleteLookupModel = new StudentLookupModel();
deleteLookupModel.StudentId = 5;
var replyDeleteStudent = sClient.DeleteStudent(deleteLookupModel);
*/


// ########################### Display all students
var replyAllStudents = sClient.RetrieveAllStudents(new Empty());
foreach (var item in replyAllStudents.Items)
{
Console.WriteLine($"{item.StudentId} {item.FirstName} {item.LastName} {item.School}");
}

## Dependency Injection in ASP.NET app
Add this package:
dotnet add package Grpc.Net.ClientFactory;
Then, add this code to Program.cs:

// add grpc client in Program.cs
builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(options =>
{
options.Address = new Uri("http://localhost:5099");
});
Inject in views:
@inject StudentRemote.StudentRemoteClient _grpcClient
Render mode in views:
@rendermode InteractiveServer
## Conclusion
- gRPC is more efficient (faster) than Web API. Typical use cases:
- IOT
Microservices
- Streaming capability.
- Not all clients (mobile, web, etc) are capable of consuming gRPC.
- Cross-language communication: gRPC is a standard so a service written in C# can be consumed by any other language.