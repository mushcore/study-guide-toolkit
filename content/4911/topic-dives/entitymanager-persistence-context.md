---
id: 4911-topic-entitymanager-persistence-context
title: EntityManager & Persistence Context
pillar: tech
priority: high
chapter: Ch 9
tags:
  - jpa
  - tech
---

EntityManager is the gateway between Java entities and the database. It maintains a Persistence Context (PC) — the set of managed entities within a transaction.

#### Core API methods

| Method | Effect | Input state |
| --- | --- | --- |
| `persist(e)` | New → Managed; schedules INSERT | New (or Managed; noop). Throws on Detached. |
| `merge(e)` | Detached → Managed COPY (returns copy) | Any. Does NOT modify passed-in instance. |
| `remove(e)` | Managed → Removed; schedules DELETE | Managed only. Throws on Detached. |
| `find(cls, pk)` | SELECT; null if missing | Returns Managed |
| `getReference(cls, pk)` | Proxy; no DB hit until accessed | Returns Managed proxy |
| `refresh(e)` | Reload from DB, overwrite memory | Managed only |
| `flush()` | Push pending SQL to DB; TX stays open | Any managed state |
| `detach(e)` | Managed → Detached (JPA 2.0+) | — |
| `clear()` | Detach ALL; unsaved changes lost | — |
| `contains(e)` | True if entity is managed | — |

#### Persistence context scope

```java
// Transaction-scoped (default): lives for one TX
@PersistenceContext
private EntityManager em;

// Extended: spans multiple TXs — SFSB only
@PersistenceContext(type = PersistenceContextType.EXTENDED)
private EntityManager em;
```

#### Key rules

-   Two find()s with same PK in same PC return the **same Java instance**.
-   Flush happens automatically: before queries; at TX commit; on explicit flush().
-   remove() on detached → IllegalArgumentException. merge() first, THEN remove.
-   Lazy-loaded fields throw LazyInitializationException if accessed on detached entity.
