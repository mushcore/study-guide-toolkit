# Voice guide — COMP3975

Read this before writing any content. Apply verbatim.

## Register

- Second person ("you"), conversational but declarative (Mayer 2020 personalization principle; d ≈ 0.79).
- Never first person — "I", "my", "we'll show you" forbidden.
- Declarative. No "might", "could", "perhaps", "arguably" in teaching claims. Teachers assert.
- Active voice. Passive only when the actor is genuinely unknown or irrelevant.

## Sentence + paragraph

- ≤30 words per sentence. Stacked clauses split.
- Paragraphs 1–4 sentences. No walls of text.
- Lead with the mechanism. Bullets assert a claim AND explain it; bullet-as-noun is a defect.

## Format conventions (COMP3975-specific)

- **Artisan commands**: always prefix with `php artisan` (never bare `artisan`). Colon syntax: `make:migration`, `make:controller`, `make:model`. Never hyphen syntax (`make-migration`) — past exam tested this.
- **Dev port**: professor uses `--port=8888` consistently; use that in examples.
- **JWT package**: `php-open-source-saver/jwt-auth` — not `tymon/jwt-auth`. Different package; use the exact composer name.
- **OpenAPI vs Swagger**: always distinguish. OpenAPI = the specification language (YAML/JSON contract). Swagger = the toolset (UI, Editor, Codegen). Never use "Swagger" to mean the spec.
- **Auth facade style**: use `Auth::user()`, `Auth::id()` (facade style). Not `auth()->user()`.
- **Database access order**: when listing patterns, always present Eloquent ORM first, Query Builder second, Raw SQL third — this is the professor's explicit preference hierarchy.
- **Code fences**: PHP code → `php`; Blade templates → `blade`; shell/Artisan → `bash`; JSON config → `json`; TypeScript → `ts`.
- **JWT token structure**: always written as `header.payload.signature` (dot-separated, three parts).
- **Mass assignment protection**: use `$fillable` (whitelist approach). Never `$guarded`. Professor uses $fillable exclusively.
- **Blade output**: `{{ $var }}` = escaped (XSS-safe). `{!! $var !!}` = unescaped (dangerous). Always name the XSS risk when mentioning `{!! !!}`.
- **Localization helper**: `__()` (double-underscore). Never `trans()`, `t()`, `i18n()`, or `translate()`.
- **Pluralization**: `trans_choice()` — not `__()` with plural logic baked in.
- **MCP components**: always list as Tools → Resources → Prompts (that order, per slides).
- **Azure triggers**: HTTP, Timer, Queue, Blob, Event Hub (in that order when listing).

## Banned patterns (STANDARDS §Banned patterns)

- Summarization as primary mode. Lessons teach, not summarize.
- "Highlight these key terms" — use cloze instead.
- "Re-read section X" — replace with retrieval prompt.
- Keyword mnemonics on conceptual material.
- Emoji, decorative icons, motivational filler.
- "As mentioned above" / "As we saw" — self-referential without mechanism.
- Opening a lesson with a bare definition ("X is a Y that Z"). Open concrete first.
