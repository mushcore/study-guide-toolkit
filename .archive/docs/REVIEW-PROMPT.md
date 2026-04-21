# Peer-Share Study Guide Review — Per-Course Prompt

**Purpose.** Audit one course's `exam-study/index.html` against its source materials and judge whether it is ready to share publicly with peers of any comfort level.

**Usage.**
1. Open a fresh Claude Code session from the term root (`/Users/kevinliang/BCIT/CST/TERM4`).
2. Set effort to **`xhigh`** (recommended for Opus 4.7 on exploratory tool-heavy work).
3. Replace `{{COURSE}}` with one of: `COMP4736`, `COMP4870`, `COMP4911`, `COMP4915`.
4. Paste the block below. Run one session per course — do not batch.

Output of each run: `<COURSE>/generated/reviews/peer-share-checklist-2026-04-19.md` (one file — the reviewer reasons through 9 dimensions internally but only the actionable checklist gets written to disk).

---

```
Review my study guide at /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/exam-study/index.html and judge whether it is ready to share publicly with peers of any comfort level — from students who skipped every lecture to students who already understand the material.

## Sources of truth (read these before reviewing)
- /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/CLAUDE.md — exam format, topics, professor emphasis, my learning context (treat the "My learning context" section as context for YOU, not as content the peer audience should ever see in the guide)
- /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/diagnosis.md — topic priority and past-exam frequency
- /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/materials/ — slides, past exams, syllabus, notes, labs (ground truth; glob it and read broadly)
- /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/graphify-out/GRAPH_REPORT.md if it exists — god nodes and surprising connections the guide should cover
- Sibling files in /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/exam-study/ whose names start with `research-` — the raw research the HTML was built from; flag any substantive content that exists in research but was dropped from the HTML

## Read the HTML in full
The file is 2,700–3,900 lines and contains both static HTML and JavaScript data arrays (lessons, flashcards, deep-dives, quizzes, mock exam, cheat sheet). Use `Read` with offset/limit to chunk through the ENTIRE file — do NOT stop at the first 2,000 lines. Use `Grep` on the file to locate data arrays: search for `view-title`, `lessons`, `flashcards`, `quizzes`, `deepDives`, `mockExam`, `cheatSheet`, `priorities`. Before critiquing, print a short inventory of the sections and data arrays you found with approximate line ranges — this proves you read the whole file.

If you review the file having read less than 80% of its lines, the review is invalid and you must redo it.

## Review rubric — invoke the `/review-studyguide` skill's 7 dimensions PLUS the 8th and 9th below

Invoke the `/review-studyguide` skill on this file. Follow its full rubric, output format, and scoring system (1–5 per dimension, overall verdict from `Ship as-is` / `Ship after minor fixes` / `Major rework required` / `Discard and rebuild`). Then extend it with TWO additional mandatory dimensions.

### 8. Peer-shareability — "would this help a classmate who walks in cold?"
Score 0–5 like the other dimensions. Audit for:
- **Zero-assumption onboarding.** The Lessons / "teaching from zero" section must actually start from zero. Flag every lesson that assumes prior comfort without defining terms first.
- **Progressive depth.** Beginners need a plain-language path; advanced students need drill-down depth. Flag sections that only serve one audience (code dumps with no narration, or hand-wavy summaries with no mechanism).
- **Standalone comprehension.** A peer who never attended the lectures must be able to learn from this guide alone. Flag every reference like "as we saw in lecture 5" or "the professor mentioned" that has no accompanying explanation.
- **No private artifacts.** Flag any: student ID (A01353636 or similar pattern), personal names, "my weak areas", comfort-level self-assessments, grade data, lab submissions pasted in, or anything that reveals the author's identity or standing.
- **No author-specific framing.** Replace first-person ("I should focus on X") with neutral framing ("Prioritize X because…"). List every violation with its line location.
- **Self-contained runtime.** The HTML must render and teach with only the CDN resources it already loads — no file:// paths, no broken internal anchors, no references to sibling research-*.md files that peers won't receive.
- **Accessibility basics.** Heading order, image alt text or captions, color not the only cue for priority (the guide uses red/green), keyboard-navigable sidebar. Flag violations.
- **Calibrated difficulty ladders.** Flashcards and quiz questions should span Bloom's levels so a struggling peer can ramp up and a confident peer can still be challenged. Flag sections that are all Remember-level or all Analyze-level.
- **Explanations over bullet dumps.** Every deep-dive should explain, not just list. A bulleted glossary where each item is 3 words is a flag — require full sentences with a worked example or analogy.
- **Worked examples for every problem-solving topic.** Missing worked examples on a problem-solving topic (deadlock detection, query planning, memory calculations, etc.) is a critical defect.
- **Common-mistake callouts.** Peers benefit enormously from "here's what students get wrong". Flag topics that have none.
- **Diagram references where the source has one.** If `materials/` contains a diagram central to a concept, the guide must describe or embed it (Mermaid already works in these files).

### 9. Teaching craft — "does the prose actually teach, or just state?"
Score 0–5. Read each lesson and deep-dive as if you are a student encountering the material for the first time. Audit for:

- **Explain, don't just state.** Every non-trivial claim must include the mechanism ("why" + "how"), not just the fact. A bullet that asserts without explaining is a defect. List the worst offenders with line ranges.
- **Concept order respects dependencies.** Prerequisites appear before the concepts that depend on them. Flag every forward reference where a term is used before it is defined.
- **Concrete before abstract.** New concepts should be anchored with a concrete example or analogy BEFORE the formal definition. Flag lessons that lead with a definition only.
- **Worked-example transparency.** Every worked example must show the intermediate reasoning steps a student has to reproduce on the exam. Flag worked examples that jump from problem statement to answer, skip algebra, skip state changes, or hand-wave with "it follows that…".
- **Misconceptions are the RIGHT ones.** Cross-reference the guide's "common mistakes" callouts against actual wrong-answer patterns in `materials/past-exams/` solution keys and marking schemes. If the listed mistakes don't match what students actually get wrong on this course's exams, the callouts are cosmetic. Flag mismatches.
- **Transfer-readiness.** After reading a lesson, could a student answer a novel, unseen question at the same Bloom's level — or only recite the lesson's own example? If the lesson only teaches memorization and not generalization on a topic the exam tests at Apply/Analyze, flag it.
- **Sentence-level clarity.** Flag sentences that use undefined jargon, run over ~30 words, rely on passive voice to hide the actor, stack multiple clauses, or require re-reading to parse. Quote the worst three.
- **Emphasis calibration.** The guide should devote the most ink to topics that are hard AND heavily tested, not topics that are easy and common. Flag inversions: a 3-sentence paragraph on a high-frequency hard topic, or a 2-page deep-dive on a trivial one.
- **Analogies land.** Where the guide uses an analogy, check that the analogy maps cleanly to the concept (every load-bearing part of the analogy corresponds to a real part of the mechanism). An analogy that breaks under pressure is worse than none.
- **The "explain it back" test.** For each major concept, imagine a student closing the guide and trying to teach the concept to a classmate from memory. Could they reconstruct the core idea from what the guide just taught them? If the lesson is a list of properties with no causal spine, the answer is no. Flag such lessons.

**Tiebreaker rule.** If dimension 8 OR dimension 9 scores ≤ 2, the overall verdict CANNOT be `Ship as-is` regardless of other dimensions. Peer-shareability and teaching craft are both bottlenecks for this pass.

## Output

Save ONE file, creating /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/reviews/ if absent.

File: /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/reviews/peer-share-checklist-2026-04-19.md

Before producing this file, you must still REASON through all 9 dimensions and score each one. That reasoning stays in your extended thinking — it does not get written to disk. Do NOT shortcut the scoring pass; skipping dimensions produces a shallow checklist.

The checklist file contains exactly this structure:

# Peer-share review — {{COURSE}}

## Scorecard
| Dim | Name | Score |
|---|---|---|
| 1 | Coverage | X/5 |
| 2 | Accuracy | X/5 |
| 3 | Excess | X/5 |
| 4 | Pedagogical quality | X/5 |
| 5 | Clarity & structure | X/5 |
| 6 | Exam alignment | X/5 |
| 7 | Internal consistency | X/5 |
| 8 | Peer-shareability | X/5 |
| 9 | Teaching craft | X/5 |

**Overall verdict:** [Ship as-is / Ship after minor fixes / Major rework required / Discard and rebuild]

## Blockers (fix in order — highest impact per author-minute first)

1. **[Blocker title]**
   - Location: [section name, approximate line range in index.html]
   - Source: [materials/... citation or "no source found"]
   - Why flagged: [1–2 sentences of reviewer reasoning — what's wrong and which dimension it hits]
   - Fix: [the concrete change in one sentence]

2. ...

## Strengths to preserve (max 3 bullets, one line each)
- ...

Rank blockers by how many peers are harmed per minute of author time to fix. Cap at real blockers — no padding. If there are no blockers, state so and recommend Ship as-is.

## Non-negotiable rules
- Every blocker cites both the HTML location (section + approximate line range) AND the source-of-truth location in `materials/` (file + slide/page). No uncited claims.
- If a source cannot be found, write "no source found in materials/" — do not fabricate slide numbers, page numbers, or professor attributions.
- Declarative language only. No "might be worth considering", no "great start", no emoji, no motivational filler.
- Do NOT edit `index.html`. This is a critique pass, not a rewrite.
- Do NOT invoke the `teacher` agent — wrong tool here.
- If `materials/` is empty or unreachable, stop and tell me before producing a checklist — a review without ground truth cannot judge accuracy or coverage.

Start by printing the sources-of-truth file list (with sizes) and the HTML section/data-array inventory. Then produce the checklist file.
```
