---
n: 0
id: 3522-exam-strategy
title: "Exam strategy and top pitfalls — COMP 3522 final"
hook: "Time allocation, top pitfalls, when to skip."
kind: strategy
tags: [strategy, exam-prep]
module: "Exam prep"
source: "COMP3522_Final_Exam_Info BBY4.pdf, finalexamsmerge.pdf (Dec 2024 + practice), Week 14 review slides"
bloom_levels: [analyze, evaluate]
---

90 minutes. 51 marks. Five sections. The exam rewards pattern *recognition* over pattern *memorization* — most marks come from reading code and naming the pattern, predicting output, or refactoring violating code into a pattern.

## Time budget

| Section | Marks | Suggested time | Per-mark |
|---|---|---|---|
| True/False (5 Qs) | 5 | 5 min | 1.0 min |
| MCQ (15 Qs) | 30 | 45 min | 1.5 min |
| UML Draw (1 Q) | 4 | 8 min | 2.0 min |
| What's the Output (1 Q) | 4 | 7 min | 1.75 min |
| Guided Coding (1 Q, 2 parts) | 8 | 20 min | 2.5 min |
| Review buffer | — | 5 min | — |
| **Total** | **51** | **90 min** | — |

## Two-pass strategy

**Pass 1 (≈30 min)** — sweep the easy marks first.
- Knock out all 5 T/F immediately. Read carefully — distractors flip a single word ("`@staticmethod` accesses class-level vars" — false; `@classmethod` does).
- Do MCQs whose answer is *definitional* (Singleton intent, "construct objects step by step" → Builder, "swap algorithms at runtime" → Strategy). These take <60 sec each.
- Skip and circle any MCQ that requires tracing 20+ lines of code.

**Pass 2 (≈45 min)** — depth.
- Return to circled MCQs. For pattern-identification, ask: *who depends on whom? composition or inheritance? does the relationship change at runtime?*
- Output-trace MCQs: write the trace literally on the exam paper. Don't simulate in your head.
- Draw the UML and write the guided-coding answer. Use the cheat sheet for class-diagram notation.

**Pass 3 (≈10 min)** — what's-the-output question + buffer.
- Output questions are usually generator/Decorator/Chain-of-Responsibility traces. Walk line-by-line.
- Use any leftover time to verify one guided-coding answer compiles mentally.

## When to skip and return

Skip if you spend >2 min on a single MCQ without progress. Mark a circle next to it. The 8-mark Guided Coding is more economical per minute than re-reading a confusing code-trace MCQ.

Skip if a question shows a 30+ line code snippet and the question is "which pattern" — usually the *structure* (composition? inheritance? state machine?) is visible from class signatures alone. Don't read every method body.

## Top 5 pitfalls (extracted from past-exam solutions)

> **Pitfall**
> **Decorator without composition is not Decorator.** A class hierarchy where `NotifierWithEmail(Notifier)` *overrides* `send()` to print "basic" + "email" is plain inheritance — every combination needs a new subclass. True Decorator wraps an instance: `EmailNotifier` holds a `Notifier` ref and calls `super().send()` inside its own `send()`. The client code `SMSNotifier(EmailNotifier(Notifier()))` is the giveaway. — *finalexamsmerge.pdf, Notifier refactoring question*

> **Pitfall**
> **Proxy with an unguarded getter defeats the proxy.** If the proxy class exposes `get_database()` (or any method returning the wrapped object), the client can bypass the access check. The correct Proxy implementation only exposes methods that route through the access check. *Option A and Option C in the past-final DatabaseProxy MCQ both failed for this reason — only Option B (no getter, all calls gated) is valid.* — *finalexamsmerge.pdf Q8*

> **Pitfall**
> **State vs Observer confusion.** "State objects are independent and unaware of each other" is FALSE for State — that statement describes Observer. State objects typically know about other state classes (Red→Green→Yellow→Red transitions are hard-coded in `update()`) and often hold a reference back to the context to trigger transitions. Observer's observers are independent peers with no knowledge of each other. — *finalexamsmerge.pdf T/F Q7*

> **Pitfall**
> **`range()` returns a range object, not a generator.** A `range` is a lazy *sequence* — indexable, length-known, reusable. A generator is one-shot, not indexable, length-unknown until consumed. T/F traps: "`range()` returns a generator object that lazily evaluates" → FALSE (lazy yes, generator no). Also: `range(0)` and `range(5, 0)` are both empty (no negative step). — *finalexamsmerge.pdf p1 T/F*

> **Pitfall**
> **Decorator function `@staticmethod` cannot access class-level variables.** Use `@classmethod` (receives `cls`) for class-level access. `@staticmethod` is just a function namespaced under a class — no `self`, no `cls`. T/F: "The `@staticmethod` decorator allows a method to access class-level variables" → FALSE. — *Dec 2024 Final Q1*

## Off-by-one / unit / ordering traps specific to OOP2

- **Chain of Responsibility cascade order** — start at the *highest-level* handler (constructed last with the chain pre-built). Output trace begins "Level3Support cannot handle… Level2Support cannot handle… Level 1 Support: handling". If the chain is built `level3 = Level3Support(level2)` and you call `level3.handle_request(req)`, the trace flows downward through `_successor`. — *finalexamsmerge.pdf Q3 Option A*
- **Decorator nested cost calculation** — `Caramel(Sugar(Milk(Coffee())))` with costs (3, 1, 2, 5) sums to **5+2+1+3 = 11**, not 13. Both `coffee_with_all_decorators.cost()` AND a fresh re-construction return the same — Python doesn't memoize. — *Dec 2024 Final Q14: answer C (11, 11)*
- **`assertIsNone(safe_divide(10, 2))` fails** — `safe_divide` returns `5.0` (not None) when no exception, so the assertion fails. Both unit tests in the past T/F Q4-Q5 fail. — *Dec 2024 Final Q4-5*
- **Generator pipeline order** — `f2(f1(data_source()))` applies f1 first (×2), then f2 (filter even). Source `0..9` → f1 → `0,2,4,...,18` → f2 → all (already even). Answer: `0,2,4,...,18` not the doubled-then-filtered-with-zero-removed list. — *finalexamsmerge.pdf Q6 Option C*
- **Async timing with `gather`** — observers run concurrently. If each observer's `update()` sleeps 0.5s and you `await asyncio.gather(notify1, notify2)`, total time ≈ 0.5–0.6s, not 1.0s. — *Dec 2024 Final timing Qs*
- **UML notation: hollow triangle = inherits, hollow diamond = aggregation, filled diamond = composition, dashed arrow = dependency.** Draw arrows the direction "depends on" — `Subclass --triangle--> Superclass`.

> **Takeaway**
> Two patterns and one principle drive most of the marks: **Decorator** (wrap+delegate via composition), **State** (state objects know transitions), **DIP** (high+low both depend on abstractions). If you can write all three from scratch and identify them in code, you've covered ~30% of the exam directly and another ~20% indirectly through the supporting OOP code those patterns require.
