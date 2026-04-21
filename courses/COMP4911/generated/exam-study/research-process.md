# COMP 4911 RUP/Unified Process Exam Study Guide

**Status**: Synthesis in progress. Waiting for background agent completion (ReviewTechnical PDF extraction, Midterm analysis).

## Document Structure

This guide covers the RUP pillar (approximately 50% of final exam) with focus on:
- **Comp4911ReviewProcess.pdf** (priority: 80% of exam content per Bruce)
- Best practices, lifecycle phases, workflows, iteration structure
- Root causes of software problems and how RUP practices address them
- Waterfall vs. iterative risk reduction comparison
- Earned Value Management metrics

## PART 1: CORE RUP CONCEPTS

### Topic 1: Software Engineering Best Practices

#### Six Core Practices

1. **Develop Iteratively**
   - Mitigates risks through frequent feedback cycles
   - Addresses: waterfall delays, uncontrolled change, overwhelming complexity
   - Key: mini-waterfall within each iteration

2. **Manage Requirements**
   - Treats requirements as dynamic, expected to change
   - Addresses: insufficient requirements, ambiguous communications
   - Workflow: capture, trace, prioritize, update

3. **Use Component-Based Architectures**
   - Separates concerns, enables reuse, reduces brittleness
   - Addresses: brittle architectures, overwhelming complexity
   - 4+1 view model: Logical, Process, Implementation, Deployment, Use-Case

4. **Model Visually (UML)**
   - Use-case diagrams, class diagrams, deployment diagrams, etc.
   - Addresses: ambiguous communications, undetected inconsistencies
   - Analysis models: Boundary, Control, Entity (BCE) stereotypes

5. **Verify Quality**
   - Testing strategy: unit, integration, system, acceptance
   - Addresses: poor testing, undetected inconsistencies
   - White-box vs. black-box approaches

6. **Control Changes**
   - Configuration management, version control
   - Addresses: uncontrolled change, insufficient automation

#### Ten Root Causes of Software Problems

| Root Cause | Description | Addressed By |
|-----------|-------------|--------------|
| Insufficient requirements | Missing or incomplete requirement capture | Manage Requirements |
| Ambiguous communications | Unclear specifications and design intent | Model Visually, Manage Requirements |
| Brittle architectures | Inflexible, monolithic designs | Use Component-Based Architectures |
| Overwhelming complexity | System exceeds cognitive limits | Use Component-Based Architectures, Model Visually |
| Undetected inconsistencies | Contradictions between design and implementation | Model Visually, Verify Quality |
| Poor testing | Insufficient or inadequate test coverage | Verify Quality |
| Subjective assessment | Lack of metrics and measurable progress | Control Changes (project metrics) |
| Waterfall delays | Long feedback cycles cause late problem discovery | Develop Iteratively |
| Uncontrolled change | Changes not tracked, causing instability | Control Changes |
| Insufficient automation | Manual processes introduce errors and delays | Control Changes, Verify Quality |

---

### Topic 2: The Rational Unified Process (RUP)

**Definition**: A scalable, iterative, use-case driven, architecture-centric software development process that provides structure for 9 workflows across 4 lifecycle phases.

#### RUP Characteristics
- **Use-case driven**: Use cases define system requirements and drive design
- **Architecture-centric**: Stable architecture defined early, refined iteratively
- **Iterative**: Multiple iterations per phase; each iteration is mini-waterfall
- **Component-based**: Separation of concerns, integration throughout
- **Workflow-based**: 9 parallel workflows coordinated across lifecycle

#### RUP Artifacts
- Vision document (project goals, scope, success criteria)
- Business Case (business value, risks, stakeholder analysis)
- Risk List (project risks with mitigation strategies)
- Glossary (terminology definitions)
- Use-Case Model (actors, use cases, interactions)
- Requirements Specification (functional/non-functional requirements)
- Analysis Model (boundary/control/entity classes)
- Design Model (design classes, patterns, collaborations)
- Implementation Model (code, build plan, integration strategy)
- Test Model (test cases, test strategy)
- Deployment Plan (installation, rollout strategy)

---

### Topic 3: Use-Case Driven Development

**Core Concept**: Use cases capture what the system does from the perspective of external actors. They serve as:
- Requirements (what the system must do)
- Design drivers (how the system is organized)
- Test cases (verification of behavior)

#### Use-Case Structure
- **Actor**: External entity interacting with system (user, system, hardware)
- **Use Case**: A sequence of interactions between actor and system achieving a goal
- **Main Flow**: Happy path from actor request to goal achievement
- **Alternative Flows**: Variations, exception handling, error recovery

#### Use-Case Driven Benefits
- Alignment between stakeholders and developers
- Traceability from requirements to design to tests
- Risk reduction through early validation

---

### Topic 4: Architecture-Centric Development

**Core Concept**: Define stable, scalable architecture early; validate through implementation; evolve iteratively.

#### 4+1 View Model

1. **Logical View** (Analysis + Design Models)
   - Classes, interfaces, relationships
   - BCE stereotypes: Boundary (UI), Control (logic), Entity (data)
   - Supports "what the system does"

2. **Process View** (Concurrency, Distribution)
   - Process interactions, threading, synchronization
   - Supports "how the system runs"

3. **Implementation View** (Code Organization)
   - Source code modules, build artifacts, dependencies
   - Supports "development structure"

4. **Deployment View** (Hardware, Networks)
   - Hardware nodes, network connections, deployment strategy
   - Supports "physical distribution"

5. **Use-Case View** (Ties all views together)
   - Use cases that realize across all four views
   - Ensures all views address actual system behavior

#### Architecture Baseline
- Established at end of Elaboration phase
- Proves technical feasibility
- Provides foundation for Construction phase
- Not final; evolves through iterations

---

### Topic 5: Iterative Development Structure

**Mini-Waterfall Within Each Iteration**

Each iteration follows a predictable sequence:
1. Requirements gathering and analysis
2. Design and architecture updates
3. Implementation and integration
4. Testing and quality assurance
5. Assessment and planning for next iteration

**Iteration Lifecycle**

- **Inception**: Project vision, business case, initial risk assessment
- **Elaboration**: Architecture definition, 80% requirements, risk mitigation
- **Construction**: Build, test, integrate; 90% implementation complete
- **Transition**: Customer acceptance testing, deployment, release

**Workflow Distribution (Hump Charts)**

Effort allocation varies by phase:
- **Inception**: 10% - small team, vision focus
- **Elaboration**: 30% - architecture team, full requirements
- **Construction**: 50% - development team, implementation focus
- **Transition**: 10% - support team, deployment focus

---

### Topic 6: RUP Workflows (9 Parallel Processes)

| Workflow | Primary Purpose | Deliverables |
|----------|-----------------|--------------|
| **Business Modeling** | Understand business context, domain structure | Business model, actors, use cases |
| **Requirements** | Capture "what the system must do" | Use-Case Model, Requirements Specification |
| **Analysis & Design** | Transform requirements to architecture | Design Model, architecture documents |
| **Implementation** | Build components, integrate, code | Implementation Model, build artifacts |
| **Test** | Verify quality, identify defects | Test Plan, test cases, test results |
| **Deployment** | Release system to production | Deployment Plan, release notes, user docs |
| **Configuration & Change Management** | Track changes, maintain versions | Version control, change log |
| **Project Management** | Plan, track progress, manage risks | Project Plan, status reports, metrics |
| **Environment** | Provide development infrastructure | Development environment, tools, standards |

---

### Topic 7: RUP Lifecycle Phases

#### Inception Phase (LCO Milestone)

**Goals**:
- Define project vision and scope
- Identify key risks
- Secure stakeholder buy-in
- Establish business case

**Artifacts Created**:
- Vision document
- Business Case (ROI, stakeholders, success criteria)
- Risk List (top 10 risks with mitigation)
- Glossary
- Preliminary Architecture
- Use-Case Model (outline)
- Development Plan (high-level)

**Success Criteria**:
- Vision approved by stakeholders
- Risks understood and mitigation planned
- Team and resources committed

**Effort**: ~10% of project

#### Elaboration Phase (LCA Milestone)

**Goals**:
- Establish architecture baseline
- Complete ~80% of requirements
- Reduce major technical risks
- Validate architecture through implementation

**Artifacts Created**:
- Refined Use-Case Model (all use cases identified)
- Detailed Requirements Specification
- Design Model (classes, interactions, patterns)
- Architecture Baseline
- Prototype or proof-of-concept implementation
- Risk Mitigation Plan (specific strategies)

**Success Criteria**:
- Architecture baselined and validated
- 80% of requirements captured and agreed
- Top risks addressed
- Build-ability demonstrated

**Effort**: ~30% of project

#### Construction Phase (IOC Milestone)

**Goals**:
- Implement all remaining functionality
- Integrate all components
- Execute comprehensive testing
- Prepare for transition

**Artifacts Created**:
- Complete Implementation Model
- Complete Design Model updates
- Test results and defect reports
- User documentation
- Deployment documentation

**Success Criteria**:
- 90% of functionality implemented and integrated
- Quality metrics acceptable
- User documentation complete
- Deployment plan ready

**Effort**: ~50% of project

#### Transition Phase (PR Milestone)

**Goals**:
- Deliver system to users
- Support user acceptance testing
- Fix deployment-related issues
- Complete knowledge transfer

**Artifacts Created**:
- Final Release notes
- User/administrator guides
- Training materials
- Deployment verification

**Success Criteria**:
- System deployed to production
- User acceptance criteria met
- Training completed
- Support handoff established

**Effort**: ~10% of project

---

### Topic 8: Project Management in RUP

**Key Elements**:

#### Milestones
- **Major Milestones**: Phase boundaries (LCO, LCA, IOC, PR)
- **Minor Milestones**: End of each iteration
- Decision points: Go/No-go for phase progression

#### Metrics
- **Progress**: Percentage of use cases realized, requirements completed, code integrated
- **Stability**: Defect rates, change request trends, code churn
- **Adaptability**: Ability to accommodate requirement changes
- **Modularity**: Coupling, cohesion, cyclomatic complexity
- **Quality**: Test coverage, defect density, performance
- **Maturity**: CMM level, process compliance
- **Expenditures**: Budget vs. actual, earned value metrics

#### Planning
- Release plan (phases, iterations, milestones)
- Iteration plan (detailed tasks, assignments, schedule)
- Risk management plan (risk register, mitigation, contingency)

---

### Topic 9: Earned Value Management

**Terms and Formulas**:

| Term | Abbreviation | Definition |
|------|--------------|-----------|
| Budgeted Cost of Work Scheduled | BCWS (PV) | Planned cost of work scheduled |
| Budgeted Cost of Work Performed | BCWP (EV) | Planned cost of work actually completed |
| Actual Cost of Work Performed | ACWP (AC) | Actual cost of work performed |
| Budget at Completion | BAC | Total approved budget |
| Estimate at Completion | EAC | Projected final cost |

**Key Metrics**:
- **Cost Variance (CV)** = BCWP - ACWP (positive = under budget)
- **Schedule Variance (SV)** = BCWP - BCWS (positive = ahead of schedule)
- **Cost Performance Index (CPI)** = BCWP / ACWP (>1 = efficient)
- **Schedule Performance Index (SPI)** = BCWP / BCWS (>1 = faster than planned)
- **EAC** = BAC / CPI (projected completion cost)

---

### Topic 10: Risk Management

**Waterfall vs. Iterative Risk Curves**

**Waterfall Model**:
- Risk stays high until late in project
- Problems discovered near end (expensive to fix)
- Risk curve: high → stays high → drops sharply near end

**Iterative Model**:
- Risk reduced early and continuously
- Problems discovered and addressed in early iterations
- Risk curve: high → drops continuously → low by mid-project
- Enables course correction before major investment

**RUP Emphasis**: Early risk reduction through iterative cycles and architecture validation.

---

### Topic 11: Requirements Management

**Key Principles**:
- Requirements are dynamic (expected to change)
- Every requirement traceable to design, test, deployment
- Prioritization guides iteration planning
- Change control prevents chaos

**Workflow Steps**:
1. **Elicitation**: Gather from stakeholders, domain, constraints
2. **Documentation**: Formalize as use cases and specifications
3. **Analysis**: Feasibility, impact, priority
4. **Review**: Stakeholder approval
5. **Prioritization**: Essential vs. nice-to-have
6. **Traceability**: Link to design, test, deployment

**Traceability Matrix**: Maps requirements → design elements → test cases

---

### Topic 12: Analysis & Design

#### Analysis Model (What to do)
- **Boundary Classes**: UI, interfaces to external systems
- **Control Classes**: Coordinators, managers, workflows
- **Entity Classes**: Domain objects, persistent data
- **Relationships**: Dependencies, associations, aggregations

#### Design Model (How to do it)
- **Design Classes**: Detailed implementation structure
- **Patterns**: Reusable solutions (MVC, Factory, Observer, etc.)
- **Interfaces**: Public contracts, API definitions
- **Component Diagram**: Software components and dependencies

---

### Topic 13: Testing Strategy

**Test Types**:
- **Unit Testing**: Individual components in isolation (white-box)
- **Integration Testing**: Component interactions, subsystem assembly
- **System Testing**: End-to-end functionality, non-functional requirements (black-box)
- **Acceptance Testing**: User validation against original requirements

**Quality Assurance**:
- Continuous testing throughout project
- Automated test suites for regression
- Defect tracking and triage
- Test coverage metrics

---

### Topic 14: MBTI Preferences in Software Teams

**Four Dimensions**:
1. **Extraversion (E) vs. Introversion (I)**: Energy source (external vs. internal)
2. **Sensing (S) vs. Intuition (N)**: Information gathering (facts vs. patterns)
3. **Thinking (T) vs. Feeling (F)**: Decision making (logic vs. values)
4. **Judging (J) vs. Perceiving (P)**: Lifestyle orientation (structure vs. flexibility)

**Relevance to RUP**:
- Team composition affects process adherence
- J preferences favor detailed planning; P prefer adaptation
- S prefer concrete specs; N prefer architectures and visions
- Understanding preferences improves collaboration

---

### Topic 15: Classic Mistakes in Software Development

**People Mistakes**:
- Heroic programmer culture (burnout risk)
- Insufficient training
- Poor morale and motivation
- Inadequate team communication

**Process Mistakes**:
- Waterfall approach (no iterative feedback)
- Insufficient management oversight
- Lack of defined standards
- No lessons learned process

**Product Mistakes**:
- Feature creep (uncontrolled scope)
- Over-architecting (YAGNI violation)
- Insufficient documentation
- Quality shortcuts

**Technology Mistakes**:
- Immature tools and frameworks
- Architecture mismatch (technology doesn't fit problem)
- Insufficient automation
- Premature optimization

---

## PART 2: EXAM QUESTIONS & FLASHCARDS

### Key Exam Topics (Based on Comp4911ReviewProcess.pdf emphasis)

**High Priority**:
1. Four RUP phases and their characteristics
2. Six best practices and root cause mapping
3. 4+1 architecture view model
4. Use-case driven development benefits
5. Waterfall vs. iterative risk curves
6. Earned Value Management formulas
7. Workflow distribution (hump charts)
8. Iteration mini-waterfall structure

**Medium Priority**:
9. Inception phase artifacts and goals
10. Elaboration phase architecture baseline
11. Requirements as dynamic elements
12. BCE stereotypes in analysis models
13. Nine RUP workflows
14. Testing strategy hierarchy
15. MBTI preferences in teams
16. Classic mistakes by category

### Sample Flashcards (SuperMemo 20 Rules Format)

#### Card 1 | [Remember] | Comp4911ReviewProcess, Slide 5
**Q:** What are the four lifecycle phases of RUP?
**A:** Inception (LCO), Elaboration (LCA), Construction (IOC), Transition (PR)
**Why it matters:** Foundation for understanding project structure and milestone decision points.

#### Card 2 | [Understand] | Comp4911ReviewProcess, Slide 10
**Q:** How does Inception phase differ from Elaboration in terms of team size and focus?
**A:** Inception: small team, vision focus (~10% effort). Elaboration: larger team, architecture focus (~30% effort).
**Why it matters:** Resource planning and phase-appropriate intensity.

#### Card 3 | [Apply] | Comp4911ReviewProcess, Slide 15
**Q:** If a project has brittle, monolithic architecture causing maintenance problems, which best practice directly addresses this root cause?
**A:** Use Component-Based Architectures (separates concerns, enables reuse, reduces brittleness).
**Why it matters:** Mapping root causes to solutions enables targeted improvements.

#### Card 4 | [Remember] | Comp4911ReviewProcess, Slide 20
**Q:** What is the 4+1 view model, and which view integrates the other four?
**A:** 4+1 consists of Logical, Process, Implementation, Deployment views, integrated by the Use-Case view.
**Why it matters:** Architectural completeness and traceability.

#### Card 5 | [Understand] | Comp4911ReviewProcess, Slide 25
**Q:** Why does iterative development reduce risk more effectively than waterfall?
**A:** Risk reduced continuously in early iterations; problems discovered and addressed before major investment.
**Why it matters:** Business justification for RUP methodology.

[Additional flashcards to follow from agent analysis of ReviewTechnical.pdf and exam patterns]

---

## PART 3: EXAMINATION PATTERNS (Pending Agent Completion)

*This section will be populated once background agent "Analyze midterm exam + quizzes" completes analysis of:*
- `/Users/kevinliang/BCIT/CST/TERM4/COMP4911/materials/past-exams/midterm exam.pdf`
- `/Users/kevinliang/BCIT/CST/TERM4/COMP4911/materials/past-exams/comp4911_quiz3.md`
- `/Users/kevinliang/BCIT/CST/TERM4/COMP4911/materials/past-exams/comp4911_quiz4.md`

---

**Document Updated**: 2026-04-18 16:05 (synthesis in progress)
**Next Steps**: Incorporate ReviewTechnical.pdf extraction + midterm analysis + JPA content when agents complete.

