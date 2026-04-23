---
"n": 1
id: 4915-code-shell-script-print-working-directory-on-one-line
title: "Shell script: print working directory on one line"
lang: bash
variant: starter-solution
tags:
  - shell
  - scripting
source: "Mod09 Ch28; materials/labs/Lab9.pdf; materials/past-exams/midterm.md Q59"
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

**Source**: Mod09 Ch28 + Lab 9. Needs shebang (1 mark), correct quoting (1 mark), command substitution (1 mark). `$(pwd)` preferred over backticks. Common wrong: `echo Your working directory is $(pwd)` without quotes — an unquoted path with spaces gets re-split by the shell, and a leading literal-less string loses whitespace formatting; the marker docks for "not one clean line".
