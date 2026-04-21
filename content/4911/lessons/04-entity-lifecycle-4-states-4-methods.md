---
"n": 4
id: 4911-lesson-entity-lifecycle-4-states-4-methods
title: Entity lifecycle — 4 states, 4 methods
hook: Every entity is in one of 4 states. Each EntityManager method moves between them.
tags:
  - jpa
module: JPA — entities & persistence
---

At any moment, every entity object is in exactly one of four states. Understanding these states → understanding JPA.

#### The four states

| State | Meaning | In DB? | Tracked by EM? |
| --- | --- | --- | --- |
| **New** (Transient) | Just `new Customer()`; never persisted | No | No |
| **Managed** | Tracked in persistence context | Yes (or will be) | Yes — changes auto-saved |
| **Detached** | Was managed, now outside PC (e.g. after TX ends) | Yes | No — changes NOT saved |
| **Removed** | Scheduled for DELETE | Yes (for now) | Yes |

#### The state machine

Entity lifecycle — 4 states + EntityManager transitions

<svg viewBox="0 0 760 320" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrEL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><circle cx="40" cy="160" r="8" class="box-accent"></circle><rect x="100" y="135" width="120" height="50" class="box" rx="6"></rect><text x="160" y="158" text-anchor="middle" class="label">New</text><text x="160" y="174" text-anchor="middle" class="sub">(Transient)</text><rect x="320" y="60" width="160" height="60" class="box-accent" rx="6"></rect><text x="400" y="84" text-anchor="middle" class="label-accent">Managed</text><text x="400" y="100" text-anchor="middle" class="sub">tracked by PC</text><text x="400" y="114" text-anchor="middle" class="sub">changes auto-saved</text><rect x="320" y="200" width="160" height="60" class="box-warn" rx="6"></rect><text x="400" y="224" text-anchor="middle" class="label">Detached</text><text x="400" y="240" text-anchor="middle" class="sub">outside PC</text><text x="400" y="254" text-anchor="middle" class="sub">remove() throws — merge() first</text><rect x="580" y="135" width="140" height="50" class="box-bad" rx="6"></rect><text x="650" y="158" text-anchor="middle" class="label">Removed</text><text x="650" y="174" text-anchor="middle" class="sub">scheduled DELETE</text><circle cx="740" cy="160" r="8" class="box-accent"></circle><path d="M48 160 L100 160" class="arrow-line" marker-end="url(#arrEL)"></path><text x="74" y="152" text-anchor="middle" class="sub">new</text><path d="M48 160 Q200 40 320 90" class="arrow-line" marker-end="url(#arrEL)"></path><text x="180" y="60" text-anchor="middle" class="sub">find() / query</text><path d="M220 150 Q270 110 320 95" class="arrow-line" marker-end="url(#arrEL)"></path><text x="270" y="120" text-anchor="middle" class="sub">persist()</text><path d="M395 120 L395 200" class="arrow-line" marker-end="url(#arrEL)"></path><text x="295" y="165" text-anchor="middle" class="sub">TX commit / clear() / detach()</text><path d="M405 200 L405 120" class="arrow-line" marker-end="url(#arrEL)"></path><text x="500" y="165" text-anchor="middle" class="sub">merge() (returns copy)</text><path d="M480 90 L580 155" class="arrow-line" marker-end="url(#arrEL)"></path><text x="540" y="115" text-anchor="middle" class="sub">remove()</text><path d="M720 160 L732 160" class="arrow-line" marker-end="url(#arrEL)"></path><text x="700" y="200" text-anchor="middle" class="sub">TX commit (DELETE)</text></svg>

**Tracked by PC:** Managed + Removed. **Not tracked:** New + Detached (changes lost unless re-attached via merge).  
**Trap:** `remove()` throws on Detached — must `merge()` first.

#### The 5 EntityManager methods you MUST know

-   `persist(e)` — New → Managed (schedules INSERT)
-   `merge(e)` — Detached → Managed COPY (returns new reference, original still detached)
-   `remove(e)` — Managed → Removed (schedules DELETE). **Throws on detached!**
-   `find(Class, pk)` — SELECT; returns Managed or null
-   `flush()` — Push pending SQL to DB (TX stays open)

> **Analogy**
> **Analogy:** Think of the persistence context as a teacher's mental list of students in class.
>
> -   **New** = a kid on the playground, not enrolled
> -   **Managed** = enrolled, on the teacher's roster, the teacher tracks them
> -   **Detached** = graduated, off the roster, teacher ignores changes
> -   **Removed** = getting kicked out at end of day

#### Why merge() exists

You call an EJB, get a Customer, TX ends → entity is now detached. You modify it on the client, send it back, call a new EJB method. The new method's EM has no idea about this entity.

`em.merge(c)` = "reattach this detached entity's state." It finds the DB row, copies the new state in, and returns a NEW managed reference. The original stays detached.

#### Why remove() fails on detached

`remove()` requires the entity to be in the PC. Detached = not in PC = exception. To delete a detached entity: `em.remove(em.merge(c))`.

> **Takeaway**
> **Takeaway:** New → persist. Detached → merge. Managed → just modify, saved automatically at commit. Remove requires managed.

> **Q:** A customer object was loaded in a previous transaction. It's now detached. You change its name and want to save. Which method?
> **A:** merge(). It reattaches the state into a managed copy. On commit, UPDATE runs. persist() would throw — persist is for NEW entities, not detached ones.
