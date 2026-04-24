---
n: 11
id: grpc-server-override
title: "gRPC server method — override GetStudentInfo"
kind: code
lang: csharp
tags: [grpc, server, override, code-question]
source: "Lesson 09 (likely-pattern coding question for gRPC bucket — 7 marks on final)"
---

## Prompt

Write the override of **`GetStudentInfo`** inside `StudentsService : StudentRemote.StudentRemoteBase`. The method should:

1. Have the correct signature for a unary RPC override.
2. Look up a `Student` by `request.StudentId` using `_context.Students!.Find(...)`.
3. If null, return an empty `StudentModel`.
4. Otherwise, return a `StudentModel` populated from the entity (`StudentId`, `FirstName`, `LastName`, `School`).
5. Return wrapped in `Task.FromResult(...)` (no async/await needed).

Assume `private readonly SchoolDbContext _context;` is injected. Write only the override method.

## Starter

```cs
public override Task<StudentModel> GetStudentInfo(
    StudentLookupModel request,
    ServerCallContext context)
{
    // TODO 1: Find by request.StudentId
    // TODO 2: if null, return empty StudentModel via Task.FromResult
    // TODO 3: otherwise, map entity → StudentModel and return via Task.FromResult
}
```

## Solution

```cs
public override Task<StudentModel> GetStudentInfo(
    StudentLookupModel request,
    ServerCallContext context)
{
    var s = _context.Students!.Find(request.StudentId);
    if (s is null) return Task.FromResult(new StudentModel());

    return Task.FromResult(new StudentModel {
        StudentId = s.StudentId,
        FirstName = s.FirstName,
        LastName  = s.LastName,
        School    = s.School
    });
}
```

## Why

A gRPC server method **inherits from `[ServiceName].[ServiceName]Base`** (here `StudentRemote.StudentRemoteBase`) — codegen produces both the base class and the client stub. Overrides take **two parameters** — the request message + a **`ServerCallContext`** carrying call metadata (auth, deadline, cancellation) — and return **`Task<TResponse>`** for unary RPCs.

Use **`Task.FromResult(...)`** for synchronous bodies. Mark the method `async` only when you await something inside.

A common wrong approach is forgetting the `override` keyword. The method then **shadows** the auto-generated stub. The server compiles, starts, registers — but clients calling the method get **`RpcException: UNIMPLEMENTED`**, because gRPC sees no real implementation registered.

Another wrong approach is omitting the **`ServerCallContext`** parameter. The signature won't match the base method, and `override` becomes a compile error.
