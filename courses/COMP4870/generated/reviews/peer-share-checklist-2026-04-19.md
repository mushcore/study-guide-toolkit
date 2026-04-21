# Peer-share review — COMP4870

## Scorecard
| Dim | Name | Score |
|---|---|---|
| 1 | Coverage | 3/5 |
| 2 | Accuracy | 4/5 |
| 3 | Excess | 4/5 |
| 4 | Pedagogical quality | 3/5 |
| 5 | Clarity & structure | 2/5 |
| 6 | Exam alignment | 2/5 |
| 7 | Internal consistency | 2/5 |
| 8 | Peer-shareability | 2/5 |
| 9 | Teaching craft | 2/5 |

**Overall verdict:** Major rework required

Tiebreaker triggered: dimensions 8 and 9 both score 2, which forbids `Ship as-is` irrespective of other dimensions. The guide also has a runtime defect that renders its two practice-testing views (Mock Exam, Quiz Replay) non-interactive.

## Blockers (fix in order — highest impact per author-minute first)

1. **Mock Exam and Quiz Replay render question stems only — no choices, no textareas, no auto-grade**
   - Location: `renderQuestion` in `index.html` lines 2579–2595; data at lines 1719, 1783, 1786, 1823 and following
   - Source: internal HTML (renderer checks `q.type === 'MCQ' | 'T/F' | 'Short Answer' | 'Code Annotation' | 'Applied'` but every question in `DATA.mockExam` and `DATA.quizzes.midterm` uses lowercase `'mcq' | 'short' | 'code'`)
   - Why flagged: every peer who opens Mock Exam or Quiz Replay sees only question text + a bare "Show answer" button. The core testing surface of the guide is dead on arrival. Hits dims 5, 6, 7, 8.
   - Fix: change the five `q.type ===` string literals in `renderQuestion` to lowercase (`'mcq'`, `'tf'`, `'short'`, `'code'`) OR rewrite the data to uppercase; update the `submitMock` branch at line 2644 to match.

2. **Cheat Sheet view tells peers to print it — exam rule requires HAND-WRITTEN**
   - Location: `index.html` line 457 (`<p class="view-sub">Condensed reference. Print-friendly (Ctrl+P). For morning-of review only.</p>`)
   - Source: `CLAUDE.md` "Allowed materials: ONE HAND-WRITTEN cheat sheet, 8.5\" × 11\", both sides. Must be hand-written (not printed)."
   - Why flagged: a peer who follows the visible instruction brings a printed sheet and is turned away or penalized. Mentioned once inside lesson 11 but the view itself contradicts that. Hits dims 6, 7, 8.
   - Fix: replace the subtitle with "Template to hand-copy onto your allowed 8.5×11 sheet. Printed copies are NOT permitted in the exam room."

3. **Coding question in Mock Exam reveals placeholder text, not a solution**
   - Location: `index.html` line 1786 (`answer:'See model solution below.'`) rendered through `renderQuestion` line 2597
   - Source: internal HTML — the actual solution lives in `q.template` which is only injected into the textarea, never into the reveal block
   - Why flagged: the mock exam is the primary graded-simulation feature. Submitting reveals a dangling reference to a "model solution below" that does not appear below. Hits dims 5, 7, 8.
   - Fix: move the solution string from `template` into `answer` (or concatenate both), or render `q.template` inside the reveal block for `type:'code'` questions.

4. **Footer attributes authorship to the instructor**
   - Location: `index.html` line 358 (`<div class="foot" id="side-foot">v1.0 · Medhat Elmasry</div>`) and line 2720 (`'v1.0 · ' + (DATA.meta.instructor || '')`)
   - Source: no source in `materials/` states Elmasry authored this guide; he is the course instructor per `materials/syllabus/4870 course outline.pdf`
   - Why flagged: shipping a student-authored cram guide with the instructor's name in the footer implies endorsement or authorship. Reputational and attribution hazard before any peer even opens a lesson. Hits dim 8.
   - Fix: change the line to "Student-authored · Sources: COMP 4870 materials by Prof. Medhat Elmasry" (or similar neutral credit).

5. **Mock Exam timer and question count do not match the real exam**
   - Location: `index.html` line 575 (`mockDurationMinutes: 120`); mock data lines 1719–1817 contain ~44 MCQ + 1 match + 1 code
   - Source: `CLAUDE.md` exam format — 60 MCQ + 10 match + 1 code in 60 minutes
   - Why flagged: a peer practising with the mock is training for a 2-hour, 44-MCQ paper that does not exist. Pacing is the #1 risk in a 60-minute 71-question exam; misaligned simulation is worse than no simulation. Hits dim 6.
   - Fix: set `mockDurationMinutes: 60`, add 16 MCQs weighted per the topic-weight table, split the single "match" item into 10 one-mark rows so the grading breakdown matches reality.

6. **Quiz Replay only contains pre-midterm (out-of-scope) questions**
   - Location: `index.html` lines 1822–1845 — `DATA.quizzes` has one key `midterm` with 20 pre-midterm topic questions (Razor, Blazor Nav, EF Core migration verbs, Identity RoleManager, MVC `@Model`, etc.)
   - Source: `CLAUDE.md` scope statement "Scope: Weeks 7-13 (post-midterm, including Week 7)"; the guide's own Priorities pane line 635 says "Exam scope is weeks 7-13. Fundamentals may appear as context only — don't re-study MVC/Razor/EF"
   - Why flagged: the view's subtitle (line 444) tells peers "Instructors often reuse — memorize these cold," pushing them to memorize W1–W6 material the guide itself flags as low-priority. Hits dims 3, 6, 7.
   - Fix: relabel the `midterm` bank as "Midterm replay (reference only — not tested on final)" OR add a second bank of W7–13 retrieval questions generated from the slides.

7. **"Lessons — teaching from zero" has no Lesson 1 and does not start from zero**
   - Location: lessons section header `index.html` line 376; lessons array line 657 begins with `{ n: 2, title: 'Semantic Kernel and chat completion' ... }`
   - Source: internal HTML (array never contains `n:1`); `materials/slides/4870_intro.pptx` shows the actual zero-level prerequisites (ASP.NET Core, `Program.cs`, DI container, builder.Services)
   - Why flagged: the section promises a zero-entry path and opens with "Semantic Kernel (SK) orchestrates LLM calls. You build a Kernel, it exposes IChatCompletionService, you hand it a ChatHistory…" — every technical noun is undefined. A peer who skipped lectures hits an undefined-term wall in the first sentence. Hits dims 1, 4, 8, 9.
   - Fix: either add a Lesson 1 that defines LLM, SLM, DI container, `Program.cs`, builder pattern, `IServiceCollection`, and middleware in plain language; or rename the section "Lessons — topic deep-dives" and drop the "from zero" claim.

8. **Four low-weight topics collapsed into one lesson with one paragraph each**
   - Location: Lesson 9 `index.html` lines 934–961 — Localization (4 mk), Tag Helpers (3 mk), QuickGrid (2 mk), Excel/PDF/Chart (2 mk) bundled as dense prose paragraphs, no worked examples, no analogies, no checkpoints
   - Source: `materials/slides/asp_core_localization.pptx`, `materials/notes/TagHelpers_SCRIPT.docx`, `materials/notes/BlazorServer_QuickGrid.docx`, `materials/notes/Add package for PDF.html` — each has full walkthrough material
   - Why flagged: 11 marks (~16% of the 70-mark non-coding portion) get the lowest teaching density in the guide while lower-stakes mechanics get full lessons. A peer who never saw these topics in class gets bullet dumps with no mechanism or example. Hits dims 1, 4, 9.
   - Fix: split into four lessons matching the other pillars (hook, analogy, code walkthrough, takeaway, checkpoint). Source material for all four exists in `materials/`.

9. **Lessons and deep-dives dump finished code with no intermediate reasoning**
   - Location: Lesson 4 ML.NET lines 727–766 (7-step pipeline shown as a single code block with no per-step "why"); Topic ML.NET lines 1286–1326 (same pattern); Lesson 5 Cache lines 772–802 (three strategies listed without deciding between them); Lesson 6 gRPC lines 808–849 (proto+server+client with no "field number vs order" mechanism explained in-line — trap appears only in sidebar bullets)
   - Source: `generated/exam-study/research-mlnet.md` lines 1–80 and beyond include "why split 0.2", "why Concatenate is required by trainers", "why ITransformer not Prediction" — content that was dropped during HTML build
   - Why flagged: peers can recite the exact pipeline shown but cannot transfer to a novel dataset. At 12 marks of Apply-level ML.NET questions, recognition-only prep underperforms. Hits dims 4, 9.
   - Fix: add per-step rationale inline (2–3 sentences per step) in Lesson 4 and Topic ML.NET, pulling from `research-mlnet.md`. Repeat the pattern for Lesson 5 (decision tree already exists — verbalize it) and Lesson 6 (field-number mechanism).

10. **CSS for lesson checkpoints is defined but no lesson uses one**
    - Location: `index.html` lines 234–238 define `.lesson .checkpoint`, `.ck-q`, `.ck-a`, `.revealed` with click-to-reveal answer styling; no lesson in `DATA.lessons` contains a `checkpoint` div
    - Source: internal HTML
    - Why flagged: the guide advertises active recall (dashboard "Active recall > rereading" line 2367) but ships no embedded recall prompts in the lesson flow. The scaffolding exists; the content is missing. Hits dim 4.
    - Fix: add 1–2 click-to-reveal checkpoints per lesson (e.g., Lesson 4: "Without looking, what does `Fit()` return and why?" → `ITransformer`, because the trained pipeline is reusable across new IDataViews).

11. **No "common mistakes" callouts in the most error-prone lessons**
    - Location: Lesson 4 ML.NET (no callouts), Lesson 5 Cache (no callouts), Lesson 7 TDD (no callouts). Only Lesson 8 File-based has the single "no space after colon" warning inline; Topic deep-dives have "Exam traps" sections but lessons do not.
    - Source: `materials/past-exams/` is empty so actual wrong-answer patterns cannot be cited; however `materials/slides/ML.NET.pptx`, `materials/slides/TDD_xunit.pptx`, `materials/notes/DataCache_SCRIPT.docx` each flag typical confusions (e.g., `Assert.Equal(actual, expected)` swap, `[Fact]` vs `[Theory]`, Absolute vs Sliding semantics, Label vs Score columns)
    - Why flagged: peers benefit most from what-goes-wrong callouts. Without past-exam solution keys the guide cannot cite real-student errors, but slide-flagged pitfalls are still genuine and absent from lessons. Hits dim 9.
    - Fix: add a 3-bullet "common mistakes" block to Lessons 4, 5, and 7, sourced from the slide warnings; stop promising the callouts are from past-exam data (because past-exam data does not exist here).

12. **Analogies in AI lessons do not map cleanly**
    - Location: Lesson 3 line 699 — "SK = drinking coffee. MAF = espresso machine that knows your order history. MCP = the USB standard that lets any tool plug into any agent."
    - Source: no source in `materials/`
    - Why flagged: "espresso machine that knows your order history" has no corresponding MAF mechanism a peer can map to — MAF does not inherently persist order history; `AgentSession` holds multi-turn state within one session, not across invocations. The analogy overstates capability and may mislead at the MCQ level (where session persistence is a named trap). Hits dim 9.
    - Fix: replace with a mapped analogy (e.g., "SK = calling a chef on the phone; MAF = a chef who remembers this conversation. MCP = a universal plug any kitchen tool honours") OR drop the analogy and state the literal difference.

13. **Priorities pane says scope excludes MVC/Razor/EF but mock's match-column drills them**
    - Location: priorities `index.html` line 635 says "don't re-study MVC/Razor/EF"; quiz replay match-column line 1844 pairs "Code-first EF Development", "Multi-docker", "React.js", "Azure Static Web App", "Minimal WebAPI", "Azure Functions", "Single docker", "TypeScript", "Swagger", "SignalR" — all pre-midterm topics
    - Source: `CLAUDE.md` scope weeks 7–13
    - Why flagged: same guide tells peers two opposite things within three tab-clicks. Hits dim 7.
    - Fix: either re-scope the quiz replay to W7–13 or annotate the midterm bank "context review only, not tested".

## Strengths to preserve (max 3 bullets, one line each)
- Flashcards are correctly atomic, Bloom-tagged, and source-cited to specific slides or scripts — keep the structure and sourcing rule.
- Topic deep-dives pair code with "Exam traps" callouts that cite real distractor patterns (fake method names, bracket-style swaps, singular/plural traps) — the pattern is worth propagating into the lessons.
- The 17-block cheat-sheet template is well-organized by pillar and correctly compressed into code-first snippets — solid base for the hand-written sheet (after fixing the "print-friendly" label).
