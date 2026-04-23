### 3. `mock-exam.yaml`

Timed multiple-choice bank.

**Top-level:**
```yaml
duration_seconds: 600          # how long the timer runs
pass_mark: 0.6                 # optional, 0..1
questions:
  - id: q1
    type: MCQ                  # MCQ | MULTI | SHORT  (MULTI = multiple correct)
    topic: "Session Beans"     # free-text, used for topic-aware feedback
    marks: 2
    question: "Which annotation eagerly instantiates a Singleton at app deployment?"
    choices:
      - "@PostConstruct"
      - "@Startup"
      - "@DependsOn"
      - "@Eager"
    correct: 1                 # 0-based index. For MULTI: list of indices [0, 2].
    rationale: "@Startup forces container init at deploy time rather than first-call."
```

**Field reference:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | ✓ | Unique within file. |
| `type` | enum | ✓ | `MCQ` (single correct) \| `MULTI` (multiple) \| `SHORT` (free-text). |
| `topic` | string | ✓ | Free-text topic label. |
| `marks` | int | ✓ | Point value. |
| `question` | string | ✓ | Question stem. May contain Markdown inline. |
| `choices` | list[string] | required for MCQ/MULTI | Markdown allowed inline. |
| `correct` | int \| list[int] \| string | ✓ | Int for MCQ, list for MULTI, string (ideal answer) for SHORT. |
| `rationale` | string | ✓ | Why the answer is right. Shown after submit. |
| `tags` | list[string] | optional | For filtering. A question tagged `pretest` is part of the day-one pretest subset. |
| `difficulty` | `easy`\|`medium`\|`hard` | optional | |
| `bloom` | enum | optional | Same enum as card `bloom`. Required by STANDARDS for Bloom's-distribution audit. |
| `source` | string | optional | Traceable citation. Required by STANDARDS for RAG grounding. |

**Invariants:**
- If `type: MCQ`, `correct` is int in `[0, len(choices))`.
- If `type: MULTI`, `correct` is non-empty list of ints in range.
- If `type: SHORT`, `choices` omitted, `correct` is the canonical answer string.
