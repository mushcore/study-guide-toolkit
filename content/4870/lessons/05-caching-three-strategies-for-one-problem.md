---
"n": 5
id: 4870-lesson-caching-three-strategies-for-one-problem
title: "Caching: three strategies for one problem"
hook: Cache = "don't recompute what you already know". Three flavors, one pitfall.
tags:
  - cache
module: Misc
---

ASP.NET Core gives you three caching primitives. You must be able to pick between them on the exam — the choice is never arbitrary.

1.  **IMemoryCache** — per-process RAM. *Pick it when* the app runs on exactly one server (dev, single-VM prod, or a single Docker container). *Why not always:* behind a load balancer, server A has no visibility into server B's cache. A logged-in user who bounces between servers sees stale or inconsistent data.
2.  **IDistributedCache (Redis)** — shared storage behind a network call. *Pick it when* the app runs on 2+ servers (web farm, Kubernetes, App Service with scale-out). *Cost:* a network round-trip per cache op; values must be serializable (string or byte\[\]). Solves the consistency problem that kills MemoryCache in farms.
3.  **Cache Tag Helper** — a Razor `<cache>` element that caches rendered HTML fragments. *Pick it when* the expensive thing is *rendering* (view model → HTML), not the data itself. *Under the hood:* it writes into IMemoryCache, so the single-server caveat still applies.

```cs
// In-memory
builder.Services.AddMemoryCache();
if (!_cache.TryGetValue("key", out Data val)) {
    val = LoadFromDb();
    _cache.Set("key", val, new MemoryCacheEntryOptions {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
        SlidingExpiration = TimeSpan.FromMinutes(2)
    });
}
// Redis
builder.Services.AddStackExchangeRedisCache(o => o.Configuration = "localhost:6379");
await _redis.SetStringAsync("key", json);
// Tag helper
<cache expires-after="@TimeSpan.FromMinutes(10)" vary-by-user="true"><partial name="_Expensive" /></cache>
```

> **Analogy**
>  MemoryCache = sticky notes on YOUR desk. Redis = shared whiteboard in hallway. Cache tag helper = laminated HTML fragment.

#### Which cache strategy? Decision tree

flowchart TD
  Q{Caching need?}
  Q -->|1 server only| IM\["IMemoryCache
AddMemoryCache"\]
  Q -->|web farm / load-balanced| DC\["IDistributedCache
AddStackExchangeRedisCache"\]
  Q -->|Razor HTML fragment| CT\["<cache vary-by-\* expires-after>
tag helper"\]
  CT -.uses under the hood.-> IM
      

> **Warning**
> **Common mistakes (sourced from DataCache\_SCRIPT.docx slide warnings):**
>
> -   **Confusing Absolute with Sliding** — Absolute is a hard deadline; the entry dies at T+10 minutes no matter how often you read it. Sliding resets to "idle-for-2-minutes" on every access. Combine both → whichever fires first wins.
> -   **Expecting MemoryCache to survive app restarts** — it is in-process RAM. A recycle, redeploy, or crash empties it. Redis persists.
> -   **Registering `AddMemoryCache()` but injecting `IDistributedCache`** — these are different registrations. Swapping requires both the service registration and the interface type.
> -   **Forgetting to start Redis** — `AddStackExchangeRedisCache` wires the client; if the Redis container is not running on `localhost:6379`, every cache call throws at first use, not at startup.

> **Q:** **Checkpoint —** You deploy your working MemoryCache app to Azure App Service and scale out to 3 instances. Users complain their data "flickers between old and new". Which line do you change in Program.cs, and why?
> **A:** Replace `builder.Services.AddMemoryCache();` with `builder.Services.AddStackExchangeRedisCache(o => o.Configuration = "...");` . Reason: each of the 3 instances had its own MemoryCache; when the load balancer sent a user to a different instance, the cache missed or returned a stale entry from a prior session. Redis is shared — all 3 instances read the same state.

> **Note**
> **Takeaway —** Memory cache: one server. Distributed (Redis): many servers. Tag helper: HTML fragments.
