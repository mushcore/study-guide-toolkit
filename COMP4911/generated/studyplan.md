# COMP 4911 Final Exam Study Plan

**Duration**: 12 days (April 7 -- April 18, exam week of April 20)
**Daily budget**: 1.5 hours average (1--2 hrs/day)
**Total study hours**: ~18 hours
**Sleep rule**: No studying past 11pm. 7+ hours sleep every night. Non-negotiable.

---

## How to Use This Plan

Each day has **three 25-minute Pomodoro blocks** with 5-minute breaks between them.
On lighter days (1 hour), do blocks 1--2 only. On heavier days (2 hours), add a bonus block.

**Activity types**:
- **Flashcards (FC)**: Review/create flashcards from generated sets. Active recall only -- no passive reading.
- **Practice (PR)**: Work practice questions, annotate code, write JPQL, calculate EVMS.
- **Explain (EX)**: Teach-back -- explain the concept out loud or in writing as if teaching someone.
- **Mock (MK)**: Timed practice under exam conditions using past exam and generated questions.
- **Checkpoint (CP)**: 10-min self-test -- write down everything you can recall, then check gaps.

---

## Phase 1: Foundation (Days 1--4) -- New Material, Highest-Weight Topics

### Day 1 (April 7) -- Entity Relationships & EntityManager
> **Goal**: Understand the 7 JPA relationship types and EntityManager lifecycle methods.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Entity Relationships (Ch 11) | EX + FC | ReviewTechnical slides 58--83 | Remember/Understand |
| -- | 5 min break | | | | |
| 2 | 25 min | EntityManager (Ch 9) | EX + FC | ReviewTechnical slides 40--47 | Remember/Understand |
| -- | 5 min break | | | | |
| 3 | 25 min | Entity Relationships | PR | Annotate entity code from midterm Q65; write relationship mappings from scratch | Apply |

**Checkpoint**: Without notes, list the 7 relationship types and which side is the owning side in each. Name all 6 EntityManager methods and what each does.

**Milestone**: By end of Day 1, you should be able to annotate a bidirectional @OneToMany relationship and explain persist vs merge vs refresh.

---

### Day 2 (April 8) -- EJB Transactions & RUP Phases
> **Goal**: Learn the 6 transaction attributes and the 4 RUP phases with milestones.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | EJB Transactions (Ch 17) | EX + FC | ReviewTechnical slides 121--126 | Remember/Understand |
| -- | 5 min break | | | | |
| 2 | 25 min | RUP Phases & Milestones | EX + FC | ReviewProcess slides 20--24, 36--42 | Remember/Understand |
| -- | 5 min break | | | | |
| 3 | 25 min | Mixed review | PR | Transaction attribute scenarios (given X, which attribute?); RUP phase identification questions | Apply |

**Checkpoint**: Without notes, name the 6 transaction attributes and the default. Name I/E/C/T phases, their milestones (LCO/LCA/IOC/PR), and primary focus of each.

**Milestone**: By end of Day 2, you should be able to explain when to use RequiresNew vs Required, and identify which RUP phase a given activity belongs to.

---

### Day 3 (April 9) -- JPQL & Mapping Persistent Objects
> **Goal**: Write JPQL queries and know all JPA mapping annotations.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | JPQL (Ch 13) | EX + FC | ReviewTechnical slides 93--104 | Remember/Understand |
| -- | 5 min break | | | | |
| 2 | 25 min | Mapping (Ch 10) | FC | ReviewTechnical slides 48--57; focus on @Entity/@Table/@Column/@Id/@GeneratedValue | Remember |
| -- | 5 min break | | | | |
| 3 | 25 min | JPQL | PR | Write 5 JPQL queries from scratch: simple SELECT, JOIN, aggregate, subquery, constructor expression | Apply |

**Checkpoint**: Write a JPQL query with a LEFT JOIN FETCH and a WHERE clause from memory. List the default table/column naming rules.

**Milestone**: By end of Day 3, you should be able to write a named JPQL query with parameters, joins, and aggregates.

---

### Day 4 (April 10) -- Use-Case Driven & Architecture-Centric
> **Goal**: Understand how use cases drive the process and the 4+1 view model.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Use-Case Driven Dev | EX + FC | ReviewProcess slides 25--32 | Understand |
| -- | 5 min break | | | | |
| 2 | 25 min | Architecture-Centric (4+1) | EX + FC | ReviewProcess slides 22--23, 33--35 | Understand |
| -- | 5 min break | | | | |
| 3 | 25 min | Essay practice | PR | Write a mini-essay (10 min): "How do use cases drive analysis, design, and test?" Write another: "Describe the 4+1 view model and the purpose of each view." | Analyze |

**Checkpoint**: Draw the 4+1 view model from memory, labeling each view and its audience. Explain use-case realization without notes.

**Milestone**: By end of Day 4, you could write a passable essay answer on either topic.

---

## Phase 2: Breadth (Days 5--8) -- Remaining Topics + First Review Pass

### Day 5 (April 11) -- Session Beans & Analysis/Design
> **Goal**: Cover SLSB/SFSB/Singleton lifecycles and BCE stereotypes.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Session Beans (Ch 5--7) | EX + FC | ReviewTechnical slides 17--39 | Remember/Understand |
| -- | 5 min break | | | | |
| 2 | 25 min | Analysis Classes (BCE) | FC | ReviewProcess slides 51--58 | Remember |
| -- | 5 min break | | | | |
| 3 | 25 min | Day 1--2 review | FC + CP | Review all flashcards from Days 1--2; checkpoint on Entity Relationships + Transactions | Remember |

**Checkpoint**: Name the 3 session bean types, their lifecycles, and when to use each. State the rules for Boundary/Control/Entity class identification.

---

### Day 6 (April 12) -- MDB, Security & Callbacks + Review
> **Goal**: Cover post-midterm EJB topics. Review Phase 1 material.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Message-Driven Beans (Ch 8) | EX + FC | ReviewTechnical slides 105--114 | Remember/Understand |
| -- | 5 min break | | | | |
| 2 | 25 min | EJB Security (Ch 15) + Callbacks (Ch 14) | FC | ReviewTechnical slides 115--120 | Remember |
| -- | 5 min break | | | | |
| 3 | 25 min | Day 3--4 review | FC + CP | Review flashcards from Days 3--4; checkpoint on JPQL + Use Cases | Remember |

**Checkpoint**: Explain Topic vs Queue in JMS. List the 4 security annotations. Name the 7 entity lifecycle callbacks in order.

---

### Day 7 (April 13) -- EVMS, Best Practices & Entity Inheritance
> **Goal**: Fill remaining gaps. Interleave process and technical.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | EVMS (Earned Value) | FC + PR | Slide deck "00 The Project and Earned Value"; practice calculations: CV, SV, EAC | Apply |
| -- | 5 min break | | | | |
| 2 | 25 min | Entity Inheritance (Ch 12) | FC | ReviewTechnical slides 84--92 | Remember/Understand |
| -- | 5 min break | | | | |
| 3 | 25 min | SW Best Practices | FC | ReviewProcess slides 2--19; 6 best practices, iterative vs waterfall risk comparison | Remember |

**Checkpoint**: Calculate CV and SV given BCWP/BCWS/ACWP values. Name the 3 inheritance strategies and their trade-offs.

---

### Day 8 (April 14) -- Remaining Process Topics + Full Review
> **Goal**: Sweep remaining lower-priority topics. Full flashcard review pass.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Requirements Capture + Testing + Implementation | FC | ReviewProcess slides 44--50, 66--76 | Remember |
| -- | 5 min break | | | | |
| 2 | 25 min | Design + General Workflow | FC | ReviewProcess slides 59--65, 77--81 | Remember |
| -- | 5 min break | | | | |
| 3 | 25 min | Full review checkpoint | CP | Without notes: brain dump everything you know topic by topic. Identify gaps. | Analyze |

**Milestone**: By end of Day 8, you have seen ALL exam topics at least once. Your brain dump should cover 12+ of the 17 priority topics.

---

## Phase 3: Consolidation (Days 9--12) -- Practice Exams, Weak Spots, Polish

### Day 9 (April 15) -- Mock Exam #1
> **Goal**: Simulate exam conditions. Identify remaining weak spots.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Mock exam (technical half) | MK | Re-do midterm technical questions under timed conditions (no notes) | Apply |
| -- | 5 min break | | | | |
| 2 | 25 min | Mock exam (process half) | MK | Re-do midterm process questions under timed conditions (no notes) | Apply |
| -- | 5 min break | | | | |
| 3 | 25 min | Gap analysis + targeted review | FC | Score your mock. Review flashcards for every question you got wrong. | Remember |

**Checkpoint**: What score did you get? Which topics had the most errors? Update your weak-topic list.

---

### Day 10 (April 16) -- Weak Spot Repair
> **Goal**: Spend entire session on your weakest 2--3 topics from the mock.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Weakest topic #1 | EX + FC | Re-read relevant review slides, create new flashcards for missed concepts | Understand |
| -- | 5 min break | | | | |
| 2 | 25 min | Weakest topic #2 | EX + FC | Same approach | Understand |
| -- | 5 min break | | | | |
| 3 | 25 min | Weakest topic #3 OR essay practice | PR | Practice an essay question OR work practice problems in weak area | Apply/Analyze |

---

### Day 11 (April 17) -- Mock Exam #2 + Post-Midterm Focus
> **Goal**: Test post-midterm topics specifically. Second full review.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Post-midterm topic practice | PR | Write out: transaction attributes, MDB lifecycle, security annotations, callback order -- all from memory, then check | Apply |
| -- | 5 min break | | | | |
| 2 | 25 min | Full flashcard review | FC | Speed-run all flashcard decks. Flag any cards you still miss. | Remember |
| -- | 5 min break | | | | |
| 3 | 25 min | Essay practice | PR | Write 2 timed essay responses (12 min each): one process, one technical | Analyze |

**Checkpoint**: Can you explain each of the Top 8 topics in 2--3 sentences without notes?

---

### Day 12 (April 18) -- Final Polish
> **Goal**: Light review only. Confidence building. Sleep well.

| Block | Time | Topic | Activity | Materials | Bloom's |
|-------|------|-------|----------|-----------|---------|
| 1 | 25 min | Flagged flashcards only | FC | Review ONLY cards you've been getting wrong. Don't re-review mastered cards. | Remember |
| -- | 5 min break | | | | |
| 2 | 25 min | Quick brain dump | CP | Write everything you know. Compare to diagnosis topic list. Celebrate how much you've learned. | -- |
| -- | DONE | | | | |

**No Block 3.** Stop early. Go for a walk. Eat well. **Sleep by 10:30pm.**

---

## April 19 (Day Before Exam)
- **Morning**: 30-minute light flashcard review of flagged cards only
- **Afternoon**: Free -- exercise, relax, prepare exam logistics (pens, calculator, student ID)
- **Evening**: Review your 1-page cheat sheet (if allowed) or do one final brain dump
- **Bed by 10:00pm**. A rested brain retrieves 40% more than a sleep-deprived one.

---

## Emergency Plan: If Time Runs Short

If you miss days or fall behind, **cut from the bottom, not the top**. Here is the absolute minimum:

### "6-Hour Survival Mode" (covers ~70% of expected exam marks)
Focus ONLY on these 6 topics:
1. **Entity Relationships (Ch 11)** -- 1 hour: annotations, 7 types, owning side, @JoinColumn/@JoinTable
2. **EntityManager (Ch 9)** -- 45 min: persist/merge/remove/refresh/flush, managed vs detached
3. **RUP Phases & Milestones** -- 45 min: I/E/C/T, LCO/LCA/IOC/PR, workflow distribution
4. **EJB Transactions (Ch 17)** -- 45 min: ACID, 6 attributes, default, CMT vs BMT, rollback rules
5. **JPQL (Ch 13)** -- 1 hour: SELECT/JOIN/WHERE syntax, parameters, aggregates
6. **Use-Case Driven + 4+1 View** -- 45 min: use-case realization, 5 views and their purpose

### "3-Hour Panic Mode" (covers ~50% of expected exam marks)
1. Entity Relationships -- 45 min
2. RUP Phases -- 30 min
3. EntityManager -- 30 min
4. EJB Transactions -- 30 min
5. JPQL -- 30 min
6. Skim both review slide decks end-to-end -- 15 min

---

## Interleaving Map

Each day mixes topics to avoid blocking on one subject:

| Day | Process Topic | Technical Topic | Review Component |
|-----|--------------|-----------------|------------------|
| 1 | -- | Entity Relationships + EntityManager | -- |
| 2 | RUP Phases | EJB Transactions | -- |
| 3 | -- | JPQL + Mapping | -- |
| 4 | Use-Case + Architecture | -- | -- |
| 5 | Analysis (BCE) | Session Beans | Days 1--2 FC review |
| 6 | -- | MDB + Security + Callbacks | Days 3--4 FC review |
| 7 | EVMS + Best Practices | Entity Inheritance | -- |
| 8 | Requirements + Testing + Design | -- | Full checkpoint |
| 9 | Mock (process half) | Mock (technical half) | Gap analysis |
| 10 | Weak spots | Weak spots | Targeted repair |
| 11 | Essay practice | Post-midterm topics | Full FC review |
| 12 | Brain dump | Flagged cards only | Light polish |

---

## Weekly Summary

| Phase | Days | Hours | Focus |
|-------|------|-------|-------|
| Foundation | 1--4 | ~6 hrs | Top 6 highest-weight topics, new material |
| Breadth | 5--8 | ~6 hrs | Remaining topics + first review passes |
| Consolidation | 9--12 | ~5 hrs | Mock exams, weak spots, polish |
| Eve | 13 | 0.5 hrs | Light review, rest, sleep |
| **Total** | | **~17.5 hrs** | |

---

*Generated: 2026-04-07. Based on diagnosis.md, CLAUDE.md study parameters, and midterm exam analysis.*
