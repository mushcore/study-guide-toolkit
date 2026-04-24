---
n: 2
id: grpc-proto-contracts
title: "gRPC `.proto` contracts — syntax, field tags, messages"
hook: "One text file defines every message and method your gRPC client and server will ever exchange."
tags: [grpc, protobuf, contract-first, proto3]
module: distributed-services-orchestration
source: "slides/gRPC.pptx; notes/gRPC_EF_SQLite_VSCode_SCRIPT.docx; research-grpc.md"
bloom_levels: [remember, understand, apply, analyze]
related: [grpc-server-implementation, grpc-client-consumption, aspire-apphost]
---

## Why contract-first matters

You open `Protos/students.proto` and see the whole API of your server. The `service StudentRemote` block lists every callable method. Each `message` declares a payload shape. The build tool runs `protoc` and drops generated C# classes into both the server and client project. No hand-written DTOs. No JSON drift between teams.

This file is the contract. Change it carelessly and every deployed client breaks.

## The five building blocks

A proto3 file has five parts you must recognize on sight.

```proto
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
```

- `syntax = "proto3";` — pins the dialect. Omit it and older proto2 rules apply.
- `option csharp_namespace` — sets the generated C# namespace. Without it, `protoc` derives one from `package`.
- `package greet;` — the protobuf namespace. Prevents name collisions across `.proto` files.
- `service` — declares a gRPC service. Each `rpc` inside is one callable method.
- `message` — declares a payload type. Fields have a type, a name, and a `field tag`.

> **Example**
> `rpc GetStudentInfo (StudentLookupModel) returns (StudentModel);` takes a `StudentLookupModel` request and returns a single `StudentModel`. That is a unary RPC.

## Field tags are the binary wire format

Every field ends with `= N` where `N` is a positive integer. That integer is the `field tag` — the identifier protobuf writes into the binary stream. The name `firstName` is a C# convenience. On the wire, only tag `2` exists.

Two consequences follow.

First, tags 1 through 15 encode their identifier in a single byte. Tags 16 and up need two bytes. Put your hot fields — the ones sent on every message — in the low range.

Second, tags are permanent. Reusing a tag number after deleting a field silently corrupts every already-deployed client that still sends the old field.

> **Pitfall**
> Never reuse a field tag. If you delete `string school = 4;`, the next new field must use `5`, not `4`. Old clients that still send tag 4 as a string will be misread as your new type.

> **Q:** You rename `firstName` to `givenName` but keep the tag `= 2`. Do existing binary clients break?
> **A:** No. The wire format encodes tag `2`, not the name. Rename is safe; changing the tag is not.

## Proto3 defaults and `repeated`

Proto3 has no `null`. An unset `int32` deserializes to `0`. An unset `string` becomes `""`. An unset `bool` becomes `false`. The framework cannot tell "user sent zero" from "user sent nothing" on a scalar field.

Collections use `repeated`, which generates a `List<T>` in C#.

```proto
message StudentList {
  repeated StudentModel items = 1;
}

message Empty {}
```

`Empty` is a valid message with no fields — useful when an RPC needs no request body. `repeated StudentModel items = 1;` generates `public RepeatedField<StudentModel> Items { get; }` in C#, iterable like a `List<StudentModel>`.

> **Pitfall**
> Do not treat `0`, `""`, or `false` as "missing" on the server. In proto3 they are indistinguishable from an explicit zero value. If you need real optionality, wrap the scalar in a message or use a `wrapper` type.

## Scalar types you must know

| Proto | C# | Notes |
|-------|----|-------|
| `int32`, `int64` | `int`, `long` | Variable-length encoding. |
| `string` | `string` | UTF-8. |
| `bool` | `bool` | One byte. |
| `repeated T` | `RepeatedField<T>` / `IList<T>` | Collection of any type. |

`int32` and `int64` are variable-length — small values use fewer bytes than large ones. That is why proto is compact for typical IDs.

## How the contract becomes C# code

The `.csproj` file tells MSBuild to run `protoc` on the `.proto`. You pick which side to generate.

```xml
<ItemGroup>
  <Protobuf Include="Protos\students.proto" GrpcServices="Server" />
</ItemGroup>
```

`GrpcServices="Server"` generates the abstract base class `StudentRemote.StudentRemoteBase` that your service class will inherit. `GrpcServices="Client"` generates `StudentRemote.StudentRemoteClient` for callers. Use `"Both"` if the same project does both roles.

Forget the `<Protobuf>` entry and no code is generated — your project will not compile because `StudentRemoteBase` does not exist.

> **Takeaway**
> A `.proto` file is a frozen binary contract. `service` declares methods, `message` declares payloads, field tags drive the wire format. Tags are permanent, tags 1–15 are cheapest, and proto3 has no `null` — unset scalars are always zero-values.
