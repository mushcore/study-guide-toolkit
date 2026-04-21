---
n: 4
id: observer
title: "Observer — broadcast state changes to subscribers"
hook: "A player dies in a game. The high-score system, save system, game-over screen, analytics logger all need to react. The player shouldn't have to know any of them."
tags: [pattern, behavioral, observer, publish-subscribe]
module: "Design Patterns — Behavioral"
source: "DesignPatternsTable (1).pdf p.1, Week 9 Slides, Quiz 7, finalexamsmerge.pdf async-Observer Q"
bloom_levels: [understand, apply, analyze]
related: [mediator, state]
---

You're writing `Player.die()`. It currently updates the UI, saves the game, plays a sound, and updates high scores. Four concrete dependencies baked into one method. Adding a fifth reaction (a new achievement tracker) means editing `Player`. A hard coupling between a "thing that changed" and "everyone who cares".

## Subject + observers

```python
class Subject:
    def __init__(self):
        self._observers = []
    def attach(self, observer):
        if observer not in self._observers:
            self._observers.append(observer)
    def detach(self, observer):
        if observer in self._observers:
            self._observers.remove(observer)
    def notify(self, data):
        for observer in self._observers:
            observer.update(self, data)

class HighScoreObserver:
    def update(self, subject, data):
        print(f"Recording high score: {data}")

class SaveSystemObserver:
    def update(self, subject, data):
        print(f"Saving game state")

player = Subject()
player.attach(HighScoreObserver())
player.attach(SaveSystemObserver())
player.notify(score=42)   # broadcasts to both
```

The subject only knows it has a list of "things with `.update()`". It doesn't import `HighScoreObserver`. A new observer attaches at runtime, zero subject edits.

> **Q:** How is this different from the Mediator pattern?
> **A:** Observer is broadcast — the subject notifies every observer the same way. Mediator is coordinated peer-to-peer — a central coordinator routes specific messages between specific components. Observers don't know about each other; mediator components actively send to each other via the mediator.

## Structure

- **Subject** — holds observer list, exposes `attach/detach/notify`.
- **Observer interface** — `update(subject, data)` contract.
- **Concrete observers** — react to notifications.

## Async variant

Python's `asyncio` fits Observer naturally. Make `notify` + `update` coroutines, schedule observer updates with `asyncio.gather()` to run them concurrently.

```python
async def notify(self, message):
    for obs in self._observers:
        await obs.update(message)
```

Timing pitfall: if each observer's `update` sleeps 0.5s and you `await asyncio.gather(notify1, notify2)`, total wall time ≈ 0.5–0.6s (concurrent), not 1.0s (sequential). Past-exam output question preys on this. *finalexamsmerge.pdf async Q*

## Pitfalls

> **Pitfall**
> "State objects are independent and unaware of each other" is an Observer description, not a State one. Don't let past-exam T/F questions flip you. *finalexamsmerge.pdf Q7*

> **Pitfall**
> Observers notified in list order; don't rely on that order for correctness. If order matters, use a priority queue or a Mediator.

## Takeaway

> **Takeaway**
> Observer inverts the dependency: instead of the "thing that changed" calling reactors by name, reactors subscribe and the thing broadcasts blindly. Use it when one change should trigger many independent reactions and you don't want the subject importing every reactor.
