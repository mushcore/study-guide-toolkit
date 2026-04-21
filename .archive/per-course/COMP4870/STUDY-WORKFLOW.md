# Study Workflow — Step by Step

## Phase 1: Setup (do once per course, ~15 min)

### Step 1 — Create the course folder
```
mkdir -p ~/BCIT/CST/TERM4/COMP4XXX
cd ~/BCIT/CST/TERM4/COMP4XXX
```

### Step 2 — Dump all your raw files in
Throw everything you have into this folder — slides, PDFs, past exams,
syllabus, textbooks, lab handouts, screenshots, notes. Don't organize
anything yet. Just get it all in one place.

### Step 3 — Let Claude organize it
Open Claude Code in the course folder and give it the setup guide:

```
@COURSE-SETUP-GUIDE.md

I have a pile of unorganized course files in this folder. Here's my exam info:
- Course: [code] — [name]
- Exam date: [date]
- Exam format: [MCQ / written / essay / etc.]
- Topics: [list them]
- Allowed materials: [open/closed book, calculator, etc.]
- My comfort level: [honest assessment]
- Study time: [hours/day for N days]

Set everything up.
```

Claude will:
- Sort files into `materials/slides/`, `materials/past-exams/`, etc.
- Create all 6 skills, the agent, and the quality rule
- Write your CLAUDE.md with exam details and constraints
- Create the `generated/` folder structure

### Step 4 — Build the knowledge graph
In Claude Code, run:
```
/graphify ./materials --no-viz
```

This sends your materials through graphify and produces:
- `graphify-out/graph.json` — the raw knowledge graph
- `graphify-out/GRAPH_REPORT.md` — god nodes, communities, surprising connections

### Step 5 — Install the always-on hook
In your **terminal** (not Claude Code):
```bash
graphify claude install
```

This wires up a PreToolUse hook so every time Claude searches your files,
it reads the graph summary first. All your skills get smarter automatically.

---

## Phase 2: Initial Analysis (do once, ~30 min)

### Step 6 — Run the diagnosis
```
/diagnose
```

Claude reads every slide, past exam, and syllabus page. Produces
`generated/diagnosis.md` with:
- Topic inventory ranked by exam weight
- High-leverage topics (what to study first)
- Question style analysis (what the prof actually asks)
- Past exam patterns

**Read this file.** It's the map for everything that follows.

### Step 7 — Generate your study plan
```
/studyplan
```

Produces a day-by-day schedule in `generated/studyplan.md` with specific
time blocks, topic interleaving, break schedules, and milestone checkpoints.

**Print this or keep it open.** Follow it daily.

---

## Phase 3: Daily Study Loop (repeat until exam day)

Follow your study plan. Each day, use these commands as needed:

### Learn new topics
```
/explain [concept]
```
Deep multi-level explanation grounded in your course materials.
Includes self-test questions and elaborative interrogation prompts.

For graph-powered exploration, also try in terminal:
```bash
graphify query "how does [concept A] relate to [concept B]?"
```

### Generate flashcards
```
/flashcards [topic]
```
Produces atomic, source-tagged flashcards following SuperMemo 20 Rules.
Review them the same day and again 1-2 days later.

### Take practice exams
```
/mockexam [number-or-focus]
```
Generates a realistic exam matching your professor's format and difficulty.
Take it under timed conditions, then check the worked solutions.

---

## Phase 4: Mid-Study Checkpoints (every 3-4 days)

### Find your blind spots
```
/weakspots
```
Analyzes what you've studied vs. what you haven't. Produces a self-test
and remediation plan. **Do the self-test honestly before looking at answers.**

### Generate cross-topic synthesis questions
```
/flashcards synthesis
```
Uses the knowledge graph to generate questions that connect concepts across
multiple topics — the kind of questions that show up on essay and
short-answer sections.

---

## Phase 5: Final Push (last 2-3 days before exam)

1. Run `/weakspots` one more time to see remaining gaps
2. Run `/mockexam final` for a full-length practice exam under timed conditions
3. Review missed questions from all mock exams
4. Re-do flashcards for any topics where recall is shaky
5. Sleep 7+ hours the night before

---

## When new materials arrive mid-semester

If your professor posts new slides or practice problems:

1. Drop the new files into the appropriate `materials/` subfolder
2. In Claude Code: `/graphify ./materials --update --no-viz` (re-extracts only new/changed files)
3. Optionally re-run `/diagnose` or `/weakspots` to update priorities

---

## Quick Reference

| What you want | Command | Where |
|---|---|---|
| Organize raw files | Give Claude the setup guide | Claude Code |
| Build knowledge graph | `/graphify ./materials --no-viz` | Claude Code |
| Wire up always-on hook | `graphify claude install` | Terminal |
| Analyze all materials | `/diagnose` | Claude Code |
| Get a study schedule | `/studyplan` | Claude Code |
| Learn a concept | `/explain [concept]` | Claude Code |
| Make flashcards | `/flashcards [topic]` | Claude Code |
| Cross-topic flashcards | `/flashcards synthesis` | Claude Code |
| Practice exam | `/mockexam [N]` | Claude Code |
| Find weak spots | `/weakspots` | Claude Code |
| Quick graph lookup | `graphify query "..."` | Terminal |
| Update after new files | `/graphify ./materials --update --no-viz` | Claude Code |
