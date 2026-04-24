---
n: 17
id: cache-expiration
title: "Cache expiration — Absolute, Sliding, combined, Priority"
hook: "Absolute is a hard deadline. Sliding resets on access. Priority decides who gets evicted first."
tags: [cache, ttl, expiration]
module: "Performance & Caching"
source: "notes/DataCache_SCRIPT.docx; research-cache.md §2, §4"
bloom_levels: [understand, apply]
related: [cache-abstractions, cache-aside-pattern]
---

## Three knobs on `MemoryCacheEntryOptions`

Every cache write can carry expiration policy. The shape is the same for `IMemoryCache` and `IDistributedCache` (the names differ slightly on the distributed variant; semantics are identical).

```cs
var options = new MemoryCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
    SlidingExpiration               = TimeSpan.FromMinutes(2),
    Priority                         = CacheItemPriority.High
};

_cache.Set("products", products, options);
```

| Option | Meaning |
|---|---|
| `AbsoluteExpiration` | Hard deadline at a wall-clock moment. Expires then, regardless of access. |
| `AbsoluteExpirationRelativeToNow` | Same, but computed as "now + duration" at set-time. |
| `SlidingExpiration` | Soft deadline that resets to the full duration every time the entry is accessed. |
| `Priority` | `NeverRemove` / `High` / `Normal` / `Low` — eviction order when memory pressure hits. |

## Absolute vs Sliding — pick one, two, or both

**Absolute alone.** Cache expires at T + duration regardless of traffic. Good for data that refreshes on a schedule (e.g. hourly reports). Predictable upper bound.

**Sliding alone.** Cache expires after N minutes of idleness. Good for session-like data where hot entries should stay and idle entries should evict. Risk: a popular entry never expires, so you never refresh it.

**Both, combined.** Sliding resets the idle timer, but absolute is a hard ceiling. The entry dies at **min(absolute deadline, idle-window end)** — whichever fires first.

```cs
new MemoryCacheEntryOptions
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),   // hard ceiling
    SlidingExpiration               = TimeSpan.FromMinutes(2)     // idle timeout
};
```

This combination gives hot entries a 2-minute idle reset while still guaranteeing a fresh fetch every 10 minutes at the outside.

## Priority is about eviction, not TTL

`CacheItemPriority.Low` does NOT mean "expires sooner." It means "when the cache is under memory pressure and has to drop entries, drop me first." A `Low`-priority entry with a 1-hour absolute expiration still lives 1 hour unless memory pressure forces eviction.

The four levels:

- `NeverRemove` — excluded from automatic eviction. Only removable via `Remove(key)` or time-based expiration.
- `High` — kept longer during pressure.
- `Normal` — default.
- `Low` — evicted first.

Use `NeverRemove` sparingly. It converts your cache into persistent state that only the explicit `Remove` call can release — often a footgun.

> **Q:** You set `AbsoluteExpirationRelativeToNow = 50s` and `SlidingExpiration = 20s`. A user accesses the entry at t=15s. When does the cache expire?
> **A:** At t=50s, from the absolute deadline. The sliding access at t=15s resets the idle timer to run until t=35s, but the absolute deadline at t=50s is farther out, so absolute is still binding. If there were no further accesses, the cache would have expired at t=35s. Because another hit reset the timer, absolute wins at t=50s.

> **Example**
> A "top products" endpoint caches a list for at most 5 minutes (absolute) but refreshes if idle for 30 seconds (sliding). During peak traffic the entry keeps resetting at 30-second intervals and stays hot until the 5-minute ceiling forces a refresh. During off-peak, the 30-second idle window trims unused data from memory without waiting for the full 5 minutes.

> **Pitfall**
> Confusing `Priority` with TTL. A distractor pattern is: "which option makes a cache entry expire sooner — `Priority = Low` or `AbsoluteExpiration = 10s`?" Priority does NOT change expiration time. It only determines eviction order under memory pressure. The `AbsoluteExpiration` setting decides when the entry dies.

> **Takeaway**
> `AbsoluteExpiration` = hard deadline. `SlidingExpiration` = idle timeout that resets on access. Combining both gives a capped-and-refreshed window: `min(absolute, idle-since-last-access + sliding)` is when the entry dies. `Priority` is orthogonal — it controls eviction order when memory is tight, not expiration time. For `IDistributedCache`, the options type is `DistributedCacheEntryOptions` with fluent setters (`SetAbsoluteExpiration`, `SetSlidingExpiration`); semantics are identical.
