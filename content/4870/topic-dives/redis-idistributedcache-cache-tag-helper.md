---
id: 4870-topic-redis-idistributedcache-cache-tag-helper
title: Redis (IDistributedCache) + Cache Tag Helper
pillar: tech
priority: high
chapter: W10
tags:
  - cache
  - tag-helpers
---

### Start Redis

```cs
docker run -d --name redis -p 6379:6379 redis
```

### Register

```cs
builder.Services.AddStackExchangeRedisCache(o => {
    o.Configuration = "localhost:6379";
    o.InstanceName = "myapp_";
});
```

### Consume

```cs
public class Svc {
    private readonly IDistributedCache _cache;
    public Svc(IDistributedCache c) { _cache = c; }
    public async Task SetAsync(string key, string value) {
        var opts = new DistributedCacheEntryOptions {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
        };
        await _cache.SetStringAsync(key, value, opts);
    }
    public Task<string> GetAsync(string key) => _cache.GetStringAsync(key);
}
```

### Cache Tag Helper

```cs
<cache expires-after="@TimeSpan.FromMinutes(10)"
       vary-by-user="true"
       vary-by-route="category"
       vary-by-query="page;sort"
       priority="High">
    <partial name="_ExpensiveFragment" />
</cache>
```

**vary-by-\*** attributes: `vary-by-user`, `vary-by-route`, `vary-by-query`, `vary-by-cookie`, `vary-by-header`, custom `vary-by="@Model.Id"`.

Uses `IMemoryCache` under the hood → same load-balancer caveat applies.
