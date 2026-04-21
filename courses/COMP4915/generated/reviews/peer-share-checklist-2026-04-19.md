# Peer-share review — COMP4915

## Scorecard
| Dim | Name | Score |
|---|---|---|
| 1 | Coverage | 3/5 |
| 2 | Accuracy | 3/5 |
| 3 | Excess | 4/5 |
| 4 | Pedagogical quality | 4/5 |
| 5 | Clarity & structure | 4/5 |
| 6 | Exam alignment | 3/5 |
| 7 | Internal consistency | 3/5 |
| 8 | Peer-shareability | 4/5 |
| 9 | Teaching craft | 4/5 |

**Overall verdict:** Ship after minor fixes

## Blockers (fix in order — highest impact per author-minute first)

1. **Sendmail (Ch20 / Mod07) is missing entirely**
   - Location: no lesson, no topic deep-dive, no flashcard, no mock/quiz question. HTML lines 2023–2032 (Lesson 8 "Services") jumps NFS → Samba → NIS → LDAP with zero sendmail content. Search `Sendmail|sendmail|mailq|newaliases|/etc/mail` in index.html returns only the word "aliases" in unrelated bash-alias contexts.
   - Source: `materials/slides/Mod07 Sendmail Ch20 NIS LDAP Ch21 NFS Ch22 Samba Ch23.pdf` (Ch20 is the first third of the module); `generated/exam-study/research-mod07-08.md:10-120` contains MTA/MUA/MDA split, `/etc/mail/sendmail.cf` vs `.mc`, `newaliases`/`mailq`, `/var/log/maillog`, Lab 7 setup. All dropped.
   - Why flagged: Mod07 counts as 10% of the exam per `generated/diagnosis.md:32`. Sendmail is the first named topic in the Mod07 title. Bruce's Apr 17 notes did not de-prioritize it. Peers who use this guide will walk in blind on any Sendmail MCQ/short-answer. Hits dim 1 (coverage) and dim 6 (exam alignment).
   - Fix: add a "Mail services" topic deep-dive and at least 4 flashcards covering: sendmail is an MTA, `/etc/mail/sendmail.cf` vs `.mc` + `m4` compile, `newaliases` after editing `/etc/aliases`, `mailq` / `/var/spool/mqueue`, port 25.

2. **Flashcard #112 contradicts the Quiz Replay answer for Quiz 4 Q5**
   - Location: `index.html:2962` flashcard `{id:112, source:"Quiz 4 Q5", q:"Where does K8s maintain its state?", a:"etcd"}` vs `index.html:3130` quiz replay answer index `0` = `kube-controller-manager`. The lesson text at `index.html:2737` also pushes etcd ("ALL cluster state lives here … Quiz 4 Q5 answer").
   - Source: `materials/past-exams/comp4915_quiz4.md:33-38` — Q5 options are A) kube-controller-manager B) kube-scheduler C) kubelet D) kubectl E) pods. `etcd` is not an option. Bruce's answer key (per the guide's own quiz-replay) is A.
   - Why flagged: students studying the flashcard will write `etcd` on the exam for a Bruce-reused question and score zero. Hits dim 2 (accuracy) and dim 7 (consistency).
   - Fix: change flashcard #112 answer to `kube-controller-manager` and add a second card explaining that the raw state data lives in etcd, but the quiz wording ("maintain") maps to the controller-manager.

3. **Midterm Q34 is marked "AMBIGUOUS" inside the Mock Exam without resolution**
   - Location: `index.html:3044` and `3171` — both label the grep-superman MCQ as ambiguous and tell the reader to "confirm with Bruce." Peers outside the course have no way to confirm.
   - Source: `materials/past-exams/midterm.md:252-257` — "search for a word 'superman'." The word "word" in the prompt is the hinge; `-w` (option B) is the textbook match.
   - Why flagged: leaving an exam question explicitly unresolved in the "Mock Exam" section trains peers to answer inconsistently. Hits dim 2 and dim 7.
   - Fix: commit to B (`grep -w`) and explain the "word" → `-w` word-boundary mapping once. Remove the "confirm with Bruce" fallback — a peer-ready guide must stand on its own.

4. **No lab-content walkthroughs despite Bruce explicitly calling labs high-value**
   - Location: the guide references "Lab 2", "Lab 3", "Lab 9", "Lab 10" as source tags (e.g., `index.html:1543`, `1630`, `2305`) but never walks through what happens in a lab. There is no Lab view in the sidebar (`index.html:1217-1227`).
   - Source: `CLAUDE.md` "Instructor intel" line: "Review the labs — explicitly called out as high-value study material." Lab PDFs in `materials/labs/Lab1.pdf` through `Lab10.pdf`. Research file `research-mod07-08.md:107-118` shows a concrete Lab 7 sendmail setup that is fully absent from the HTML.
   - Why flagged: Bruce emphasized labs as study material; the guide mentions them only as source citations. Hits dim 1 and dim 6.
   - Fix: add a short "Labs recap" deep-dive topic — 2-3 sentences per lab — or fold each lab's crucial command sequence into the matching module topic (e.g., Lab 3 → DNS topic adds `firewall-cmd --add-service=dns`, zone file snippet, `systemctl restart named`).

5. **Exam countdown and date strings are hard-coded — will mislead a peer who opens the file after April 23**
   - Location: `index.html:1215` ("Thu Apr 23 · 13:30 · SW01 3190"), `1483` (`EXAM_DATETIME = new Date('2026-04-23T13:30:00-07:00')`). After that moment, the sidebar shows "EXAM TIME" in red indefinitely.
   - Source: `CLAUDE.md` "Exam date/time: Thursday, April 23, 2026, 13:30–15:30 @ SW01 3190" — correct for cohort but not peers in future terms.
   - Why flagged: a peer receiving this a term later sees "EXAM TIME" on load and a locked room number that no longer applies. Hits dim 8.
   - Fix: if the guide is aimed at this cohort only, say so in the Dashboard. If it is meant to be reusable, gate the countdown behind a user-editable exam-date field or hide it when `EXAM_DATETIME < now`.

6. **Author/instructor attribution leaks in sidebar footer and ~25 in-body references**
   - Location: `index.html:1229` (`v1.1 · Bruce Link`), plus "Bruce Apr 17", "Bruce said", "Bruce plants this" scattered across lessons 1–11, priorities panel, and cheat sheet (`index.html:1259`, `1281`, `1543`, `1630`, `1791`, `2786-2838`, `3292-3293`, etc.).
   - Source: `CLAUDE.md` names Bruce Link as instructor. This is public within BCIT but still ties the guide to one course section.
   - Why flagged: for peer sharing within the same cohort this is fine; for classmates in a different section or later term, repeated first-name references without context are jarring and make the guide look like private notes. Hits dim 8 (peer-shareability).
   - Fix: replace first-name references with "the instructor" in body copy; keep the attribution in one clearly-labelled "Course context" block on the Dashboard. Remove "Bruce Link" from the sidebar footer or rename to "COMP 4915 · Spring 2026".

7. **Sample Midterm Q10 claims the answer is `emacs` without verifiable support**
   - Location: `index.html:3209` — "Most powerful editor … emacs (or vim — both considered powerful; emacs is the answer)."
   - Source: `materials/past-exams/Comp4915MidtermSamp.PDF` is the only source; the question and its key are inside the PDF. The markdown transcription under `materials/past-exams/` does not include Sample Q10's answer key.
   - Why flagged: hedged answer ("emacs — or vim") in a mock exam trains peers to guess. If wrong, this reads like the author filled in a plausible answer without the key. Hits dim 2.
   - Fix: open `Comp4915MidtermSamp.PDF`, confirm the keyed answer, and either commit to it or drop the question from mock content.

8. **"Exam Format" dashboard numbers are speculation, not cited**
   - Location: `index.html:1238` ("144+ marks · 120 min") and `1248-1254` ("~40 MCQ, ~12 T/F, ~10 Short, ~3 Essay"). The leading `~` is the only cue that these are estimates.
   - Source: `CLAUDE.md` gives the midterm counts (37 MCQ, 10 T/F, 10 Short, 3 Essay, 144 marks, 100 min) and says the final is "similar to midterm." There is no document that specifies the final's count.
   - Why flagged: peers will treat these as fact because they are presented in a scoreboard-style stat block. Hits dim 2 and dim 7.
   - Fix: label the block "Estimated (final exam counts not published — based on midterm + cumulative scope)" and keep the `~`. Or drop the counts and show only marks + minutes.

9. **Mod07 content pool is one lesson card plus five flashcards; Mod07 is 10% of the final per diagnosis**
   - Location: Lesson 8 (`index.html:2023-2032`) is a single paragraph-per-service block; topic deep-dives cover NFS/Samba/NIS/LDAP (`index.html:2473-2522`) but with no worked examples. Flashcards #70-#80 total 11 Mod07 cards across all four services.
   - Source: `generated/diagnosis.md:37,72-79` lists Mod07 at 10% weight and enumerates required knowledge (ypinit -m, /var/yp/securenets, ypcat/ypmatch, slapd.conf suffix/rootdn/rootpw, DN/RDN/CN/DC/OU, testparm, smbpasswd -a, swat port 901). The guide covers the vocabulary but offers no practice applying it.
   - Why flagged: Bruce noted Mod07 was "not on midterm" → heavier on the final. The ratio of lesson/topic depth (Mod10 gets lesson 10 + 5 topic deep-dives) to Mod07 depth is inverted relative to exam weight. Hits dim 1 and dim 6.
   - Fix: add one worked example per Mod07 service (e.g., "Walkthrough: export /srv/data to 10.0.0.0/24 via NFS, verify with `showmount -e`") and 3-4 Applied Practice problems.

10. **`details.check` panels require mouse interaction to see the answer — keyboard accessibility is incomplete**
    - Location: CSS at `index.html:404-416` hides default `summary` markers and relies on click toggling. No visible `:focus-visible` style on `details.check summary` until line 1144, and tab order for quiz reveal buttons is default-browser only.
    - Source: WCAG 2.1 2.1.1 (keyboard), 2.4.7 (focus visible).
    - Why flagged: a classmate on a keyboard-only setup or screen reader will find reveal toggles reachable but visually hard to follow. Hits dim 8 (accessibility basics).
    - Fix: audit focus-visible rules on all interactive targets (`.reveal-btn`, `.btn`, `.fc-stage`, `summary`), and add an explicit marker glyph that changes state on `[open]` attribute so it works without hover.

## Strengths to preserve
- Quiz Replay tab reproduces Quiz 3, Quiz 4, midterm, and sample midterm verbatim — highest-ROI section per instructor, well executed.
- Lesson 2 (inode/hard-link/soft-link) and Lesson 5 (C-vs-bash functions) use analogy → diagram → worked example → check chain — strong teaching craft that rewards peers at any comfort level.
- Mermaid diagrams for pod bootstrap, shell expansion loop, iptables packet walk, and QoS decision tree make the highest-weight Mod10/Mod08 content visually accessible without requiring prior familiarity.
