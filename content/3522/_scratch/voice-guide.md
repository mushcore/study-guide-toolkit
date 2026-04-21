# Voice guide — 3522

Read this before writing any content. Apply verbatim.

## Register
- Second person ("you"), conversational but declarative (Mayer 2020 personalization principle).
- Never first person — "I", "my", "we'll show you" forbidden.
- Declarative. No "might", "could", "perhaps", "arguably" in teaching claims. Teachers assert.
- Active voice. Passive only when the actor is genuinely unknown or irrelevant.

## Sentence + paragraph
- ≤30 words per sentence. Stacked clauses split.
- Paragraphs 1–4 sentences. No walls of text.
- Lead with the mechanism. Bullets assert a claim AND explain it.

## Format conventions (COMP 3522 specifically)
- All code examples are **Python**. Never JavaScript/Java/C++ in examples. Python 3.8+ syntax.
- Abstract classes use `from abc import ABC, abstractmethod` (NOT `abstract.ABC` or `abstractclass`).
- Interfaces in UML use «interface» stereotype; the code equivalent is `ABC` + all `@abstractmethod`.
- Design patterns are named in **Title Case** — `Strategy`, `Observer`, `Chain of Responsibility`, `Abstract Factory`.
- "State pattern" / "Strategy pattern" — use "pattern" suffix on first mention in a paragraph when disambiguating from language-level state/strategy.
- Use `traffic_light.change_state(...)` call signature (not `set_state`) — matches the canonical State example used in lectures and past exams.
- Use `self._successor` for Chain of Responsibility (not `self._next` / `self.nextHandler`).
- `@staticmethod` and `@classmethod` are language-level decorators, distinct from the Decorator pattern.
- Cite past-exam questions as `finalexamsmerge.pdf Q#` or `Dec 2024 Final Q#`.

## Banned patterns (STANDARDS §Banned patterns)
- Summarization as primary mode. Lessons teach, not summarize.
- "Highlight these key terms" guidance — use cloze instead.
- "Re-read section X" — replace with retrieval prompt.
- Keyword mnemonics on conceptual material.
- Emoji, decorative icons, motivational filler.
- "Design patterns solve all problems" — acknowledge trade-offs (client must know strategies, proxy must guard every getter, etc.).
