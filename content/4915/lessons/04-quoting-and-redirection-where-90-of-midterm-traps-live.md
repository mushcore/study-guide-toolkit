---
"n": 4
id: 4915-lesson-quoting-and-redirection-where-90-of-midterm-traps-live
title: Quoting and redirection — where 90% of midterm traps live
hook: Get this right and you skip 5 MCQ/T-F pitfalls.
tags:
  - redirection
  - shell
module: Shell, redirection & text processing
---

**Motivation.** Midterm Q43, Q44, Q47, Q50 — all redirect/quote traps. Multiple T/F too. This lesson is straight MCQ points.

### Three quoting modes

##### Single `' '`

Suppresses **everything**. No expansions, no specials.

-   Literal text, full stop
-   Cannot contain a single quote
-   Use for: regexes, sed scripts, anything with `$` you want to keep

##### Double `" "`

Allows **$, $(…), backticks, \\**. Blocks word splitting + globbing.

-   Most-common choice
-   `"$var"` keeps spaces intact
-   Use for: almost anything with a variable

##### None

**All 7 expansions** apply including glob + word split.

-   Dangerous with user input
-   `rm $file` bare → whitespace blow-up
-   Use for: globs you *want* expanded

quoting: same variable, three outputs

```console
$ export person=jenny

$ echo '$person'        # single: literal
$person

$ echo "$person"        # double: expands
jenny

$ echo $person          # bare: expands + word splits + globs
jenny
```

Midterm Q47 *exactly*: single-quoted `$person` prints literal `$person`.

### Redirection — six forms you must know cold

##### Output side

-   `> file` — stdout to file, **CLOBBERS** silently
-   `>> file` — stdout append (never destroys)
-   `2> file` — stderr to file
-   `&> file` — both stdout + stderr to file (bash shortcut)
-   `2>&1` — merge stderr INTO current stdout target (order matters)
-   `| cmd` — stdout → next cmd's stdin

##### Input side + misc

-   `< file` — stdin from file
-   `<< EOF` — here-doc, multi-line literal
-   `<<< "str"` — here-string
-   `tee file` — duplicate: stdout AND file (see it *and* save it)
-   `tee -a file` — append via tee
-   `/dev/null` — the bit-bucket; redirect here to discard

Midterm Q43/Q44 — memorize this exact wording

`>` **silently destroys** an existing file — no warning, no prompt. "Redirection warns before overwrite" is **FALSE**. Set `set -o noclobber` to get a warning; bypass with `>|`.

> **Example**
> #### Walkthrough: `>` destroys on contact
>
> 1.  `echo "important data" > notes.txt` — file now contains one line.
> 2.  `cat notes.txt` → important data.
> 3.  `echo "oops" > notes.txt` — *no prompt, no error*. Old data gone.
> 4.  `cat notes.txt` → oops. The "important data" is unrecoverable from shell alone.
> 5.  Always use `>>` to append, or `set -o noclobber` to force the shell to refuse clobber.
>
> The instructor plants this. If a T/F says "redirection warns before overwriting" → FALSE.

> **Example**
> #### Walkthrough: `2>&1` — order matters (midterm Q50)
>
> 1.  Setup: file `x` does NOT exist; file `y` contains "This is y".
> 2.  **RIGHT order:** `cat x y > hold 2>&1`  
>     Shell reads L→R: first redirect stdout to `hold`, *then* redirect stderr to whatever stdout currently is (= `hold`). Both streams land in `hold`.
> 3.  `cat hold` → cat: x: No such file or directory This is y
> 4.  **WRONG order:** `cat x y 2>&1 > hold`  
>     Shell first makes stderr point at the terminal (current stdout), *then* redirects stdout to `hold`. Stderr is still stuck on the terminal.
> 5.  Terminal shows the error; `hold` contains only stdout. split.
>
> Mental rule: put `2>&1` AFTER `> file`. "First land stdout where you want; then copy stderr onto it."

<svg viewBox="0 0 720 320" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrRD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Order matters — shell processes redirections left-to-right</text><rect x="20" y="40" width="320" height="240" class="box-ok" rx="6"></rect><text x="180" y="62" text-anchor="middle" class="label">RIGHT: cmd &gt; hold 2&gt;&amp;1</text><text x="180" y="86" text-anchor="middle" class="sub">step 1 — &gt; hold</text><rect x="40" y="100" width="60" height="30" class="box-accent" rx="3"></rect><text x="70" y="120" text-anchor="middle" class="sub">stdout</text><path d="M100 115 L200 115" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="200" y="100" width="120" height="30" class="box" rx="3"></rect><text x="260" y="120" text-anchor="middle" class="sub">hold (file)</text><rect x="40" y="140" width="60" height="30" class="box-bad" rx="3"></rect><text x="70" y="160" text-anchor="middle" class="sub">stderr</text><path d="M100 155 L200 155" class="arrow-line dashed"></path><rect x="200" y="140" width="120" height="30" class="box-warn" rx="3"></rect><text x="260" y="160" text-anchor="middle" class="sub">terminal (still)</text><text x="180" y="195" text-anchor="middle" class="sub">step 2 — 2&gt;&amp;1 copies CURRENT stdout target</text><rect x="40" y="210" width="60" height="30" class="box-bad" rx="3"></rect><text x="70" y="230" text-anchor="middle" class="sub">stderr</text><path d="M100 225 L200 225" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="200" y="210" width="120" height="30" class="box" rx="3"></rect><text x="260" y="230" text-anchor="middle" class="sub">hold (file)</text><text x="180" y="265" text-anchor="middle" class="sub">both streams land in hold ✓</text><rect x="380" y="40" width="320" height="240" class="box-bad" rx="6"></rect><text x="540" y="62" text-anchor="middle" class="label">WRONG: cmd 2&gt;&amp;1 &gt; hold</text><text x="540" y="86" text-anchor="middle" class="sub">step 1 — 2&gt;&amp;1 copies CURRENT stdout (terminal)</text><rect x="400" y="100" width="60" height="30" class="box-accent" rx="3"></rect><text x="430" y="120" text-anchor="middle" class="sub">stdout</text><path d="M460 115 L560 115" class="arrow-line dashed"></path><rect x="560" y="100" width="120" height="30" class="box-warn" rx="3"></rect><text x="620" y="120" text-anchor="middle" class="sub">terminal</text><rect x="400" y="140" width="60" height="30" class="box-bad" rx="3"></rect><text x="430" y="160" text-anchor="middle" class="sub">stderr</text><path d="M460 155 L560 155" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="560" y="140" width="120" height="30" class="box-warn" rx="3"></rect><text x="620" y="160" text-anchor="middle" class="sub">terminal (stuck)</text><text x="540" y="195" text-anchor="middle" class="sub">step 2 — &gt; hold redirects stdout only</text><rect x="400" y="210" width="60" height="30" class="box-accent" rx="3"></rect><text x="430" y="230" text-anchor="middle" class="sub">stdout</text><path d="M460 225 L560 225" class="arrow-line" marker-end="url(#arrRD)"></path><rect x="560" y="210" width="120" height="30" class="box" rx="3"></rect><text x="620" y="230" text-anchor="middle" class="sub">hold (file)</text><text x="540" y="265" text-anchor="middle" class="sub">stderr STILL on terminal — split! ✗</text></svg>

tee — pipe and save at once

```console
$ ls /etc | tee etc-list.txt | wc -l
213

$ head -3 etc-list.txt
alternatives
bash.bashrc
crontab
```

`tee` = T-fitting. One input, two outputs: the file AND stdout (which continues down the pipe to `wc -l`).

<svg viewBox="0 0 720 220" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrTEE" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">ls /etc | tee etc-list.txt | wc -l</text><rect x="20" y="80" width="120" height="50" class="box" rx="5"></rect><text x="80" y="108" text-anchor="middle" class="label">ls /etc</text><path d="M140 105 L240 105" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="190" y="98" text-anchor="middle" class="sub">stdout</text><rect x="240" y="80" width="120" height="50" class="box-accent" rx="5"></rect><text x="300" y="108" text-anchor="middle" class="label">tee</text><text x="300" y="124" text-anchor="middle" class="sub">T-fitting</text><path d="M360 105 L460 105" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="410" y="98" text-anchor="middle" class="sub">stdout</text><rect x="460" y="80" width="120" height="50" class="box" rx="5"></rect><text x="520" y="108" text-anchor="middle" class="label">wc -l</text><path d="M580 105 L680 105" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="640" y="98" text-anchor="middle" class="sub">213</text><path d="M300 130 L300 170" class="arrow-line" marker-end="url(#arrTEE)"></path><text x="316" y="155" class="sub">duplicate write</text><rect x="240" y="170" width="120" height="40" class="box-warn" rx="5"></rect><text x="300" y="195" text-anchor="middle" class="sub">etc-list.txt</text></svg>

Check: `person=jenny; echo '$person'` prints what?Literal `$person`. Single quotes suppress parameter expansion. (Midterm Q47.) Check: `cmd > outfile 2> errfile` does what?Stdout goes to `outfile`, stderr goes to `errfile` — two separate files, no merge. (Midterm Q10, sample Q7.) Check: What's the name and path of the Linux bit-bucket?`/dev/null`. Write-only sink that discards everything; read gives EOF. Use as `cmd > /dev/null 2>&1` to silence a command. (Midterm Q48.)

Sources: Mod01 Ch5 · midterm Q10, Q43, Q44, Q47, Q48, Q50 · Review Apr 17
