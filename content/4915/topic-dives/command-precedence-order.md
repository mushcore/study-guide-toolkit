---
id: 4915-topic-command-precedence-order
title: Command precedence order
pillar: tech
priority: high
chapter: Mod04
source: "Mod04"
tags:
  - shell
related: [4915-topic-quoting-rules, 4915-topic-shell-expansions-7-types-in-order]
---

Concrete scenario: you've aliased `alias ls='ls -la'` in `~/.bashrc`, defined a shell function `ls() { echo hi; }` in the current shell, and `/bin/ls` exists on disk. You type `ls` and hit enter. Which one runs? The alias — aliases are resolved first, so `ls` expands to `ls -la`, *then* the resulting `ls` goes through the rest of the pipeline (which picks the function next). This dive tells you the exact order the shell uses.

1.  **Aliases** — `alias ll='ls -l'`
2.  **Keywords** — `if while for [[ { function`
3.  **Functions**
4.  **Builtins** — `cd echo test [ read pwd exit`
5.  **$PATH search** — external programs

Bypass options:

-   `command foo` — skip alias+function, use builtin or PATH
-   `builtin foo` — force builtin
-   `/absolute/path/foo` — direct file
-   `\foo` — escape alias expansion

> **Pitfall**
>
> To bypass an alias or function and force the builtin, prefix with `builtin` (e.g. `builtin cd`). To force an external, prefix with the full path or use `command` (e.g. `command ls`). Writing `\ls` in a shell with an `ls` alias bypasses the alias — a trick that's useful and exam-testable.

> **Example** — resolve `cd` when alias, function, and builtin all exist
>
> 1. Setup: `alias cd='echo ALIAS'`, then `cd() { echo FUNC; }`, then note the builtin `cd` is always present.
> 2. Type `cd /tmp` and predict: alias fires first → shell expands `cd /tmp` to `echo ALIAS /tmp`. Output: `ALIAS /tmp`. Working dir unchanged.
> 3. Bypass the alias with a leading backslash: `\cd /tmp` → alias lookup is skipped. Next step is function → `FUNC`. Still no actual cd.
> 4. Bypass alias AND function with `command cd /tmp` → lookup jumps straight to builtins/PATH. Builtin `cd` wins. Working dir is now `/tmp`.
> 5. Force the builtin explicitly: `builtin cd /home` — guaranteed to bypass alias/function even if `command` were also shadowed.
> 6. Verify: `type cd` lists all matches in resolution order — alias first, function second, builtin last.
> 7. `unalias cd; unset -f cd` removes the overrides; plain `cd` is then the builtin again.

> **Takeaway**: Bash resolves a name through a fixed pipeline: alias → keyword → function → builtin → `$PATH`. Knowing the order tells you which definition wins when multiple exist — and how to force a specific one with `\name`, `command`, or `builtin`.
