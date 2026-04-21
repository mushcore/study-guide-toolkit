---
id: proxy-dive
title: "Proxy pattern — deep dive"
pillar: tech
priority: high
tags: [pattern, structural, proxy, access-control, caching, logging]
source: "DesignPatternsTable p.6, Week 11 Slides, finalexamsmerge.pdf Q8 + Q15 Cached/Protection/Logging + Dec 2024 Q8"
bloom_levels: [understand, apply, analyze]
related: [decorator-pattern, facade, lazy-init]
---

## When to use

You want to interpose logic (auth, caching, logging, lazy loading) between a client and a real subject without the client noticing. The proxy implements the same interface as the real subject.

## Canonical class diagram

<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="220" y="20" width="200" height="70" class="iface" />
  <text x="265" y="40" class="it">«interface» Service</text>
  <line x1="220" y1="50" x2="420" y2="50" stroke="#333" />
  <line x1="220" y1="52" x2="420" y2="52" stroke="#333" />
  <text x="230" y="75" class="it">+ request()</text>
  <rect x="30" y="200" width="180" height="80" class="cls" />
  <text x="70" y="225">RealSubject</text>
  <line x1="30" y1="232" x2="210" y2="232" stroke="#333" />
  <text x="40" y="255">+ request()</text>
  <text x="40" y="272" font-size="10">does the real work</text>
  <rect x="420" y="200" width="200" height="100" class="cls" />
  <text x="475" y="225">Proxy</text>
  <line x1="420" y1="232" x2="620" y2="232" stroke="#333" />
  <text x="430" y="252">- real: RealSubject</text>
  <text x="430" y="270">+ request() → gate + forward</text>
  <path d="M110,200 L290,90" class="arrow" />
  <polygon points="285,85 296,88 290,97" class="inh" />
  <path d="M510,200 L360,90" class="arrow" />
  <polygon points="364,85 356,95 351,87" class="inh" />
  <path d="M420,260 C280,260 220,260 210,260" class="arrow" />
  <text x="280" y="290" font-size="11">delegates to</text>
</svg>

## Variants

| Variant | Purpose | Canonical use |
|---|---|---|
| Protection proxy | Access control by caller identity | Admin-only methods |
| Caching proxy | Memoize expensive calls | DB read cache |
| Logging proxy | Record every invocation | Audit trail |
| Virtual / lazy proxy | Defer construction of real subject | Expensive initialization |
| Remote proxy | Hide network transport | RPC clients |

The course tests primarily the first three.

## Worked example — three proxies, one subject

```python
from abc import ABC, abstractmethod

class ProxyInterface(ABC):
    @abstractmethod
    def request(self): pass

class RealSubject(ProxyInterface):
    def request(self):
        return "Handling request by RealSubject"

class CachedProxy(ProxyInterface):
    def __init__(self, subject):
        self._subject = subject
        self._cache = None
    def request(self):
        if self._cache is None:
            print("[Cached] fetching")
            self._cache = self._subject.request()
        else:
            print("[Cached] cache hit")
        return self._cache

class ProtectionProxy(ProxyInterface):
    def __init__(self, subject, user_role):
        self._subject = subject
        self._role = user_role
    def request(self):
        print(f"[Protection] verifying {self._role}")
        if self._role == "Admin":
            return self._subject.request()
        return "[Protection] Access Denied."

class LoggingProxy(ProxyInterface):
    def __init__(self, subject):
        self._subject = subject
    def request(self):
        print("[Logging] call")
        return self._subject.request()
```

Stack them: `LoggingProxy(ProtectionProxy(CachedProxy(RealSubject()), "Admin"))`. Each layer adds one concern. *finalexamsmerge.pdf Q15 — identify which option matches the UML.*

## Past-exam pitfall — unguarded getter

```python
class DatabaseProxy:
    def __init__(self):
        self._database = SensitiveDatabase()
        self._authorized_users = ["admin", "manager"]
    def read_data(self, username):
        if username in self._authorized_users:
            return self._database.read_data()
        print("Access denied!")
    def get_database(self):     # ← PROXY BROKEN
        return self._database
```

A client can now `proxy.get_database().read_data()` and bypass the auth check. The Proxy contract requires ALL access to the real subject to route through gated methods. The correct implementation omits `get_database`. *finalexamsmerge.pdf Q8: Option B is the only valid one — Option A (no check at all) and Option C (with get_database) both fail.*

> **Pitfall**
> Any method on a proxy that returns the wrapped subject is a leak. No `get_real()`, `inner`, `wrapped` properties. If a method *must* return data derived from the real subject, wrap or copy it.

## Proxy vs Decorator

| | Decorator | Proxy |
|---|---|---|
| Intent | Add behavior | Control access |
| Stacked instances | Commonly `A(B(C))` | Usually one proxy per concern |
| Client aware? | Client constructs the stack | Client may not know it's a proxy |
| Lifecycle | Wraps existing instance | May create/manage real subject |

*Dec 2024 Final Q8: "Proxy typically controls access or permissions, while Decorator enhances functionality without modifying the interface" → correct.*

## Takeaway

> **Takeaway**
> Proxy = gatekeeper with the same interface. Guard every public method. The structure matches Decorator's but the job is to *restrict or instrument*, not to *extend*. One leaky getter defeats the whole thing.
