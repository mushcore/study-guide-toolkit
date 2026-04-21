---
"n": 9
id: 4911-lesson-reference-summary-rup-big-picture
title: Reference summary — RUP big picture
hook: >-
  Overview only. Covers waterfall-vs-iterative, the four RUP phases, nine workflows, six best practices, and EVMS at a
  high level. For deep study, drill each sub-topic from Topic Deep-Dives individually — the explain-it-back test fails
  when these are mashed together.
tags:
  - process
module: Unified Process & architecture
---

#### The old way: Waterfall

Traditional: do all requirements → do all design → do all implementation → do all testing → deploy. One pass, top to bottom.

**Problem:** you don't discover real issues until testing (near the end). By then, requirements errors from step 1 are baked into every layer. Fixing is expensive. Risk STAYS HIGH until late.

> **Analogy**
> **Analogy:** Building a house by drawing complete blueprints, then constructing everything in one shot, THEN having the client walk through. They hate the kitchen layout. You rebuild walls.

#### The RUP way: iterative

Break the project into **iterations**. Each iteration = a mini-waterfall: requirements → analysis → design → code → test → assess. Usually 2-6 weeks.

After each iteration, you have a working (partial) system. You show it. You learn. Then you plan the next iteration.

**Risk reduces continuously.** Problems found early = cheap to fix.

Risk over time — waterfall vs iterative (01BestPracticesMod / 02rup)

<svg viewBox="0 0 680 260" preserveAspectRatio="xMidYMid meet"><line x1="50" y1="210" x2="670" y2="210" class="arrow-line"></line><line x1="50" y1="30" x2="50" y2="210" class="arrow-line"></line><text x="360" y="235" text-anchor="middle" class="sub">time →</text> <text x="25" y="120" transform="rotate(-90 25 120)" text-anchor="middle" class="sub">risk →</text> <text x="50" y="25" text-anchor="start" class="sub">HIGH</text> <text x="50" y="218" text-anchor="start" class="sub" dx="-6" dy="14">LOW</text> <path d="M 60 50 L 380 55 L 450 150 L 560 195 L 660 200" stroke="#f7768e" fill="none" stroke-width="2.5"></path><circle cx="660" cy="200" r="3" fill="#f7768e"></circle><text x="655" y="70" text-anchor="end" fill="#f7768e" font-size="11">Waterfall — risk stays high, drops only after late testing</text> <path d="M 60 55 Q 140 140 220 120 Q 300 100 360 140 Q 420 175 500 165 Q 570 175 640 195" stroke="#9ece6a" fill="none" stroke-width="2.5"></path><circle cx="640" cy="195" r="3" fill="#9ece6a"></circle><text x="180" y="200" text-anchor="start" fill="#9ece6a" font-size="11">Iterative — each iteration exposes + mitigates risk</text> <g font-size="10" fill="#565f89"><line x1="165" y1="210" x2="165" y2="214" stroke="#565f89"></line><text x="165" y="225" text-anchor="middle">iter 1</text> <line x1="280" y1="210" x2="280" y2="214" stroke="#565f89"></line><text x="280" y="225" text-anchor="middle">iter 2</text> <line x1="395" y1="210" x2="395" y2="214" stroke="#565f89"></line><text x="395" y="225" text-anchor="middle">iter 3</text> <line x1="510" y1="210" x2="510" y2="214" stroke="#565f89"></line><text x="510" y="225" text-anchor="middle">iter 4</text></g></svg>

Waterfall discovers defects at the testing phase — one massive late drop. Iterative discovers defects per iteration in smaller, cheaper increments. Both eventually finish; only the cost curve differs.

#### Four phases of the project

RUP lifecycle — phases, milestones, effort distribution

Inception~10%

Elaboration~30%

Construction~50%

Transition~10%

LCO

LCA

IOC

PR

**LCO** Life-Cycle Objectives · **LCA** Life-Cycle Architecture · **IOC** Initial Operating Capability · **PR** Product Release  
Each phase contains 1-5 iterations. Bar widths show approximate effort % — Elaboration is longest in duration, Construction highest in effort.

| Phase | Milestone | Focus | % effort |
| --- | --- | --- | --- |
| **Inception** | LCO (Life-Cycle Objectives) | Vision, business case, scope, feasibility | ~10% |
| **Elaboration** | LCA (Life-Cycle Architecture) | Architecture baselined, ~80% requirements, major risks mitigated | ~30% |
| **Construction** | IOC (Initial Operating Capability) | Build, integrate, test most functionality | ~50% |
| **Transition** | PR (Product Release) | Deploy, UAT, training, handoff | ~10% |

Each phase contains 1-5 iterations. Phases and iterations are **orthogonal**: iterations happen WITHIN phases.

#### Nine workflows (parallel processes)

1.  Business Modeling
2.  Requirements
3.  Analysis & Design
4.  Implementation
5.  Test
6.  Deployment
7.  Configuration & Change Management
8.  Project Management
9.  Environment

Each workflow runs through ALL phases but with different intensity. The "hump chart" shows this:

-   Requirements hump peaks in Inception + Elaboration
-   Design hump peaks in Elaboration
-   Implementation hump peaks in Construction
-   Test hump peaks in Construction + Transition

Hump chart — workflow effort across phases (ReviewProcess)

<svg viewBox="0 0 680 300" preserveAspectRatio="xMidYMid meet"><line x1="50" y1="240" x2="670" y2="240" class="arrow-line"></line><line x1="205" y1="240" x2="205" y2="40" stroke="#565f89" stroke-width="0.6" stroke-dasharray="2,3"></line><line x1="360" y1="240" x2="360" y2="40" stroke="#565f89" stroke-width="0.6" stroke-dasharray="2,3"></line><line x1="515" y1="240" x2="515" y2="40" stroke="#565f89" stroke-width="0.6" stroke-dasharray="2,3"></line><text x="127" y="258" text-anchor="middle" class="label">Inception</text> <text x="282" y="258" text-anchor="middle" class="label">Elaboration</text> <text x="437" y="258" text-anchor="middle" class="label">Construction</text> <text x="592" y="258" text-anchor="middle" class="label">Transition</text> <text x="25" y="150" transform="rotate(-90 25 150)" text-anchor="middle" class="sub">effort →</text> <path d="M 50 238 Q 127 150 215 235" stroke="#e3af68" fill="none" stroke-width="2"></path><path d="M 90 238 Q 210 95 345 236" stroke="#7aa2f7" fill="none" stroke-width="2"></path><path d="M 160 236 Q 290 55 430 238" stroke="#bb9af7" fill="none" stroke-width="2"></path><path d="M 260 236 Q 437 45 610 236" stroke="#9ece6a" fill="none" stroke-width="2.5"></path><path d="M 330 236 Q 495 70 640 235" stroke="#f7768e" fill="none" stroke-width="2"></path><path d="M 475 238 Q 592 135 660 236" stroke="#7dcfff" fill="none" stroke-width="2"></path><g font-size="11" font-family="sans-serif"><rect x="60" y="275" width="12" height="3" fill="#e3af68"></rect><text x="78" y="279" class="sub">Business Modeling</text> <rect x="190" y="275" width="12" height="3" fill="#7aa2f7"></rect><text x="208" y="279" class="sub">Requirements</text> <rect x="298" y="275" width="12" height="3" fill="#bb9af7"></rect><text x="316" y="279" class="sub">Analysis &amp; Design</text> <rect x="420" y="275" width="12" height="3" fill="#9ece6a"></rect><text x="438" y="279" class="sub">Implementation</text> <rect x="540" y="275" width="12" height="3" fill="#f7768e"></rect><text x="558" y="279" class="sub">Test</text> <rect x="580" y="290" width="12" height="3" fill="#7dcfff"></rect><text x="598" y="294" class="sub">Deployment</text></g></svg>

Each hump = one workflow. Height = effort intensity. Humps peak in different phases but every workflow runs in every phase (no waterfall). Three supporting workflows (Config & Change Mgmt, Project Mgmt, Environment) run flat across all phases and are omitted from the curve chart to reduce clutter.

#### Six best practices (foundation of RUP)

1.  **Develop iteratively** — discover problems early
2.  **Manage requirements** — traceable from capture to test
3.  **Use component-based architectures** — reduce brittleness
4.  **Model visually (UML)** — reduce ambiguity
5.  **Verify quality** — continuous testing
6.  **Control changes** — configuration management

#### Earned Value Management (EVMS) — the project math

Track project health with 3 numbers:

-   **BCWS** (planned value) — budget for work SCHEDULED by this date
-   **BCWP** (earned value) — budget for work ACTUALLY completed
-   **ACWP** — ACTUAL money spent

Derived:

-   **CV = BCWP − ACWP** → cost variance. + = under budget.
-   **SV = BCWP − BCWS** → schedule variance. + = ahead.
-   **CPI = BCWP / ACWP** → cost efficiency. >1 = good.
-   **SPI = BCWP / BCWS** → schedule efficiency. >1 = ahead.
-   **EAC = BAC / CPI** → projected final cost.

> **Takeaway**
> **Takeaway:** 4 phases (IECt with milestones LCO/LCA/IOC/PR), 9 workflows, 6 best practices. Iterative = continuous risk reduction. EVMS uses BCWS/BCWP/ACWP + simple subtraction/division.

> **Q:** BCWS = $100k, BCWP = $80k, ACWP = $90k. Is the project ahead or behind? Under or over budget?
> **A:** SV = 80 − 100 = −20k → BEHIND schedule. CV = 80 − 90 = −10k → OVER budget. Both negative = bad.

> **Q:** During which phase is the architecture baselined?
> **A:** Elaboration. Milestone = LCA (Life-Cycle Architecture). Architecture must be stable before Construction begins, so risks are mitigated.
