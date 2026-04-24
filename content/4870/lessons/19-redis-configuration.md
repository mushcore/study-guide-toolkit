---
n: 19
id: redis-configuration
title: "Redis configuration — Docker, StackExchange.Redis, ConfigurationOptions"
hook: "One container, port 6379, one line of Program.cs."
tags: [redis, docker, stackexchange-redis, config]
module: "Performance & Caching"
source: "slides/redis.pptx; notes/redis_SCRIPT.docx; research-cache.md §6"
bloom_levels: [remember, apply]
related: [cache-abstractions, cache-aside-pattern, aspire-orchestrated-resources]
---

## Spin up Redis on Docker

```bash
docker run --name redis -d -p 6379:6379 redis
```

Three flags matter. `-d` runs the container detached. `-p 6379:6379` maps the host's port 6379 to the container's port 6379 — `6379` is Redis's conventional port. `redis` is the official image name from Docker Hub.

Check it's up:

```bash
docker ps | grep redis
```

Connect with the CLI to sanity-check:

```bash
docker exec -it redis redis-cli
> SET greeting "hello"
OK
> GET greeting
"hello"
> SETEX tempkey 10 "gone in 10s"
OK
> TTL tempkey
(integer) 10
```

`SETEX` is `SET` + `EXpiration` — the number is **seconds**, not milliseconds. `TTL` returns how many seconds remain. Once expired, `GET` returns `(nil)`.

## Register Redis as `IDistributedCache`

Add the NuGet package:

```bash
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
```

Wire it in `Program.cs`:

```cs
builder.Services.AddStackExchangeRedisCache(opts =>
{
    opts.Configuration = "localhost:6379";
});
```

That one call registers `IDistributedCache` backed by Redis. Any service that `@inject`s or constructor-injects `IDistributedCache` now reads from and writes to your Redis container.

For production-grade control, swap the shorthand for `ConfigurationOptions`:

```cs
builder.Services.AddStackExchangeRedisCache(opts =>
{
    opts.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions
    {
        AbortOnConnectFail = true,
        EndPoints = { "localhost:6379" },
        Password = builder.Configuration["Redis:Password"],
        Ssl = true,
    };
});
```

`AbortOnConnectFail = true` forces your app to fail fast if Redis is unreachable at startup. `false` silently retries in the background — fine for dev, dangerous for prod where you want the container orchestrator to replace a broken app.

## Redis data types (recognition only)

The exam may name-drop Redis data structures. You don't write code against them directly through `IDistributedCache` (that API is just byte-level keys), but recognize the shapes:

| Type | Shape | Example use |
|---|---|---|
| String | single key → single value | `SET user:42:name "Alice"` |
| Hash | key → field-value map | `HSET user:42 name Alice age 30` |
| List | key → ordered list | `LPUSH feed post1 post2` |
| Set | key → unique unordered members | `SADD tags sports music` |
| Sorted set | key → scored, ranked members | `ZADD leaderboard 100 player1` |

## Under Aspire, skip the manual connection string

If your solution uses `.NET Aspire`, the AppHost registers Redis as a resource and injects the connection string automatically:

```cs
// AppHost
var cache = builder.AddRedis("cache");
builder.AddProject<Projects.Api>("api").WithReference(cache);

// Api/Program.cs
builder.AddRedisDistributedCache("cache");   // reads the injected connection string
```

No `localhost:6379` literal, no NuGet reference to `StackExchange.Redis` client — Aspire handles both.

> **Q:** Your `Program.cs` has `AddStackExchangeRedisCache(opts => opts.Configuration = "localhost:6379")`. Your app starts and runs, but every cache write gets swallowed — no exception, no data in Redis. What's the most likely cause?
> **A:** Redis isn't actually running on port 6379. `AbortOnConnectFail` defaults to `false`, so the cache silently no-ops writes. Check with `docker ps`; if Redis is missing, `docker run --name redis -d -p 6379:6379 redis`. In production, set `AbortOnConnectFail = true` so this condition crashes at startup.

> **Example**
> Inspecting what your app actually wrote to Redis with the CLI:
>
> ```bash
> docker exec -it redis redis-cli
> > KEYS games:*
> 1) "games:country:France"
> 2) "games:country:Japan"
> > TTL games:country:France
> (integer) 842
> > GET games:country:France
> "[{\"Id\":1,\"Country\":\"France\",...}]"
> ```
>
> The JSON-serialized list you set from C# is visible as a raw string. Redis Insight (GUI at <https://redis.io/insight/>) offers the same view with syntax highlighting.

> **Pitfall**
> `SETEX destination 10 "Tokyo"` expires in **10 seconds**, not 10 milliseconds. Redis TTL commands use seconds by default. The `PSETEX` variant uses milliseconds if you need sub-second precision — rare.

> **Takeaway**
> `docker run --name redis -d -p 6379:6379 redis` starts the container on the conventional port. `dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis` plus `builder.Services.AddStackExchangeRedisCache(opts => opts.Configuration = "localhost:6379")` registers it as `IDistributedCache`. Under Aspire, use `AddRedis("cache")` + `AddRedisDistributedCache("cache")` and skip the connection string. `AbortOnConnectFail = true` prevents silent cache-write swallowing when Redis is missing.
