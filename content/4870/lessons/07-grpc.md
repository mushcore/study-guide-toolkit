---
n: 7
id: grpc
title: "gRPC — proto contracts, server, client"
hook: "Write .proto first. Inherit generated Base class. Register with AddGrpc + MapGrpcService."
tags: [grpc, protobuf, asp-net-core]
module: "Distributed Services & Orchestration"
source: "Labs/W09 gRPC/GrpcBasics/GrpcStudentsServer/ + BlazorGrpcClient/ + GrpcBasics.AppHost/"
bloom_levels: [understand, apply]
related: [aspire]
---

## The `.proto` contract (W09 lab)

```proto
syntax = "proto3";
option csharp_namespace = "GrpcStudentsServer";
package greet;

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

message StudentLookupModel {
  int32 studentId = 1;
}

message StudentModel {
  int32 studentId = 1;
  string firstName = 2;
  string lastName = 3;
  string school = 4;
}

message StudentList {
   repeated StudentModel items = 1;
}
```

Keywords:

| Keyword | Purpose |
|---|---|
| `syntax = "proto3";` | Version pin |
| `option csharp_namespace = "X";` | Generated C# namespace |
| `service` | gRPC service declaration |
| `rpc` | One method. Shape: `rpc Name (Request) returns (Response);` |
| `message` | Structured payload. Each field has type + name + **tag** |
| `repeated T` | List — maps to `RepeatedField<T>` with `.Add(...)` |
| `Empty` | Zero-field message for "no input" rpc |

## Field tags — permanent wire contract

- Tags 1–15 encode in 1 byte; 16+ take 2 bytes. Put hot fields in 1–15.
- Tags are permanent. Never reuse. `reserved 2;` marks removed slots.
- Unset proto3 scalars = zero-values (`0`, `""`, `false`). No `null`.

## `.csproj` — client vs server

```xml
<ItemGroup>
  <Protobuf Include="Protos\students.proto" GrpcServices="Server" />
</ItemGroup>
```

`GrpcServices` controls code generation: `"Server"` for service implementations, `"Client"` for callable stubs, `"Both"` when one project hosts both roles.

## Server — inherit + override

```cs
using Grpc.Core;

public class StudentsService : StudentRemote.StudentRemoteBase
{
    private readonly ILogger<StudentsService> _logger;
    private readonly SchoolDbContext _context;

    public StudentsService(ILogger<StudentsService> logger, SchoolDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public override Task<StudentModel> GetStudentInfo(
        StudentLookupModel request, ServerCallContext context)
    {
        var c = _context.Students!.Find(request.StudentId);
        if (c is null) return Task.FromResult(new StudentModel());

        return Task.FromResult(new StudentModel {
            StudentId = c.StudentId,
            FirstName = c.FirstName,
            LastName = c.LastName,
            School = c.School
        });
    }

    public override Task<Reply> InsertStudent(StudentModel request, ServerCallContext context)
    {
        var s = new Student {
            StudentId = request.StudentId,
            LastName = request.LastName,
            FirstName = request.FirstName,
            School = request.School,
        };
        _context.Students!.Add(s);
        _context.SaveChanges();

        return Task.FromResult(new Reply {
            Result = $"Student {request.FirstName} inserted.",
            IsOk = true
        });
    }
}
```

Three rules:

1. Inherit from `[Service].[Service]Base` (e.g. `StudentRemote.StudentRemoteBase`).
2. Override takes `(Request, ServerCallContext)` — the context is NOT optional.
3. Return `Task<Response>` — `Task.FromResult(...)` for sync; `async/await` for awaiting bodies.

## Server streaming override

```cs
public override async Task RetrieveAllStudents(
    Empty request,
    IServerStreamWriter<StudentModel> responseStream,
    ServerCallContext context)
{
    foreach (var s in _context.Students!)
        await responseStream.WriteAsync(new StudentModel { /* ... */ });
}
```

Streaming: return type `Task` (no response), extra `IServerStreamWriter<T>` parameter.

## Server — `Program.cs`

```cs
var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddGrpc();
builder.Services.AddDbContext<SchoolDbContext>(opts =>
    opts.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")!));

var app = builder.Build();
app.MapGrpcService<StudentsService>();
app.MapDefaultEndpoints();
app.Run();
```

## Client — DI + Aspire logical name

From `BlazorGrpcClient/Program.cs`:

```cs
builder.AddServiceDefaults();
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(options =>
{
    options.Address = new Uri("http://backend");       // Aspire logical name
});
```

Blazor page consumes via `@inject`:

```cs
@page "/students"
@rendermode InteractiveServer
@inject StudentRemote.StudentRemoteClient _grpc

@code {
    protected override async Task OnInitializedAsync()
    {
        var reply = await _grpc.GetStudentInfoAsync(
            new StudentLookupModel { StudentId = 3 });
    }
}
```

## AppHost wiring

```cs
var builder = DistributedApplication.CreateBuilder(args);

var grpc = builder.AddProject<Projects.GrpcStudentsServer>("backend");
builder.AddProject<Projects.BlazorGrpcClient>("frontend")
    .WithReference(grpc).WaitFor(grpc);

builder.Build().Run();
```

The `http://backend` URL in the client resolves to whichever port gRPC server bound to — Aspire service discovery handles it.

> **Q:** Blazor client project has `<Protobuf Include="Protos\students.proto" GrpcServices="Server" />`. You get "`StudentRemoteClient` could not be found." Why?
> **A:** `GrpcServices="Server"` generates only the server base class. Flip to `GrpcServices="Client"`.

> **Pitfall**
> gRPC requires HTTP/2. Kestrel misconfigured for HTTP/1.1 → cryptic connection error, not "protocol mismatch."

> **Pitfall**
> Forgetting `override` on a service method silently shadows the base. Server compiles, starts, but clients get `RpcException: UNIMPLEMENTED`.

> **Takeaway**
> `.proto` is the contract (`syntax = "proto3"` + `service` + `rpc` + `message`). Server: inherit `[Service].[Service]Base`, override with `(Request, ServerCallContext)` → `Task<Response>`. Register: `AddGrpc()` + `MapGrpcService<T>()`. Client: `.csproj` `GrpcServices="Client"` + `AddGrpcClient<T>(opts => opts.Address = new Uri("http://backend"))`. Aspire logical name for service discovery.
