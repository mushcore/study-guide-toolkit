# COMP4870 — Web Applications — Exam Cramming System

## Exam details
- **Course**: COMP4870 — Web Applications (BCIT CST)
- **Instructor**: Medhat Elmasry
- **Exam date/time**: Friday, April 24, 2026, 10:30-12:30 (2-hour window, actual test is 60 min)
- **Location**: SE12-327 (BCIT Burnaby)
- **Pass threshold**: 55-60% — strategy is broad partial credit, not topic mastery. Prioritize recognition + syntax skeletons over deep dives.
- **Scope**: Weeks 7-13 (post-midterm, including Week 7)
- **Exam format (confirmed, matches midterm structure)**:
  - Time: 60 minutes
  - 60 MCQ × 1 mark = 60 marks
  - 10 match-two-columns × 1 mark = 10 marks
  - 1 coding question × 10 marks = 10 marks
  - **TOTAL: 80 marks**
- **Allowed materials**: ONE HAND-WRITTEN cheat sheet, 8.5" × 11", both sides. Must be hand-written (not printed).
- **Question weights by topic (MCQ + match portion = 70 marks)**:
  | Topic | Marks | % of 70 |
  |-------|-------|---------|
  | **AI (Semantic Kernel/Ollama/MAF/MCP)** | 13 | 19% |
  | **ML.NET** | 12 | 17% |
  | **Cache / Redis** | 8 | 11% |
  | **File-based apps** | 8 | 11% |
  | **gRPC** | 7 | 10% |
  | **TDD / xUnit** | 6 | 9% |
  | **Aspire** | 5 | 7% |
  | **Localization** | 4 | 6% |
  | **Tag Helpers** | 3 | 4% |
  | **Blazor** | 2 | 3% |
  | **Excel/PDF/Chart** | 2 | 3% |
- **Coding question (10 marks)**: topic TBD — most likely gRPC, TDD, or ML.NET based on weight + code-density.
- **Topics covered**:
  - ASP.NET Core fundamentals (MVC, Razor Pages)
  - Entity Framework Core (Code First, DB First, migrations, seeding)
  - Web API (REST, consuming APIs, Minimal API)
  - JWT Authentication
  - SignalR (real-time communication)
  - Blazor (Server, WASM, QuickGrid)
  - Docker / Containers
  - gRPC services
  - Redis caching
  - TDD / xUnit testing
  - React + TypeScript front-end
  - Azure Functions / Serverless
  - Localization / Internationalization
  - Tag Helpers
  - ASP.NET Aspire
  - AI/SLM integration (Ollama, Semantic Kernel, MAF, MCP)
  - **ML.NET** (ML.NET.pptx, ML.NET_VS2022_SCRIPT.docx, ML.NET_VSCODE_SCRIPT.docx, ML.NET_vscode_automl_SCRIPT.docx) — HIGH WEIGHT: 12 marks
  - Identity / Users & Roles
  - File-based apps
  - Static Web Apps
  - Node.js with TypeScript
  - Data caching (in-memory, distributed)
  - PDF/Excel/Chart generation
- **Earlier topics (may appear)**: C#, .NET fundamentals, SQL, HTML/CSS/JS basics
- **Allowed materials**: TBD — update when confirmed

## Source materials
All source materials live in `materials/`. Do NOT generate content from your
training data — ONLY from these files:
- `materials/slides/` — 16 lecture slide decks (.pptx): intro, MVC, Razor Pages, Web API, JWT, SignalR, Blazor, Docker, gRPC, Redis, TDD/xUnit, React, Azure Functions, Localization, File-based apps, AI/SLM
- `materials/past-exams/` — empty (no past exams available)
- `materials/syllabus/` — empty (no separate syllabus found)
- `materials/textbook/` — 3 PDF ebooks: ASP.NET Core architecture, Azure ebook, O'Reilly AI apps guide
- `materials/notes/` — 46 files: lecture scripts (*_SCRIPT.docx), supplementary HTML guides, code walkthroughs
- `materials/labs/` — 14 lab assignments (HTML instructions, starter zips)
- `materials/assignments/` — 5 files: 2 assignment specs, FAQs, partner info
- `materials/project/` — 2 files: high-level requirements, process guide
- `materials/resources/` — 100 files: code example zips, database files (.db, .sql, .csv), deployment guides, VS Code tips, Docker configs

## Generated output location
All generated study materials go in `generated/`. Use descriptive filenames
with topic prefixes (e.g., `ef-core-flashcards.md`).

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
7. SOURCE TAGS: Every card must include source reference (e.g., "Slide 23"
   or "Textbook p.195").
8. OPTIMIZE WORDING: Trim every unnecessary word. Shorter = faster review.
9. USE IMAGERY CUES: Where relevant, describe a visual or reference a diagram
   from the source material.
10. CONNECT TO KNOWLEDGE: Add brief "why it matters" or "connects to" notes
    for elaborative encoding.

### Question generation rules
- Match the exam format
- Include worked-example solutions for all practice problems
- Weight topic coverage by professor emphasis and past exam frequency
- Include "distractor analysis" for MCQ — explain why wrong answers are wrong

### Study plan rules
- Always allocate sleep (>=7 hours the night before the exam)
- Space sessions across available days with ~1-day gaps
- Interleave topics within sessions
- Front-load high-weight and weakest topics
- Include specific retrieval practice activities, not just "review"
- **Pass-strategy (55-60% target)**: maximize breadth-of-recognition over depth. Every topic should get ≥1 identification-level pass before any topic gets a deep dive. Leave no topic at zero — partial credit compounds.
- Account for competing exam load (see Exam week schedule). Don't plan study blocks that collide with other exams or their night-before prep.

## My learning context
- **Current comfort level**: Very behind — barely knows the material. Essentially starting from scratch on ML.NET, AI/Semantic Kernel/MCP, gRPC, Caching/Redis, TDD, Localization, TagHelpers, File-based apps, Aspire. Need foundational exposure before recognition-level study.
- **Target grade**: 55-60% (pass). Optimize for partial credit across all topics rather than A-grade depth on a few.
- **Known weak areas**: All post-midterm topics need study — especially Data Caching (IMemoryCache/Redis), gRPC, AI/SLM (Semantic Kernel/Ollama/MAF/MCP), TDD/xUnit, TagHelpers, Localization, File-based apps
- **Known strong areas**: None confirmed yet — need diagnosis pass to find any anchors
- **Study window**: 7 days (today 2026-04-17 → exam 2026-04-24). Time is shared with 5 other exams that week — see Exam week schedule below.
- **Preferred study methods**: Flashcards, practice problems, code walkthroughs

## Exam week schedule (competes for study time)
COMP4870 is the **last exam of the week** — maximum prep window but also maximum exam fatigue.
- Mon Apr 20, 10:30-12:30: COMP 4911 @ SW05 2875
- Tue Apr 21, 15:30-17:30: COMP 4736 @ SW05 1850
- Wed Apr 22, 11:30-13:30: LIBS 7102 @ SW03 1750
- Thu Apr 23, 13:30-15:30: COMP 4915 @ SW01 3190
- **Fri Apr 24, 10:30-12:30: COMP 4870 @ SE12-327 ← target**
- Fri Apr 24, 15:30-17:30: COMP 4537 @ SW03 1750 (same-day back-to-back — don't overextend Thu night)

## Knowledge graph (graphify)
If `graphify-out/GRAPH_REPORT.md` exists, read it before answering conceptual
or structural questions about the course. The graph report contains:
- **God nodes**: highest-connected concepts — structural backbones of the course
- **Surprising connections**: cross-topic links the slides don't make explicit
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

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
