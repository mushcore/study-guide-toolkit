---
name: author-stage1
description: Stage 1 (Triage) of course authoring. Reads all materials, produces the topic map. Invoke in a fresh Claude Code session after /author-course reports the current stage is stage1.
argument-hint: <course-id>
allowed-tools: Read, Write, Bash, Grep, Glob, Agent
disable-model-invocation: false
---

# Stage 1 — Triage

Reads all course materials and produces `content/{id}/_scratch/topic-map.md`. This is the only task for this session.

## Setup

1. Parse `$ARGUMENTS` → `{id}`.
2. Read `content/{id}/_scratch/progress.md` — confirm `Current stage: stage1`. If not, stop and tell the user to check `/author-course {id}` for the correct stage.
3. Read `content/STANDARDS.md` — focus on §Source discipline and §Per-course required artifacts.
4. Read `ADD-NEW-COURSE.md` §Stage 1 — the topic-map template and triage spec.
5. Read `content/{id}/_scratch/progress.md` §Open items.

Get the materials path from the progress file (`Materials:` line).

## Read materials

Fan out one read pass per subfolder under the materials path. Use the Agent tool to parallelize — spawn one agent per subfolder, each reads only its subfolder and returns a structured report. Typical subfolders: `slides/`, `past-exams/`, `notes/`, `labs/`, `syllabus/`, `resources/`.

Each sub-agent brief:
> Read every file under `{materials_path}/{subfolder}/`. Return structured markdown (under 400 words):
> 1. Topics covered + estimated emphasis (bold / repeated / chapter-heading signals).
> 2. Every diagram encountered — type (page table, RAG, matrix, state machine, timing, tree), associated question or slide number.
> 3. For past-exams: question count per topic, wrong-answer patterns from solution keys if present.
> 4. For syllabus: exam date, format, room, allowed materials, instructor.
> 5. Terminology the professor uses differently from standard usage.
> Do not write any files. Return structured markdown only.

Also spawn one agent for (if present):
- `courses/COMP{id}/generated/exam-study/research-*.md`
- `courses/COMP{id}/graphify-out/GRAPH_REPORT.md`

Brief: return dense topic summaries, god-node list, surprising cross-topic connections. Under 400 words.

## Produce topic map

Merge all sub-agent reports into `content/{id}/_scratch/topic-map.md`. Follow the template from ADD-NEW-COURSE.md §Stage 1 exactly. Required sections:

- **Exam meta** (from syllabus): code, name, date (ISO+TZ), format, room, allowed materials, instructor.
- **Modules (4–8)** with topics. Per topic: weight %, difficulty (low/mid/high), god-node status, tags, source coverage, notes from past-exam patterns.
- **Ranked priority list** (hardest × most-tested at top).
- **Diagram inventory** — every past-exam question with a diagram: source file + question number, diagram type, topic id.

Fill every section. "Unknown — materials do not cover" is valid. Never invent.

## Update progress

Edit `content/{id}/_scratch/progress.md`:
- Append to `## Completed stages`: `- stage1: {ISO datetime} — {one-sentence summary}`
- Set `## Current stage` to `stage1b`.

## Tell the user

Print a summary: module count, topic count, priority top-5, diagram inventory count, any materials gaps.

Then: "Stage 1 complete. Open a new session and run `/author-stage1b {id}`."
