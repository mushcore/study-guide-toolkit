---
n: 16
id: cache-abstractions
title: "IMemoryCache vs IDistributedCache — pick the right abstraction"
hook: "`IMemoryCache` is fast and fails in web farms. `IDistributedCache` survives scale-out."
tags: [cache, architecture, idistributedcache]
module: "Performance & Caching"
source: "slides/redis.pptx; notes/DataCache_SCRIPT.docx; research-cache.md §1-2"
bloom_levels: [understand, apply, analyze]
related: [cache-expiration, cache-aside-pattern, redis-configuration]
---

## Two abstractions, one decision

.NET ships two cache interfaces. Picking the wrong one silently breaks multi-server deployments.

```cs
// Single-process, in-memory. Fast, ephemeral, per-server.
builder.Services.AddMemoryCache();        // resolves IMemoryCache

// Network-backed. Shared across servers, survives app restart (with Redis).
builder.Services.AddStackExchangeRedisCache(opts =>
    opts.Configuration = "localhost:6379"); // resolves IDistributedCache
```

`IMemoryCache` lives inside the app process. Lookups take microseconds. But every app instance owns a separate copy. `IDistributedCache` lives across the network in Redis (or SQL Server, or NCache, or any backend that implements the interface). Lookups take milliseconds and every app instance sees the same data.

## The web-farm problem

```text
     Load balancer
         │
  ┌──────┴──────┐
  │             │
Server A      Server B
 [cache]       [cache]   ← IMemoryCache: each server caches separately
```

Request 1 hits Server A → miss → fetch from DB → cache on Server A.
Request 2 hits Server B → miss (Server B cache is empty) → fetch from DB again.

`IMemoryCache` in a load-balanced deployment means you cache 2× (or N×) instead of once, and users see different data depending on which server answered.

Two fixes:

1. **Switch to `IDistributedCache`.** One shared cache (Redis). Every server hits the same copy.
2. **Sticky sessions.** Route each client to the same server so they always hit the same process. Works, but scales poorly and breaks when the chosen server restarts.

Redis is the standard move.

## When `IMemoryCache` is still right

For pure per-request optimization of expensive CPU work inside one process — parsing a config file once and reusing the result, or precomputing a lookup table on boot — `IMemoryCache` is ideal. The key question: "does this value need to be visible to the next request, possibly on a different server?" If no, `IMemoryCache`. If yes, `IDistributedCache`.

Development and single-server scenarios also favor `IMemoryCache` — no extra container, no connection string, no serialization cost.

## Consuming either interface

Constructor-inject whichever you registered:

```cs
public class ProductService
{
    private readonly IMemoryCache _cache;    // or IDistributedCache

    public ProductService(IMemoryCache cache) => _cache = cache;

    public async Task<Product[]> GetProductsAsync()
    {
        if (_cache.TryGetValue<Product[]>("products", out var cached))
            return cached!;

        var products = await FetchFromDbAsync();
        _cache.Set("products", products,
            new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
        return products;
    }
}
```

`IDistributedCache` has a similar API but works at the byte-array level — you typically wrap it in an extension method that serializes to JSON. See the cache-aside-pattern lesson for the canonical helper.

> **Q:** Your app caches product data with `IMemoryCache`. You scale from one server to three. Intermittently, users see stale products even when other users just updated them. What's the root cause and the fix?
> **A:** Each server has its own `IMemoryCache`. Writes on Server A don't propagate to Servers B and C — their caches stay stale for the full TTL. Fix: switch the registration to `AddStackExchangeRedisCache` and inject `IDistributedCache` instead. All three servers now hit one Redis container.

> **Example**
> A health dashboard caches a 10-second snapshot of DB stats. Running on one server, `IMemoryCache` with `AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10)` is fine. The team scales to 5 Kubernetes pods; every pod runs its own cache, so the DB gets hit 5× per 10-second window instead of once. Migrating to `IDistributedCache` + Redis drops DB load back to ≤ 1× per window across the whole farm.

> **Pitfall**
> `IMemoryCache` data DOES NOT survive an app restart. A deployment, a crash, or a container rescheduled by Kubernetes all wipe the cache. If you were relying on cached data between restarts (e.g. expensive startup computation carried across recycles), you need `IDistributedCache` with a persistent backend — Redis with AOF or RDB enabled.

> **Takeaway**
> Use `IMemoryCache` for per-process, ephemeral, within-one-server caching. Use `IDistributedCache` (backed by Redis) whenever the cache must span multiple servers, survive restarts, or power a load-balanced deployment. The choice is made once in `Program.cs` and baked into the injected interface.
