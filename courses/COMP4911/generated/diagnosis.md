# COMP 4911 Final Exam Diagnosis

## Exam Format Summary

**Based on midterm exam analysis** (the only past exam available):

| Element | Details |
|---------|---------|
| **Time limit** | 100 minutes (midterm); final likely similar or longer |
| **Weight** | 25% of course grade (comprehensive) |
| **Scope** | ALL course content -- both process and technical |
| **Question types** | MCQ (2 marks each), True/False (1 mark each), Short Answer (3 marks each), Essay (10 marks each), Code annotation questions |

**Midterm point breakdown** (154 total marks):
- 42 MCQ = 84 marks (55%)
- 10 T/F = 10 marks (6%)
- 10 Short Answer = 30 marks (19%)
- 2 Essay = 20 marks (13%)
- 1 Code Question = ~10 marks (6%)

**Final exam will be comprehensive** -- expect the same format but covering ALL topics including post-midterm material (Weeks 9-14: Design, Callbacks/Listeners, Security, MDBs, JNDI/ENC/Injection, Transactions, General Workflow, Java EE Design).

---

## Topic Inventory with Estimated Exam Weight

### Pillar 1: Process (RUP / Unified Process)

| Topic | Review Slide Coverage | Midterm Questions | Est. Final Weight |
|-------|----------------------|-------------------|-------------------|
| SW Best Practices (6 practices) | Slides 2-19 (heavy) | Q42 (iterative dev) | HIGH |
| RUP Phases & Milestones (I/E/C/T) | Slides 20-24, 36-42 | Q10, Q15, Q39, Q53, Q61 | HIGH |
| Use-Case Driven Development | Slides 25-32 | Q7, Q26, Q29, Q64 (essay) | HIGH |
| Architecture-Centric (4+1 View) | Slides 22-23, 33-35 | Q4, Q17, Q19, Q40, Q41, Q63 (essay) | HIGH |
| Iterations & Workflows | Slides 36-43 | Q10, Q42 | MEDIUM |
| Requirements Capture | Slides 44-47 | Q28, Q29, Q30 | MEDIUM |
| Use Cases as Requirements | Slides 48-50 | Q7, Q8, Q29, Q50 | MEDIUM |
| Analysis (BCE classes) | Slides 51-58 | Q6, Q21, Q43, Q57 | MEDIUM |
| Design | Slides 59-65 | Q13, Q24, Q34 | MEDIUM |
| Implementation | Slides 66-70 | -- | LOW-MEDIUM |
| Testing | Slides 71-76 | Q36 | MEDIUM |
| Generic Iteration Workflow | Slides 77-81 | -- | LOW-MEDIUM |
| Earned Value (EVMS) | Slide deck "00 The Project and Earned Value" | Q9, Q23, Q38, Q54, Q55 | MEDIUM |
| Disaster Recovery | Slides 82-85 | -- | LOW |
| Understanding Preferences (MBTI) | Slides 86-93 | -- | LOW |
| Classic Mistakes | Separate slide deck | -- | LOW |

### Pillar 2: Technical (EJB / Jakarta EE)

| Topic | Review Slide Coverage | Midterm Questions | Est. Final Weight |
|-------|----------------------|-------------------|-------------------|
| EJB Introduction & Architecture (Ch 1-2) | Slides 2-10 | -- | LOW |
| Container Services (Ch 3) | Slides 11-16 | -- | MEDIUM |
| Stateless Session Beans (Ch 5) | Slides 17-25 | -- | MEDIUM |
| Stateful Session Beans (Ch 6) | Slides 26-33 | -- | MEDIUM |
| Singleton Session Beans (Ch 7) | Slides 34-39 | -- | MEDIUM |
| EntityManager & Persistence (Ch 9) | Slides 40-47 | Q1, Q2, Q5, Q20, Q25, Q33, Q58 | HIGH |
| Mapping Persistent Objects (Ch 10) | Slides 48-57 | Q3, Q12, Q22, Q31, Q47 | HIGH |
| Entity Relationships (Ch 11) | Slides 58-83 | Q32, Q35, Q50, Q62, Q65 (code) | HIGH |
| Entity Inheritance (Ch 12) | Slides 84-92 | Q37 | MEDIUM |
| Queries, Criteria API, JPQL (Ch 13) | Slides 93-104 | Q11, Q14, Q60 | HIGH |
| Message-Driven Beans (Ch 8) | Slides 105-114 | -- (post-midterm) | MEDIUM |
| Entity Callbacks & Listeners (Ch 14) | Slides 115-118 | -- (post-midterm) | LOW-MEDIUM |
| EJB Security (Ch 15) | Slides 119-120 | -- (post-midterm) | MEDIUM |
| JNDI, ENC, Injection (Ch 16) | -- (not in review slides) | -- (post-midterm) | LOW-MEDIUM |
| EJB Transactions (Ch 17) | Slides 121-126 | -- (post-midterm) | HIGH |
| Java EE Design (Ch 18) | -- (not in review slides) | -- (post-midterm) | LOW |

---

## High-Leverage Topics (Top 8)

Ranked by combined signal from: review slide emphasis, midterm frequency, and syllabus weight.

### 1. RUP Phases, Milestones & Iterations
- **Why**: 6+ midterm questions; heavily covered in review slides (slides 20-42); foundational to entire process pillar
- **Key concepts**: Inception/Elaboration/Construction/Transition, LCO/LCA/IOC milestones, iteration planning, risk-driven lifecycle, workflow distribution across phases

### 2. Entity Relationships & JPA Mapping (Ch 10-11)
- **Why**: 8+ midterm questions including the CODE question; most detailed section of technical review (slides 48-83)
- **Key concepts**: 7 relationship types (1:1 uni/bi, 1:N uni/bi, N:1 uni, N:N uni/bi), @OneToOne/@OneToMany/@ManyToOne/@ManyToMany, owning vs inverse side, mappedBy, @JoinColumn, @JoinTable, default mapping rules, cascade types, fetch types (LAZY vs EAGER), detached entities

### 3. EntityManager & Persistence Context (Ch 9)
- **Why**: 7 midterm questions; critical foundation for all JPA topics
- **Key concepts**: persist/remove/merge/refresh/flush/find, managed vs detached entities, persistence context (transaction-scoped vs extended), persistence.xml, @PersistenceContext injection, container-managed vs application-managed EntityManager

### 4. JPQL Queries (Ch 13)
- **Why**: 3 midterm questions; 14 slides in review; practical skill tested with code
- **Key concepts**: SELECT/FROM/WHERE/JOIN syntax, named parameters (:param), IN operator, INNER JOIN, LEFT JOIN, FETCH JOIN, aggregate functions (COUNT/AVG/SUM/MIN/MAX), GROUP BY/HAVING, subqueries, constructor expressions, @NamedQuery

### 5. Use-Case Driven Development
- **Why**: Essay question on midterm; 8+ slides in review; drives analysis, design, test, and iteration planning
- **Key concepts**: Use case model relates to design/implementation/test models, use-case realization (sequence + collaboration + class diagrams), use cases drive UI design, test cases, and iteration planning

### 6. EJB Transactions (Ch 17) -- NEW for final
- **Why**: Covered in review slides (slides 121-126); Week 13 topic; ACID properties are fundamental
- **Key concepts**: ACID properties, transaction scope, 6 transaction attributes (Required/RequiresNew/Mandatory/NotSupported/Supports/Never), container-managed vs bean-managed transactions, @TransactionAttribute, system vs application exceptions and rollback behavior

### 7. Architecture-Centric Development (4+1 View Model)
- **Why**: Essay question on midterm; 5+ MCQ; appears twice in review slides
- **Key concepts**: 4+1 views (Logical/Implementation/Process/Deployment + Use-Case), architecture baseline in Elaboration, Software Architecture Document, architectural prototype

### 8. Analysis Classes & Design Workflow
- **Why**: 4+ midterm questions; review slides cover BCE stereotypes and analysis vs design model differences
- **Key concepts**: Boundary/Control/Entity stereotypes, one boundary per actor-use case pair, one control per use case, analysis model (conceptual) vs design model (physical), use-case realization in analysis & design

---

## Question Style Analysis

Based on the midterm, the professor tends to ask:

### Multiple Choice (dominant format)
- **Annotation-specific questions**: "What annotation does X?" (Q1, Q3, Q5, Q12, Q22, Q31, Q32, Q37) -- know exact annotation names and syntax
- **Concept identification**: "Which is NOT..." or "Which of the following..." (Q4, Q17, Q42)
- **EVMS calculations**: Know what each metric stands for and formulas (Q9, Q23, Q38)
- **JPQL syntax**: Given a query or expression, identify correct equivalent or result (Q11, Q14)
- **EntityManager API**: Which method does what? (Q2, Q20, Q25, Q33)
- **RUP phase identification**: "During what phase..." (Q10, Q15, Q39)

### True/False
- Tests precise understanding of nuance (e.g., "waterfall eliminates risks early" = FALSE)
- Common traps: absolute statements, confusing required vs optional annotations

### Short Answer
- Fill-in-the-blank for RUP terminology (phase names, artifact names, EVMS acronyms)
- "Name the three types of..." (analysis class stereotypes, persistence context types)
- Write a JPQL query given entity relationships

### Essay (10 marks each)
- "Describe what X is and how it works" with request for diagram
- "Discuss how Y drives the development process" -- requires connecting multiple concepts
- Expect process-focused AND technical essays on the final

### Code Questions
- Annotate Java classes with JPA annotations to implement relationships
- Likely will include more complex scenarios on the final (inheritance, queries, transactions, security)

---

## Bloom's Level Profile

| Level | Midterm Distribution | Study Implication |
|-------|---------------------|-------------------|
| **Remember** | ~40% (annotation names, acronyms, definitions) | Flashcards essential |
| **Understand** | ~30% (explain concepts, identify correct descriptions) | Concept maps, teach-back |
| **Apply** | ~20% (write JPQL queries, annotate code, calculate EVMS) | Practice problems |
| **Analyze** | ~10% (essays comparing models, identifying risks) | Essay practice |

---

## Coverage Gaps (Post-Midterm Topics to Prioritize)

These topics were NOT on the midterm but WILL be on the comprehensive final:

| Topic | Source | Priority |
|-------|--------|----------|
| **EJB Transactions (Ch 17)** | Review slides 121-126, Week 13 | CRITICAL -- ACID, transaction attributes, CMT vs BMT |
| **Message-Driven Beans (Ch 8)** | Review slides 105-114, Week 10 | HIGH -- JMS concepts, @MessageDriven, lifecycle, Topic vs Queue |
| **EJB Security (Ch 15)** | Review slides 119-120, Week 9 | MEDIUM -- @RolesAllowed, @PermitAll, @DeclareRoles |
| **Entity Callbacks & Listeners (Ch 14)** | Review slides 115-118, Week 9 | MEDIUM -- @PrePersist/@PostPersist etc., @EntityListeners |
| **JNDI, ENC, Injection (Ch 16)** | Week 12, not in review slides | LOW-MEDIUM -- dependency injection, @EJB, @Resource |
| **Design workflow details** | Review slides 59-65, Week 9 | MEDIUM -- purposes of design, analysis vs design model comparison |
| **Java EE Design (Ch 18)** | Week 14 | LOW -- only if instructor emphasized |
| **UP General Workflow (Ch 12)** | Review slides 77-81, Week 14 | LOW-MEDIUM -- risk management, estimation, iteration assessment |

---

## Past Exam Patterns

### Recurring themes from the midterm:
1. **Annotation precision**: The exact syntax matters -- @Table(name="X") not @Table("X")
2. **EntityManager methods**: persist, merge, refresh, remove, flush -- know what each does precisely
3. **EVMS acronyms and formulas**: BCWP, BCWS, ACWP, BAC, EAC, Cost Variance = BCWP - ACWP
4. **RUP phase knowledge**: Which phase does what? What are the milestones?
5. **Owning side in relationships**: Critical for bidirectional relationships
6. **Relationship mapping defaults**: Know the default table/column names the persistence provider generates
7. **Analysis class stereotypes**: Boundary, Control, Entity -- rules for each

### Question distribution (midterm):
- Process questions: ~50% of marks
- Technical questions: ~50% of marks
- Expect similar balance on the final

---

## Recommended Priority Order

Study these topics in this order to maximize exam score:

1. **Entity Relationships (Ch 11)** -- annotations, owning side, 7 types, @JoinColumn/@JoinTable
2. **EntityManager & Persistence (Ch 9)** -- persist/merge/remove/refresh/flush, managed vs detached
3. **EJB Transactions (Ch 17)** -- ACID, 6 transaction attributes, CMT, exception handling
4. **RUP Phases & Iterations** -- I/E/C/T, milestones, workflow distribution, iteration planning
5. **JPQL Queries (Ch 13)** -- SELECT/FROM/JOIN/WHERE syntax, parameters, aggregates, subqueries
6. **Mapping Persistent Objects (Ch 10)** -- @Entity, @Table, @Column, @Id, @GeneratedValue, composite keys, @Embeddable
7. **Use-Case Driven Development** -- how use cases drive analysis, design, test, iteration planning
8. **Architecture (4+1 View)** -- 5 views, what each shows, who uses each
9. **Session Beans (Ch 5-7)** -- SLSB vs SFSB vs Singleton, lifecycles, pooling, passivation/activation, concurrency
10. **Analysis Classes** -- Boundary/Control/Entity, use-case realization
11. **Message-Driven Beans (Ch 8)** -- JMS basics, Topic vs Queue, @MessageDriven, onMessage()
12. **EJB Security (Ch 15)** -- @RolesAllowed, @PermitAll, @DenyAll, @DeclareRoles, @RunAs
13. **Entity Inheritance (Ch 12)** -- SINGLE_TABLE vs JOINED vs TABLE_PER_CLASS, pros/cons, @DiscriminatorColumn
14. **Entity Callbacks (Ch 14)** -- @PrePersist, @PostPersist, etc., @EntityListeners
15. **EVMS** -- all acronyms, CV = BCWP - ACWP, SV = BCWP - BCWS
16. **SW Best Practices** -- 6 practices, iterative vs waterfall risk curves
17. **Disaster Recovery, Classic Mistakes, Preferences** -- lower priority unless time permits

---

*Generated from: Comp4911ReviewProcess.pdf (93 slides), Comp4911ReviewTechnical.pdf (126 slides), midterm exam.pdf (65 questions), Course Outline (weekly schedule). Date: 2026-04-07*
