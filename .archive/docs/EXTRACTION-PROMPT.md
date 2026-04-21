# Content Extraction Session — Starter Prompt

**Paste everything below this line as the first message of a new Claude Code session. The session's working directory should be `/Users/kevinliang/BCIT/CST/TERM4`.**

---

## Task

Extract all educational content from four existing BCIT course study guides into a canonical Markdown + YAML data format. The canonical format is fully specified in `content/SCHEMA.md` — **read that file first, it is the source of truth**. This prompt is a pointer, not a spec.

## Sources (read-only — do not edit)

Four HTML files, each containing a `const DATA = { meta, flashcards, lessons, topics, mockExam, quizzes, codePractice, cheatSheet, priorities }` object inside a `<script>` tag:

- `study-guides/comp4736/index.html` — Operating Systems (OS)
- `study-guides/comp4870/index.html` — Enterprise .NET
- `study-guides/comp4911/index.html` — Enterprise Service (Java EE / JPA / EJB). **Code practice for this course is line-annotated reading, not starter+solution — use the `variant: annotation` code-practice form per SCHEMA.md §5.**
- `study-guides/comp4915/index.html` — System Administration (Linux)

## Output

The canonical tree specified in `content/SCHEMA.md`:

```
content/
├── SCHEMA.md                   # already exists — do not modify
├── 4736/
│   ├── course.yaml
│   ├── flashcards.yaml
│   ├── mock-exam.yaml
│   ├── lessons/NN-slug.md
│   ├── code-practice/NN-slug.md
│   ├── topic-dives/slug.md
│   └── cheat-sheet.md
├── 4870/ (same shape)
├── 4911/ (same shape, annotation-variant code-practice)
└── 4915/ (same shape)
```

Additionally, produce `scripts/build-content.js` — a Node script that compiles the tree to `content/_dist/{courseId}.js` bundles. Specification in SCHEMA.md §Compilation.

## Execution plan

### Phase 1 — Schema read + source reconnaissance (serial, ~5 min)

1. Read `content/SCHEMA.md` end-to-end.
2. For each source HTML, extract its raw `DATA` object into `/tmp/sg-extract/{courseId}.json` for inspection. Use Node + a brace-matching parser — the DATA blocks are 150–200 KB. Don't try regex-matching the whole object.
3. Skim each dumped JSON to confirm shape matches what SCHEMA.md expects you to produce. If a source field doesn't map cleanly, note it and decide on a transform before writing any output.

### Phase 2 — Parallel extraction (4 agents, one per course)

Spawn four general-purpose sub-agents **in a single message with four tool uses**. Each agent gets the prompt in [Agent prompt template](#agent-prompt-template) below, filled in with its course ID.

### Phase 3 — Build script (serial, ~15 min)

Write `scripts/build-content.js` that:
1. Walks `content/{courseId}/` for each of the four course IDs.
2. Parses `course.yaml`, `flashcards.yaml`, `mock-exam.yaml` with `js-yaml`.
3. For each `.md` file, splits frontmatter with `gray-matter`, renders body with `marked` or `remark` + `remark-gfm`.
4. Applies the transforms in SCHEMA.md §Compilation:
   - Blockquote with recognised bold label → typed callout.
   - Blockquote with `**Q:** … **A:** …` → checkpoint.
   - Code-practice `## Starter` + `## Solution` → paired fences; `variant: annotation` → `code` + parsed `notes[]`.
   - Cheat-sheet `##` blocks → `{ heading, body_html, body_md }`.
5. Validates per SCHEMA.md §Validation. Hard failures abort with actionable message.
6. Emits `content/_dist/{courseId}.js` in the form:
   ```js
   window.CONTENT = window.CONTENT || {};
   window.CONTENT["4736"] = { /* CompiledCourse shape */ };
   ```
7. Also emits `content/_dist/manifest.json` listing the course IDs and file hashes.

Add a minimal `package.json` at repo root if one doesn't exist, with deps `js-yaml`, `gray-matter`, `marked`, `marked-gfm-heading-id` (or equivalent). Add an `npm run build-content` script.

### Phase 4 — Verify (serial, ~5 min)

1. `npm install`
2. `npm run build-content`
3. For each course, require the dist JS in a Node VM and assert:
   - Every top-level section is non-empty (modules, mockExam.questions, lessons, codePractice, topicDives, cheatSheet.blocks).
   - Every topic id unique across all four courses.
   - Every mock-exam `correct` index is in range.
   - Every code-practice file has the right H2 sections.
4. Emit a one-paragraph report per course: counts + any content that degraded during extraction (e.g. HTML that couldn't be cleanly converted to Markdown and was kept as raw HTML — that's expected and acceptable per SCHEMA.md §Global conventions).

## Ground rules

- **Do NOT modify the source HTML files under `study-guides/`.**
- **Do NOT modify `study-guidev2/` at all.** Content extraction is independent of app integration.
- **Do NOT modify `content/SCHEMA.md`.** If you think the schema needs a change, stop and raise it with the user instead of diverging.
- **Do NOT invent content.** Every field must trace back to the source `DATA` object. If a source is sparse (e.g. 4870 has only a few lessons), output is equally sparse — don't fill with plausible-looking material.
- **Preserve fidelity over structure.** If a paragraph has inline `<code class="inline">@Stateless</code>`, it must render as inline code in the output, not as literal text. If a lesson has an inline `<svg>` diagram, keep it as raw HTML in the Markdown body (CommonMark permits this) — do NOT drop it.
- **One commit per phase.** Phase 1 + 2 + 3 + 4 = four commits with clear messages. Makes it easy to revert a phase if extraction drifts.

## HTML → Markdown conversion

Use `turndown` (npm) for the bulk of the HTML-to-Markdown conversion in the extraction agents — it handles `<strong>`, `<em>`, `<code>`, `<ul>`, `<ol>`, `<table>`, `<a>`, etc. correctly.

**Custom turndown rules you must add:**
- `<div class="analogy">` → blockquote with first line `**Analogy**` followed by content (see SCHEMA.md §4 callouts).
- `<div class="takeaway">` → blockquote with `**Takeaway**`.
- `<div class="example">` → blockquote with `**Example**`.
- `<code class="inline">X</code>` → `` `X` ``.
- `<pre><code class="language-X">...</code></pre>` → fenced block with language `X`.
- `<div class="diagram">` containing `<svg>` → keep the SVG as raw HTML; prepend an optional `### <diagram-title>` H3 if the source had a `.diagram-title` sibling.
- `<div class="checkpoint">` with sibling `.q` and `.a` divs → blockquote `> **Q:** …\n> **A:** …` (see SCHEMA.md §4).

Things that must stay as raw HTML in the Markdown output:
- Inline `<svg>` blocks.
- `<table>` that contains `colspan`, `rowspan`, or nested markup (GFM tables don't support these).
- Any `<div>` with a class the rules above don't cover — wrap it in HTML, don't attempt to Markdown-ify.

## Agent prompt template

Each of the four parallel agents gets this prompt, with `{COURSE_ID}`, `{COURSE_CODE}`, `{COURSE_NAME}`, `{CODE_VARIANT}` filled in.

Pass the four agents **in a single tool call message** so they run concurrently.

```
Extract all content for {COURSE_CODE} ({COURSE_NAME}) from the source HTML into the canonical Markdown + YAML tree.

## Authoritative schema
Read `/Users/kevinliang/BCIT/CST/TERM4/content/SCHEMA.md` FIRST. It is the single source of truth for every file shape. This prompt is a pointer.

## Input
`/Users/kevinliang/BCIT/CST/TERM4/study-guides/comp{COURSE_ID}/index.html`

Inside, find `const DATA = { meta, flashcards, lessons, topics, mockExam, quizzes, codePractice, cheatSheet, priorities }`. Use Node with a brace-matching extractor (NOT regex on the whole object) to dump it to `/tmp/sg-extract/{COURSE_ID}.json` first.

## Output directory
`/Users/kevinliang/BCIT/CST/TERM4/content/{COURSE_ID}/`

Must produce:
- `course.yaml`           ← from DATA.meta (SCHEMA §1)
- `flashcards.yaml`       ← from DATA.flashcards, grouped by `topic` field into module→topic→card structure (SCHEMA §2)
- `mock-exam.yaml`        ← from DATA.mockExam; convert `answer: 'A'` → `correct: 0` (SCHEMA §3)
- `lessons/NN-<slug>.md`  ← one file per DATA.lessons[i]; convert `html` body to Markdown per SCHEMA §4 + Custom turndown rules
- `code-practice/NN-<slug>.md` ← one file per DATA.codePractice[i]; variant = `{CODE_VARIANT}` (SCHEMA §5)
- `topic-dives/<slug>.md` ← one file per DATA.topics[i] (SCHEMA §6)
- `cheat-sheet.md`        ← one file, each DATA.cheatSheet[i] becomes an `## <title>` block with body as Markdown (SCHEMA §7)

## Module grouping for flashcards
Source cards have a `topic` string field (e.g. "EJB Intro", "Session Beans"). Group as follows:
1. Cluster cards whose `topic` values share a common theme into a Module (~4–8 modules per course). Use judgement — adjacent topic strings are usually the same module.
2. Each Module id is kebab-case derived from the module name.
3. Each Topic id is globally unique — prefix with module if collision risk.
4. Each Topic carries a short `prose` summary (1–2 sentences). Derive from source `DATA.topics` if an entry matches, else synthesise from the cards' common theme.

## Conversion rules
Use `turndown` (`npm install turndown turndown-plugin-gfm` — prefer `-g` install or standalone invocation) with the custom rules listed in EXTRACTION-PROMPT.md §HTML → Markdown conversion. When a source div doesn't match any rule, keep it as raw HTML in the Markdown body — CommonMark allows this.

## Validation before you finish
Run, from the repo root:
```
node -e "
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const dir = 'content/{COURSE_ID}';
const course = yaml.load(fs.readFileSync(path.join(dir,'course.yaml'),'utf8'));
const fc = yaml.load(fs.readFileSync(path.join(dir,'flashcards.yaml'),'utf8'));
const mx = yaml.load(fs.readFileSync(path.join(dir,'mock-exam.yaml'),'utf8'));
const lessons = fs.readdirSync(path.join(dir,'lessons')).filter(f=>f.endsWith('.md'));
const code = fs.readdirSync(path.join(dir,'code-practice')).filter(f=>f.endsWith('.md'));
const dives = fs.readdirSync(path.join(dir,'topic-dives')).filter(f=>f.endsWith('.md'));
const cheat = fs.readFileSync(path.join(dir,'cheat-sheet.md'),'utf8');
console.log('course:', course.id, course.code);
console.log('modules:', fc.modules.length, 'topics:', fc.modules.reduce((a,m)=>a+m.topics.length,0), 'cards:', fc.modules.reduce((a,m)=>a+m.topics.reduce((b,t)=>b+t.cards.length,0),0));
console.log('mock questions:', mx.questions.length);
console.log('lessons:', lessons.length, 'code-practice:', code.length, 'topic-dives:', dives.length);
console.log('cheat blocks (## headings):', (cheat.match(/^## /gm)||[]).length);
"
```
All counts must be > 0. All card ids must be globally unique across all four courses — the integration step will cross-check.

## Do NOT
- Modify source HTML under `study-guides/`.
- Touch `study-guidev2/`.
- Modify `content/SCHEMA.md`.
- Write to `content/_dist/` (that's for the build script in Phase 3, not this agent).
- Fabricate content. If a source lesson has three paragraphs and no diagram, output has three paragraphs and no diagram.

## Report
One paragraph: counts per section, any `html-passthrough` blocks (how many source divs couldn't be cleanly converted), any content irregularities you had to decide on.
```

---

## Agent slot fill values

| Slot | 4736 | 4870 | 4911 | 4915 |
|------|------|------|------|------|
| `{COURSE_ID}` | `4736` | `4870` | `4911` | `4915` |
| `{COURSE_CODE}` | `COMP 4736` | `COMP 4870` | `COMP 4911` | `COMP 4915` |
| `{COURSE_NAME}` | `Operating Systems` | `Enterprise .NET` | `Enterprise Service` | `System Administration` |
| `{CODE_VARIANT}` | `starter-solution` | `starter-solution` | `annotation` | `starter-solution` |

## Deliverable summary

At the end of the session there should be:
- `content/{4736,4870,4911,4915}/` — populated per SCHEMA
- `scripts/build-content.js` + `package.json` at repo root
- `content/_dist/{4736,4870,4911,4915}.js` — compiled bundles
- `content/_dist/manifest.json`
- A short report (paste in chat, don't commit) of counts and any degraded content

The next session (v2 integration) will consume `content/_dist/*.js` and wire it into the web app. This session should not touch `study-guidev2/` at all.
