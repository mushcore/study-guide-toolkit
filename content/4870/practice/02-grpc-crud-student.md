---
n: 2
id: grpc-crud-student
title: "Implement InsertStudent on a gRPC service"
kind: code
lang: cs
tags: [grpc, server, asp-net-core, ef-core]
source: "Labs/W09 gRPC/ Q5 (variant — implement a single InsertStudent override plus its DI setup, simpler than the full 4-method CRUD in the lab)"
---

## Prompt

Complete the `StudentsService` class below so that `InsertStudent` persists the request into the `SchoolDbContext`, saves changes, and returns a `Reply` whose `IsOk` is `true` and `Result` is `"Inserted"`. The `.proto` service and messages already exist and generate `StudentRemote.StudentRemoteBase`, `StudentModel`, and `Reply` for you.

## Starter

```cs
public class StudentsService : StudentRemote.StudentRemoteBase
{
    private readonly SchoolDbContext _context;

    public StudentsService(SchoolDbContext context) => _context = context;

    public override Task<Reply> InsertStudent(
        StudentModel request,
        ServerCallContext context)
    {
        // TODO: add a new Student to _context.Students based on request,
        // save changes, and return a successful Reply.
        throw new NotImplementedException();
    }
}
```

## Solution

```cs
public class StudentsService : StudentRemote.StudentRemoteBase
{
    private readonly SchoolDbContext _context;

    public StudentsService(SchoolDbContext context) => _context = context;

    public override async Task<Reply> InsertStudent(
        StudentModel request,
        ServerCallContext context)
    {
        _context.Students!.Add(new Student
        {
            FirstName = request.FirstName,
            LastName  = request.LastName,
            School    = request.School
        });

        await _context.SaveChangesAsync();

        return new Reply { Result = "Inserted", IsOk = true };
    }
}
```

## Why

The override takes `StudentModel` (the request) plus `ServerCallContext` and returns `Task<Reply>`. Because `SaveChangesAsync` is awaited, the method must be declared `async` — the compiler will flag any `async` method that returns `Task.FromResult(...)` or a non-awaited value.

Common wrong approaches:

- **Returning `Task.FromResult(new Reply { … })` while still calling `SaveChanges()` synchronously.** The student ends up persisted, but the method blocks the gRPC thread pool for the duration of the write. Under concurrent load this throttles unrelated requests. Always prefer `async` + `SaveChangesAsync` when any I/O happens.
- **Omitting `override`.** Without it the method does not replace the base-class virtual method; the generated base's default throws `UNIMPLEMENTED` when the client calls `InsertStudentAsync`. The code compiles and the service starts successfully, which makes this trap especially sharp.
- **Mapping `request.StudentId` into the new `Student`.** The database auto-generates the primary key. Forcing a specific `StudentId` from the client either collides with existing rows or overrides the sequence unexpectedly — return `Inserted` but tell the client the generated id, if anything.
