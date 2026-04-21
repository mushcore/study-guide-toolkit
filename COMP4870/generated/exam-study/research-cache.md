# COMP4870 Caching Exam Study Guide (8 Marks)

## 1. Topic Summary: Three Caching Strategies

### IMemoryCache (In-Memory Cache)
- **What**: Server-side cache stored in application memory
- **When**: Development, single-server deployments, low-traffic scenarios
- **Why**: Zero latency, easy to implement, no external dependencies
- **Critical Flaw**: Each server instance maintains separate cache → data inconsistency in load-balanced deployments (web farms)
- **Setup**: `builder.Services.AddMemoryCache();`

### IDistributedCache + Redis (Distributed Cache)
- **What**: Centralized cache accessed by multiple servers via network
- **When**: Production, load-balanced deployments, high-availability requirements
- **Why**: Single source of truth, shared across all app instances, survives app restarts (if Redis persistent)
- **Advantage**: Solves the load-balancing problem
- **Setup**: `builder.Services.AddStackExchangeRedisCache(options => {...})`

### Cache Tag Helper (`<cache>` element)
- **What**: Razor-specific declarative caching for HTML content/views
- **When**: Fragment caching, view components, static layout sections
- **Why**: Simpler than code-based caching, varies by user/route/query automatically
- **Limitation**: Still uses IMemoryCache by default (same load-balancing problem)
- **Setup**: `<cache expires-after="@TimeSpan.FromMinutes(10)">...</cache>`

**Load-Balancing Problem**: With IMemoryCache in a web farm:
- Request 1 hits Server A → cache set in Server A
- Request 2 hits Server B → cache miss, fetches from DB
- Solution: Either use Redis OR use sticky sessions (route same client to same server)

---

## 2. Key Concepts

### IMemoryCache Pattern
```csharp
// Dependency injection
private readonly IMemoryCache _cache;
public MyClass(IMemoryCache cache) => _cache = cache;

// Check cache and retrieve
if (!_cache.TryGetValue<Product>("key", out var product)) {
    // Cache miss - fetch from DB
    product = await db.GetProductAsync();
    _cache.Set("key", product, options);
}
// Return product (from cache or DB)
```

### MemoryCacheEntryOptions (3 Expiration Strategies)

| Option | Definition | Example |
|--------|-----------|---------|
| **AbsoluteExpiration** | Fixed expiration time regardless of usage | `DateTime.Now.AddSeconds(50)` — always expires after 50 seconds |
| **AbsoluteExpirationRelativeToNow** | Same but relative to now | `TimeSpan.FromMinutes(10)` — 10 minutes from when set |
| **SlidingExpiration** | Reset on each access; expires if idle | `TimeSpan.FromSeconds(20)` — if not accessed for 20s, expires |

**Combining AbsoluteExpiration + SlidingExpiration**:
```csharp
new MemoryCacheEntryOptions {
    AbsoluteExpiration = DateTime.Now.AddSeconds(50),    // Hard limit
    SlidingExpiration = TimeSpan.FromSeconds(20)         // Soft limit (per access)
};
```
- Absolute = 50s → cache dies after 50s no matter what
- Sliding = 20s → resets countdown if accessed within that window
- **Result**: Data expires at 50s OR 20s idle, whichever comes first

### CacheItemPriority
- `NeverRemove`: Never automatically evicted (only manual Remove)
- `High`: Kept longer during memory pressure
- `Normal`: Default behavior
- `Low`: First to be evicted if memory is low

### IDistributedCache (Redis)
- Interface: `SetAsync<T>()`, `GetAsync<T>()`, `SetStringAsync()`, `GetStringAsync()`, `Remove()`
- Extension methods commonly implemented to handle JSON serialization/deserialization
- **Key advantage**: Works across multiple servers

### Redis Data Structures (Recognition)
- **String**: Simple key-value (e.g., `SET name "John"`)
- **Hash**: Nested key-value pairs (e.g., user profile data)
- **List**: Ordered collection (e.g., activity feed)
- **Set**: Unique values (e.g., tags)
- **Sorted Set**: Ranked data (e.g., leaderboards)

### ConnectionMultiplexer
- StackExchange.Redis component that manages Redis connections
- Usually created once per application and reused
- Thread-safe connection pooling

---

## 3. Code Patterns (Exact Syntax)

### IMemoryCache - Full Pattern
```csharp
// Program.cs
builder.Services.AddMemoryCache();

// In service/controller
public class ProductService {
    private readonly IMemoryCache _cache;
    
    public ProductService(IMemoryCache cache) => _cache = cache;
    
    public async Task<Product[]> GetProductsAsync() {
        var cacheKey = "productList";
        
        // Try to get from cache
        if (!_cache.TryGetValue<Product[]>(cacheKey, out var products)) {
            // Cache miss - fetch from API/DB
            products = await FetchFromAPIAsync();
            
            // Set cache with options
            var options = new MemoryCacheEntryOptions {
                AbsoluteExpiration = DateTime.Now.AddSeconds(50),
                SlidingExpiration = TimeSpan.FromSeconds(20),
                Priority = CacheItemPriority.High
            };
            _cache.Set(cacheKey, products, options);
            Console.WriteLine("Cache miss");
        } else {
            Console.WriteLine("Cache hit");
        }
        return products;
    }
}
```

### GetOrCreateAsync (Alternative Pattern)
```csharp
// ASP.NET Core's built-in async pattern
var product = await _cache.GetOrCreateAsync("key", async entry => {
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
    return await db.GetProductAsync();  // Runs only on cache miss
});
```

### IDistributedCache (Redis) - Setup
```csharp
// Program.cs
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis

builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = "localhost:6379";
    // OR with more options:
    options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions() {
        AbortOnConnectFail = true,
        EndPoints = { "localhost:6379" }
    };
});
```

### IDistributedCache Extension Methods (Common Pattern)
```csharp
public static class DistributedCacheExtensions {
    private static JsonSerializerOptions serializerOptions = new() {
        PropertyNamingPolicy = null,
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };
    
    // Serialize and set
    public static Task SetAsync<T>(this IDistributedCache cache, 
        string key, T value, DistributedCacheEntryOptions? options = null) {
        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(value, serializerOptions));
        return cache.SetAsync(key, bytes, options);
    }
    
    // Get and deserialize
    public static bool TryGetValue<T>(this IDistributedCache cache, 
        string key, out T? value) {
        var val = cache.Get(key);
        value = default;
        if (val == null) return false;
        value = JsonSerializer.Deserialize<T>(val, serializerOptions);
        return true;
    }
    
    // Get or fetch and set
    public static async Task<T?> GetOrSetAsync<T>(this IDistributedCache cache, 
        string key, Func<Task<T>> task, DistributedCacheEntryOptions? options = null) {
        if (cache.TryGetValue<T>(key, out T? value) && value is not null) {
            return value;
        }
        value = await task();
        if (value is not null) {
            options ??= new DistributedCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(30))
                .SetAbsoluteExpiration(TimeSpan.FromHours(1));
            await cache.SetAsync(key, value, options);
        }
        return value;
    }
}
```

### IDistributedCache Usage
```csharp
public class GameService {
    private readonly IDistributedCache _cache;
    private readonly ApplicationDbContext _context;
    
    public GameService(IDistributedCache cache, ApplicationDbContext context) {
        _cache = cache;
        _context = context;
    }
    
    public async Task<List<Game>> GetByCountryAsync(string country) {
        var cacheKey = $"games:country:{country}";
        var cacheOptions = new DistributedCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(20))
            .SetSlidingExpiration(TimeSpan.FromMinutes(2));
        
        return await _cache.GetOrSetAsync(
            cacheKey,
            async () => await _context.Games
                .Where(g => g.Country.ToLower() == country.ToLower())
                .ToListAsync(),
            cacheOptions
        );
    }
    
    // Cache invalidation
    public async Task AddGameAsync(Game game) {
        await _context.Games.AddAsync(game);
        await _context.SaveChangesAsync();
        _cache.Remove("games");  // Invalidate parent cache
    }
}
```

### Cache Tag Helper - Basic
```html
<!-- Expires after 10 minutes -->
<cache expires-after="@TimeSpan.FromMinutes(10)">
    <p>Last updated: @DateTime.Now</p>
</cache>

<!-- Expires at specific time -->
<cache expires-on="@DateTime.Today.AddDays(1).AddTicks(-1)">
    <p>Last updated: @DateTime.Now</p>
</cache>

<!-- Expires if idle for 5 minutes -->
<cache expires-sliding="@TimeSpan.FromMinutes(5)">
    <p>Last updated: @DateTime.Now</p>
</cache>
```

### Cache Tag Helper - Vary By
```html
<!-- Cache per user -->
<cache vary-by-user="true">
    <p>User-specific content</p>
</cache>

<!-- Cache per route parameter -->
<cache vary-by-route="id">
    <!-- http://site.com/product/1 vs /product/2 = different caches -->
</cache>

<!-- Cache per query string -->
<cache vary-by-query="search">
    <!-- ?search=apple vs ?search=banana = different caches -->
</cache>

<!-- Cache per cookie value -->
<cache vary-by-cookie="MyAppCookie">
    <p>Cookie-specific content</p>
</cache>

<!-- Cache per HTTP header -->
<cache vary-by-header="User-Agent">
    <p>Header-specific content</p>
</cache>

<!-- Custom variation logic -->
<cache vary-by="@ViewBag.ProductId">
    <p>Varies by custom logic</p>
</cache>

<!-- Multiple combinations -->
<cache vary-by-user="true" vary-by-route="id" expires-after="@TimeSpan.FromMinutes(10)">
    <p>Per-user per-product cache</p>
</cache>
```

### Cache Tag Helper - Priority
```csharp
@using Microsoft.Extensions.Caching.Memory

<cache vary-by-user="true" priority="@CacheItemPriority.Low">
    <p>Low priority content</p>
</cache>
```

---

## 4. Expiration Options Deep Dive

### AbsoluteExpiration
```csharp
var options = new MemoryCacheEntryOptions {
    AbsoluteExpiration = DateTime.Now.AddSeconds(50)
};
```
- **Behavior**: Cache expires at exact time, regardless of access
- **Use case**: Data that changes on a schedule (e.g., hourly reports)
- **Problem**: If you access at 49s, still expires at 50s (no refresh)

### AbsoluteExpirationRelativeToNow
```csharp
var options = new MemoryCacheEntryOptions {
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
};
// OR shorthand:
.SetAbsoluteExpiration(TimeSpan.FromMinutes(10))
```
- **Behavior**: Expires 10 minutes from SET time
- **Difference**: Relative to "now" rather than absolute clock time

### SlidingExpiration
```csharp
var options = new MemoryCacheEntryOptions {
    SlidingExpiration = TimeSpan.FromSeconds(20)
};
```
- **Behavior**: Countdown resets on each access
- **Use case**: Session data (idle users should timeout)
- **Advantage**: Frequently accessed data stays cached

### Combining Both
```csharp
new MemoryCacheEntryOptions {
    AbsoluteExpiration = DateTime.Now.AddSeconds(50),
    SlidingExpiration = TimeSpan.FromSeconds(20)
}
```
- **Expires when**: EITHER absolute time (50s) OR idle (20s), whichever first
- **Example**: User accesses at 15s → countdown resets, but still expires at 50s total
- **Real data**: Products cache from example = refresh every 50s max, OR 20s idle

---

## 5. Cache Tag Helper Vary-By Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `vary-by-user` | Create separate cache per logged-in user | `vary-by-user="true"` |
| `vary-by-route` | Create separate cache per route param (e.g., id) | `vary-by-route="id"` |
| `vary-by-query` | Create separate cache per query string param | `vary-by-query="search"` |
| `vary-by-cookie` | Create separate cache per cookie value | `vary-by-cookie="SessionId"` |
| `vary-by-header` | Create separate cache per HTTP header | `vary-by-header="User-Agent"` |
| `vary-by` | Custom variation logic | `vary-by="@ViewBag.UserId"` |
| `expires-after` | Absolute duration | `expires-after="@TimeSpan.FromMinutes(5)"` |
| `expires-on` | Absolute date/time | `expires-on="@DateTime.Today.AddDays(1)"` |
| `expires-sliding` | Sliding window | `expires-sliding="@TimeSpan.FromMinutes(5)"` |
| `priority` | Eviction priority | `priority="@CacheItemPriority.High"` |
| `enabled` | Toggle caching on/off | `enabled="false"` (disables caching) |

---

## 6. Redis Specifics

### Docker: Start Redis
```bash
docker run --name redis -d -p 6379:6379 redis
```
- `-d` = daemon mode (background)
- `-p 6379:6379` = port mapping
- Creates container named "redis"

### Redis CLI Access
```bash
docker exec -it redis sh
redis-cli
```

### Key Redis Commands
```bash
# Set and get
SET name "Micky Mouse"
GET name
# Output: "Micky Mouse"

# Delete
DEL name
# Output: (integer) 1  ← 1 key deleted

# Get non-existent key
GET name
# Output: (nil)

# Set with expiration (seconds)
SETEX destination 10 "Tokyo"

# Check time-to-live
TTL destination
# Output: (integer) 3  ← 3 seconds remaining

# After 10 seconds
GET destination
# Output: (nil)  ← expired
```

### Redis Data Types (Recognition)
- **String**: Key-value text (e.g., `SET user:1:name "John"`)
- **Hash**: Nested structure (e.g., `HSET user:1 name "John" age 30`)
- **List**: Ordered items (e.g., `LPUSH feed post1 post2`)
- **Set**: Unique values (e.g., `SADD tags sports music`)
- **Sorted Set**: Ranked items (e.g., `ZADD leaderboard 100 player1`)

### Configuration Options
```csharp
// Minimal
options.Configuration = "localhost:6379";

// Full control
options.ConfigurationOptions = new StackExchange.Redis.ConfigurationOptions() {
    AbortOnConnectFail = true,
    EndPoints = { "localhost:6379" }
};
```

### Redis Insight Tool
- Free GUI for Redis inspection
- Download: https://redis.io/insight/
- Useful for debugging cache contents

---

## 7. Flashcards (SuperMemo-style) — 15 Cards

### Card 1
**Q: What's the main problem with IMemoryCache in a load-balanced deployment?**  
A: Each server has its own separate cache. Request 1 hits Server A (cache hit), Request 2 hits Server B (cache miss). No shared state.

### Card 2
**Q: Name three expiration strategies for MemoryCacheEntryOptions.**  
A: 1) AbsoluteExpiration (fixed time), 2) SlidingExpiration (idle timeout), 3) CacheItemPriority (eviction preference)

### Card 3
**Q: Write the setup line for IMemoryCache in Program.cs.**  
A: `builder.Services.AddMemoryCache();`

### Card 4
**Q: What's the difference between TryGetValue and GetOrCreate?**  
A: TryGetValue returns bool (you handle the miss). GetOrCreateAsync automatically runs a factory function on miss.

### Card 5
**Q: Complete: `_cache.TryGetValue<Product>("key", out var ___)`**  
A: `out var product` (or any variable name; the syntax is `out var value`)

### Card 6
**Q: When you set both AbsoluteExpiration (50s) and SlidingExpiration (20s), which expires first?**  
A: Whichever comes first: if accessed at 15s, sliding resets but absolute still kills it at 50s; if idle past 20s, it expires even if absolute time not reached.

### Card 7
**Q: How do you setup IDistributedCache with Redis in Program.cs?**  
A: 
```csharp
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = "localhost:6379";
});
```

### Card 8
**Q: What NuGet package is required for Redis?**  
A: `Microsoft.Extensions.Caching.StackExchangeRedis`

### Card 9
**Q: Write the Docker command to start a Redis container.**  
A: `docker run --name redis -d -p 6379:6379 redis`

### Card 10
**Q: In Redis CLI, how do you set a key with 10-second expiration?**  
A: `SETEX destination 10 "Tokyo"`

### Card 11
**Q: What does `<cache vary-by-user="true">` do?**  
A: Creates a separate cached copy for each logged-in user; prevents user A from seeing user B's cached content.

### Card 12
**Q: List 3 vary-by attributes for the Cache Tag Helper.**  
A: vary-by-user, vary-by-route, vary-by-query, vary-by-cookie, vary-by-header (any 3)

### Card 13
**Q: When is IMemoryCache appropriate?**  
A: Development, single-server deployments, low-traffic internal apps, or when sticky sessions guarantee same-server routing.

### Card 14
**Q: When is Redis (IDistributedCache) required?**  
A: Production multi-server deployments, load-balanced web farms, high availability, or horizontal scaling.

### Card 15
**Q: What's a cache hit vs cache miss?**  
A: Cache hit = data found in cache (fast). Cache miss = data not in cache, must fetch from source (slow).

---

## 8. Exam Traps (What Students Get Wrong)

### Trap 1: IMemoryCache vs IDistributedCache Load-Balancing
**Wrong**: "IMemoryCache is fine for multiple servers because it's in memory (fast)."  
**Right**: IMemoryCache is NOT shared between servers. Use IDistributedCache (Redis) for multi-server deployments.

### Trap 2: TryGetValue Signature
**Wrong**: `_cache.TryGetValue("key", product)` ← missing `out var`  
**Right**: `_cache.TryGetValue<T>("key", out var product)` ← out parameter required

### Trap 3: SlidingExpiration Resets the Absolute Expiration
**Wrong**: "SlidingExpiration (20s) means cache dies at 20s if I access it at 1s, 5s, 10s..."  
**Right**: SlidingExpiration resets the idle timer, but AbsoluteExpiration is a hard limit. Both together = min(idle timeout, hard limit).

### Trap 4: GetOrCreate vs GetOrCreateAsync
**Wrong**: `await _cache.GetOrCreate(...)` ← wrong method  
**Right**: Use `GetOrCreateAsync()` for async factory; `GetOrCreate()` for sync

### Trap 5: Cache Tag Helper is Distributed
**Wrong**: "The `<cache>` tag helper works in load-balanced deployments."  
**Right**: `<cache>` uses IMemoryCache by default, so it has the same load-balancing problem. Use with sticky sessions or route to same server.

### Trap 6: Redis SetAsync vs SetStringAsync
**Question**: "Which takes a string vs object?"  
**Answer**: SetStringAsync = only strings. SetAsync (via extension) = serializes any object to JSON bytes.

### Trap 7: CacheItemPriority Determines Expiration Time
**Wrong**: "Priority = Low means it expires after 5 minutes"  
**Right**: Priority only affects eviction order when memory is low. Does NOT change expiration time.

### Trap 8: MemoryCache Survives Application Restart
**Wrong**: "IMemoryCache data persists after app restart"  
**Right**: Restarting the app clears all IMemoryCache data. Redis persists (if configured).

---

## 9. Practice MCQ (5-6 Questions)

### Question 1
You have an ASP.NET Core app running on two servers behind a load balancer. You cache product data using IMemoryCache. Why might users see different data?

A) IMemoryCache uses weak references  
B) Each server maintains its own separate in-memory cache  
C) The load balancer corrupts cache keys  
D) IMemoryCache automatically shares across servers  

**Answer: B** — Each server has its own memory. Server A and Server B don't share IMemoryCache. User A hits Server A (gets cached data), User B hits Server B (cache miss, fetches from DB).

---

### Question 2
You set a cache entry with `AbsoluteExpiration = DateTime.Now.AddSeconds(50)` and `SlidingExpiration = TimeSpan.FromSeconds(20)`. When does the cache expire if it's accessed at 15 seconds?

A) At 35 seconds (15 + 20)  
B) At 50 seconds (absolute limit)  
C) At 65 seconds (50 + 20)  
D) Never (sliding resets the timer)  

**Answer: B** — Absolute is a hard limit (50s from now). Even though sliding resets, absolute still wins. Data expires at 50s or idle 20s, whichever first.

---

### Question 3
What is the difference between `_cache.TryGetValue(key, out var value)` and `_cache.GetOrCreateAsync(key, factory)`?

A) TryGetValue is faster  
B) TryGetValue requires manual handling of cache miss; GetOrCreateAsync auto-runs factory on miss  
C) GetOrCreateAsync only works with Redis  
D) They are identical  

**Answer: B** — TryGetValue returns bool (you check `if (!found)` then fetch). GetOrCreateAsync handles the fetch automatically.

---

### Question 4
You want to cache a footer that never changes. Which Cache Tag Helper setup is best?

A) `<cache expires-after="@TimeSpan.FromSeconds(1)">`  
B) `<cache expires-after="@TimeSpan.FromDays(30)">`  
C) `<cache expires-on="@DateTime.Today.AddDays(1)">`  
D) `<cache vary-by-user="true">`  

**Answer: B** — Footer is static and rarely changes. 30 days is appropriate. (C is also reasonable for "expires tomorrow" logic, but B is better for content that doesn't change for weeks.)

---

### Question 5
You're adding Redis to an ASP.NET Core app. Which NuGet package and setup code is correct?

A) `builder.Services.AddMemoryCache()` + Microsoft.Extensions.Caching.Memory  
B) `builder.Services.AddStackExchangeRedis()` + StackExchange.Redis  
C) `builder.Services.AddStackExchangeRedisCache(...)` + Microsoft.Extensions.Caching.StackExchangeRedis  
D) `builder.Services.AddDistributedCache()` + no package needed  

**Answer: C** — Correct package + correct service name (AddStackExchangeRedisCache, not AddStackExchangeRedis).

---

### Question 6
In Redis CLI, what does `SETEX destination 10 "Tokyo"` do?

A) Sets destination to "Tokyo" with 10-byte limit  
B) Sets destination to "Tokyo" with 10-second expiration  
C) Deletes destination after 10 seconds  
D) Sets destination to expire at 10am  

**Answer: B** — SETEX = SET + EXpiration. The number is in seconds.

---

## Key Terms Summary

| Term | Definition |
|------|-----------|
| **IMemoryCache** | In-process cache, fast, not shared between servers |
| **IDistributedCache** | Network cache (Redis), shared across servers |
| **Cache Hit** | Data found in cache (fast) |
| **Cache Miss** | Data not in cache, must fetch from source (slow) |
| **Absolute Expiration** | Hard time limit regardless of access |
| **Sliding Expiration** | Timeout resets on each access |
| **Cache Invalidation** | Removing stale cache entries (hard problem) |
| **vary-by** | Create separate cache copies based on user/route/query |
| **Cache Tag Helper** | Razor `<cache>` element for fragment caching |
| **Redis** | In-memory distributed cache/database |
| **Cache Stale** | Old data still in cache but source updated |
| **Sticky Sessions** | Routing same client to same server (workaround for IMemoryCache) |

---

## Quick Reference: When to Use What

| Scenario | Solution |
|----------|----------|
| Development, single server | IMemoryCache |
| Production, multiple servers | IDistributedCache (Redis) |
| View/HTML fragment caching | Cache Tag Helper `<cache>` |
| Static content (footer, header) | Cache Tag Helper with long expiration |
| User-specific data | `vary-by-user="true"` or custom keys |
| API responses that rarely change | `AbsoluteExpiration` with long duration |
| Session-like data (idle logout) | `SlidingExpiration` |
| Needs to survive app restart | Redis (IDistributedCache) |
| Load-balanced deployment | Redis (IDistributedCache) ONLY |

---

## Docker Cheat Sheet

```bash
# Start Redis
docker run --name redis -d -p 6379:6379 redis

# Access Redis CLI
docker exec -it redis redis-cli

# Check if Redis is running
docker ps | grep redis

# Stop Redis
docker stop redis

# Remove Redis container
docker rm redis
```

---

**Exam Strategy (8 marks)**
- **2 marks**: Know the three caching strategies and when to use each (load-balancing problem)
- **2 marks**: Code patterns (IMemoryCache setup, TryGetValue syntax, Redis extension methods)
- **2 marks**: Expiration options (Absolute vs Sliding, combining both)
- **1 mark**: Cache Tag Helper vary-by attributes
- **1 mark**: Redis commands or Docker setup

**Pass threshold**: Get the load-balancing problem right (IMemoryCache fails in web farms) + one correct code pattern + understand expirations. That's ~5 marks.

