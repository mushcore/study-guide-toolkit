# Claude Design Prompt — Study Guide Redesign

## Goal

Design a new study guide web app from the ground up. Do **not** clone the existing layout. The current design (linked/described below) is competent but conventional — a vertical scroll of panels with a sidebar TOC. I want you to invent something genuinely better for the *act of studying*, while keeping the existing visual language so it still feels like the same product.

This is a single-student tool, hosted on GitHub Pages, used in the final 1–7 days before exams. Every design choice should be defended by: **does this help me learn faster, recall better, or review more efficiently than scrolling a long page?**

---

## What to keep (the aesthetic)

The current site uses a restrained Tokyo Night-adjacent dark theme. Preserve this *feel*:

- **Palette:** near-black backgrounds (`#0a0a0a` / `#121212` / `#181818` / `#1f1f1f`), thin neutral borders (`#262626`), text in `#e5e5e5` → `#a3a3a3` → `#737373`.
- **Accents:** muted blue `#7aa2f7` (primary), green `#9ece6a` (ok/correct), red `#f7768e` (bad/wrong), amber `#e0af68` (warn/partial).
- **Type:** Inter / system sans for prose, monospace (`ui-monospace`, SF Mono, Menlo) for code, IDs, badges, eyebrows, and any "stat" numbers. Tight letter-spacing on headings, wide tracking on uppercase eyebrows.
- **Surfaces:** flat. No gradients, no glow, no glassmorphism, no rounded-pill UI. Borders > shadows. Subtle hover states only (border color shift, +1px translate at most).
- **Density:** information-dense but breathable. Treat it like a developer dashboard, not a marketing site.

If you violate any of the above you must justify it with a real ergonomic reason.

## What to throw out

- The "long scroll of panels with a sticky sidebar" structure.
- The static "module → topic → bullet list" presentation.
- The assumption that the user reads top-to-bottom.

## What it has to be (functional requirements)

The user is a CST student cramming four exams (COMP 4736 OS, 4870 .NET, 4911 Enterprise, 4915 SysAdmin). Each course has dense reference material, code samples, and concepts that need active recall — not just rereading.

**Must-haves — non-negotiable:**

1. **Active recall first.** The default mode for any topic should support testing yourself, not passively reading. Think: hide-then-reveal, flashcard flow, "name this concept from its definition," "predict the output of this code," cloze deletions on key terms. Reading mode is a fallback, not the default.
2. **Multiple ways into the same content.** A student mid-cram needs random-access by: course → module → topic, by concept tag (e.g. "deadlock", "JPQL"), by difficulty/confidence, by "what I haven't reviewed today," and by free-text search. Build at least three of these.
3. **Confidence tracking.** Per topic / per question, the user marks confidence (e.g. red / amber / green, or 1–5). The UI surfaces weak areas and de-prioritizes mastered ones. Persist via `localStorage` — no backend.
4. **Spaced-recall scheduling, lite.** Items the user got wrong or marked low-confidence resurface sooner. Keep the algorithm dead simple (Leitner-box style is fine) but make the *queue* visible — "12 cards due today for 4736."
5. **Code + diagrams as first-class.** Existing guides use highlight.js and mermaid. New design must render both, but go further: code blocks should be runnable in the head (predict output → reveal answer), and diagrams should be inspectable (click a node → linked concept).
6. **Exam countdown stays.** The current per-course exam countdown (with `live` / `imminent` / `soon` states) is genuinely useful. Surface it more prominently — it should change the UI's behavior (e.g. when an exam is <24h away, that course's review queue jumps to the top).
7. **Mobile-first, not mobile-tolerated.** I review on my phone in transit. The design must be designed for a 390px-wide screen first, then scaled up. Touch targets ≥44px, no hover-dependent UI, swipe gestures for flashcard flow, bottom-anchored primary actions (thumb reach), no horizontal scroll except inside code blocks.
8. **Keyboard-driven on desktop.** `j`/`k` next/prev, `1`–`5` rate confidence, `/` focus search, `?` show shortcuts, `g g` jump to top, `g c` jump to course picker. Vim-style. Show a discoverable shortcut overlay.
9. **Offline-capable.** All content is static. Service worker so it works on the bus.
10. **Zero build step in production.** Output should be deployable to GitHub Pages as static files. React + Vite is fine if it builds to plain HTML/CSS/JS; no SSR, no runtime API calls.

**Stretch — pick the ones that make the design coherent, drop the rest:**

- A "dashboard" landing page that shows: days until each exam, today's review queue per course, last 7 days of study activity (sparkline), weakest 3 topics across all courses.
- A focus mode: pick a topic, hide everything else, get a 10-minute timed micro-session.
- Cross-course concept linking (e.g. "transactions" appears in 4911 and 4915 — link them).
- A printable / "exam-eve cheat sheet" view per course that fits on 1–2 pages of A4.
- A "drill" mode that randomizes order across an entire course's flashcards.

## What to avoid

- AI-generic SaaS aesthetics: gradient hero, oversized rounded cards, soft drop shadows, emoji-as-icons, marketing copy ("Master your exams!"). This is a tool, not a product page.
- Clever animations on every interaction. Motion only when it communicates state (card flip, queue advance, countdown tick).
- Hiding content behind too many clicks. The current design's worst feature is also its best — everything is one scroll away. Whatever navigation you invent must be at least as fast as `Cmd+F`.
- A chat interface. Don't bolt an AI assistant on. The user will use Claude separately.

## Content shape (so you know what you're designing for)

- 4 courses, each with 4–10 modules, each module with 3–15 topics.
- Topics are a mix of: prose explanations (1–3 paragraphs), code samples (C, C#, Java, Bash), mermaid diagrams (flowcharts, sequence, state), tables (e.g. semaphore vs mutex), and definition lists.
- Existing source: a single ~3000-line `index.html` per course. Treat that as the source of truth — the redesign needs a content model that can be authored from those files (or a one-time migration to JSON / MDX is acceptable).

## Deliverables

1. **A single high-fidelity prototype** (interactive, not screenshots) of the dashboard + one course view + one topic in active-recall mode + the mobile equivalent of all three.
2. **A short design rationale** (under 400 words) explaining the navigation model, the recall flow, and the three biggest departures from the current design — and why each one helps a cramming student more than the existing layout does.
3. **Real content** in the prototype, not Lorem Ipsum. Pull a few real topics from the existing COMP 4736 deadlock material (provided alongside this prompt) so I can judge the design against actual density.

## How I'll evaluate it

I will judge the result on, in order:

1. **Can I learn faster with this than with my current site?** If active recall isn't front-and-center, the design has failed the brief.
2. **Does it work on my phone, one-handed, in landscape and portrait?** Test it.
3. **Does it still look like the same product family as the current site?** If a stranger saw both, would they say "yes, same designer"?
4. **Is it actually deployable as static files to GitHub Pages?**
5. **Originality.** Show me one navigation idea or interaction I haven't seen in Anki, Notion, Quizlet, or a generic docs site.

Surprise me. The current design is a B+. I want an A, and I'd rather see a bold A- attempt than another safe B+.
