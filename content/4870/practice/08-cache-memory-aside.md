---
n: 8
id: cache-memory-aside
title: "Cache-aside method with IMemoryCache (TryGetValue + Set)"
kind: code
lang: csharp
tags: [cache, memory-cache, cache-aside, code-question]
source: "Lesson 07 (likely-pattern coding question for Cache bucket — 8 marks on final)"
---

## Prompt

Write a method **`GetProductsAsync`** inside a Razor PageModel. The method should:

1. Be **`async`** and return **`Task<Product[]>`**.
2. Use the cache key `"productList"`.
3. Try the injected **`IMemoryCache _memoryCache`** first via **`TryGetValue`**.
4. On miss, fetch from `"https://northwind.vercel.app/api/products"` using `HttpClient` and `JsonSerializer.DeserializeAsync<Product[]>`.
5. Cache the result with **50-second absolute** + **20-second sliding** expiration and **`Priority = High`**.

Write only the method.

## Starter

```cs
private async Task<Product[]> GetProductsAsync()
{
    var cacheKey = "productList";
    // TODO 1: TryGetValue — return cached if hit
    // TODO 2: fetch from API
    // TODO 3: build MemoryCacheEntryOptions (absolute 50s + sliding 20s + Priority.High)
    // TODO 4: cache and return
}
```

## Solution

```cs
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
            AbsoluteExpiration = DateTime.Now.AddSeconds(50),
            SlidingExpiration  = TimeSpan.FromSeconds(20),
            Priority           = CacheItemPriority.High
        };
        _memoryCache.Set(cacheKey, productList, cacheExpiryOptions);
    }

    return productList!;
}
```

## Why

`IMemoryCache` uses the **`TryGetValue` + `Set`** pattern manually. **`TryGetValue<T>(key, out T value)`** returns `bool` and fills the out-param on hit. On miss, do the work and call `Set(key, value, options)`.

`MemoryCacheEntryOptions` uses the **object-initializer** style. **`AbsoluteExpiration`** is a wall-clock `DateTime`; **`SlidingExpiration`** is a `TimeSpan` idle timeout. **`Priority`** is the eviction order under memory pressure — `High` means "drop me last," **NOT** "live longer."

A common wrong approach is treating `Priority = Low` as a TTL hint. It's not. It controls eviction order when the cache evicts entries to free memory. TTL is `AbsoluteExpiration` + `SlidingExpiration`.

Another wrong approach is forgetting `await` on `JsonSerializer.DeserializeAsync` (or worse, calling `.Result`). The deserialize task must be awaited; calling `.Result` blocks the request thread.
