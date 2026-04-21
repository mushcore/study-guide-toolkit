# COMP 4915 — Special Topics in MIS (UNIX, Linux, Kubernetes) — Exam Cramming System

## Exam details
- **Course**: COMP 4915 — Special Topics in MIS (BCIT CST Diploma)
- **Instructor**: Bruce Link
- **Exam date/time**: Thursday, April 23, 2026, 13:30–15:30 @ SW01 3190
- **Exam format**: **COMPREHENSIVE** final exam. Format similar to midterm: MCQ (2 marks each) + True/False (1 mark each) + Short Answer (3 marks each) + Essay (10 marks each). Midterm was 100 minutes, 144 marks, worth 20%.
- **Topics covered**: ALL course content (Mod01-Mod10E) — Linux fundamentals, file system & utilities, networking, Bash shell, system administration, SSH/FTP, Sendmail/NIS/LDAP/NFS/Samba, DNS/iptables/Apache, shell programming, Containers/Pods/Kubernetes. **Cumulative — midterm topics WILL reappear.**
- **Earlier topics (may appear)**: Basic command line, file permissions, process management, redirection/pipes
- **Allowed materials**: TBD — check with instructor

## Topic breakdown by module
1. **Mod01** — Introduction, Shell (Ch 1, 4, 5): Linux history, GNU, overview, Fedora/RHEL, shell basics
2. **Mod02** — File System & Utilities (Ch 6, 7): filesystem hierarchy, file commands, utilities (grep, find, wc, tr, etc.)
3. **Mod03** — Networking & Basic Services (Ch 8): networking fundamentals, basic network services
4. **Mod04** — Bourne Again Shell (Ch 9): bash scripting, variables, quoting, control structures
5. **Mod05** — System Admin Core (Ch 10, 11): system administration, user management, processes
6. **Mod06** — Admin Tasks, SSH, FTP (Ch 15, 18, 19): administrative tasks, SSH tunneling, FTP/SFTP
7. **Mod07** — Sendmail, NIS/LDAP, NFS, Samba (Ch 20-23): mail services, directory services, network file sharing
8. **Mod08** — DNS, iptables, Apache (Ch 24-26): domain name system, firewall rules, web server
9. **Mod09** — Shell Programming (Ch 28): advanced bash scripting, functions, control flow
10. **Mod10** — Containers & Kubernetes (A-E): containers, pods, cgroups, CNI networking

## Instructor intel (from Bruce — 2026-04-17 review session)

### Grading / strategy
- **Exam is cumulative** — midterm topics can reappear.
- **Review the labs** — explicitly called out as high-value study material.
- **Quiz questions may reappear on the final** — look at all past quiz questions in case he asks the same ones again.
- Normal questions + a few edge cases planted to catch inattention. "Anything you don't know is a hard question regardless."
- **Students tend to fail big-picture questions** because they get stuck in details and can't assemble the whole. Practice connecting topics, not just memorizing.
- Worth going through all of his lecture examples if you have time / already have the basics down.

### In-scope / emphasis
- **grep with `*`** — know how to use it (globbing vs regex distinction is a common trap).
- **Special parameters** — know the list he gave and the differences between them (e.g., `$0`, `$#`, `$@`, `$*`, `$?`, `$$`, `$!`).
- **Function precedence** — know it (how the shell resolves function vs alias vs builtin vs external command).
- **All shell expansions are fair game** — brace, tilde, parameter, command substitution, arithmetic, word splitting, pathname.
- **System run levels** — know them.
- **C vs bash functions distinction** — exam *will* have you write a C function. Key point: **C functions have formal parameters (shown in the function signature); bash functions take arguments via `$1`, `$2`, etc., but do NOT declare formal params in the definition.** Understand why.
- **Scripting line breaks matter** — bash newline handling is not like C. Don't forget this when writing/reading scripts.

### De-prioritize / low-ROI
- **History of Linux/UNIX** — only a vague idea needed (order of events, major milestones). No deep dates.
- **Access controls** — don't need the details.
- **pushd / popd** — conceptual understanding only. He will NOT ask you to write a script using them.
- **No hard scripting questions on the final** — know the syntax and be able to read/write basic scripts, but don't stress over advanced scripting gymnastics.
- **fstab** — know the basics only. **No need** to memorize mount options, `dump`, or `fsck` fields.

## Source materials
All source materials live in `materials/`. Do NOT generate content from your
training data — ONLY from these files:
- `materials/slides/` — 14 module lecture PDFs (Mod01-Mod10E) covering all course topics + 12 chapter PPTX files (ch01-ch12) from the textbook
- `materials/past-exams/` — prior assessments:
  - `midterm.md` — actual midterm exam (MCQ/T-F/short answer/essay)
  - `Comp4915MidtermSamp.PDF` — sample midterm
  - `Comp4915 Review.pdf` — final exam review slides
  - `comp4915_quiz3.md`, `comp4915_quiz4.md` — quizzes. **Bruce suggested the same questions may reappear on the final — review them.**
- `materials/syllabus/` — COURSEOUTLINE (course outline PDF)
- `materials/labs/` — Lab1-Lab10 (Linux labs) + Windows Lab 1-3 with Activities
- `materials/notes/` — OnlineVirtualClassrooms.pdf, Table of Contents.html
- `materials/resources/` — dns.zip (DNS configuration examples)
- `materials/code-examples/` — extracted code example projects (unzipped from resources)

## Generated output location
All generated study materials go in `generated/`. Use descriptive filenames
with topic prefixes (e.g., `linux-commands-flashcards.md`, `dns-iptables-flashcards.md`).

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
7. SOURCE TAGS: Every card must include source reference (e.g., "Mod03 Slide 12"
   or "Ch8 p.195").
8. OPTIMIZE WORDING: Trim every unnecessary word. Shorter = faster review.
9. USE IMAGERY CUES: Where relevant, describe a visual or reference a diagram
   from the source material.
10. CONNECT TO KNOWLEDGE: Add brief "why it matters" or "connects to" notes
    for elaborative encoding.

### Question generation rules
- Match the exam format: MCQ (2pts), T/F (1pt), short answer (3pts), essay (10pts)
- Include worked-example solutions for all practice problems
- Weight topic coverage by professor emphasis and past exam frequency
- Include "distractor analysis" for MCQ — explain why wrong answers are wrong
- Shell scripting questions should require writing actual commands/scripts
- System admin questions should test practical knowledge (config files, daemon management)

### Study plan rules
- Always allocate sleep (>=7 hours the night before the exam)
- Space sessions across available days with ~1-day gaps
- Interleave topics within sessions
- Front-load high-weight and weakest topics
- Include specific retrieval practice activities, not just "review"

## My learning context
- **Current comfort level**: Barely knows the material — essentially starting from scratch. Needs foundational exposure across Mod01-Mod10 before targeted drills make sense.
- **Known weak areas**: Everything — need diagnosis pass to find anchors. Likely weakest on: advanced system admin (Mod05-06), network services (Mod07-08), shell programming (Mod09), Kubernetes (Mod10)
- **Known strong areas**: None confirmed yet
- **Study time available**: 1-2 hours/day for ~12 days (April 8 to ~April 20)
- **Preferred study methods**: Mix of flashcards, practice exams, concept explanations
- **Strategy note**: With limited time and broad gaps, must ruthlessly prioritize by exam weight. Focus on the review slides first, then fill in from module lectures. Depth over breadth.

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
