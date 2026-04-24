---
n: 7
id: cache-distributed-aside
title: "Cache-aside method with IDistributedCache + Redis"
kind: code
lang: csharp
tags: [cache, distributed-cache, redis, cache-aside, code-question]
source: "Lesson 07 (likely-pattern coding question for Cache bucket — 8 marks on final)"
---

## Prompt

Write a method **`GetGamesByCountry`** in `GameService`. The method should:

1. Be **`async`** and return **`Task<List<Game>>`**.
2. Take one parameter — `string country`.
3. Use a cache key that includes the country (e.g. `$"games:country:{country}"`).
4. Use the injected **`IDistributedCache cache`** with the **`GetOrSetAsync<T>`** extension to read the list, falling back on a database query (`context.Games.Where(...).ToListAsync()`).
5. Set **20-minute absolute** + **2-minute sliding** expiration.

Assume `IDistributedCache cache` and `ApplicationDbContext context` are injected via primary constructor. Write only the method.

## Starter

```cs
public async Task<List<Game>> GetGamesByCountry(string country)
{
    // TODO 1: build cache key including country
    // TODO 2: build DistributedCacheEntryOptions (absolute 20m + sliding 2m)
    // TODO 3: GetOrSetAsync — DB query lambda runs on miss
    // TODO 4: return the list
}
```

## Solution

```cs
public async Task<List<Game>> GetGamesByCountry(string country)
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
        cacheOptions);

    return games!;
}
```

## Why

**`GetOrSetAsync<T>`** is the cache-aside pattern in one call: try the cache, fall back to the lambda on miss, store the result, return. The cache key includes the parameter so different countries cache independently.

`DistributedCacheEntryOptions` uses a **fluent** style (`.SetAbsoluteExpiration(...).SetSlidingExpiration(...)`). Don't confuse it with `MemoryCacheEntryOptions`, which uses **object initializer** style (`new MemoryCacheEntryOptions { AbsoluteExpiration = ..., SlidingExpiration = ... }`).

A common wrong approach is to forget to include `country` in the cache key. Every country would map to the same cache entry — the first-cached country's results would be returned for all subsequent calls.

Another wrong approach: hand-rolling JSON serialization with `cache.SetStringAsync(JsonSerializer.Serialize(games))` and parsing back. The course's `GetOrSetAsync<T>` extension already wraps the JSON round-trip — using both layers is redundant and bug-prone.
