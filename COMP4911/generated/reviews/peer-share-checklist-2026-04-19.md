# Peer-share blockers — COMP4911

Verdict from full review: **Ship after minor fixes** (dim 8 = 3, dim 9 = 3; no dimension ≤ 2, so the tiebreaker does not force rework).

Fix in this order. Items 1–5 are true blockers for cold-peer sharing; 6–10 are quality lifts before "Ship as-is."

---

1. **Strip author-specific framing from topic + lesson titles.** — location: `DATA.lessons[4].title` line 1463 (`'Relationships — owning side demystified (Bruce HIGH)'`), `DATA.topics[0].title` line 2274 (`'Three Session Bean Types (Bruce: HIGH)'`), `DATA.topics[3].title` line 2387 (`'Entity Relationships — All 7 Types (Bruce: HIGH)'`), `DATA.topics[6].title` line 2446 (`'JPQL — Queries (Bruce: HIGH)'`), topic html line 2290 (`<h4>Singleton concurrency (Bruce's flag)</h4>`), sidebar footer line 869 (`v1.0 · Bruce Link`) — source: peer-share rule §8 "no author-specific framing"; instructor public name is fine in dashboard intel panel but not embedded in every title — fix: replace `(Bruce: HIGH)` / `(Bruce HIGH)` with `(HIGH PRIORITY)`; replace sidebar footer with `COMP 4911 · Final Exam Prep · v1.0`.

2. **Remove first-person voice from the JPQL worked example.** — location: Lesson 6 "Practice: walk through a real query" line 1640 (`<p><strong>Step 2 — I need Reservations linked to Cruise.</strong> ...</p>`) — source: peer-share rule §8 "no first-person framing" — fix: replace `I need` with `You need`.

3. **Neutralize `Midterm Q65-style` references for peers who never took the midterm.** — location: priorities panel line 943 (`Midterm Q65-style`) and scattered flashcard `source` fields tagged `Midterm 54/55/56/57/59/60/61` (lines 2219, 2234, 2243, 2248, 2267–2268) — source: peer-share rule §8 "standalone comprehension" — the midterm MCQs are NOT in `DATA.quizzes.midterm` (line 2989 onward contains only SA / Essay / Code), so any `Midterm Q##` reference is unresolvable for a cold peer — fix: add a one-sentence disclaimer in the Quiz Replay view header (`<p class="view-sub">`) explaining that midterm MCQs are summarized across flashcards + mock-exam rather than replayed, OR remove the `Midterm Q##` tags and keep only topic tags.

4. **Resolve Quiz 3 Q7 committed answer.** — location: `DATA.quizzes.quiz3[6]` line 2958 (`answer:'E', explanation:'AMBIGUOUS — ... Pick E unless context says otherwise.'`) — source: `materials/past-exams/comp4911_quiz3.md` lines 47–52 (no answer key provided) — because Bruce confirmed quiz questions reappear verbatim, a committed wrong pick costs peers 2 marks — fix: confirm the canonical answer with Bruce; if unresolvable, change `answer:null` and render BOTH C and E as legitimate options with a side-by-side rationale.

5. **Split Lessons 8, 9, 10 into atomic lessons.** — location: `DATA.lessons[7]` line 1756 (L8 = callbacks + security + injection), `DATA.lessons[8]` line 1863 (L9 = waterfall + RUP phases + 9 workflows + 6 practices + EVMS), `DATA.lessons[9]` line 1979 (L10 = use-case driven + BCE + analysis-vs-design + testing + MBTI) — source: peer-share rule §8 "progressive depth" + teaching-craft §9 "explain it back"; these lessons fail the explain-it-back test — fix: duplicate each lesson's HTML block into 3 sibling lessons so the total becomes ≈18 atomic lessons. Alternative low-effort fix: relabel L8 / L9 / L10 as "Reference summaries" and add `hook:` text that says "overview only — see topic deep-dives for each concept separately."

6. **Render the hump chart diagram.** — location: Lesson 9 lines 1929–1935 (prose mentions the chart but no visual) and Topic "RUP Four Phases & Milestones" line 2664 (bullet list only) — source: `materials/slides/Comp4911ReviewProcess.pdf` hump-chart slide (per `diagnosis.md` rows 35, 42) — fix: add an SVG or CSS-grid of 4 overlapping workflow curves against a 4-phase horizontal axis under Lesson 9 after line 1935, reusing the `.d-timeline` grid styling from line 1884.

7. **Render the waterfall-vs-iterative risk curve diagram.** — location: Lesson 9 lines 1869, 1878 and Topic "Six Software Best Practices" line 2691 — source: `materials/slides/01BestPracticesMod.pdf`, `02rup.pdf`; `research-process.md` Topic 10 lines 336–349 — fix: 2-line SVG of overlaid curves (waterfall stays flat high then drops late; iterative declines early) under Lesson 9 after the "Four phases" section.

8. **Add a worked transaction-attribute trace.** — location: Lesson 7 after the matrix at line 1721 (no trace, only checkpoint Q at line 1743) — source: Ch 17 Transactions chapter of Rubinger/Burke textbook + diagnosis.md row EJB Transactions HIGH — fix: insert a 3-step trace showing a REQUIRED method calling a REQUIRES_NEW method that throws RuntimeException, walking what rolls back, what commits, and what the caller sees.

9. **Atomize list-recall flashcards (SuperMemo §1 + §4).** — location: `DATA.flashcards` cards `sb01` line 2105 (3 session beans in one card), `rel01` line 2141 (7 relationship types in one card), `cb01` line 2196 (7 callbacks in one card), `wf01` line 2227 (9 workflows in one card), `rup01/rup02` lines 2214–2215 (phases + milestones) — source: `studyplanner.md` SuperMemo 20 Rules (§1 atomicity, §4 no list-recall) — fix: split each into N cards using overlapping cloze deletion ("Workflow 3 of 9 is `{{Analysis & Design}}`; workflow 4 is `{{Implementation}}`; …").

10. **Write mechanism paragraphs for Ch 14 / 15 / 16 deep-dive topics.** — location: Topic Ch 14 Callbacks line 2553 (table + 2 rule bullets), Topic Ch 15 Security line 2579 (code only), Topic Ch 16 JNDI line 2606 (4 bullets + code) — source: peer-share rule §8 "explanations over bullet dumps" — fix: add one short paragraph to each topic explaining the mechanism (callbacks: re-entrancy is why EM access is forbidden; security: how @RolesAllowed is evaluated per-invocation; injection: what the JNDI portable scopes mean and when to pick which).

---

**Also add (non-blockers, increase exam-value ROI):**

- `@IdClass` code-practice exercise to mirror the `@EmbeddedId` one at line 3242.
- 6–8 Analyze-tier flashcards (TX exception propagation; cascade + orphanRemoval interaction; fetch-type trade-offs; inheritance strategy trade-offs).
- One essay prompt on "analysis model vs design model contrast" — midterm essay fodder per `diagnosis.md` row Design MEDIUM.
- Sequence-vs-Collaboration diagram contrast (Quiz 4 Q17 trap — `materials/past-exams/comp4911_quiz4.md` line 114–119).

After items 1–5 the guide is **safe to share with cold peers**. After items 6–10 the guide can be graded `Ship as-is`.
