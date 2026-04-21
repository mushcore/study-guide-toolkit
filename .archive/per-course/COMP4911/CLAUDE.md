# COMP 4911 — Developing Enterprise Service — Exam Cramming System

## Exam details
- **Course**: COMP 4911 — Developing Enterprise Service (BCIT CST Diploma)
- **Instructor**: Bruce Link
- **Exam date/time**: Monday, April 20, 2026, 10:30–12:30 @ SW05 2875
- **Exam format**: **COMPREHENSIVE** final exam (25% of grade). Covers ALL course content including post-midterm Weeks 9-14. Format based on midterm: MCQ (2 marks), T/F (1 mark), Short Answer (3 marks), Essay (10 marks), 1 Code annotation question.
- **Topics covered**: ALL course content — both process (RUP/Unified Process) and technical (EJB 3.1, Java EE). **Cumulative — midterm topics WILL reappear.**
- **Midterm**: Week of Feb 23 (20% of grade) — already completed
- **Allowed materials**: TBD — check with instructor

## Two pillars of this course
This course has two distinct halves that are equally important for the final:

### Pillar 1: Software Process (RUP / Unified Process)
- SW Best Practices, Earned Value
- Introduction to RUP, Inception phase
- Use Case Driven development
- Architecture Centric development
- UP Iterations and lifecycle
- Requirements Capture
- Requirements as Use Cases
- Analysis and Design
- Implementation and Integration
- Testing
- UP General Workflow
- Classic Mistakes in software projects
- Disaster Recovery
- Understanding Preferences

**Slide files**: `00 The Project and Earned Value.pdf`, `00Class1.pdf`, `01BestPracticesMod.pdf`, `02rup.pdf`, `03UC-Driven.pdf`, `04arch-centric.pdf`, `05Iterations.pdf`, `05ProjMngmt.pdf`, `06Requirements_Capture.pdf`, `07Requirements_as_Use_cases.pdf`, `08AAnalysis_details.pdf`, `08Analysis.pdf`, `09Aclassdesign.pdf`, `09Design.pdf`, `10Implementation.pdf`, `11Test.pdf`, `12GeneralWorkflow.pdf`, `13 Disaster Recovery.pdf`, `13Inception.pdf`, `14 Understanding Preferences.pdf`, `14ClassicMistakes.pdf`

### Pillar 2: Technical (Enterprise JavaBeans 3.1)
- EJB Introduction and Architecture (Ch 1-2)
- Container Services and First Beans (Ch 3-4)
- Stateless Session Beans (Ch 5)
- Stateful Session Beans (Ch 6)
- Singleton Session Beans (Ch 7)
- Message-Driven Beans (Ch 8)
- Entity Manager (Ch 9)
- Mapping Persistent Objects (Ch 10)
- Entity Relationships (Ch 11)
- Entity Inheritance (Ch 12)
- Queries, Criteria API, and JPQL (Ch 13)
- Entity Callbacks and Listeners (Ch 14)
- EJB Security (Ch 15)
- JNDI, ENC, and Injection (Ch 16)
- EJB Transactions (Ch 17)
- Java EE and EJB Design (Ch 18)

**Slide files**: `EJB01 02Introduction and Architecture.pdf` through `EJB18Java EE and EJB Design.pdf`

**Review slides** (high-priority for exam prep):
- `Comp4911ReviewProcess.pdf` — process review
- `Comp4911ReviewTechnical.pdf` — technical review

## Instructor intel (from Bruce — 2026-04-17 review session)

### Grading / strategy
- Class statistically scores lower than other courses, but Bruce says **easier to BS** — partial credit is achievable with surface understanding
- **Exam is cumulative** — midterm topics can reappear
- **Review slides ≈ 80% of the final content** — but slides alone are NOT enough; supplement with textbook/notes for the remaining ~20%
- **Quiz questions will reappear on the final** — same question bank. **Review every quiz.** High-ROI.
- Normal questions + a few edge cases planted to catch inattention. "Anything you don't know is a hard question regardless."
- **Students tend to fail big-picture questions** because they get stuck in details and can't assemble the whole. Practice connecting topics, not just memorizing them.

### In-scope / emphasis
- **Three kinds of session EJBs** (Stateless/Stateful/Singleton) — will ask about. High priority.
- **Container-managed concurrency lock types** — remember them (Ch 7 Singletons).
- **Seven entity relationship types** — technically difficult area, he *can* ask hard questions here. High priority.
- **Composite keys: two ways** — don't memorize blindly, understand which is which by name (embedded vs id-class).
- **JPQL / queries** — students struggle here, fair game on final. Practice writing queries.
- **JMS messaging models** — review.
- **"Annotate this class to do X, Y, Z"**-style questions: students focus on relationships and forget the entity itself. Always annotate the class first (@Entity), then members.

### De-prioritize / low-ROI
- **4+1 architecture view** — appeared on midterm, **will NOT be on final**. Know it lightly; don't re-study.
- **Message-Driven Beans (Ch 8)** — low question count. **Skip if tight on time.**
- **Types of auto-generated keys** — unlikely to be asked which specific kinds, but remember "there are several kinds exist."

## Source materials
All source materials live in `materials/`. Do NOT generate content from your
training data — ONLY from these files:
- `materials/slides/` — Lecture slides (.pdf), 36 files covering both process and EJB
- `materials/textbook/` — 3 textbooks:
  - `Enterprise JavaBeans 3.1 (Andrew Lee Rubinger, Bill Burke)...pdf` — Required textbook, primary EJB reference
  - `Rational Unified Process, The An Introduction, Third Edition (Kruchten, Philippe)...pdf` — Recommended, RUP introduction
  - `The Unified Software Development Process (Ivar Jacobson, Grady Booch, James Rumbaugh)...pdf` — Recommended, UP reference
- `materials/past-exams/` — prior assessments:
  - `midterm exam.pdf` — actual midterm from this term (use to calibrate question style, difficulty, and format for final exam prep)
  - `comp4911_quiz3.md`, `comp4911_quiz4.md` — quizzes. **Bruce confirmed quiz questions reappear on the final from the same question bank — study these first.**
- `materials/syllabus/` — Course outline with weekly schedule
- `materials/notes/` — Lecture notes (currently empty)
- `materials/resources/` — Supplementary docs (RUP for Small Projects, OpenShift, EJB setup, project templates)
- `materials/labs/` — Lab assignments and SmallProjects RUP reference

## Generated output location
All generated study materials go in `generated/`. Use descriptive filenames
with topic prefixes (e.g., `ejb-session-beans-flashcards.md`, `rup-inception-flashcards.md`).

## Evidence-based constraints for ALL generated content
You MUST follow these rules for every artifact you create:

### Flashcard rules (SuperMemo 20 Rules + learning science)
1. MINIMUM INFORMATION: One atomic fact per card. Never combine multiple facts.
2. CLOZE PREFERRED: Use cloze deletion format when converting text. Include
   surrounding sentence context.
3. NO SETS OR LISTS: Never create "List the X" cards. Break lists into
   individual cards or use overlapping cloze deletions.
4. NO VAGUE QUESTIONS: Every question must have exactly one unambiguous answer.
   "What is important about X?" is forbidden.
5. NO YES/NO: Avoid binary questions. Rephrase to require specific recall.
6. BLOOM'S PROGRESSION: Tag each card with its Bloom's level [Remember,
   Understand, Apply, Analyze, Evaluate, Create]. Aim for distribution:
   30% Remember, 30% Understand, 25% Apply, 15% Analyze+.
7. SOURCE TAGS: Every card must include source reference (e.g., "Slide 23,
   EJB05" or "ReviewTechnical p.3").
8. OPTIMIZE WORDING: Trim every unnecessary word. Shorter = faster review.
9. USE IMAGERY CUES: Where relevant, describe a visual or reference a diagram
   from the source material.
10. CONNECT TO KNOWLEDGE: Add brief "why it matters" or "connects to" notes
    for elaborative encoding.

### Question generation rules
- Match the exam format — generate both conceptual and applied questions
- Include worked-example solutions for all practice problems
- Weight topic coverage by: (1) review slide emphasis, (2) weekly schedule emphasis, (3) EJB chapter depth
- Include "distractor analysis" for MCQ — explain why wrong answers are wrong
- Process questions should test understanding of RUP phases, workflows, artifacts, and roles
- Technical questions should test EJB concepts, annotations, lifecycle, and JPA/JPQL

### Study plan rules
- Always allocate sleep (7+ hours the night before the exam)
- Space sessions across available days with ~1-day gaps
- Interleave process and technical topics within sessions
- Front-load high-weight and weakest topics
- Include specific retrieval practice activities, not just "review"
- Prioritize the two review slide decks as primary study anchors

## My learning context
- **Current comfort level**: Barely knows the material — essentially starting from scratch on EJB, JPA, RUP, and EVMS. Needs foundational ramp before mock exams are useful.
- **Known weak areas**: Everything — RUP phases/artifacts/roles, EJB session beans & lifecycle, JPA/persistence (entities, relationships, JPQL), and advanced EJB (MDB, security, transactions)
- **Known strong areas**: None identified yet — need diagnosis pass to find any anchors
- **Study time available**: 1-2 hours/day for ~13 days (April 7 to ~April 20)
- **Preferred study methods**: Mix of all — flashcards & self-testing, practice exams, and concept explanations/teach-back
- **Strategy note**: With limited time and broad gaps, must ruthlessly prioritize by exam weight. Focus on the two review slide decks first, then fill in from lecture slides. Depth over breadth — better to solidly know the top 8 topics than superficially cover everything.

## Knowledge graph (graphify)
If `graphify-out/GRAPH_REPORT.md` exists, read it before answering conceptual
or structural questions about the course. The graph report contains:
- **God nodes**: highest-connected concepts — structural backbones of the course
- **Surprising connections**: cross-topic links the slides don't make explicit
  (especially valuable here — process and technical pillars likely have hidden
  connections the graph will surface)
- **Suggested questions**: questions the graph is uniquely positioned to answer
- **Communities**: topic clusters detected by graph topology

For deeper graph queries, use these terminal commands:
- `graphify query "what connects X to Y?"` — traverse the graph hop by hop
- `graphify query "..." --dfs` — trace a specific path
- `graphify query "..." --budget 500` — cap at N tokens for focused answers
- `graphify explain "concept"` — structural map of everything connected to a concept
- `graphify path "A" "B"` — trace the exact path between two concepts

When new materials are added, run `graphify ./materials --update` to re-extract
only changed files and merge into the existing graph.

The always-on PreToolUse hook (installed via `graphify claude install`) surfaces
GRAPH_REPORT.md before every Glob/Grep call, so all skills automatically
navigate by graph structure instead of keyword matching.
