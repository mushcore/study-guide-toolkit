## ADD-NEW-COURSE.md §Stage 3 — Per-module authoring

One module at a time, **top of the Stage 1 priority list first**. For each topic within the module, produce these four artifacts in order:

1. **`lessons/NN-<slug>.md`** — long-form teaching. Opens concrete (concreteness fading) or with a problem (productive failure). Contains ≥1 `> **Q:**/**A:**` retrieval checkpoint. Closes with a `**Takeaway**` callout. Has `bloom_levels: [...]` + `source:` + `related:` frontmatter.
2. **`topic-dives/<slug>.md`** — deep reference. Problem-solving dives get ≥1 worked `**Example**` callout with step-by-step reasoning. Non-trivial dives get ≥1 `**Pitfall**` callout sourced from actual past-exam wrong-answer patterns (not invented). Has `priority`, `source`, `bloom_levels`, `related` frontmatter.
3. **Flashcards under the module in `flashcards.yaml`** — atomic, one fact per card. Every card has `source` + `bloom` + `explanation` (why-it-matters mechanism) + `example` (concrete worked case). Cards span ≥2 `type`s per topic. Bloom's distribution across the module targets 30/30/25/15.
4. **`code-practice/NN-<slug>.md`** — for every procedural topic AND for every diagram-question from the Stage 1 diagram inventory. `## Why` section names 1–2 common wrong approaches.

**Gate per module:** run `/audit-content {id}`. Close every critical + warning before starting the next module. Advisory findings accumulate.
