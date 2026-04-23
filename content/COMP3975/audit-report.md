# Content audit — COMP3975

Date: 2026-04-21 (final, post-fix)
Tree: content/COMP3975/

## Scorecard

| Pass | Name | Critical | Warning | Advisory |
|---|---|---|---|---|
| 1 | Schema hard-fails | 0 | 0 | 1 |
| 2 | Source discipline | 0 | 5 | 0 |
| 3 | Retrieval affordance | 0 | 0 | 0 |
| 4 | Elaborative encoding | 0 | 3 | 0 |
| 5 | Worked examples | 0 | 1 | 1 |
| 6 | Dual coding | 0 | 2 | 5 |
| 7 | Pitfall + distractor analysis | 0 | 1 | 0 |
| 8 | Bloom's + concept variability | 0 | 4 | 1 |
| 9 | Per-course required artifacts | 0 | 0 | 0 |
| 10 | Peer-shareability + private data | 0 | 0 | 0 |

**Overall verdict**: Polish — safe to ship. Zero criticals. All hard-gate invariants clear.

**Hard-gate status** (per STANDARDS §Hard gates):
- [x] Every card/question/file has `source:`
- [x] Every lesson has ≥1 retrieval checkpoint
- [x] Every problem-solving topic-dive has ≥1 worked example
- [x] Every non-trivial topic-dive has ≥1 `**Pitfall**`
- [x] Every MCQ/MULTI rationale addresses each distractor
- [x] `topic-dives/exam-strategy-and-pitfalls.md` exists (`priority: high`)
- [x] Zero private-data matches
- [x] Zero duplicate IDs (COMP3975 IDs globally unique; legacy 4736/4870 bare-id collision is pre-existing)
- [x] Schema invariants clear

---

## Remaining blockers (warnings only — do not block shipping)

1. **Nominal-only source citations (no page/slide/section anchor)** — 13 lessons, 11 dives, 8 code-practice, 72 cards, 30 mock questions. Add `§Section` or `slide N` anchors. (Pass 2)

2. **3 flashcard explanations restate answer** — `routing-card-03`, `azure-deploy-card-05`, `mcp-card-06`. Add mechanism-first "why". (Pass 4)

3. **`lessons/16-mcp-protocol.md` lacks `> **Example**` callout** — has mermaid diagrams only. Add JSON-RPC steps. (Pass 5)

4. **`topic-dives/session-auth-breeze.md`** — `middleware` tag but no mermaid flow diagram. (Pass 6)

5. **`topic-dives/laravel-localization.md`** — `middleware` tag but no mermaid pipeline diagram. (Pass 6)

6. **`code-practice/07-rest-api-crud-controller.md` Why** — no named wrong approach. (Pass 7)

7. **Bloom's distribution** — Remember 43% (+13 pts), Analyze+ 1.6% (−13 pts). Convert ~25 cards to Apply+; add ~25 Analyze cards. (Pass 8)

8. **All-Remember topics** — `artisan-composer` and `azure-static-web-apps` have zero Apply+ cards. (Pass 8)

---

## Strengths to preserve

- All 46 mock-exam MCQ rationales address every distractor by name — elaborated feedback fully present.
- All 17 lessons have ≥1 `> **Q:**/> **A:**` retrieval checkpoint; all 17 lessons and 18 dives end with `**Takeaway**`.
- `exam-strategy-and-pitfalls.md` sources all 9 pitfalls to specific file + question numbers; time-allocation and "when to skip" heuristic are concrete and actionable.
