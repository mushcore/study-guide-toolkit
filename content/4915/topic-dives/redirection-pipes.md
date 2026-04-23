---
id: 4915-topic-redirection-pipes
title: Redirection + pipes
pillar: tech
priority: high
chapter: Mod01 Ch5
source: "Mod01 Ch5; materials/past-exams/midterm.md Q10, Q43, Q44, Q50"
tags:
  - redirection
  - shell
related: [4915-topic-quoting-rules, 4915-topic-command-precedence-order, 4915-topic-grep-find-wc-tr-tee-sort, 4915-topic-special-parameters]
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

> **Pitfall**
>
> `cmd 2>&1 | tee log` merges stderr into the pipe — `tee` writes both streams. `cmd | tee log 2>&1` does **not** — stderr bypasses the pipe entirely because `2>&1` runs after `|` has already bound stdout to the pipe. Order of `|` and `2>&1` matters.

> **Example** — capture stdout and stderr separately, then merge, then tee
>
> 1. Separate: `cmd > out.log 2> err.log` — fd 1 → out.log, fd 2 → err.log.
> 2. Merge in file: `cmd > combined.log 2>&1` — fd 1 bound first, then fd 2 duplicates fd 1's binding.
> 3. Wrong merge: `cmd 2>&1 > combined.log` — `2>&1` fires with fd 1 still on the terminal, so stderr goes to terminal; stdout then goes to file. Exam Q10 trap.
> 4. Merge then tee both to screen + file: `cmd 2>&1 | tee combined.log` — pipe captures both streams because `2>&1` preceded `|`.
> 5. Check: `ls /nonexistent > /dev/null 2>&1; echo $?` → prints 2 (ls's exit), proving `$?` sees the left-of-pipe exit only when there's no pipe, and in pipelines reflects the *rightmost* command.

> **Takeaway**: `>`, `>>`, `<`, `|`, `2>`, `2>&1` — each binds or duplicates a file descriptor. Redirections apply left-to-right at the moment they're parsed, which is why `>file 2>&1` works and `2>&1 >file` doesn't. Pipes run concurrently; `$?` captures only the rightmost command's exit code.
