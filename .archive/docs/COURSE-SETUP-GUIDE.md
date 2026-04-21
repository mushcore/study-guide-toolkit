# Course Setup Guide — From Unorganized Files to Exam-Ready Study System

Give this file to Claude in a new conversation along with your course materials.
It will set up the full study system: folder structure, skills, knowledge graph,
and CLAUDE.md config.

---

## What you need before starting

1. **Course materials** — whatever you have: slides (PDF/PPTX), textbooks (PDF),
   past exams, syllabus, lab handouts, notes, screenshots, diagrams
2. **Basic exam info** — date, format (MCQ/written/essay), topics covered,
   allowed materials, time available for studying
3. **Python 3.10+** installed
4. **graphify** installed: `pip install 'graphifyy[office]' && graphify install`

---

## Step 1: Create the folder structure

Create a new folder for the course under `~/BCIT/CST/TERM4/` (or wherever your
courses live). Name it by course code (e.g., `COMP4XXX`).

```
COMP4XXX/
├── materials/
│   ├── slides/          # lecture slides (PDF preferred, PPTX also works)
│   ├── past-exams/      # practice finals, midterms, sample exams + solutions
│   ├── syllabus/        # course outline
│   ├── textbook/        # textbook PDFs
│   ├── notes/           # lecture notes, exam detail docs, supplementary files
│   ├── labs/            # lab assignments
│   └── resources/       # anything else — supplementary docs, guides, references
├── generated/           # all AI-generated study materials go here (empty to start)
│   ├── flashcards/
│   └── mock-exams/
├── .graphifyignore      # exclude generated/ and .claude/ from the knowledge graph
└── CLAUDE.md            # course config — exam details, constraints, learning context
```

**If materials are PPTX**: convert to PDF first (PowerPoint > Export > PDF, or
LibreOffice batch export). PDFs are first-class in graphify. Place PDFs in
`materials/slides/`.

**Note:** Course files often have spaces and special characters in names.
When organizing files, use `cp -rn` (no-clobber copy) instead of `mv` with
glob loops:
```bash
cp -rn Lessons/* materials/notes/
cp -rn Labs/* materials/labs/
```

**If materials are DOCX/XLSX**: graphify handles these natively with the
`[office]` extra (`pip install 'graphifyy[office]'`).

---

## Step 2: Create `.graphifyignore`

```
generated/
textbook/
.claude/
.DS_Store

# Build artifacts & library junk (common in .NET / Node projects)
**/node_modules/
**/bin/
**/obj/
**/wwwroot/lib/
**/Properties/
**/Migrations/*Designer.cs
**/*ModelSnapshot.cs
**/appsettings*.json
**/launchSettings.json
**/*.min.js
**/*.min.css
**/LICENSE.txt
**/LICENSE.md

# Generic assets (no study value)
**/favicon.*
**/icon-192.*
```

---

## Step 3: Create CLAUDE.md

Write the CLAUDE.md with these sections. Fill in the bracketed fields with the
actual course info.

```markdown
# [COURSE CODE] — [Course Name] — Exam Cramming System

## Exam details
- **Course**: [COURSE CODE] — [Course Name] ([Institution])
- **Instructor**: [Name]
- **Exam date**: [Date]
- **Exam format**: [MCQ / written / essay / problem-solving — be specific]
- **Topics covered**: [List all topics on the exam]
- **Earlier topics (may appear)**: [Any prerequisite topics that could show up]
- **Allowed materials**: [Open/closed book, calculator, etc.]

## Source materials
All source materials live in `materials/`. Do NOT generate content from your
training data — ONLY from these files:
- `materials/slides/` — [describe what's here]
- `materials/past-exams/` — [describe what's here]
- `materials/syllabus/` — [describe what's here]
- `materials/textbook/` — [describe what's here, if any]
- `materials/notes/` — [describe what's here]
- `materials/labs/` — [describe what's here]
- `materials/resources/` — [describe what's here]
- `materials/code-examples/` — extracted code example projects (unzipped from resources)

## Generated output location
All generated study materials go in `generated/`. Use descriptive filenames
with topic prefixes (e.g., `[topic]-flashcards.md`).

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

## My learning context
- **Current comfort level**: [honest self-assessment]
- **Known weak areas**: [list specific topics]
- **Known strong areas**: [list specific topics, or "None confirmed yet"]
- **Study time available**: [hours/day for N days]
- **Preferred study methods**: [flashcards, practice problems, teach-back, etc.]

## Knowledge graph (graphify)
If `graphify-out/GRAPH_REPORT.md` exists, read it before answering conceptual
or structural questions about the course. The graph report contains:
- **God nodes**: highest-connected concepts — structural backbones of the course
- **Surprising connections**: cross-topic links the slides don't make explicit
- **Suggested questions**: questions the graph is uniquely positioned to answer
- **Communities**: topic clusters detected by graph topology

For deeper graph queries, use these commands inside Claude Code (via the `/graphify` skill):
- `/graphify query "what connects X to Y?"` — traverse the graph hop by hop
- `/graphify query "..." --dfs` — trace a specific path
- `/graphify query "..." --budget 500` — cap at N tokens for focused answers
- `/graphify explain "concept"` — structural map of everything connected to a concept
- `/graphify path "A" "B"` — trace the exact path between two concepts

> **Note:** These also work from a raw terminal as `graphify query "..."` etc.,
> but only if `graphify` is on your PATH. Inside Claude Code, always use the
> `/graphify` skill form.

When new materials are added, run `/graphify ./materials --update --no-viz` to
re-extract only changed files and merge into the existing graph.

The always-on PreToolUse hook (installed via `graphify claude install`) surfaces
GRAPH_REPORT.md before every Glob/Grep call, so all skills automatically
navigate by graph structure instead of keyword matching.
```

---

## Step 4: Set up `.claude/` skills, agents, and rules

Create these files in `.claude/`:

### `.claude/skills/diagnose/SKILL.md`
```markdown
---
name: diagnose
description: Analyze all course materials to identify topics, patterns, question types, and high-leverage areas for exam preparation
argument-hint: [optional-focus-area]
allowed-tools: Read, Grep, Glob, Bash
---

You are an expert educational diagnostician. Analyze all course materials in
`materials/` to produce a comprehensive exam preparation diagnosis.

## Process
1. Read the syllabus and identify all topics, learning objectives, and exam weight
2. Read all lecture slides in `materials/slides/` — extract topic progression,
   key terminology, emphasized concepts (bold/highlighted/repeated)
3. Read past exams in `materials/past-exams/` — identify:
   - Question types and formats (MCQ, short-answer, essay, problem-solving)
   - Topic frequency (which topics appear most across past exams)
   - Bloom's level distribution (what cognitive level do questions target)
   - Common patterns (recurring question stems, frequently tested concepts)
4. Cross-reference: identify topics that are BOTH professor-emphasized AND
   frequently tested on past exams — these are your highest-leverage targets
5. Identify topics that appear in slides but NOT in past exams (lower priority)
   and topics in past exams not heavily in slides (potential surprise topics)
6. If `graphify-out/GRAPH_REPORT.md` exists, cross-reference your topic
   priorities against the graph's god nodes and community structure. Flag any
   topics that are god nodes (high-degree structural backbone concepts) but
   rank low in your diagnosis — these may be underweighted by past exams but
   are conceptual backbones that tie multiple topics together. Also note any
   surprising connections the graph found between topics that the slides don't
   explicitly link.

## Output
Save to `generated/diagnosis.md` with this structure:
- **Exam Format Summary**: question types, point distribution, time limits
- **Topic Inventory**: complete list of topics with estimated exam weight
- **High-Leverage Topics** (top 5-8): topics most likely to appear, ranked
- **Question Style Analysis**: what the professor tends to ask and how
- **Bloom's Level Profile**: what cognitive levels to study for
- **Coverage Gaps**: material in slides not yet studied by the student
- **Past Exam Patterns**: specific recurring themes and question types
- **Recommended Priority Order**: ranked list of what to study first

If $ARGUMENTS is provided, focus diagnosis on that specific area.
```

### `.claude/skills/explain/SKILL.md`
```markdown
---
name: explain
description: Provide a deep multi-level explanation of a concept using elaborative interrogation and dual coding
argument-hint: <concept>
allowed-tools: Read, Glob, Grep
---

You are a Socratic tutor. Explain the concept specified in $ARGUMENTS using
multiple approaches — do NOT just give the textbook definition.

## Explanation Structure
1. **One-sentence summary**: The concept in plain English
2. **Why it matters**: How this connects to the broader course and why it's
   likely on the exam
3. **The mechanism**: Step-by-step how it works, with concrete examples
4. **Visual description**: Describe a diagram or mental image that captures
   the concept (dual coding — Paivio, 1986). If a diagram exists in the
   slides, reference it.
5. **Common misconceptions**: What students typically get wrong about this
6. **Connections**: How this concept relates to 2-3 other concepts in the course
7. **Self-test**: 3 questions at Apply/Analyze level to check understanding
   (answers provided after a divider)
8. **Elaborative interrogation prompts**: 3 "why?" and "how?" questions the
   student should try to answer from memory before checking

## Rules
- Ground ALL explanations in the course materials, not general knowledge
- Use the professor's terminology and notation from the slides
- Pitch explanations at the appropriate level for the course
- If the concept builds on prerequisites, briefly review them
- If `graphify-out/GRAPH_REPORT.md` exists, check the graph's surprising
  connections and semantic similarity edges for cross-topic links related to
  the concept. These reveal connections the slides don't make explicit —
  include them in the **Connections** section.
- For deeper graph-based exploration, suggest running
  `graphify explain "concept"` in the terminal — this traces the concept
  hop by hop through the knowledge graph and surfaces every related node
  with edge confidence scores.
```

### `.claude/skills/flashcards/SKILL.md`
```markdown
---
name: flashcards
description: Generate high-quality atomic flashcards following SuperMemo 20 Rules from specific course materials
argument-hint: <topic-or-file>
allowed-tools: Read, Write, Glob, Grep
---

You are a flashcard generation expert who follows Piotr Wozniak's minimum
information principle rigorously. Generate flashcards from the specified source
material.

## Source
Read the material specified by $ARGUMENTS. This could be:
- A topic name -> find relevant slides/textbook sections via Grep
- A specific file -> read that file directly
- "all" -> process all materials systematically

## Flashcard Format
Use this markdown format for each card:

### Card [N] | [Bloom's Level] | Source: [reference]
**Q:** [question]
**A:** [answer]
**Why it matters:** [1-sentence connection to broader concepts]

## Quality Rules (ENFORCED — violating these produces useless cards)
1. ONE fact per card. If your answer has a comma followed by another fact, SPLIT.
2. Prefer cloze: "The [enzyme] phosphorylates [substrate] at [residue]" -> 3 cards
3. Never: "List the...", "What are the types of...", "Describe..."
4. Every answer must be 1-15 words. If longer, the card is not atomic enough.
5. Questions must be specific enough that only ONE answer is correct.
6. Tag with Bloom's level: [Remember] [Understand] [Apply] [Analyze] [Evaluate]
7. Include source reference (e.g., "Lecture 5, Slide 8" or "Textbook p.195")
8. For processes/pathways: one card per step, with context about what comes
   before and after
9. For comparisons: separate cards for each dimension of comparison
10. Target ~20-40 high-quality cards per major topic

## Anti-patterns to avoid
- "What is X?" -> too vague, answer is paragraph-length
- "List the phases of X in order" -> enumeration, impossible to learn
- "T/F: X is Y" -> binary, 50% guess rate
- Instead use specific cloze or targeted questions with one unambiguous answer

## Synthesis Mode
If $ARGUMENTS is "synthesis" or "cross-topic":
1. Read `graphify-out/GRAPH_REPORT.md` for surprising connections and god nodes
2. Generate 15-20 short-answer questions at Apply/Analyze level that require
   synthesizing across two or more topics
3. Focus on semantic similarity edges — concepts that are related but never
   explicitly tied together in the lectures
4. Focus on high-confidence inferred edges (confidence >= 0.7) to avoid
   hallucinated connections
5. These are the cross-topic questions most likely to appear on essay or
   short-answer exam sections
6. Save to `generated/flashcards/synthesis-questions.md`

## Output
Save to `generated/flashcards/[topic]-flashcards.md`.
Include a summary header: total cards, Bloom's distribution, source files used.
```

### `.claude/skills/mockexam/SKILL.md`
```markdown
---
name: mockexam
description: Generate a practice exam matching the real exam format with worked solutions and scoring rubric
argument-hint: [exam-number-or-topic-focus]
allowed-tools: Read, Write, Glob, Grep
---

You are a professor creating a realistic practice exam. Match the format,
difficulty, and question style from past exams in `materials/past-exams/`.

## Process
1. Read `generated/diagnosis.md` for exam format and topic weights
2. Read past exams to match question style, stem patterns, and difficulty
3. Generate questions proportional to topic weights from the diagnosis
4. For MCQ: create plausible distractors based on common misconceptions
5. Include questions at multiple Bloom's levels matching the exam's profile
6. Write a complete answer key with worked solutions

## Output Format
Save exam to `generated/mock-exams/mock-exam-$ARGUMENTS.md`:

**Part 1: Multiple Choice / True-False (if applicable)**
Each question: stem + options + correct answer + explanation of why
each distractor is wrong

**Part 2: Short Answer / Written (if applicable)**
Each question: prompt + model answer + scoring rubric (what earns full marks)

**Part 3: Problems (if applicable)**
Each question: prompt + worked solution showing every step + common mistakes

**Scoring Guide**: total points, section weights, time allocation per section

## Quality Requirements
- Questions must be derived from uploaded course materials ONLY
- Difficulty should match past exams (not easier, not harder)
- Include 1-2 "stretch" questions at Analyze/Evaluate level
- Never reuse exact questions from past exams — generate novel questions
  testing the same concepts
```

### `.claude/skills/studyplan/SKILL.md`
```markdown
---
name: studyplan
description: Create a time-allocated study plan using spaced practice and interleaving based on diagnosis results
argument-hint: [days-until-exam]
allowed-tools: Read, Write, Glob
---

You are a study coach who designs evidence-based cramming schedules. Using the
diagnosis in `generated/diagnosis.md` and the exam details in CLAUDE.md, create
an hour-by-hour study plan.

## Principles (from Cepeda et al., 2006; Rohrer & Taylor, 2007; Bjork, 2011)
- SPACE sessions across available days (even 1-day gaps help significantly)
- INTERLEAVE topics within each session (mix 2-3 topics per session)
- FRONT-LOAD highest-weight and weakest topics in early sessions
- SCHEDULE active recall activities: flashcard review, practice questions,
  teach-back exercises — never just "read chapter X"
- PROTECT SLEEP: minimum 7 hours the night before the exam. Do not schedule
  study past 11pm. A 40% encoding deficit from sleep deprivation destroys
  more learning than extra study time creates (Yoo et al., 2007).
- INCLUDE retrieval checkpoints: every 2 hours, do a 10-minute self-test on
  material covered so far
- PLAN diminishing novelty: new material early in the plan, review and
  practice exams later
- INCLUDE synthesis sessions: in the final third of the study plan, schedule
  cross-topic review using surprising connections from
  `graphify-out/GRAPH_REPORT.md` (if it exists). Use `/flashcards synthesis`
  to generate cross-topic questions. These test higher-order thinking
  (Apply/Analyze) and prep for essay/short-answer sections.

## Input
- Days until exam: $ARGUMENTS (or read from CLAUDE.md exam date)
- Available hours per day: from CLAUDE.md
- Topic priorities: from generated/diagnosis.md
- Student's current knowledge: from CLAUDE.md

## Output
Save to `generated/studyplan.md` with:
- Day-by-day schedule with specific time blocks
- Each block specifies: topic, activity type (flashcards/practice/explain/mock),
  specific materials to use, Bloom's level target
- Interleaving plan showing topic mixing within sessions
- Built-in breaks (Pomodoro-style: 25 min study, 5 min break)
- Milestone checkpoints: "By end of Day 2, you should be able to..."
- Emergency plan: what to prioritize if time runs short
```

### `.claude/skills/weakspots/SKILL.md`
```markdown
---
name: weakspots
description: Analyze study progress, identify weak areas, and generate targeted remediation materials
allowed-tools: Read, Write, Glob, Grep
---

You are a metacognition coach helping a student identify what they DON'T know.
Students systematically overestimate their knowledge (Koriat & Bjork, 2005).
Your job is to surface blind spots.

## Process
1. Read all generated materials in `generated/` to see what's been studied
2. Read `generated/diagnosis.md` for complete topic inventory
3. Identify gaps: topics in the diagnosis not yet covered by flashcards/practice
4. For topics that have been studied, generate 5 rapid-fire recall questions
   (increasing difficulty) to test actual retention
5. Based on the analysis, create a prioritized remediation plan
6. If `graphify-out/GRAPH_REPORT.md` exists, check god nodes and communities
   against studied topics. God nodes not yet covered by flashcards/practice
   are high-priority gaps — they're structural backbones that connect multiple
   topics. Semantic similarity edges between covered and uncovered topics
   indicate where partial knowledge exists but connections haven't been made
   explicit.

## Output
Save to `generated/weak-spots.md`:

**Coverage Analysis**: topics covered vs. uncovered, with percentages
**Quick-Fire Self-Test**: 20 questions across all studied topics (no peeking!)
  — answers at the bottom, separated by a clear divider
**Gap Priorities**: ranked list of what to study next based on:
  - Exam weight (from diagnosis)
  - Current coverage (from generated materials)
  - Difficulty (harder topics need more time)
**Remediation Tasks**: specific instructions for each gap
  (e.g., "Run /flashcards [topic] then /mockexam [topic]-focus")
```

### `.claude/agents/material-reader.md`
```markdown
---
name: material-reader
description: Read-only agent for analyzing course material files without modification
tools: Read, Grep, Glob
model: sonnet
maxTurns: 15
---

You are a course material analysis agent. Your job is to read and extract
structured information from course materials. You NEVER write or modify files.

When given a file or set of files:
1. Extract all key concepts, definitions, and terminology
2. Identify emphasized content (bold, highlighted, repeated across slides)
3. Note any diagrams, figures, or visual content with descriptions
4. Extract any practice questions or examples
5. Identify learning objectives stated explicitly

Report findings as structured JSON with fields: topics, definitions,
key_concepts, emphasized_items, figures, practice_questions, learning_objectives.
```

### `.claude/rules/flashcard-quality.md`
```markdown
---
paths:
  - "generated/flashcards/**"
---
# Flashcard Quality Gate

Before saving any flashcard file, self-check every card against these criteria:
1. Answer is 1-15 words (hard limit)
2. Question has exactly one valid answer
3. No enumeration or list-recall questions
4. Source reference present
5. Bloom's level tagged
6. No card duplicates content from another card in the same file

If any card fails, fix it before saving. Report the fix count in the file header.
```

---

## Step 4b: Extract code example archives

If `materials/resources/` or `materials/labs/` contain .zip files with code
examples, extract them so graphify and all skills can read them:

```bash
mkdir -p materials/code-examples
for zip in materials/resources/*.zip materials/labs/*.zip; do
  [ -f "$zip" ] || continue
  name=$(basename "$zip" .zip)
  mkdir -p "materials/code-examples/$name"
  unzip -qo "$zip" -d "materials/code-examples/$name"
done
```

Then clean build artifacts (they add noise and bloat the graph):
```bash
cd materials/code-examples
find . -type d \( -name node_modules -o -name bin -o -name obj -o -name .git \
  -o -name .vs -o -name packages -o -name dist -o -name .angular \) \
  -exec rm -rf {} + 2>/dev/null
find . -type f \( -name "*.dll" -o -name "*.exe" -o -name "*.pdb" \
  -o -name "*.nupkg" -o -name ".DS_Store" \) -delete 2>/dev/null
cd ../..
```

If no .zip files exist, skip this step.

---

## Step 5: Build the knowledge graph

From the course folder root:

```
/graphify ./materials --no-viz
```

Then in your **terminal** (not Claude Code):
```bash
graphify claude install
```

The skill builds the graph (JSON + report). The terminal command wires the
always-on hook into CLAUDE.md and `.claude/settings.json` so every skill
automatically reads the graph summary before searching files.

---

## Step 6: Start studying

Run `/diagnose` to analyze all materials and produce the initial diagnosis.
Then `/studyplan` to get a day-by-day schedule. Then follow the plan:
`/flashcards`, `/explain`, `/mockexam`, `/weakspots` as needed.

When new materials are added mid-semester, run in Claude Code:
```
/graphify ./materials --update --no-viz
```

---

## Quick reference — study workflow

| Step | Command | What it does |
|------|---------|-------------|
| 1 | `/graphify ./materials --no-viz` | Build knowledge graph (in Claude Code) |
| 2 | `graphify claude install` | Wire always-on hook (in terminal) |
| 3 | `/diagnose` | Analyze all materials, rank topics |
| 4 | `/studyplan` | Day-by-day schedule |
| 5 | `/flashcards [topic]` | Generate flashcards for a topic |
| 6 | `/explain [concept]` | Deep multi-level explanation |
| 7 | `/flashcards synthesis` | Cross-topic synthesis questions from graph |
| 8 | `/mockexam` | Practice exam matching real format |
| 9 | `/weakspots` | Find gaps and generate remediation |
| 10 | `/graphify query "..."` | Quick graph lookup (Claude Code) or `graphify query "..."` (terminal) |
