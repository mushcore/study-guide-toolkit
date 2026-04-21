# COMP 4870 — How to Study (7 days to exam)

Target: 55-60% pass. Strategy: breadth over depth. Six other exams compete for time — be ruthless.

Open [generated/exam-study/index.html](generated/exam-study/index.html) in a browser. Study everything inside it. Use this file as the operating manual.

---

## 1. HTML package flow

Use the sections in this order:

1. **Dashboard** — count-down, exam format, instructor intel. Read once, come back for motivation.
2. **Priorities** — which topics are worth the most marks. Refer whenever time is tight.
3. **Lessons (from 0)** — 11 sequential lessons teaching from scratch. Start here if lost.
4. **Topic Deep-Dives** — 15 topics, each with verbatim code patterns. Reference after Lessons.
5. **Flashcards** — 126 cards. Daily 10-min sessions are non-negotiable.
6. **Mock Exam** — 35 questions matching the real format. Do ONE timed 60-min sitting a day before the exam.
7. **Quiz Replay** — the actual midterm (with answers). These question styles repeat.
8. **Code Practice** — 5 coding scenarios with model solutions.
9. **Cheat Sheet** — 18 dense blocks. Source material for your HAND-WRITTEN 8.5×11 cheat sheet.

**Active engagement rules:**
- Every lesson: tap "Mark done" only after you can re-explain the takeaway out loud.
- Every flashcard: attempt before revealing. Rate known/unknown honestly.
- Every mock question: write the answer before clicking reveal.
- Every code problem: type into the textarea. Don\'t just read the solution.

**Keyboard shortcuts (flashcard view):**
- `←` / `→` — previous / next card
- `Space` — flip
- `k` — mark known
- `u` — mark unknown

---

## 2. Available slash commands

These live in `~/.claude/skills/` and work inside any course directory:

| Command | When to use |
|---|---|
| `/diagnose` | Scan all materials for topic breakdown + question patterns |
| `/flashcards <topic>` | Generate more atomic flashcards on one weak topic |
| `/explain <concept>` | Multi-level explanation with analogies |
| `/mockexam <topic>` | Extra practice exam on one topic |
| `/studyplan` | Rebuild the study schedule |
| `/weakspots` | Find the topics you keep missing |

Example usage:
```
/flashcards ML.NET
/explain "why IMemoryCache fails in web farm"
/mockexam gRPC
```

---

## 3. Direct prompts to Claude (when slash commands aren\'t enough)

### Mode: drilling
```
Drill me on <topic> — 10 rapid MCQ, 5 choices each, no explanations until I ask.
Use only materials in /materials. Tag each question with a slide or docx source.
```

### Mode: explanation
```
Explain <concept> using only the COMP 4870 materials.
Walk through the code from first principles.
Use a real-world analogy. Show what happens if we skip the step.
```

### Mode: generation
```
Generate 15 SuperMemo-style flashcards for <topic>.
Atomic, cloze-preferred, source-tagged. No lists. No yes/no.
```

### Mode: analysis
```
Compare <A> and <B> as they appear in the course materials.
One-sentence definition each. A table of key differences. When each is chosen.
```

### Mode: weakness probing
```
Pick the 3 most likely MCQ questions on <topic> that I\'d get wrong.
Show the trap. Explain why each distractor is tempting.
```

---

## 4. Graphify commands

The course has a knowledge graph at `graphify-out/`. Query it to find connections the slides don\'t make explicit:

```
graphify query "what connects Semantic Kernel to MCP?"
graphify explain "AIFunctionFactory"
graphify path "MLContext" "PredictionEngine"
graphify query "distributed caching Redis Aspire" --budget 400
```

God nodes (highest connected): `COMP 4870 Intranet Planning`, `SalesService`, `FinancialService`. Useful for architecture questions.

If you add new materials, refresh:
```
graphify ./materials --update
```

---

## 5. Claude Code niceties

- `@path/to/file` — inline reference a specific file in your prompt
- `/model` — switch between Sonnet/Opus/Haiku mid-session
- `/clear` — reset context when it gets crowded
- `claude --resume` — continue an earlier session
- `/compact` — compress history to keep more room for actual work

---

## 6. Minimum viable study plan (7 days: Fri Apr 17 → Fri Apr 24)

You have 5 other exams in this window. Be realistic. Here\'s the MVP.

| Day | Other commitments | COMP 4870 blocks | Specific work |
|---|---|---|---|
| **Fri Apr 17** | (tonight) | 60 min | Open HTML. Read Lessons 1-3. 20 flashcards (AI). |
| **Sat Apr 18** | study day | 2 × 60 min | Lessons 4-6. All ML.NET flashcards. Read ML.NET + Cache topics. |
| **Sun Apr 19** | prep COMP 4911 | 60 min | Lessons 7-9. gRPC + TDD flashcards. |
| **Mon Apr 20** | **COMP 4911 exam AM** | 60 min PM | Lessons 10-11. File-based + Aspire flashcards. |
| **Tue Apr 21** | **COMP 4736 exam PM** | 60 min before + 60 min after | Morning: review Mock Exam MCQs 1-15. Evening: 16-35. |
| **Wed Apr 22** | **LIBS 7102 exam AM** | 90 min PM | Full Mock Exam TIMED. Grade. Review every miss. |
| **Thu Apr 23** | **COMP 4915 exam PM** | 60 min AM + 45 min PM | Topics deep-dive reading. Write cheat sheet draft 1. |
| **Fri Apr 24 AM** | **COMP 4870 @ 10:30** | 45 min | Cheat sheet final. Morning-of checklist. Cheat Sheet section one last read. |

**Hard rules:**
- Fri night before: in bed by 11pm. No new material.
- Sleep ≥7 hours. Cramming past midnight costs more than it earns.
- No new topic in the last 4 hours. Only review known material.

---

## 7. Panic mode (if time is gone)

If you have under 2 hours total before the exam:
```
I have <X> hours before COMP 4870. Target: 55% pass.
Read generated/exam-study/index.html and tell me:
1) The 20 highest-ROI flashcards to drill right now
2) The 3 most likely coding-question templates to memorize
3) What to WRITE on the hand-written cheat sheet (8.5×11 both sides)
```

Paste into Claude. Execute the output. Don\'t second-guess.

---

## Final rule

**The package doesn\'t pass the exam. Active engagement does.**

Write on paper. Say it out loud. Attempt first, reveal second. Time yourself.
