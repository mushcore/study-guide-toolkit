---
id: 4870-topic-grpc-proto-server-client
title: gRPC — proto + server + client
pillar: tech
priority: high
chapter: W09
tags:
  - grpc
---

### greet.proto

```proto
syntax = "proto3";
option csharp_namespace = "GrpcGreeter";
package greet;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
  rpc StreamNames (HelloRequest) returns (stream HelloReply);       // server stream
  rpc CollectNames (stream HelloRequest) returns (HelloReply);      // client stream
  rpc Chat (stream HelloRequest) returns (stream HelloReply);       // bidi
}

message HelloRequest {
  string name = 1;
  int32  age  = 2;
}

message HelloReply {
  string message = 1;
}
```

### Server .csproj

```xml
<ItemGroup>
  <Protobuf Include="Protos/greet.proto" GrpcServices="Server" />
  <PackageReference Include="Grpc.AspNetCore" />
</ItemGroup>
```

### Server impl

```cs
public class GreeterImpl : Greeter.GreeterBase {
    public override Task<HelloReply> SayHello(HelloRequest req, ServerCallContext ctx) {
        return Task.FromResult(new HelloReply { Message = $"Hello {req.Name}" });
    }
}
// Program.cs
builder.Services.AddGrpc();
app.MapGrpcService<GreeterImpl>();
```

### Client

```cs
using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Greeter.GreeterClient(channel);
var reply = await client.SayHelloAsync(new HelloRequest { Name = "Bob", Age = 30 });
Console.WriteLine(reply.Message);
```

### DI client

```cs
builder.Services.AddGrpcClient<Greeter.GreeterClient>(o => {
    o.Address = new Uri("https://localhost:5001");
});
```

### Exam traps

-   Field numbers (`= 1, = 2`) are ID tags, NOT ordinals; reordering in code is fine
-   Tags 1-15 encode in 1 byte → reserve them for frequent fields
-   Server-streaming uses `IServerStreamWriter<T>` and returns `Task`, writes with `await responseStream.WriteAsync(...)`
-   Default port in ASP.NET gRPC template: HTTPS 5001, HTTP 5000. gRPC REQUIRES HTTP/2, which requires TLS in browsers
