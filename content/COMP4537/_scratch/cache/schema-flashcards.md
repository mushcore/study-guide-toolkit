## SCHEMA §Card types

Top-level flashcards.yaml shape:
```yaml
modules:
  - id: <module-id>
    name: <module-name>
    topics:
      - id: <topic-id>
        name: <topic-name>
        tags: [<tag>, ...]
        prose: <one-paragraph context>
        cards:
          - type: <card-type>
            ...
```

Card types:

### `cloze` — fill in the blank(s)
```yaml
- type: cloze
  prompt: "The four Coffman conditions are {{mutual exclusion}}, {{hold-and-wait}}, {{no preemption}}, and {{circular wait}}."
  answer: "mutual exclusion, hold-and-wait, no preemption, circular wait"
```

### `name` — recall a term
```yaml
- type: name
  prompt: "A process holds a resource while waiting on another. What condition?"
  answer: "Hold-and-wait"
```

### `predict` — predict code output or behaviour
```yaml
- type: predict
  lang: js
  prompt: "What does this return?"
  code: |
    const p = new Promise(resolve => resolve(42));
    p.then(v => console.log(v));
  answer: "42 — the resolved value is passed to the .then callback."
```

### `diagram` — label blanks in a diagram
```yaml
- type: diagram
  prompt: "Complete the HTTP request-response flow:"
  mermaid: |
    graph LR
      Client -->|request| ???A
      ???A -->|response| Client
  labels:
    "???A": "Server"
  answer: "Server"
```

Optional fields on every card:
| Field | Type | Notes |
|-------|------|-------|
| `explanation` | string (Markdown) | Why-it-matters mechanism. Required by STANDARDS. |
| `example` | string (Markdown) | Concrete worked case. Required by STANDARDS. |
| `source` | string | Required by STANDARDS (hard gate). |
| `bloom` | enum | `remember`\|`understand`\|`apply`\|`analyze`\|`evaluate`\|`create`. Required by STANDARDS. |

Invariants:
- `topic.id` unique across every course.
- Every topic has ≥1 card.
- `cloze.prompt` must contain ≥1 `{{…}}` blank.
- `diagram.labels` keys must appear verbatim in `diagram.mermaid`.
- `predict.lang` must be a recognised language tag.
