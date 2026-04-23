---
name: author-stage3
description: Stage 3 (Per-module authoring) of course authoring. Authors all four content artifacts for one module, then exits. Re-invoke in a fresh session for each subsequent module. Invoke after stage2 completes or after the previous module's gate passes.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent
disable-model-invocation: false
---

# Stage 3 — Per-module authoring

Authors one module per session. The progress file tracks which module is next. Re-invoke in a fresh session for each module until all are done.

## Setup

1. Parse `$ARGUMENTS` → `{id}`. Get materials path from progress file.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage3`. Read `## Current module` to find which module to author (see progress file format below). If no `## Current module` entry yet, it defaults to the first module in the ranked priority list.
3. Read in this order (read each once):
   - `content/{id}/_scratch/topic-map.md` — find this module's topics + ranked priority order.
   - `content/{id}/_scratch/voice-guide.md` — apply verbatim to everything you write.
   - `content/{id}/_scratch/glossary.md` — canonical terms only throughout.
   - `content/{id}/topic-dives/exam-strategy-and-pitfalls.md` — calibrates Bloom's + pitfall decisions.
   - `content/STANDARDS.md` §Quality dimensions × content types + §Hard gates + §Banned patterns.
   - `content/SCHEMA.md` §Lessons, §Topic-dives, §Card types, §Code-practice.
4. Count existing files to reserve namespaces:
   - `lessons/` file count → first available `NN` for this module's lessons.
   - `code-practice/` file count → first available `NN` for this module's code-practice.
   - Card ids use `{topic-id}-card-NN` prefix (no collision possible if topic ids are globally unique).

## Author topics

Work through this module's topics in descending priority order (highest weight × difficulty first).

For each topic:
1. Read source materials for this topic (the files listed under the topic in the topic-map).
2. Write four artifacts to `content/{id}/_scratch/draft/{topic-id}/` (scratch only — dispatcher merges after):
   - `lesson.md`
   - `dive.md`
   - `cards.yaml`
   - `code-practice.md` (only if topic is procedural OR in the diagram inventory)

**Use the Agent tool to parallelize topic authoring within the module.** Spawn one agent per topic in a single tool call. Each agent brief:

> Author all content artifacts for topic `{topic-id}` (`{topic-name}`) in module `{module-name}` of course `{id}`.
>
> ## Read first
> 1. Your topic's source files: {source-file-list}
> 2. The relevant rows from the topic-map (provided below).
> 3. The exam-strategy dive for pitfall calibration: content/{id}/topic-dives/exam-strategy-and-pitfalls.md
>
> ## Topic-map rows for this topic
> {topic-map-excerpt}
>
> ## Voice guide (apply verbatim)
> {voice-guide-content}
>
> ## Glossary (use canonical terms only)
> {glossary-content}
>
> ## Write to content/{id}/_scratch/draft/{topic-id}/ only
>
> **lesson.md**
> - Opens concrete (concreteness fading) OR with a problem (set `pedagogy: productive-failure` in frontmatter).
> - ≥1 `> **Q:** … / > **A:** …` retrieval checkpoint.
> - Closes with `**Takeaway**` callout.
> - Frontmatter: `bloom_levels`, `source`, `related`.
> - `**Pitfall**` callout for non-trivial topics.
> - ≤30 words/sentence. Mermaid or inline SVG for visual concepts.
>
> **dive.md**
> - Frontmatter: `priority` (from topic-map weight), `source`, `bloom_levels`, `related`.
> - Problem-solving topics: ≥1 worked `**Example**` with step-by-step reasoning.
> - Non-trivial topics: ≥1 `**Pitfall**` sourced from past-exam solution keys (never invented).
> - Visual concepts: Mermaid or inline SVG.
>
> **cards.yaml** — one YAML object: `{id, name, tags, prose, cards: [...]}`
> - Every card: `type` + `source` + `bloom` + `explanation` + `example`.
> - Cloze: `{{...}}` markers with sentence context around the blank.
> - ≥2 card types per topic. Bloom's spans Remember → Apply minimum.
> - Atomic: 1 fact, answer ≤15 words, no enumeration, no yes/no.
> - Ids: `{topic-id}-card-NN`.
>
> **code-practice.md** (only if topic is procedural or in diagram inventory: {in-diagram-inventory})
> - Exact H2s in order: `## Prompt`, `## Starter`, `## Solution`, `## Why`.
> - One fenced code block each in Starter and Solution. Lang matches frontmatter `lang`.
> - `## Why`: mechanism + 1–2 common wrong approaches.
> - Diagram-inventory topics: reproduce the past-exam diagram as inline SVG in `## Prompt`.
>
> ## Do not
> - Invent content. No source → flag with a comment, do not fabricate.
> - Substitute glossary variants.
> - Touch files outside `content/{id}/_scratch/draft/{topic-id}/`.
>
> ## Return
> Under 150 words: artifacts produced, source files cited, claims dropped for missing source, terms not in glossary.

The dispatcher (this session) reads agent returns and injects glossary additions from their reports.

## Merge into canonical tree

After all topic agents return:

1. **Rename + move** for each topic:
   - `_scratch/draft/{topic-id}/lesson.md` → `lessons/{NN}-{slug}.md`
   - `_scratch/draft/{topic-id}/code-practice.md` → `code-practice/{NN}-{slug}.md` (if present)
   - `_scratch/draft/{topic-id}/dive.md` → `topic-dives/{slug}.md`

2. **Merge cards**: append each `_scratch/draft/{topic-id}/cards.yaml` topic entry into `flashcards.yaml` (create if first module). Grep for duplicate `id` values — stop if any found.

3. **Consistency sweep**:
   - Grep produced files for glossary variant terms. Fix in place.
   - Verify every `related:` frontmatter id resolves to a real file.
   - Dedup near-duplicate card prompts within the module (>60% token overlap — keep the richer one).

4. **Backfill cheat-sheet**: fill this module's `##` blocks in `cheat-sheet.md` from the lesson/dive content. Terse bullets / short tables / inline code. No H3s.

5. **Add missing glossary terms** flagged by agents to `_scratch/glossary.md`.

## Audit gate

Run `/audit-content {id}`. Report criticals + warnings scoped to this module's files. Fix every critical and warning before advancing. Advisories accumulate for Stage 5.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage3-{module-id}: {ISO datetime} — {one-sentence summary}`
- If more modules remain: set `## Current module` to the next module id. Keep `## Current stage: stage3`.
- If this was the last module: remove `## Current module`, set `## Current stage` to `stage4`.

## Tell the user

Print: module name, topics authored, audit result (criticals/warnings/advisories), any open items added.

If more modules remain: "Module {name} complete. Open a new session and run `/author-stage3 {id}` for module {next-name}."

If all modules done: "All modules complete. Open a new session and run `/author-stage4 {id}`."
