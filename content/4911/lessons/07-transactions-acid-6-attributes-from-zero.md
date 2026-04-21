---
"n": 7
id: 4911-lesson-transactions-acid-6-attributes-from-zero
title: Transactions — ACID + 6 attributes from zero
hook: "What's a transaction? Why do we care? Then: the 6 attributes on a map."
tags:
  - transactions
module: JPQL / queries & transactions
---

#### What is a transaction?

Imagine transferring $100 from Account A to Account B. Two steps:

1.  Subtract $100 from A
2.  Add $100 to B

What if step 1 succeeds but the server crashes before step 2? Money vanishes. Disaster.

A **transaction** wraps both steps: either both succeed, or **neither** takes effect.

#### ACID properties

-   **A**tomicity — all-or-nothing (the transfer example)
-   **C**onsistency — DB goes from valid state to valid state (no corrupt data)
-   **I**solation — concurrent transactions don't see each other's partial work
-   **D**urability — once committed, survives crashes (written to disk)

#### EJB handles transactions for you

You don't write `BEGIN TRANSACTION`. You annotate methods; the container handles the rest. Two modes:

-   **Container-Managed (CMT)** — default; declarative via `@TransactionAttribute`
-   **Bean-Managed (BMT)** — you call `utx.begin()`, `utx.commit()` manually. Rarely used.

#### The 6 CMT attributes — the master table

When method `foo()` is called, the container asks: "Does the caller already have an active TX?" Based on `@TransactionAttribute`, it does one of 6 things:

Transaction attribute decision matrix — color-coded

<svg viewBox="0 0 720 320" preserveAspectRatio="xMidYMid meet"><text x="20" y="22" class="label-accent">Container's decision per @TransactionAttribute</text><text x="160" y="50" text-anchor="middle" class="label">Attribute</text><text x="340" y="50" text-anchor="middle" class="label">Caller HAS TX</text><text x="500" y="50" text-anchor="middle" class="label">Caller NO TX</text><text x="640" y="50" text-anchor="middle" class="label">Typical use</text><line x1="20" y1="58" x2="700" y2="58" class="arrow-line"></line><rect x="20" y="68" width="280" height="32" class="box-ok" rx="3"></rect><rect x="300" y="68" width="120" height="32" class="box-accent" rx="3"></rect><text x="160" y="88" text-anchor="middle" class="label">REQUIRED (default)</text><text x="360" y="88" text-anchor="middle" class="sub">Join caller TX</text><rect x="420" y="68" width="120" height="32" class="box-accent" rx="3"></rect><text x="480" y="88" text-anchor="middle" class="sub">Create new TX</text><text x="620" y="88" class="sub">Default business methods</text><rect x="20" y="105" width="280" height="32" class="box-warn" rx="3"></rect><rect x="300" y="105" width="120" height="32" class="box-warn" rx="3"></rect><text x="160" y="125" text-anchor="middle" class="label">REQUIRES_NEW</text><text x="360" y="125" text-anchor="middle" class="sub">Suspend + NEW TX</text><rect x="420" y="105" width="120" height="32" class="box-accent" rx="3"></rect><text x="480" y="125" text-anchor="middle" class="sub">Create new TX</text><text x="620" y="125" class="sub">Audit log (independent commit)</text><rect x="20" y="142" width="280" height="32" class="box-ok" rx="3"></rect><rect x="300" y="142" width="120" height="32" class="box-accent" rx="3"></rect><text x="160" y="162" text-anchor="middle" class="label">SUPPORTS</text><text x="360" y="162" text-anchor="middle" class="sub">Join caller TX</text><rect x="420" y="142" width="120" height="32" class="box" rx="3"></rect><text x="480" y="162" text-anchor="middle" class="sub">No TX</text><text x="620" y="162" class="sub">Read-only methods</text><rect x="20" y="179" width="280" height="32" class="box-warn" rx="3"></rect><rect x="300" y="179" width="120" height="32" class="box-warn" rx="3"></rect><text x="160" y="199" text-anchor="middle" class="label">NOT_SUPPORTED</text><text x="360" y="199" text-anchor="middle" class="sub">Suspend + no TX</text><rect x="420" y="179" width="120" height="32" class="box" rx="3"></rect><text x="480" y="199" text-anchor="middle" class="sub">No TX</text><text x="620" y="199" class="sub">Legacy non-TX code</text><rect x="20" y="216" width="280" height="32" class="box-ok" rx="3"></rect><rect x="300" y="216" width="120" height="32" class="box-accent" rx="3"></rect><text x="160" y="236" text-anchor="middle" class="label">MANDATORY</text><text x="360" y="236" text-anchor="middle" class="sub">Join caller TX</text><rect x="420" y="216" width="120" height="32" class="box-bad" rx="3"></rect><text x="480" y="236" text-anchor="middle" class="sub">THROW!</text><text x="620" y="236" class="sub">Helper expecting caller TX</text><rect x="20" y="253" width="280" height="32" class="box-bad" rx="3"></rect><rect x="300" y="253" width="120" height="32" class="box-bad" rx="3"></rect><text x="160" y="273" text-anchor="middle" class="label">NEVER</text><text x="360" y="273" text-anchor="middle" class="sub">THROW!</text><rect x="420" y="253" width="120" height="32" class="box" rx="3"></rect><text x="480" y="273" text-anchor="middle" class="sub">No TX</text><text x="620" y="273" class="sub">Must NOT be in TX</text><rect x="20" y="295" width="14" height="14" class="box-accent"></rect><text x="40" y="306" class="sub">new/own TX</text><rect x="120" y="295" width="14" height="14" class="box-ok"></rect><text x="140" y="306" class="sub">join caller</text><rect x="210" y="295" width="14" height="14" class="box-warn"></rect><text x="230" y="306" class="sub">suspend</text><rect x="290" y="295" width="14" height="14" class="box-bad"></rect><text x="310" y="306" class="sub">throw / no TX rejected</text><rect x="430" y="295" width="14" height="14" class="box"></rect><text x="450" y="306" class="sub">no TX</text></svg>

**Memorize this grid.** Quiz 4 Q4/Q5/Q13 asked these distinctions directly.

#### Worked trace — REQUIRED calls REQUIRES\_NEW that throws

The matrix tells you the policy. A trace tells you what actually happens when policies compose. Walk through this one step by step.

```java
@Stateless
public class OrderService {
    @EJB private AuditService audit;

    @TransactionAttribute(REQUIRED)              // method A
    public void placeOrder(Order o) {
        em.persist(o);                           //  line A1
        audit.log("order " + o.getId());         //  line A2 — calls B
        em.persist(new Shipment(o));             //  line A3
    }
}

@Stateless
public class AuditService {
    @TransactionAttribute(REQUIRES_NEW)          // method B
    public void log(String msg) {
        em.persist(new AuditEntry(msg));         //  line B1
        throw new RuntimeException("disk full"); //  line B2 — system exception
    }
}
```

Client calls `placeOrder(o)` with NO active TX. Step through:

<svg viewBox="0 0 760 280" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrTX" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="20" class="label-accent">REQUIRED → calls REQUIRES_NEW that throws</text><line x1="80" y1="50" x2="740" y2="50" class="arrow-line" marker-end="url(#arrTX)"></line><text x="740" y="42" text-anchor="end" class="sub">time →</text><text x="40" y="80" class="label">TX-1</text><text x="40" y="94" class="sub">(REQUIRED)</text><rect x="80" y="65" width="160" height="30" class="box-accent" rx="3"></rect><text x="160" y="85" text-anchor="middle" class="sub">begin · persist(o)</text><rect x="240" y="65" width="200" height="30" class="box-warn" rx="3"></rect><text x="340" y="85" text-anchor="middle" class="sub">SUSPENDED (waiting on TX-2)</text><rect x="440" y="65" width="140" height="30" class="box-accent" rx="3"></rect><text x="510" y="85" text-anchor="middle" class="sub">resumed (exception)</text><rect x="580" y="65" width="160" height="30" class="box-bad" rx="3"></rect><text x="660" y="85" text-anchor="middle" class="sub">ROLLBACK · o discarded</text><text x="40" y="140" class="label">TX-2</text><text x="40" y="154" class="sub">(REQUIRES_NEW)</text><rect x="240" y="125" width="100" height="30" class="box-accent" rx="3"></rect><text x="290" y="145" text-anchor="middle" class="sub">begin · persist</text><rect x="340" y="125" width="60" height="30" class="box-bad" rx="3"></rect><text x="370" y="145" text-anchor="middle" class="sub">throw</text><rect x="400" y="125" width="40" height="30" class="box-bad" rx="3"></rect><text x="420" y="145" text-anchor="middle" class="sub">RB</text><path d="M240 95 L240 125" class="arrow-line" marker-end="url(#arrTX)"></path><text x="180" y="118" class="sub">suspend TX-1, start TX-2</text><path d="M420 155 L440 95" class="arrow-line" marker-end="url(#arrTX)"></path><text x="445" y="160" class="sub">resume TX-1, propagate exception</text><text x="40" y="200" class="label">DB result</text><rect x="80" y="185" width="660" height="30" class="box-bad" rx="3"></rect><text x="410" y="205" text-anchor="middle" class="sub">no Order · no Shipment · no AuditEntry — caller sees EJBException</text><rect x="20" y="230" width="200" height="40" class="box-ok" rx="4"></rect><text x="120" y="250" text-anchor="middle" class="sub">If A CATCHES the exception:</text><text x="120" y="264" text-anchor="middle" class="sub">TX-1 commits · only TX-2 lost</text><text x="240" y="252" class="sub">REQUIRES_NEW makes the inner TX independent —</text><text x="240" y="268" class="sub">but only the catch in A protects the outer TX from system-exception rollback.</text></svg>


1.  **Enter A.** Caller has no TX. REQUIRED policy → container creates **TX-1**. A runs in TX-1. `em.persist(o)` enlists in TX-1.
2.  **A calls B (line A2).** TX-1 is active. REQUIRES\_NEW policy → container **suspends TX-1** and creates **TX-2**. B runs in TX-2. `em.persist(AuditEntry)` enlists in TX-2.
3.  **B throws RuntimeException (line B2).** System exception → container marks **TX-2 rollback-only**, rolls it back (AuditEntry is discarded), then **resumes TX-1** and re-throws to A wrapped as `EJBException`.
4.  **Back in A.** A did not catch. The exception propagates out of A. Container marks **TX-1 rollback-only** (system exception escaping a bean method), rolls it back. `o` from line A1 is discarded. Line A3 never runs.
5.  **Caller sees** `EJBException`. Database has neither the Order, nor the Shipment, nor the AuditEntry.

**Contrast: what if A CATCHES the exception?**

```java
try { audit.log(msg); }
catch (EJBException e) { /* swallow */ }
```

1.  Steps 1–3 identical. TX-2 rolls back. TX-1 resumes.
2.  A catches — exception does NOT escape A. TX-1 is NOT marked rollback-only.
3.  Line A3 runs, enlisted in TX-1. A returns normally.
4.  Container commits TX-1. Order + Shipment persist. AuditEntry is GONE (TX-2 rolled back independently).

The decoupling is the point: REQUIRES\_NEW lets the outer transaction survive a failure in the inner one, or fail independently — caller's choice via catch.

> **Analogy**
> **Exam-trap:** students assume REQUIRES\_NEW "protects" the outer TX automatically. It does not — only the inner TX is isolated. If the exception escapes, the container rolls the outer TX back just like any other system exception. Catching the exception is what preserves the outer TX.

#### Mental model: two axes

> **Analogy**
> **Think of each attribute as answering two questions:**
>
> 1.  "If the caller has a TX, should I *join*, *suspend*, or *reject*?"
> 2.  "If the caller has no TX, should I *create* one, *run without*, or *reject*?"

#### Why REQUIRES\_NEW matters

Scenario: a business method transfers money. Mid-transfer, you want to log an audit entry. If the transfer FAILS and rolls back, you still want the audit log. Solution: mark `logAudit()` as `REQUIRES_NEW` — its own TX. The outer TX can roll back without affecting the audit log.

#### Exceptions and rollback

-   **System exceptions** (RuntimeException) → container auto-rolls back the TX
-   **Application exceptions** (checked) → DO NOT auto-rollback. Unless declared `@ApplicationException(rollback=true)`.
-   Manual: `sessionContext.setRollbackOnly()`

> **Takeaway**
> **Takeaway:** Default REQUIRED works for 95% of code. REQUIRES\_NEW for independent sub-tasks (audit). MANDATORY for helper methods. Memorize the 6 × 2 table — Quiz 4 hammered these distinctions and they reappear.

> **Q:** Method A (REQUIRED) calls method B (REQUIRES\_NEW). B throws RuntimeException. What happens to A's transaction?
> **A:** B's TX rolls back (system exception). A's TX is independent — it continues unless A explicitly handles/re-throws the exception. If A doesn't catch it, A's TX rolls back too.

> **Q:** You want a method that REFUSES to run unless the caller already has a transaction. Which attribute?
> **A:** MANDATORY. Throws EJBTransactionRequiredException if no caller TX.
