---
id: 4870-topic-imemorycache-single-server-cache
title: IMemoryCache — single-server cache
pillar: tech
priority: high
chapter: W10
tags:
  - cache
---

### Register

```cs
builder.Services.AddMemoryCache();
```

### Consume

```cs
public class WeatherService {
    private readonly IMemoryCache _cache;
    public WeatherService(IMemoryCache cache) { _cache = cache; }

    public Forecast Get() {
        if (!_cache.TryGetValue("fc", out Forecast fc)) {
            fc = Load();  // expensive
            var opts = new MemoryCacheEntryOptions {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(2),
                Priority = CacheItemPriority.Normal
            };
            _cache.Set("fc", fc, opts);
        }
        return fc;
    }
}
```

### GetOrCreateAsync

```cs
var fc = await _cache.GetOrCreateAsync("fc", async entry => {
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
    return await LoadAsync();
});
```

### Why this fails in production

Each web server has its own `IMemoryCache`. In a load balancer with 3 servers, the same user hitting server A vs B sees different cached data. Solution: use `IDistributedCache` (Redis).
