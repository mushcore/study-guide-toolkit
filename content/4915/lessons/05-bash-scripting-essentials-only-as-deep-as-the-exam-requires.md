---
"n": 5
id: 4915-lesson-bash-scripting-essentials-only-as-deep-as-the-exam-requires
title: Bash scripting essentials — only as deep as the exam requires
hook: >-
  The instructor said 'no hard scripting gymnastics'. But you WILL write a small script or function, AND a C function.
  This is the floor.
tags:
  - scripting
module: Bash scripting & regex
---

**Motivation.** The instructor's two explicit promises: "exam WILL have you write a C function" and "know the special parameters." If you only absorb two things from the whole course: the C-vs-bash function distinction, and `$0 $# $@ $* $?` — do it here.

### Anatomy of a script — walkthrough

> **Example**
> #### Build `greet.sh` from scratch: write → chmod → run → observe args
>
> 1.  Create `greet.sh` in your editor with these 4 lines:
>     
>     ```bash
>     #!/bin/bash
>     # greet.sh — greets the caller with two args
>     echo "Hello $1! You are $2 years old."
>     echo "(script name: $0 · total args: $#)"
>     ```
>     
> 2.  Make it executable: `chmod +x greet.sh`. Without `x` you can't run it as `./greet.sh`.
> 3.  Run it: `./greet.sh alice 25`.
>     
>     ```bash
>     Hello alice! You are 25 years old.
>     (script name: ./greet.sh · total args: 2)
>     ```
>     
> 4.  The `#!/bin/bash` (shebang) tells the kernel which interpreter to invoke when you `exec` the file. Without it, bash would try to interpret it; other shells might not.
> 5.  Alternate invocation: `bash greet.sh alice 25` — works even without `chmod +x`, because you're explicitly naming the interpreter.
>
> Source chain: Mod09 script intro + Lab 9 warm-up. The instructor expects shebang + comments in a graded script — they're worth marks.

### Special parameters — instructor's emphasis

Memorize these nine — they appear on EVERY assessment

`$0` script name · `$1`..`$9` positional args · `${10}`\+ use braces · `$#` arg count · `"$@"` all args SEPARATE · `"$*"` all args JOINED · `$?` last exit · `$$` shell PID · `$!` last background PID

$@ vs $* — the classic distinguish

```console
$ cat args.sh
#!/bin/bash
echo "count: $#"
echo "dollar-at (one per line):"
for x in "$@"; do echo "  [$x]"; done
echo "dollar-star (one per line):"
for x in "$*"; do echo "  [$x]"; done

$ ./args.sh "hello world" foo bar
count: 3
dollar-at (one per line):
  [hello world]
  [foo]
  [bar]
dollar-star (one per line):
  [hello world foo bar]
```

`"$@"` preserved 3 separate args (3 loop iterations). `"$*"` joined them into ONE string with IFS spaces (1 iteration). Rule: **you almost always want `"$@"`**. Use `"$*"` only when you explicitly want to print a joined line.

$? — reading exit status

```console
$ ls greet.sh; echo "exit=$?"
greet.sh
exit=0

$ ls nothing.xyz; echo "exit=$?"
ls: cannot access 'nothing.xyz': No such file or directory
exit=2
```

Exit 0 = success. Non-zero = some error. `$?` is rewritten after every command — read it *immediately* or capture it into a variable.

### Control flow + test operators

```bash
if [ -f file ]; then echo yes; else echo no; fi
for i in 1 2 3; do echo $i; done
while read line; do echo $line; done < input.txt
case "$1" in start) ... ;; stop) ... ;; *) ... ;; esac
```

**File tests:** `-e` exists · `-f` regular · `-d` directory · `-r/-w/-x` perm · `-s` non-empty. **Numeric:** `-eq -ne -lt -le -gt -ge`. **String:** `=` `!=` `-z` empty `-n` non-empty.

### Functions in bash — how they differ from C

C vs bash functions — instructor: "exam WILL ask"

flowchart LR subgraph C\["C function — formal params in signature"\] direction TB CSIG\["int add(int a, int b) {  
return a + b;  
}  
  
int r = add(3, 4); // r = 7"\] CTRAIT\["• Formal params: type + name in signature  
• Compiled · typed return · strict types  
• Scope isolated"\] CSIG --> CTRAIT end subgraph B\["Bash function — NO formal params"\] direction TB BSIG\["add() {  
echo $(( $1 + $2 ))  
}  
  
add 3 4 # prints 7"\] BTRAIT\["• Args via $1, $2, $@, $#  
• Interpreted · stdout output · exit 0-255  
• Can modify parent shell vars"\] BSIG --> BTRAIT end C -. "THE DIFFERENCE" .-> B classDef cstyle fill:#181822,stroke:#7aa2f7,color:#e5e5e5; classDef bstyle fill:#181a18,stroke:#9ece6a,color:#e5e5e5; class CSIG,CTRAIT cstyle; class BSIG,BTRAIT bstyle;

Two signatures side by side. Note the *absence* of `(int a, int b)` in the bash form — that's the whole difference.

Instructor: "exam WILL have you write a C function"

C *declares* types and param names in the signature: `int add(int a, int b)`. Bash *does not* — `add() { ... }`. Inside the bash function args are `$1`, `$2`, `$#`, `"$@"` (same rules as a script). "Return" in bash = `echo` the value or set exit status 0-255. In C, `return` returns a typed value.

> **Example**
> #### Worked example: a bash function and its C twin
>
> 1.  **C version** — types declared, returns int:
>     
>     ```c
>     int add(int a, int b) {
>         return a + b;
>     }
>     int main(void) {
>         int r = add(3, 4);   // r = 7
>         return 0;
>     }
>     ```
>     
> 2.  **Bash version** — no formal params, result echoed:
>     
>     ```bash
>     add() {
>         echo $(( $1 + $2 ))
>     }
>     result=$(add 3 4)   # result=7
>     ```
>     
> 3.  To use the bash function's value elsewhere you *capture stdout* via `$(...)`. Bash functions don't "return" values in the C sense — their `return N` only sets exit status (`$?`, 0-255).
> 4.  Line breaks matter in bash: the `;` or newline between `add 3 4` and the next statement is significant. In C, whitespace is free but semicolons end statements.
>
> Instructor on review day: students miss this because they treat bash and C as similar — they are not. Read the prompt carefully: "write a C function" means formal parameters in the signature. Writing `add() { ... }` in answer to a C prompt scores zero.

Check: Write a bash function that prints its first arg in uppercase.

```bash
upper() { echo "$1" | tr 'a-z' 'A-Z'; }
```

Call with `upper hello` → `HELLO`. Check: Which special parameter holds the PID of the most recently backgrounded command?`$!`. Don't confuse with `$$` (current shell PID) or `$?` (last exit). Check: In the C *function signature* `int area(int w, int h)`, what are `w` and `h` called?Formal parameters. They declare the types and names the function expects. Bash function definitions have none of these.

Sources: Mod09 Ch28 · Lab 9 · Review Apr 17
