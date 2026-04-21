# COMP 4736 — Operating Systems — Exam Cramming System

## Exam details
- **Course**: COMP 4736 — Operating Systems (BCIT CST Term 4)
- **Exam date**: April 21, 2026
- **Exam format**: Part 1 — Online (True/False, Multiple Choice); Part 2 — Written (on paper or online)
- **Topics covered**: IPC 1 (Part 6/7), IPC 2 (Part 8), Deadlock (Part 9), Memory (Part 10)
- **Earlier topics (may appear)**: Introduction, OS Structures & Clocks, Processes, Threads, System Calls
- **Professor emphasis**: IPC, Deadlock, and Memory are explicitly listed as final exam topics
- **Allowed materials**: Closed book. Bring laptop (fully charged), calculator, blank paper, pencil
- **Makeup exams**: Not available

## Source materials
All source materials live in `materials/`. Do NOT generate content from your
training data — ONLY from these files:
- `materials/slides/` — Lecture slide PDFs (Part 1-10, Semaphore supplement)
- `materials/past-exams/` — Final exam practice + solutions
- `materials/syllabus/` — Course outline (Course_Outlines_Comp4736.pdf)
- `materials/notes/` — Final exam details, ChatGPT reference, supplementary files
- `materials/labs/` — Lab assignments (Lab01-Lab10)

## Generated output location
All generated study materials go in `generated/`. Use descriptive filenames
with topic prefixes (e.g., `ipc1-shared-memory-flashcards.md`).

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
7. SOURCE TAGS: Every card must include source reference (e.g., "Part 9,
   Slide 12" or "Lab 06").
8. OPTIMIZE WORDING: Trim every unnecessary word. Shorter = faster review.
9. USE IMAGERY CUES: Where relevant, describe a visual or reference a diagram
   from the source material.
10. CONNECT TO KNOWLEDGE: Add brief "why it matters" or "connects to" notes
    for elaborative encoding.

### Question generation rules
- Match the exam format: MCQ/T-F for Part 1, written answers for Part 2
- Include worked-example solutions for all practice problems
- Weight topic coverage by professor emphasis and past exam frequency
- Include "distractor analysis" for MCQ — explain why wrong answers are wrong

### Study plan rules
- Always allocate sleep (>=7 hours the night before the exam)
- Space sessions across available days with ~1-day gaps
- Interleave topics within sessions
- Front-load high-weight and weakest topics
- Include specific retrieval practice activities, not just "review"

## My learning context
- **Current comfort level**: Barely knows the material — essentially starting from scratch on all 4 core topics. Has not attempted practice final or reviewed slides. Needs foundational exposure before targeted drills.
- **Known weak areas**: All four final exam topics — IPC 1 (shared memory, pipes, signals), IPC 2 (message passing, sockets), Deadlock (detection, prevention, avoidance), Memory (paging, segmentation, virtual memory). No topic feels strong.
- **Known strong areas**: None confirmed yet. Earlier topics (Intro, OS Structures, Processes, Threads, System Calls) may have some residual familiarity but need a brush-up since they provide context for the 4 core exam topics.
- **Study time available**: 2-3 hours/day for 14 days (April 7 – April 20)
- **Study scope**: Focus on the 4 listed final exam topics. Brush up on earlier topics (Processes, Threads, System Calls) only as needed for context — do not spend dedicated time on them.
- **Preferred study methods**: flashcards, practice problems, teach-back

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
