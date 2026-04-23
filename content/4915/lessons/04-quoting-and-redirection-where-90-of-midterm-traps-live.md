---
"n": 4
id: 4915-lesson-quoting-and-redirection-where-90-of-midterm-traps-live
title: Quoting and redirection — where 90% of midterm traps live
hook: Get this right and you skip 5 MCQ/T-F pitfalls.
tags:
  - redirection
  - shell
module: Shell, redirection & text processing
source: "Mod04 Ch9-12; materials/past-exams/midterm.md Q10, Q17, Q43, Q44, Q47, Q50"
related: [4915-topic-quoting-rules, 4915-topic-redirection-pipes, 4915-topic-shell-expansions-7-types-in-order]
---

You set a variable and echo it three different ways:

```console
$ person=jenny
$ echo '$person'
$ echo "$person"
$ echo $person
```

Three commands. Same variable. Three different outputs. Before you read on, decide for yourself what each line prints. If you can predict all three, you already own the first half of this lesson; if you can't, you've just located the gap.

The answers are at the bottom of the next section. Hold the prediction in your head while you work through it.

### Quoting decides what the shell looks at before the command runs

The thing to absorb first is *when* the shell touches your text. The order is fixed: you type a line, the shell parses it, the shell **expands** anything it recognizes (variables, globs, command substitutions, and four others), and *only then* does it hand the result to the command. By the time `echo` actually runs, it never sees `$person` — it sees `jenny`, or whatever the expansion produced.

Quoting is how you tell the shell which of those expansions to skip. There are three modes, and each one disables a different amount.

**Single quotes** (`'…'`) are the strongest off-switch. Everything between them is taken as literal text. Variables don't expand, globs don't match, command substitution doesn't run. The only thing you can't put inside single quotes is another single quote — there's no escape sequence; the first `'` opens and the next `'` closes, period. You reach for single quotes when you want what you typed, exactly: a regex, a sed script, a literal `$` sign.

**Double quotes** (`"…"`) are a softer off-switch. They block two specific things — word splitting and globbing — but they *still allow* `$variable`, `$(command)`, backticks, and backslash escapes. This is the mode you use most. `"$file"` is the right way to handle a filename that might contain spaces, because the variable still expands but the result isn't then chopped into pieces by whitespace.

**No quotes at all** lets all seven expansions fire — variables, globs, word splitting, the works. That's powerful when you *want* the shell to expand `*.txt` into a list of files; it's a footgun when `$file` happens to contain a space and your command suddenly sees two arguments instead of one.

> **Q:** Why is `"$file"` safer than bare `$file` when `$file` might contain spaces?
>
> **A:** Both expand the variable. The bare form then runs word splitting on the result, so `my report.txt` becomes two arguments — `my` and `report.txt` — and your command misinterprets them. Double quotes expand the variable but suppress the splitting step, keeping the value as a single argument.

So back to the prediction. `echo '$person'` prints the literal string `$person`, because single quotes block the variable expansion. `echo "$person"` prints `jenny`, because double quotes allow `$` expansion. `echo $person` also prints `jenny`, because expansion happens with bare words too — but if `$person` had been `jenny smith`, the bare version would have passed two arguments to `echo` and the double-quoted version one. (Midterm Q47 is exactly the single-quote case.)

```console
$ export person=jenny

$ echo '$person'        # single: literal
$person

$ echo "$person"        # double: expands
jenny

$ echo $person          # bare: expands + word splits + globs
jenny
```

> **Pitfall:** Single quotes can never contain a single quote — not even escaped. `'don\'t'` looks like it should work, but it doesn't: the first `'` opens, the second `'` closes (leaving `don`), and then `t'` starts a brand-new open quote that the shell waits forever to see closed. Use double quotes (`"don't"`) or the ANSI-C form `$'don\'t'` when you need an apostrophe inside.

### Redirection: streams, file descriptors, and where bytes go

Before you can reason about redirection, you need three vocabulary items. Every Unix process is born with three open **file descriptors** — small integers the kernel uses to track open files. Descriptor **0** is **standard input** (stdin), the source the program reads from. Descriptor **1** is **standard output** (stdout), where normal results go. Descriptor **2** is **standard error** (stderr), where error messages go. By default all three are wired to your terminal, which is why typing and reading and seeing errors all happen in the same window.

Redirection is the act of unwiring one of those descriptors from the terminal and pointing it at a file or another descriptor instead. The shell does this *before* launching the command — the command never knows. From its point of view, it just writes to fd 1 like always; the kernel takes care of the fact that fd 1 now points at `out.txt`.

Here are the operators you'll see on the exam:

- `> file` redirects stdout to `file`, **truncating** it first. If the file already had contents, they're gone the moment the shell parses the line — before the command even runs.
- `>> file` redirects stdout to `file` in **append** mode. Existing contents are preserved.
- `2> file` redirects stderr (fd 2) to `file`.
- `2>&1` *duplicates* fd 2 onto whatever fd 1 currently points to. Read it as "make stderr go wherever stdout is going right now." The order this fires in is the entire trick — we'll come back to it.
- `&> file` is a bash shortcut meaning "stdout and stderr both go to `file`."
- `| cmd` connects fd 1 of the left command to fd 0 of the right command — a pipe.
- `< file` feeds `file` into stdin.
- `<< EOF` is a here-doc (multi-line literal input); `<<< "str"` is a here-string (single string fed as stdin).
- `/dev/null` is a special "discard" file. Writes vanish; reads return immediately at end-of-file. The idiom `cmd > /dev/null 2>&1` silences everything a command emits.

> **Q:** Your script writes a result to stdout and a warning to stderr. You want the result captured to `out.txt` but the warning still visible on screen. Which operator do you use?
>
> **A:** `cmd > out.txt`. That redirects stdout only. Stderr was never touched, so it stays on the terminal. If you'd written `cmd &> out.txt`, both streams would go to the file and you'd see nothing on screen.

> **Pitfall:** `>` is silent. There's no "are you sure?" prompt, no backup, no warning if `out.txt` already had content. The truncation happens at parse time, so even if your command exits with an error one nanosecond later, the old contents are already gone. If you want the shell to refuse to clobber an existing file, run `set -o noclobber` (or `set -C`); to override that protection on one specific line, write `>|` instead of `>`. Midterm Q43 and Q44 both bait the assumption that `>` is safe.

### Why `2>&1` placement is the whole trick

This is the single highest-yield trap on the midterm, so it's worth slowing down. Take this command, where file `x` doesn't exist and file `y` does:

```
cat x y > hold 2>&1
```

What ends up in `hold`? Predict before reading on.

The shell processes redirections strictly left to right. It walks the line in order:

1. `> hold` — point fd 1 at the file `hold`. Stdout now goes to the file.
2. `2>&1` — duplicate fd 2 onto whatever fd 1 currently points to. Fd 1 currently points to `hold`, so fd 2 now also points to `hold`.

Both streams land in the file. When `cat` runs, the "No such file or directory" error from `x` and the contents of `y` both end up in `hold`, in the order they were emitted.

Now flip the order:

```
cat x y 2>&1 > hold
```

Same operators, different order. The shell walks left to right again:

1. `2>&1` — duplicate fd 2 onto whatever fd 1 currently points to. Fd 1 is *still pointing at the terminal* at this moment, because we haven't redirected it yet. So fd 2 now also points to the terminal.
2. `> hold` — point fd 1 at `hold`. But fd 2 was already wired up in step 1; this redirection only moves fd 1.

Result: stdout goes to `hold`, but stderr is stuck on the terminal. The streams *split*, which is almost never what you want.

The mental model is simple once it clicks: `2>&1` doesn't say "merge stderr with stdout forever." It says "copy stderr's wiring to match stdout's wiring *as of this moment*." So you have to set up stdout's destination first, then duplicate.

> **Q:** A script does `myprog 2>&1 > log.txt` and you're surprised that errors still print to your terminal. What's wrong, and how do you fix it?
>
> **A:** The `2>&1` ran first, when stdout was still the terminal — so stderr was duplicated onto the terminal. Then `> log.txt` moved stdout (only) to the file. Swap the order: `myprog > log.txt 2>&1`. Now stdout goes to `log.txt` first, and `2>&1` copies that wiring onto stderr.

<svg viewBox="0 0 720 320" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrRD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Order matters — shell processes redirections left-to-right</text><rect x="20" y="40" width="320" height="240" class="box-ok" rx="6"></rect><text x="180" y="62" text-anchor="middle" class="label">RIGHT: cmd &gt; hold 2&gt;&amp;1</text><text x="180" y="86" text-anchor="middle" class="sub">step 1 — &gt; hold</text><rect x="40" y="100" width="60" height="30" class="box-accent" rx="3"></rect><text x="70" y="120" text-anchor="middle" class="sub">stdout</text><path d="M100 115 L200 115" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="200" y="100" width="120" height="30" class="box" rx="3"></rect><text x="260" y="120" text-anchor="middle" class="sub">hold (file)</text><rect x="40" y="140" width="60" height="30" class="box-bad" rx="3"></rect><text x="70" y="160" text-anchor="middle" class="sub">stderr</text><path d="M100 155 L200 155" class="arrow-line dashed"></path><rect x="200" y="140" width="120" height="30" class="box-warn" rx="3"></rect><text x="260" y="160" text-anchor="middle" class="sub">terminal (still)</text><text x="180" y="195" text-anchor="middle" class="sub">step 2 — 2&gt;&amp;1 copies CURRENT stdout target</text><rect x="40" y="210" width="60" height="30" class="box-bad" rx="3"></rect><text x="70" y="230" text-anchor="middle" class="sub">stderr</text><path d="M100 225 L200 225" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="200" y="210" width="120" height="30" class="box" rx="3"></rect><text x="260" y="230" text-anchor="middle" class="sub">hold (file)</text><text x="180" y="265" text-anchor="middle" class="sub">both streams land in hold ✓</text><rect x="380" y="40" width="320" height="240" class="box-bad" rx="6"></rect><text x="540" y="62" text-anchor="middle" class="label">WRONG: cmd 2&gt;&amp;1 &gt; hold</text><text x="540" y="86" text-anchor="middle" class="sub">step 1 — 2&gt;&amp;1 copies CURRENT stdout (terminal)</text><rect x="400" y="100" width="60" height="30" class="box-accent" rx="3"></rect><text x="430" y="120" text-anchor="middle" class="sub">stdout</text><path d="M460 115 L560 115" class="arrow-line dashed"></path><rect x="560" y="100" width="120" height="30" class="box-warn" rx="3"></rect><text x="620" y="120" text-anchor="middle" class="sub">terminal</text><rect x="400" y="140" width="60" height="30" class="box-bad" rx="3"></rect><text x="430" y="160" text-anchor="middle" class="sub">stderr</text><path d="M460 155 L560 155" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="560" y="140" width="120" height="30" class="box-warn" rx="3"></rect><text x="620" y="160" text-anchor="middle" class="sub">terminal (stuck)</text><text x="540" y="195" text-anchor="middle" class="sub">step 2 — &gt; hold redirects stdout only</text><rect x="400" y="210" width="60" height="30" class="box-accent" rx="3"></rect><text x="430" y="230" text-anchor="middle" class="sub">stdout</text><path d="M460 225 L560 225" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="560" y="210" width="120" height="30" class="box" rx="3"></rect><text x="620" y="230" text-anchor="middle" class="sub">hold (file)</text><text x="540" y="265" text-anchor="middle" class="sub">stderr STILL on terminal — split! ✗</text></svg>

> **Pitfall:** A pipe (`|`) only carries stdout. If you write `cmd | grep error` and `cmd` writes its errors to stderr, `grep` will never see them — they bypass the pipe and print on your terminal. To fold stderr into the pipe, write `cmd 2>&1 | grep error`. Note that here the `2>&1` *belongs* before the pipe, because the pipe sets up stdout's destination earlier in the parsing.

### `tee`: when you want to watch *and* save

Sometimes you need a stream to do two things at once — go to a file *and* keep flowing down a pipe so the next command can process it. The plumbing analogy is a T-shaped fitting: one input pipe, two outputs. The Unix command is named after the fitting.

```console
$ ls /etc | tee etc-list.txt | wc -l
213

$ head -3 etc-list.txt
alternatives
bash.bashrc
crontab
```

Read the pipeline left to right. `ls /etc` writes filenames to its stdout. `tee etc-list.txt` reads them on its stdin, writes them to `etc-list.txt`, *and* re-emits them on its own stdout. `wc -l` reads that stream and counts the lines (213). After the pipeline finishes, you have both the count on screen and the full list saved on disk. Use `tee -a file` if you want to append rather than overwrite, exactly like `>>` versus `>`.

<svg viewBox="0 0 720 220" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrTEE" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">ls /etc | tee etc-list.txt | wc -l</text><rect x="20" y="80" width="120" height="50" class="box" rx="5"></rect><text x="80" y="108" text-anchor="middle" class="label">ls /etc</text><path d="M140 105 L240 105" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="190" y="98" text-anchor="middle" class="sub">stdout</text><rect x="240" y="80" width="120" height="50" class="box-accent" rx="5"></rect><text x="300" y="108" text-anchor="middle" class="label">tee</text><text x="300" y="124" text-anchor="middle" class="sub">T-fitting</text><path d="M360 105 L460 105" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="410" y="98" text-anchor="middle" class="sub">stdout</text><rect x="460" y="80" width="120" height="50" class="box" rx="5"></rect><text x="520" y="108" text-anchor="middle" class="label">wc -l</text><path d="M580 105 L680 105" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="640" y="98" text-anchor="middle" class="sub">213</text><path d="M300 130 L300 170" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="316" y="155" class="sub">duplicate write</text><rect x="240" y="170" width="120" height="40" class="box-warn" rx="5"></rect><text x="300" y="195" text-anchor="middle" class="sub">etc-list.txt</text></svg>

> **Q:** What's `/dev/null`, and what does `cmd > /dev/null 2>&1` do?
>
> **A:** `/dev/null` is a special device file that throws away anything written to it (and returns immediate end-of-file when read). The redirection sends stdout to the bit-bucket, then duplicates that wiring onto stderr — so both streams are silently discarded. The command runs, but you see nothing on your terminal.

> **Takeaway:** Quoting controls *what the shell expands* before the command runs — single suppresses everything, double allows `$` and friends, bare invites all seven expansions. Redirection controls *where the command's three file descriptors point* before it launches — and the shell wires them up strictly left to right, which is why `> file 2>&1` captures both streams but `2>&1 > file` splits them. Internalize those two ordering rules and the whole midterm trap family collapses into one idea: the shell does its work *before* the command sees anything.
