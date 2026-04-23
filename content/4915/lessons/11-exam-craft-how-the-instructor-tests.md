---
"n": 11
id: 4915-lesson-exam-craft-how-the-instructor-tests
title: Exam craft — how the final tests
hook: Meta-lesson. Use it in the exam room.
tags:
  - linux
module: Misc / editors / misc topics
source: "materials/past-exams/midterm.md + comp4915_quiz3.md + comp4915_quiz4.md"
related: [4915-topic-exam-strategy-and-pitfalls, 4915-topic-exam-study-priorities-apr-17, 4915-topic-quoting-rules, 4915-topic-redirection-pipes, 4915-topic-permissions-chmod-umask]
---

Here are three questions pulled directly from the midterm. Commit to an answer for each before reading further — fix it in your head:

**Q8.** The Linux command that displays the system manual for most utilities is called:
A) `disp` &nbsp; B) `info` &nbsp; C) `man` &nbsp; D) `mozilla` &nbsp; E) `sysman`

**Q16.** How do you make jack the owner of all files under `/home/jack/candy`?
A) `chown -changes jack /home/jack/candy` &nbsp; B) `chown -R jack /home/jack/candy` &nbsp; C) `chmod u+rwx /home/jack/candy` &nbsp; D) `chown -r jack /home/jack/candy` &nbsp; E) `chmod a+rwx jack /home/jack/candy`

**Q43.** One of the nice things about Unix is that if you accidentally try to overwrite a file using redirection, you will get a warning so you will not lose data.
True / False

Hold those answers. Now for the harder question: **what do these three have in common structurally?** They test three completely different topics — man pages, `chown` flags, redirection. But the mechanism that trips people in each one is the same kind of trap. And that trap appears, in some form, in almost every MCQ and T/F on the exam.

## The exam is a finite set of molds

The midterm isn't random. Across the 37 MCQs, 10 T/F questions, and 10 short-answer questions, the traps fall into five families that repeat across every module. Once you can name the family, you've defused the question's hardest part — what remains is whether you know the underlying fact.

This also changes how you budget time. The 100-minute exam carries 144 marks: 74 in MCQs (2 marks each), 10 in T/F (1 mark each), 30 in short answer (3 marks each), and 30 in essays (10 marks each). One MCQ is worth 2 marks. One essay is worth 10 — the same as five MCQs. The students who run out of time spend 5–6 minutes wrestling with one MCQ they've never seen and arrive at the essays with 8 minutes left. Knowing the trap families is how you read a question in 30 seconds and move on.

## Trap family 1 — fake command names

Q8 is the cleanest example. The five options are `disp`, `info`, `man`, `mozilla`, `sysman`. Three of them — `disp`, `mozilla`, `sysman` — are not Linux commands. They're invented noise. `mozilla` is a browser; `sysman` and `disp` don't exist in the standard toolset. `info` is real (it's a GNU documentation viewer), but it's not the command that covers "most utilities" — `man` is. Two genuine commands, one correct, two distractors that sound authoritative, two that are pure invention.

This pattern reappears on every test. Q33 in the same midterm asks which command changes your login shell; the options include `newsh`, `chngsh`, `chlg`, `cs`, and `chsh`. The recognition rule: if you've never typed an option and can't connect it to a naming pattern, the prior probability that it's fake is high. You don't need to know every command — you need to recognize the real ones and eliminate the rest.

> **Q:** The options for "which command changes your login shell?" are: `newsh`, `chngsh`, `chlg`, `cs`, `chsh`. Three are invented. Which is real, and how do you eliminate the others?
>
> **A:** `chsh` (E). It follows the same pattern as `chown` (change owner), `chmod` (change mode), `chgrp` (change group) — two-letter prefix meaning "change," followed by a one- or two-letter abbreviation for what's being changed. None of the others match that pattern or appear in any lab or module. When you see a cluster of options, look for the one that fits a known naming convention; the rest are filler.

## Trap family 2 — flag-case swaps and near-miss syntax

Q6 and Q16 both belong here. The wrong options look almost right — they differ by exactly one character, one flag, or one argument position.

For Q6 (`find`): option A is `find -name foo` — missing the required path argument. Option D is `find / foo` — has the path but is missing the `-name` flag. Option C, `find / -name foo`, is correct: path first, then the flag, then the argument. If you have this command memorized precisely, you pick C in under 10 seconds. If you're fuzzy, options A and C look nearly identical.

For Q16 (`chown`): options B and D are `chown -R jack` versus `chown -r jack`. Linux flags are case-sensitive. `-R` is the recursive flag for `chown`; `-r` is not a valid `chown` flag on modern Linux. The same trap appears with `grep -v` (invert match) versus `grep -w` (match whole word) — both are real flags, but only one answers "search *for* the word superman." The heuristic: when two options differ by only a flag or its case, explicitly ask yourself what each flag does before picking.

> **Q:** Two options for a `grep` question are: B) `grep -v superman SuperHeroes` and D) `grep superman SuperHeroes`. The question asks you to search *for* the word "superman". Which is correct, and why is B a trap?
>
> **A:** D. The `-v` flag inverts the match — it prints every line that does *not* contain "superman." Option B is a near-miss: it looks like "verbose" or "verify" to someone who only half-remembers the flag. The exam regularly pairs a bare command with a flagged variant when the flag means the opposite of what you want. When you see that pairing, ask what the flag does before selecting it.

## Trap family 3 — T/F with "always", "warns", "only", "never"

Q43 is the canonical instance. The statement says you "will get a warning" before `>` overwrites a file. The answer is **FALSE** — `>` silently truncates at parse time, before the command even runs. Q44 is the exact mirror: "redirecting output to a file *can* destroy an existing file without error messages" — **TRUE**. These two appear back-to-back in the midterm because students who answer Q43 wrong tend to contradict themselves on Q44.

The tell for this family is a modal word in the stem: "always", "never", "warns", "prompts", "only", "automatically". Universal claims are almost always false on this exam; qualified claims are usually true. A statement that says the system *does something protective by default* — warns you, asks for confirmation, refuses to overwrite — is almost always the trap. Unix tools are designed for pipelines and scripts; they do not hold your hand.

> **Q:** T/F: `>` warns before overwriting an existing file.
>
> **A:** FALSE. `>` silently clobbers the destination the moment the shell parses the line — before the command runs, before you can stop it. The old file content is gone immediately. To prevent accidental clobbering you must explicitly enable `set -o noclobber`; then the shell rejects `>` on existing files and you use `>|` to force an overwrite. This is Q43 in the midterm; the word "warns" is the bait — no warning is issued under any default configuration.

## Trap family 4 — concept-definition precision

MCQs on `PPID`, `FQDN`, `PAM`, `bit-bucket`, `superuser`, and similar terms test the exact definition, not a rough paraphrase. Q26 asks what PPID stands for; the five options are "person process ID," "protected process ID," "private process ID," "protected parent ID," and "parent process ID." All five are plausible-sounding. Only E is correct: **parent process ID**.

The distinction matters technically: the *parent* is the process that called `fork()` to create the current process. When you run a command from bash, bash is the parent; the command is the child. `$PPID` in a script is the PID of the shell that launched the script — not any other kind of "protected" or "private" relationship. For Q30 (`FQDN`): the answer is "fully qualified hostname," not just "hostname" — `odyssey.infosys.bcit.ca` is the FQDN; `odyssey` alone is just the hostname.

For this family, paraphrase fails. "PPID means parent" is recoverable; "PPID means parent process ID" is the exact answer the mark scheme checks.

> **Q:** Quiz 3 Q5 asks: "In bash, what exit status indicates success?" Options include "0", "1", "anything nonzero, but 1 is the convention", and "-1". Which is correct and why does option A exist as a trap?
>
> **A:** **0**. By Unix convention, a process exits 0 to signal success and any nonzero value to signal an error. The shell stores this in `$?`. Option A ("anything nonzero, but 1 is the convention") has the polarity exactly backwards — it's the answer for a student who remembers "0 is false in most programming languages" and mistakenly maps that to exit codes. The trap works because it sounds like a careful, nuanced answer.

## Trap family 5 — short-answer exactness

Short-answer questions require exact output or exact command syntax. The instruction on the midterm cover sheet is explicit: each short answer is worth 3 marks, and the answer key shows precise strings.

**Q50** — the redirection output question. After running `cat x y 1>hold 2>&1` where `x` doesn't exist and `y` contains "This is y", what does `cat hold` show? The answer is both the error *and* the file contents:

```
cat: x: No such file or directory
This is y
```

The shell processes `1>hold` first (stdout goes to the file), then `2>&1` (stderr is duplicated onto whatever stdout currently points to — the file). Both streams land in `hold`, in emission order. If the operators were reversed — `2>&1 1>hold` — stderr would be wired to the terminal first, and then only stdout would move to the file. The wrong answers here are: "just the error message," "just the file contents," or "nothing, because x doesn't exist." All three are partial truths. The exact answer is both lines in the order they were emitted.

**Q56/Q57** — glob matching. The directory contains `libby1.jpg` through `libby12.jpg` and `libby1.txt`.

- `libby1*.jpg` matches `libby1.jpg`, `libby10.jpg`, `libby11.jpg`, `libby12.jpg` — every `.jpg` file whose name begins with `libby1`. The `*` matches zero or more characters, so `libby1.jpg` itself (zero extra characters after `libby1`) is included.
- `libby[6-8].jpg` matches exactly `libby6.jpg`, `libby7.jpg`, `libby8.jpg` — character class `[6-8]` matches exactly one character in the range 6–8, so `libby10.jpg` is excluded.

> **Q:** Which files does `libby1*.jpg` match from `libby1.jpg` through `libby12.jpg` plus `libby1.txt`?
>
> **A:** `libby1.jpg`, `libby10.jpg`, `libby11.jpg`, `libby12.jpg`. The `*` matches zero or more characters, so `libby1.jpg` is included (the `*` matches the empty string). `libby1.txt` is excluded because `.jpg` doesn't match `.txt`. The common wrong answer is "libby10, 11, 12 only" — students read `1*` as "1 followed by at least one more character," but `*` explicitly allows zero characters.

## Essays: what the mark scheme rewards

The three essay questions are worth 10 marks each — the same as five MCQs combined. A rough but complete answer here is worth far more than the MCQ you've been staring at for four minutes.

**Q58 — compare/contrast hard and soft links**: The mark scheme rewards structural coverage. Use parallel bullets or a two-column layout, one row per dimension: how it's created (`ln` vs `ln -s`), what happens when the original is deleted (hard link survives because it points to the inode; soft link breaks because it points to the path), whether it works across filesystems (hard: same filesystem only; soft: any path), what `ls -l` shows (hard link shares the inode number with the original; soft link shows an `->` arrow), and whether directories can be linked (hard: generally not allowed; soft: yes). Five dimensions, five marks, one per covered point.

**Q59 — write a script**: Three things the mark scheme checks: the `#!/bin/bash` shebang on line 1 (without it the script is "incomplete" in the instructor's rubric), command substitution with `$(pwd)` to capture the working directory, and quoting: `echo "Your working directory is $(pwd)"`. The double quotes keep the path intact if it contains spaces. One line of code is the entire answer.

**Q60 — write a function**: The target answer is `ps aux | grep "$1"` wrapped in a function body. Two mark-bearing details: quote `$1` so the argument survives word splitting, and use `ps aux` — not bare `ps` — because the question specifies the full process list.

## The time plan that consistently works

You have 100 minutes and 144 marks — just under 42 seconds per mark. The allocation that lets you finish:

- **MCQs (40 min)**: 1.5 minutes average per question. Any MCQ that runs past 2 minutes gets your best guess and a flag; you return to it in the buffer.
- **T/F (8 min)**: These should be under 45 seconds each if you've internalized the trap families.
- **Short answer (25 min)**: 3 minutes each. The answer is exact — don't over-explain.
- **Essays (22 min)**: Spend 7 minutes on the compare/contrast (the structure carries it), 5 minutes on the one-liner script, 10 minutes on the function with a brief explanation.
- **Buffer (5 min)**: Return to flagged MCQs only. Write a guess for anything still open.

The students who miss this timeline sacrifice essay time to rescue a stuck MCQ. One MCQ is worth 2 marks. One essay with a rough outline is worth 5–6 marks.

> **Pitfall**: Leaving MCQs blank costs you nothing extra — there is no negative marking. If you've spent more than 90 seconds on a question, write down your best guess, flag it in the margin, and keep moving. With five options you can almost always eliminate two on pure logic (fake command names, impossible flag values), which puts you at 33–50% odds on the remainder. An informed guess beats a blank every time, and the 5-minute buffer at the end is for returning to flags — not for staring at a question you still don't know cold.

> **Takeaway**: The midterm draws from five trap families — fake command names, flag-case swaps, T/F universal-claim bait, concept-definition precision, and exact-syntax short answers — and they repeat across every module. Recognizing the family costs two seconds; not recognizing it can cost four minutes. Budget 40 minutes for MCQs, 25 for short answers, and 22 for essays; never sacrifice an essay to rescue a stuck MCQ.
