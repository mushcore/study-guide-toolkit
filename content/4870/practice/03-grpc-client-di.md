---
n: 3
id: grpc-client-di
title: "Register a gRPC client in Program.cs"
kind: code
lang: cs
tags: [grpc, client, di, asp-net-core]
source: "Labs/W09 gRPC/ Q1 (variant — register a single ToonRemoteClient against localhost:5099, simpler than the lab's multi-client Aspire AppHost wiring)"
---

## Prompt

Complete the `Program.cs` snippet below so that the `ToonRemote.ToonRemoteClient` (generated from `Protos\toon.proto` with `GrpcServices="Client"`) is registered in the DI container, pointing at `http://localhost:5099`. Assume `Grpc.Net.ClientFactory` is already added as a NuGet package.

## Starter

```cs
var builder = WebApplication.CreateBuilder(args);

// TODO: register ToonRemote.ToonRemoteClient in the DI container,
// pointing at http://localhost:5099 so that any component can @inject it.

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();
app.MapRazorComponents<App>()
   .AddInteractiveServerRenderMode();
app.Run();
```

## Solution

```cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpcClient<ToonRemote.ToonRemoteClient>(opts =>
{
    opts.Address = new Uri("http://localhost:5099");
});

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();
app.MapRazorComponents<App>()
   .AddInteractiveServerRenderMode();
app.Run();
```

## Why

`AddGrpcClient<T>` registers a typed gRPC client with the factory. The factory manages channel lifetime so every injection of `ToonRemote.ToonRemoteClient` reuses the same pooled HTTP/2 connection. The `opts.Address` assignment is the only per-client configuration you typically need; additional options (timeouts, interceptors) chain off the returned `IHttpClientBuilder`.

Common wrong approaches:

- **`new GrpcChannel.ForAddress(...)` in `Program.cs` and passing it to `AddSingleton`.** You end up with a hand-rolled channel that bypasses the factory — no resilience handlers, no OpenTelemetry hooks, no service discovery. Under Aspire, this also misses out on `http://backend/` name resolution.
- **Omitting the NuGet package reference to `Grpc.Net.ClientFactory`.** The extension method does not exist without it, so `AddGrpcClient<T>` fails to compile.
- **Hardcoding `localhost:5099` into the deployed app.** In a local-only demo this is fine; once the service runs elsewhere (Aspire, Docker Compose, Kubernetes), replace the literal with `builder.Configuration["Services:Toon:Address"]` or an Aspire logical name like `http://toon`.
