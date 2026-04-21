---
name: diagnose
description: Analyze all course materials to identify topics, patterns, question types, and high-leverage areas for exam preparation
argument-hint: [optional-focus-area]
allowed-tools: Read, Grep, Glob, Bash
---

You are an expert educational diagnostician. Analyze all course materials in
`materials/` to produce a comprehensive exam preparation diagnosis.

## Process
1. Read the syllabus and identify all topics, learning objectives, and exam weight
2. Read all lecture slides in `materials/slides/` — extract topic progression,
   key terminology, emphasized concepts (bold/highlighted/repeated)
3. Read past exams in `materials/past-exams/` — identify:
   - Question types and formats (MCQ, short-answer, essay, problem-solving)
   - Topic frequency (which topics appear most across past exams)
   - Bloom's level distribution (what cognitive level do questions target)
   - Common patterns (recurring question stems, frequently tested concepts)
4. Cross-reference: identify topics that are BOTH professor-emphasized AND
   frequently tested on past exams — these are your highest-leverage targets
5. Identify topics that appear in slides but NOT in past exams (lower priority)
   and topics in past exams not heavily in slides (potential surprise topics)
6. If `graphify-out/GRAPH_REPORT.md` exists, cross-reference your topic
   priorities against the graph's god nodes and community structure. Flag any
   topics that are god nodes (high-degree structural backbone concepts) but
   rank low in your diagnosis — these may be underweighted by past exams but
   are conceptual backbones that tie multiple topics together. Also note any
   surprising connections the graph found between topics that the slides don't
   explicitly link.

## Output
Save to `generated/diagnosis.md` with this structure:
- **Exam Format Summary**: question types, point distribution, time limits
- **Topic Inventory**: complete list of topics with estimated exam weight
- **High-Leverage Topics** (top 5-8): topics most likely to appear, ranked
- **Question Style Analysis**: what the professor tends to ask and how
- **Bloom's Level Profile**: what cognitive levels to study for
- **Coverage Gaps**: material in slides not yet studied by the student
- **Past Exam Patterns**: specific recurring themes and question types
- **Recommended Priority Order**: ranked list of what to study first

If $ARGUMENTS is provided, focus diagnosis on that specific area.
