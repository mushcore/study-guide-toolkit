---
n: 9
id: cache-redis
title: "Caching — IMemoryCache, IDistributedCache, Redis, Cache Tag Helper"
hook: "TryGetValue+Set for memory. GetOrSetAsync extension for distributed. Redis backs IDistributedCache."
tags: [cache, redis, tag-helper]
module: "Performance & Caching"
source: "code-examples/20260330_DataCacheDemo/DataCacheDemo/Program.cs + Pages/Index.cshtml.cs; code-examples/20260330_WebApiFIFA_REDIS_Final/WebApiFIFA_REDIS_Final/Program.cs + Models/GameService.cs + Models/DistributedCacheExtensions.cs; notes/Cache_Tag_Helper_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [aspire]
---

## Two cache abstractions

```cs
// === IN-PROCESS MEMORY CACHE (per-server, fast, lost on restart) ===
builder.Services.AddMemoryCache();          // Injects IMemoryCache

// === DISTRIBUTED CACHE (Redis-backed, shared across servers, survives restart) ===
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost";    // Redis server address
    options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions
    {
        AbortOnConnectFail = true,          // Crash if Redis unreachable at startup
        EndPoints = { options.Configuration }
    };
});                                         // Injects IDistributedCache
```

`IMemoryCache` — microseconds, per-process, lost on restart.
`IDistributedCache` — milliseconds, shared via Redis, survives restart.

Choose based on: "does this value need to be visible to other servers or after a restart?"

## `IMemoryCache` — TryGetValue + Set (DataCacheDemo)

```cs
public class IndexModel : PageModel
{
    private readonly IMemoryCache _memoryCache;
    public IndexModel(IMemoryCache memoryCache) => _memoryCache = memoryCache;

    private async Task<Product[]> GetProductsAsync()
    {
        var cacheKey = "productList";
        // Try to retrieve from cache (out-parameter pattern)
        if (!_memoryCache.TryGetValue(cacheKey, out Product[]? productList))
        {
            // Cache miss: fetch from external API
            HttpClient client = new HttpClient();
            var stream = client.GetStreamAsync("https://northwind.vercel.app/api/products");
            productList = await JsonSerializer.DeserializeAsync<Product[]>(await stream);

            // Cache with expiration options
            var cacheExpiryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpiration  = DateTime.Now.AddSeconds(50),  // Hard deadline
                Priority            = CacheItemPriority.High,        // Eviction priority (not TTL)
                SlidingExpiration   = TimeSpan.FromSeconds(20)       // Idle timeout (resets on access)
            };
            _memoryCache.Set(cacheKey, productList, cacheExpiryOptions);
        }
        return productList!;
    }
}
```

`TryGetValue(key, out T? value)` returns bool. On miss, fetch, set with options, return. On hit, out-parameter carries payload.

## `IDistributedCache` — `GetOrSetAsync<T>` extension

The `DistributedCacheExtensions.cs` helper JSON-serializes under the hood:

```cs
// Main extension: cache-aside pattern with factory lambda
public static async Task<T?> GetOrSetAsync<T>(this IDistributedCache cache, string key,
    Func<Task<T>> task, DistributedCacheEntryOptions? options = null)
{
    // Use defaults if no options provided (30m sliding + 1h absolute)
    options ??= new DistributedCacheEntryOptions()
        .SetSlidingExpiration(TimeSpan.FromMinutes(30))
        .SetAbsoluteExpiration(TimeSpan.FromHours(1));

    // Try to get from cache (hit → return immediately)
    if (cache.TryGetValue(key, out T? value) && value is not null)
        return value;

    // Cache miss: execute factory function to fetch fresh data
    value = await task();
    // Store in cache if fetch succeeded
    if (value is not null)
        await cache.SetAsync<T>(key, value, options);

    return value;
}

// Helper: serialize object to JSON and store as bytes
public static Task SetAsync<T>(this IDistributedCache cache, string key, T value,
    DistributedCacheEntryOptions options)
{
    // JSON-serialize object to bytes (Redis stores bytes)
    var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(value, serializerOptions));
    return cache.SetAsync(key, bytes, options);
}

// Helper: deserialize bytes from Redis back to object
public static bool TryGetValue<T>(this IDistributedCache cache, string key, out T? value)
{
    // Get raw bytes from Redis
    var val = cache.Get(key);
    value = default;
    if (val == null) return false;
    // Deserialize from JSON
    value = JsonSerializer.Deserialize<T>(val, serializerOptions);
    return true;
}
```

## `GameService` — consumer pattern (primary ctor)

```cs
// Service with primary constructor dependency injection
public class GameService(ApplicationDbContext context,
                        IDistributedCache cache,
                        ILogger<GameService> logger)
{
    // Read with cache-aside pattern
    public async Task<List<Game>> GetByCountry(string country)
    {
        // Cache key includes parameter (different countries = different cache entries)
        var cacheKey = $"games:country:{country}";
        var cacheOptions = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))  // Hard 20m deadline
            .SetSlidingExpiration(TimeSpan.FromMinutes(2));   // 2m idle timeout

        // GetOrSetAsync: if cache hit, return cached list; if miss, run lambda to query DB
        var games = await cache.GetOrSetAsync(
            cacheKey,
            async () => await context.Games
                .Where(g => g.Country!.ToLower() == country.ToLower())
                .ToListAsync(),
            cacheOptions)!;

        return games!;
    }

    // Write with cache invalidation
    public async Task Add(Game game)
    {
        // Write to database
        await context.Games.AddAsync(game);
        await context.SaveChangesAsync();

        // Invalidate related cache entries (manual invalidation required!)
        cache.Remove("games");
    }
}
```

Three pieces: key (with parameter), factory lambda (runs on miss), per-call options.

## Expiration options

### MemoryCacheEntryOptions (object init)

```cs
new MemoryCacheEntryOptions
{
    AbsoluteExpiration  = DateTime.Now.AddSeconds(50),  // Hard TTL: dies at wall-clock time
    SlidingExpiration   = TimeSpan.FromSeconds(20),     // Idle timeout: resets on every access
    Priority            = CacheItemPriority.High        // Eviction order under memory pressure
}
```

### DistributedCacheEntryOptions (fluent)

```cs
new DistributedCacheEntryOptions()
    .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))   // Hard TTL from now
    .SetSlidingExpiration(TimeSpan.FromMinutes(2));    // Idle timeout: resets on access
```

| Option | Meaning |
|---|---|
| `AbsoluteExpiration` | Hard deadline at wall-clock moment |
| `SlidingExpiration` | Idle timeout, resets on each access |
| `Priority` (memory only) | Eviction order under memory pressure (`NeverRemove`/`High`/`Normal`/`Low`) |

Combined: entry dies at `min(absolute, idle-since-last-access + sliding)`.

**Priority is NOT TTL** — `Low` doesn't mean "expires sooner."

## Docker Redis

```bash
# Start Redis container (detached, port 6379)
docker run --name redis -d -p 6379:6379 redis
# Open CLI to inspect cache contents
docker exec -it redis redis-cli
```

CLI quick-check:
```text
> SET greeting "hello"
OK
> SETEX tempkey 10 "gone in 10s"    # seconds, not ms
OK
> TTL tempkey
(integer) 10
> KEYS games:*
> GET games:country:France
```

`AbortOnConnectFail = true` crashes app if Redis unreachable at startup. Default `false` → writes silently swallowed.

## Cache Tag Helper — `<cache>` (from course notes)

Built-in Razor Tag Helper. Wrap any block:

```html
<!-- Built-in Razor Tag Helper: caches rendered HTML output -->
<cache vary-by-user="true"                                   <!-- Separate cache per authenticated user -->
       vary-by-route="id"                                    <!-- Separate cache per route param value -->
       expires-after="@TimeSpan.FromMinutes(10)"             <!-- Hard TTL: 10 minutes -->
       expires-sliding="@TimeSpan.FromMinutes(2)">           <!-- Idle timeout: 2 minutes -->
    @await Html.PartialAsync("_ProductDetail", Model)
</cache>
```

Attributes:

| Attribute | Effect |
|---|---|
| `expires-after="@TimeSpan"` | Absolute TTL |
| `expires-on="@DateTime"` | Absolute wall-clock |
| `expires-sliding="@TimeSpan"` | Idle timeout |
| `vary-by-user="true"` | Per authenticated user |
| `vary-by-route="id"` | Per route param value |
| `vary-by-query="search"` | Per query-string key value |
| `vary-by-cookie="SessionId"` | Per cookie value |
| `vary-by-header="User-Agent"` | Per HTTP header value |
| `vary-by="@Model.Key"` | Custom key |

Backs onto `IMemoryCache` — same per-server problem as raw `IMemoryCache`.

> **Q:** App runs 3 API instances behind a load balancer with `AddMemoryCache()`. Users report stale data after updates. Cause?
> **A:** Each instance has its own `IMemoryCache`. Writes on A don't propagate to B/C. Fix: switch to `AddStackExchangeRedisCache(...)` + inject `IDistributedCache`.

> **Q:** Cache writes silently succeed (no exception) but `redis-cli KEYS *` shows nothing. Cause?
> **A:** Redis isn't running. `AbortOnConnectFail` defaults to false → swallow writes. Set `AbortOnConnectFail = true` to crash at startup instead.

> **Pitfall**
> `TryGetValue` is an out-parameter, not return: `if (_cache.TryGetValue(key, out var v)) { ... }`. Non-generic overload infers type from out-variable declaration.

> **Pitfall**
> Invalidation is manual. After every write (`SaveChangesAsync`, `AddAsync`, `Update`), call `cache.Remove(affectedKey)`. TTL alone leaves stale data visible until expiration.

> **Pitfall**
> `SETEX key 10 "val"` in redis-cli is 10 **seconds**, not milliseconds. `PSETEX` uses ms.

> **Pitfall**
> Omitting `vary-by-*` on user-specific `<cache>` blocks. First user's render shows for every subsequent visitor until TTL.

> **Takeaway**
> `AddMemoryCache()` → `IMemoryCache` + `TryGetValue+Set`. `AddStackExchangeRedisCache(opts => { opts.Configuration = "localhost"; opts.ConfigurationOptions = new() { AbortOnConnectFail = true, ... }; })` → `IDistributedCache` + `GetOrSetAsync<T>` extension. Options: `AbsoluteExpiration` (hard) + `SlidingExpiration` (idle reset); `Priority` is eviction-order, NOT TTL. Invalidate with `cache.Remove(key)` on every write. `<cache>` tag helper for fragment caching with `vary-by-*`.
