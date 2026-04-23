## ADD-NEW-COURSE.md §Stage 5 — Final audit + register

1. Full `/audit-content {id}`. Close every remaining critical. Warnings are ship-blocking; advisories are polish and can defer.
2. Fill any remaining `##` blocks in `cheat-sheet.md` from the Stage 3 topic content.
3. `/add-course {id}` — re-runs audit preflight, compiles, wires the two touchpoints (`scripts/build-content.js` and `app/src/main.jsx`), verifies `npm run build`.
4. `cd app && npm run dev` — smoke-test every subview.
5. `./deploy.sh` — ship.

### Exit criteria
- [ ] All seven canonical files exist and pass `/audit-content {id}` with zero critical findings.
- [ ] Every topic has: lesson with retrieval checkpoint + `**Takeaway**`, topic-dive with `**Example**` (if problem-solving) + `**Pitfall**` (if non-trivial), flashcards with full enrichment, code-practice (if procedural).
- [ ] `topic-dives/exam-strategy-and-pitfalls.md` present.
- [ ] `## Formulas — quick reference` block present (if applicable).
- [ ] `pretest`-tagged mock subset present.
- [ ] Diagram-inventory from Stage 1 fully covered by code-practice files.
- [ ] Zero duplicate ids across all courses.
- [ ] Zero private-data matches.
