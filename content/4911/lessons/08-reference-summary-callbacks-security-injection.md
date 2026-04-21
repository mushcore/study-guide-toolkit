---
"n": 8
id: 4911-lesson-reference-summary-callbacks-security-injection
title: Reference summary — callbacks, security, injection
hook: >-
  Overview only. Three smaller topics bundled for orientation. See Topic Deep-Dives for each concept (Ch 14, Ch 15, Ch
  16) separately before the exam.
tags:
  - callbacks
  - security
  - jndi
module: EJB — session beans
---

#### Entity callbacks (Ch 14)

Lifecycle hooks fire automatically on entity events. Useful for audit timestamps, validation, computed fields.

```java
@Entity
public class Order {
    @Id private Long id;
    private Date createdAt;
    private Date updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = new Date();
    }
}
```

Seven callbacks:

-   `@PrePersist` / `@PostPersist` — around INSERT
-   `@PreUpdate` / `@PostUpdate` — around UPDATE
-   `@PreRemove` / `@PostRemove` — around DELETE
-   `@PostLoad` — after SELECT loads entity (no @PreLoad exists)

**Rules:** no parameters, void return, MUST NOT call EntityManager or touch other entities.

#### External listener

```java
@Entity
@EntityListeners(AuditListener.class)
public class Order { ... }

public class AuditListener {
    @PrePersist
    public void log(Object entity) {   // takes entity as parameter
        System.out.println("Inserting: " + entity);
    }
}
```

#### Security (Ch 15)

Role-based access control at method level. Container enforces.

```java
@Stateless
@DeclareRoles({"ADMIN","USER","GUEST"})      // all roles used
public class AccountService {

    @PermitAll
    public Account getAccount(Long id) { ... }        // anyone authenticated

    @RolesAllowed({"ADMIN","USER"})
    public void update(Account a) { ... }             // specific roles

    @RolesAllowed("ADMIN")
    public void delete(Long id) { ... }               // single role

    @DenyAll
    void internalOnly() { ... }                       // nobody can call

    @RunAs("SYSTEM")                                  // elevate identity
    public void spawnAudit() { ... }
}
```

Programmatic: `ctx.isCallerInRole("ADMIN")`, `ctx.getCallerPrincipal()`.

#### Injection (Ch 16)

The container wires dependencies via annotations at deployment:

```java
@Stateless
public class OrderService {
    @EJB private PaymentService payment;         // another EJB
    @Resource private DataSource ds;             // JDBC datasource
    @Resource(lookup="java:/jms/MyQueue")
        private Queue auditQueue;                 // JMS
    @Resource private SessionContext ctx;        // container context
    @PersistenceContext private EntityManager em;  // JPA
}
```

**Portable JNDI names** (when you can't inject):

-   `java:global/app/module/BeanName`
-   `java:app/module/BeanName`
-   `java:module/BeanName`
-   `java:comp/env` — local Environment Naming Context

> **Takeaway**
> **Takeaway:** Callbacks = lifecycle hooks (Pre/Post × Persist/Update/Remove + PostLoad). Security = @DeclareRoles + @RolesAllowed/@PermitAll/@DenyAll. Injection = @EJB/@Resource/@PersistenceContext.

> **Q:** Which callback updates a "lastModified" timestamp on save?
> **A:** @PreUpdate (for updates) and @PrePersist (for initial insert). Use both if you want it set on create AND every update.

> **Q:** A method marked @RolesAllowed({}) is callable by...?
> **A:** Nobody. Empty array = no roles permitted = equivalent to @DenyAll.
