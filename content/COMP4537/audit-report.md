# Content audit — COMP4537

Date: 2026-04-21
Tree: content/COMP4537/

## Scorecard
| Pass | Name | Critical | Warning | Advisory |
|---|---|---|---|---|
| 1 | Schema hard-fails | 0 | 0 | 79 |
| 2 | Source discipline | 0 | 0 | 0 |
| 3 | Retrieval affordance | 0 | 1 | 0 |
| 4 | Elaborative encoding | 0 | 0 | 0 |
| 5 | Worked examples | 0 | 0 | 0 |
| 6 | Dual coding | 0 | 0 | 5 |
| 7 | Pitfall + distractor analysis | 0 | 6 | 0 |
| 8 | Bloom's + concept variability | 0 | 4 | 0 |
| 9 | Per-course required artifacts | 0 | 0 | 0 |
| 10 | Peer-shareability + private data | 0 | 0 | 0 |

**Overall verdict**: Polish — safe to ship. Zero criticals across all passes.

**Hard-gate status** (per STANDARDS §Hard gates):
- [x] Every card/question/file has `source:`
- [x] Every lesson has ≥1 retrieval checkpoint
- [x] Every problem-solving topic-dive has ≥1 worked example
- [x] Every non-trivial topic-dive has ≥1 `**Pitfall**`
- [x] Every MCQ/MULTI rationale addresses each distractor
- [x] `topic-dives/exam-strategy-and-pitfalls.md` exists
- [x] Zero private-data matches
- [x] Zero duplicate ids
- [x] Schema invariants clear

## Blockers (fix in order — highest impact per author-minute first)

1. **exam-strategy-and-pitfalls dive not linked by any flashcard**
   - Severity: Warning
   - Pass: 3
   - STANDARDS principle: High-utility #1 (practice testing) — retrieval affordance
   - File: content/COMP4537/topic-dives/exam-strategy-and-pitfalls.md:1
   - Finding: No flashcard has topic matching this dive's id, and the dive has no inline Q/A checkpoints.
   - Fix: Add ≥1 inline `> **Q:** / > **A:**` checkpoint, OR add a flashcard topic entry for exam-strategy.

2. **Bloom's distribution: Remember skewed high, Analyze underrepresented**
   - Severity: Warning
   - Pass: 8
   - STANDARDS principle: Bloom's taxonomy distribution ±10pts threshold
   - File: content/COMP4537/flashcards.yaml (throughout)
   - Finding: Remember 38.3% (target 30%, +8.3 pts); Analyze+ 9.8% (target 15%, -5.2 pts). Within ±10pt threshold but skewed.
   - Fix: Convert ~8 Remember cards to Apply/Analyze, particularly in httponly-cookies, jwt, api-security modules.

3. **modern-web-arch topic: all cards at Remember/Understand, no Apply+**
   - Severity: Warning
   - Pass: 8
   - STANDARDS principle: Per-topic Bloom's spread — every topic ≥1 card at Apply or higher
   - File: content/COMP4537/flashcards.yaml (topic: modern-web-arch, cards 1–7)
   - Finding: 5 Remember + 2 Understand cards; zero Apply or Analyze cards for this topic.
   - Fix: Add 1 Apply card: scenario-based question requiring selection and justification of a pattern.

4. **Code-practice Why sections: 6 files lack explicit "Wrong approach:" labels**
   - Severity: Warning
   - Pass: 7
   - STANDARDS principle: Elaborated feedback (Shute 2008)
   - File: content/COMP4537/code-practice/03-api-security-best-practices.md, 08-js-async-event-loop.md, 10-js-functions.md, 12-rest-anatomy.md, 13-json-localstorage.md, 14-restful-url-design.md
   - Finding: ## Why sections explain mechanisms but do not explicitly label 1–2 common wrong approaches.
   - Fix: Add "Common wrong approach:" or "Misconception:" labels before each identified error in the Why section.

5. **Mock-exam concept variability: promises-basics Q-01/Q-02 share 83% prompt overlap**
   - Severity: Warning
   - Pass: 8
   - STANDARDS principle: Concept variability (Barnett & Ceci 2002)
   - File: content/COMP4537/mock-exam.yaml (promises-basics-q-01 and promises-basics-q-02)
   - Finding: Both questions use identical "What is the output?" MCQ format with near-identical code-trace mechanics.
   - Fix: Reframe Q-02 or Q-03 to a different surface form: error-diagnosis, code-fix, or concept-predict format.

6. **Mock-exam concept variability: js-scope-hoisting 3 questions 71–79% overlap**
   - Severity: Warning
   - Pass: 8
   - STANDARDS principle: Concept variability (Barnett & Ceci 2002)
   - File: content/COMP4537/mock-exam.yaml (js-scope-hoisting-q-01/02/03)
   - Finding: All three questions use "What does the code print?" MCQ format with near-identical surface framing.
   - Fix: Retain Q-01; reframe Q-02 and Q-03 to analysis or construction tasks.

7. **Zero `type: diagram` cards across 29 topics**
   - Severity: Advisory
   - Pass: 6
   - STANDARDS principle: Mayer CTML Multimedia principle — dual coding
   - File: content/COMP4537/flashcards.yaml
   - Finding: No diagram-type flashcards exist despite visual concepts (db-relational-design, web-arch-patterns, public-private-keys).
   - Fix: Add 3–5 diagram cards for topics with inherent visual structure.

8. **79 fenced code blocks without language tags**
   - Severity: Advisory
   - Pass: 1
   - STANDARDS principle: Schema §Global conventions — fenced block language tags
   - File: Distributed across lessons/, topic-dives/, code-practice/
   - Finding: Untagged fences prevent syntax highlighting in rendered output.
   - Fix: Add language tag to each untagged fence (e.g., ```js, ```sql, ```json).

## Strengths to preserve (max 3, one line each)
- Source discipline is 100%: every card, lesson, dive, code-practice file, and mock question cites a specific, anchored source.
- All hard gates pass: 235 cards, 49 mock questions, 29 lessons, 30 dives, 25 code-practice files are schema-valid and pedagogically complete.
- Worked examples and Pitfall callouts are consistent across all 30 topic-dives and all 29 lessons.
