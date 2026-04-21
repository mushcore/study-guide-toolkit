---
id: chain-of-responsibility-dive
title: "Chain of Responsibility — deep dive"
pillar: tech
priority: high
tags: [pattern, behavioral, chain-responsibility, handler]
source: "DesignPatternsTable p.2, Week 8 Slides, Week10SampleCode/chain_of_responsibility.py, finalexamsmerge.pdf Q3 + Dec 2024 Q6"
bloom_levels: [understand, apply, analyze]
related: [mediator, observer]
---

## When to use

The request must go through an ordered sequence of processors, any of which can handle it or pass it on. You want to reorder, insert, or remove processors without touching the others. Classic uses: event bubbling in UI frameworks, middleware pipelines, validation chains, multi-tier support escalation.

## Canonical class diagram

<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    .abs { fill: #fff6ea; stroke: #a06a2a; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="220" y="20" width="200" height="80" class="iface" />
  <text x="265" y="40" class="it">«interface» Handler</text>
  <line x1="220" y1="50" x2="420" y2="50" stroke="#333" />
  <line x1="220" y1="52" x2="420" y2="52" stroke="#333" />
  <text x="230" y="72" class="it">+ set_next(Handler)</text>
  <text x="230" y="90" class="it">+ handle(request)</text>
  <rect x="220" y="150" width="200" height="100" class="abs" />
  <text x="255" y="170" class="it">BaseHandler</text>
  <line x1="220" y1="180" x2="420" y2="180" stroke="#333" />
  <text x="230" y="200">- next: Handler</text>
  <line x1="220" y1="208" x2="420" y2="208" stroke="#333" />
  <text x="230" y="225">+ set_next(Handler)</text>
  <text x="230" y="242">+ handle(req)</text>
  <path d="M320,150 L320,100" class="arrow dashed" />
  <polygon points="315,105 325,105 320,95" fill="#fff" stroke="#333" />
  <rect x="220" y="280" width="200" height="60" class="cls" />
  <text x="255" y="305">ConcreteHandlers</text>
  <text x="230" y="330" font-size="11">override can_handle + process</text>
  <path d="M320,280 L320,250" class="arrow" />
  <polygon points="315,255 325,255 320,245" fill="#fff" stroke="#333" />
  <path d="M420,200 C520,200 520,200 520,150 C520,120 460,110 320,180" class="arrow" fill="none" />
  <text x="470" y="195" font-size="10">next</text>
</svg>

## Worked example — purchase validation

```python
class Handler:
    def __init__(self, successor=None):
        self._successor = successor
    def handle(self, order):
        if self._can_handle(order):
            return self._process(order)
        if self._successor:
            return self._successor.handle(order)
        return "Rejected — no handler could process"
    def _can_handle(self, order): raise NotImplementedError
    def _process(self, order): raise NotImplementedError

class AuthCheck(Handler):
    def _can_handle(self, o): return o.user is None
    def _process(self, o): return "Rejected — not signed in"

class StockCheck(Handler):
    def _can_handle(self, o): return o.item.stock == 0
    def _process(self, o): return "Rejected — out of stock"

class PaymentCheck(Handler):
    def _can_handle(self, o): return o.payment.valid
    def _process(self, o): return "Accepted"

# Build chain top-down (intended call order)
chain = AuthCheck(StockCheck(PaymentCheck()))
chain.handle(my_order)
```

## Output-trace example (past-exam staple)

Chain built `level3 = Level3Support(level2 = Level2Support(level1 = Level1Support()))`. Request severity `"low"`. Call `level3.handle_request(req)`.

```
Level3Support cannot handle. Passing to next handler...
Level2Support cannot handle. Passing to next handler...
Level 1 Support: Handling request - Request(Basic printer issue, severity=low)
```

> **Example**
> *finalexamsmerge.pdf Q3 correct: Option A.* The distractors all reorder the trace — B starts with Level 1 handling (would only be true if called on level1 directly), C skips Level1 (would only be right if Level1 wasn't in the chain), D inverts the cascade order.

## Pitfalls

> **Pitfall**
> Watch which handler the client calls. Calling `level1.handle_request(req)` on the chain above skips Level2 + Level3 entirely — cascade direction is `self._successor`, not construction order. Past exam gotcha.

> **Pitfall**
> A request that no handler can process quietly falls off the end unless your base handler prints / raises. Write a terminal "request cannot be handled" branch in the base class.

> **Pitfall**
> Every handler re-checks whether it can handle — O(n) even when the request was obviously for handler n. If performance matters, consider a `HashMap<Type, Handler>` dispatch instead.

## Takeaway

> **Takeaway**
> Chain of Responsibility is great when you want a pipeline of checks with no single handler knowing the whole sequence. The price is diffuse control flow — to trace a request, you follow `_successor` through every link.
