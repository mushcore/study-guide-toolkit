# gRPC Research for COMP4870 Final Exam (7 marks)

**Source materials:** gRPC.pptx, gRPC_EF_SQLite_VSCode_SCRIPT.docx, W09 gRPC lab instructions

---

## 1. Topic Summaries

### What is gRPC?

**Definition:** gRPC is a popular open-source RPC (Remote Procedure Call) framework built with modern technologies, managed by the Cloud Native Computing Foundation.

**Core Technologies:**
- **HTTP/2** — Multiplexing, persistent connections, binary framing
- **Protocol Buffers (Protobuf)** — Binary serialization format, more efficient than JSON/XML
- **Platform independent** — Works across languages (C#, Java, Python, Go, etc.)

**Key Characteristics:**
- Contract-first design (proto files define the interface)
- Content is binary (optimized for computers, not humans)
- High performance and efficient (smaller payload size vs. REST)
- Hides remoting complexity from developer

### gRPC vs REST vs SOAP

| Aspect | gRPC | REST API | SOAP |
|--------|------|----------|------|
| **Contract** | Proto file (contract-first) | Content-first (URL, method, JSON) | WSDL/XML |
| **Content** | Binary (Protobuf) | Human-readable (JSON/XML) | XML |
| **Protocol** | HTTP/2 | HTTP/1.1 | HTTP/SMTP |
| **Emphasis** | RPC calls | HTTP semantics | Web services |
| **Complexity** | Hides remoting | Emphasizes HTTP | Enterprise-focused |

### Call Types (4 Types of gRPC Communication)

1. **Unary RPC** — Simple request-response (client sends one message, server returns one)
2. **Server Streaming** — Client sends one request, server returns stream of messages
3. **Client Streaming** — Client sends stream of messages, server returns one response
4. **Bidirectional Streaming** — Both client and server send streams to each other

### TLS by Default

- gRPC uses **TLS (Transport Layer Security)** by default over HTTPS
- Encryption is automatic in production
- Development: can use HTTP without encryption (for testing only)

---

## 2. Key Concepts

### Protocol Buffers & Proto Files

**Proto syntax:** `syntax = "proto3";`

**Components:**
- **package** — Namespace for messages/services
- **option csharp_namespace** — C# namespace for generated code
- **service** — Defines RPC methods
- **rpc** — Individual remote procedure (keyword)
- **message** — Request/response data structure
- **Field tags** — Positive integers (1, 2, 3...) for binary serialization

**Field Types:**
- Numeric: `int32`, `int64`, `float`, `double`
- Text: `string`
- Boolean: `bool`
- Collections: `repeated` (maps to List<T>)
- Nested messages: `message TypeName { ... }`
- Enumerations: `enum EnumName { ... }`

### Proto Syntax Example

```protobuf
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

message Reply {
  string result = 1;
  bool isOk = 2;
}

message Empty {}

message StudentList {
  repeated StudentModel items = 1;
}
```

### Code Generation

**protoc** (Protocol Compiler) — Generates C# code from .proto files
- Converts .proto to C# classes (messages, services, stubs)
- Creates base classes for server implementation
- Generates client classes for consumption

**Grpc.Tools NuGet package** — Integrates protoc into build process (MSBuild)

### .csproj Configuration

**Server project:**
```xml
<ItemGroup>
  <Protobuf Include="Protos\greet.proto" GrpcServices="Server" />
  <Protobuf Include="Protos\students.proto" GrpcServices="Server" />
</ItemGroup>
```

**Client project:**
```xml
<ItemGroup>
  <Protobuf Include="Protos\greet.proto" GrpcServices="Client" />
  <Protobuf Include="Protos\students.proto" GrpcServices="Client" />
</ItemGroup>
```

### Server Implementation Pattern

**Base class inheritance:**
```csharp
public class StudentsService : StudentRemote.StudentRemoteBase
{
  private readonly ILogger<StudentsService> _logger;
  private readonly SchoolDbContext _context;

  public StudentsService(ILogger<StudentsService> logger, SchoolDbContext context)
  {
    _logger = logger;
    _context = context;
  }

  public override Task<StudentModel> GetStudentInfo(StudentLookupModel request, ServerCallContext context)
  {
    StudentModel output = new StudentModel();
    var student = _context.Students!.Find(request.StudentId);
    
    if (student != null)
    {
      output.StudentId = student.StudentId;
      output.FirstName = student.FirstName;
      output.LastName = student.LastName;
      output.School = student.School;
    }
    
    return Task.FromResult(output);
  }
}
```

**Key elements:**
- Inherits from `[ServiceName].ServiceNameBase` (generated from proto)
- `override` Task-returning methods for each rpc
- Parameter 1: Request message type (from proto)
- Parameter 2: `ServerCallContext` (provides context, cancellation, metadata)
- Return value: `Task<ResponseType>`

### Server Configuration (Program.cs)

```csharp
// Add gRPC services
builder.Services.AddGrpc();

// Add database context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SchoolDbContext>(options =>
  options.UseSqlite(connectionString!));

// Map gRPC services
app.MapGrpcService<GreeterService>();
app.MapGrpcService<StudentsService>();

app.Run();
```

### Client Implementation Pattern

```csharp
// Create channel (connection)
using var channel = GrpcChannel.ForAddress("https://localhost:5001");

// Create client
var client = new Greeter.GreeterClient(channel);

// Call unary RPC
var reply = await client.SayHelloAsync(
  new HelloRequest { Name = "Jane Bond" });

Console.WriteLine("Greeting: " + reply.Message);

// Call another service
var sClient = new StudentRemote.StudentRemoteClient(channel);
var sInput = new StudentLookupModel { StudentId = 3 };
var sReply = await sClient.GetStudentInfoAsync(sInput);
Console.WriteLine($"{sReply.StudentId}, {sReply.FirstName} {sReply.LastName}, {sReply.School}");
```

### Dependency Injection (Client Factory)

**Add package:**
```
dotnet add package Grpc.Net.ClientFactory
```

**Register in Program.cs:**
```csharp
builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(options =>
{
  options.Address = new Uri("http://localhost:5099");
});
```

**Inject in views/components:**
```csharp
@inject StudentRemote.StudentRemoteClient _grpcClient
@rendermode InteractiveServer
```

### Streaming Patterns

**Server Streaming** — Server sends multiple messages:
```csharp
public override async Task RetrieveAllStudents(
  Empty request, 
  IServerStreamWriter<StudentModel> responseStream,
  ServerCallContext context)
{
  var students = _context.Students!.ToList();
  foreach (var student in students)
  {
    await responseStream.WriteAsync(new StudentModel { 
      StudentId = student.StudentId,
      FirstName = student.FirstName
    });
  }
}
```

**Client Streaming** — Client sends multiple messages:
```csharp
public override async Task<Reply> BulkInsertStudents(
  IAsyncStreamReader<StudentModel> requestStream,
  ServerCallContext context)
{
  int count = 0;
  await foreach (var student in requestStream.ReadAllAsync())
  {
    _context.Students!.Add(new Student { ... });
    count++;
  }
  await _context.SaveChangesAsync();
  return new Reply { Result = $"Inserted {count} students", IsOk = true };
}
```

**Bidirectional Streaming** — Both directions:
```csharp
public override async Task EchoStream(
  IAsyncStreamReader<Message> requestStream,
  IServerStreamWriter<Message> responseStream,
  ServerCallContext context)
{
  await foreach (var message in requestStream.ReadAllAsync())
  {
    await responseStream.WriteAsync(new Message { Content = message.Content });
  }
}
```

---

## 3. Code Walkthrough: Building a gRPC Server + Client

### Step 1: Project Setup

```bash
mkdir GrpcBasics
cd GrpcBasics
dotnet new sln
dotnet new grpc -o GrpcStudentsServer
dotnet sln add ./GrpcStudentsServer/GrpcStudentsServer.csproj
cd GrpcStudentsServer
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
```

### Step 2: Define Proto Contract (Server)

**File: GrpcStudentsServer/Protos/students.proto**

```protobuf
syntax = "proto3";

option csharp_namespace = "GrpcStudentsServer";

package greet;

service StudentRemote {
  rpc GetStudentInfo (StudentLookupModel) returns (StudentModel);
  rpc InsertStudent (StudentModel) returns (Reply);
}

message StudentLookupModel {
  int32 studentId = 1;
}

message StudentModel {
  int32 studentId = 1;
  string firstName = 2;
  string lastName = 3;
  string school = 4;
}

message Reply {
  string result = 1;
  bool isOk = 2;
}
```

### Step 3: Configure .csproj (Both Server & Client)

**GrpcStudentsServer.csproj:**
```xml
<ItemGroup>
  <Protobuf Include="Protos\students.proto" GrpcServices="Server" />
</ItemGroup>
```

**GrpcStudentsClient.csproj:**
```xml
<ItemGroup>
  <Protobuf Include="Protos\students.proto" GrpcServices="Client" />
</ItemGroup>
```

### Step 4: Implement Server Service

**File: GrpcStudentsServer/Services/StudentsService.cs**

```csharp
namespace GrpcStudentsServer.Services;

public class StudentsService : StudentRemote.StudentRemoteBase
{
  private readonly ILogger<StudentsService> _logger;
  private readonly SchoolDbContext _context;

  public StudentsService(ILogger<StudentsService> logger, SchoolDbContext context)
  {
    _logger = logger;
    _context = context;
  }

  public override Task<StudentModel> GetStudentInfo(StudentLookupModel request, ServerCallContext context)
  {
    _logger.LogInformation($"Retrieving student {request.StudentId}");
    var student = _context.Students!.Find(request.StudentId);
    
    var output = new StudentModel();
    if (student != null)
    {
      output.StudentId = student.StudentId;
      output.FirstName = student.FirstName;
      output.LastName = student.LastName;
      output.School = student.School;
    }
    
    return Task.FromResult(output);
  }

  public override Task<Reply> InsertStudent(StudentModel request, ServerCallContext context)
  {
    try
    {
      var student = new Student
      {
        StudentId = request.StudentId,
        FirstName = request.FirstName,
        LastName = request.LastName,
        School = request.School
      };
      _context.Students!.Add(student);
      _context.SaveChanges();
      
      return Task.FromResult(new Reply 
      { 
        Result = $"Student {request.FirstName} {request.LastName} inserted", 
        IsOk = true 
      });
    }
    catch (Exception ex)
    {
      _logger.LogError(ex.ToString());
      return Task.FromResult(new Reply { Result = "Error inserting student", IsOk = false });
    }
  }
}
```

### Step 5: Configure Server (Program.cs)

**File: GrpcStudentsServer/Program.cs**

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

// Add gRPC
builder.Services.AddGrpc();

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SchoolDbContext>(options =>
  options.UseSqlite(connectionString!));

var app = builder.Build();

// Map gRPC service
app.MapGrpcService<StudentsService>();

app.Run();
```

### Step 6: Configure Client (Program.cs)

**File: GrpcStudentsClient/Program.cs**

```csharp
using Grpc.Net.Client;
using GrpcStudentsClient;

// Create channel
using var channel = GrpcChannel.ForAddress("http://localhost:5119");

// Create client
var client = new StudentRemote.StudentRemoteClient(channel);

// Call GetStudentInfo
var request = new StudentLookupModel { StudentId = 1 };
var reply = await client.GetStudentInfoAsync(request);

Console.WriteLine($"Student: {reply.FirstName} {reply.LastName}, School: {reply.School}");

// Call InsertStudent
var newStudent = new StudentModel
{
  StudentId = 5,
  FirstName = "John",
  LastName = "Doe",
  School = "Engineering"
};
var insertReply = await client.InsertStudentAsync(newStudent);

Console.WriteLine($"Insert Result: {insertReply.Result} (IsOk: {insertReply.IsOk})");

Console.ReadLine();
```

### Step 7: Build & Run

```bash
# Build both projects
dotnet build

# Terminal 1: Start server
cd GrpcStudentsServer
dotnet run

# Terminal 2: Start client
cd GrpcStudentsClient
dotnet run
```

---

## 4. Proto Field Types & Tag Numbers

### Field Types Reference

| Type | C# Type | Size | Usage |
|------|---------|------|-------|
| `int32` | int | Variable | Negative numbers (use sint32 for negatives) |
| `int64` | long | Variable | Large integers |
| `uint32` | uint | Variable | Positive integers only |
| `uint64` | ulong | Variable | Large positive integers |
| `sint32` | int | Variable | Efficient for negative int32 |
| `sint64` | long | Variable | Efficient for negative int64 |
| `fixed32` | uint | 4 bytes | Fixed size (less efficient) |
| `fixed64` | ulong | 8 bytes | Fixed size (less efficient) |
| `float` | float | 4 bytes | Single-precision floating point |
| `double` | double | 8 bytes | Double-precision floating point |
| `bool` | bool | 1 byte | True/false |
| `string` | string | Variable | UTF-8 text |
| `bytes` | ByteString | Variable | Raw bytes |
| `repeated` | List<T> | Variable | Collections |
| `message` | Message type | Variable | Nested message |
| `enum` | Enum | Variable | Enumeration |

### Field Tags

**Rules:**
- Must be positive integers (1-536,870,911)
- Tags 1-15 use 1 byte in encoding (most efficient)
- Tags 16-2047 use 2 bytes
- Never reuse tag numbers (breaks backward compatibility)
- Order in proto file does NOT matter for serialization
- Tag order DOES matter for binary format

**Example:**
```protobuf
message Person {
  int32 id = 1;           // tag 1
  string name = 2;        // tag 2
  string email = 3;       // tag 3
  repeated string phones = 4;  // tag 4
}
```

---

## 5. NuGet Packages & Dependencies

### Essential Packages

**Server-side project:**
```xml
<PackageReference Include="Google.Protobuf" Version="3.x.x" />
<PackageReference Include="Grpc.AspNetCore" Version="2.x.x" />
<PackageReference Include="Grpc.Tools" Version="2.x.x" />
```

**Client-side (Console) project:**
```xml
<PackageReference Include="Google.Protobuf" Version="3.x.x" />
<PackageReference Include="Grpc.Net.Client" Version="2.x.x" />
<PackageReference Include="Grpc.Tools" Version="2.x.x" />
```

**Client-side (ASP.NET) with DI:**
```xml
<PackageReference Include="Grpc.Net.ClientFactory" Version="2.x.x" />
```

**Entity Framework (for database scenarios):**
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.x.x" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.x.x" />
```

---

## 6. Streaming Implementation Details

### IAsyncStreamReader (Receiving Stream)

```csharp
// Read all messages from client stream
await foreach (var request in requestStream.ReadAllAsync())
{
  // Process each message
  ProcessMessage(request);
}

// Alternative: read one at a time
while (await requestStream.MoveNext())
{
  var message = requestStream.Current;
  // Process message
}
```

### IServerStreamWriter (Sending Stream)

```csharp
// Send messages to client
await responseStream.WriteAsync(new Response { ... });
await responseStream.WriteAsync(new Response { ... });
// Stream ends when method completes
```

### Bidirectional Pattern

```csharp
public override async Task EchoServiceStream(
  IAsyncStreamReader<Message> requestStream,
  IServerStreamWriter<Message> responseStream,
  ServerCallContext context)
{
  await foreach (var message in requestStream.ReadAllAsync())
  {
    // Echo back to client
    await responseStream.WriteAsync(message);
  }
}
```

---

## 7. Exam Traps & Common Mistakes

### Trap 1: Field Tags vs Order
**Mistake:** Thinking field order in proto file affects serialization
**Reality:** Field TAGS determine binary order, not declaration order. Tags must be unique and permanent.

### Trap 2: Protocol Confusion
**Mistake:** Thinking gRPC methods are REST endpoints (using GET/POST/URLs)
**Reality:** gRPC is method-based RPC, not HTTP-resource-based. Methods are called directly on client objects.

### Trap 3: protoc Role
**Mistake:** Confusing what protoc does
**Reality:** protoc ONLY generates C# classes from .proto files. It doesn't compile services or handle deployment.

### Trap 4: TLS Default
**Mistake:** Forgetting TLS is enabled by default
**Reality:** Production gRPC uses HTTPS with TLS. Development can use HTTP (test only).

### Trap 5: HTTP/2 Requirement
**Mistake:** Assuming gRPC works over HTTP/1.1
**Reality:** gRPC REQUIRES HTTP/2 for multiplexing and streaming. This is enforced by framework.

### Trap 6: Client Channel Reuse
**Mistake:** Creating new channel for every call
**Reality:** Channels are expensive to create. Reuse them: `using var channel = GrpcChannel.ForAddress(...)`

### Trap 7: Message Null Defaults
**Mistake:** Assuming unset message fields are null
**Reality:** In proto3, unset fields have zero values (0, "", false, empty list). No null concept.

### Trap 8: Streaming Completion
**Mistake:** Not understanding when stream ends
**Reality:** Stream ends when method completes. Client must handle EOF gracefully.

### Trap 9: Service Base Inheritance
**Mistake:** Forgetting to inherit from generated `[ServiceName].ServiceNameBase`
**Reality:** Implementation class MUST inherit from base class generated by protoc.

### Trap 10: csproj Configuration
**Mistake:** Missing `<Protobuf>` ItemGroup in .csproj
**Reality:** MSBuild won't generate code without explicit proto file configuration in .csproj.

---

## 8. SuperMemo Flashcards (18 Cards)

### Card 1
**Q:** What is gRPC and what does the acronym mean?
**A:** gRPC = "gRPC Remote Procedure Calls". It's a high-performance, contract-first RPC framework built on HTTP/2 and Protocol Buffers, maintained by CNCF.

### Card 2
**Q:** What are the three core technologies that gRPC is built on?
**A:** (1) HTTP/2 for multiplexing and persistent connections, (2) Protocol Buffers for binary serialization, (3) Language-agnostic design for cross-platform support.

### Card 3
**Q:** Name the four types of gRPC call patterns.
**A:** (1) Unary RPC (request-response), (2) Server streaming (one request, many responses), (3) Client streaming (many requests, one response), (4) Bidirectional streaming (both directions).

### Card 4
**Q:** What is a .proto file and what does it define?
**A:** A protocol buffer definition file that specifies the contract between client and server, including service methods (rpc), request messages, and response messages.

### Card 5
**Q:** What is the role of protoc?
**A:** protoc (Protocol Compiler) is a tool that generates C# code (classes, services, stubs) from .proto files. It's integrated via Grpc.Tools NuGet package.

### Card 6
**Q:** In a proto message, what is a field tag and why is it important?
**A:** A field tag is a positive integer (1, 2, 3...) that uniquely identifies a field. Tags determine binary serialization format and must never be reused (breaks compatibility).

### Card 7
**Q:** What does the `repeated` keyword do in a proto message?
**A:** `repeated` defines a field as a collection that maps to List<T> in C#. Example: `repeated StudentModel items = 1;`

### Card 8
**Q:** What three things must be set in .csproj for proto compilation?
**A:** (1) Include path to .proto file, (2) GrpcServices attribute ("Server", "Client", or "Both"), (3) Grpc.Tools NuGet package.

### Card 9
**Q:** What class must a server-side gRPC service implementation inherit from?
**A:** It must inherit from `[ServiceName].ServiceNameBase` (generated by protoc). Methods override Task-returning async methods.

### Card 10
**Q:** What are the two parameters for every gRPC server method?
**A:** (1) Request message type (from proto), (2) ServerCallContext (provides context, cancellation token, metadata).

### Card 11
**Q:** How do you create a gRPC client channel and client object?
**A:** `using var channel = GrpcChannel.ForAddress("https://localhost:5001");` then `var client = new ServiceName.ServiceNameClient(channel);`

### Card 12
**Q:** What is the syntax for calling a gRPC unary method from a client?
**A:** `var response = await client.MethodNameAsync(new RequestMessage { ... });` or synchronously without Async suffix.

### Card 13
**Q:** How do you enable dependency injection for gRPC clients in ASP.NET?
**A:** (1) Add `Grpc.Net.ClientFactory` package, (2) Register with `builder.Services.AddGrpcClient<ServiceClient>()`, (3) Inject into components with `@inject ServiceClient _client`.

### Card 14
**Q:** In server-side Program.cs, what two methods register and map gRPC services?
**A:** `builder.Services.AddGrpc();` (registers services) and `app.MapGrpcService<ServiceImpl>();` (maps to endpoint).

### Card 15
**Q:** What does the `option csharp_namespace` do in a proto file?
**A:** Sets the C# namespace for generated code. Example: `option csharp_namespace = "GrpcStudentsServer";`

### Card 16
**Q:** How do you implement server streaming in gRPC?
**A:** Parameter is `IServerStreamWriter<ResponseType> responseStream`. Use `await responseStream.WriteAsync(message);` in loop, stream ends when method completes.

### Card 17
**Q:** What is `ServerCallContext` and what does it provide?
**A:** It provides request context: cancellation token (`context.CancellationToken`), request metadata, deadline, and method name for logging/tracing.

### Card 18
**Q:** What is the difference between gRPC (contract-first) and REST (content-first)?
**A:** gRPC defines contract in .proto (binary, optimized), REST defines in HTTP methods/URLs (human-readable, emphasizes HTTP semantics).

---

## 9. Practice MCQs (6 Questions)

### MCQ 1
**Which statement about gRPC is FALSE?**

A) gRPC uses HTTP/2 for multiplexing  
B) gRPC messages are in JSON format  
C) gRPC is maintained by CNCF  
D) gRPC is contract-first using proto files  

**Answer:** B (WRONG: gRPC uses binary Protobuf, not JSON)

---

### MCQ 2
**What must a server-side gRPC service class inherit from?**

A) `GrpcService`  
B) `ServiceBase`  
C) `[ServiceName].ServiceNameBase`  
D) `IAsyncStreamReader`  

**Answer:** C (Generated base class from protoc)

---

### MCQ 3
**In a proto file, what does the field tag number represent?**

A) The order fields appear in the message  
B) The unique identifier for binary serialization  
C) The HTTP method number  
D) The priority of the field  

**Answer:** B (Tags are immutable identifiers for backward compatibility)

---

### MCQ 4
**Which NuGet package integrates protoc into the Visual Studio build process?**

A) `Google.Protobuf`  
B) `Grpc.Tools`  
C) `Grpc.Net.Client`  
D) `Grpc.AspNetCore`  

**Answer:** B (Grpc.Tools provides protoc integration)

---

### MCQ 5
**What does `repeated` mean in a proto message definition?**

A) The field must be sent multiple times  
B) The field is optional  
C) The field is a collection (List<T>)  
D) The field is encrypted  

**Answer:** C (repeated = collection, maps to List in C#)

---

### MCQ 6
**In the .csproj file, what does `GrpcServices="Client"` indicate?**

A) Generate both server and client code  
B) Generate only client-side code (no service base class)  
C) The project is a console client  
D) Use HTTP/1.1 instead of HTTP/2  

**Answer:** B (Omits service base class, generates only client stub)

---

## 10. Coding Challenge (Template)

### Challenge: Build a Calculator gRPC Service

**Requirement:** Create a gRPC service that performs basic arithmetic operations on two integers.

**Your Task:**
1. Write the proto definition (students.proto) with:
   - Service named `CalculatorService`
   - RPC method: `Add(int32 a, int32 b)` returns `Result`
   - RPC method: `Subtract(int32 a, int32 b)` returns `Result`
   - RPC method: `Multiply(int32 a, int32 b)` returns `Result`
   - Message `Result` containing: `int32 result` and `string operation`

2. Implement the server service class with all three methods

3. Configure Program.cs to register and map the service

4. Create a client that calls all three operations and prints results

**Answer Template:**

**Proto file (calculator.proto):**
```protobuf
syntax = "proto3";

option csharp_namespace = "CalculatorServer";

package calculator;

service CalculatorService {
  rpc Add (OperationRequest) returns (Result);
  rpc Subtract (OperationRequest) returns (Result);
  rpc Multiply (OperationRequest) returns (Result);
}

message OperationRequest {
  int32 a = 1;
  int32 b = 2;
}

message Result {
  int32 result = 1;
  string operation = 2;
}
```

**Server implementation (CalculatorService.cs):**
```csharp
public class CalculatorService : CalculatorService.CalculatorServiceBase
{
  public override Task<Result> Add(OperationRequest request, ServerCallContext context)
  {
    return Task.FromResult(new Result 
    { 
      Result = request.A + request.B, 
      Operation = "Add" 
    });
  }

  public override Task<Result> Subtract(OperationRequest request, ServerCallContext context)
  {
    return Task.FromResult(new Result 
    { 
      Result = request.A - request.B, 
      Operation = "Subtract" 
    });
  }

  public override Task<Result> Multiply(OperationRequest request, ServerCallContext context)
  {
    return Task.FromResult(new Result 
    { 
      Result = request.A * request.B, 
      Operation = "Multiply" 
    });
  }
}
```

**Program.cs (Server):**
```csharp
builder.Services.AddGrpc();
var app = builder.Build();
app.MapGrpcService<CalculatorService>();
app.Run();
```

**Client (Program.cs):**
```csharp
using var channel = GrpcChannel.ForAddress("http://localhost:5119");
var client = new CalculatorService.CalculatorServiceClient(channel);

var addResult = await client.AddAsync(new OperationRequest { A = 10, B = 5 });
Console.WriteLine($"{addResult.Operation}: 10 + 5 = {addResult.Result}");

var subResult = await client.SubtractAsync(new OperationRequest { A = 10, B = 5 });
Console.WriteLine($"{subResult.Operation}: 10 - 5 = {subResult.Result}");

var mulResult = await client.MultiplyAsync(new OperationRequest { A = 10, B = 5 });
Console.WriteLine($"{mulResult.Operation}: 10 * 5 = {mulResult.Result}");
```

---

## 11. Key Takeaways for Exam

1. **Know the four call types** — Unary, server streaming, client streaming, bidirectional
2. **Proto syntax is contract** — Field tags are immutable, order doesn't matter for serialization
3. **Server inherits from base** — ServiceName.ServiceNameBase is mandatory
4. **Client uses channels** — Create once, reuse (they're expensive)
5. **HTTP/2 is required** — gRPC cannot work over HTTP/1.1
6. **TLS by default** — Production uses HTTPS automatically
7. **Packages matter** — Client vs Server .csproj GrpcServices attribute controls code generation
8. **Program.cs setup** — AddGrpc() and MapGrpcService<T>() are the two essentials
9. **Streaming uses interfaces** — IAsyncStreamReader, IServerStreamWriter for streaming methods
10. **DI with ClientFactory** — AddGrpcClient<T>() for ASP.NET injection

