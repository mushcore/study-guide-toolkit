---
id: 4915-topic-redirection-pipes
title: Redirection + pipes
pillar: tech
priority: high
chapter: Mod01 Ch5
tags:
  - redirection
  - shell
---

| Symbol | Effect |
| --- | --- |
| `>` | stdout → file (overwrite, no warning) |
| `>>` | stdout → file (append) |
| `<` | file → stdin |
| `2>` | stderr → file |
| `&>` | both stdout+stderr → file |
| `2>&1` | merge stderr INTO stdout |
| `|` | stdout(cmd1) → stdin(cmd2) |
| `tee` | stdout AND file |

**Order trap:** `cmd > f 2>&1` works (redirect stdout, then merge stderr into it). `cmd 2>&1 > f` does NOT — stderr goes to terminal, only stdout goes to f.

```bash
# Midterm Q50 setup:
$ cat x y 1>hold 2>&1
# cat x fails → stderr message merged into stdout → hold
# cat y succeeds → "This is y" → hold
$ cat hold
cat: x: No such file or directory
This is y
```
