---
name: voice-guide-4870
description: Authoring register + banned patterns + course-specific conventions for COMP 4870 content
type: project
---

# Voice guide — 4870

Apply verbatim to every lesson, card, practice file, mock question, and cheat-sheet block. Drift kills consistency; this file is the drift anchor.

## Register (general rules — enforced on every line)

- **Second-person.** Address the reader as "you". The reader *does* the work; the content teaches them. Mayer (2020) personalization principle, d ≈ 0.79.
- **No first person.** "I", "my", "we", "let's", "we'll show you" are banned. Teachers assert; they don't co-author.
- **Declarative.** "The pipeline runs in five phases." Not "The pipeline may run in five phases" or "Perhaps the pipeline runs…". Hedges ("might", "could", "perhaps", "arguably", "somewhat", "tends to") are banned in teaching claims. If a claim is uncertain, re-read the source until it's certain or cut it.
- **Active voice.** "Aspire injects the connection string." Not "The connection string is injected by Aspire." Passive is acceptable only when the actor is genuinely unknown or irrelevant (rare in this course's material).
- **Short sentences.** ≤30 words per sentence. If a sentence needs a comma splice or two "and"s to finish, split it.
- **Short paragraphs.** 1–4 sentences. If the paragraph teaches two ideas, make it two paragraphs.
- **Lead with the mechanism.** Open every paragraph with the *causal action*, not the setup: "Aspire's `WithReference` injects an environment variable named `services__backend__http__0` into the consuming project. That variable holds the discovered URL of the referenced service." Not: "Aspire has a concept of service references. This is how it works: …"
- **One idea per callout.** `**Takeaway**`, `**Pitfall**`, `**Example**`, `**Note**` each hold one idea. Stacked ideas go in separate callouts.

## Course-specific conventions

Elmasry's slides and scripts use C# idioms consistently. Match them verbatim rather than normalizing to generic prose.

- **"ASP.NET Core"**, never "ASP.NET" or ".NET Core" when referring to the web framework. ASP.NET (no "Core") refers to the legacy Framework variant and is out of scope.
- **".NET"**, not "DotNet" or "dotnet" (except when referring to the `dotnet` CLI tool, which is lowercase). "dotnet CLI" and "the `dotnet` command" are the canonical forms for the CLI.
- **"C#"**, never "CSharp" or "C-Sharp" in prose. The method-name suffix `CSharp` appears in namespace paths (`Microsoft.CodeAnalysis.CSharp`) — there it stays verbatim.
- **"Code-first"** (hyphenated) is the canonical spelling for EF Core migration development. "Code 1'st" appears in the syllabus but is not used in content.
- **NuGet package names are exact**: `Microsoft.SemanticKernel`, `Microsoft.Agents.AI`, `Microsoft.Agents.AI.OpenAI`, `Microsoft.Extensions.AI`, `OllamaSharp`, `StackExchange.Redis`, `Microsoft.Extensions.Caching.StackExchangeRedis`, `Google.Protobuf`, `Grpc.Tools`, `Grpc.Net.Client`, `Microsoft.ML`, `Microsoft.ML.FastTree`, `Microsoft.ML.AutoML`, `ClosedXML`, `iText7`, `itext.bouncy-castle-adapter`, `Aspire.Hosting.SqlServer`, `Microsoft.AspNetCore.Components.QuickGrid`, `Spectre.Console`, `xunit`, `xunit.runner.visualstudio`, `Microsoft.NET.Test.Sdk`. See glossary for the canonical casing of each.
- **Method / property / type names are code-fenced** (backticks) on every mention, not just the first. `GetOrSetAsync`, not GetOrSetAsync.
- **CLI commands are code-fenced**: `dotnet ef migrations add InitialMigration`, not "dotnet ef migrations add InitialMigration" in prose.
- **Verbatim string prefixes** (`@"…"`) and raw strings (`"""…"""`) stay verbatim in code. Don't normalize.
- **Directive syntax is literal**: `#:package`, `#:property`, `#:sdk`, `#:project` — no space after the colon. Space-after-colon is a trap the exam may test; authors must never write the spaced form even casually.

## What to never generate (Dunlosky 2013 low-utility)

Banned as a primary authoring mode in any lesson, practice, card, or mock-exam. These produce no durable learning and crowd out retrieval:

- **Highlighting / underlining** guidance. Never tell the reader "highlight these key terms." Use cloze deletions or `> **Q:**/**A:**` checkpoints instead.
- **Re-reading** prompts. Never write "re-read section X" or "review the above." Use retrieval prompts ("reconstruct the pipeline from memory, then check") instead.
- **Summarization-as-primary-mode.** Lessons teach, not summarize. Summarization is acceptable only inside `cheat-sheet.md` where the artifact's purpose *is* summary reference.
- **Keyword mnemonics** for conceptual material. No "remember PIPELINE = Preprocess, Ingest, Predict…" devices for ML.NET or Aspire. Acceptable only for genuinely arbitrary lists (none in 4870 scope).
- **Imagery-for-text** ("visualize a kernel floating in a cloud"). Use actual diagrams — Mermaid or inline SVG — not imagery prompts.
- **Emoji, decorative icons, motivational filler** ("great question!", "you've got this!", "fun fact:"). Every sentence earns its place by teaching or testing.
- **First-person anecdotes** ("when I first encountered gRPC…"). The author voice is neutral and declarative.
- **Academic hedging** ("one might argue", "it could be said that"). Teachers assert.

## Compliant vs defect — one example from this course's domain

**Defect** (hedge + first-person + vague + passive):

> In our experience, we've found that it might be beneficial to consider using `GetOrSetAsync` in some situations where caching could potentially be useful. The data is often fetched from the database, and it can be cached so that subsequent requests may be faster.

**Compliant** (declarative + second-person + specific + mechanism-led):

> `GetOrSetAsync` turns cache-aside into one line. It checks Redis for the key; on miss, it runs your fetch delegate, stores the result with your expiration policy, and returns the value. Subsequent requests hit cache in under 1 ms instead of re-querying the database.

The compliant version is shorter, names the mechanism, and teaches a specific claim the reader can verify and apply.
