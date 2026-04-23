## SCHEMA §Lessons

Frontmatter (required):
```yaml
---
n: 1
id: processes-vs-threads
title: "Processes vs threads"
hook: "One-line teaser shown under the title."
tags: [concurrency, memory]
module: "Concurrency & Sync"
---
```

Optional frontmatter:
| Field | Type | Notes |
|-------|------|-------|
| `priority` | `high`\|`mid`\|`low` | |
| `source` | string | Required by STANDARDS. |
| `reading_time_min` | int | |
| `related` | list[string] | Required by STANDARDS. |
| `bloom_levels` | list[enum] | Required by STANDARDS. Array. |
| `pedagogy` | `productive-failure` \| `worked-example-first` \| `concreteness-fading` | Defaults to concreteness-fading. |

Body conventions:
- `##` for major sections, `###` for subsections. No `#` in body.
- Callouts: `> **Analogy**`, `> **Takeaway**`, `> **Pitfall**`, `> **Example**`, `> **Note**`, `> **Warning**`
- Checkpoint: `> **Q:** question\n> **A:** answer` — rendered as reveal-on-click.
- Diagrams: fenced `mermaid` or inline `<svg>`.
- Every fenced code block has a language tag.
- First element NOT a `#` heading. Body non-empty.

## SCHEMA §Topic-dives

Frontmatter:
```yaml
---
id: deadlock
title: "Deadlock — prevention, avoidance, detection, recovery"
pillar: tech
priority: high
tags: [deadlock, concurrency]
source: "Part 9"
bloom_levels: [understand, apply, analyze]
related: [memory, paging]
---
```

Required content for problem-solving dives: ≥1 `**Example**` callout with step-by-step reasoning, ≥1 `**Pitfall**` callout.
`exam-strategy-and-pitfalls` dive: must exist, `priority: high`.
