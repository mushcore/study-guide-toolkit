---
n: 12
id: grpc-client-consumption
title: "gRPC client consumption — GrpcChannel, DI, .csproj config"
hook: "Share the `.proto`, flip the `GrpcServices` attribute, and call typed methods."
tags: [grpc, client, di, asp-net-core]
module: "Distributed Services & Orchestration"
source: "notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx; Labs/W09 gRPC/gRPC ASP.NET Client1.html; research-grpc.md"
bloom_levels: [remember, understand, apply]
related: [grpc-proto-contracts, grpc-server-implementation, aspire-apphost]
---

## Start with the same `.proto`

Your client project needs the exact same `.proto` file the server has. Copy it in, drop the server-side namespace (or pick a different `option csharp_namespace` for client-generated types), and reference it in `.csproj`:

```xml
<ItemGroup>
  <Protobuf Include="Protos\students.proto" GrpcServices="Client" />
</ItemGroup>
```

Two things matter. The `Include` path is relative to the `.csproj`. The `GrpcServices` attribute tells `Grpc.Tools` which side's code to generate: `"Client"` for clients, `"Server"` for servers, `"Both"` when one project does both (rare). Build the project and generated classes appear: among them is `StudentRemote.StudentRemoteClient`, your callable stub.

## Two ways to construct the client

### Raw: `GrpcChannel` + direct construction

```cs
using var channel = GrpcChannel.ForAddress("http://localhost:5099");
var client = new StudentRemote.StudentRemoteClient(channel);

var reply = await client.GetStudentInfoAsync(
    new StudentLookupModel { StudentId = 3 });

Console.WriteLine($"{reply.FirstName} {reply.LastName}");
```

`GrpcChannel.ForAddress(url)` opens a long-lived HTTP/2 connection. Reuse the channel across many client constructions — channels are expensive, client stubs are free. Each generated call exposes an async `XxxAsync` form you `await` and a blocking `Xxx` form you typically avoid.

### DI: `AddGrpcClient<T>()`

Inside an ASP.NET Core app — MVC, Razor Pages, Blazor, or a Web API that talks to another gRPC service — register the client with the host's DI container:

```cs
builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(opts =>
{
    opts.Address = new Uri("http://localhost:5099");
});
```

You need the `Grpc.Net.ClientFactory` NuGet package. Once registered, inject the client anywhere:

```cs
@inject StudentRemote.StudentRemoteClient _grpcClient
@rendermode InteractiveServer

@code {
    private StudentModel? _student;

    protected override async Task OnInitializedAsync()
    {
        _student = await _grpcClient.GetStudentInfoAsync(
            new StudentLookupModel { StudentId = 3 });
    }
}
```

The factory pattern gives you resilience handlers, OpenTelemetry integration, and channel reuse for free — exactly what `AddServiceDefaults()` wires up when the client runs under Aspire.

## Interactive render mode matters in Blazor

If your page calls a gRPC client from `OnInitializedAsync`, it must be interactive. `@rendermode InteractiveServer` or `@rendermode InteractiveWebAssembly` keeps the component alive long enough for an async call to complete. A static-server-rendered page cannot await anything after initial render.

> **Q:** Your .csproj has `<Protobuf Include="Protos\greet.proto" GrpcServices="Server" />` inside a Blazor client project. You compile and get errors like "the type or namespace name 'StudentRemoteClient' could not be found." Why?
> **A:** `GrpcServices="Server"` generates only the server-side base class, not the client stub. Flip the attribute to `GrpcServices="Client"`. Use `"Both"` only when the same project hosts both roles.

> **Example**
> Minimal DI-based client registration in `Program.cs`:
>
> ```cs
> var builder = WebApplication.CreateBuilder(args);
>
> builder.Services.AddGrpcClient<StudentRemote.StudentRemoteClient>(opts =>
>     opts.Address = new Uri("http://localhost:5099"));
>
> builder.Services.AddRazorComponents()
>     .AddInteractiveServerComponents();
>
> var app = builder.Build();
> app.MapRazorComponents<App>()
>    .AddInteractiveServerRenderMode();
> app.Run();
> ```
>
> Any `.razor` component can now `@inject StudentRemote.StudentRemoteClient _grpcClient` and call methods without constructing a `GrpcChannel` by hand.

> **Pitfall**
> Port mismatch between `launchSettings.json` (where the server declares its listening URL) and the `Uri` you pass to the channel. Common case: the server's dev HTTPS URL is `https://localhost:7001`, the client hardcodes `http://localhost:5001`, and every call fails with a connection error. Read the server's `launchSettings.json` applicationUrl before typing the client URL — or, better, let Aspire's service discovery resolve `http://backend/` at runtime.

> **Takeaway**
> Copy the `.proto` to the client project, set `GrpcServices="Client"` in `.csproj`, reuse `GrpcChannel.ForAddress(url)` across calls, and for ASP.NET Core apps prefer `AddGrpcClient<T>()` + constructor/DI injection over hand-rolled channels. In Blazor, set `@rendermode InteractiveServer` on any page that awaits a gRPC client call.
