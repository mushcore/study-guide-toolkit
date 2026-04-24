---
n: 3
id: cp-chain-of-responsibility-support
title: "Chain of Responsibility — tiered support handler"
lang: python
tags: [pattern, chain-of-responsibility, handler]
source: "finalexamsmerge.pdf Q3, Week10SampleCode/chain_of_responsibility.py"
pedagogy: worked-example-first
kind: code
---

## Prompt

Implement a 3-tier support system using Chain of Responsibility. A `Request` has `description` and `severity` (one of "low", "medium", "high"). Each handler tries to process the request; if it can't, it passes to `_successor`. Trace the output for a request of severity `"low"` when called on the top-of-chain `Level3Support`.

Target UML:

<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .abs { fill: #fff6ea; stroke: #a06a2a; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
  </style>
  <rect x="260" y="20" width="220" height="110" class="abs" />
  <text x="320" y="42" class="it">SupportHandler</text>
  <line x1="260" y1="52" x2="480" y2="52" stroke="#333" />
  <text x="270" y="72">- _successor: Handler</text>
  <line x1="260" y1="82" x2="480" y2="82" stroke="#333" />
  <text x="270" y="102">+ handle_request(request)</text>
  <text x="270" y="118" class="it">_can_handle(req)</text>
  <rect x="40" y="220" width="180" height="100" class="cls" />
  <text x="75" y="245">Level1Support</text>
  <text x="50" y="275" font-size="11">severity == "low"</text>
  <rect x="260" y="220" width="180" height="100" class="cls" />
  <text x="295" y="245">Level2Support</text>
  <text x="270" y="275" font-size="11">severity == "medium"</text>
  <rect x="480" y="220" width="180" height="100" class="cls" />
  <text x="515" y="245">Level3Support</text>
  <text x="490" y="275" font-size="11">severity == "high"</text>
  <path d="M130,220 L340,130" class="arrow" />
  <polygon points="335,125 346,128 340,137" class="inh" />
  <path d="M350,220 L370,130" class="arrow" />
  <polygon points="365,125 376,128 370,137" class="inh" />
  <path d="M570,220 L400,130" class="arrow" />
  <polygon points="404,125 396,135 391,127" class="inh" />
</svg>

## Starter

```python
class SupportHandler:
    def __init__(self, successor=None):
        self._successor = successor
    def handle_request(self, request):
        if self._can_handle(request):
            self._process_request(request)
        elif self._successor is not None:
            print(f"{self.__class__.__name__} cannot handle. Passing to next handler...")
            self._successor.handle_request(request)
        else:
            print("Request cannot be handled!")
    def _can_handle(self, request):
        raise NotImplementedError
    def _process_request(self, request):
        raise NotImplementedError

class Request:
    def __init__(self, description, severity):
        self.description = description
        self.severity = severity
    def __str__(self):
        return f"Request({self.description}, severity={self.severity})"

# TODO: Level1Support, Level2Support, Level3Support
# TODO: Build chain level3 = Level3Support(Level2Support(Level1Support()))
# TODO: Call level3.handle_request(Request("Basic printer issue", "low"))
```

## Solution

```python
class SupportHandler:
    def __init__(self, successor=None):
        self._successor = successor
    def handle_request(self, request):
        if self._can_handle(request):
            self._process_request(request)
        elif self._successor is not None:
            print(f"{self.__class__.__name__} cannot handle. Passing to next handler...")
            self._successor.handle_request(request)
        else:
            print("Request cannot be handled!")
    def _can_handle(self, request):
        raise NotImplementedError
    def _process_request(self, request):
        raise NotImplementedError

class Level1Support(SupportHandler):
    def _can_handle(self, request):
        return request.severity == "low"
    def _process_request(self, request):
        print(f"Level 1 Support: Handling request - {request}")

class Level2Support(SupportHandler):
    def _can_handle(self, request):
        return request.severity == "medium"
    def _process_request(self, request):
        print(f"Level 2 Support: Handling request - {request}")

class Level3Support(SupportHandler):
    def _can_handle(self, request):
        return request.severity == "high"
    def _process_request(self, request):
        print(f"Level 3 Support: Handling request - {request}")

class Request:
    def __init__(self, description, severity):
        self.description = description
        self.severity = severity
    def __str__(self):
        return f"Request({self.description}, severity={self.severity})"

level1 = Level1Support()
level2 = Level2Support(level1)
level3 = Level3Support(level2)
level3.handle_request(Request("Basic printer issue", "low"))
# Level3Support cannot handle. Passing to next handler...
# Level2Support cannot handle. Passing to next handler...
# Level 1 Support: Handling request - Request(Basic printer issue, severity=low)
```

## Why

The base class holds the forwarding logic once. Concrete subclasses only decide what they handle. Build the chain bottom-up (`level1` has no successor, `level2` wraps `level1`, `level3` wraps `level2`) and call the top — the request cascades down.

Two wrong approaches:
1. **Calling `level1.handle_request(...)` directly.** That skips Level2 + Level3 entirely — only Level1's check runs. Past-exam distractor B assumes this.
2. **Overriding `handle_request` in each subclass instead of the template method pattern with `_can_handle`.** Works but duplicates the forward-to-successor logic. The abstract base's `handle_request` is meant to be the template — subclasses provide only the policy.
