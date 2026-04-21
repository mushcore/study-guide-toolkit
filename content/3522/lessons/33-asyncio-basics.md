---
n: 33
id: asyncio
title: "asyncio — cooperative concurrency"
hook: "One thread, many coroutines. `await` yields the scheduler; `asyncio.gather` runs them concurrently."
tags: [async, asyncio, await, gather, coroutine]
module: "Functional Python + Profiling"
source: "Week 12 Slides, finalexamsmerge.pdf async Observer Q, Dec 2024 Final timing Q"
bloom_levels: [understand, apply, analyze]
related: [observer, generators-yield]
---

`asyncio` is Python's cooperative concurrency library — single-threaded, event-loop based, ideal for I/O-bound work.

```python
import asyncio

async def fetch(name):
    print(f"{name} start")
    await asyncio.sleep(1)
    print(f"{name} done")
    return name

async def main():
    # Sequential — 2 seconds total
    a = await fetch("A")
    b = await fetch("B")

    # Concurrent — ~1 second total
    results = await asyncio.gather(fetch("C"), fetch("D"))

asyncio.run(main())
```

- `async def` creates a coroutine function. Calling it returns a coroutine object.
- `await expr` pauses the current coroutine until `expr` completes.
- `asyncio.gather(*coros)` schedules several coroutines to run concurrently; awaits them all.
- `asyncio.create_task(coro)` schedules a coroutine to run in the background, returning a `Task` object.
- `asyncio.run(coro)` is the entry point — creates the event loop, runs the coroutine, tears down.

> **Q:** Why is asyncio single-threaded yet called 'concurrent'?
> **A:** Because coroutines *cooperate* — each `await` point yields control back to the event loop, which runs other pending coroutines while the first is waiting. Single thread, but many coroutines make progress in overlapping time windows. Concurrency, not parallelism.

## Timing pitfall (past-exam)

```python
class Observer:
    async def update(self, msg):
        await asyncio.sleep(0.5)
        print(f"got {msg}")

async def main():
    start = time.perf_counter()
    subject = Subject()
    subject.attach(ObserverA())
    subject.attach(ObserverB())
    t1 = subject.notify("sports")
    subject.detach(observer_a)
    t2 = subject.notify("tech")
    await asyncio.gather(t1, t2)
    print(time.perf_counter() - start)
```

Each observer sleeps 0.5s. Two observers get 2 notifications. With `asyncio.gather`, the notifies run concurrently. Expected wall time ≈ **0.6 seconds**, not 1.0s or 2.0s. *finalexamsmerge.pdf async Q.*

## Pitfall

> **Pitfall**
> Awaiting sequentially (`a = await fetch(); b = await fetch()`) serializes. Parallelism requires `gather` or `create_task`. Many past-exam wrong answers assume sequential awaits when the code uses `gather`.

## Takeaway

> **Takeaway**
> `async`/`await` is cooperative — coroutines yield at `await` points. `gather` is how you get concurrency. Total time under `gather` equals the slowest coroutine, not the sum.
