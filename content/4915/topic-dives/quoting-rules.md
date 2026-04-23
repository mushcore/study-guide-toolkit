---
id: 4915-topic-quoting-rules
title: Quoting rules
pillar: tech
priority: high
chapter: Mod04 Ch9
source: "Mod04 Ch9; materials/past-exams/midterm.md Q17, Q47"
tags:
  - shell
related: [4915-topic-shell-expansions-7-types-in-order, 4915-topic-command-precedence-order, 4915-topic-redirection-pipes]
---

| Form | What expands | Example |
| --- | --- | --- |
| `'...'` | nothing (literal) | `echo '$HOME'` → `$HOME` |
| `"..."` | $, $(), `\\`cmd\\``, \\\\ | `echo "$HOME"` → path |
| none | all 7 expansions incl glob | `echo $HOME` → path (also word-splits) |
| `\` | escape single char | `echo \$HOME` → `$HOME` |

Backslash at end of line escapes the newline — continue long command on next line.

> **Pitfall**
>
> Single quotes cannot contain a single quote — not even with `\'`. The fix is either concatenation (`'it'\''s'`) or swap to double quotes (`"it's"`) or use bash's `$'…'` ANSI-C quoting (`$'it\'s'`). Midterm essays test this — writing `'can\'t'` loses marks.

> **Takeaway**: Single quotes are literal. Double quotes expand `$`, `` ` ``, `$(…)`, and `\`. Bare words fire all seven expansions. When in doubt, quote with double quotes and `$"…"` strings — they preserve whitespace while still allowing variable substitution.
