## SCHEMA §Mock-exam (question schema)

Top-level:
```yaml
duration_seconds: 3600
pass_mark: 0.6
questions:
  - id: q1
    type: MCQ
    topic: "Session Beans"
    marks: 2
    question: "Which HTTP method is idempotent but NOT safe?"
    choices:
      - "GET"
      - "PUT"
      - "POST"
      - "DELETE"
    correct: 1
    rationale: "PUT is idempotent (same result repeated) but not safe (it modifies state). GET is both safe and idempotent. POST is neither. DELETE is idempotent but not safe."
    bloom: understand
    source: "Slide 8, Part 3"
```

Field reference:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | ✓ | Unique within file. |
| `type` | enum | ✓ | `MCQ` (single correct) \| `MULTI` (multiple) \| `SHORT` (free-text). |
| `topic` | string | ✓ | Free-text topic label. |
| `marks` | int | ✓ | Point value. |
| `question` | string | ✓ | Stem. Markdown inline allowed. |
| `choices` | list[string] | required for MCQ/MULTI | |
| `correct` | int \| list[int] \| string | ✓ | Int for MCQ (0-based), list for MULTI, string for SHORT. |
| `rationale` | string | ✓ | Mechanism of correct answer + misconception each distractor targets. |
| `tags` | list[string] | optional | Use `[pretest]` for day-one subset. |
| `difficulty` | `easy`\|`medium`\|`hard` | optional | |
| `bloom` | enum | optional (STANDARDS requires it) | |
| `source` | string | optional (STANDARDS requires it) | |

Invariants:
- MCQ: `correct` is int in `[0, len(choices))`.
- MULTI: `correct` is non-empty list of ints in range.
- SHORT: `choices` omitted, `correct` is the canonical answer string.
