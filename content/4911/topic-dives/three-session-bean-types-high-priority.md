---
id: 4911-topic-three-session-bean-types-high-priority
title: Three Session Bean Types (HIGH PRIORITY)
pillar: tech
priority: high
chapter: Ch 5-7
tags:
  - session-beans
  - tech
---

Three distinct session bean flavors, each with different statefulness + concurrency semantics.

| Type | Annotation | State | Lifecycle | Concurrency |
| --- | --- | --- | --- | --- |
| Stateless | `@Stateless` | No client state | DoesNotExist → PooledMethodReady | Container serializes; pooled instances |
| Stateful | `@Stateful` | Per-client conversational | \+ Passive (via @PrePassivate / @PostActivate) | One thread per instance per client |
| Singleton | `@Singleton` | App-wide shared | Same as SLSB (no passive) | **@Lock(READ/WRITE)** or BEAN-managed |

#### Stateful lifecycle callbacks

-   **@PostConstruct** — after DI, before any business method
-   **@PrePassivate** — before container serializes to disk (inactive client)
-   **@PostActivate** — after deserialization when client returns
-   **@PreDestroy** — before removal
-   **@Remove** — marks a method whose return ends the conversation

#### Singleton concurrency (high-priority flag)

```java
@Singleton
@Startup
@ConcurrencyManagement(ConcurrencyManagementType.CONTAINER)
@Lock(LockType.READ)  // class-level default
public class Cache {
    @Lock(LockType.WRITE)                  // exclusive
    @AccessTimeout(value=5, unit=SECONDS)  // wait cap
    public void refresh() { ... }

    public Data get() { ... }              // READ: concurrent
}
```

**READ** = many readers, no writers concurrently. **WRITE** = exclusive (blocks all reads + writes). @AccessTimeout throws ConcurrentAccessTimeoutException if wait exceeded.

#### @DependsOn

`@DependsOn("ConfigSingleton")` ensures another singleton's @PostConstruct runs first. Critical for init order.
