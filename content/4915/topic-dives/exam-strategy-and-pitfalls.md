---
id: 4915-topic-exam-strategy-and-pitfalls
title: Exam strategy and top pitfalls
pillar: tech
priority: high
chapter: Exam strategy
source: "materials/past-exams/midterm.md + comp4915_quiz3.md + comp4915_quiz4.md; materials/slides/Mod{01-10}*.pdf"
bloom_levels: [remember, understand, apply]
tags:
  - exam-prep
  - strategy
related: [4915-topic-quoting-rules, 4915-topic-redirection-pipes, 4915-topic-permissions-chmod-umask, 4915-topic-inode-hard-vs-soft-links, 4915-topic-boot-sequence-run-levels-memorize, 4915-topic-exam-study-priorities-apr-17]
---

Midterm was 144 marks in 100 minutes — that's 1.4 marks/minute. The final follows the same cadence. Every minute spent on exam craft beats another minute re-reading a slide deck, because the exam tests *recognition and recall under time pressure*, not deep reasoning.

## Time allocation

The midterm mark scheme: 2 marks per MCQ, 1 mark per T/F, 3 marks per SHORT, 10 marks per ESSAY. The final mirrors that. Budget by marks-per-minute.

| Type    | Marks each | Rough count | Time budget |
|---------|------------|-------------|-------------|
| MCQ     | 2          | ~37         | ~50 min (80 s each) |
| T/F     | 1          | ~10         | ~5 min (30 s each) |
| SHORT   | 3          | ~7          | ~20 min (3 min each) |
| ESSAY   | 10         | ~3          | ~20 min (7 min each) |
| Buffer  | —          | —           | ~5 min |

Essays are the highest-leverage block — skip one and you lose as much as nine MCQs. Never blank an essay; a rough structure scores 5–6/10.

## Part-1 vs Part-2 strategy

No split — it's one continuous 100-minute block. Your only choice is order.

Recommended order:

1. **MCQ first** (~50 min). Warm up on easy ones. Flag 3–4 hard ones and move on.
2. **T/F** (~5 min). Quick confidence. Always guess — 1 mark for 30 seconds is the best ROI on the exam.
3. **SHORT** (~20 min). Command syntax, grep/find/tar, regex. These are facts, not reasoning.
4. **ESSAY** (~20 min). Outline first (2 min), then flesh out. 7 min each.
5. **Return to flagged MCQs** in the final minutes.

If you hit 60 minutes and are still on MCQ, you're too slow — move to SHORT immediately and come back to hard MCQs last.

## Top 5 pitfalls

Ranked by appearance count in midterm + quiz3 + quiz4.

### 1. Quoting — single vs double vs bare (midterm Q17, Q47)

Single quotes: literal, no expansion. Double quotes: `$var`, `` `cmd` ``, `$(cmd)`, `\` expand. Bare: all 7 expansions fire.

Drill:

```bash
person=jenny
echo '$person'   # → $person    (literal)
echo "$person"   # → jenny      (expanded)
echo $person     # → jenny      (expanded, plus word-splitting + glob)
```

> **Pitfall**: `'don\'t'` does NOT escape. Single quotes can't contain a single quote even with a backslash. Use `"don't"` or `$'don\'t'`.

### 2. Redirection order — `>file 2>&1` ≠ `2>&1 >file` (midterm Q10, Q50)

`2>&1` duplicates the *current* binding of fd 1. If stdout hasn't been redirected yet, `2>&1` sends stderr to the terminal, not the file.

```bash
cmd >out 2>&1    # both stdout and stderr → out
cmd 2>&1 >out    # stdout → out; stderr → terminal (order wrong)
```

> **Pitfall**: Redirection binds descriptors left-to-right at the moment of each redirect. `2>&1` copies fd 1's *current* destination, not "wherever stdout ends up eventually".

### 3. `chown -R` (capital R), not `-r` (midterm Q16)

Every other recursive tool uses lowercase `-r` (grep, cp, ls). `chown` and `chgrp` use capital `-R`. Lowercase `-r` is not a valid flag — the command errors out.

### 4. Runlevel 3 vs 5 (midterm Q35)

Both are multi-user. The only difference is the UI:

- Runlevel 3 = multi-user, text mode. Default for servers.
- Runlevel 5 = multi-user, graphical (X11). Default for desktops.
- Runlevel 0 = halt; 1 = single-user rescue; 6 = reboot.

`systemctl get-default` shows the current target (`multi-user.target` = RL3, `graphical.target` = RL5).

### 5. Hard vs soft links (midterm Q24, Q32, Q58 essay)

Hard link shares the inode → cannot cross filesystems → survives original deletion (link count > 1 keeps the inode alive).

Soft link stores a pathname as data → can cross filesystems → dangles if the target is deleted. `ls -l` shows `lrwxrwxrwx` regardless of the target's perms.

> **Pitfall**: Permissions on a symlink are meaningless — the link always shows `lrwxrwxrwx`. The effective permissions are the target's.

## When to skip and return

- **MCQ** stuck >1 minute → flag, move on. Return in the last 10 minutes.
- **T/F** always guess. 1 mark for 30 seconds is the best trade on the exam.
- **SHORT** write partial even if unsure. 1 mark > blank.
- **ESSAY** never fully blank. Outline for 2 minutes, write for 5. Even rough prose scores 5–6/10.

Specific triage:

- `$@` vs `$*` questions → hard under pressure; skip first pass, return fresh.
- Grep flag combinations (`-w`, `-v`, `-n`, `-i`) → lookup items, skip if blank.
- Exact file locations (e.g. "which daemon manages NIS?") → skip if not obvious.

## Exam-day order

1. Scan all questions (~2 min).
2. Easy MCQs.
3. T/F (fast while warm).
4. Medium MCQs.
5. SHORT.
6. ESSAY — 7 min each, outline first.
7. Hard/skipped MCQs.
8. Proofread, fill any remaining blanks.

> **Example** — first 30 minutes of the 100-minute block
>
> 1. **0:00-0:02** Scan all pages. Note essay topics (e.g. "hard vs soft links"). Brain queues them up while you do MCQ.
> 2. **0:02-0:05** First 4 easy MCQs: command names, file locations. Bank 8 marks fast.
> 3. **0:05-0:15** T/F — 10 questions in 10 minutes, never blank. 1-mark ROI in 30 s each beats grinding on a hard MCQ.
> 4. **0:15-0:18** Essay outlines — spend 1 minute per essay jotting a three-bullet spine. Flesh out later; brain keeps chewing in the background.
> 5. **0:18-0:30** Middle MCQs. Stuck > 1 min → mark with a star, move on. Do not let a 2-mark MCQ steal 5 minutes.
> 6. At 0:30 you should have ~20 MCQs done, all T/F done, essay skeletons sketched. That's ~35 marks locked in.
> 7. Derail sign: still on MCQ at 0:45 → jump to SHORT immediately. Hard MCQs come last, not never.

> **Takeaway**: The exam rewards finishing over perfection. Budget by marks-per-minute, skip stuck MCQs, never blank an essay. Know the five pitfalls cold: quoting single/double/bare, redirection order, `chown -R`, runlevel 3 vs 5, and hard-vs-soft link semantics. Recite them the morning of.
