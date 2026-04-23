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
- Code-practice problems on the same topic vary in inputs, constraints, or phrasing.
- Worked examples include both the specific solution AND a note on "what changes if …" so the learner sees the variable axis.

---

## Bloom's taxonomy — revised (Anderson & Krathwohl 2001)

Six cognitive levels. Target distribution in a course's drill pool: ~30% Remember, ~30% Understand, ~25% Apply, ~15% Analyze+. Exams test at Apply/Analyze; courses that drill only at Remember fail on Apply questions.

**Enforcement:**
- Every card, mock question, and checkpoint has a Bloom's tag (card `bloom:` field; question `bloom:` field; lesson frontmatter `bloom_levels: [remember, apply]` array).
- Per-course distribution within ±10pts of target triggers warning; >±15pts triggers critical.
- Per-topic: at least one card ≥ Apply level. All-Remember topics fail transfer.

---

## Pretesting / hypercorrection (Richland et al. 2009; Metcalfe 2017)

Attempting a question *before* studying the material improves subsequent learning — even when the learner answers wrong, and especially when high-confidence errors are corrected (hypercorrection effect, Metcalfe 2017 *Annual Review of Psychology* 68:465-489).

**Enforcement:**
- The mock exam is a **day-one** artifact, not an end-of-study one.
- Mock-exam has a `tags: [pretest]` subset of ~5–10 questions the learner is advised to attempt on day one.
- Mock-exam `rationale` fields are elaborated so corrections carry enough signal to trigger hypercorrection.
