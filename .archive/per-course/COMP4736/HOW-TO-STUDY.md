# HOW TO STUDY — COMP 4736 Final (Tue Apr 21, 2026)

3 days. Closed book. 4 core topics + Semaphore. You barely know the material. This file tells you exactly what to do.

Open `generated/exam-study/index.html` in your browser.

---

## 1. HTML package flow — do this in order

1. **Dashboard** — scan the 3-day panic plan, know the format.
2. **Priorities** — read the HIGH priority list. Internalize "Memory is 6/8 of the practice exam."
3. **Lessons 1 → 10** — read sequentially. These teach from zero. Do the "Check yourself" prompts before revealing.
4. **Flashcards** — 105 cards. Filter by topic. Go through IPC/Sem → Deadlock → Memory. Mark Known / Unknown.
5. **Quiz Replay** — the 8 past-exam questions with full solutions. Memorize these patterns.
6. **Mock Exam** — 33 questions, timed. Try 90 minutes.
7. **Code / Applied Practice** — drill the computational patterns.
8. **Cheat Sheet** — morning-of-exam review. NOT for learning.

### Active engagement rules
- **Write on paper.** Do the paging arithmetic by hand, not in your head.
- **Attempt before revealing.** No peeking at solutions until you have SOMETHING written.
- **Speak out loud.** "Page zero maps to frame two, so the physical base is 8192."
- **Time yourself** on Q2, Q8, and Q5. Goal: 8 minutes each.

### Keyboard shortcuts (Flashcards section)
- `←` / `→` — prev / next card
- `space` — flip card
- `k` — mark known
- `u` — mark unknown

---

## 2. Available slash commands

Commands you can invoke in Claude Code within this directory:

| Command | Use for |
|---|---|
| `/graphify` | Re-extract the knowledge graph from `materials/` |
| `/caveman` | Talk to Claude in ultra-compressed mode (saves tokens while studying) |
| `/caveman-commit` | Commit notes to git if you track your prep |
| `/init` | Regenerate the CLAUDE.md for this course |

If Claude offers you `/diagnose`, `/flashcards`, `/explain`, `/mockexam`, `/weakspots` — they may not exist. Fall back to direct prompts below.

---

## 3. Direct prompts to Claude

### Drill mode
- `Quiz me on paging. Give me 5 MCQs modeled after past-exam Q1 and Q3. Don't reveal answers until I respond.`
- `Generate 3 new fit-algorithm problems like past-exam Q2 with fresh hole sequences.`
- `Give me 3 resource allocation graphs. I'll build the C/R/E matrices.`

### Explanation mode
- `Explain Peterson's solution using an analogy a 10-year-old would get.`
- `Walk me through past-exam Q7 step by step, but explain WHY each step matters.`
- `When does best fit fail but worst fit succeed? Concrete example.`

### Generation mode
- `Create a 2-level page table scenario with 8-bit VA, 3/3/2 split. Give me 3 virtual addresses to translate.`
- `Generate a buddy system sequence of 5 operations on 2048 KB memory, min 64 KB.`

### Analysis mode
- `Here is my answer to mock exam Q14: [paste]. What did I get wrong and why?`
- `Review my notes on deadlock recovery — what did I miss?`

### Weakness mode
- `I keep confusing TLB soft miss and hard miss. Re-explain with a decision tree.`
- `Based on my wrong answers so far, what topic am I weakest on?`

---

## 4. Graphify commands

The knowledge graph is in `graphify-out/`. Query patterns:

```bash
graphify query "what connects paging to IPC?"
graphify query "why does mmap appear in both IPC 2 and Memory?" --dfs
graphify explain "Semaphores (Named and Unnamed)"
graphify path "Peterson's Solution" "TSL (Test-and-Set Lock)"
```

After the query runs, Claude will navigate by graph structure instead of keyword matching.

---

## 5. Claude Code niceties

- `@materials/past-exams/Final_exam_practice.pdf` — directly reference a file in a prompt.
- `/model` — switch model if runs feel slow.
- `#remember X` — Claude saves X to memory for future sessions.

---

## 6. Minimum viable 3-day study plan (Apr 18–20)

You have ~2–3 hours/day. Here's the plan if you only do this.

### Day 1 — Sat Apr 18 (today) · 3 hrs
- **0:00–0:30** — Read Dashboard + Priorities + Instructor Intel.
- **0:30–1:30** — Lessons 1 (race conditions), 2 (semaphores), 3 (mutex spectrum), 6 (Coffman), 7 (matrix detection).
- **1:30–2:15** — Flashcards: all IPC1/Sem + Deadlock. Mark unknowns.
- **2:15–3:00** — Past-exam Q5 (C/R/E matrix) on PAPER. Redo until correct in under 10 minutes.

### Day 2 — Sun Apr 19 · 3 hrs
- **0:00–1:00** — Lessons 8 (paging), 9 (allocation), 10 (replacement + formula).
- **1:00–1:30** — Flashcards: Memory/Paging + Memory/Alloc.
- **1:30–2:30** — Past-exam Q1, Q3, Q4, Q7 on PAPER. Time each.
- **2:30–3:00** — Lessons 4 (IPC 1) and 5 (IPC 2). Flashcards: IPC2.

### Day 3 — Mon Apr 20 · 3 hrs
- **0:00–1:30** — Mock Exam in the HTML. Timed 90 min.
- **1:30–2:15** — Review wrong answers. Re-drill their topics.
- **2:15–2:45** — Past-exam Q2 (fits) and Q8 (buddy tree) on PAPER.
- **2:45–3:00** — Cheat Sheet skim. Sleep 7+ hours.

### Day 4 — Tue Apr 21 (exam day)
- Wake early. Eat. 30-min cheat-sheet skim. Laptop charged. Calculator + blank paper + pencil packed. Arrive 15 min early.

---

## 7. Panic-mode prompt

Paste this into Claude if time's short and you need to know what to skip:

> I have only 2 hours before the COMP 4736 final. I've read the dashboard. Give me ONLY the 5 things most likely to appear, in order. For each: a 2-sentence refresher, one worked example, and one flashcard question I should be able to answer in under 30 seconds. Skip everything else.

---

## One final rule

**The tools don't pass exams. Active engagement does.**

Write on paper. Say things out loud. Attempt before revealing. Time yourself. Review misses.

Go.
