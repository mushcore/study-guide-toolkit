---
"n": 2
id: 4915-code-bash-function-grep-processes
title: "Bash function: grep processes"
lang: bash
variant: starter-solution
tags:
  - text-processing
  - scripting
  - processes
source: "Mod09 Ch28; materials/labs/Lab9.pdf; materials/past-exams/midterm.md Q60"
---

## Prompt

Write a bash function named `psgrep` that takes one parameter and prints processes from `ps aux` output containing that parameter. Exclude the grep process itself from the output.

## Starter

```bash
psgrep() {
    # your code
}
```

## Solution

```bash
psgrep() {
    ps aux | grep "$1" | grep -v grep
}
```

## Why

Function syntax (2 marks), `ps aux` pipe (1), `"$1"` quoted to handle spaces (1), `grep -v grep` to exclude self-match (2). Alternative: `grep [p]attern` trick.
