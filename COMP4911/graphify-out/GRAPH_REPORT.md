# Graph Report - .  (2026-04-17)

## Corpus Check
- Large corpus: 2067 files · ~807,778 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 871 nodes · 563 edges · 388 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `COMP 4911 Developing Enterprise Service` - 12 edges
2. `Technical Review (Comp4911ReviewTechnical)` - 11 edges
3. `EJB Container Services` - 11 edges
4. `Entity Relationships (Seven Types)` - 11 edges
5. `Stateless Session Beans (Ch 5)` - 10 edges
6. `Rational Unified Process (RUP)` - 10 edges
7. `4911 Project Overview Document` - 10 edges
8. `Mapping Persistent Objects (Ch 10)` - 9 edges
9. `EJB Transactions` - 9 edges
10. `COMP 4911 Midterm Exam Winter 2026` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Software Testing Types` --semantically_similar_to--> `Six Incremental Testing Steps`  [INFERRED] [semantically similar]
  materials/past-exams/comp4911_quiz4.md → materials/labs/SmallProjects/core.base_rup/guidances/whitepapers/resources/rt_test.pdf
- `Java EE Component-Based Technology` --conceptually_related_to--> `XDE Model Structure Guidelines for J2EE (TP 154)`  [INFERRED]
  graphify-out/converted/Initial Project Requirements_cd57e398.md → materials/labs/SmallProjects/core.base_rup/guidances/whitepapers/resources/xde_model_structure_guidelines_j2ee.pdf
- `Java EE Component-Based Technology` --conceptually_related_to--> `Three-Tier Architecture`  [INFERRED]
  graphify-out/converted/Initial Project Requirements_cd57e398.md → materials/labs/SmallProjects/core.base_rup/guidances/whitepapers/resources/tp199_layering_strategies.pdf
- `Mapping Persistent Objects (Ch 10)` --conceptually_related_to--> `EntityManager`  [INFERRED]
  materials/slides/EJB09Mapping Persistent Objects.pdf → materials/slides/EJB01 02Introduction and Architecture.pdf
- `UP Testing Workflow (Ch 11)` --semantically_similar_to--> `Best Practice 5: Verify Quality`  [INFERRED] [semantically similar]
  materials/slides/11Test.pdf → materials/slides/01BestPracticesMod.pdf

## Hyperedges (group relationships)
- **Three Session Bean Types (Stateless, Stateful, Singleton)** — ejb05_stateless_session_bean, reviewtechnical_sfsb, ejb07_singleton_session_bean [EXTRACTED 1.00]
- **RUP Core Workflows (Requirements, Analysis, Design, Implementation, Test)** — uc07_requirements_as_use_cases, analysis08_analysis_workflow, design09_design_workflow, impl10_implementation_workflow, test11_testing_workflow [EXTRACTED 1.00]
- **JPA Entity Lifecycle (Mapping, Inheritance, Callbacks, Queries)** — ejb09_entity_mapping, ejb11_entity_inheritance, ejb14_entity_callbacks, reviewtechnical_jpql_queries, reviewtechnical_persistence_context [INFERRED 0.85]
- **EJB Container Cross-Cutting Services (Security, Transactions, DI)** — ejb15_security, ejb17_transactions, ejb0304_dependency_injection, ejb0304_interceptors [INFERRED 0.85]
- **RUP Process Framework (Phases, Workflows, Iterations, Milestones)** — rup02_four_phases, rup02_workflows, rup02_iterations, proj05_major_milestones, proj05_iteration_assessment [EXTRACTED 0.95]
- **JPA Persistence Stack (EntityManager, Persistence Context, Entities, JPQL)** — ejb08_entity_manager, ejb08_persistence_context, ejb10_entity_relationships, ejb12_jpql, ejb08_persistence_unit [INFERRED 0.90]
- **JPA Entity Persistence Configuration** — quiz3_id_annotation, quiz3_transient_annotation, quiz3_temporal_annotation, quiz4_entity_annotations, quiz3_relationship_annotations, quiz4_inheritance_mapping [INFERRED 0.85]
- **RUP-CMM Compliance Framework** — rupcmm_reaching_cmm, tp178_rup_process_maturity, tp178_cmm_model, rupcmm_level2_kpas, rupcmm_level3_kpas [EXTRACTED 0.90]
- **RUP Ten Essentials Process Framework** — tp177_vision_essential, tp177_architecture_essential, tp177_change_requests, lab01a_sdp_artifact, tp178_risk_management [INFERRED 0.80]
- **RUP Four Phases Lifecycle (Inception, Elaboration, Construction, Transition)** — rup_small_projects_inception, rup_small_projects_elaboration, rup_small_projects_construction, rup_small_projects_transition, course_outline_inception_phase, course_outline_elaboration_phase, course_outline_construction_phase [EXTRACTED 0.95]
- **Project Management Document Templates (Timesheet, WP, Budget, PCPR)** — sample_documents_timesheet, sample_documents_wp_description, sample_documents_budget_matrix, sample_documents_wpcpr, sample_documents_pcpr, project_overview_timesheets, project_overview_work_packages [INFERRED 0.85]
- **Course Project Staffing Roles (9 Positions)** — project_overview_project_manager, project_overview_software_tester, project_overview_qa_officer, project_overview_business_analyst, project_overview_software_developer, project_overview_dba, project_overview_sysadmin [EXTRACTED 1.00]

## Communities

### Community 0 - "EJB Container Services & Lifecycle"
Cohesion: 0.05
Nodes (47): EJB Concurrency Model, EJB Container Services, Dependency Injection (DI), Instance Pooling and Caching, EJB Interceptors (Cross-Cutting Concerns), Lifecycle Callbacks (@PostConstruct, @PreDestroy, @PrePassivate, @PostActivate), Naming and Object Stores (JNDI), Passivation and Activation Mechanism (+39 more)

### Community 1 - "Course Structure & Phases"
Cohesion: 0.05
Nodes (47): COMP 4911 Developing Enterprise Service, RUP Construction Phase (Week 9-14), Earned Value (Week 1 Topic), Enterprise JavaBeans (Course Learning Outcome), RUP Elaboration Phase (Week 4-7), Course Evaluation Criteria, RUP Inception Phase (Week 2-3), Multi-tier Development Strategies (+39 more)

### Community 2 - "Project Management & RUP Workflows"
Cohesion: 0.05
Nodes (46): Change Control Board (CCB), Timesheet Project Requirements, Earned Value Reports, Java EE Component-Based Technology, Timesheet System, Work Package Hierarchy, Core Workflows in RUP, Four RUP Phases (+38 more)

### Community 3 - "Software Best Practices"
Cohesion: 0.05
Nodes (43): Best Practice 3: Use Component-Based Architectures, Best Practice 6: Control Changes, Best Practice 1: Develop Iteratively, Best Practice 2: Manage Requirements, Best Practice 4: Model Visually (UML), Root Causes of SW Development Problems, Six Best Practices of Software Engineering, Best Practice 5: Verify Quality (+35 more)

### Community 4 - "EJB Architecture & Design"
Cohesion: 0.06
Nodes (38): Concurrency: Actors, Agents, Servers (Booch), Asynchronous Messaging (JMS), EJB Container and Services, EJB Introduction and Architecture (Ch 1-2), EntityManager, JPA / Jakarta Persistence Beans, Resource Pooling (Connection Pooling), Three Bean Types: Session, MDB, Entity (+30 more)

### Community 5 - "Entity Manager & Persistence"
Cohesion: 0.07
Nodes (32): Jakarta Persistence Overview (ORM), Nested Stateful Session Beans (Shared Extended PC), EntityManager CRUD (persist, find, merge, remove, refresh), Detached Entities as DTOs, EntityManager Service, Managed vs Unmanaged (Attached vs Detached) Entities, Persistence Context (Transaction-Scoped vs Extended), Persistence Unit (persistence.xml) (+24 more)

### Community 6 - "Analysis & Architecture Views"
Cohesion: 0.08
Nodes (30): Use-Case Analysis Steps (Find Classes, Distribute Behavior, Describe Responsibilities), Boundary Class Stereotype, Control Class Stereotype, Entity Class Stereotype, Use-Case Analysis Workflow, Use-Case Realization (Sequence/Collaboration Diagrams), Architecture-Centric Development, Deployment View (System Topology) (+22 more)

### Community 7 - "Analysis & Design Workflow"
Cohesion: 0.07
Nodes (29): Analysis Model, Analysis Workflow (Ch 8), Boundary Class Stereotype, Control Class Stereotype, Entity Class Stereotype, Use-Case Realization - Analysis, Analysis vs Design Model Comparison, Deployment Model (+21 more)

### Community 8 - "Classic Mistakes & MBTI"
Cohesion: 0.08
Nodes (26): Classic Mistakes in Software Projects, People-Related Mistakes (Motivation, Heroics, Adding People Late), Process-Related Mistakes (Optimistic Schedules, Insufficient Planning, Shortchanged QA), Product-Related Mistakes (Requirements Gold-Plating, Feature Creep), Technology-Related Mistakes (Silver-Bullet Syndrome, Tool Switching), Four MBTI Preference Scales (E/I, S/N, T/F, J/P), Myers-Briggs Type Indicator (MBTI), MBTI Benefits for Teams (Communication, Conflict, Diversity) (+18 more)

### Community 9 - "Entity Mapping & Annotations"
Cohesion: 0.08
Nodes (25): @PostConstruct / @PreDestroy Callbacks, @Basic and FetchType (LAZY/EAGER), @Column Annotation, Composite Primary Keys (@IdClass, @EmbeddedId), @Embeddable / @Embedded Objects, @Entity Annotation, Mapping Persistent Objects (Ch 10), @GeneratedValue Annotation (+17 more)

### Community 10 - "Dojo Framework Core"
Cohesion: 0.11
Nodes (7): addToCache(), dj_eval(), doLoad(), getCacheKey(), getDojoTagName(), getFromCache(), getTagName()

### Community 11 - "XSL Transform Utilities"
Cohesion: 0.31
Nodes (8): addIeParams(), addMozillaParams(), getActiveXImpl(), getIeResultDom(), getMozillaResultDom(), getMozillaResultStr(), getResultDom(), removeIeParams()

### Community 12 - "Module Loader"
Cohesion: 0.22
Nodes (0): 

### Community 13 - "UUID Generator"
Cohesion: 0.54
Nodes (7): _addTwo64bitArrays(), _carry(), _generateRandomEightCharacterHexString(), _generateUuidString(), _get64bitArrayFromFloat(), _multiplyTwo64bitArrays(), _padWithLeadingZeros()

### Community 14 - "Binary Tree Data Structure"
Cohesion: 0.29
Nodes (0): 

### Community 15 - "Rhino Host Environment"
Cohesion: 0.47
Nodes (3): dj_readInputStream(), readText(), readUri()

### Community 16 - "Browser IO"
Cohesion: 0.53
Nodes (4): addToCache(), doLoad(), getCacheKey(), getFromCache()

### Community 17 - "Graph Data Structure"
Cohesion: 0.4
Nodes (0): 

### Community 18 - "Skip List Data Structure"
Cohesion: 0.4
Nodes (0): 

### Community 19 - "Browser Host Environment"
Cohesion: 0.5
Nodes (0): 

### Community 20 - "Bootstrap Initialization"
Cohesion: 0.5
Nodes (0): 

### Community 21 - "Template Parsing"
Cohesion: 0.67
Nodes (2): getDojoTagName(), getTagName()

### Community 22 - "Date Formatting"
Cohesion: 0.67
Nodes (0): 

### Community 23 - "Analysis Stereotypes (Quiz)"
Cohesion: 0.5
Nodes (4): Collaboration Diagram, Three Analysis Class Stereotypes, Analysis Workflow Roles and Diagrams, System Analyst Role

### Community 24 - "Software Testing Types"
Cohesion: 0.5
Nodes (4): Software Testing Types, Testing Embedded Systems (TP 317), Granule Under Test (GuT), Six Incremental Testing Steps

### Community 25 - "Browser Debug Tools"
Cohesion: 0.67
Nodes (0): 

### Community 26 - "Behavior Utilities"
Cohesion: 0.67
Nodes (0): 

### Community 27 - "JSON Data Provider"
Cohesion: 0.67
Nodes (0): 

### Community 28 - "Animation Common"
Cohesion: 0.67
Nodes (0): 

### Community 29 - "Rich Text Editor"
Cohesion: 0.67
Nodes (0): 

### Community 30 - "Date Picker Widget"
Cohesion: 0.67
Nodes (0): 

### Community 31 - "Rhino IO"
Cohesion: 1.0
Nodes (2): connect(), doLoad()

### Community 32 - "Activity Tree Table"
Cohesion: 0.67
Nodes (0): 

### Community 33 - "Module 33"
Cohesion: 1.0
Nodes (2): Layered Architecture Pattern, Multi-Tiered Java EE Architecture (Web/Business/EIS)

### Community 34 - "Module 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Module 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Module 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Module 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Module 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Module 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Module 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Module 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Module 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Module 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Module 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Module 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Module 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Module 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Module 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Module 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Module 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Module 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Module 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Module 53"
Cohesion: 1.0
Nodes (2): ACID Transaction Properties, EJB Transaction Attributes

### Community 54 - "Module 54"
Cohesion: 1.0
Nodes (2): @Id Primary Key Annotation, JPA Entity Annotation Rules

### Community 55 - "Module 55"
Cohesion: 1.0
Nodes (2): JPA Relationship Annotations, Entity Relationship Mapping

### Community 56 - "Module 56"
Cohesion: 1.0
Nodes (2): @Inheritance Annotation, JPA Inheritance Mapping Strategies

### Community 57 - "Module 57"
Cohesion: 1.0
Nodes (2): Project Budget Matrix, Project Costing/Budget/Actual Comparison (PCBAC)

### Community 58 - "Module 58"
Cohesion: 1.0
Nodes (1): @Transient Annotation

### Community 59 - "Module 59"
Cohesion: 1.0
Nodes (1): @Temporal Annotation

### Community 60 - "Module 60"
Cohesion: 1.0
Nodes (1): @Lob Annotation (Blob/Clob)

### Community 61 - "Module 61"
Cohesion: 1.0
Nodes (1): @Enumerated Annotation

### Community 62 - "Module 62"
Cohesion: 1.0
Nodes (1): Default O/R Mapping Rules

### Community 63 - "Module 63"
Cohesion: 1.0
Nodes (1): @Inheritance Annotation

### Community 64 - "Module 64"
Cohesion: 1.0
Nodes (1): @Singleton Annotation

### Community 65 - "Module 65"
Cohesion: 1.0
Nodes (1): @AccessTimeout Annotation

### Community 66 - "Module 66"
Cohesion: 1.0
Nodes (1): Test Procedure

### Community 67 - "Module 67"
Cohesion: 1.0
Nodes (1): Kinds of Testing (Performance, Security, Stress, etc.)

### Community 68 - "Module 68"
Cohesion: 1.0
Nodes (1): Test Workers: Designer, Tester, Evaluator

### Community 69 - "Module 69"
Cohesion: 1.0
Nodes (1): Artifact Sets (Management, Requirements, Design, Implementation, Deployment)

### Community 70 - "Module 70"
Cohesion: 1.0
Nodes (1): Workers: System Analyst, UC Specifier, UI Designer, Architect

### Community 71 - "Module 71"
Cohesion: 1.0
Nodes (1): Glossary Artifact

### Community 72 - "Module 72"
Cohesion: 1.0
Nodes (1): Implementation Subsystem

### Community 73 - "Module 73"
Cohesion: 1.0
Nodes (1): Implementation Roles: Architect, Component Engineer, Systems Integrator

### Community 74 - "Module 74"
Cohesion: 1.0
Nodes (1): COMP4911 Course Overview

### Community 75 - "Module 75"
Cohesion: 1.0
Nodes (1): Project Team Positions (PM, QA, Dev, etc.)

### Community 76 - "Module 76"
Cohesion: 1.0
Nodes (1): 360 Degree Peer Assessment

### Community 77 - "Module 77"
Cohesion: 1.0
Nodes (1): Software Architecture Definition

### Community 78 - "Module 78"
Cohesion: 1.0
Nodes (1): Requirement Types (FURPS+)

### Community 79 - "Module 79"
Cohesion: 1.0
Nodes (1): Requirement Attributes (Status, Priority, Risk, etc.)

### Community 80 - "Module 80"
Cohesion: 1.0
Nodes (1): Supplementary Specifications

### Community 81 - "Module 81"
Cohesion: 1.0
Nodes (1): Configuration and Change Management

### Community 82 - "Module 82"
Cohesion: 1.0
Nodes (1): Inception Evaluation Criteria

### Community 83 - "Module 83"
Cohesion: 1.0
Nodes (1): Inception Deliverables (Feature List, UC Model, Business Case)

### Community 84 - "Module 84"
Cohesion: 1.0
Nodes (1): POJO (Plain Old Java Objects)

### Community 85 - "Module 85"
Cohesion: 1.0
Nodes (1): Web Services (SOAP, WSDL)

### Community 86 - "Module 86"
Cohesion: 1.0
Nodes (1): JMS Message Types (Text, Map, Object, Stream, Bytes)

### Community 87 - "Module 87"
Cohesion: 1.0
Nodes (1): Analysis Packages

### Community 88 - "Module 88"
Cohesion: 1.0
Nodes (1): Phase Resource Allocation (10/30/50/10% schedule)

### Community 89 - "Module 89"
Cohesion: 1.0
Nodes (1): Container Services Overview

### Community 90 - "Module 90"
Cohesion: 1.0
Nodes (1): EJB Interoperability (RMI-IIOP, JAX-WS, JAX-RS)

### Community 91 - "Module 91"
Cohesion: 1.0
Nodes (1): Java EE Platform Integration (JTS, JPA, JNDI, CDI)

### Community 92 - "Module 92"
Cohesion: 1.0
Nodes (1): @Entity and @Table Annotations

### Community 93 - "Module 93"
Cohesion: 1.0
Nodes (1): EAR Application Packaging (WAR, JAR, application.xml)

### Community 94 - "Module 94"
Cohesion: 1.0
Nodes (1): Alternatives to EJB (Spring, Hibernate, JDBC)

### Community 95 - "Module 95"
Cohesion: 1.0
Nodes (1): Application-Managed EntityManager

### Community 96 - "Module 96"
Cohesion: 1.0
Nodes (1): @RunAs Security Identity

### Community 97 - "Module 97"
Cohesion: 1.0
Nodes (1): Web Authentication Methods (Basic, Form, Certificate, Digest)

### Community 98 - "Module 98"
Cohesion: 1.0
Nodes (1): Iterative Development Strategies (Incremental, Evolutionary, Grand Design)

### Community 99 - "Module 99"
Cohesion: 1.0
Nodes (1): Extraversion vs Introversion

### Community 100 - "Module 100"
Cohesion: 1.0
Nodes (1): Sensing vs Intuition

### Community 101 - "Module 101"
Cohesion: 1.0
Nodes (1): Thinking vs Feeling

### Community 102 - "Module 102"
Cohesion: 1.0
Nodes (1): JPQL GROUP BY and HAVING

### Community 103 - "Module 103"
Cohesion: 1.0
Nodes (1): JPQL Subqueries (ALL, ANY, SOME, EXISTS)

### Community 104 - "Module 104"
Cohesion: 1.0
Nodes (1): @OrderBy and @MapKey Annotations

### Community 105 - "Module 105"
Cohesion: 1.0
Nodes (0): 

### Community 106 - "Module 106"
Cohesion: 1.0
Nodes (0): 

### Community 107 - "Module 107"
Cohesion: 1.0
Nodes (0): 

### Community 108 - "Module 108"
Cohesion: 1.0
Nodes (0): 

### Community 109 - "Module 109"
Cohesion: 1.0
Nodes (0): 

### Community 110 - "Module 110"
Cohesion: 1.0
Nodes (0): 

### Community 111 - "Module 111"
Cohesion: 1.0
Nodes (0): 

### Community 112 - "Module 112"
Cohesion: 1.0
Nodes (0): 

### Community 113 - "Module 113"
Cohesion: 1.0
Nodes (0): 

### Community 114 - "Module 114"
Cohesion: 1.0
Nodes (0): 

### Community 115 - "Module 115"
Cohesion: 1.0
Nodes (0): 

### Community 116 - "Module 116"
Cohesion: 1.0
Nodes (0): 

### Community 117 - "Module 117"
Cohesion: 1.0
Nodes (0): 

### Community 118 - "Module 118"
Cohesion: 1.0
Nodes (0): 

### Community 119 - "Module 119"
Cohesion: 1.0
Nodes (0): 

### Community 120 - "Module 120"
Cohesion: 1.0
Nodes (0): 

### Community 121 - "Module 121"
Cohesion: 1.0
Nodes (0): 

### Community 122 - "Module 122"
Cohesion: 1.0
Nodes (0): 

### Community 123 - "Module 123"
Cohesion: 1.0
Nodes (0): 

### Community 124 - "Module 124"
Cohesion: 1.0
Nodes (0): 

### Community 125 - "Module 125"
Cohesion: 1.0
Nodes (0): 

### Community 126 - "Module 126"
Cohesion: 1.0
Nodes (0): 

### Community 127 - "Module 127"
Cohesion: 1.0
Nodes (0): 

### Community 128 - "Module 128"
Cohesion: 1.0
Nodes (0): 

### Community 129 - "Module 129"
Cohesion: 1.0
Nodes (0): 

### Community 130 - "Module 130"
Cohesion: 1.0
Nodes (0): 

### Community 131 - "Module 131"
Cohesion: 1.0
Nodes (0): 

### Community 132 - "Module 132"
Cohesion: 1.0
Nodes (0): 

### Community 133 - "Module 133"
Cohesion: 1.0
Nodes (0): 

### Community 134 - "Module 134"
Cohesion: 1.0
Nodes (0): 

### Community 135 - "Module 135"
Cohesion: 1.0
Nodes (0): 

### Community 136 - "Module 136"
Cohesion: 1.0
Nodes (0): 

### Community 137 - "Module 137"
Cohesion: 1.0
Nodes (0): 

### Community 138 - "Module 138"
Cohesion: 1.0
Nodes (0): 

### Community 139 - "Module 139"
Cohesion: 1.0
Nodes (0): 

### Community 140 - "Module 140"
Cohesion: 1.0
Nodes (0): 

### Community 141 - "Module 141"
Cohesion: 1.0
Nodes (0): 

### Community 142 - "Module 142"
Cohesion: 1.0
Nodes (0): 

### Community 143 - "Module 143"
Cohesion: 1.0
Nodes (0): 

### Community 144 - "Module 144"
Cohesion: 1.0
Nodes (0): 

### Community 145 - "Module 145"
Cohesion: 1.0
Nodes (0): 

### Community 146 - "Module 146"
Cohesion: 1.0
Nodes (0): 

### Community 147 - "Module 147"
Cohesion: 1.0
Nodes (0): 

### Community 148 - "Module 148"
Cohesion: 1.0
Nodes (0): 

### Community 149 - "Module 149"
Cohesion: 1.0
Nodes (0): 

### Community 150 - "Module 150"
Cohesion: 1.0
Nodes (0): 

### Community 151 - "Module 151"
Cohesion: 1.0
Nodes (0): 

### Community 152 - "Module 152"
Cohesion: 1.0
Nodes (0): 

### Community 153 - "Module 153"
Cohesion: 1.0
Nodes (0): 

### Community 154 - "Module 154"
Cohesion: 1.0
Nodes (0): 

### Community 155 - "Module 155"
Cohesion: 1.0
Nodes (0): 

### Community 156 - "Module 156"
Cohesion: 1.0
Nodes (0): 

### Community 157 - "Module 157"
Cohesion: 1.0
Nodes (0): 

### Community 158 - "Module 158"
Cohesion: 1.0
Nodes (0): 

### Community 159 - "Module 159"
Cohesion: 1.0
Nodes (0): 

### Community 160 - "Module 160"
Cohesion: 1.0
Nodes (0): 

### Community 161 - "Module 161"
Cohesion: 1.0
Nodes (0): 

### Community 162 - "Module 162"
Cohesion: 1.0
Nodes (0): 

### Community 163 - "Module 163"
Cohesion: 1.0
Nodes (0): 

### Community 164 - "Module 164"
Cohesion: 1.0
Nodes (0): 

### Community 165 - "Module 165"
Cohesion: 1.0
Nodes (0): 

### Community 166 - "Module 166"
Cohesion: 1.0
Nodes (0): 

### Community 167 - "Module 167"
Cohesion: 1.0
Nodes (0): 

### Community 168 - "Module 168"
Cohesion: 1.0
Nodes (0): 

### Community 169 - "Module 169"
Cohesion: 1.0
Nodes (0): 

### Community 170 - "Module 170"
Cohesion: 1.0
Nodes (0): 

### Community 171 - "Module 171"
Cohesion: 1.0
Nodes (0): 

### Community 172 - "Module 172"
Cohesion: 1.0
Nodes (0): 

### Community 173 - "Module 173"
Cohesion: 1.0
Nodes (0): 

### Community 174 - "Module 174"
Cohesion: 1.0
Nodes (0): 

### Community 175 - "Module 175"
Cohesion: 1.0
Nodes (0): 

### Community 176 - "Module 176"
Cohesion: 1.0
Nodes (0): 

### Community 177 - "Module 177"
Cohesion: 1.0
Nodes (0): 

### Community 178 - "Module 178"
Cohesion: 1.0
Nodes (0): 

### Community 179 - "Module 179"
Cohesion: 1.0
Nodes (0): 

### Community 180 - "Module 180"
Cohesion: 1.0
Nodes (0): 

### Community 181 - "Module 181"
Cohesion: 1.0
Nodes (0): 

### Community 182 - "Module 182"
Cohesion: 1.0
Nodes (0): 

### Community 183 - "Module 183"
Cohesion: 1.0
Nodes (0): 

### Community 184 - "Module 184"
Cohesion: 1.0
Nodes (0): 

### Community 185 - "Module 185"
Cohesion: 1.0
Nodes (0): 

### Community 186 - "Module 186"
Cohesion: 1.0
Nodes (0): 

### Community 187 - "Module 187"
Cohesion: 1.0
Nodes (0): 

### Community 188 - "Module 188"
Cohesion: 1.0
Nodes (0): 

### Community 189 - "Module 189"
Cohesion: 1.0
Nodes (0): 

### Community 190 - "Module 190"
Cohesion: 1.0
Nodes (0): 

### Community 191 - "Module 191"
Cohesion: 1.0
Nodes (0): 

### Community 192 - "Module 192"
Cohesion: 1.0
Nodes (0): 

### Community 193 - "Module 193"
Cohesion: 1.0
Nodes (0): 

### Community 194 - "Module 194"
Cohesion: 1.0
Nodes (0): 

### Community 195 - "Module 195"
Cohesion: 1.0
Nodes (0): 

### Community 196 - "Module 196"
Cohesion: 1.0
Nodes (0): 

### Community 197 - "Module 197"
Cohesion: 1.0
Nodes (0): 

### Community 198 - "Module 198"
Cohesion: 1.0
Nodes (0): 

### Community 199 - "Module 199"
Cohesion: 1.0
Nodes (0): 

### Community 200 - "Module 200"
Cohesion: 1.0
Nodes (0): 

### Community 201 - "Module 201"
Cohesion: 1.0
Nodes (0): 

### Community 202 - "Module 202"
Cohesion: 1.0
Nodes (0): 

### Community 203 - "Module 203"
Cohesion: 1.0
Nodes (0): 

### Community 204 - "Module 204"
Cohesion: 1.0
Nodes (0): 

### Community 205 - "Module 205"
Cohesion: 1.0
Nodes (0): 

### Community 206 - "Module 206"
Cohesion: 1.0
Nodes (0): 

### Community 207 - "Module 207"
Cohesion: 1.0
Nodes (0): 

### Community 208 - "Module 208"
Cohesion: 1.0
Nodes (0): 

### Community 209 - "Module 209"
Cohesion: 1.0
Nodes (0): 

### Community 210 - "Module 210"
Cohesion: 1.0
Nodes (0): 

### Community 211 - "Module 211"
Cohesion: 1.0
Nodes (0): 

### Community 212 - "Module 212"
Cohesion: 1.0
Nodes (0): 

### Community 213 - "Module 213"
Cohesion: 1.0
Nodes (0): 

### Community 214 - "Module 214"
Cohesion: 1.0
Nodes (0): 

### Community 215 - "Module 215"
Cohesion: 1.0
Nodes (0): 

### Community 216 - "Module 216"
Cohesion: 1.0
Nodes (0): 

### Community 217 - "Module 217"
Cohesion: 1.0
Nodes (0): 

### Community 218 - "Module 218"
Cohesion: 1.0
Nodes (0): 

### Community 219 - "Module 219"
Cohesion: 1.0
Nodes (0): 

### Community 220 - "Module 220"
Cohesion: 1.0
Nodes (0): 

### Community 221 - "Module 221"
Cohesion: 1.0
Nodes (0): 

### Community 222 - "Module 222"
Cohesion: 1.0
Nodes (0): 

### Community 223 - "Module 223"
Cohesion: 1.0
Nodes (0): 

### Community 224 - "Module 224"
Cohesion: 1.0
Nodes (0): 

### Community 225 - "Module 225"
Cohesion: 1.0
Nodes (0): 

### Community 226 - "Module 226"
Cohesion: 1.0
Nodes (0): 

### Community 227 - "Module 227"
Cohesion: 1.0
Nodes (0): 

### Community 228 - "Module 228"
Cohesion: 1.0
Nodes (0): 

### Community 229 - "Module 229"
Cohesion: 1.0
Nodes (0): 

### Community 230 - "Module 230"
Cohesion: 1.0
Nodes (0): 

### Community 231 - "Module 231"
Cohesion: 1.0
Nodes (0): 

### Community 232 - "Module 232"
Cohesion: 1.0
Nodes (0): 

### Community 233 - "Module 233"
Cohesion: 1.0
Nodes (0): 

### Community 234 - "Module 234"
Cohesion: 1.0
Nodes (0): 

### Community 235 - "Module 235"
Cohesion: 1.0
Nodes (0): 

### Community 236 - "Module 236"
Cohesion: 1.0
Nodes (0): 

### Community 237 - "Module 237"
Cohesion: 1.0
Nodes (0): 

### Community 238 - "Module 238"
Cohesion: 1.0
Nodes (0): 

### Community 239 - "Module 239"
Cohesion: 1.0
Nodes (0): 

### Community 240 - "Module 240"
Cohesion: 1.0
Nodes (0): 

### Community 241 - "Module 241"
Cohesion: 1.0
Nodes (0): 

### Community 242 - "Module 242"
Cohesion: 1.0
Nodes (0): 

### Community 243 - "Module 243"
Cohesion: 1.0
Nodes (0): 

### Community 244 - "Module 244"
Cohesion: 1.0
Nodes (0): 

### Community 245 - "Module 245"
Cohesion: 1.0
Nodes (0): 

### Community 246 - "Module 246"
Cohesion: 1.0
Nodes (0): 

### Community 247 - "Module 247"
Cohesion: 1.0
Nodes (0): 

### Community 248 - "Module 248"
Cohesion: 1.0
Nodes (0): 

### Community 249 - "Module 249"
Cohesion: 1.0
Nodes (0): 

### Community 250 - "Module 250"
Cohesion: 1.0
Nodes (0): 

### Community 251 - "Module 251"
Cohesion: 1.0
Nodes (0): 

### Community 252 - "Module 252"
Cohesion: 1.0
Nodes (0): 

### Community 253 - "Module 253"
Cohesion: 1.0
Nodes (0): 

### Community 254 - "Module 254"
Cohesion: 1.0
Nodes (0): 

### Community 255 - "Module 255"
Cohesion: 1.0
Nodes (0): 

### Community 256 - "Module 256"
Cohesion: 1.0
Nodes (0): 

### Community 257 - "Module 257"
Cohesion: 1.0
Nodes (0): 

### Community 258 - "Module 258"
Cohesion: 1.0
Nodes (0): 

### Community 259 - "Module 259"
Cohesion: 1.0
Nodes (0): 

### Community 260 - "Module 260"
Cohesion: 1.0
Nodes (0): 

### Community 261 - "Module 261"
Cohesion: 1.0
Nodes (0): 

### Community 262 - "Module 262"
Cohesion: 1.0
Nodes (0): 

### Community 263 - "Module 263"
Cohesion: 1.0
Nodes (0): 

### Community 264 - "Module 264"
Cohesion: 1.0
Nodes (0): 

### Community 265 - "Module 265"
Cohesion: 1.0
Nodes (0): 

### Community 266 - "Module 266"
Cohesion: 1.0
Nodes (0): 

### Community 267 - "Module 267"
Cohesion: 1.0
Nodes (0): 

### Community 268 - "Module 268"
Cohesion: 1.0
Nodes (0): 

### Community 269 - "Module 269"
Cohesion: 1.0
Nodes (0): 

### Community 270 - "Module 270"
Cohesion: 1.0
Nodes (0): 

### Community 271 - "Module 271"
Cohesion: 1.0
Nodes (0): 

### Community 272 - "Module 272"
Cohesion: 1.0
Nodes (0): 

### Community 273 - "Module 273"
Cohesion: 1.0
Nodes (0): 

### Community 274 - "Module 274"
Cohesion: 1.0
Nodes (0): 

### Community 275 - "Module 275"
Cohesion: 1.0
Nodes (0): 

### Community 276 - "Module 276"
Cohesion: 1.0
Nodes (0): 

### Community 277 - "Module 277"
Cohesion: 1.0
Nodes (0): 

### Community 278 - "Module 278"
Cohesion: 1.0
Nodes (0): 

### Community 279 - "Module 279"
Cohesion: 1.0
Nodes (0): 

### Community 280 - "Module 280"
Cohesion: 1.0
Nodes (0): 

### Community 281 - "Module 281"
Cohesion: 1.0
Nodes (0): 

### Community 282 - "Module 282"
Cohesion: 1.0
Nodes (0): 

### Community 283 - "Module 283"
Cohesion: 1.0
Nodes (0): 

### Community 284 - "Module 284"
Cohesion: 1.0
Nodes (0): 

### Community 285 - "Module 285"
Cohesion: 1.0
Nodes (0): 

### Community 286 - "Module 286"
Cohesion: 1.0
Nodes (0): 

### Community 287 - "Module 287"
Cohesion: 1.0
Nodes (0): 

### Community 288 - "Module 288"
Cohesion: 1.0
Nodes (0): 

### Community 289 - "Module 289"
Cohesion: 1.0
Nodes (0): 

### Community 290 - "Module 290"
Cohesion: 1.0
Nodes (0): 

### Community 291 - "Module 291"
Cohesion: 1.0
Nodes (0): 

### Community 292 - "Module 292"
Cohesion: 1.0
Nodes (0): 

### Community 293 - "Module 293"
Cohesion: 1.0
Nodes (0): 

### Community 294 - "Module 294"
Cohesion: 1.0
Nodes (0): 

### Community 295 - "Module 295"
Cohesion: 1.0
Nodes (0): 

### Community 296 - "Module 296"
Cohesion: 1.0
Nodes (0): 

### Community 297 - "Module 297"
Cohesion: 1.0
Nodes (0): 

### Community 298 - "Module 298"
Cohesion: 1.0
Nodes (0): 

### Community 299 - "Module 299"
Cohesion: 1.0
Nodes (0): 

### Community 300 - "Module 300"
Cohesion: 1.0
Nodes (0): 

### Community 301 - "Module 301"
Cohesion: 1.0
Nodes (0): 

### Community 302 - "Module 302"
Cohesion: 1.0
Nodes (0): 

### Community 303 - "Module 303"
Cohesion: 1.0
Nodes (0): 

### Community 304 - "Module 304"
Cohesion: 1.0
Nodes (0): 

### Community 305 - "Module 305"
Cohesion: 1.0
Nodes (0): 

### Community 306 - "Module 306"
Cohesion: 1.0
Nodes (0): 

### Community 307 - "Module 307"
Cohesion: 1.0
Nodes (0): 

### Community 308 - "Module 308"
Cohesion: 1.0
Nodes (0): 

### Community 309 - "Module 309"
Cohesion: 1.0
Nodes (0): 

### Community 310 - "Module 310"
Cohesion: 1.0
Nodes (0): 

### Community 311 - "Module 311"
Cohesion: 1.0
Nodes (0): 

### Community 312 - "Module 312"
Cohesion: 1.0
Nodes (0): 

### Community 313 - "Module 313"
Cohesion: 1.0
Nodes (0): 

### Community 314 - "Module 314"
Cohesion: 1.0
Nodes (0): 

### Community 315 - "Module 315"
Cohesion: 1.0
Nodes (0): 

### Community 316 - "Module 316"
Cohesion: 1.0
Nodes (0): 

### Community 317 - "Module 317"
Cohesion: 1.0
Nodes (0): 

### Community 318 - "Module 318"
Cohesion: 1.0
Nodes (0): 

### Community 319 - "Module 319"
Cohesion: 1.0
Nodes (0): 

### Community 320 - "Module 320"
Cohesion: 1.0
Nodes (0): 

### Community 321 - "Module 321"
Cohesion: 1.0
Nodes (0): 

### Community 322 - "Module 322"
Cohesion: 1.0
Nodes (0): 

### Community 323 - "Module 323"
Cohesion: 1.0
Nodes (0): 

### Community 324 - "Module 324"
Cohesion: 1.0
Nodes (0): 

### Community 325 - "Module 325"
Cohesion: 1.0
Nodes (0): 

### Community 326 - "Module 326"
Cohesion: 1.0
Nodes (0): 

### Community 327 - "Module 327"
Cohesion: 1.0
Nodes (0): 

### Community 328 - "Module 328"
Cohesion: 1.0
Nodes (0): 

### Community 329 - "Module 329"
Cohesion: 1.0
Nodes (0): 

### Community 330 - "Module 330"
Cohesion: 1.0
Nodes (0): 

### Community 331 - "Module 331"
Cohesion: 1.0
Nodes (0): 

### Community 332 - "Module 332"
Cohesion: 1.0
Nodes (0): 

### Community 333 - "Module 333"
Cohesion: 1.0
Nodes (0): 

### Community 334 - "Module 334"
Cohesion: 1.0
Nodes (0): 

### Community 335 - "Module 335"
Cohesion: 1.0
Nodes (0): 

### Community 336 - "Module 336"
Cohesion: 1.0
Nodes (0): 

### Community 337 - "Module 337"
Cohesion: 1.0
Nodes (0): 

### Community 338 - "Module 338"
Cohesion: 1.0
Nodes (0): 

### Community 339 - "Module 339"
Cohesion: 1.0
Nodes (0): 

### Community 340 - "Module 340"
Cohesion: 1.0
Nodes (0): 

### Community 341 - "Module 341"
Cohesion: 1.0
Nodes (0): 

### Community 342 - "Module 342"
Cohesion: 1.0
Nodes (0): 

### Community 343 - "Module 343"
Cohesion: 1.0
Nodes (0): 

### Community 344 - "Module 344"
Cohesion: 1.0
Nodes (0): 

### Community 345 - "Module 345"
Cohesion: 1.0
Nodes (0): 

### Community 346 - "Module 346"
Cohesion: 1.0
Nodes (0): 

### Community 347 - "Module 347"
Cohesion: 1.0
Nodes (0): 

### Community 348 - "Module 348"
Cohesion: 1.0
Nodes (0): 

### Community 349 - "Module 349"
Cohesion: 1.0
Nodes (0): 

### Community 350 - "Module 350"
Cohesion: 1.0
Nodes (0): 

### Community 351 - "Module 351"
Cohesion: 1.0
Nodes (0): 

### Community 352 - "Module 352"
Cohesion: 1.0
Nodes (0): 

### Community 353 - "Module 353"
Cohesion: 1.0
Nodes (0): 

### Community 354 - "Module 354"
Cohesion: 1.0
Nodes (0): 

### Community 355 - "Module 355"
Cohesion: 1.0
Nodes (0): 

### Community 356 - "Module 356"
Cohesion: 1.0
Nodes (0): 

### Community 357 - "Module 357"
Cohesion: 1.0
Nodes (0): 

### Community 358 - "Module 358"
Cohesion: 1.0
Nodes (0): 

### Community 359 - "Module 359"
Cohesion: 1.0
Nodes (0): 

### Community 360 - "Module 360"
Cohesion: 1.0
Nodes (0): 

### Community 361 - "Module 361"
Cohesion: 1.0
Nodes (0): 

### Community 362 - "Module 362"
Cohesion: 1.0
Nodes (0): 

### Community 363 - "Module 363"
Cohesion: 1.0
Nodes (0): 

### Community 364 - "Module 364"
Cohesion: 1.0
Nodes (0): 

### Community 365 - "Module 365"
Cohesion: 1.0
Nodes (0): 

### Community 366 - "Module 366"
Cohesion: 1.0
Nodes (0): 

### Community 367 - "Module 367"
Cohesion: 1.0
Nodes (0): 

### Community 368 - "Module 368"
Cohesion: 1.0
Nodes (0): 

### Community 369 - "Module 369"
Cohesion: 1.0
Nodes (0): 

### Community 370 - "Module 370"
Cohesion: 1.0
Nodes (0): 

### Community 371 - "Module 371"
Cohesion: 1.0
Nodes (0): 

### Community 372 - "Module 372"
Cohesion: 1.0
Nodes (0): 

### Community 373 - "Module 373"
Cohesion: 1.0
Nodes (0): 

### Community 374 - "Module 374"
Cohesion: 1.0
Nodes (0): 

### Community 375 - "Module 375"
Cohesion: 1.0
Nodes (0): 

### Community 376 - "Module 376"
Cohesion: 1.0
Nodes (0): 

### Community 377 - "Module 377"
Cohesion: 1.0
Nodes (1): MBTI Personality Preferences

### Community 378 - "Module 378"
Cohesion: 1.0
Nodes (1): @Transient Annotation

### Community 379 - "Module 379"
Cohesion: 1.0
Nodes (1): @Temporal Date Mapping Annotation

### Community 380 - "Module 380"
Cohesion: 1.0
Nodes (1): RUP Artifacts for Inception Phase

### Community 381 - "Module 381"
Cohesion: 1.0
Nodes (1): Project Development Environment

### Community 382 - "Module 382"
Cohesion: 1.0
Nodes (1): Typical Iteration Flow Diagram

### Community 383 - "Module 383"
Cohesion: 1.0
Nodes (1): RUP Overview Diagram (Phases x Workflows)

### Community 384 - "Module 384"
Cohesion: 1.0
Nodes (1): Work Assignment Outline Form

### Community 385 - "Module 385"
Cohesion: 1.0
Nodes (1): Rate Sheet Form

### Community 386 - "Module 386"
Cohesion: 1.0
Nodes (1): Engineering Schedule / Work Package Schedule Performance Report

### Community 387 - "Module 387"
Cohesion: 1.0
Nodes (1): Project Summary Sheet

## Knowledge Gaps
- **267 isolated node(s):** `@Table Annotation`, `@Column Annotation`, `@GeneratedValue Annotation`, `@Transient Annotation`, `@Basic and FetchType (LAZY/EAGER)` (+262 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Module 33`** (2 nodes): `Layered Architecture Pattern`, `Multi-Tiered Java EE Architecture (Web/Business/EIS)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 34`** (2 nodes): `hostenv_adobesvg.js`, `dj_last_script_src()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 35`** (2 nodes): `hostenv_spidermonkey.js`, `dj_spidermonkey_current_file()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 36`** (2 nodes): `hostenv_svg.js`, `nodeToString()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 37`** (2 nodes): `DocPane.js`, `makeSelect()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 38`** (2 nodes): `Manager.js`, `buildPrefixCache()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 39`** (2 nodes): `HslColorPicker.js`, `rgb()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 40`** (2 nodes): `FilteringTable.js`, `createSortFunction()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 41`** (2 nodes): `ContentPane.js`, `asyncParse()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 42`** (2 nodes): `DomWidget.js`, `trim()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 43`** (2 nodes): `metrics.js`, `cl()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 44`** (2 nodes): `browser.js`, `nukeProp()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 45`** (2 nodes): `matrix.js`, `format_int()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 46`** (2 nodes): `curves.js`, `computeRanges()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 47`** (2 nodes): `func.js`, `gather()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 48`** (2 nodes): `Axis.js`, `createLabel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 49`** (2 nodes): `number.js`, `splitSubstrings()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 50`** (2 nodes): `LightweightGenerator.js`, `_generateRandomEightCharacterHexString()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 51`** (2 nodes): `contentPage.js`, `ReferenceHelpTopic()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 52`** (2 nodes): `ProcessElementPage.js`, `ProcessElementPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 53`** (2 nodes): `ACID Transaction Properties`, `EJB Transaction Attributes`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 54`** (2 nodes): `@Id Primary Key Annotation`, `JPA Entity Annotation Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 55`** (2 nodes): `JPA Relationship Annotations`, `Entity Relationship Mapping`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 56`** (2 nodes): `@Inheritance Annotation`, `JPA Inheritance Mapping Strategies`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 57`** (2 nodes): `Project Budget Matrix`, `Project Costing/Budget/Actual Comparison (PCBAC)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 58`** (1 nodes): `@Transient Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 59`** (1 nodes): `@Temporal Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 60`** (1 nodes): `@Lob Annotation (Blob/Clob)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 61`** (1 nodes): `@Enumerated Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 62`** (1 nodes): `Default O/R Mapping Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 63`** (1 nodes): `@Inheritance Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 64`** (1 nodes): `@Singleton Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 65`** (1 nodes): `@AccessTimeout Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 66`** (1 nodes): `Test Procedure`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 67`** (1 nodes): `Kinds of Testing (Performance, Security, Stress, etc.)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 68`** (1 nodes): `Test Workers: Designer, Tester, Evaluator`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 69`** (1 nodes): `Artifact Sets (Management, Requirements, Design, Implementation, Deployment)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 70`** (1 nodes): `Workers: System Analyst, UC Specifier, UI Designer, Architect`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 71`** (1 nodes): `Glossary Artifact`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 72`** (1 nodes): `Implementation Subsystem`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 73`** (1 nodes): `Implementation Roles: Architect, Component Engineer, Systems Integrator`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 74`** (1 nodes): `COMP4911 Course Overview`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 75`** (1 nodes): `Project Team Positions (PM, QA, Dev, etc.)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 76`** (1 nodes): `360 Degree Peer Assessment`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 77`** (1 nodes): `Software Architecture Definition`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 78`** (1 nodes): `Requirement Types (FURPS+)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 79`** (1 nodes): `Requirement Attributes (Status, Priority, Risk, etc.)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 80`** (1 nodes): `Supplementary Specifications`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 81`** (1 nodes): `Configuration and Change Management`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 82`** (1 nodes): `Inception Evaluation Criteria`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 83`** (1 nodes): `Inception Deliverables (Feature List, UC Model, Business Case)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 84`** (1 nodes): `POJO (Plain Old Java Objects)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 85`** (1 nodes): `Web Services (SOAP, WSDL)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 86`** (1 nodes): `JMS Message Types (Text, Map, Object, Stream, Bytes)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 87`** (1 nodes): `Analysis Packages`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 88`** (1 nodes): `Phase Resource Allocation (10/30/50/10% schedule)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 89`** (1 nodes): `Container Services Overview`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 90`** (1 nodes): `EJB Interoperability (RMI-IIOP, JAX-WS, JAX-RS)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 91`** (1 nodes): `Java EE Platform Integration (JTS, JPA, JNDI, CDI)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 92`** (1 nodes): `@Entity and @Table Annotations`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 93`** (1 nodes): `EAR Application Packaging (WAR, JAR, application.xml)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 94`** (1 nodes): `Alternatives to EJB (Spring, Hibernate, JDBC)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 95`** (1 nodes): `Application-Managed EntityManager`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 96`** (1 nodes): `@RunAs Security Identity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 97`** (1 nodes): `Web Authentication Methods (Basic, Form, Certificate, Digest)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 98`** (1 nodes): `Iterative Development Strategies (Incremental, Evolutionary, Grand Design)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 99`** (1 nodes): `Extraversion vs Introversion`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 100`** (1 nodes): `Sensing vs Intuition`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 101`** (1 nodes): `Thinking vs Feeling`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 102`** (1 nodes): `JPQL GROUP BY and HAVING`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 103`** (1 nodes): `JPQL Subqueries (ALL, ANY, SOME, EXISTS)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 104`** (1 nodes): `@OrderBy and @MapKey Annotations`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 105`** (1 nodes): `io.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 106`** (1 nodes): `html.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 107`** (1 nodes): `profile.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 108`** (1 nodes): `loader_xd.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 109`** (1 nodes): `bootstrap2.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 110`** (1 nodes): `ns.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 111`** (1 nodes): `docs.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 112`** (1 nodes): `event.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 113`** (1 nodes): `lang.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 114`** (1 nodes): `hostenv_wsh.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 115`** (1 nodes): `style.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 116`** (1 nodes): `experimental.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 117`** (1 nodes): `AdapterRegistry.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 118`** (1 nodes): `DeferredList.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 119`** (1 nodes): `a11y.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 120`** (1 nodes): `hostenv_jsc.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 121`** (1 nodes): `string.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 122`** (1 nodes): `iCalendar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 123`** (1 nodes): `math.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 124`** (1 nodes): `data.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 125`** (1 nodes): `dom.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 126`** (1 nodes): `date.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 127`** (1 nodes): `hostenv_dashboard.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 128`** (1 nodes): `Deferred.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 129`** (1 nodes): `svg.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 130`** (1 nodes): `regexp.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 131`** (1 nodes): `crypto.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 132`** (1 nodes): `validate.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 133`** (1 nodes): `Animation.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 134`** (1 nodes): `flash.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 135`** (1 nodes): `storage.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 136`** (1 nodes): `debug.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 137`** (1 nodes): `web.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 138`** (1 nodes): `check.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 139`** (1 nodes): `datetime.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 140`** (1 nodes): `__package__.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 141`** (1 nodes): `creditCard.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 142`** (1 nodes): `de.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 143`** (1 nodes): `us.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 144`** (1 nodes): `jp.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 145`** (1 nodes): `extras.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 146`** (1 nodes): `toggle.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 147`** (1 nodes): `shadow.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 148`** (1 nodes): `Rounded.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 149`** (1 nodes): `TreeRPCController.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 150`** (1 nodes): `Toaster.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 151`** (1 nodes): `TreeExtension.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 152`** (1 nodes): `Clock.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 153`** (1 nodes): `DebugConsole.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 154`** (1 nodes): `SortableTable.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 155`** (1 nodes): `Editor2.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 156`** (1 nodes): `ShowSlide.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 157`** (1 nodes): `TreeNode.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 158`** (1 nodes): `Tooltip.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 159`** (1 nodes): `ShowAction.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 160`** (1 nodes): `SvgWidget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 161`** (1 nodes): `TreeLoadingController.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 162`** (1 nodes): `Chart.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 163`** (1 nodes): `TreeDemo.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 164`** (1 nodes): `SwtWidget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 165`** (1 nodes): `AccordionContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 166`** (1 nodes): `FisheyeList.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 167`** (1 nodes): `ColorPalette.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 168`** (1 nodes): `TreeContextMenu.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 169`** (1 nodes): `Tree.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 170`** (1 nodes): `ComboBox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 171`** (1 nodes): `Show.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 172`** (1 nodes): `PageContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 173`** (1 nodes): `RemoteTabController.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 174`** (1 nodes): `TaskBar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 175`** (1 nodes): `TreeDndControllerV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 176`** (1 nodes): `TreeRpcControllerV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 177`** (1 nodes): `CurrencyTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 178`** (1 nodes): `UsTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 179`** (1 nodes): `TreeControllerExtension.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 180`** (1 nodes): `Dialog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 181`** (1 nodes): `DateTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 182`** (1 nodes): `PopupContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 183`** (1 nodes): `TabContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 184`** (1 nodes): `ResizeHandle.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 185`** (1 nodes): `InlineEditBox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 186`** (1 nodes): `TitlePane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 187`** (1 nodes): `Widget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 188`** (1 nodes): `RegexpTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 189`** (1 nodes): `SplitContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 190`** (1 nodes): `Spinner.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 191`** (1 nodes): `LayoutContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 192`** (1 nodes): `SvgButton.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 193`** (1 nodes): `ResizableTextarea.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 194`** (1 nodes): `TreeDisableWrapExtension.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 195`** (1 nodes): `TreeCommon.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 196`** (1 nodes): `Editor.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 197`** (1 nodes): `ValidationTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 198`** (1 nodes): `Select.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 199`** (1 nodes): `Repeater.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 200`** (1 nodes): `TreeTimeoutIterator.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 201`** (1 nodes): `TreeDeselectOnDblselect.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 202`** (1 nodes): `TreeLoadingControllerV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 203`** (1 nodes): `TreeWithNode.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 204`** (1 nodes): `Checkbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 205`** (1 nodes): `TreeToggleOnSelect.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 206`** (1 nodes): `TreeEmphasizeOnSelect.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 207`** (1 nodes): `Editor2Toolbar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 208`** (1 nodes): `TreeV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 209`** (1 nodes): `RadioGroup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 210`** (1 nodes): `TreeDocIconExtension.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 211`** (1 nodes): `ProgressBar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 212`** (1 nodes): `Menu2.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 213`** (1 nodes): `TreeEditor.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 214`** (1 nodes): `AnimatedPng.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 215`** (1 nodes): `Button.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 216`** (1 nodes): `Textbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 217`** (1 nodes): `Toggler.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 218`** (1 nodes): `Toolbar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 219`** (1 nodes): `DropdownTimePicker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 220`** (1 nodes): `Form.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 221`** (1 nodes): `TimePicker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 222`** (1 nodes): `Wizard.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 223`** (1 nodes): `DropdownContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 224`** (1 nodes): `Slider.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 225`** (1 nodes): `TreeSelectorV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 226`** (1 nodes): `TreeBasicControllerV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 227`** (1 nodes): `InternetTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 228`** (1 nodes): `TreeBasicController.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 229`** (1 nodes): `HtmlWidget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 230`** (1 nodes): `MonthlyCalendar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 231`** (1 nodes): `DropdownDatePicker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 232`** (1 nodes): `SlideShow.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 233`** (1 nodes): `TreeLinkExtension.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 234`** (1 nodes): `IntegerTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 235`** (1 nodes): `TreeNodeV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 236`** (1 nodes): `FloatingPane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 237`** (1 nodes): `TreeContextMenuV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 238`** (1 nodes): `RealNumberTextbox.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 239`** (1 nodes): `TreeSelector.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 240`** (1 nodes): `LinkPane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 241`** (1 nodes): `TreeExpandToNodeOnSelect.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 242`** (1 nodes): `DemoItem.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 243`** (1 nodes): `DemoPane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 244`** (1 nodes): `DemoNavigator.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 245`** (1 nodes): `DemoContainer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 246`** (1 nodes): `SourcePane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 247`** (1 nodes): `ToolbarDndSupport.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 248`** (1 nodes): `TableOperation.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 249`** (1 nodes): `CreateLinkDialog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 250`** (1 nodes): `AlwaysShowToolbar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 251`** (1 nodes): `FindReplace.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 252`** (1 nodes): `ContextMenu.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 253`** (1 nodes): `InsertImageDialog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 254`** (1 nodes): `InsertTableDialog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 255`** (1 nodes): `SimpleSignalCommands.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 256`** (1 nodes): `FindReplaceDialog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 257`** (1 nodes): `layout.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 258`** (1 nodes): `stabile.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 259`** (1 nodes): `TreeDragAndDropV3.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 260`** (1 nodes): `Sortable.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 261`** (1 nodes): `HtmlDragCopy.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 262`** (1 nodes): `HtmlDragManager.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 263`** (1 nodes): `TreeDragAndDrop.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 264`** (1 nodes): `DragAndDrop.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 265`** (1 nodes): `HtmlDragAndDrop.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 266`** (1 nodes): `HtmlDragMove.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 267`** (1 nodes): `serialize.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 268`** (1 nodes): `supplemental.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 269`** (1 nodes): `ScriptSrcIO.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 270`** (1 nodes): `IframeIO.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 271`** (1 nodes): `RepubsubIO.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 272`** (1 nodes): `XhrIframeProxy.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 273`** (1 nodes): `cookie.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 274`** (1 nodes): `cometd.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 275`** (1 nodes): `Timer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 276`** (1 nodes): `AnimationSequence.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 277`** (1 nodes): `AnimationEvent.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 278`** (1 nodes): `util.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 279`** (1 nodes): `display.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 280`** (1 nodes): `iframe.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 281`** (1 nodes): `color.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 282`** (1 nodes): `Selection.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 283`** (1 nodes): `points.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 284`** (1 nodes): `textDirectory.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 285`** (1 nodes): `Type.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 286`** (1 nodes): `assert.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 287`** (1 nodes): `array.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 288`** (1 nodes): `declare.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 289`** (1 nodes): `repr.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 290`** (1 nodes): `Streamer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 291`** (1 nodes): `PlotArea.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 292`** (1 nodes): `Series.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 293`** (1 nodes): `Plotters.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 294`** (1 nodes): `Plot.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 295`** (1 nodes): `Builder.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 296`** (1 nodes): `Colorspace.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 297`** (1 nodes): `hsl.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 298`** (1 nodes): `hsv.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 299`** (1 nodes): `currency.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 300`** (1 nodes): `gregorianExtras.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 301`** (1 nodes): `gregorian.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 302`** (1 nodes): `JPY.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 303`** (1 nodes): `ITL.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 304`** (1 nodes): `USD.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 305`** (1 nodes): `INR.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 306`** (1 nodes): `GBP.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 307`** (1 nodes): `EUR.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 308`** (1 nodes): `YahooService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 309`** (1 nodes): `RpcService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 310`** (1 nodes): `JotService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 311`** (1 nodes): `JsonService.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 312`** (1 nodes): `ArrayList.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 313`** (1 nodes): `Store.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 314`** (1 nodes): `Queue.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 315`** (1 nodes): `SortedList.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 316`** (1 nodes): `Set.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 317`** (1 nodes): `Dictionary.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 318`** (1 nodes): `Collections.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 319`** (1 nodes): `Stack.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 320`** (1 nodes): `OpmlStore.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 321`** (1 nodes): `CsvStore.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 322`** (1 nodes): `RdfStore.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 323`** (1 nodes): `YahooStore.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 324`** (1 nodes): `RemoteStore.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 325`** (1 nodes): `Write.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 326`** (1 nodes): `Read.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 327`** (1 nodes): `Result.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 328`** (1 nodes): `Observable.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 329`** (1 nodes): `Kind.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 330`** (1 nodes): `Attribute.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 331`** (1 nodes): `Value.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 332`** (1 nodes): `Item.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 333`** (1 nodes): `ResultSet.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 334`** (1 nodes): `FlatFile.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 335`** (1 nodes): `JotSpot.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 336`** (1 nodes): `Delicious.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 337`** (1 nodes): `MySql.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 338`** (1 nodes): `Base.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 339`** (1 nodes): `Csv.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 340`** (1 nodes): `Uri.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 341`** (1 nodes): `RandomGenerator.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 342`** (1 nodes): `NameBasedGenerator.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 343`** (1 nodes): `NilGenerator.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 344`** (1 nodes): `Uuid.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 345`** (1 nodes): `path.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 346`** (1 nodes): `vml.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 347`** (1 nodes): `shape.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 348`** (1 nodes): `topic.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 349`** (1 nodes): `Logger.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 350`** (1 nodes): `ConsoleLogger.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 351`** (1 nodes): `console.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 352`** (1 nodes): `Firebug.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 353`** (1 nodes): `manifest.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 354`** (1 nodes): `IFrameContentPane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 355`** (1 nodes): `AccordionContainerEx.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 356`** (1 nodes): `ContentPaneEx.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 357`** (1 nodes): `SearchWidget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 358`** (1 nodes): `BannerWidget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 359`** (1 nodes): `DojoTreePane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 360`** (1 nodes): `ModalFloatingPaneEx.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 361`** (1 nodes): `SearchScopeWidget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 362`** (1 nodes): `SearchResultPane.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 363`** (1 nodes): `SplitSizer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 364`** (1 nodes): `ToolbarWidget.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 365`** (1 nodes): `SplitContainerEx.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 366`** (1 nodes): `appResource.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 367`** (1 nodes): `appNav.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 368`** (1 nodes): `appSettings.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 369`** (1 nodes): `treeNodes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 370`** (1 nodes): `app.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 371`** (1 nodes): `appBrowser.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 372`** (1 nodes): `ContentPageSubSection.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 373`** (1 nodes): `processElementData.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 374`** (1 nodes): `ContentPageSection.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 375`** (1 nodes): `ContentPageResource.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 376`** (1 nodes): `ContentPageToolbar.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 377`** (1 nodes): `MBTI Personality Preferences`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 378`** (1 nodes): `@Transient Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 379`** (1 nodes): `@Temporal Date Mapping Annotation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 380`** (1 nodes): `RUP Artifacts for Inception Phase`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 381`** (1 nodes): `Project Development Environment`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 382`** (1 nodes): `Typical Iteration Flow Diagram`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 383`** (1 nodes): `RUP Overview Diagram (Phases x Workflows)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 384`** (1 nodes): `Work Assignment Outline Form`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 385`** (1 nodes): `Rate Sheet Form`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 386`** (1 nodes): `Engineering Schedule / Work Package Schedule Performance Report`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 387`** (1 nodes): `Project Summary Sheet`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `COMP 4911 Midterm Exam Winter 2026` connect `Entity Manager & Persistence` to `Classic Mistakes & MBTI`, `Analysis & Architecture Views`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Technical Review (Comp4911ReviewTechnical)` connect `EJB Architecture & Design` to `Entity Mapping & Annotations`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `@Table Annotation`, `@Column Annotation`, `@GeneratedValue Annotation` to the rest of the system?**
  _267 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `EJB Container Services & Lifecycle` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Course Structure & Phases` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Project Management & RUP Workflows` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Software Best Practices` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._