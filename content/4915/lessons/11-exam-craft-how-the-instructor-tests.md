---
"n": 11
id: 4915-lesson-exam-craft-how-the-instructor-tests
title: Exam craft — how the instructor tests
hook: Meta-lesson. Use it in the exam room.
tags:
  - linux
module: Misc / editors / misc topics
---

### Question patterns from midterm + Quiz 3/4

-   MCQ: command identification (grep, tr, wc, find, kill, ls, chown, chsh, tail)
-   MCQ: concept definition (PPID, FQDN, bit-bucket, PAM, superuser)
-   MCQ: file location (/etc/hosts.deny, /etc/services)
-   MCQ: exact syntax (`find / -name foo` vs `find foo`)
-   T/F: common misconceptions ("redirection warns before overwrite" → FALSE)
-   Short answer: predict output of piped redirection
-   Short answer: glob match against file list
-   Essay: compare/contrast (hard vs soft links); write script; write function

### Trap classes

1.  Absolute T/F with "only" or "always" — usually FALSE.
2.  Options that look right but have subtly wrong flag (chown -r vs -R; grep -v vs -w).
3.  Distractor with made-up command name (disp, sysman, chngsh).
4.  Quoting: single quotes suppress expansion.
5.  Order matters: `2>&1` placement.

### Answer strategy

-   Read EVERY option before picking. The instructor plants near-miss distractors.
-   MCQ worth 2 marks each; don't leave blank — 20% chance beats 0%.
-   Short answer: write the EXACT command. "Use grep" = 0 marks.
-   Essays: compare-and-contrast wants 2-column structure; use table or bullets.
-   Scripts: `#!/bin/bash` header is worth marks. So are comments and quoting.

### Time allocation (120 min)

MCQ+T/F ~40 min. Short answer ~30 min. Essays ~40 min. Review/safety ~10 min. Don't get stuck. Star and return.
