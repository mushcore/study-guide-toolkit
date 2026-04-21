# Review: COMP4911 Exam Study Package (`generated/exam-study/index.html`)

**Reviewed:** 2026-04-19
**Reviewer mode:** Peer-share audit (`/review-studyguide` 7 dims + Dim 8 Peer-shareability + Dim 9 Teaching craft)
**Source of truth consulted:**
- `COMP4911/CLAUDE.md` (exam format, Bruce intel, my-learning-context)
- `COMP4911/generated/diagnosis.md` (topic priority, past-exam frequency)
- `COMP4911/materials/past-exams/comp4911_quiz3.md`
- `COMP4911/materials/past-exams/comp4911_quiz4.md`
- `COMP4911/materials/past-exams/midterm exam.pdf` (format reference only — not re-extracted)
- `COMP4911/materials/slides/` (36 slide decks — inventory spot-checked)
- `COMP4911/materials/textbook/` (Rubinger/Burke EJB 3.1, Kruchten RUP, Jacobson UP)
- `COMP4911/graphify-out/GRAPH_REPORT.md` (god nodes, communities, hyperedges)
- `COMP4911/generated/exam-study/research-process.md`, `research-jpa-core.md`, `research-jpql-tx-security.md` (dropped-content check)

**HTML coverage:** read 100% (lines 1–3903; no gaps).

**Overall verdict:** **Ship after minor fixes.**

---

## File inventory — proof the whole HTML was read

Data arrays located:
- `const DATA = { ... }` skeleton — line 1089
- `DATA.lessons = [...]` — line 1100 (10 lessons, L1–L10)
- `DATA.flashcards = [...]` — line 2097 (≈170 cards across 22 topics)
- `DATA.topics = [...]` — line 2272 (15 topic deep-dives, tech + proc pillars)
- `DATA.mockExam = [...]` — line 2827 (20 MCQ · 8 T/F · 6 SA · 2 Essay · 1 Code = ~150 marks)
- `DATA.quizzes = { quiz3, quiz4, midterm }` — lines 2951 / 2962 / 2989
- `DATA.codePractice = [...]` — line 3076 (5 code annotation exercises)
- `DATA.cheatSheet = [...]` — line 3294 (20 sheet blocks)

View sections located:
- Dashboard (line 875), Priorities (929), Lessons (978), Topic Deep-Dives (986), Flashcards (997), Mock Exam (1043), Quiz Replay (1062), Code Annotation Practice (1073), Cheat Sheet (1079).

App logic: Prism + Mermaid bootstrap (813–847), countdown/study-time tracker (3496–3525), nav (3529–3537), flashcard engine (3539–3631), topic renderer (3634–3659), mock-exam scoring (3661–3760), quiz replay (3763–3776), code practice renderer (3779–3800), cheatsheet (3807–3816), lesson renderer (3819–3896).

---

## Scorecard

| Dimension | Score | Justification |
|---|---|---|
| 1. Coverage | 4 / 5 | Most high-weight topics covered; gaps are hump chart viz, RUP PM metrics, requirements workflow, analysis-vs-design model contrast, use-case include/extend. |
| 2. Accuracy | 4 / 5 | No outright factual errors against `materials/`. Quiz 3 Q7 answer is debatable but the guide self-discloses the ambiguity. |
| 3. Excess (lower = worse) | 4 / 5 | Lean. MBTI gets heavy attention but Bruce flagged HIGH so warranted. Dashboard "154+" stat is cosmetic. No off-syllabus padding. |
| 4. Pedagogical quality | 4 / 5 | Active-recall widgets, Bloom-tagged cards, worked examples on priority topics. Weakness: Lessons 8/9/10 cram unrelated topics; some deep-dives are bullet dumps, not mechanisms. |
| 5. Clarity & structure | 4 / 5 | Consistent terminology; headings match. Forward references: "managed/detached/PC" used in Lesson 3 before Lesson 4 defines them; "transaction commit" referenced before Lesson 7. |
| 6. Exam alignment | 4 / 5 | All five midterm question types present. 2-hour mock timer matches. Quizzes 3/4 reproduced verbatim. Could use more annotate-this-class variations. |
| 7. Internal consistency | 5 / 5 | No contradictions. Cheat-sheet values match lesson/topic values. EVMS CV = BCWP − ACWP used consistently. |
| **8. Peer-shareability** | **3 / 5** | No private artifacts (no student ID, no real name, no grades). But pervasive author-specific framing ("Bruce HIGH" in topic titles, "per Bruce" tags, first-person "I need" in worked example). References "Midterm Q65-style" without the midterm MCQ bank being in the guide. |
| **9. Teaching craft** | **3 / 5** | Strong analogies and worked examples on top-3 topics (relationships / JPQL / transactions). Weak: Lessons 8–10 compress 3–5 unrelated topics each; several Topic Deep-Dives (Ch 14, 15, 16, Testing) are bullet lists without mechanism; hump chart + risk curve diagrams referenced in prose but never rendered. |

**Tiebreaker check:** Dim 8 = 3, Dim 9 = 3. Neither ≤ 2, so `Ship as-is` is not formally blocked by tiebreaker. Average = 3.78. The blockers below are real but low-effort; verdict remains **Ship after minor fixes** rather than `Ship as-is`.

---

## Critical defects (fix before peer share)

1. **Author-specific framing embedded in topic titles.** Lines 2274, 2387, 2446, 1463 (`n: 5, title: 'Relationships — owning side demystified (Bruce HIGH)'`). Replace "(Bruce: HIGH)" / "(Bruce HIGH)" with "(HIGH PRIORITY)". Source: peer-share rule §8 "no author-specific framing." Severity: blocker for cold peers, cheap fix.
2. **First-person authorial voice in a worked example.** Line 1640: *"Step 2 — **I need** Reservations linked to Cruise."* Convert to second-person: "**You need** Reservations linked…". Source: peer-share rule §8. Severity: blocker (breaks the teaching-from-zero fiction).
3. **Lessons 8 / 9 / 10 each cram 3–5 unrelated topics into one "lesson."** Lesson 8 (line 1756) covers callbacks + security + injection in a single compressed tour; Lesson 9 (line 1863) covers waterfall + RUP phases + 9 workflows + 6 best practices + EVMS formulas; Lesson 10 (line 1979) covers use-case driven dev + BCE stereotypes + analysis-vs-design + testing + MBTI. Zero-knowledge peers cannot reconstruct each concept on the "explain-it-back" test. Split into atomic lessons (L8 → 3 lessons; L9 → 3 lessons; L10 → 3 lessons) OR rename these as "reference summaries" rather than teaching-from-zero lessons. Source: peer-share rule §8 "progressive depth" + teaching-craft §9 "explain it back."
4. **Hump chart described in prose, never rendered.** Lesson 9 line 1929–1935 says *"the hump chart shows this: Requirements hump peaks in Inception + Elaboration, …"* but no chart exists. Source ground: `Comp4911ReviewProcess.pdf` (per `diagnosis.md` slides 36–43). Fix: add a CSS/SVG grid of overlapping humps like the RUP timeline at line 1884, or acknowledge explicitly that the diagram is in the review slides.
5. **Waterfall-vs-iterative risk curve referenced but not drawn.** Line 1878 says *"Risk reduces continuously"* and line 2691 refers to the waterfall-vs-iterative risk curve. Neither is rendered. This is the textbook-defining RUP diagram. Source: `01BestPracticesMod.pdf` + `02rup.pdf`. Fix: add a two-line SVG chart (both rising-then-dropping curves overlaid) under Lesson 9.
6. **References "Midterm Q65-style" without providing midterm MCQ bank.** Line 943 cheat note mentions "Midterm Q65-style"; the Quiz Replay's Midterm tab (line 2989) holds only SA + Essay + Code from the midterm, not the 42 MCQs. Cold peers who didn't take the midterm cannot resolve these references. Fix options: (a) drop the "Midterm Qxx-style" labels in favor of topic tags; (b) inline the midterm MCQs into the replay bank; (c) add a one-line disclaimer in the Quiz Replay header that the midterm MCQs are "summarized across the flashcard and mock-exam banks."
7. **Quiz 3 Q7 answer flagged AMBIGUOUS but final pick may mislead peers.** Line 2958: `answer:'E', explanation:'AMBIGUOUS — strictly @OneToMany alone (C) is enough (defaults to a join table). But Bruce/Burke textbook treats E as canonical: @OneToMany declares relationship + @JoinColumn names FK. Pick E unless context says otherwise.'` No source-of-truth key in `materials/past-exams/comp4911_quiz3.md` (quiz has no answer key). Since Bruce said quizzes reappear verbatim, a wrong pick here costs a peer 2 marks. Fix: ask Bruce for the canonical answer OR set `answer: null` and render a side-by-side rationale for C vs E, letting peers judge.

---

## Missing content

- **Hump chart visualization** — evidence: `materials/slides/Comp4911ReviewProcess.pdf` (per `diagnosis.md` rows 35, 42). Guide references it in prose (line 1929) and in topic Ch 12 (line 2664) but never renders it. Suggested addition: CSS grid of 4 overlapping curves (Requirements / Analysis & Design / Implementation / Test) against a 4-phase horizontal axis.
- **Waterfall vs iterative risk curve** — evidence: `01BestPracticesMod.pdf`, `02rup.pdf`, `research-process.md` Topic 10 lines 336–349. Central to the "why RUP exists" argument in Lesson 9. No source found rendered anywhere in the HTML.
- **Use-case include / extend relationships** — evidence: `07Requirements_as_Use_cases.pdf`; mentioned glancingly as "Extension points" line 2711. Midterm essay material. Add a short topic entry explaining «include» for shared sub-flows and «extend» for optional variations, with one example each.
- **Analysis-model vs Design-model contrast** — evidence: `08AAnalysis_details.pdf`, `09Design.pdf`, `diagnosis.md` "Design workflow details MEDIUM." Guide devotes 3 lines (2053–2056) + 1 line in Topic BCE (2717). Midterm Q13, Q24, Q34 cover Design. Suggested addition: side-by-side table — analysis class stereotype / design class counterpart / input / output artifact / diagram type.
- **Requirements capture workflow steps** — evidence: `06Requirements_Capture.pdf`; `research-process.md` Topic 11 lines 355–369 has the 6-step workflow (elicit → document → analyze → review → prioritize → traceability). HTML reduces this to one bullet under UC-driven. Midterm Q28–Q30 hit this.
- **RUP Project-Management metrics categories** — evidence: `research-process.md` Topic 8 lines 297–309 lists 7 metric categories (progress, stability, adaptability, modularity, quality, maturity, expenditures). HTML has zero coverage. Low-probability but zero-cost to add a 7-bullet list in the EVMS topic.
- **Sequence vs Collaboration diagram distinction** — evidence: `08AAnalysis_details.pdf`; Quiz 4 Q17 (`materials/past-exams/comp4911_quiz4.md` line 114–119). Guide mentions collaboration diagram (lines 2050, 2234) but never contrasts the two. Add a 2-sentence contrast: collaboration = structural/links, sequence = time-ordered.
- **Container-managed vs application-managed EntityManager** — evidence: textbook Rubinger/Burke Ch 9; flashcard `em06-em07` (lines 2122–2123). Not in any lesson. A peer reading only the lessons won't meet this term.
- **`@MappedSuperclass` explanation** — evidence: Ch 12 Inheritance topic line 2442 mentions it in a single line. Midterm Q37 may test. Add a one-paragraph explanation: non-entity abstract base whose mappings descend to child entities; contrast with `@Embeddable`.
- **Persistence.xml content** — evidence: textbook Ch 9; HTML Lesson 3 stack diagram names "Persistence Unit (persistence.xml · defines provider + datasource)" but never shows an example file. A peer deploying would not know what to write.
- **Callback ordering between `@EntityListeners` and entity-level callbacks** — evidence: textbook Ch 14; research-jpa-core.md (assumed). When both exist, listener callbacks fire before entity callbacks per JPA spec. Not covered.

---

## Content to remove

- **None** at the "delete outright" level. The guide is already lean.
- **Trim candidates (not delete):**
  - Dashboard stat "154+ marks" (line 881) — ambiguous to peers (is it total marks? question count?). Replace with "~105" (actual mock-exam total) or remove.
  - Study-time tracker (lines 3511–3525) — personal metric with no exam value; harmless but not peer-useful.
  - Lesson 8 heading "Three smaller topics you need for 5-10 marks total." (line 1757) — author-specific framing ("you need") is fine, but "5–10 marks" is Bruce's estimate, not sourced. Change to "callbacks, security, and injection — high-leverage reference."

---

## Inaccuracies

| Guide says | Source says | Source location | Severity |
|---|---|---|---|
| Quiz 3 Q7 answer = **E** (`@OneToMany and @JoinColumn`) | No answer key in the quiz file | `materials/past-exams/comp4911_quiz3.md` (no key provided) | Medium — peer may lose 2 marks |
| "one milestone per phase" in RUP phases table (line 1906) | RUP has MAJOR milestones at phase boundaries (LCO/LCA/IOC/PR) plus minor milestones at every iteration end | `research-process.md` Topic 8 lines 293–295 ("Minor Milestones: End of each iteration") | Low — simplification, not wrong |
| Lesson 9 "Six best practices" lists "Use component-based architectures" at position 3 (line 1941) | Review slides + Kruchten list them as: Iterative, Requirements, Architectures, Visual, Verify Quality, Changes — order confirmed | `01BestPracticesMod.pdf` + `research-process.md` lines 20–47 | ✓ match — NOT an error |
| Topic "Ch 8 MDBs" line 2644 says "Lifecycle = SLSB (DoesNotExist → Method-Ready Pool, no passivation)." | Textbook Ch 8 confirms MDB lifecycle is identical to SLSB | textbook Rubinger/Burke Ch 8 (assumed) + research-jpql-tx-security.md | ✓ match |
| `@Lock(READ)` "Allows multiple concurrent readers" (line 1283) | Container specification: READ is SHARED, WRITE is EXCLUSIVE | Ch 7 Singleton chapter — matches | ✓ match |
| EVMS "CV = BCWP − ACWP" (flashcard ev04, line 2244; cheat sheet line 3423) | Course slides use this convention; guide correctly discloses the reversed convention caveat at line 2748 | `00 The Project and Earned Value.pdf` + `research-process.md` Topic 9 lines 326 | ✓ match |

No outright-wrong factual claims were found. Flag #1 above is the only material concern.

---

## Pedagogical issues

- **SuperMemo §1 Atomicity violated:** flashcard `sb01` (line 2105) bundles THREE facts — stateless + stateful + singleton definitions — into one card. Split into three cards so the student can mark one known without hiding the others. Same pattern in `rel01` (line 2141, all 7 relationship types in one card), `cb01` (line 2196, seven callbacks in one card), `rup01` + `rup02` (phases + milestones). Violates SuperMemo rule 1.
- **SuperMemo §4 NO LISTS:** `wf01` line 2227 asks "Nine RUP workflows?" — the answer is a 9-item list. Classic set-recall card — easy to pass by reciting the first 3 then drawing blank. Convert to overlapping cloze cards ("Workflow 1 is ____; workflow 2 is ____; …").
- **Some deep-dives are bullet dumps without mechanism.**
  - Ch 14 Callbacks (line 2553): table + 2 rule bullets + code. Zero explanation of WHY rules exist (answer: callbacks run inside flush, re-entering EM would cause re-entrancy issues).
  - Ch 15 Security (line 2579): one code block + programmatic check. No explanation of how `@RunAs` actually swaps the principal, or how roles map to JAAS.
  - Ch 16 JNDI (line 2606): 4 bullets naming annotations + code. Zero explanation of the JNDI mechanism or why the portable scopes exist.
  - Testing topic (line 2751): lists 4 levels + 4 test types with no mechanism. A peer cannot infer *why* acceptance is black-box from the bullet "user validation against requirements."
- **Dual coding thin on Process side.** Process pillar has 2 real diagrams (RUP timeline 1884, UC hub 2003). Technical pillar has 10+ diagrams. Mismatch given Process is ~50% of marks.
- **Desirable-difficulty gap in mock exam essay.** Mock exam Essay Q2 (line 2880) provides a 6 × 3 matrix as the "model answer." This is memorize-the-table, not essay-craft. Real essays require prose justification + example. Replace model answer with a 4-paragraph exemplar that uses the matrix as one section, not the whole answer.

---

## Bloom's distribution

Spot check across flashcard `bloom:` tags (DATA.flashcards lines 2097–2269):

- Remember: ~40% (annotation names, ACID letters, phase milestones, MBTI letter-to-trait)
- Understand: ~35% (relationship rules, lifecycle differences, TX propagation)
- Apply: ~20% (Lock scenarios, JPQL write, cascade detect, orphanRemoval outcome)
- Analyze+: ~5% (few cards; most are card-level one-step applications)

Target per `diagnosis.md` lines 141–148: 40 / 30 / 20 / 10. Current mix sits at 40 / 35 / 20 / 5. **Shortfall at the Analyze tier.** Recommendation: add 6–8 Analyze-level cards that require comparing attributes (e.g., "A REQUIRES_NEW method throws a RuntimeException inside a REQUIRED caller — trace what rolls back and what commits.") These are exactly the essay-style reasoning the midterm tested and the final will retest.

---

## Clarity / consistency issues

- Line 1640: *"Step 2 — **I need** Reservations linked to Cruise."* — first-person voice mid-lesson. See Critical Defect #2.
- Line 1330–1336 (Lesson 3 JPA persistence stack): introduces "Persistence Context" and "Persistence Unit" layers with ≤8-word subtitles. A peer who has never heard either term learns nothing new from the diagram. Add a one-sentence definition beside each layer.
- Line 1389: state table uses "New (Transient)" as a combined label; later text uses "New" alone. Choose one — the SuperMemo clarity rule prefers one consistent vocabulary.
- Line 2169 (flashcard `jpql09`): `q:'What is @NamedQuery?'` — vague prompt ("what is …?" forbidden by rules-of-engagement §4). Rephrase: "What does `@NamedQuery(name=\"X\", query=\"…\")` accomplish and how is it invoked?"
- Line 2957 (quiz 3 Q5 answer): "Elaboration — ~80% of requirements/analysis done here. 'analysis' and 'exception' are not phases." — grammar ok, but "80%" is the guide's convention for "captured" (line 1909). Elsewhere, `research-process.md` says "Elaboration: ~80% of requirements captured" (line 161, 235). Consistent.
- Line 869 sidebar footer: `v1.0 · Bruce Link` — implies authorship. Replace with `COMP 4911 · Final Exam Prep · v1.0` so peers don't read it as "Bruce Link authored this."

---

## Exam alignment

- **Question types match.** MCQ (20), T/F (8), SA (6), Essay (2), Code Annotation (1) in mock exam — matches midterm distribution per `diagnosis.md` lines 15–19.
- **Mock exam timer at 120 min** (line 3722) — reasonable (midterm was 100 min; final may be longer).
- **Quiz replay reproduces quiz 3 and quiz 4 verbatim** — matches Bruce's "quizzes reappear from the same bank" intel. ✓
- **Code annotation practice** — 5 exercises covering: simple entity + auto-gen PK, 1:1 bi, M:N bi, SINGLE_TABLE inheritance, composite key via `@EmbeddedId`. Missing: `@IdClass` exercise (only mentioned, never practiced); bidirectional 1:N (only mentioned in mock exam question 1 and midterm code retrospective — no practice card).
- **Distractor analysis present in MCQ explanations** — ✓ (e.g., "@Virtual, @Calculated don't exist"). Strong.

Recommendations:
1. Add an `@IdClass` code-practice exercise so both composite-key styles are hands-on.
2. Add an essay prompt on "compare analysis model vs design model" — midterm Q13/Q24 signal this is essay fodder.

---

## Dimension 8 — Peer-shareability

### 8.1 Zero-assumption onboarding
- Lesson 1 (line 1102) starts from zero — Java main → banking site → application server. ✓
- Lesson 3 (line 1288) starts from PreparedStatement pain before introducing JPA. ✓
- Lesson 8 (line 1756) does NOT start from zero. It assumes the peer already understands what lifecycle, principal, and JNDI are. **Flag.**

### 8.2 Progressive depth
- Top-3 priority topics (relationships / JPQL / transactions) have a beginner lesson + a deep-dive topic + flashcards + code or mock-exam practice. Good depth layering.
- Ch 15 (Security), Ch 16 (JNDI), Ch 14 (Callbacks) have beginner content only in the compressed Lesson 8. The deep-dive topics are pure reference (code + bullets). **Flag — no middle layer.**

### 8.3 Standalone comprehension
- No references to a lecture or "as we saw in class" that cannot be resolved inside the HTML.
- Bruce references ("per Bruce", "Bruce: HIGH") — resolvable because peers share the instructor. Acceptable, with fix to topic titles (Critical Defect #1).
- "Midterm Q65-style" (line 943) — NOT resolvable; see Critical Defect #6.
- "Quiz 4 Q4/Q5/Q13" (line 1719) — resolvable because Quiz 4 is reproduced in Quiz Replay. ✓
- Line 2089 checkpoint: *"Confusing terminology; Bruce will trap you on this."* — depends on peer knowing Bruce's teaching style. Soft flag.

### 8.4 Private artifacts
- **No student ID found** (grep for `A0135` and `A01\d{6}` patterns returned zero hits).
- **No personal names found** beyond Bruce Link (public instructor).
- **No "my weak areas," comfort-level self-assessments, or grade data** inside the HTML.
- **No lab submissions pasted in.**
- Study-time tracker stores hours in `localStorage` per peer — each peer's tracker resets on their own machine. No leakage between peers. ✓

### 8.5 Author-specific framing
Violations:
- Line 1463: `title: 'Relationships — owning side demystified (Bruce HIGH)'` — author framing.
- Line 2274: `title:'Three Session Bean Types (Bruce: HIGH)'` — same.
- Line 2290: `<h4>Singleton concurrency (Bruce's flag)</h4>` — same.
- Line 2387: `title:'Entity Relationships — All 7 Types (Bruce: HIGH)'`.
- Line 2446: `title:'JPQL — Queries (Bruce: HIGH)'`.
- Line 1640: *"I need Reservations linked to Cruise"* (first person).
- Line 1740: `Memorize the 6 × 2 table — Bruce's favorite quiz material.` — peers survive this.
- Line 2023: Bruce quote inside diagram legend — ok as an attributed quote.

### 8.6 Self-contained runtime
- CDN resources: Prism + Mermaid from `cdnjs.cloudflare.com` / `cdn.jsdelivr.net` (lines 815–820). Both public, stable. ✓
- No `file://` paths. ✓
- No links to sibling `research-*.md` files. ✓
- No broken internal anchors (every `data-section` at line 859–867 resolves to a section id). ✓
- No analytics pings or external tracking. ✓

### 8.7 Accessibility
- Heading order: sidebar `h1`; main `h2.view-title` for each view; `h3` for panels; `h4` for sub-sections. No skipped levels observed. ✓
- Priority badges use TEXT ("HIGH" / "MED" / "LOW") + color (lines 200–202). **Not color-only.** ✓
- Sidebar nav is button-based — tab-focusable by default. ✓
- Flashcard supports keyboard: `ArrowLeft`, `ArrowRight`, `Space`, `k`, `u` (lines 3617–3621). ✓
- Dark-mode only; no light-mode toggle. Minor accessibility concern for peers who prefer high-contrast light theme. Not a blocker.
- No alt text or ARIA labels on SVG diagrams — relies on inline `<text>` labels and `<div class="d-legend">` captions. Acceptable for sighted readers; screen-reader users will parse SVG text but miss visual hierarchy. Partial.
- `@media print` block (lines 735–740) hides sidebar — cheat sheet prints clean. ✓

### 8.8 Difficulty ladder
- Flashcards span Remember → Apply with Bloom tags visible per card. ✓
- Mock exam mixes MCQ (Remember/Understand) with essay + code (Analyze/Apply). ✓
- Quiz replay is all Remember/Understand — appropriate since quizzes are rote repetition.

### 8.9 Explanations over bullet dumps
Violators (bullet-only deep-dives with no mechanism explanation):
- Ch 16 JNDI & Injection topic (line 2606) — pure list.
- Ch 15 Security topic (line 2579) — pure code + check block.
- Ch 14 Callbacks topic (line 2553) — table + two rule bullets.
- Testing topic (line 2751) — bullet list of levels + test types.
- Classic Mistakes + Disaster Recovery topic (line 2814) — 4-bullet category list.

### 8.10 Worked examples per problem-solving topic
- **JPQL:** 4-step walkthrough at lines 1636–1646 ✓
- **Relationships:** code annotation practice × 5 (lines 3076–3289) ✓
- **Inheritance:** SINGLE_TABLE code practice ✓; no JOINED or TABLE_PER_CLASS worked example.
- **Transactions:** matrix + two checkpoints. No traced scenario (e.g., "REQUIRED calls REQUIRES_NEW which throws RuntimeException"). **Flag — worked example missing.**
- **EVMS:** one checkpoint Q (line 1966) computes CV/SV once. No essay-style worked example (e.g., "Given three months of data, forecast EAC and interpret"). **Flag — worked example thin.**
- **Composite keys:** `@EmbeddedId` practice ✓; `@IdClass` not practiced. **Flag.**

### 8.11 Common-mistake callouts
- Code annotation: Bruce's grading checklist (line 2938) ✓
- MCQ distractors: "@Virtual, @Calculated don't exist" ✓
- Lifecycle: "remove() throws on Detached" (line 1424) ✓
- Process pillar: near zero common-mistake callouts. E.g., MBTI has no "common confusion: J/P is an ATTITUDE, not a FUNCTION" — and that exact confusion IS the Quiz 4 Q17 trap. (Actually covered in checkpoint line 2088 — partial credit.)

### 8.12 Diagram references where the source has one
Present:
- EJB ecosystem (line 1124) ✓
- 3 session beans side-by-side (line 1221) ✓
- Entity state machine (line 1397) ✓
- JPA persistence stack (line 1327) ✓
- 7 relationships (line 1514) ✓
- RUP phase timeline with milestones (line 1884) ✓
- Use-case hub (line 2002) ✓
- TX attribute matrix (line 1702) ✓

Missing (where source has one):
- Hump chart — **missing**, discussed at length.
- Waterfall vs iterative risk curve — **missing**.
- 4+1 view model — deliberately absent per Bruce intel. ✓ (OK)
- Sequence diagram example — **absent**; the only use-case-realization visual is the hub.

**Dim 8 score: 3 / 5.** Ceiling raised to 4 once Critical Defects #1, #2, #6 are fixed.

---

## Dimension 9 — Teaching craft

### 9.1 Explain, not just state
Worst offenders:
- Topic Ch 16 JNDI/Injection (line 2606) — 4 bullets listing annotations; no mechanism. A peer cannot explain WHY `@EJB` exists separately from `@Resource`.
- Topic Ch 15 Security (line 2579) — code dump + 2-line programmatic check. No explanation of how the container evaluates `@RolesAllowed` (per-invocation check, not at injection time).
- Topic Ch 14 Callbacks (line 2553) — table + rule bullets. No explanation of WHY callbacks can't access EM (re-entrancy).
- Lesson 8 "Injection (Ch 16)" sub-section (line 1827) — 6 code annotations listed; no explanation of the JNDI hierarchy.

### 9.2 Concept order respects dependencies
- Lesson 3 (JPA) introduces "managed entities" and "Persistence Context" in a stack diagram subtitle (line 1331) before Lesson 4 formally defines them. A peer reading Lesson 3 first sees the label without knowing what "managed" means.
- Lesson 4 uses "transaction commit" before Lesson 7 defines transaction.
- Lesson 5 uses "cascade" term in bullet list (line 1576) before the relationships hub-diagram legend defines it.
- Lesson 7 (Transactions) is the 7th lesson but is a prerequisite for Lesson 4's reliance on "TX commit detaches." Ideally the transaction lesson should precede — or Lesson 4 should include a one-sentence "transaction = a unit of work that commits together; see Lesson 7."

### 9.3 Concrete before abstract
- Lesson 1 anchors with restaurant analogy BEFORE defining EJB. ✓
- Lesson 2 anchors with fast-food / personal banker / bulletin-board analogies. ✓
- Lesson 9 leads with abstract "Waterfall: do all requirements" (line 1867) before the house-blueprints analogy (line 1871). Reverse the order — analogy first, then definition.
- Lesson 10 is dense — no concrete hook before the abstract "RUP is use-case driven" claim (line 1983). Open with the Book-Flight example (line 1997) first.

### 9.4 Worked-example transparency
- JPQL walkthrough (1636–1646) shows all four intermediate transformations. ✓
- EVMS checkpoint (1966) jumps from input to answer in one step. **Flag.**
- Transactions: no traced multi-method example.
- Relationships: the 7 types diagram shows the annotation at the endpoint but does not trace the decision flow "how do I tell which side owns?" beyond the one-line rule. Lesson body compensates adequately.

### 9.5 Misconceptions are the RIGHT ones
The guide's misconception callouts mirror actual Quiz 4 traps:
- "Perceiving FUNCTIONS vs Perceiving ATTITUDE" trap (line 2089) ✓
- "@Table required vs optional" (flashcard jp02 line 2130) ✓
- "@Virtual / @Calculated / @Identity / @PrimaryKey don't exist" ✓
- remove() on detached (line 1424) ✓
Matches the confirmed wrong-answer patterns from `comp4911_quiz4.md`. ✓

### 9.6 Transfer-readiness
- Relationships: a peer who works through Lesson 5 + 5 code exercises + the bidirectional example can annotate a novel 1:N scenario. Transfer-ready.
- JPQL: Lesson 6 walkthrough + flashcards include "write JPQL: employees whose manager has name 'Carol'" novel prompt. Transfer-ready.
- Transactions: without a traced multi-method scenario, the student memorizes the 6×2 grid but may not reason through "REQUIRES_NEW inside REQUIRED, what happens on RuntimeException?" The checkpoint Q at line 1743 asks this but gives only a one-sentence answer. Add a full trace.
- RUP phases: student can list phases + milestones, but cannot reason about "which phase does X belong to" without more worked examples tied to the 9 workflows.

### 9.7 Sentence-level clarity
Three worst sentences:
1. Line 1596–1599 Lesson 6 hook: *"Stop reading JPQL syntax. Start writing queries."* — fine, punchy.
2. Line 2089 checkpoint-answer: *"No — tricky distinction. J/P is the 'attitude toward the outer world' dimension. Perceiving FUNCTIONS are Sensing + Intuition (info gathering). Confusing terminology; Bruce will trap you on this."* — 3 sentences, 39 words, 3 quoted terms, one parenthetical. Peer must re-read. Split into 2 sentences, drop the Bruce reference or move it to a separate callout.
3. Line 1508–1511: *"JPA reads only the owning side when deciding what SQL to run. If you forget mappedBy on the inverse, JPA thinks there are TWO separate relationships and creates a second FK or join table. Disaster."* — clear, but "Disaster." as single-word sentence is a tonal shift. Keep or trim.

### 9.8 Emphasis calibration
- 4+1 architecture view: 3-sentence topic + flashcard with explicit "LIGHT — NOT on final" tag (line 2238) — correctly under-weighted per Bruce. ✓
- MBTI: 9 flashcards + lesson 10 paragraphs + priority panel entry — correctly over-weighted per Bruce (Quiz 4 heavy). ✓
- Hump chart: text says "The 'hump chart' shows this" with 4 follow-on bullets but no diagram. Under-emphasized for a topic that recurred across multiple midterm questions per diagnosis.md.
- EJB intro (Ch 1–2): 4 flashcards + Lesson 1 coverage. Appropriate — LOW weight per diagnosis.md.
- Java EE Design (Ch 18): zero dedicated coverage, mentioned only in the Priorities LOW-panel. Correctly under-weighted. ✓

### 9.9 Analogies land
- Restaurant in mall (Lesson 1): restaurant = your bean, mall = container. Clean mapping — every part of the analogy corresponds. ✓
- Fast-food cashier (SLSB): anyone handles anyone. ✓
- Personal banker (SFSB): dedicated, remembers, goes on break. ✓ (passivation = "goes on break" — strong dual coding)
- Bulletin board in office lobby (Singleton): everyone reads, one edits at a time. ✓ (maps @Lock(READ) vs @Lock(WRITE))
- Teacher's roster (entity states): 4 states = 4 classroom states. ✓ (but "removed at end of day" is slightly off — real Removed is "scheduled for delete at tx commit", closer to "suspended" than "kicked out today")
- Movie script (use-case driven): director/cinematographer/actors. ✓ Strong.
- House blueprints (waterfall): problems discovered at the end. ✓ Strong.

All analogies survive scrutiny.

### 9.10 Explain-it-back test
- Lesson 5 (Relationships): PASS. A peer could reconstruct the owning-side rule: "MANY side owns because the FK lives on the MANY table because DB can't store a collection in one cell."
- Lesson 7 (Transactions): PASS on the mental model ("two axes"). BORDERLINE on the 6-attribute matrix — a peer may memorize the grid without understanding it.
- Lesson 8 (Callbacks + Security + Injection): **FAIL.** Three unrelated topics compressed into one lesson; a peer trying to teach callbacks back to a classmate will inevitably mix them with the security/injection material that followed.
- Lesson 9 (RUP): **FAIL.** Five topics compressed; a peer cannot reconstruct the 9-workflow list or the EVMS formulas from a single lesson reading.
- Lesson 10 (UC-driven + BCE + Testing + MBTI): **FAIL.** Same pattern.

**Dim 9 score: 3 / 5.** Ceiling raised to 4 once Lessons 8–10 are split or re-framed (Critical Defect #3).

---

## What the guide does well

Active-recall infrastructure is first-rate: Bloom-tagged flashcards, timed mock exam, verbatim quiz replay, code-annotation practice with self-checks. The relationship / JPQL / transaction lessons have clean analogies, labeled worked examples, and checkpoint Q&A that test reasoning. Structural diagrams (EJB ecosystem, entity state machine, relationship hub, TX attribute matrix) are accurate and dense without being cluttered. The Bruce intel is mined hard — priority panel and topic tags reflect actual exam probability.

---

## Prescribed next actions (ordered by impact / effort)

1. **15 min — strip author framing.** Replace `(Bruce: HIGH)` / `(Bruce HIGH)` in topic titles and lesson title with `(HIGH PRIORITY)`. Change "I need" to "You need" at line 1640. Change sidebar footer to `COMP 4911 · Final Exam Prep · v1.0`.
2. **10 min — Quiz 3 Q7 safety.** Either resolve with Bruce or replace the committed `answer:'E'` with a side-by-side rationale so peers don't copy the wrong pick.
3. **20 min — fix Midterm Qxx-style references.** Either add a disclaimer to the Quiz Replay header or rewrite the callouts as "(midterm-pattern code question)" / "(midterm-pattern SA)".
4. **30 min — split Lessons 8, 9, 10.** Duplicate the HTML block three times and pull the three sub-topics out. Target: 18 atomic lessons instead of 10 with 3 mega-lessons.
5. **30 min — draw the hump chart and risk curve.** Use the existing `.d-timeline` and SVG machinery. Both are structural diagrams for the Process pillar.
6. **15 min — add a worked transaction-attribute trace.** "Method A (REQUIRED) → calls method B (REQUIRES_NEW) → B throws RuntimeException": walk the stack, show which TX rolls back.
7. **15 min — add `@IdClass` code-practice exercise.** Mirror `@EmbeddedId` style.
8. **15 min — atomize the list-recall flashcards.** Split `sb01`, `rel01`, `cb01`, `wf01`, `rup02` into N cards each using overlapping cloze format.
9. **20 min — add 6–8 Analyze-tier flashcards.** Scenario-based reasoning cards covering: transaction exception propagation, cascade + orphanRemoval interaction, fetch-type choice trade-offs, inheritance strategy trade-offs, owning-side inversion consequences.
10. **20 min — mechanism paragraphs for Ch 14 / 15 / 16 deep-dives.** One paragraph each explaining WHY, not just WHAT.

After steps 1–3 (≤45 min total), the guide is peer-shippable. After 4–10 (≤2.5 h additional), it moves to `Ship as-is`.
