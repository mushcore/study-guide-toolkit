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
// DataCacheDemo — in-process, per-server
builder.Services.AddMemoryCache();          // resolves IMemoryCache

// WebApiFIFA — network-backed, shared across servers
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost";
    options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions
    {
        AbortOnConnectFail = true,
        EndPoints = { options.Configuration }
    };
});                                         // resolves IDistributedCache
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
        if (!_memoryCache.TryGetValue(cacheKey, out Product[]? productList))
        {
            HttpClient client = new HttpClient();
            var stream = client.GetStreamAsync("https://northwind.vercel.app/api/products");
            productList = await JsonSerializer.DeserializeAsync<Product[]>(await stream);

            var cacheExpiryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpiration  = DateTime.Now.AddSeconds(50),
                Priority            = CacheItemPriority.High,
                SlidingExpiration   = TimeSpan.FromSeconds(20)
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
public static async Task<T?> GetOrSetAsync<T>(this IDistributedCache cache, string key,
    Func<Task<T>> task, DistributedCacheEntryOptions? options = null)
{
    options ??= new DistributedCacheEntryOptions()
        .SetSlidingExpiration(TimeSpan.FromMinutes(30))
        .SetAbsoluteExpiration(TimeSpan.FromHours(1));

    if (cache.TryGetValue(key, out T? value) && value is not null)
        return value;

    value = await task();
    if (value is not null)
        await cache.SetAsync<T>(key, value, options);

    return value;
}

public static Task SetAsync<T>(this IDistributedCache cache, string key, T value,
    DistributedCacheEntryOptions options)
{
    var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(value, serializerOptions));
    return cache.SetAsync(key, bytes, options);
}

public static bool TryGetValue<T>(this IDistributedCache cache, string key, out T? value)
{
    var val = cache.Get(key);
    value = default;
    if (val == null) return false;
    value = JsonSerializer.Deserialize<T>(val, serializerOptions);
    return true;
}
```

## `GameService` — consumer pattern (primary ctor)

```cs
public class GameService(ApplicationDbContext context,
                        IDistributedCache cache,
                        ILogger<GameService> logger)
{
    public async Task<List<Game>> GetByCountry(string country)
    {
        var cacheKey = $"games:country:{country}";
        var cacheOptions = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
            .SetSlidingExpiration(TimeSpan.FromMinutes(2));

        var games = await cache.GetOrSetAsync(
            cacheKey,
            async () => await context.Games
                .Where(g => g.Country!.ToLower() == country.ToLower())
                .ToListAsync(),
            cacheOptions)!;

        return games!;
    }

    public async Task Add(Game game)
    {
        await context.Games.AddAsync(game);
        await context.SaveChangesAsync();

        // Invalidate
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
    AbsoluteExpiration  = DateTime.Now.AddSeconds(50),
    SlidingExpiration   = TimeSpan.FromSeconds(20),
    Priority            = CacheItemPriority.High
}
```

### DistributedCacheEntryOptions (fluent)

```cs
new DistributedCacheEntryOptions()
    .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
    .SetSlidingExpiration(TimeSpan.FromMinutes(2));
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
docker run --name redis -d -p 6379:6379 redis
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

```cs
<cache vary-by-user="true"
       vary-by-route="id"
       expires-after="@TimeSpan.FromMinutes(10)"
       expires-sliding="@TimeSpan.FromMinutes(2)">
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
