---
n: 8
id: cp-proxy-three-variants
title: "Proxy — CachedProxy + ProtectionProxy + LoggingProxy"
lang: python
tags: [pattern, proxy, caching, access-control, logging]
source: "finalexamsmerge.pdf Q15"
pedagogy: worked-example-first
---

## Prompt

Implement three proxies over a common `ProxyInterface`, each adding one cross-cutting concern. All proxies implement `request()` and delegate to a `RealSubject`.

1. **CachedProxy** — first call fetches from RealSubject and caches; second call returns cache.
2. **ProtectionProxy** — checks `user_role`; only "Admin" may reach RealSubject.
3. **LoggingProxy** — prints a log line on every call and delegates.

## Starter

```python
from abc import ABC, abstractmethod

class ProxyInterface(ABC):
    @abstractmethod
    def request(self):
        pass

class RealSubject(ProxyInterface):
    def request(self):
        return "Handling request by RealSubject"

# TODO: CachedProxy, ProtectionProxy, LoggingProxy
```

## Solution

```python
from abc import ABC, abstractmethod

class ProxyInterface(ABC):
    @abstractmethod
    def request(self):
        pass

class RealSubject(ProxyInterface):
    def request(self):
        return "Handling request by RealSubject"

class CachedProxy(ProxyInterface):
    def __init__(self, subject):
        self._subject = subject
        self._cached_response = None
    def request(self):
        if self._cached_response is None:
            print("[CachedProxy] Cache is empty. Fetching from RealSubject...")
            self._cached_response = self._subject.request()
        else:
            print("[CachedProxy] Returning cached response.")
        return self._cached_response

class ProtectionProxy(ProxyInterface):
    def __init__(self, subject, user_role):
        self._subject = subject
        self._user_role = user_role
    def request(self):
        print(f"[ProtectionProxy] Verifying access for role: {self._user_role}")
        if self._user_role == "Admin":
            return self._subject.request()
        return "[ProtectionProxy] Access Denied."

class LoggingProxy(ProxyInterface):
    def __init__(self, subject):
        self._subject = subject
    def request(self):
        print("[LoggingProxy] Logging the request.")
        return self._subject.request()

real = RealSubject()

print("Using Cached Proxy:")
cp = CachedProxy(real)
print(cp.request())   # [CachedProxy] Cache is empty. Fetching... / Handling request...
print(cp.request())   # [CachedProxy] Returning cached response. / Handling request...

print("\nUsing Protection Proxy:")
admin = ProtectionProxy(real, "Admin")
user  = ProtectionProxy(real, "User")
print(admin.request())   # access granted
print(user.request())    # Access Denied

print("\nUsing Logging Proxy:")
lp = LoggingProxy(real)
print(lp.request())      # log + handling
```

## Why

All three proxies implement the same `ProxyInterface` as `RealSubject`, so they're substitutable wherever a `ProxyInterface` is expected (Liskov). Each adds ONE concern — caching, access control, logging — without touching `RealSubject`.

Two wrong approaches:
1. **Exposing a `get_subject()` or `real` property.** The past-exam DatabaseProxy Q8 failed Option A and C precisely because they leaked the real subject. The client could bypass the proxy's gate. Proxies must not expose their wrapped reference.
2. **Baking caching/logging/auth into RealSubject.** Violates SRP (one class doing four unrelated jobs) and makes RealSubject hard to reuse in contexts where those concerns don't apply.
