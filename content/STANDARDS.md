# Pedagogical Standards for Generated Content

This document is the canonical pedagogical contract for every artifact this system produces — flashcards, lessons, topic deep-dives, code practice, mock exams, cheat sheets, and anything added in the future. Every rule here cites peer-reviewed, replicated findings and specifies concrete enforcement.

**Goal.** The output is not a study guide. It is a *teacher* — one that teaches the material *better than the course it was built from*. If any generated artifact would fit comfortably as a traditional textbook chapter or lecture-slide summary, it has failed the brief.

**Authority.** This doc overrides anything in `ADD-NEW-COURSE.md`, `content/SCHEMA.md`, or the skill prompts where they conflict. Those docs govern pipeline mechanics and schema; this one governs pedagogy. Update this doc first when the standards change, then update consumers.

**Evidence filter.** Only well-replicated findings appear as rules. Live / fragile research (e.g. disfluency-as-desirable-difficulty, font-hard effects, learning-styles matching) is explicitly excluded — these have failed replication or meta-analysis and are not actionable here.

---

## Primary frame — Dunlosky et al. (2013)

`Improving Students' Learning With Effective Learning Techniques` (*Psychological Science in the Public Interest*, 14(1), 4-58) is the canonical meta-evaluation of ten study techniques. We adopt its two categories as the system's spine.

### High-utility techniques (must be enforced)

Every topic in every course is taught and drilled through these five. Generated artifacts are evaluated on whether they *enable* the learner to use each technique — not whether they merely reference it.

1. **Practice testing** (Rowland 2014 meta g = 0.50; Adesope et al. 2017 g = 0.61). Retrieval is the single highest-leverage study activity. **Enforcement**: every topic has ≥1 retrieval prompt (flashcard, checkpoint, mock question, or predict-the-output); reading-only content without a retrieval affordance is a defect.
2. **Distributed practice** (Cepeda et al. 2006, 2008; optimal ISI ≈ 10–20% of retention interval). **Enforcement**: the app's SR scheduler in `state.js` handles this; content-side enforcement is that topics are atomic enough to schedule independently (see principle 4 below).
3. **Interleaved practice** (Rohrer & Taylor 2007 d = 1.34; Taylor & Rohrer 2010). Mixing topics within a session triples retention vs blocked practice despite feeling harder. **Enforcement**: mock exams and deep-dive sets must not be ordered by module — they interleave. Flashcard sessions draw across modules by default (scheduler handles this).
4. **Elaborative interrogation** — "why is this true?" prompts force schema construction (McDaniel & Donnelly 1996; Dunlosky 2013 meta review). **Enforcement**: every card has an `explanation` field (why-it-matters mechanism, not an answer restatement); every lesson has a closing `**Takeaway**` callout answering "why does this matter / what does it enable".
5. **Self-explanation** (Chi et al. 1989; Wylie & Chi 2014 meta d = 0.55). Learners who explain *to themselves* before checking outperform those who just read. **Enforcement**: flashcard reveal UI prompts "say aloud why before flipping"; every non-trivial lesson contains ≥1 `> **Q:** / > **A:**` checkpoint that withholds the answer until clicked.

### Low-utility techniques (explicitly banned as generated output)

Per Dunlosky 2013, these do not produce durable learning and sometimes trade against it. No generated artifact may rely on them as its primary mode.

- **Highlighting / underlining** — cosmetic emphasis without retrieval. Don't generate "highlight these key terms" guidance. Use cloze deletions or checkpoints instead.
- **Re-reading** — same material, same context. Don't generate "re-read section X" guidance in study plans or inside lessons. Replace with "reconstruct X from memory, then check".
- **Summarization** — students overestimate the learning from summarizing. Acceptable as a cheat-sheet / reference artifact (terse, exam-eve); not acceptable as the *primary* mode for a lesson or dive. Lessons must teach, not summarize.
- **Keyword mnemonic** — memory tricks that don't generalize. Don't generate mnemonic devices for conceptual material. Acceptable only for pure arbitrary-list recall where no semantic structure exists.
- **Imagery-for-text** (different from dual-coding / Mayer). The "visualize this paragraph" technique fails to transfer. Use actual diagrams (Mayer multimedia principles, see below), not imagery prompts.

---

## Mayer's Cognitive Theory of Multimedia Learning (CTML)

Mayer (2020, *Multimedia Learning*, 3rd ed.) — the canonical reference for combining words and visuals. The 12 principles below govern lesson, dive, code-practice, and mock-exam formatting. Each is replicated across 5+ studies in Mayer's meta-evaluations.

1. **Multimedia principle.** Words + pictures > words alone for transfer. **Enforcement**: every topic with a visual structure (state machine, process tree, timing diagram, data flow, matrix) includes a Mermaid or SVG diagram, not prose-only.
2. **Coherence.** Removing extraneous material improves learning. **Enforcement**: no decorative icons, no "fun facts" sidebars, no tangential anecdotes. Every sentence earns its place by teaching or testing.
3. **Signaling.** Highlighting structure (headings, arrows, color-for-role) improves learning. **Enforcement**: lessons use `##`/`###` for structure; callouts (`**Takeaway**`, `**Pitfall**`, `**Example**`) signal role; diagrams label nodes and mark critical paths.
4. **Redundancy.** Simultaneous on-screen text + narration hurts; on-screen text OR narration works. **Enforcement**: when a diagram has labels, don't also caption every node in prose. Let the diagram carry the load.
5. **Spatial contiguity.** Related words and pictures physically adjacent > separated. **Enforcement**: diagram labels are inside / adjacent to nodes, not in a separate legend. Code annotations (COMP 4911 variant) use the `**line N**` format because it spatially binds note to line.
6. **Temporal contiguity.** Words and corresponding pictures presented simultaneously > separately. N/A for async text content; applicable if a future video mode lands.
7. **Segmenting.** Chunking content into learner-controlled segments > monolithic presentation. **Enforcement**: lessons are broken into `##` sections of 3–7 paragraphs max; long proofs are split at natural checkpoints; flashcards are atomic (SuperMemo rule 4).
8. **Pre-training.** Teach component names before the integrated process. **Enforcement**: inside a lesson, define every non-obvious term before using it in a claim. A lesson introducing "two-level page table" first defines "page directory", "page table entry", "frame number" — each gets a cloze or checkpoint — *then* assembles them.
9. **Modality.** Narration + picture > on-screen-text + picture. Text-only app; acceptable here but relevant if audio mode lands.
10. **Personalization.** Conversational register > formal lecture voice (d ≈ 0.79 in Mayer meta). **Enforcement**: second-person ("you", "here's what breaks…"), not third-person passive ("the student observes that…"). Avoid academic hedging.
11. **Voice.** Human voice > machine voice. N/A for text content.
12. **Image.** Adding a cartoon face of the instructor does NOT help. **Enforcement**: no author avatars, no emoji reactions. (Already enforced by SCHEMA §Global conventions.)

---

## Productive failure vs worked examples (Kapur + Sweller resolution)

Two replicable findings pull opposite directions. Resolution governs lesson vs code-practice design.

- **Worked-example effect** (Sweller & Cooper 1985; Renkl 2014 review). For procedures with clear solution steps, showing a fully worked example first and fading to completion problems outperforms problem-solving from scratch. Especially for novices.
- **Productive failure** (Kapur 2008; Kapur 2016 meta). For conceptual understanding of novel ideas, giving learners a challenging problem *before* teaching the canonical solution produces better transfer — even though short-term performance drops.
- **Expertise reversal** (Kalyuga et al. 2003). Worked examples help novices; once skill is built, solved examples become inefficient.

**Resolution for this system:**

| Content type | Default pattern | Why |
|---|---|---|
| Lessons introducing a new *concept* | Productive failure: open with a problem or paradox, let the reader predict, then reveal. `> **Q:**` checkpoints implement this. | Deep conceptual schema formation. |
| Lessons for *procedures* (algorithms, translation rules, syntax) | Worked-example-first: show one fully worked, then a partially worked, then ask the learner to complete. | Procedural fluency. |
| Code practice | Worked-example-first for algorithmic drills; productive-failure for design problems (e.g. "write the schema for X"). Frontmatter flag `pedagogy: worked-example-first | productive-failure | completion-problem` when non-default. | Matches the cognitive task. |
| Topic-dives | Concreteness-fading (see below): open with a concrete instance, generalize. | Reference + reinforcement. |

---

## Concreteness fading (Fyfe, McNeil, Son, Goldstone 2014)

`Concreteness fading in mathematics and science instruction` (*Educational Psychology Review*). Start with a concrete, grounded example; progressively fade to abstract representations. Superior to concrete-only OR abstract-only for both initial learning and transfer.

**Enforcement:** every lesson and dive opens with a concrete instance (a specific input, a named example, a historical case), then generalizes. A lesson that opens with `X is defined as …` without a prior concrete anchor fails principle 2 of the authoring rules. This is a stronger rule than "concrete before abstract" — it requires a *gradient*, not just a single example.

---

## Pretesting / hypercorrection (Richland et al. 2009; Metcalfe 2017)

Attempting a question *before* studying the material improves subsequent learning — even when the learner answers wrong, and especially when high-confidence errors are corrected (hypercorrection effect, Metcalfe 2017 *Annual Review of Psychology* 68:465-489). Effect replicated across domains (Kornell, Hays, Bjork 2009; Potts & Shanks 2014).

**Enforcement:**
- The mock exam is a **day-one** artifact, not an end-of-study one. Study-plan skills recommend taking a mock exam before starting content review.
- Lessons can open with a `> **Q:**` pretest checkpoint (productive-failure-style) to surface prior knowledge and trigger hypercorrection.
- Mock-exam `rationale` fields are elaborated (see elaborated feedback below) so corrections carry enough signal to trigger hypercorrection.

---

## Cognitive Load Theory — 2019 update (Sweller, van Merriënboer, Paas)

`Cognitive architecture and instructional design: 20 years later` (*Educational Psychology Review*). Intrinsic load (task complexity), extraneous load (poor design), germane load (schema-building effort).

- **Minimize extraneous load.** Follow Mayer CTML coherence + signaling + spatial contiguity. No clutter.
- **Manage intrinsic load via segmenting and pre-training.** Split complex topics; define components before the whole.
- **Maximize germane load via schema-building activities.** Analogies that map part-by-part, cross-topic connections, self-explanation prompts.

**Enforcement:**
- No lesson `##` section exceeds ~400 words without being split.
- Every diagram labels its nodes (signaling); split-attention — caption separate from diagram — is a defect.
- Each topic explicitly references ≥1 other topic in the course (schema interconnection) via `related:` frontmatter or inline cross-reference.

---

## Elaborated feedback (Shute 2008; Hattie & Timperley 2007)

`Focus on Formative Feedback` (Shute, *Review of Educational Research* 78(1)). Verification-only feedback ("correct/wrong") is weak; elaborated feedback (why it's right, why each distractor is wrong, what the learner likely mistook) is strong. Especially for conceptual material.

**Enforcement:**
- Every mock-question `rationale` field includes (a) the mechanism behind the correct answer, AND (b) the misconception each distractor targets. A rationale that only restates the correct answer is a defect.
- Code-practice `## Why` sections address the mechanism and name 1–2 common wrong approaches, not just restate the solution.
- Flashcard `explanation` fields are mechanism-first, not answer-first.

---

## Concept variability for transfer (Barnett & Ceci 2002; Gick & Holyoak 1983)

`When and where do we apply what we learn? A taxonomy for far transfer` (Barnett & Ceci, *Psychological Bulletin* 128). Learners who practice one surface form of a problem fail to transfer to novel surface forms. Practicing multiple surface forms of the same deep structure enables transfer.

**Enforcement:**
- Mock-exam banks include at least 2 questions testing the same *deep concept* through different *surface features* (different numbers, different framings, different contexts). Identical-surface-feature questions are not practice — they're inflating the count.
- Code-practice problems on the same topic vary in inputs, constraints, or phrasing. E.g. page-table translation problems span single-level, two-level, and inverted representations.
- Worked examples include both the specific solution AND a note on "what changes if …" so the learner sees the variable axis.

---

## Testing-effect magnitude moderators (Adesope et al. 2017; Rowland 2014)

Multiple meta-analyses converge: retrieval effect size rises with (a) feedback provision, (b) multiple test formats, (c) higher retention intervals. Single-format practice underperforms mixed-format practice.

**Enforcement:**
- Every topic has cards across ≥2 `type`s (cloze + name, or name + predict, etc.) when the topic supports multiple formats. Single-format topics flag a warning.
- The app's SR scheduler handles interval increase on correct recall (`state.js §INTERVALS`).

---

## Bloom's taxonomy — revised (Anderson & Krathwohl 2001)

Six cognitive levels. Target distribution in a course's drill pool: ~30% Remember, ~30% Understand, ~25% Apply, ~15% Analyze+. Exams test at Apply/Analyze; courses that drill only at Remember fail on Apply questions.

**Enforcement:**
- Every card, mock question, and checkpoint has a Bloom's tag (card `bloom:` field; question `bloom:` field; lesson frontmatter `bloom_levels: [remember, apply]` array).
- Per-course distribution within ±10pts of target triggers warning; >±15pts triggers critical.
- Per-topic: at least one card ≥ Apply level. All-Remember topics fail transfer.

---

## Minimum information per unit (Wozniak 1999 SuperMemo 20 rules)

Extended SuperMemo rule-set, still the most cited operationalization of atomic flashcard design. Full set applies to card authoring.

Hard gates (every card must pass):
- [ ] One atomic fact (no compound answers).
- [ ] Answer 1–15 words. Longer → split.
- [ ] Exactly one unambiguous valid answer.
- [ ] Not enumeration ("List the…", "What are the types of…").
- [ ] Not yes/no or binary (use TF mock type for these, not flashcards).
- [ ] Cloze preferred when the fact fits — include surrounding sentence context.
- [ ] Bloom's level tagged.
- [ ] Source cited.

---

## Source discipline (RAG grounding)

Every authored unit traces to `materials/` or a `generated/exam-study/research-*.md` note. LLM parametric knowledge is a forbidden source. This is the guardrail against hallucinated content that looks plausible but contradicts the course.

**Enforcement:**
- `source:` field on every card, mock question, code-practice file, lesson, and dive.
- Audit spot-checks a random sample of 10 cards per pass: cited source must exist and contain the claim.
- Acceptable source formats: `Part 9, Slide 12` / `Lab 06` / `Final_exam_practice_Sol.pdf p.3 Q7` / `research-deadlock.md §2.1` / `Ch 14 p.482`.

---

## Peer-shareability

The site is public. Every artifact is consumed by peers who skipped every lecture. Rules from `ADD-NEW-COURSE.md` consolidated here.

- Standalone comprehension — no "as the professor mentioned" without the mechanism accompanying it.
- No private data — student IDs, personal names, grade data, self-assessments.
- No author-specific framing — neutral voice, never first-person.
- Zero-assumption onboarding — lessons start from the course's actual prerequisites, not from "assumed familiarity".
- Declarative language — no "might", "could", "perhaps" in teaching claims. Teachers assert. If unsure, re-read the source.

---

## Quality dimensions × content types — the authoring contract

This matrix is the ground truth for what every content type must carry. Skills and audits validate against it.

| Dimension | Card | Lesson | Dive | Code-practice | Mock-Q | Cheat-block |
|---|---|---|---|---|---|---|
| **1. Source citation** | `source:` required | frontmatter `source:` required | frontmatter `source:` required | frontmatter `source:` required | `source:` required | block-level comment OK |
| **2. Bloom's tag** | `bloom:` required | `bloom_levels: [...]` required | `bloom_levels: [...]` required | — (inherent) | `bloom:` required | — |
| **3. Elaborative encoding** | `explanation` required | closing `**Takeaway**` required | closing `**Takeaway**` required | `## Why` required (schema) | `rationale` required (schema) | — |
| **4. Worked example** | `example` recommended | `**Example**` callout ≥1 for non-conceptual topics | same | `## Solution` required (schema) | — | — |
| **5. Dual coding** | `diagram` type where applicable | Mermaid/SVG required if concept is visual | same | inline SVG where applicable | — | — |
| **6. Retrieval affordance** | inherent | `> **Q:**/**A:**` checkpoint ≥1 | linked flashcards OR inline checkpoint ≥1 | inherent | inherent | — |
| **7. Pitfall / distractor callout** | — | `**Pitfall**` required for non-trivial | `**Pitfall**` required for non-trivial | common-wrong note in `## Why` | distractor analysis in `rationale` (MCQ/MULTI) | — |
| **8. Concept variability** | — | — | — | ≥1 variant per topic in the bank | ≥2 surface forms per deep concept | — |
| **9. Concreteness fading** | — | opens concrete, generalizes | opens concrete, generalizes | — | — | — |
| **10. Active recall prompt** (self-explanation cue) | UI-level | `> **Q:**/**A:**` checkpoints | inline Q/A or linked cards | — | — | — |

---

## Per-course required artifacts

Every course's `content/{id}/` tree must include:

1. **`topic-dives/exam-strategy-and-pitfalls.md`** (`priority: high`) — time allocation, Part-1 vs Part-2 strategy, domain-specific traps (off-by-one, sign bits, ordering), "when to skip and return" heuristics, the top 5 pitfalls extracted from past-exam solution keys. Sourced from `materials/past-exams/` + any `generated/exam-study/research-*.md`. This artifact is non-negotiable — it's the single highest-leverage topic in the exam-prep window.
2. **Formulas quick-reference cheat-block** — one `##` block in `cheat-sheet.md` titled `Formulas — quick reference` whenever the course contains formulas. Terse, no derivations, symbols defined once at the top. Skip only for non-quantitative courses (rare).
3. **Diagram-based code-practice from past exams** — for every past-exam question that includes a diagram (page tables, RAGs, matrices, state machines, timing), a matching code-practice file must exist with inline SVG reproducing the layout. Past-exam questions without course coverage = critical defect.
4. **Pretest mock-exam subset** — mock-exam has a `tags: [pretest]` subset of ~5–10 questions the learner is advised to attempt on day one (see study-plan skills).

---

## Hard gates vs advisory

**Hard gates** — blocking. `/add-course` refuses to register; `/audit-content` reports as critical. These are the non-negotiables:

- Every card/question/file has `source:`.
- Every lesson has ≥1 retrieval checkpoint.
- Every problem-solving topic-dive has ≥1 worked example.
- Every non-trivial topic-dive has ≥1 `**Pitfall**`.
- Every mock MCQ/MULTI `rationale` addresses each distractor (not just verifies the correct answer).
- Every code-practice file has the schema-required H2 sections (already invariant).
- `topic-dives/exam-strategy-and-pitfalls.md` exists.
- Zero private-data matches.
- Zero duplicate ids.

**Advisory** — surfaced in audit, non-blocking. These flag quality gaps for iterative improvement:

- Bloom's distribution within ±10pts of 30/30/25/15.
- Cards have `explanation` + `example` (not just answer).
- Cards span ≥2 `type`s per topic.
- Lessons open concrete (concreteness fading); not with a bare definition.
- Diagram present for visual concepts.
- Signaling in lessons (headings, callouts, integrated labels).
- `related:` frontmatter links to ≥1 other topic.
- Formulas cheat-block present (courses with formulas).
- Pretest mock-exam subset tagged.
- Conversational register (personalization principle).

---

## Citations

Ordered by relevance to this system, not alphabetical.

- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques: Promising directions from cognitive and educational psychology. *Psychological Science in the Public Interest*, 14(1), 4-58.
- Mayer, R. E. (2020). *Multimedia Learning* (3rd ed.). Cambridge University Press.
- Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review*, 31(2), 261-292.
- Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research*, 87(3), 659-701.
- Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. *Psychological Bulletin*, 140(6), 1432-1463.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science*, 17(3), 249-255.
- Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. *Science*, 331(6018), 772-775.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin*, 132(3), 354-380.
- Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. *Psychological Science*, 19(11), 1095-1102.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6), 481-498.
- Kapur, M. (2016). Examining productive failure, productive success, unproductive failure, and unproductive success in learning. *Educational Psychologist*, 51(2), 289-299.
- Kapur, M. (2008). Productive failure. *Cognition and Instruction*, 26(3), 379-424.
- Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. *Educational Psychologist*, 38(1), 23-31.
- Renkl, A. (2014). Toward an instructionally oriented theory of example-based learning. *Cognitive Science*, 38(1), 1-37.
- Fyfe, E. R., McNeil, N. M., Son, J. Y., & Goldstone, R. L. (2014). Concreteness fading in mathematics and science instruction: A systematic review. *Educational Psychology Review*, 26(1), 9-25.
- Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. *Cognitive Science*, 13(2), 145-182.
- Wylie, R., & Chi, M. T. H. (2014). The self-explanation principle in multimedia learning. In R. E. Mayer (Ed.), *The Cambridge handbook of multimedia learning* (2nd ed.). Cambridge University Press.
- Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect: Do unsuccessful retrieval attempts enhance learning? *Journal of Experimental Psychology: Applied*, 15(3), 243-257.
- Metcalfe, J. (2017). Learning from errors. *Annual Review of Psychology*, 68, 465-489.
- Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research*, 78(1), 153-189.
- Barnett, S. M., & Ceci, S. J. (2002). When and where do we apply what we learn? A taxonomy for far transfer. *Psychological Bulletin*, 128(4), 612-637.
- Gick, M. L., & Holyoak, K. J. (1983). Schema induction and analogical transfer. *Cognitive Psychology*, 15(1), 1-38.
- Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), *Psychology and the real world*.
- Koriat, A., & Bjork, R. A. (2005). Illusions of competence in monitoring one's knowledge during study. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 31(2), 187-194.
- Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). *A taxonomy for learning, teaching, and assessing: A revision of Bloom's taxonomy of educational objectives*. Longman.
- Wozniak, P. (1999). Effective learning: Twenty rules of formulating knowledge. SuperMemopedia.
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1), 81-112.

### Explicitly not cited (fragile / failed replication)

- Learning-styles matching (VARK / modality preference). Dead per Pashler et al. 2008 and Willingham et al. 2015.
- Disfluency-as-desirable-difficulty (hard-to-read fonts). Effect does not replicate per Yue et al. 2013; Eitel et al. 2014.
- Left-brain/right-brain personalization. Neuromyth.
- Mozart effect. Fails to replicate per Chabris 1999, Pietschnig et al. 2010.

Any future rule added to this doc must cite a replicated finding (≥1 meta-analysis or ≥3 independent direct replications). If evidence degrades, remove the rule.
