---
n: 3
id: chain-of-responsibility
title: "Chain of Responsibility — pass the request down the line"
hook: "Tech support. Level-1 tries. Can't fix it? Forwards to Level-2. Can't fix that either? Level-3. The caller doesn't know who will answer."
tags: [pattern, behavioral, chain-responsibility, handler]
module: "Design Patterns — Behavioral"
source: "DesignPatternsTable (1).pdf p.2, Week 8 Slides, Week10SampleCode/chain_of_responsibility.py, finalexamsmerge.pdf Q3 + Dec 2024 Q6"
bloom_levels: [understand, apply, analyze]
related: [observer, mediator]
---

You're validating a purchase order. It needs to pass: (1) has the customer registered? (2) are the items in stock? (3) is the payment valid? (4) is shipping address supported? Each check can pass, fail-and-stop, or fail-and-delegate. Hard-coding the sequence inside one `validate()` method works — until you want to reorder, skip, or reuse a check elsewhere.

## One handler per step, linked by `_successor`

```python
class Handler:
    def __init__(self, successor=None):
        self._successor = successor
    def handle_request(self, request):
        if self._can_handle(request):
            self._process_request(request)
        elif self._successor is not None:
            print(f"{self.__class__.__name__} cannot handle. Passing...")
            self._successor.handle_request(request)
        else:
            print("Request cannot be handled!")
    def _can_handle(self, request): raise NotImplementedError
    def _process_request(self, request): raise NotImplementedError

class Level1Support(Handler):
    def _can_handle(self, request): return request.severity == "low"
    def _process_request(self, request): print(f"Level 1: {request}")

class Level2Support(Handler):
    def _can_handle(self, request): return request.severity == "medium"
    def _process_request(self, request): print(f"Level 2: {request}")

class Level3Support(Handler):
    def _can_handle(self, request): return request.severity == "high"
    def _process_request(self, request): print(f"Level 3: {request}")
```

Build the chain bottom-up, call the *top* handler:

```python
level1 = Level1Support()
level2 = Level2Support(level1)
level3 = Level3Support(level2)
level3.handle_request(Request("Basic printer issue", "low"))
```

Output:
```
Level3Support cannot handle. Passing...
Level2Support cannot handle. Passing...
Level 1: Request(Basic printer issue, severity=low)
```

> **Q:** Why does the cascade start at `level3` and flow *down* to level1?
> **A:** Because that's where the client calls `handle_request()`. The chain was built with `level3` knowing about `level2` knowing about `level1`. The severity `"low"` triggers `Level1Support._can_handle() == True`, so level1 processes. Each earlier handler prints "cannot handle" before delegating.

## Structure

- **Handler interface / base** — `_successor` ref, template `handle_request()` method.
- **Concrete handlers** — override `_can_handle()` + `_process_request()`.
- **Client** — builds chain, invokes top handler.

The base handler's defining role is *forward to next by default*. Concrete subclasses override only what they handle. *Dec 2024 Q6 answer: B.*

## Pitfall

> **Pitfall**
> Watch which handler the client calls first. If the chain is `level3 = Level3(level2 = Level2(level1 = Level1()))` and you call `level1.handle_request(req)`, only Level1's check runs — the chain flows in whichever direction `_successor` points, not the construction order. Read the wiring carefully on exam output questions. *finalexamsmerge.pdf Q3*

## Takeaway

> **Takeaway**
> Chain of Responsibility decouples the sender of a request from its handler. Neither knows who will actually process the request — the chain just carries it until someone says "mine". The price is diffuse control flow: you cannot read one method to understand the whole pipeline.
