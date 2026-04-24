---
n: 11
id: grpc-server-implementation
title: "gRPC server implementation — override the generated base class"
hook: "Inherit from the generated `ServiceBase`; override one async method per `rpc`."
tags: [grpc, server, asp-net-core]
module: "Distributed Services & Orchestration"
source: "notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx; Labs/W09 gRPC/; research-grpc.md"
bloom_levels: [remember, understand, apply]
related: [grpc-proto-contracts, grpc-client-consumption, aspire-apphost]
---

## One class, one override per `rpc`

Given the `StudentRemote` service in your `.proto`, `Grpc.Tools` generates an abstract base class named `StudentRemote.StudentRemoteBase` with one virtual method per `rpc`. Your job as server author: inherit and override.

```cs
public class StudentsService : StudentRemote.StudentRemoteBase
{
    private readonly SchoolDbContext _context;

    public StudentsService(SchoolDbContext context) => _context = context;

    public override Task<StudentModel> GetStudentInfo(
        StudentLookupModel request,
        ServerCallContext context)
    {
        var student = _context.Students!.Find(request.StudentId);
        if (student is null) return Task.FromResult(new StudentModel());

        return Task.FromResult(new StudentModel
        {
            StudentId = student.StudentId,
            FirstName = student.FirstName,
            LastName  = student.LastName,
            School    = student.School
        });
    }
}
```

Three non-negotiable shape rules:

1. **Inherit from `[Service].[Service]Base`.** The name mirrors the `service` keyword in `.proto`, plus `Base`.
2. **Every overridden method takes two parameters:** the request message type, then `ServerCallContext`. The second parameter is not optional — it carries cancellation tokens, deadlines, metadata, and peer info.
3. **The return type is `Task<Response>` or `Task` for streaming methods.** Use `Task.FromResult(...)` to wrap a synchronous result; use `async/await` when the body calls anything async (EF Core, HTTP, file I/O).

Miss any of these and the C# compiler flags the method as not matching an `override` target.

## Wire the service in `Program.cs`

Two calls matter:

```cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();                           // 1. register gRPC stack
builder.Services.AddDbContext<SchoolDbContext>(opts =>
    opts.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")!));

var app = builder.Build();

app.MapGrpcService<StudentsService>();                // 2. route requests to your service
app.Run();
```

`AddGrpc()` registers framework types. `MapGrpcService<T>()` tells ASP.NET Core routing: requests hitting this app whose HTTP/2 headers encode a `/StudentRemote/...` path land in your `StudentsService`. Register one `MapGrpcService` per service — the same app can host many.

## Streaming overrides look a little different

For a server-streaming method (`rpc RetrieveAllStudents (Empty) returns (stream StudentModel);`), the override signature changes:

```cs
public override async Task RetrieveAllStudents(
    Empty request,
    IServerStreamWriter<StudentModel> responseStream,
    ServerCallContext context)
{
    foreach (var s in _context.Students!)
    {
        await responseStream.WriteAsync(new StudentModel { /* … */ });
    }
}
```

The return type drops to `Task` (no response object) and a third parameter `IServerStreamWriter<T>` takes its place. You write each message and the framework frames it on the wire.

> **Q:** Your service compiles and runs, but the client times out on the first call. The Kestrel logs show "HTTP/1.1 request rejected." What is the root cause?
> **A:** gRPC requires HTTP/2. Something in your Kestrel config (e.g. `launchSettings.json` forcing `http` endpoints without HTTP/2, or a legacy `HttpProtocols.Http1` registration) is refusing to negotiate HTTP/2. Fix: ensure your endpoint is declared with `HttpProtocols.Http2` or let .NET defaults apply.

> **Example**
> A full CRUD override for `InsertStudent`, which persists via EF Core:
>
> ```cs
> public override async Task<Reply> InsertStudent(StudentModel request, ServerCallContext context)
> {
>     _context.Students!.Add(new Student
>     {
>         FirstName = request.FirstName,
>         LastName  = request.LastName,
>         School    = request.School
>     });
>     await _context.SaveChangesAsync();
>     return new Reply { Result = "Inserted", IsOk = true };
> }
> ```
>
> Note the `async`/`await` instead of `Task.FromResult`. Any override that awaits must be declared `async`.

> **Pitfall**
> Forgetting the `override` keyword on one of your methods silently shadows the base-class method instead of replacing it. The server compiles. The service starts. But client calls hit the generated base's default "not implemented" handler and get back `RpcException: UNIMPLEMENTED`. Always `override`.

> **Takeaway**
> Inherit from `[Service].[Service]Base`, `override` one `Task<Response>` method per `rpc`, always accept the `ServerCallContext` parameter, register with `builder.Services.AddGrpc()` plus `app.MapGrpcService<T>()`, and let Kestrel default to HTTP/2. For streaming methods, swap `Task<T>` for `Task` plus an `IServerStreamWriter<T>` parameter.
