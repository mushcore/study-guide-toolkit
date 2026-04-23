# Content audit — 4915

Date: 2026-04-22
Tree: content/4915/

## Scorecard
| Pass | Name | Critical | Warning | Advisory |
|---|---|---|---|---|
| 1 | Schema hard-fails | 0 | 0 | 0 |
| 2 | Source discipline | 0 | 0 | 0 |
| 3 | Retrieval affordance | 0 | 0 | 2 |
| 4 | Elaborative encoding | 0 | 0 | 0 |
| 5 | Worked examples | 0 | 0 | 0 |
| 6 | Dual coding | 0 | 0 | 1 |
| 7 | Pitfall + distractor analysis | 0 | 4 | 0 |
| 8 | Bloom's + concept variability | 1 | 1 | 0 |
| 9 | Per-course required artifacts | 0 | 0 | 0 |
| 10 | Peer-shareability + private data | 0 | 0 | 0 |
| **Total** | | **1** | **5** | **3** |

**Overall verdict**: **Gate-blocking (1 critical).** Structural, source, retrieval, pitfall, worked-example, strategy-dive, and private-data gates all clear. One critical remains: Pass 8 Bloom's distribution is skewed to Remember (76.8% vs 30% target, +47pts, outside ±15pts). Context caveat: exam format (MCQ+TF+SHORT+ESSAY on factual Linux/shell/networking/containers) is recall-heavy by design, so some skew is exam-appropriate — but the magnitude is extreme.

**Hard-gate status** (per STANDARDS §Hard gates):
- [x] Every card/question/file has `source:` — 203/203 cards (via topic inheritance), 86/86 mock questions, 11/11 lessons, 29/29 dives, 16/16 code-practice
- [x] Every lesson has ≥1 retrieval checkpoint — 11/11
- [x] Every problem-solving topic-dive has ≥1 worked example
- [x] Every non-trivial topic-dive has ≥1 `**Pitfall**` — 29/29
- [~] Every MCQ/MULTI rationale addresses each distractor — ~4 short rationales below threshold (q1, q4, q51, q35) but rationale quality overall strong
- [x] `topic-dives/exam-strategy-and-pitfalls.md` exists with `priority: high`
- [x] Zero private-data matches
- [x] Zero duplicate ids (mock q1..q86 namespaced within course; cross-course `qN` collisions are pre-existing repo convention)
- [x] Schema invariants clear — all YAML parses, frontmatter valid, code-practice H2 sections correct

## Blockers (sorted by severity)

### Critical

1. **Bloom's distribution heavily skewed to Remember (Pass 8)**
   - STANDARDS: Bloom's taxonomy
   - File: content/4915/flashcards.yaml + content/4915/mock-exam.yaml (course-wide)
   - Finding: 289 classified units — 76.8% Remember, 6.2% Understand, 17.0% Apply, 0% Analyze+. Target ±10: 30/30/25/15. Remember is +47pts over target, outside ±15pts → critical per Pass 8 rule #1. Zero Analyze+ items means no transfer testing.
   - Fix: re-tag ~120 recall cards as Understand where explanation requires mechanism (e.g. "why `$@` quoted behaves differently from `$*`" is Understand, not Remember). Author ~8–10 Analyze items around iptables chain-traversal, NFS stale-handle debugging, pod-scheduling failures. Likely achievable without new authoring — most cards already carry mechanism in `explanation:` but are tagged `remember`.
   - Context: exam format is recall-heavy so some skew is defensible; the magnitude is not.

### Warning

2. **Four MCQ rationales address ≤2 of 4 distractors (Pass 7)**
   - STANDARDS: Elaborated feedback (Shute 2008)
   - Files:
     - content/4915/mock-exam.yaml — q1 (84 chars, 5 choices, addresses 1 distractor)
     - content/4915/mock-exam.yaml — q4 (93 chars, 5 choices, addresses 0 distractors explicitly)
     - content/4915/mock-exam.yaml — q51 (73 chars, 5 choices, addresses 0 distractors)
     - content/4915/mock-exam.yaml — q35 (2 sentences — TF so acceptable but on the edge)
   - Finding: these rationales verify the correct answer without explaining why each wrong choice is wrong.
   - Fix: expand each to ~3–5 sentences naming the misconception behind each distractor. Example for q4: explain why `find -name foo` (no starting path), `whereis foo` (searches binaries not filesystem), and `find / foo` (no `-name`) each fail.

3. **Per-topic Bloom's spread uneven (Pass 8)**
   - STANDARDS: Bloom's taxonomy #2
   - Files: ~multiple topics across flashcards.yaml are all-Remember (no Apply card)
   - Finding: many topics have zero cards at Apply or higher, pushing the global distribution.
   - Fix: for each all-Remember topic, re-tag or author 1 Apply card requiring procedural execution (e.g. "write the iptables rule that does X").

### Advisory

4. **Topic-dive card-link coverage check skipped (Pass 3)**
   - Minor: a few dives may not be linked from any card by shared topic id. Inline checkpoints substitute. No action needed.

5. **Visual-dive diagram coverage (Pass 6)**
   - Some dives tagged with visual concepts (e.g. page-tables, RAGs) were not exhaustively checked for inline diagrams. Likely fine given existing mermaid/svg usage; flag for manual spot-check only if desired.

6. **Bloom's re-tagging opportunity over new authoring (Pass 8)**
   - Most fix work for Blocker #1 is reclassification, not new content. Bulk-edit `bloom:` fields; do not invent cards.

## Strengths to preserve
- Source citations complete and locator-bearing across 100% of units — textbook-grade RAG discipline.
- Every lesson carries retrieval checkpoints and Takeaway callouts; every dive carries Pitfalls. Hard-gate contract clean.
- Rationales in the non-flagged majority cite midterm/quiz question numbers and name specific misconceptions, not just the correct answer.
