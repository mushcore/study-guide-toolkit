---
id: 4915-topic-special-parameters
title: Special parameters — exam essentials
pillar: tech
priority: high
chapter: Mod04 Ch9
source: "Mod04 Ch9; materials/past-exams/midterm.md Q59, Q60; Lab 9"
bloom_levels: [remember, understand, apply]
related: [4915-topic-shell-scripting-essentials, 4915-topic-quoting-rules, 4915-topic-redirection-pipes, 4915-topic-job-control-process-mgmt]
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

> **Pitfall**
>
> `$10` without braces parses as `$1` followed by the literal `0` — so `./s a b c d e f g h i j; echo $10` prints `a0`, not `j`. Use `${10}` for args ≥ 10. Same trap with `$@` unquoted: bare `$@` word-splits embedded whitespace inside arguments — *always* write `"$@"`.

> **Takeaway**: Nine special parameters: `$0`, `$1..$9`, `${10}+`, `$#`, `"$@"`, `"$*"`, `$?`, `$$`, `$!`. Memorize them verbatim — the exam asks about `"$@"` vs `"$*"` every time. Rule: you almost always want `"$@"`.
