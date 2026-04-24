---
n: 10
id: grpc-proto-contracts
title: "gRPC .proto contracts — syntax, field tags, messages"
hook: "Write the contract first; the code generates itself."
tags: [grpc, protobuf, contract-first]
module: "Distributed Services & Orchestration"
source: "slides/gRPC.pptx; notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx; research-grpc.md"
bloom_levels: [remember, understand, apply]
related: [grpc-server-implementation, grpc-client-consumption, aspire-apphost]
---

## One `.proto` file drives a whole service

You want a student lookup service. Before you write a single line of C#, you author this:

```proto
syntax = "proto3";

option csharp_namespace = "GrpcStudentsServer";

service StudentRemote {
  rpc GetStudentInfo (StudentLookupModel) returns (StudentModel);
  rpc InsertStudent  (StudentModel)      returns (Reply);
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
  bool   isOk   = 2;
}
```

That single `.proto` file is the contract. `Grpc.Tools` compiles it at build time into two C# classes per side: on the server, a base class your service inherits from; on the client, a ready-to-call stub. No manually written DTOs, no hand-rolled serialization.

## The four keywords you actually write

| Keyword | Purpose |
|---|---|
| `syntax = "proto3";` | Pins the version. Proto3 is what the course targets. |
| `option csharp_namespace = "X";` | Sets the generated C# namespace. Without it, you get the `package` name instead. |
| `service` | Declares a gRPC service. Name it once; both sides use the same name. |
| `rpc` | Declares a single method. Shape: `rpc Name (Request) returns (Response);`. |
| `message` | Declares a structured payload. Each field has a type, a name, and a **tag**. |

## Field tags are contracts with the future

Every field in a `message` carries a number:

```proto
message StudentModel {
  int32 studentId = 1;
  string firstName = 2;
  string lastName = 3;
}
```

Those numbers — the **field tags** — are what `protoc` serializes to the wire. The text name is cosmetic; the tag is the ABI.

Two non-obvious rules:

1. **Tags are permanent.** Once a tag ships to a client, reusing it for a different field breaks every deployed consumer that hasn't recompiled. Delete the field but keep the tag reserved: `reserved 2;` tells future authors the slot is off-limits.
2. **Tags 1–15 encode in one byte; 16+ take two.** Put hot fields in the 1–15 range. On a per-message basis the difference is small; across millions of requests it adds up.

> **Q:** A live service has `message Person { string name = 1; int32 age = 2; }` deployed. You want to drop `age` and add a new `string email` field. What is the safe rewrite?
> **A:** Reserve the old tag and allocate a fresh one: `message Person { string name = 1; reserved 2; string email = 3; }`. Never set `email = 2` — deployed clients still interpret tag 2 as an `int32`, and the wire bytes collide.

## Proto3 defaults — there is no `null`

Unset scalar fields take zero-values: numbers are `0`, strings are `""`, bools are `false`, bytes are empty. This is a surprise coming from C#, where `null` is a valid state. If you need "absent vs zero" semantics on an integer field, wrap it in a nested message or use `google.protobuf.Int32Value` — not a bare `int32`.

Empty requests use `message Empty {}` — a declared zero-field message. This pattern appears often for "list everything" style methods.

Collections use `repeated`:

```proto
message StudentList {
  repeated StudentModel items = 1;
}
```

On the C# side, `repeated` maps to a read-only `RepeatedField<T>` you populate with `.Add(...)`.

> **Example**
> The `.proto` above generates (among others) a C# class `StudentModel` with properties `StudentId`, `FirstName`, `LastName`, `School` and a base class `StudentRemote.StudentRemoteBase` your service inherits from. The generated code is a build artifact — rebuild after every `.proto` edit or you consume stale stubs.

> **Pitfall**
> Field tags 1–15 encode in a single byte; tags 16+ take two. On a `StudentModel` that ships 6 million times a day, putting rare fields in low tags wastes bandwidth. Allocate low tags to the fields that ship on every call; park optional / rarely-set fields at 16+.

> **Pitfall**
> gRPC requires HTTP/2. The framework enforces this — a client talking to a server that refuses HTTP/2 (because Kestrel was misconfigured to HTTP/1.1, or `launchSettings.json` forced a legacy protocol) fails with a cryptic connection error, not a clear "protocol mismatch" message. If the first call of a brand-new gRPC service hangs or resets, check HTTP/2 settings first.

> **Takeaway**
> The `.proto` file is your single source of truth. `syntax = "proto3";` + `option csharp_namespace = ...;` + `service` + `rpc` + `message` are the only keywords you need. Number every field starting at 1, never reuse a tag, put hot fields in 1–15, and remember that unset scalars are zero-values, not null.
