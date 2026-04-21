---
id: 4911-topic-ejb-transactions-acid-6-attributes
title: EJB Transactions (ACID + 6 Attributes)
pillar: tech
priority: high
chapter: Ch 17
tags:
  - ejb
  - transactions
  - tech
---

#### ACID properties (Quiz 4 hit each separately)

-   **Atomicity** — all-or-nothing (Q8)
-   **Consistency** — integrity of data store (Q15)
-   **Isolation** — no interference (Q10)
-   **Durability** — persist after crash

#### 6 Transaction Attributes — the table

| Attribute | Caller HAS TX | Caller NO TX |
| --- | --- | --- |
| **REQUIRED** (default) | Join caller's TX | Container creates new TX |
| **REQUIRES\_NEW** | Suspend caller, create NEW TX | Create new TX |
| **SUPPORTS** | Join caller's TX | Run without TX |
| **NOT\_SUPPORTED** | Suspend caller, run without TX | Run without TX |
| **MANDATORY** | Join caller's TX | **Throws EJBTransactionRequiredException** |
| **NEVER** | **Throws EJBException** | Run without TX |

#### Quiz 4 transactions — memorize

-   Q4: "Does NOT propagate, runs WITHOUT TX" = **NotSupported**
-   Q5: "Propagates if exists, else creates new" = **Required**
-   Q13: "Does NOT propagate, runs with NEW TX" = **RequiresNew**

#### Rollback behavior

-   **System exception** (RuntimeException, EJBException) → auto-rollback + logged + wrapped in EJBException
-   **Application exception** (checked) → **NO auto-rollback** unless declared `@ApplicationException(rollback=true)`
-   Programmatic: `sessionContext.setRollbackOnly()`

#### CMT vs BMT

```java
// Container-managed (default)
@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)
public class OrderService {
    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void audit(Event e) { ... }
}

// Bean-managed
@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class ManualTxBean {
    @Resource UserTransaction utx;
    public void work() {
        utx.begin();
        try { ... ; utx.commit(); }
        catch (Exception e) { utx.rollback(); }
    }
}
```
