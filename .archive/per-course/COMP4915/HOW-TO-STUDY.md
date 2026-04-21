# HOW-TO-STUDY — COMP 4915 Final

**Exam**: Thursday April 23, 2026, 13:30–15:30, SW01 3190. Bruce Link. Cumulative Mod01–Mod10E.
**Package**: `generated/exam-study/index.html` — single-file interactive. Open in browser.
**Study window**: ~5 days until exam. ~1–2 hrs/day target.

---

## 1. HTML package flow

Order of engagement (don't skip):

1. **Dashboard** — countdown + format + instructor intel. Orient.
2. **Priorities** — decide what to cut if time runs short.
3. **Lessons (from 0)** — 11 sequential lessons. Work them top to bottom. Mark done.
4. **Quiz Replay** — Highest ROI. Bruce told the class past quiz questions may reappear. Do Quiz 3, Quiz 4, and the midterm COLD — no notes.
5. **Flashcards** — ~160 cards. Daily 20–40 cards. Mark known/unknown honestly.
6. **Topic Deep-Dives** — reference after basics land. Use the filter buttons.
7. **Applied Practice** — write solutions on paper BEFORE clicking reveal.
8. **Mock Exam** — take ONCE you have 60%+ confidence. Time it. Self-grade against reveals.
9. **Cheat Sheet** — morning of exam only. Print (Ctrl+P) if allowed materials permit.

**Active engagement rules:**
- Say answers out loud before flipping a flashcard.
- Write scripts on paper before clicking reveal.
- For MCQ, predict the trap before reading options.
- Re-take Quiz Replay on consecutive days until you get 100% cold.

**Keyboard shortcuts (Flashcards section):**
- Left/Right arrow — navigate
- Space — flip
- k — mark known
- u — mark unknown

---

## 2. Available slash commands (if installed via skills)

| Command | When to use |
|---|---|
| `/diagnose` | Re-run diagnosis — identifies gaps across all materials. Use once. |
| `/flashcards <topic>` | Generate new flashcards for a weak topic (e.g. `/flashcards iptables`). |
| `/explain <concept>` | Deep multi-level explanation using elaborative interrogation + dual coding. |
| `/mockexam [topic]` | Generate a full or topic-focused practice exam with worked solutions. |
| `/studyplan` | Regenerate time-allocated plan based on current weak spots. |
| `/weakspots` | Analyze progress — identify weak areas and produce targeted remediation. |

---

## 3. Direct prompts to Claude

### Drill mode
- "Quiz me on special parameters until I get 5 in a row right."
- "Give me 10 MCQ on iptables chain order and targets. Grade me."
- "Read my flashcard progress from localStorage notes and drill me on the unknown ones for shell scripting."

### Explanation mode
- "Explain the pause container in a Kubernetes pod using an analogy I haven't heard before."
- "Walk me through exactly what happens during the 7 shell expansions when I type `echo ~/{a,b}_$USER.txt`."
- "Why does hard linking across filesystems fail? Derive it from inode mechanics."

### Generation mode
- "Generate a YAML pod spec where the QoS is Burstable, then explain why."
- "Write a bash function that takes 2 args and returns their sum — THEN rewrite it as a C function. Show both. Highlight the formal-parameters difference."
- "Create an iptables ruleset that allows only SSH from 10.0.0.0/8 and HTTP/HTTPS from anywhere."

### Analysis mode
- "Read past-exams/midterm.md and tell me which topics got tested twice or more."
- "Compare my current flashcard completion vs. the topic weights in diagnosis.md — where am I behind?"
- "Given Bruce said 'quiz questions may reappear', rank the Quiz 3 and Quiz 4 questions by probability of appearing verbatim on the final."

### Weakness mode
- "Give me 5 progressively harder MCQ on the 8 Linux namespaces — I kept getting TIME wrong."
- "Generate T/F questions with subtle distinction traps for redirection and quoting."
- "Make me write an essay comparing NIS and LDAP, then grade my response against the rubric."

---

## 4. Graphify commands

`graphify-out/GRAPH_REPORT.md` already exists. Use the knowledge graph:

- `graphify query "what connects pause container to cgroups"` — traverse graph hop-by-hop
- `graphify query "..." --dfs` — trace specific path
- `graphify explain "Kubelet"` — everything connected to a concept
- `graphify path "Pod" "etcd"` — exact path between two concepts

Inside Claude Code use the `/graphify` skill. In a raw terminal, `graphify query "..."` works if on your PATH.

God nodes you should be fluent on (11+ edges): Kubernetes, Kubelet, cgroups, Pod. These bridge multiple topic communities — mastering them pays off across question types.

---

## 5. Claude Code niceties

- **@file references** — drop files into context: `@materials/past-exams/midterm.md summarize the essay questions`.
- **Model switching** — `/model opus` for deep thinking, `/model sonnet` for speed, `/model haiku` for drill quizzing.
- **Session management** — `/clear` resets context between study topics; `/resume` if you closed without saving progress.
- **Read a PDF page range** — "Read pages 80–152 of @materials/past-exams/Comp4915 Review.pdf and extract K8s review points."
- **Run commands without permission prompt** — add patterns to `.claude/settings.json` with the `/less-permission-prompts` skill.

---

## 6. Minimum viable study plan (5 days to exam)

You have ~10 hours total. Budget each session hard.

### Day 1 (today, Apr 18) — 2 hrs
- 15 min · Lessons 1–4 (fundamentals, shell, quoting/redirection)
- 45 min · Flashcards: fundamentals + shell topics (≈60 cards)
- 30 min · Quiz Replay: Quiz 3 (bash scripting) cold
- 30 min · Topic Deep-Dives: Expansions + Command precedence + Quoting

### Day 2 — 2 hrs
- 15 min · Lessons 5 (scripting), 11 (exam craft)
- 30 min · Applied Practice: problems 1, 2, 3 (write on paper)
- 30 min · Flashcards: shell + shell params
- 45 min · Quiz Replay: midterm Q1–30 cold

### Day 3 — 2 hrs
- 15 min · Lesson 6 (sysadmin) + Lesson 7 (networking)
- 45 min · Topic Deep-Dives: run levels, /etc/passwd, SSH tunneling
- 30 min · Flashcards: sysadmin + network
- 30 min · Quiz Replay: midterm Q31–60 + sample midterm

### Day 4 — 2 hrs
- 30 min · Lesson 8 (NIS/NFS/Samba/LDAP) + Lesson 9 (DNS/iptables/Apache)
- 45 min · Topic Deep-Dives: all `network` pillar topics
- 45 min · Flashcards: network pillar

### Day 5 (night before Apr 22) — 2 hrs
- 45 min · Lesson 10 (Kubernetes) — read slowly, twice
- 45 min · Quiz Replay: Quiz 4 cold, then review every explanation
- 30 min · Cheat Sheet skim + unknown-only flashcards

### Morning of Apr 23 — 30 min
- 15 min · Cheat Sheet (print if allowed)
- 15 min · Glance at 8 namespaces, QoS classes, special parameters, run levels, expansion order
- Eat. Hydrate. Arrive 10 min early.

### Mock Exam
- Take ONCE, ideally Day 4 evening or Day 5 afternoon. Time it. Self-grade. Use results to focus Day 5.
- If you score < 60% on auto-graded portion: extend Day 5 to cover weakest topics. Skip Cheat Sheet printing.

---

## 7. Panic mode prompt

If you have under 3 hours before the exam, paste this into Claude:

> "3 hours to exam. I need the highest-ROI drill possible for COMP 4915. Read @generated/exam-study/research-mod10ce-review.md and @materials/past-exams/comp4915_quiz4.md first. Then: (1) Quiz me verbatim on Quiz 3, Quiz 4, and the 15 most likely midterm questions to reappear. (2) Drill me on the 8 Linux namespaces, QoS classes, special parameters, run levels, expansion order, and command precedence. (3) Make me write one bash function and one C function side-by-side. (4) Give me a compressed cheat sheet at the end. No explanation unless I ask. Fire questions one at a time, grade me, move on."

Or even shorter, if you can't paste that:

> "Emergency cram — drill me on COMP 4915 final using @generated/exam-study/research-*.md. 30 MCQ, then grade. Go."

---

## One last rule

**The tools don't pass exams. Active engagement does.**

Write on paper. Say answers out loud. Attempt before revealing. Time yourself. Review misses. Sleep 7+ hours Wednesday night.
