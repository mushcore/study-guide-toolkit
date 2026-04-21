---
id: 4911-topic-jndi-enc-injection
title: JNDI, ENC & Injection
pillar: tech
priority: med
chapter: Ch 16
tags:
  - jndi
  - tech
---

#### Mechanism — how injection and JNDI connect

Every container-managed resource — another bean, a DataSource, an EntityManager — is ultimately bound into the server's JNDI tree at deploy time. Injection is convenience syntax: `@EJB private PaymentService payment;` tells the container "at bean-creation time, look up PaymentService in JNDI and assign it to this field." The same lookup is available programmatically through `InitialContext.lookup(name)`; injection just hides the string.

The portable JNDI name scopes define *who can see what*. Each scope answers a different reach:

-   `java:global/[app]/[module]/BeanName` — visible across the whole application server. Use when one app must look up a bean in a different app.
-   `java:app/[module]/BeanName` — visible within one EAR. Use across modules of the same deployed application.
-   `java:module/BeanName` — visible within a single EJB jar or WAR. Use for beans in the same module.
-   `java:comp/env/...` — the Environment Naming Context, a bean's **private** view of its resources. Each component gets its own `comp` space; this is where `@Resource(name="...")` entries land.

Pick the narrowest scope that works: `java:module` for intra-module lookups, `java:app` across modules in the same EAR, `java:global` only when crossing applications. Narrower scope = fewer naming collisions + clearer deployment boundaries.

-   **@EJB** — inject another session bean
-   **@Resource** — inject DataSource, Queue, ConnectionFactory, env-entry
-   **@PersistenceContext** — inject container-managed EntityManager
-   **@PersistenceUnit** — inject EntityManagerFactory (application-managed)

#### Portable global JNDI names (Java EE 6+)

-   `java:global/[app]/[module]/BeanName`
-   `java:app/[module]/BeanName`
-   `java:module/BeanName`
-   `java:comp/env/...` — Environment Naming Context (local refs)

```java
@Stateless
public class OrderService {
    @EJB private PaymentService payment;
    @Resource(lookup = "java:/jms/MyQueue") private Queue auditQueue;
    @Resource private SessionContext ctx;
    @PersistenceContext private EntityManager em;
}
```
