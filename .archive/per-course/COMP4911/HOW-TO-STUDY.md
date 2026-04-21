# How to Study — COMP 4911 Final

**Exam**: Mon Apr 20, 10:30 · SW05 2875 · 25% · comprehensive

You have two tools: the **interactive study package** (HTML) and **Claude Code** (this terminal). Use both.

---

## Part 1 — The HTML study package

Open `generated/exam-study/index.html` in a browser.

### Recommended flow (in order)

1. **Dashboard** (30 sec) — skim exam format + countdown
2. **Priorities** (3 min) — read HIGH + LOW lists. Know what to focus on.
3. **Lessons** — sections 1-10, in order. ~1 hour total.
   - Click every **checkpoint** question, attempt answer in your head, THEN reveal
   - Mark each lesson "done" when you can teach it back to yourself out loud
4. **Topic Deep-Dives** — skim only weak areas after lessons
5. **Flashcards** — filter "Unknown only" after first pass. Keyboard: `←→` navigate, `space` flip, `k` known, `u` unknown
6. **Quiz Replay** — Quiz 3, Quiz 4, Midterm. Memorize verbatim. Bruce: questions reappear.
7. **Code Annotation** — do all 5. Write on paper first, THEN compare.
8. **Mock Exam** — start timer. Do not peek. Grade after. Review every miss.
9. **Cheat Sheet** — morning-of only. Print with Ctrl+P.

### Active engagement rules

- Cover the answer with your hand before reading
- Write code on paper before looking at solutions
- Say concepts out loud ("a singleton is... one shared instance... with @Lock for concurrency...")
- Do the mock exam ONCE, properly timed. Don't waste it.

### Progress tracking

All progress saves to browser localStorage:
- Flashcards known/unknown state
- Lessons marked done
- Study time tracker (see Dashboard stat)

Clear with `localStorage.clear()` in browser DevTools if needed.

---

## Part 2 — Claude Code skills (slash commands)

Type `/` then the command in the Claude Code terminal. All tied to this project's materials.

| Command | What it does | When to use |
|---|---|---|
| `/diagnose` | Analyze course materials for topics, patterns, high-leverage areas | Already done — see `generated/diagnosis.md` |
| `/flashcards [topic]` | Generate SuperMemo-style atomic flashcards from specific materials | If you want MORE cards on a weak topic. e.g. `/flashcards JPQL` |
| `/explain [concept]` | Deep multi-level explanation (elaborative interrogation + dual coding) | When lesson didn't click. e.g. `/explain owning side` |
| `/mockexam [N]` | Generate a fresh practice exam matching exam format | If mock in HTML isn't enough. e.g. `/mockexam 2` |
| `/studyplan` | Generate time-allocated plan using spaced practice | Already done — see `generated/studyplan.md` |
| `/weakspots` | Identify weak areas, generate remediation materials | After mock exam. Tell it your wrong answers. |
| `/graphify` | Rebuild knowledge graph (won't need for exam prep) | — |

### Example slash command usage

```
/explain transaction attributes
/flashcards entity relationships
/mockexam
/weakspots
```

Each spawns a focused Claude session using ONLY the materials in this directory (no hallucination).

---

## Part 3 — Direct prompts to Claude Code

Plain English. Claude has access to all your materials (`materials/` folder) and won't invent content.

### Drill mode

```
Quiz me on EJB transaction attributes. One MCQ at a time. Wait for my answer before revealing.
```
```
Drill me on the 7 entity relationship types. Give me a scenario, I'll tell you the annotation, you grade me.
```
```
Show me 5 JPQL queries to write from scratch. Give me relationships and what to SELECT. I'll write. You grade.
```

### Explanation mode

```
Explain why the many side owns the FK in a 1:N relationship, from first principles.
```
```
What's the difference between persist() and merge() using a real example?
```
```
Walk me through the SFSB lifecycle step by step, like I've never seen it.
```

### Generation mode

```
Write 10 MCQ questions in Bruce's style on JPA inheritance. Include distractor analysis.
```
```
Generate a code annotation problem I haven't seen. Make it a 1:N bidirectional relationship between Book and Chapter.
```
```
Write a model answer to "How do use cases drive iteration planning?" — 10 mark essay.
```

### Analysis mode

```
Read materials/past-exams/comp4911_quiz4.md and tell me which topics repeat most.
```
```
Compare my notes on transaction attributes vs the review slides. What am I missing?
```
```
What's in Chapter 11 of the Rubinger textbook? Summarize in 10 bullet points.
```

### Weakness mode

```
I got these wrong on the mock: Q3, Q7, Q15. Diagnose my gap and drill me on it.
```
```
I can't remember the difference between @EmbeddedId and @IdClass. Teach me with a memorable example.
```

---

## Part 4 — Graphify (optional, for connecting topics)

A knowledge graph of the whole course was already built at `graphify-out/GRAPH_REPORT.md`. Useful for "big picture" questions Bruce warned about.

### Terminal commands

```bash
# Open graph visualization in browser
open graphify-out/graph.html

# Query the graph for connections
graphify query "how do transactions connect to session beans?"

# Trace the exact path between two concepts
graphify path "Use Case" "Entity"

# See everything connected to a concept
graphify explain "Entity Relationships"

# Cap output for focused answers
graphify query "what drives iteration planning?" --budget 500
```

### When to use graphify vs Claude

- **Claude direct** — concepts, explanations, drills (ask questions, get answers)
- **Graphify** — structural connections ("what depends on what?"), surprising links between topics

---

## Part 5 — Claude Code niceties

### Referencing files inline with @

```
@materials/slides/EJB17Transactions.pdf explain what I need to memorize
```
```
Compare @materials/past-exams/comp4911_quiz3.md with @materials/past-exams/comp4911_quiz4.md — which topics overlap?
```

### Model switching

- Default is Opus 4.7 (best for deep explanations, essays, planning)
- Toggle fast mode with `/fast` if you want quick recall drills (uses Opus 4.6, faster responses)

### Session management

```bash
# Start fresh session in this directory
cd /Users/kevinliang/BCIT/CST/TERM4/COMP4911
claude
```

The project's `CLAUDE.md` (at root) auto-loads with every session, so Claude always knows your exam date, priorities, and constraints.

---

## Part 6 — Minimum viable study plan (24-27 hrs)

If you do nothing else, do this. Ordered by priority.

### Tonight (Fri, ~4 hrs)
1. HTML → **Lessons 1-10** — read all, attempt every checkpoint
2. HTML → **Quiz Replay → Quiz 3** — read all 7 + explanations
3. Ask Claude: `/explain transaction attributes — table format with scenarios`

### Saturday (~10 hrs)
1. HTML → **Topic Deep-Dives** → all HIGH priority topics
2. HTML → **Flashcards** — two passes, use "Unknown only" filter on 2nd pass
3. HTML → **Code Annotation** — all 5 on paper first, then solutions
4. Ask Claude: `Drill me on 7 entity relationships. Scenario in → annotation out.`
5. HTML → **Quiz Replay → Quiz 4** — memorize all 23 answers cold
6. Write 10 JPQL queries from scratch (ask Claude for prompts)

### Sunday (~8 hrs)
1. HTML → **Mock Exam** — timed, no peeking, grade after
2. Ask Claude: `I got Q X, Y, Z wrong. Find my pattern of weakness and drill me.`
3. HTML → **Topic Deep-Dives** → weak areas from mock
4. Write 2 practice essays (UC-driven development; Transaction attribute comparison)
5. HTML → **Quiz Replay → Midterm** — SA/Essay/Code answers memorized
6. 11pm hard stop. Sleep.

### Monday morning (~2 hrs)
1. Coffee
2. HTML → **Cheat Sheet** only. Print if helpful.
3. HTML → **Flashcards** filtered to unknown
4. **No new material.** Walk to SW05 2875.

---

## Part 7 — What to tell Claude if you panic

```
I'm panicking. Exam is in N hours. I know X. Tell me what to drill right now for maximum marks per minute.
```

Claude will triage based on your current gap and Bruce's priority list. The answer is almost always: memorize Quiz 3 + 4, transaction attributes table, RUP phases, and ACID.

---

## Files index

| File | Purpose |
|---|---|
| `generated/exam-study/index.html` | **Main interactive study package** — start here |
| `generated/diagnosis.md` | Detailed topic analysis (from `/diagnose`) |
| `generated/studyplan.md` | 12-day Pomodoro plan (from `/studyplan`) |
| `MASTER-STUDY-PLAN.md` | 7-day all-4-courses plan |
| `CLAUDE.md` | Project context — auto-loaded by Claude Code |
| `materials/slides/` | 39 PDF lecture slides |
| `materials/textbook/` | 3 textbook PDFs |
| `materials/past-exams/` | Midterm + Quiz 3 + Quiz 4 |
| `graphify-out/GRAPH_REPORT.md` | Knowledge graph summary |

---

## One last reminder

**The tools don't pass exams. Active engagement does.**

- Write on paper
- Say things out loud
- Attempt before revealing
- Time yourself
- Review misses ruthlessly
- Sleep 7+ hours both nights

Go.
