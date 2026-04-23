---
id: 4915-topic-shell-expansions-7-types-in-order
title: 'Shell expansions (7 types, in order)'
pillar: tech
priority: high
chapter: Mod04 Ch9
source: "Mod04 Ch9; materials/past-exams/midterm.md Q47"
tags:
  - shell
related: [4915-topic-quoting-rules, 4915-topic-command-precedence-order, 4915-topic-special-parameters]
---

1.  **Brace** `{a,b,c}` → a b c. Happens BEFORE variable expansion.
2.  **Tilde** `~` → $HOME; `~user` → that user's home.
3.  **Parameter** `$var`, `${var}`, `${var:-default}`, `${#var}` length.
4.  **Arithmetic** `$((2+3))`, `$[x+1]`.
5.  **Command** `$(cmd)` (preferred) or backticks.
6.  **Word splitting** — unquoted results split on IFS (default space/tab/newline).
7.  **Pathname/glob** `*` any, `?` one, `[...]` set, `[!...]` negation.

Process substitution `<(cmd)`, `>(cmd)` is a bash feature beyond basic 7.

**All seven are exam-tested.** Expect MCQs on the order or predict-output with mixed expansions.

> **Pitfall**
>
> Brace expansion runs **before** parameter expansion. `echo {$HOME,$USER}` produces literal `$HOME $USER` first (brace-expanded into two tokens), then parameter expansion expands each. If you want brace over variables' values, you need `eval` — and you don't want `eval`.

> **Example** — trace all 7 stages on one command line
>
> Given: `user=alice; files=2; echo ~/{dir1,dir2}/file${files}_$(date +%j).log`
>
> 1. **Brace**: `~/dir1/file${files}_$(date +%j).log ~/dir2/file${files}_$(date +%j).log` (two tokens).
> 2. **Tilde**: `/home/alice/dir1/file${files}_$(date +%j).log /home/alice/dir2/file${files}_$(date +%j).log`.
> 3. **Parameter**: `${files}` → `2`, giving `/home/alice/dir1/file2_$(date +%j).log ...`.
> 4. **Command substitution**: `$(date +%j)` → `112` (day-of-year), giving `/home/alice/dir1/file2_112.log ...`.
> 5. **Arithmetic**: none here (no `$(( ))`).
> 6. **Word splitting**: two tokens stay two tokens (no unquoted IFS breaks introduced).
> 7. **Pathname / glob**: no `*`, `?`, `[` — nothing to match; literals pass through.
>
> Final argv to echo: `/home/alice/dir1/file2_112.log` `/home/alice/dir2/file2_112.log`. Try it: `echo ~/{a,b}/file${HOME}_$(whoami).log`.

> **Takeaway**: Seven expansions fire in a fixed order: brace → tilde → parameter/variable → command substitution → arithmetic → word splitting → pathname (glob). Each stage sees the output of the previous one — understanding the order explains every "why did my echo output that?" moment.
