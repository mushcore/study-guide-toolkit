---
"n": 13
id: 4870-lesson-reading-the-mcq-trap-spotting
title: "Reading the MCQ: trap-spotting"
hook: "Elmasry's MCQ style: 5 options, fake method names, subtle flag swaps. Here's how to filter."
tags:
  - exam-prep
module: Exam prep
---

From the midterm, the distractor patterns are consistent:

1.  **Fake method names** — e.g. `_context.Migrate()` vs `_context.Database.Migrate()`. Always pick the one with the real namespace chain.
2.  **Wrong bracket style** — e.g. `[Route("api/[controller]")]` vs `Route("[api]/[controller]")`. Remember: annotation = square brackets around, placeholder = square brackets inside.
3.  **Command order swap** — e.g. `dotnet ef update database` vs `dotnet ef database update`. The subject comes before the verb.
4.  **Singular vs plural** — `dotnet ef add migration` vs `dotnet ef migrations add`. Collection commands use the plural.
5.  **Fake interface variants** — `SignInManager` vs `RoleManager` vs `AuthManager` (fake) vs `IdentityManager` (fake).

> **Analogy**
>  Treat wrong options like a phishing email. One giveaway (fake namespace, wrong capitalization, missing keyword) is enough to eliminate.

**Match-column strategy (from midterm):** The pattern is *thing → its canonical tool or command*. Examples seen: React → Vite, TypeScript → tsc, Swagger → WebAPI docs, SignalR → Hub, Multi-docker → docker-compose.yml, Single docker → Dockerfile. Expect same pattern on final.

#### MCQ elimination flow — 30 seconds per question

flowchart TD
  Q\[Read question\] --> F{Spot a fake
method name?}
  F -->|yes| X1\[Eliminate\]
  F -->|no| B{Word order or
singular/plural trap?}
  B -->|yes| X2\[Eliminate\]
  B -->|no| C{2+ options left?}
  X1 --> C
  X2 --> C
  C -->|yes| GUESS\[Best guess
MOVE ON\]
  C -->|1 left| PICK\[Pick it\]
      

> **Note**
> **Takeaway —** Eliminate first, guess last. Two clear eliminations on an MCQ = 50% → skipping should be rare.
