# Exam Study Package — Drop-in Prompt

Copy the entire block below. Paste into Claude Code inside any course directory that has a `CLAUDE.md`. No edits needed.

Claude auto-discovers course metadata, exam date, materials, and instructor intel from the existing `CLAUDE.md`. Then builds the interactive study package.

---

## 📋 PROMPT — copy everything below this line

Create a comprehensive ALL-IN-ONE interactive exam study package for this course. MAX EFFORT. If I fail this exam, I fail the course.

### Step 0 — Auto-discover course context

Read these files to understand what course this is and what I need to study:

1. `CLAUDE.md` at the project root — has course code, exam date, format, instructor intel, priorities, my learning level, material locations
2. Any other `.md` files at root (e.g. `MASTER-STUDY-PLAN.md`, `README.md`, `SYLLABUS.md`)
3. List `materials/` subdirectories — slides, textbook, past-exams, notes, labs, syllabus, resources
4. Check `generated/` for prior work (diagnosis.md, studyplan.md, flashcards)
5. Check `graphify-out/GRAPH_REPORT.md` if exists — has knowledge graph with connections
6. Verify the skeleton exists: `ls /Users/kevinliang/BCIT/CST/TERM4/skeleton.html` (required for Step 4)

**Do not ask me for any information.** Everything needed is in `CLAUDE.md` or discoverable from `materials/`. If something is truly missing, make a reasonable default and flag it in your final summary.

### Step 1 — Calibrate from past exams

If `materials/past-exams/` exists, read every past exam/quiz carefully:
- Extract question style, distractor patterns, marks distribution, recurring topics
- Identify which annotations / formulas / concepts repeat
- Note instructor's "traps" (fake option names, subtle nuances, absolute T/F statements)
- This calibrates the mock exam you'll generate

If instructor intel is in `CLAUDE.md` (e.g. "quiz questions reappear from same bank," "topic X NOT on final"), treat as gospel.

### Step 2 — Plan with TodoWrite

Before coding, write a plan with TodoWrite. Track progress through every section.

### Step 3 — Dispatch parallel research agents

Use the `Agent` tool with `subagent_type: "Explore"`. Max 6 agents per dispatch. Group PDFs by topic area.

Each agent extracts from its assigned PDFs:
- Topic summaries (3-5 sentences plain language)
- Key concepts with 1-sentence definitions
- All annotations / formulas / syntax / acronyms verbatim
- Lifecycle diagrams / state machines / flowcharts described
- Code / equation / diagram examples
- 10-15 flashcards per topic following SuperMemo 20 Rules (atomic, unambiguous, cloze preferred, source tagged)
- Exam traps + common pitfalls
- 5-10 practice questions mirroring past exam question style

Each agent writes to `generated/exam-study/research-[topic].md`.

**No hallucination.** If something isn't in the materials, DO NOT invent it. Training data ≠ source material.

### Step 4 — Build the single-file interactive HTML

Location: `generated/exam-study/index.html`. Fully self-contained. Opens directly from filesystem.

#### ⚠️ CRITICAL — Use the pre-built skeleton, don't write from scratch

A reusable skeleton exists at `/Users/kevinliang/BCIT/CST/TERM4/skeleton.html` (~46 KB, ~970 lines).

It contains everything COURSE-AGNOSTIC already built and tested:
- Full CSS (dark mode, lessons, flashcards, questions, cheat sheet, print styles)
- Sidebar nav with all 9 sections
- Section containers (Dashboard, Priorities, Lessons, Topics, Flashcards, Mock Exam, Quiz Replay, Code, Cheat Sheet)
- Complete JS app logic (countdown, study-time tracker, flashcard flip + filters + keyboard shortcuts, lesson renderer with "mark done" state, topic expand/collapse, mock exam timer + grading, quiz filter tabs, code practice reveal, cheat sheet grid)
- Empty `DATA` structure with `{{TEMPLATE_VARS}}` placeholders

**Your job is to COPY + FILL IN, not rebuild.**

#### Phase 1 — Copy skeleton + substitute course metadata

```bash
# 1. Copy skeleton to course's generated dir
mkdir -p generated/exam-study
cp /Users/kevinliang/BCIT/CST/TERM4/skeleton.html generated/exam-study/index.html
```

Then use `Edit` (with `replace_all: true`) to substitute each `{{VAR}}` placeholder:

| Placeholder | Example value | Source |
|---|---|---|
| `{{COURSE_CODE}}` | `COMP 4736` | CLAUDE.md |
| `{{COURSE_TITLE}}` | `Operating Systems 2` | CLAUDE.md |
| `{{INSTRUCTOR}}` | `Jane Smith` | CLAUDE.md (or blank) |
| `{{EXAM_DATE_ISO}}` | `2026-04-21T15:30:00-07:00` | CLAUDE.md — ISO 8601 with timezone |
| `{{EXAM_DATE_HUMAN}}` | `Tue Apr 21 · 15:30 · SW05 1850` | CLAUDE.md |
| `{{EXAM_WEIGHT}}` | `30%` | CLAUDE.md |

Use `replace_all: true` on each — placeholders appear in multiple spots (HTML + JS DATA.meta).

#### Phase 2 — Inject content via Edit (one per data array)

The skeleton has empty arrays with comment markers. Each marker is UNIQUE — use it as your `old_string`:

```javascript
// === DATA.meta.dashboardStats (populated by Edit) ===
DATA.meta.dashboardStats = [];
```

Replace with populated content. Example:

```
Edit(
  file_path: "generated/exam-study/index.html",
  old_string: `// === DATA.flashcards (populated by Edit) ===
DATA.flashcards = [];`,
  new_string: `// === DATA.flashcards ===
DATA.flashcards = [
  {id:'t1_01', topic:'...', pillar:'...', bloom:'Remember', source:'Slide 5', q:'...', a:'...'},
  // 100+ cards
];`
)
```

**Edit sequence (one per array):**

1. `DATA.meta.dashboardStats` — 4 stat tiles `{label, value, sub, id?}`
2. `DATA.meta.formatTable.rows` — exam format rows `{type, count, marksea, total, notes}` (keys are lowercase, no spaces)
3. `DATA.meta.instructorIntel` — array of HTML strings (bullet list items)
4. `DATA.meta.extraPanels` — optional extra dashboard panels `{title, html}` (or leave empty array)
5. `DATA.priorities` — `{high: [{title, why}], low: [{title, why}], table: {headers, rows}}`
6. `DATA.lessons` — 8-12 lessons `{n, title, hook, html}`
7. `DATA.flashcards` — 100+ cards `{id, topic, pillar, bloom, source, q, a}`
8. `DATA.topics` — 15+ topics `{pillar, priority, chapter, title, html}`
9. `DATA.mockExam` — 30+ questions `{type, marks, topic, question, choices?, answer, explanation, template?}`
10. `DATA.quizzes` — object shape: `{ quiz1: [...], quiz2: [...] }`
11. `DATA.codePractice` — 5+ problems `{title, prompt, starter, solution, explanation}`
12. `DATA.cheatSheet` — 15-20 blocks `{title, body}` (body is HTML string)

**If an array is too large for one Edit** (>15 KB payload), split it:
- First Edit: replace `= [];` with `= [ /* first half */ ];`
- Second Edit: replace the `];` of the first chunk with `, /* second half */ ];`
- Use enough surrounding context to make the second `old_string` unique.

#### Why this saves tokens

- Skeleton reuse: ~46 KB of CSS + JS + HTML structure NEVER regenerated
- Each Edit transmits only the diff (not the whole file)
- Course-specific content becomes ~60-150 KB of data injection
- Total file ends up 100-200 KB — but Claude only authors 50-150 KB of new content per course

#### Data shapes — see skeleton file for exact reference

Open `/Users/kevinliang/BCIT/CST/TERM4/skeleton.html` and search for `DATA.` to see every expected shape inline. The render functions document the contract.

#### Design system

- **Dark mode forced.** Background `#0a0a0a`, panel `#121212`, panel-2 `#181818`, border `#262626`, text `#e5e5e5`, text-dim `#a3a3a3`, text-faint `#737373`
- **One accent color** — soft blue `#7aa2f7`. Avoid rainbows.
- **Status colors** only where semantic: ok `#9ece6a`, bad `#f7768e`, warn `#e0af68`
- **Fonts:** system sans (`-apple-system, BlinkMacSystemFont, Inter, Segoe UI`), monospace for code (`ui-monospace, SF Mono, Menlo`)
- **No emojis in the UI.** No heavy animations. No gradients beyond subtle overlays.
- **Sidebar nav + main content** layout. Scrollable main area.
- **Print-friendly cheat sheet** — `@media print { aside { display: none } }`
- Professional. Do not over-style.

#### Required sections (sidebar nav, in this order)

1. **Dashboard**
   - Live exam countdown (updates every 30s, parses datetime from CLAUDE.md)
   - Exam format breakdown table (marks per question type)
   - Instructor intel panel (HIGH / LOW priority list from CLAUDE.md)
   - Study time tracker (seconds accumulated in localStorage, shown as "Xh Ym")
   - "How to use this package" guidance

2. **Priorities**
   - Two panels side-by-side: HIGH priority (study first) vs LOW priority (skip if tight)
   - Data-driven: cite question count from past exams as evidence
   - Table of topic → past-exam-Q-count → pattern → study depth

3. **Lessons (from 0)**
   - 8-12 first-principles narrative lessons teaching concepts from scratch
   - Each lesson has: hook (why care), main explanation with analogies in highlighted boxes, takeaway callout, 1-2 click-to-reveal "Check yourself" questions, mark-as-done button
   - Lesson nav buttons at top show current / done / todo state (green for done, via localStorage)
   - Lessons build sequentially. Earlier lessons introduce vocabulary later ones use.
   - Active voice. "You write a class. The container wires it up." Not "A class is written."
   - Use real course terminology. Don't paraphrase into generic speak.

4. **Topic Deep-Dives**
   - 15+ expandable/collapsible topics
   - Filter buttons by pillar (if course has natural divisions)
   - Badges: HIGH / LOW priority, pillar tag, chapter reference
   - Content: annotations tables, code examples, rules, exam traps
   - Denser than Lessons — for reference after you understand basics

5. **Flashcards**
   - Minimum 100 cards. More if course is broad.
   - CSS flip animation on click
   - Filter by topic AND by known/unknown
   - Keyboard shortcuts: arrows to navigate, space to flip, k for known, u for unknown
   - Shuffle + Reset buttons
   - localStorage persists known/unknown state
   - Each card: `{id, topic, pillar, bloom (Remember|Understand|Apply|Analyze), source (slide N or Ch X), q, a}`
   - Answers can contain formatted HTML (code inline, strong, tables, pre)
   - Bloom's distribution target: 30% Remember, 30% Understand, 25% Apply, 15% Analyze+

6. **Mock Exam**
   - Timed. Duration matches real exam from CLAUDE.md.
   - Question count + marks distribution matches real exam format
   - Types: MCQ (5 choices, auto-graded), T/F (auto-graded), Short Answer (self-graded with model answer reveal), Essay (self-graded with outline reveal), Code/Applied (self-graded with solution reveal)
   - Start button → timer runs → submit → auto-graded score + written self-estimate + every question reveals correct answer with explanation
   - Show score panel at top with breakdown: auto-graded total / written estimate

7. **Quiz Replay**
   - Every past exam question extracted verbatim, with correct answer + distractor analysis + explanation
   - Tabs per quiz/exam
   - Same UI as Mock Exam but for reviewing, not timed
   - Bruce (or any instructor) often reuses questions — this is the highest-ROI section

8. **Code / Applied Practice** (if course has coding/math component)
   - 5+ practice problems
   - Each: prompt, starter template, textarea to type in, reveal-on-click solution, explanation with grading checklist
   - Problems should cover the most-tested applied patterns from past exams

9. **Cheat Sheet**
   - 15-20 blocks in CSS grid layout (`grid-template-columns: 1fr 1fr`)
   - Each block: title + compact body (lists, tables, formulas)
   - Print-friendly (`@media print`)
   - For morning-of-exam review only — not for learning

#### Data structure

```javascript
const DATA = {
  lessons: [{n, title, hook, html}],
  flashcards: [{id, topic, pillar, bloom, source, q, a}],
  topics: [{pillar, priority, chapter, title, html}],
  mockExam: [{type, marks, topic, question, choices, answer, explanation, template?}],
  quizzes: { [quizId]: [/* same shape as mockExam */] },
  codePractice: [{title, prompt, starter, solution, explanation}],
  cheatSheet: [{title, body}]
};
```

#### Interactive JS

- Vanilla JS, no frameworks
- Nav switches sections without page reload (show/hide via class toggle)
- localStorage keys: `{course}_fc` (flashcards), `{course}_lessons_done`, `{course}_study_seconds`
- Mock exam timer uses `setInterval`, alerts when time is up
- Keyboard shortcuts work only when the matching section is active
- All render functions called once on `DOMContentLoaded`

### Step 5 — Write companion HOW-TO-STUDY.md

At course root. 7 sections:

1. **HTML package flow** — ordered workflow, active engagement rules, keyboard shortcuts
2. **Available slash commands** — document each available skill (`/diagnose`, `/flashcards`, `/explain`, `/mockexam`, `/studyplan`, `/weakspots`) with a table of use cases
3. **Direct prompts to Claude** — five modes (drill, explanation, generation, analysis, weakness) with 3 example prompts each
4. **Graphify commands** — if `graphify-out/` exists, document `graphify query`, `graphify explain`, `graphify path`
5. **Claude Code niceties** — @ file references, model switching, session management
6. **Minimum viable study plan** — time-blocked plan using the study hours stated in CLAUDE.md, day by day
7. **Panic mode prompt** — one-liner to paste if time's short

### Step 6 — Verify before finishing

```bash
# Parse the JS
cd generated/exam-study && node -e "
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
try { new Function(scripts); console.log('JS parses OK'); }
catch(e) { console.log('SYNTAX ERROR:', e.message); process.exit(1); }
"
```

If syntax error → fix it before declaring done.

### Step 7 — Honest assessment (final message)

At the end, tell me:

1. **Pass probability with ONLY this file** — realistic % range for a student with my stated level from CLAUDE.md. Be brutal.
2. **What the file CAN'T teach** — essays, novel application, intuition, writing (be specific).
3. **What I should supplement with** — specific textbook chapters, lecture recordings, paper practice, etc.
4. **Minimum engagement required** — what I actually need to DO (not just read) to reach passing grade.
5. **Time-blocked plan** — using hours from CLAUDE.md, what order to hit sections.

Do not sugarcoat.

### Hard constraints

- **Parallel agents** — max 6 per dispatch. Batch if needed.
- **Single HTML file.** All CSS + JS + data embedded. No fetch. Opens from filesystem.
- **Use the skeleton.** Do NOT rewrite CSS/JS from scratch. `cp /Users/kevinliang/BCIT/CST/TERM4/skeleton.html generated/exam-study/index.html`, substitute `{{VARS}}`, inject data via Edit. See Step 4.
- **One data array per Edit.** If an array is itself too large (15+ KB), split into head + tail Edits using unique marker strings.
- **Verify after each Edit** — Edit tool returns success but the file should still parse. Run `node -e` syntax check after the last Edit.
- **Minimum content** — 100+ flashcards, 15+ topics, 30+ mock exam questions, 8+ lessons. Scale up for broad courses.
- **All content from materials only.** No hallucination. No training-data facts.
- **Course-specific vocabulary.** Use what the slides use.
- **No emojis in HTML UI.** Sparingly in HOW-TO-STUDY.md.
- **File size target:** 100-300 KB. Flag if it exceeds.
- **Verify JS parses** before done.

### Deliverables

1. `generated/exam-study/index.html` — interactive study package
2. `generated/exam-study/research-*.md` — raw research files (working output, can stay)
3. `HOW-TO-STUDY.md` at course root — usage guide
4. Final reply: honest pass-probability + engagement plan

Go.

---

## 🛠 How to use this template

### One-time setup per course

```bash
cd /path/to/COURSE_DIRECTORY
claude
```

Verify your `CLAUDE.md` at the course root has:
- **Exam details block** (course code, instructor, date/time, format, room, weight)
- **Source materials block** (what's in `materials/`)
- **Instructor intel** (if known — emphasis, trap areas, skip areas, quiz-reuse policy)
- **My learning context** (comfort level, weak areas, study time available)
- **Generated output location** (usually `generated/`)

If `CLAUDE.md` lacks some of these, Claude will make reasonable defaults and flag them in its final summary. You can rerun with an updated CLAUDE.md.

### Per-course usage

1. `cd` into course directory
2. Paste the PROMPT block (everything between "📋 PROMPT" and "## 🛠 How to use this template")
3. Wait 5-15 minutes
4. Open `generated/exam-study/index.html`
5. Read `HOW-TO-STUDY.md`

---

## 💡 Making the output better

**Past exams in `materials/past-exams/`** drive calibration quality. The more past exams, the better the mock exam will match real format.

**Instructor review slides** (if provided near exam) are often 70-80% of the final. Reference them by filename in `CLAUDE.md` as "HIGH priority source."

**Quiz .md files** (not PDFs) are easier for agents to extract verbatim. If you have PDFs of quizzes, convert to MD first (OCR if needed).

**Lecture recordings** — transcribe and drop in `materials/notes/`. Instructor emphasis ("this will be on the final") is gold.

---

## 🔧 If course has unusual format

Append to the PROMPT before Step 3:

- **Math-heavy course** (OS, networking, quant): "Include a Formulas section in the cheat sheet. Mock exam must include numerical computation with step-by-step solutions. Add worked examples to each lesson."
- **No code component** (pure theory/conceptual): "Replace Code/Applied Practice section with Scenario Analysis — give me situations, I pick the right concept or apply the right principle."
- **Open-book / cheat-sheet-allowed**: "Optimize the Cheat Sheet section for printing on 8.5×11 (2 sides max). Pack it dense but readable."
- **Oral exam component**: "Add a Teach-Back section — prompts for 2-minute verbal explanations of core concepts."

---

## 🎯 "Done" verification checklist

After Claude says it's finished, verify:

1. Open `generated/exam-study/index.html` in browser
2. All sidebar sections load without console errors
3. Flashcards flip and save known/unknown state
4. Mock exam timer starts, auto-grades MCQ on submit
5. Lessons have analogies (not just summaries) and checkpoints reveal
6. Topic deep-dives have real code/tables from YOUR materials (not generic)
7. Quiz replay matches YOUR actual past exams verbatim
8. Cheat sheet is print-friendly (Ctrl+P looks OK)
9. `HOW-TO-STUDY.md` references YOUR course code, not a template

If anything fails: "Fix [specific issue]." — Claude iterates.

---

## One final rule

**The tools don't pass exams. Active engagement does.**

Write on paper. Say things out loud. Attempt before revealing. Time yourself. Review misses.

Go.
