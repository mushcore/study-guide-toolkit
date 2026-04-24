---
n: 18
id: cache-aside-pattern
title: "Cache-aside pattern — GetOrSetAsync + JSON serialization + invalidation"
hook: "Check cache, on miss run the fetch, store the result, return."
tags: [cache, pattern, getorset, invalidation]
module: "Performance & Caching"
source: "notes/DataCache_SCRIPT.docx; notes/redis_SCRIPT.docx; research-cache.md §3"
bloom_levels: [understand, apply, analyze]
related: [cache-abstractions, cache-expiration, redis-configuration]
---

## The three steps of cache-aside

Given an expensive fetch — a DB query, an external API call, a CPU-heavy computation — the cache-aside pattern interposes a cache between the caller and the source.

1. **Look up** the key in the cache.
2. **On hit**, return the cached value.
3. **On miss**, call the source, store the result, return.

Raw `IMemoryCache` shape:

```cs
if (_cache.TryGetValue<Product[]>("products", out var cached))
    return cached!;

var fresh = await _db.Products.ToArrayAsync();
_cache.Set("products", fresh,
    new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
return fresh;
```

This works but repeats at every call site. The idiomatic .NET helper rolls it into one call:

```cs
var products = await _cache.GetOrCreateAsync("products", entry =>
{
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
    return FetchFromDbAsync();
});
```

`GetOrCreateAsync` checks cache, runs the factory on miss, stores the result, returns. The factory runs only on miss.

## The distributed-cache extension helper

`IDistributedCache` works in bytes, so you typically wrap it with a helper that serializes to JSON. The course's canonical extension:

```cs
public static class DistributedCacheExtensions
{
    private static readonly JsonSerializerOptions _json = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public static async Task SetAsync<T>(this IDistributedCache cache,
        string key, T value, DistributedCacheEntryOptions? opts = null)
    {
        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(value, _json));
        await cache.SetAsync(key, bytes, opts ?? new());
    }

    public static bool TryGetValue<T>(this IDistributedCache cache,
        string key, out T? value)
    {
        var raw = cache.Get(key);
        value = default;
        if (raw is null) return false;
        value = JsonSerializer.Deserialize<T>(raw, _json);
        return true;
    }

    public static async Task<T?> GetOrSetAsync<T>(this IDistributedCache cache,
        string key, Func<Task<T>> factory, DistributedCacheEntryOptions? opts = null)
    {
        if (cache.TryGetValue<T>(key, out var cached) && cached is not null)
            return cached;

        var value = await factory();
        if (value is not null)
        {
            opts ??= new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(1))
                .SetSlidingExpiration(TimeSpan.FromMinutes(30));
            await cache.SetAsync(key, value, opts);
        }
        return value;
    }
}
```

A consumer now reads like a single line:

```cs
var games = await _cache.GetOrSetAsync(
    $"games:country:{country}",
    () => _db.Games.Where(g => g.Country == country).ToListAsync(),
    new DistributedCacheEntryOptions()
        .SetAbsoluteExpiration(TimeSpan.FromMinutes(20)));
```

## Invalidation is still your job

Cache-aside does not know when the source changes. When you write to the DB, you have to invalidate the affected keys:

```cs
public async Task AddGameAsync(Game game)
{
    _db.Games.Add(game);
    await _db.SaveChangesAsync();
    _cache.Remove("games");                    // parent list
    _cache.Remove($"games:country:{game.Country}"); // specific country
}
```

Miss this step and reads continue to serve stale data until the TTL expires. For "eventually consistent" apps that's fine; for admin UIs showing the user's own edit, it looks broken.

> **Q:** You cache `games:country:France` with a 20-minute TTL. An admin edits a French game via your API. The cached list still shows the old version for 20 minutes. What's the missing call?
> **A:** The update handler needs to `_cache.Remove("games:country:France")` after `SaveChangesAsync`. Cache-aside relies on the writer invalidating affected keys; without explicit `Remove`, the TTL is the only thing that refreshes the cache.

> **Example**
> `GetOrSetAsync` one-liner with default 1-hour absolute + 30-minute sliding expiration:
>
> ```cs
> var weather = await _cache.GetOrSetAsync(
>     $"weather:{city}",
>     () => _weatherApi.GetAsync(city));
> // Absolute: 1h, Sliding: 30m (from helper defaults)
> ```
>
> First call fetches from the API. Subsequent calls within 30 minutes return cached. If 31 minutes of idle pass, the sliding timer fires and the next call refetches — unless the 1-hour absolute deadline fires first.

> **Pitfall**
> `TryGetValue<T>` requires `out var` — it's an out-parameter, not a return value. A distractor writes `if (_cache.TryGetValue("key", product))` and expects the compiler to infer. The correct call is `if (_cache.TryGetValue<T>("key", out var product))`. Same shape on `IDistributedCache` when using the extension.

> **Pitfall**
> JSON serialization round-tripping loses runtime type info. Caching a `List<Dog>` where `Dog : Animal` and deserializing as `List<Animal>` gives you `Animal` instances without their `Dog` specifics. Either cache the concrete type, or add `TypeNameHandling` / serializer settings that preserve type info (at the cost of bigger payloads).

> **Takeaway**
> Cache-aside = check, miss → fetch → store, return. Use `GetOrCreateAsync` on `IMemoryCache` or a `GetOrSetAsync<T>` extension on `IDistributedCache` for the one-line form. Serialize to JSON bytes for distributed caches. Invalidate by calling `Remove(key)` from every write path that modifies the cached data — TTL alone is not enough for admin UIs.
