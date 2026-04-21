---
id: 4915-topic-grep-find-wc-tr-tee-sort
title: grep / find / wc / tr / tee / sort
pillar: tech
priority: high
chapter: Mod02 Ch7
tags:
  - text-processing
  - fundamentals
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

**Instructor:** grep with `*` — quote the pattern: `grep "pattern" *`. Unquoted, shell glob expands `*` to filenames, first becomes pattern.

```bash
# Midterm Q55: lines NOT containing bb/bB/Bb/BB
grep -vi bb *
# Midterm Q34: search for word "superman"
grep -w superman SuperHeroes
```
