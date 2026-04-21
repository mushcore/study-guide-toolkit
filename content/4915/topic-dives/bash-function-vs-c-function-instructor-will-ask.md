---
id: 4915-topic-bash-function-vs-c-function-instructor-will-ask
title: Bash function vs C function (INSTRUCTOR WILL ASK)
pillar: tech
priority: high
chapter: Mod09
tags:
  - scripting
  - shell
---

**Instructor said this explicitly: exam WILL have you write a C function.**

Key difference: **C functions declare formal parameters in their signature**. **Bash functions don't — they access args via `$1, $2, "$@", $#`.**

```c
// C: formal params with types
int add(int a, int b) {
    return a + b;
}
// call: add(3, 4)
```

```bash
# bash: no formal params in definition
add() {
    echo $(( $1 + $2 ))
}
# call: add 3 4
```

Also: C compiles before running; bash interprets line by line. Bash functions can modify parent shell variables (same process). C function returns via `return` statement / value; bash function "returns" an exit code 0-255 and outputs via stdout.

Line breaks matter in bash (not in C). `if [ ... ]; then ...; fi` needs `;` or newline before `then`. C uses semicolons and braces.
