---
n: 4
id: grpc-blazor-inject
title: "Call a gRPC service from a Blazor component"
kind: code
lang: cs
tags: [grpc, blazor, interactive-server]
source: "Labs/W09 gRPC/ Q2 (variant — inject StudentRemote.StudentRemoteClient into a Blazor page, call GetStudentInfoAsync, render the result, simpler single-call version of the lab's full CRUD UI)"
---

## Prompt

Complete the Blazor component `StudentLookup.razor` so that it injects the gRPC client (already registered in `Program.cs`), calls `GetStudentInfoAsync(new StudentLookupModel { StudentId = 3 })` when the page initializes, and renders the returned `FirstName` and `LastName`. Set the render mode explicitly so the async call runs. Assume the `.proto` has been compiled and `StudentRemote.StudentRemoteClient`, `StudentLookupModel`, and `StudentModel` are available.

## Starter

```cs
@page "/student-lookup"
@using Grpc.Net.Client

// TODO: set the render mode and inject the gRPC client.

<h1>Student lookup</h1>

@if (_student is null)
{
    <p>Loading…</p>
}
else
{
    <p>Found: @_student.FirstName @_student.LastName</p>
}

@code {
    private StudentModel? _student;

    protected override async Task OnInitializedAsync()
    {
        // TODO: call GetStudentInfoAsync on the injected client and
        // assign the result to _student.
    }
}
```

## Solution

```cs
@page "/student-lookup"
@rendermode InteractiveServer
@inject StudentRemote.StudentRemoteClient _grpcClient

<h1>Student lookup</h1>

@if (_student is null)
{
    <p>Loading…</p>
}
else
{
    <p>Found: @_student.FirstName @_student.LastName</p>
}

@code {
    private StudentModel? _student;

    protected override async Task OnInitializedAsync()
    {
        _student = await _grpcClient.GetStudentInfoAsync(
            new StudentLookupModel { StudentId = 3 });
    }
}
```

## Why

Three directives carry the weight. `@rendermode InteractiveServer` keeps the component alive after the initial render so the awaited gRPC call can complete and trigger a re-render. `@inject StudentRemote.StudentRemoteClient _grpcClient` pulls the typed stub from DI — the stub was registered in `Program.cs` via `AddGrpcClient<T>()`. The call itself uses the `Async` suffix (`GetStudentInfoAsync`), not the blocking form, which is the only form safe to await in an async method.

Common wrong approaches:

- **Omitting `@rendermode InteractiveServer`.** Under static server rendering, `OnInitializedAsync` still runs once, but any post-render updates never reach the client — the page shows "Loading…" forever because the component was torn down before the awaited task completed.
- **Calling `_grpcClient.GetStudentInfo(...).Result` to "simplify" the async flow.** `.Result` blocks the SignalR circuit thread and can deadlock under load. Always await the `Async` form inside an async method.
- **Injecting `GrpcChannel` and constructing the client inside `OnInitializedAsync`.** This works but throws away the factory's channel pooling. Once DI registration is in place, inject the typed client directly.
