---
id: comp3975-exam-strategy-and-pitfalls
title: "Exam strategy and pitfalls — COMP 3975 Final"
pillar: process
priority: high
tags: [exam-strategy, pitfalls, time-management]
source: "Final Exam Outline.pdf; final-practice.docx; PHP_JWT.pptx slide 8; swagger-with-laravel.pptx slide 2; localization.pptx slides 3,6"
bloom_levels: [understand, apply, analyze]
related: [artisan-composer, jwt-authentication, laravel-localization, swagger-openapi, eloquent-orm, mcp-protocol]
---

## Exam format (from Final Exam Outline.pdf)

- **Date**: April 23, 2026 · 10:30–11:30 AM (60 minutes)
- **80 marks total**: 60 MCQ (1 mark each) + 10 match-two-columns (1 mark each) + 1 coding question (10 marks)
- **Allowed**: one handwritten cheat sheet, 8.5×11", both sides
- **Coverage**: Weeks 7–13

## Time allocation

| Section | Marks | Budget | Per item |
|---|---|---|---|
| MCQ (60 Q) | 60 | 28 min | ~28 sec |
| Match two columns (10 pairs) | 10 | 8 min | ~48 sec |
| Coding question | 10 | 18 min | — |
| Buffer / review | — | 6 min | — |

You have less than 30 seconds per MCQ. Skip and mark if uncertain — return at the end.

## Question-type strategy

**MCQ**: Read every choice before selecting. Many distractors use plausible-but-wrong command syntax (e.g. `make-migration` vs `make:migration`). If two choices look nearly identical, the difference is the answer.

**Match two columns**: Fill in your surest matches first. Each correct match eliminates one distractor, making the remaining pairs easier.

**Coding question**: Write the structure first (class name, method signature, key annotations or directives). Partial credit is likely. Even a skeleton with correct variable names scores better than a blank.

## When to skip and return

Skip if you can't answer in 20 seconds. Write the question number on a scratch corner. Return after finishing all other questions. Never leave MCQ blank — there's no penalty; guess from remaining choices.

## Top 5 pitfalls (sourced from final-practice.docx)

> **Pitfall**
> **Artisan colon syntax** (final-practice.docx Q6). The command is `php artisan make:migration`, not `php artisan migration`, not `make-migration`, not `new:migration`. Artisan namespaces always use colons. Five of the six answer choices in Q6 are syntactically wrong in exactly this way.

> **Pitfall**
> **Localization directory** (final-practice.docx Q1). Translation files live in `resources/lang/{locale}/`. Common wrong answers place them in `resources/views/lang`, `storage/lang`, `app/lang`, or `bootstrap/lang`. The `resources/lang/` path is the only correct one.

> **Pitfall**
> **`__()` helper vs imposters** (final-practice.docx Q2). Laravel's translation helper is `__('key')`. The distractors — `translate()`, `lang()`, `i18n()`, `t()` — look like valid internationalization helpers but none of them exist in Laravel. Only `__()` works.

> **Pitfall**
> **MCP creator** (final-practice.docx Q4). MCP (Model Context Protocol) was created by **Anthropic**, not OpenAI, Meta, Google, or Microsoft. The distractor "OpenAI" is the most common wrong pick.

> **Pitfall**
> **Eloquent `all()` vs method chaining** (final-practice.docx Q9). `User::all()` retrieves every record. `User::get()` retrieves the collection from a query builder — you do NOT chain `->get()` after `all()`. `User::all()->get()` is wrong. `User::find()` retrieves one record by primary key.

## Additional traps (sourced from slides)

> **Pitfall**
> **JWT reserved claims — all 7** (PHP_JWT.pptx slide 8). The seven reserved claims are `iat`, `iss`, `nbf`, `exp`, `sub`, `aud`, `jti`. Questions may ask you to identify which is a reserved claim or what each means: `iat`=issued-at, `exp`=expiration, `sub`=subject, `iss`=issuer, `aud`=audience, `nbf`=not-before, `jti`=JWT ID.

> **Pitfall**
> **OpenAPI ≠ Swagger** (swagger-with-laravel.pptx slide 2). OpenAPI is the **specification language** (the JSON/YAML contract). Swagger is the **toolset** (UI, Editor, Codegen). Exam questions that ask "what is OpenAPI?" expect the specification answer, not "a tool for documenting APIs."

> **Pitfall**
> **`$fillable` required for mass assignment** (laravel_with_sqlite_API_SCRIPT.docx). If you call `Model::create($request->all())` without defining `$fillable` on the model, Laravel throws a `MassAssignmentException`. The fix: add `protected $fillable = ['field1', 'field2']` to the model class.

> **Pitfall**
> **Route cache invalidation** (laravel_with_sqlite_API_SCRIPT.docx). After adding or changing routes that use auth middleware, run `php artisan route:clear` and `php artisan cache:clear`. Stale caches silently serve old route definitions — protected routes appear to have no auth.

## Off-by-one / unit / ordering traps

- JWT structure is **three** parts (`header.payload.signature`), not two. All three are base64-encoded.
- `php artisan make:model Student -m` creates **both** the model **and** the migration. Omitting `-m` creates only the model — no migration.
- `php artisan migrate:refresh --seed` **drops and recreates** all tables. Running it in production destroys data. The `--force` flag is required to run it in a non-local environment.
- Breeze installs **Tailwind CSS** (not Bootstrap). Questions that conflate Bootstrap with Breeze test this distinction.
- The `darkaonline/l5-swagger` package requires `-W` flag: `composer require darkaonline/l5-swagger -W`. Omitting `-W` causes a dependency conflict on many Laravel versions.

> **Q:** You have 90 seconds left and 8 questions remaining on the multiple-choice section. Which do you attempt first?
> **A:** Attempt the questions you can answer in under 10 seconds — recall-level items about specific facts (command names, directory paths, HTTP status codes). Skip any question requiring reasoning about an unfamiliar scenario; guess on remaining blanks in the last 10 seconds.

> **Takeaway**
> The exam rewards exact command syntax and precise package/concept names over general understanding. Build your cheat sheet around Artisan command names, JWT claim names, and the OpenAPI/Swagger distinction — these are the highest-density, highest-error areas from the practice exam.
