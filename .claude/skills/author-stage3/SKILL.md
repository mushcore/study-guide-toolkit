---
name: author-stage3
description: Stage 3 (Per-module authoring) of course authoring. Authors all three content artifacts per topic (lesson, flashcards, practice) for one module, then exits. Re-invoke for each subsequent module — same session carries context forward; a fresh session also works. Invoke after stage2 completes or after the previous module's gate passes.
argument-hint: <course-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent
disable-model-invocation: false
---

# Stage 3 — Per-module authoring

Authors one module per invocation. The progress file tracks which module is next. Re-invoke for each module until all are done — same session carries context forward (earlier reads can be skipped), fresh session also works.

## Setup

1. Parse `$ARGUMENTS` → `{id}`. Get materials path from progress file.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage3`. Read `## Current module` to find which module to author (see progress file format below). If no `## Current module` entry yet, it defaults to the first module in the ranked authoring order.
3. For each file below, read it only if it is NOT already in context from an earlier stage or module in this session. Files that never change across modules (voice-guide, glossary, exam-scope, topic-map, STANDARDS, SCHEMA, exam-strategy lesson) should be read once per session, not once per module:
   - `content/{id}/_scratch/exam-scope.md` — every topic you author must trace here. `out`-of-scope topics are skipped.
   - `content/{id}/_scratch/topic-map.md` — find this module's topics, in-scope tags, ranked order, practice inventory.
   - `content/{id}/_scratch/voice-guide.md` — apply verbatim to everything you write.
   - `content/{id}/_scratch/glossary.md` — canonical terms only throughout.
   - `content/{id}/lessons/00-exam-strategy.md` — calibrates Bloom's + pitfall decisions for this module's topics.
   - `content/STANDARDS.md` `§Quality dimensions × content types` + `§Hard gates` + `§Banned patterns` + `§Practice source discipline` + `§Exam-scope discipline`.
   - `content/SCHEMA.md` `§Lessons`, `§Card types`, `§practice/NN-<slug>.md`.
4. Count existing files to reserve namespaces:
   - `lessons/` file count (excluding `00-exam-strategy.md`) → first available `NN` for this module's lessons.
   - `practice/` file count → first available `NN` for this module's practice items.
   - Card ids use `{topic-id}-card-NN` prefix (no collision possible if topic ids are globally unique).

## Author topics

Work through this module's topics in descending-priority order (highest weight × difficulty first). **Skip topics tagged `in-scope: out`.** For topics tagged `in-scope: prereq`, do NOT author standalone files — note them for inline scaffolding in dependent lessons and move on. Author only `tested` + `listed` topics.

For each in-scope topic:
1. Read source materials for this topic (files listed under the topic in the topic-map `source anchors`).
2. Look up the practice-inventory rows mapped to this topic (from the Stage 1 Practice inventory table). Every row must be covered by ≥1 practice file you author here.
3. Write three artifacts to `content/{id}/_scratch/draft/{topic-id}/` (scratch only — dispatcher merges after):
   - `lesson.md`
   - `cards.yaml`
   - `practice/{NN}-{slug}.md` — one file per practice-inventory row mapped to this topic.

**Use the Agent tool to parallelize topic authoring within the module.** Spawn one agent per in-scope topic in a single tool call. The orchestrator (this session) has already read `voice-guide.md`, `glossary.md`, `exam-strategy.md`, `STANDARDS.md`, `SCHEMA.md`, and `exam-scope.md` in Setup step 3. Do NOT tell topic agents to re-read these files — pass their content inline in the brief. This eliminates N-topics × 6 redundant file reads.

Each agent brief:

> Author all content artifacts for topic `{topic-id}` (`{topic-name}`) in module `{module-name}` of course `{id}`.
>
> ## Read
> 1. Your topic's source files: {source-file-list}
> 2. Your topic's practice-inventory source files: {practice-inventory-source-files — labs, assignments, past-exams mapped to this topic}
> (Do not read any other files — all other context is provided inline below.)
>
> ## Exam pitfalls relevant to this topic (do not re-read lessons/00-exam-strategy.md)
> {PASTE THE PITFALL ENTRIES FROM exam-strategy lesson THAT APPLY TO THIS TOPIC — not the full file}
>
> ## Topic-map rows for this topic (do not re-read topic-map file)
> {topic-map-excerpt}
>
> ## Exam-scope reference (do not re-read exam-scope.md)
> {PASTE THE COVERAGE-LIST LINE THAT MATCHES THIS TOPIC}
>
> ## Practice inventory for this topic (do not re-read topic-map)
> {PASTE THE PRACTICE-INVENTORY ROWS MAPPED TO THIS TOPIC — lab/assignment/past-exam sources, kind, diagram flag}
>
> ## Voice guide (apply verbatim — do not re-read voice-guide.md)
> {voice-guide-content}
>
> ## Glossary (canonical terms only — do not re-read glossary.md)
> {glossary-content}
>
> ## Write to content/{id}/_scratch/draft/{topic-id}/ only
>
> **lesson.md**
> - Opens concrete (concreteness fading) OR with a problem (set `pedagogy: productive-failure` in frontmatter).
> - ≥1 `> **Q:** … / > **A:** …` retrieval checkpoint.
> - ≥1 `**Example**` callout with step-by-step reasoning for non-conceptual topics.
> - ≥1 `**Pitfall**` callout for non-trivial topics, sourced from real past-exam wrong-answer patterns (not invented).
> - Closes with `**Takeaway**` callout.
> - Frontmatter: `bloom_levels`, `source`, `related`.
> - ≤30 words/sentence. Mermaid or inline SVG for visual concepts.
> - If any `prereq` topic needs inline scaffolding here, include a short dedicated `##` section labelled with the prereq topic id, then fold it into the teaching flow.
>
> **cards.yaml** — one YAML object: `{id, name, tags, prose, cards: [...]}`
> - Every card: `type` + `source` + `bloom` + `explanation` + `example`.
> - Cloze: `{{...}}` markers with sentence context around the blank.
> - ≥2 card types per topic. Bloom's spans Remember → Apply minimum; include ≥1 Apply-or-higher card.
> - Atomic: 1 fact, answer ≤15 words, no enumeration, no yes/no.
> - Ids: `{topic-id}-card-NN`.
>
> **practice/{NN}-{slug}.md** — ONE FILE PER practice-inventory row mapped to this topic.
> Per file:
> - Frontmatter: `n`, `id`, `title`, `kind: code | applied`, `tags`, `source`. For `kind: code`: also `lang`, optional `variant: starter-solution | annotation`. Source must name the lab/assignment/past-exam entry with variant notation: `source: "Lab 04 Q2 (variant — simpler SQL join, 3 tables → 2)"`. Never a bare slide reference — slides are not valid practice sources.
> - `kind: code`, `variant: starter-solution` (default): exact H2s `## Prompt`, `## Starter`, `## Solution`, `## Why`. One fenced block each in Starter + Solution, lang = frontmatter lang. `## Why`: mechanism + ≥1 common wrong approach.
> - `kind: code`, `variant: annotation`: exact H2s `## Code`, `## Notes`. Notes = unordered list, each item `**line N** · <tag> — <text>`.
> - `kind: applied`: exact H2s `## Problem`, `## Walkthrough`, `## Common wrong approaches`, `## Why`. Walkthrough ≥3 steps. Common wrong approaches ≥1 item. Inline SVG in `## Problem` when the problem has visual structure (page tables, RAGs, matrices, state machines).
> - Apply the "similar but different or easier" variant rule: change exactly one dimension (numbers, constraints, entity names, input size, table shape) from the source.
>
> ## Do not
> - Invent content. No source → flag with a comment, do not fabricate.
> - Invent practice. No lab/assignment/past-exam anchor → skip; do not author slide-based practice.
> - Substitute glossary variants.
> - Author for `out`-of-scope topics (you shouldn't have been dispatched for one; return error if you were).
> - Touch files outside `content/{id}/_scratch/draft/{topic-id}/`.
>
> ## Return
> Under 200 words: artifacts produced (lesson, card count, practice count broken down by kind), source files cited, practice-inventory rows covered vs skipped-with-reason, claims dropped for missing source, terms not in glossary.

The dispatcher (this session) reads agent returns and injects glossary additions from their reports.

## Merge into canonical tree

After all topic agents return:

1. **Rename + move** for each topic:
   - `_scratch/draft/{topic-id}/lesson.md` → `lessons/{NN}-{slug}.md`.
   - `_scratch/draft/{topic-id}/practice/{NN}-{slug}.md` → `practice/{NN}-{slug}.md` for each file (renumber `NN` sequentially across the module).

2. **Merge cards**: append each `_scratch/draft/{topic-id}/cards.yaml` topic entry into `flashcards.yaml` (create if first module). Grep for duplicate `id` values — stop if any found.

3. **Consistency sweep**:
   - Grep produced files for glossary variant terms. Fix in place.
   - Verify every `related:` frontmatter id resolves to a real file.
   - Dedup near-duplicate card prompts within the module (>60% token overlap — keep the richer one).
   - Verify every practice file's `source:` resolves to an actual file under `materials/labs/`, `materials/assignments/`, or `materials/past-exams/`. Dead citations = stop, fix before merge.

4. **Backfill cheat-sheet (conditional)**: if `course.yaml.cheatsheet_allowed: true`, fill this module's `##` blocks in `cheat-sheet.md` from the lesson content. Terse bullets / short tables / inline code. No H3s. If `false`, skip entirely.

5. **Add missing glossary terms** flagged by agents to `_scratch/glossary.md`.

6. **Practice-inventory reconciliation**: re-open the topic-map practice inventory. Tick off every row that now has a corresponding `practice/` file. Any remaining row not covered by this module — if its topic is in a later module, leave it for that module; if it's in the current module and was skipped by an agent, investigate (missing source? wrong topic assignment?) and fix before gate.

## Audit gate

Run `/audit-content {id}`. Report criticals + warnings scoped to this module's files. Fix every critical and warning before advancing. Advisories accumulate for Stage 5.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage3-{module-id}: {ISO datetime} — {one-sentence summary}`.
- If more modules remain: set `## Current module` to the next module id. Keep `## Current stage: stage3`.
- If this was the last module: remove `## Current module`, set `## Current stage` to `stage4`.

## Tell the user

Print: module name, topics authored (count by `in-scope` tag: tested / listed), topics skipped (out + prereq), practice items produced (by kind: code / applied), practice-inventory rows covered vs uncovered, audit result (criticals/warnings/advisories), any open items added.

If more modules remain: "Module {name} complete. Proceed by invoking `/author-stage3 {id}` for module {next-name} — same session carries context forward (reuse already-loaded files); a fresh session also works."

If all modules done: "All modules complete. Proceed by invoking `/author-stage4 {id}` — same session carries context forward; a fresh session also works."
