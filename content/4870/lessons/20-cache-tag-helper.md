---
n: 20
id: cache-tag-helper
title: "Cache Tag Helper — <cache> fragment caching in Razor"
hook: "Wrap a block in `<cache>` and Razor skips re-rendering until the entry expires."
tags: [cache, razor, tag-helper]
module: "Performance & Caching"
source: "notes/Cache_Tag_Helper_SCRIPT.docx; research-cache.md §5"
bloom_levels: [understand, apply]
related: [cache-abstractions, taghelper-authoring]
---

## Declarative fragment caching in a Razor page

`<cache>` is a built-in Tag Helper. Wrap it around the piece of a view you want to reuse:

```cs
<cache expires-after="@TimeSpan.FromMinutes(10)">
    <p>Last rendered: @DateTime.Now</p>
    @await Html.PartialAsync("_TopProducts")
</cache>
```

On first render, Razor evaluates the contents and caches the resulting HTML. Requests over the next 10 minutes skip evaluation entirely — no query, no partial lookup, no C# execution inside the block. The rendered HTML comes back verbatim.

## The expiration attributes

| Attribute | Effect |
|---|---|
| `expires-after="@TimeSpan.FromMinutes(5)"` | Absolute TTL: expires 5 minutes after first render. |
| `expires-on="@DateTime.Today.AddDays(1)"` | Absolute: expires at a wall-clock moment. |
| `expires-sliding="@TimeSpan.FromMinutes(2)"` | Sliding: resets on each access. |

Combine them the same way as `MemoryCacheEntryOptions`: `expires-after` + `expires-sliding` together give a capped-and-refreshing window.

## `vary-by-*` — separate caches per dimension

A single page rendered for every user, every route, every query string, would flood one cache entry. `vary-by-*` attributes create a separate cache key per dimension:

```cs
<cache vary-by-user="true" expires-after="@TimeSpan.FromMinutes(10)">
    <p>Hello, @User.Identity?.Name</p>
</cache>
```

Each logged-in user gets their own cached greeting. Without `vary-by-user`, the first user's name would render for everyone else.

| Attribute | Separate cache per |
|---|---|
| `vary-by-user="true"` | Authenticated user identity |
| `vary-by-route="id"` | Value of the `id` route parameter |
| `vary-by-query="search"` | Value of the `search` query-string key |
| `vary-by-cookie="SessionId"` | Value of the `SessionId` cookie |
| `vary-by-header="User-Agent"` | Value of the named HTTP header |
| `vary-by="@Model.Key"` | Custom key you compute |

Combine freely:

```cs
<cache vary-by-user="true" vary-by-route="id" expires-after="@TimeSpan.FromMinutes(5)">
    <!-- one cached fragment per (user, product-id) pair -->
</cache>
```

## The load-balancing trap

`<cache>` uses `IMemoryCache` under the hood. That means the same web-farm problem as raw `IMemoryCache`: each server keeps its own rendered HTML. User A hits Server 1 and triggers cache write; User A's next request hits Server 2 and sees a fresh render that diverges from what Server 1 cached.

There is no straightforward way to back `<cache>` with Redis. Workarounds:

- **Sticky sessions.** Route each user to one server.
- **Short TTLs.** Keep the cache short so cross-server drift is brief.
- **Cache at a higher layer.** Output caching middleware (.NET 7+) or a CDN can cache at the request level across all servers.

For anything user-facing on a load-balanced deployment, prefer response-level or CDN caching over `<cache>`.

> **Q:** You wrap a user's profile summary in `<cache vary-by-user="true" expires-after="@TimeSpan.FromMinutes(10)">`. You deploy to a 3-pod Kubernetes service behind a load balancer. The user reports their name changes every few seconds. Why?
> **A:** Each pod holds its own `IMemoryCache` for `<cache>` fragments. The load balancer routes the user's requests round-robin across the three pods; each pod either has a stale cached fragment from a prior request or a fresh render — they don't agree. Fix: sticky sessions, or replace `<cache>` with output caching that can share state via Redis.

> **Example**
> A product detail page varies its cached main block by route `id` plus user identity, with a 10-minute absolute ceiling and a 2-minute sliding window:
>
> ```cs
> <cache vary-by-user="true"
>        vary-by-route="id"
>        expires-after="@TimeSpan.FromMinutes(10)"
>        expires-sliding="@TimeSpan.FromMinutes(2)">
>     @await Html.PartialAsync("_ProductDetail", Model)
> </cache>
> ```
>
> An active user sees snappy loads (sliding keeps their fragment hot); an inactive fragment drops after 2 minutes of idle or 10 minutes of age, whichever fires first.

> **Pitfall**
> Omitting `vary-by-*` on user-specific content. A cached block with only `expires-after` produces the same HTML for every visitor — the first user's data leaks into every subsequent render until the TTL fires. Always ask "does this block depend on the caller?" and add `vary-by-user` or `vary-by-route` accordingly.

> **Takeaway**
> `<cache>` wraps any Razor block and skips re-rendering until the entry expires. `expires-after` / `expires-on` / `expires-sliding` control TTL. `vary-by-user`, `vary-by-route`, `vary-by-query`, `vary-by-cookie`, `vary-by-header`, and custom `vary-by` create per-dimension cache keys. It backs onto `IMemoryCache`, so it has the same web-farm problem — use sticky sessions or move to output caching / CDN caching for multi-server deployments.
