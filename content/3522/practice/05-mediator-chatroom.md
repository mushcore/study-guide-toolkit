---
n: 5
id: cp-mediator-chatroom
title: "Mediator pattern — chat room"
lang: python
tags: [pattern, mediator, coordination]
source: "DesignPatternsTable p.4, Week 11 Slides"
pedagogy: worked-example-first
kind: code
---

## Prompt

Implement a `ChatRoom` mediator that routes messages between `User` components. Users should not hold references to each other — only to the mediator. Sending a message from Alice should broadcast to Bob and Carol (not echo back to Alice).

Target UML:

<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    .cls { fill: #f7f7fa; stroke: #333; stroke-width: 1.5; }
    .iface { fill: #eef3ff; stroke: #2a4aa0; stroke-width: 1.5; }
    text { font-family: sans-serif; font-size: 12px; fill: #111; }
    .it { font-style: italic; }
    .arrow { stroke: #333; fill: none; stroke-width: 1.5; }
    .inh { stroke: #333; fill: #fff; stroke-width: 1.5; }
    .dashed { stroke-dasharray: 4 3; }
  </style>
  <rect x="220" y="30" width="220" height="80" class="cls" />
  <text x="290" y="50">ChatRoom</text>
  <line x1="220" y1="60" x2="440" y2="60" stroke="#333" />
  <text x="230" y="80">- users: list</text>
  <text x="230" y="100">+ register(user) / notify(sender, msg)</text>
  <rect x="30" y="200" width="140" height="70" class="cls" />
  <text x="75" y="225">User(Alice)</text>
  <text x="40" y="250" font-size="11">- room: ChatRoom</text>
  <rect x="240" y="200" width="140" height="70" class="cls" />
  <text x="290" y="225">User(Bob)</text>
  <rect x="450" y="200" width="140" height="70" class="cls" />
  <text x="495" y="225">User(Carol)</text>
  <path d="M100,200 L290,110" class="arrow dashed" />
  <path d="M310,200 L320,110" class="arrow dashed" />
  <path d="M520,200 L400,110" class="arrow dashed" />
  <text x="80" y="175" font-size="11" fill="#555">each User holds 1 ref</text>
</svg>

## Starter

```python
class ChatRoom:
    def __init__(self):
        self._users = []
    # TODO: register, notify

class User:
    def __init__(self, name):
        self.name = name
        self._room = None
    # TODO: set_room, send, receive
```

## Solution

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
for u in [alice, bob, carol]:
    room.register(u)
alice.send("Hi team!")
# [Bob] from Alice: Hi team!
# [Carol] from Alice: Hi team!
```

## Why

Users hold only the mediator reference. `alice.send("...")` calls `self._room.notify(self, msg)` blindly; the mediator decides the destinations. Adding Dave is `room.register(dave)` — no existing user changes.

Two wrong approaches:
1. **Observer instead of Mediator.** If every user receives the same broadcast (including the sender) and the room simply calls `update` on all, you have Observer. Mediator's selectivity (`if u is not sender`) is the differentiator — asymmetric routing based on who sent what.
2. **User-to-user direct refs "for efficiency".** Once a user holds another user's reference, the N² coupling is back. The whole point of Mediator is that users don't.
