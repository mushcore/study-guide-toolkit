---
"n": 2
id: 4911-lesson-three-session-beans-when-to-pick-which
title: Three session beans — when to pick which
hook: Why are there 3 kinds? Because there are 3 different state patterns.
tags:
  - session-beans
module: EJB — session beans
---

Imagine running a bank website. Every user click triggers an action. How do you structure the code?

#### Pattern A — Stateless (pool of workers)

User clicks "get balance." Code runs → query DB → return number → done. The next click could be handled by a completely fresh worker. Nothing remembered between calls.

This is `@Stateless`. The container keeps a **pool** of instances. Any worker can handle any request. Fast. Scales horizontally.

> **Analogy**
> **Analogy:** Fast food counter. Any cashier can take your order. Nobody remembers you.

**Use for:** Most business methods. "Validate this form." "Send an email." "Process checkout."

#### Pattern B — Stateful (per-client memory)

User starts shopping. Adds item 1. Adds item 2. Then checks out. The bean has to **remember** the cart across multiple clicks from THAT user.

This is `@Stateful`. ONE instance per client. Holds conversational state. When the client idles, the container **passivates** it (serializes to disk) to save memory. When they return, it's **activated** (deserialized).

> **Analogy**
> **Analogy:** Personal banker. Dedicated to you. Remembers your ongoing conversation. Goes on a break (passivated) when you don't show up.

**Use for:** Shopping carts, multi-step wizards, booking workflows.

Lifecycle callbacks: `@PostConstruct`, `@PrePassivate`, `@PostActivate`, `@PreDestroy`, `@Remove` (marks the method that ends the conversation).

#### Pattern C — Singleton (one shared instance)

Some state is GLOBAL to the app. Configuration. A cache. A counter. One instance. All clients share it.

This is `@Singleton`. But "shared" = concurrency problem. What if two threads hit it simultaneously?

You annotate methods with `@Lock(READ)` (many readers OK) or `@Lock(WRITE)` (exclusive — blocks everyone). Plus `@Startup` (eager init) and `@DependsOn("OtherBean")` (init order).

> **Analogy**
> **Analogy:** Shared bulletin board in an office lobby. Everyone reads it. Only one person can edit at a time.

**Use for:** App-wide cache, configuration, global counters, scheduling.

The three session beans — side by side

<svg viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrSB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="130" y="22" text-anchor="middle" class="label-accent">@Stateless (SLSB)</text><text x="380" y="22" text-anchor="middle" class="label-accent">@Stateful (SFSB)</text><text x="630" y="22" text-anchor="middle" class="label-accent">@Singleton</text><rect x="40" y="40" width="180" height="40" class="box" rx="5"></rect><text x="130" y="65" text-anchor="middle" class="label">DoesNotExist</text><path d="M130 80 L130 110" class="arrow-line" marker-end="url(#arrSB)"></path><text x="146" y="98" class="sub">@PostConstruct</text><rect x="40" y="115" width="180" height="40" class="box-accent" rx="5"></rect><text x="130" y="140" text-anchor="middle" class="label">MethodReady</text><text x="130" y="180" text-anchor="middle" class="sub">Pool of workers</text><text x="130" y="196" text-anchor="middle" class="sub">No client state</text><text x="130" y="212" text-anchor="middle" class="sub">Any worker handles any call</text><text x="130" y="244" text-anchor="middle" class="sub">Concurrency: container-serialized</text><text x="130" y="262" text-anchor="middle" class="sub">@PostConstruct · @PreDestroy</text><text x="130" y="290" text-anchor="middle" class="label">Use: business methods</text><rect x="290" y="40" width="180" height="40" class="box" rx="5"></rect><text x="380" y="65" text-anchor="middle" class="label">DoesNotExist</text><path d="M380 80 L380 110" class="arrow-line" marker-end="url(#arrSB)"></path><text x="396" y="98" class="sub">@PostConstruct</text><rect x="290" y="115" width="180" height="40" class="box-accent" rx="5"></rect><text x="380" y="140" text-anchor="middle" class="label">MethodReady</text><path d="M380 155 L380 175" class="arrow-line" marker-end="url(#arrSB)"></path><text x="395" y="170" class="sub">@PrePassivate (idle)</text><path d="M370 175 L370 155" class="arrow-line" marker-end="url(#arrSB)"></path><text x="237" y="170" class="sub">@PostActivate (return)</text><rect x="290" y="180" width="180" height="40" class="box-warn" rx="5"></rect><text x="380" y="205" text-anchor="middle" class="label">Passive (on disk)</text><text x="380" y="244" text-anchor="middle" class="sub">One instance per client</text><text x="380" y="262" text-anchor="middle" class="sub">Conversational state</text><text x="380" y="290" text-anchor="middle" class="label">Use: carts, wizards</text><rect x="540" y="40" width="180" height="40" class="box" rx="5"></rect><text x="630" y="65" text-anchor="middle" class="label">DoesNotExist</text><path d="M630 80 L630 110" class="arrow-line" marker-end="url(#arrSB)"></path><text x="646" y="98" class="sub">@Startup (eager)</text><rect x="540" y="115" width="180" height="40" class="box-accent" rx="5"></rect><text x="630" y="140" text-anchor="middle" class="label">Shared Instance</text><text x="630" y="180" text-anchor="middle" class="sub">ONE instance app-wide</text><text x="630" y="196" text-anchor="middle" class="sub">Shared mutable state</text><text x="630" y="212" text-anchor="middle" class="sub">@DependsOn for init order</text><text x="630" y="244" text-anchor="middle" class="sub">@Lock(READ) parallel</text><text x="630" y="262" text-anchor="middle" class="sub">@Lock(WRITE) exclusive</text><text x="630" y="290" text-anchor="middle" class="label">Use: cache, config, counters</text><rect x="40" y="320" width="680" height="28" class="box" rx="4"></rect><text x="380" y="338" text-anchor="middle" class="sub">Accent border = active/running state · Warn border = serialized to disk (passivated)</text></svg>

> **Takeaway**
> **Takeaway:** State pattern picks the bean type. No state → Stateless. Per-client state → Stateful. Global state → Singleton.

> **Q:** You're building a multi-step hotel booking wizard. Which bean type?
> **A:** Stateful — you need to remember the user's selections (dates, room, guests) across multiple HTTP requests.

> **Q:** A singleton method that only READS data — which lock type?
> **A:** @Lock(READ). Allows multiple concurrent readers. Use @Lock(WRITE) only when mutating shared state.
