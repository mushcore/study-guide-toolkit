---
"n": 1
id: 4915-code-shell-script-print-working-directory-on-one-line
title: "Shell script: print working directory on one line"
lang: bash
variant: starter-solution
tags:
  - shell
  - scripting
---

## Prompt

Write a complete shell script that prints `Your working directory is` followed by your current working directory, all on one line. Include shebang.

## Starter

```bash
#!/bin/bash
# your code here
```

## Solution

```bash
#!/bin/bash
echo "Your working directory is $(pwd)"
```

## Why

Needs shebang (1 mark), correct quoting (1 mark), command substitution (1 mark). `$(pwd)` preferred over backticks.
