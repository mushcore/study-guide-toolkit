---
id: 4915-topic-shell-expansions-7-types-in-order
title: 'Shell expansions (7 types, in order)'
pillar: tech
priority: high
chapter: Mod04 Ch9
tags:
  - shell
---

1.  **Brace** `{a,b,c}` → a b c. Happens BEFORE variable expansion.
2.  **Tilde** `~` → $HOME; `~user` → that user's home.
3.  **Parameter** `$var`, `${var}`, `${var:-default}`, `${#var}` length.
4.  **Arithmetic** `$((2+3))`, `$[x+1]`.
5.  **Command** `$(cmd)` (preferred) or backticks.
6.  **Word splitting** — unquoted results split on IFS (default space/tab/newline).
7.  **Pathname/glob** `*` any, `?` one, `[...]` set, `[!...]` negation.

Process substitution `<(cmd)`, `>(cmd)` is a bash feature beyond basic 7.

**Instructor: all fair game.** Expect MCQ on order or predict-output with mixed expansions.
