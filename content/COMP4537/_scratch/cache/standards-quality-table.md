## Quality dimensions × content types — the authoring contract

| Dimension | Card | Lesson | Dive | Code-practice | Mock-Q | Cheat-block |
|---|---|---|---|---|---|---|
| **1. Source citation** | `source:` required | frontmatter `source:` required | frontmatter `source:` required | frontmatter `source:` required | `source:` required | block-level comment OK |
| **2. Bloom's tag** | `bloom:` required | `bloom_levels: [...]` required | `bloom_levels: [...]` required | — (inherent) | `bloom:` required | — |
| **3. Elaborative encoding** | `explanation` required | closing `**Takeaway**` required | closing `**Takeaway**` required | `## Why` required (schema) | `rationale` required (schema) | — |
| **4. Worked example** | `example` recommended | `**Example**` callout ≥1 for non-conceptual topics | same | `## Solution` required (schema) | — | — |
| **5. Dual coding** | `diagram` type where applicable | Mermaid/SVG required if concept is visual | same | inline SVG where applicable | — | — |
| **6. Retrieval affordance** | inherent | `> **Q:**/**A:**` checkpoint ≥1 | linked flashcards OR inline checkpoint ≥1 | inherent | inherent | — |
| **7. Pitfall / distractor callout** | — | `**Pitfall**` required for non-trivial | `**Pitfall**` required for non-trivial | common-wrong note in `## Why` | distractor analysis in `rationale` (MCQ/MULTI) | — |
| **8. Concept variability** | — | — | — | ≥1 variant per topic in the bank | ≥2 surface forms per deep concept | — |
| **9. Concreteness fading** | — | opens concrete, generalizes | opens concrete, generalizes | — | — | — |
| **10. Active recall prompt** | UI-level | `> **Q:**/**A:**` checkpoints | inline Q/A or linked cards | — | — | — |

### Per lesson / dive body rules
- Opens concrete (concreteness fading) OR with a problem (pedagogy: productive-failure).
- ≥1 `> **Q:** / **A:**` retrieval checkpoint.
- Closes with `**Takeaway**` callout.
- `**Pitfall**` callout for non-trivial topics.
- ≤30 words/sentence. Mermaid or inline SVG for visual concepts.
- ≤400 words per `##` section without splitting.

### Bloom's target distribution
~30% Remember, ~30% Understand, ~25% Apply, ~15% Analyze+. Per-course distribution within ±10pts triggers warning; >±15pts triggers critical.
