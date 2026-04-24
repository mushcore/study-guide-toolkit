---
n: 12
id: grpc-streaming-override
title: "gRPC server-streaming — RetrieveAllStudents"
kind: code
lang: csharp
tags: [grpc, streaming, server, override, code-question]
source: "Lesson 09 (likely-pattern coding question for gRPC bucket — 7 marks on final)"
---

## Prompt

Write the override of **`RetrieveAllStudents`** inside `StudentsService : StudentRemote.StudentRemoteBase`. The method is **server-streaming** — given an `Empty` request, stream every `StudentModel` to the client. The method should:

1. Have the correct **server-streaming** override signature (`Task` return, `IServerStreamWriter<StudentModel>` extra param).
2. Be `async`.
3. Iterate `_context.Students!` and `await responseStream.WriteAsync(...)` for each — mapping the entity to a `StudentModel` (`StudentId`, `FirstName`, `LastName`, `School`).

Write only the override method.

## Starter

```cs
public override async Task RetrieveAllStudents(
    Empty request,
    IServerStreamWriter<StudentModel> responseStream,
    ServerCallContext context)
{
    // TODO: iterate students, WriteAsync each as a StudentModel
}
```

## Solution

```cs
public override async Task RetrieveAllStudents(
    Empty request,
    IServerStreamWriter<StudentModel> responseStream,
    ServerCallContext context)
{
    foreach (var s in _context.Students!)
    {
        await responseStream.WriteAsync(new StudentModel {
            StudentId = s.StudentId,
            FirstName = s.FirstName,
            LastName  = s.LastName,
            School    = s.School
        });
    }
}
```

## Why

A **server-streaming** override differs from unary in two ways:

- **Return type is `Task`** (NOT `Task<TResponse>`) — the method writes many messages, so there's no single response to wrap.
- **Extra `IServerStreamWriter<T> responseStream` parameter** between the request and the `ServerCallContext`.

Each `await responseStream.WriteAsync(...)` pushes one message to the client. The client iterates with `await foreach (var msg in call.ResponseStream.ReadAllAsync()) { ... }`.

A common wrong approach is **`Task<StudentList>`** as the return type with a packed list. That's how you'd model server streaming as unary — works, but it's not streaming, and the prompt explicitly asks for streaming.

Another wrong approach is forgetting `await` on `WriteAsync(...)`. The writes complete in arbitrary order, which can break framing or reorder messages on the wire.
