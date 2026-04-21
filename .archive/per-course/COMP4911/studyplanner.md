# The evidence-based Claude Code exam cramming system

**Active recall through self-testing is the single most powerful study technique available, producing roughly twice the retention of re-reading — and Claude Code can automate the entire pipeline from raw course materials to practice exams.** This guide combines peer-reviewed cognitive science with Claude Code's agentic tooling (skills, subagents, MCP servers) to build a system that ingests your slides, PDFs, and past exams, then generates flashcards, mock exams, and targeted remediation — all optimized for the 3–7 day window before an exam. Below is the complete blueprint: the research it rests on, the project structure, the CLAUDE.md template, the skill definitions, the multi-pass workflow, and the literal prompts.

---

## The 10 principles your study guide must embody

Every artifact this system generates should be grounded in these evidence-based principles. They are ranked by effect size and practical importance for cramming.

**1. Active recall over re-reading.** Retrieval practice produces a mean effect of **g = 0.61** over all other techniques (Adesope et al., 2017 meta-analysis). Roediger & Karpicke (2006) showed that students who self-tested forgot only 13% after one week, while re-readers forgot 56%. Every study session must involve closing notes and attempting retrieval.

**2. Micro-spacing across available days.** Even with only 3–7 days, distributing study across sessions with **~1-day gaps** dramatically outperforms marathon sessions (Cepeda et al., 2006 meta-analysis; optimal ISI ≈ 20–40% of retention interval). For a 7-day window: study Days 1, 3, 5; review Day 6; exam Day 7.

**3. Interleaving problem types.** Rohrer & Taylor (2007) found interleaving **tripled test scores** (d = 1.34) compared to blocked practice, despite feeling harder during study. Mix topics within sessions rather than studying one topic at a time.

**4. Minimum information principle for flashcards.** Wozniak's Rule 4 from the SuperMemo 20 Rules: each card tests exactly one atomic fact. Complex cards fail because the entire card gets scheduled at the interval of its hardest sub-component. Split relentlessly.

**5. Bloom's taxonomy progression.** Most exams test at Apply/Analyze levels, yet students study at Remember/Understand. Generate questions at all six levels: define → explain → solve → compare → evaluate → design (Anderson & Krathwohl, 2001 revised taxonomy).

**6. Desirable difficulties.** Conditions that feel harder actually produce better retention (Bjork & Bjork, 2011). Struggling to recall, mixing topics, and generating answers before checking are features, not bugs. If studying feels easy, it's probably not working.

**7. Metacognitive calibration through self-testing.** Students systematically overestimate their knowledge due to fluency illusions (Koriat & Bjork, 2005 — 15+ percentage point overestimation). Only successful recall without cues proves you know something. The system must surface what you *don't* know, not confirm what feels familiar.

**8. Sleep is non-negotiable.** Sleep deprivation produces a **40% deficit** in encoding new memories (Yoo et al., 2007). Slow-wave sleep consolidates declarative memory (Diekelmann & Born, 2010). Never sacrifice sleep for more cramming — you lose more than you gain.

**9. RAG grounding to prevent hallucination.** AI-generated flashcards are viable (90× faster than manual creation per Cruz, 2023) but must be grounded in uploaded source materials. LLMs hallucinate facts, especially on long generation runs where quality degrades (ScienceDirect, 2024). Always generate from your actual course content, never from the model's parametric knowledge alone.

**10. Pedagogical AI design beats raw AI.** The Harvard RCT (Kestin et al., 2025) showed AI tutoring outperformed active learning only when the AI was designed with evidence-based pedagogy. Unstructured LLM use actually reduces learning depth (Stadler et al., 2024 — lower germane cognitive load). The system must force active engagement, not passive consumption.

---

## The project structure for every course

Organize each course in a consistent directory that Claude Code can navigate predictably. This structure separates source materials (read-only inputs) from generated outputs.

```
~/school/
└── course-name/
    ├── CLAUDE.md                      # Project memory — the brain of the system
    ├── .claude/
    │   ├── skills/
    │   │   ├── diagnose/SKILL.md      # Diagnostic analysis of materials
    │   │   ├── studyplan/SKILL.md     # Generate time-allocated study plan
    │   │   ├── flashcards/SKILL.md    # Generate atomic flashcards
    │   │   ├── mockexam/SKILL.md      # Generate practice exams
    │   │   ├── weakspots/SKILL.md     # Identify and remediate gaps
    │   │   └── explain/SKILL.md       # Deep explanation of concepts
    │   ├── agents/
    │   │   └── material-reader.md     # Read-only subagent for source analysis
    │   └── rules/
    │       └── flashcard-quality.md   # Always-on quality rules for card gen
    ├── materials/                     # READ-ONLY source materials
    │   ├── slides/                    # .pptx lecture slides
    │   ├── textbook/                  # .pdf textbook chapters
    │   ├── syllabus/                  # Course syllabus, learning objectives
    │   ├── past-exams/                # Previous exams and answer keys
    │   └── notes/                     # Your lecture notes
    └── generated/                     # AI-generated study artifacts
        ├── diagnosis.md               # Course diagnosis report
        ├── studyplan.md               # Time-allocated study plan
        ├── flashcards/                # Generated flashcard files
        │   ├── topic-01-flashcards.md
        │   └── ...
        ├── mock-exams/                # Generated practice exams
        │   ├── exam-01.md
        │   └── ...
        ├── weak-spots.md             # Gap analysis
        └── explanations/             # Deep-dive explanations
```

The `materials/` folder is your input — drop in everything the professor gave you. The `generated/` folder is the output — everything Claude produces. This separation means you can always re-run generation from clean sources.

---

## The CLAUDE.md template for exam cramming

This is the most important file. It gives Claude persistent context about your course, your exam, and the evidence-based constraints every generated artifact must follow. Copy this template and fill in the bracketed fields.

```markdown
# [COURSE NAME] — Exam Cramming System

## Exam details
- **Course**: [e.g., BIO 301 — Molecular Biology]
- **Exam date**: [e.g., April 14, 2026]
- **Exam format**: [e.g., 40 MCQ + 3 short-answer + 1 essay]
- **Topics covered**: [e.g., Chapters 8-14, Lectures 15-28]
- **Professor emphasis**: [e.g., heavy on signal transduction, light on ecology]
- **Allowed materials**: [e.g., closed-book, one page cheat sheet, calculator]

## Source materials
All source materials live in `materials/`. Do NOT generate content from your
training data — ONLY from these files:
- `materials/slides/` — Lecture slides (.pptx)
- `materials/textbook/` — Textbook chapters (.pdf)
- `materials/past-exams/` — Previous exams with answer keys
- `materials/syllabus/` — Syllabus and learning objectives
- `materials/notes/` — Handwritten/typed lecture notes

## Generated output location
All generated study materials go in `generated/`. Use descriptive filenames
with topic prefixes (e.g., `ch08-signal-transduction-flashcards.md`).

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
   Lecture 12" or "Textbook p.247").
8. OPTIMIZE WORDING: Trim every unnecessary word. Shorter = faster review.
9. USE IMAGERY CUES: Where relevant, describe a visual or reference a diagram
   from the source material.
10. CONNECT TO KNOWLEDGE: Add brief "why it matters" or "connects to" notes
    for elaborative encoding.

### Question generation rules
- Match the exam format: if MCQ, generate MCQ; if short-answer, generate
  short-answer
- Include worked-example solutions for all practice problems
- Weight topic coverage by professor emphasis and past exam frequency
- Include "distractor analysis" for MCQ — explain why wrong answers are wrong

### Study plan rules
- Always allocate sleep (≥7 hours the night before the exam)
- Space sessions across available days with ~1-day gaps
- Interleave topics within sessions
- Front-load high-weight and weakest topics
- Include specific retrieval practice activities, not just "review"

## My learning context
- **Current comfort level**: [e.g., attended all lectures, read chapters 8-10,
  haven't touched 11-14]
- **Known weak areas**: [e.g., signal transduction pathways, enzyme kinetics]
- **Known strong areas**: [e.g., DNA replication, cell cycle]
- **Study time available**: [e.g., 4 hours/day for 5 days]
- **Preferred study methods**: [e.g., flashcards, practice problems, teach-back]
```

**Key design choices**: The template is ~120 lines — within Anthropic's recommended ~200-line limit for strong adherence. Flashcard rules encode Wozniak's minimum information principle, Bloom's taxonomy tagging, and source grounding. The study plan section enforces spacing and sleep protection from the research.

---

## Six skills to build your cramming arsenal

Skills are Claude Code's reusable workflow units. Each lives in `.claude/skills/<name>/SKILL.md`. Here are the six core skills with full SKILL.md content.

### Skill 1: `/diagnose` — Analyze materials and map the exam landscape

```yaml
---
name: diagnose
description: Analyze all course materials to identify topics, patterns, question types, and high-leverage areas for exam preparation
argument-hint: [optional-focus-area]
allowed-tools: Read, Grep, Glob, Bash
disable-model-invocation: true
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

### Skill 2: `/studyplan` — Generate a time-allocated cramming schedule

```yaml
---
name: studyplan
description: Create a time-allocated study plan using spaced practice and interleaving based on diagnosis results
argument-hint: [days-until-exam]
allowed-tools: Read, Write, Glob
disable-model-invocation: true
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

### Skill 3: `/flashcards` — Generate atomic, grounded flashcards

```yaml
---
name: flashcards
description: Generate high-quality atomic flashcards following SuperMemo 20 Rules from specific course materials
argument-hint: <topic-or-file>
allowed-tools: Read, Write, Glob, Grep
disable-model-invocation: true
---

You are a flashcard generation expert who follows Piotr Wozniak's minimum
information principle rigorously. Generate flashcards from the specified source
material.

## Source
Read the material specified by $ARGUMENTS. This could be:
- A topic name → find relevant slides/textbook sections via Grep
- A specific file → read that file directly
- "all" → process all materials systematically

## Flashcard Format
Use this markdown format for each card:

### Card [N] | [Bloom's Level] | Source: [reference]
**Q:** [question]
**A:** [answer]
**Why it matters:** [1-sentence connection to broader concepts]

## Quality Rules (ENFORCED — violating these produces useless cards)
1. ONE fact per card. If your answer has a comma followed by another fact, SPLIT.
2. Prefer cloze: "The [enzyme] phosphorylates [substrate] at [residue]" → 3 cards
3. Never: "List the...", "What are the types of...", "Describe..."
4. Every answer must be 1-15 words. If longer, the card is not atomic enough.
5. Questions must be specific enough that only ONE answer is correct.
6. Tag with Bloom's level: [Remember] [Understand] [Apply] [Analyze] [Evaluate]
7. Include source: "Lecture 12, Slide 8" or "Textbook p.195"
8. For processes/pathways: one card per step, with context about what comes
   before and after
9. For comparisons: separate cards for each dimension of comparison
10. Target ~20-40 high-quality cards per major topic

## Anti-patterns to avoid
- ❌ "What is mitosis?" → too vague, answer is paragraph-length
- ✅ "During which phase of mitosis do chromosomes align at the metaphase plate?"
   → "Metaphase" (1 word, specific, unambiguous)
- ❌ "List the phases of mitosis in order" → enumeration, impossible to learn
- ✅ "What phase of mitosis follows prophase?" → "Prometaphase"
- ❌ "T/F: DNA replication is semiconservative" → binary, 50% guess rate
- ✅ "The Meselson-Stahl experiment proved DNA replication is ___" →
   "semiconservative" (cloze, requires recall)

## Output
Save to `generated/flashcards/[topic]-flashcards.md`.
Include a summary header: total cards, Bloom's distribution, source files used.
```

### Skill 4: `/mockexam` — Generate a realistic practice exam

```yaml
---
name: mockexam
description: Generate a practice exam matching the real exam format with worked solutions and scoring rubric
argument-hint: [exam-number-or-topic-focus]
allowed-tools: Read, Write, Glob, Grep
disable-model-invocation: true
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

**Part 1: Multiple Choice (if applicable)**
Each question: stem + 4 options (A-D) + correct answer + explanation of why
each distractor is wrong

**Part 2: Short Answer (if applicable)**
Each question: prompt + model answer + scoring rubric (what earns full marks)

**Part 3: Problems/Essays (if applicable)**
Each question: prompt + worked solution showing every step + common mistakes

**Scoring Guide**: total points, section weights, time allocation per section

## Quality Requirements
- Questions must be derived from uploaded course materials ONLY
- Difficulty should match past exams (not easier, not harder)
- Include 1-2 "stretch" questions at Analyze/Evaluate level
- Never reuse exact questions from past exams — generate novel questions
  testing the same concepts
```

### Skill 5: `/weakspots` — Identify and remediate knowledge gaps

```yaml
---
name: weakspots
description: Analyze study progress, identify weak areas, and generate targeted remediation materials
allowed-tools: Read, Write, Glob, Grep
disable-model-invocation: true
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
  (e.g., "Run /flashcards ch12-enzyme-kinetics then /mockexam kinetics-focus")
```

### Skill 6: `/explain` — Deep Socratic explanation of tough concepts

```yaml
---
name: explain
description: Provide a deep multi-level explanation of a concept using elaborative interrogation and dual coding
argument-hint: <concept>
allowed-tools: Read, Glob, Grep
disable-model-invocation: true
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
```

---

## One custom subagent and where to borrow patterns

For the study system, **one custom subagent is sufficient**: a read-only material reader that can be dispatched in parallel to analyze different source files simultaneously.

```yaml
# .claude/agents/material-reader.md
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

**Patterns borrowed from VoltAgent/awesome-claude-code-subagents**: The `research-analyst` subagent pattern (Category 10) uses the same Read/Grep/Glob/WebSearch tool set and 3-phase workflow (define strategy → conduct research → deliver outcomes) that maps directly to the diagnose → plan → generate workflow. The `scientific-literature-researcher` agent pattern is useful if you want to cross-reference course claims against primary sources. The key design pattern: **YAML frontmatter for metadata, minimal tool permissions (read-only for analysis), and phased workflow execution**.

**When to use subagents vs. skills**: Use skills (invoked via `/command`) for the main workflow steps because they run in the main conversation context and can build on each other. Use the `material-reader` subagent when you need parallel analysis — for example, dispatching 3 readers simultaneously to process slides, textbook, and past exams. Add `context: fork` to a skill's frontmatter when you want it to run as a subagent.

---

## MCP servers worth installing

Three MCP servers dramatically improve the study workflow. Install only what you'll actually use.

**1. Anki MCP Server** — Export flashcards directly to Anki for spaced repetition. The `ankimcp/anki-mcp-server` (npm: `@ankimcp/anki-mcp-server`) is the most feature-complete, supporting deck creation, card scheduling, and review sessions. The `arielbk/anki-mcp` adds quiz sessions and performance analytics. Install via:
```bash
claude mcp add --transport stdio anki -- npx -y @ankimcp/anki-mcp-server
```
Requires AnkiConnect plugin running in Anki. This closes the loop: Claude generates flashcards → pushes to Anki → you review on your phone with real spaced repetition scheduling.

**2. Filesystem MCP** — Already built into Claude Code. Gives Claude access to read your course PDFs, PPTX files, and notes. No additional installation needed, but be aware of context limits: for large document collections (>20K tokens), consider using the `pdf-mcp` server by Kevin Tan, which reads specific pages on demand instead of loading entire PDFs.

**3. Obsidian MCP** (optional) — If you take notes in Obsidian, `StevenStavrakis/obsidian-mcp` (npm: `obsidian-mcp`) gives Claude direct access to your vault without requiring Obsidian to be running. Useful for pulling in your handwritten lecture notes as additional context.

**Skip for now**: Notion MCP adds complexity without proportional benefit for cramming. Google Calendar MCP is useful for scheduling but not for content generation. The `NotebookLM MCP` (`alfredang/notebooklm-mcp`) is interesting for podcast-style review but adds a dependency on Google's service.

---

## The five-pass cramming workflow

This is the core workflow. Each pass builds on the previous one. Run them in sequence over your cramming period.

### Pass 1: Diagnose (Day 1, first 30 minutes)

Drop all your course materials into `materials/` and run:

```
/diagnose
```

This reads everything, cross-references past exams with lecture content, and produces `generated/diagnosis.md`. **Review this output carefully** — it tells you where to focus. Update CLAUDE.md with any corrections about your comfort level and weak areas.

### Pass 2: Plan (Day 1, next 15 minutes)

```
/studyplan 5
```

Where `5` is days until the exam. This produces an hour-by-hour schedule in `generated/studyplan.md` that interleaves topics, enforces spacing, and protects sleep. Print this or pin it somewhere visible.

### Pass 3: Generate flashcards and study materials (Days 1-3)

Work through topics in priority order from the study plan:

```
/flashcards signal-transduction
/flashcards enzyme-kinetics
/flashcards gene-regulation
```

For concepts you find confusing:

```
/explain "MAP kinase cascade"
/explain "Michaelis-Menten kinetics vs allosteric regulation"
```

After generating flashcards, push them to Anki if you have the MCP server configured:

```
Push all flashcards from generated/flashcards/ to an Anki deck called "BIO301-Final".
Use basic and cloze card types. Tag each card with its topic and Bloom's level.
```

### Pass 4: Practice exams (Days 3-5)

```
/mockexam 1
```

Take the mock exam under timed conditions *on paper* (close your laptop). Then come back and check answers:

```
I scored approximately 70% on mock exam 1. Here are the questions I got wrong:
[list them]. Analyze my errors — are they from specific topics, specific
Bloom's levels, or specific question types? Update my weak spots analysis.
```

Then:

```
/mockexam 2-focus-weak
```

This generates a second exam weighted toward your weak areas.

### Pass 5: Weak-spot remediation loop (Days 4-6)

```
/weakspots
```

This identifies remaining gaps. Then run targeted flashcard generation for each gap:

```
/flashcards [weak-topic-1]
/flashcards [weak-topic-2]
```

**Repeat the mockexam → weakspots → flashcards cycle** until you're consistently scoring above 85% on practice exams or you run out of time. The night before the exam, do one final light review of your highest-weight flashcards, then sleep.

---

## Example prompts that are actually good

These are literal prompts you can paste into Claude Code. They are specific, constrained, and grounded.

**Diagnostic prompt (if not using the skill)**:
```
Read every file in materials/slides/ and materials/past-exams/. For each past
exam, extract every question and classify it by: (1) topic, (2) Bloom's
taxonomy level, (3) question format. Then cross-reference with the slide
content to produce a frequency-weighted topic priority list. Which 8 topics
have the highest expected exam weight based on both lecture emphasis and past
exam frequency? Output to generated/diagnosis.md.
```

**High-quality flashcard generation prompt**:
```
Read materials/slides/lecture-18-signal-transduction.pptx. Generate 25-35
atomic flashcards following these strict rules:
- ONE fact per card, answer 1-15 words max
- Prefer cloze format: "The ___ receptor activates the ___ pathway"
- NO list questions, NO yes/no, NO "describe" prompts
- Tag each card: [Remember], [Understand], [Apply], or [Analyze]
- Include source slide number on every card
- For each signaling pathway: one card per step, noting what comes before/after
- Include 5 cards at Apply level: "If mutation X occurs in protein Y,
  what downstream effect would you predict?"
Output as markdown to generated/flashcards/signal-transduction-flashcards.md
```

**Mock exam with distractor analysis**:
```
Based on the topic weights in generated/diagnosis.md and the question style
from materials/past-exams/midterm-2025.pdf, generate a 40-question MCQ
practice exam covering Chapters 8-14. For EACH question:
- Write a clear stem that tests one specific concept
- Create 4 options where all distractors are plausible
- Mark the correct answer
- Explain in 1 sentence why each distractor is wrong (common misconception
  it exploits)
- Tag with Bloom's level and source topic
Match the difficulty distribution of the past midterm. Save to
generated/mock-exams/mock-exam-01.md
```

**Socratic explanation prompt**:
```
I'm confused about enzyme kinetics. Without just giving me definitions,
walk me through it like this:
1. Start with the simplest possible analogy
2. Then build up to the actual Michaelis-Menten equation step by step
3. Draw a verbal picture of what the Lineweaver-Burk plot looks like and
   what each axis/intercept tells you
4. Explain the THREE most common mistakes students make on exam questions
   about enzyme kinetics (based on materials/past-exams/)
5. Give me 3 practice questions at Apply level where I have to calculate
   or predict, with worked solutions
Use ONLY content from materials/slides/ and materials/textbook/ — cite
specific slides and pages.
```

**Weak-spot interrogation prompt**:
```
I think I understand gene regulation but I'm not confident. Test me:
Generate 10 rapid-fire questions about gene regulation, starting easy
(define terms) and getting progressively harder (predict outcomes of
mutations, compare prokaryotic vs eukaryotic regulation). Do NOT show
me the answers until I respond to each question. After I answer all 10,
grade me ruthlessly and identify the specific sub-topics where my
understanding broke down. Then generate 10 targeted flashcards for
exactly those weak sub-topics.
```

---

## Adapting existing Claude Code projects for studying

Several open-source projects provide ready-made infrastructure worth examining.

The **learn-faster-kit** (`hluaguo/learn-faster-kit`) already implements an exam-prep mode with FASTER methodology (Forget, Act, State, Teach, Enter, Review), spaced repetition scheduling, and teach-back exercises. It's designed for technical skill learning but its architecture — particularly its `/learn` slash command and progress tracking — can be adapted for academic courses.

The **fluent** project (`m98/fluent`) implements SM-2 spaced repetition, flashcard drills, and session tracking within Claude Code. While built for language learning, its spaced repetition engine and hook-based progress tracking system are directly transferable.

The **psantanna academic workflow** (`pedrohcgs/claude-code-my-workflow`) is the most sophisticated Claude Code academic setup publicly available — 10 specialized agents, 22 skills, quality gates with 80/90/95 scoring, and adversarial review patterns. Its critic-fixer loop (two agents argue until "APPROVED" or 5 rounds max) is an excellent pattern for validating flashcard and exam quality.

For the VoltAgent subagent patterns, the `research-analyst` template provides the best foundation for the diagnostic pass, while the `search-specialist` pattern is useful for finding specific information across large document sets. Both follow the consistent YAML frontmatter + phased workflow + tool restriction pattern that makes subagents predictable and safe.

The **DrCatHicks/learning-opportunities** skill deserves special mention — it's an academically-grounded Claude Code skill that uses retrieval practice, spaced repetition, and semi-worked examples from your own project work, with direct citations to Karpicke, Bjork, Ericsson, and Dunlosky.

---

## A quality rule that should always be loaded

Place this in `.claude/rules/flashcard-quality.md` so it applies whenever Claude works with flashcard files:

```yaml
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

## Why this system works when time is short

The cognitive science converges on a clear message: **what you do with your study time matters far more than how much time you spend**. Re-reading for 20 hours produces less retention than 8 hours of self-testing with spacing (Roediger & Karpicke, 2006; Dunlosky et al., 2013). The testing effect is largest at moderate delays — exactly the 2–7 day window before a typical exam.

This system exploits that asymmetry. By using Claude Code to automate the laborious parts (extracting content, generating flashcards, creating practice exams, diagnosing coverage gaps), you reclaim all your time for the high-value activity: **actually retrieving information from memory**. The AI handles generation; you handle recall. That division of labor is precisely what the research supports — the Harvard RCT showed AI tutoring works when it's designed to force active engagement rather than passive consumption.

The multi-pass workflow also addresses the metacognitive problem. Students who cram by re-reading suffer from fluency illusions — the material feels familiar, so they believe they know it (Koriat & Bjork, 2005). The `/weakspots` skill and mock exam workflow force confrontation with actual knowledge gaps. You can't fool a practice exam the way you can fool yourself re-reading highlighted notes.

Finally, the system is designed to be **incremental and interruptible**. Each pass produces a saved artifact. If you only have 3 hours instead of 20, run `/diagnose`, `/flashcards` on the top 3 topics, and one `/mockexam`. That focused burst, grounded in the diagnosis of what matters most, will outperform undirected cramming on everything.

---

## Essential references and links

**Learning science papers**:
- Roediger & Karpicke (2006). "Test-Enhanced Learning." *Psychological Science*, 17(3), 249–255
- Cepeda et al. (2006). "Distributed Practice in Verbal Recall Tasks." *Psychological Bulletin*, 132(3), 354–380
- Dunlosky et al. (2013). "Improving Students' Learning With Effective Learning Techniques." *Psychological Science in the Public Interest*, 14(1), 4–58
- Bjork & Bjork (2011). "Making Things Hard on Yourself, But in a Good Way." *Psychology and the Real World*, 56–64
- Rohrer & Taylor (2007). "The Shuffling of Mathematics Practice Problems Boosts Learning." *Instructional Science*, 35, 481–498
- Koriat & Bjork (2005). "Illusions of Competence in Monitoring One's Knowledge." *JEPLMC*, 31, 187–194
- Diekelmann & Born (2010). "The Memory Function of Sleep." *Nature Reviews Neuroscience*, 11(2), 114–126
- Kestin et al. (2025). "AI Tutoring Outperforms Active Learning." *Scientific Reports*, 15, 17458
- Stadler et al. (2024). "Cognitive Ease at a Cost." *Computers in Human Behavior*, 160, 108386

**Flashcard methodology**:
- Wozniak, P. (1999). "Twenty Rules of Formulating Knowledge" — supermemo.com/en/blog/twenty-rules-of-formulating-knowledge
- Nielsen, M. (2018). "Augmenting Long-term Memory" — augmentingcognition.com/ltm.html
- Matuschak, A. (2020). "How to Write Good Prompts" — andymatuschak.org/prompts/

**Claude Code documentation**:
- Skills: code.claude.com/docs/en/skills
- Subagents: code.claude.com/docs/en/sub-agents
- Memory (CLAUDE.md): code.claude.com/docs/en/memory
- MCP servers: code.claude.com/docs/en/mcp
- Best practices: code.claude.com/docs/en/best-practices
- Prompt engineering: docs.anthropic.com/en/docs/build-with-claude/prompt-engineering

**GitHub repositories**:
- VoltAgent/awesome-claude-code-subagents — 100+ subagent templates across 10 categories
- hesreallyhim/awesome-claude-code — Curated skills, hooks, agents, plugins list
- hluaguo/learn-faster-kit — AI learning coach with spaced repetition for Claude Code
- m98/fluent — Language learning kit with SM-2 spaced repetition
- pedrohcgs/claude-code-my-workflow — Academic Claude Code workflow (psantanna)
- DrCatHicks/learning-opportunities — Research-grounded learning skill
- ankimcp/anki-mcp-server — Anki integration via MCP
- arielbk/anki-mcp — Conversational Anki integration with quiz sessions