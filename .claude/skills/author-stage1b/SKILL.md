---
name: author-stage1b
description: Stage 1b (Voice guide + glossary) of course authoring. Produces the two drift-prevention artifacts used by all downstream stages. Invoke after stage1 completes — same session or fresh session both work.
argument-hint: <course-id>
allowed-tools: Read, Write, Glob
disable-model-invocation: false
---

# Stage 1b — Voice guide + glossary

Produces two shared artifacts every downstream stage reads before writing content.

## Setup

1. Parse `$ARGUMENTS` → `{id}`.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage1b`.
3. Read `content/{id}/_scratch/topic-map.md` — especially the terminology notes per subfolder. Skip if already in context from Stage 1 in this session.
4. If not already loaded in this session, read `content/STANDARDS.md` §Register and §Banned patterns, and `ADD-NEW-COURSE.md` §Stage 1b. Otherwise reuse what is already in context.

## Write: `content/{id}/_scratch/voice-guide.md`

Encodes the course-specific register every downstream authoring session applies verbatim.

Required content:
- Second-person ("you"), declarative, ≤30 words/sentence, active voice (Mayer 2020; d ≈ 0.79).
- No first person — "I", "my", "we'll show you" forbidden.
- No hedges — "might", "could", "perhaps", "arguably" forbidden in teaching claims.
- Active voice. Passive only when the actor is genuinely unknown.
- Paragraphs 1–4 sentences. Lead with the mechanism.
- **Course-specific format conventions** — derived from the topic-map terminology notes. Anything the professor consistently does differently from standard usage (e.g. "uses P/V not wait/signal", "addresses always hex", "always big-endian"). If no deviations found, say so explicitly.
- Banned patterns (from STANDARDS): summarization as primary mode, re-reading guidance, keyword mnemonics for conceptual material, emoji, decorative icons, motivational filler.
- One example of a compliant sentence vs a defect sentence for this course's domain.

## Write: `content/{id}/_scratch/glossary.md`

Internal consistency tool — not a card set. Every term that appeared ≥2 times in the topic-map with potential for variant phrasing must have an entry. Target 30–80 entries.

Format: Markdown table.

```markdown
# Glossary — {id}

Read this before writing any content. Use the canonical form verbatim; never substitute.

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| ... | ... | ... | ... |
```

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage1b: {ISO datetime} — {one-sentence summary}`
- Set `## Current stage` to `stage2`.

## Tell the user

Print: glossary entry count, top-5 most important canonical terms, any course-specific register conventions found.

Then: "Stage 1b complete. Proceed by invoking `/author-stage2 {id}` — same session carries context forward; a fresh session also works."
