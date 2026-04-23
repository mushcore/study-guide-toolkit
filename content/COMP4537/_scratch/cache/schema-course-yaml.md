## SCHEMA §course.yaml

Required fields:
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Matches directory name. |
| `code` | string | `"COMP 4537"` etc. |
| `name` | string | Human-readable course name. |
| `exam` | ISO datetime | Must include TZ offset. |
| `room` | string | Physical room. |
| `format` | string | Free-text: `"90 MCQ + short answer · 120 min"`. |

Optional:
| Field | Type | Notes |
|-------|------|-------|
| `instructor` | string | |
| `sections` | list[string] | Section IDs (A/B/C). |
| `notes` | string | Markdown. Rendered in dashboard course-card footer. |

Example:
```yaml
id: "4736"
code: "COMP 4736"
name: "Operating Systems"
exam: "2026-04-22T13:30:00-07:00"
room: "SE06-220"
format: "90 MCQ + short answer · 120 min"
instructor: "—"
notes: |
  Open book. Closed laptop.
  Bring a calculator.
```
