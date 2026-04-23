# Enrichment plan — 4915

Date: 2026-04-22
Target: content/4915/ → current content/STANDARDS.md
Based on:
- `content/4915/audit-report.md` (2026-04-22) — 402 critical / 337 warning / 43 advisory findings
- `courses/COMP4915/materials/past-exams/` — `midterm.md` (349 lines, 144 marks over 100 min), `comp4915_quiz3.md`, `comp4915_quiz4.md`, `Comp4915 Review.pdf`, `Comp4915MidtermSamp.PDF`
- `courses/COMP4915/generated/exam-study/research-mod{01-02,03-04,05-06,07-08,09-10ab,10ce-review}.md`
- `courses/COMP4915/graphify-out/GRAPH_REPORT.md` — god-nodes: Kubernetes, Kubelet, cgroups, BIND, hard-link, inode, grep, umask/chmod, bash-variables, run-level-3, namespaces, pod, iptables, SSH, systemctl
- `courses/COMP4915/materials/slides/Mod{01..10}*.pdf`, `materials/labs/Lab{1..10}.pdf`

## Summary

| Category | Patches | Severity |
|---|---|---|
| A. Hard-gate critical (source, retrieval, pitfall, rationale, scope) | 12 | Critical |
| B. Per-course required artifacts (strategy dive, diagram code-practice, pretest) | 5 | Mostly Critical |
| C. Enrichment fields (explanation, example, bloom, Takeaway) | 7 | Warning / Advisory |
| D. Dual coding (mermaid on 13 visual dives) | 8 | Warning |
| E. Bloom's + concept variability (Apply cards, mock variants, code-practice variants) | 3 | Warning |
| F. Interconnection (`related:` + synthesis Qs) | 3 | Advisory |
| G. Peer polish (instructor-authority framing, hedges, renames) | 4 | Warning |
| **Total** | **42** | |

**Estimated author-hours to ship**: ~32–42 h.

- Critical source-discipline sweep (A1–A5): ~5 h (bulk topic-level + frontmatter fields + inherited tagging).
- Critical content fixes (A6–A12, B1–B5): ~14 h (rationale rewrites are the heaviest — 6 h alone).
- Warning enrichment (C-bulk sweeps + godnode drafts + diagrams): ~12–16 h.
- Advisory + interconnection + polish (E/F/G): ~5–7 h.

**Leverage point**: A1–A5 + A7–A10 + B1 together unblock `/add-course`. Everything after is quality/transfer. The single highest-value advisory item is D (dual-coding mermaid on 8 visual dives) because each diagram pays back over every future view.

## Apply in this order

Each item is concrete. Top-down: critical → warning → advisory, and within severity by author-minute leverage (bulk before per-unit, required artifacts before per-card polish). Sub-agent raw outputs with every draft are embedded; copy-paste ready.

---

### 1. Bulk-add `source:` to 73 flashcard topics
- Category: A
- STANDARDS principle: §Source discipline (RAG grounding); §Hard gates §1
- File(s): `content/4915/flashcards.yaml` — every topic (~73 topics, ~1200 lines)
- Current state: Zero topic-level or card-level `source:` field. 193/193 cards uncited.
- Proposed change: Add `source:` at topic level (cards inherit). Map topic → slide deck + chapter + past-exam Q# when applicable. Representative pattern:
  - filesystem/inode/permissions topics → `source: Mod02 Ch6/Ch7, materials/past-exams/midterm.md Q{16,21,24,32,58}`
  - quoting → `source: Mod04 Ch12, materials/past-exams/midterm.md Q{17,47}`
  - redirection → `source: Mod04 Ch11, materials/past-exams/midterm.md Q{10,43,44,50}`
  - shell expansions / special params → `source: Mod04 Ch9, materials/past-exams/midterm.md Q59, Q60`
  - admin/boot/runlevels → `source: Mod05 Ch10-11, materials/past-exams/midterm.md Q35`
  - DNS/iptables/Apache → `source: Mod08 Ch24/25/26 + Lab 3/8`
  - sendmail/NFS/Samba/NIS/LDAP → `source: Mod07 Ch20-23 + Lab 7`
  - cgroups/namespaces/pods/K8s → `source: Mod10{A,B,C,D,E} + Lab 9/10, courses/COMP4915/generated/exam-study/research-mod10ce-review.md`
- Source for new content: Cross-reference topic `name` to slide deck filename under `materials/slides/` + past-exam Q ids from audit blocker #1.
- Rationale: Single biggest blocker. Topic-level inheritance amortises 193 per-card edits into ~73 targeted edits.

---

### 2. Bulk-add `source:` to 73 mock-exam questions
- Category: A
- STANDARDS principle: §Source discipline; §Hard gates §1
- File(s): `content/4915/mock-exam.yaml`
- Current state: Every question has `rationale:` citing "(Midterm Qx)" inline, but no structured `source:` field.
- Proposed change: Promote inline citations to `source:` field on each question. Pattern:
  - q1–q12: audit identifies these as midterm-derived — cite `materials/past-exams/midterm.md Q{mapped}`.
  - q13–q25, q34 (T/F): Mod05-08 + `comp4915_quiz3.md` / `quiz4.md` where rationale currently says "Quiz 3 Q4" etc.
  - q26–q51: topical (Mod03-08).
  - q52–q65: Mod09-10 + Lab 7/10.
  - q66–q69 (T/F): cite the quiz that drove each (audit lists them as "instructor-authority-only").
  - q70–q73: cite past-exam combination + slides.
- Source: Extract locator from each question's existing `rationale:` text; for novel Qs, map `topic:` field to Mod slides.
- Rationale: Hard gate; audit counts all 73 as criticals.

---

### 3. Bulk-add `source:` frontmatter to all 52 lesson/dive/code-practice files
- Category: A
- STANDARDS principle: §Source discipline; §Hard gates §1
- File(s): 11 `lessons/*.md`, 29 `topic-dives/*.md`, 12 `code-practice/*.md`
- Current state: Frontmatter exists; zero `source:` field. Dives already carry `chapter:` (e.g. `chapter: Mod08 Ch24`) — copy that value to a new `source:` field and augment with past-exam refs where applicable.
- Proposed change: Add one YAML line per file. Representative mapping:
  - `lessons/01..11`: `source: Mod01..Mod10` (one per lesson; lesson 04 adds `+ midterm.md Q43,Q44,Q47,Q50`; lesson 05 adds `+ midterm.md Q59,Q60`).
  - `topic-dives/*`: copy existing `chapter:` into `source:`; augment permissions/quoting/inode/redirection dives with midterm locators.
  - `code-practice/01..12` (minus 03 flagged for deletion): lab + slide references per audit Pass 5 notes.
- Source: Existing frontmatter + `materials/slides/Mod*.pdf` titles + labs.
- Rationale: Hard gate; no frontmatter currently qualifies.

---

### 4. DELETE `topic-dives/bash-function-vs-c-function-instructor-will-ask.md`
- Category: A (Scope §Block 8)
- STANDARDS principle: §Source discipline; §Peer-shareability
- File(s): `content/4915/topic-dives/bash-function-vs-c-function-instructor-will-ask.md` — remove entire file
- Current state: Asserts "instructor said exam WILL have you write a C function". No materials support this claim.
- Proposed change: Delete the file. Also remove any `related:` references to its id elsewhere (lesson 05, shell-scripting-essentials dive per Cat F).
- Source verification: `materials/past-exams/midterm.md:349` — Q60 asks for a **bash** function, not C. No lab, no quiz, no slide deck requires C code.
- Rationale: Fabricated scope misleads learners. Delete is the only correct fix; partial rewrite preserves the unsupported framing.

---

### 5. DELETE `code-practice/03-c-function-vs-bash-function-instructor-emphasis.md`
- Category: A (Scope §Block 8)
- STANDARDS principle: §Source discipline; §Peer-shareability
- File(s): `content/4915/code-practice/03-c-function-vs-bash-function-instructor-emphasis.md` — remove entire file
- Current state: Implements the C-vs-bash comparison as a practice exercise.
- Proposed change: Delete. Renumber subsequent code-practice files (`04` → `03`, `05` → `04`, etc.) OR insert a new file at slot 03 to preserve numbering (see patch 14).
- Source verification: same as patch 4.
- Rationale: Scope correction.

---

### 6. Strip C-programming content from `lessons/05-bash-scripting-essentials-only-as-deep-as-the-exam-requires.md`
- Category: A (Scope §Block 8) + G (peer polish bundled)
- STANDARDS principle: §Source discipline; §Peer-shareability
- File(s): `content/4915/lessons/05-*.md` — lines 5–6, 13, 40, 98–148 (C/bash mermaid + pitfall), 116, 147
- Current state: Hook claims "AND a C function"; body (line 13) asserts instructor promise; lines ~98–148 compare C function signatures to bash.
- Proposed change (detailed):
  - **Lines 5–6**: Drop "AND a C function" from hook. Replace: "You will write a small script or function. This lesson covers what to write on the exam."
  - **Line 13**: Delete instructor-promise sentence. Replace with: "Two critical distinctions: (1) the seven special parameters `$0 $# $@ $* $? $! $$`, and (2) the bash-function form `name() { body; }` with args via `$1..$n`."
  - **Line 40**: Reframe instructor-authority → "Every graded script requires a shebang and comments — worth marks on all assessments."
  - **Lines ~98–148**: Delete the "### C vs bash functions" section entirely. Replace with a bash-only section: `### Functions in bash` covering `name() { body; }` syntax, args via `$1..$9` + `${10}+`, `$#`, `"$@"`, `$?`, exit status 0–255, stdout as output mechanism. Source: `materials/labs/Lab9.pdf` + `Mod09 Ch28`.
  - **Pitfall callout** (currently comparing C declaration order to bash): replace with bash-specific trap: "**Pitfall**: omitting quotes around `"$@"` in a function — whitespace in any single argument will split it into multiple tokens downstream."
- Source: `materials/labs/Lab9.pdf` + `materials/slides/Mod09 Ch28.pdf`.
- Rationale: Scope correction. Refocuses lesson on what the exam actually tests.

---

### 7. Rewrite/remove 5 C-referencing cards in `flashcards.yaml`
- Category: A (Scope §Block 8)
- STANDARDS principle: §Source discipline
- File(s): `flashcards.yaml` lines ~976, 994, 1022, 1025, 1073 (per audit)
- Current state: ~5 cards or topic-prose lines reference C function syntax or "bash vs C" comparison.
- Proposed change:
  - Delete cards explicitly testing the C-vs-bash distinction (e.g. "Key difference between bash and C function definitions?").
  - For topic-prose lines mentioning C, strip the C phrase. Example: "Bash function syntax — differs from C by not requiring formal parameters" → "Bash function syntax — arguments passed via `$1..$n`; no formal parameter list in the definition."
- Source: `materials/labs/Lab9.pdf` for bash-only authoritative wording.
- Rationale: Scope; every surviving card must trace to a materials locator without C content.

---

### 8. NEW `topic-dives/exam-strategy-and-pitfalls.md` (required artifact)
- Category: B (absorbs A #24 + G-10 rename logic)
- STANDARDS principle: §Per-course required artifacts §1; §Hard gates
- File(s): `content/4915/topic-dives/exam-strategy-and-pitfalls.md` — NEW
- Current state: Does not exist. `instructor-review-class-confirmed-on-exam-items-apr-17.md` partially covers the ground but is instructor-authority-framed; the new dive supersedes it.
- Proposed change: Author the file with this skeleton (drop-in, lightly edit):

```markdown
---
id: 4915-topic-exam-strategy-and-pitfalls
title: "Exam strategy and top pitfalls"
pillar: tech
priority: high
tags: [exam-prep, strategy]
source: "materials/past-exams/midterm.md + comp4915_quiz3.md + comp4915_quiz4.md; research-mod10ce-review.md"
bloom_levels: [remember, understand, apply]
related: [4915-topic-quoting-rules, 4915-topic-redirection-pipes, 4915-topic-permissions-chmod-umask, 4915-topic-inode-hard-vs-soft-links, 4915-topic-boot-sequence-run-levels-memorize, 4915-topic-control-plane-node-components]
---

> **Hook**: Midterm was 144 marks in 100 min (1.4 marks/min). Final follows the same cadence. Every minute spent on exam craft beats another minute rereading a slide deck.

## Time allocation (100 min; exam follows midterm mark scheme)

| Type | Marks each | Questions | Budget |
|---|---|---|---|
| MCQ | 2 | ~37 | ~50 min (80 s/q) |
| T/F | 1 | ~10 | ~5 min |
| SHORT | 3 | ~7 | ~20 min |
| ESSAY | 10 | ~3 | ~20 min |
| **Buffer** | | | ~5 min |

Allocate by marks-per-minute: essays are the highest-leverage block. Skip any MCQ you've spent >1 min on; return after SHORT/ESSAY.

## Top 5 pitfalls (ranked by frequency in past exams)

### 1. Quoting — single vs double vs bare (midterm Q17, Q47)
Single quotes: literal, no expansion. Double quotes: `$var`, `` `cmd` ``, `$(cmd)`, `\` are expanded. Bare: all 7 expansions fire.

**Drill**: `person=jenny; echo '$person'` → `$person`. `echo "$person"` → `jenny`.

### 2. Redirection order — `>file 2>&1` not `2>&1 >file` (midterm Q10, Q50)
`2>&1` duplicates the current binding of fd 1. If stdout hasn't been redirected yet, `2>&1` points stderr at the terminal, not the file.

**Correct**: `cmd >out 2>&1` (both → out). **Wrong**: `cmd 2>&1 >out` (stdout → out, stderr → terminal).

### 3. `chown -R` (capital R), not `-r` (midterm Q16)
Every other recursive tool uses lowercase `-r` (grep, cp, ls). `chown` (and `chgrp`) uses capital `-R`. `-r` is not a valid chown flag.

### 4. Runlevel 3 vs 5 (midterm Q35)
3 = multi-user text. 5 = multi-user graphical. Default server = 3; default desktop = 5. `systemctl get-default` shows current target.

### 5. Hard vs soft links (midterm Q24, Q32, Q58 essay)
Hard link shares inode → can't cross filesystems → survives original deletion.
Soft link stores a pathname as data → can cross filesystems → dangles on target deletion → `ls -l` shows `lrwxrwxrwx` regardless of target.

## When to skip and return

- MCQ stuck >1 min → flag, move on. Return last 10 min.
- T/F: always guess (1 mark for 30 s).
- SHORT: write partial even if unsure — 1 mark > blank.
- ESSAY: outline first (2 min), then flesh out. Even a rough structure scores 5–6/10.

## Exam-day order
1. Scan all questions (~2 min).
2. Easy MCQs.
3. T/F (warm, fast).
4. Medium MCQs.
5. SHORT.
6. ESSAY (allocate 7 min each).
7. Hard/skipped MCQs.
8. Proofread (~5 min).

> **Takeaway**: The exam rewards finishing over perfection. Budget by mark-per-minute, skip stuck MCQs, write partial essays. Know the five pitfalls cold — one sentence each, recited before you sit down.
```

- Source: audit blocker #2 pitfall list + `materials/past-exams/midterm.md` mark scheme + `research-mod10ce-review.md`.
- Rationale: Highest-ROI artifact per STANDARDS. Currently missing; blocker.

---

### 9. Rewrite 31 verification-only mock-exam rationales
- Category: A
- STANDARDS principle: §Elaborated feedback (Shute 2008); §Hard gates §5
- File(s): `content/4915/mock-exam.yaml` — rationales on q2, q3, q5, q7–q12, q15–q25, q34, q52–q69
- Current state: Rationales are 1–2 sentences, verification-only, or cite instructor authority without mechanism. Examples:
  - q2: "`man`. The rest are distractors."
  - q5: "stdout=fd1 (> alone), stderr=fd2. (Midterm Q10.)"
  - q7: "chown -R (capital R) recursive. Lowercase -r is invalid."
  - q34 (T/F): "TRUE. (Sample Q8, Quiz 3 Q4.)"
  - q66 (T/F): "FALSE. Instructor: 'Don't need to know perl.'"
- Proposed change: Rewrite each so rationale covers (a) mechanism of correct answer + (b) specific misconception each distractor targets. Exemplar rewrites (apply pattern to all 31):
  - **q2** → "`man` is the canonical man-page viewer. `info` is GNU's alternative (not standard for all utilities). `disp` and `sysman` don't exist. `mozilla` is a browser — not a doc viewer."
  - **q5** → "Correct: stdout to outfile via `>` (equivalent to `1>`), stderr to errfile via `2>`. (A) correct. (B) `0>` redirects fd 0 (stdin), not fd 2. (C) `1>errfile` redirects stdout, so outfile never gets it. (D) `<` is input redirection. (E) swaps targets."
  - **q34 (T/F)** → "TRUE. Bash ignores any line starting with `#` (except the shebang). Wrong reading: confusing `#` with `$` (param prefix) or `!` (history)."
  - **q66 (T/F)** → "FALSE. The exam covers bash, system admin, and K8s; Perl is not on the syllabus. Wrong reading: 'scripting' means 'all scripting languages' — the syllabus is specific."
- Source: `materials/past-exams/{midterm,comp4915_quiz3,comp4915_quiz4}.md` for distractor-targeting context; slide decks for mechanism wording.
- Rationale: Hard gate. Verification-only rationale fails hypercorrection (Metcalfe 2017) — wrong answers need the misconception named so the correction sticks.

---

### 10. Add `**Pitfall**` callout to 26 non-trivial topic-dives
- Category: A
- STANDARDS principle: §Elaborated feedback; §Hard gates §4
- File(s): 26 dives named in audit blocker #4 (every dive except `linux-unix-history-vague-ok.md`, `archives-compression.md`, and the deleted `bash-function-vs-c-function-…`)
- Current state: Zero `**Pitfall**` callouts across these dives.
- Proposed change: Append one `**Pitfall**` callout to each dive naming the most common misconception. Representative drafts (apply pattern to the rest):
  - **permissions-chmod-umask**: "`chmod 755` sets perms *absolutely* — wipes any other bits. `chmod +x` only *adds* the execute bit. Using 755 when you meant +x strips write permission from group/other."
  - **iptables-netfilter**: "ACCEPT is terminal for that chain — evaluation stops on first match. Reordering rules changes behaviour. Common fail: `-A` appends after a terminal rule, making the new rule unreachable."
  - **redirection-pipes**: "`cmd 2>&1 | tee file` merges stderr into the pipe. `cmd | tee file 2>&1` does not — stderr bypasses the pipe because `2>&1` runs *after* `|` sets up stdout."
  - **quoting-rules**: "`'don\'t'` does NOT escape. Single quotes are literal, including backslashes. Use `"don't"` or `$'don\'t'`."
  - **ssh-keys-tunneling**: "In `ssh -L 5432:localhost:5432 user@bastion`, `localhost` is evaluated on **bastion**, not your laptop. To reach a different host from bastion's network, use that host's name."
  - **inode-hard-vs-soft-links**: "Hard links cannot cross filesystems — inode numbers are per-FS. `ln /mnt/usb/file ~/link` errors out. Soft links work: `ln -s /mnt/usb/file ~/link`."
  - **pod-architecture-pause-container**: "The pause container does not run your application code — it only holds NET/IPC/UTS namespaces open. Killing pause tears down the pod's network identity."
  - **cgroups-qos-classes**: "QoS class is derived from the spec, not set manually. Guaranteed requires limits == requests for every resource on every container; miss one → Burstable."
  - **dns-bind**: "Edit zone file → must `rndc reload` or restart `named`; editing on disk doesn't propagate."
  - **boot-sequence-run-levels-memorize**: "`systemctl set-default` changes the *default* target. A live `systemctl isolate multi-user.target` switches runlevels now but doesn't persist across reboot."
  - (18 more dives follow the same pattern — one pitfall per dive, rooted in the past-exam solution key or common instructor-flagged error.)
- Source: `materials/past-exams/{midterm,quiz3,quiz4}.md` solution patterns + `research-mod0*.md` flagged errors.
- Rationale: Hard gate. Each non-trivial dive must carry ≥1 pitfall.

---

### 11. Add `**Example**` callout to 8 problem-solving dives
- Category: A
- STANDARDS principle: §Worked-example effect (Sweller & Cooper 1985); §Hard gates §3
- File(s): `topic-dives/{apache-httpd, cgroups-qos-classes, cni-services, control-plane-node-components, iptables-netfilter, permissions-chmod-umask, pod-architecture-pause-container, ssh-keys-tunneling}.md`
- Current state: No `**Example**` callout with step-by-step reasoning. (The 6 dives listed in audit §Strengths — dns-bind, linux-namespaces, nfs, nis-ldap, samba, sendmail-mta — already have proper examples; use them as templates.)
- Proposed change: Append an `**Example**` callout with 5–10-line step-by-step trace. Drafts for the 2 highest-leverage:
  - **permissions-chmod-umask**:
    ```
    > **Example** — umask 027 → new file and dir perms
    > 1. File default: 666. Directory default: 777.
    > 2. umask = 027 (mask out w for group, rwx for other).
    > 3. File perms: 666 & ~027 = 640 (rw-r-----).
    > 4. Dir perms: 777 & ~027 = 750 (rwxr-x---).
    > 5. Verify: `umask 027; touch t.txt; ls -l t.txt` → `-rw-r-----`.
    > 6. Verify: `mkdir td; ls -ld td` → `drwxr-x---`.
    ```
  - **iptables-netfilter**:
    ```
    > **Example** — default-deny INPUT with explicit allows
    > 1. `iptables -P INPUT DROP`                              # default deny
    > 2. `iptables -A INPUT -i lo -j ACCEPT`                   # loopback
    > 3. `iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT`
    > 4. `iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT`
    > 5. `iptables -A INPUT -p tcp --dport 80 -j ACCEPT`
    > 6. Trace SSH from 10.0.0.5: matches rule 4 → ACCEPT.
    > 7. Trace SSH from 8.8.8.8: rule 4 misses (src), no later match → default DROP.
    ```
  - Drafts for control-plane (component graph + bind/watch sequence), ssh-keys-tunneling (`-L` forward trace), cgroups-qos-classes (classify 3 pod specs), pod-architecture (pause bootstrap), cni-services (veth pair setup), apache-httpd (vhost dispatch) in sub-agent output; copy the pattern.
- Source: labs + mod slides cited per dive.
- Rationale: Hard gate. Novices need worked examples before attempting; absence forces productive-failure on procedural content, which is the wrong pattern for procedures.

---

### 12. Add retrieval checkpoints to all 11 lessons
- Category: A
- STANDARDS principle: §High-utility #1 (practice testing); §Hard gates §2
- File(s): `content/4915/lessons/01..11-*.md`. Lessons 04 + 05 get 2+ each; others get 1.
- Current state: 0/11 lessons have `> **Q:** / > **A:**` blocks.
- Proposed change: Insert one `> **Q:** / > **A:**` block per lesson at a natural checkpoint (typically after the first conceptual section). Drafts for the 4 highest-leverage lessons:
  - **Lesson 01 (what Linux is)** — after line ~11:
    ```
    > **Q:** When someone says "the Linux kernel doesn't include a text editor", are they talking about (a) the kernel proper, (b) GNU tools, or (c) the distribution?
    >
    > **A:** (a) — the kernel is scheduler + memory manager + drivers. `vi`, `nano`, `emacs` are GNU userland tools. A distribution bundles kernel + GNU tools + a package manager.
    ```
  - **Lesson 04 (quoting/redirection)** — two checkpoints:
    ```
    > **Q:** Predict each output:
    > `color=blue`
    > `echo '$color'`
    > `echo "$color"`
    > `echo $color`
    >
    > **A:** `$color`, `blue`, `blue`. Single quotes literal; double quotes expand $; bare expands all 7 forms. (Midterm Q47.)
    ```
    ```
    > **Q:** Running `cmd > out.txt` twice — what happens to the first `out.txt`?
    >
    > **A:** Silently clobbered. `>` overwrites without prompt. Protect with `set -C` (noclobber) and override with `>|`. (Midterm Q43/Q44.)
    ```
  - **Lesson 05 (bash scripting)** — two checkpoints on `$0`/`$#` and `"$@"` vs `"$*"` (drafts in sub-agent output).
  - **Lessons 02, 03, 06, 07, 08, 09, 10, 11** — one each:
    - 02: "Does an inode contain the filename?" → No; filename is in the directory entry.
    - 03: "Typing `grep foo file.txt` — which shell role fires: parser, dispatcher, waiter?" → All three.
    - 06: "Difference between runlevel 3 and runlevel 5?" → 3 = text, 5 = GUI, both multi-user.
    - 07: "Is FTP secure?" → No; credentials in plaintext; use SFTP/SCP.
    - 08: "Is NFS suitable for Linux↔Windows sharing?" → No; NFS is Unix-to-Unix. Use Samba.
    - 09: "`iptables -A INPUT -j DROP` — allow or deny?" → Deny.
    - 10: "What does the pause container do?" → Holds NET/IPC/UTS namespaces; other containers join.
    - 11: "Does `>` warn before overwriting?" → No; silent clobber.
- Source: lesson bodies already contain the mechanism; checkpoint quotes a real past-exam claim.
- Rationale: Hard gate. Productive-failure checkpoints surface misconceptions and fire hypercorrection (Metcalfe 2017).

---

### 13. Tag 8 mock-exam questions as `[pretest]`
- Category: B
- STANDARDS principle: §Per-course required artifacts §4; §Pretesting (Richland 2009)
- File(s): `content/4915/mock-exam.yaml`
- Current state: Zero `pretest` tags.
- Proposed change: Add `tags: [pretest]` to 8 questions spanning the 4 exam domains:
  - **Shell / quoting**: q8 (`echo '$person'`), q10 (redirection to two files), q49 (SHORT: write script printing `pwd` on one line), q50 (SHORT: bash function `psgrep`).
  - **Filesystem / perms**: q1 (Unix root dir), q31 (T/F hard links can cross FS).
  - **Utilities / text**: q26 (T/F `tr -d '\r'` converts DOS→Unix).
  - **Containers / K8s**: q16 (agent on cluster nodes = kubelet).
- Source: mock-exam.yaml current questions; selection targets Remember + Apply mix across domains.
- Rationale: Day-one pretest activates hypercorrection and calibrates study priorities. Required artifact.

---

### 14. NEW `code-practice/13-ssh-tunnel-local-vs-remote-forward.md`
- Category: B
- STANDARDS principle: §Per-course required artifacts §3 (diagram code-practice)
- File(s): NEW — `content/4915/code-practice/13-ssh-tunnel-local-vs-remote-forward.md`
- Current state: No code-practice covers SSH tunnel *direction* (`-L` vs `-R`). Mock q46 tests the concept without a worked diagram.
- Proposed change: Author new file (skeleton in sub-agent output, copy verbatim). Frontmatter: `n: 13, id: ssh-tunnel-local-vs-remote-forward, lang: bash, tags: [ssh, networking, tunneling], source: "midterm.md Q34 + Lab 6", pedagogy: worked-example-first`. Body: Prompt (laptop + bastion + internal DB topology), Starter (ascii topology with blanks), Solution (`ssh -L 5432:db.internal:5432 user@bastion` + syntax breakdown), Why (`-L` vs `-R` semantics + common parameter-order mistake).
- Source: `materials/labs/Lab6.pdf` + `materials/past-exams/midterm.md Q34`.
- Rationale: Past-exam tests tunnel direction; no existing code-practice covers the visual.

---

### 15. NEW `code-practice/14-iptables-packet-flow-and-chain-traversal.md`
- Category: B
- STANDARDS principle: §Per-course required artifacts §3
- File(s): NEW — `content/4915/code-practice/14-iptables-packet-flow-and-chain-traversal.md`
- Current state: `code-practice/04-iptables-allow-ssh-from-subnet-drop-rest.md` covers one scenario; neither existing file shows the *chain traversal decision tree* with default policy.
- Proposed change: Author new file (full skeleton in sub-agent output). Frontmatter: `n: 14, lang: bash, tags: [iptables, firewall, networking], source: "mock q22 + Mod08 Ch25", pedagogy: worked-example-first`. Body: Prompt (describe packet, construct 3-rule chain with default DROP), Starter (ascii decision tree with blanks), Solution (5 iptables lines + packet trace for 2 inputs — one matches, one drops), Why (rule order + first-match semantics + default-policy trap).
- Source: `materials/slides/Mod08 Ch25 iptables.pdf` + mock q22.
- Rationale: Chain traversal is visual; prose-only misses the decision-tree structure.

---

### 16. Cheat-sheet formulas block — SKIP, document the decision
- Category: B
- STANDARDS principle: §Per-course required artifacts §2
- File(s): `content/4915/cheat-sheet.md`
- Current state: No `## Formulas — quick reference` block.
- Proposed change: No new block. STANDARDS says "Skip only for non-quantitative courses (rare)." COMP 4915 is procedural (CLI / daemon / K8s). Existing blocks already cover procedural math in context (octal chmod, QoS classification logic, CIDR in iptables). Add a one-line note at the top of `cheat-sheet.md` documenting the decision: `<!-- Formulas block intentionally omitted: 4915 is non-quantitative. Octal chmod + CIDR covered in topical blocks. -->`.
- Source: audit of existing cheat-sheet blocks.
- Rationale: STANDARDS-compliant skip; documenting avoids re-flagging.

---

### 17. Append `> **Takeaway**` to all 11 lessons + 24 dives; relabel 5 dive closers
- Category: C
- STANDARDS principle: §Elaborative interrogation (high-utility #4)
- File(s): every `lessons/*.md`, every `topic-dives/*.md`
- Current state: Zero takeaways. Five dives (`dns-bind`, `linux-namespaces-8-types`, `nfs`, `nis-ldap`, `samba`) end with an unlabelled blockquote that only needs the `**Takeaway**` label.
- Proposed change:
  - For the 5 relabel dives: change last `>` block first line to `> **Takeaway**: <same text>`.
  - For the remaining 11 lessons + 24 dives: append one closing `> **Takeaway**: <1–2 sentence mechanism-first answer to "why does this enable what comes next?">`. Example drafts:
    - lesson 04 (quoting): `**Takeaway**: Quote *before* worrying about what the shell will do. Single = literal, double = $ only, bare = all 7 expansions — and redirect stdout *before* duplicating stderr onto it.`
    - dive `iptables-netfilter`: `**Takeaway**: Rules are first-match-wins top-down. Default policy is the fallback; set it to DROP and explicitly whitelist.`
    - dive `control-plane-node-components`: `**Takeaway**: apiserver is the only component other components read from / write to. etcd is the source of truth; controllers reconcile actual→desired.`
- Source: lesson/dive body mechanism.
- Rationale: Closing `**Takeaway**` forces elaborative interrogation — the learner restates the mechanism.

---

### 18. Bulk-tag `bloom:` on 193 cards + 73 mock questions
- Category: C (also resolves Category E distribution analysis)
- STANDARDS principle: §Bloom's taxonomy (Anderson & Krathwohl 2001)
- File(s): `flashcards.yaml`, `mock-exam.yaml`
- Current state: Zero `bloom:` fields. Distribution unauditable.
- Proposed change: Tag each card/question with `bloom:` using this heuristic:
  - `type: cloze` on a fact → `remember`.
  - `type: cloze` on a mechanism ("why…") → `understand`.
  - `type: name` on a term → `remember`; on a mechanism → `understand`.
  - `type: predict` → `apply`.
  - `type: diagram` → `apply` or `analyze`.
  - Mock MCQ on definition → `remember`; on command syntax → `understand`/`apply`; on predict-output or scenario → `apply`; essay → `analyze`.
  Do this during the same pass as patch 1 (source citation). Aim for 30/30/25/15 course-wide; audit distribution after.
- Source: card content itself + STANDARDS §Bloom's.
- Rationale: Enables distribution audit + per-topic Apply+ verification. Currently the audit cannot run Pass 8 at all.

---

### 19. Bulk-add `explanation:` to 193 cards
- Category: C
- STANDARDS principle: §Elaborative interrogation (high-utility #4); §Quality matrix dim 3
- File(s): `flashcards.yaml` — 193 cards
- Current state: 193/193 cards lack `explanation:`.
- Proposed change: Add 1–3-sentence `explanation:` per card. Mechanism-first, never answer-restatement. Use `research-mod0*.md` as source where cards align with research topics. Template:
  ```yaml
  - type: name
    prompt: "Why can't hard links cross filesystems?"
    answer: "Inode numbers are unique only within a filesystem."
    explanation: "A hard link is an extra directory entry pointing to an inode. Inode 5 on /dev/sda1 is not the same object as inode 5 on /dev/sdb1 — scope is per-FS. Soft links store the *pathname* as data, so they cross FS boundaries freely."
    source: "research-mod01-02.md §Hard vs Soft Link"
    bloom: understand
  ```
- Source: `research-mod0*.md` sections + slide decks.
- Rationale: §High-utility #4 enforcement. Without explanation, cards run as pure rote recall — fails Bloom transfer and germane load.

---

### 20. 15 god-node exemplar card drafts (templates for bulk enrichment)
- Category: C
- STANDARDS principle: §Elaborative interrogation; §Worked examples
- File(s): `flashcards.yaml` (15 representative cards, one per god-node)
- Current state: Sparse `explanation:` / `example:` / `bloom:`. God-nodes from `GRAPH_REPORT.md` are the highest-leverage anchors.
- Proposed change: Rewrite ONE representative card per god-node topic to full STANDARDS compliance (explanation + example + bloom + source). Use these as templates for the remaining 58 topics during patch 19 application. God-nodes: Kubernetes, Kubelet, cgroups, DNS/BIND, hard-link, inode, grep, umask/chmod, bash-variables, run-level-3, namespaces, pod, iptables, SSH, systemctl. Exemplar for `hard-link`:
  ```yaml
  - type: name
    prompt: "Why can't hard links cross filesystems?"
    answer: "Inode numbers are unique only within a single filesystem."
    explanation: "Hard link = extra directory entry pointing at an inode. Inode scope is per-FS, so crossing FS breaks the pointer. Soft links store the pathname as data and cross FS freely. (research-mod01-02.md §Hard vs Soft Link)"
    example: "`ln /mnt/usb/file ~/link` → fails (cross-FS). `ln -s /mnt/usb/file ~/link` → works; the link file contains the text '/mnt/usb/file'."
    bloom: understand
    source: "research-mod01-02.md §Hard vs Soft Link; Lab 2; midterm Q24/Q58"
  ```
  Full YAML for the other 14 god-nodes in sub-agent output; copy verbatim.
- Source: `research-mod0*.md` + labs + past-exam Qs.
- Rationale: Per-god-node drafts anchor the bulk-enrichment pass — cards in peer topics can mirror structure without re-researching.

---

### 21. Add 3 `type: diagram` cards on visual topics
- Category: C (advisory 21)
- STANDARDS principle: Mayer CTML §Multimedia; §Quality matrix dim 5
- File(s): `flashcards.yaml`
- Current state: Zero `type: diagram` cards in the bank.
- Proposed change: Add three cards with mermaid source + labels (full YAML in sub-agent output):
  - DNS query resolution chain (client → recursive → root → gTLD → auth → answer).
  - iptables INPUT default-deny traversal tree.
  - Pod pause-container namespace-sharing diagram.
- Source: mod slides + `research-mod10ce-review.md`.
- Rationale: Visual concepts deserve a diagram retrieval mode, not just name recall.

---

### 22. Add Apply-level cards to 10 god-node topics (card-type variety)
- Category: C + E
- STANDARDS principle: §Bloom's (each topic ≥1 Apply); §Concept variability
- File(s): `flashcards.yaml`
- Current state: All 193 cards are `type: name` (pure recall). Zero predict/diagram cards on any god-node. 73/73 topics have no Apply+ card → transfer fails.
- Proposed change: Add one `type: predict` card per god-node topic (umask, quoting, redirection, hard-link, find, grep, shell-params, chown, runlevels, bash-function). Representative for `umask`:
  ```yaml
  - type: predict
    prompt: "New file created with umask 022 (default file mode 666). What perms?"
    answer: "644 (rw-r--r--). 666 & ~022 = 644."
    explanation: "Umask subtracts: 022 removes w from group and other. 666 - 022 bit-wise → 644. Dir default 777 → 777 - 022 = 755."
    example: "`umask 022; touch f; ls -l f` → `-rw-r--r--`. `umask 077; touch g; ls -l g` → `-rw-------`."
    bloom: apply
    source: "research-mod01-02.md §Permissions; Lab 2; midterm Q16 proximal"
  ```
  Full YAML for 9 more in sub-agent output (Cat E1–E10).
- Source: materials + research notes.
- Rationale: All-Remember topics fail Apply exam questions (midterm Q10, Q16, Q17, Q34, Q47, Q50 are all Apply-level).

---

### 23. Add 8 mock-exam concept-variability questions (same concept, different surface)
- Category: E
- STANDARDS principle: §Concept variability for transfer (Barnett & Ceci 2002)
- File(s): `mock-exam.yaml`
- Current state: Many deep concepts tested only once (single surface form).
- Proposed change: Add one variant question per deep concept (full YAML per Q in sub-agent output):
  - Quoting: q8 tests single-quote → add variant testing double-quote expansion.
  - Redirection: q5 tests separate-files → add variant testing combined `2>&1`.
  - Hard/soft link: q9 tests deletion survival → add variant testing cross-FS constraint.
  - Permissions: q7 tests `chown -R jack` → add variant testing `chown -R user:group`.
  - Find: q4 tests `-name` → add variant testing `-type d -mtime -7`.
  - grep: q6 tests `-w` → add variant testing `-iw` composition.
  - Runlevels: q11 tests `3 = text-multi` → add variant testing "which runlevel for GUI maintenance".
  - Exit status: add variant testing `&&`/`||` short-circuit with `$?`.
- Source: midterm.md + quizzes + research notes.
- Rationale: Same deep concept through varied surface → far transfer. Single-surface repetition inflates question count without building transfer.

---

### 24. Add 3 code-practice variants (outbound iptables, SSH remote-forward, NFS remount)
- Category: E
- STANDARDS principle: §Concept variability
- File(s): NEW `code-practice/15..17`.
- Current state: 6 single-variant code-practice files (iptables inbound only, SSH local-forward only, NFS export only, NIS master only, sendmail receive-only, Pod QoS classification only).
- Proposed change: Add three new files testing the constraint-flipped variant. Full skeletons in sub-agent output. Pick the 3 most exam-relevant:
  - iptables OUTPUT default-deny with allow DNS + HTTPS.
  - SSH `-R` remote-forward exposing a local service through bastion.
  - NFS live `mount -o remount,ro` without unmounting.
- Source: SSH/iptables/NFS dives + Lab 6/7/8.
- Rationale: Constraint-flipped variant tests deep-concept understanding.

---

### 25. Add mermaid diagrams to 8 visual-concept dives (high-leverage)
- Category: D
- STANDARDS principle: Mayer CTML §Multimedia, §Signaling, §Spatial contiguity
- File(s): `topic-dives/{control-plane-node-components, pod-architecture-pause-container, dns-bind, ssh-keys-tunneling, boot-sequence-run-levels-memorize, inode-hard-vs-soft-links, apache-httpd, sendmail-mta}.md` (full mermaid source in sub-agent output; copy verbatim)
- Current state: These dives describe visual structures in prose with zero diagram. `linux-namespaces-8-types`, `iptables-netfilter`, `sendmail-mta` already have mermaid — verify spatial contiguity only.
- Proposed change: Insert one mermaid diagram per dive, after opening paragraph, labels inside nodes (Mayer spatial contiguity). Representative (control-plane):
  ```mermaid
  graph LR
    A[API Server] -->|reads/writes| E[(etcd)]
    A -->|watches specs| C[Controller Mgr]
    A -->|watches specs| S[Scheduler]
    K[Kubelet] -->|registers| A
    K -->|invokes CRI| CR[Container Runtime]
    P[kube-proxy] -->|updates| A
  ```
  Full drafts for the other 7 in sub-agent output.
- Source: `materials/slides/Mod{05,08,10A,10C}*.pdf` + `research-mod{05-06,07-08,09-10ab}.md`.
- Rationale: Visual structure taught in prose alone violates multimedia. Each diagram applies to every future reader.

---

### 26. Add suggested mermaid structures to 4 remaining visual dives
- Category: D
- STANDARDS principle: Mayer CTML §Multimedia
- File(s): `topic-dives/{apache-httpd, nfs, nis-ldap, samba}.md` — if not covered by patch 25 already
- Current state: No diagram.
- Proposed change: Add a concise mermaid showing each service's flow:
  - apache: Global → MainServer → VirtualHost config scoping.
  - nfs: Server `/etc/exports` → firewall 111/2049 → client `mount` → `/etc/fstab`.
  - nis-ldap: LDAP DN tree `dc=ca > dc=bcit > dc=infosec > ou=users > cn=alice`.
  - samba: client → `smb.conf` → `smbpasswd` (distinct from Unix passwd) → mount.cifs.
- Source: Mod07 slides + Lab 7.
- Rationale: Completes dual-coding coverage.

---

### 27. Add `related:` frontmatter to all 11 lessons
- Category: F
- STANDARDS principle: §CLT germane load; §Quality matrix dim 10
- File(s): each `lessons/*.md` frontmatter
- Current state: Zero `related:` fields.
- Proposed change: Add `related: [id1, id2, ...]` per lesson. Full mapping in sub-agent output; exemplar:
  - `04-quoting-and-redirection`: `related: [4915-topic-quoting-rules, 4915-topic-redirection-pipes, 4915-topic-shell-expansions-7-types-in-order]`
  - `10-containers-pods-kubernetes`: `related: [4915-topic-linux-namespaces-8-types, 4915-topic-cgroups-qos-classes, 4915-topic-control-plane-node-components, 4915-topic-pod-architecture-pause-container, 4915-topic-cni-services]`
- Source: GRAPH_REPORT hyperedges + concept adjacency.
- Rationale: Germane load builds schemas via cross-linking.

---

### 28. Add `related:` frontmatter to 28 topic-dives
- Category: F
- STANDARDS principle: §CLT germane load
- File(s): every `topic-dives/*.md` frontmatter except the deleted `bash-function-vs-c-function-...` (patch 4)
- Current state: Zero `related:` fields.
- Proposed change: Add 3–5 cross-links per dive. Full table in sub-agent output. Exemplars:
  - `iptables-netfilter`: `related: [4915-topic-dns-bind, 4915-topic-ssh-keys-tunneling, 4915-topic-cni-services, 4915-topic-apache-httpd]`
  - `cgroups-qos-classes`: `related: [4915-topic-linux-namespaces-8-types, 4915-topic-pod-architecture-pause-container, 4915-topic-control-plane-node-components]`
  - `shell-scripting-essentials`: `related: [4915-topic-special-parameters, 4915-topic-redirection-pipes, 4915-topic-quoting-rules]` (note: no C-vs-bash dive per deletion)
- Source: GRAPH_REPORT + inferred adjacency.
- Rationale: Same as patch 27.

---

### 29. Add 4–5 cross-topic synthesis MCQs to mock-exam
- Category: F + E
- STANDARDS principle: §Concept variability; §CLT germane load
- File(s): `mock-exam.yaml` — append as q78–q82
- Current state: No question tests spans of two+ topics.
- Proposed change: Add synthesis MCQs with elaborated rationales (full YAML in sub-agent output):
  - **q78**: Quoting × redirection — which form writes literal `$USER` to out.txt.
  - **q79**: SSH-L × iptables — which iptables rule on the gateway does the tunnel need?
  - **q80**: K8s control-plane × cgroups × namespaces — which component enforces QoS limits? (Answer: kubelet via cgroups.)
  - **q81**: Permissions × DNS × NFS — why does client UID 1001 hit "permission denied" reading a file owned by UID 500 on the NFS server?
  - **q82**: Redirection-order × special-params × pipe — which stream ends up in `out.log` given `cmd1 | cmd2 2>&1 > out.log`?
- Source: Past-exam combinations, labs, GRAPH_REPORT hyperedges.
- Rationale: Synthesis tests transfer across the curriculum — the hardest thing the audit cannot detect without new content.

---

### 30. Reframe 7 instructor-authority + hedge passages (peer polish bundle)
- Category: G (complements patch 6; does not re-edit lesson 05 C content)
- STANDARDS principle: §Peer-shareability
- File(s):
  - `lessons/01` lines 52, 74 — remove "instructor flagged", "vague OK".
  - `lessons/03` lines 11, 16, 69 — remove "instructor said"/"instructor: 'know this'".
  - `lessons/04` line 90 — replace "instructor plants this" with mechanism-first.
  - `lessons/06` line 25 — "instructor" → "exam-tested".
  - `lessons/07` line 5 — "instructor's networking questions repeat" → "past-exam networking questions repeat".
  - `lessons/10` line 11 — "instructor said 'same questions may reappear'" → "Quiz 4 was 10-for-10 on these five Kubernetes topics".
  - `topic-dives/instructor-review-class-confirmed-...md` lines 12, 44, 47 — remove "gospel", "might", "could easily"; replace with priority rankings.
  - `topic-dives/permissions-chmod-umask.md` chown line — "instructor: -R not -r" → "`-R` (not `-r`) — midterm Q16".
- Proposed change: See Cat-G sub-agent output for per-line drafts.
- Source: mechanism already in each file; replace authority hedges with materials refs.
- Rationale: Peer-shareability; files are public.

---

### 31. Rename `topic-dives/special-parameters-instructor-emphasis.md`
- Category: G
- STANDARDS principle: §Peer-shareability (file naming)
- File(s): rename to `topic-dives/special-parameters.md`
- Current state: File title + `id:` both carry instructor framing.
- Proposed change: Rename file; update frontmatter `id: 4915-topic-special-parameters`; grep all references (flashcards topic prose, dive `related:` fields, lesson cross-refs) and update to new id.
- Source: N/A (structural rename).
- Rationale: Peer-facing id and filename.

---

### 32. Rename `topic-dives/instructor-review-class-confirmed-on-exam-items-apr-17.md`
- Category: G
- STANDARDS principle: §Peer-shareability (file naming)
- File(s): rename to `topic-dives/exam-study-priorities-apr-17.md` (or similar)
- Current state: Name gates the artifact to a private context.
- Proposed change: Rename file; update frontmatter `id:` + `title:`; grep-replace all cross-refs. Content remains — instructor-authority *framing* within the content is handled by patch 30.
- Note: Some of this dive's content may migrate into the new `exam-strategy-and-pitfalls.md` (patch 8). Decide which dive is canonical once both exist; consider deleting this dive after migration.
- Source: N/A.
- Rationale: Peer-shareability.

---

### 33. Tag existing mock questions to close 27-topic coverage gap
- Category: E (audit warning 12)
- STANDARDS principle: §Practice testing — coverage
- File(s): `mock-exam.yaml`
- Current state: 27 flashcard topics have zero mock-exam `topic`/`tags` coverage (audit lists: chroot, umask, setgid, setuid, storage, fstab, text-utils, globbing, filter, history, editor, stderr, pipes, background, nis, ldap, sendmail, ftp, boot, cgroups, qos, cni, export, flow-control, linux-basics, users, control-plane).
- Proposed change: Many of these topics *are* tested in spirit — re-tag. E.g. q5 tests stderr/pipes (add `tags: [stderr, pipes]`); q33–q35 test cgroups/QoS (add `tags: [cgroups, qos]`); q3 tests FTP (add `tags: [ftp]`). Where a topic has no current mock coverage, add one new question. Detailed mapping in sub-agent output — consult during application.
- Source: flashcard topic names; mock question texts.
- Rationale: Practice-testing requires per-topic retrieval; otherwise spacing/interleaving mis-routes the scheduler.

---

### 34. Add `**Pitfall**` callouts inside lessons (esp. 04)
- Category: C / A-warning
- STANDARDS principle: §Elaborated feedback
- File(s): all 11 lessons, but `lessons/04-quoting-and-redirection-where-90-of-midterm-traps-live.md` especially.
- Current state: Lesson 04 is titled "where 90% of midterm traps live" but has zero `**Pitfall**` callouts — the trap language runs as prose.
- Proposed change: Hoist inline "watch out for" / "common mistake" phrases into formal `**Pitfall**` callouts per Mayer signaling. Lesson 04 gets 3+:
  - Redirection clobber: "**Pitfall**: `>` silently overwrites. No prompt. Use `>>` to append or `set -C` to noclobber."
  - `2>&1` order: "**Pitfall**: `2>&1 >file` ≠ `>file 2>&1`. Second redirect wins the binding."
  - Single-quote escape: "**Pitfall**: `'don\'t'` fails — single quotes can't contain a single quote even escaped."
- Source: existing lesson prose + midterm Q10/Q43/Q44/Q47/Q50.
- Rationale: Signaling principle (Mayer CTML §3) — formal callout signals role; prose buries the trap.

---

### 35. Strengthen code-practice `## Why` sections (8 files)
- Category: C / audit warning 15
- STANDARDS principle: §Elaborated feedback; §Quality matrix dim 7
- File(s): `code-practice/{01, 04, 05, 06, 07, 08, 11, 12}.md` (file 03 deleted per patch 5; files 09/10 already strong per audit)
- Current state: `## Why` sections are <2 sentences, lack slide/page/technique anchor, name no common wrong approach.
- Proposed change: Prefix each Why with source locator (`Mod0X Ch0Y` or `Lab N`) and add 1 sentence naming the typical wrong approach. Example for `04-iptables-allow-ssh-from-subnet`:
  - Current: "`-A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT`. Order matters."
  - Proposed: "**Source**: Mod08 Ch25 + Lab 8. The rule must *precede* a terminal `-j DROP`; iptables stops on first match. Common wrong: writing `-A` after `-P INPUT DROP` without explicit allow — DROP catches the SSH packet."
- Source: mod slides + labs.
- Rationale: §Quality matrix dim 7; §Elaborated feedback.

---

### 36. Add retrieval affordance to 4 dives (archives-compression, etc-passwd-shadow, instructor-review, special-parameters)
- Category: C / audit warning 16
- STANDARDS principle: §Practice testing
- File(s): the 4 dives above.
- Current state: No linked flashcards or inline checkpoints.
- Proposed change: Add one inline `> **Q:** / > **A:**` per dive (or create a matching-id flashcard topic — choose one). Example (`archives-compression`): "**Q**: What flag unpacks `foo.tar.gz` in a single step? **A**: `tar -xzf foo.tar.gz` — `-z` tells tar to pipe through gzip."
- Source: dive body.
- Rationale: Non-retrievable content fails high-utility #1.

---

### 37. Prepend concrete instances to 19 dives + 3 lessons violating concreteness-fading
- Category: C / audit warning 10
- STANDARDS principle: §Concreteness fading (Fyfe et al. 2014)
- File(s): 19 dives + lessons 07, 09, 11 per audit list (apache-httpd, archives-compression, cgroups-qos-classes, cni-services, command-precedence-order, control-plane-node-components, etc-passwd-etc-shadow, grep-find-wc-tr-tee-sort, inode-hard-vs-soft-links, iptables-netfilter, job-control, linux-namespaces-8-types, permissions-chmod-umask, pod-architecture-pause-container, quoting-rules, redirection-pipes, shell-expansions-7-types-in-order, shell-scripting-essentials, special-parameters).
- Current state: Each opens with a definition or bare fact list.
- Proposed change: Prepend a concrete named instance before the definition. Example (`apache-httpd`): current opens "Apache HTTP Server is a web server". Replace with: "Lab 8 scenario: serve a password-protected directory at `/secret` under `http://server/secret`. You add a `Location` block referencing an `htpasswd` file, restart httpd, and verify with `curl -u user:pass`. That's the exam-sized Apache task." Then the current definition follows.
- Source: labs + mod slides.
- Rationale: Concrete → abstract fading (Fyfe 2014) outperforms abstract-only for both initial learning and transfer.

---

### 38. Add `example:` to ~100 priority cards (applied topics)
- Category: C (advisory)
- STANDARDS principle: §Worked-example effect; §Quality matrix dim 4
- File(s): `flashcards.yaml` — applied-level topics (umask, chmod, iptables, pod QoS, SSH tunnel, bash function, grep, find, redirection, special-params)
- Current state: 193/193 lack `example:`.
- Proposed change: Add one concrete worked `example:` per priority card. Defer the remaining ~90 low-leverage cards to post-launch polish.
- Source: labs + past-exam Qs.
- Rationale: Advisory per STANDARDS; but applied topics benefit most from a concrete worked case.

---

### 39. Verify 3 existing mermaid diagrams for spatial contiguity
- Category: D
- STANDARDS principle: Mayer CTML §5 spatial contiguity
- File(s): `topic-dives/{linux-namespaces-8-types, iptables-netfilter, sendmail-mta}.md`
- Current state: Diagrams exist; audit §Strengths confirms. Verify that labels sit inside nodes (not in a separate legend below the diagram).
- Proposed change: If any diagram has separate legend, inline the labels using `A["Label text"]` mermaid syntax. If already inlined, no change.
- Source: N/A.
- Rationale: Closes the audit's "confirm spatial contiguity" flag.

---

### 40. Update `related:` references after C-file deletions (patches 4, 5)
- Category: F (cleanup)
- STANDARDS principle: consistency
- File(s): `flashcards.yaml`, any dive/lesson/code-practice referencing the deleted C dive or C code-practice.
- Current state: Lesson 05 + `shell-scripting-essentials` dive reference `bash-function-vs-c-function-instructor-will-ask`.
- Proposed change: Grep for the deleted ids and remove from `related:` arrays / body text.
- Source: N/A.
- Rationale: Dangling cross-refs compile-error under future audit.

---

### 41. Renumber `code-practice/` after deletion of file 03
- Category: (mechanical)
- STANDARDS principle: SCHEMA §Global conventions (filename ordering prefix)
- File(s): `code-practice/04..12.md` → rename to `03..11`; update frontmatter `n:` field accordingly. Or leave gap and start new files at `13`, `14`, `15` (patches 14, 15, 24).
- Current state: After patch 5, slot 03 is empty.
- Proposed change: **Recommended: leave the gap**. Avoids rippling id changes through cross-refs. New files (patches 14, 15, 24) land at `13`, `14`, `15`, `16`, `17` naturally.
- Source: N/A.
- Rationale: Minimum-change cleanup.

---

### 42. Post-application audit sanity pass
- Category: (meta)
- STANDARDS principle: verification
- Action: Re-run `/audit-content 4915` after each category completes. Category A alone should flip Pass 2 (Source) from 318 criticals to 0; Pass 3 (Retrieval) from 11 criticals to 0; Pass 5 (Worked examples) from 8 criticals to 0; Pass 7 (Pitfall + rationale) from 58 criticals to <10.
- Source: audit report baseline.
- Rationale: Catches regressions (e.g. a pitfall draft accidentally re-introduces hedge wording, a `source:` line points at a locator that doesn't exist in materials).

---

## Backlog (lower-priority items deferred from the top-50)

- **B-2 justification comment** on cheat-sheet.md (patch 16) can be trimmed once STANDARDS adds an explicit "non-quantitative opt-out" note.
- **Mock-exam pretest widening**: patch 13 tags 8; could widen to 10 if time permits.
- **Per-card `example:` completion**: patch 38 covers ~100 priority cards; remaining ~90 cards are low-leverage (history, definitions) — defer.
- **Suggested mermaid for nis-ldap / samba** (patch 26): lower leverage than patches 25's 8 diagrams; do last.
- **Re-audit scorecard**: track progress by re-running `/audit-content 4915` after each major category completes; aim for zero Pass-2 / Pass-3 / Pass-5 / Pass-7 criticals before `/add-course 4915`.

---

## Application order (recommended)

1. **Today** (~6 h): patches 1–7 (source discipline + scope correction). Unblocks audit Pass 2 + Scope.
2. **Day 2** (~8 h): patches 8–15 (required artifacts + rationale rewrites + retrieval checkpoints + pitfalls). Unblocks Pass 3, 4, 7, 9.
3. **Day 3** (~6 h): patches 17, 19, 20, 22 (bulk enrichment + god-node drafts + Apply cards). Unblocks Pass 4, 8.
4. **Day 4** (~6 h): patches 25–29 (dual coding + interconnection + synthesis). Unblocks Pass 6 + F-gaps.
5. **Day 5** (~4 h): patches 18, 30–37 (Bloom bulk + peer polish + concreteness + Why sections).
6. **Day 6** (~2 h): patches 21, 23, 24, 38–42 (variants + advisory polish + verification).
7. **Final**: re-run `/audit-content 4915`, confirm all hard gates pass, then `/add-course 4915`.
