---
id: 4915-topic-exam-study-priorities-apr-17
title: Exam study priorities (Apr 17 review)
pillar: tech
priority: high
chapter: Review Apr 17
source: "Review class notes Apr 17; materials/past-exams/midterm.md + comp4915_quiz3.md + comp4915_quiz4.md"
bloom_levels: [remember, understand]
related: [4915-topic-exam-strategy-and-pitfalls, 4915-topic-quoting-rules, 4915-topic-redirection-pipes, 4915-topic-permissions-chmod-umask, 4915-topic-command-precedence-order]
tags:
  - editor
  - fundamentals
---

**Exam study priorities.** This list synthesizes review-class emphasis with past-exam and quiz evidence of question frequency.

#### MUST know (explicit mentions)

-   **Linus Torvalds AND Richard Stallman** — both names. Stallman = GNU project founder.
-   **Vague history** of Linux/UNIX (order, not dates).
-   Linux is the **successor of UNIX**.
-   **man** — displays manual.
-   **Combine single-letter flags**: `ls -r -x` same as `ls -rx`.
-   **How commands are processed** (generally).
-   **Regular expression vs filename expansion** — difference — *important*.
-   **Redirection** `>` `>>` `<` — *important to know*. Plus stderr.
-   **Pipes** — "really important". Example `cat file | more`.
-   **Putting things in the background** — useful.
-   **Linux filesystem** directory purposes — "probably should know this".
-   **What is a directory.**
-   **7 special file types.**
-   **setuid AND setgid** — know both.
-   **Hard links** — "no way of telling which is the hard link" (both identical).
-   **Soft links** — created with `ln -s`; creates new file pointing to another.
-   Performance note: rotating disks slower than SSDs (but SSDs have limited writes).
-   **Basic utilities**: `ls`, `cat`, `rm`, `hostname` (displays name of machine you're logged into).
-   **grep** — recursive across files + directories (`grep -r` / `rgrep`).
-   `head`, `tail`, `sort`, `uniq`, `diff`, `file`.
-   `gzip`, `gunzip`.
-   **tar — simple form only**: create `tar -cf`, list `tar -tf`, extract `tar -xf`.
-   **DHCP** — how it works (conceptual). *Not* asked to reproduce dhcpd.conf.
-   **DNS** — know basic records by name. **IPv4 only — NOT IPv6.**
-   **NFS** — "useful only behind firewalls".
-   Bash shell — at least should recognize what it is.
-   BuiltIn commands — go over slide examples.
-   **Special Parameters — "probably on exam"**; `$*` vs `$@` difference explicitly called out.
-   Precedence — low exam likelihood but possible; optional deep study.
-   **All expansions fair game.**
-   **System V levels — need to know.**
-   `/dev/null`, `/dev/zero` — commonly asked on past exams; expect a question.
-   Block and character devices — know.
-   **fstab basics**. NOT mount options. NOT dump/fsck (last 2 fields).
-   Simple questions on FTP usage.
-   LDAP — review.
-   Samba, NFS — high-level, not too detailed.
-   Flow of control in bash.
-   Bunch of command-line utilities — surface-level only.
-   **Container images** — useful to know.

#### Explicit SKIPS

-   **Perl** — not needed.
-   **ACLs (Access Control Lists)** — not needed.
-   **IPv6** DNS records.
-   **dhcpd.conf** reproduction.
-   Mount options in fstab + last 2 fields (dump, fsck).
-   Deep details on peripheral utilities.

> **Pitfall**
>
> Treating this list as a *complete* syllabus inverts its purpose. It's a **delta** layered over the slides/labs — MUST items are reviewer-flagged emphasis, not the universe of testable content. If a topic appears in a midterm/quiz/lab but isn't listed here, it's still fair game (past-exam coverage beats review-class omission). Use the SKIPS list aggressively, but don't treat the MUSTs as exhaustive.

> **Takeaway**: This list isn't a study guide — it's a triage tool. Items under MUST are worth allocating study time to; items under SKIPS are worth actively ignoring. If you run out of hours, cut everything outside these two buckets.
