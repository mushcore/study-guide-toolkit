---
"n": 6
id: 4870-lesson-grpc-contract-first-rpc
title: "gRPC: contract-first RPC"
hook: Define the shape in .proto, generate C# both sides. HTTP/2 under the hood.
tags:
  - grpc
module: gRPC
---

**gRPC** = Google Remote Procedure Call. Contract lives in a `.proto` file. Protoc generates C# classes for server AND client.

```proto
// greet.proto
syntax = "proto3";
option csharp_namespace = "MyApp";
service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
}
message HelloRequest { string name = 1; }
message HelloReply   { string message = 1; }
```

**.csproj:** `<Protobuf Include="Protos/greet.proto" GrpcServices="Server"/>` + `Grpc.Tools` package.

```cs
// Server Program.cs
builder.Services.AddGrpc();
app.MapGrpcService<GreeterImpl>();
// Server impl
public override Task<HelloReply> SayHello(HelloRequest r, ServerCallContext c)
  => Task.FromResult(new HelloReply { Message = "Hi " + r.Name });
// Client
var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Greeter.GreeterClient(channel);
var reply = await client.SayHelloAsync(new HelloRequest { Name = "Bob" });
```

> **Analogy**
>  REST = text message ("please send user #5"). gRPC = binary function call (`GetUser(5)`) with HTTP/2 streaming.

#### Why field numbers matter (exam trap)

In `message HelloRequest { string name = 1; }`, the `= 1` is a **wire-format field number**, not a default value and not a position. On the wire, protobuf emits `[field_number][wire_type][value]`. That is why:

-   **Order in code does not matter.** Moving `name = 1` below `age = 2` still serializes correctly because the number — not the position — identifies the field.
-   **Renaming a field is safe; changing its number is not.** An old client emitting field 1 and a new server expecting field 7 silently drop data.
-   **Tags 1–15 cost one byte** on the wire, tags 16+ cost two. Reserve 1–15 for the fields you send most often.

**Four call types:** unary, server streaming, client streaming, bidirectional.

#### 4 call types — unary vs streaming

flowchart LR
  subgraph Unary\["1. Unary"\]
    C1\[Client\] -- "1 req" --> S1\[Server\]
    S1 -- "1 rep" --> C1
  end
  subgraph SStream\["2. Server streaming"\]
    C2\[Client\] -- "1 req" --> S2\[Server\]
    S2 -- "stream of replies" --> C2
  end
  subgraph CStream\["3. Client streaming"\]
    C3\[Client\] -- "stream of reqs" --> S3\[Server\]
    S3 -- "1 rep" --> C3
  end
  subgraph BiDi\["4. Bidirectional"\]
    C4\[Client\] <--> S4\[Server\]
  end
      

> **Q:** **Checkpoint —** Your old `.proto` had `message User { string name = 1; int32 age = 2; }`. A teammate reorders the fields in a new commit to `int32 age = 2; string name = 1;`. Is this a breaking change for existing clients? Why?
> **A:** No — not a breaking change. Protobuf identifies fields by their number, not their declaration order. Old clients emitting field 1 still reach the server as `name`. The breaking change would be swapping the NUMBERS (e.g. making `name = 2`), because then old clients' field-1 bytes would collide with the new `age`.

> **Note**
> **Takeaway —** .proto defines the contract. Field numbers (not order) identify fields. TLS is default. Needs HTTP/2.
