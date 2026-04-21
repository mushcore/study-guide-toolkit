---
id: mediator-dive
title: "Mediator — deep dive"
pillar: tech
priority: mid
tags: [pattern, behavioral, mediator, coordination]
source: "DesignPatternsTable p.4, Week 11 Slides, Lecture Transcripts (Mediator intro/example), finalexamsmerge.pdf dashboard-widgets MCQ, Dec 2024 Final Q9"
bloom_levels: [understand, apply, analyze]
related: [observer, facade]
---

## When to use

N peer components are all talking to each other. Adding a new component means editing most of the existing ones. Mediator collapses N-to-N into N-to-1-to-N: each component knows the mediator; the mediator knows everyone.

The canonical sign: the components are UI widgets, form fields, chat users, game entities — things that peer-interact but should stay reusable.

## Canonical class diagram

<svg viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="250" y="20" width="200" height="80" class="iface" />
  <text x="295" y="40" class="it">«interface» Mediator</text>
  <line x1="250" y1="50" x2="450" y2="50" stroke="#333" />
  <line x1="250" y1="52" x2="450" y2="52" stroke="#333" />
  <text x="260" y="80" class="it">+ notify(sender, event)</text>
  <rect x="220" y="150" width="260" height="80" class="cls" />
  <text x="280" y="172">ConcreteMediator</text>
  <line x1="220" y1="180" x2="480" y2="180" stroke="#333" />
  <text x="230" y="200">- componentA, componentB, ...</text>
  <text x="230" y="220">+ notify(sender, event)</text>
  <path d="M350,150 L350,100" class="arrow" />
  <polygon points="345,105 355,105 350,95" fill="#fff" stroke="#333" />
  <rect x="30" y="260" width="130" height="60" class="cls" />
  <text x="55" y="285">ComponentA</text>
  <rect x="180" y="260" width="130" height="60" class="cls" />
  <text x="205" y="285">ComponentB</text>
  <rect x="330" y="260" width="130" height="60" class="cls" />
  <text x="355" y="285">ComponentC</text>
  <rect x="480" y="260" width="130" height="60" class="cls" />
  <text x="505" y="285">ComponentD</text>
  <path d="M95,260 L290,230" class="arrow dashed" />
  <path d="M245,260 L320,230" class="arrow dashed" />
  <path d="M395,260 L380,230" class="arrow dashed" />
  <path d="M545,260 L420,230" class="arrow dashed" />
  <text x="560" y="210" font-size="11" fill="#555">
    Each component holds 1 ref (mediator).
  </text>
</svg>

## Worked example — chat room

```python
class ChatRoom:
    def __init__(self):
        self._users = []
    def register(self, user):
        self._users.append(user)
        user.set_room(self)
    def notify(self, sender, message):
        for u in self._users:
            if u is not sender:
                u.receive(sender.name, message)

class User:
    def __init__(self, name):
        self.name = name
        self._room = None
    def set_room(self, room):
        self._room = room
    def send(self, msg):
        self._room.notify(self, msg)
    def receive(self, sender, msg):
        print(f"[{self.name}] from {sender}: {msg}")

room = ChatRoom()
alice = User("Alice"); bob = User("Bob"); carol = User("Carol")
for u in [alice, bob, carol]: room.register(u)
alice.send("Hi team!")
# [Bob] from Alice: Hi team!
# [Carol] from Alice: Hi team!
```

Users do not reference each other. Add `dave` without editing `alice.send()`.

## Past-exam scenario match

> **Example**
> *finalexamsmerge.pdf MCQ:* "A modular dashboard application where widgets (charts, filters, status panels) need to update one another based on user actions, but should remain independent and reusable." Answer: **Mediator** (B). Distractors: Observer (broadcast, not selective peer routing), Chain of Responsibility (pipeline, not peer coordination).

## Mediator vs Observer (exam trap)

Both involve a central object and many dependents. Key differences:

- **Observer** — one subject, many homogeneous reactors. All reactors receive the same notification. Subject doesn't decide *what* each reactor does.
- **Mediator** — many components, asymmetric reactions. Mediator *selects* which component reacts to what event, with custom routing logic inside `notify()`.

*Dec 2024 Final Q9 correct: B — "Mediator aims to reduce mutual dependencies between components, while Observer establishes dynamic one-way communication."*

## Pitfalls

> **Pitfall**
> The mediator tends to grow into a god-object as components are added. Symptom: `notify()` is a 200-line if-elif chain on `(sender, event)` pairs. When that happens, split into multiple mediators per subsystem.

> **Pitfall**
> Mediator != Facade. Facade is a one-way simplified entry into a subsystem; the subsystem components don't call the facade. Mediator components actively call the mediator on every event. Past-exam T/F: "Facade and Mediator have similar jobs" — both organize collaboration, but direction and symmetry differ.

## Takeaway

> **Takeaway**
> Mediator is the "hub-and-spoke" refactor for peer soup. Worth it when components need asymmetric reactions; overkill when broadcast (Observer) would do. On the exam, look for the phrase "need to update one another based on..." — that's Mediator, not Observer.
