---
"n": 3
id: 4915-lesson-shell-basics-it-s-a-parser-dispatcher-and-waiter
title: "Shell basics: it's a parser, dispatcher, and waiter"
hook: Once you see the shell's loop, command weirdness stops being weird.
tags:
  - shell
module: Shell, redirection & text processing
source: "Mod01 Ch4-5, Mod04 Ch9"
related: [4915-topic-command-precedence-order, 4915-topic-quoting-rules, 4915-topic-shell-expansions-7-types-in-order, 4915-lesson-bash-scripting-essentials-only-as-deep-as-the-exam-requires]
---

You type `echo ~/{a,b}_$USER.txt` at a bash prompt. Your username is `alice`, your home is `/home/alice`. Before you read further, predict the output. Write it down in your head — don't skim past this.

Most people guess one of two things. Some guess `~/{a,b}_alice.txt` (parameter expanded, brace didn't). Others guess `~/a_alice.txt ~/b_alice.txt` (brace happened, tilde didn't). A few get the full answer, `/home/alice/a_alice.txt /home/alice/b_alice.txt`, but can't explain *why the three expansions happen in that particular order*.

The shell is not magic. It is a small pipeline that does three jobs in sequence, every single time you press Enter. Once you see those three jobs, the order drops out naturally and your guess stops being a guess.

## The three jobs: parser, dispatcher, waiter

Before you can reason about any shell line, you need three vocabulary words.

A **parser** is a program that takes text and breaks it into structured pieces. When you type `grep foo file.txt`, the shell's parser splits your line at whitespace into three *tokens*: `grep`, `foo`, and `file.txt`. Parsing also runs the *expansions* — the rules that rewrite things like `$USER` into `alice` and `*.txt` into a list of filenames. The output of parsing is a cleaned-up argument list, ready to hand to a program.

A **dispatcher** is the part that decides *which* program to run. The parser has handed it a first token, say `grep`. Is that an alias you defined? A shell function? A builtin baked into bash? An external binary somewhere in `$PATH`? The shell walks a fixed priority list to pick the winner. We'll come back to that list — it's the second-most-tested thing in this topic.

A **waiter** — nothing to do with restaurants in the OS sense — is the part that, after the chosen command starts running, sits on a `wait()` system call until that command exits. It then captures the command's exit status into the variable `$?` (zero = success, non-zero = error) and prints the next prompt. If the command was backgrounded with `&`, the waiter skips the wait and returns immediately.

Three jobs: rewrite the line, pick a target, run and collect the exit code. The whole prompt loop is those three phases repeating.

> **Analogy**
> **Counter clerk.** You hand an order to a clerk (the shell). The clerk rewrites it using a rulebook (expansions, in a fixed order), looks up which kitchen (alias / function / builtin / binary) should cook it, forks a cook, waits for the plate, hands it back, and asks "next?". That loop never changes.

## The diagram

Here is the full prompt loop, drawn end to end. `INPUT` is what you typed; `EXEC` is the kernel actually running your command.

flowchart TB IN\["INPUT: echo ~/{a,b}\_$USER.txt  
(tokenize on whitespace first)"\] subgraph EXP\["7 EXPANSIONS — in order — all exam-tested"\] direction LR E1\["1. Brace  
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

The middle box — the seven expansions — is where your prediction likely went wrong. It is also where every "why did it do *that*?" exam question comes from.

## The seven expansions, one at a time

Before you can trace any line, you need to know what each expansion *is*. Pre-training each one in isolation makes the ordered list obvious rather than memorized.

**1. Brace expansion.** `{a,b,c}` becomes the three words `a b c`. Written with a range, `{01..03}` becomes `01 02 03`. Brace expansion is *textual* — it looks only at the literal characters on the line. It does not peek inside variables. That last sentence is the whole trap.

**2. Tilde expansion.** A leading `~` becomes your home directory (`$HOME`). `~alice` becomes *alice's* home directory. Tilde only works at the start of a word or right after a `:` in a path list.

**3. Parameter expansion.** `$var` or `${var}` becomes the value of the variable `var`. `$USER` becomes `alice`. If the variable is unset, it becomes the empty string (unless you asked for strict mode).

**4. Arithmetic expansion.** `$(( 2 + 3 ))` becomes `5`. The shell does integer math inside the double parens.

**5. Command substitution.** `$(date)` runs `date`, captures its standard output, and pastes that output back onto the line as text. Backticks `` `date` `` do the same thing but are harder to nest — prefer `$(…)`.

**6. Word splitting.** After the first five expansions produce text, the shell re-breaks any *unquoted* result at the characters in `$IFS` (default: space, tab, newline). This is why `foo="a b c"; echo $foo` prints three arguments but `echo "$foo"` prints one.

**7. Pathname expansion (globbing).** `*`, `?`, and `[…]` match filenames. `*.txt` becomes whatever `.txt` files actually exist in the current directory. If nothing matches, the pattern is left unchanged — the literal `*.txt` is what `echo` receives. (Set `shopt -s nullglob` to change that behavior; by default, a failed match stays literal.)

Quoting turns expansions off. **Single quotes** disable all seven. **Double quotes** disable only the last two — word splitting and globbing — which is why `"$var"` is almost always what you want.

## Tracing your prediction

Now trace the line from the opening, one expansion at a time, and watch the answer fall out.

> **Example**
> #### Trace: `echo ~/{a,b}_$USER.txt` (USER=alice, HOME=/home/alice)
>
> 1.  **Tokenize.** Whitespace splits the line into two words: `echo` and `~/{a,b}_$USER.txt`.
> 2.  **Brace expansion** (step 1). `~/{a,b}_$USER.txt` → `~/a_$USER.txt ~/b_$USER.txt`. Brace sees literal text — `$USER` has not been touched yet.
> 3.  **Tilde expansion** (step 2). Each `~` at the start of a word becomes `/home/alice`: `/home/alice/a_$USER.txt /home/alice/b_$USER.txt`.
> 4.  **Parameter expansion** (step 3). `$USER` → `alice`: `/home/alice/a_alice.txt /home/alice/b_alice.txt`.
> 5.  Steps 4–7 (arithmetic, command substitution, word splitting, globbing) have nothing to do. The result is whitespace-separated already and has no wildcards.
> 6.  **Dispatch.** First token `echo` walks the precedence list: alias? no. keyword? no. function? no. builtin? **yes** — bash's built-in `echo` handles it.
> 7.  **Exec.** Because `echo` is a builtin, no `fork()` happens; the shell runs the code in-process. Output: `/home/alice/a_alice.txt /home/alice/b_alice.txt`.
>
> Swap the order of brace and parameter in your head and you'd get `/home/alice/{a,b}_alice.txt` — brace never sees the literal `{a,b}` because parameter ran first and nothing expanded. The fixed order is what makes the real result land where it does.

## Brace expansion multiplies — a concrete feel

Before the next trap, look at brace on its own so you have an intuition for it.

```console
$ echo {a,b}{1,2}
a1 a2 b1 b2

$ echo file_{01..03}.log
file_01.log file_02.log file_03.log

$ mkdir -p project/{src,test,docs}    # practical

$ ls project
docs src test
```

Brace distributes across adjacent text — two braces next to each other give you the full 2×2 cross product. That is why brace runs *first*: later stages want one word per filename, and brace's job is to generate those words from a compact pattern.

## The classic order trap

Here is where most people's prediction breaks. What does `echo {$HOME,$USER}` print?

Your instinct might say: "Brace makes two items, each gets expanded — I should see `/home/alice alice`." You are half right. The final output *is* `/home/alice alice`, but not because brace cooperated with parameter expansion. It's because brace ran first, blind to `$`, and split the literal text into the two words `$HOME` and `$USER`. *Then* parameter expansion came along later and replaced each variable with its value. The order gave you the answer you wanted, by accident of sequencing.

Now flip the variables around. `echo {$USER,$HOME}_logs` — same mechanism: brace blindly splits `$USER` from `$HOME` first (producing `$USER_logs $HOME_logs`), and parameter expansion then discovers `$USER_logs` is *one variable name*, not `$USER` followed by `_logs`. `$USER_logs` is probably unset, so you get an empty string and a surprise. That is a real way this trap bites.

> **Q:** What does `echo {$USER,$HOME}_logs` print when USER=alice and HOME=/home/alice?
>
> **A:** Brace runs first and produces the two literal words `$USER_logs` and `$HOME_logs`. Parameter expansion then looks those up. Neither variable exists by that name, so both expand to the empty string. Final output: one blank space (just what `echo` prints when given two empty arguments). The fix: put the suffix outside the braces — `echo {$USER,$HOME}` prints `alice /home/alice`, and `echo "${USER}_logs ${HOME}_logs"` prints `alice_logs /home/alice_logs`.

## Command precedence — the dispatcher's priority list

Expansions finish. The shell now has a list of words. The first word is the *command name*. Precedence is the rulebook the dispatcher uses to decide which thing that name refers to.

Here are the five kinds of "command" you might have, in the priority order bash uses:

1. **Alias.** A text substitution set up by the `alias` command. `alias ls='ls --color=auto'`. Aliases are pure textual rewrite — they happen before the rest of the precedence walk.
2. **Keyword.** Reserved words the shell's grammar recognizes structurally: `if`, `while`, `for`, `case`, `function`, `[[`. You cannot shadow these.
3. **Function.** A shell function you defined (`foo() { …; }`). Runs in the current shell, no fork.
4. **Builtin.** A command implemented *inside* bash itself: `cd`, `echo`, `pwd`, `export`, `read`, `test`, `[`. No fork, no exec — the code is part of the bash binary. This is why `cd` has to be a builtin: an external `cd` could not change the shell's working directory.
5. **`$PATH` search.** The shell walks the directories in `$PATH` left to right, looking for an executable file by that name. First match wins. This is where `/usr/bin/ls`, `/usr/bin/grep`, and every other external binary live.

Three escape hatches let you bypass the walk when you know exactly what you want. `command foo` skips aliases and functions (but still checks builtin and `$PATH`). `builtin foo` forces the builtin, never the external binary. And an absolute path like `/usr/bin/ls` goes straight to the binary with no lookup at all.

### Precedence in action

```console
$ alias ls='ls --color=auto -F'

$ type ls
ls is aliased to `ls --color=auto -F'

$ command ls          # skip the alias
greet.txt hi.txt

$ /usr/bin/ls         # force external binary
greet.txt hi.txt
```

The two bypasses in that session do different things. `command ls` skips the alias (and any function), then runs whatever's next — here, the external `/usr/bin/ls`. The absolute path goes straight to the binary, no lookup at all. `type -a ls` is the diagnostic tool: it lists *every* match of the name in precedence order, so if you ever wonder "why is `ls` doing something weird", that command shows you the stack.

## Checkpoints

Each of these is testing a different surface form of the same deep idea — the order of expansions, or the precedence walk. Cover the answer, commit to a response in your head, then reveal.

> **Q:** In an empty directory, what does `echo *.txt` print?
>
> **A:** The literal text `*.txt`. Pathname expansion (step 7) looks for `.txt` files, finds none, and — by default — leaves the pattern unchanged. `echo` then receives the single argument `*.txt` and prints it. If you had run `shopt -s nullglob` first, the pattern would expand to *nothing* and `echo` would print a blank line. This is the only expansion that silently passes its input through on failure; every other expansion either succeeds or produces the empty string.

> **Q:** You define a shell function `ls() { echo "nope"; }` and then run `ls`. What happens, and how do you get the real `ls` back for one invocation?
>
> **A:** The function runs — it prints `nope`. Functions (priority 3) beat builtins (4) and `$PATH` binaries (5). To run the real external once without removing the function, use `command ls` (skips aliases and functions) or the absolute path `/usr/bin/ls`. To get the function out of the way permanently, `unset -f ls`.

> **Q:** Why is `cd` a builtin rather than an external program at `/usr/bin/cd`?
>
> **A:** An external program runs in a forked child process. Changing that child's working directory does nothing to the parent shell's directory — the child exits and its state dies with it. `cd` must run *inside* the shell process itself, which is exactly what a builtin does. The same reason applies to `export`, `read`, `source`, and `exec`: any command that has to mutate the shell's own state must be a builtin.

> **Q:** You type `grep foo file.txt` and press Enter. List what the parser, the dispatcher, and the waiter each do.
>
> **A:** The **parser** tokenizes the line into `grep`, `foo`, `file.txt`; the seven expansions all run (none of the three words need rewriting here). The **dispatcher** walks the precedence list on `grep` — not an alias, not a keyword, not a function, not a builtin — and finds `/usr/bin/grep` via `$PATH`. It then `fork()`s a child and `exec()`s grep in it. The **waiter** calls `wait()` on that child, and when grep exits, stores the exit code in `$?` and prints the next prompt. Three phases, one loop, every line.

## Pitfalls

> **Pitfall**: A function or alias named `ls` silently shadows `/usr/bin/ls`. You'll see strange flags, colored output, or different sorting, and wonder if the binary is broken. Run `type -a ls` — it prints every match in precedence order, so the culprit is the first line. Use `command ls` or `/usr/bin/ls` to bypass without disturbing the shadow.

> **Pitfall**: Variables inside braces don't expand. `{$HOME,$TMPDIR}` looks like it should give you two expanded paths, but brace expansion runs first and treats the `$` as literal text. Parameter expansion cleans up *afterward*, which sometimes makes it look like it worked. When the variable name runs into adjacent characters (`{$USER,$HOME}_logs`), the *afterward* stops working and you get the empty string. Put variables outside braces, or use an explicit list: `for x in "$USER" "$HOME"; do …`.

Sources: Mod01 Ch5 · Mod04 Ch9 · Review Apr 17

> **Takeaway**: The shell is a parser, a dispatcher, and a waiter. Parsing rewrites your line through seven expansions in a fixed order — brace, tilde, parameter, arithmetic, command substitution, word splitting, pathname. Dispatch resolves the first token by precedence — alias, keyword, function, builtin, `$PATH` — and `fork()` + `exec()`s the winner. Waiting captures the exit status into `$?` and prints the next prompt. Every surprising shell result is a step in that pipeline you didn't trace.
