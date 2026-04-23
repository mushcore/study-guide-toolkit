---
id: 4915-topic-grep-find-wc-tr-tee-sort
title: grep / find / wc / tr / tee / sort
pillar: tech
priority: high
chapter: Mod02 Ch7
source: "Mod02 Ch7; materials/past-exams/midterm.md Q15, Q34"
tags:
  - text-processing
  - fundamentals
related: [4915-topic-redirection-pipes, 4915-topic-quoting-rules]
---

| Cmd | Key use | Flags |
| --- | --- | --- |
| grep | pattern in files | \-i ignore case, -v invert, -n line #, -c count, -l files-only, -w word, -r recursive |
| find | walk filesystem | \-name glob, -type f/d/l, -mtime -N, -size, -exec cmd {} \\; |
| wc | count | \-l lines, -w words, -c bytes |
| tr | translate/delete chars | `tr 'a-z' 'A-Z'`, `tr -d '\r'` DOS→Unix |
| tee | stdout AND file | \-a append |
| sort | sort lines | \-n numeric, -r reverse, -u unique, -k field, -t delim |
| uniq | collapse dupes (sort first!) | \-c count, -d dupes only |
| cut | extract cols | \-d delim, -f fields |
| head/tail | first/last N | \-n N, -f follow |

**Common trap:** `grep *` — always quote the pattern: `grep "pattern" *`. Unquoted, the shell globs `*` to filenames before grep runs, and the first filename becomes the regex.

```bash
# Midterm Q55: lines NOT containing bb/bB/Bb/BB
grep -vi bb *
# Midterm Q34: search for word "superman"
grep -w superman SuperHeroes
```

> **Pitfall**
>
> `grep pattern *` with three matching files: the shell expands `*` before grep sees it, so grep treats the *first* file as the regex and the rest as inputs. Quote your pattern — `grep 'pattern' *` — or grep silently greps the wrong thing.

> **Example** — count error lines across today's logs, top 5 noisiest files
>
> 1. `find /var/log -type f -name '*.log' -mtime -1` → today's log files (modified <1 day ago).
> 2. `grep -ic error <file>` gives a case-insensitive count per file (`-c` = count only).
> 3. Compose: `find /var/log -type f -name '*.log' -mtime -1 -exec grep -ic error {} + | sort -rn | head -5`.
> 4. Trace: `find` emits paths → `grep -c` emits counts → `sort -rn` reverse-numeric → `head -5` keeps top 5.
> 5. `-exec ... {} +` bundles matches into one grep invocation, dodging the shell-glob argv limit that trips up `grep ... *`.

> **Takeaway**: Six utilities, one pattern: stdin → transform → stdout. Chain them with pipes, redirect at the ends, and you've built the exam's short-answer scripting problems in miniature. Know each tool's one-line summary and two most-used flags.
