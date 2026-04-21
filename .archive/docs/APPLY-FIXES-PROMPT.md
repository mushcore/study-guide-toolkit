# Apply Peer-Share Fixes — Per-Course Prompt

**Purpose.** Apply the blockers in a per-course review checklist to that course's `exam-study/index.html`. New or rewritten content must follow evidence-based teaching principles — this pass is not just patching defects, it is improving the teaching.

**Usage.**
1. Run the review pass first (see `REVIEW-PROMPT.md`). Confirm `peer-share-checklist-2026-04-19.md` exists for this course.
2. Open a **fresh** Claude Code session from the term root (`/Users/kevinliang/BCIT/CST/TERM4`). Do not reuse the review session — fresh context pushes back on weak review findings instead of rubber-stamping them.
3. Set effort to **`xhigh`**.
4. Replace `{{COURSE}}` with the course code. Paste the block below. One session per course.

---

```
Apply the fixes in /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/reviews/peer-share-checklist-2026-04-19.md to /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/exam-study/index.html.

This is not a mechanical patch pass. When you add, rewrite, or restructure content, you are TEACHING — every addition must be pedagogically sound by the standards below, not just technically correct.

## Ground truth for every addition
- /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/materials/ — slides, past exams, syllabus, notes, labs
- Sibling research-*.md files in /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/exam-study/
- /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/CLAUDE.md for exam format and professor emphasis
- /Users/kevinliang/BCIT/CST/TERM4/{{COURSE}}/generated/diagnosis.md for topic weights

Never add content that has no source in those locations. "No source found" means don't invent it — mark the blocker as unfixable and move on, noting what materials the author needs to supply.

## Teaching principles that govern every written addition

All principles below are non-negotiable for any content you WRITE or REWRITE in the HTML. They do not apply to cosmetic fixes (typo, tag closure, private-data redaction) — use judgment.

1. **Explain, don't state.** Every non-trivial claim must include the mechanism — the "why" and the "how" behind the fact. A bullet that asserts without explaining is a defect. If the original guide had a bullet that just stated something, the replacement must show the mechanism.

2. **Concrete before abstract.** Introduce new concepts with a specific example or analogy FIRST, then generalize to the formal definition. A lesson that opens with a definition and never gives an example is broken.

3. **Respect prerequisite order.** Never use a term before it is defined. If a fix adds a paragraph that references a concept, verify the concept was introduced earlier in the guide or introduce it now.

4. **Bloom's progression within each topic.** Start at Remember/Understand, ramp up to Apply/Analyze. A topic that only drills definitions fails peers on an Apply-level exam; a topic that only asks synthesis fails peers who don't know the foundations. Balance the ladder.

5. **Active recall baked in.** Do not write content that only supports passive re-reading. Every major concept should have at least one prompt that forces retrieval — cloze deletions in flashcards, fill-in worked examples, "predict the output" questions. Writing a polished prose explanation with no retrieval prompt is insufficient.

6. **Dual coding.** Where a concept has a natural visual representation (state diagram, matrix, timeline, process tree), add a Mermaid diagram — the existing HTML already supports Mermaid. Do not leave a visual concept as prose-only if a diagram would anchor it.

7. **Worked-example transparency.** Every worked example must show every intermediate step a student has to reproduce on the exam. No "it follows that…", no skipped algebra, no implicit state changes. A reader must be able to run the same reasoning on a similar problem.

8. **Misconceptions from real exam data.** When adding a "common mistakes" callout, pull the mistake from actual wrong-answer patterns in `materials/past-exams/` solution keys. Do not invent plausible-sounding mistakes — that produces cosmetic callouts that don't match what students actually get wrong.

9. **Connect to prior knowledge.** Every new concept must be anchored to something already covered — prerequisite, analogy, or prior topic. Orphan concepts don't stick.

10. **Minimum information per unit.** For flashcard additions, follow SuperMemo 20 Rules: one atomic fact, answer ≤ 15 words, prefer cloze, no list-recall, no yes/no, Bloom's level tagged, source cited.

11. **Sentence-level clarity.** Sentences ≤ ~30 words, active voice where possible, no undefined jargon, no nested clauses that require re-reading. Write for a classmate who walks in cold, not for yourself.

12. **Calibrate emphasis by difficulty × exam weight.** Spend more words on topics that are HARD and HEAVILY TESTED. Do not expand a trivial topic just because the original guide treated it lightly and the checklist flagged it — sometimes the right fix is "leave brief, add one retrieval prompt", not "write three paragraphs".

13. **No author-specific framing.** All additions use neutral framing ("Prioritize X because…"), never first-person ("I think X is important").

14. **No private data.** Do not preserve student IDs, personal names, grade data, or author self-assessments in any rewrite. If the checklist flags a private artifact, redact — do not rephrase around it.

## Execution order

1. **Read the checklist in full first.** Print the blocker list grouped by type (content addition / content removal / rewrite / private-data redaction / accessibility / structural). Print your planned approach per blocker before editing — which section of the HTML each touches, and which teaching principles apply.

2. **Wait for my go-ahead after printing the plan.** If I say "go", continue. If I redirect, adjust.

3. **Fix blockers in checklist order** (the order reflects impact per minute — follow it unless a later blocker materially depends on an earlier one, in which case call out the reorder explicitly).

4. **For each fix:**
   - State: which blocker, which section of HTML, which teaching principles govern the addition.
   - Cite the source in `materials/` that justifies the content. If no source: mark unfixable and move on.
   - Apply the edit using `Edit`. For JS data array edits, preserve syntactic validity.
   - After the edit, re-grep the file for obvious breakage: unclosed tags, broken JS array commas, orphaned braces. If anything looks off, fix before proceeding.

5. **Push back on weak checklist items.** If a blocker is wrong, over-strict, or contradicted by `materials/`, do not rubber-stamp a no-op change. Quote the evidence from `materials/` and record the pushback in the diff summary. A fixer that silently complies with bad critique is worse than one that argues with proof.

6. **Never strip features to make a blocker "go away."** If a flashcard set is too Remember-heavy, REWRITE cards to higher Bloom's levels — do not delete the section. If a lesson is weak, STRENGTHEN it — do not remove it.

7. **Preserve the visual design.** Use existing CSS classes, color tokens, and component structure. Do not introduce new styling frameworks or redesign layouts. New diagrams use Mermaid with the existing dark theme vars.

8. **Keep the runtime self-contained.** Do not add external dependencies beyond the CDN links already present. Do not reference files outside the HTML.

## Final diff summary

After all fixes, print a structured summary:

- Per blocker: status (fixed / partial / pushed back / unfixable-no-source), the teaching principles you applied, the line ranges you edited, and a one-sentence description of the change.
- Total counts: blockers attempted, fixed, pushed back, unfixable.
- Flagged for manual review: any edit where you made a judgment call (e.g., chose one of two plausible readings of a slide) — the author should verify before shipping.

Do not re-run the review pass — that is a separate session if I ask.

## Non-negotiable rules
- Every written addition cites its source in `materials/` or research-*.md. No fabricated slide numbers, page numbers, or professor attributions.
- Declarative language only in the content itself. No "might be", "could", "perhaps" in a teaching guide — those are hedges that confuse learners. Teachers assert.
- No emoji. No motivational filler. No "great question" or "let's dive in" framing.
- If the checklist file does not exist or is empty, stop and tell me. Do not invent fixes from scratch.

Start by printing the blocker plan and waiting.
```
