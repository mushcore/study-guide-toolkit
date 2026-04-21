---
"n": 3
id: 4915-code-c-function-vs-bash-function-instructor-emphasis
title: C function vs bash function (INSTRUCTOR EMPHASIS)
lang: bash
variant: starter-solution
tags:
  - scripting
---

## Prompt

Write both a C function and a bash function that take two integers and return their sum. Show the key difference.

## Starter

```bash
// C function:


# Bash function:
```

## Solution

```bash
// C: formal parameters in signature
int add(int a, int b) {
    return a + b;
}
// call: int r = add(3, 4);

# Bash: no formal params, $1 and $2
add() {
    echo $(( $1 + $2 ))
}
# call: add 3 4     => prints 7
```

## Why

KEY DIFFERENCE: C declares formal params with types in signature. Bash doesn't — accesses args via $1, $2, etc. Bash 'returns' via stdout or exit code 0-255. C returns typed value.
