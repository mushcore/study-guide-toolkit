---
title: "COMP 4911 — exam-eve cheat sheet"
---

## Session beans — 3 types

-   **@Stateless**: pooled, no client state, method-ready pool
-   **@Stateful**: per-client state, @Remove ends, @PrePassivate / @PostActivate
-   **@Singleton**: one instance, @Lock(READ/WRITE), @Startup, @DependsOn, @AccessTimeout

**Lifecycle callbacks**: @PostConstruct, @PreDestroy (all). +@PrePassivate / @PostActivate (SFSB).

## EntityManager core

-   **persist(e)**: New → Managed (INSERT queued)
-   **merge(e)**: Detached → Managed COPY (return new ref)
-   **remove(e)**: Managed → Removed
-   **find / getReference**: SELECT or proxy
-   **flush()**: push pending SQL; TX stays open
-   **refresh / detach / clear / contains**

PC: **Transaction-scoped** (default) or **Extended** (SFSB only).

## JPA mapping

-   @Entity (required), @Table (optional; default = class name)
-   @Id + @GeneratedValue (AUTO/IDENTITY/SEQUENCE/TABLE)
-   @Column(name="", nullable=T/F, length=n, unique=T/F)
-   @Temporal(DATE/TIME/TIMESTAMP) — for java.util.Date
-   @Enumerated(STRING) — safer than ORDINAL
-   @Transient — excluded from DB
-   @Version — optimistic lock
-   @Embeddable/@Embedded — value object, same table
-   Composite PK: @IdClass OR @EmbeddedId

## 7 Relationships

-   1:1 uni → @OneToOne + @JoinColumn
-   1:1 bi → inverse: @OneToOne(mappedBy="owner")
-   1:N uni → @OneToMany + @JoinColumn OR @JoinTable
-   N:1 uni → @ManyToOne + @JoinColumn
-   1:N bi → **MANY side owns** (@ManyToOne); ONE side: @OneToMany(mappedBy="…")
-   M:N uni → @ManyToMany + @JoinTable
-   M:N bi → owner @JoinTable; inverse @ManyToMany(mappedBy="…")

Cascade: ALL/PERSIST/MERGE/REMOVE/REFRESH/DETACH · default = none

Fetch: \*ToOne = EAGER; \*ToMany = LAZY

## Inheritance — 3 strategies

-   **SINGLE\_TABLE** (default) — one table + @DiscriminatorColumn + @DiscriminatorValue
-   **JOINED** — table per class, FK joins
-   **TABLE\_PER\_CLASS** — full table per concrete subclass

Use @Inheritance(strategy=…). @MappedSuperclass for abstract non-entity bases.

## JPQL skeleton

```sql
SELECT e FROM Employee e
WHERE e.salary > :min
ORDER BY e.name
```

-   JOIN / LEFT JOIN / **JOIN FETCH** (N+1 fix)
-   COUNT, AVG, SUM, MIN, MAX
-   GROUP BY ... HAVING
-   SELECT new com.x.Dto(f1, f2) FROM …
-   :named / ?positional params
-   q.setFirstResult(n).setMaxResults(m)
-   q.getResultList() / getSingleResult() / executeUpdate()

## Transaction attributes

| Attr | Has TX | No TX |
| --- | --- | --- |
| REQUIRED | Join | Create new |
| REQUIRES\_NEW | Suspend + new | Create new |
| SUPPORTS | Join | No TX |
| NOT\_SUPPORTED | Suspend + no TX | No TX |
| MANDATORY | Join | Exception |
| NEVER | Exception | No TX |

**Default: REQUIRED**. System exception → auto-rollback. Application exception → NOT unless @ApplicationException(rollback=true).

## ACID

-   **Atomic**: all-or-nothing
-   **Consistent**: integrity preserved
-   **Isolated**: no interference
-   **Durable**: persists after crash

## Security annotations

-   @DeclareRoles({"A","B"}) — class level
-   @RolesAllowed({"A"}) — method/class
-   @PermitAll / @DenyAll
-   @RunAs("X") — elevate for downstream
-   ctx.isCallerInRole("X") / getCallerPrincipal()

## Entity callbacks

On entity (no args, void): @PrePersist, @PostPersist, @PreUpdate, @PostUpdate, @PreRemove, @PostRemove, @PostLoad.

External: @EntityListeners(X.class). Listener method takes Object (entity) param.

Rules: NO EntityManager calls, NO other entity access.

## RUP Phases / Milestones

-   **Inception** → **LCO** (vision, business case, ~10%)
-   **Elaboration** → **LCA** (arch baseline, 80% req, ~30%)
-   **Construction** → **IOC** (build + integrate, ~50%)
-   **Transition** → **PR** (deploy, UAT, ~10%)

## 6 Best Practices

1.  Develop iteratively
2.  Manage requirements
3.  Use component-based architectures
4.  Model visually (UML)
5.  Verify quality
6.  Control changes

## 9 RUP Workflows

1.  Business Modeling
2.  Requirements
3.  Analysis & Design
4.  Implementation
5.  Test
6.  Deployment
7.  Config & Change Mgmt
8.  Project Management
9.  Environment

## BCE Stereotypes

-   **Boundary** — UI / external interface (one per actor-UC pair)
-   **Control** — workflow orchestration (one per UC typically)
-   **Entity** — persistent domain object

System Analyst owns analysis model integrity.

## EVMS Formulas

-   BCWS = planned, BCWP = earned, ACWP = actual
-   **CV = BCWP − ACWP** (+ = under budget)
-   **SV = BCWP − BCWS** (+ = ahead)
-   **CPI = BCWP / ACWP**, **SPI = BCWP / BCWS**
-   **EAC = BAC / CPI**

## MBTI Quick Map

-   **E/I**: attitude to world · Extravert = face-to-face
-   **S/N**: perception · Intuition = new complex problems
-   **T/F**: judging function · Feeling = fair
-   **J/P**: outer lifestyle · Perceiving = enjoy surprises; Judging = decide quickly
-   Perceiving functions = S + N · Judging functions = T + F

## Testing

-   **Unit** / Integration / System / Acceptance (black-box)
-   **Performance** = response + processing time
-   **Load** = concurrent users · **Volume** = data size
-   **Configuration** = different envs

## MDB (minimal)

```java
@MessageDriven(activationConfig = {
  @ACP(propertyName="destinationType",
       propertyValue="javax.jms.Queue")
})
class X implements MessageListener {
  public void onMessage(Message m){…}
}
```

Queue = 1:1 (point-to-point); Topic = 1:many (pub-sub). Lifecycle same as SLSB.

## Exam-day checklist

-   Annotate class first (@Entity), THEN members
-   Never skip @Id
-   MCQ: watch fake annotations (@Identity, @PrimaryKey, @InheritanceStrategy — don't exist)
-   T/F: "required" vs "optional" — @Table is OPTIONAL
-   Transaction attributes: memorize table rows
-   JPQL: use DISTINCT to avoid duplicates in joins
-   Essay: bullet outline first; partial credit is real
-   Time budget: don't spend >30 min on essays

## Bruce priority recap

-   **HIGH**: 3 session beans; 7 relationships; JPQL; composite keys (2 ways); transaction attrs; ACID; MBTI; JMS queue vs topic; container concurrency locks
-   **LOW**: 4+1 view (NOT on final), MDB details, auto-gen key specifics, Java EE Ch 18 patterns
-   Quizzes 3+4 questions REAPPEAR on final — memorize answers
