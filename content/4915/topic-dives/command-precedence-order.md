---
id: 4915-topic-command-precedence-order
title: Command precedence order
pillar: tech
priority: high
chapter: Mod04
tags:
  - shell
---

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
