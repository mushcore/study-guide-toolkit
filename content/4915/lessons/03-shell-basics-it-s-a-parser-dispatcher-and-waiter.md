---
"n": 3
id: 4915-lesson-shell-basics-it-s-a-parser-dispatcher-and-waiter
title: "Shell basics: it's a parser, dispatcher, and waiter"
hook: Once you see the shell's loop, command weirdness stops being weird.
tags:
  - shell
module: Shell, redirection & text processing
---

**Motivation.** The instructor said "all shell expansions are fair game" and "know function precedence." That's this lesson. Once you see the shell as a machine that *rewrites your line* in 7 fixed steps, then *dispatches* by a fixed priority, every trick question becomes obvious.

> **Analogy**
> **Counter clerk analogy.** You hand a clerk (the shell) an order. The clerk rewrites it using a rulebook (expansions, in order), looks up which kitchen (alias / function / builtin / binary) should handle it, forks a cook, waits for the plate, hands it back, asks "next?". That's the entire prompt loop.

The 7 expansions — IN ORDER (instructor: "all fair game")

1\. Brace `{a,b,c}`  →  2. Tilde `~`, `~user`  →  3. Parameter `$var`  →  4. Arithmetic `$((…))`  →  5. Command `$(…)`  →  6. Word splitting (IFS, unquoted only)  →  7. Pathname glob `*` `?` `[…]`.  
*Quoting can disable some: single quotes disable all, double quotes disable word splitting + glob.*

Shell prompt loop: parse → expand → dispatch → exec

flowchart TB IN\["INPUT: echo ~/{a,b}\_$USER.txt  
(tokenize on whitespace first)"\] subgraph EXP\["7 EXPANSIONS — in order — instructor: 'all fair game'"\] direction LR E1\["1. Brace  
{a,b} → a b"\] E2\["2. Tilde  
~ → /home/u"\] E3\["3. Param  
$USER → alice"\] E4\["4. Arith  
$((2+3)) → 5"\] E5\["5. Cmd subst  
$(date) → Fri Apr 18"\] E6\["6. Word split  
IFS, unquoted only"\] E7\["7. Pathname  
\*.txt → a.txt b.txt"\] E1 --> E2 --> E3 --> E4 --> E5 --> E6 --> E7 end ARGV\["After expansions:  
echo /home/alice/a\_alice.txt /home/alice/b\_alice.txt"\] PREC\["COMMAND PRECEDENCE  
alias → keyword → function → builtin → $PATH  
bypass: command / builtin / abs path"\] EXEC\["fork → exec → wait → prompt  
exit status → $?"\] IN --> EXP E7 --> ARGV ARGV --> PREC PREC --> EXEC classDef step fill:#1a1a1a,stroke:#262626,color:#e5e5e5; classDef prec fill:#181a18,stroke:#9ece6a,color:#e5e5e5; classDef exec fill:#1a1a22,stroke:#7aa2f7,color:#e5e5e5; class E1,E2,E3,E4,E5,E6,E7,ARGV step; class PREC prec; class EXEC exec;

Parse → 7 expansions → precedence dispatch → fork/exec/wait. Every weird shell result is explainable by tracing these steps.

> **Example**
> #### Trace: `echo ~/{a,b}_$USER.txt` (with USER=alice, HOME=/home/alice)
>
> 1.  **Tokenize.** Two words: `echo` and `~/{a,b}_$USER.txt`.
> 2.  **Brace expansion.** `~/{a,b}_$USER.txt` → `~/a_$USER.txt ~/b_$USER.txt`.
> 3.  **Tilde expansion.** Both `~` become `/home/alice`: `/home/alice/a_$USER.txt /home/alice/b_$USER.txt`.
> 4.  **Parameter expansion.** `$USER` → `alice`: `/home/alice/a_alice.txt /home/alice/b_alice.txt`.
> 5.  Arithmetic (none), command subst (none), word splitting (already whitespace-separated), pathname glob (no wildcards).
> 6.  **Dispatch.** First token is `echo`. Precedence walk: alias? no. keyword? no. function? no. builtin? *yes* — bash's built-in `echo`.
> 7.  **Exec.** Builtin runs inside the shell (no fork). Output: /home/alice/a\_alice.txt /home/alice/b\_alice.txt.
>
> Every expansion had to happen in that order. Swap tilde and parameter and you'd get the wrong answer.

brace expansion multiplies — 2×2=4

```console
$ echo {a,b}{1,2}
a1 a2 b1 b2

$ echo file_{01..03}.log
file_01.log file_02.log file_03.log

$ mkdir -p project/{src,test,docs}    # practical

$ ls project
docs src test
```

**Why order matters — the classic trap.** `echo {$HOME,$USER}` does NOT print two expanded values. Brace expansion runs *before* parameter expansion — brace sees the *literal text* `$HOME` and `$USER`, splits it into `$HOME $USER`, *then* parameter expansion kicks in and gives `/home/alice alice`. Reorder the expansions in your head and the result magically fits.

Command precedence — instructor: "know this"

When you type a name, bash resolves it in this order: **1) alias → 2) keyword → 3) function → 4) builtin → 5) `$PATH` search**. Bypass: `command foo` skips aliases + functions · `builtin foo` forces builtin · `/usr/bin/foo` forces external.

precedence in action — alias beats external

```console
$ alias ls='ls --color=auto -F'

$ type ls
ls is aliased to `ls --color=auto -F'

$ command ls          # skip the alias
greet.txt hi.txt

$ /usr/bin/ls         # force external binary
greet.txt hi.txt
```

Check: `echo {$HOME,$USER}` output (USER=alice, HOME=/home/alice)?Brace expansion happens BEFORE parameter expansion. So it splits first into `$HOME $USER`, THEN parameters expand. Final: `/home/alice alice`. Check: You defined a function `ls() { echo "nope"; }` in your shell. What does `ls` do?Runs the function (prints "nope"). Function beats builtin and $PATH. Use `command ls` or `/usr/bin/ls` to bypass. Check: Why does `echo *.txt` in an empty directory print the literal `*.txt`?Pathname glob (step 7) leaves the pattern unchanged when it matches nothing (unless `shopt -s nullglob` is set). Then echo just prints what it got.

Sources: Mod01 Ch5 · Mod04 Ch9 · Review Apr 17
