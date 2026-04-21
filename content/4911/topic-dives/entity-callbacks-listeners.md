---
id: 4911-topic-entity-callbacks-listeners
title: Entity Callbacks & Listeners
pillar: tech
priority: med
chapter: Ch 14
tags:
  - jpa
  - callbacks
  - tech
---

Hooks for entity lifecycle events.

#### Mechanism — why callbacks fire and why they are restricted

The persistence provider runs callbacks as part of its own flush/load cycle. When you call `em.persist(o)`, the provider schedules an INSERT for the next flush. Just before issuing the SQL, it invokes every `@PrePersist` method on the entity (and on any `@EntityListeners`). Just after the SQL returns and the generated id is populated, it invokes `@PostPersist`. Same pattern for update, remove, and load.

Because the callback runs *inside* the provider's flush, it must not re-enter the EntityManager. If `@PrePersist` called `em.persist(other)` or `em.createQuery(...)`, the provider would recursively flush while already flushing — undefined behavior in the JPA spec. That is the mechanism behind the restriction: no EM access, no relationship navigation that triggers a lazy load. Safe work is confined to in-memory fields on the entity itself (`this.createdAt = new Date()`, validation, derived fields).

This connects to prior knowledge: the same re-entrancy reason is why you avoid business-method callbacks across beans inside a single transaction flush.

| Callback | When |
| --- | --- |
| @PrePersist | Before INSERT (on persist()) |
| @PostPersist | After INSERT (inside same TX) |
| @PreUpdate | Before UPDATE |
| @PostUpdate | After UPDATE |
| @PreRemove | Before DELETE |
| @PostRemove | After DELETE |
| @PostLoad | After SELECT loads entity into PC |

#### Rules for callback methods on entity

-   No parameters; void return; any visibility
-   Must NOT invoke EntityManager or access other entities

#### External listener

```java
@Entity
@EntityListeners(AuditListener.class)
public class Order { ... }

public class AuditListener {
    @PrePersist
    public void onInsert(Object entity) {   // takes entity as parameter
        System.out.println("Inserting: " + entity);
    }
}
```
