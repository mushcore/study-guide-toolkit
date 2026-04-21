---
n: 8
id: proxy
title: "Proxy — gatekeeper with the same interface"
hook: "A YouTube video object that checks permissions, caches responses, and logs requests — without the client knowing the difference."
tags: [pattern, structural, proxy, access-control, caching]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.6, Week 11 Slides, finalexamsmerge.pdf Q8 DatabaseProxy + Q15 Cached/Protection/Logging"
bloom_levels: [understand, apply, analyze]
related: [decorator-pattern, facade]
---

A client wants to read from a sensitive database. But you want to: (1) restrict who can read, (2) cache repeat requests, (3) log every access. You could modify the database class — but then the database does three unrelated jobs (SRP violation) and you can't use it anywhere without those checks.

## Wrap it in a proxy

```python
from abc import ABC, abstractmethod

class ServiceInterface(ABC):
    @abstractmethod
    def read_data(self): pass

class SensitiveDatabase(ServiceInterface):
    def __init__(self):
        self._data = "Top Secret Data"
    def read_data(self):
        print("Accessing actual database...")
        return self._data

class DatabaseProxy(ServiceInterface):
    def __init__(self):
        self._database = SensitiveDatabase()
        self._authorized_users = ["admin", "manager"]
    def read_data(self, username):
        if username in self._authorized_users:
            return self._database.read_data()
        print("Access denied!")
        return None
```

The client interacts with `DatabaseProxy` as if it were the database. The proxy decides whether, when, or how to touch the real subject.

## Proxy variants

- **Protection proxy** — access control based on caller identity (example above).
- **Caching proxy** — stores results; repeated requests skip the real subject.
- **Logging proxy** — records every call; forwards transparently.
- **Virtual / lazy proxy** — defers expensive construction of the real subject until needed.

A single real subject may have multiple proxies stacked on top — each adding one concern.

> **Q:** The `DatabaseProxy` above has a getter `get_database()` added for "convenience". Is it still a valid Proxy?
> **A:** No. The client can now call `proxy.get_database().read_data()` and bypass the access check entirely. The proxy must only expose methods that route through its gatekeeping logic. Past-exam distractors Option A and Option C failed for exactly this reason. *finalexamsmerge.pdf Q8*

## Proxy vs Decorator

Identical structure — a wrapper implementing the real subject's interface. Different intent:

| | Decorator | Proxy |
|---|---|---|
| Purpose | Add functionality | Control access |
| Knows client | No | Often yes (auth) |
| Lifecycle | Wraps existing instance | Often creates / manages the real subject |
| Stackable | Yes, naturally (A(B(C))) | Yes, but less common |

## Pitfalls

> **Pitfall**
> Any method on the proxy that returns the real subject (`get_database()`, `get_backend()`, `real_service` property) defeats the proxy. The client can bypass the gate. *finalexamsmerge.pdf Q8 — only Option B without the getter was correct.*

> **Pitfall**
> Proxy that silently fails (returns None on unauthorized) can hide bugs. Prefer raising `PermissionError` or at minimum logging the denial.

## Takeaway

> **Takeaway**
> Proxy is a gatekeeper masquerading as the real thing. Use it when access, caching, lifecycle, or logging is a cross-cutting concern you don't want baked into the real subject. Guard every public method — one leaky getter breaks the illusion.
