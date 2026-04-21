# Peer-share review — COMP 4736

## Scorecard
| Dim | Name | Score |
|---|---|---|
| 1 | Coverage | 4/5 |
| 2 | Accuracy | 3/5 |
| 3 | Excess | 4/5 |
| 4 | Pedagogical quality | 3/5 |
| 5 | Clarity & structure | 4/5 |
| 6 | Exam alignment | 4/5 |
| 7 | Internal consistency | 2/5 |
| 8 | Peer-shareability | 2/5 |
| 9 | Teaching craft | 3/5 |

**Overall verdict:** Ship after minor fixes (tiebreaker engaged: dims 7 and 8 both ≤ 2 block `Ship as-is`; fixes below are localized edits, not a rebuild).

## Blockers (fix in order — highest impact per author-minute first)

1. **Topic deep-dive "Buddy system — past-exam Q8" coalesces a busy buddy (factually wrong)**
   - Location: `generated/exam-study/index.html` DATA.topics, title "Buddy system — past-exam Q8", ~L1488–1495 (text: `A's buddy (256) is free → coalesce to 512` and `That 512's buddy (512) has B's subtree`)
   - Source: `materials/past-exams/Final_exam_practice_Sol.pdf` Q8, page showing post-A-release tree (`256 (Free), 256 [128 [64=B, 64 (Free)], 128 (Free)]` — A's buddy holds B's subtree, NO coalesce)
   - Why flagged: Directly contradicts the official solution and the guide's own Lesson 9 (L1046–1055) and Mock Exam answer (L1704–1706) which correctly state no coalesce. Teaches the wrong mechanic on the single highest-mark past-exam item. Dim 2 + Dim 7.
   - Fix: Replace the three-line coalesce claim with "A's buddy 256 contains B's subtree → NOT wholly free → NO coalesce. A's 256 stays free next to the B-subtree 256." Match the Lesson 9 tree.

2. **Lesson 8 "Worked example (past-exam Q3)" page-table prose is garbled**
   - Location: `index.html` DATA.lessons L940 (sentence beginning `Page table: page 2 → frame 0, page 1 → frame 1, page 0 → frame 2, page 5 → frame 3, page 4 → frame 6, page 6 → frame 8, page 7 → frame 44K-range.`)
   - Source: `materials/past-exams/Final_exam_practice_Sol.pdf` Q3 figure (VP 0→2, VP 1→1, VP 2→6, VP 3→X, VP 4→0, VP 5→4, VP 6→3, VP 9→5, VP 11→7; rest X)
   - Why flagged: At least 5 of the listed mappings are wrong (no "frame 8" exists in a 64 KB physical space with 4 KB frames; VP 2→6 not 0; VP 5→4 not 3; etc.). The worked numerical examples immediately below use the correct mappings, so the prose line directly contradicts the computation underneath. Dim 2 + Dim 7.
   - Fix: Rewrite the sentence to list the actual mappings verbatim from the solution PDF, or delete the sentence and let the worked examples speak.

3. **"User confirmed …" phrases leak author-specific framing to peers**
   - Location: `index.html` DATA.meta.instructorIntel L562 (`User confirmed IPC + Sem WILL appear on final`); DATA.priorities.high L587 (`User confirmed Semaphore is on final`); DATA.priorities.table L606, L607 (cells `User confirmed ON FINAL`)
   - Source: `materials/notes/Final Exam Details.md` lists IPC + Sem as exam topics without any "user confirmed" framing
   - Why flagged: A peer opening the guide has no idea who "the user" is — the phrase exposes that this was assembled from private chat context. Dim 8 (no author-specific framing, no private artifacts).
   - Fix: Replace every `User confirmed …` with an instructor-sourced or syllabus-sourced statement, e.g. `Instructor-listed final exam topic (Part 6/7 + Part 8)` or simply drop the qualifier.

4. **Stale hard-coded dates mislead anyone viewing after Apr 18**
   - Location: `index.html` DATA.meta.dashboardStats L545 (`{ label: 'Days Left', value: '3', sub: 'as of Apr 18' }`); DATA.meta.extraPanels L570–577 (panel `3-Day Panic Plan (Apr 18 → Apr 20)` with Day 1 marked "today")
   - Source: `CLAUDE.md` exam date 2026-04-21; today 2026-04-19 → sidebar live countdown correctly shows 2 days
   - Why flagged: The live countdown in the sidebar disagrees with the static tile ("Days Left: 3") — Dim 7 internal consistency. The "Panic Plan" panel also presumes the reader is the Apr 18 author; for a peer who opens it today or earlier it's misleading. Dim 8.
   - Fix: Either compute the tile from `examDateISO` the same way the sidebar countdown does, or delete the static tile. Rename the Panic Plan to "Final-week plan" and cite days relative to the exam ("D-3 / D-2 / D-1") instead of absolute Apr 18/19/20.

5. **Banker's algorithm under-covered vs. source emphasis**
   - Location: `index.html` DATA.topics title "Banker's algorithm + recovery + two-phase locking" marked `priority: 'low'` L1393; only one flashcard (`dl_15`) L1195; no worked example
   - Source: `materials/slides/Part_9_Deadlock.pdf` slides 72–87 (16 slides with single-resource and multi-resource worked examples); `generated/diagnosis.md` L85–89 ("Tier 2 … enormous slide coverage … likely Part 2"); `generated/exam-study/research-deadlock.md` L153–250 (full single- and multi-resource walkthroughs)
   - Why flagged: Dim 1 coverage + Dim 9 emphasis calibration. Diagnosis explicitly says practice-exam weighting understates Banker's and it's likely on Part 2; research already has a worked Banker's example that was dropped from the HTML. A peer studying the guide would under-prepare for a plausible written question.
   - Fix: Promote the Banker's topic to `priority: 'high'`, add one worked safe/unsafe example (single-resource, ≤ 20 lines) adapted from research-deadlock.md lines 171–250, and add two Apply-level flashcards (safe-sequence trace; safe vs. unsafe state distinction).

6. **Lesson 10 lists page-replacement algorithms without a single trace — peer cannot apply them**
   - Location: `index.html` DATA.lessons L1092–1102 (bulleted list of Optimal / FIFO / Second Chance / Clock / LRU / NFU / Aging / WS)
   - Source: `materials/slides/Part_10_memory.pdf` (slides on FIFO / LRU / Clock each show reference-string traces); `materials/notes/Final Exam Details.md` lists Memory as core topic
   - Why flagged: Dim 9 transfer-readiness + Dim 4. Belady's anomaly appears as a T/F question in the mock exam (L1596) but the lesson gives no trace a peer could use to actually answer "given reference string X and 3 frames, how many faults?" The guide has no worked page-replacement example anywhere.
   - Fix: Add one short worked example (reference string `0 1 2 3 0 1 4 0 1 2 3 4`, 3 frames, trace FIFO + LRU + Optimal side-by-side with fault counts). Either in Lesson 10 or as a new Applied problem in codePractice.

7. **"User / I / my" framing in priorities table and high-priority list**
   - Location: `index.html` DATA.priorities.high L587 (semaphore item); DATA.priorities.table rows L606–607 (`pattern: 'User confirmed ON FINAL'`)
   - Source: N/A — this framing is author-private, nothing in `materials/` references "the user"
   - Why flagged: Overlaps with blocker 3 but surfaces separately in the Priorities view that peers will see first after Dashboard. Dim 8 no author-specific framing.
   - Fix: Replace `pattern` cell text with the instructor-listed justification (`Listed core final topic — Part 6/7` / `Listed core final topic — Part 8`).

8. **Sidebar footer "v1.0 · Rahim" misreads as authorship**
   - Location: `index.html` sidebar L410 (`<div class="foot" id="side-foot">v1.0 · Rahim</div>`) and init.js L2701 (`'v1.0 · ' + (DATA.meta.instructor || '')`)
   - Source: `materials/syllabus/Course_Outlines_Comp4736.pdf` lists instructor; no source identifies Rahim as the guide author
   - Why flagged: Dim 8 peer-shareability. A peer seeing "v1.0 · Rahim" in the sidebar will assume the instructor authored or endorsed the guide. That's misleading.
   - Fix: Change the foot line to `Instructor: Rahim` or `Course: COMP 4736` to disambiguate. Drop the `v1.0` stamp unless versioning is actually maintained.

9. **No "common mistakes" callouts on the topics peers get wrong**
   - Location: `index.html` — DATA.lessons and DATA.topics across Deadlock/Paging/Allocation sections; the mock-exam explanations (`L1588–1782`) are the only place misconception framing appears
   - Source: `materials/past-exams/Final_exam_practice_Sol.pdf` structure (solution key shows two alternate formulas for address translation, implying the common error is picking the wrong one); `generated/exam-study/research-ipc1-semaphore.md` L186–224 explicitly lists "EXAM TRAPS & COMMON CONFUSIONS" that never made it into the HTML
   - Why flagged: Dim 9 misconceptions. Research file lists confusions (condition variables have memory, lock variable is sufficient, monitor auto-release, etc.) that the HTML could surface cheaply. Dim 8 peer benefit from "here's what students get wrong".
   - Fix: Add a `.traps` callout in each Deadlock / Paging / Semaphore lesson listing 2–3 common confusions lifted verbatim from research-ipc1-semaphore.md §5 and research-deadlock.md. No new content needed — just surface the existing research.

10. **Lesson 3 crams eight mutex solutions into ~15 lines with no diagram**
    - Location: `index.html` DATA.lessons L682–708 ("Mutual exclusion solutions — the spectrum")
    - Source: `materials/slides/Part_6_7_IPC_1.pdf` (dedicates one or more slides per solution); `generated/exam-study/research-ipc1-semaphore.md` L26–36 gives each approach a paragraph
    - Why flagged: Dim 9 concrete-before-abstract + Dim 8 zero-assumption onboarding. A peer seeing "TSL", "XCHG", "lost wakeup", "monitor" for the first time gets one sentence each with no comparison table. The mock exam T/F "Semaphores use busy waiting. F" requires reasoning this lesson does not develop.
    - Fix: Add a comparison table (solution / busy-wait? / works on multi-CPU? / what failure case it fixes / what failure it introduces). The topic deep-dive "Mutual exclusion spectrum" L1263–1276 already has a table — move it into Lesson 3 so it is seen on the first pass.

## Strengths to preserve (max 3 bullets, one line each)
- Every past-exam question (Q1–Q8) appears verbatim in Quiz Replay with step-by-step solutions and is mirrored in Mock Exam + codePractice (Dim 6 exam alignment).
- Lesson 7 (Deadlock detection) includes a tiny fully-worked matrix trace before the past-exam Q5 computation — correct scaffolding of concrete-before-abstract, the best-taught section in the file.
- Flashcards consistently tagged with Bloom's level, pillar, source reference, and cloze-style atomic phrasing — Dim 4 pedagogical quality backbone is sound.
