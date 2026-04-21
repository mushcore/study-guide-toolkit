---
"n": 1
id: 4870-code-grpc-calculator-coding-candidate-1
title: "gRPC Calculator (coding candidate #1)"
lang: cs
variant: starter-solution
tags:
  - grpc
---

## Prompt

Write a gRPC service for a Calculator. Define Add(a,b) returning sum. Include: (1) calculator.proto with proto3 syntax, csharp_namespace, service + rpc, AddRequest/AddResponse messages with field tags; (2) .csproj Protobuf item; (3) Program.cs AddGrpc + MapGrpcService; (4) CalculatorImpl class overriding Add.

## Starter

```cs
// calculator.proto
syntax = "proto3";
option csharp_namespace = "CalcGrpc";

service Calculator {
  // TODO
}

message AddRequest {
  // TODO
}

message AddResponse {
  // TODO
}

// Program.cs
var builder = WebApplication.CreateBuilder(args);
// TODO: register gRPC

var app = builder.Build();
// TODO: map service
app.Run();

// CalculatorImpl.cs
public class CalculatorImpl : /* TODO: base class */ {
    // TODO: override Add
}
```

## Solution

```cs
// calculator.proto
syntax = "proto3";
option csharp_namespace = "CalcGrpc";

service Calculator {
  rpc Add (AddRequest) returns (AddResponse);
}

message AddRequest {
  int32 a = 1;
  int32 b = 2;
}

message AddResponse {
  int32 sum = 1;
}

// .csproj
// <ItemGroup>
//   <Protobuf Include="Protos/calculator.proto" GrpcServices="Server" />
// </ItemGroup>

// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGrpc();

var app = builder.Build();
app.MapGrpcService<CalculatorImpl>();
app.Run();

// CalculatorImpl.cs
using Grpc.Core;
using CalcGrpc;

public class CalculatorImpl : Calculator.CalculatorBase {
    public override Task<AddResponse> Add(AddRequest r, ServerCallContext ctx) {
        return Task.FromResult(new AddResponse { Sum = r.A + r.B });
    }
}
```

## Why

<strong>Marking checklist (10 marks):</strong><ul><li>syntax = "proto3" + csharp_namespace (2)</li><li>service Calculator + rpc Add signature (2)</li><li>AddRequest / AddResponse with int32 fields + field numbers (2)</li><li>AddGrpc + MapGrpcService<T> (2)</li><li>Override signature Task<AddResponse> Add(AddRequest, ServerCallContext) (2)</li></ul>
