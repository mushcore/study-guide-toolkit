---
id: 4915-topic-quoting-rules
title: Quoting rules
pillar: tech
priority: high
chapter: Mod04 Ch9
tags:
  - shell
---

| Form | What expands | Example |
| --- | --- | --- |
| `'...'` | nothing (literal) | `echo '$HOME'` → `$HOME` |
| `"..."` | $, $(), `\\`cmd\\``, \\\\ | `echo "$HOME"` → path |
| none | all 7 expansions incl glob | `echo $HOME` → path (also word-splits) |
| `\` | escape single char | `echo \$HOME` → `$HOME` |

Backslash at end of line escapes the newline — continue long command on next line.
