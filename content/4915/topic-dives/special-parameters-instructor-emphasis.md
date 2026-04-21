---
id: 4915-topic-special-parameters-instructor-emphasis
title: Special parameters (INSTRUCTOR EMPHASIS)
pillar: tech
priority: high
chapter: Mod04 Ch9
tags:
  - shell
---

| Param | Means | Example |
| --- | --- | --- |
| `$0` | script/shell name | `./foo.sh` → $0=./foo.sh |
| `$1..$9` | positional args | `./s a b c` → $1=a $2=b |
| `${10}+` | args ≥10 need braces | — |
| `$#` | arg count | 3 in example above |
| `"$@"` | all args, SEPARATE words | `"a" "b" "c"` |
| `"$*"` | all args, ONE string | `"a b c"` |
| `$?` | last command exit | 0=ok non-zero=err |
| `$$` | shell PID | — |
| `$!` | last background PID | — |

**Exam pattern:** distinguishing `"$@"` vs `"$*"`. In `for x in "$@"`, each arg iterates separately. In `for x in "$*"`, one iteration with joined string.
